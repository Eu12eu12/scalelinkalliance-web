require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// Use real DB-backed CMS to mirror production logic
const db = require('./models');
const cmsRoutes = require('./routes/cms');

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://scalelinkalliance.com',
    'https://www.scalelinkalliance.com'
  ],
  credentials: true
}));

// Stripe Webhook Endpoint (needs raw body parser, so must be defined BEFORE express.json())
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  if (process.env.STRIPE_WEBHOOK_SECRET) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('âš ï¸ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    console.warn('âš ï¸ STRIPE_WEBHOOK_SECRET is not set. Signature verification skipped.');
    try {
      event = JSON.parse(req.body.toString());
    } catch (err) {
      return res.status(400).send(`Invalid JSON body: ${err.message}`);
    }
  }

  // Handle the completed checkout session event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const jobId = session.metadata?.jobId;

    if (jobId) {
      try {
        const job = await db.NoticeBoardJob.findByPk(jobId);
        if (job && job.quoteStatus !== 'deposit_paid') {
          // Parse metadata selectedAddons
          let selectedAddons = [];
          try {
            if (session.metadata && session.metadata.selectedAddons) {
              selectedAddons = JSON.parse(session.metadata.selectedAddons);
            }
          } catch (err) {
            console.error('âŒ Error parsing selectedAddons metadata in webhook:', err);
          }

          const addonsTotal = selectedAddons.reduce((sum, item) => sum + (item.price || 0), 0);
          const baseQuoteAmount = job.customQuoteAmount || 0;
          const newCustomQuoteAmount = baseQuoteAmount + addonsTotal;
          const newProjectFee = Math.max(0, newCustomQuoteAmount - (job.specialDiscount || 0));

          // Update included services string
          let currentIncluded = job.includedServices || '';
          if (selectedAddons.length > 0) {
            const addonLines = selectedAddons.map(a => `âœ“ Upgrade: ${a.name} ($${(a.price / 100).toFixed(2)} USD)`).join('\n');
            currentIncluded = currentIncluded ? `${currentIncluded}\n${addonLines}` : addonLines;
          }

          // Update job fields
          await job.update({
            quoteStatus: 'deposit_paid',
            status: job.status === 'new' ? 'assigned' : job.status,
            customQuoteAmount: newCustomQuoteAmount,
            projectFee: newProjectFee,
            includedServices: currentIncluded
          });

          // Log notice board activity
          await db.NoticeBoardActivity.create({
            jobId: job.id,
            userName: 'System',
            action: 'Deposit Paid',
            details: `Stripe webhook confirmed deposit payment of $${(session.amount_total / 100).toFixed(2)} via Checkout Session: ${session.id}`
          });

          // Notify all Super Admins
          const clientName = `${job.clientFirstName || ''} ${job.clientLastName || ''}`.trim() || 'Client';
          const notificationMsg = `ðŸ’³ [Deposit Paid] Client ${clientName} (${job.client}) paid deposit of $${(session.amount_total / 100).toFixed(2)} for job #${job.id}!`;

          const admins = await db.AdminUser.findAll({ where: { role: 'super_admin' } });
          const { sendNotificationEmail, sendClientPhaseNotificationEmail, sendPaymentInvoiceEmail } = require('./utils/mailer');
          
          for (const admin of admins) {
            await db.NoticeBoardNotification.create({
              sentTo: admin.email,
              type: 'acceptance',
              message: notificationMsg,
              jobId: job.id,
              fromUser: 'client',
              metadata: {
                amount: session.amount_total,
                sessionId: session.id
              },
              isRead: false
            });

            sendNotificationEmail(admin.email, 'comment', notificationMsg, job.id).catch(err => {
              console.error('âŒ Super Admin webhook email notification failed:', err);
            });
          }

          // Notify assigned worker if any
          if (job.assignedTo) {
            await db.NoticeBoardNotification.create({
              sentTo: job.assignedTo,
              type: 'assignment',
              message: `Quote deposit paid! Project "${job.title}" is ready for production.`,
              jobId: job.id,
              fromUser: 'System',
              isRead: false
            });
            sendNotificationEmail(job.assignedTo, 'assignment', `Quote deposit paid! Project is ready for production.`, job.id).catch(err => {
              console.error('âŒ Worker webhook notification failed:', err);
            });
          }

          // Trigger "In Production" email immediately
          sendClientPhaseNotificationEmail(job, 'in_production').catch(err => console.error('âŒ Client webhook production email failed:', err));
        }
      } catch (err) {
        console.error('âŒ Webhook handler error (checkout.session.completed):', err);
        return res.status(500).json({ error: err.message });
      }
    }
  }

  // Handle the expired checkout session event
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object;
    const jobId = session.metadata?.jobId;

    if (jobId) {
      try {
        const job = await db.NoticeBoardJob.findByPk(jobId);
        if (job) {
          // Log notice board activity
          await db.NoticeBoardActivity.create({
            jobId: job.id,
            userName: 'System',
            action: 'Quote Expired',
            details: `Stripe checkout session ${session.id} expired without payment.`
          });

          // Notify all Super Admins
          const notificationMsg = `âš ï¸ [Quote Expired] Stripe payment link for job #${job.id} ("${job.title}") has expired without payment. You may need to re-send the quote.`;

          const admins = await db.AdminUser.findAll({ where: { role: 'super_admin' } });
          const { sendNotificationEmail } = require('./utils/mailer');
          
          for (const admin of admins) {
            await db.NoticeBoardNotification.create({
              sentTo: admin.email,
              type: 'comment',
              message: notificationMsg,
              jobId: job.id,
              fromUser: 'system',
              isRead: false
            });

            sendNotificationEmail(admin.email, 'comment', notificationMsg, job.id).catch(err => {
              console.error('âŒ Super Admin expiration email notification failed:', err);
            });
          }
        }
      } catch (err) {
        console.error('âŒ Webhook handler error (checkout.session.expired):', err);
        return res.status(500).json({ error: err.message });
      }
    }
  }

  res.json({ received: true });
});

// JSON limit set to 25mb â€” enough to handle base64-encoded logos up to ~16MB.
// NOTE: Hostinger's nginx proxy enforces its own body size limits.
// Do NOT raise this beyond 25mb or the proxy will reject requests with 413/503.
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Programmatically manage the uploads directory and symlink
const uploadDir = path.join(__dirname, 'uploads');
const isProduction = process.env.NODE_ENV === 'production';

// Detect Hostinger shared hosting environment path (/home/username/...)
const hostingerMatch = __dirname.match(/^(\/home\/[^\/]+)/);
if (hostingerMatch) {
  const hostingerHomeDir = hostingerMatch[1];
  const persistentUploadDir = path.join(hostingerHomeDir, 'shared_uploads');

  console.log(`â„¹ï¸ Hostinger environment detected. Ensuring persistent uploads dir at: ${persistentUploadDir}`);

  // Create persistent uploads folder if it doesn't exist
  if (!fs.existsSync(persistentUploadDir)) {
    try {
      fs.mkdirSync(persistentUploadDir, { recursive: true });
      console.log('ðŸ“ Created persistent shared_uploads directory:', persistentUploadDir);
    } catch (mkdirErr) {
      console.error('âŒ Failed to create persistent directory:', mkdirErr.message);
    }
  }

  // Ensure persistent subdirectories exist
  ['jobs', 'partner'].forEach(subDir => {
    const subPath = path.join(persistentUploadDir, subDir);
    if (!fs.existsSync(subPath)) {
      try {
        fs.mkdirSync(subPath, { recursive: true });
      } catch (err) {
        console.error(`âŒ Failed to create subdirectory ${subDir}:`, err.message);
      }
    }
  });

  // Handle local app's uploads path
  let shouldCreateSymlink = true;
  if (fs.existsSync(uploadDir)) {
    try {
      const stats = fs.lstatSync(uploadDir);
      if (stats.isSymbolicLink()) {
        const target = fs.readlinkSync(uploadDir);
        if (target === persistentUploadDir) {
          console.log('ðŸ”— Verified existing symlink: uploads ->', persistentUploadDir);
          shouldCreateSymlink = false;
        } else {
          fs.unlinkSync(uploadDir);
          console.log('ðŸ—‘ï¸ Removed outdated symlink.');
        }
      } else if (stats.isDirectory()) {
        // Physical directory extracted from zip or created previously - remove with rmSync
        fs.rmSync(uploadDir, { recursive: true, force: true });
        console.log('ðŸ—‘ï¸ Removed physical uploads folder to prepare for symlink.');
      }
    } catch (cleanupErr) {
      console.warn('âš ï¸ Could not remove physical uploads folder:', cleanupErr.message);
    }
  }

  // Create the symbolic link
  if (shouldCreateSymlink && !fs.existsSync(uploadDir)) {
    try {
      fs.symlinkSync(persistentUploadDir, uploadDir, 'dir');
      console.log('ðŸ”— Programmatic symlink created: uploads ->', persistentUploadDir);
    } catch (symlinkErr) {
      console.error('âŒ Programmatic symlinking failed:', symlinkErr.message);
      // Fallback: create physical directory if symlinking failed
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  }
} else {
  // Local development / fallback
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('ðŸ“ Created local uploads directory:', uploadDir);
  }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + ext);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Archives
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-tar',
    'application/gzip',
    // Text
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/json',
    'application/xml',
    // Video
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm',
    // Audio
    'audio/mpeg', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/flac'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not supported`), false);
  }
};

// Configure multer with limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB per file
    files: 20
  }
}).array('files', 20);

// Custom error handler for multer
const handleMulterUpload = (req, res) => {
  return new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            reject({ status: 413, message: 'File too large. Maximum size is 100MB per file.' });
          } else if (err.code === 'LIMIT_FILE_COUNT') {
            reject({ status: 413, message: 'Too many files. Maximum is 20 files.' });
          } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            reject({ status: 400, message: 'Unexpected field name. Use "files" field.' });
          } else {
            reject({ status: 400, message: err.message });
          }
        } else {
          reject({ status: 400, message: err.message });
        }
      }
      resolve(req);
    });
  });
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// API ROUTES
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uploadsDir: uploadDir,
    maxFileSize: '100MB',
    maxTotalSize: '500MB',
    maxFiles: 20
  });
});

// CMS Endpoints
app.use('/api/cms', cmsRoutes);
app.use('/api/cms/notifications', require('./routes/notifications'));
app.use('/api/public', require('./routes/public'));
app.use('/api/portal', require('./routes/clientPortal'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/reviews', require('./routes/reviews'));

// File upload endpoint
app.post('/api/upload-files', async (req, res) => {
  try {
    console.log('ðŸ“¤ Received file upload request');
    
    await handleMulterUpload(req, res);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    console.log(`âœ… Successfully uploaded ${req.files.length} files`);

    const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
    const maxTotalSize = 500 * 1024 * 1024;

    if (totalSize > maxTotalSize) {
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        }
      });
      return res.status(413).json({ error: 'Total file size exceeds 500MB limit' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrls = req.files.map(file => ({
      filename: file.originalname,
      url: `${baseUrl}/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
      id: crypto.randomBytes(8).toString('hex')
    }));

    fileUrls.forEach((file, index) => {
      console.log(`  ðŸ“„ File ${index + 1}: ${file.filename} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    });

    res.status(200).json({
      success: true,
      message: `Successfully uploaded ${req.files.length} files`,
      fileUrls: fileUrls,
      totalSize: totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2)
    });

  } catch (error) {
    console.error('âŒ Upload error:', error);
    
    if (req.files) {
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        }
      });
    }

    const status = error.status || 500;
    const message = error.message || 'Internal server error during file upload';
    res.status(status).json({ error: message });
  }
});

// Create payment intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, services, customer_email, metadata } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!currency) {
      return res.status(400).json({ error: 'Currency is required' });
    }

    // Important: Stripe requires currency to be lowercase
    const normalizedCurrency = currency.toLowerCase();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: normalizedCurrency,  // â† The fix
      automatic_payment_methods: { enabled: true },
      receipt_email: customer_email,
      metadata: {
        services: JSON.stringify(services),
        customer_name: `${metadata?.firstName || ''} ${metadata?.lastName || ''}`.trim(),
        company: metadata?.company || '',
        project_description: metadata?.projectDescription?.substring(0, 500) || '',
        file_count: metadata?.fileCount || '0',
      }
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });
  } catch (error) {
    console.error('âŒ Stripe error:', error);
    res.status(500).json({ 
      error: error.message,
      type: error.type 
    });
  }
});

// Create Checkout Session endpoint (hosted Stripe Checkout redirect flow)
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { services, currency, amount, customer_email, success_url, cancel_url } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (!currency) {
      return res.status(400).json({ error: 'Currency is required' });
    }
    if (!success_url || !cancel_url) {
      return res.status(400).json({ error: 'success_url and cancel_url are required' });
    }

    const normalizedCurrency = currency.toLowerCase();
    const serviceNames = services && typeof services === 'object' ? Object.keys(services) : [];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: normalizedCurrency,
          product_data: {
            name: 'ScaleLink Alliance â€” Service Request',
            description: serviceNames.length > 0 ? serviceNames.join(', ').substring(0, 500) : 'Custom service request',
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      customer_email: customer_email || undefined,
      success_url,
      cancel_url,
      metadata: {
        services: JSON.stringify(services || {}).substring(0, 500),
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('âŒ Stripe Checkout Session error:', error);
    res.status(500).json({
      error: error.message,
      type: error.type
    });
  }
});

// Verify Checkout Session endpoint (called after redirect back from Stripe)
app.get('/api/verify-checkout-session', async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    res.json({
      paid: session.payment_status === 'paid',
      email: session.customer_details?.email || session.customer_email || null,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    console.error('âŒ Stripe verify session error:', error);
    res.status(500).json({
      error: error.message,
      type: error.type
    });
  }
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// STATIC FILES
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Serve React frontend build
const frontendDistPath = fs.existsSync(path.join(__dirname, 'dist'))
  ? path.join(__dirname, 'dist')
  : path.join(__dirname, 'Frontend/dist');

app.use(express.static(frontendDistPath));

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ERROR HANDLING
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Global error handler
app.use((err, req, res, next) => {
  console.error('âŒ Global error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Open Graph & Social Media Preview Metadata Injection for /resources/:slug
function escapeHtml(text) {
  if (!text) return '';
  return text
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.get('/resources/:slug', async (req, res, next) => {
  const { slug } = req.params;
  const indexPath = path.join(frontendDistPath, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    return next();
  }

  try {
    const isNumericId = /^\d+$/.test(slug);
    const whereCondition = isNumericId
      ? { [db.Sequelize.Op.or]: [{ slug }, { id: parseInt(slug, 10) }] }
      : { slug };

    const resource = await db.Resource.findOne({
      where: {
        ...whereCondition,
        status: 'published'
      }
    });

    if (!resource) {
      return res.sendFile(indexPath);
    }

    let html = fs.readFileSync(indexPath, 'utf8');

    const canonicalUrl = `https://scalelinkalliance.com/resources/${resource.slug || slug}`;
    const pageTitle = `${escapeHtml(resource.title)} | Scale Link Alliance`;
    const description = escapeHtml(resource.plainTextSnippet || 'Discover insights, guides, and strategic resources from Scale Link Alliance.');
    const imageUrl = escapeHtml(resource.imageUrl ? resource.imageUrl.split('#')[0] : 'https://scalelinkalliance.com/logo.png');

    const metaTags = `
    <title>${pageTitle}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonicalUrl}">
    <!-- Open Graph / Facebook / LinkedIn / WhatsApp -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Scale Link Alliance">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${escapeHtml(resource.title)}",
      "description": "${description}",
      "image": "${imageUrl}",
      "author": {
        "@type": "Organization",
        "name": "${escapeHtml(resource.author || 'Scale Link Alliance')}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Scale Link Alliance",
        "logo": {
          "@type": "ImageObject",
          "url": "https://scalelinkalliance.com/logo.png"
        }
      },
      "datePublished": "${resource.publishedDate || resource.createdAt}"
    }
    </script>
    `;

    html = html.replace(/<title>.*?<\/title>/i, '');
    html = html.replace('</head>', `${metaTags}\n</head>`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (err) {
    console.error('Error injecting resource metadata:', err);
    return res.sendFile(indexPath);
  }
});

// Catch-all: serve React app for any non-API route (must be last)
// Note: Express 5 requires named wildcard params (/path-to-regexp v8)
app.get('/*path', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// START SERVER
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PORT = process.env.PORT || 3001;

// Sync database and then start server
const startServer = async () => {
  // Run custom migrations first (essential for MySQL in production where alter: true is disabled)
  try {
    const migrate = require('./scripts/migrate.js');
    await migrate();
    console.log('âœ… Production custom database migration completed.');
  } catch (migErr) {
    console.error('âš ï¸ Production custom database migration failed or skipped:', migErr.message);
  }

  // Phase 1: Try sync with schema alteration (adds/modifies columns safely)
  try {
    if (db.sequelize.options.dialect === 'sqlite') {
      await db.sequelize.query('PRAGMA foreign_keys = OFF');
    }
    const isMySQL = db.sequelize.options.dialect === 'mysql';
    await db.sequelize.sync();
    if (db.sequelize.options.dialect === 'sqlite') {
      await db.sequelize.query('PRAGMA foreign_keys = ON');
    }
    console.log('âœ… Database synced successfully (alter mode)');
  } catch (alterErr) {
    // Phase 2 fallback: alter failed (e.g. MySQL column lock/permission issue).
    // Try a safe no-op sync that only creates missing tables, never drops or alters.
    console.warn('âš ï¸  Database alter-sync failed, falling back to safe sync:', alterErr.message);
    try {
      await db.sequelize.sync();
      console.log('âœ… Database synced successfully (safe mode â€” no schema alterations)');
    } catch (syncErr) {
      // Phase 3: Even basic sync failed. Log and continue â€” the server must stay up.
      // Existing tables will still work; only missing tables will cause errors.
      console.error('âŒ Database sync failed entirely. Server starting anyway:', syncErr.message);
    }
  }


  // Always start the HTTP server regardless of DB sync outcome.
  // A running server that returns 500 on DB errors is far better than a 503.
  app.listen(PORT, () => {
    console.log(`ðŸš€ Server running on http://localhost:${PORT} [v1.0.2-STABLE]`);
    console.log(`ðŸ“ API endpoints:`);
    console.log(`   - GET  /api/health`);
    console.log(`   - POST /api/upload-files`);
    console.log(`   - POST /api/create-payment-intent`);
    console.log(`   - POST /api/create-checkout-session`);
    console.log(`   - GET  /api/verify-checkout-session`);
    console.log(`   - ANY  /api/cms/* (Authentication, Typed Resources, Features)`);
    console.log(`ðŸ“ Upload directory: ${uploadDir}`);
    console.log(`ðŸ“ Max file size: 100MB per file (multer streamed â€” not JSON buffered)`);
    console.log(`ðŸ“ Max JSON body: 25MB`);
    console.log(`ðŸ“ Max files: 20\n`);
  });
};

startServer();