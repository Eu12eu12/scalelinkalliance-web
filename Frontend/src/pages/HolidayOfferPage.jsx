/**
 * Frontend/src/pages/HolidayOfferPage.jsx
 * 
 * Design D — Dedicated Reusable Holiday Landing Page (/holiday-offer)
 * Specification requirements:
 * - Dynamic holiday campaign heading, theme, and copy.
 * - Discount percentage (20%) and maximum savings cap ($400).
 * - Eligible services with approved regular & holiday prices.
 * - Benefits of purchasing each eligible service.
 * - Holiday offer terms & conditions.
 * - Action buttons to checkout and Free Website Review.
 * - Campaign expiration countdown timer.
 * - Graceful fallback when no campaign is active (without advertising expired offers).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaTag, FaArrowRight, FaCheckCircle, FaShieldAlt, FaClock,
  FaCode, FaShoppingCart, FaCogs, FaRocket, FaPalette, FaSearch,
  FaFileContract, FaRegQuestionCircle, FaStar, FaGlobe, FaChevronDown
} from 'react-icons/fa';
import useActivePromotion from '../hooks/useActivePromotion';
import { calculateItemHolidayDiscount, isServiceEligibleForPromotion } from '../utils/pricingEngine';

// Countdown Timer Component
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    if (!targetDate) return;

    const calculate = () => {
      const now = new Date().getTime();
      const end = new Date(targetDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-900/30 border border-rose-500/30 text-rose-300 text-xs font-bold">
        <span>Offer has concluded</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 text-white">
      <div className="flex flex-col items-center bg-white/10 backdrop-blur-xs border border-white/15 px-3 py-2 rounded-xl min-w-[55px] sm:min-w-[65px]">
        <span className="text-xl sm:text-2xl font-black">{timeLeft.days}</span>
        <span className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">Days</span>
      </div>
      <span className="text-xl font-bold text-amber-400">:</span>
      <div className="flex flex-col items-center bg-white/10 backdrop-blur-xs border border-white/15 px-3 py-2 rounded-xl min-w-[55px] sm:min-w-[65px]">
        <span className="text-xl sm:text-2xl font-black">{timeLeft.hours}</span>
        <span className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">Hours</span>
      </div>
      <span className="text-xl font-bold text-amber-400">:</span>
      <div className="flex flex-col items-center bg-white/10 backdrop-blur-xs border border-white/15 px-3 py-2 rounded-xl min-w-[55px] sm:min-w-[65px]">
        <span className="text-xl sm:text-2xl font-black">{timeLeft.minutes}</span>
        <span className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">Mins</span>
      </div>
      <span className="text-xl font-bold text-amber-400">:</span>
      <div className="flex flex-col items-center bg-white/10 backdrop-blur-xs border border-white/15 px-3 py-2 rounded-xl min-w-[55px] sm:min-w-[65px]">
        <span className="text-xl sm:text-2xl font-black text-amber-400">{timeLeft.seconds}</span>
        <span className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">Secs</span>
      </div>
    </div>
  );
};

// Core curated eligible services for the holiday showcase
const SHOWCASE_SERVICES = [
  {
    slug: 'website-development',
    name: 'Website Development',
    icon: <FaCode className="text-xl text-amber-400" />,
    regularPriceCents: 99900,
    headline: 'High-Converting Corporate & Business Websites',
    benefits: ['Custom mobile-first UI design', 'SEO foundation & rapid load speed', 'Integrated lead capture and CRM pipeline'],
  },
  {
    slug: 'build-from-scratch',
    name: 'Complete Website From Scratch',
    icon: <FaRocket className="text-xl text-amber-400" />,
    regularPriceCents: 199900,
    headline: 'Turnkey Digital Platform & Architecture',
    benefits: ['Bespoke design tailored to your industry', 'Full copywriting, asset prep & branding', 'Deployment, hosting configuration & QA'],
  },
  {
    slug: 'e-commerce-development',
    name: 'E-Commerce Store Development',
    icon: <FaShoppingCart className="text-xl text-amber-400" />,
    regularPriceCents: 250000,
    headline: 'Modern Online Stores Built to Sell',
    benefits: ['Seamless Stripe / PayPal payment integration', 'Catalog management & inventory workflows', 'Cart-abandonment recovery & speed tuning'],
  },
  {
    slug: 'crm-marketing-automation',
    name: 'CRM & Marketing Automation',
    icon: <FaCogs className="text-xl text-amber-400" />,
    regularPriceCents: 99900,
    headline: 'Never Miss a Lead or Customer Follow-Up',
    benefits: ['Automated email & SMS nurturing sequences', 'Deal pipeline tracking & calendar booking', 'Zero manual data entry chaos'],
  },
  {
    slug: 'landing-pages-sales-funnels',
    name: 'Landing Pages & Sales Funnels',
    icon: <FaRocket className="text-xl text-amber-400" />,
    regularPriceCents: 49900,
    headline: 'Focused Conversion Pages That Perform',
    benefits: ['Persuasive direct-response copywriting', 'A/B test ready with clear call-to-actions', 'Direct integration with your email marketing'],
  },
  {
    slug: 'brand-identity-logo-design',
    name: 'Brand Identity & Visual Assets',
    icon: <FaPalette className="text-xl text-amber-400" />,
    regularPriceCents: 49900,
    headline: 'Distinctive Corporate Brand Presence',
    benefits: ['Custom logo, color palette & typography guide', 'Social media templates & collateral pack', 'Complete vector & production file package'],
  }
];

const HolidayOfferPage = () => {
  const { promotion, isActive, themeConfig, trackInteraction, loading } = useActivePromotion();
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    if (isActive && promotion?.id) {
      trackInteraction('landing_visit');
    }
  }, [isActive, promotion, trackInteraction]);

  // If no promotion is active, show the evergreen fallback
  if (!loading && (!isActive || !promotion)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#18264A] text-2xl">
            <FaTag />
          </div>
          <span className="px-3.5 py-1 rounded-full bg-slate-100 text-[#18264A] text-xs font-bold uppercase tracking-wider">
            ScaleLink Alliance Promotions
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-4 mb-4">
            Seasonal Promotional Offers
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
            There is currently no seasonal holiday promotion running. ScaleLink Alliance offers transparent, fixed-milestone pricing on all done-for-you digital services, including automatic multi-service bundle discounts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/services"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#18264A] text-white font-bold rounded-xl hover:bg-[#101c38] transition-colors shadow-md text-sm"
            >
              Browse All Services
            </Link>
            <Link
              to="/free-website-review"
              className="w-full sm:w-auto px-6 py-3.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              Get a Free Website Review
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discountPercent = promotion?.discountValue || 20;
  const maxDiscountCap = promotion?.maxDiscount || 400;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* ─── Hero Section with Theme Styling ─── */}
      <section className={`relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden text-white ${themeConfig.heroBg} border-b ${themeConfig.accentBorder}`}>
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Campaign Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/15 border border-amber-400/40 text-amber-300 mb-6 shadow-xs"
          >
            <FaTag className="text-amber-400" />
            <span>{promotion.holidayName} Exclusive Offer</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto"
          >
            {promotion.mainHeading}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            {promotion.subheading}
          </motion.p>

          {/* Countdown Block */}
          {promotion.endDate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-10 max-w-md mx-auto p-4 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-xs"
            >
              <div className="flex items-center justify-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest text-amber-300">
                <FaClock size={12} />
                <span>Limited-Time Event Ends In</span>
              </div>
              <CountdownTimer targetDate={promotion.endDate} />
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#eligible-services"
              className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base transition-all transform hover:scale-[1.02] shadow-xl ${themeConfig.primaryBtn}`}
            >
              <span>Explore Eligible Services</span>
              <FaArrowRight size={13} />
            </a>

            <Link
              to="/free-website-review"
              className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-base transition-all ${themeConfig.secondaryBtn}`}
            >
              <span>Get Free Website Review</span>
            </Link>
          </motion.div>

          <p className="text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
            <FaShieldAlt className="text-amber-400" />
            <span>Automatic server-validated discount. Up to ${maxDiscountCap} off per eligible project. Non-stackable.</span>
          </p>

        </div>
      </section>

      {/* ─── Highlights / Value Props ─── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-[#18264A] flex items-center justify-center shrink-0 text-xl font-bold">
                20%
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Instant Seasonal Savings</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Save 20% up to ${maxDiscountCap} per eligible project directly at checkout without promo code hassles.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#18264A] flex items-center justify-center shrink-0 text-xl">
                <FaShieldAlt />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Protected Delivery</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Every milestone tracked through your private client portal with guaranteed scope completion.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-xl">
                <FaStar />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1">One Accountable Team</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Design, engineering, and automation executed under one leadership team. No fragmented contractors.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Eligible Services & Pricing Grid (Section 2 & 4) ─── */}
      <section id="eligible-services" className="py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-[#18264A] text-xs font-bold uppercase tracking-wider">
              Qualifying Project Packages
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              Eligible Services & Promotional Pricing
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Discounts are calculated at {discountPercent}% off the approved project price, capped at ${maxDiscountCap} savings per qualifying project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SHOWCASE_SERVICES.map((service) => {
              const calc = calculateItemHolidayDiscount(service.regularPriceCents, promotion, true);
              const regularStr = (service.regularPriceCents / 100).toFixed(2);
              const holidayStr = (calc.holidayPriceCents / 100).toFixed(2);
              const savingsStr = (calc.actualDiscountCents / 100).toFixed(2);

              return (
                <div
                  key={service.slug}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        {service.icon}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${themeConfig.badgeBg}`}>
                        Save ${savingsStr}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">{service.headline}</p>

                    {/* Price Block */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6">
                      <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                        <span>Regular Price:</span>
                        <span className="line-through">${regularStr}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-700">Holiday Price:</span>
                        <span className="text-2xl font-black text-[#18264A]">${holidayStr}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200/60 flex justify-between items-center text-xs font-bold text-emerald-700">
                        <span>Your Savings:</span>
                        <span>-${savingsStr} {calc.isCapped ? '($400 Cap)' : `(${discountPercent}%)`}</span>
                      </div>
                    </div>

                    {/* Included Benefits */}
                    <ul className="space-y-2.5 mb-8">
                      {service.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700 leading-snug">
                          <FaCheckCircle className="text-emerald-500 text-xs mt-0.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action CTA */}
                  <Link
                    to={`/request-service?service=${service.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#18264A] text-white font-bold rounded-xl hover:bg-[#101c38] transition-colors shadow-md text-sm"
                  >
                    <span>Claim Holiday Price</span>
                    <FaArrowRight size={11} />
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── Terms & Conditions Section ─── */}
      <section className="py-14 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-gray-200 rounded-2xl p-6 sm:p-8 bg-slate-50">
            <button
              onClick={() => setTermsOpen(!termsOpen)}
              className="flex items-center justify-between w-full text-left font-bold text-gray-900 text-base sm:text-lg focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <FaFileContract className="text-[#18264A]" />
                <span>Holiday Promotion Terms & Conditions</span>
              </div>
              <FaChevronDown className={`text-sm text-gray-400 transition-transform ${termsOpen ? 'rotate-180' : ''}`} />
            </button>

            {termsOpen && (
              <div className="mt-5 pt-5 border-t border-gray-200 text-xs sm:text-sm text-gray-600 space-y-3 leading-relaxed">
                <p>
                  <strong>Eligibility:</strong> The {promotion.name} discount applies exclusively to eligible new setup and development projects submitted through the ScaleLink Alliance website during the promotional period.
                </p>
                <p>
                  <strong>Discount Calculation & Project Cap:</strong> The holiday discount is calculated as the lesser of 20% of eligible service costs or $400 USD per eligible project. The $400 cap is enforced separately on each qualifying project.
                </p>
                <p>
                  <strong>Non-Stacking Policy:</strong> Holiday promotional discounts cannot be stacked with existing bundle discounts or special coupon codes. If a multi-service order qualifies for an existing bundle discount that produces greater total savings, the system will automatically apply that more favorable bundle discount instead.
                </p>
                <p>
                  <strong>Exclusions:</strong> Recurring monthly support retainers, ongoing maintenance subscriptions, third-party software licenses, and applicable taxes are excluded from holiday promotional calculations.
                </p>
                <p>
                  <strong>Authorized Online Payments:</strong> All project payments must be processed exclusively through authorized ScaleLink Alliance online payment channels (Stripe Checkout). <em>DO NOT PAY CASH.</em>
                </p>
                {promotion.termsAndConditions && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200 text-xs whitespace-pre-line text-gray-700">
                    {promotion.termsAndConditions}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HolidayOfferPage;

