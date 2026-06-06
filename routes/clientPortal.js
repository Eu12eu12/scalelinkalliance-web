const express = require('express');
const router = express.Router();
const db = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { sendNotificationEmail, sendClientPhaseNotificationEmail } = require('../utils/mailer');

// Setup storage for job files (Client Portal upload destination)
const jobUploadDir = path.join(__dirname, '../uploads/jobs');
if (!fs.existsSync(jobUploadDir)) {
  fs.mkdirSync(jobUploadDir, { recursive: true });
}

const jobStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, jobUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    cb(null, 'client-' + name + '-' + uniqueSuffix + ext);
  }
});

const jobUpload = multer({
  storage: jobStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.docx', '.xlsx', '.jpg', '.jpeg', '.png', '.zip'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, DOCX, XLSX, JPG, PNG, ZIP.'));
    }
  }
});

// ──────────────────────────────────────────
// MIDDLEWARES
// ──────────────────────────────────────────

const validateClientToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ error: 'Token is required.' });

    const job = await db.NoticeBoardJob.findOne({ where: { clientToken: token } });
    if (!job) {
      return res.status(404).json({ error: 'Portal link is invalid or has expired.' });
    }
    req.job = job;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper to log job activity
const logJobActivity = async (jobId, userName, action, details = null) => {
  try {
    await db.NoticeBoardActivity.create({
      jobId,
      userName,
      action,
      details
    });
  } catch (err) {
    console.error('❌ Failed to log activity:', err);
  }
};

// Helper to notify all Super Admins in database
const notifySuperAdmins = async (job, type, message, metadata = null) => {
  try {
    // Retrieve all active super admins
    const admins = await db.AdminUser.findAll({ where: { role: 'super_admin' } });
    for (const admin of admins) {
      await db.NoticeBoardNotification.create({
        sentTo: admin.email,
        type,
        message,
        jobId: job.id,
        fromUser: 'client',
        metadata,
        isRead: false
      });
      // Optionally fire notification emails to admins
      sendNotificationEmail(admin.email, 'comment', message, job.id).catch(err => {
        console.error('❌ Super Admin email notification failed:', err);
      });
    }
  } catch (err) {
    console.error('❌ Failed to notify admins:', err);
  }
};

// Helper to handle all operations after payment succeeds (Stripe webhook or manual checkout confirmation)
const updateJobAfterPayment = async (job, session) => {
  if (job.quoteStatus === 'deposit_paid') return job;

  let selectedAddons = [];
  try {
    if (session.metadata && session.metadata.selectedAddons) {
      selectedAddons = JSON.parse(session.metadata.selectedAddons);
    }
  } catch (err) {
    console.error('❌ Error parsing selectedAddons metadata:', err);
  }

  const addonsTotal = selectedAddons.reduce((sum, item) => sum + (item.price || 0), 0);
  const baseQuoteAmount = job.customQuoteAmount || 0;
  const newCustomQuoteAmount = baseQuoteAmount + addonsTotal;
  const newProjectFee = Math.max(0, newCustomQuoteAmount - (job.specialDiscount || 0));

  // Update included services string
  let currentIncluded = job.includedServices || '';
  if (selectedAddons.length > 0) {
    const addonLines = selectedAddons.map(a => `✓ Upgrade: ${a.name} ($${(a.price / 100).toFixed(2)} USD)`).join('\n');
    currentIncluded = currentIncluded ? `${currentIncluded}\n${addonLines}` : addonLines;
  }

  await job.update({
    quoteStatus: 'deposit_paid',
    status: job.status === 'new' ? 'assigned' : job.status, // Move to assigned status so it can start production
    customQuoteAmount: newCustomQuoteAmount,
    projectFee: newProjectFee,
    includedServices: currentIncluded
  });

  return await job.reload();
};

// ──────────────────────────────────────────
// ENDPOINTS
// ──────────────────────────────────────────

// 1. Fetch Sanitized Portal Profile
router.get('/track/:token', validateClientToken, async (req, res) => {
  try {
    const { job } = req;
    
    // Status simplification mapping
    let milestoneStatus = 'In Production';
    let stepIndex = 1;

    if (job.status === 'new') {
      milestoneStatus = 'Order Received';
      stepIndex = 1;
    } else if (['assigned', 'in_progress', 'checked_out'].includes(job.status)) {
      milestoneStatus = 'In Production';
      stepIndex = 2;
    } else if (job.status === 'waiting_review') {
      milestoneStatus = 'Quality Assurance & Review';
      stepIndex = 3;
    } else if (job.status === 'completed') {
      milestoneStatus = 'Delivered & Complete';
      stepIndex = 4;
    }

    // Fetch comments visible to the client
    const comments = await db.NoticeBoardComment.findAll({
      where: {
        jobId: job.id,
        visibility: 'client'
      },
      order: [['createdAt', 'ASC']]
    });

    // Fetch files visible to the client
    const files = await db.NoticeBoardFile.findAll({
      where: {
        jobId: job.id,
        visibility: ['client', 'both']
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      job: {
        id: job.id,
        title: (job.title || '').replace(/Request Custom Quote - /g, ''),
        client: job.client,
        category: (job.category || '').replace(/Request Custom Quote - /g, ''),
        description: job.description,
        receivedAt: job.receivedAt,
        dueAt: job.dueAt,
        milestoneStatus,
        stepIndex,
        clientSatisfied: job.clientSatisfied,
        
        // Custom Quote fields
        quoteStatus: job.quoteStatus,
        customQuoteAmount: job.customQuoteAmount,
        depositRequired: job.depositRequired,
        specialDiscount: job.specialDiscount,
        monthlySupportOption: job.monthlySupportOption,
        recommendedPackage: job.recommendedPackage,
        estimatedCompletionTime: job.estimatedCompletionTime,
        includedServices: job.includedServices,
        notIncluded: job.notIncluded,
        optionalAddOns: job.optionalAddOns,
        stripeCheckoutUrl: job.stripeCheckoutUrl,
        clientToken: job.clientToken,
        clientWebsite: job.clientWebsite,
        clientLocation: job.clientLocation,
        clientIndustry: job.clientIndustry,
        projectGoal: job.projectGoal,
        projectScope: job.projectScope,
        levelOfSupport: job.levelOfSupport,
        clientAssets: job.clientAssets,
        currentProblem: job.currentProblem
      },
      comments,
      files
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Client Portal: Send Message
router.post('/track/:token/messages', validateClientToken, async (req, res) => {
  try {
    const { job } = req;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty.' });
    }

    if (job.clientSatisfied) {
      return res.status(400).json({ error: 'This project is already marked as completed and closed.' });
    }

    const newComment = await db.NoticeBoardComment.create({
      jobId: job.id,
      userName: `${job.clientFirstName} ${job.clientLastName}`.trim() || 'Client',
      userEmail: job.clientEmail || 'client@scalelinkalliance.com',
      comment: comment.trim(),
      visibility: 'client',
      fromUserRole: 'client'
    });

    await logJobActivity(job.id, 'Client', 'Message Sent', 'Client added a comment in portal chat.');

    // Notify Super Admins of incoming client message
    const notificationMsg = `[Client Message] ${job.client}: ${comment.substring(0, 100)}`;
    await notifySuperAdmins(job, 'comment', notificationMsg);

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Client Portal: Upload Files
router.post('/track/:token/files', validateClientToken, jobUpload.array('files', 10), async (req, res) => {
  try {
    const { job } = req;

    if (job.clientSatisfied) {
      return res.status(400).json({ error: 'This project has been marked as closed.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files selected for upload.' });
    }

    const savedFiles = await Promise.all(req.files.map(file => {
      return db.NoticeBoardFile.create({
        jobId: job.id,
        fileName: file.originalname,
        filePath: `/uploads/jobs/${file.filename}`,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: job.clientEmail || 'client@scalelinkalliance.com',
        visibility: 'client',
        uploadedByRole: 'client'
      });
    }));

    await logJobActivity(job.id, 'Client', 'Files Uploaded', `${req.files.length} file(s) uploaded by client.`);

    // Notify admins of uploaded client assets
    const notificationMsg = `[Client File Upload] Client shared ${req.files.length} new asset file(s).`;
    const fileNames = req.files.map(f => f.originalname);
    await notifySuperAdmins(job, 'file', notificationMsg, {
      clientName: `${job.clientFirstName || ''} ${job.clientLastName || ''}`.trim() || job.client || 'N/A',
      clientEmail: job.clientEmail || 'N/A',
      fileNames
    });

    res.status(201).json({ success: true, files: savedFiles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Client Portal: Mark Project as Satisfied / Close Portal
router.post('/track/:token/satisfied', validateClientToken, async (req, res) => {
  try {
    const { job } = req;

    if (job.clientSatisfied) {
      return res.status(400).json({ error: 'Project is already completed.' });
    }

    await job.update({ clientSatisfied: true });
    
    await logJobActivity(job.id, 'Client', 'Approved & Completed', 'Client marked project status as satisfied and closed.');

    // Send confirmation email to client
    await sendClientPhaseNotificationEmail(job, 'approved');

    // Notify admins
    const notificationMsg = `🎉 [Project Satisfied] Client is fully satisfied and completed job #${job.id}!`;
    await notifySuperAdmins(job, 'completed', notificationMsg, {
      clientName: `${job.clientFirstName || ''} ${job.clientLastName || ''}`.trim() || job.client || 'N/A',
      clientEmail: job.clientEmail || 'N/A',
      company: job.client || 'N/A'
    });

    res.json({ success: true, message: 'Thank you for your approval! The project has been marked as completed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Client Portal: Create Dynamic Checkout Session with Selected Add-ons
router.post('/track/:token/checkout', validateClientToken, async (req, res) => {
  try {
    const { job } = req;
    const { selectedAddons } = req.body; // Array of selected addon objects: [{ name, price }]
    
    if (job.quoteStatus !== 'quote_sent') {
      return res.status(400).json({ error: 'This quote is not in a payable state.' });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const currency = (job.currency || 'usd').toLowerCase();
    
    // Calculate new deposit amount
    const baseDeposit = job.depositRequired !== null && job.depositRequired !== undefined ? job.depositRequired : Math.max(0, (job.customQuoteAmount || 0) - (job.specialDiscount || 0));
    const addonsTotal = (selectedAddons || []).reduce((sum, item) => sum + (item.price || 0), 0);
    const totalDepositAmount = baseDeposit + addonsTotal;

    if (totalDepositAmount <= 0) {
      return res.status(400).json({ error: 'A valid payment amount is required.' });
    }

    // Create Stripe Checkout Session description
    const descriptionStr = `Base Deposit: $${(baseDeposit / 100).toLocaleString()}` + 
      ((selectedAddons && selectedAddons.length > 0) 
        ? ` + Upgrades: ${selectedAddons.map(a => `${a.name} ($${(a.price / 100).toLocaleString()})`).join(', ')}` 
        : '');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency,
          product_data: {
            name: `Deposit & Upgrades for Project: ${job.title}`,
            description: descriptionStr.substring(0, 255), // Stripe description limit is 255 chars
          },
          unit_amount: totalDepositAmount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/track-job/${job.clientToken}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/track-job/${job.clientToken}`,
      metadata: {
        jobId: job.id,
        clientToken: job.clientToken,
        selectedAddons: JSON.stringify(selectedAddons || []) // Pass selected add-ons to stripe metadata
      }
    });

    // Temporarily save checkout session details on the job
    await job.update({
      stripeCheckoutUrl: session.url,
      stripeSessionId: session.id,
    });

    res.json({ stripeCheckoutUrl: session.url });
  } catch (err) {
    console.error('❌ Dynamic checkout error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Client Portal: Confirm Stripe Deposit Payment
router.post('/track/:token/confirm-payment', validateClientToken, async (req, res) => {
  try {
    const { job } = req;
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required.' });
    }

    if (job.quoteStatus === 'deposit_paid') {
      return res.json({ success: true, message: 'Deposit already verified.', job });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment has not been completed.' });
    }

    // Update job status and apply any purchased upgrades
    await updateJobAfterPayment(job, session);

    await logJobActivity(job.id, 'Client', 'Deposit Paid', `Client successfully paid deposit of $${(session.amount_total / 100).toFixed(2)} via Stripe.`);

    // Trigger onboarding email & notify admins
    const clientName = `${job.clientFirstName || ''} ${job.clientLastName || ''}`.trim() || 'Client';
    const notificationMsg = `💳 [Deposit Paid] Client ${clientName} (${job.client}) paid deposit of $${(session.amount_total / 100).toFixed(2)} for job #${job.id}!`;
    await notifySuperAdmins(job, 'acceptance', notificationMsg, {
      amount: session.amount_total,
      sessionId
    });

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
        console.error('❌ Worker notification failed:', err);
      });
    }

    // Trigger "In Production" email immediately
    sendClientPhaseNotificationEmail(job, 'in_production').catch(err => console.error('❌ Client production email failed:', err));

    res.json({
      success: true,
      message: 'Deposit verified. Project moved to production.',
      job
    });
  } catch (err) {
    console.error('❌ Error confirming payment:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Client Portal: Proactively retrieve payment status from Stripe if needed
router.get('/track/:token/payment-status', validateClientToken, async (req, res) => {
  try {
    const { job } = req;
    
    // Only check if we have a session ID and we are awaiting payment
    if (!job.stripeSessionId || job.quoteStatus !== 'quote_sent') {
      return res.json({ paid: job.quoteStatus === 'deposit_paid' || job.quoteStatus === 'in_progress' || job.quoteStatus === 'completed' || job.quoteStatus === 'approved' });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(job.stripeSessionId);

    if (session.payment_status === 'paid' && job.quoteStatus !== 'deposit_paid') {
      // Auto-update since it's paid!
      await updateJobAfterPayment(job, session);

      await logJobActivity(job.id, 'Client', 'Deposit Paid', `Fallback check confirmed deposit payment of $${(session.amount_total / 100).toFixed(2)} via Stripe.`);

      const clientName = `${job.clientFirstName || ''} ${job.clientLastName || ''}`.trim() || 'Client';
      const notificationMsg = `💳 [Deposit Paid] Client ${clientName} (${job.client}) paid deposit of $${(session.amount_total / 100).toFixed(2)} for job #${job.id}!`;
      await notifySuperAdmins(job, 'acceptance', notificationMsg, {
        amount: session.amount_total,
        sessionId: job.stripeSessionId
      });

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
          console.error('❌ Worker notification failed:', err);
        });
      }

      // Trigger "In Production" email immediately
      sendClientPhaseNotificationEmail(job, 'in_production').catch(err => console.error('❌ Client production email failed:', err));

      return res.json({ paid: true, job });
    }

    res.json({ paid: false });
  } catch (err) {
    console.error('❌ Error checking payment status fallback:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
