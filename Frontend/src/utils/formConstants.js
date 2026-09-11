// src/utils/formConstants.js

export const COUNTRIES = [
  { code: 'US', name: 'United States', dialCode: '+1', dial: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', dial: '+44' },
  { code: 'CA', name: 'Canada', dialCode: '+1', dial: '+1' },
  { code: 'AU', name: 'Australia', dialCode: '+61', dial: '+61' },
  { code: 'DE', name: 'Germany', dialCode: '+49', dial: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33', dial: '+33' },
  { code: 'ES', name: 'Spain', dialCode: '+34', dial: '+34' },
  { code: 'IT', name: 'Italy', dialCode: '+39', dial: '+39' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', dial: '+31' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', dial: '+32' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', dial: '+41' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', dial: '+46' },
  { code: 'NO', name: 'Norway', dialCode: '+47', dial: '+47' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', dial: '+45' },
  { code: 'FI', name: 'Finland', dialCode: '+358', dial: '+358' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', dial: '+353' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', dial: '+351' },
  { code: 'AT', name: 'Austria', dialCode: '+43', dial: '+43' },
  { code: 'PL', name: 'Poland', dialCode: '+48', dial: '+48' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', dial: '+420' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', dial: '+36' },
  { code: 'GR', name: 'Greece', dialCode: '+30', dial: '+30' },
  { code: 'JP', name: 'Japan', dialCode: '+81', dial: '+81' },
  { code: 'CN', name: 'China', dialCode: '+86', dial: '+86' },
  { code: 'IN', name: 'India', dialCode: '+91', dial: '+91' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', dial: '+55' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', dial: '+52' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', dial: '+27' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', dial: '+234' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', dial: '+254' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', dial: '+20' },
  { code: 'AE', name: 'UAE', dialCode: '+971', dial: '+971' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', dial: '+966' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', dial: '+65' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', dial: '+60' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', dial: '+63' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', dial: '+64' },
];

export const CURRENCIES = [
  { code: 'usd', symbol: '$', name: 'USD', zeroDecimal: false },
  { code: 'eur', symbol: '€', name: 'EUR', zeroDecimal: false },
  { code: 'gbp', symbol: '£', name: 'GBP', zeroDecimal: false },
  { code: 'jpy', symbol: '¥', name: 'JPY', zeroDecimal: true },
  { code: 'cny', symbol: '¥', name: 'CNY', zeroDecimal: false },
  { code: 'cad', symbol: 'C$', name: 'CAD', zeroDecimal: false },
  { code: 'aud', symbol: 'A$', name: 'AUD', zeroDecimal: false },
  { code: 'chf', symbol: 'CHF', name: 'CHF', zeroDecimal: false },
  { code: 'inr', symbol: '₹', name: 'INR', zeroDecimal: false },
  { code: 'sgd', symbol: 'S$', name: 'SGD', zeroDecimal: false },
  { code: 'ngn', symbol: '₦', name: 'NGN', zeroDecimal: false },
  { code: 'kes', symbol: 'KSh', name: 'KES', zeroDecimal: false },
  { code: 'zar', symbol: 'R', name: 'ZAR', zeroDecimal: false },
];

export const BUDGET_RANGES = [
  'Under $500',
  '$500 - $1,000',
  '$1,000 - $2,500',
  '$2,500 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000+',
  'Custom Quote / Not Sure'
];

// ─── SERVICE CATEGORIES with Custom Quote options ───
export const SERVICE_CATEGORIES = {
  'creative-content': {
    id: 'creative-content',
    label: 'Content, Branding & Creative',
    services: [
      'Graphic Design',
      'Video Editing & Motion Graphics',
      'Copywriting & Content Creation',
      'Brand Identity & Logo Design',
      'Photography & Visual Assets',
      'Request Custom Quote - Content & Branding'
    ]
  },
  'tech-development': {
    id: 'tech-development',
    label: 'Website & Web App Development',
    services: [
      'Website Development',
      'Landing Pages & Sales Funnels',
      'E-Commerce Development',
      'Web Applications & SaaS Development',
      'API Integration & Automation',
      'Website Maintenance & Updates',
      'Online Booking Systems',
      'Request Custom Quote - Tech & Development'
    ]
  },
  'marketing-growth': {
    id: 'marketing-growth',
    label: 'Website Growth & Marketing',
    services: [
      'Social Media Management',
      'SEO & Search Marketing',
      'Paid Advertising Management',
      'Email Marketing Campaigns',
      'Lead Generation Services',
      'CRM & Marketing Automation',
      'Reputation & Review Management',
      'Request Custom Quote - Marketing & Growth'
    ]
  },
  'automation-crm': {
    id: 'automation-crm',
    label: 'Automation, CRM & AI Systems',
    services: [
      'AI Automation & Smart Business Systems',
      'CRM Setup & Marketing Automation',
      'API Integration & Automation',
      'Business Process Automation',
      'Data Analytics & Reporting',
      'Request Custom Quote - AI'
    ]
  },
  'operations-support': {
    id: 'operations-support',
    label: 'Business Strategy & Support',
    services: [
      'Virtual Assistant Services',
      'Data Analytics & Reporting',
      'Process Documentation & SOP Development',
      'Project Management Support',
      'Data Entry & Processing',
      'Business Consulting & Growth Strategy',
      'Request Custom Quote - Business Support'
    ]
  }
};

// ─── SERVICE PACKAGES WITH AMENDED PRICES ───
// Dynamic base fallback; service packages are loaded live from the CMS database
export const SERVICES_WITH_PACKAGES = {};

export const getServiceIconName = (serviceName) => {
  const iconMap = {
    'Copywriting & Content Creation': 'FaPenNib',
    'Graphic Design': 'FaPaintBrush',
    'Brand Identity & Logo Design': 'FaPalette',
    'Video Editing & Motion Graphics': 'FaVideo',
    'Website Development': 'FaCode',
    'Web Applications & SaaS Development': 'FaGlobe',
    'E-Commerce Development': 'FaShoppingCart',
    'Landing Pages & Sales Funnels': 'FaRocket',
    'Online Booking Systems': 'FaCalendar',
    'SEO & Search Marketing': 'FaSearch',
    'Lead Generation Services': 'FaRegBuilding',
    'Paid Advertising Management': 'FaAd',
    'Email Marketing Campaigns': 'FaEnvelope',
    'Reputation & Review Management': 'FaStar',
    'Social Media Management': 'FaUsers',
    'AI Automation & Smart Business Systems': 'FaRobot',
    'CRM Setup & Marketing Automation': 'FaCogs',
    'API Integration': 'FaCloudUploadAlt',
    'Business Process Automation': 'FaSync',
    'Data Analytics & Reports': 'FaChartLine',
    'Business Consulting & Growth Strategy': 'FaBriefcase',
    'Virtual Assistant Services': 'FaHeadset',
    'Project Management Support': 'FaProjectDiagram',
    'Data Entry & Processing': 'FaDatabase',
    'Request Custom Quote - Content & Branding': 'FaCogs',
    'Request Custom Quote - Tech & Development': 'FaCogs',
    'Request Custom Quote - Marketing & Growth': 'FaCogs',
    'Request Custom Quote - AI': 'FaCogs',
    'Request Custom Quote - Business Support': 'FaCogs'
  };
  return iconMap[serviceName] || 'FaCogs';
};