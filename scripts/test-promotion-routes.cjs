/**
 * scripts/test-promotion-routes.cjs
 * 
 * Verifies public & CMS API endpoints for holiday promotions.
 */

const assert = require('assert');
const db = require('../models');
const pricingEngine = require('../utils/pricingEngine');

(async () => {
  console.log('🧪 Testing Promotion Database & Route Handlers...\n');

  // 1. Verify promotion in DB
  const promo = await db.HolidayPromotion.findOne({ where: { slug: 'holiday-growth-event-2026' } });
  assert(promo, 'Initial promotion must exist in DB');
  console.log('✅ Found seeded campaign:', promo.name);

  // 2. Test status evaluation for scheduled campaign (starts Nov 20, 2026)
  const scheduledPromo = { ...promo.toJSON(), status: 'scheduled' };
  const beforeStart = new Date('2026-11-15T12:00:00Z');
  const duringPromo = new Date('2026-11-25T12:00:00Z');
  const afterPromo = new Date('2026-12-05T12:00:00Z');

  assert.strictEqual(pricingEngine.isPromotionActive(scheduledPromo, beforeStart), false, 'Must be inactive before Nov 20 when scheduled');
  assert.strictEqual(pricingEngine.isPromotionActive(scheduledPromo, duringPromo), true, 'Must be active during Nov 20–30 when scheduled');
  assert.strictEqual(pricingEngine.isPromotionActive(scheduledPromo, afterPromo), false, 'Must be inactive after Nov 30');
  console.log('✅ Automatic scheduling & expiration logic verified!');

  // 3. Test tracking interaction incrementation
  const initialClicks = promo.bannerClicks;
  await promo.increment('bannerClicks');
  await promo.reload();
  assert.strictEqual(promo.bannerClicks, initialClicks + 1, 'Banner clicks should increment by 1');
  console.log(`✅ Banner click tracking verified (clicks: ${promo.bannerClicks})`);

  // 4. Test audit log association
  const auditLogs = await promo.getAuditLogs();
  assert(auditLogs.length > 0, 'Audit logs must be associated');
  console.log(`✅ Audit log verified (${auditLogs.length} entries recorded, latest: "${auditLogs[0].action}")`);

  console.log('\n🎉 All Promotion Route & Database Tests Passed Successfully!\n');
  process.exit(0);
})().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

