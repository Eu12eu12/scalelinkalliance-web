/**
 * scripts/seed-initial-promotion.cjs
 * 
 * Seeds the initial 2026 Holiday Growth Event promotion into the database.
 * Matches all specifications from Section 2 of the development document.
 */

const db = require('../models');

const seedInitialPromotion = async () => {
  try {
    console.log('🌱 Seeding Initial Holiday Promotion (Holiday Growth Event 2026)...');

    const promoData = {
      slug: 'holiday-growth-event-2026',
      name: 'ScaleLink Alliance Holiday Growth Event',
      holidayName: 'Black Friday & Holiday Season',
      mainHeading: 'Build Smarter. Grow Faster. Save 20% This Holiday Season.',
      subheading: 'Give your business a head start on the new year. Save up to $400 on selected website development, CRM automation, and digital business improvement projects.',
      bannerText: 'HOLIDAY GROWTH EVENT — SAVE 20% ON ELIGIBLE PROJECTS — UP TO $400 OFF — EXPLORE OFFERS',
      showBanner: true,
      buttonText: 'Claim Your Holiday Discount',
      buttonDestination: '/holiday-offer',
      secondaryButtonText: 'Get a Free Website Review',
      secondaryButtonDestination: '/free-website-review',
      discountType: 'percentage',
      discountValue: 20.0, // 20%
      maxDiscount: 400.0, // $400 cap per project
      currency: 'USD',
      startDate: new Date('2026-11-20T00:00:00-06:00'), // Nov 20, 2026 (America/Chicago)
      endDate: new Date('2026-11-30T23:59:59-06:00'),   // Nov 30, 2026 (America/Chicago)
      timezone: 'America/Chicago',
      holidayTheme: 'black_friday',
      allowStacking: false,
      status: 'scheduled',
      eligibleServices: [
        'website-development',
        'build-from-scratch',
        'scale-existing-website',
        'landing-pages-sales-funnels',
        'e-commerce-development',
        'crm-marketing-automation',
        'web-applications-saas-development',
        'api-integration-automation',
        'brand-identity-logo-design',
        'seo-search-marketing',
        'paid-advertising-management',
        'email-marketing-campaigns',
        'lead-generation-services'
      ],
      excludedServices: [
        'website-maintenance-updates',
        'virtual-assistant-services'
      ],
      termsAndConditions: 'Offer valid November 20–30, 2026 for approved eligible new projects and one-time setup fees. Maximum discount of $400 applies per eligible project. Recurring monthly retainers, maintenance subscriptions, third-party software licenses, and taxes are excluded. Promotional discounts cannot be combined with bundle discounts or existing promotional codes; the checkout system automatically applies whichever eligible discount offers greater savings. ScaleLink Alliance reserves the right to modify or discontinue promotions in accordance with company policy. All payments must be processed securely through authorized ScaleLink Alliance online payment channels. DO NOT PAY CASH.'
    };

    let promo = await db.HolidayPromotion.findOne({ where: { slug: promoData.slug } });

    if (promo) {
      console.log('🔄 Existing initial promotion found. Updating record...');
      await promo.update(promoData);
    } else {
      console.log('➕ Creating initial promotion record...');
      promo = await db.HolidayPromotion.create(promoData);
    }

    // Add audit log
    await db.PromotionAuditLog.create({
      promotionId: promo.id,
      adminEmail: 'system@scalelinkalliance.com',
      action: 'Seeded',
      details: `Initial 2026 Holiday Growth Event campaign seeded successfully with status "${promo.status}".`
    });

    console.log(`✅ Holiday Promotion "${promo.name}" [ID: ${promo.id}] seeded successfully!`);
    console.log(`   - Discount: ${promo.discountValue}% (Max $${promo.maxDiscount})`);
    console.log(`   - Dates: ${promo.startDate.toISOString()} to ${promo.endDate.toISOString()} (${promo.timezone})`);
    console.log(`   - Theme: ${promo.holidayTheme}`);
    console.log(`   - Status: ${promo.status}`);
  } catch (err) {
    console.error('❌ Failed to seed initial holiday promotion:', err);
    throw err;
  }
};

if (require.main === module) {
  seedInitialPromotion()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else {
  module.exports = seedInitialPromotion;
}

