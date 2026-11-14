/**
 * Frontend/src/utils/pricingEngine.js
 * 
 * Client-side mirrored Centralized Pricing Engine for ScaleLink Alliance.
 * Provides identical calculation to backend utils/pricingEngine.js.
 */

export const DEFAULT_EXCLUDED_SERVICES = [
  'website-maintenance-updates',
  'website-maintenance',
  'monthly-support',
  'virtual-assistant-services',
  'virtual-assistant'
];

export function normalizeIdentifier(str) {
  if (!str) return '';
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isPromotionActive(promotion, referenceDate = new Date()) {
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

export function isServiceEligibleForPromotion(serviceIdentifier, promotion) {
  if (!serviceIdentifier) return false;
  const normalized = normalizeIdentifier(serviceIdentifier);

  if (normalized.includes('request-custom-quote') || normalized === 'custom-quote') {
    return false;
  }

  const promoExcluded = Array.isArray(promotion?.excludedServices) ? promotion.excludedServices : [];
  const allExcluded = [...DEFAULT_EXCLUDED_SERVICES, ...promoExcluded].map(normalizeIdentifier);
  if (allExcluded.some(ex => normalized === ex || normalized.includes(ex))) {
    return false;
  }

  const eligibleList = Array.isArray(promotion?.eligibleServices) ? promotion.eligibleServices : [];
  if (!promotion || eligibleList.length === 0 || eligibleList.includes('all')) {
    return true;
  }

  const normalizedEligible = eligibleList.map(normalizeIdentifier);
  return normalizedEligible.some(el => normalized === el || normalized.includes(el) || el.includes(normalized));
}

export function calculateItemHolidayDiscount(itemPriceCents, promotion, isEligible = true) {
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
  const maxCapCents = Math.round((typeof promotion.maxDiscount === 'number' ? promotion.maxDiscount : 400.0) * 100);

  let rawDiscountCents = 0;
  if (discountType === 'percentage') {
    rawDiscountCents = Math.round(itemPriceCents * (discountValue / 100));
  } else {
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

export function calculateExistingBundleDiscount(items = []) {
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

export function calculateOrderPricing({
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

  const bundleCalc = calculateExistingBundleDiscount(processedItems);
  const bundleDiscountCents = bundleCalc.bundleDiscountCents;

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
      if (totalHolidayDiscountCents >= bundleDiscountCents) {
        appliedDiscountType = 'holiday';
        appliedDiscountAmountCents = totalHolidayDiscountCents;
        appliedDiscountLabel = `Holiday Promotion: ${activePromo.name} (${activePromo.discountValue}% OFF)`;
        appliedDiscountRate = activePromo.discountValue / 100;
      } else {
        appliedDiscountType = 'bundle';
        appliedDiscountAmountCents = bundleDiscountCents;
        appliedDiscountLabel = `Bundle Discount (${Math.round(bundleCalc.bundleRate * 100)}% OFF)`;
        appliedDiscountRate = bundleCalc.bundleRate;
      }
    }
  } else if (bundleDiscountCents > 0) {
    appliedDiscountType = 'bundle';
    appliedDiscountAmountCents = bundleDiscountCents;
    appliedDiscountLabel = `Bundle Discount (${Math.round(bundleCalc.bundleRate * 100)}% OFF)`;
    appliedDiscountRate = bundleCalc.bundleRate;
  }

  appliedDiscountAmountCents = Math.min(appliedDiscountAmountCents, subtotalCents);
  const totalPayableCents = Math.max(0, subtotalCents - appliedDiscountAmountCents);

  return {
    items: processedItems,
    currency,
    subtotalCents,
    subtotalDollars: (subtotalCents / 100).toFixed(2),
    
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

    bundleDiscount: {
      count: bundleCalc.count,
      rate: bundleCalc.bundleRate,
      amountCents: bundleDiscountCents,
      amountDollars: (bundleDiscountCents / 100).toFixed(2)
    },

    appliedDiscountType,
    appliedDiscountAmountCents,
    appliedDiscountDollars: (appliedDiscountAmountCents / 100).toFixed(2),
    appliedDiscountLabel,
    appliedDiscountRate,

    totalPayableCents,
    totalPayableDollars: (totalPayableCents / 100).toFixed(2),

    paymentSecurityNotice: 'All payments are processed securely through authorized ScaleLink Alliance online payment channels. DO NOT PAY CASH.'
  };
}
