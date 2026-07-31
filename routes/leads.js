// routes/leads.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middlewares/auth');

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access Denied. You do not have permission to perform this action.' });
  }
  next();
};

// GET /api/leads/:id — full lead details for the admin notification "View" modal
router.get('/:id', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  try {
    const lead = await db.Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    console.error('❌ Error fetching lead:', error);
    res.status(500).json({ success: false, message: 'Error fetching lead', error: error.message });
  }
});

// POST /api/leads/website-review
router.post('/website-review', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      businessName,
      websiteUrl,
      email,
      phone,
      industry,
      message,
      agreeToContact
    } = req.body;

    if (!firstName || !lastName || !websiteUrl || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'firstName, lastName, websiteUrl, email, and phone are required.'
      });
    }

    const lead = await db.Lead.create({
      leadType: 'website_review',
      firstName,
      lastName,
      businessName: businessName || '',
      websiteUrl,
      email,
      phone,
      industry: industry || '',
      message: message || '',
      agreeToContact: !!agreeToContact,
      reviewStatus: 'pending',
      leadSource: 'website_review_form',
      dateSubmitted: new Date()
    });

    // Notify Super Admins in-app, same pattern as routes/public.js
    try {
      const superAdmins = await db.AdminUser.findAll({ where: { role: 'super_admin' } });
      for (const admin of superAdmins) {
        await db.NoticeBoardNotification.create({
          sentTo: admin.email,
          type: 'website_review_request',
          message: `New Free Website Review request: ${firstName} ${lastName} (${websiteUrl})`,
          fromUser: 'System',
          metadata: { leadId: lead.id, email, websiteUrl },
          isRead: false
        });
      }
    } catch (notifyErr) {
      console.error('❌ Failed to notify admins of new lead:', notifyErr);
    }

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      leadId: lead.id
    });

  } catch (error) {
    console.error('❌ Error creating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lead',
      error: error.message
    });
  }
});

// POST /api/leads/send-confirmation
router.post('/send-confirmation', async (req, res) => {
  try {
    const { email, firstName } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'email is required.' });
    }

    // Wire up to your existing mailer (utils/mailer.js) once you have a template for this.
    // Left as a no-op for now so the endpoint responds successfully without erroring
    // if no confirmation-email function exists yet.
    // Example, once ready:
    // const { sendWebsiteReviewConfirmationEmail } = require('../utils/mailer');
    // await sendWebsiteReviewConfirmationEmail(email, firstName);

    res.status(200).json({
      success: true,
      message: 'Confirmation email sent'
    });
  } catch (error) {
    console.error('❌ Error sending confirmation:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending confirmation email'
    });
  }
});

module.exports = router;