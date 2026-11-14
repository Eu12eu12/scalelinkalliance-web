// routes/promotions.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/auth');
const { isPromotionActive, calculateOrderPricing } = require('../utils/pricingEngine');

// Role authorization helper
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access Denied. You do not have permission to perform this action.' });
    }
    next();
  };
};

// ==========================================
// --- PUBLIC PROMOTION ENDPOINTS ---
// ==========================================

/**
 * GET /active or /public/active
 * Returns the currently active holiday promotion, or { active: false, promotion: null }
 */
const getActivePromotionHandler = async (req, res) => {
  try {
    const now = new Date();

    const candidatePromotions = await db.HolidayPromotion.findAll({
      where: {
        status: {
          [Op.in]: ['active', 'scheduled']
        }
      },
      order: [['startDate', 'ASC']]
    });

    const activePromo = candidatePromotions.find(p => isPromotionActive(p, now));

    if (!activePromo) {
      return res.json({
        active: false,
        promotion: null
      });
    }

    res.json({
      active: true,
      promotion: {
        id: activePromo.id,
        slug: activePromo.slug,
        name: activePromo.name,
        holidayName: activePromo.holidayName,
        mainHeading: activePromo.mainHeading,
        subheading: activePromo.subheading,
        bannerText: activePromo.bannerText,
        showBanner: activePromo.showBanner,
        buttonText: activePromo.buttonText,
        buttonDestination: activePromo.buttonDestination,
        secondaryButtonText: activePromo.secondaryButtonText,
        secondaryButtonDestination: activePromo.secondaryButtonDestination,
        discountType: activePromo.discountType,
        discountValue: activePromo.discountValue,
        maxDiscount: activePromo.maxDiscount,
        currency: activePromo.currency,
        eligibleServices: activePromo.eligibleServices,
        excludedServices: activePromo.excludedServices,
        startDate: activePromo.startDate,
        endDate: activePromo.endDate,
        timezone: activePromo.timezone,
        holidayTheme: activePromo.holidayTheme,
        bannerImage: activePromo.bannerImage,
        mobileImage: activePromo.mobileImage,
        allowStacking: activePromo.allowStacking,
        termsAndConditions: activePromo.termsAndConditions
      }
    });
  } catch (err) {
    console.error('❌ Error fetching active promotion:', err);
    res.status(500).json({ error: 'Failed to retrieve active promotion' });
  }
};

router.get('/active', getActivePromotionHandler);
router.get('/public/active', getActivePromotionHandler);

/**
 * POST /track-interaction or /public/track-interaction
 * Anonymous tracking for banner clicks, landing visits, and inquiries (Section 9)
 */
const trackInteractionHandler = async (req, res) => {
  try {
    const { promotionId, type } = req.body;
    if (!promotionId || !type) {
      return res.status(400).json({ error: 'promotionId and type are required' });
    }

    const promotion = await db.HolidayPromotion.findByPk(promotionId);
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    if (type === 'banner_click') {
      await promotion.increment('bannerClicks');
    } else if (type === 'landing_visit') {
      await promotion.increment('landingPageVisits');
    } else if (type === 'inquiry') {
      await promotion.increment('inquiryCount');
    }

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error tracking promotion interaction:', err);
    res.status(500).json({ error: 'Failed to track interaction' });
  }
};

router.post('/track-interaction', trackInteractionHandler);
router.post('/public/track-interaction', trackInteractionHandler);

// ==========================================
// --- CMS ADMIN PROMOTION ENDPOINTS ---
// ==========================================

/**
 * GET /
 * List all campaigns with real-time conversion stats & audit logs
 */
router.get('/', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  try {
    const promotions = await db.HolidayPromotion.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.PromotionAuditLog,
          as: 'auditLogs',
          limit: 3,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    const now = new Date();

    const formatted = promotions.map(p => {
      const data = p.toJSON();
      let computedStatus = data.status;
      if (data.status === 'scheduled' && now >= new Date(data.startDate) && now <= new Date(data.endDate)) {
        computedStatus = 'active';
      } else if ((data.status === 'active' || data.status === 'scheduled') && now > new Date(data.endDate)) {
        computedStatus = 'expired';
      }

      return {
        ...data,
        computedStatus,
        isCurrentlyLive: isPromotionActive(p, now),
        totalDiscountGrantedDollars: ((data.totalDiscountGranted || 0) / 100).toFixed(2),
        totalRevenueGeneratedDollars: ((data.totalRevenueGenerated || 0) / 100).toFixed(2)
      };
    });

    res.json({ promotions: formatted });
  } catch (err) {
    console.error('❌ Error loading promotions list:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /:id
 * Get single promotion with complete audit trail
 */
router.get('/:id', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  try {
    const promotion = await db.HolidayPromotion.findByPk(req.params.id, {
      include: [
        {
          model: db.PromotionAuditLog,
          as: 'auditLogs',
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    const now = new Date();
    const data = promotion.toJSON();
    let computedStatus = data.status;
    if (data.status === 'scheduled' && now >= new Date(data.startDate) && now <= new Date(data.endDate)) {
      computedStatus = 'active';
    } else if ((data.status === 'active' || data.status === 'scheduled') && now > new Date(data.endDate)) {
      computedStatus = 'expired';
    }

    res.json({
      promotion: {
        ...data,
        computedStatus,
        isCurrentlyLive: isPromotionActive(promotion, now),
        totalDiscountGrantedDollars: ((data.totalDiscountGranted || 0) / 100).toFixed(2),
        totalRevenueGeneratedDollars: ((data.totalRevenueGenerated || 0) / 100).toFixed(2)
      }
    });
  } catch (err) {
    console.error('❌ Error fetching promotion details:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /
 * Create a new holiday promotion with validation & audit log (Section 5)
 */
router.post('/', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  try {
    const {
      name,
      holidayName,
      mainHeading,
      subheading,
      bannerText,
      showBanner,
      buttonText,
      buttonDestination,
      secondaryButtonText,
      secondaryButtonDestination,
      discountType,
      discountValue,
      maxDiscount,
      currency,
      eligibleServices,
      excludedServices,
      startDate,
      endDate,
      timezone,
      holidayTheme,
      bannerImage,
      mobileImage,
      allowStacking,
      status,
      termsAndConditions
    } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: 'Name, start date, and end date are required.' });
    }

    const promotion = await db.HolidayPromotion.create({
      name,
      holidayName: holidayName || 'General Holiday',
      mainHeading: mainHeading || 'Seasonal Promotion',
      subheading: subheading || '',
      bannerText: bannerText || name,
      showBanner: showBanner !== undefined ? Boolean(showBanner) : true,
      buttonText: buttonText || 'Claim Your Holiday Discount',
      buttonDestination: buttonDestination || '/holiday-offer',
      secondaryButtonText: secondaryButtonText || 'Get a Free Website Review',
      secondaryButtonDestination: secondaryButtonDestination || '/free-website-review',
      discountType: discountType || 'percentage',
      discountValue: discountValue !== undefined ? Number(discountValue) : 20.0,
      maxDiscount: maxDiscount !== undefined ? Number(maxDiscount) : 400.0,
      currency: currency || 'USD',
      eligibleServices: Array.isArray(eligibleServices) ? eligibleServices : [],
      excludedServices: Array.isArray(excludedServices) ? excludedServices : [],
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      timezone: timezone || 'America/Chicago',
      holidayTheme: holidayTheme || 'general_holiday',
      bannerImage: bannerImage || null,
      mobileImage: mobileImage || null,
      allowStacking: Boolean(allowStacking),
      status: status || 'draft',
      termsAndConditions: termsAndConditions || ''
    });

    await db.PromotionAuditLog.create({
      promotionId: promotion.id,
      adminEmail: req.user.email,
      action: 'Created',
      details: `Created campaign "${promotion.name}" with status "${promotion.status}".`,
      newValues: JSON.stringify(promotion.toJSON())
    });

    res.status(201).json({
      success: true,
      message: 'Holiday promotion created successfully.',
      promotion
    });
  } catch (err) {
    console.error('❌ Error creating holiday promotion:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /:id
 * Update an existing campaign and log changed fields in audit trail
 */
router.put('/:id', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  try {
    const promotion = await db.HolidayPromotion.findByPk(req.params.id);
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    const previousValues = promotion.toJSON();
    const updateData = { ...req.body };

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    if (updateData.discountValue !== undefined) updateData.discountValue = Number(updateData.discountValue);
    if (updateData.maxDiscount !== undefined) updateData.maxDiscount = Number(updateData.maxDiscount);

    await promotion.update(updateData);

    await db.PromotionAuditLog.create({
      promotionId: promotion.id,
      adminEmail: req.user.email,
      action: 'Updated',
      details: `Updated campaign "${promotion.name}". Status: ${promotion.status}.`,
      previousValues: JSON.stringify(previousValues),
      newValues: JSON.stringify(promotion.toJSON())
    });

    res.json({
      success: true,
      message: 'Promotion updated successfully.',
      promotion
    });
  } catch (err) {
    console.error('❌ Error updating promotion:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /:id/status
 * Change status action (Save Draft, Publish, Schedule, Disable)
 */
router.patch('/:id/status', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['draft', 'scheduled', 'active', 'expired', 'disabled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    }

    const promotion = await db.HolidayPromotion.findByPk(req.params.id);
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    const oldStatus = promotion.status;
    await promotion.update({ status });

    await db.PromotionAuditLog.create({
      promotionId: promotion.id,
      adminEmail: req.user.email,
      action: 'Status Changed',
      details: `Status changed from "${oldStatus}" to "${status}".`
    });

    res.json({
      success: true,
      message: `Promotion status updated to ${status}.`,
      status
    });
  } catch (err) {
    console.error('❌ Error updating promotion status:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /:id
 * Delete draft or disabled campaign
 */
router.delete('/:id', authMiddleware, restrictTo('super_admin', 'admin'), async (req, res) => {
  try {
    const promotion = await db.HolidayPromotion.findByPk(req.params.id);
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    if (promotion.status === 'active') {
      return res.status(400).json({ error: 'Cannot delete an active promotion. Disable it first.' });
    }

    const promoName = promotion.name;
    const promoId = promotion.id;

    await promotion.destroy();

    await db.PromotionAuditLog.create({
      promotionId: promoId,
      adminEmail: req.user.email,
      action: 'Deleted',
      details: `Deleted promotion "${promoName}".`
    });

    res.json({
      success: true,
      message: `Promotion "${promoName}" deleted successfully.`
    });
  } catch (err) {
    console.error('❌ Error deleting promotion:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;