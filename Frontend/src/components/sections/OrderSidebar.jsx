// src/components/sections/OrderSidebar.jsx
// Sits alongside PackageComparison on ServiceDetailPage.
// Shows selected package, specific add-ons per service (from amendment doc),
// live total, and Stripe Checkout button.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaShieldAlt, FaLock, FaCheckCircle, FaTimes,
  FaSpinner, FaTag, FaInfoCircle
} from 'react-icons/fa';

const PLATFORM_FEE_PERCENT = 0.05;
const API_BASE = import.meta.env.VITE_API_URL || '';

// ── Service starting prices ───────────────────────────────────────────────────
const SERVICE_STARTING_PRICES = {
  'graphic-design': 49,
  'video-editing': 99,
  'copywriting': 99,
  'brand-identity': 249,
  'photography': 249,
  'website-development': 799,
  'landing-pages': 399,
  'ecommerce-development': 1199,
  'web-applications': 4999,
  'api-integration': 499,
  'website-maintenance': 149,
  'social-media-management': 349,
  'seo-marketing': 499,
  'paid-advertising': 399,
  'email-marketing': 249,
  'lead-generation': 299,
  'crm-automation': 499,
  'virtual-assistant': 199,
  'data-analytics': 249,
  'process-documentation': 399,
  'project-management': 499,
  'data-entry': 99,
  'ai-automation': 0,
};

// ── COMPLETE add-ons per service from documentation (NO PRICES) ─────────────
const FULL_SERVICE_ADDONS = {
  // Website Development - 10 add-ons
  'website-development': [
    { slug: 'seo-marketing',           name: 'SEO Setup' },
    { slug: 'copywriting',             name: 'Copywriting' },
    { slug: 'brand-identity',          name: 'Logo Design' },
    { slug: 'crm-automation',          name: 'CRM Setup' },
    { slug: 'email-marketing',         name: 'Email Automation' },
    { slug: 'api-integration',         name: 'API Integration' },
    { slug: 'data-analytics',          name: 'Analytics Dashboard' },
    { slug: 'website-maintenance',     name: 'Website Maintenance' },
    { slug: 'lead-generation',         name: 'Lead Generation' },
    { slug: 'graphic-design',          name: 'Social Media Graphics' },
  ],

  // Landing Pages - 6 add-ons
  'landing-pages': [
    { slug: 'copywriting',             name: 'Copywriting' },
    { slug: 'graphic-design',          name: 'Graphic Design' },
    { slug: 'paid-advertising',        name: 'Paid Advertising' },
    { slug: 'email-marketing',         name: 'Email Marketing' },
    { slug: 'crm-automation',          name: 'CRM Integration' },
    { slug: 'seo-marketing',           name: 'SEO Setup' },
  ],

  // E-Commerce Development - 8 add-ons
  'ecommerce-development': [
    { slug: 'data-entry',              name: 'Product Upload' },
    { slug: 'email-marketing',         name: 'Email Campaigns' },
    { slug: 'crm-automation',          name: 'Abandoned Cart Automation' },
    { slug: 'api-integration',         name: 'Inventory Sync' },
    { slug: 'photography',             name: 'Product Photography' },
    { slug: 'paid-advertising',        name: 'Paid Ads' },
    { slug: 'seo-marketing',           name: 'SEO Setup' },
    { slug: 'data-analytics',          name: 'Analytics Reports' },
  ],

  // SEO Marketing - 6 add-ons
  'seo-marketing': [
    { slug: 'website-development',     name: 'Website Development' },
    { slug: 'copywriting',             name: 'Copywriting' },
    { slug: 'landing-pages',           name: 'Landing Pages' },
    { slug: 'paid-advertising',        name: 'Paid Advertising' },
    { slug: 'lead-generation',         name: 'Lead Generation' },
    { slug: 'graphic-design',          name: 'Blog Graphics' },
  ],

  // Paid Advertising - 5 add-ons
  'paid-advertising': [
    { slug: 'landing-pages',           name: 'Landing Pages' },
    { slug: 'copywriting',             name: 'Ad Copywriting' },
    { slug: 'social-media-management', name: 'Social Media Management' },
    { slug: 'lead-generation',         name: 'Lead Generation' },
    { slug: 'data-analytics',          name: 'Performance Analytics' },
  ],

  // Lead Generation - 7 add-ons
  'lead-generation': [
    { slug: 'landing-pages',           name: 'Landing Page' },
    { slug: 'crm-automation',          name: 'CRM Pipeline' },
    { slug: 'email-marketing',         name: 'Email Follow-Up' },
    { slug: 'paid-advertising',        name: 'Paid Ads' },
    { slug: 'seo-marketing',           name: 'SEO Content' },
    { slug: 'data-analytics',          name: 'Data Reports' },
    { slug: 'virtual-assistant',       name: 'VA Follow-Up' },
  ],

  // CRM & Marketing Automation - 5 add-ons
  'crm-automation': [
    { slug: 'lead-generation',         name: 'Lead Generation' },
    { slug: 'email-marketing',         name: 'Email Marketing' },
    { slug: 'website-development',     name: 'Website Development' },
    { slug: 'api-integration',         name: 'API Integration' },
    { slug: 'data-analytics',          name: 'Analytics Dashboard' },
  ],

  // Email Marketing - 5 add-ons
  'email-marketing': [
    { slug: 'lead-generation',         name: 'Lead Generation' },
    { slug: 'copywriting',             name: 'Copywriting' },
    { slug: 'graphic-design',          name: 'Email Graphics' },
    { slug: 'crm-automation',          name: 'CRM Automation' },
    { slug: 'landing-pages',           name: 'Landing Pages' },
  ],

  // Social Media Management - 5 add-ons
  'social-media-management': [
    { slug: 'graphic-design',          name: 'Graphic Design' },
    { slug: 'video-editing',           name: 'Video Editing' },
    { slug: 'copywriting',             name: 'Copywriting' },
    { slug: 'paid-advertising',        name: 'Social Media Ads' },
    { slug: 'photography',             name: 'Photography' },
  ],

  // Graphic Design - 5 add-ons
  'graphic-design': [
    { slug: 'brand-identity',          name: 'Brand Identity' },
    { slug: 'copywriting',             name: 'Copywriting' },
    { slug: 'social-media-management', name: 'Social Media Management' },
    { slug: 'website-development',     name: 'Website Development' },
    { slug: 'video-editing',           name: 'Video Editing' },
  ],

  // Brand Identity - 5 add-ons
  'brand-identity': [
    { slug: 'graphic-design',          name: 'Graphic Design' },
    { slug: 'website-development',     name: 'Website Development' },
    { slug: 'copywriting',             name: 'Brand Copywriting' },
    { slug: 'social-media-management', name: 'Social Media Management' },
    { slug: 'photography',             name: 'Brand Photography' },
  ],

  // Photography - 5 add-ons
  'photography': [
    { slug: 'graphic-design',          name: 'Graphic Design' },
    { slug: 'website-development',     name: 'Website Development' },
    { slug: 'social-media-management', name: 'Social Media Management' },
    { slug: 'video-editing',           name: 'Video Editing' },
    { slug: 'brand-identity',          name: 'Brand Identity' },
  ],

  // Video Editing - 5 add-ons
  'video-editing': [
    { slug: 'graphic-design',          name: 'Thumbnail Design' },
    { slug: 'copywriting',             name: 'Video Script' },
    { slug: 'social-media-management', name: 'Social Media Management' },
    { slug: 'paid-advertising',        name: 'Video Ads' },
    { slug: 'landing-pages',           name: 'Landing Page' },
  ],

  // Copywriting - 5 add-ons
  'copywriting': [
    { slug: 'graphic-design',          name: 'Graphic Design' },
    { slug: 'website-development',     name: 'Website Development' },
    { slug: 'seo-marketing',           name: 'SEO Optimization' },
    { slug: 'email-marketing',         name: 'Email Marketing' },
    { slug: 'social-media-management', name: 'Social Media Management' },
  ],

  // API Integration - 5 add-ons
  'api-integration': [
    { slug: 'crm-automation',          name: 'CRM Automation' },
    { slug: 'web-applications',        name: 'Web Application' },
    { slug: 'data-analytics',          name: 'Analytics Dashboard' },
    { slug: 'website-development',     name: 'Website Development' },
    { slug: 'process-documentation',   name: 'Process Documentation' },
  ],

  // Web Applications - 6 add-ons
  'web-applications': [
    { slug: 'api-integration',         name: 'API Integration' },
    { slug: 'crm-automation',          name: 'CRM Setup' },
    { slug: 'data-analytics',          name: 'Analytics Dashboard' },
    { slug: 'website-maintenance',     name: 'Website Maintenance' },
    { slug: 'seo-marketing',           name: 'SEO Setup' },
    { slug: 'copywriting',             name: 'Copywriting' },
  ],

  // Website Maintenance - 5 add-ons
  'website-maintenance': [
    { slug: 'website-development',     name: 'Website Development' },
    { slug: 'seo-marketing',           name: 'SEO Optimization' },
    { slug: 'graphic-design',          name: 'Visual Updates' },
    { slug: 'copywriting',             name: 'Content Updates' },
    { slug: 'data-analytics',          name: 'Performance Reports' },
  ],

  // Virtual Assistant - 4 add-ons
  'virtual-assistant': [
    { slug: 'data-entry',              name: 'Data Entry' },
    { slug: 'project-management',      name: 'Project Management' },
    { slug: 'process-documentation',   name: 'Process Documentation' },
    { slug: 'lead-generation',         name: 'Lead Generation' },
  ],

  // Data Analytics - 5 add-ons
  'data-analytics': [
    { slug: 'crm-automation',          name: 'CRM Automation' },
    { slug: 'lead-generation',         name: 'Lead Generation' },
    { slug: 'seo-marketing',           name: 'SEO Reports' },
    { slug: 'paid-advertising',        name: 'Ad Performance Tracking' },
    { slug: 'website-development',     name: 'Analytics Integration' },
  ],

  // Process Documentation - 5 add-ons
  'process-documentation': [
    { slug: 'project-management',      name: 'Project Management' },
    { slug: 'virtual-assistant',       name: 'Virtual Assistant' },
    { slug: 'crm-automation',          name: 'CRM Automation' },
    { slug: 'data-analytics',          name: 'Performance Reporting' },
    { slug: 'data-entry',              name: 'Data Entry' },
  ],

  // Project Management - 4 add-ons
  'project-management': [
    { slug: 'process-documentation',   name: 'Process Documentation' },
    { slug: 'virtual-assistant',       name: 'Virtual Assistant' },
    { slug: 'data-analytics',          name: 'Performance Tracking' },
    { slug: 'crm-automation',          name: 'CRM Automation' },
  ],

  // Data Entry - 5 add-ons
  'data-entry': [
    { slug: 'crm-automation',          name: 'CRM Automation' },
    { slug: 'data-analytics',          name: 'Data Analytics' },
    { slug: 'virtual-assistant',       name: 'Virtual Assistant' },
    { slug: 'process-documentation',   name: 'Process Documentation' },
    { slug: 'lead-generation',         name: 'Lead Database' },
  ],

  // AI Automation - 5 add-ons
  'ai-automation': [
    { slug: 'crm-automation',          name: 'CRM Setup' },
    { slug: 'api-integration',         name: 'API Integration' },
    { slug: 'data-analytics',          name: 'Reporting Dashboard' },
    { slug: 'website-development',     name: 'Website Integration' },
    { slug: 'virtual-assistant',       name: 'Virtual Assistant Backup' },
  ],
};

// Fallback add-ons for any service not explicitly listed
const DEFAULT_ADDONS = [
  { slug: 'graphic-design',          name: 'Graphic Design' },
  { slug: 'copywriting',             name: 'Copywriting' },
  { slug: 'seo-marketing',           name: 'SEO Setup' },
  { slug: 'email-marketing',         name: 'Email Marketing' },
  { slug: 'data-analytics',          name: 'Analytics Dashboard' },
  { slug: 'website-development',     name: 'Website Development' },
  { slug: 'paid-advertising',        name: 'Paid Advertising' },
  { slug: 'lead-generation',         name: 'Lead Generation' },
  { slug: 'crm-automation',          name: 'CRM Automation' },
  { slug: 'social-media-management', name: 'Social Media Management' },
  { slug: 'brand-identity',          name: 'Brand Identity' },
  { slug: 'photography',             name: 'Photography' },
  { slug: 'video-editing',           name: 'Video Editing' },
  { slug: 'api-integration',         name: 'API Integration' },
  { slug: 'website-maintenance',     name: 'Website Maintenance' },
  { slug: 'virtual-assistant',       name: 'Virtual Assistant' },
  { slug: 'process-documentation',   name: 'Process Documentation' },
  { slug: 'project-management',      name: 'Project Management' },
  { slug: 'data-entry',              name: 'Data Entry' },
  { slug: 'ai-automation',           name: 'AI Automation' },
];

const parsePrice = (priceStr) => {
  if (!priceStr || priceStr === 'Custom Quote') return 0;
  const match = priceStr.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

// Map add-on slug to its actual price for calculation (HIDDEN FROM USERS)
const ADDON_PRICES = {
  'graphic-design': 49,
  'video-editing': 99,
  'copywriting': 99,
  'brand-identity': 249,
  'photography': 249,
  'website-development': 799,
  'landing-pages': 399,
  'ecommerce-development': 1199,
  'web-applications': 4999,
  'api-integration': 499,
  'website-maintenance': 149,
  'social-media-management': 349,
  'seo-marketing': 499,
  'paid-advertising': 399,
  'email-marketing': 249,
  'lead-generation': 299,
  'crm-automation': 499,
  'virtual-assistant': 199,
  'data-analytics': 249,
  'process-documentation': 399,
  'project-management': 499,
  'data-entry': 99,
  'ai-automation': 0,
};

const SERVICE_FEATURES = {
  'website-development': {
    basic: [
      'Up to 5 core website pages',
      'Custom homepage design',
      'Mobile and tablet responsive design',
      'Contact form',
      'Click-to-call and email functionality',
      'Social media links',
      'Basic on-page SEO setup',
      'Page titles and meta descriptions',
      'Basic image optimization',
      'Google Analytics setup',
      'Google Search Console setup',
      'SSL configuration assistance',
      'Basic speed optimization',
      'One primary conversion CTA',
      'Two revision rounds',
      'Basic launch support'
    ],
    standard: [
      'Everything in Starter',
      'Up to 10 pages',
      'More customized page layouts',
      'Blog or resource section',
      'Up to 2 lead-generation forms',
      'Thank-you page',
      'CRM or email platform connection',
      'Basic conversion tracking',
      'Enhanced on-page SEO',
      'Internal linking setup',
      'XML sitemap configuration',
      'Robots.txt configuration',
      'Basic schema implementation where appropriate',
      'Website analytics configuration',
      'Basic lead funnel structure',
      'Three revision rounds',
      'CMS training session'
    ],
    premium: [
      'Everything in Growth',
      'Up to 20 pages',
      'Custom UX/UI direction',
      'Advanced page layouts',
      'Conversion-focused page architecture',
      'Multiple service or location pages',
      'Up to 5 lead-generation forms',
      'Advanced CRM/form integrations',
      'Marketing automation connection',
      'Advanced analytics and conversion tracking',
      'Enhanced technical SEO setup',
      'Custom website components',
      'Resource/download functionality',
      'Basic booking or scheduling integration',
      'Advanced site navigation',
      'Staging environment',
      'Three revision rounds per major design phase',
      'Team training',
      'Post-launch review'
    ]
  },
  'landing-pages': {
    basic: [
      '1 custom landing page',
      'Mobile responsive design',
      'Lead capture form',
      'Thank-you page',
      'One primary CTA',
      'Basic conversion tracking',
      'Email/CRM form connection',
      'Basic copy formatting',
      'Two revision rounds'
    ],
    standard: [
      'Up to 3 funnel pages',
      'Landing page',
      'Thank-you/confirmation page',
      'Secondary conversion page',
      'Lead form integration',
      'CRM/email integration',
      'Conversion tracking',
      'Basic automation setup',
      'Mobile optimization',
      'A/B testing-ready structure',
      'Up to 2 audience paths',
      'Three revision rounds'
    ],
    premium: [
      'Up to 6 funnel pages',
      'Custom conversion-focused design',
      'Lead capture system',
      'Booking or checkout integration',
      'CRM integration',
      'Up to 5 automated follow-up emails',
      'Conversion tracking',
      'Analytics setup',
      'Basic funnel automation',
      'Lead tagging/segmentation',
      'Thank-you and next-step flows',
      'A/B test configuration for one key page',
      'Three revision rounds',
      'Funnel walkthrough'
    ]
  },
  'ecommerce-development': {
    basic: [
      'Store setup',
      'Up to 10 products',
      'Up to 5 informational pages',
      'Mobile responsive design',
      'Product category setup',
      'Shopping cart',
      'Checkout configuration',
      'One payment gateway',
      'Basic shipping configuration',
      'Basic tax settings',
      'Order notification setup',
      'Google Analytics',
      'Basic SEO setup',
      'Two revision rounds',
      'Store management training'
    ],
    standard: [
      'Everything in Starter',
      'Up to 50 products',
      'Advanced product variations',
      'Coupon/discount functionality',
      'Abandoned-cart setup where supported',
      'Email marketing integration',
      'Enhanced analytics',
      'Enhanced product SEO',
      'Customer account functionality',
      'Review functionality',
      'Up to 2 payment gateways',
      'Advanced shipping rules',
      'Basic product-data import',
      'Three revision rounds'
    ],
    premium: [
      'Everything in Growth',
      'Up to 150 initial products',
      'Advanced product/category structure',
      'Custom storefront components',
      'Enhanced checkout configuration',
      'Advanced conversion tracking',
      'CRM integration',
      'Advanced email automation',
      'Subscription functionality where platform-supported',
      'Multi-location or advanced inventory configuration where supported',
      'Advanced shipping logic',
      'Data migration assistance',
      'Custom reporting configuration',
      'Team training'
    ]
  },
  'seo-marketing': {
    basic: [
      'Initial SEO audit',
      'Keyword research for up to 10 target keywords',
      'Optimization of up to 5 priority pages',
      'Page title optimization',
      'Meta description optimization',
      'Heading structure review',
      'Internal-link improvements',
      'Google Search Console review',
      'Google Analytics review',
      'XML sitemap review',
      'Basic technical SEO checks',
      'One existing page/content optimization per month',
      'Monthly ranking review',
      'Monthly performance report',
      'Monthly recommendations'
    ],
    standard: [
      'Everything in Starter',
      'Up to 20 tracked target keywords',
      'Optimization across up to 15 priority pages',
      'Competitor SEO review',
      'Two SEO-focused content pieces or substantial content optimizations per month',
      'Enhanced internal-link strategy',
      'Technical issue monitoring',
      'Search intent analysis',
      'Content-gap analysis',
      'Local SEO optimization when applicable',
      'Google Business Profile recommendations when applicable',
      'Basic structured-data recommendations',
      'Conversion-page SEO review',
      'Monthly strategy review'
    ],
    premium: [
      'Everything in Growth',
      'Up to 40 tracked keywords',
      'Up to 30 priority pages',
      'Up to 4 SEO content pieces or major optimizations per month',
      'Advanced competitor research',
      'Advanced content-gap analysis',
      'Technical SEO monitoring',
      'Schema strategy',
      'Multi-service or multi-location SEO strategy',
      'Content-cluster planning',
      'Link opportunity research and outreach strategy',
      'Conversion optimization recommendations',
      'Priority implementation support',
      'Monthly strategy call',
      'Detailed executive reporting'
    ]
  },
  'paid-advertising': {
    basic: [
      '1 advertising platform',
      'Up to 1 active campaign',
      'Up to 3 ad groups/ad sets',
      'Initial campaign setup',
      'Basic keyword or audience research',
      'Up to 6 ad variations',
      'Conversion tracking setup',
      'Budget monitoring',
      'Basic optimization',
      'Negative keyword management where applicable',
      'Monthly report',
      'One monthly campaign review'
    ],
    standard: [
      'Everything in Starter',
      'Up to 2 active campaigns',
      'Up to 8 ad groups/ad sets',
      'Up to 12 active ad variations',
      'Enhanced audience/keyword research',
      'Retargeting campaign setup',
      'Landing-page recommendations',
      'Weekly optimization',
      'Search-term analysis',
      'Bid/budget adjustments',
      'Basic creative testing',
      'Conversion-performance analysis',
      'Monthly strategy call'
    ],
    premium: [
      'Multi-campaign management',
      'Up to 2 advertising platforms',
      'Advanced audience segmentation',
      'Advanced retargeting',
      'Creative testing',
      'Conversion tracking',
      'Funnel performance analysis',
      'Weekly performance monitoring',
      'Budget allocation recommendations',
      'Advanced keyword/search-term management',
      'Landing-page recommendations',
      'Monthly strategy call',
      'Executive reporting'
    ]
  },
  'lead-generation': {
    basic: [
      'Ideal customer profile definition',
      'Basic target-market research',
      'Prospecting criteria',
      'Up to 150 prospect records per month',
      'Basic lead-list organization',
      'Contact-data cleanup',
      'One outreach sequence framework',
      'Lead tracking sheet or basic CRM structure',
      'Monthly results summary'
    ],
    standard: [
      'Everything in Starter',
      'Up to 500 prospect records per month',
      'Multiple target segments',
      'Enhanced prospect research',
      'Up to 2 outreach sequences',
      'Basic personalization framework',
      'CRM import assistance',
      'Lead tagging',
      'Follow-up workflow',
      'Monthly performance analysis',
      'Strategy adjustments'
    ],
    premium: [
      'Up to 1,000 prospect records per month',
      'Multiple customer profiles',
      'Advanced account research',
      'Multi-step outreach strategy',
      'CRM pipeline setup',
      'Lead qualification framework',
      'Follow-up automation',
      'Reporting dashboard',
      'Ongoing campaign refinement',
      'Monthly strategy session'
    ]
  },
  'crm-automation': {
    basic: [
      '1 CRM pipeline',
      'Basic CRM configuration',
      'Up to 2 forms',
      'Up to 3 automated workflows',
      'Contact tagging',
      'Basic lead notifications',
      '1 third-party integration',
      'Testing',
      'Basic documentation',
      'One training session'
    ],
    standard: [
      'Up to 2 CRM pipelines',
      'Up to 5 automated workflows',
      'Up to 3 integrations',
      'Lead routing',
      'Email follow-up automation',
      'Task automation',
      'Contact segmentation',
      'Pipeline stages',
      'Basic dashboard',
      'Testing and QA',
      'Documentation',
      'Team training'
    ],
    premium: [
      'Up to 4 pipelines',
      'Up to 12 automated workflows',
      'Up to 6 integrations',
      'Advanced lead routing',
      'Multi-step customer journeys',
      'Sales automation',
      'Marketing automation',
      'Customer tagging/scoring rules',
      'Reporting dashboard',
      'Advanced workflow testing',
      'Documentation',
      'Up to 2 hours of team training',
      'Post-launch optimization review'
    ]
  },
  'email-marketing': {
    basic: [
      '1 email campaign',
      'Email layout/design',
      'Basic copy editing',
      'CTA setup',
      'Basic segmentation',
      'Links and tracking',
      'Test send',
      'Mobile review',
      'One revision round',
      'Campaign performance summary'
    ],
    standard: [
      'Up to 4 emails',
      'Campaign strategy',
      'Email layout/design',
      'Subject-line development',
      'Basic copywriting',
      'Audience segmentation',
      'CTA strategy',
      'UTM/tracking setup',
      'Scheduling',
      'Basic automation',
      'Performance report',
      'Two revision rounds'
    ],
    premium: [
      'Up to 8 emails',
      'Full campaign strategy',
      'Copywriting',
      'Design/layout',
      'Segmentation strategy',
      'Automated email flow',
      'Lead tagging',
      'Basic A/B testing',
      'Conversion tracking',
      'Performance analysis',
      'Optimization recommendations',
      'Two revision rounds'
    ]
  },
  'social-media-management': {
    basic: [
      '1 social platform',
      'Up to 8 feed posts per month',
      'Caption writing',
      'Basic graphic creation',
      'Hashtag/topic research where relevant',
      'Content scheduling',
      'Monthly content calendar',
      'Basic monthly report',
      'One revision round on the monthly content batch'
    ],
    standard: [
      'Up to 2 platforms',
      'Up to 16 feed posts per month',
      'Up to 4 short-form videos/reels using provided or existing footage',
      'Caption writing',
      'Graphic design',
      'Monthly content calendar',
      'Scheduling',
      'Basic community-response support',
      'Monthly analytics',
      'Monthly strategy review'
    ],
    premium: [
      'Up to 3 platforms',
      'Up to 24 feed posts per month',
      'Up to 8 short-form videos',
      'Content calendar',
      'Graphic design',
      'Caption/copy development',
      'Scheduling',
      'Basic weekday community management',
      'Social listening',
      'Monthly campaign planning',
      'Performance reporting',
      'Monthly strategy call',
      'Ongoing optimization'
    ]
  },
  'graphic-design': {
    basic: [
      '1 marketing asset',
      '1 finished size/format',
      'Basic custom design',
      'Client-provided brand assets',
      '1 revision round',
      'Final web-ready file'
    ],
    standard: [
      'Up to 5 coordinated assets',
      'Consistent visual direction',
      'Up to 2 sizes per core design where required',
      'Basic image sourcing',
      '2 revision rounds',
      'Web-ready final files'
    ],
    premium: [
      'Up to 12 coordinated marketing assets',
      'Creative direction',
      'Brand-consistent design system',
      'Multiple campaign formats',
      'Up to 3 revision rounds',
      'Organized final files',
      'Print-ready files when required'
    ]
  },
  'brand-identity': {
    basic: [
      'Brand discovery questionnaire',
      '2 initial logo concepts',
      '2 revision rounds',
      'Primary logo',
      'Basic color palette',
      'Basic typography recommendations',
      'PNG, JPG and transparent logo files'
    ],
    standard: [
      'Brand discovery',
      '3 initial logo concepts',
      'Primary logo',
      'Secondary logo variation',
      'Icon/mark',
      'Color palette',
      'Typography system',
      'Social profile assets',
      'Basic brand guidelines',
      '3 revision rounds',
      'Organized final files'
    ],
    premium: [
      'Brand strategy session',
      'Competitive visual review',
      '3 refined creative directions',
      'Primary and secondary logos',
      'Brand mark',
      'Color system',
      'Typography system',
      'Brand imagery direction',
      'Social assets',
      'Basic business-card/letterhead templates',
      'Comprehensive brand guideline document',
      'Up to 3 revision rounds',
      'Complete final-file package'
    ]
  },
  'photography': {
    basic: [
      'Up to 1 hour on location',
      'Up to 10 edited final photographs',
      'Basic color correction',
      'Web-resolution files',
      'One local location'
    ],
    standard: [
      'Up to 2.5 hours',
      'Up to 30 edited photographs',
      'Product/team/location combinations',
      'Enhanced retouching',
      'Web and high-resolution files',
      'Basic shot planning'
    ],
    premium: [
      'Up to half-day shoot',
      'Up to 60 edited photographs',
      'Pre-shoot planning',
      'Multiple setups',
      'Advanced retouching',
      'Web and high-resolution files',
      'Organized image library'
    ]
  },
  'video-editing': {
    basic: [
      '1 video up to 60 seconds',
      'Basic cuts',
      'Basic transitions',
      'Text/captions',
      'Basic audio balancing',
      'Client-provided footage',
      '1 aspect ratio',
      '1 revision round',
      'Final exported video'
    ],
    standard: [
      '1 video up to 5 minutes',
      'Professional editing',
      'B-roll placement',
      'Titles/text graphics',
      'Basic motion graphics',
      'Audio cleanup',
      'Color correction',
      'Captions',
      'Up to 2 aspect ratios',
      '2 revision rounds'
    ],
    premium: [
      '1 long-form video up to 12 minutes OR Up to 5 short-form videos from supplied footage',
      'Advanced editing',
      'Motion graphics',
      'B-roll',
      'Audio enhancement',
      'Color correction',
      'Captions',
      'Branded graphics',
      'Multiple export formats',
      'Up to 3 revision rounds'
    ]
  },
  'copywriting': {
    basic: [
      'Blog/article up to 800 words OR Short sales page OR Email copy package OR Small website-page rewrite',
      'Topic research',
      'Brand-tone alignment',
      'Basic SEO considerations where applicable',
      '1 revision round'
    ],
    standard: [
      'Up to 2,500 total words',
      'Up to 3 content pieces/pages',
      'Keyword consideration',
      'CTA development',
      'Headline development',
      'Basic competitor/content review',
      '2 revision rounds'
    ],
    premium: [
      'Up to 6,000 total words',
      'Up to 6 pages/content pieces',
      'Content strategy',
      'SEO-oriented structure where applicable',
      'Conversion-focused CTA development',
      'Brand voice consistency',
      'Content formatting recommendations',
      'Up to 3 revision rounds'
    ]
  },
  'api-integration': {
    basic: [
      '1 straightforward system integration',
      'Up to 2 API endpoints/actions',
      'Authentication configuration',
      'Basic data mapping',
      'Testing',
      'Basic error handling',
      'Documentation'
    ],
    standard: [
      'Integration of up to 2 systems',
      'Up to 6 endpoints/actions',
      'Advanced data mapping',
      'Workflow logic',
      'Error logging',
      'Testing environment',
      'Documentation',
      'Deployment assistance'
    ],
    premium: [
      'Up to 3 interconnected systems',
      'Up to 15 endpoints/actions',
      'Complex workflow logic',
      'Data transformations',
      'Authentication/security configuration',
      'Error handling and logging',
      'Testing',
      'Deployment support',
      'Technical documentation',
      'Post-launch review'
    ]
  },
  'web-applications': {
    basic: [
      'Requirements workshop',
      'Basic product architecture',
      'User authentication',
      '1 primary user role',
      'Up to 5 core application screens',
      'Database setup',
      'Basic admin functionality',
      '1 third-party integration',
      'Responsive interface',
      'Testing',
      'Deployment assistance',
      'Basic technical documentation'
    ],
    standard: [
      'Product planning',
      'Up to 15 core screens',
      'Up to 2 user roles',
      'Advanced database structure',
      'Admin dashboard',
      'Up to 3 integrations',
      'Notification functionality',
      'User-account management',
      'Responsive application',
      'QA testing',
      'Deployment',
      'Documentation',
      'Team handoff'
    ],
    premium: [
      'Complex product architecture',
      'Multiple user roles',
      'Subscription/billing systems',
      'Custom dashboards',
      'Advanced database architecture',
      'API integrations',
      'Automated workflows',
      'Role-based permissions',
      'Reporting',
      'Notifications',
      'Staging/production environments',
      'Advanced QA',
      'Deployment',
      'Technical documentation',
      'Post-launch support'
    ]
  },
  'website-maintenance': {
    basic: [
      'Up to 2 hours of website work per month',
      'Core/plugin updates where applicable',
      'Basic backup monitoring',
      'Basic uptime checks',
      'Minor content edits',
      'Basic technical health review',
      'Monthly maintenance summary'
    ],
    standard: [
      'Up to 5 support hours per month',
      'Updates',
      'Backup monitoring',
      'Uptime monitoring',
      'Content changes',
      'Minor design adjustments',
      'Basic speed review',
      'Form/function testing',
      'Priority support',
      'Monthly maintenance report'
    ],
    premium: [
      'Up to 10 support hours per month',
      'Everything in Growth',
      'Priority issue handling',
      'Regular site health review',
      'Conversion-form testing',
      'Analytics review',
      'Minor page creation',
      'Minor development work',
      'Monthly strategy recommendations'
    ]
  },
  'virtual-assistant': {
    basic: [
      'Up to 10 hours per month',
      'Basic administrative tasks',
      'Calendar support',
      'Data organization',
      'Basic research',
      'Document formatting',
      'Routine email assistance'
    ],
    standard: [
      'Up to 25 hours per month',
      'Everything in Starter',
      'CRM updates',
      'Customer follow-up support',
      'Content scheduling',
      'Reporting assistance',
      'Process support',
      'Recurring administrative workflows'
    ],
    premium: [
      'Up to 50 hours per month',
      'Advanced administrative support',
      'CRM management',
      'Customer-service support',
      'Research',
      'Reporting',
      'Content administration',
      'Project coordination',
      'Recurring operations support'
    ]
  },
  'data-analytics': {
    basic: [
      'Up to 1 primary data source',
      'Data cleanup for the agreed dataset',
      'Up to 8 key metrics',
      'One basic dashboard/report',
      'Key observations',
      'One revision round'
    ],
    standard: [
      'Up to 3 regular data sources',
      'Monthly dashboard updates',
      'KPI tracking',
      'Trend analysis',
      'Monthly performance report',
      'Data-quality review',
      'Recommendations',
      'One monthly review meeting'
    ],
    premium: [
      'Up to 5 regular data sources',
      'Advanced dashboards',
      'Department/channel segmentation',
      'KPI framework',
      'Trend analysis',
      'Conversion/performance analysis',
      'Monthly executive report',
      'Regular dashboard refreshes',
      'Monthly strategy meeting',
      'Improvement recommendations'
    ]
  },
  'process-documentation': {
    basic: [
      'Up to 3 SOPs',
      'Up to approximately 15 total finished pages',
      'Process review',
      'Step-by-step documentation',
      'Basic formatting',
      'One revision round'
    ],
    standard: [
      'Up to 8 SOPs',
      'Up to approximately 40 total finished pages',
      'Process interviews',
      'Workflow documentation',
      'Roles/responsibilities',
      'Templates/checklists where applicable',
      'Standardized formatting',
      'Two revision rounds'
    ],
    premium: [
      'Up to 20 SOPs',
      'Up to approximately 100 total finished pages',
      'Stakeholder interviews',
      'Process mapping',
      'Roles and responsibility documentation',
      'Operational checklists',
      'Templates',
      'Documentation structure',
      'Implementation recommendations',
      'Up to 3 revision rounds'
    ]
  },
  'project-management': {
    basic: [
      'Up to 10 hours per month',
      'Project tracking',
      'Task organization',
      'Deadline tracking',
      'Basic status reports',
      'Team follow-up',
      'One weekly coordination touchpoint'
    ],
    standard: [
      'Up to 25 hours per month',
      'Project planning',
      'Task management',
      'Team coordination',
      'Risk/issue tracking',
      'Weekly reporting',
      'Meeting coordination',
      'Documentation',
      'Stakeholder updates'
    ],
    premium: [
      'Up to 50 hours per month',
      'Multi-workstream coordination',
      'Project planning',
      'Schedule management',
      'Risk management',
      'Stakeholder management',
      'Team coordination',
      'Weekly reporting',
      'Project documentation',
      'Leadership updates',
      'Continuous project oversight'
    ]
  },
  'data-entry': {
    basic: [
      'Up to 500 straightforward records',
      'Data entry',
      'Basic formatting',
      'Basic duplicate review',
      'Basic quality check',
      'One agreed data source/output format'
    ],
    standard: [
      'Up to 2,000 straightforward records',
      'Data entry',
      'Data cleanup',
      'Formatting',
      'Duplicate detection',
      'Categorization',
      'Quality review',
      'Up to 2 output formats'
    ],
    premium: [
      'Up to 5,000 straightforward records per month',
      'Recurring processing',
      'Data cleanup',
      'Categorization',
      'Formatting',
      'Quality-control checks',
      'Regular status reporting'
    ]
  },
  'ai-automation': {
    basic: [
      '1 straightforward AI automation',
      'Basic AI model setup',
      'Up to 3 automation workflows',
      '1 system integration',
      'Testing and validation',
      'Basic documentation',
      'Training session'
    ],
    standard: [
      'Up to 2 AI automations',
      'Advanced AI model configuration',
      'Up to 8 automation workflows',
      'Up to 3 system integrations',
      'Data preprocessing',
      'Testing and validation',
      'Documentation',
      'Team training'
    ],
    premium: [
      'Complex AI automation suite',
      'Custom AI model development',
      'Unlimited automation workflows',
      'Up to 6 system integrations',
      'Advanced data processing',
      'Testing and validation',
      'Comprehensive documentation',
      'Team training',
      'Post-launch optimization'
    ]
  }
};

const getPackageFeatureList = (serviceSlug, selectedPackage) => {
  const serviceFeatures = SERVICE_FEATURES[serviceSlug] || {};
  const normalizedPackage = (selectedPackage || '').toLowerCase();

  if (serviceFeatures[normalizedPackage]) {
    return serviceFeatures[normalizedPackage];
  }

  if (normalizedPackage === 'starter' || normalizedPackage === 'basic') {
    return serviceFeatures.basic || [];
  }

  if (normalizedPackage === 'growth' || normalizedPackage === 'standard') {
    return serviceFeatures.standard || [];
  }

  if (normalizedPackage === 'premium') {
    return serviceFeatures.premium || [];
  }

  return serviceFeatures.basic || serviceFeatures.standard || serviceFeatures.premium || [];
};

const OrderSidebar = ({ serviceSlug, selectedPackage, packagePrice, packageName, complementaryServices }) => {
  const [checkedAddOns, setCheckedAddOns] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const basePrice = parsePrice(packagePrice);
  const isCustomQuoteOnly = packagePrice === 'Custom Quote' || basePrice === 0;

  // Get the specific add-ons for this service from the full list, fallback to defaults
  const addOns = (FULL_SERVICE_ADDONS[serviceSlug] || DEFAULT_ADDONS).filter(
    a => a.slug !== serviceSlug // don't show the service itself as its own add-on
  );

  const toggleAddOn = (slug) => {
    setCheckedAddOns(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  // Calculate add-on total using the price map (HIDDEN FROM USERS)
  const selectedAddOns = addOns.filter(a => checkedAddOns[a.slug]);
  const addOnTotal = selectedAddOns.reduce((sum, a) => sum + (ADDON_PRICES[a.slug] || 0), 0);
  const subtotal = basePrice + addOnTotal;
  const platformFee = parseFloat((subtotal * PLATFORM_FEE_PERCENT).toFixed(2));
  const total = subtotal + platformFee;
  const packageFeatures = getPackageFeatureList(serviceSlug, selectedPackage);

  const handleCheckout = async () => {
    if (isCustomQuoteOnly || total === 0) return;
    setLoading(true);
    setError('');

    try {
      const items = [
        {
          name: `${packageName} — ${serviceSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
          description: `${packageName} package`,
          price: basePrice,
          quantity: 1,
        },
        ...selectedAddOns.map(a => ({
          name: `Add-On: ${a.name}`,
          description: `Add-on service`,
          price: ADDON_PRICES[a.slug] || 0,
          quantity: 1,
        })),
        ...(platformFee > 0 ? [{
          name: 'Platform Fee (5%)',
          description: 'ScaleLink Alliance platform fee',
          price: platformFee,
          quantity: 1,
        }] : []),
      ];

      const res = await fetch(`${API_BASE}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          serviceSlug,
          packageTier: selectedPackage,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&service=${serviceSlug}&package=${selectedPackage}`,
          cancelUrl: window.location.href,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create checkout session.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden lg:sticky lg:top-6">
      {/* Header */}
      <div className="bg-gray-900 px-4 sm:px-6 py-3 sm:py-4">
        <h3 className="text-white font-bold text-sm sm:text-base">Your Order</h3>
      </div>

      <div className="p-4 sm:p-6">
        {/* Selected package */}
        <div className="flex items-center justify-between mb-1 gap-2">
          <span className="text-sm font-semibold text-gray-800 truncate">{packageName || 'Selected Package'}</span>
          <span className="text-sm font-bold text-gray-900 shrink-0">
            {isCustomQuoteOnly ? 'Custom Quote' : `$${basePrice.toLocaleString()}`}
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-5 capitalize">{serviceSlug?.replace(/-/g, ' ')}</p>

        {packageFeatures.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <FaCheckCircle className="text-green-500" size={10} /> What&apos;s Included
            </p>
            <ul className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {packageFeatures.map((feature, index) => (
                <li key={`${serviceSlug}-${selectedPackage}-${index}`} className="flex items-start gap-2 text-xs text-gray-700 leading-snug">
                  <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" size={10} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Add-ons - NO PRICES DISPLAYED TO USERS */}
        {addOns.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <FaTag className="text-blue-500" size={10} /> Add-On Services
            </p>
            {/* Fixed: max-h-75 is not a valid Tailwind class and was silently doing
                nothing, letting this list grow unbounded (10 add-ons on some
                services) and blow out page height on mobile. max-h-64 + scroll
                keeps it contained on any screen size. */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-2">
              {addOns.map(addon => (
                <div key={addon.slug} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`addon-${addon.slug}`}
                    checked={!!checkedAddOns[addon.slug]}
                    onChange={() => toggleAddOn(addon.slug)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer shrink-0"
                  />
                  <label htmlFor={`addon-${addon.slug}`} className="grow cursor-pointer min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-gray-800 leading-snug break-words">{addon.name}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checked add-ons summary - NO PRICES DISPLAYED TO USERS */}
        {selectedAddOns.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1.5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Additional Features</p>
            {selectedAddOns.map(a => (
              <div key={a.slug} className="flex items-center justify-between text-sm gap-2">
                <span className="text-gray-700 text-xs truncate">{a.name}</span>
                <button
                  onClick={() => toggleAddOn(a.slug)}
                  className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        {!isCustomQuoteOnly && (
          <div className="border-t border-gray-100 pt-4 space-y-2 mb-5">
            <div className="flex justify-between text-sm gap-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm gap-2">
              <span className="text-gray-500 flex items-center gap-1">
                Platform Fee (5%)
                <FaInfoCircle className="text-gray-300 text-xs shrink-0" />
              </span>
              <span className="text-gray-700">${platformFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 gap-2">
              <span className="text-gray-900">Total</span>
              <span className="text-blue-600">${total.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
            {error}
          </div>
        )}

        {/* CTA */}
        {isCustomQuoteOnly ? (
          <Link
            to="/contact"
            className="block w-full py-3.5 text-center font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
          >
            Request Custom Quote
          </Link>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={loading || total === 0}
            className="w-full py-3.5 font-bold rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 text-center leading-tight px-2"
          >
            {loading ? (
              <><FaSpinner className="animate-spin shrink-0" /> Redirecting...</>
            ) : (
              <><FaLock size={12} className="shrink-0" /> Checkout — ${total.toLocaleString()}</>
            )}
          </button>
        )}

        {/* Save for later */}
        <button className="w-full mt-2 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          Save & Continue Later
        </button>

        {/* Trust badges */}
        <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <FaShieldAlt className="text-green-500 shrink-0 mt-0.5" size={13} />
            <div>
              <p className="text-xs font-semibold text-gray-800">100% Secure Payment</p>
              <p className="text-xs text-gray-400">Protected by industry-leading encryption</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <FaCheckCircle className="text-blue-500 shrink-0 mt-0.5" size={13} />
            <div>
              <p className="text-xs font-semibold text-gray-800">Need something custom?</p>
              <Link to="/contact" className="text-xs text-blue-600 hover:underline">
                Contact us for a personalized quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSidebar;
