/**
 * Frontend/src/components/promotions/HolidayPriceBadge.jsx
 * 
 * Design C — Service and Pricing Pages Dynamic Savings Display
 * Specification requirements:
 * - Displays promotional savings directly beside the prices of eligible services.
 * - Format:
 *     Regular Price: $999
 *     Holiday Price: $799.20
 *     You Save: $199.80
 * - Uses central calculation logic (enforcing the 20% rate and $400 project cap).
 * - Avoids manually hardcoded prices.
 */

import React from 'react';
import useActivePromotion from '../../hooks/useActivePromotion';
import { calculateItemHolidayDiscount, isServiceEligibleForPromotion } from '../../utils/pricingEngine';

export const HolidayPriceDisplay = ({ 
  serviceSlug, 
  priceCents = 0, 
  currencySymbol = '$', 
  className = '',
  inline = false
}) => {
  const { promotion, isActive, themeConfig } = useActivePromotion();

  const isEligible = isActive && isServiceEligibleForPromotion(serviceSlug, promotion);

  if (!isActive || !isEligible || !priceCents || priceCents <= 0) {
    return (
      <span className={`font-bold text-gray-900 ${className}`}>
        {currencySymbol}{(priceCents / 100).toFixed(2)}
      </span>
    );
  }

  const calc = calculateItemHolidayDiscount(priceCents, promotion, isEligible);
  const regularDollars = (priceCents / 100).toFixed(2);
  const holidayDollars = (calc.holidayPriceCents / 100).toFixed(2);
  const savingsDollars = (calc.actualDiscountCents / 100).toFixed(2);

  if (inline) {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <span className="text-gray-400 line-through text-xs sm:text-sm font-medium">
          {currencySymbol}{regularDollars}
        </span>
        <span className="text-base sm:text-lg font-extrabold text-[#18264A]">
          {currencySymbol}{holidayDollars}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${themeConfig.savingsBadge}`}>
          Save {currencySymbol}{savingsDollars}
        </span>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-xl border ${themeConfig.cardBorder} bg-slate-50/80 space-y-1 text-left ${className}`}>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Regular Price:</span>
        <span className="line-through">{currencySymbol}{regularDollars}</span>
      </div>
      <div className="flex justify-between items-center text-sm font-extrabold text-gray-900">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
          <span>Holiday Price:</span>
        </span>
        <span className="text-base text-[#18264A] font-black">
          {currencySymbol}{holidayDollars}
        </span>
      </div>
      <div className="flex justify-between items-center text-xs font-bold text-emerald-600 pt-1 border-t border-gray-200/60">
        <span>You Save:</span>
        <span className="text-emerald-700">
          -{currencySymbol}{savingsDollars} {calc.isCapped ? '($400 Max Cap)' : `(${promotion.discountValue}% OFF)`}
        </span>
      </div>
    </div>
  );
};

export default HolidayPriceDisplay;

