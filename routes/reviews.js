// routes/reviews.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middlewares/auth');

// Restrict-to-role helper — matches the pattern used in routes/cms.js.
// If cms.js's restrictTo is exported/shared elsewhere in your project, prefer
// importing that instead of duplicating it here.
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access Denied. You do not have permission to perform this action.' });
  }
  next();
};

// ─── Admin: Submit Review Results ──────────────────────────────────────────
router.put('/submit/:leadId', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  try {
    const { leadId } = req.params;
    const { reviewResults, reviewStatus } = req.body;

    const lead = await db.Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await lead.update({
      reviewResults,
      reviewStatus: reviewStatus || 'completed',
      reviewCompleted: new Date(),
      pipelineStage: 'review_sent',
      reviewerAssigned: req.user.email
    });

    // Wire up to utils/mailer.js once a template exists for this.
    // const { sendReviewCompleteEmail } = require('../utils/mailer');
    // await sendReviewCompleteEmail(lead.email, lead.firstName, reviewResults).catch(err =>
    //   console.error('❌ Review complete email failed:', err)
    // );

    res.status(200).json({
      success: true,
      message: 'Review submitted successfully',
      data: lead
    });

  } catch (error) {
    console.error('❌ Error submitting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting review',
      error: error.message
    });
  }
});

// ─── User: Get Their Review Results ────────────────────────────────────────
router.get('/my-review/:leadId', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { email } = req.query; // Simple email-based verification, matches original design

    if (!email) {
      return res.status(400).json({ success: false, message: 'email query parameter is required.' });
    }

    const lead = await db.Lead.findOne({
      where: {
        id: leadId,
        email,
        reviewStatus: 'completed'
      }
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or not completed yet'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        websiteUrl: lead.websiteUrl,
        reviewResults: lead.reviewResults,
        reviewCompleted: lead.reviewCompleted
      }
    });

  } catch (error) {
    console.error('❌ Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message
    });
  }
});

module.exports = router;