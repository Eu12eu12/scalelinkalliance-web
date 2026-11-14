/**
 * Frontend/src/components/promotions/HolidayHeroSection.jsx
 * 
 * Design B — Homepage Holiday Promotion
 * Specification requirements:
 * - Attractive promotional section placed inside or immediately below the homepage hero area.
 * - Dynamic heading and supporting text.
 * - Primary CTA: "Claim Your Holiday Discount".
 * - Secondary CTA: "Get a Free Website Review".
 * - Preserves existing homepage pathways and navigation.
 * - Respects active theme presets (deep blue with gold/seasonal accents).
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTag, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import useActivePromotion from '../../hooks/useActivePromotion';

const HolidayHeroSection = () => {
  const { promotion, isActive, themeConfig, trackInteraction } = useActivePromotion();

  if (!isActive || !promotion) {
    return null;
  }

  const handleCtaClick = () => {
    trackInteraction('landing_visit');
  };

  const primaryDest = promotion.buttonDestination || '/holiday-offer';
  const secondaryDest = promotion.secondaryButtonDestination || '/free-website-review';

  return (
    <section className="w-full relative overflow-hidden py-10 sm:py-14 bg-gradient-to-b from-slate-900 via-[#101c38] to-[#18264A] text-white border-y border-amber-500/20 shadow-inner">
      {/* Background Decorative Accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-400 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/15 border border-amber-400/40 text-amber-300 mb-5 shadow-xs"
          >
            <FaTag className="text-amber-400 text-xs" />
            <span>{promotion.holidayName || 'Holiday Growth Event'} • {promotion.discountValue}% OFF (Save up to ${promotion.maxDiscount})</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight sm:leading-tight"
          >
            {promotion.mainHeading || 'Build Smarter. Grow Faster. Save 20% This Holiday Season.'}
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {promotion.subheading || 'Give your business a head start on the new year. Save up to $400 on selected website development, CRM automation, and digital business improvement projects.'}
          </motion.p>

          {/* CTA Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              to={primaryDest}
              onClick={handleCtaClick}
              className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all transform hover:scale-[1.02] shadow-lg ${themeConfig.primaryBtn}`}
            >
              <span>{promotion.buttonText || 'Claim Your Holiday Discount'}</span>
              <FaArrowRight size={13} />
            </Link>

            <Link
              to={secondaryDest}
              className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all ${themeConfig.secondaryBtn}`}
            >
              <span>{promotion.secondaryButtonText || 'Get a Free Website Review'}</span>
            </Link>
          </motion.div>

          {/* Guarantee / Non-stacking micro-copy */}
          <p className="text-[11px] sm:text-xs text-slate-400 mt-5 flex items-center justify-center gap-1.5">
            <FaShieldAlt className="text-amber-400 text-xs shrink-0" />
            <span>Discount automatically calculated at checkout. Max $400 per eligible project. DO NOT PAY CASH.</span>
          </p>

        </div>
      </div>
    </section>
  );
};

export default HolidayHeroSection;
