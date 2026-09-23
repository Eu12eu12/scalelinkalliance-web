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

          // Attempt WebP compression first
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                const newName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
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
                      const newName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
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
 * 1. Automatically compresses image files on the client.
 * 2. Uses a reasonable network timeout (45 seconds).
 * 3. Handles non-JSON HTTP responses (e.g., 413, 502, 504 HTML error pages) safely without SyntaxError.
 * 4. Extracts human-readable error messages.
 */
export const uploadFilesResilient = async (files, options = {}) => {
  const { timeoutMs = 45000 } = options;
  const fileList = Array.isArray(files) ? files : [files];

  if (!fileList || fileList.length === 0) {
    throw new Error('No files provided for upload.');
  }

  // 1. Optimize images in parallel
  const optimizedFiles = await Promise.all(
    fileList.map((f) => compressImage(f))
  );

  const fd = new FormData();
  optimizedFiles.forEach((f) => fd.append('files', f));

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

  // 3. Safe response parsing (never crashes with SyntaxError on HTML)
  const rawText = await res.text();
  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
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
