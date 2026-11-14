/**
 * Frontend/src/components/promotions/HolidayAnnouncementBanner.jsx
 * 
 * Design A — Announcement Banner Above Header
 * Specification requirements:
 * - Full-width narrow banner above main navigation.
 * - Deep-blue corporate branding with tasteful gold seasonal accents.
 * - Clickable link to promotional landing page.
 * - Desktop & mobile responsive.
 * - Webmaster editable wording.
 * - Accessible dismiss option (remembers dismissal for session).
 * - Restrained animation (no flashing).
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTag, FaTimes, FaArrowRight } from 'react-icons/fa';
import useActivePromotion from '../../hooks/useActivePromotion';

const HolidayAnnouncementBanner = () => {
  const { promotion, isActive, themeConfig, trackInteraction } = useActivePromotion();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (promotion && promotion.id) {
      const isDismissed = sessionStorage.getItem(`sla_promo_banner_dismissed_${promotion.id}`);
      setDismissed(Boolean(isDismissed));
    }
  }, [promotion]);

  if (!isActive || !promotion || promotion.showBanner === false || dismissed) {
    return null;
  }

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (promotion?.id) {
      sessionStorage.setItem(`sla_promo_banner_dismissed_${promotion.id}`, 'true');
    }
    setDismissed(true);
  };

  const handleBannerClick = () => {
    trackInteraction('banner_click');
  };

  const destination = promotion.buttonDestination || '/holiday-offer';

  return (
    <div 
      className={`w-full relative z-50 text-xs sm:text-sm font-semibold tracking-wide border-b ${themeConfig.accentBorder} ${themeConfig.bannerBg} shadow-xs transition-all duration-300`}
      role="banner"
      aria-label="Holiday Promotion Announcement"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        
        {/* Banner Content Link */}
        <Link
          to={destination}
          onClick={handleBannerClick}
          className="flex-1 flex items-center justify-center gap-2 sm:gap-3 text-center group hover:opacity-95 transition-opacity"
        >
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${themeConfig.badgeBg} shrink-0`}>
            <FaTag className="text-[9px]" />
            <span>{promotion.discountValue}% OFF</span>
          </span>

          <span className={`${themeConfig.bannerText} font-medium text-xs sm:text-sm line-clamp-1`}>
            {promotion.bannerText}
          </span>

          <span className={`hidden md:inline-flex items-center gap-1 font-bold ${themeConfig.highlightText} group-hover:underline shrink-0 text-xs`}>
            <span>Explore Offers</span>
            <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        {/* Accessible Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 focus:outline-none focus:ring-1 focus:ring-white/50"
          aria-label="Dismiss promotional announcement"
          title="Dismiss"
        >
          <FaTimes size={13} />
        </button>

      </div>
    </div>
  );
};

export default HolidayAnnouncementBanner;

