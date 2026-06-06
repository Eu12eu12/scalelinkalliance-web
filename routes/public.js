const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');

// Helper to create notifications
const createNotification = async (sentTo, type, message, jobId = null, fromUser = null, metadata = null) => {
  try {
    await db.NoticeBoardNotification.create({
      sentTo,
      type,
      message,
      jobId,
      fromUser,
      metadata,
      isRead: false
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};

// Helper to log activity
const logActivity = async (jobId, userName, action, details = null) => {
  try {
    await db.NoticeBoardActivity.create({
      jobId,
      userName,
      action,
      details
    });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};

// Public Service Request endpoint
router.post('/service-request', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      company, 
      services, 
      projectDescription, 
      timeline, 
      budget,
      totalAmount,
      currency,
      clientWebsite,
      clientLocation,
      clientIndustry,
      files // Array of { filename, url, size, mimetype }
    } = req.body;

    // 1. Create the Job in NoticeBoardJob
    const job = await db.NoticeBoardJob.create({
      title: `${firstName} ${lastName} - ${company}`,
      category: Object.keys(services || {}).join(', ') || 'Service Request',
      description: projectDescription,
      currentProblem: projectDescription,
      status: 'new',
      priority: 'medium',
      receivedAt: new Date(),
      dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      projectFee: totalAmount || 0,
      currency: currency || 'usd',
      services: services || {},
      client: company,
      clientFirstName: firstName,
      clientLastName: lastName,
      clientEmail: email,
      clientPhone: phone,
      clientWebsite,
      clientLocation,
      clientIndustry,
      clientTimeline: timeline,
      budget: budget,
      warningLevel: 'green',
      projectScope: req.body.projectScope || null
    });

    // 2. Attach files if any
    if (files && files.length > 0) {
      await Promise.all(files.map(file => {
        return db.NoticeBoardFile.create({
          jobId: job.id,
          fileName: file.filename,
          filePath: file.url.replace(`${req.protocol}://${req.get('host')}`, ''), // Store relative path
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadedBy: email,
          visibility: 'both',
          uploadedByRole: 'client'
        });
      }));
      await logActivity(job.id, 'System', 'Files Attached', `${files.length} files uploaded by client.`);
    }

    // 3. Log initial activity
    await logActivity(job.id, 'System', 'Request Received', 'Service request submitted via website form.');

    // Send Onboarding Email to Client
    if (job.clientEmail) {
      const { sendClientOnboardingEmail } = require('../utils/mailer');
      sendClientOnboardingEmail(job).catch(err => console.error('❌ Public onboarding email failed:', err));
    }

    // 4. Notify Super Admins
    const superAdmins = await db.AdminUser.findAll({ where: { role: 'super_admin' } });
    
    for (const admin of superAdmins) {
      await createNotification(
        admin.email,
        'service_request',
        `New Service Request: ${firstName} ${lastName} (${company})`,
        job.id,
        'System',
        { 
          clientEmail: email,
          company: company,
          totalAmount: totalAmount,
          currency: currency,
          clientName: `${firstName} ${lastName}`
        }
      );
    }

    res.status(201).json({ 
      success: true, 
      message: 'Service request created successfully',
      jobId: job.id
    });

  } catch (err) {
    console.error('❌ Error creating public service request:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
