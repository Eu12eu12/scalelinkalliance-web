const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mailer = require('../utils/mailer');
const enforceProfileComplete = require('../middlewares/profileComplete');

const handleClientPhaseEmail = async (oldStatus, newStatus, job) => {
  try {
    if (!job || !newStatus || oldStatus === newStatus) return;

    if (['assigned', 'in_progress'].includes(newStatus) && oldStatus === 'new') {
      await mailer.sendClientPhaseNotificationEmail(job, 'in_production');
    } else if (newStatus === 'waiting_review' && oldStatus !== 'waiting_review') {
      await mailer.sendClientPhaseNotificationEmail(job, 'quality_review');
    } else if (newStatus === 'completed' && oldStatus !== 'completed') {
      await mailer.sendClientPhaseNotificationEmail(job, 'delivered');
    }
  } catch (err) {
    console.error('❌ Failed to send client phase email:', err);
  }
};

// Setup storage for partner logos
const partnerUploadDir = path.join(__dirname, '../uploads/partner');
if (!fs.existsSync(partnerUploadDir)) {
  fs.mkdirSync(partnerUploadDir, { recursive: true });
}

const partnerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, partnerUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, 'logo-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: partnerStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'));
    }
  }
});

// Setup storage for job files
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
    cb(null, name + '-' + uniqueSuffix + ext);
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

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev';

// Middleware to restrict access based on user role
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access Denied. You do not have permission to perform this action.' });
    }
    next();
  };
};

// Middleware to prevent work actions on unpaid custom quote jobs
const blockUnpaidCustomQuote = async (req, res, next) => {
  try {
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found.' });

    const hasCustomQuoteService = job.category && job.category.includes('Request Custom Quote');
    const hasQuoteAmount = job.customQuoteAmount && job.customQuoteAmount > 0;
    const isCustomQuote = hasCustomQuoteService || hasQuoteAmount;

    if (isCustomQuote) {
      const isPaid = job.quoteStatus === 'deposit_paid' || 
                     job.quoteStatus === 'in_progress' || 
                     job.quoteStatus === 'completed' || 
                     job.quoteStatus === 'approved';

      if (!isPaid) {
        if (req.method === 'PATCH' && req.route && req.route.path === '/admin/notice-board/:id') {
          const { status, assignedTo } = req.body;
          if (status || assignedTo) {
            return res.status(403).json({ error: 'Action blocked. This custom quote job has not been paid for by the client.' });
          }
        } else {
          return res.status(403).json({ error: 'Action blocked. This custom quote job has not been paid for by the client.' });
        }
      }
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper to create snapshots of job data
const getJobSnapshot = (job) => ({
  title: job.title,
  category: job.category,
  projectFee: job.projectFee,
  dueAt: job.dueAt,
  description: job.description
});

// Helper to create notifications
const createNotification = async (sentTo, type, message, jobId = null, fromUser = null, metadata = null) => {
  try {
    const finalMessage = message || `New notification: ${type}`;
    
    await db.NoticeBoardNotification.create({
      sentTo,
      type,
      message: finalMessage,
      jobId,
      fromUser,
      metadata,
      isRead: false
    });

    // Send email notification for specific worker-related types
    const workerTypes = ['assignment', 'review', 'completed', 'returned', 'comment', 'file', '24h_reminder', '2h_reminder', 'overdue', 'cancelled'];
    if (workerTypes.includes(type)) {
      const { sendNotificationEmail } = require('../utils/mailer');
      // Fire and forget email to not block the request
      sendNotificationEmail(sentTo, type, finalMessage, jobId).catch(err => {
        console.error('❌ Background email sending failed:', err);
      });
    }
  } catch (error) {
    console.error('❌ Failed to create notification:', error);
  }
};

// --- AUTHENTICATION --- //
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.AdminUser.findOne({ where: { email } });
    
    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });
    
    // Check if user is verified
    if (!user.isVerified) {
      // Check if verification has expired
      if (user.verificationExpires && new Date() > new Date(user.verificationExpires)) {
        // Delete expired worker account as per requirements
        await user.destroy();
        return res.status(403).json({ error: 'Your verification link has expired and your account has been removed. Please contact the administrator.' });
      }
      return res.status(403).json({ error: 'Please verify your email address before logging in.' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password.' });
    
    if (!user.isActive) {
      return res.status(403).json({ error: 'Your account has been deactivated. Please contact the administrator.' });
    }
    
    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      isProfileComplete: user.isProfileComplete
    }, JWT_SECRET, { expiresIn: '8h' });

    res.json({ 
      token,
      valid: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        fullName: user.fullName,
        mustChangePassword: user.mustChangePassword,
        isProfileComplete: user.isProfileComplete
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Email Verification Endpoint
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      ...req.user,
      isVerified: req.user.isVerified,
      isProfileComplete: req.user.isProfileComplete,
      mustChangePassword: req.user.mustChangePassword
    } 
  });
});

router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const user = await db.AdminUser.findOne({ where: { verificationToken: token } });

    if (!user) {
      return res.status(404).json({ error: 'Invalid verification token.' });
    }

    // Check if expired (12 hours)
    if (new Date() > new Date(user.verificationExpires)) {
      await user.destroy(); // Remove record if expired as per requirements
      return res.status(410).json({ error: 'Verification link expired. Your account has been removed. Please ask the admin to recreate it.' });
    }

    // Mark as verified but still needs profile completion
    await user.update({
      isVerified: true,
      verificationToken: null,
      verificationExpires: null
    });

    res.json({ message: 'Email verified successfully! You can now log in to complete your profile.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profile Completion Endpoint
router.post('/complete-profile', authMiddleware, async (req, res) => {
  try {
    const { password, fullName, phoneNumber, address, zipCode } = req.body;
    const user = await db.AdminUser.findByPk(req.user.id);

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isProfileComplete) return res.status(400).json({ error: 'Profile already completed' });

    // Update user info and set permanent password
    await user.update({
      passwordHash: password, // Model hook will hash this
      fullName,
      phoneNumber,
      address,
      zipCode,
      mustChangePassword: false,
      isProfileComplete: true
    });

    res.json({ message: 'Profile completed successfully! Welcome to the dashboard.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/admin/users/:id/toggle-active', authMiddleware, restrictTo('super_admin'), async (req, res) => {
  try {
    const user = await db.AdminUser.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Prevent self-deactivation
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot deactivate your own account.' });
    }

    // Prevent deactivating other super admins (optional security measure)
    if (user.role === 'super_admin' && req.user.role === 'super_admin' && user.id !== req.user.id) {
       // Allow it, but maybe add extra logging or restrictions if needed.
       // For now, let's just allow Super Admin to manage others.
    }

    await user.update({ isActive: !user.isActive });
    res.json({ message: `User account ${user.isActive ? 'reactivated' : 'deactivated'} successfully.`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- DASHBOARD STATS --- //
router.get('/dashboard/stats', authMiddleware, enforceProfileComplete, async (req, res) => {
  try {
    const isWorker = req.user.role === 'worker';
    const isAdmin = req.user.role === 'admin';
    const isSuperAdmin = req.user.role === 'super_admin';
    
    const workerEmail = req.user.email;
    const workerName = workerEmail.split('@')[0];

    const stats = {};

    if (isWorker) {
      // Worker specific stats (Job focused)
      stats.myActiveJobs = await db.NoticeBoardJob.count({
        where: {
          [Op.or]: [{ assignedTo: workerEmail }, { assignedTo: workerName }],
          status: ['assigned', 'in_progress', 'checked_out']
        }
      });
      stats.myCompletedJobs = await db.NoticeBoardJob.count({
        where: {
          [Op.or]: [{ assignedTo: workerEmail }, { assignedTo: workerName }],
          status: 'completed'
        }
      });
      stats.myOverdueJobs = await db.NoticeBoardJob.count({
        where: {
          [Op.or]: [{ assignedTo: workerEmail }, { assignedTo: workerName }],
          status: { [Op.notIn]: ['completed', 'archived'] },
          dueAt: { [Op.lt]: new Date() }
        }
      });
      stats.myPendingReview = await db.NoticeBoardJob.count({
        where: {
          [Op.or]: [{ assignedTo: workerEmail }, { assignedTo: workerName }],
          status: 'waiting_review'
        }
      });
    } else if (isAdmin) {
      // Regular Admin stats (Resource focused)
      stats.totalResources = await db.Resource.count();
      stats.publishedResources = await db.Resource.count({ where: { status: 'published' } });
      stats.totalCategories = await db.ResourceType.count();
      stats.featuredResource = await db.Resource.findOne({
        where: { isFeatured: true },
        attributes: ['id', 'title']
      });
    } else {
      // Super Admin stats (Full access)
      stats.totalResources = await db.Resource.count();
      stats.publishedResources = await db.Resource.count({ where: { status: 'published' } });
      stats.totalCategories = await db.ResourceType.count();
      stats.totalPartners = await db.Partner.count();
      stats.pendingPartners = await db.Partner.count({ where: { status: 'pending' } });
      stats.featuredResource = await db.Resource.findOne({
        where: { isFeatured: true },
        attributes: ['id', 'title']
      });
      stats.totalNoticeBoardJobs = await db.NoticeBoardJob.count();
      stats.openNoticeBoardJobs = await db.NoticeBoardJob.count({ 
        where: { status: ['new', 'assigned', 'in_progress', 'checked_out', 'waiting_review'] } 
      });
      stats.overdueNoticeBoardJobs = await db.NoticeBoardJob.count({ 
        where: { 
          status: { [Op.notIn]: ['completed', 'archived'] },
          dueAt: { [Op.lt]: new Date() }
        } 
      });
    }

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- RESOURCE TYPES --- //
// Get all resource categories (public for displaying frontend badges!)
router.get('/resource-types', async (req, res) => {
  try {
    const types = await db.ResourceType.findAll();
    res.json(types);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/resource-types', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  try {
    const type = await db.ResourceType.create(req.body);
    res.status(201).json(type);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/resource-types/:id', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  const { moveToId } = req.body || {};
  const id = parseInt(req.params.id);

  try {
    const resourceCount = await db.Resource.count({ where: { typeId: id } });

    if (resourceCount > 0) {
      if (!moveToId) {
        return res.status(409).json({ 
          error: 'Category has resources', 
          count: resourceCount 
        });
      }

      // Reassignment flow
      const transaction = await db.sequelize.transaction();
      try {
        await db.Resource.update({ typeId: moveToId }, { where: { typeId: id }, transaction });
        await db.ResourceType.destroy({ where: { id }, transaction });
        await transaction.commit();
        return res.json({ message: `Successfully moved ${resourceCount} resources and deleted category.` });
      } catch (err) {
        await transaction.rollback();
        console.error('Category Migration Error:', err);
        return res.status(500).json({ error: 'Failed to migrate resources.' });
      }
    }

    // Direct deletion
    await db.ResourceType.destroy({ where: { id } });
    res.json({ message: 'Category deleted successfully.' });
  } catch (err) {
    console.error('Category Deletion Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- RESOURCES --- //
// Public endpoint for the Frontend Resources view (Filtered by status & Paginated)
router.get('/resources', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const offset = (page - 1) * limit;
    const typeId = req.query.category; // Optional category filter

    const where = { status: 'published' };
    if (typeId && typeId !== 'all') {
      where.typeId = typeId;
    }

    const { count, rows } = await db.Resource.findAndCountAll({
      where,
      include: [{ model: db.ResourceType, as: 'type' }],
      order: [['publishedDate', 'DESC']],
      limit,
      offset
    });

    res.json({
      resources: rows,
      totalCount: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get the single featured resource (public)
router.get('/resources/featured', async (req, res) => {
  try {
    const featured = await db.Resource.findOne({
      where: { status: 'published', isFeatured: true },
      include: [{ model: db.ResourceType, as: 'type' }],
      order: [['publishedDate', 'DESC']]
    });
    res.json(featured);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get 3 random older resources (Page 2+) for discovery (public)
router.get('/resources/archive', async (req, res) => {
  try {
    // 1. Find the 9 latest resources that are on Page 1
    const latest = await db.Resource.findAll({
      where: { status: 'published' },
      attributes: ['id'],
      order: [['publishedDate', 'DESC']],
      limit: 9
    });
    const latestIds = latest.map(l => l.id);

    // 2. Fetch 3 random resources NOT in the latest IDs and NOT the featured resource
    let archive = await db.Resource.findAll({
      where: { 
        status: 'published',
        id: { [Op.notIn]: latestIds },
        isFeatured: { [Op.not]: true }
      },
      include: [{ model: db.ResourceType, as: 'type' }],
      order: db.sequelize.random(),
      limit: 3
    });

    // 3. Fallback: If archive is too small, pull random from total pool (still excluding featured)
    if (archive.length < 3) {
      archive = await db.Resource.findAll({
        where: { 
          status: 'published',
          isFeatured: { [Op.not]: true }
        },
        include: [{ model: db.ResourceType, as: 'type' }],
        order: db.sequelize.random(),
        limit: 3
      });
    }

    res.json(archive);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin-only endpoint for full list (Includes drafts & Paginated)
router.get('/admin/resources', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Resource.findAndCountAll({
      include: [{ model: db.ResourceType, as: 'type' }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      resources: rows,
      totalCount: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/resources', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    // Phase 1 Featured Logic Constraint
    if (req.body.isFeatured) {
      await db.Resource.update({ isFeatured: false }, { where: { isFeatured: true }, transaction });
    }
    
    const resource = await db.Resource.create(req.body, { transaction });
    await transaction.commit();
    res.status(201).json(resource);
  } catch (err) { 
    await transaction.rollback();
    res.status(500).json({ error: err.message }); 
  }
});

router.put('/resources/:id', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    // Feature Logic Constraint on Update
    if (req.body.isFeatured) {
      await db.Resource.update({ isFeatured: false }, { where: { isFeatured: true }, transaction });
    }
    
    const resourceUpdate = { ...req.body };
    // Prevent accidental ID or createdAt overrides if they were sent
    delete resourceUpdate.id;
    
    await db.Resource.update(resourceUpdate, { where: { id: req.params.id }, transaction });
    const updated = await db.Resource.findByPk(req.params.id, { 
      transaction,
      include: [{ model: db.ResourceType, as: 'type' }]
    });
    
    await transaction.commit();
    res.json(updated);
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
});

router.delete('/resources/:id', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  try {
    await db.Resource.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Resource deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- PARTNERS --- //
// Public: Get all approved partners
router.get('/partners', async (req, res) => {
  try {
    const partners = await db.Partner.findAll({
      where: { status: 'approved' },
      order: [['createdAt', 'DESC']]
    });
    res.json(partners);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/partners', upload.single('logo'), async (req, res) => {
  console.log('--- Partner Submission Debug ---');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body:', req.body);
  console.log('File:', req.file);
  try {
    if (!req.body) {
      throw new Error('Request body is undefined. Check Multer configuration.');
    }
    const { businessName, websiteUrl, contactEmail } = req.body;

    // Check for duplicates
    const existingName = await db.Partner.findOne({ where: { businessName } });
    if (existingName) return res.status(409).json({ error: 'This business name is already registered.' });

    const existingUrl = await db.Partner.findOne({ where: { websiteUrl } });
    if (existingUrl) return res.status(409).json({ error: 'This website is already registered.' });

    const existingEmail = await db.Partner.findOne({ where: { contactEmail } });
    if (existingEmail) return res.status(409).json({ error: 'This contact email is already in use.' });

    let logoUrl = null;
    if (req.file) {
      logoUrl = `/uploads/partner/${req.file.filename}`;
    } else if (req.body.logoUrl) {
      logoUrl = req.body.logoUrl;
    } else {
      return res.status(400).json({ error: 'Company logo is required.' });
    }

    const partner = await db.Partner.create({
      ...req.body,
      logoUrl,
      status: 'pending' 
    });
    res.status(201).json(partner);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: Get all partners (auth required)
router.get('/admin/partners', authMiddleware, restrictTo('super_admin'), async (req, res) => {
  try {
    const partners = await db.Partner.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(partners);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: Update partner (Approve/Reject/Edit)
router.patch('/admin/partners/:id', authMiddleware, restrictTo('super_admin'), upload.single('logo'), async (req, res) => {
  try {
    const id = req.params.id;
    const partner = await db.Partner.findByPk(id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const updates = { ...req.body };
    const { businessName, websiteUrl, contactEmail } = updates;

    // Uniqueness checks (excluding current partner)
    if (businessName && businessName !== partner.businessName) {
      const exists = await db.Partner.findOne({ where: { businessName, id: { [Op.ne]: id } } });
      if (exists) return res.status(409).json({ error: 'This business name is already registered.' });
    }

    if (websiteUrl && websiteUrl !== partner.websiteUrl) {
      const exists = await db.Partner.findOne({ where: { websiteUrl, id: { [Op.ne]: id } } });
      if (exists) return res.status(409).json({ error: 'This website is already registered.' });
    }

    if (contactEmail && contactEmail !== partner.contactEmail) {
      const exists = await db.Partner.findOne({ where: { contactEmail, id: { [Op.ne]: id } } });
      if (exists) return res.status(409).json({ error: 'This contact email is already in use.' });
    }

    // Handle logo update
    if (req.file) {
      updates.logoUrl = `/uploads/partner/${req.file.filename}`;
    } else if (req.body.logoUrl) {
      updates.logoUrl = req.body.logoUrl;
    }

    await partner.update(updates);
    res.json(partner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete partner
router.delete('/admin/partners/:id', authMiddleware, restrictTo('super_admin'), async (req, res) => {
  try {
    await db.Partner.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Partner deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ADMIN MANAGEMENT (Super Admin Only) --- //
router.get('/admin-users', authMiddleware, restrictTo('super_admin'), async (req, res) => {
  try {
    const users = await db.AdminUser.findAll({ 
      attributes: ['id', 'email', 'role', 'fullName', 'phoneNumber', 'isVerified', 'isActive', 'createdAt'] 
    });
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/workers/search', authMiddleware, restrictTo('super_admin'), async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);
    
    const workers = await db.AdminUser.findAll({
      where: {
        role: 'worker',
        email: { [Op.like]: `${query}%` }
      },
      attributes: ['id', 'email'],
      limit: 10
    });
    res.json(workers);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/admin-users', authMiddleware, restrictTo('super_admin'), async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const exists = await db.AdminUser.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: 'User already exists' });
    
    const isWorker = role === 'worker';
    const isVerified = !isWorker; // Admins are pre-verified, workers need email verification
    
    let verificationToken = null;
    let verificationExpires = null;

    if (isWorker) {
      verificationToken = crypto.randomBytes(32).toString('hex');
      verificationExpires = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now
    }

    const user = await db.AdminUser.create({ 
      email, 
      passwordHash: password, // Temporary password
      role: role || 'worker',
      isVerified,
      verificationToken,
      verificationExpires,
      mustChangePassword: true,
      isProfileComplete: false
    });

    // Send verification email if worker
    if (isWorker) {
      try {
        await mailer.sendVerificationEmail(email, verificationToken);
      } catch (mailError) {
        console.error('📧 Email Send Failed:', mailError);
        // We still created the user, but admin should be notified email failed
        return res.status(201).json({ 
          id: user.id, 
          email: user.email, 
          role: user.role, 
          isVerified: user.isVerified,
          warning: 'User created but verification email failed to send.'
        });
      }
    }

    res.status(201).json({ id: user.id, email: user.email, role: user.role, isVerified: user.isVerified });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/admin-users/:id', authMiddleware, restrictTo('super_admin'), async (req, res) => {
  try {
    // Prevent self-deletion
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }
    
    await db.AdminUser.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Administrator deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/admin-users/:id', authMiddleware, restrictTo('super_admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const id = req.params.id;

    // Prevent self-demotion
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'You cannot change your own role. This prevents accidental lockout.' });
    }

    if (!['admin', 'super_admin', 'worker'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    const user = await db.AdminUser.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully.', user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await db.AdminUser.findByPk(req.user.id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return res.status(400).json({ error: 'Current password incorrect' });
    
    user.passwordHash = newPassword; // Hooks will hash this
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Worker Profile Completion / Update
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const { fullName, phoneNumber, address, zipCode } = req.body;
    
    // Basic validation
    if (!fullName || !phoneNumber) {
      return res.status(400).json({ error: 'Full Name and Phone Number are mandatory.' });
    }

    // Sanitize input (basic prevention for malicious characters)
    const sanitize = (str) => str ? str.replace(/[<>]/g, '') : '';
    
    const user = await db.AdminUser.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.fullName = sanitize(fullName);
    user.phoneNumber = sanitize(phoneNumber);
    user.address = sanitize(address);
    user.zipCode = sanitize(zipCode);
    user.isVerified = true; // Completing profile marks worker as verified

    await user.save();
    res.json({ message: 'Profile updated successfully', user: { email: user.email, fullName: user.fullName, isVerified: user.isVerified } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- HELPERS --- //
const calculateWarningLevel = (receivedAt, dueAt, status) => {
  if (['completed', 'archived'].includes(status)) return 'green';
  
  const now = new Date();
  const start = new Date(receivedAt);
  const end = new Date(dueAt);
  
  if (now >= end) return 'red';
  
  const totalTime = end - start;
  const timeRemaining = end - now;
  const percentageRemaining = (timeRemaining / totalTime) * 100;
  
  if (percentageRemaining <= 20) return 'orange';
  if (percentageRemaining <= 50) return 'yellow';
  return 'green';
};

const logActivity = async (jobId, userName, action, details = null) => {
  try {
    await db.NoticeBoardActivity.create({
      jobId,
      userName: userName.split('@')[0],
      action,
      details
    });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};

// --- WORKER WORK HISTORY --- //
router.get('/worker/work-history', authMiddleware, restrictTo('worker', 'super_admin'), async (req, res) => {
  try {
    let where = { status: 'completed' };
    
    if (req.user.role === 'worker') {
      where.assignedTo = req.user.email;
    } else if (req.user.role === 'super_admin') {
      if (req.query.workerEmail && req.query.workerEmail !== 'all') {
        where.assignedTo = req.query.workerEmail;
      } else {
        // Show all completed jobs that have a worker assigned
        where.assignedTo = { [Op.ne]: null };
      }
    }

    const completedJobs = await db.NoticeBoardJob.findAll({
      where,
      order: [['completedAt', 'DESC']]
    });

    const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.projectFee || 0), 0);

    res.json({
      jobs: completedJobs,
      totalEarnings,
      completedCount: completedJobs.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- WORK NOTICE BOARD --- //
router.get('/admin/notice-board', authMiddleware, enforceProfileComplete, restrictTo('super_admin', 'worker'), async (req, res) => {
  try {
    let where = {};
    if (req.user.role === 'worker') {
      where = {
        assignedTo: req.user.email,
        status: { [Op.ne]: 'assigned' }
      };
      console.log(`📋 Worker fetching jobs: User=${req.user.email}`);
    }
    
    const jobs = await db.NoticeBoardJob.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    
    // Dynamically calculate warning levels on every fetch for live updates
    const updatedJobs = jobs.map(job => {
      const plainJob = job.get({ plain: true });
      plainJob.warningLevel = calculateWarningLevel(plainJob.receivedAt, plainJob.dueAt, plainJob.status);
      return plainJob;
    });
    
    res.json(updatedJobs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/admin/notice-board', authMiddleware, restrictTo('super_admin', 'worker'), jobUpload.array('files', 10), async (req, res) => {
  try {
    const { receivedAt, dueAt, status, services, assignedTo } = req.body;
    
    // Validate status vs assignment
    if (status === 'assigned' && !assignedTo) {
      return res.status(400).json({ error: 'A worker must be assigned to set status to Assigned.' });
    }

    // Parse services if it's a string (from FormData)
    let parsedServices = services;
    if (typeof services === 'string') {
      try { parsedServices = JSON.parse(services); } catch (e) { parsedServices = {}; }
    }

    let parsedProjectScope = req.body.projectScope;
    if (typeof parsedProjectScope === 'string') {
      try { parsedProjectScope = JSON.parse(parsedProjectScope); } catch (e) { parsedProjectScope = null; }
    }

    let parsedClientAssets = req.body.clientAssets;
    if (typeof parsedClientAssets === 'string') {
      try { parsedClientAssets = JSON.parse(parsedClientAssets); } catch (e) { parsedClientAssets = null; }
    }

    let parsedOptionalAddOns = req.body.optionalAddOns;
    if (typeof parsedOptionalAddOns === 'string') {
      try { parsedOptionalAddOns = JSON.parse(parsedOptionalAddOns); } catch (e) { parsedOptionalAddOns = null; }
    }

    // Pre-calculate warning level for storage (though GET recalculates it)
    const warningLevel = calculateWarningLevel(receivedAt || new Date(), dueAt, status || 'new');
    
    const job = await db.NoticeBoardJob.create({
      ...req.body,
      services: parsedServices,
      projectScope: parsedProjectScope,
      clientAssets: parsedClientAssets,
      optionalAddOns: parsedOptionalAddOns,
      warningLevel,
      assignedBy: req.user.email // Automatically set the assigner
    });

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      await Promise.all(req.files.map(file => {
        return db.NoticeBoardFile.create({
          jobId: job.id,
          fileName: file.originalname,
          filePath: `/uploads/jobs/${file.filename}`,
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadedBy: req.user.email
        });
      }));
      await logActivity(job.id, req.user.email, 'Files Attached', `${req.files.length} initial files uploaded.`);
    }

    await logActivity(job.id, req.user.email, 'Job Created', `Title: ${job.title}`);
    
    // Send Onboarding Email to Client (Skip if it's an auto-saved draft or explicit draft)
    const isDraft = req.body.isDraft === 'true' || req.body.isDraft === true || req.body.isAutoSave === 'true' || req.body.isAutoSave === true;
    if (job.clientEmail && !isDraft) {
      const { sendClientOnboardingEmail } = require('../utils/mailer');
      sendClientOnboardingEmail(job).catch(err => console.error('❌ Admin onboarding email failed:', err));

      // Trigger "In Production" email immediately if created in assigned/in_progress state
      if (job.status === 'assigned' || job.status === 'in_progress') {
        handleClientPhaseEmail('new', job.status, job).catch(err => console.error('❌ Admin initial production email failed:', err));
      }
    }
    
    // Notify worker if assigned
    if (job.assignedTo) {
      await createNotification(
        job.assignedTo,
        'assignment',
        `New assignment: ${job.category || job.title}`,
        job.id,
        req.user.email,
        { snapshot: getJobSnapshot(job) }
      );
    }

    res.status(201).json(job);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/admin/notice-board/:id', authMiddleware, restrictTo('super_admin', 'worker'), blockUnpaidCustomQuote, jobUpload.array('files', 10), async (req, res) => {
  try {
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    const updateData = { ...req.body };
    const oldStatus = job.status;
    const oldWorker = job.assignedTo;

    // Parse services if it's a string (from FormData)
    if (typeof updateData.services === 'string') {
      try { updateData.services = JSON.parse(updateData.services); } catch (e) { delete updateData.services; }
    }

    if (typeof updateData.projectScope === 'string') {
      try { updateData.projectScope = JSON.parse(updateData.projectScope); } catch (e) { delete updateData.projectScope; }
    }

    if (typeof updateData.clientAssets === 'string') {
      try { updateData.clientAssets = JSON.parse(updateData.clientAssets); } catch (e) { delete updateData.clientAssets; }
    }

    if (typeof updateData.optionalAddOns === 'string') {
      try { updateData.optionalAddOns = JSON.parse(updateData.optionalAddOns); } catch (e) { delete updateData.optionalAddOns; }
    }
    
    // Handle status transitions and validation
    if (updateData.status && updateData.status !== oldStatus) {
      // Prevent assigned status without a worker
      const targetWorker = updateData.assignedTo || oldWorker;
      if (updateData.status === 'assigned' && !targetWorker) {
        return res.status(400).json({ error: 'A worker must be assigned to set status to Assigned.' });
      }

      await logActivity(job.id, req.user.email, 'Status Changed', `From ${oldStatus} to ${updateData.status}`);
      if (updateData.status === 'checked_out' && !job.checkedOutAt) {
        updateData.checkedOutAt = new Date();
      }
      if (updateData.status === 'completed' && !job.completedAt) {
        updateData.completedAt = new Date();
      }
    }

    if (updateData.assignedTo && updateData.assignedTo !== oldWorker) {
      await logActivity(job.id, req.user.email, 'Worker Assigned', `Assigned to ${updateData.assignedTo}`);
    }

    // Handle newly uploaded files during patch
    if (req.files && req.files.length > 0) {
      await Promise.all(req.files.map(file => {
        return db.NoticeBoardFile.create({
          jobId: job.id,
          fileName: file.originalname,
          filePath: `/uploads/jobs/${file.filename}`,
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadedBy: req.user.email
        });
      }));
      await logActivity(job.id, req.user.email, 'Files Added', `${req.files.length} additional files uploaded.`);
    }
    
    await job.update(updateData);
    
    // Trigger phase change email if status changed
    if (updateData.status && updateData.status !== oldStatus) {
      await handleClientPhaseEmail(oldStatus, updateData.status, job);
    }
    
    // Notify worker if assignment changed or status set to assigned
    // BUT only if not already assigned (prevents double notification on create+patch)
    const assignmentChanged = updateData.assignedTo && updateData.assignedTo !== oldWorker;
    const statusSetToAssigned = updateData.status === 'assigned' && oldStatus !== 'assigned';
    
    if (assignmentChanged || statusSetToAssigned) {
      const recipient = updateData.assignedTo || job.assignedTo;
      if (recipient) {
        await createNotification(
          recipient,
          'assignment',
          `New assignment: ${job.category || job.title}`,
          job.id,
          req.user.email,
          { snapshot: getJobSnapshot(job) }
        );
      }
    }

    // Handle worker removal via edit form (assignedTo cleared)
    if (oldWorker && (!updateData.assignedTo || updateData.assignedTo === '') && updateData.assignedTo !== undefined) {
      // Mark pending assignment notifications as cancelled
      await db.NoticeBoardNotification.update(
        { actionStatus: 'cancelled' },
        { where: { jobId: job.id, sentTo: oldWorker, type: 'assignment', actionStatus: 'pending' } }
      );

      // Send cancellation notification to the worker
      await createNotification(
        oldWorker,
        'cancelled',
        `Assignment Cancelled: ${job.category || job.title}`,
        job.id,
        req.user.email,
        { adminEmail: req.user.email, snapshot: getJobSnapshot(job) }
      );
    }
    
    // Return recalculated job
    const plainJob = job.get({ plain: true });
    plainJob.warningLevel = calculateWarningLevel(plainJob.receivedAt, plainJob.dueAt, plainJob.status);
    
    res.json(plainJob);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/admin/notice-board/:id/assign', authMiddleware, restrictTo('super_admin'), blockUnpaidCustomQuote, async (req, res) => {
  try {
    const { workerEmail } = req.body;
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    if (job.status === 'completed') {
      return res.status(400).json({ error: 'Cannot reassign a completed job.' });
    }

    const oldWorker = job.assignedTo;
    if (oldWorker === workerEmail) {
      return res.status(400).json({ error: 'This worker is already assigned.' });
    }

    const oldStatus = job.status;
    // Update job
    await job.update({ 
      assignedTo: workerEmail,
      status: 'assigned', // Reset status so new worker must accept
      assignedBy: req.user.email
    });

    await handleClientPhaseEmail(oldStatus, 'assigned', job);

    await logActivity(job.id, req.user.email, 'Worker Reassigned', `From ${oldWorker || 'None'} to ${workerEmail}`);

    // Notify New Worker
    await createNotification(
      workerEmail,
      'assignment',
      `New assignment: ${job.category || job.title}`,
      job.id,
      req.user.email,
      { snapshot: getJobSnapshot(job) }
    );

    res.json({ message: 'Worker assigned successfully', status: 'assigned' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/admin/notice-board/:id/unassign', authMiddleware, restrictTo('super_admin'), blockUnpaidCustomQuote, async (req, res) => {
  try {
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    if (job.status === 'completed') {
      return res.status(400).json({ error: 'Cannot remove worker from a completed job.' });
    }

    const oldWorker = job.assignedTo;
    await job.update({ 
      assignedTo: null,
      status: 'new'
    });

    await logActivity(job.id, req.user.email, 'Worker Removed', `Worker ${oldWorker} was removed from the job.`);

    // Notify Worker of Cancellation
    if (oldWorker) {
      await createNotification(
        oldWorker,
        'cancelled',
        `Assignment Cancelled: ${job.category || job.title}`,
        job.id,
        req.user.email,
        { adminEmail: req.user.email, snapshot: getJobSnapshot(job) }
      );

      // Mark previous pending assignment notifications as cancelled
      await db.NoticeBoardNotification.update(
        { actionStatus: 'cancelled' },
        { where: { jobId: job.id, sentTo: oldWorker, type: 'assignment', actionStatus: 'pending' } }
      );
    }

    res.json({ message: 'Worker removed successfully', status: 'new' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/admin/notice-board/:id/accept', authMiddleware, restrictTo('worker'), blockUnpaidCustomQuote, async (req, res) => {
  try {
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    if (job.assignedTo !== req.user.email) {
      return res.status(403).json({ error: 'You are not assigned to this job.' });
    }

    if (job.status !== 'assigned') {
      return res.status(400).json({ error: 'Job is not in assigned state.' });
    }

    await job.update({ status: 'in_progress' });
    await logActivity(job.id, req.user.email, 'Job Accepted', `Worker accepted assignment.`);

    // Mark notification as accepted
    await db.NoticeBoardNotification.update(
      { actionStatus: 'accepted' },
      { where: { jobId: job.id, sentTo: req.user.email, type: 'assignment', actionStatus: 'pending' } }
    );

    // Notify Super Admin
    await createNotification(
      job.assignedBy || 'admin@scalelinkalliance.com', // Fallback to a default admin email if not set
      'acceptance',
      `Assignment Accepted: ${job.category || job.title}`,
      job.id,
      req.user.email,
      { workerName: req.user.fullName || req.user.email, workerEmail: req.user.email, snapshot: getJobSnapshot(job) }
    );

    res.json({ message: 'Job accepted', status: 'in_progress' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/admin/notice-board/:id/decline', authMiddleware, restrictTo('worker'), blockUnpaidCustomQuote, async (req, res) => {
  try {
    const { reason } = req.body;
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    if (job.assignedTo !== req.user.email) {
      return res.status(403).json({ error: 'You are not assigned to this job.' });
    }

    if (job.status !== 'assigned') {
      return res.status(400).json({ error: 'Only pending assignments can be declined.' });
    }

    // Reset job to new
    await job.update({ 
      assignedTo: null,
      status: 'new'
    });

    // Mark notification as declined
    await db.NoticeBoardNotification.update(
      { actionStatus: 'declined' },
      { where: { jobId: job.id, sentTo: req.user.email, type: 'assignment', actionStatus: 'pending' } }
    );

    await logActivity(job.id, req.user.email, 'Job Declined', `Worker declined assignment. Reason: ${reason || 'None provided'}`);

    // Notify Admin who assigned the job
    await createNotification(
      job.assignedBy || 'admin@scalelinkalliance.com',
      'returned',
      `Assignment Declined: ${job.category || job.title}`,
      job.id,
      req.user.email,
      { workerEmail: req.user.email, reason: reason || 'No reason provided', snapshot: getJobSnapshot(job) }
    );

    res.json({ message: 'Assignment declined', status: 'new' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/admin/notice-board/:id/checkout', authMiddleware, restrictTo('worker'), blockUnpaidCustomQuote, async (req, res) => {
  try {
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    if (job.assignedTo !== req.user.email) {
      return res.status(403).json({ error: 'You are not assigned to this job.' });
    }

    if (job.status !== 'in_progress') {
      return res.status(400).json({ error: 'Job must be In Progress to check out.' });
    }

    await job.update({ 
      status: 'checked_out',
      checkedOutAt: new Date()
    });
    
    await logActivity(job.id, req.user.email, 'Job Checked Out', `Worker finished work and checked out.`);

    // Notify Super Admin
    await createNotification(
      job.assignedBy || 'admin@scalelinkalliance.com',
      'check_out',
      `Worker ${req.user.email} has checked out the job: ${job.title}`,
      job.id,
      req.user.email
    );

    res.json({ message: 'Job checked out', status: 'checked_out' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/admin/notice-board/:id/review', authMiddleware, restrictTo('super_admin'), blockUnpaidCustomQuote, async (req, res) => {
  try {
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    if (job.status !== 'checked_out') {
      return res.status(400).json({ error: 'Job must be Checked Out to start review.' });
    }

    const oldStatus = job.status;
    await job.update({ status: 'waiting_review' });
    await handleClientPhaseEmail(oldStatus, 'waiting_review', job);
    await logActivity(job.id, req.user.email, 'Review Started', `Admin moved job to Waiting Review.`);

    // Notify Worker
    if (job.assignedTo) {
      await createNotification(
        job.assignedTo,
        'review',
        `Your work on "${job.title}" is now under review.`,
        job.id,
        req.user.email
      );
    }

    res.json({ message: 'Review started', status: 'waiting_review' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/admin/notice-board/:id/approve', authMiddleware, restrictTo('super_admin'), blockUnpaidCustomQuote, async (req, res) => {
  try {
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    const oldStatus = job.status;
    await job.update({ 
      status: 'completed',
      completedAt: new Date()
    });
    
    await handleClientPhaseEmail(oldStatus, 'completed', job);
    
    await logActivity(job.id, req.user.email, 'Job Approved', `Admin approved the work and marked as Completed.`);

    // Notify Worker
    if (job.assignedTo) {
      await createNotification(
        job.assignedTo,
        'completed',
        `Congratulations! Your work on "${job.title}" has been approved.`,
        job.id,
        req.user.email
      );
    }

    res.json({ message: 'Job approved', status: 'completed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/admin/notice-board/:id/return', authMiddleware, restrictTo('super_admin'), blockUnpaidCustomQuote, async (req, res) => {
  try {
    const { feedback } = req.body;
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    await job.update({ status: 'in_progress' });
    await logActivity(job.id, req.user.email, 'Job Returned', `Admin returned work to In Progress. Feedback: ${feedback || 'None'}`);

    // Notify Worker
    if (job.assignedTo) {
      await createNotification(
        job.assignedTo,
        'returned',
        `Job "${job.title}" has been returned for revisions. Feedback: ${feedback || 'See comments.'}`,
        job.id,
        req.user.email
      );
    }

    res.json({ message: 'Job returned', status: 'in_progress' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/admin/notice-board/:id', authMiddleware, restrictTo('super_admin', 'worker'), async (req, res) => {
  try {
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Find and delete physical files from disk
    const files = await db.NoticeBoardFile.findAll({ where: { jobId: job.id } });
    for (const file of files) {
      const fullPath = path.join(__dirname, '..', file.filePath);
      try {
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      } catch (unlinkErr) {
        console.error(`Failed to delete physical file: ${fullPath}`, unlinkErr);
      }
    }

    // Manually delete all related records (SQLite doesn't reliably cascade)
    await db.NoticeBoardFile.destroy({ where: { jobId: job.id } });
    await db.NoticeBoardComment.destroy({ where: { jobId: job.id } });
    await db.NoticeBoardActivity.destroy({ where: { jobId: job.id } });
    await db.NoticeBoardNotification.destroy({ where: { jobId: job.id } });

    await job.destroy();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- JOB FILES --- //
router.get('/admin/notice-board/:id/files', authMiddleware, restrictTo('super_admin', 'worker'), async (req, res) => {
  try {
    const files = await db.NoticeBoardFile.findAll({ where: { jobId: req.params.id } });
    res.json(files);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/admin/notice-board/:id/files', authMiddleware, restrictTo('super_admin', 'worker'), blockUnpaidCustomQuote, jobUpload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
    
    const { visibility } = req.body;
    const targetVisibility = visibility || 'internal';
    const targetRole = req.user.role === 'super_admin' ? 'super_admin' : 'worker';

    const fileRecords = await Promise.all(req.files.map(file => {
      return db.NoticeBoardFile.create({
        jobId: req.params.id,
        fileName: file.originalname,
        filePath: `/uploads/jobs/${file.filename}`,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: req.user.email,
        visibility: targetVisibility,
        uploadedByRole: targetRole
      });
    }));
    
    res.json(fileRecords);
    
    // Log file upload
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    await logActivity(req.params.id, req.user.email, 'Files Uploaded', `${req.files.length} files attached.`);
    
    if (job) {
      // Client Notification for Public Assets
      if (['client', 'both'].includes(targetVisibility)) {
        if (job.clientEmail) {
          const { sendClientNotificationEmail } = require('../utils/mailer');
          const clientSubject = `New Assets Uploaded to Your Project - ScaleLink Alliance`;
          const clientTitle = `Assets Uploaded`;
          const clientMsg = `Our team has uploaded ${req.files.length} new file asset(s) to your project "${job.title.replace(/Request Custom Quote - /g, '')}".`;
          sendClientNotificationEmail(job.clientEmail, clientSubject, clientTitle, clientMsg, job).catch(err => {
            console.error('❌ Failed to email client portal file alert:', err);
          });
        }
      }
      
      // Worker Notifications for Internal Assets
      if (['internal', 'both'].includes(targetVisibility)) {
        if (job.assignedTo && job.assignedTo !== req.user.email) {
          await createNotification(
            job.assignedTo,
            'file',
            `${req.user.email.split('@')[0]} uploaded ${req.files.length} new file(s) to "${job.title}".`,
            job.id,
            req.user.email
          );
        }
        // Also notify admins if a worker uploaded files
        if (req.user.role === 'worker') {
          const admins = await db.AdminUser.findAll({ where: { role: 'super_admin' } });
          for (const admin of admins) {
            await createNotification(
              admin.email,
              'file',
              `Worker ${req.user.email.split('@')[0]} uploaded new files to "${job.title}".`,
              job.id,
              req.user.email
            );
          }
        }
      }
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/admin/notice-board/files/:fileId', authMiddleware, restrictTo('super_admin', 'worker'), async (req, res) => {
  try {
    const file = await db.NoticeBoardFile.findByPk(req.params.fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    
    const fullPath = path.join(__dirname, '..', file.filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    
    await file.destroy();
    res.json({ message: 'File deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- JOB COMMENTS --- //
router.get('/admin/notice-board/:id/comments', authMiddleware, restrictTo('super_admin', 'worker'), async (req, res) => {
  try {
    const comments = await db.NoticeBoardComment.findAll({ 
      where: { jobId: req.params.id },
      order: [['createdAt', 'ASC']]
    });
    res.json(comments);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/admin/notice-board/:id/comments', authMiddleware, restrictTo('super_admin', 'worker'), blockUnpaidCustomQuote, async (req, res) => {
  try {
    const { comment, visibility } = req.body;
    if (!comment) return res.status(400).json({ error: 'Comment text is required' });
    
    const user = await db.AdminUser.findOne({ where: { email: req.user.email } });
    const targetVisibility = visibility || 'internal';
    const targetRole = req.user.role === 'super_admin' ? 'super_admin' : 'worker';
    
    const newComment = await db.NoticeBoardComment.create({
      jobId: req.params.id,
      userName: user ? user.email.split('@')[0] : 'System',
      userEmail: req.user.email,
      comment,
      visibility: targetVisibility,
      fromUserRole: targetRole
    });
    
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    
    if (job) {
      if (targetVisibility === 'client') {
        // Send email alert to client regarding the new message
        if (job.clientEmail) {
          const { sendClientNotificationEmail } = require('../utils/mailer');
          const clientSubject = `New Update Regarding Your Project - ScaleLink Alliance`;
          const clientTitle = `New Message from Rep`;
          const clientMsg = `Our team has sent a new update regarding your project "${job.title.replace(/Request Custom Quote - /g, '')}":\n\n"${comment}"`;
          sendClientNotificationEmail(job.clientEmail, clientSubject, clientTitle, clientMsg, job).catch(err => {
            console.error('❌ Failed to email client portal message alert:', err);
          });
        }
      } else {
        // Internal Visibility: Keep existing Admin-Worker alerts
        if (job.assignedTo && job.assignedTo !== req.user.email) {
          await createNotification(
            job.assignedTo,
            'comment',
            `${req.user.email.split('@')[0]} commented on "${job.title}": "${comment.substring(0, 50)}${comment.length > 50 ? '...' : ''}"`,
            job.id,
            req.user.email
          );
        }
        if (req.user.role === 'worker') {
          const admins = await db.AdminUser.findAll({ where: { role: 'super_admin' } });
          for (const admin of admins) {
            await createNotification(
              admin.email,
              'comment',
              `Worker ${req.user.email.split('@')[0]} commented on "${job.title}".`,
              job.id,
              req.user.email
            );
          }
        }
      }
    }

    res.status(201).json(newComment);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ANALYTICS & REPORTS --- //
router.get('/admin/analytics', authMiddleware, async (req, res) => {
  try {
    const jobs = await db.NoticeBoardJob.findAll();

    const stats = {
      total: jobs.length,
      byStatus: {},
      byWorker: {},
      avgCompletionTime: 0,
      completionRate: 0,
      overdueCount: 0
    };

    let totalCompTime = 0;
    let completedCount = 0;

    jobs.forEach(job => {
      // By Status
      stats.byStatus[job.status] = (stats.byStatus[job.status] || 0) + 1;
      
      // By Worker
      if (job.assignedTo) {
        const workerKey = job.assignedTo;
        if (!stats.byWorker[workerKey]) stats.byWorker[workerKey] = { total: 0, completed: 0, overdue: 0 };
        stats.byWorker[workerKey].total++;
        if (job.status === 'completed') stats.byWorker[workerKey].completed++;
        if (job.status !== 'completed' && new Date(job.dueAt) < new Date()) stats.byWorker[workerKey].overdue++;
      }

      // Overdue
      if (job.status !== 'completed' && new Date(job.dueAt) < new Date()) stats.overdueCount++;

      // Avg Time
      if (job.status === 'completed' && job.completedAt && job.receivedAt) {
        completedCount++;
        totalCompTime += (new Date(job.completedAt) - new Date(job.receivedAt));
      }
    });

    stats.avgCompletionTime = completedCount > 0 ? (totalCompTime / completedCount / (1000 * 60 * 60)).toFixed(1) : 0; // Hours
    stats.completionRate = jobs.length > 0 ? ((completedCount / jobs.length) * 100).toFixed(1) : 0;

    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ACTIVITY & NOTIFICATIONS --- //
router.get('/admin/notice-board/:id/activities', authMiddleware, restrictTo('super_admin', 'worker'), async (req, res) => {
  try {
    const activities = await db.NoticeBoardActivity.findAll({ 
      where: { jobId: req.params.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(activities);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/admin/notice-board/reminders/check', authMiddleware, restrictTo('super_admin', 'worker'), async (req, res) => {
  try {
    const now = new Date();
    const future24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const future2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const activeJobs = await db.NoticeBoardJob.findAll({
      where: {
        status: { [Op.notIn]: ['completed', 'archived'] },
        dueAt: { [Op.gt]: now }
      }
    });

    const pendingAlerts = [];

    for (const job of activeJobs) {
      const dueTime = new Date(job.dueAt).getTime();
      const timeLeft = dueTime - now.getTime();

      // Check 24h reminder
      if (timeLeft <= 24 * 60 * 60 * 1000 && timeLeft > 2 * 60 * 60 * 1000) {
        const alreadySent = await db.NoticeBoardNotification.findOne({ where: { jobId: job.id, type: '24h_reminder' } });
        if (!alreadySent) pendingAlerts.push({ job, type: '24h_reminder' });
      }

      // Check 2h reminder
      if (timeLeft <= 2 * 60 * 60 * 1000) {
        const alreadySent = await db.NoticeBoardNotification.findOne({ where: { jobId: job.id, type: '2h_reminder' } });
        if (!alreadySent) pendingAlerts.push({ job, type: '2h_reminder' });
      }
    }

    res.json(pendingAlerts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/admin/notice-board/reminders/mark-sent', authMiddleware, restrictTo('super_admin', 'worker'), async (req, res) => {
  try {
    const { jobId, type, sentTo } = req.body;
    await db.NoticeBoardNotification.create({ jobId, type, sentTo });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST: Send Quote Proposal to Client (with Stripe Checkout Session generation)
router.post('/admin/notice-board/:id/send-quote', authMiddleware, restrictTo('super_admin'), async (req, res) => {
  try {
    const job = await db.NoticeBoardJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found.' });

    if (!job.clientEmail) {
      return res.status(400).json({ error: 'Client email is required to send a quote.' });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    // Default currency to USD if not set
    const currency = (job.currency || 'usd').toLowerCase();
    const netQuoteAmount = Math.max(0, (job.customQuoteAmount || 0) - (job.specialDiscount || 0));
    const depositAmount = job.depositRequired !== null && job.depositRequired !== undefined ? job.depositRequired : netQuoteAmount;

    if (depositAmount <= 0) {
      return res.status(400).json({ error: 'A valid custom quote amount and deposit amount are required before sending a quote.' });
    }

    // 1. Create a Stripe Checkout Session for the deposit
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency,
          product_data: {
            name: `Deposit for Project: ${job.title}`,
            description: `Total Quote: $${((job.customQuoteAmount || 0) / 100).toLocaleString()}${job.specialDiscount ? ` (Less Special Discount: -$${(job.specialDiscount / 100).toLocaleString()})` : ''}. Deposit Required: $${(depositAmount / 100).toLocaleString()}`,
          },
          unit_amount: depositAmount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/track-job/${job.clientToken}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/track-job/${job.clientToken}`,
      metadata: {
        jobId: job.id,
        clientToken: job.clientToken
      }
    });

    // 2. Save Checkout URL & Session ID to Job
    await job.update({
      stripeCheckoutUrl: session.url,
      stripeSessionId: session.id,
      quoteStatus: 'quote_sent'
    });

    // 3. Send email to client
    await mailer.sendQuoteEmail(job);

    // 4. Log NoticeBoardActivity
    await db.NoticeBoardActivity.create({
      jobId: job.id,
      userName: req.user.email.split('@')[0],
      action: 'Quote Sent',
      details: `Quote sent to client at ${job.clientEmail} (Stripe Checkout Session: ${session.id})`
    });

    res.json({
      success: true,
      message: 'Quote proposal sent successfully.',
      stripeCheckoutUrl: session.url
    });
  } catch (err) {
    console.error('❌ Error sending quote:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
