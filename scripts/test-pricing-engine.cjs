/**
 * scripts/test-pricing-engine.cjs
 * 
 * Comprehensive Unit Tests for ScaleLink Alliance Centralized Pricing Engine.
 * Verifies all pricing calculations, caps, non-stacking rules, and edge cases from Sections 2, 3, and 11.
 */

const assert = require('assert');
const {
  isPromotionActive,
  isServiceEligibleForPromotion,
  calculateItemHolidayDiscount,
  calculateExistingBundleDiscount,
  calculateOrderPricing
} = require('../utils/pricingEngine');

console.log('🧪 Starting ScaleLink Alliance Pricing Engine Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// Mock Promotion: Holiday Growth Event 2026
const holidayPromotion = {
  id: 1,
  name: 'ScaleLink Alliance Holiday Growth Event',
  slug: 'holiday-growth-event-2026',
  holidayName: 'Black Friday',
  discountType: 'percentage',
  discountValue: 20.0,
  maxDiscount: 400.0,
  currency: 'USD',
  startDate: new Date('2026-11-20T00:00:00Z'),
  endDate: new Date('2026-11-30T23:59:59Z'),
  status: 'active',
  allowStacking: false,
  eligibleServices: ['website-development', 'crm-marketing-automation', 'e-commerce-development'],
  excludedServices: ['website-maintenance-updates', 'virtual-assistant-services']
};

console.log('--- SECTION 2: SPECIFICATION CALCULATION EXAMPLES ($400 CAP) ---');

runTest('Example 1: $499 project -> 20% ($99.80), under cap', () => {
  const result = calculateItemHolidayDiscount(49900, holidayPromotion, true);
  assert.strictEqual(result.actualDiscountCents, 9980, 'Discount must be $99.80 (9980 cents)');
  assert.strictEqual(result.holidayPriceCents, 39920, 'Price must be $399.20 (39920 cents)');
  assert.strictEqual(result.isCapped, false, 'Should not be capped');
});

runTest('Example 2: $999 project -> 20% ($199.80), under cap', () => {
  const result = calculateItemHolidayDiscount(99900, holidayPromotion, true);
  assert.strictEqual(result.actualDiscountCents, 19980, 'Discount must be $199.80 (19980 cents)');
  assert.strictEqual(result.holidayPriceCents, 79920, 'Price must be $799.20 (79920 cents)');
  assert.strictEqual(result.isCapped, false, 'Should not be capped');
});

runTest('Example 3: $1,999 project -> 20% ($399.80), under cap', () => {
  const result = calculateItemHolidayDiscount(199900, holidayPromotion, true);
  assert.strictEqual(result.actualDiscountCents, 39980, 'Discount must be $399.80 (39980 cents)');
  assert.strictEqual(result.holidayPriceCents, 159920, 'Price must be $1,599.20 (159920 cents)');
  assert.strictEqual(result.isCapped, false, 'Should not be capped');
});

runTest('Example 4: $2,500 project -> 20% = $500, capped at $400 max', () => {
  const result = calculateItemHolidayDiscount(250000, holidayPromotion, true);
  assert.strictEqual(result.rawDiscountCents, 50000, 'Raw discount is $500');
  assert.strictEqual(result.actualDiscountCents, 40000, 'Discount capped at $400 (40000 cents)');
  assert.strictEqual(result.holidayPriceCents, 210000, 'Holiday price must be $2,100 (210000 cents)');
  assert.strictEqual(result.isCapped, true, 'isCapped flag must be true');
});

runTest('Example 5: $5,000 project -> 20% = $1,000, capped at $400 max', () => {
  const result = calculateItemHolidayDiscount(500000, holidayPromotion, true);
  assert.strictEqual(result.rawDiscountCents, 100000, 'Raw discount is $1,000');
  assert.strictEqual(result.actualDiscountCents, 40000, 'Discount capped at $400 (40000 cents)');
  assert.strictEqual(result.holidayPriceCents, 460000, 'Holiday price must be $4,600 (460000 cents)');
  assert.strictEqual(result.isCapped, true, 'isCapped flag must be true');
});

console.log('\n--- SECTION 3: NON-STACKING ARBITRATION RULES ---');

runTest('Scenario A: Holiday discount (20%) beats Existing bundle discount (10%)', () => {
  // 2 items = 10% bundle discount ($100 on $1,000)
  // Holiday promo 20% = $200 discount
  // Holiday should win!
  const order = calculateOrderPricing({
    items: [
      { slug: 'website-development', name: 'Website Development', priceCents: 50000 },
      { slug: 'crm-marketing-automation', name: 'CRM Automation', priceCents: 50000 }
    ],
    promotion: holidayPromotion
  });

  assert.strictEqual(order.subtotalCents, 100000, 'Subtotal should be $1,000');
  assert.strictEqual(order.appliedDiscountType, 'holiday', 'Holiday discount must win');
  assert.strictEqual(order.appliedDiscountAmountCents, 20000, 'Discount must be $200');
  assert.strictEqual(order.totalPayableCents, 80000, 'Payable must be $800');
  assert(order.appliedDiscountLabel.includes('Holiday Promotion'), 'Label must state Holiday Promotion');
});

runTest('Scenario B: Existing bundle discount saves MORE than holiday discount due to $400 cap', () => {
  // 6 items totaling $5,000. Bundle discount = 20% = $1,000 savings.
  // Holiday discount is capped at $400 per eligible project.
  // Bundle discount wins ($1,000 > $400)! Must NOT mislabel as holiday discount!
  const order = calculateOrderPricing({
    items: [
      { slug: 'website-development', name: 'Website Development', priceCents: 500000 },
      { slug: 'service-2', name: 'Service 2', priceCents: 0, isPriced: true },
      { slug: 'service-3', name: 'Service 3', priceCents: 0, isPriced: true },
      { slug: 'service-4', name: 'Service 4', priceCents: 0, isPriced: true },
      { slug: 'service-5', name: 'Service 5', priceCents: 0, isPriced: true },
      { slug: 'service-6', name: 'Service 6', priceCents: 0, isPriced: true }
    ],
    // Let's create an actual priced 6-item order totaling $5,000
    promotion: holidayPromotion
  });

  // Test with real prices totaling $5,000 across 6 items
  const order6Items = calculateOrderPricing({
    items: [
      { slug: 'website-development', name: 'Website Development', priceCents: 150000 }, // $1500 -> 20% = $300
      { slug: 'crm-marketing-automation', name: 'CRM Automation', priceCents: 150000 }, // $1500 -> 20% = $300
      { slug: 'e-commerce-development', name: 'E-Commerce', priceCents: 50000 },        // $500 -> 20% = $100
      { slug: 'seo', name: 'SEO', priceCents: 50000 },                                  // $500 -> not eligible? or eligible
      { slug: 'branding', name: 'Branding', priceCents: 50000 },
      { slug: 'copywriting', name: 'Copywriting', priceCents: 50000 }
    ],
    promotion: {
      ...holidayPromotion,
      eligibleServices: ['website-development'], // only website-development eligible -> max discount $300
    }
  });

  // In order6Items: subtotal is $5,000 (500,000 cents).
  // Bundle discount (6 items) is 20% = $1,000 (100,000 cents).
  // Holiday discount is only on website-development: 20% of $1,500 = $300 (30,000 cents).
  // Bundle discount ($1,000) > Holiday discount ($300).
  assert.strictEqual(order6Items.appliedDiscountType, 'bundle', 'Bundle discount must win');
  assert.strictEqual(order6Items.appliedDiscountAmountCents, 100000, 'Applied discount must be $1,000');
  assert.strictEqual(order6Items.totalPayableCents, 400000, 'Total payable must be $4,000');
  assert(order6Items.appliedDiscountLabel.includes('Bundle Discount'), 'Label must identify Bundle Discount correctly');
  assert(!order6Items.appliedDiscountLabel.includes('Holiday'), 'Must not falsely describe as holiday discount');
});

runTest('Scenario C: Single item order (0% existing bundle discount) receives holiday discount', () => {
  const order = calculateOrderPricing({
    items: [
      { slug: 'website-development', name: 'Website Development', priceCents: 99900 }
    ],
    promotion: holidayPromotion
  });

  assert.strictEqual(order.appliedDiscountType, 'holiday');
  assert.strictEqual(order.appliedDiscountAmountCents, 19980);
  assert.strictEqual(order.totalPayableCents, 79920);
});

runTest('Scenario D: Excluded recurring subscription services are NOT discounted', () => {
  const order = calculateOrderPricing({
    items: [
      { slug: 'website-maintenance-updates', name: 'Website Maintenance', priceCents: 25000, isRecurring: true }
    ],
    promotion: holidayPromotion
  });

  assert.strictEqual(order.appliedDiscountAmountCents, 0, 'Recurring service should receive $0 holiday discount');
  assert.strictEqual(order.totalPayableCents, 25000, 'Full price retained');
});

runTest('Scenario E: When campaign ends (inactive/expired), standard checkout behavior restores', () => {
  const expiredPromotion = {
    ...holidayPromotion,
    startDate: new Date('2025-01-01T00:00:00Z'),
    endDate: new Date('2025-01-10T23:59:59Z'), // expired!
    status: 'expired'
  };

  const order = calculateOrderPricing({
    items: [
      { slug: 'website-development', name: 'Website Development', priceCents: 50000 },
      { slug: 'crm-marketing-automation', name: 'CRM Automation', priceCents: 50000 }
    ],
    promotion: expiredPromotion
  });

  assert.strictEqual(order.appliedDiscountType, 'bundle', 'Restores bundle discount');
  assert.strictEqual(order.appliedDiscountAmountCents, 10000, 'Standard 10% bundle discount ($100)');
  assert.strictEqual(order.totalPayableCents, 90000, 'Payable is $900');
});

runTest('Scenario F: Future stacking enabled setting combines both discounts when configured', () => {
  const stackingPromotion = {
    ...holidayPromotion,
    allowStacking: true
  };

  const order = calculateOrderPricing({
    items: [
      { slug: 'website-development', name: 'Website Development', priceCents: 50000 },
      { slug: 'crm-marketing-automation', name: 'CRM Automation', priceCents: 50000 }
    ],
    promotion: stackingPromotion
  });

  assert.strictEqual(order.appliedDiscountType, 'stacked', 'Must indicate stacked discount');
  // Holiday (20% = $200) + Bundle (10% = $100) = $300
  assert.strictEqual(order.appliedDiscountAmountCents, 30000, 'Combined discount is $300');
  assert.strictEqual(order.totalPayableCents, 70000, 'Payable is $700');
});

runTest('Scenario G: Mandatory ScaleLink Alliance Payment Notice is present', () => {
  const order = calculateOrderPricing({
    items: [{ slug: 'website-development', name: 'Website Development', priceCents: 99900 }],
    promotion: holidayPromotion
  });

  assert.strictEqual(
    order.paymentSecurityNotice,
    'All payments are processed securely through authorized ScaleLink Alliance online payment channels. DO NOT PAY CASH.'
  );
});

console.log(`\n========================================`);
console.log(`Test Results: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}

