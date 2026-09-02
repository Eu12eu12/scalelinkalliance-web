// src/pages/Services/ServiceRequestPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCheck, FaArrowRight, FaArrowLeft, FaPaintBrush, FaCode, FaChartLine, FaCogs,
  FaUser, FaEnvelope, FaPhone, FaBuilding, FaCalendar, FaDollarSign, FaPaperPlane,
  FaShieldAlt, FaFileContract, FaLock, FaCreditCard, FaSpinner, FaUpload, FaFile,
  FaCloudUploadAlt, FaGlobeAmericas, FaVideo, FaPenNib, FaPalette,
  FaCamera, FaShoppingCart, FaRocket, FaAd, FaEnvelope as FaEnvelopeIcon,
  FaSearch as FaSearchIcon, FaHeadset, FaProjectDiagram, FaDatabase, FaFileAlt,
  FaChartBar, FaUsers, FaRegBuilding, FaBriefcase, FaRobot, FaInfoCircle, FaCalendar as FaCalendarIcon,
  FaSyncAlt, FaStar
} from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import {
  COUNTRIES,
  CURRENCIES,
  BUDGET_RANGES
} from '../../utils/formConstants';
import PhoneInput from '../../components/forms/PhoneInput';
import FileUpload from '../../components/forms/FileUpload';
import CurrencySelector from '../../components/forms/CurrencySelector';
import { subscribeToServiceUpdates, mergeServicesWithPackages, parsePriceToCents } from '../../utils/serviceSync';

// ─── Config ──────────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const EMAILJS_SERVICE_ID = 'service_z0n4bpa';
const EMAILJS_TEMPLATE_ID = 'template_spxsoac';
const EMAILJS_PUBLIC_KEY = 'IRwXMIYIKhUnttcdY';

const MAX_FILES = 20;

const CHECKOUT_STATE_KEY = 'sla_checkout_state';

// ─── Helper: Get service slug ────────────────────────────────────────────────
const getServiceSlug = (serviceName) => {
  const slugMap = {
    // Creative & Content
    'Graphic Design': 'graphic-design',
    'Video Editing & Motion Graphics': 'video-editing',
    'Copywriting & Content Creation': 'copywriting',
    'Brand Identity & Logo Design': 'brand-identity',
    'Photography & Visual Assets': 'photography',

    // Websites & Development
    'Website Development': 'website-development',
    'Landing Pages & Sales Funnels': 'landing-pages',
    'E-Commerce Development': 'ecommerce-development',
    'Web Applications & SaaS Development': 'web-applications',
    'Website Maintenance & Updates': 'website-maintenance',
    'Online Booking Systems': 'online-booking-systems',

    // Marketing & Growth
    'Social Media Management': 'social-media-management',
    'SEO & Search Marketing': 'seo-marketing',
    'Paid Advertising Management': 'paid-advertising',
    'Email Marketing Campaigns': 'email-marketing',
    'Lead Generation Services': 'lead-generation',
    'Reputation & Review Management': 'reputation-review-management',

    // Automation & Technology
    'CRM & Marketing Automation': 'crm-automation',
    'API Integration & Automation': 'api-integration',
    'AI Automation': 'ai-automation',
    'Business Process Automation': 'business-process-automation',
    'Data Analytics & Reporting': 'data-analytics',

    // Operations & Support
    'Business Consulting & Growth Strategy': 'business-consulting-growth-strategy',
    'Virtual Assistant Services': 'virtual-assistant',
    'Project Management Support': 'project-management',
    'Process Documentation & SOP Development': 'process-documentation',
    'Data Entry & Processing': 'data-entry',

    // Custom Quotes
    'Request Custom Quote': 'custom-quote'
  };
  return slugMap[serviceName] || serviceName.toLowerCase().replace(/[&\s]/g, '-').replace(/--+/g, '-');
};

// ─── Mirrors getServiceSlug() ────────────────────────────────────────────────
const SLUG_TO_SERVICE_NAME = {
  // Creative & Content
  'graphic-design': 'Graphic Design',
  'video-editing': 'Video Editing & Motion Graphics',
  'copywriting': 'Copywriting & Content Creation',
  'brand-identity': 'Brand Identity & Logo Design',
  'photography': 'Photography & Visual Assets',

  // Websites & Development
  'website-development': 'Website Development',
  'landing-pages': 'Landing Pages & Sales Funnels',
  'ecommerce-development': 'E-Commerce Development',
  'web-applications': 'Web Applications & SaaS Development',
  'website-maintenance': 'Website Maintenance & Updates',
  'online-booking-systems': 'Online Booking Systems',

  // Marketing & Growth
  'social-media-management': 'Social Media Management',
  'seo-marketing': 'SEO & Search Marketing',
  'paid-advertising': 'Paid Advertising Management',
  'email-marketing': 'Email Marketing Campaigns',
  'lead-generation': 'Lead Generation Services',
  'reputation-review-management': 'Reputation & Review Management',

  // Automation & Technology
  'crm-automation': 'CRM & Marketing Automation',
  'api-integration': 'API Integration & Automation',
  'ai-automation': 'AI Automation',
  'ai-custom-quote': 'AI Automation',
  'business-process-automation': 'Business Process Automation',
  'data-analytics': 'Data Analytics & Reporting',

  // Operations & Support
  'business-consulting-growth-strategy': 'Business Consulting & Growth Strategy',
  'virtual-assistant': 'Virtual Assistant Services',
  'project-management': 'Project Management Support',
  'process-documentation': 'Process Documentation & SOP Development',
  'data-entry': 'Data Entry & Processing',

  // General custom quote only
  'custom-quote': 'Request Custom Quote'
};

// ─── ALL SERVICES WITH PACKAGES — prices & contents amended to match
// "ScaleLink Alliance Pricing" (Services_Pricing_and_benefits.docx) exactly ──
const SERVICES_WITH_PACKAGES = {
  // ─── CREATIVE & CONTENT ────────────────────────────────────────────────────
  'Graphic Design': {
    packages: {
      starter: { name: 'Starter Package', price: 4900, description: 'Best for a single marketing asset — e.g. flyer, promotional graphic, social graphic, or simple banner.', includes: ['1 marketing asset', '1 finished size/format', 'Basic custom design', 'Client-provided brand assets', '1 revision round', 'Final web-ready file'] },
      growth: { name: 'Standard Package', price: 19900, description: 'Standard Design Package — a coordinated set of marketing assets.', includes: ['Up to 5 coordinated assets', 'Consistent visual direction', 'Up to 2 sizes per core design where required', 'Basic image sourcing', '2 revision rounds', 'Web-ready final files'] },
      premium: { name: 'Premium Package', price: 49900, description: 'Premium Design Package — for businesses running full marketing campaigns.', includes: ['Up to 12 coordinated marketing assets', 'Creative direction', 'Brand-consistent design system', 'Multiple campaign formats', 'Up to 3 revision rounds', 'Organized final files', 'Print-ready files when required'] }
    }
  },
  'Video Editing & Motion Graphics': {
    packages: {
      starter: { name: 'Starter Package', price: 9900, description: 'Best for a single short video up to 60 seconds.', includes: ['1 video up to 60 seconds', 'Basic cuts', 'Basic transitions', 'Text/captions', 'Basic audio balancing', 'Client-provided footage', '1 aspect ratio', '1 revision round', 'Final exported video'] },
      growth: { name: 'Standard Package', price: 29900, description: 'A single longer video with professional polish.', includes: ['1 video up to 5 minutes', 'Professional editing', 'B-roll placement', 'Titles/text graphics', 'Basic motion graphics', 'Audio cleanup', 'Color correction', 'Captions', 'Up to 2 aspect ratios', '2 revision rounds'] },
      premium: { name: 'Premium Package', price: 69900, description: 'A long-form video or a small batch of short-form videos.', includes: ['1 long-form video up to 12 minutes OR up to 5 short-form videos from supplied footage', 'Advanced editing', 'Motion graphics', 'B-roll', 'Audio enhancement', 'Color correction', 'Captions', 'Branded graphics', 'Multiple export formats', 'Up to 3 revision rounds'] }
    }
  },
  'Copywriting & Content Creation': {
    packages: {
      starter: { name: 'Starter Package', price: 9900, description: 'Small content needs or single-page messaging.', includes: ['Blog/article up to 800 words, OR short sales page, OR email copy package, OR small website-page rewrite', 'Topic research', 'Brand-tone alignment', 'Basic SEO considerations where applicable', '1 revision round'] },
      growth: { name: 'Standard Package', price: 29900, description: 'Businesses needing multiple content pieces with keyword awareness.', includes: ['Up to 2,500 total words', 'Up to 3 content pieces/pages', 'Keyword consideration', 'CTA development', 'Headline development', 'Basic competitor/content review', '2 revision rounds'] },
      premium: { name: 'Premium Package', price: 69900, description: 'Businesses running content marketing campaigns.', includes: ['Up to 6,000 total words', 'Up to 6 pages/content pieces', 'Content strategy', 'SEO-oriented structure where applicable', 'Conversion-focused CTA development', 'Brand voice consistency', 'Content formatting recommendations', 'Up to 3 revision rounds'] }
    }
  },
  'Brand Identity & Logo Design': {
    packages: {
      starter: { name: 'Starter Package', price: 24900, description: 'Starter Identity — small businesses launching a brand or refreshing their logo.', includes: ['Brand discovery questionnaire', '2 initial logo concepts', '2 revision rounds', 'Primary logo', 'Basic color palette', 'Basic typography recommendations', 'PNG, JPG and transparent logo files'] },
      growth: { name: 'Standard Package', price: 59900, description: 'Standard Identity — businesses that want a more developed brand identity.', includes: ['Brand discovery', '3 initial logo concepts', 'Primary logo', 'Secondary logo variation', 'Icon/mark', 'Color palette', 'Typography system', 'Social profile assets', 'Basic brand guidelines', '3 revision rounds', 'Organized final files'] },
      premium: { name: 'Premium Package', price: 129900, description: 'Premium Brand Identity — companies building a full professional brand identity.', includes: ['Brand strategy session', 'Competitive visual review', '3 refined creative directions', 'Primary and secondary logos', 'Brand mark', 'Color system', 'Typography system', 'Brand imagery direction', 'Social assets', 'Basic business-card/letterhead templates', 'Comprehensive brand guideline document', 'Up to 3 revision rounds', 'Complete final-file package'] }
    }
  },
  'Photography & Visual Assets': {
    packages: {
      starter: { name: 'Starter Package', price: 24900, description: 'Small businesses needing essential visual content.', includes: ['Up to 1 hour on location', 'Up to 10 edited final photographs', 'Basic color correction', 'Web-resolution files', 'One local location'] },
      growth: { name: 'Standard Package', price: 59900, description: 'Businesses creating marketing content.', includes: ['Up to 2.5 hours', 'Up to 30 edited photographs', 'Product/team/location combinations', 'Enhanced retouching', 'Web and high-resolution files', 'Basic shot planning'] },
      premium: { name: 'Premium Package', price: 129900, description: 'Brand campaigns and full marketing visuals.', includes: ['Up to half-day shoot', 'Up to 60 edited photographs', 'Pre-shoot planning', 'Multiple setups', 'Advanced retouching', 'Web and high-resolution files', 'Organized image library'] }
    }
  },

  // ─── TECH & DEVELOPMENT ─────────────────────────────────────────────────────
  'Website Development': {
    packages: {
      starter: { name: 'Starter Package', price: 79900, description: 'New businesses, local businesses, consultants, and companies needing a professional online presence.', includes: ['Up to 5 core website pages', 'Custom homepage design', 'Mobile and tablet responsive design', 'Contact form', 'Click-to-call and email functionality', 'Social media links', 'Basic on-page SEO setup', 'Page titles and meta descriptions', 'Basic image optimization', 'Google Analytics setup', 'Google Search Console setup', 'SSL configuration assistance', 'Basic speed optimization', 'One primary conversion CTA', 'Two revision rounds', 'Basic launch support'] },
      growth: { name: 'Standard Package', price: 179900, description: 'Established businesses that want their website to actively support lead generation and marketing.', includes: ['Everything in Starter', 'Up to 10 pages', 'More customized page layouts', 'Blog or resource section', 'Up to 2 lead-generation forms', 'Thank-you page', 'CRM or email platform connection', 'Basic conversion tracking', 'Enhanced on-page SEO', 'Internal linking setup', 'XML sitemap configuration', 'Robots.txt configuration', 'Basic schema implementation where appropriate', 'Website analytics configuration', 'Basic lead funnel structure', 'Three revision rounds', 'CMS training session'] },
      premium: { name: 'Premium Package', price: 399900, description: 'Growing businesses requiring a larger, conversion-focused digital presence.', includes: ['Everything in Growth', 'Up to 20 pages', 'Custom UX/UI direction', 'Advanced page layouts', 'Conversion-focused page architecture', 'Multiple service or location pages', 'Up to 5 lead-generation forms', 'Advanced CRM/form integrations', 'Marketing automation connection', 'Advanced analytics and conversion tracking', 'Enhanced technical SEO setup', 'Custom website components', 'Resource/download functionality', 'Basic booking or scheduling integration', 'Advanced site navigation', 'Staging environment', 'Three revision rounds per major design phase', 'Team training', 'Post-launch review'] }
    }
  },
  'Landing Pages & Sales Funnels': {
    packages: {
      starter: { name: 'Starter Package', price: 39900, description: 'Best for a single offer, campaign, lead magnet, consultation, or advertisement.', includes: ['1 custom landing page', 'Mobile responsive design', 'Lead capture form', 'Thank-you page', 'One primary CTA', 'Basic conversion tracking', 'Email/CRM form connection', 'Basic copy formatting', 'Two revision rounds'] },
      growth: { name: 'Standard Package', price: 89900, description: 'Businesses running campaigns that need more than a single page.', includes: ['Up to 3 funnel pages', 'Landing page', 'Thank-you/confirmation page', 'Secondary conversion page', 'Lead form integration', 'CRM/email integration', 'Conversion tracking', 'Basic automation setup', 'Mobile optimization', 'A/B testing-ready structure', 'Up to 2 audience paths', 'Three revision rounds'] },
      premium: { name: 'Premium Package', price: 199900, description: 'Businesses building a complete customer-acquisition funnel.', includes: ['Up to 6 funnel pages', 'Custom conversion-focused design', 'Lead capture system', 'Booking or checkout integration', 'CRM integration', 'Up to 5 automated follow-up emails', 'Conversion tracking', 'Analytics setup', 'Basic funnel automation', 'Lead tagging/segmentation', 'Thank-you and next-step flows', 'A/B test configuration for one key page', 'Three revision rounds', 'Funnel walkthrough'] }
    }
  },
  'E-Commerce Development': {
    packages: {
      starter: { name: 'Starter Package', price: 119900, description: 'Best for new or smaller online stores.', includes: ['Store setup', 'Up to 10 products', 'Up to 5 informational pages', 'Mobile responsive design', 'Product category setup', 'Shopping cart', 'Checkout configuration', 'One payment gateway', 'Basic shipping configuration', 'Basic tax settings', 'Order notification setup', 'Google Analytics', 'Basic SEO setup', 'Two revision rounds', 'Store management training'] },
      growth: { name: 'Standard Package', price: 299900, description: 'Established businesses expanding online sales.', includes: ['Everything in Starter', 'Up to 50 products', 'Advanced product variations', 'Coupon/discount functionality', 'Abandoned-cart setup where supported', 'Email marketing integration', 'Enhanced analytics', 'Enhanced product SEO', 'Customer account functionality', 'Review functionality', 'Up to 2 payment gateways', 'Advanced shipping rules', 'Basic product-data import', 'Three revision rounds'] },
      premium: { name: 'Premium Package', price: 599900, description: 'Businesses requiring a more advanced commerce environment.', includes: ['Everything in Growth', 'Up to 150 initial products', 'Advanced product/category structure', 'Custom storefront components', 'Enhanced checkout configuration', 'Advanced conversion tracking', 'CRM integration', 'Advanced email automation', 'Subscription functionality where platform-supported', 'Multi-location or advanced inventory configuration where supported', 'Advanced shipping logic', 'Data migration assistance', 'Custom reporting configuration', 'Team training'] }
    }
  },
  'Web Applications & SaaS Development': {
    packages: {
      starter: { name: 'Starter MVP', price: 499900, description: 'Best for validating a focused software concept.', includes: ['Requirements workshop', 'Basic product architecture', 'User authentication', '1 primary user role', 'Up to 5 core application screens', 'Database setup', 'Basic admin functionality', '1 third-party integration', 'Responsive interface', 'Testing', 'Deployment assistance', 'Basic technical documentation'] },
      growth: { name: 'Standard Application', price: 1199900, description: 'Businesses building more advanced digital systems.', includes: ['Product planning', 'Up to 15 core screens', 'Up to 2 user roles', 'Advanced database structure', 'Admin dashboard', 'Up to 3 integrations', 'Notification functionality', 'User-account management', 'Responsive application', 'QA testing', 'Deployment', 'Documentation', 'Team handoff'] },
      premium: { name: 'Premium SaaS / Custom Platform', price: 2499900, description: 'Best for larger custom software platforms — final pricing established after technical discovery.', includes: ['Complex product architecture', 'Multiple user roles', 'Subscription/billing systems', 'Custom dashboards', 'Advanced database architecture', 'API integrations', 'Automated workflows', 'Role-based permissions', 'Reporting', 'Notifications', 'Staging/production environments', 'Advanced QA', 'Deployment', 'Technical documentation', 'Post-launch support'] }
    }
  },
  'API Integration & Automation': {
    packages: {
      starter: { name: 'Starter Package', price: 49900, description: 'Starter Integration.', includes: ['1 straightforward system integration', 'Up to 2 API endpoints/actions', 'Authentication configuration', 'Basic data mapping', 'Testing', 'Basic error handling', 'Documentation'] },
      growth: { name: 'Standard Package', price: 129900, description: 'Growth Integration.', includes: ['Integration of up to 2 systems', 'Up to 6 endpoints/actions', 'Advanced data mapping', 'Workflow logic', 'Error logging', 'Testing environment', 'Documentation', 'Deployment assistance'] },
      premium: { name: 'Premium Package', price: 349900, description: 'Premium Integration.', includes: ['Up to 3 interconnected systems', 'Up to 15 endpoints/actions', 'Complex workflow logic', 'Data transformations', 'Authentication/security configuration', 'Error handling and logging', 'Testing', 'Deployment support', 'Technical documentation', 'Post-launch review'] }
    }
  },
  'Website Maintenance & Updates': {
    packages: {
      starter: { name: 'Starter Care', price: 14900, description: 'Up to 2 hours of website work per month.', includes: ['Up to 2 hours of website work per month', 'Core/plugin updates where applicable', 'Basic backup monitoring', 'Basic uptime checks', 'Minor content edits', 'Basic technical health review', 'Monthly maintenance summary'] },
      growth: { name: 'Standard Care', price: 34900, description: 'Up to 5 support hours per month.', includes: ['Up to 5 support hours per month', 'Updates', 'Backup monitoring', 'Uptime monitoring', 'Content changes', 'Minor design adjustments', 'Basic speed review', 'Form/function testing', 'Priority support', 'Monthly maintenance report'] },
      premium: { name: 'Premium Care', price: 79900, description: 'Up to 10 support hours per month.', includes: ['Up to 10 support hours per month', 'Everything in Growth', 'Priority issue handling', 'Regular site health review', 'Conversion-form testing', 'Analytics review', 'Minor page creation', 'Minor development work', 'Monthly strategy recommendations'] }
    }
  },

  // ─── MARKETING & GROWTH ────────────────────────────────────────────────────
  'SEO & Search Marketing': {
    packages: {
      starter: { name: 'Starter Package', price: 49900, description: 'Small businesses beginning to build organic search visibility.', includes: ['Initial SEO audit', 'Keyword research for up to 10 target keywords', 'Optimization of up to 5 priority pages', 'Page title optimization', 'Meta description optimization', 'Heading structure review', 'Internal-link improvements', 'Google Search Console review', 'Google Analytics review', 'XML sitemap review', 'Basic technical SEO checks', 'One existing page/content optimization per month', 'Monthly ranking review', 'Monthly performance report', 'Monthly recommendations'] },
      growth: { name: 'Standard Package', price: 99900, description: 'Most Popular — everything in Starter, plus expanded keyword tracking and content.', includes: ['Everything in Starter', 'Up to 20 tracked target keywords', 'Optimization across up to 15 priority pages', 'Competitor SEO review', 'Two SEO-focused content pieces or substantial content optimizations per month', 'Enhanced internal-link strategy', 'Technical issue monitoring', 'Search intent analysis', 'Content-gap analysis', 'Local SEO optimization when applicable', 'Google Business Profile recommendations when applicable', 'Basic structured-data recommendations', 'Conversion-page SEO review', 'Monthly strategy review'] },
      premium: { name: 'Premium Package', price: 199900, description: 'Businesses pursuing more aggressive organic growth.', includes: ['Everything in Growth', 'Up to 40 tracked keywords', 'Up to 30 priority pages', 'Up to 4 SEO content pieces or major optimizations per month', 'Advanced competitor research', 'Advanced content-gap analysis', 'Technical SEO monitoring', 'Schema strategy', 'Multi-service or multi-location SEO strategy', 'Content-cluster planning', 'Link opportunity research and outreach strategy', 'Conversion optimization recommendations', 'Priority implementation support', 'Monthly strategy call', 'Detailed executive reporting'] }
    }
  },
  'Paid Advertising Management': {
    packages: {
      starter: { name: 'Starter Package', price: 39900, description: 'Smaller businesses testing paid acquisition. Recommended for lower-spend campaigns.', includes: ['1 advertising platform', 'Up to 1 active campaign', 'Up to 3 ad groups/ad sets', 'Initial campaign setup', 'Basic keyword or audience research', 'Up to 6 ad variations', 'Conversion tracking setup', 'Budget monitoring', 'Basic optimization', 'Negative keyword management where applicable', 'Monthly report', 'One monthly campaign review'] },
      growth: { name: 'Standard Package', price: 79900, description: 'Everything in Starter, plus more campaigns and testing.', includes: ['Everything in Starter', 'Up to 2 active campaigns', 'Up to 8 ad groups/ad sets', 'Up to 12 active ad variations', 'Enhanced audience/keyword research', 'Retargeting campaign setup', 'Landing-page recommendations', 'Weekly optimization', 'Search-term analysis', 'Bid/budget adjustments', 'Basic creative testing', 'Conversion-performance analysis', 'Monthly strategy call'] },
      premium: { name: 'Premium Package', price: 149900, description: 'For larger or more complex advertising programs.', includes: ['Multi-campaign management', 'Up to 2 advertising platforms', 'Advanced audience segmentation', 'Advanced retargeting', 'Creative testing', 'Conversion tracking', 'Funnel performance analysis', 'Weekly performance monitoring', 'Budget allocation recommendations', 'Advanced keyword/search-term management', 'Landing-page recommendations', 'Monthly strategy call', 'Executive reporting'] }
    }
  },
  'Email Marketing Campaigns': {
    packages: {
      starter: { name: 'Starter Package', price: 24900, description: 'Best for a single promotion or announcement.', includes: ['1 email campaign', 'Email layout/design', 'Basic copy editing', 'CTA setup', 'Basic segmentation', 'Links and tracking', 'Test send', 'Mobile review', 'One revision round', 'Campaign performance summary'] },
      growth: { name: 'Standard Package', price: 59900, description: 'Standard Campaign.', includes: ['Up to 4 emails', 'Campaign strategy', 'Email layout/design', 'Subject-line development', 'Basic copywriting', 'Audience segmentation', 'CTA strategy', 'UTM/tracking setup', 'Scheduling', 'Basic automation', 'Performance report', 'Two revision rounds'] },
      premium: { name: 'Premium Package', price: 119900, description: 'Premium Campaign.', includes: ['Up to 8 emails', 'Full campaign strategy', 'Copywriting', 'Design/layout', 'Segmentation strategy', 'Automated email flow', 'Lead tagging', 'Basic A/B testing', 'Conversion tracking', 'Performance analysis', 'Optimization recommendations', 'Two revision rounds'] }
    }
  },
  'Lead Generation Services': {
    packages: {
      starter: { name: 'Starter Package', price: 29900, description: 'Starter Lead Generation.', includes: ['Ideal customer profile definition', 'Basic target-market research', 'Prospecting criteria', 'Up to 150 prospect records per month', 'Basic lead-list organization', 'Contact-data cleanup', 'One outreach sequence framework', 'Lead tracking sheet or basic CRM structure', 'Monthly results summary'] },
      growth: { name: 'Standard Package', price: 69900, description: 'Standard Lead Generation.', includes: ['Everything in Starter', 'Up to 500 prospect records per month', 'Multiple target segments', 'Enhanced prospect research', 'Up to 2 outreach sequences', 'Basic personalization framework', 'CRM import assistance', 'Lead tagging', 'Follow-up workflow', 'Monthly performance analysis', 'Strategy adjustments'] },
      premium: { name: 'Premium Package', price: 149900, description: 'Premium Lead Generation.', includes: ['Up to 1,000 prospect records per month', 'Multiple customer profiles', 'Advanced account research', 'Multi-step outreach strategy', 'CRM pipeline setup', 'Lead qualification framework', 'Follow-up automation', 'Reporting dashboard', 'Ongoing campaign refinement', 'Monthly strategy session'] }
    }
  },
  'CRM & Marketing Automation': {
    packages: {
      starter: { name: 'Starter Package', price: 49900, description: 'Starter Automation — businesses replacing basic manual follow-up.', includes: ['1 CRM pipeline', 'Basic CRM configuration', 'Up to 2 forms', 'Up to 3 automated workflows', 'Contact tagging', 'Basic lead notifications', '1 third-party integration', 'Testing', 'Basic documentation', 'One training session'] },
      growth: { name: 'Standard Package', price: 129900, description: 'Standard Automation.', includes: ['Up to 2 CRM pipelines', 'Up to 5 automated workflows', 'Up to 3 integrations', 'Lead routing', 'Email follow-up automation', 'Task automation', 'Contact segmentation', 'Pipeline stages', 'Basic dashboard', 'Testing and QA', 'Documentation', 'Team training'] },
      premium: { name: 'Premium Package', price: 299900, description: 'Premium Automation.', includes: ['Up to 4 pipelines', 'Up to 12 automated workflows', 'Up to 6 integrations', 'Advanced lead routing', 'Multi-step customer journeys', 'Sales automation', 'Marketing automation', 'Customer tagging/scoring rules', 'Reporting dashboard', 'Advanced workflow testing', 'Documentation', 'Up to 2 hours of team training', 'Post-launch optimization review'] }
    }
  },
  // ─── OPERATIONS & SUPPORT ──────────────────────────────────────────────────
  'Virtual Assistant Services': {
    packages: {
      starter: { name: 'Starter VA', price: 19900, description: 'Up to 10 hours per month.', includes: ['Up to 10 hours per month', 'Basic administrative tasks', 'Calendar support', 'Data organization', 'Basic research', 'Document formatting', 'Routine email assistance'] },
      growth: { name: 'Standard VA', price: 49900, description: 'Up to 25 hours per month.', includes: ['Up to 25 hours per month', 'Everything in Starter', 'CRM updates', 'Customer follow-up support', 'Content scheduling', 'Reporting assistance', 'Process support', 'Recurring administrative workflows'] },
      premium: { name: 'Premium VA', price: 89900, description: 'Up to 50 hours per month.', includes: ['Up to 50 hours per month', 'Advanced administrative support', 'CRM management', 'Customer-service support', 'Research', 'Reporting', 'Content administration', 'Project coordination', 'Recurring operations support'] }
    }
  },
  'Data Analytics & Reporting': {
    packages: {
      starter: { name: 'Starter Package', price: 24900, description: 'Starter Analysis.', includes: ['Up to 1 primary data source', 'Data cleanup for the agreed dataset', 'Up to 8 key metrics', 'One basic dashboard/report', 'Key observations', 'One revision round'] },
      growth: { name: 'Standard Package', price: 69900, description: 'Standard Analytics.', includes: ['Up to 3 regular data sources', 'Monthly dashboard updates', 'KPI tracking', 'Trend analysis', 'Monthly performance report', 'Data-quality review', 'Recommendations', 'One monthly review meeting'] },
      premium: { name: 'Premium Package', price: 149900, description: 'Premium Analytics.', includes: ['Up to 5 regular data sources', 'Advanced dashboards', 'Department/channel segmentation', 'KPI framework', 'Trend analysis', 'Conversion/performance analysis', 'Monthly executive report', 'Regular dashboard refreshes', 'Monthly strategy meeting', 'Improvement recommendations'] }
    }
  },
  'Data Entry & Processing': {
    packages: {
      starter: { name: 'Starter Package', price: 9900, description: 'Small administrative data tasks.', includes: ['Up to 500 straightforward records', 'Data entry', 'Basic formatting', 'Basic duplicate review', 'Basic quality check', 'One agreed data source/output format'] },
      growth: { name: 'Standard Package', price: 29900, description: 'Businesses managing larger datasets.', includes: ['Up to 2,000 straightforward records', 'Data entry', 'Data cleanup', 'Formatting', 'Duplicate detection', 'Categorization', 'Quality review', 'Up to 2 output formats'] },
      premium: { name: 'Premium Package', price: 69900, description: 'Recurring monthly data processing.', includes: ['Up to 5,000 straightforward records per month', 'Recurring processing', 'Data cleanup', 'Categorization', 'Formatting', 'Quality-control checks', 'Regular status reporting'] }
    }
  },

  // ─── WEBSITES & DEVELOPMENT (not in the ScaleLink pricing document — unchanged) ──
  'Online Booking Systems': {
    packages: {
      starter: { name: 'Starter Package', price: 39900, description: 'Ideal for businesses needing a simple booking system.', includes: ['online booking system setup', 'calendar integration', 'email notifications', 'mobile-friendly booking form', 'basic customization'] },
      growth: { name: 'Standard Package', price: 99900, description: 'Ideal for businesses with multiple services or staff.', includes: ['advanced booking system', 'multiple service and slot configurations', 'automated reminders', 'payment integration', 'customizable booking form'] },
      premium: { name: 'Premium Package', price: 199900, description: 'Ideal for businesses needing full booking automation.', includes: ['full booking automation system', 'multi-location support', 'advanced notifications', 'CRM integration', 'reporting and analytics'] }
    }
  },

  // ─── MARKETING & GROWTH ─────────────────────────────────────────────────────
  'Social Media Management': {
    packages: {
      starter: { name: 'Starter Package', price: 34900, description: 'Businesses that need a consistent presence.', includes: ['1 social platform', 'Up to 8 feed posts per month', 'Caption writing', 'Basic graphic creation', 'Hashtag/topic research where relevant', 'Content scheduling', 'Monthly content calendar', 'Basic monthly report', 'One revision round on the monthly content batch'] },
      growth: { name: 'Standard Package', price: 69900, description: 'Standard tier social media management.', includes: ['Up to 2 platforms', 'Up to 16 feed posts per month', 'Up to 4 short-form videos/reels using provided or existing footage', 'Caption writing', 'Graphic design', 'Monthly content calendar', 'Scheduling', 'Basic community-response support', 'Monthly analytics', 'Monthly strategy review'] },
      premium: { name: 'Premium Package', price: 149900, description: 'Premium tier social media management.', includes: ['Up to 3 platforms', 'Up to 24 feed posts per month', 'Up to 8 short-form videos', 'Content calendar', 'Graphic design', 'Caption/copy development', 'Scheduling', 'Basic weekday community management', 'Social listening', 'Monthly campaign planning', 'Performance reporting', 'Monthly strategy call', 'Ongoing optimization'] }
    }
  },
  'Reputation & Review Management': {
    packages: {
      starter: { name: 'Starter Package', price: 19900, description: 'Ideal for businesses starting to collect reviews.', includes: ['review collection system setup', 'review monitoring', 'basic response templates', 'monthly review summary report'] },
      growth: { name: 'Standard Package', price: 49900, description: 'Ideal for businesses actively managing reviews.', includes: ['advanced review collection', 'multi-platform monitoring', 'custom response management', 'quarterly review analysis', 'reputation improvement recommendations'] },
      premium: { name: 'Premium Package', price: 99900, description: 'Ideal for businesses prioritizing reputation management.', includes: ['full review management system', 'automated review requests', 'crisis response support', 'monthly detailed reporting', 'strategic reputation standard plan'] }
    }
  },

  // ─── AUTOMATION & TECHNOLOGY ───────────────────────────────────────────────
  'Business Process Automation': {
    packages: {
      starter: { name: 'Starter Package', price: 29900, description: 'Ideal for automating a single business process.', includes: ['1 automated workflow', 'process mapping', 'automation setup', 'testing and documentation'] },
      growth: { name: 'Standard Package', price: 99900, description: 'Ideal for automating multiple business processes.', includes: ['3 automated workflows', 'process mapping and optimization', 'integration setup', 'testing and documentation', 'training support'] },
      premium: { name: 'Premium Package', price: 249900, description: 'Ideal for full business process automation.', includes: ['5+ automated workflows', 'full process optimization', 'multi-system integration', 'comprehensive documentation', 'team training and ongoing support'] }
    }
  },

  // ─── OPERATIONS & SUPPORT ──────────────────────────────────────────────────
  'Business Consulting & Growth Strategy': {
    packages: {
      starter: { name: 'Starter Package', price: 49900, description: 'Ideal for businesses needing a standard plan.', includes: ['1 strategy session (60 min)', 'business assessment', 'growth recommendations', 'action plan document'] },
      growth: { name: 'Standard Package', price: 149900, description: 'Ideal for businesses needing ongoing strategy support.', includes: ['3 strategy sessions (60 min each)', 'growth strategy development', 'implementation roadmap', 'monthly progress reviews', 'strategy adjustments'] },
      premium: { name: 'Premium Package', price: 499900, description: 'Ideal for businesses needing comprehensive strategic guidance.', includes: ['6 strategy sessions (90 min each)', 'full business assessment', 'detailed growth roadmap', 'quarterly strategy reviews', 'team support and implementation guidance', 'priority access for consulting support'] }
    }
  },
  'Project Management Support': {
    packages: {
      starter: { name: 'Starter PM Support', price: 49900, description: 'Up to 10 hours per month.', includes: ['Up to 10 hours per month', 'Project tracking', 'Task organization', 'Deadline tracking', 'Basic status reports', 'Team follow-up', 'One weekly coordination touchpoint'] },
      growth: { name: 'Standard PM Support', price: 119900, description: 'Up to 25 hours per month.', includes: ['Up to 25 hours per month', 'Project planning', 'Task management', 'Team coordination', 'Risk/issue tracking', 'Weekly reporting', 'Meeting coordination', 'Documentation', 'Stakeholder updates'] },
      premium: { name: 'Premium Fractional PM', price: 249900, description: 'Up to 50 hours per month.', includes: ['Up to 50 hours per month', 'Multi-workstream coordination', 'Project planning', 'Schedule management', 'Risk management', 'Stakeholder management', 'Team coordination', 'Weekly reporting', 'Project documentation', 'Leadership updates', 'Continuous project oversight'] }
    }
  },
  'Process Documentation & SOP Development': {
    packages: {
      starter: { name: 'Starter Package', price: 39900, description: 'Documenting a single workflow.', includes: ['Up to 3 SOPs', 'Up to approximately 15 total finished pages', 'Process review', 'Step-by-step documentation', 'Basic formatting', 'One revision round'] },
      growth: { name: 'Standard Package', price: 99900, description: 'Organizing multiple operational procedures.', includes: ['Up to 8 SOPs', 'Up to approximately 40 total finished pages', 'Process interviews', 'Workflow documentation', 'Roles/responsibilities', 'Templates/checklists where applicable', 'Standardized formatting', 'Two revision rounds'] },
      premium: { name: 'Premium Package', price: 249900, description: 'Building a full operational framework.', includes: ['Up to 20 SOPs', 'Up to approximately 100 total finished pages', 'Stakeholder interviews', 'Process mapping', 'Roles and responsibility documentation', 'Operational checklists', 'Templates', 'Documentation structure', 'Implementation recommendations', 'Up to 3 revision rounds'] }
    }
  },

  // ─── AI (CUSTOM QUOTE ONLY) ────────────────────────────────────────────────
  'AI Automation': {
    packages: {
      custom: {
        name: 'AI Custom Quote',
        price: 0,
        description: 'Every AI automation project is custom quoted based on your workflow, tools, goals, and required integrations.',
        includes: [
          'AI workflow discovery',
          'Custom automation design',
          'AI system and tool integration planning',
          'Transparent custom pricing before work begins',
          'Clear project scope and deliverables',
          'Implementation and support plan'
        ]
      }
    }
  },

  // ─── CUSTOM QUOTES ──────────────────────────────────────────────────────────
  'Request Custom Quote': {
    packages: {
      custom: {
        name: 'Custom Quote',
        price: 0,
        description: 'Get a personalized solution built around your business goals.',
        includes: [
          'Personalized consultation',
          'Custom scope definition',
          'Tailored solution',
          'Clear project requirements',
          'Flexible project approach',
          'Custom pricing based on scope'
        ]
      }
    }
  }
};

// ─── MASTER DYNAMIC SERVICE QUESTIONS ─────────────────────────────────────────
// These definitions mirror the ScaleLink Alliance Master Dynamic Service
// Intake Form. Questions are rendered ONLY for services the customer selected.
// Common business/project information stays in formData and is never repeated.
const SERVICE_QUESTION_DEFINITIONS = {
  'Website Development': {
    title: 'Website Development Requirements',
    description: 'Tell us what the website needs to accomplish so our team can scope it correctly.',
    fields: [
      { id: 'WEB_01', label: 'Is this a new website or an existing website?', type: 'radio', required: true, options: ['New website', 'Redesign existing website', 'Improve/fix existing website', 'Add functionality to existing website'] },
      { id: 'WEB_02', label: 'Existing website URL', type: 'url', showWhen: { field: 'WEB_01', values: ['Redesign existing website', 'Improve/fix existing website', 'Add functionality to existing website'] }, hideWhenFormField: 'clientWebsite', helper: 'This is only shown when your common website URL is empty.' },
      { id: 'WEB_03', label: 'What is the primary purpose of your website?', type: 'checkbox', required: true, options: ['Generate leads', 'Sell services', 'Provide business information', 'Accept bookings', 'Showcase portfolio/work', 'Membership/community', 'Other'] },
      { id: 'WEB_04', label: 'Approximately how many pages do you need?', type: 'radio', required: true, options: ['1–5', '6–10', '11–20', '20+', 'Not sure'] },
      { id: 'WEB_05', label: 'Which pages do you need?', type: 'checkbox', options: ['Home', 'About', 'Services', 'Individual Service Pages', 'Contact', 'Portfolio', 'Blog/Resources', 'FAQ', 'Pricing', 'Other'] },
      { id: 'WEB_06', label: 'What functionality do you need?', type: 'checkbox', options: ['Contact forms', 'Appointment booking', 'Live chat', 'Customer login/portal', 'Payment processing', 'CRM integration', 'Email marketing integration', 'Social media integration', 'API integration', 'Analytics/tracking', 'Other'] },
      { id: 'WEB_07', label: 'Do you already own a domain?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
      { id: 'WEB_08', label: 'Do you already have hosting?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
      { id: 'WEB_09', label: 'Do you already have website content?', type: 'radio', options: ['Everything is ready', 'Some content is ready', 'No — I need copywriting', 'Not sure'] },
      { id: 'WEB_10', label: 'Provide 2–3 websites you like.', type: 'textarea', helper: 'Optional URLs' },
      { id: 'WEB_11', label: 'Are there competitor websites we should review?', type: 'textarea', helper: 'Optional URLs' },
    ]
  },
  'E-Commerce Development': {
    title: 'Ecommerce Development Requirements',
    description: 'Help us understand your store, products, platform and selling requirements.',
    fields: [
      { id: 'ECOM_01', label: 'What type of ecommerce project is this?', type: 'radio', required: true, options: ['New store', 'Redesign existing store', 'Fix/improve existing store', 'Platform migration'] },
      { id: 'ECOM_02', label: 'What do you sell?', type: 'textarea', required: true },
      { id: 'ECOM_03', label: 'Product type', type: 'checkbox', required: true, options: ['Physical products', 'Digital products', 'Subscriptions', 'Services', 'Combination'] },
      { id: 'ECOM_04', label: 'Approximately how many products?', type: 'radio', required: true, options: ['1–20', '21–50', '51–100', '101–500', '500+'] },
      { id: 'ECOM_05', label: 'Do you have product descriptions and images?', type: 'radio', options: ['Yes', 'Partially', 'No'] },
      { id: 'ECOM_06', label: 'Preferred/current platform', type: 'checkbox', options: ['Shopify', 'WooCommerce', 'Other', 'Need recommendation'] },
      { id: 'ECOM_07', label: 'Which payment methods/processors are required?', type: 'checkbox', options: ['Credit/debit cards', 'PayPal', 'Stripe', 'Paystack', 'Flutterwave', 'Bank transfer', 'Other', 'Need recommendation'] },
      { id: 'ECOM_08', label: 'Where will you sell?', type: 'checkbox', required: true, options: ['Locally', 'Nationwide', 'Internationally'] },
      { id: 'ECOM_09', label: 'Do you require shipping integration?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
      { id: 'ECOM_10', label: 'Which shipping/carrier services do you use?', type: 'text', showWhen: { field: 'ECOM_09', values: ['Yes'] } },
      { id: 'ECOM_11', label: 'Required ecommerce functionality', type: 'checkbox', options: ['Inventory management', 'Customer accounts', 'Coupons/discounts', 'Product reviews', 'Wishlist', 'Abandoned-cart recovery', 'Subscription billing', 'Multi-currency', 'Multiple languages', 'Tax calculation', 'CRM integration', 'Analytics'] },
      { id: 'ECOM_12', label: 'Approximately how many orders do you process monthly?', type: 'text', showWhen: { field: 'ECOM_01', values: ['Redesign existing store', 'Fix/improve existing store', 'Platform migration'] } },
      { id: 'ECOM_13', label: 'What is your average order value?', type: 'text', showWhen: { field: 'ECOM_01', values: ['Redesign existing store', 'Fix/improve existing store', 'Platform migration'] } },
      { id: 'ECOM_14', label: 'What is the biggest problem with your existing store?', type: 'textarea', showWhen: { field: 'ECOM_01', values: ['Redesign existing store', 'Fix/improve existing store', 'Platform migration'] } },
    ]
  },
  'Landing Pages & Sales Funnels': {
    title: 'Landing Page & Sales Funnel Requirements',
    description: 'Tell us about the offer, conversion goal and traffic source for the page or funnel.',
    fields: [
      { id: 'LAND_01', label: 'What is the primary objective?', type: 'radio', required: true, options: ['Generate leads', 'Sell product', 'Sell service', 'Book calls/appointments', 'Webinar/event registration', 'Email signup', 'Download/free resource', 'Other'] },
      { id: 'LAND_02', label: 'What offer will this page promote?', type: 'textarea', required: true },
      { id: 'LAND_03', label: 'What action should visitors take?', type: 'radio', required: true, options: ['Buy', 'Submit form', 'Book call', 'Call business', 'Download', 'Register', 'Other'] },
      { id: 'LAND_04', label: 'Do you already have the page copy?', type: 'radio', options: ['Yes', 'Partially', 'Need ScaleLink to create it'] },
      { id: 'LAND_05', label: 'Do you have images/videos/graphics?', type: 'radio', options: ['Yes', 'Partially', 'Need ScaleLink to create/source them'] },
      { id: 'LAND_06', label: 'Where will visitors come from?', type: 'checkbox', options: ['Google Ads', 'Social media advertising', 'LinkedIn', 'YouTube', 'SEO', 'Email', 'Organic social media', 'Other', 'Not sure'] },
      { id: 'LAND_07', label: 'Does the page require a form?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'LAND_08', label: 'What information should the form collect?', type: 'textarea', showWhen: { field: 'LAND_07', values: ['Yes'] } },
      { id: 'LAND_09', label: 'Where should generated leads be sent?', type: 'checkbox', showWhen: { field: 'LAND_07', values: ['Yes'] }, options: ['Email', 'CRM', 'Email marketing platform', 'Spreadsheet', 'Other'] },
      { id: 'LAND_10', label: 'Is payment/checkout integration required?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'LAND_11', label: 'Is conversion tracking required?', type: 'checkbox', options: ['Google Analytics', 'Google Ads', 'Meta Pixel', 'LinkedIn Insight Tag', 'Other', 'Need recommendation'] },
    ]
  },
  'SEO & Search Marketing': {
    title: 'SEO & Search Marketing Requirements',
    description: 'Tell us what you want to rank for and where you want to grow.',
    fields: [
      { id: 'SEO_01', label: 'What is your main SEO objective?', type: 'checkbox', required: true, options: ['Generate leads', 'Increase sales', 'Increase organic traffic', 'Rank for keywords', 'Improve local visibility', 'Improve national visibility', 'Improve ecommerce visibility', 'Recover rankings', 'Not sure'] },
      { id: 'SEO_02', label: 'What type of SEO do you need?', type: 'radio', options: ['Local', 'National', 'Ecommerce', 'International', 'Technical', 'Not sure'] },
      { id: 'SEO_03', label: 'Which products/services are most important to rank?', type: 'textarea', required: true },
      { id: 'SEO_04', label: 'Which locations should we target?', type: 'textarea', required: true },
      { id: 'SEO_05', label: 'Who are your main search competitors?', type: 'textarea', helper: 'URLs/names' },
      { id: 'SEO_06', label: 'Are there specific keywords you want to rank for?', type: 'textarea', helper: 'Optional' },
      { id: 'SEO_07', label: 'Are you currently doing SEO?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
      { id: 'SEO_08', label: 'Have you previously hired an SEO provider?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'SEO_09', label: 'Which accounts do you currently have?', type: 'checkbox', options: ['Google Analytics', 'Google Search Console', 'Google Business Profile', 'Google Ads', 'None / Not sure'] },
      { id: 'SEO_10', label: 'Do you need:', type: 'radio', options: ['One-time SEO audit/setup', 'Ongoing monthly SEO', 'Not sure'] },
    ]
  },
  'Lead Generation Services': {
    title: 'Lead Generation Requirements',
    description: 'Tell us who you want to reach and what makes a lead valuable to your business.',
    fields: [
      { id: 'LEAD_01', label: 'What product/service do you want leads for?', type: 'textarea', required: true },
      { id: 'LEAD_02', label: 'Are you targeting?', type: 'radio', required: true, options: ['B2B', 'B2C', 'Both'] },
      { id: 'LEAD_03', label: 'Target industry/company type', type: 'text', showWhen: { field: 'LEAD_02', values: ['B2B', 'Both'] } },
      { id: 'LEAD_04', label: 'Target decision-maker/job title', type: 'text', showWhen: { field: 'LEAD_02', values: ['B2B', 'Both'] } },
      { id: 'LEAD_05', label: 'Describe your ideal consumer.', type: 'textarea', showWhen: { field: 'LEAD_02', values: ['B2C', 'Both'] } },
      { id: 'LEAD_06', label: 'Which geographic areas should we target?', type: 'textarea', required: true },
      { id: 'LEAD_07', label: 'What qualifies someone as a good lead?', type: 'textarea', required: true },
      { id: 'LEAD_08', label: 'Average customer value', type: 'radio', options: ['Under $100', '$100–$500', '$500–$1,000', '$1,000–$5,000', '$5,000+', 'Not sure'] },
      { id: 'LEAD_09', label: 'Approximately how many qualified leads would you like monthly?', type: 'text' },
      { id: 'LEAD_10', label: 'How do you currently generate leads?', type: 'checkbox', options: ['SEO', 'Paid advertising', 'Social media', 'Referrals', 'Email', 'Cold outreach', 'Networking', 'None', 'Other'] },
      { id: 'LEAD_11', label: 'What happens after you receive a lead?', type: 'checkbox', options: ['Phone follow-up', 'Sales representative', 'Email sequence', 'Appointment booking', 'CRM automation', 'Other'] },
      { id: 'LEAD_12', label: 'How quickly can your team respond?', type: 'radio', options: ['Immediately', 'Within 1 hour', 'Same day', '1–2 days', 'Longer'] },
    ]
  },
  'Paid Advertising Management': {
    title: 'Paid Advertising Requirements',
    description: 'Tell us what you want to advertise, where and what outcome matters most.',
    fields: [
      { id: 'ADS_01', label: 'Primary campaign objective', type: 'checkbox', required: true, options: ['Leads', 'Sales', 'Website traffic', 'Product/service promotion', 'Brand awareness', 'Appointments', 'Other'] },
      { id: 'ADS_02', label: 'What product/service will be advertised?', type: 'textarea', required: true },
      { id: 'ADS_03', label: 'Which platforms?', type: 'checkbox', options: ['Google Ads', 'Microsoft Ads', 'Facebook/Instagram', 'LinkedIn', 'YouTube', 'Need recommendation'] },
      { id: 'ADS_04', label: 'Have you advertised previously?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'ADS_05', label: 'Which platforms and what results did you achieve?', type: 'textarea', showWhen: { field: 'ADS_04', values: ['Yes'] } },
      { id: 'ADS_06', label: 'Do you already have advertising accounts?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'ADS_07', label: 'Do you have a landing page?', type: 'radio', options: ['Yes', 'No', 'Need ScaleLink to build one'] },
      { id: 'ADS_08', label: 'Do you have advertising creatives/copy?', type: 'radio', options: ['Yes', 'Partially', 'Need ScaleLink to create them'] },
      { id: 'ADS_09', label: 'Is conversion tracking installed?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
    ]
  },
  'Email Marketing Campaigns': {
    title: 'Email Marketing Requirements',
    description: 'Tell us about your list, platform and the outcome you want from email marketing.',
    fields: [
      { id: 'EMAIL_01', label: 'Primary email objective', type: 'checkbox', required: true, options: ['Generate sales', 'Nurture leads', 'Welcome subscribers', 'Promote products/services', 'Recover abandoned carts', 'Retain customers', 'Newsletter', 'Other'] },
      { id: 'EMAIL_02', label: 'Do you have an existing email list?', type: 'radio', required: true, options: ['Yes', 'No'] },
      { id: 'EMAIL_03', label: 'Approximately how many contacts?', type: 'text', showWhen: { field: 'EMAIL_02', values: ['Yes'] } },
      { id: 'EMAIL_04', label: 'How was the list collected?', type: 'textarea', showWhen: { field: 'EMAIL_02', values: ['Yes'] } },
      { id: 'EMAIL_05', label: 'Current email platform', type: 'checkbox', options: ['Systeme.io', 'Mailchimp', 'Brevo', 'Klaviyo', 'HubSpot', 'ActiveCampaign', 'Other', 'None'] },
      { id: 'EMAIL_06', label: 'What do you need?', type: 'checkbox', options: ['Strategy', 'Copywriting', 'Templates/design', 'Automation', 'Newsletters', 'Segmentation', 'Lead magnet funnel', 'Reporting', 'Full management'] },
      { id: 'EMAIL_07', label: 'Desired sending frequency', type: 'text' },
      { id: 'EMAIL_08', label: 'Do you have existing email content?', type: 'radio', options: ['Yes', 'Partially', 'No'] },
      { id: 'EMAIL_09', label: 'What action should recipients take?', type: 'textarea', required: true },
    ]
  },
  'Copywriting & Content Creation': {
    title: 'Copywriting & Content Creation Requirements',
    description: 'Tell us what content you need, who it is for and what action it should drive.',
    fields: [
      { id: 'CONTENT_01', label: 'What content do you need?', type: 'checkbox', required: true, options: ['Website copy', 'Blog/article', 'SEO article', 'Landing-page copy', 'Product descriptions', 'Emails', 'Social media', 'Advertising copy', 'Sales copy', 'Video scripts', 'Other'] },
      { id: 'CONTENT_02', label: 'Primary purpose', type: 'checkbox', options: ['Educate', 'Leads', 'Sales', 'SEO', 'Authority', 'Engagement'] },
      { id: 'CONTENT_03', label: 'What subject/product/service should the content cover?', type: 'textarea', required: true },
      { id: 'CONTENT_04', label: 'How many pieces/pages?', type: 'text', required: true },
      { id: 'CONTENT_05', label: 'Preferred tone', type: 'checkbox', options: ['Professional', 'Conversational', 'Educational', 'Persuasive', 'Technical', 'Friendly', 'Premium', 'Not sure'] },
      { id: 'CONTENT_06', label: 'Are there required keywords?', type: 'radio', options: ['Yes', 'No', 'Need keyword research'] },
      { id: 'CONTENT_07', label: 'What CTA should the content encourage?', type: 'textarea' },
    ]
  },
  'CRM & Marketing Automation': {
    title: 'CRM & Marketing Automation Requirements',
    description: 'Help us understand the workflow, systems and repetitive work you want to improve.',
    fields: [
      { id: 'CRM_01', label: 'What process would you like to automate?', type: 'textarea', required: true },
      { id: 'CRM_02', label: 'Do you currently use a CRM?', type: 'radio', required: true, options: ['Yes', 'No'] },
      { id: 'CRM_03', label: 'Which CRM?', type: 'text', showWhen: { field: 'CRM_02', values: ['Yes'] } },
      { id: 'CRM_04', label: 'What should the CRM manage?', type: 'checkbox', options: ['Leads', 'Customers', 'Sales pipeline', 'Follow-ups', 'Appointments', 'Email', 'Customer support', 'Tasks'] },
      { id: 'CRM_05', label: 'What should be automated?', type: 'checkbox', options: ['Lead capture', 'Lead assignment', 'Email follow-up', 'SMS', 'Appointment reminders', 'Pipeline updates', 'Customer onboarding', 'Notifications', 'Reporting'] },
      { id: 'CRM_06', label: 'Which other systems need integration?', type: 'textarea' },
      { id: 'CRM_07', label: 'How many team members will use the system?', type: 'text' },
      { id: 'CRM_08', label: 'Is data migration required?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
      { id: 'CRM_09', label: 'Describe your current workflow.', type: 'textarea' },
      { id: 'CRM_10', label: 'What currently takes too much time or causes problems?', type: 'textarea', required: true },
    ]
  },
  'Data Analytics & Reporting': {
    title: 'Data Analysis & Analytics Requirements',
    description: 'Tell us what you want to understand from your data and what decisions it should support.',
    fields: [
      { id: 'DATA_01', label: 'What would you like to understand from your data?', type: 'textarea', required: true },
      { id: 'DATA_02', label: 'What type of data?', type: 'checkbox', options: ['Sales', 'Marketing', 'Website', 'Customer', 'Financial', 'Operational', 'Inventory', 'Research', 'Other'] },
      { id: 'DATA_03', label: 'Where is the data stored?', type: 'checkbox', options: ['Excel', 'Google Sheets', 'CRM', 'Database', 'Ecommerce platform', 'Analytics platform', 'Multiple systems'] },
      { id: 'DATA_04', label: 'What do you need?', type: 'checkbox', options: ['Cleaning', 'Analysis', 'Dashboard', 'Visualization', 'KPI reporting', 'Marketing analytics', 'Sales analysis', 'Customer analysis', 'Automated reporting'] },
      { id: 'DATA_05', label: 'Which KPIs are important?', type: 'textarea' },
      { id: 'DATA_06', label: 'How frequently do you need reporting?', type: 'radio', options: ['One-time', 'Weekly', 'Monthly', 'Real-time'] },
      { id: 'DATA_07', label: 'What business decision should this analysis help you make?', type: 'textarea', required: true },
    ]
  },
  'Graphic Design': {
    title: 'Graphic Design Requirements',
    description: 'Tell us what needs to be designed, where it will be used and what assets you already have.',
    fields: [
      { id: 'GRAPHIC_01', label: 'What do you need designed?', type: 'checkbox', required: true, options: ['Social graphics', 'Advertisement/banner', 'Flyer', 'Brochure', 'Business card', 'Presentation', 'Infographic', 'Packaging', 'YouTube thumbnail', 'Website graphics', 'Other'] },
      { id: 'GRAPHIC_02', label: 'How many designs?', type: 'text', required: true },
      { id: 'GRAPHIC_03', label: 'Where will they be used?', type: 'textarea', required: true },
      { id: 'GRAPHIC_04', label: 'Required dimensions, if known', type: 'text' },
      { id: 'GRAPHIC_05', label: 'Do you have text/copy ready?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'GRAPHIC_06', label: 'Do you have images/assets?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'GRAPHIC_07', label: 'Describe the desired style.', type: 'textarea' },
      { id: 'GRAPHIC_08', label: 'Required file formats', type: 'checkbox', options: ['JPG', 'PNG', 'PDF', 'SVG', 'Editable/source files', 'Not sure'] },
    ]
  },
  'Brand Identity & Logo Design': {
    title: 'Brand Identity & Logo Design Requirements',
    description: 'Tell us what your brand should communicate and what visual direction you prefer.',
    fields: [
      { id: 'BRAND_01', label: 'Brand/business name', type: 'text', required: true, helper: 'If this matches the company name above, you can enter it again here only when needed for the brand project.' },
      { id: 'BRAND_02', label: 'Tagline, if applicable', type: 'text' },
      { id: 'BRAND_03', label: 'Is this?', type: 'radio', required: true, options: ['New brand', 'Rebrand', 'Logo redesign'] },
      { id: 'BRAND_04', label: 'What do you need?', type: 'checkbox', options: ['Logo', 'Logo variations', 'Color palette', 'Typography', 'Brand guidelines', 'Social branding', 'Business stationery', 'Complete identity'] },
      { id: 'BRAND_05', label: 'What should your brand communicate?', type: 'checkbox', options: ['Professional', 'Modern', 'Innovative', 'Premium', 'Friendly', 'Bold', 'Minimal', 'Traditional'] },
      { id: 'BRAND_06', label: 'Are there brands whose identity you like?', type: 'textarea' },
      { id: 'BRAND_07', label: 'Are there symbols/concepts you want included?', type: 'textarea' },
      { id: 'BRAND_08', label: "Anything you DON'T want included?", type: 'textarea' },
    ]
  },
  // The master form names this service "Color Palette & Visual Style Development".
  // It is not a separately priced service in the current package map, so it is
  // supported as a requirements definition without inventing package pricing.
  'Color Palette & Visual Style Development': {
    title: 'Color Palette & Visual Style Requirements',
    description: 'Tell us how the visual system should feel and where it will be used.',
    fields: [
      { id: 'COLOR_01', label: 'What will the colors be used for?', type: 'checkbox', required: true, options: ['Website', 'Brand', 'Application', 'Product', 'Marketing materials'] },
      { id: 'COLOR_02', label: 'Do you currently have brand colors?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'COLOR_03', label: 'What should the colors communicate?', type: 'checkbox', options: ['Trust', 'Luxury', 'Energy', 'Innovation', 'Calm', 'Professionalism', 'Friendly', 'Bold'] },
      { id: 'COLOR_04', label: 'Colors you prefer', type: 'text' },
      { id: 'COLOR_05', label: 'Colors to avoid', type: 'text' },
      { id: 'COLOR_06', label: 'Do you require accessibility/contrast considerations?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
    ]
  },
  'Video Editing & Motion Graphics': {
    title: 'Video Editing & Motion Graphics Requirements',
    description: 'Tell us about the footage, output and editing style you need.',
    fields: [
      { id: 'VIDEO_01', label: 'Video type', type: 'checkbox', required: true, options: ['YouTube', 'Social media', 'Advertisement', 'Corporate', 'Product', 'Educational', 'Short/Reel/TikTok', 'Other'] },
      { id: 'VIDEO_02', label: 'Number of videos', type: 'text', required: true },
      { id: 'VIDEO_03', label: 'Approximate raw footage length', type: 'text' },
      { id: 'VIDEO_04', label: 'Desired finished length', type: 'text' },
      { id: 'VIDEO_05', label: 'Where will videos be published?', type: 'textarea', required: true },
      { id: 'VIDEO_06', label: 'Required editing', type: 'checkbox', options: ['Cuts', 'Transitions', 'Captions', 'Sound design', 'Music', 'Color correction', 'Motion graphics', 'Animated text', 'Logo animation', 'B-roll', 'Stock footage'] },
      { id: 'VIDEO_07', label: 'Do you have footage?', type: 'radio', options: ['Yes', 'No', 'Partially'] },
      { id: 'VIDEO_08', label: 'Do you have script/voiceover?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'VIDEO_09', label: 'Output', type: 'radio', options: ['1080p', '4K', 'Not sure'] },
    ]
  },
  'Photography & Visual Assets': {
    title: 'Photo Editing & Retouching Requirements',
    description: 'These questions follow the master intake form for photo editing/retouching. Your current package catalog calls the corresponding service "Photography & Visual Assets".',
    fields: [
      { id: 'PHOTO_01', label: 'Photography type', type: 'checkbox', required: true, options: ['Product', 'Portrait', 'Corporate', 'Real estate', 'Ecommerce', 'Event', 'Social media', 'Other'] },
      { id: 'PHOTO_02', label: 'Number of photographs', type: 'text', required: true },
      { id: 'PHOTO_03', label: 'Required editing', type: 'checkbox', options: ['Color correction', 'Exposure', 'Retouching', 'Background removal', 'Background replacement', 'Object removal', 'Cropping/resizing', 'Product enhancement', 'Restoration'] },
      { id: 'PHOTO_04', label: 'Where will images be used?', type: 'textarea' },
      { id: 'PHOTO_05', label: 'Required dimensions/resolution', type: 'text' },
      { id: 'PHOTO_06', label: 'Required format', type: 'text' },
    ]
  },
  'Virtual Assistant Services': {
    title: 'Virtual Assistant Requirements',
    description: 'Tell us what support you need, how much time it will require and which tools are involved.',
    fields: [
      { id: 'VA_01', label: 'What assistance is required?', type: 'checkbox', required: true, options: ['Administrative', 'Email management', 'Calendar', 'Customer service', 'Research', 'Data entry', 'CRM', 'Social media', 'Ecommerce', 'Lead management', 'Other'] },
      { id: 'VA_02', label: 'Describe the tasks.', type: 'textarea', required: true },
      { id: 'VA_03', label: 'Required hours', type: 'radio', options: ['Under 10/week', '10–20', '20–30', '30–40', 'Not sure'] },
      { id: 'VA_04', label: 'Duration', type: 'radio', options: ['One-time', 'Short-term', 'Ongoing'] },
      { id: 'VA_05', label: 'Required working hours/time zone', type: 'text' },
      { id: 'VA_06', label: 'Which tools/software will be used?', type: 'text' },
      { id: 'VA_07', label: 'Is customer communication required?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'VA_08', label: 'What skills/experience are essential?', type: 'textarea' },
    ]
  },
  'Data Entry & Processing': {
    title: 'Data Entry & Processing Requirements',
    description: 'Tell us about the source data, destination, volume and processing requirements.',
    fields: [
      { id: 'ENTRY_01', label: 'Describe the data-entry work required.', type: 'textarea', required: true },
      { id: 'ENTRY_02', label: 'Source format', type: 'checkbox', options: ['PDF', 'Spreadsheet', 'Scanned documents', 'Website', 'CRM', 'Database', 'Images', 'Other'] },
      { id: 'ENTRY_03', label: 'Destination', type: 'checkbox', options: ['Excel', 'Google Sheets', 'CRM', 'Database', 'Website/CMS', 'Other'] },
      { id: 'ENTRY_04', label: 'Approximately how many records/items?', type: 'text', required: true },
      { id: 'ENTRY_05', label: 'What information needs to be captured?', type: 'textarea', required: true },
      { id: 'ENTRY_06', label: 'Additional processing required', type: 'checkbox', options: ['Cleaning', 'Formatting', 'Categorization', 'Deduplication', 'Validation', 'Research', 'Conversion'] },
      { id: 'ENTRY_07', label: 'Do you have a required template?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'ENTRY_08', label: 'Are there specific accuracy requirements?', type: 'textarea' },
    ]
  },

  // ─── ADDITIONAL PURCHASEABLE SERVICES ─────────────────────────────────────
  // These services exist in the site's service catalog but are not separately
  // defined in the supplied Master Dynamic Service Intake Form. The questions
  // below are service-specific intake extensions derived from the service names,
  // package scope and existing service catalog so every purchasable service has
  // a real requirements form instead of a generic fallback.
  'Web Applications & SaaS Development': {
    title: 'Web Applications & SaaS Development Requirements',
    description: 'Tell us about the application, users, workflows, data and integrations you need.',
    fields: [
      { id: 'APP_01', label: 'What is the application supposed to do?', type: 'textarea', required: true },
      { id: 'APP_02', label: 'Who will use the application?', type: 'checkbox', required: true, options: ['Customers', 'Employees', 'Administrators', 'Partners/vendors', 'Public users', 'Other'] },
      { id: 'APP_03', label: 'What user roles/permissions are required?', type: 'textarea' },
      { id: 'APP_04', label: 'Which core screens or features are needed?', type: 'textarea', required: true },
      { id: 'APP_05', label: 'Do you need user accounts/authentication?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
      { id: 'APP_06', label: 'What data should the system store?', type: 'textarea' },
      { id: 'APP_07', label: 'Which integrations are required?', type: 'textarea' },
      { id: 'APP_08', label: 'Do you need subscriptions or online payments?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
      { id: 'APP_09', label: 'Do you have an existing product, prototype or technical specification?', type: 'radio', options: ['Yes', 'Partially', 'No'] },
      { id: 'APP_10', label: 'Preferred technology or platform, if any', type: 'text' },
    ]
  },
  'Website Maintenance & Updates': {
    title: 'Website Maintenance & Updates Requirements',
    description: 'Tell us about the website, recurring work and issues you need us to manage.',
    fields: [
      { id: 'MAINT_01', label: 'What website needs maintenance?', type: 'url', required: true },
      { id: 'MAINT_02', label: 'What type of maintenance do you need?', type: 'checkbox', required: true, options: ['Content updates', 'Bug fixes', 'Security updates', 'Performance optimization', 'Backups', 'Plugin/theme updates', 'Design changes', 'Technical support', 'Other'] },
      { id: 'MAINT_03', label: 'What platform/CMS is the website using?', type: 'text' },
      { id: 'MAINT_04', label: 'What problems are you currently experiencing?', type: 'textarea', required: true },
      { id: 'MAINT_05', label: 'How often do you need support?', type: 'radio', options: ['One-time', 'Weekly', 'Monthly', 'Ongoing as needed'] },
      { id: 'MAINT_06', label: 'Do you have access to the website, hosting and domain?', type: 'radio', options: ['Yes', 'Some access', 'No', 'Not sure'] },
    ]
  },
  'Online Booking Systems': {
    title: 'Online Booking Systems Requirements',
    description: 'Tell us how customers should book, pay and receive confirmations.',
    fields: [
      { id: 'BOOK_01', label: 'What are customers booking?', type: 'textarea', required: true },
      { id: 'BOOK_02', label: 'How many services/bookable options do you have?', type: 'text', required: true },
      { id: 'BOOK_03', label: 'Who needs access to manage bookings?', type: 'checkbox', options: ['One administrator', 'Multiple staff', 'Multiple locations', 'Other'] },
      { id: 'BOOK_04', label: 'What scheduling rules are required?', type: 'textarea', required: true },
      { id: 'BOOK_05', label: 'Do you need automated reminders?', type: 'checkbox', options: ['Email', 'SMS', 'WhatsApp', 'None', 'Not sure'] },
      { id: 'BOOK_06', label: 'Is payment required during booking?', type: 'radio', options: ['Yes', 'No', 'Deposit only', 'Not sure'] },
      { id: 'BOOK_07', label: 'Which calendar/payment/CRM systems should connect?', type: 'textarea' },
    ]
  },
  'Social Media Management': {
    title: 'Social Media Management Requirements',
    description: 'Tell us about your platforms, audience, content and publishing goals.',
    fields: [
      { id: 'SOCIAL_01', label: 'Which platforms should we manage?', type: 'checkbox', required: true, options: ['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'X/Twitter', 'YouTube', 'Other'] },
      { id: 'SOCIAL_02', label: 'What are your main social media goals?', type: 'checkbox', required: true, options: ['Brand awareness', 'Lead generation', 'Sales', 'Engagement', 'Community growth', 'Traffic', 'Customer support', 'Other'] },
      { id: 'SOCIAL_03', label: 'How often would you like to publish?', type: 'text', required: true },
      { id: 'SOCIAL_04', label: 'What content types are needed?', type: 'checkbox', options: ['Feed posts', 'Short-form video/reels', 'Stories', 'Carousels', 'Graphics', 'Educational content', 'Promotional content', 'Other'] },
      { id: 'SOCIAL_05', label: 'Do you already have brand/content assets?', type: 'radio', options: ['Yes', 'Partially', 'No'] },
      { id: 'SOCIAL_06', label: 'Who should we target?', type: 'textarea' },
      { id: 'SOCIAL_07', label: 'Do you need community management?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
    ]
  },
  'Reputation & Review Management': {
    title: 'Reputation & Review Management Requirements',
    description: 'Tell us where your reviews live and how you want your reputation managed.',
    fields: [
      { id: 'REP_01', label: 'Which review platforms matter most?', type: 'checkbox', required: true, options: ['Google Business Profile', 'Facebook', 'Yelp', 'Tripadvisor', 'Trustpilot', 'Industry-specific platform', 'Other'] },
      { id: 'REP_02', label: 'What is your main reputation goal?', type: 'checkbox', required: true, options: ['Get more reviews', 'Improve review rating', 'Respond to reviews', 'Monitor reviews', 'Handle negative reviews', 'Build reputation strategy'] },
      { id: 'REP_03', label: 'What is your current approximate rating/review volume?', type: 'text' },
      { id: 'REP_04', label: 'Do you already request reviews from customers?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
      { id: 'REP_05', label: 'How should review requests be sent?', type: 'checkbox', options: ['Email', 'SMS', 'WhatsApp', 'In-person/QR', 'Not sure'] },
      { id: 'REP_06', label: 'Are there current reputation issues we should know about?', type: 'textarea' },
    ]
  },
  'API Integration & Automation': {
    title: 'API Integration & Automation Requirements',
    description: 'Tell us which systems need to connect and what data or workflows should move between them.',
    fields: [
      { id: 'API_01', label: 'Which systems need to be connected?', type: 'textarea', required: true },
      { id: 'API_02', label: 'What should happen automatically after the integration?', type: 'textarea', required: true },
      { id: 'API_03', label: 'Which data should be transferred or synchronized?', type: 'textarea', required: true },
      { id: 'API_04', label: 'Do you have API documentation/credentials available?', type: 'radio', options: ['Yes', 'Partially', 'No', 'Not sure'] },
      { id: 'API_05', label: 'How often should data sync occur?', type: 'radio', options: ['Real-time', 'Every few minutes', 'Hourly', 'Daily', 'On demand', 'Not sure'] },
      { id: 'API_06', label: 'What authentication/security requirements exist?', type: 'textarea' },
      { id: 'API_07', label: 'What should happen when an integration fails?', type: 'textarea' },
    ]
  },
  'AI Automation': {
    title: 'AI Automation Requirements',
    description: 'Describe the business process you want AI to improve or automate.',
    fields: [
      { id: 'AI_01', label: 'What business process should AI improve or automate?', type: 'textarea', required: true },
      { id: 'AI_02', label: 'What currently takes too much time or manual effort?', type: 'textarea', required: true },
      { id: 'AI_03', label: 'What would you like the AI system to do?', type: 'checkbox', required: true, options: ['Generate content', 'Answer customer questions', 'Qualify leads', 'Summarize information', 'Analyze data', 'Classify information', 'Automate workflows', 'Make recommendations', 'Other'] },
      { id: 'AI_04', label: 'Which tools/systems should AI work with?', type: 'textarea' },
      { id: 'AI_05', label: 'What data or knowledge should the AI use?', type: 'textarea' },
      { id: 'AI_06', label: 'What should success look like?', type: 'textarea', required: true },
      { id: 'AI_07', label: 'Are there privacy, security or compliance requirements?', type: 'textarea' },
    ]
  },
  'Business Process Automation': {
    title: 'Business Process Automation Requirements',
    description: 'Show us the process you want streamlined and the systems involved.',
    fields: [
      { id: 'BPA_01', label: 'Which business process should be automated?', type: 'textarea', required: true },
      { id: 'BPA_02', label: 'Describe the current process step by step.', type: 'textarea', required: true },
      { id: 'BPA_03', label: 'What triggers the process?', type: 'text', required: true },
      { id: 'BPA_04', label: 'What should happen automatically?', type: 'textarea', required: true },
      { id: 'BPA_05', label: 'Which tools/systems are involved?', type: 'textarea' },
      { id: 'BPA_06', label: 'What are the biggest bottlenecks or errors today?', type: 'textarea' },
      { id: 'BPA_07', label: 'Who should receive notifications or tasks?', type: 'text' },
    ]
  },
  'Business Consulting & Growth Strategy': {
    title: 'Business Consulting & Growth Strategy Requirements',
    description: 'Tell us where the business is today, where you want it to go and what is holding it back.',
    fields: [
      { id: 'CONSULT_01', label: 'What is the main business challenge you want help solving?', type: 'textarea', required: true },
      { id: 'CONSULT_02', label: 'What growth outcome are you targeting?', type: 'textarea', required: true },
      { id: 'CONSULT_03', label: 'What products/services drive the business today?', type: 'textarea' },
      { id: 'CONSULT_04', label: 'What are your current acquisition/sales channels?', type: 'checkbox', options: ['Referrals', 'Website', 'SEO', 'Paid ads', 'Social media', 'Email', 'Sales team', 'Partnerships', 'Other'] },
      { id: 'CONSULT_05', label: 'What have you already tried?', type: 'textarea' },
      { id: 'CONSULT_06', label: 'Which areas need the most attention?', type: 'checkbox', options: ['Marketing', 'Sales', 'Operations', 'Customer experience', 'Pricing', 'Positioning', 'Technology', 'Team/processes', 'Other'] },
      { id: 'CONSULT_07', label: 'What decisions or deliverables do you want from the engagement?', type: 'textarea' },
    ]
  },
  'Project Management Support': {
    title: 'Project Management Support Requirements',
    description: 'Tell us about the project, team, deadlines and coordination support you need.',
    fields: [
      { id: 'PM_01', label: 'What project needs management support?', type: 'textarea', required: true },
      { id: 'PM_02', label: 'What stage is the project currently in?', type: 'radio', options: ['Planning', 'In progress', 'Delayed', 'Launching', 'Ongoing operations'] },
      { id: 'PM_03', label: 'How many people/teams are involved?', type: 'text', required: true },
      { id: 'PM_04', label: 'What needs to be coordinated?', type: 'checkbox', options: ['Tasks', 'Deadlines', 'Team members', 'Vendors', 'Meetings', 'Stakeholders', 'Risks/issues', 'Documentation', 'Other'] },
      { id: 'PM_05', label: 'What tools do you currently use for project management?', type: 'text' },
      { id: 'PM_06', label: 'What are the most urgent project risks or blockers?', type: 'textarea' },
      { id: 'PM_07', label: 'What reporting/update cadence do you need?', type: 'radio', options: ['Weekly', 'Twice weekly', 'Monthly', 'As needed', 'Not sure'] },
    ]
  },
  'Process Documentation & SOP Development': {
    title: 'Process Documentation & SOP Requirements',
    description: 'Tell us which processes need to be documented and who will use the SOPs.',
    fields: [
      { id: 'SOP_01', label: 'Which process(es) need documentation?', type: 'textarea', required: true },
      { id: 'SOP_02', label: 'Approximately how many SOPs are needed?', type: 'text', required: true },
      { id: 'SOP_03', label: 'Who will use the documentation?', type: 'checkbox', options: ['Employees', 'Managers', 'Contractors', 'Customers', 'Vendors', 'Other'] },
      { id: 'SOP_04', label: 'Do existing process notes/materials exist?', type: 'radio', options: ['Yes', 'Partially', 'No'] },
      { id: 'SOP_05', label: 'What should the documentation include?', type: 'checkbox', options: ['Step-by-step instructions', 'Process maps', 'Roles/responsibilities', 'Checklists', 'Templates', 'Screenshots', 'Quality standards', 'Other'] },
      { id: 'SOP_06', label: 'What problems should the SOPs solve?', type: 'textarea' },
      { id: 'SOP_07', label: 'Preferred format/platform', type: 'text' },
    ]
  },
  'Request Custom Quote': {
    title: 'Custom Project Requirements',
    description: 'Give us enough information to understand the custom solution you need and prepare an accurate quote.',
    fields: [
      { id: 'CUSTOM_01', label: 'What do you need us to build, create or manage?', type: 'textarea', required: true },
      { id: 'CUSTOM_02', label: 'What problem should the project solve?', type: 'textarea', required: true },
      { id: 'CUSTOM_03', label: 'What are the main deliverables you expect?', type: 'textarea', required: true },
      { id: 'CUSTOM_04', label: 'Are there specific technologies, tools or platforms involved?', type: 'textarea' },
      { id: 'CUSTOM_05', label: 'Are there examples or references we should review?', type: 'textarea' },
      { id: 'CUSTOM_06', label: 'Anything else that would help us scope the project?', type: 'textarea' },
    ]
  },

};

// ─── SERVICE CATEGORIES (5 categories including Custom Quotes) ─────────────
const SERVICE_CATEGORIES = {

// ─── CATEGORY 1: WEBSITES & DEVELOPMENT ────────────────────────────────────
  'websites-development': {
    label: 'Websites & Development',
    services: [
      'Website Development',
      'E-Commerce Development',
      'Web Applications & SaaS Development',
      'Landing Pages & Sales Funnels',
      'Website Maintenance & Updates'
    ]
  },

  // ─── CATEGORY 2: MARKETING & GROWTH ─────────────────────────────────────────
  'marketing-growth': {
    label: 'Marketing & Growth',
    services: [
      'SEO & Search Marketing',
      'Lead Generation Services',
      'Paid Advertising Management',
      'Email Marketing Campaigns',
      'Copywriting & Content Creation'
    ]
  },

  // ─── CATEGORY 3: AUTOMATION & TECHNOLOGY ────────────────────────────────────
  'automation-technology': {
    label: 'Automation & Technology',
    services: [
      'CRM & Marketing Automation',
      'API Integration & Automation',
      'AI Automation',
      'Data Analytics & Reporting'
    ]
  },

  // ─── CATEGORY 4: CREATIVE & SUPPORT ────────────────────────────────────────
  'creative-support': {
    label: 'Creative & Support',
    services: [
      'Graphic Design',
      'Brand Identity & Logo Design',
      'Video Editing & Motion Graphics',
      'Photography & Visual Assets',
      'Virtual Assistant Services',
      'Data Entry & Processing'
    ]
  },

  // ─── CATEGORY 5: CUSTOM SOLUTIONS ──────────────────────────────────────────
  'custom-solutions': {
    label: 'Custom Solutions',
    services: [
      'Request Custom Quote'
    ]
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatPrice = (amount, currencyCode, currencySymbol) => {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const decimalAmount = currency.zeroDecimal ? (amount || 0) : (amount || 0) / 100;
  try {
    return new Intl.NumberFormat(navigator.language, { 
      style: 'currency', 
      currency: currencyCode, 
      minimumFractionDigits: currency.zeroDecimal ? 0 : 2, 
      maximumFractionDigits: currency.zeroDecimal ? 0 : 2 
    }).format(decimalAmount);
  } catch { 
    return `${currencySymbol}${decimalAmount.toFixed(currency.zeroDecimal ? 0 : 2)}`; 
  }
};

const getServiceDisplayName = (service) => {
  const value = typeof service === 'string' ? service : '';
  return value.split(' - ')[0]?.trim() || value.trim() || 'Service';
};

const getServiceIcon = (name) => {
  const iconMap = {
    'Graphic Design': FaPaintBrush,
    'Video Editing & Motion Graphics': FaVideo,
    'Copywriting & Content Creation': FaPenNib,
    'Brand Identity & Logo Design': FaPalette,
    'Photography & Visual Assets': FaCamera,
    'Website Development': FaCode,
    'Landing Pages & Sales Funnels': FaRocket,
    'E-Commerce Development': FaShoppingCart,
    'Web Applications & SaaS Development': FaGlobeAmericas,
    'API Integration & Automation': FaCloudUploadAlt,
    'Website Maintenance & Updates': FaShieldAlt,
    'Online Booking Systems': FaCalendar,
    'Social Media Management': FaUsers,
    'SEO & Search Marketing': FaSearchIcon,
    'Paid Advertising Management': FaAd,
    'Email Marketing Campaigns': FaEnvelopeIcon,
    'Lead Generation Services': FaRegBuilding,
    'Reputation & Review Management': FaStar,
    'CRM & Marketing Automation': FaCogs,
    'Virtual Assistant Services': FaHeadset,
    'Data Analytics & Reporting': FaChartBar,
    'Process Documentation & SOP Development': FaFileAlt,
    'Project Management Support': FaProjectDiagram,
    'Data Entry & Processing': FaDatabase,
    'AI Automation': FaRobot,
    'Business Process Automation': FaSyncAlt,
    'Business Consulting & Growth Strategy': FaBriefcase,
    'Request Custom Quote': FaCogs,
      };
  const key = getServiceDisplayName(name);
  return iconMap[key] || FaCogs;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// ─── Service Hover Preview Component ────────────────────────────────────────
const ServiceHoverPreview = ({ 
  service, 
  packageKey, 
  onClose, 
  servicesWithPackages = SERVICES_WITH_PACKAGES,
  convertedAmounts,
  currency = 'usd'
}) => {
  const serviceData = servicesWithPackages[service] || SERVICES_WITH_PACKAGES[service];
  const pkgData = serviceData?.packages?.[packageKey];
  const ServiceIcon = getServiceIcon(service);
  const isCustomQuote = service === 'Request Custom Quote' || service.includes('Request Custom Quote') || pkgData?.price === 0;
  
  if (!serviceData || !pkgData) return null;
  
  const slug = getServiceSlug(service);
  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const rawAmount = convertedAmounts?.[service]?.[packageKey] !== undefined
    ? convertedAmounts[service][packageKey]
    : pkgData.price;
  const formattedPrice = isCustomQuote || rawAmount === 0 
    ? 'Custom Quote' 
    : `${currencyObj.symbol}${(rawAmount / 100).toFixed(2)}`;
  
  return (
    <div className="bg-white rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <ServiceIcon className="text-blue-600 text-lg shrink-0" />
          <h4 className="font-bold text-gray-900 text-sm leading-snug break-words">{getServiceDisplayName(service)}</h4>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none shrink-0 ml-2">×</button>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex flex-wrap justify-between items-center gap-1">
          <span className="text-xs text-gray-500">{pkgData.name}</span>
          <span className="text-lg font-bold text-blue-600">
            {formattedPrice}
          </span>
        </div>
        <p className="text-xs text-gray-600">{pkgData.description}</p>
      </div>
      
      {pkgData.includes && pkgData.includes.length > 0 && !isCustomQuote && pkgData.price > 0 && (
        <div className="border-t border-gray-100 pt-2 mb-3">
          <p className="text-xs font-semibold text-gray-700 mb-1">Includes:</p>
          <ul className="space-y-0.5">
            {pkgData.includes.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                <FaCheck className="text-green-500 mt-0.5 shrink-0" size={10} />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
            {pkgData.includes.length > 3 && (
              <li className="text-xs text-gray-400">+{pkgData.includes.length - 3} more items</li>
            )}
          </ul>
        </div>
      )}
      
      <Link 
        to={`/services/${slug}`}
        className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
        onClick={onClose}
      >
        <FaInfoCircle size={12} />
        View Full Service Details
      </Link>
    </div>
  );
};

// ─── Legal Content ────────────────────────────────────────────────────────────
const privacyPolicyContent = [
  { title: 'Information We Collect', content: 'We collect Personal Information (name, email, phone, company), Usage Information (IP, browser, pages visited), and use Cookies/Tracking technologies.' },
  { title: 'How We Use Your Information', content: 'We use your data to respond to inquiries, provide services, improve our website, send updates (with consent), and never sell your personal information.' },
  { title: 'Data Sharing & Security', content: 'We share data only with service providers (hosting, analytics), legal authorities when required, and implement reasonable security measures.' },
  { title: 'Your Rights', content: 'You may access, correct, or delete your personal information and opt out of marketing communications by contacting support@scalelinkalliance.com.' },
];
const termsContent = [
  { title: 'Acceptance & Services', content: 'By using scalelinkalliance.com, you agree to these terms. We provide professional business support, networking, and growth services.' },
  { title: 'User Conduct', content: "You agree not to use the site for unlawful purposes, impersonate others, upload malware, or violate others' rights. We may terminate accounts for violations." },
  { title: 'Intellectual Property', content: 'All content belongs to Scale Link Alliance and is protected by copyright. You may not reproduce content without permission.' },
  { title: 'Limitation of Liability', content: 'Services are provided "as is." We are not liable for indirect damages, loss of data, revenue, or profits beyond the amount paid for services.' },
  { title: 'Governing Law', content: 'These Terms are governed by Illinois law. Continued use constitutes acceptance of any updates.' },
];

// ─── Fiverr-style package comparison table ────────────────────────────────────
const PackageComparisonTable = ({ service, selectedPackage, onSelect, currency, convertedAmounts, servicesWithPackages = SERVICES_WITH_PACKAGES }) => {
  const serviceData = servicesWithPackages[service] || SERVICES_WITH_PACKAGES[service];
  const packages = serviceData?.packages || {};
  const packageKeys = Object.keys(packages);
  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const isCustomQuote = service === 'Request Custom Quote' || service.includes('Request Custom Quote') || packages.custom?.price === 0;

  if (!serviceData) return null;

  if (isCustomQuote) {
    return (
      <div className="border-2 border-blue-200 rounded-xl bg-blue-50/50 p-5">
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
          {packages.custom?.includes.map((item, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
              <FaCheck className="text-green-500 mt-0.5 shrink-0" size={11} /><span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const packageOrder = ['starter', 'growth', 'premium'];
  const sortedPackageKeys = packageKeys.sort((a, b) => {
    return packageOrder.indexOf(a) - packageOrder.indexOf(b);
  });

  const buildCascadingFeatures = () => {
    const featuresMap = {};
    const allFeatures = [];

    sortedPackageKeys.forEach(pkgKey => {
      const pkgFeatures = packages[pkgKey]?.includes || [];
      pkgFeatures.forEach(feature => {
        if (!featuresMap[feature]) {
          featuresMap[feature] = { 
            name: feature, 
            packages: {},
            order: allFeatures.length 
          };
          allFeatures.push(feature);
        }
      });
    });

    sortedPackageKeys.forEach((pkgKey, index) => {
      const pkgFeatures = packages[pkgKey]?.includes || [];
      allFeatures.forEach(feature => {
        const hasFeature = pkgFeatures.includes(feature) || 
          sortedPackageKeys.slice(0, index).some(prevKey => 
            packages[prevKey]?.includes?.includes(feature)
          );
        featuresMap[feature].packages[pkgKey] = hasFeature;
      });
    });

    return { featuresMap, allFeatures };
  };

  const { featuresMap, allFeatures } = buildCascadingFeatures();

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
      <div className="min-w-[560px]">
        <div className="grid" style={{ gridTemplateColumns: `1.4fr repeat(${sortedPackageKeys.length}, 1fr)` }}>
          <div className="bg-gray-50 p-3 border-b border-r border-gray-200" />
          {sortedPackageKeys.map(k => {
            const pkg = packages[k];
            const amount = convertedAmounts[service]?.[k] || 0;
            return (
              <button key={k} type="button" onClick={() => onSelect(service, k)}
                className={`p-3 border-b border-r last:border-r-0 border-gray-200 text-center transition-colors ${selectedPackage === k ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-blue-50'}`}>
                <div className="font-bold text-sm">{pkg?.name || k}</div>
                <div className={`text-xs mt-0.5 ${selectedPackage === k ? 'text-blue-100' : 'text-gray-500'}`}>
                  {amount > 0 ? formatPrice(amount, currency, currencyObj.symbol) : 'Custom Quote'}
                </div>
              </button>
            );
          })}
          
          {allFeatures.map((feature) => (
            <React.Fragment key={feature}>
              <div className="p-3 text-xs text-gray-700 border-b border-r border-gray-200 bg-white">{feature}</div>
              {sortedPackageKeys.map(k => {
                const hasFeature = featuresMap[feature]?.packages[k] || false;
                const isSelected = selectedPackage === k;
                return (
                  <div key={k} className={`p-3 border-b border-r last:border-r-0 border-gray-200 flex items-center justify-center ${isSelected ? 'bg-blue-50/50' : 'bg-white'}`}>
                    {hasFeature ? <FaCheck className="text-green-500" size={12} /> : <span className="text-gray-300">—</span>}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
          
          <div className="p-3 border-r border-gray-200 bg-gray-50" />
          {sortedPackageKeys.map(k => (
            <div key={k} className="p-3 border-r last:border-r-0 border-gray-200 bg-gray-50 flex justify-center">
              <button type="button" onClick={() => onSelect(service, k)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedPackage === k ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:border-blue-400'}`}>
                {selectedPackage === k ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Live order sidebar (Step 1) ──────────────────────────────────────────────
const OrderSidebar = ({ 
  selectedServices, 
  convertedAmounts, 
  currency, 
  subtotalAmount = 0,
  discountRate = 0,
  discountAmount = 0,
  totalAmount, 
  isLoadingRates, 
  onRemove, 
  onContinue, 
  onCustomQuoteDirect, 
  continueLabel, 
  continueDisabled,
  servicesWithPackages = SERVICES_WITH_PACKAGES
}) => {
  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const entries = Object.entries(selectedServices);
  const hasCustomQuote = entries.some(([service]) => service.includes('Request Custom Quote') || (servicesWithPackages[service] || SERVICES_WITH_PACKAGES[service])?.packages?.custom?.price === 0);
  const isOnlyCustomQuote = hasCustomQuote && entries.length === 1;
  const isCustomQuoteWithOthers = hasCustomQuote && entries.length > 1;
  const count = entries.length;

  return (
    <div className="lg:sticky lg:top-24 max-h-[calc(100vh-7.5rem)] flex flex-col bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
      
      {/* ── Fixed Card Header ── */}
      <div className="p-4 sm:p-5 pb-3 shrink-0 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <FaShoppingCart className="text-blue-600 shrink-0" />
            Your Order
          </h3>
          {count > 0 && (
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              {count} {count === 1 ? 'service' : 'services'}
            </span>
          )}
        </div>

        {/* ── Tiered Bundle Discount Banner ── */}
        {count === 1 && (
          <div className="p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2 shadow-xs">
            <span className="text-sm shrink-0">💡</span>
            <p className="text-[11px] leading-tight">Add <strong>1 more service</strong> to save <strong>10%</strong> on your bundle!</p>
          </div>
        )}

        {count >= 2 && count <= 5 && (
          <div className="p-2.5 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm shrink-0">🎉</span>
              <div className="truncate">
                <p className="font-bold text-emerald-950 text-xs leading-tight">10% Bundle Discount Applied!</p>
                <p className="text-[10px] text-emerald-700 leading-tight">Add {6 - count} more for <strong>20% OFF</strong></p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-600 text-white font-extrabold text-[10px] rounded-full shrink-0 shadow-xs">
              10% OFF
            </span>
          </div>
        )}

        {count >= 6 && (
          <div className="p-2.5 bg-gradient-to-r from-emerald-100/80 to-teal-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm shrink-0">🔥</span>
              <div className="truncate">
                <p className="font-bold text-emerald-950 text-xs leading-tight">Max 20% Discount Applied!</p>
                <p className="text-[10px] text-emerald-700 leading-tight">Saving 20% across all {count} services</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-700 text-white font-extrabold text-[10px] rounded-full shrink-0 shadow-xs">
              20% OFF
            </span>
          </div>
        )}
      </div>

      {/* ── Scrollable Service Entries List (Flex-1) ── */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 min-h-[90px] max-h-[30vh] lg:max-h-none">
        {entries.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs">
            <p>No services selected yet.</p>
            <p className="text-[11px] mt-1 text-gray-400">Select services from the left to build your package.</p>
          </div>
        ) : (
          entries.map(([service, pkg]) => {
            const ServiceIcon = getServiceIcon(service);
            const pkgData = (servicesWithPackages[service] || SERVICES_WITH_PACKAGES[service])?.packages[pkg];
            const amount = convertedAmounts[service]?.[pkg] || 0;
            const isCustomQuote = service === 'Request Custom Quote' || service.includes('Request Custom Quote') || pkgData?.price === 0;
            return (
              <div key={service} className="flex items-center justify-between gap-2 text-xs bg-gray-50/80 hover:bg-gray-100/80 border border-gray-100 rounded-xl p-2 sm:p-2.5 transition-colors">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ServiceIcon size={11} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-[11px] sm:text-xs break-words leading-snug">{getServiceDisplayName(service)}</p>
                    <p className="text-[10px] text-gray-500 break-words leading-snug">{pkgData?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-gray-900 text-xs whitespace-nowrap">
                    {isCustomQuote || amount === 0 ? 'Quote' : formatPrice(amount, currency, currencyObj.symbol)}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => onRemove(service)} 
                    className="w-5 h-5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center transition-colors text-sm font-bold"
                    title="Remove service"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Pinned Bottom Action Footer (Always Visible & Accessible) ── */}
      <div className="shrink-0 p-4 sm:p-5 pt-3 bg-gray-50/95 border-t border-gray-200">
        {/* Price Breakdown */}
        {discountAmount > 0 ? (
          <div className="space-y-1 mb-3 text-xs">
            <div className="flex justify-between items-center text-gray-500 text-[11px]">
              <span>Subtotal ({count} items)</span>
              <span>{formatPrice(subtotalAmount, currency, currencyObj.symbol)}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-700 font-bold text-[11px]">
              <span>Bundle Discount ({Math.round(discountRate * 100)}% OFF)</span>
              <span>-{formatPrice(discountAmount, currency, currencyObj.symbol)}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-gray-200">
              <span className="font-bold text-gray-900 text-xs sm:text-sm">Total Due Today</span>
              <span className="text-xl sm:text-2xl font-extrabold text-blue-600">
                {isLoadingRates ? <FaSpinner className="animate-spin inline" /> : formatPrice(totalAmount, currency, currencyObj.symbol)}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center mb-3 pt-1">
            <span className="font-bold text-gray-900 text-xs sm:text-sm">Total</span>
            <span className="text-xl sm:text-2xl font-extrabold text-blue-600">
              {isLoadingRates ? <FaSpinner className="animate-spin inline" /> : totalAmount > 0 ? formatPrice(totalAmount, currency, currencyObj.symbol) : (hasCustomQuote && count > 0) ? 'Custom Quote' : formatPrice(0, currency, currencyObj.symbol)}
            </span>
          </div>
        )}

        {/* Custom Quote Direct Button */}
        {hasCustomQuote && totalAmount === 0 && (
          <button 
            type="button" 
            onClick={onCustomQuoteDirect}
            className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md mb-2"
          >
            Proceed with Custom Quote <FaArrowRight size={11} />
          </button>
        )}

        {/* Continue to Review CTA (Always Pinned & Accessible) */}
        <button 
          type="button" 
          onClick={onContinue} 
          disabled={continueDisabled || (hasCustomQuote && totalAmount === 0)}
          className={`w-full py-3 sm:py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
            continueDisabled || (hasCustomQuote && totalAmount === 0) 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.01]'
          }`}
        >
          <span>{continueLabel}</span>
          <FaArrowRight size={12} />
        </button>

        {isCustomQuoteWithOthers && (
          <p className="text-[10px] text-amber-700 mt-2 text-center font-medium leading-tight">
            Custom quote services will be scoped separately.
          </p>
        )}
      </div>

    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const RequestServicePage = () => {
  const location = useLocation();
  const [servicesWithPackages, setServicesWithPackages] = useState(SERVICES_WITH_PACKAGES);

  const fetchLiveCatalog = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/services');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (Array.isArray(data?.services) ? data.services : []);
        if (list.length > 0) {
          setServicesWithPackages(prev => mergeServicesWithPackages(list, prev, SLUG_TO_SERVICE_NAME));
        }
      }
    } catch (err) {
      console.warn('Using base packages fallback:', err);
    }
  }, []);

  useEffect(() => {
    fetchLiveCatalog();
    const unsubscribe = subscribeToServiceUpdates(() => {
      fetchLiveCatalog();
    });
    return () => unsubscribe();
  }, [fetchLiveCatalog]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [agreedToEscrow, setAgreedToEscrow] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState('privacy');
  const [paymentError, setPaymentError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [exchangeRates, setExchangeRates] = useState(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [convertedAmounts, setConvertedAmounts] = useState({});
  const [serverFileUrls, setServerFileUrls] = useState([]);
  
  // Hover preview state
  const [hoveredService, setHoveredService] = useState(null);
  const [previewTimer, setPreviewTimer] = useState(null);

  // Payment gate
  const [isPaid, setIsPaid] = useState(false);
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [checkoutSessionId, setCheckoutSessionId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    phoneDialCode: '+1', phoneCountryCode: 'US', phoneNumber: '',
    company: '', otherServiceDescription: '',
    projectDescription: '', timeline: '', budget: '',
    clientWebsite: '', clientLocation: '', clientIndustry: '',
    agreedToPrivacy: false, agreedToTerms: false,
  });

  const [customQuoteAnswers, setCustomQuoteAnswers] = useState({
    techStack: '', techIntegration: '', techHosting: '',
    opsSupportAreas: [], opsSupportAreasOther: '', opsHours: '', opsTools: '',
    creativeFormats: [], creativeFormatsOther: '', creativeDirection: '', creativeTurnaround: '',
    marketingChannels: [], marketingChannelsOther: '', marketingAdSpend: '', marketingAudience: '',
    aiFeatures: [],
    aiFeaturesOther: '',
    aiCurrentTools: '',
    aiTimeSpent: '',
    aiSuccessLooksLike: '',
  });
  
  // Answers are keyed by service, then FIELD_ID. This keeps multi-service
  // requests isolated and makes every master-form field traceable.
  const [serviceAnswers, setServiceAnswers] = useState({});

  const fullPhone = formData.phoneNumber ? `${formData.phoneDialCode} ${formData.phoneNumber}` : '';

  // ── Handle direct custom quote to Step 2 ──
  const handleCustomQuoteDirect = () => {
    setIsPaid(true);
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };

  // ── Check for step=2 param on load ──
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stepParam = params.get('step');
    const requestedSlug = params.get('service');
    const serviceSlug = requestedSlug === 'ai-custom-quote' ? 'ai-automation' : requestedSlug;
    
    if (stepParam === '2') {
      const hasCustomQuote = Object.keys(selectedServices).some(s => s.includes('Request Custom Quote') || servicesWithPackages[s]?.packages?.custom?.price === 0);
      
      if (hasCustomQuote) {
        setIsPaid(true);
        setCurrentStep(2);
        window.scrollTo(0, 0);
      } else if (serviceSlug) {
        const serviceName = SLUG_TO_SERVICE_NAME[serviceSlug];
        if (serviceName && (serviceName.includes('Request Custom Quote') || servicesWithPackages[serviceName]?.packages?.custom?.price === 0)) {
          setSelectedServices(prev => ({ ...prev, [serviceName]: 'custom' }));
          setTimeout(() => {
            setIsPaid(true);
            setCurrentStep(2);
            window.scrollTo(0, 0);
          }, 100);
        }
      }
    }
  }, [location.search, selectedServices]);

  // ── Fetch exchange rates ──
  useEffect(() => {
    setIsLoadingRates(true);
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => setExchangeRates(d.rates))
      .catch(() => setExchangeRates({ USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150.5, CNY: 7.19, CAD: 1.35, AUD: 1.52, CHF: 0.88, INR: 83.12, SGD: 1.34 }))
      .finally(() => setIsLoadingRates(false));
  }, []);

  // ── Auto-detect currency ──
  useEffect(() => {
    try {
      const c = new Intl.NumberFormat(navigator.language, { style: 'currency', currency: 'USD' }).resolvedOptions().currency.toLowerCase();
      if (CURRENCIES.find(x => x.code === c)) setSelectedCurrency(c);
    } catch { }
  }, []);

  // ── Pre-select the service + package passed from ServiceDetailPage's Continue link ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedSlug = params.get('service');
    const serviceSlug = requestedSlug === 'ai-custom-quote' ? 'ai-automation' : requestedSlug;
    const pkgParam = params.get('package');
    const stepParam = params.get('step');
    
    if (!serviceSlug) return;

    const serviceName = SLUG_TO_SERVICE_NAME[serviceSlug];
    const serviceData = serviceName ? (servicesWithPackages[serviceName] || SERVICES_WITH_PACKAGES[serviceName]) : null;
    if (!serviceData) return;

    const availablePackages = Object.keys(serviceData.packages || {});
    const packageKey = pkgParam && availablePackages.includes(pkgParam) ? pkgParam : availablePackages[0];
    if (!packageKey) return;

    setSelectedServices(prev => ({ ...prev, [serviceName]: packageKey }));
    
    if (stepParam === '2' && serviceName && (serviceName.includes('Request Custom Quote') || serviceData.packages?.custom?.price === 0)) {
      setTimeout(() => {
        setIsPaid(true);
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }, 200);
    }
    
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  // ── Handle return from Stripe Checkout ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const canceled = params.get('canceled');

    const restoreSelections = () => {
      try {
        const saved = JSON.parse(sessionStorage.getItem(CHECKOUT_STATE_KEY) || '{}');
        if (saved.selectedServices) setSelectedServices(saved.selectedServices);
        if (saved.selectedCurrency) setSelectedCurrency(saved.selectedCurrency);
      } catch { /* ignore malformed storage */ }
    };

    if (sessionId) {
      restoreSelections();
      setIsVerifyingPayment(true);
      fetch(`/api/verify-checkout-session?session_id=${encodeURIComponent(sessionId)}`)
        .then(r => r.json().then(data => ({ ok: r.ok, data })))
        .then(({ ok, data }) => {
          if (!ok || !data.paid) throw new Error(data.error || 'Payment could not be verified.');
          setIsPaid(true);
          setCheckoutSessionId(sessionId);
          if (data.email) setFormData(prev => ({ ...prev, email: data.email }));
          setCurrentStep(3);
          sessionStorage.removeItem(CHECKOUT_STATE_KEY);
        })
        .catch(err => {
          setPaymentError(err.message || 'We could not verify your payment. If you were charged, please contact support.');
          setCurrentStep(2);
        })
        .finally(() => {
          setIsVerifyingPayment(false);
          window.history.replaceState({}, '', window.location.pathname);
        });
    } else if (canceled) {
      restoreSelections();
      setCurrentStep(2);
      setPaymentError('Checkout was canceled. Your selections have been restored below — try again when ready.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Guard: Step 3 is only reachable once payment (or the $0 custom-quote bypass) has cleared
  useEffect(() => {
    if (currentStep === 3 && !isPaid) setCurrentStep(2);
  }, [currentStep, isPaid]);

  const convertAmount = useCallback((usd) => {
    if (!exchangeRates || usd === 0 || !selectedCurrency) return usd;
    const rate = exchangeRates[selectedCurrency.toUpperCase()];
    if (!rate) return usd;
    return Math.round(usd * rate);
  }, [exchangeRates, selectedCurrency]);

  useEffect(() => {
    const result = {};
    Object.keys(servicesWithPackages).forEach(service => {
      result[service] = {};
      Object.entries(servicesWithPackages[service]?.packages || {}).forEach(([key, pkg]) => {
        result[service][key] = convertAmount(pkg.price);
      });
    });
    setConvertedAmounts(result);
  }, [servicesWithPackages, selectedCurrency, exchangeRates, convertAmount]);

  const serviceCount = Object.keys(selectedServices).length;

  const hasCustomQuote = useMemo(() => {
    return Object.keys(selectedServices).some(
      s => s.includes('Request Custom Quote') || servicesWithPackages[s]?.packages?.custom?.price === 0
    );
  }, [selectedServices]);

  const discountRate = useMemo(() => {
    if (serviceCount >= 6) return 0.20;
    if (serviceCount >= 2) return 0.10;
    return 0;
  }, [serviceCount]);

  const subtotalAmount = useMemo(() => {
    return Object.entries(selectedServices).reduce((sum, [service, pkg]) => {
      return sum + (convertedAmounts[service]?.[pkg] || 0);
    }, 0);
  }, [selectedServices, convertedAmounts]);

  const discountAmount = useMemo(() => {
    if (discountRate === 0 || subtotalAmount === 0) return 0;
    return Math.round(subtotalAmount * discountRate);
  }, [subtotalAmount, discountRate]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotalAmount - discountAmount);
  }, [subtotalAmount, discountAmount]);

  const steps = [
    { number: 1, title: 'Select Services' },
    { number: 2, title: 'Review & Pay' },
    { number: 3, title: 'Your Details' },
  ];

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleServiceToggle = service => {
    setSelectedServices(prev => {
      const next = { ...prev };
      let categoryServices = [];
      for (const catKey in SERVICE_CATEGORIES) {
        if (SERVICE_CATEGORIES[catKey].services.includes(service)) {
          categoryServices = SERVICE_CATEGORIES[catKey].services;
          break;
        }
      }
      if (prev[service]) {
        delete next[service];
      } else {
        const isCustomQuote = service.includes('Request Custom Quote') || servicesWithPackages[service]?.packages?.custom?.price === 0;
        if (isCustomQuote) {
          categoryServices.forEach(s => { 
            const sIsCustom = s.includes('Request Custom Quote') || servicesWithPackages[s]?.packages?.custom?.price === 0;
            if (s !== service && sIsCustom) delete next[s]; 
          });
          next[service] = 'custom';
        } else {
          categoryServices.forEach(s => { 
            const sIsCustom = s.includes('Request Custom Quote') || servicesWithPackages[s]?.packages?.custom?.price === 0;
            if (sIsCustom) delete next[s]; 
          });
          next[service] = 'starter';
        }
      }
      return next;
    });
  };

  const removeService = service => setSelectedServices(p => { const n = { ...p }; delete n[service]; return n; });

  // ── Hover handlers ──
  const handleServiceHover = (service) => {
    if (previewTimer) clearTimeout(previewTimer);
    const timer = setTimeout(() => {
      setHoveredService(service);
    }, 300);
    setPreviewTimer(timer);
  };

  const handleServiceLeave = () => {
    if (previewTimer) clearTimeout(previewTimer);
    setTimeout(() => {
      setHoveredService(null);
    }, 200);
  };

  useEffect(() => () => uploadedFiles.forEach(f => { if (f.preview) URL.revokeObjectURL(f.preview); }), []);

  // Remove stale service answers when a service is removed from the order.
  useEffect(() => {
    setServiceAnswers(prev => {
      const allowed = new Set(Object.keys(selectedServices));
      const next = Object.fromEntries(
        Object.entries(prev).filter(([service]) => allowed.has(service))
      );
      return Object.keys(next).length === Object.keys(prev).length ? prev : next;
    });
  }, [selectedServices]);


  const updateServiceAnswer = (service, fieldId, value) => {
    setServiceAnswers(prev => ({
      ...prev,
      [service]: {
        ...(prev[service] || {}),
        [fieldId]: value
      }
    }));
  };

  const getServiceAnswer = (service, fieldId) => serviceAnswers[service]?.[fieldId];

  const isServiceFieldVisible = (service, field) => {
    if (field.hideWhenFormField && formData[field.hideWhenFormField]) return false;
    if (!field.showWhen) return true;
    const answer = getServiceAnswer(service, field.showWhen.field);
    const values = Array.isArray(answer) ? answer : [answer];
    return values.some(value => field.showWhen.values.includes(value));
  };

  const hasMeaningfulAnswer = value => Array.isArray(value)
    ? value.length > 0
    : typeof value === 'string'
      ? value.trim().length > 0
      : Boolean(value);

  const areServiceRequirementsComplete = useCallback(() => {
    for (const service of Object.keys(selectedServices)) {
      const definition = SERVICE_QUESTION_DEFINITIONS[service];
      if (!definition) {
        if (!hasMeaningfulAnswer(getServiceAnswer(service, 'SERVICE_REQUIREMENT_01'))) return false;
        continue;
      }
      for (const field of definition.fields) {
        if (!field.required || !isServiceFieldVisible(service, field)) continue;
        if (!hasMeaningfulAnswer(getServiceAnswer(service, field.id))) return false;
      }
    }
    return true;
  }, [selectedServices, serviceAnswers, formData]);

  const renderServiceQuestion = (service, field) => {
    if (!isServiceFieldVisible(service, field)) return null;

    const value = getServiceAnswer(service, field.id);
    const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all';
    const optionGrid = field.options?.length > 6 ? 'grid grid-cols-1 sm:grid-cols-2 gap-2' : 'grid grid-cols-1 sm:grid-cols-2 gap-2';

    if (field.type === 'radio') {
      return (
        <div className={optionGrid}>
          {field.options.map(option => (
            <label key={option} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              value === option ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' : 'border-gray-200 bg-white hover:border-blue-300'
            }`}>
              <input
                type="radio"
                name={`${service}-${field.id}`}
                checked={value === option}
                onChange={() => updateServiceAnswer(service, field.id, option)}
                className="mt-0.5 w-4 h-4 text-blue-600 shrink-0"
              />
              <span className="text-sm text-gray-700 leading-snug">{option}</span>
            </label>
          ))}
        </div>
      );
    }

    if (field.type === 'checkbox') {
      const checkedValues = Array.isArray(value) ? value : [];
      return (
        <div className={optionGrid}>
          {field.options.map(option => {
            const checked = checkedValues.includes(option);
            return (
              <label key={option} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                checked ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' : 'border-gray-200 bg-white hover:border-blue-300'
              }`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? checkedValues.filter(item => item !== option)
                      : [...checkedValues, option];
                    updateServiceAnswer(service, field.id, next);
                  }}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded shrink-0"
                />
                <span className="text-sm text-gray-700 leading-snug">{option}</span>
              </label>
            );
          })}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          rows={3}
          value={value || ''}
          onChange={e => updateServiceAnswer(service, field.id, e.target.value)}
          className={inputClass}
          placeholder={field.helper || 'Enter your answer...'}
        />
      );
    }

    return (
      <input
        type={field.type === 'url' ? 'url' : 'text'}
        value={value || ''}
        onChange={e => updateServiceAnswer(service, field.id, e.target.value)}
        className={inputClass}
        placeholder={field.helper || 'Enter your answer...'}
      />
    );
  };

  const renderDynamicServiceQuestions = () => {
    const selected = Object.keys(selectedServices);
    const supported = selected.filter(service => SERVICE_QUESTION_DEFINITIONS[service]);
    const unsupported = selected.filter(service => !SERVICE_QUESTION_DEFINITIONS[service]);

    if (!selected.length) return null;

    return (
      <section className="mt-8 sm:mt-10">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-4 sm:p-6 md:p-8">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] sm:text-xs font-bold uppercase tracking-wide">
              Service requirements
            </span>
            <h2 className="mt-3 text-xl sm:text-2xl font-extrabold text-gray-900">Tell us what you need for each service</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-3xl">
              Only the questions for the services you selected are shown. Common business, website and project information is collected once and is not repeated.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {supported.map(service => {
              const definition = SERVICE_QUESTION_DEFINITIONS[service];
              return (
                <motion.div
                  key={service}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100 bg-white">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 break-words">{definition.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">{definition.description}</p>
                  </div>

                  <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                    {definition.fields.map(field => {
                      if (!isServiceFieldVisible(service, field)) return null;
                      return (
                        <div
                          key={field.id}
                          className={`min-w-0 ${field.type === 'checkbox' || field.type === 'radio' || field.type === 'textarea' ? 'lg:col-span-2' : ''}`}
                        >
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          {renderServiceQuestion(service, field)}
                          {field.helper && field.type !== 'textarea' && (
                            <p className="mt-1.5 text-[11px] sm:text-xs text-gray-500">{field.helper}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}

            {unsupported.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">Additional service requirements</p>
                <p className="mt-1 text-xs sm:text-sm text-amber-800">
                  A service was selected that is not yet mapped in this page's catalog. You can still provide its requirements below so the request is never submitted without service context.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  {unsupported.map(service => (
                    <div key={service}>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">What do you need from {service}? <span className="text-red-500">*</span></label>
                      <textarea
                        rows={4}
                        required
                        value={getServiceAnswer(service, 'SERVICE_REQUIREMENT_01') || ''}
                        onChange={e => updateServiceAnswer(service, 'SERVICE_REQUIREMENT_01', e.target.value)}
                        className={inputClass}
                        placeholder={`Describe what you need from ${service}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  const uploadFiles = async () => {
    if (!uploadedFiles.length) return [];
    const fd = new FormData();
    uploadedFiles.forEach(f => fd.append('files', f.file));
    fd.append('requestId', Date.now().toString()); fd.append('email', formData.email); fd.append('company', formData.company);
    const res = await fetch(`/api/upload-files`, { method: 'POST', body: fd });
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch { throw new Error('Upload failed'); }
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.fileUrls || [];
  };

  // ── EMAIL TEMPLATE PARAMS ─────────────────────────────────────────────────
  const buildTemplateParams = () => {
    const currencyObj = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];
    const serviceEntries = Object.entries(selectedServices);
    const servicesLine = serviceEntries
      .map(([svc, pkg]) => {
        const pkgData = (servicesWithPackages[svc] || SERVICES_WITH_PACKAGES[svc])?.packages?.[pkg];
        return `${svc} (${pkgData?.name || pkg})`;
      })
      .join(', ') || 'None selected';
    const totalLine = totalAmount > 0 ? formatPrice(totalAmount, selectedCurrency, currencyObj.symbol) : 'Custom Quote';
    const totalSizeRaw = uploadedFiles.reduce((acc, f) => acc + (Number(f.size) || 0), 0);
    const fileListFormatted = uploadedFiles.length > 0
      ? uploadedFiles.map(f => `• ${f.name || 'File'} (${formatFileSize(f.size || 0)})`).join('\n')
      : 'No files uploaded';
    const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Valued Client';
    const paymentStatus = totalAmount > 0
      ? (isPaid ? `Paid via Stripe Checkout (Session: ${checkoutSessionId})` : 'Unpaid')
      : 'Quote Requested';

    return {
      title: serviceEntries.length > 0 ? serviceEntries[0][0] : 'New Service Request',
      name: fullName,
      email: formData.email || '',
      from_name: fullName,
      from_email: formData.email || '',
      reply_to: formData.email || '',
      company: formData.company || 'Not provided',
      phone: fullPhone || 'Not provided',
      services: servicesLine,
      project_description: formData.projectDescription || 'Not provided',
      other_service_description: formData.otherServiceDescription || 'None',
      timeline: formData.timeline || 'Not specified',
      budget: formData.budget || 'Not specified',
      total_amount: totalLine,
      payment_status: paymentStatus,
      file_count: uploadedFiles.length.toString(),
      total_file_size: formatFileSize(totalSizeRaw),
      uploaded_files: fileListFormatted,
      service_requirements: JSON.stringify(serviceAnswers, null, 2),
      request_date: new Date().toLocaleString(),
      // AI-specific fields
      ai_features: customQuoteAnswers.aiFeatures.join(', ') || 'Not specified',
      ai_features_other: customQuoteAnswers.aiFeaturesOther || '',
      ai_current_tools: customQuoteAnswers.aiCurrentTools || 'Not specified',
      ai_time_spent: customQuoteAnswers.aiTimeSpent || 'Not specified',
      ai_success_looks_like: customQuoteAnswers.aiSuccessLooksLike || 'Not specified',
    };
  };

  const sendEmailNotification = async () => {
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, buildTemplateParams(), EMAILJS_PUBLIC_KEY);
    } catch (err) { console.error('EmailJS error:', err); }
  };

  const createNoticeBoardJob = async (fileUrls = []) => {
    try {
      const res = await fetch('/api/public/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone,
          services: selectedServices,
          subtotalAmount,
          discountPercentage: Math.round(discountRate * 100),
          discountAmount,
          totalAmount,
          currency: selectedCurrency,
          files: fileUrls,
          paymentStatus: totalAmount > 0 ? (isPaid ? 'paid' : 'unpaid') : 'quote_requested',
          checkoutSessionId,
          projectScope: { customQuoteAnswers, serviceAnswers }
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Server error saving request.');
      }
    } catch (err) {
      console.error('Failed to create notice board job:', err);
      throw err;
    }
  };

  // ── Step 2 → Stripe Checkout; $0 custom quote requests skip payment ──
  const legalAgreed = formData.agreedToPrivacy && formData.agreedToTerms;
  const canProceedFromReview = legalAgreed && agreedToEscrow && !isSubmitting && !isLoadingRates;

  const handleContinueFromReview = async () => {
    if (!canProceedFromReview) return;

    if (totalAmount === 0) {
      setIsPaid(true);
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    setIsRedirectingToStripe(true);
    setPaymentError(null);
    try {
      sessionStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify({
        selectedServices,
        selectedCurrency,
        subtotalAmount,
        discountRate,
        discountAmount,
        totalAmount
      }));
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services: selectedServices,
          currency: selectedCurrency,
          amount: totalAmount, // Exact discounted amount
          subtotalAmount,
          discountPercentage: Math.round(discountRate * 100),
          discountAmount,
          customer_email: formData.email || undefined,
          success_url: `${window.location.origin}${window.location.pathname}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}${window.location.pathname}?canceled=true`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Failed to start checkout.');
      window.location.href = data.url;
    } catch (err) {
      setPaymentError(err.message || 'Failed to start checkout. Please try again.');
      setIsSubmitting(false);
      setIsRedirectingToStripe(false);
    }
  };

  // ── Step 3 final submission (post-payment) ──
  const isStep3Complete = !!(formData.firstName?.trim() && formData.lastName?.trim() && formData.email?.trim() &&
    formData.phoneNumber?.trim() && formData.company?.trim() && formData.projectDescription?.trim() &&
    areServiceRequirementsComplete()
  );

  const handleFinalSubmit = async () => {
    if (!isStep3Complete || isSubmitting) return;
    setIsSubmitting(true);
    setPaymentError(null);
    try {
      const fileUrls = await uploadFiles();
      setServerFileUrls(fileUrls);
      await createNoticeBoardJob(fileUrls);
      await sendEmailNotification();
      setSubmitSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      setPaymentError(err.message || 'Failed to submit your details. Your payment was already processed — please contact support so we can finish setting up your project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => { 
    // If custom quote is selected, go directly to step 2
    const hasCustomQuote = Object.keys(selectedServices).some(s => s.includes('Request Custom Quote') || servicesWithPackages[s]?.packages?.custom?.price === 0);
    if (hasCustomQuote && totalAmount === 0) {
      setIsPaid(true);
      setCurrentStep(2);
      window.scrollTo(0, 0);
      return;
    }
    if (currentStep < 3) { 
      setCurrentStep(p => p + 1); 
      window.scrollTo(0, 0); 
    } 
  };
  
  const prevStep = () => { if (currentStep > 1) { setCurrentStep(p => p - 1); window.scrollTo(0, 0); } };

  const currencyObj = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];
  
const categoryMeta = [
  {
    cat: 'websites-development',
    bg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    border: 'hover:border-blue-300',
    gradient: 'from-blue-50 to-blue-100/30'
  },
  {
    cat: 'marketing-growth',
    bg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    border: 'hover:border-emerald-300',
    gradient: 'from-emerald-50 to-emerald-100/30'
  },
  {
    cat: 'automation-technology',
    bg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    border: 'hover:border-amber-300',
    gradient: 'from-amber-50 to-amber-100/30'
  },
  {
    cat: 'creative-support',
    bg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    border: 'hover:border-purple-300',
    gradient: 'from-purple-50 to-purple-100/30'
  },
  {
    cat: 'custom-solutions',
    bg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    border: 'hover:border-slate-300',
    gradient: 'from-slate-50 to-slate-100/30'
  }
];

const categoryIcons = {
  'websites-development': FaCode,
  'marketing-growth': FaChartLine,
  'automation-technology': FaCogs,
  'creative-support': FaPaintBrush,
  'custom-solutions': FaCogs
};

// ── Verifying payment (full-page interstitial after Stripe redirect) ──
  if (isVerifyingPayment) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4 mx-auto" />
          <p className="text-gray-600 font-medium">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  // ── Success screen ──
  if (submitSuccess) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><FaCheck className="text-3xl text-green-600" /></div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{totalAmount > 0 ? 'Payment Successful!' : 'Request Received!'}</h1>
            <p className="text-gray-600 mb-8 text-base md:text-lg">{totalAmount > 0 ? `Thank you for your payment of ${formatPrice(totalAmount, selectedCurrency, currencyObj.symbol)}. Our team will contact you within 24 hours.` : 'Thank you for your request. We will be in touch within 24 hours.'}</p>
            {uploadedFiles.length > 0 && <p className="text-sm text-gray-500 mb-8">{uploadedFiles.length} file(s) uploaded successfully</p>}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Return to Home</Link>
              <button onClick={() => window.print()} className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">Print Confirmation</button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 pb-20">
      <div className="container mx-auto px-4">
        {/* Progress bar - responsive */}
        <div className="max-w-5xl mx-auto mb-8 pt-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className={`flex items-center flex-1 ${currentStep === step.number ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {currentStep > step.number ? <FaCheck size={14} /> : step.number}
                </div>
                <div className="ml-2 sm:ml-3 hidden xs:block">
                  <p className={`text-[10px] sm:text-xs font-semibold uppercase ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'}`}>Step {step.number}</p>
                  <p className={`text-[10px] sm:text-sm font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</p>
                </div>
                {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 sm:mx-4 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* ── Step 1: Service Selection + Add-ons ── */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid lg:grid-cols-[1fr_360px] gap-6 md:gap-8 items-start">
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-12">
                <div className="mb-6 md:mb-8">
                  <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Step 1 of 3</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3 md:mb-4">Service Selection</h2>
                  <p className="text-gray-600 text-sm sm:text-base">Pick your services, then compare packages side-by-side.</p>
                  <div className="mt-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs sm:text-sm font-semibold">
                    Starting price options are shown during service selection. Custom quotes are available for larger or more detailed projects.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                  {categoryMeta.map(({ cat, bg, iconColor, border, gradient }) => {
                    const catData = SERVICE_CATEGORIES[cat];
                    const CatIcon = categoryIcons[cat] || FaCogs;
                    return (
                      <div key={cat} className={`bg-gradient-to-br ${gradient} p-4 sm:p-5 rounded-xl border-2 border-gray-200 ${border} transition-all duration-200 shadow-sm hover:shadow-md`}>
                        <div className="flex items-center mb-3 sm:mb-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 ${bg} rounded-lg flex items-center justify-center mr-2 sm:mr-3 shrink-0`}>
                            <CatIcon className={`${iconColor} text-lg sm:text-xl`} />
                          </div>
                          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 leading-tight">{catData.label}</h3>
                        </div>
                        <div className="space-y-2 sm:space-y-2.5">
                          {catData.services.map(service => {
                            const ServiceIcon = getServiceIcon(service);
                            const isSelected = !!selectedServices[service];
                            const serviceSlug = getServiceSlug(service);
                            const selectedPkg = selectedServices[service] || 'starter';
                            const isCustomQuote = service.includes('Request Custom Quote') || servicesWithPackages[service]?.packages?.custom?.price === 0;
                            
                            return (
                              <div 
                                key={service} 
                                className="relative"
                                onMouseEnter={() => handleServiceHover(service)}
                                onMouseLeave={handleServiceLeave}
                              >
                                <label className={`flex items-center p-2 sm:p-2.5 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50/70' : 'border-gray-200 hover:border-gray-300 hover:bg-white/70'}`}>
                                  <input 
                                    type="checkbox" 
                                    checked={isSelected} 
                                    onChange={() => handleServiceToggle(service)} 
                                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 shrink-0" 
                                  />
                                  <div className="ml-2 sm:ml-3 flex-1 flex items-center min-w-0">
                                    <span className="text-gray-700 font-medium text-xs sm:text-sm break-words leading-snug">{getServiceDisplayName(service)}</span>
                                  </div>
                                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                    {isSelected && <FaCheck className="text-green-500" size={12} />}
                                  </div>
                                </label>
                                
                                {/* Mobile-friendly hover preview - hidden on small screens */}
                                {hoveredService === service && isSelected && (
                                  <div 
                                    className="absolute z-50 w-[min(320px,calc(100vw-2.5rem))] bg-white rounded-xl shadow-2xl border-2 border-blue-200 p-5 top-full left-0 mt-2 xl:top-0 xl:left-full xl:ml-3 xl:mt-0 animate-fade-in hidden sm:block"
                                    onMouseEnter={() => {
                                      if (previewTimer) clearTimeout(previewTimer);
                                      setHoveredService(service);
                                    }}
                                    onMouseLeave={() => {
                                      setHoveredService(null);
                                    }}
                                  >
                                    <ServiceHoverPreview 
                                      service={service} 
                                      packageKey={selectedPkg}
                                      onClose={() => setHoveredService(null)}
                                      servicesWithPackages={servicesWithPackages}
                                      convertedAmounts={convertedAmounts}
                                      currency={selectedCurrency}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {Object.keys(selectedServices).length > 0 && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Compare Packages</h3>
                    <div className="space-y-6 sm:space-y-8">
                      {Object.entries(selectedServices).map(([service, pkg]) => {
                        const isCustomQuote = service.includes('Request Custom Quote') || servicesWithPackages[service]?.packages?.custom?.price === 0;
                        return (
                          <div key={service}>
                            <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                              <span className="break-words leading-snug">{isCustomQuote ? `Custom Quote: ${getServiceDisplayName(service)}` : getServiceDisplayName(service)}</span>
                            </h4>
                            <PackageComparisonTable
                              service={service}
                              selectedPackage={pkg}
                              onSelect={(s, k) => setSelectedServices(p => ({ ...p, [s]: k }))}
                              currency={selectedCurrency}
                              convertedAmounts={convertedAmounts}
                              servicesWithPackages={servicesWithPackages}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Sidebar - sticky on desktop, normal flow on mobile */}
              <div className="lg:sticky lg:top-24">
                <OrderSidebar
                  selectedServices={selectedServices}
                  convertedAmounts={convertedAmounts}
                  currency={selectedCurrency}
                  subtotalAmount={subtotalAmount}
                  discountRate={discountRate}
                  discountAmount={discountAmount}
                  totalAmount={totalAmount}
                  isLoadingRates={isLoadingRates}
                  onRemove={removeService}
                  onContinue={nextStep}
                  onCustomQuoteDirect={handleCustomQuoteDirect}
                  continueLabel="Continue to Review"
                  continueDisabled={Object.keys(selectedServices).length === 0}
                  servicesWithPackages={servicesWithPackages}
                />
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Review Terms & Pay ── */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="mb-6 md:mb-8">
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Step 2 of 3</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3 md:mb-4">Review Terms & Pay</h2>
                <p className="text-gray-600 text-sm sm:text-base">Agree to our terms, then complete secure checkout. You'll fill in your contact and project details right after.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Left: Legal */}
                <div>
                 <div className="flex mb-4 md:mb-6">
                    <div className="bg-gray-100 p-1 rounded-lg flex w-full sm:inline-flex sm:w-auto">
                      {[['privacy', 'Privacy Policy', FaLock], ['terms', 'Terms of Service', FaFileContract]].map(([id, label, Icon]) => (
                        <button key={id} type="button" onClick={() => setActiveLegalTab(id)}
                          className={`flex-1 sm:flex-none px-2 sm:px-5 py-1.5 sm:py-2 rounded-md font-semibold text-[10px] sm:text-sm transition-all whitespace-nowrap ${activeLegalTab === id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                          <Icon className="inline mr-1 sm:mr-2 text-xs sm:text-sm" />{label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 md:mb-6 max-h-72 overflow-y-auto border border-gray-200">
                    {(activeLegalTab === 'privacy' ? privacyPolicyContent : termsContent).map((section, idx) => (
                      <div key={idx} className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 mb-3">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center text-xs sm:text-sm">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs mr-2 shrink-0">{idx + 1}</span>
                          {section.title}
                        </h4>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{section.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 bg-white border-2 border-gray-200 rounded-xl p-3 sm:p-5">
                    {[['agreedToPrivacy', 'I agree to the Privacy Policy', 'I have read and understand how Scale Link Alliance collects, uses, and protects my personal information.'],
                    ['agreedToTerms', 'I agree to the Terms of Service', 'I have read and agree to abide by the Terms of Service, including user conduct guidelines and liability limitations.'] 
                    ].map(([name, title, desc]) => (
                      <label key={name} className="flex items-start p-2 sm:p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="checkbox" name={name} checked={formData[name]} onChange={handleInputChange} className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 mt-0.5 shrink-0" />
                        <div className="ml-2 sm:ml-3">
                          <span className="block font-semibold text-gray-900 text-xs sm:text-sm">{title} *</span>
                          <span className="block text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">{desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Right: Payment Summary - responsive */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border-2 border-blue-200 shadow-md h-fit">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2"><FaCreditCard className="text-blue-600 shrink-0" />Order Summary</h3>
                  <div className="mb-4 md:mb-6"><CurrencySelector selectedCurrency={selectedCurrency} onCurrencyChange={setSelectedCurrency} /></div>
                  <div className="space-y-2 sm:space-y-3 mb-4 md:mb-6 bg-white p-3 sm:p-4 rounded-lg">
                    {Object.entries(selectedServices).map(([service, pkg]) => {
                      const ServiceIcon = getServiceIcon(service), amount = convertedAmounts[service]?.[pkg] || 0, pkgData = (servicesWithPackages[service] || SERVICES_WITH_PACKAGES[service])?.packages[pkg];
                      const isCustomQuote = service === 'Request Custom Quote' || service.includes('Request Custom Quote') || pkgData?.price === 0;
                      return (
                        <div key={service} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-sm border-b border-gray-100 pb-2">
                          <span className="text-gray-700 flex items-start sm:items-center min-w-0">
                            <span className="break-words text-xs sm:text-sm">{service}<span className="text-[10px] sm:text-xs text-gray-500 ml-1">({pkgData?.name})</span></span>
                          </span>
                          <span className="font-medium text-gray-900 shrink-0 text-xs sm:text-sm">{isLoadingRates ? '...' : isCustomQuote || amount === 0 ? 'Custom Quote' : formatPrice(amount, selectedCurrency, currencyObj.symbol)}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Bundle Discount Callout in Step 2 */}
                  {discountAmount > 0 && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900 shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🎉</span>
                        <div>
                          <span className="font-bold">{Math.round(discountRate * 100)}% Bundle Savings Applied</span>
                          <p className="text-[10px] text-emerald-700">You save {formatPrice(discountAmount, selectedCurrency, currencyObj.symbol)} on this bundle</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-full">
                        -{Math.round(discountRate * 100)}%
                      </span>
                    </div>
                  )}

                  <div className="border-t-2 border-blue-200 pt-3 sm:pt-4 mb-4 md:mb-6 space-y-2">
                    {discountAmount > 0 && (
                      <>
                        <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                          <span>Subtotal ({serviceCount} services):</span>
                          <span>{formatPrice(subtotalAmount, selectedCurrency, currencyObj.symbol)}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm text-emerald-700 font-bold">
                          <span>Bundle Discount ({Math.round(discountRate * 100)}% OFF):</span>
                          <span>-{formatPrice(discountAmount, selectedCurrency, currencyObj.symbol)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-blue-100">
                      <span className="text-base sm:text-lg font-bold text-gray-900">Total Due Today:</span>
                      <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                        {isLoadingRates ? <FaSpinner className="animate-spin inline" /> : totalAmount > 0 ? formatPrice(totalAmount, selectedCurrency, currencyObj.symbol) : hasCustomQuote ? 'Custom Quote' : formatPrice(0, selectedCurrency, currencyObj.symbol)}
                      </span>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm flex justify-between items-start">
                      <span className="break-words">{paymentError}</span>
                      <button type="button" onClick={() => setPaymentError(null)} className="text-red-800 font-bold ml-2 shrink-0">✕</button>
                    </div>
                  )}

                  <div className="mb-3 sm:mb-4 bg-slate-50 border border-slate-200 p-3 sm:p-4 rounded-xl text-left">
                    <p className="text-[10px] sm:text-xs text-slate-600 mb-2 leading-relaxed font-medium">
                      For approved projects, ScaleLink Alliance may use deposit, milestone, or escrow-based payment terms to protect both the client and the service team. Payment details will be clearly listed in the approved quote, invoice, or project agreement before work begins.
                    </p>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToEscrow}
                        onChange={e => setAgreedToEscrow(e.target.checked)}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5 cursor-pointer shrink-0"
                      />
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-700 leading-tight">
                        I agree to the <a href="/legal?tab=escrow" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ScaleLink Alliance Payment & Escrow Terms</a> and understand my project may require a deposit, milestone, or escrow-based payment.
                      </span>
                    </label>
                  </div>

                  <button type="button" onClick={handleContinueFromReview} disabled={!canProceedFromReview}
                    className="w-full py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base sm:text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl mb-3 sm:mb-4 text-center">
                    {isRedirectingToStripe ? <><FaSpinner className="animate-spin" />Redirecting to Secure Checkout...</> :
                      isLoadingRates ? <><FaSpinner className="animate-spin" />Loading Exchange Rates...</> :
                        totalAmount > 0 ? <><FaCreditCard className="text-lg sm:text-xl" />Proceed to Secure Checkout<FaArrowRight className="text-xs sm:text-sm" /></> :
                          <><FaPaperPlane />Request Custom Quote</>}
                  </button>
                  <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-gray-600 bg-white bg-opacity-50 p-2 sm:p-3 rounded-lg">
                    <FaLock className="text-green-600 shrink-0" />
                    <span><>Secured by <strong>Stripe</strong>. We never store your card information.</></span>
                  </div>
                  <div className="mt-3 sm:mt-4 text-center">
                    <button type="button" onClick={prevStep} className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm flex items-center justify-center gap-1 mx-auto"><FaArrowLeft className="text-xs" /> Back to services</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Contact Info + Project Details (post-payment) ── */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="mb-6 md:mb-8">
                {totalAmount > 0 && (
                  <div className="mb-4 md:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0"><FaCheck className="text-green-600 text-sm sm:text-base" /></div>
                    <p className="text-xs sm:text-sm text-green-800 font-semibold break-words">Payment confirmed — {formatPrice(totalAmount, selectedCurrency, currencyObj.symbol)}. Just a few details left.</p>
                  </div>
                )}
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Step 3 of 3</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3 md:mb-4">Your Details</h2>
                <p className="text-gray-600 text-base sm:text-lg">Tell us who you are and more about your project.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-8 md:mb-10">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3.5 text-gray-400" size={14} />
                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="John" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" size={14} />
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="john@company.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <PhoneInput
                    value={formData.phoneNumber}
                    dialCode={formData.phoneDialCode}
                    countryCode={formData.phoneCountryCode}
                    onNumberChange={val => setFormData(p => ({ ...p, phoneNumber: val }))}
                    onDialChange={(dial, code) => setFormData(p => ({ ...p, phoneDialCode: dial, phoneCountryCode: code }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-3.5 text-gray-400" size={14} />
                    <input type="text" name="company" required value={formData.company} onChange={handleInputChange} className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="Acme Inc." />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Website (Optional)</label>
                  <div className="relative">
                    <FaGlobeAmericas className="absolute left-3 top-3.5 text-gray-400" size={14} />
                    <input type="text" name="clientWebsite" value={formData.clientWebsite} onChange={handleInputChange} className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g. www.example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Business Location (Optional)</label>
                  <div className="relative">
                    <FaRegBuilding className="absolute left-3 top-3.5 text-gray-400" size={14} />
                    <input type="text" name="clientLocation" value={formData.clientLocation} onChange={handleInputChange} className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g. Chicago, IL" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Industry / Business Type (Optional)</label>
                  <div className="relative">
                    <FaBriefcase className="absolute left-3 top-3.5 text-gray-400" size={14} />
                    <input type="text" name="clientIndustry" value={formData.clientIndustry} onChange={handleInputChange} className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g. E-Commerce, SaaS, Retail" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Project Description *</label>
                  <textarea name="projectDescription" required rows={4} maxLength={1000} value={formData.projectDescription} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Describe your project, goals, and any specific requirements..." />
                  <div className="flex flex-wrap justify-between items-center mt-1 gap-1">
                    <span className="text-[10px] sm:text-xs text-gray-400">Please provide a clear description of your requirements.</span>
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium">{(formData.projectDescription || '').length}/1000 characters</span>
                  </div>
                </div>

                {renderDynamicServiceQuestions()}

                {/* ─── AI-SPECIFIC QUESTIONS ─── */}
                {selectedServices['AI Automation'] === 'custom' && (
                  <>
                    <div className="border-t border-gray-200 pt-4 sm:pt-6 mt-4 sm:mt-6">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <FaRobot className="text-purple-600 shrink-0" />
                        AI Project Details
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 sm:mb-4">Help us understand your AI needs better.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">What AI Features Are You Interested In?</label>
                      <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 mt-1">
                        {[
                          { id: 'ai_chat', label: 'AI Chat' },
                          { id: 'ai_voice', label: 'AI Voice' },
                          { id: 'ai_email', label: 'AI Email' },
                          { id: 'ai_reporting', label: 'AI Reporting' },
                          { id: 'workflow_automation', label: 'Workflow Automation' },
                          { id: 'other', label: 'Others: Specify' }
                        ].map(item => {
                          const checked = customQuoteAnswers.aiFeatures.includes(item.id);
                          if (item.id === 'other') {
                            return (
                              <div key={item.id} className="flex flex-col gap-2 p-2 sm:p-3 border border-slate-200 rounded-xl bg-white transition-all sm:col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                      const nextFeatures = checked
                                        ? customQuoteAnswers.aiFeatures.filter(f => f !== item.id)
                                        : [...customQuoteAnswers.aiFeatures, item.id];
                                      setCustomQuoteAnswers(p => ({
                                        ...p,
                                        aiFeatures: nextFeatures,
                                        aiFeaturesOther: checked ? '' : p.aiFeaturesOther
                                      }));
                                    }}
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 rounded shrink-0"
                                  />
                                  <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                                </label>
                                {checked && (
                                  <input
                                    type="text"
                                    placeholder="Specify other AI features..."
                                    value={customQuoteAnswers.aiFeaturesOther || ''}
                                    onChange={e => setCustomQuoteAnswers(p => ({ ...p, aiFeaturesOther: e.target.value }))}
                                    className="w-full mt-1 px-3 py-1.5 sm:py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                                )}
                              </div>
                            );
                          }
                          return (
                            <label key={item.id} className="flex items-center gap-2 p-2 sm:p-3 border border-slate-200 hover:border-slate-300 rounded-xl bg-white cursor-pointer transition-all">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  const nextFeatures = checked
                                    ? customQuoteAnswers.aiFeatures.filter(f => f !== item.id)
                                    : [...customQuoteAnswers.aiFeatures, item.id];
                                  setCustomQuoteAnswers(p => ({ ...p, aiFeatures: nextFeatures }));
                                }}
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 rounded shrink-0"
                              />
                              <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">What Tools Does Your Business Currently Use?</label>
                      <input
                        type="text"
                        placeholder="e.g. HubSpot, Zapier, Google Sheets, None"
                        value={customQuoteAnswers.aiCurrentTools}
                        onChange={e => setCustomQuoteAnswers(p => ({ ...p, aiCurrentTools: e.target.value }))}
                        className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">How Much Time Does Your Team Currently Spend on These Tasks?</label>
                      <input
                        type="text"
                        placeholder="e.g. 10 hours/week, 5 hours/day, Not sure"
                        value={customQuoteAnswers.aiTimeSpent}
                        onChange={e => setCustomQuoteAnswers(p => ({ ...p, aiTimeSpent: e.target.value }))}
                        className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">What Does AI-Powered Success Look Like for Your Business?</label>
                      <textarea
                        rows={3}
                        placeholder="Describe how you envision AI improving your business operations..."
                        value={customQuoteAnswers.aiSuccessLooksLike}
                        onChange={e => setCustomQuoteAnswers(p => ({ ...p, aiSuccessLooksLike: e.target.value }))}
                        className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      />
                    </div>
                  </>
                )}

                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 flex items-center gap-2"><FaUpload className="text-blue-600 shrink-0" />Project Files</h3>
                  <p className="text-gray-600 text-sm mb-3 sm:mb-4">Upload any relevant files (designs, documents, briefs, etc.)</p>
                  <FileUpload
                    files={uploadedFiles.map(f => ({ ...f.file, name: f.name, size: f.size, type: f.type }))}
                    onFilesAdded={files => setUploadedFiles(prev => [...prev, ...files.map(file => ({ file, id: Math.random().toString(36).substr(2, 9), name: file.name, size: file.size, type: file.type, preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null }))])}
                    onFileRemove={id => setUploadedFiles(prev => { const f = prev.find(x => x.id === id); if (f?.preview) URL.revokeObjectURL(f.preview); return prev.filter(x => x.id !== id); })}
                    maxFiles={MAX_FILES}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2"><FaCalendar className="inline mr-2" />Desired Timeline</label>
                    <select name="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                      <option value="">Select Timeline</option>
                      <option value="ASAP">As soon as possible</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="2-3 months">2-3 months</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2"><FaDollarSign className="inline mr-2" />Budget Range</label>
                    <select name="budget" value={formData.budget} onChange={handleInputChange} className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                      <option value="">Select Budget Range</option>
                      {BUDGET_RANGES.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {paymentError && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm break-words">{paymentError}</div>
              )}

              <div className="flex justify-end mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={!isStep3Complete || isSubmitting}
                  className={`px-4 sm:px-8 py-3 sm:py-4 font-semibold rounded-lg transition-all flex items-center gap-2 text-sm sm:text-base ${!isStep3Complete || isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}
                >
                  {isSubmitting ? <><FaSpinner className="animate-spin" />{uploadedFiles.length > 0 ? 'Uploading Files...' : 'Submitting...'}</> : <><FaPaperPlane />Submit Request</>}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add animation styles and responsive helper */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        /* Extra small breakpoint helper */
        @media (min-width: 480px) {
          .xs\\:block {
            display: block !important;
          }
        }
        @media (max-width: 479px) {
          .xs\\:block {
            display: none !important;
          }
        }
        /* Fix for progress bar on very small screens */
        @media (max-width: 400px) {
          .container.px-4 {
            padding-left: 8px;
            padding-right: 8px;
          }
          .bg-white.rounded-2xl {
            border-radius: 12px;
          }
          .p-4 {
            padding: 12px;
          }
        }
        /* Ensure proper touch targets on mobile */
        @media (max-width: 640px) {
          button, 
          label,
          input[type="checkbox"],
          input[type="radio"] {
            touch-action: manipulation;
          }
          button {
            min-height: 44px;
          }
          input, select, textarea {
            font-size: 16px !important; /* Prevents iOS zoom */
          }
        }
      `}</style>
    </div>
  );
};

export default RequestServicePage;
