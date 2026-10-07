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

// Trust Hostinger / reverse proxy headers for HTTPS & real client IP
app.set('trust proxy', 1);

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
    'image/avif', 'image/heic', 'image/heif', 'image/pjpeg', 'image/x-png',
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

    const protocol = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : req.protocol);
    const baseUrl = `${protocol}://${req.get('host')}`;
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

// ────────────────────────────────────────────────────────────
// SEO & METADATA PRE-RENDERING ENGINE
// ────────────────────────────────────────────────────────────

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

// ─── 301 PERMANENT REDIRECTS ───
app.get(['/scale-existing', '/scale-existing/'], (req, res) => {
  return res.redirect(301, '/scale-existing-website');
});

// ─── LEGACY ROUTE CRAWLER PROTECTION ───
app.use(['/chapters', '/become-director', '/memberships'], (req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
});

// ─── SEO ROUTE METADATA REGISTRY ───
const SEO_REGISTRY = {
  '/': {
    title: 'ScaleLink Alliance | Done-For-You Business Systems & Digital Growth',
    description: 'ScaleLink Alliance is a done-for-you digital growth partner providing high-performance website development, digital marketing, CRM automation, and dedicated technical support under one accountable team.',
    canonical: 'https://www.scalelinkalliance.com/',
    h1: 'Build Better Systems. Attract More Customers. Grow With One Team.',
    summary: 'ScaleLink Alliance helps businesses build and improve the digital systems behind growth — websites, lead generation, CRM, automation, marketing and ongoing technical support under one professional relationship.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      'name': 'ScaleLink Alliance',
      'url': 'https://www.scalelinkalliance.com',
      'logo': 'https://www.scalelinkalliance.com/favicon.png',
      'image': 'https://www.scalelinkalliance.com/hero-bg.jpg',
      'description': 'Done-for-you digital growth partner providing website development, marketing, automation, and ongoing support under one accountable team.',
      'areaServed': 'Worldwide',
      'sameAs': [
        'https://www.linkedin.com/company/scalelink-alliance',
        'https://x.com/ScaleLinkA',
        'https://www.instagram.com/scale.link.alliance/'
      ]
    }
  },
  '/about': {
    title: 'About ScaleLink Alliance | Done-For-You Business Systems & Digital Services',
    description: 'Discover why ScaleLink Alliance was built: bringing website development, digital marketing, CRM automation, and technical operations under one accountable leadership team.',
    canonical: 'https://www.scalelinkalliance.com/about',
    h1: 'Why We Built ScaleLink Alliance',
    summary: 'Growing a business today is harder than ever not because of a lack of tools, but because there are too many disconnected pieces. ScaleLink Alliance eliminates that chaos under one accountable team.'
  },
  '/how-it-works': {
    title: 'How It Works | ScaleLink Alliance - Done-For-You Business Systems',
    description: 'Understand our fixed-milestone execution model: discovery, audit, architecture, development, QA launch, and dedicated monthly systems maintenance with transparent pricing.',
    canonical: 'https://www.scalelinkalliance.com/how-it-works',
    h1: 'How We Build & Scale Your Digital Systems',
    summary: 'From initial audit to complete deployment and ongoing operations, explore the step-by-step process of working with ScaleLink Alliance.'
  },
  '/build-from-scratch': {
    title: 'Build a Website From Scratch | Custom Web Development | ScaleLink Alliance',
    description: 'Launch a high-converting, modern digital platform built from the ground up with custom design, mobile responsiveness, SEO foundations, and automated lead capture.',
    canonical: 'https://www.scalelinkalliance.com/build-from-scratch',
    h1: 'Build a High-Converting Website From Scratch',
    summary: 'Launch a bespoke website tailored to your business goals with custom architecture, modern design standards, and built-in conversion pathways.'
  },
  '/scale-existing-website': {
    title: 'Scale Your Existing Website | Performance & Modernization | ScaleLink Alliance',
    description: 'Improve an existing website that is underperforming, slow, outdated, or failing to convert traffic with technical performance upgrades, conversion redesigns, and CRM integrations.',
    canonical: 'https://www.scalelinkalliance.com/scale-existing-website',
    h1: 'Scale & Modernize What You Already Have',
    summary: 'Transform your current website into a high-performance customer acquisition engine with performance tuning, UX overhauls, and CRM integrations.'
  },
  '/services': {
    title: 'Business Growth & Digital Services | ScaleLink Alliance',
    description: 'Explore full done-for-you services across website development, SEO, paid ads, lead generation, CRM automation, API integrations, web apps, copywriting, and design.',
    canonical: 'https://www.scalelinkalliance.com/services',
    h1: 'All Digital Growth & Technical Services',
    summary: 'Professional done-for-you digital services delivered by specialists under one accountable team.'
  },
  '/services/guide-by-problem': {
    title: 'Find Services by Business Problem | ScaleLink Alliance',
    description: 'Identify the exact digital systems and services your business needs based on your current growth bottlenecks and operational challenges.',
    canonical: 'https://www.scalelinkalliance.com/services/guide-by-problem',
    h1: 'Start With Your Business Problem',
    summary: 'Match your specific business growth bottleneck with the right digital system and specialized service solution.'
  },
  '/services/website-development': {
    title: 'Website Development Services | ScaleLink Alliance',
    description: 'High-converting, responsive websites built with modern frameworks, fast load speeds, SEO optimization, and clean conversion pathways.',
    canonical: 'https://www.scalelinkalliance.com/services/website-development',
    h1: 'Custom Website Development Services',
    summary: 'Fast, secure, responsive websites built to turn visitors into qualified customers.'
  },
  '/services/seo': {
    title: 'SEO & Search Engine Visibility | ScaleLink Alliance',
    description: 'Comprehensive technical SEO, on-page optimization, keyword architecture, and content strategies to rank higher and attract organic buyers.',
    canonical: 'https://www.scalelinkalliance.com/services/seo',
    h1: 'Search Engine Optimization & Visibility',
    summary: 'Attract high-intent organic traffic with technical site architecture, keyword targeting, and authority content.'
  },
  '/services/lead-generation': {
    title: 'B2B Lead Generation & Outbound Systems | ScaleLink Alliance',
    description: 'Automated lead generation, outbound qualification systems, and targeted customer acquisition funnels for sustainable growth.',
    canonical: 'https://www.scalelinkalliance.com/services/lead-generation',
    h1: 'B2B Lead Generation & Outbound Pipelines',
    summary: 'Fill your sales pipeline with verified prospects, personalized outbound outreach, and automated qualification.'
  },
  '/services/paid-advertising': {
    title: 'Paid Advertising Management (Google & Meta Ads) | ScaleLink Alliance',
    description: 'Data-driven Google Search, Display, and Meta advertising campaigns structured for high return on ad spend (ROAS) and qualified client acquisition.',
    canonical: 'https://www.scalelinkalliance.com/services/paid-advertising',
    h1: 'Targeted Paid Advertising Management',
    summary: 'Acquire qualified leads profitably across Google Ads, Meta Ads, and multi-channel retargeting.'
  },
  '/services/landing-pages': {
    title: 'High-Converting Landing Page Design | ScaleLink Alliance',
    description: 'Dedicated landing pages crafted with persuasive copywriting, clean UX hierarchy, and rigorous conversion rate optimization.',
    canonical: 'https://www.scalelinkalliance.com/services/landing-pages',
    h1: 'High-Converting Landing Page Design',
    summary: 'Turn ad clicks into customers with high-performance landing pages tested for conversion.'
  },
  '/services/crm-marketing-automation': {
    title: 'CRM & Marketing Automation Services | ScaleLink Alliance',
    description: 'End-to-end CRM implementation, email nurturing sequences, lead pipeline tracking, and automated customer follow-up systems.',
    canonical: 'https://www.scalelinkalliance.com/services/crm-marketing-automation',
    h1: 'CRM Setup & Marketing Automation',
    summary: 'Never lose a lead with automated nurturing workflows, pipeline tracking, and instant notifications.'
  },
  '/services/api-integration': {
    title: 'API Integration & Custom Webhooks | ScaleLink Alliance',
    description: 'Connect your CRM, payment gateways, marketing tools, and internal software into synchronized, reliable automated workflows.',
    canonical: 'https://www.scalelinkalliance.com/services/api-integration',
    h1: 'API Integrations & Custom Webhooks',
    summary: 'Eliminate manual data entry by connecting software tools into unified, reliable business workflows.'
  },
  '/services/web-app-development': {
    title: 'Custom Web Application Development | ScaleLink Alliance',
    description: 'Scalable custom web apps, client portals, SaaS MVPs, and internal business dashboards built with robust, modern technology.',
    canonical: 'https://www.scalelinkalliance.com/services/web-app-development',
    h1: 'Custom Web Applications & Portals',
    summary: 'Powerful web applications, dashboards, and client portals built to scale your business operations.'
  },
  '/services/content-copywriting': {
    title: 'Strategic Copywriting & Content Marketing | ScaleLink Alliance',
    description: 'Persuasive sales copywriting, authority blog articles, email campaigns, and brand messaging that turns traffic into paying clients.',
    canonical: 'https://www.scalelinkalliance.com/services/content-copywriting',
    h1: 'Strategic Copywriting & Content Marketing',
    summary: 'Engage and persuade your audience with high-impact sales copy and strategic marketing content.'
  },
  '/services/graphic-design': {
    title: 'Professional Graphic Design Services | ScaleLink Alliance',
    description: 'Modern marketing collateral, digital ads, social media graphics, presentations, and sales deck design aligned with your brand.',
    canonical: 'https://www.scalelinkalliance.com/services/graphic-design',
    h1: 'Professional Graphic Design Collateral',
    summary: 'Elevate your brand with clean, high-impact visuals across marketing channels and sales decks.'
  },
  '/services/brand-identity': {
    title: 'Brand Identity & Logo Design | ScaleLink Alliance',
    description: 'Complete brand identity systems, typography guidelines, color palettes, logo suites, and comprehensive style kits.',
    canonical: 'https://www.scalelinkalliance.com/services/brand-identity',
    h1: 'Brand Identity & Visual Design Systems',
    summary: 'Build lasting authority with a cohesive brand identity, logo design, and brand style guidelines.'
  },
  '/services/video-editing': {
    title: 'Video Editing & Motion Graphics | ScaleLink Alliance',
    description: 'Short-form reels, promotional product videos, client video testimonials, and YouTube video editing with high engagement retention.',
    canonical: 'https://www.scalelinkalliance.com/services/video-editing',
    h1: 'High-Retention Video Editing & Motion Graphics',
    summary: 'Engage audiences and drive conversions with professional video editing tailored for social platforms and websites.'
  },
  '/services/photography': {
    title: 'Commercial Photography & Product Imagery | ScaleLink Alliance',
    description: 'High-resolution commercial photography, product shoot direction, and custom photo asset editing for digital platforms.',
    canonical: 'https://www.scalelinkalliance.com/services/photography',
    h1: 'Commercial Photography & Visual Direction',
    summary: 'High-resolution imagery that showcases your products, spaces, and leadership team with authority.'
  },
  '/services/virtual-assistant': {
    title: 'Dedicated Virtual Assistant & Technical Support | ScaleLink Alliance',
    description: 'Trained technical and administrative virtual assistants for operational support, customer inbox management, data entry, and CRM tasks.',
    canonical: 'https://www.scalelinkalliance.com/services/virtual-assistant',
    h1: 'Dedicated Virtual Assistants & Operations Support',
    summary: 'Delegate routine tasks, client communications, and admin workflows to trained specialists.'
  },
  '/free-website-review': {
    title: 'Free Website & Systems Review | ScaleLink Alliance',
    description: 'Get a free, actionable professional review of your website performance, SEO health, conversion pathways, and customer acquisition bottlenecks.',
    canonical: 'https://www.scalelinkalliance.com/free-website-review',
    h1: 'Free Website & Business Systems Review',
    summary: 'Request a comprehensive, zero-obligation technical and conversion review of your current business website.'
  },
  '/business-partners': {
    title: 'Business Growth Partner Network | ScaleLink Alliance',
    description: 'Explore verified business partners, strategic collaborations, qualified referrals, and reciprocal growth opportunities within the ScaleLink Alliance network.',
    canonical: 'https://www.scalelinkalliance.com/business-partners',
    h1: 'Business Growth Partner Network',
    summary: 'Strategic relationships that create opportunities and professional services that help businesses execute on those opportunities.'
  },
  '/resources': {
    title: 'Business Growth & Digital Marketing Resources | ScaleLink Alliance',
    description: 'Actionable guides, strategic frameworks, benchmarks, and deep-dives for business leaders building sustainable digital growth systems.',
    canonical: 'https://www.scalelinkalliance.com/resources',
    h1: 'Strategic Resources & Business Insights',
    summary: 'Guides, insights, and frameworks designed to help entrepreneurs and business leaders scale their organizations.'
  },
  '/faq': {
    title: 'Frequently Asked Questions | Services, Pricing & Process | ScaleLink Alliance',
    description: 'Find answers to common questions about ScaleLink Alliance services, fixed milestones, pricing models, timelines, ongoing support, and project delivery.',
    canonical: 'https://www.scalelinkalliance.com/faq',
    h1: 'Frequently Asked Questions',
    summary: 'Everything you need to know about working with ScaleLink Alliance, our service scope, pricing, and execution milestones.'
  },
  '/contact': {
    title: 'Contact ScaleLink Alliance | Speak With Our Team',
    description: 'Get in touch with ScaleLink Alliance to discuss your website, digital marketing, CRM automation, or custom systems development needs.',
    canonical: 'https://www.scalelinkalliance.com/contact',
    h1: 'Speak With Our Team',
    summary: 'Connect with a growth specialist to scope your project, request a quote, or explore ongoing technical partnerships.'
  },
  '/legal': {
    title: 'Legal, Privacy Policy & Terms of Service | ScaleLink Alliance',
    description: 'Review the privacy policy, terms of service, and compliance policies for ScaleLink Alliance.',
    canonical: 'https://www.scalelinkalliance.com/legal',
    h1: 'Legal Policies & Terms of Service',
    summary: 'Privacy policy, terms and conditions, and governance standards for ScaleLink Alliance.'
  }
};

// ─── UNIVERSAL HTML PRE-RENDER HELPER ───
function renderSeoPage(req, res, pageConfig) {
  const indexPath = path.join(frontendDistPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(500).send('Frontend build not found');
  }

  let html = fs.readFileSync(indexPath, 'utf8');

  const pageTitle = escapeHtml(pageConfig.title || 'ScaleLink Alliance | Done-For-You Business Systems & Digital Growth');
  const description = escapeHtml(pageConfig.description || 'ScaleLink Alliance is a done-for-you digital growth partner providing high-performance website development, digital marketing, CRM automation, and dedicated technical support.');
  const canonicalUrl = pageConfig.canonical || `https://www.scalelinkalliance.com${req.path}`;
  const imageUrl = pageConfig.image || 'https://www.scalelinkalliance.com/hero-bg.jpg';
  const ogType = pageConfig.ogType || 'website';

  const metaTags = `
    <title>${pageTitle}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <!-- Open Graph / Social Media -->
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="ScaleLink Alliance" />
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageTitle}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    ${pageConfig.schema ? `<script type="application/ld+json">\n${JSON.stringify(pageConfig.schema, null, 2)}\n</script>` : ''}
  `;

  // Strip fallback/baseline meta in index.html to avoid duplicate tags
  html = html.replace(/<title>.*?<\/title>/gi, '');
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/gi, '');
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:[^"']*["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi, '');

  html = html.replace('</head>', `${metaTags}\n</head>`);

  // Inject semantic crawlable HTML fallback so non-JS web crawlers extract full text lines
  if (pageConfig.h1 || pageConfig.summary) {
    const semanticBlock = `
    <noscript data-crawler-prerender="true">
      <div style="font-family:system-ui,-apple-system,sans-serif;padding:2rem;max-width:850px;margin:0 auto;line-height:1.6;color:#1e293b;">
        <h1>${escapeHtml(pageConfig.h1 || pageTitle)}</h1>
        <p>${escapeHtml(pageConfig.summary || description)}</p>
        <p><a href="/">Home</a> | <a href="/services">Services</a> | <a href="/build-from-scratch">Build From Scratch</a> | <a href="/scale-existing-website">Scale Existing</a> | <a href="/about">About Us</a> | <a href="/contact">Contact</a></p>
      </div>
    </noscript>`;
    html = html.replace('<div id="root"></div>', `<div id="root"></div>\n${semanticBlock}`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(html);
}

// ─── DYNAMIC SITEMAP.XML ───
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://www.scalelinkalliance.com';
    const today = new Date().toISOString().split('T')[0];

    const staticUrls = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
      { loc: `${baseUrl}/how-it-works`, priority: '0.85', changefreq: 'monthly' },
      { loc: `${baseUrl}/build-from-scratch`, priority: '0.90', changefreq: 'monthly' },
      { loc: `${baseUrl}/scale-existing-website`, priority: '0.90', changefreq: 'monthly' },
      { loc: `${baseUrl}/services`, priority: '0.90', changefreq: 'weekly' },
      { loc: `${baseUrl}/services/guide-by-problem`, priority: '0.80', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/website-development`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/seo`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/lead-generation`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/paid-advertising`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/landing-pages`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/crm-marketing-automation`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/api-integration`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/web-app-development`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/content-copywriting`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/graphic-design`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/brand-identity`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/video-editing`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/photography`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/services/virtual-assistant`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/free-website-review`, priority: '0.85', changefreq: 'monthly' },
      { loc: `${baseUrl}/business-partners`, priority: '0.80', changefreq: 'weekly' },
      { loc: `${baseUrl}/about`, priority: '0.80', changefreq: 'monthly' },
      { loc: `${baseUrl}/resources`, priority: '0.80', changefreq: 'weekly' },
      { loc: `${baseUrl}/faq`, priority: '0.70', changefreq: 'monthly' },
      { loc: `${baseUrl}/contact`, priority: '0.80', changefreq: 'monthly' },
      { loc: `${baseUrl}/legal`, priority: '0.40', changefreq: 'yearly' }
    ];

    let dynamicUrls = [];
    try {
      const resources = await db.Resource.findAll({
        where: { status: 'published' },
        attributes: ['slug', 'updatedAt', 'publishedDate']
      });
      dynamicUrls = resources.map(r => ({
        loc: `${baseUrl}/resources/${r.slug}`,
        lastmod: r.updatedAt ? new Date(r.updatedAt).toISOString().split('T')[0] : (r.publishedDate || today),
        priority: '0.70',
        changefreq: 'monthly'
      }));
    } catch (dbErr) {
      console.warn('Could not query resources for sitemap:', dbErr.message);
    }

    const allUrls = [...staticUrls, ...dynamicUrls];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const item of allUrls) {
      xml += `  <url>\n    <loc>${item.loc}</loc>\n    <lastmod>${item.lastmod || today}</lastmod>\n    <changefreq>${item.changefreq || 'monthly'}</changefreq>\n    <priority>${item.priority || '0.7'}</priority>\n  </url>\n`;
    }
    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.send(xml);
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
    return res.sendFile(path.join(frontendDistPath, 'sitemap.xml'));
  }
});

// ─── ROUTE: /resources/:slug DYNAMIC INJECTION ───
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

    return renderSeoPage(req, res, {
      title: `${resource.title} | ScaleLink Alliance`,
      description: resource.plainTextSnippet || 'Discover insights, guides, and strategic resources from ScaleLink Alliance.',
      canonical: `https://www.scalelinkalliance.com/resources/${resource.slug || slug}`,
      image: resource.imageUrl ? resource.imageUrl.split('#')[0] : 'https://www.scalelinkalliance.com/hero-bg.jpg',
      ogType: 'article',
      h1: resource.title,
      summary: resource.plainTextSnippet,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': resource.title,
        'description': resource.plainTextSnippet || '',
        'image': resource.imageUrl ? resource.imageUrl.split('#')[0] : 'https://www.scalelinkalliance.com/hero-bg.jpg',
        'author': {
          '@type': 'Organization',
          'name': resource.author || 'ScaleLink Alliance'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'ScaleLink Alliance',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://www.scalelinkalliance.com/favicon.png'
          }
        },
        'datePublished': resource.publishedDate || resource.createdAt
      }
    });
  } catch (err) {
    console.error('Error injecting resource metadata:', err);
    return res.sendFile(indexPath);
  }
});

// ─── CATCH-ALL ROUTE WITH SEO MATCHING ───
// Note: Express 5 requires named wildcard params (/path-to-regexp v8)
app.get('/*path', (req, res) => {
  const cleanPath = req.path.replace(/\/+$/, '') || '/';
  if (SEO_REGISTRY[cleanPath]) {
    return renderSeoPage(req, res, SEO_REGISTRY[cleanPath]);
  }
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