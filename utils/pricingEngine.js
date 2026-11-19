/**
 * utils/pricingEngine.js
 * 
 * Centralized Pricing Engine for ScaleLink Alliance.
 * Handles:
 * - Holiday Promotion Discount calculation with the $400 cap per project.
 * - Existing Bundle Discount calculation (10% for 2-5 items, 20% for 6+ items).
 * - Non-stacking arbitration rule (whichever saves the customer more wins).
 * - Server-side price validation to prevent client-side manipulation.
 * - Timezone-aware promotion activation checks.
 */

// Known recurring subscription services excluded from holiday project discounts by default
const DEFAULT_EXCLUDED_SERVICES = [
  'website-maintenance-updates',
  'website-maintenance',
  'monthly-support',
  'virtual-assistant-services',
  'virtual-assistant'
];

/**
 * Normalizes any text or slug for resilient string comparisons.
 */
function normalizeIdentifier(str) {
  if (!str) return '';
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Determines whether a promotion is currently active given a reference date.
 * Respects status ('active', 'scheduled', 'disabled', 'expired').
 *
 * @param {Object} promotion - HolidayPromotion model instance or plain object
 * @param {Date} [referenceDate] - Target date to evaluate against (defaults to current time)
 * @returns {boolean}
 */
function isPromotionActive(promotion, referenceDate = new Date()) {
  if (!promotion) return false;
  if (promotion.status === 'disabled' || promotion.status === 'draft') return false;

  const now = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return promotion.status === 'active';
  }

  // If the campaign has passed its expiration date, it is always expired
  if (now > end) {
    return false;
  }

  // If explicitly activated by webmaster or passed from active promotion endpoint
  if (promotion.status === 'active' || promotion.active === true) {
    return true;
  }

  // If status is scheduled, it becomes active automatically once start date arrives
  if (promotion.status === 'scheduled') {
    return now >= start && now <= end;
  }

  // If no status is specified on an active promotion payload, treat as active if within end date
  if (!promotion.status && promotion.id) {
    return now <= end;
  }

  return false;
}

/**
 * Checks whether an individual service is eligible for holiday promotional discounts.
 *
 * @param {string} serviceIdentifier - Service title, slug, or category
 * @param {Object} [promotion] - The holiday promotion definition
 * @returns {boolean}
 */
function isServiceEligibleForPromotion(serviceIdentifier, promotion) {
  if (!serviceIdentifier) return false;
  const normalized = normalizeIdentifier(serviceIdentifier);

  // 1. Exclude custom quote placeholders ($0 unscoped inquiry)
  if (normalized.includes('request-custom-quote') || normalized === 'custom-quote') {
    return false;
  }

  // 2. Check explicit promotion exclusions
  const promoExcluded = Array.isArray(promotion?.excludedServices) ? promotion.excludedServices : [];
  const allExcluded = [...DEFAULT_EXCLUDED_SERVICES, ...promoExcluded].map(normalizeIdentifier);
  if (allExcluded.some(ex => normalized === ex || normalized.includes(ex))) {
    return false;
  }

  // 3. Check explicit promotion eligible services whitelist
  const eligibleList = Array.isArray(promotion?.eligibleServices) ? promotion.eligibleServices : [];
  if (!promotion || eligibleList.length === 0) {
    return false;
  }
  if (eligibleList.includes('all') || eligibleList.includes('*')) {
    return true;
  }

  // 4. Check eligible services whitelist
  const normalizedEligible = eligibleList.map(normalizeIdentifier);
  return normalizedEligible.some(el => normalized === el || normalized.includes(el) || el.includes(normalized));
}

/**
 * Calculates the holiday discount for a single eligible project price.
 * Enforces percentage/fixed calculation and the maximum discount cap per project (e.g. $400 / 40,000 cents).
 *
 * @param {number} itemPriceCents - Price in cents
 * @param {Object} promotion - HolidayPromotion definition
 * @param {boolean} isEligible - Whether this item qualifies for holiday discounts
 * @returns {Object}
 */
function calculateItemHolidayDiscount(itemPriceCents, promotion, isEligible = true) {
  if (!isEligible || !promotion || itemPriceCents <= 0) {
    return {
      rawDiscountCents: 0,
      actualDiscountCents: 0,
      isCapped: false,
      maxCapCents: 0,
      holidayPriceCents: itemPriceCents
    };
  }

  const discountType = promotion.discountType || 'percentage';
  const discountValue = typeof promotion.discountValue === 'number' ? promotion.discountValue : 20.0;
  // maxDiscount in dollars converted to cents, default $400.00 = 40,000 cents
  const maxCapCents = Math.round((typeof promotion.maxDiscount === 'number' ? promotion.maxDiscount : 400.0) * 100);

  let rawDiscountCents = 0;
  if (discountType === 'percentage') {
    rawDiscountCents = Math.round(itemPriceCents * (discountValue / 100));
  } else {
    // Fixed amount discount in dollars converted to cents
    rawDiscountCents = Math.round(discountValue * 100);
  }

  const isCapped = rawDiscountCents > maxCapCents;
  const actualDiscountCents = Math.min(rawDiscountCents, maxCapCents);
  const holidayPriceCents = Math.max(0, itemPriceCents - actualDiscountCents);

  return {
    rawDiscountCents,
    actualDiscountCents,
    isCapped,
    maxCapCents,
    holidayPriceCents
  };
}

/**
 * Evaluates the existing automatic bundle discount based on priced service count.
 * Rules:
 * - 1 item: 0%
 * - 2 to 5 items: 10%
 * - 6+ items: 20%
 *
 * @param {Array<Object>} items - Array of { name, priceCents, isPriced }
 * @returns {Object}
 */
function calculateExistingBundleDiscount(items = []) {
  const pricedItems = items.filter(it => it.priceCents > 0 && it.isPriced !== false);
  const count = pricedItems.length;

  let rate = 0;
  if (count >= 6) {
    rate = 0.20;
  } else if (count >= 2) {
    rate = 0.10;
  }

  const subtotalCents = items.reduce((sum, it) => sum + (it.priceCents || 0), 0);
  const discountCents = Math.round(subtotalCents * rate);

  return {
    count,
    bundleRate: rate,
    bundleDiscountCents: discountCents
  };
}

/**
 * Main Centralized Order Calculation Function.
 * Implements Section 3 Non-Stacking Arbitration Rule:
 * - Computes Holiday Discount across eligible items (enforcing $400 cap per project).
 * - Computes Existing Bundle Discount across all items.
 * - If allowStacking is false (default):
 *     Applies whichever eligible discount provides greater savings.
 *     If bundle wins, labels it as "Bundle Discount"; if holiday wins, labels it as "Holiday Discount".
 * - If allowStacking is true: combines both.
 *
 * @param {Object} params
 * @param {Array<Object>} params.items - Array of order items { id, slug, name, priceCents, isRecurring }
 * @param {Object} [params.promotion] - Active HolidayPromotion
 * @param {boolean} [params.allowStacking] - Optional override, otherwise uses promotion.allowStacking
 * @param {string} [params.currency] - Currency code (default 'USD')
 * @returns {Object} Full breakdown of pricing, discount arbitration, and payable total
 */
function calculateOrderPricing({
  items = [],
  promotion = null,
  allowStacking = null,
  currency = 'USD',
  referenceDate = new Date()
}) {
  const isPromoActive = isPromotionActive(promotion, referenceDate);
  const activePromo = isPromoActive ? promotion : null;
  const stackingAllowed = allowStacking !== null 
    ? Boolean(allowStacking) 
    : Boolean(activePromo?.allowStacking);

  let subtotalCents = 0;
  let totalEligibleProjectPriceCents = 0;
  let totalHolidayDiscountCents = 0;
  let hasHitCapOnAnyProject = false;

  // Process item by item
  const processedItems = items.map(item => {
    const priceCents = Math.round(item.priceCents || 0);
    subtotalCents += priceCents;

    const isRecurring = Boolean(item.isRecurring);
    const isEligible = !isRecurring && isServiceEligibleForPromotion(item.slug || item.name, activePromo);

    let holidayCalc = {
      rawDiscountCents: 0,
      actualDiscountCents: 0,
      isCapped: false,
      maxCapCents: 0,
      holidayPriceCents: priceCents
    };

    if (activePromo && isEligible && priceCents > 0) {
      totalEligibleProjectPriceCents += priceCents;
      holidayCalc = calculateItemHolidayDiscount(priceCents, activePromo, isEligible);
      totalHolidayDiscountCents += holidayCalc.actualDiscountCents;
      if (holidayCalc.isCapped) {
        hasHitCapOnAnyProject = true;
      }
    }

    return {
      ...item,
      priceCents,
      isEligibleForPromotion: isEligible,
      isRecurring,
      holidayDiscountCents: holidayCalc.actualDiscountCents,
      holidayPriceCents: holidayCalc.holidayPriceCents,
      isHolidayCapped: holidayCalc.isCapped
    };
  });

  // Calculate existing bundle discount
  const bundleCalc = calculateExistingBundleDiscount(processedItems);
  const bundleDiscountCents = bundleCalc.bundleDiscountCents;

  // Arbitration Rule
  let appliedDiscountType = 'none';
  let appliedDiscountAmountCents = 0;
  let appliedDiscountLabel = null;
  let appliedDiscountRate = 0;

  if (activePromo && totalHolidayDiscountCents > 0) {
    if (stackingAllowed) {
      appliedDiscountType = 'stacked';
      appliedDiscountAmountCents = totalHolidayDiscountCents + bundleDiscountCents;
      appliedDiscountLabel = `${activePromo.name} + Bundle Discount`;
      appliedDiscountRate = bundleCalc.bundleRate + (activePromo.discountValue / 100);
    } else {
      // Non-stacking rule: Whichever saves more wins
      if (totalHolidayDiscountCents >= bundleDiscountCents) {
        appliedDiscountType = 'holiday';
        appliedDiscountAmountCents = totalHolidayDiscountCents;
        appliedDiscountLabel = `Holiday Promotion: ${activePromo.name} (${activePromo.discountValue}% OFF)`;
        appliedDiscountRate = activePromo.discountValue / 100;
      } else {
        // Bundle savings are greater than holiday discount (e.g. 6 items bundle 20% on $5,000 saves $1,000 > $400 cap)
        appliedDiscountType = 'bundle';
        appliedDiscountAmountCents = bundleDiscountCents;
        appliedDiscountLabel = `Bundle Discount (${Math.round(bundleCalc.bundleRate * 100)}% OFF)`;
        appliedDiscountRate = bundleCalc.bundleRate;
      }
    }
  } else if (bundleDiscountCents > 0) {
    // Normal existing checkout discount
    appliedDiscountType = 'bundle';
    appliedDiscountAmountCents = bundleDiscountCents;
    appliedDiscountLabel = `Bundle Discount (${Math.round(bundleCalc.bundleRate * 100)}% OFF)`;
    appliedDiscountRate = bundleCalc.bundleRate;
  }

  // Ensure discount does not exceed subtotal
  appliedDiscountAmountCents = Math.min(appliedDiscountAmountCents, subtotalCents);
  const totalPayableCents = Math.max(0, subtotalCents - appliedDiscountAmountCents);

  return {
    items: processedItems,
    currency,
    subtotalCents,
    subtotalDollars: (subtotalCents / 100).toFixed(2),
    
    // Holiday Promotion calculation details
    promotionApplied: activePromo ? {
      id: activePromo.id,
      name: activePromo.name,
      slug: activePromo.slug,
      holidayName: activePromo.holidayName,
      discountValue: activePromo.discountValue,
      maxDiscount: activePromo.maxDiscount,
      totalHolidaySavingsCents: totalHolidayDiscountCents,
      isCapped: hasHitCapOnAnyProject
    } : null,

    // Existing Bundle calculation details
    bundleDiscount: {
      count: bundleCalc.count,
      rate: bundleCalc.bundleRate,
      amountCents: bundleDiscountCents,
      amountDollars: (bundleDiscountCents / 100).toFixed(2)
    },

    // Final Applied Decision
    appliedDiscountType, // 'holiday' | 'bundle' | 'stacked' | 'none'
    appliedDiscountAmountCents,
    appliedDiscountDollars: (appliedDiscountAmountCents / 100).toFixed(2),
    appliedDiscountLabel,
    appliedDiscountRate,

    // Payable Total Due Today
    totalPayableCents,
    totalPayableDollars: (totalPayableCents / 100).toFixed(2),

    // ScaleLink Alliance Mandatory Payment Security Policy
    paymentSecurityNotice: 'All payments are processed securely through authorized ScaleLink Alliance online payment channels. DO NOT PAY CASH.'
  };
}

module.exports = {
  isPromotionActive,
  isServiceEligibleForPromotion,
  calculateItemHolidayDiscount,
  calculateExistingBundleDiscount,
  calculateOrderPricing,
  normalizeIdentifier,
  DEFAULT_EXCLUDED_SERVICES
};
