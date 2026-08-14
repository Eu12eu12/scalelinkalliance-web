// src/utils/formConstants.js

export const COUNTRIES = [
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'ES', name: 'Spain', dialCode: '+34' },
  { code: 'IT', name: 'Italy', dialCode: '+39' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31' },
  { code: 'BE', name: 'Belgium', dialCode: '+32' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41' },
  { code: 'SE', name: 'Sweden', dialCode: '+46' },
  { code: 'NO', name: 'Norway', dialCode: '+47' },
  { code: 'DK', name: 'Denmark', dialCode: '+45' },
  { code: 'FI', name: 'Finland', dialCode: '+358' },
  { code: 'IE', name: 'Ireland', dialCode: '+353' },
  { code: 'PT', name: 'Portugal', dialCode: '+351' },
  { code: 'AT', name: 'Austria', dialCode: '+43' },
  { code: 'PL', name: 'Poland', dialCode: '+48' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420' },
  { code: 'HU', name: 'Hungary', dialCode: '+36' },
  { code: 'GR', name: 'Greece', dialCode: '+30' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'CN', name: 'China', dialCode: '+86' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'BR', name: 'Brazil', dialCode: '+55' },
  { code: 'MX', name: 'Mexico', dialCode: '+52' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234' },
  { code: 'KE', name: 'Kenya', dialCode: '+254' },
  { code: 'EG', name: 'Egypt', dialCode: '+20' },
  { code: 'AE', name: 'UAE', dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
  { code: 'SG', name: 'Singapore', dialCode: '+65' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60' },
  { code: 'PH', name: 'Philippines', dialCode: '+63' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64' },
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
      'Copywriting & Content Creation',
      'Graphic Design',
      'Brand Identity & Logo Design',
      'Video Editing & Motion Graphics',
      'Request Custom Quote - Content & Branding'
    ]
  },
  'tech-development': {
    id: 'tech-development',
    label: 'Website & Web App Development',
    services: [
      'Website Development',
      'Web Applications & SaaS Development',
      'E-Commerce Development',
      'Landing Pages & Sales Funnels',
      'Online Booking Systems',
      'Request Custom Quote - Tech & Development'
    ]
  },
  'marketing-growth': {
    id: 'marketing-growth',
    label: 'Website Growth & Marketing',
    services: [
      'SEO & Search Marketing',
      'Lead Generation Services',
      'Paid Advertising Management',
      'Email Marketing Campaigns',
      'Reputation & Review Management',
      'Social Media Management',
      'Request Custom Quote - Marketing & Growth'
    ]
  },
  'automation-crm': {
    id: 'automation-crm',
    label: 'Automation, CRM & AI Systems',
    services: [
      'AI Automation & Smart Business Systems',
      'CRM Setup & Marketing Automation',
      'API Integration',
      'Business Process Automation',
      'Data Analytics & Reports',
      'Request Custom Quote - AI'
    ]
  },
  'operations-support': {
    id: 'operations-support',
    label: 'Business Strategy & Support',
    services: [
      'Business Consulting & Growth Strategy',
      'Virtual Assistant Services',
      'Project Management Support',
      'Data Entry & Processing',
      'Request Custom Quote - Business Support'
    ]
  }
};

// ─── SERVICE PACKAGES WITH AMENDED PRICES ───
export const SERVICES_WITH_PACKAGES = {
  // ─── Content, Branding & Creative ───
  'Copywriting & Content Creation': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 7500, // $75
        description: 'Ideal for small content needs or single-page messaging.',
        includes: [
          '1 content piece up to 800 words',
          'Basic keyword research (if needed)',
          'Formatting for web readability',
          '1 revision round'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 22500, // $225
        description: 'Ideal for businesses producing regular content.',
        includes: [
          '3 content pieces up to 1,000 words each',
          'Content structure and messaging optimization',
          'SEO-friendly formatting',
          '2 revision rounds'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 59900, // $599
        description: 'Ideal for businesses running content marketing campaigns.',
        includes: [
          '6 content pieces up to 1,200 words each',
          'Deeper keyword research and SEO optimization',
          'Brand voice alignment',
          'Content strategy recommendations',
          '2-3 revision rounds'
        ]
      }
    }
  },
  'Graphic Design': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 3500, // $35 - AMENDED
        description: 'Ideal for small design requests or single marketing assets.',
        includes: [
          '1 graphic design asset',
          'Basic design layout',
          'Web-ready file format',
          '1 revision round'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 17500, // $175 - AMENDED
        description: 'Ideal for businesses producing multiple marketing materials.',
        includes: [
          'Up to 5 graphic design assets',
          'Design variations or layouts',
          'Web-ready file formats',
          '2 revision rounds'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 49900, // $499 - AMENDED
        description: 'Ideal for businesses running active marketing campaigns.',
        includes: [
          'Up to 10 graphic design assets',
          'Consistent brand styling',
          'Multiple design formats',
          'Priority revisions and updates'
        ]
      }
    }
  },
  'Brand Identity & Logo Design': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 19900, // $199
        description: 'Ideal for small businesses launching a brand or refreshing their logo.',
        includes: [
          '1 custom logo concept',
          'Basic color palette selection',
          '1 revision round',
          'Logo files delivered in PNG and SVG formats'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 49900, // $499
        description: 'Ideal for businesses that want a more developed brand identity.',
        includes: [
          '3 logo design concepts',
          '2 revision rounds',
          'Brand color palette',
          'Typography selection',
          'Logo files in multiple formats (PNG, SVG, PDF)'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 99900, // $999
        description: 'Ideal for companies building a full professional brand identity.',
        includes: [
          '3-4 logo concepts',
          'Multiple revision rounds',
          'Brand color palette and typography',
          'Brand style guide',
          'Logo usage guidelines',
          'Complete brand identity package'
        ]
      }
    }
  },
  'Video Editing & Motion Graphics': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 7500, // $75
        description: 'Ideal for small projects or social media videos.',
        includes: [
          'Editing of 1 video up to 60 seconds',
          'Basic cuts and transitions',
          'Background music',
          'Simple motion graphics or text overlays',
          'Export optimized for social media'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 22500, // $225
        description: 'Ideal for businesses creating regular marketing content.',
        includes: [
          'Editing of 3 videos up to 90 seconds each',
          'Branded intro/outro',
          'Motion graphics elements',
          'Text animations and transitions',
          'Color correction',
          'Export for social media and website use'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 59900, // $599
        description: 'Ideal for promotional campaigns or professional brand videos.',
        includes: [
          'Editing of 5 videos up to 2 minutes each',
          'Advanced motion graphics',
          'Animated titles and brand elements',
          'Color grading',
          'Sound optimization',
          'Multiple export formats for marketing platforms'
        ]
      }
    }
  },

  // ─── Website & Web App Development ───
  'Website Development': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 69900, // $699
        description: 'Ideal for small businesses launching their first website.',
        includes: [
          'Up to 3 website pages',
          'Responsive mobile-friendly design',
          'Contact form setup',
          'Basic SEO page structure',
          'Website deployment and launch support'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 149900, // $1,499
        description: 'Ideal for businesses expanding their online presence.',
        includes: [
          'Up to 7 website pages',
          'Responsive design',
          'Contact forms and lead capture',
          'Basic SEO optimization',
          'Integration of marketing tools'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 349900, // $3,499
        description: 'Ideal for businesses needing a full professional website.',
        includes: [
          'Up to 12 website pages',
          'Responsive and modern layout',
          'Advanced forms and integrations',
          'Blog or content management setup',
          'SEO-ready structure',
          'Launch and testing support'
        ]
      }
    }
  },
  'Web Applications & SaaS Development': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 499900, // $4,999
        description: 'Ideal for businesses needing a simple custom web tool or internal system.',
        includes: [
          '1 custom web application feature or module',
          'Basic user interface design',
          'Database setup',
          'User login and access control',
          'Basic functionality testing'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 1499900, // $14,999
        description: 'Ideal for businesses building more advanced digital systems.',
        includes: [
          'Multi-feature web application (up to 3 modules)',
          'User account system',
          'Database integration',
          'Workflow automation features',
          'Responsive interface design'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 2999900, // $29,999
        description: 'Ideal for businesses launching a SaaS platform or full digital product.',
        includes: [
          'Complete SaaS application structure',
          'Multiple user roles and permissions',
          'Scalable database architecture',
          'Dashboard and reporting features',
          'API integrations and automation',
          'Performance optimization and testing'
        ]
      }
    }
  },
  'E-Commerce Development': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 99900, // $999
        description: 'Ideal for small businesses launching their first online store.',
        includes: [
          'Store setup with up to 10 products',
          'Product page design',
          'Payment gateway integration',
          'Basic shipping setup',
          'Mobile-responsive layout'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 249900, // $2,499
        description: 'Ideal for businesses expanding their product catalog.',
        includes: [
          'Store setup with up to 50 products',
          'Product categories and navigation',
          'Payment and shipping integrations',
          'Customer account setup',
          'Basic SEO product structure'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 499900, // $4,999
        description: 'Ideal for businesses building a fully developed online store.',
        includes: [
          'Store setup with up to 100 products',
          'Advanced store design',
          'Multiple payment gateways',
          'Shipping automation',
          'Product filtering and search features',
          'Performance optimization'
        ]
      }
    }
  },
  'Landing Pages & Sales Funnels': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 49900, // $499 - AMENDED
        description: 'Ideal for businesses launching a simple marketing campaign.',
        includes: [
          '1 landing page design',
          'Lead capture form integration',
          'Mobile-responsive layout',
          'Basic analytics setup',
          'Call-to-action optimization'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 129900, // $1,299 - AMENDED
        description: 'Ideal for businesses running structured marketing campaigns.',
        includes: [
          '3-page sales funnel',
          'Landing page + follow-up pages',
          'Lead capture forms',
          'Conversion-focused design',
          'Analytics integration'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 249900, // $2,499 - AMENDED
        description: 'Ideal for businesses running full digital marketing funnels.',
        includes: [
          'Complete sales funnel (5 pages)',
          'Multiple landing pages',
          'Advanced form integrations',
          'Email marketing integration',
          'Conversion optimization setup'
        ]
      }
    }
  },
  'Online Booking Systems': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 39900, // $399 - AMENDED (not in original doc, estimated from API Integration)
        description: 'Ideal for businesses needing a simple booking system.',
        includes: [
          'Online booking system setup',
          'Calendar integration',
          'Email notifications',
          'Mobile-friendly booking form',
          'Basic customization'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 99900, // $999 - AMENDED (estimated)
        description: 'Ideal for businesses with multiple services or staff.',
        includes: [
          'Advanced booking system',
          'Multiple service/slot configurations',
          'Automated reminders',
          'Payment integration',
          'Customizable booking form'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 199900, // $1,999 - AMENDED (estimated)
        description: 'Ideal for businesses needing full booking automation.',
        includes: [
          'Full booking automation system',
          'Multi-location support',
          'Advanced notifications',
          'CRM integration',
          'Reporting and analytics'
        ]
      }
    }
  },

  // ─── Website Growth & Marketing ───
  'SEO & Search Marketing': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 39900, // $399/month
        description: 'Ideal for small businesses beginning their SEO strategy.',
        includes: [
          'SEO audit of website',
          'Keyword research',
          'Optimization of up to 5 website pages',
          'Meta titles and descriptions',
          'Basic search performance tracking'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 89900, // $899/month
        description: 'Ideal for businesses actively working to improve search rankings.',
        includes: [
          'Keyword research and strategy',
          'Optimization of up to 15 website pages',
          'Content optimization recommendations',
          'Technical SEO improvements',
          'Monthly performance report'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 199900, // $1,999/month
        description: 'Ideal for businesses seeking aggressive search growth.',
        includes: [
          'Advanced keyword strategy',
          'Optimization of 30+ website pages',
          'Content strategy and recommendations',
          'Technical SEO improvements',
          'Backlink development guidance',
          'Monthly performance reporting and insights'
        ]
      }
    }
  },
  'Lead Generation Services': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 19900, // $199
        description: 'Ideal for businesses building their initial lead pipeline.',
        includes: [
          '25 targeted leads',
          'Basic qualification',
          'Contact information',
          'CSV export'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 59900, // $599
        description: 'Ideal for businesses scaling their sales efforts.',
        includes: [
          '100 leads',
          'Advanced qualification',
          'Enriched data',
          'Outreach templates',
          'CRM integration support'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 149900, // $1,499/month - AMENDED
        description: 'Ideal for businesses needing ongoing lead flow.',
        includes: [
          '220 leads',
          'Monthly lead updates',
          'Full qualification',
          'Outreach support',
          'Strategy consultation'
        ]
      }
    }
  },
  'Paid Advertising Management': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 39900, // $399/month
        description: 'Ideal for businesses launching their first ad campaigns.',
        includes: [
          '1 ad campaign',
          'Audience targeting',
          'Ad creative guidance',
          'Monthly report',
          'Basic optimization'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 89900, // $899/month
        description: 'Ideal for businesses running multiple campaigns.',
        includes: [
          '3 campaigns',
          'Advanced targeting',
          'A/B testing',
          'Bi-weekly reports',
          'Regular optimization'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 199900, // $1,999/month
        description: 'Ideal for businesses requiring full ad management.',
        includes: [
          'Full ad management',
          '10 campaigns',
          'Multi-platform campaigns',
          'Custom audiences',
          'Weekly reports',
          'Dedicated specialist'
        ]
      }
    }
  },
  'Email Marketing Campaigns': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 19900, // $199
        description: 'Ideal for businesses launching a simple email campaign.',
        includes: [
          '1 email campaign',
          'Email template design',
          'Content formatting',
          'Mailing list integration',
          'Campaign scheduling'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 49900, // $499
        description: 'Ideal for businesses running regular email communication.',
        includes: [
          '3 email campaigns',
          'Email template customization',
          'Campaign scheduling and delivery',
          'Basic audience segmentation',
          'Performance tracking summary'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 99900, // $999
        description: 'Ideal for businesses running structured email marketing programs.',
        includes: [
          '6 email campaigns',
          'Custom email templates',
          'Audience segmentation',
          'Performance analysis and reporting',
          'Campaign strategy recommendations'
        ]
      }
    }
  },
  'Reputation & Review Management': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 19900, // $199 - AMENDED (estimated)
        description: 'Ideal for businesses starting to collect reviews.',
        includes: [
          'Review collection system setup',
          'Review monitoring',
          'Basic response templates',
          'Monthly review summary report'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 49900, // $499 - AMENDED (estimated)
        description: 'Ideal for businesses actively managing reviews.',
        includes: [
          'Advanced review collection',
          'Multi-platform monitoring',
          'Custom response management',
          'Quarterly review analysis',
          'Reputation improvement recommendations'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 99900, // $999 - AMENDED (estimated)
        description: 'Ideal for businesses prioritizing reputation management.',
        includes: [
          'Full review management system',
          'Automated review requests',
          'Crisis response support',
          'Monthly detailed reporting',
          'Strategic reputation standard plan'
        ]
      }
    }
  },
  'Social Media Management': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 29900, // $299/month
        description: 'Ideal for small businesses maintaining a basic social media presence.',
        includes: [
          '8 social media posts per month',
          'Content scheduling',
          'Basic caption writing',
          'Engagement monitoring',
          'Performance overview'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 59900, // $599/month
        description: 'Ideal for businesses expanding their social media activity.',
        includes: [
          '15 social media posts per month',
          'Graphic content creation',
          'Caption writing and hashtags',
          'Audience engagement monitoring',
          'Monthly performance report'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 149900, // $1,499/month
        description: 'Ideal for businesses using social media as a primary marketing channel.',
        includes: [
          '30 social media posts per month',
          'Custom graphics and visuals',
          'Caption writing and strategy',
          'Engagement management',
          'Detailed performance reporting'
        ]
      }
    }
  },

  // ─── Automation, CRM & AI Systems ───
  'AI Automation & Smart Business Systems': {
    packages: {
      custom: {
        name: 'Custom Quote Only',
        price: 0,
        description: 'Every AI automation project is custom quoted based on your workflow, tools, and goals.',
        includes: [
          'Discovery conversation about your current process',
          'Recommended automation approach based on your tools',
          'Transparent custom pricing before work begins',
          'Clear scope of what the automation will and will not do'
        ]
      }
    }
  },
  'CRM Setup & Marketing Automation': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 49900, // $499
        description: 'Ideal for businesses implementing their first CRM.',
        includes: [
          'CRM setup',
          'Basic automation',
          'Lead capture forms',
          'Integration setup',
          'Documentation'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 149900, // $1,499
        description: 'Ideal for businesses scaling their automation.',
        includes: [
          'Full CRM customization',
          'Email automation',
          'Lead scoring',
          'Pipeline management',
          'Analytics dashboard'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 299900, // $2,999
        description: 'Ideal for comprehensive marketing automation.',
        includes: [
          'Complete marketing automation',
          'Multi-channel sequences',
          'Advanced lead scoring',
          'Custom reporting',
          'Strategy consultation',
          'Priority support'
        ]
      }
    }
  },
  'API Integration': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 49900, // $499
        description: 'Ideal for businesses connecting two systems for the first time.',
        includes: [
          '1 system integration',
          'Basic data synchronization',
          'Simple workflow automation',
          'Testing and configuration'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 149900, // $1,499
        description: 'Ideal for businesses connecting multiple tools.',
        includes: [
          'Up to 3 system integrations',
          'Workflow automation setup',
          'Data synchronization between platforms',
          'Automation testing and optimization'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 399900, // $3,999 (Custom Quote)
        description: 'Ideal for businesses implementing full automation systems.',
        includes: [
          'Multiple system integrations',
          'Advanced workflow automation',
          'API configuration and data mapping',
          'Automation testing and optimization',
          'Documentation of automated workflows'
        ]
      }
    }
  },
  'Business Process Automation': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 29900, // $299 - AMENDED (estimated)
        description: 'Ideal for automating a single business process.',
        includes: [
          '1 automated workflow',
          'Process mapping',
          'Automation setup',
          'Testing and documentation'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 99900, // $999 - AMENDED (estimated)
        description: 'Ideal for automating multiple business processes.',
        includes: [
          '3 automated workflows',
          'Process mapping and optimization',
          'Integration setup',
          'Testing and documentation',
          'Training support'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 249900, // $2,499 - AMENDED (estimated)
        description: 'Ideal for full business process automation.',
        includes: [
          '5+ automated workflows',
          'Full process optimization',
          'Multi-system integration',
          'Comprehensive documentation',
          'Team training and ongoing support'
        ]
      }
    }
  },
  'Data Analytics & Reports': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 19900, // $199
        description: 'Ideal for businesses needing basic performance insights.',
        includes: [
          '1 custom data report',
          'Basic data analysis',
          'Visual charts or graphs',
          'Summary of key insights'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 69900, // $699/month
        description: 'Ideal for businesses tracking multiple performance areas.',
        includes: [
          '3 custom reports',
          'Visual dashboards or charts',
          'Trend analysis',
          'Summary recommendations'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 199900, // $1,999/month
        description: 'Ideal for businesses seeking ongoing performance monitoring.',
        includes: [
          'Custom analytics dashboard',
          '7 custom data reports',
          'Visual performance charts',
          'Detailed trend analysis',
          'Strategic insight summary'
        ]
      }
    }
  },

  // ─── Business Strategy & Support ───
  'Business Consulting & Growth Strategy': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 49900, // $499 - AMENDED (estimated)
        description: 'Ideal for businesses needing a standard plan.',
        includes: [
          '1 strategy session (60 min)',
          'Business assessment',
          'Growth recommendations',
          'Action plan document'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 149900, // $1,499 - AMENDED (estimated)
        description: 'Ideal for businesses needing ongoing strategy support.',
        includes: [
          '3 strategy sessions (60 min each)',
          'Growth strategy development',
          'Implementation roadmap',
          'Monthly progress reviews',
          'Strategy adjustments'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 499900, // $4,999 - AMENDED (estimated)
        description: 'Ideal for businesses needing comprehensive strategic guidance.',
        includes: [
          '6 strategy sessions (90 min each)',
          'Full business assessment',
          'Detailed growth roadmap',
          'Quarterly strategy reviews',
          'Team support and implementation guidance',
          'Priority access for consulting support'
        ]
      }
    }
  },
  'Virtual Assistant Services': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 14900, // $149/month
        description: 'Ideal for businesses needing light administrative support.',
        includes: [
          'Up to 5 hours of virtual assistant support per month',
          'Email and calendar organization',
          'Basic administrative tasks',
          'Task tracking and reporting'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 39900, // $399/month
        description: 'Ideal for businesses needing regular operational assistance.',
        includes: [
          'Up to 15 hours of virtual assistant support per month',
          'Administrative and scheduling support',
          'Basic customer communication assistance',
          'Document organization and data entry'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 99900, // $999/month
        description: 'Ideal for businesses requiring consistent operational support.',
        includes: [
          'Up to 40 hours of virtual assistant support per month',
          'Administrative task management',
          'Coordination of communications and scheduling',
          'Task monitoring and reporting'
        ]
      }
    }
  },
  'Project Management Support': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 49900, // $499
        description: 'Ideal for managing a small project or short-term initiative.',
        includes: [
          'Management of 1 project',
          'Project planning and timeline development',
          'Task coordination',
          'Progress tracking and status updates'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 149900, // $1,499
        description: 'Ideal for businesses managing multiple tasks within a project.',
        includes: [
          'Management of up to 3 project phases or workstreams',
          'Project planning and scheduling',
          'Task and milestone tracking',
          'Team coordination and communication'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 349900, // $3,499/month
        description: 'Ideal for businesses requiring full project oversight.',
        includes: [
          'Comprehensive project management support',
          'Project planning and scheduling',
          'Team coordination across departments',
          'Progress tracking and milestone reporting',
          'Project performance review'
        ]
      }
    }
  },
  'Data Entry & Processing': {
    packages: {
      starter: {
        name: 'Starter Package',
        price: 9900, // $99
        description: 'Ideal for small administrative data tasks.',
        includes: [
          'Up to 200 records entered or updated',
          'Spreadsheet or database entry',
          'Basic data formatting',
          'Accuracy verification'
        ]
      },
      growth: {
        name: 'Standard Package',
        price: 29900, // $299
        description: 'Ideal for businesses managing larger datasets.',
        includes: [
          'Up to 800 records entered or updated',
          'Spreadsheet or database management',
          'Data formatting and organization',
          'Accuracy verification and review'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: 79900, // $799/month
        description: 'Ideal for businesses processing large volumes of information.',
        includes: [
          'Up to 2,000 records entered or updated',
          'Structured data organization',
          'Formatting and data cleanup',
          'Verification and quality checks'
        ]
      }
    }
  },

  // ─── CUSTOM QUOTE SERVICES ───
  'Request Custom Quote - Content & Branding': {
    packages: {
      custom: {
        name: 'Custom Quote',
        price: 0,
        description: 'Get a tailored quote for your specific content, branding, or creative needs.',
        includes: [
          'Personalized consultation to understand your unique needs',
          'Custom scope definition based on your specific requirements',
          'Tailored solution designed around your brand and goals',
          'Flexible pricing based on project complexity and timeline',
          'Dedicated support throughout the project lifecycle'
        ]
      }
    }
  },
  'Request Custom Quote - Tech & Development': {
    packages: {
      custom: {
        name: 'Custom Quote',
        price: 0,
        description: 'Get a tailored quote for your website, app, or development project.',
        includes: [
          'In-depth discovery session to assess your technical needs',
          'Custom solution architecture and technology recommendations',
          'Detailed scope of work and project timeline',
          'Transparent pricing based on project complexity',
          'Ongoing technical consultation and support'
        ]
      }
    }
  },
  'Request Custom Quote - Marketing & Growth': {
    packages: {
      custom: {
        name: 'Custom Quote',
        price: 0,
        description: 'Get a tailored quote for your marketing and growth initiatives.',
        includes: [
          'Strategic marketing consultation to identify growth opportunities',
          'Custom campaign planning and channel selection',
          'Integrated marketing solution designed for your audience',
          'Flexible pricing based on campaign scope and duration',
          'Performance tracking and optimization strategy'
        ]
      }
    }
  },
  'Request Custom Quote - AI': {
    packages: {
      custom: {
        name: 'Custom Quote',
        price: 0,
        description: 'Get a tailored quote for your AI automation, AI-powered tools, or intelligent business systems project.',
        includes: [
          'Discovery conversation about your AI use case and goals',
          'Recommended AI approach based on your tools and data',
          'Transparent custom pricing before work begins',
          'Clear scope of what the AI solution will and will not do'
        ]
      }
    }
  },
  'Request Custom Quote - Business Support': {
    packages: {
      custom: {
        name: 'Custom Quote',
        price: 0,
        description: 'Get a tailored quote for your business support and operations needs.',
        includes: [
          'Business assessment to identify operational gaps',
          'Custom support solution designed for your business',
          'Flexible engagement models (project-based or ongoing)',
          'Transparent pricing based on scope and support level',
          'Dedicated account management and quality assurance'
        ]
      }
    }
  }
};

// ─── Helper: Get service icon name ───
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