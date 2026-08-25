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

// ─── ALL SERVICES WITH PACKAGES (from ServiceDetailPage) ────────────────────
const SERVICES_WITH_PACKAGES = {
  // ─── CREATIVE & CONTENT ────────────────────────────────────────────────────
  'Graphic Design': {
    packages: {
      starter: { name: 'Starter Package', price: 4900, description: 'Ideal for a single marketing asset or quick design need.', includes: ['1 marketing asset', 'basic custom design', '1 revision round', 'final web-ready file'] },
      growth: { name: 'Standard Package', price: 19900, description: 'Ideal for businesses needing a coordinated set of marketing assets.', includes: ['up to 5 coordinated assets', 'consistent visual direction', 'basic image sourcing', '2 revision rounds'] },
      premium: { name: 'Premium Package', price: 49900, description: 'Ideal for businesses running full marketing campaigns.', includes: ['up to 12 coordinated marketing assets', 'creative direction & brand-consistent system', 'multiple campaign formats', 'up to 3 revision rounds', 'print-ready files when required'] }
    }
  },
  'Video Editing & Motion Graphics': {
    packages: {
      starter: { name: 'Starter Package', price: 9900, description: 'Ideal for a single short video up to 60 seconds.', includes: ['1 video up to 60 seconds', 'basic cuts and transitions', 'text/captions', 'basic audio balancing', '1 revision round'] },
      growth: { name: 'Standard Package', price: 29900, description: 'Ideal for a single longer video with professional polish.', includes: ['1 video up to 5 minutes', 'professional editing with B-roll placement', 'titles, text graphics & basic motion graphics', 'audio cleanup and color correction', 'up to 2 aspect ratios', '2 revision rounds'] },
      premium: { name: 'Premium Package', price: 69900, description: 'Ideal for a long-form video or a small batch of short-form videos.', includes: ['1 long-form video up to 12 minutes, or up to 5 short-form videos', 'advanced editing & motion graphics', 'audio enhancement and color correction', 'branded graphics and captions', 'multiple export formats', 'up to 3 revision rounds'] }
    }
  },
  'Copywriting & Content Creation': {
    packages: {
      starter: { name: 'Starter Package', price: 100, description: 'Ideal for small content needs or single-page messaging.', includes: ['1 content piece up to 800 words', 'basic keyword research (if needed)', 'formatting for web readability', '1 revision round'] },
      growth: { name: 'Standard Package', price: 29900, description: 'Ideal for businesses needing multiple content pieces with keyword awareness.', includes: ['up to 2,500 total words across up to 3 pieces', 'keyword consideration & headline development', 'CTA development', 'basic competitor/content review', '2 revision rounds'] },
      premium: { name: 'Premium Package', price: 69900, description: 'Ideal for businesses running content marketing campaigns.', includes: ['up to 6,000 total words across up to 6 pieces', 'content strategy & SEO-oriented structure', 'conversion-focused CTA development', 'brand voice consistency', 'up to 3 revision rounds'] }
    }
  },
  'Brand Identity & Logo Design': {
    packages: {
      starter: { name: 'Starter Package', price: 100, description: 'Ideal for small businesses launching a brand or refreshing their logo.', includes: ['1 custom logo concept', 'basic color palette selection', '1 revision round', 'logo files delivered in PNG and SVG formats'] },
      growth: { name: 'Standard Package', price: 59900, description: 'Ideal for businesses that want a more developed brand identity.', includes: ['brand discovery + 3 initial logo concepts', 'primary logo, secondary variation & icon/mark', 'color palette & typography system', 'social profile assets & basic brand guidelines', '3 revision rounds'] },
      premium: { name: 'Premium Package', price: 129900, description: 'Ideal for companies building a full professional brand identity.', includes: ['brand strategy session & competitive visual review', '3 refined creative directions', 'primary + secondary logos, brand mark, color & typography systems', 'basic business card/letterhead templates', 'comprehensive brand guideline document', 'up to 3 revision rounds'] }
    }
  },
  'Photography & Visual Assets': {
    packages: {
      starter: { name: 'Starter Package', price: 19900, description: 'Ideal for small businesses needing essential visual content.', includes: ['10 professionally edited photos', '1 location or subject focus', 'basic color correction and editing', 'digital image delivery (web-ready format)'] },
      growth: { name: 'Standard Package', price: 49900, description: 'Ideal for businesses creating marketing content.', includes: ['25 professionally edited photos', 'multiple subjects or scenes', 'color correction and retouching', 'web and high-resolution formats'] },
      premium: { name: 'Premium Package', price: 99900, description: 'Ideal for brand campaigns and full marketing visuals.', includes: ['50 professionally edited photos', 'multi-scene photography session', 'advanced retouching and editing', 'full-resolution and web-ready images', 'image selection consultation'] }
    }
  },

  // ─── TECH & DEVELOPMENT ─────────────────────────────────────────────────────
  'Website Development': {
    packages: {
      starter: { name: 'Starter Package', price: 79900, description: 'Ideal for new businesses needing a professional online presence.', includes: ['up to 5 core website pages', 'custom homepage design', 'mobile & tablet responsive design', 'contact form + click-to-call', 'basic on-page SEO & Google Analytics setup', '2 revision rounds'] },
      growth: { name: 'Standard Package', price: 179900, description: 'Ideal for businesses that want their website to actively support lead generation.', includes: ['up to 10 pages with more custom layouts', 'blog or resource section', 'up to 2 lead-generation forms + thank-you page', 'CRM or email platform connection', 'enhanced on-page SEO & sitemap setup', '3 revision rounds + CMS training'] },
      premium: { name: 'Premium Package', price: 399900, description: 'Ideal for growing businesses requiring a larger, conversion-focused presence.', includes: ['up to 20 pages with custom UX/UI direction', 'conversion-focused page architecture', 'up to 5 lead-generation forms', 'advanced CRM/form integrations & marketing automation connection', 'enhanced technical SEO & staging environment', 'team training + post-launch review'] }
    }
  },
  'Landing Pages & Sales Funnels': {
    packages: {
      starter: { name: 'Starter Package', price: 49900, description: 'Ideal for businesses launching a simple marketing campaign.', includes: ['1 landing page design', 'lead capture form integration', 'mobile-responsive layout', 'basic analytics setup', 'call-to-action optimization'] },
      growth: { name: 'Standard Package', price: 129900, description: 'Ideal for businesses running structured marketing campaigns.', includes: ['3-page sales funnel', 'landing page + follow-up pages', 'lead capture forms', 'conversion-focused design', 'analytics integration'] },
      premium: { name: 'Premium Package', price: 249900, description: 'Ideal for businesses running full digital marketing funnels.', includes: ['complete sales funnel (5 pages)', 'multiple landing pages', 'advanced form integrations', 'email marketing integration', 'conversion optimization setup'] }
    }
  },
  'E-Commerce Development': {
    packages: {
      starter: { name: 'Starter Package', price: 119900, description: 'Ideal for new or smaller online stores.', includes: ['store setup with up to 10 products', 'up to 5 informational pages', 'one payment gateway + basic shipping/tax setup', 'order notification setup & basic SEO', 'store management training'] },
      growth: { name: 'Standard Package', price: 299900, description: 'Ideal for established businesses expanding online sales.', includes: ['store setup with up to 50 products', 'advanced product variations & coupon/discount functionality', 'email marketing integration', 'customer account & review functionality', 'up to 2 payment gateways'] },
      premium: { name: 'Premium Package', price: 599900, description: 'Ideal for businesses requiring a more advanced commerce environment.', includes: ['store setup with up to 150 initial products', 'custom storefront components & enhanced checkout', 'CRM integration & advanced email automation', 'subscription functionality where supported', 'data migration assistance & team training'] }
    }
  },
  'Web Applications & SaaS Development': {
    packages: {
      starter: { name: 'Starter MVP', price: 499900, description: 'Ideal for validating a focused software concept.', includes: ['requirements workshop & basic product architecture', 'user authentication, 1 primary user role', 'up to 5 core application screens', 'database setup & basic admin functionality', '1 third-party integration', 'testing & deployment assistance'] },
      growth: { name: 'Growth Application', price: 1199900, description: 'Ideal for businesses building more advanced digital systems.', includes: ['up to 15 core screens, up to 2 user roles', 'advanced database structure & admin dashboard', 'up to 3 integrations', 'notification & user-account management functionality', 'QA testing, deployment, documentation & team handoff'] },
      premium: { name: 'Premium SaaS / Custom Platform', price: 2499900, description: 'Ideal for businesses launching a SaaS platform or full digital product.', includes: ['complex product architecture, multiple user roles', 'subscription/billing systems & custom dashboards', 'API integrations & automated workflows', 'role-based permissions & reporting', 'staging/production environments, advanced QA & post-launch support'] }
    }
  },
  'API Integration & Automation': {
    packages: {
      starter: { name: 'Starter Package', price: 100, description: 'Ideal for businesses connecting two systems for the first time.', includes: ['1 system integration', 'basic data synchronization', 'simple workflow automation', 'testing and configuration'] },
      growth: { name: 'Standard Package', price: 129900, description: 'Ideal for businesses connecting multiple tools.', includes: ['integration of up to 2 systems, up to 6 endpoints/actions', 'advanced data mapping & workflow logic', 'error logging & testing environment', 'documentation & deployment assistance'] },
      premium: { name: 'Premium Package', price: 349900, description: 'Ideal for businesses implementing full automation systems.', includes: ['up to 3 interconnected systems, up to 15 endpoints/actions', 'complex workflow logic & data transformations', 'authentication/security configuration', 'error handling, testing & deployment support', 'technical documentation & post-launch review'] }
    }
  },
  'Website Maintenance & Updates': {
    packages: {
      starter: { name: 'Starter Care', price: 14900, description: 'Ideal for small websites needing occasional updates.', includes: ['up to 2 hours of website work per month', 'core/plugin updates & basic backup monitoring', 'basic uptime checks & minor content edits', 'monthly maintenance summary'] },
      growth: { name: 'Growth Care', price: 34900, description: 'Ideal for businesses regularly updating their website.', includes: ['up to 5 support hours per month', 'backup & uptime monitoring', 'content changes & minor design adjustments', 'form/function testing & priority support', 'monthly maintenance report'] },
      premium: { name: 'Premium Care', price: 79900, description: 'Ideal for businesses that rely heavily on their website.', includes: ['up to 10 support hours per month', 'priority issue handling & regular site health review', 'conversion-form testing & analytics review', 'minor page creation & minor development work', 'monthly strategy recommendations'] }
    }
  },

  // ─── MARKETING & GROWTH ────────────────────────────────────────────────────
  'SEO & Search Marketing': {
    packages: {
      starter: { name: 'Starter Package', price: 49900, description: 'Ideal for small businesses beginning their SEO strategy.', includes: ['initial SEO audit & keyword research (up to 10 keywords)', 'optimization of up to 5 priority pages', 'meta titles, headings & internal-link improvements', 'GSC/GA & XML sitemap review', 'monthly ranking review & report'] },
      growth: { name: 'Standard Package', price: 99900, description: 'Ideal for businesses actively working to improve search rankings.', includes: ['up to 20 tracked keywords, optimization across up to 15 pages', 'competitor SEO review & content-gap analysis', '2 SEO content pieces/optimizations per month', 'local SEO optimization where applicable', 'monthly strategy review'] },
      premium: { name: 'Premium Package', price: 199900, description: 'Ideal for businesses seeking aggressive search growth.', includes: ['up to 40 tracked keywords, up to 30 priority pages', 'up to 4 SEO content pieces/optimizations per month', 'advanced competitor research & schema strategy', 'link opportunity research & outreach strategy', 'monthly strategy call & executive reporting'] }
    }
  },
  'Paid Advertising Management': {
    packages: {
      starter: { name: 'Starter Package', price: 39900, description: 'Ideal for smaller businesses testing paid acquisition.', includes: ['1 advertising platform, up to 1 active campaign', 'up to 3 ad groups/sets, up to 6 ad variations', 'conversion tracking setup & budget monitoring', 'monthly report & one campaign review'] },
      growth: { name: 'Standard Package', price: 79900, description: 'Ideal for businesses running multiple campaigns.', includes: ['up to 2 active campaigns, up to 8 ad groups/sets', 'up to 12 active ad variations', 'retargeting campaign setup & landing-page recommendations', 'weekly optimization & monthly strategy call'] },
      premium: { name: 'Premium Package', price: 149900, description: 'Ideal for larger or more complex advertising programs.', includes: ['multi-campaign management, up to 2 platforms', 'advanced audience segmentation & retargeting', 'creative testing & funnel performance analysis', 'weekly performance monitoring', 'monthly strategy call & executive reporting'] }
    }
  },
  'Email Marketing Campaigns': {
    packages: {
      starter: { name: 'Starter Package', price: 100, description: 'Ideal for businesses launching a simple email campaign.', includes: ['1 email campaign', 'email template design', 'content formatting', 'mailing list integration', 'campaign scheduling'] },
      growth: { name: 'Standard Package', price: 59900, description: 'Ideal for businesses running regular email communication.', includes: ['up to 4 emails with campaign strategy', 'subject-line development & basic copywriting', 'audience segmentation & UTM/tracking setup', 'basic automation & performance report', '2 revision rounds'] },
      premium: { name: 'Premium Package', price: 119900, description: 'Ideal for businesses running structured email marketing programs.', includes: ['up to 8 emails with full campaign strategy', 'copywriting, design & segmentation strategy', 'automated email flow & lead tagging', 'basic A/B testing & conversion tracking', 'performance analysis & optimization recommendations'] }
    }
  },
  'Lead Generation Services': {
    packages: {
      starter: { name: 'Starter Package', price: 29900, description: 'Ideal for businesses building their initial lead pipeline.', includes: ['ideal customer profile definition & basic market research', 'up to 150 prospect records per month', 'basic lead-list organization & contact-data cleanup', 'one outreach sequence framework', 'monthly results summary'] },
      growth: { name: 'Standard Package', price: 69900, description: 'Ideal for businesses scaling their sales efforts.', includes: ['up to 500 prospect records per month', 'multiple target segments & enhanced prospect research', 'up to 2 outreach sequences & basic personalization framework', 'CRM import assistance & lead tagging', 'monthly performance analysis'] },
      premium: { name: 'Premium Package', price: 149900, description: 'Ideal for businesses needing ongoing lead flow.', includes: ['up to 1,000 prospect records per month', 'multiple customer profiles & advanced account research', 'multi-step outreach strategy & CRM pipeline setup', 'lead qualification framework & follow-up automation', 'monthly strategy session'] }
    }
  },
  'CRM & Marketing Automation': {
    packages: {
      starter: { name: 'Starter Package', price: 49900, description: 'Ideal for businesses implementing their first CRM.', includes: ['1 CRM pipeline, basic CRM configuration', 'up to 2 forms, up to 3 automated workflows', 'contact tagging & basic lead notifications', '1 third-party integration', 'one training session'] },
      growth: { name: 'Standard Package', price: 129900, description: 'Ideal for businesses scaling their automation.', includes: ['up to 2 CRM pipelines, up to 5 automated workflows', 'up to 3 integrations, lead routing', 'email follow-up & task automation', 'contact segmentation & pipeline stages', 'testing, documentation & team training'] },
      premium: { name: 'Premium Package', price: 299900, description: 'Ideal for comprehensive marketing automation.', includes: ['up to 4 pipelines, up to 12 automated workflows', 'up to 6 integrations, advanced lead routing', 'multi-step customer journeys, sales & marketing automation', 'customer tagging/scoring rules & reporting dashboard', 'up to 2 hours team training + post-launch review'] }
    }
  },
  // ─── OPERATIONS & SUPPORT ──────────────────────────────────────────────────
  'Virtual Assistant Services': {
    packages: {
      starter: { name: 'Starter Package', price: 19900, description: 'Ideal for businesses needing light administrative support.', includes: ['up to 10 hours of virtual assistant support per month', 'basic administrative tasks & calendar support', 'data organization & basic research', 'document formatting & routine email assistance'] },
      growth: { name: 'Standard Package', price: 49900, description: 'Ideal for businesses needing regular operational assistance.', includes: ['up to 25 hours of virtual assistant support per month', 'everything in Starter, plus CRM updates', 'customer follow-up support & content scheduling', 'reporting assistance & recurring admin workflows'] },
      premium: { name: 'Premium Package', price: 89900, description: 'Ideal for businesses requiring consistent operational support.', includes: ['up to 50 hours of virtual assistant support per month', 'advanced administrative support & CRM management', 'customer-service support & research', 'reporting, content administration & project coordination'] }
    }
  },
  'Data Analytics & Reporting': {
    packages: {
      starter: { name: 'Starter Package', price: 24900, description: 'Ideal for businesses needing basic performance insights.', includes: ['up to 1 primary data source', 'data cleanup for the agreed dataset', 'up to 8 key metrics', 'one basic dashboard/report & key observations'] },
      growth: { name: 'Standard Package', price: 69900, description: 'Ideal for businesses tracking multiple performance areas.', includes: ['up to 3 regular data sources', 'monthly dashboard updates & KPI tracking', 'trend analysis & data-quality review', 'one monthly review meeting'] },
      premium: { name: 'Premium Package', price: 149900, description: 'Ideal for businesses seeking ongoing performance monitoring.', includes: ['up to 5 regular data sources', 'advanced dashboards & department/channel segmentation', 'KPI framework, trend & conversion analysis', 'monthly executive report & strategy meeting'] }
    }
  },
  'Data Entry & Processing': {
    packages: {
      starter: { name: 'Starter Package', price: 9900, description: 'Ideal for small administrative data tasks.', includes: ['up to 500 straightforward records', 'data entry & basic formatting', 'basic duplicate review & quality check', 'one agreed data source/output format'] },
      growth: { name: 'Standard Package', price: 29900, description: 'Ideal for businesses managing larger datasets.', includes: ['up to 2,000 straightforward records', 'data entry, cleanup & formatting', 'duplicate detection & categorization', 'quality review, up to 2 output formats'] },
      premium: { name: 'Premium Package', price: 69900, description: 'Ideal for businesses needing ongoing data processing.', includes: ['up to 5,000 records per month, recurring processing', 'data cleanup & categorization', 'formatting & quality-control checks', 'regular status reporting'] }
    }
  },

  // ─── WEBSITES & DEVELOPMENT ────────────────────────────────────────────────
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
      starter: { name: 'Starter Package', price: 29900, description: 'Ideal for small businesses maintaining a basic social media presence.', includes: ['8 social media posts per month', 'content scheduling', 'basic caption writing', 'engagement monitoring', 'performance overview'] },
      growth: { name: 'Standard Package', price: 59900, description: 'Ideal for businesses expanding their social media activity.', includes: ['15 social media posts per month', 'graphic content creation', 'caption writing and hashtags', 'audience engagement monitoring', 'monthly performance report'] },
      premium: { name: 'Premium Package', price: 149900, description: 'Ideal for businesses using social media as a primary marketing channel.', includes: ['30 social media posts per month', 'custom graphics and visuals', 'caption writing and strategy', 'engagement management', 'detailed performance reporting'] }
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
      starter: { name: 'Starter Package', price: 100, description: 'Ideal for managing a small project or short-term initiative.', includes: ['management of 1 project', 'project planning and timeline development', 'task coordination', 'progress tracking and status updates'] },
      growth: { name: 'Standard Package', price: 149900, description: 'Ideal for businesses managing multiple tasks within a project.', includes: ['management of up to 3 project phases or workstreams', 'project planning and scheduling', 'task and milestone tracking', 'team coordination and communication'] },
      premium: { name: 'Premium Package', price: 349900, description: 'Ideal for businesses requiring full project oversight.', includes: ['comprehensive project management support', 'project planning and scheduling', 'team coordination across departments', 'progress tracking and milestone reporting', 'project performance review'] }
    }
  },
  'Process Documentation & SOP Development': {
    packages: {
      starter: { name: 'Starter Package', price: 40000, description: 'Ideal for businesses documenting a single workflow.', includes: ['1 documented business process', 'step-by-step SOP document', 'workflow outline or process map', 'basic formatting for easy reference'] },
      growth: { name: 'Standard Package', price: 120000, description: 'Ideal for businesses organizing multiple operational procedures.', includes: ['3 documented workflows', 'structured SOP documents', 'workflow diagrams or visual process maps', 'process improvement recommendations'] },
      premium: { name: 'Premium Package', price: 350000, description: 'Ideal for businesses building a full operational framework.', includes: ['6+ documented workflows', 'complete SOP manual or operations guide', 'workflow diagrams and structured documentation', 'recommendations for process optimization'] }
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
const ServiceHoverPreview = ({ service, packageKey, onClose }) => {
  const serviceData = SERVICES_WITH_PACKAGES[service];
  const pkgData = serviceData?.packages?.[packageKey];
  const ServiceIcon = getServiceIcon(service);
  const isCustomQuote = service === 'Request Custom Quote' || service.includes('Request Custom Quote') || pkgData?.price === 0;
  
  if (!serviceData || !pkgData) return null;
  
  const slug = getServiceSlug(service);
  
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
            {isCustomQuote || pkgData.price === 0 ? 'Custom Quote' : `$${(pkgData.price / 100).toFixed(2)}`}
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
const PackageComparisonTable = ({ service, selectedPackage, onSelect, currency, convertedAmounts }) => {
  const serviceData = SERVICES_WITH_PACKAGES[service];
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
  continueDisabled 
}) => {
  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const entries = Object.entries(selectedServices);
  const hasCustomQuote = entries.some(([service]) => service.includes('Request Custom Quote') || SERVICES_WITH_PACKAGES[service]?.packages?.custom?.price === 0);
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
            const pkgData = SERVICES_WITH_PACKAGES[service]?.packages[pkg];
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
      const hasCustomQuote = Object.keys(selectedServices).some(s => s.includes('Request Custom Quote') || SERVICES_WITH_PACKAGES[s]?.packages?.custom?.price === 0);
      
      if (hasCustomQuote) {
        setIsPaid(true);
        setCurrentStep(2);
        window.scrollTo(0, 0);
      } else if (serviceSlug) {
        const serviceName = SLUG_TO_SERVICE_NAME[serviceSlug];
        if (serviceName && (serviceName.includes('Request Custom Quote') || SERVICES_WITH_PACKAGES[serviceName]?.packages?.custom?.price === 0)) {
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
    const serviceData = serviceName ? SERVICES_WITH_PACKAGES[serviceName] : null;
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
    if (!exchangeRates) return;
    const result = {};
    Object.keys(SERVICES_WITH_PACKAGES).forEach(service => {
      result[service] = {};
      Object.entries(SERVICES_WITH_PACKAGES[service].packages).forEach(([key, pkg]) => {
        result[service][key] = convertAmount(pkg.price);
      });
    });
    setConvertedAmounts(result);
  }, [selectedCurrency, exchangeRates, convertAmount]);

  const serviceCount = Object.keys(selectedServices).length;

  const hasCustomQuote = useMemo(() => {
    return Object.keys(selectedServices).some(
      s => s.includes('Request Custom Quote') || SERVICES_WITH_PACKAGES[s]?.packages?.custom?.price === 0
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
        const isCustomQuote = service.includes('Request Custom Quote') || SERVICES_WITH_PACKAGES[service]?.packages?.custom?.price === 0;
        if (isCustomQuote) {
          categoryServices.forEach(s => { 
            const sIsCustom = s.includes('Request Custom Quote') || SERVICES_WITH_PACKAGES[s]?.packages?.custom?.price === 0;
            if (s !== service && sIsCustom) delete next[s]; 
          });
          next[service] = 'custom';
        } else {
          categoryServices.forEach(s => { 
            const sIsCustom = s.includes('Request Custom Quote') || SERVICES_WITH_PACKAGES[s]?.packages?.custom?.price === 0;
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
        const pkgData = SERVICES_WITH_PACKAGES[svc]?.packages?.[pkg];
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
          projectScope: { customQuoteAnswers }
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

  // ── Step 2 → Stripe Checkout (or bypass for $0 custom quote) ──
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
    formData.phoneNumber?.trim() && formData.company?.trim() && formData.projectDescription?.trim()
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
    const hasCustomQuote = Object.keys(selectedServices).some(s => s.includes('Request Custom Quote') || SERVICES_WITH_PACKAGES[s]?.packages?.custom?.price === 0);
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
                            const isCustomQuote = service.includes('Request Custom Quote') || SERVICES_WITH_PACKAGES[service]?.packages?.custom?.price === 0;
                            
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
                        const isCustomQuote = service.includes('Request Custom Quote') || SERVICES_WITH_PACKAGES[service]?.packages?.custom?.price === 0;
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
                      const ServiceIcon = getServiceIcon(service), amount = convertedAmounts[service]?.[pkg] || 0, pkgData = SERVICES_WITH_PACKAGES[service]?.packages[pkg];
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
                    <span>Secured by <strong>Stripe</strong>. We never store your card information.</span>
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