/**
 * Sanitizes file names to pass Web Application Firewalls (e.g. ModSecurity / Imunify360 / Cloudflare).
 * Strips single/double quotes, apostrophes, and unusual symbols that trigger SQLi / XSS false positives.
 */
export const sanitizeFileName = (name) => {
  if (!name) return `upload_${Date.now()}`;
  const dotIndex = name.lastIndexOf('.');
  const ext = dotIndex !== -1 ? name.substring(dotIndex) : '';
  const base = dotIndex !== -1 ? name.substring(0, dotIndex) : name;

  const cleanBase = base
    .replace(/['"`]/g, '')        // Strip single and double quotes (e.g. "isn't" -> "isnt")
    .replace(/[^\w\s-]/g, '')     // Strip special symbols
    .trim()
    .replace(/\s+/g, '_')         // Convert whitespace to underscores
    .slice(0, 80);                // Limit length

  const cleanExt = ext.replace(/[^a-zA-Z0-9.]/g, '').toLowerCase();
  return (cleanBase || `upload_${Date.now()}`) + cleanExt;
};

/**
 * Client-side image compression & optimization utility.
 * Resizes large photos to optimal web dimensions and converts to lightweight WebP/JPEG,
 * reducing multi-megabyte payloads by 90-95% before uploading over the network.
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    minSizeToCompress = 200 * 1024 // Only compress files > 200KB
  } = options;

  // Don't compress non-images, vector SVGs, or animated GIFs
  if (!file || !file.type || !file.type.startsWith('image/')) {
    return file;
  }
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }
  if (file.size <= minSizeToCompress) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(url);
        try {
          let { width, height } = img;

          // If dimensions are within bounds and file isn't huge, return original
          if (width <= maxWidth && height <= maxHeight && file.size < 500 * 1024) {
            return resolve(file);
          }

          // Calculate aspect-ratio preserved dimensions
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            return resolve(file);
          }

          // Use high-quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Always ensure safe sanitized filename
          const safeBaseName = sanitizeFileName(file.name).replace(/\.[^/.]+$/, '');

          // Attempt WebP compression first
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                const newName = `${safeBaseName}.webp`;
                const compressedFile = new File([blob], newName, {
                  type: 'image/webp',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                // If WebP produced larger or failed, try JPEG
                canvas.toBlob(
                  (jpegBlob) => {
                    if (jpegBlob && jpegBlob.size < file.size) {
                      const newName = `${safeBaseName}.jpg`;
                      const compressedFile = new File([jpegBlob], newName, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                      });
                      resolve(compressedFile);
                    } else {
                      resolve(file);
                    }
                  },
                  'image/jpeg',
                  quality
                );
              }
            },
            'image/webp',
            quality
          );
        } catch (canvasErr) {
          console.warn('[imageCompressor] Canvas compression failed, using original file:', canvasErr);
          resolve(file);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };

      img.src = url;
    } catch (err) {
      console.warn('[imageCompressor] Failed to initialize image compression:', err);
      resolve(file);
    }
  });
};

/**
 * Resilient file upload helper that:
 * 1. Sanitizes all file names (eliminating ModSecurity WAF 403 blocks from quotes/apostrophes).
 * 2. Automatically compresses image files on the client.
 * 3. Uses a reasonable network timeout (45 seconds).
 * 4. Handles non-JSON HTTP responses (e.g., 403, 413, 502, 504 HTML error pages) safely without SyntaxError.
 * 5. Extracts human-readable error messages.
 */
export const uploadFilesResilient = async (files, options = {}) => {
  const { timeoutMs = 45000 } = options;
  const fileList = Array.isArray(files) ? files : [files];

  if (!fileList || fileList.length === 0) {
    throw new Error('No files provided for upload.');
  }

  // 1. Optimize images in parallel
  const processedFiles = await Promise.all(
    fileList.map((f) => compressImage(f))
  );

  const fd = new FormData();
  processedFiles.forEach((f) => {
    // Ensure EVERY file (compressed, original, SVG, or document) has a sanitized filename
    const cleanName = sanitizeFileName(f.name);
    const safeFile = (f.name === cleanName)
      ? f
      : new File([f], cleanName, { type: f.type, lastModified: f.lastModified });
    fd.append('files', safeFile);
  });

  // 2. AbortController for network timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch('/api/upload-files', {
      method: 'POST',
      body: fd,
      signal: controller.signal
    });
  } catch (netErr) {
    if (netErr.name === 'AbortError') {
      throw new Error('Upload timed out. The transfer took too long. Please check your network connection.');
    }
    throw new Error('A network connection error occurred while uploading. Please check your internet connection.');
  } finally {
    clearTimeout(timeoutId);
  }

  // 3. Safe response parsing (never crashes with SyntaxError on HTML error pages)
  const rawText = await res.text();
  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    if (res.status === 403) {
      throw new Error('Upload blocked by server firewall (HTTP 403). Please rename the file and retry.');
    }
    if (res.status === 413) {
      throw new Error('File exceeds the server maximum upload limit.');
    }
    if (res.status === 504) {
      throw new Error('Server gateway timed out while saving the file. Please retry.');
    }
    if (res.status === 502 || res.status === 503) {
      throw new Error('Server is temporarily unavailable. Please retry in a moment.');
    }
    throw new Error(`Upload failed (HTTP ${res.status}). Server returned an unexpected response.`);
  }

  if (!res.ok) {
    throw new Error(data.error || `Upload failed with HTTP status ${res.status}.`);
  }

  if (!data.fileUrls || data.fileUrls.length === 0) {
    throw new Error('Server received the upload but did not return any file URLs.');
  }

  return data.fileUrls;
};
