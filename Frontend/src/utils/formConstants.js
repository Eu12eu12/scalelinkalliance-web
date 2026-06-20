// src/utils/formConstants.js

export const COUNTRIES = [
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽' },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
  { code: 'AE', name: 'UAE', dial: '+971', flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬' },
  { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩' },
  { code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰' },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿' },
  { code: 'IE', name: 'Ireland', dial: '+353', flag: '🇮🇪' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dial: '+47', flag: '🇳🇴' },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭' },
  { code: 'PL', name: 'Poland', dial: '+48', flag: '🇵🇱' },
  { code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺' },
  { code: 'TR', name: 'Turkey', dial: '+90', flag: '🇹🇷' },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
  { code: 'TZ', name: 'Tanzania', dial: '+255', flag: '🇹🇿' },
  { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴' },
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱' },
  { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳' },
].sort((a, b) => a.name.localeCompare(b.name));

export const CURRENCIES = [
  { code: 'usd', symbol: '$', name: 'US Dollar', zeroDecimal: false, country: 'United States' },
  { code: 'eur', symbol: '€', name: 'Euro', zeroDecimal: false, country: 'European Union' },
  { code: 'gbp', symbol: '£', name: 'British Pound', zeroDecimal: false, country: 'United Kingdom' },
  { code: 'cad', symbol: 'C$', name: 'Canadian Dollar', zeroDecimal: false, country: 'Canada' },
  { code: 'aud', symbol: 'A$', name: 'Australian Dollar', zeroDecimal: false, country: 'Australia' },
  { code: 'nzd', symbol: 'NZ$', name: 'New Zealand Dollar', zeroDecimal: false, country: 'New Zealand' },
  { code: 'jpy', symbol: '¥', name: 'Japanese Yen', zeroDecimal: true, country: 'Japan' },
  { code: 'cny', symbol: '¥', name: 'Chinese Yuan', zeroDecimal: false, country: 'China' },
  { code: 'inr', symbol: '₹', name: 'Indian Rupee', zeroDecimal: false, country: 'India' },
  { code: 'sgd', symbol: 'S$', name: 'Singapore Dollar', zeroDecimal: false, country: 'Singapore' },
  { code: 'hkd', symbol: 'HK$', name: 'Hong Kong Dollar', zeroDecimal: false, country: 'Hong Kong' },
  { code: 'krw', symbol: '₩', name: 'South Korean Won', zeroDecimal: true, country: 'South Korea' },
  { code: 'chf', symbol: 'Fr', name: 'Swiss Franc', zeroDecimal: false, country: 'Switzerland' },
  { code: 'sek', symbol: 'kr', name: 'Swedish Krona', zeroDecimal: false, country: 'Sweden' },
  { code: 'nok', symbol: 'kr', name: 'Norwegian Krone', zeroDecimal: false, country: 'Norway' },
  { code: 'dkk', symbol: 'kr', name: 'Danish Krone', zeroDecimal: false, country: 'Denmark' },
  { code: 'pln', symbol: 'zł', name: 'Polish Złoty', zeroDecimal: false, country: 'Poland' },
  { code: 'czk', symbol: 'Kč', name: 'Czech Koruna', zeroDecimal: false, country: 'Czech Republic' },
  { code: 'brl', symbol: 'R$', name: 'Brazilian Real', zeroDecimal: false, country: 'Brazil' },
  { code: 'mxn', symbol: '$', name: 'Mexican Peso', zeroDecimal: false, country: 'Mexico' },
  { code: 'zar', symbol: 'R', name: 'South African Rand', zeroDecimal: false, country: 'South Africa' },
  { code: 'ngn', symbol: '₦', name: 'Nigerian Naira', zeroDecimal: false, country: 'Nigeria' },
  { code: 'kes', symbol: 'KSh', name: 'Kenyan Shilling', zeroDecimal: false, country: 'Kenya' },
  { code: 'egp', symbol: 'E£', name: 'Egyptian Pound', zeroDecimal: false, country: 'Egypt' },
  { code: 'aed', symbol: 'د.إ', name: 'UAE Dirham', zeroDecimal: false, country: 'UAE' },
  { code: 'sar', symbol: '﷼', name: 'Saudi Riyal', zeroDecimal: false, country: 'Saudi Arabia' },
  { code: 'try', symbol: '₺', name: 'Turkish Lira', zeroDecimal: false, country: 'Turkey' },
  { code: 'rub', symbol: '₽', name: 'Russian Ruble', zeroDecimal: false, country: 'Russia' },
].sort((a, b) => a.country.localeCompare(b.country));

export const SERVICES_WITH_PACKAGES = {
  'Graphic Design': {
    basePrice: 3500,
    packages: {
      starter: { name: 'Starter Package', price: 3500, description: 'Perfect for one-off design needs', includes: ['1 graphic design asset', '1 revision', 'Web-ready files (PNG/JPG)'] },
      growth: { name: 'Growth Package', price: 17500, description: 'For ongoing design needs', includes: ['5 design assets', '2 revisions per design', 'Web-ready files', 'Source files included'] },
      premium: { name: 'Premium Package', price: 49900, description: 'Comprehensive design support', includes: ['10 design assets', 'Priority turnaround', 'Unlimited revisions', 'Source files', 'Brand style guide integration'] },
    }
  },
  'Video Editing & Motion Graphics': {
    basePrice: 7500,
    packages: {
      starter: { name: 'Starter Package', price: 7500, description: '1 short video edit', includes: ['1 short video edit (up to 60 seconds)', 'Basic cuts and transitions', 'Music and simple motion graphics', 'Export for social media'] },
      growth: { name: 'Growth Package', price: 22500, description: '3 edited videos', includes: ['3 edited videos', 'Basic animation elements', 'Music licensing', 'Social media optimized'] },
      premium: { name: 'Premium Package', price: 59900, description: '5+ videos with advanced motion graphics', includes: ['5+ edited videos', 'Advanced motion graphics', 'Custom branding elements', 'Priority turnaround', 'Multi-format delivery'] },
    }
  },
  'Copywriting & Content Creation': {
    basePrice: 7500,
    packages: {
      starter: { name: 'Starter Package', price: 7500, description: '1 piece of content', includes: ['1 piece of content', 'Up to 800 words', 'SEO-ready formatting'] },
      growth: { name: 'Growth Package', price: 22500, description: '3 content pieces', includes: ['3 content pieces', 'Up to 2,000 words total', 'SEO optimization', 'Keyword research included'] },
      premium: { name: 'Premium Package', price: 59900, description: '6+ pieces with strategy', includes: ['6+ pieces of content', 'SEO optimization and strategy', 'Content calendar', 'Performance tracking', 'Unlimited revisions'] },
    }
  },
  'Brand Identity & Logo Design': {
    basePrice: 19900,
    packages: {
      starter: { name: 'Starter Package', price: 19900, description: 'Essential brand identity', includes: ['1 custom logo concept', '1 revision round', 'Basic color palette', 'PNG + SVG files'] },
      growth: { name: 'Growth Package', price: 49900, description: 'Comprehensive brand identity', includes: ['3 logo concepts', '3 revisions', 'Typography selection', 'Brand guide', 'All file formats'] },
      premium: { name: 'Premium Package', price: 99900, description: 'Full brand identity system', includes: ['Full brand identity system', 'Complete brand guidelines', 'Stationery design', 'Social media kit', 'Priority support'] },
    }
  },
  'Photography & Visual Assets': {
    basePrice: 19900,
    packages: {
      starter: { name: 'Starter Package', price: 19900, description: '10 edited photos', includes: ['10 edited photos', '1 location', 'Basic retouching', 'Web and print ready'] },
      growth: { name: 'Growth Package', price: 49900, description: '25 edited photos', includes: ['25 edited photos', '1-2 locations', 'Advanced retouching', 'Full usage rights'] },
      premium: { name: 'Premium Package', price: 99900, description: 'Full branding photo shoot', includes: ['Full branding photo shoot', '50+ edited photos', 'Multiple locations', 'Team and product shots', 'Commercial license'] },
    }
  },
  'Website Development': {
    basePrice: 69900,
    packages: {
      starter: { name: 'Starter Package', price: 69900, description: 'Up to 3 pages', includes: ['Up to 3 website pages', 'Responsive design', 'Contact form', 'Basic SEO setup', 'Launch support'] },
      growth: { name: 'Growth Package', price: 149900, description: 'Up to 7 pages', includes: ['Up to 7 pages', 'Advanced layout', 'Custom integrations', 'Enhanced SEO', 'Analytics setup'] },
      premium: { name: 'Premium Package', price: 349900, description: '10+ pages with custom functionality', includes: ['10+ pages', 'Custom functionality', 'Advanced integrations', 'Priority support', 'Training included'] },
    }
  },
  'Landing Pages & Sales Funnels': {
    basePrice: 49900,
    packages: {
      starter: { name: 'Starter Package', price: 49900, description: 'Single landing page', includes: ['1 landing page', 'Contact form', 'Mobile optimization', 'Basic analytics', 'Launch support'] },
      growth: { name: 'Growth Package', price: 129900, description: '3-page funnel', includes: ['3-page funnel', 'Lead capture forms', 'Thank you pages', 'Email integration', 'Conversion tracking'] },
      premium: { name: 'Premium Package', price: 249900, description: 'Full conversion funnel', includes: ['Full conversion funnel', 'Upsell/downsell pages', 'Membership integration', 'Advanced analytics', 'A/B testing setup'] },
    }
  },
  'E-Commerce Development': {
    basePrice: 99900,
    packages: {
      starter: { name: 'Starter Package', price: 99900, description: 'Basic store setup', includes: ['Store setup', '10 product listings', 'Payment gateway', 'Shipping setup', 'Basic theme customization'] },
      growth: { name: 'Growth Package', price: 249900, description: '50 products', includes: ['50 products', 'Advanced theme customization', 'Product categories', 'Review system', 'Email marketing integration'] },
      premium: { name: 'Premium Package', price: 499900, description: 'Full store customization', includes: ['Full store customization', 'Unlimited products', 'Custom features', 'Inventory management', 'Analytics dashboard', 'Training included'] },
    }
  },
  'Web Applications & SaaS Development': {
    basePrice: 499900,
    packages: {
      starter: { name: 'Starter Package', price: 499900, description: 'MVP development', includes: ['1 custom feature/module', 'Database setup', 'User login system', 'Basic UI', 'Documentation'] },
      growth: { name: 'Growth Package', price: 1499900, description: 'Multiple modules', includes: ['Multiple modules', 'Advanced features', 'API integrations', 'Admin dashboard', 'Comprehensive testing'] },
      premium: { name: 'Premium Package', price: 2999900, description: 'Full SaaS MVP', includes: ['Full SaaS MVP', 'Multi-tenant architecture', 'Payment integration', 'Advanced security', 'Scalable infrastructure', 'Priority support'] },
    }
  },
  'API Integration & Automation': {
    basePrice: 49900,
    packages: {
      starter: { name: 'Starter Package', price: 49900, description: 'Basic integration', includes: ['1 system integration', 'Basic automation workflow', 'Documentation', 'Testing'] },
      growth: { name: 'Growth Package', price: 149900, description: 'Multiple integrations', includes: ['3 integrations', 'Advanced workflows', 'Error handling', 'Monitoring', 'Comprehensive docs'] },
      premium: { name: 'Premium Package', price: 399900, description: 'Full automation system', includes: ['Full automation system', 'Unlimited integrations', 'Custom workflows', 'Real-time sync', 'Priority support'] },
    }
  },
  'Website Maintenance & Updates': {
    basePrice: 14900,
    packages: {
      starter: { name: 'Starter Package', price: 14900, description: 'Basic maintenance', includes: ['Up to 2 hours monthly updates', 'Security checks', 'Minor fixes', 'Monthly backup', 'Email support'] },
      growth: { name: 'Growth Package', price: 34900, description: 'Comprehensive maintenance', includes: ['5 hours support', 'Weekly backups', 'Security monitoring', 'Performance optimization', 'Priority support'] },
      premium: { name: 'Premium Package', price: 89900, description: 'Full support', includes: ['Full support', 'Unlimited updates', '24/7 monitoring', 'Emergency fixes', 'Monthly strategy call', 'Dedicated specialist'] },
    }
  },
  'Social Media Management': {
    basePrice: 29900,
    packages: {
      starter: { name: 'Starter Package', price: 29900, description: 'Essential social media', includes: ['8 posts per month', 'Content scheduling', 'Basic engagement monitoring', 'Monthly report'] },
      growth: { name: 'Growth Package', price: 59900, description: 'Comprehensive management', includes: ['15 posts per month', 'Content strategy', 'Analytics report', 'Community engagement', 'Hashtag strategy'] },
      premium: { name: 'Premium Package', price: 149900, description: 'Full social media management', includes: ['30 posts per month', 'Full management', 'Ad campaign coordination', 'Influencer outreach', 'Strategy calls', 'Dedicated manager'] },
    }
  },
  'SEO & Search Marketing': {
    basePrice: 39900,
    packages: {
      starter: { name: 'Starter Package', price: 39900, description: 'Basic SEO', includes: ['SEO audit', 'Optimization of 5 pages', 'Keyword research', 'Monthly report'] },
      growth: { name: 'Growth Package', price: 89900, description: 'Comprehensive SEO', includes: ['15 pages optimized', 'Technical SEO', 'Content recommendations', 'Link building', 'Bi-weekly reports'] },
      premium: { name: 'Premium Package', price: 199900, description: 'Full SEO campaign', includes: ['Full SEO campaign', 'Unlimited pages', 'Advanced technical SEO', 'Comprehensive link building', 'Weekly strategy calls', 'Dedicated SEO specialist'] },
    }
  },
  'Paid Advertising Management': {
    basePrice: 39900,
    packages: {
      starter: { name: 'Starter Package', price: 39900, description: 'Single campaign', includes: ['1 ad campaign', 'Audience targeting', 'Ad creative guidance', 'Monthly report', 'Basic optimization'] },
      growth: { name: 'Growth Package', price: 89900, description: 'Multiple campaigns', includes: ['3 campaigns', 'Advanced targeting', 'A/B testing', 'Bi-weekly reports', 'Regular optimization'] },
      premium: { name: 'Premium Package', price: 199900, description: 'Full ad management', includes: ['Full ad management', 'Multi-platform campaigns', 'Custom audiences', 'Weekly reports', 'Strategy calls', 'Dedicated specialist'] },
    }
  },
  'Email Marketing Campaigns': {
    basePrice: 19900,
    packages: {
      starter: { name: 'Starter Package', price: 19900, description: 'Single campaign', includes: ['1 email campaign', 'Template design', 'List setup', 'Basic tracking', 'Performance report'] },
      growth: { name: 'Growth Package', price: 49900, description: 'Multiple campaigns', includes: ['3 campaigns', 'Custom templates', 'Segmentation', 'A/B testing', 'Comprehensive analytics'] },
      premium: { name: 'Premium Package', price: 99900, description: 'Full automation', includes: ['Full automation setup', 'Welcome sequences', 'Abandoned cart flows', 'Re-engagement campaigns', 'Advanced analytics', 'Strategy consultation'] },
    }
  },
  'Lead Generation Services': {
    basePrice: 19900,
    packages: {
      starter: { name: 'Starter Package', price: 19900, description: 'Basic lead generation', includes: ['25 targeted leads', 'Basic qualification', 'Contact information', 'CSV export'] },
      growth: { name: 'Growth Package', price: 59900, description: 'Comprehensive lead gen', includes: ['100 leads', 'Advanced qualification', 'Enriched data', 'Outreach templates', 'CRM integration'] },
      premium: { name: 'Premium Package', price: 149900, description: 'Ongoing pipeline', includes: ['Ongoing pipeline', 'Monthly lead updates', 'Full qualification', 'Outreach support', 'Strategy calls', 'Dedicated specialist'] },
    }
  },
  'CRM & Marketing Automation': {
    basePrice: 49900,
    packages: {
      starter: { name: 'Starter Package', price: 49900, description: 'CRM setup', includes: ['CRM setup', 'Basic automation', 'Lead capture forms', 'Integration setup', 'Documentation'] },
      growth: { name: 'Growth Package', price: 149900, description: 'Full CRM + automation', includes: ['Full CRM customization', 'Email automation', 'Lead scoring', 'Pipeline management', 'Analytics dashboard'] },
      premium: { name: 'Premium Package', price: 299900, description: 'Complete automation system', includes: ['Complete marketing automation', 'Multi-channel sequences', 'Advanced lead scoring', 'Custom reporting', 'Strategy consultation', 'Priority support'] },
    }
  },
  'Virtual Assistant Services': {
    basePrice: 14900,
    packages: {
      starter: { name: 'Starter Package', price: 14900, description: '5 hours support', includes: ['5 hours support', 'Email management', 'Calendar scheduling', 'Basic administrative tasks', 'Weekly check-in'] },
      growth: { name: 'Growth Package', price: 39900, description: '15 hours support', includes: ['15 hours support', 'Full administrative support', 'Task coordination', 'Customer support', 'Bi-weekly planning'] },
      premium: { name: 'Premium Package', price: 99900, description: '40 hours support', includes: ['40 hours support', 'Dedicated assistant', 'Full operations support', 'Project coordination', 'Weekly strategy calls'] },
    }
  },
  'Data Analytics & Reporting': {
    basePrice: 19900,
    packages: {
      starter: { name: 'Starter Package', price: 19900, description: 'Single report', includes: ['1 performance report', 'Data visualization charts', 'Summary insights', 'PDF/Excel delivery'] },
      growth: { name: 'Growth Package', price: 69900, description: 'Multiple reports + dashboard', includes: ['3 custom reports', 'Dashboard setup', 'Monthly updates', 'Strategy recommendations', 'Consultation call'] },
      premium: { name: 'Premium Package', price: 199900, description: 'Full analytics dashboard', includes: ['Full analytics dashboard', 'Automated reporting', 'Real-time data', 'Custom KPIs', 'Weekly insights', 'Dedicated analyst'] },
    }
  },
  'Process Documentation & SOP Development': {
    basePrice: 40000,
    packages: {
      starter: { name: 'Starter Package', price: 40000, description: 'Single process documentation', includes: ['1 business process documented', 'Written step-by-step SOP', 'Workflow diagram', 'PDF/Word format'] },
      growth: { name: 'Growth Package', price: 120000, description: 'Multiple processes', includes: ['3 documented workflows', 'SOP manual', 'Process maps', 'Training materials', 'Editable templates'] },
      premium: { name: 'Premium Package', price: 350000, description: 'Full operations documentation', includes: ['Full operational process documentation', 'Company operations handbook', 'Process library', 'Training program', 'Video tutorials', 'Quarterly updates'] },
    }
  },
  'Project Management Support': {
    basePrice: 49900,
    packages: {
      starter: { name: 'Starter Package', price: 49900, description: 'Small project management', includes: ['Management of 1 small project', 'Timeline planning', 'Progress tracking', 'Weekly updates', 'Final report'] },
      growth: { name: 'Growth Package', price: 149900, description: 'Multi-project coordination', includes: ['Multi-project coordination', 'Resource management', 'Risk assessment', 'Team communication', 'Bi-weekly reports'] },
      premium: { name: 'Premium Package', price: 349900, description: 'Full project oversight', includes: ['Full project oversight', 'Dedicated project manager', 'Complete planning', 'Stakeholder management', 'Weekly strategy calls', 'Comprehensive reporting'] },
    }
  },
  'Data Entry & Processing': {
    basePrice: 9900,
    packages: {
      starter: { name: 'Starter Package', price: 9900, description: 'Basic data entry', includes: ['Basic data entry', '500 records', 'Data validation', 'Excel/CSV delivery'] },
      growth: { name: 'Growth Package', price: 29900, description: 'Advanced data processing', includes: ['Advanced data processing', '2000 records', 'Data cleansing', 'Formatting', 'Multiple formats'] },
      premium: { name: 'Premium Package', price: 79900, description: 'Full database management', includes: ['Full database management', 'Unlimited records', 'Ongoing updates', 'Data enrichment', 'CRM integration', 'Monthly maintenance'] },
    }
  },
  'Request Custom Quote - Creative & Content': {
    basePrice: 0,
    packages: {
      custom: { name: 'Custom Quote', price: 0, description: 'Tell us about your specific Creative & Content needs', includes: ['Personalized consultation', 'Custom scope definition', 'Strategic solution design', 'Flexible project scaling'] }
    }
  },
  'Request Custom Quote - Tech & Development': {
    basePrice: 0,
    packages: {
      custom: { name: 'Custom Quote', price: 0, description: 'Tell us about your specific Tech & Development needs', includes: ['Personalized consultation', 'Custom scope definition', 'Strategic solution design', 'Flexible project scaling'] }
    }
  },
  'Request Custom Quote - Marketing & Growth': {
    basePrice: 0,
    packages: {
      custom: { name: 'Custom Quote', price: 0, description: 'Tell us about your specific Marketing & Growth needs', includes: ['Personalized consultation', 'Custom scope definition', 'Strategic solution design', 'Flexible project scaling'] }
    }
  },
  'Request Custom Quote - Operations & Support': {
    basePrice: 0,
    packages: {
      custom: { name: 'Custom Quote', price: 0, description: 'Tell us about your specific Operations & Support needs', includes: ['Personalized consultation', 'Custom scope definition', 'Strategic solution design', 'Flexible project scaling'] }
    }
  }
};

export const SERVICE_CATEGORIES = {
  'creative-content': { label: 'Creative & Content', services: ['Graphic Design', 'Video Editing & Motion Graphics', 'Copywriting & Content Creation', 'Brand Identity & Logo Design', 'Photography & Visual Assets', 'Request Custom Quote - Creative & Content'] },
  'tech-development': { label: 'Tech & Development', services: ['Website Development', 'Landing Pages & Sales Funnels', 'E-Commerce Development', 'Web Applications & SaaS Development', 'API Integration & Automation', 'Website Maintenance & Updates', 'Request Custom Quote - Tech & Development'] },
  'marketing-growth': { label: 'Marketing & Growth', services: ['Social Media Management', 'SEO & Search Marketing', 'Paid Advertising Management', 'Email Marketing Campaigns', 'Lead Generation Services', 'CRM & Marketing Automation', 'Request Custom Quote - Marketing & Growth'] },
  'operations-support': { label: 'Operations & Support', services: ['Virtual Assistant Services', 'Data Analytics & Reporting', 'Process Documentation & SOP Development', 'Project Management Support', 'Data Entry & Processing', 'Request Custom Quote - Operations & Support'] },
};

export const BUDGET_RANGES = [
  '$1,500 - $3,000',
  '$3,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000+',
  'Hourly/Monthly Retainer'
];
