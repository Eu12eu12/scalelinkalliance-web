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
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    console.warn('⚠️ STRIPE_WEBHOOK_SECRET is not set. Signature verification skipped.');
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
          // Update job fields
          await job.update({
            quoteStatus: 'deposit_paid',
            status: job.status === 'new' ? 'assigned' : job.status,
            projectFee: (job.customQuoteAmount !== null && job.customQuoteAmount !== undefined) 
              ? Math.max(0, job.customQuoteAmount - (job.specialDiscount || 0)) 
              : job.projectFee
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
          const notificationMsg = `💳 [Deposit Paid] Client ${clientName} (${job.client}) paid deposit of $${(session.amount_total / 100).toFixed(2)} for job #${job.id}!`;

          const admins = await db.AdminUser.findAll({ where: { role: 'super_admin' } });
          const { sendNotificationEmail, sendClientPhaseNotificationEmail } = require('./utils/mailer');
          
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
              console.error('❌ Super Admin webhook email notification failed:', err);
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
              console.error('❌ Worker webhook notification failed:', err);
            });
          }

          // Trigger "In Production" email immediately
          sendClientPhaseNotificationEmail(job, 'in_production').catch(err => console.error('❌ Client webhook production email failed:', err));
        }
      } catch (err) {
        console.error('❌ Webhook handler error (checkout.session.completed):', err);
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
          const notificationMsg = `⚠️ [Quote Expired] Stripe payment link for job #${job.id} ("${job.title}") has expired without payment. You may need to re-send the quote.`;

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
              console.error('❌ Super Admin expiration email notification failed:', err);
            });
          }
        }
      } catch (err) {
        console.error('❌ Webhook handler error (checkout.session.expired):', err);
        return res.status(500).json({ error: err.message });
      }
    }
  }

  res.json({ received: true });
});

// JSON limit set to 25mb — enough to handle base64-encoded logos up to ~16MB.
// NOTE: Hostinger's nginx proxy enforces its own body size limits.
// Do NOT raise this beyond 25mb or the proxy will reject requests with 413/503.
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadDir);
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

// ──────────────────────────────────────────
// API ROUTES
// ──────────────────────────────────────────

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

// File upload endpoint
app.post('/api/upload-files', async (req, res) => {
  try {
    console.log('📤 Received file upload request');
    
    await handleMulterUpload(req, res);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    console.log(`✅ Successfully uploaded ${req.files.length} files`);

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
      console.log(`  📄 File ${index + 1}: ${file.filename} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    });

    res.status(200).json({
      success: true,
      message: `Successfully uploaded ${req.files.length} files`,
      fileUrls: fileUrls,
      totalSize: totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2)
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    
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
      currency: normalizedCurrency,  // ← The fix
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
    console.error('❌ Stripe error:', error);
    res.status(500).json({ 
      error: error.message,
      type: error.type 
    });
  }
});

// ──────────────────────────────────────────
// STATIC FILES
// ──────────────────────────────────────────

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Serve React frontend build
const frontendDistPath = fs.existsSync(path.join(__dirname, 'dist'))
  ? path.join(__dirname, 'dist')
  : path.join(__dirname, 'Frontend/dist');

app.use(express.static(frontendDistPath));

// ──────────────────────────────────────────
// ERROR HANDLING
// ──────────────────────────────────────────

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Catch-all: serve React app for any non-API route (must be last)
// Note: Express 5 requires named wildcard params (/path-to-regexp v8)
app.get('/*path', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// ──────────────────────────────────────────
// START SERVER
// ──────────────────────────────────────────

const PORT = process.env.PORT || 3001;

// Sync database and then start server
const startServer = async () => {
  // Phase 1: Try sync with schema alteration (adds/modifies columns safely)
  try {
    if (db.sequelize.options.dialect === 'sqlite') {
      await db.sequelize.query('PRAGMA foreign_keys = OFF');
    }
    await db.sequelize.sync({ alter: true });
    if (db.sequelize.options.dialect === 'sqlite') {
      await db.sequelize.query('PRAGMA foreign_keys = ON');
    }
    console.log('✅ Database synced successfully (alter mode)');
  } catch (alterErr) {
    // Phase 2 fallback: alter failed (e.g. MySQL column lock/permission issue).
    // Try a safe no-op sync that only creates missing tables, never drops or alters.
    console.warn('⚠️  Database alter-sync failed, falling back to safe sync:', alterErr.message);
    try {
      await db.sequelize.sync();
      console.log('✅ Database synced successfully (safe mode — no schema alterations)');
    } catch (syncErr) {
      // Phase 3: Even basic sync failed. Log and continue — the server must stay up.
      // Existing tables will still work; only missing tables will cause errors.
      console.error('❌ Database sync failed entirely. Server starting anyway:', syncErr.message);
    }
  }

  // Always start the HTTP server regardless of DB sync outcome.
  // A running server that returns 500 on DB errors is far better than a 503.
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT} [v1.0.2-STABLE]`);
    console.log(`📍 API endpoints:`);
    console.log(`   - GET  /api/health`);
    console.log(`   - POST /api/upload-files`);
    console.log(`   - POST /api/create-payment-intent`);
    console.log(`   - ANY  /api/cms/* (Authentication, Typed Resources, Features)`);
    console.log(`📍 Upload directory: ${uploadDir}`);
    console.log(`📍 Max file size: 100MB per file (multer streamed — not JSON buffered)`);
    console.log(`📍 Max JSON body: 25MB`);
    console.log(`📍 Max files: 20\n`);
  });
};

startServer();