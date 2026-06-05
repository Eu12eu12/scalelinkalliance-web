// src/pages/Services/ServiceDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaPaintBrush, FaVideo, FaPenNib, FaCogs, FaChartBar, FaDatabase,
  FaUsers, FaCheck, FaArrowRight, FaRocket, FaFileAlt, FaCode,
  FaGlobe, FaShoppingCart, FaAd, FaEnvelope, FaSearch, FaHeadset,
  FaProjectDiagram, FaCamera, FaPalette, FaCloudUploadAlt, FaShieldAlt,
  FaRegBuilding, FaChartLine, FaTools, FaStar, FaClock, FaDollarSign
} from 'react-icons/fa';

// Complete service database from the uploaded file
const SERVICES_DATA = {
  // Creative & Content Services
  'graphic-design': {
    title: 'Graphic Design Services',
    category: 'Creative & Content',
    icon: <FaPaintBrush />,
    intro: 'Strong visual design helps businesses communicate clearly, attract attention, and create a professional brand presence.',
    description: 'Whether for marketing materials, social media content, or digital advertising, effective design plays an essential role in how businesses present themselves to their audience.',
    longDescription: 'Scale Link Alliance provides graphic design services that help businesses create visually compelling materials that support branding, marketing campaigns, and promotional efforts.',

    whatItHelpsAchieve: [
      'create professional marketing materials',
      'strengthen brand recognition',
      'improve the visual impact of marketing campaigns',
      'communicate ideas clearly through visuals',
      'build a consistent brand image across platforms',
      'design that attract more customers and increases conversions'
    ],

    howMeasured: [
      'number of design assets created',
      'number of revisions required',
      'complexity of design elements',
      'number of formats delivered'
    ],

    servicesInclude: [
      'Social media graphics',
      'Marketing flyers and posters',
      'Business cards and stationery',
      'Presentation and report visuals',
      'Advertising graphics and banners'
    ],

    tools: [
      'Adobe Creative Suite',
      'Figma',
      'Canva',
      'Procreate',
      'Sketch'
    ],

    addOnOptions: [
      'brand identity design',
      'social media design templates',
      'infographic design',
      'presentation design',
      'marketing material design packages'
    ],

    complementaryServices: [
      { name: 'Brand Identity & Logo Design', reason: 'consistent branding' },
      { name: 'Copywriting & Content Creation', reason: 'marketing messaging' },
      { name: 'Social Media Management', reason: 'content publishing' },
      { name: 'Website Development', reason: 'digital presence' },
      { name: 'Video Editing & Motion Graphics', reason: 'visual marketing content' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$150',
        description: 'Ideal for small design requests or single marketing assets.',
        includes: [
          '1 graphic design asset',
          'basic design layout',
          'web-ready file format',
          '1 revision round'
        ],
        examples: ['social media graphic', 'flyer or poster', 'digital advertisement', 'presentation slide', 'banner graphic']
      },
      growth: {
        name: 'Growth Package',
        price: '$400',
        description: 'Ideal for businesses producing multiple marketing materials.',
        includes: [
          'up to 5 graphic design assets',
          'design variations or layouts',
          'web-ready file formats',
          '2 revision rounds'
        ],
        examples: ['social media post set', 'marketing flyers', 'promotional banners', 'presentation graphics']
      },
      premium: {
        name: 'Premium Package',
        price: '$800',
        description: 'Ideal for businesses running active marketing campaigns.',
        includes: [
          'up to 10 graphic design assets',
          'consistent brand styling',
          'multiple design formats',
          'priority revisions and updates'
        ],
        examples: ['social media campaigns', 'promotional marketing sets', 'advertising graphics']
      }
    }
  },

  'video-editing': {
    title: 'Video Editing & Motion Graphics',
    category: 'Creative & Content',
    icon: <FaVideo />,
    intro: 'Video content is one of the most powerful ways to capture attention and engage audiences.',
    description: 'Our video editing and motion graphics services transform raw footage into polished visual stories that communicate your message and promote your business effectively.',
    longDescription: 'Video content is one of the most powerful ways to capture attention and engage audiences. Our video editing and motion graphics services transform raw footage into polished visual stories that communicate your message and promote your business effectively.',

    whatItHelpsAchieve: [
      'social media marketing',
      'promotional videos',
      'product demonstrations',
      'business presentations',
      'online advertising',
      'website video content'
    ],

    howMeasured: [
      'number of videos',
      'video length',
      'motion graphics complexity',
      'number of revisions'
    ],

    servicesInclude: [
      'Promotional videos',
      'Social media video edits',
      'Motion graphics and animations',
      'Video branding elements',
      'Short-form marketing videos'
    ],

    tools: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro'],

    addOnOptions: [
      'subtitles and captions',
      'YouTube optimization',
      'animated logo intros',
      'promotional video scripting',
      'thumbnail graphics'
    ],

    complementaryServices: [
      { name: 'Graphic Design', reason: 'thumbnails, social media visuals' },
      { name: 'Copywriting & Content Creation', reason: 'video scripts' },
      { name: 'Social Media Management', reason: 'posting and engagement' },
      { name: 'Paid Advertising Management', reason: 'video ads' },
      { name: 'Landing Page Development', reason: 'conversion pages for campaigns' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$500',
        description: 'Ideal for small projects or social media videos.',
        includes: [
          'editing of 1 video up to 60 seconds',
          'basic cuts and transitions',
          'background music',
          'simple motion graphics or text overlays',
          'export optimized for social media'
        ]
      },
      growth: {
        name: 'Growth Package',
        price: '$900',
        description: 'Ideal for businesses creating regular marketing content.',
        includes: [
          'editing of 3 videos up to 90 seconds each',
          'branded intro/outro',
          'motion graphics elements',
          'text animations and transitions',
          'color correction',
          'export for social media and website use'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: '$1,800',
        description: 'Ideal for promotional campaigns or professional brand videos.',
        includes: [
          'editing of 5 videos up to 2 minutes each',
          'advanced motion graphics',
          'animated titles and brand elements',
          'color grading',
          'sound optimization',
          'multiple export formats for marketing platforms'
        ]
      }
    }
  },

  'copywriting': {
    title: 'Copywriting & Content Creation',
    category: 'Creative & Content',
    icon: <FaPenNib />,
    intro: 'Clear and persuasive content is essential for turning visitors into customers.',
    description: 'Our copywriting services help you communicate your value, tell your story, and encourage action through well-crafted messaging.',
    longDescription: 'Clear and persuasive content is essential for turning visitors into customers. Our copywriting services help you communicate your value, tell your story, and encourage action through well-crafted messaging.',

    whatItHelpsAchieve: [
      'website pages',
      'blog articles',
      'marketing campaigns',
      'email newsletters',
      'social media captions',
      'product descriptions',
      'advertising copy'
    ],

    howMeasured: [
      'number of content pieces',
      'word count',
      'number of revisions',
      'research and SEO requirements'
    ],

    servicesInclude: [
      'Website content',
      'Marketing copy',
      'Blog articles',
      'Social media captions',
      'Email marketing content'
    ],

    tools: ['SEMrush', 'Ahrefs', 'Grammarly', 'Hemingway Editor'],

    addOnOptions: [
      'email marketing sequences',
      'long-form blog content (2,000+ words)',
      'sales page copywriting',
      'website rewrite packages',
      'editing and proofreading'
    ],

    complementaryServices: [
      { name: 'Graphic Design', reason: 'visual marketing materials' },
      { name: 'Website Development', reason: 'publish the content' },
      { name: 'SEO & Search Marketing', reason: 'drive traffic' },
      { name: 'Email Marketing Campaigns', reason: 'send content to audiences' },
      { name: 'Social Media Management', reason: 'distribute content' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$200',
        description: 'Ideal for small content needs or single-page messaging.',
        includes: [
          '1 content piece up to 800 words',
          'basic keyword research (if needed)',
          'formatting for web readability',
          '1 revision round'
        ],
        examples: ['blog article', 'landing page copy', 'email campaign', 'product description']
      },
      growth: {
        name: 'Growth Package',
        price: '$600',
        description: 'Ideal for businesses producing regular content.',
        includes: [
          '3 content pieces up to 1,000 words each',
          'content structure and messaging optimization',
          'SEO-friendly formatting',
          '2 revision rounds'
        ],
        examples: ['website pages', 'blog articles', 'marketing emails', 'social media content sets']
      },
      premium: {
        name: 'Premium Package',
        price: '$1,200',
        description: 'Ideal for businesses running content marketing campaigns.',
        includes: [
          '6 content pieces up to 1,200 words each',
          'deeper keyword research and SEO optimization',
          'brand voice alignment',
          'content strategy recommendations',
          '2-3 revision rounds'
        ],
        examples: ['blog content series', 'website copy package', 'campaign content', 'marketing sequences']
      }
    }
  },

  'brand-identity': {
    title: 'Brand Identity & Logo Design',
    category: 'Creative & Content',
    icon: <FaPalette />,
    intro: 'Your brand identity is the visual foundation of your business.',
    description: 'A well-designed logo and consistent brand system help customers recognize your company, build trust, and differentiate your business from competitors.',
    longDescription: 'Scale Link Alliance provides professional brand identity and logo design services that help businesses establish a strong visual presence across marketing materials, websites, and digital platforms.',

    whatItHelpsAchieve: [
      'establish a recognizable brand',
      'maintain visual consistency across platforms',
      'improve marketing effectiveness',
      'create a professional first impression',
      'strengthen customer trust and credibility'
    ],

    howMeasured: [
      'number of logo concepts',
      'revision rounds',
      'additional brand assets included',
      'development of brand guidelines'
    ],

    servicesInclude: [
      'Custom logo design',
      'Brand color palette',
      'Typography selection',
      'Brand style guide',
      'Visual brand assets'
    ],

    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma', 'Procreate'],

    addOnOptions: [
      'business card design',
      'brand pattern or icon design',
      'social media brand templates',
      'marketing collateral design',
      'brand guidelines document'
    ],

    complementaryServices: [
      { name: 'Graphic Design', reason: 'marketing materials and social media graphics' },
      { name: 'Website Development', reason: 'brand-consistent website' },
      { name: 'Copywriting & Content Creation', reason: 'brand messaging' },
      { name: 'Social Media Management', reason: 'brand promotion' },
      { name: 'Photography & Visual Assets', reason: 'brand imagery' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$800',
        description: 'Ideal for small businesses launching a brand or refreshing their logo.',
        includes: [
          '1 custom logo concept',
          'basic color palette selection',
          '1 revision round',
          'logo files delivered in PNG and SVG formats'
        ]
      },
      growth: {
        name: 'Growth Package',
        price: '$1,500',
        description: 'Ideal for businesses that want a more developed brand identity.',
        includes: [
          '3 logo design concepts',
          '2 revision rounds',
          'brand color palette',
          'typography selection',
          'logo files in multiple formats (PNG, SVG, PDF)'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: '$2,500',
        description: 'Ideal for companies building a full professional brand identity.',
        includes: [
          '3-4 logo concepts',
          'multiple revision rounds',
          'brand color palette and typography',
          'brand style guide',
          'logo usage guidelines',
          'complete brand identity package'
        ]
      }
    }
  },

  'photography': {
    title: 'Photography & Visual Assets',
    category: 'Creative & Content',
    icon: <FaCamera />,
    intro: 'High-quality visual imagery plays a critical role in how businesses present themselves to customers.',
    description: 'Professional photography helps establish credibility, attract attention, and communicate the value of your products, services, and brand.',
    longDescription: 'Scale Link Alliance provides photography and visual asset services that give businesses professional images for use across websites, social media, marketing campaigns, and promotional materials.',

    whatItHelpsAchieve: [
      'present a professional brand image',
      'showcase products and services visually',
      'improve website and social media engagement',
      'strengthen marketing campaigns',
      'build a recognizable visual identity'
    ],

    howMeasured: [
      'number of edited photos delivered',
      'number of locations or scenes',
      'level of editing and retouching',
      'project scope or session length'
    ],

    servicesInclude: [
      'Business and team photography',
      'Product photography',
      'Website imagery',
      'Marketing visuals',
      'Promotional image assets'
    ],

    tools: ['Professional camera equipment', 'Adobe Lightroom', 'Adobe Photoshop'],

    addOnOptions: [
      'background removal',
      'product staging',
      'lifestyle photography',
      'photo retouching',
      'custom image libraries for marketing'
    ],

    complementaryServices: [
      { name: 'Graphic Design', reason: 'marketing materials using the photos' },
      { name: 'Website Development', reason: 'placing visuals on websites' },
      { name: 'Social Media Management', reason: 'posting branded content' },
      { name: 'Video Editing & Motion Graphics', reason: 'visual storytelling' },
      { name: 'Brand Identity & Logo Design', reason: 'complete visual branding' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$400',
        description: 'Ideal for small businesses needing essential visual content.',
        includes: [
          '10 professionally edited photos',
          '1 location or subject focus',
          'basic color correction and editing',
          'digital image delivery (web-ready format)'
        ],
        examples: ['business headshots', 'simple product photos', 'website imagery']
      },
      growth: {
        name: 'Growth Package',
        price: '$900',
        description: 'Ideal for businesses creating marketing content.',
        includes: [
          '25 professionally edited photos',
          'multiple subjects or scenes',
          'color correction and retouching',
          'web and high-resolution formats'
        ],
        examples: ['team photography', 'product catalog imagery', 'promotional photos']
      },
      premium: {
        name: 'Premium Package',
        price: '$1,800',
        description: 'Ideal for brand campaigns and full marketing visuals.',
        includes: [
          '50 professionally edited photos',
          'multi-scene photography session',
          'advanced retouching and editing',
          'full-resolution and web-ready images',
          'image selection consultation'
        ],
        examples: ['brand photography', 'marketing campaign imagery', 'website image libraries']
      }
    }
  },

  // Tech & Development Services
  'website-development': {
    title: 'Website Development',
    category: 'Tech & Development',
    icon: <FaCode />,
    intro: 'Your website is often the first place potential customers learn about your business.',
    description: 'A well-designed website builds credibility, communicates your value clearly, and provides a platform where visitors can become customers.',
    longDescription: 'Scale Link Alliance develops modern, responsive websites designed to help businesses present their services professionally, capture leads, and support marketing efforts.',

    whatItHelpsAchieve: [
      'establish an online presence',
      'showcase services and products',
      'capture leads and inquiries',
      'support marketing campaigns',
      'provide information to customers'
    ],

    howMeasured: [
      'number of pages created',
      'level of design customization',
      'integrations required',
      'additional functionality'
    ],

    servicesInclude: [
      'Custom website design',
      'Mobile-friendly layout',
      'Basic SEO setup',
      'Contact and lead capture forms',
      'Website launch support'
    ],

    tools: ['React', 'Node.js', 'WordPress', 'Webflow', 'HTML/CSS/JavaScript'],

    addOnOptions: [
      'e-commerce functionality',
      'landing page development',
      'website content writing',
      'advanced SEO optimization',
      'website maintenance plans'
    ],

    complementaryServices: [
      { name: 'Graphic Design', reason: 'website visuals and marketing materials' },
      { name: 'Copywriting & Content Creation', reason: 'website text and messaging' },
      { name: 'SEO & Search Marketing', reason: 'improve search visibility' },
      { name: 'Paid Advertising Management', reason: 'drive traffic to the website' },
      { name: 'Website Maintenance & Updates', reason: 'ongoing support' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$1,200',
        description: 'Ideal for small businesses launching their first website.',
        includes: [
          'up to 3 website pages',
          'responsive mobile-friendly design',
          'contact form setup',
          'basic SEO page structure',
          'website deployment and launch support'
        ],
        examples: ['home page', 'about page', 'contact page']
      },
      growth: {
        name: 'Growth Package',
        price: '$2,500',
        description: 'Ideal for businesses expanding their online presence.',
        includes: [
          'up to 7 website pages',
          'responsive design',
          'contact forms and lead capture',
          'basic SEO optimization',
          'integration of marketing tools'
        ],
        examples: ['services pages', 'blog section', 'landing pages']
      },
      premium: {
        name: 'Premium Package',
        price: '$5,000',
        description: 'Ideal for businesses needing a full professional website.',
        includes: [
          'up to 12 website pages',
          'responsive and modern layout',
          'advanced forms and integrations',
          'blog or content management setup',
          'SEO-ready structure',
          'launch and testing support'
        ]
      }
    }
  },

  'landing-pages': {
    title: 'Landing Pages & Sales Funnels',
    category: 'Tech & Development',
    icon: <FaRocket />,
    intro: 'Landing pages and sales funnels are designed to turn visitors into leads and customers.',
    description: 'Unlike general websites, landing pages focus on a single goal—encouraging visitors to take action such as signing up, requesting a quote, or making a purchase.',
    longDescription: 'Scale Link Alliance develops landing pages and marketing funnels that guide visitors through a structured process designed to improve conversions and generate measurable results.',

    whatItHelpsAchieve: [
      'generate leads',
      'promote products or services',
      'run marketing campaigns',
      'capture email subscribers',
      'guide visitors through a sales process'
    ],

    howMeasured: [
      'number of pages designed',
      'level of funnel complexity',
      'integrations with marketing tools',
      'optimization features'
    ],

    servicesInclude: [
      'Conversion-focused landing page design',
      'Lead capture forms',
      'Marketing funnel integration',
      'Analytics setup',
      'Call-to-action optimization'
    ],

    tools: ['Webflow', 'Unbounce', 'Instapage', 'WordPress', 'React'],

    addOnOptions: [
      'copywriting for landing pages',
      'email marketing automation',
      'advertising campaign setup',
      'A/B testing for conversions',
      'CRM integration'
    ],

    complementaryServices: [
      { name: 'Copywriting & Content Creation', reason: 'persuasive messaging' },
      { name: 'Graphic Design', reason: 'visual campaign assets' },
      { name: 'Paid Advertising Management', reason: 'traffic generation' },
      { name: 'Email Marketing Campaigns', reason: 'lead nurturing' },
      { name: 'CRM & Marketing Automation', reason: 'lead tracking' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$400',
        description: 'Ideal for businesses launching a simple marketing campaign.',
        includes: [
          '1 landing page design',
          'lead capture form integration',
          'mobile-responsive layout',
          'basic analytics setup',
          'call-to-action optimization'
        ],
        examples: ['email signup page', 'service inquiry page', 'promotional campaign page']
      },
      growth: {
        name: 'Growth Package',
        price: '$900',
        description: 'Ideal for businesses running structured marketing campaigns.',
        includes: [
          '3-page sales funnel',
          'landing page + follow-up pages',
          'lead capture forms',
          'conversion-focused design',
          'analytics integration'
        ],
        examples: ['landing page', 'confirmation page', 'offer or next-step page']
      },
      premium: {
        name: 'Premium Package',
        price: '$1,800',
        description: 'Ideal for businesses running full digital marketing funnels.',
        includes: [
          'complete sales funnel (5 pages)',
          'multiple landing pages',
          'advanced form integrations',
          'email marketing integration',
          'conversion optimization setup'
        ],
        examples: ['lead capture page', 'product or service offer page', 'confirmation page', 'follow-up page', 'upsell or next-step page']
      }
    }
  },

  'ecommerce-development': {
    title: 'E-Commerce Development',
    category: 'Tech & Development',
    icon: <FaShoppingCart />,
    intro: 'E-commerce platforms allow businesses to sell products and services online, reach a broader audience, and manage transactions efficiently.',
    description: 'A professionally developed online store ensures customers can browse products easily, complete purchases securely, and return for future orders.',
    longDescription: 'Scale Link Alliance provides e-commerce development services that help businesses launch and manage online stores designed for growth, usability, and reliability.',

    whatItHelpsAchieve: [
      'sell products online',
      'manage inventory and orders',
      'accept secure payments',
      'expand to new markets',
      'automate order processing'
    ],

    howMeasured: [
      'number of products added',
      'number of store pages created',
      'payment and shipping integrations',
      'additional features and automation'
    ],

    servicesInclude: [
      'Online store setup',
      'Product page design',
      'Payment gateway integration',
      'Shopping cart configuration',
      'Order management tools'
    ],

    tools: ['Shopify', 'WooCommerce', 'BigCommerce', 'Magento'],

    addOnOptions: [
      'product photography and visual assets',
      'product description copywriting',
      'email marketing integration',
      'inventory automation',
      'advanced analytics and reporting'
    ],

    complementaryServices: [
      { name: 'Graphic Design', reason: 'product images and promotional materials' },
      { name: 'Copywriting & Content Creation', reason: 'product descriptions' },
      { name: 'Photography & Visual Assets', reason: 'product photography' },
      { name: 'SEO & Search Marketing', reason: 'drive organic traffic' },
      { name: 'Paid Advertising Management', reason: 'increase sales through ads' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$1,200',
        description: 'Ideal for small businesses launching their first online store.',
        includes: [
          'store setup with up to 10 products',
          'product page design',
          'payment gateway integration',
          'basic shipping setup',
          'mobile-responsive layout'
        ]
      },
      growth: {
        name: 'Growth Package',
        price: '$2,500',
        description: 'Ideal for businesses expanding their product catalog.',
        includes: [
          'store setup with up to 50 products',
          'product categories and navigation',
          'payment and shipping integrations',
          'customer account setup',
          'basic SEO product structure'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: '$4,500',
        description: 'Ideal for businesses building a fully developed online store.',
        includes: [
          'store setup with up to 100 products',
          'advanced store design',
          'multiple payment gateways',
          'shipping automation',
          'product filtering and search features',
          'performance optimization'
        ]
      }
    }
  },

  'web-applications': {
    title: 'Web Applications & SaaS Development',
    category: 'Tech & Development',
    icon: <FaGlobe />,
    intro: 'Custom web applications and Software-as-a-Service (SaaS) platforms allow businesses to streamline operations, automate workflows, and create digital tools that support growth.',
    description: 'Unlike standard websites, web applications provide interactive functionality such as dashboards, user accounts, data management systems, and automation tools.',
    longDescription: 'Scale Link Alliance develops scalable web applications and SaaS solutions tailored to the specific operational needs of businesses, helping organizations improve efficiency and deliver digital services to their customers.',

    whatItHelpsAchieve: [
      'internal business management systems',
      'client portals and dashboards',
      'workflow automation tools',
      'subscription-based software platforms',
      'online booking and scheduling systems',
      'data management platforms'
    ],

    howMeasured: [
      'number of application features or modules',
      'complexity of functionality',
      'integrations required',
      'database architecture and scalability'
    ],

    servicesInclude: [
      'Custom web application development',
      'SaaS platform development',
      'System integrations',
      'Workflow automation tools',
      'Database integration'
    ],

    tools: ['React', 'Node.js', 'Python', 'Django', 'Ruby on Rails', 'PostgreSQL'],

    addOnOptions: [
      'payment gateway integration',
      'subscription billing systems',
      'third-party API integrations',
      'advanced analytics dashboards',
      'cloud hosting and infrastructure setup'
    ],

    complementaryServices: [
      { name: 'API Integration & Automation', reason: 'connect systems' },
      { name: 'Website Development', reason: 'public-facing platform' },
      { name: 'UI/UX Graphic Design', reason: 'interface visuals' },
      { name: 'Data Analytics & Reporting', reason: 'application insights' },
      { name: 'Website Maintenance & Updates', reason: 'ongoing technical support' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$2,500',
        description: 'Ideal for businesses needing a simple custom web tool or internal system.',
        includes: [
          '1 custom web application feature or module',
          'basic user interface design',
          'database setup',
          'user login and access control',
          'basic functionality testing'
        ],
        examples: ['client login portal', 'simple data management system', 'appointment booking tool']
      },
      growth: {
        name: 'Growth Package',
        price: '$6,000',
        description: 'Ideal for businesses building more advanced digital systems.',
        includes: [
          'multi-feature web application (up to 3 modules)',
          'user account system',
          'database integration',
          'workflow automation features',
          'responsive interface design'
        ],
        examples: ['customer dashboard', 'internal project management system', 'subscription-based digital service']
      },
      premium: {
        name: 'Premium Package',
        price: '$12,000',
        description: 'Ideal for businesses launching a SaaS platform or full digital product.',
        includes: [
          'complete SaaS application structure',
          'multiple user roles and permissions',
          'scalable database architecture',
          'dashboard and reporting features',
          'API integrations and automation',
          'performance optimization and testing'
        ]
      }
    }
  },

  'api-integration': {
    title: 'API Integration & Automation',
    category: 'Tech & Development',
    icon: <FaCloudUploadAlt />,
    intro: 'Modern businesses rely on multiple digital tools such as CRMs, marketing platforms, accounting software, and websites.',
    description: 'When systems do not communicate with each other, businesses often spend valuable time manually transferring information between platforms.',
    longDescription: 'Scale Link Alliance provides API integration and automation services that connect your systems and automate repetitive workflows. These integrations improve efficiency, reduce manual work, and ensure that data flows seamlessly across your business tools.',

    whatItHelpsAchieve: [
      'connect software platforms and business systems',
      'reduce manual data entry and repetitive tasks',
      'improve workflow efficiency',
      'ensure accurate data synchronization',
      'streamline operations and communication between tools'
    ],

    howMeasured: [
      'number of systems integrated',
      'number of automated workflows',
      'complexity of data mapping',
      'customization requirements'
    ],

    servicesInclude: [
      'System integrations',
      'Data synchronization',
      'Workflow automation',
      'API configuration',
      'Integration troubleshooting'
    ],

    tools: ['Zapier', 'Make', 'n8n', 'Custom APIs', 'REST', 'GraphQL'],

    addOnOptions: [
      'CRM setup and automation',
      'marketing automation workflows',
      'payment system integrations',
      'reporting and data automation',
      'ongoing automation maintenance'
    ],

    complementaryServices: [
      { name: 'CRM & Marketing Automation', reason: 'lead management systems' },
      { name: 'Web Applications & SaaS Development', reason: 'custom digital tools' },
      { name: 'Data Analytics & Reporting', reason: 'analyze integrated data' },
      { name: 'Website Development', reason: 'connect websites with systems' },
      { name: 'Process Documentation & SOP Development', reason: 'document workflows' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$600',
        description: 'Ideal for businesses connecting two systems for the first time.',
        includes: [
          '1 system integration',
          'basic data synchronization',
          'simple workflow automation',
          'testing and configuration'
        ],
        examples: ['website form → CRM integration', 'CRM → email marketing platform connection', 'contact data synchronization']
      },
      growth: {
        name: 'Growth Package',
        price: '$1,500',
        description: 'Ideal for businesses connecting multiple tools.',
        includes: [
          'up to 3 system integrations',
          'workflow automation setup',
          'data synchronization between platforms',
          'automation testing and optimization'
        ],
        examples: ['CRM integration with marketing automation tools', 'customer data automation across systems', 'order processing automation']
      },
      premium: {
        name: 'Premium Package',
        price: '$3,000',
        description: 'Ideal for businesses implementing full automation systems.',
        includes: [
          'multiple system integrations',
          'advanced workflow automation',
          'API configuration and data mapping',
          'automation testing and optimization',
          'documentation of automated workflows'
        ],
        examples: ['automated lead routing systems', 'order fulfillment automation', 'marketing and CRM automation workflows']
      }
    }
  },

  'website-maintenance': {
    title: 'Website Maintenance & Updates',
    category: 'Tech & Development',
    icon: <FaShieldAlt />,
    intro: 'A website requires regular updates, monitoring, and maintenance to remain secure, functional, and effective.',
    description: 'Without ongoing maintenance, websites can experience technical issues, outdated content, security vulnerabilities, and reduced performance.',
    longDescription: 'Scale Link Alliance provides website maintenance and update services that help businesses keep their websites secure, updated, and operating smoothly while ensuring the site continues to support marketing and customer engagement efforts.',

    whatItHelpsAchieve: [
      'keep website secure and up to date',
      'fix technical issues quickly',
      'update website content when needed',
      'maintain website performance',
      'ensure site continues supporting marketing efforts'
    ],

    howMeasured: [
      'number of maintenance hours per month',
      'complexity of updates',
      'level of monitoring required',
      'additional technical support requests'
    ],

    servicesInclude: [
      'Website updates and patches',
      'Security monitoring',
      'Performance checks',
      'Content updates',
      'Technical support'
    ],

    tools: ['WordPress', 'React', 'Node.js', 'PHP', 'Security plugins'],

    addOnOptions: [
      'website backups and recovery',
      'SEO updates and optimization',
      'landing page creation',
      'website performance audits',
      'technical troubleshooting'
    ],

    complementaryServices: [
      { name: 'Website Development', reason: 'new features or redesigns' },
      { name: 'SEO & Search Marketing', reason: 'improve search visibility' },
      { name: 'Graphic Design', reason: 'update visuals and marketing assets' },
      { name: 'Copywriting & Content Creation', reason: 'website content updates' },
      { name: 'Data Analytics & Reporting', reason: 'monitor website performance' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$150/month',
        description: 'Ideal for small websites needing occasional updates.',
        includes: [
          'up to 2 hours of maintenance per month',
          'basic security monitoring',
          'minor content updates',
          'plugin and system updates',
          'website performance check'
        ]
      },
      growth: {
        name: 'Growth Package',
        price: '$350/month',
        description: 'Ideal for businesses regularly updating their website.',
        includes: [
          'up to 5 hours of maintenance per month',
          'security monitoring and updates',
          'content updates and small design changes',
          'plugin and system updates',
          'website performance optimization'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: '$750/month',
        description: 'Ideal for businesses that rely heavily on their website.',
        includes: [
          'up to 10 hours of maintenance per month',
          'advanced security monitoring',
          'priority support for website issues',
          'regular content updates',
          'performance optimization and technical adjustments'
        ]
      }
    }
  },

  // Marketing & Growth Services
  'social-media-management': {
    title: 'Social Media Management',
    category: 'Marketing & Growth',
    icon: <FaUsers />,
    intro: 'Social media platforms have become one of the most effective ways for businesses to connect with customers, promote services, and build brand awareness.',
    description: 'Maintaining a consistent and professional social media presence requires planning, content creation, and regular engagement.',
    longDescription: 'Scale Link Alliance provides social media management services that help businesses maintain an active online presence, share valuable content, and connect with their audience in a professional and strategic way.',

    whatItHelpsAchieve: [
      'increase brand visibility and awareness',
      'engage with customers and followers',
      'promote products and services',
      'maintain a consistent content presence',
      'support marketing and promotional campaigns'
    ],

    howMeasured: [
      'number of posts created and published',
      'engagement monitoring activities',
      'platforms managed',
      'performance reporting'
    ],

    servicesInclude: [
      'Content posting and scheduling',
      'Social media graphics',
      'Audience engagement',
      'Performance insights',
      'Caption writing'
    ],

    tools: ['Buffer', 'Hootsuite', 'Later', 'Sprout Social', 'Canva'],

    addOnOptions: [
      'social media advertising campaigns',
      'short-form video content creation',
      'content calendar planning',
      'influencer outreach support',
      'brand strategy consultation'
    ],

    complementaryServices: [
      { name: 'Graphic Design', reason: 'visual social media content' },
      { name: 'Video Editing & Motion Graphics', reason: 'short-form video posts' },
      { name: 'Copywriting & Content Creation', reason: 'captions and messaging' },
      { name: 'Paid Advertising Management', reason: 'social media ads' },
      { name: 'Photography & Visual Assets', reason: 'content imagery' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$300/month',
        description: 'Ideal for small businesses maintaining a basic social media presence.',
        includes: [
          '8 social media posts per month',
          'content scheduling',
          'basic caption writing',
          'engagement monitoring',
          'performance overview'
        ]
      },
      growth: {
        name: 'Growth Package',
        price: '$600/month',
        description: 'Ideal for businesses expanding their social media activity.',
        includes: [
          '15 social media posts per month',
          'graphic content creation',
          'caption writing and hashtags',
          'audience engagement monitoring',
          'monthly performance report'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: '$1,200/month',
        description: 'Ideal for businesses using social media as a primary marketing channel.',
        includes: [
          '30 social media posts per month',
          'custom graphics and visuals',
          'caption writing and strategy',
          'engagement management',
          'detailed performance reporting'
        ]
      }
    }
  },

  'seo-marketing': {
    title: 'SEO & Search Marketing',
    category: 'Marketing & Growth',
    icon: <FaSearch />,
    intro: 'Search Engine Optimization helps your business appear when potential customers search online for services or products related to your industry.',
    description: 'Effective SEO improves your website visibility in search engines, attracts targeted traffic, and supports long-term growth.',
    longDescription: 'Scale Link Alliance provides SEO and search marketing services designed to strengthen your online presence, optimize your website structure, and improve search rankings so the right audience can find your business.',

    whatItHelpsAchieve: [
      'increase website visibility in search engines',
      'attract targeted organic traffic',
      'improve search rankings for relevant keywords',
      'strengthen online authority',
      'generate more inquiries and leads'
    ],

    howMeasured: [
      'number of pages optimized',
      'keyword rankings',
      'website traffic growth',
      'search visibility improvements',
      'lead generation from organic traffic'
    ],

    servicesInclude: [
      'Keyword research',
      'On-page SEO optimization',
      'Technical SEO improvements',
      'Content recommendations',
      'Search performance tracking'
    ],

    tools: ['SEMrush', 'Ahrefs', 'Google Search Console', 'Moz', 'Screaming Frog'],

    addOnOptions: [
      'blog content creation for SEO',
      'local SEO optimization',
      'competitor keyword analysis',
      'SEO content strategy development',
      'website technical SEO audits'
    ],

    complementaryServices: [
      { name: 'Website Development', reason: 'SEO-friendly website structure' },
      { name: 'Copywriting & Content Creation', reason: 'optimized website content' },
      { name: 'Landing Pages & Sales Funnels', reason: 'convert search traffic' },
      { name: 'Graphic Design', reason: 'visual content for blog and marketing pages' },
      { name: 'Lead Generation Services', reason: 'expand sales opportunities' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$400/month',
        description: 'Ideal for small businesses beginning their SEO strategy.',
        includes: [
          'SEO audit of website',
          'keyword research',
          'optimization of up to 5 website pages',
          'meta titles and descriptions',
          'basic search performance tracking'
        ]
      },
      growth: {
        name: 'Growth Package',
        price: '$900/month',
        description: 'Ideal for businesses actively working to improve search rankings.',
        includes: [
          'keyword research and strategy',
          'optimization of up to 15 website pages',
          'content optimization recommendations',
          'technical SEO improvements',
          'monthly performance report'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: '$1,800/month',
        description: 'Ideal for businesses seeking aggressive search growth.',
        includes: [
          'advanced keyword strategy',
          'optimization of 30+ website pages',
          'content strategy and recommendations',
          'technical SEO improvements',
          'backlink development guidance',
          'monthly performance reporting and insights'
        ]
      }
    }
  },

  'paid-advertising': {
    title: 'Paid Advertising Management',
    category: 'Marketing & Growth',
    icon: <FaAd />,
    intro: 'Paid advertising can quickly generate leads and increase brand visibility.',
    description: 'We create and manage targeted advertising campaigns designed to reach the right audience and maximize return on investment.',
    longDescription: 'Paid advertising helps businesses quickly reach new customers and generate leads. We design and manage advertising campaigns that target the right audience and maximize return on investment. Our goal is to ensure your marketing budget produces measurable results.',

    whatItHelpsAchieve: [
      'reach new customers quickly',
      'generate leads',
      'increase brand visibility',
      'target specific audiences',
      'maximize marketing budget'
    ],

    howMeasured: [
      'number of campaigns',
      'audience targeting accuracy',
      'conversion rates',
      'return on ad spend'
    ],

    servicesInclude: [
      'Google Ads management',
      'Social media advertising',
      'Audience targeting',
      'Campaign performance optimization',
      'Monthly reporting'
    ],

    tools: ['Google Ads', 'Facebook Ads Manager', 'LinkedIn Ads', 'TikTok Ads'],

    addOnOptions: [
      'ad creative design',
      'A/B testing',
      'conversion tracking',
      'budget optimization',
      'performance analytics'
    ],

    complementaryServices: [
      { name: 'Landing Pages', reason: 'conversion-optimized destinations' },
      { name: 'Copywriting', reason: 'ad messaging' },
      { name: 'Social Media', reason: 'organic support' },
      { name: 'Lead Generation', reason: 'integrated campaigns' },
      { name: 'Analytics', reason: 'performance tracking' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$500/month',
        description: 'Ideal for businesses launching their first ad campaigns.',
        includes: [
          '1 ad campaign',
          'audience targeting',
          'ad creative guidance',
          'monthly report',
          'basic optimization'
        ]
      },
      growth: {
        name: 'Growth Package',
        price: '$1,000/month',
        description: 'Ideal for businesses running multiple campaigns.',
        includes: [
          '3 campaigns',
          'advanced targeting',
          'A/B testing',
          'bi-weekly reports',
          'regular optimization'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: '$2,500/month',
        description: 'Ideal for businesses requiring full ad management.',
        includes: [
          'full ad management',
          '10 campaigns',
          'multi-platform campaigns',
          'custom audiences',
          'weekly reports',
          'dedicated specialist'
        ]
      }
    }
  },

  'email-marketing': {
    title: 'Email Marketing Campaigns',
    category: 'Marketing & Growth',
    icon: <FaEnvelope />,
    intro: 'Email marketing remains one of the most effective ways for businesses to communicate directly with their audience.',
    description: 'A well-designed email campaign can help nurture customer relationships, promote services or products, and encourage repeat engagement.',
    longDescription: 'Scale Link Alliance provides email marketing campaign services that help businesses create professional email content, manage mailing lists, and deliver targeted messages that strengthen customer connections.',

    whatItHelpsAchieve: [
      'maintain regular communication with customers',
      'promote products, services, and announcements',
      'nurture leads and prospects',
      'increase customer engagement',
      'encourage repeat business'
    ],

    howMeasured: [
      'number of email campaigns created',
      'level of customization and design',
      'audience segmentation',
      'performance tracking and reporting'
    ],

    servicesInclude: [
      'Email campaign design',
      'Newsletter creation',
      'Marketing automation setup',
      'Customer engagement emails',
      'Campaign performance tracking'
    ],

    tools: ['Mailchimp', 'Klaviyo', 'ActiveCampaign', 'ConvertKit', 'HubSpot'],

    addOnOptions: [
      'automated email sequences',
      'newsletter design and management',
      'email list growth strategies',
      'CRM integration for email campaigns',
      'campaign performance optimization'
    ],

    complementaryServices: [
      { name: 'Lead Generation Services', reason: 'grow email lists' },
      { name: 'Copywriting & Content Creation', reason: 'email messaging' },
      { name: 'Graphic Design', reason: 'email visuals and templates' },
      { name: 'CRM & Marketing Automation', reason: 'automated workflows' },
      { name: 'Landing Pages & Sales Funnels', reason: 'convert email traffic' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$250',
        description: 'Ideal for businesses launching a simple email campaign.',
        includes: [
          '1 email campaign',
          'email template design',
          'content formatting',
          'mailing list integration',
          'campaign scheduling'
        ],
        examples: ['promotional email', 'company announcement', 'newsletter issue']
      },
      growth: {
        name: 'Growth Package',
        price: '$600',
        description: 'Ideal for businesses running regular email communication.',
        includes: [
          '3 email campaigns',
          'email template customization',
          'campaign scheduling and delivery',
          'basic audience segmentation',
          'performance tracking summary'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: '$1,200',
        description: 'Ideal for businesses running structured email marketing programs.',
        includes: [
          '6 email campaigns',
          'custom email templates',
          'audience segmentation',
          'performance analysis and reporting',
          'campaign strategy recommendations'
        ]
      }
    }
  },

  'lead-generation': {
    title: 'Lead Generation Services',
    category: 'Marketing & Growth',
    icon: <FaRegBuilding />,
    intro: 'Consistent lead generation is essential for business growth.',
    description: 'Without a steady flow of potential customers, even the best products or services struggle to reach their full potential.',
    longDescription: 'Scale Link Alliance provides targeted lead generation services designed to help businesses identify and connect with qualified prospects who are more likely to be interested in their offerings. Our approach focuses on identifying the right audience, researching potential prospects, and delivering organized lead lists that support outreach and sales efforts.',

    whatItHelpsAchieve: [
      'identify potential customers',
      'build a consistent sales pipeline',
      'expand outreach opportunities',
      'connect with targeted prospects',
      'support marketing and sales efforts'
    ],

    howMeasured: [
      'number of leads delivered',
      'targeting criteria',
      'level of research and qualification',
      'delivery format of lead data'
    ],

    servicesInclude: [
      'Target audience identification',
      'Lead sourcing and research',
      'Outreach strategies',
      'Prospect qualification',
      'Lead list delivery'
    ],

    tools: ['LinkedIn Sales Navigator', 'Apollo.io', 'Hunter.io', 'CRM tools'],

    addOnOptions: [
      'CRM integration',
      'outreach templates',
      'follow-up sequences',
      'lead enrichment',
      'ongoing pipeline management'
    ],

    complementaryServices: [
      { name: 'CRM & Marketing Automation', reason: 'manage leads' },
      { name: 'Email Marketing Campaigns', reason: 'contact prospects' },
      { name: 'Landing Pages & Sales Funnels', reason: 'convert leads' },
      { name: 'Paid Advertising Management', reason: 'generate additional leads' },
      { name: 'Copywriting & Content Creation', reason: 'sales messaging' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$500',
        description: 'Ideal for businesses building their initial lead pipeline.',
        includes: [
          '25 targeted leads',
          'basic qualification',
          'contact information',
          'CSV export'
        ]
      },
      growth: {
        name: 'Growth Package',
        price: '$1,200',
        description: 'Ideal for businesses scaling their sales efforts.',
        includes: [
          '100 leads',
          'advanced qualification',
          'enriched data',
          'outreach templates',
          'CRM integration support'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: '$2,500',
        description: 'Ideal for businesses needing ongoing lead flow.',
        includes: [
          '220 leads',
          'monthly lead updates',
          'full qualification',
          'outreach support',
          'strategy consultation'
        ]
      }
    }
  },

  'crm-automation': {
    title: 'CRM & Marketing Automation',
    category: 'Marketing & Growth',
    icon: <FaCogs />,
    intro: 'CRM systems, funnels, and automations that capture leads and improve conversion efficiency.',
    description: 'Set up systems that work automatically to capture leads, nurture prospects, and improve conversion efficiency.',
    longDescription: 'Stop managing leads manually. Our automation specialists set up CRM systems, build conversion funnels, and create automated sequences that nurture leads and close sales while you sleep.',

    whatItHelpsAchieve: [
      'manage customer relationships',
      'automate marketing workflows',
      'track leads and conversions',
      'improve sales efficiency',
      'scale customer engagement'
    ],

    howMeasured: [
      'CRM setup complexity',
      'number of automation workflows',
      'integrations completed',
      'lead tracking accuracy'
    ],

    servicesInclude: [
      'CRM setup and customization',
      'Sales funnel development',
      'Email automation sequences',
      'Lead tracking and scoring',
      'Integration with existing tools'
    ],

    tools: ['HubSpot', 'Salesforce', 'ActiveCampaign', 'Klaviyo', 'Zapier', 'Make'],

    addOnOptions: [
      'lead capture forms',
      'automated workflows',
      'lead scoring',
      'pipeline tracking',
      'analytics dashboards'
    ],

    complementaryServices: [
      { name: 'Lead Generation', reason: 'feed leads into CRM' },
      { name: 'Email Marketing', reason: 'integrated campaigns' },
      { name: 'Web Development', reason: 'CRM-connected websites' },
      { name: 'API Integration', reason: 'system connectivity' },
      { name: 'Data Analytics', reason: 'performance tracking' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$500',
        description: 'Ideal for businesses implementing their first CRM.',
        includes: [
          'CRM setup',
          'basic automation',
          'lead capture forms',
          'integration setup',
          'documentation'
        ]
      },
      growth: {
        name: 'Growth Package',
        price: '$1,200',
        description: 'Ideal for businesses scaling their automation.',
        includes: [
          'full CRM customization',
          'email automation',
          'lead scoring',
          'pipeline management',
          'analytics dashboard'
        ]
      },
      premium: {
        name: 'Premium Package',
        price: '$2,500',
        description: 'Ideal for comprehensive marketing automation.',
        includes: [
          'complete marketing automation',
          'multi-channel sequences',
          'advanced lead scoring',
          'custom reporting',
          'strategy consultation',
          'priority support'
        ]
      }
    }
  },

  // Operations & Support Services
  'virtual-assistant': {
    title: 'Virtual Assistant Services',
    category: 'Operations & Support',
    icon: <FaHeadset />,
    intro: 'Administrative and operational tasks can take valuable time away from strategic work and business growth.',
    description: 'Virtual assistants help businesses manage routine tasks efficiently, allowing business owners and teams to focus on higher-priority responsibilities.',
    longDescription: 'Scale Link Alliance provides professional virtual assistant services that support day-to-day business operations, administrative tasks, and organizational workflows.',

    whatItHelpsAchieve: [
      'reduce administrative workload',
      'improve task organization and efficiency',
      'support daily operational activities',
      'manage communication and scheduling',
      'free up time for business owners to focus on growth'
    ],

    howMeasured: [
      'number of hours provided per month',
      'scope of administrative tasks',
      'level of coordination required',
      'complexity of support activities'
    ],

    servicesInclude: [
      'Email management',
      'Calendar scheduling',
      'Data entry',
      'Administrative coordination',
      'Customer support assistance'
    ],

    tools: ['Google Workspace', 'Microsoft Office', 'Slack', 'Trello', 'Asana'],

    addOnOptions: [
      'travel booking',
      'research tasks',
      'document preparation',
      'meeting scheduling',
      'inbox management'
    ],

    complementaryServices: [
      { name: 'Data Entry', reason: 'database management' },
      { name: 'Project Management', reason: 'task coordination' },
      { name: 'Process Documentation', reason: 'workflow standardization' },
      { name: 'Lead Generation', reason: 'outreach support' },
      { name: 'Customer Support', reason: 'client communication' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$200/month',
        description: 'Ideal for businesses needing light administrative support.',
        includes: [
          'up to 5 hours of virtual assistant support per month',
          'email and calendar organization',
          'basic administrative tasks',
          'task tracking and reporting'
        ],
        examples: ['scheduling appointments', 'organizing email inboxes', 'simple research tasks']
      },
      growth: {
        name: 'Growth Package',
        price: '$500/month',
        description: 'Ideal for businesses needing regular operational assistance.',
        includes: [
          'up to 15 hours of virtual assistant support per month',
          'administrative and scheduling support',
          'basic customer communication assistance',
          'document organization and data entry'
        ],
        examples: ['customer inquiry responses', 'calendar management', 'document preparation']
      },
      premium: {
        name: 'Premium Package',
        price: '$1,200/month',
        description: 'Ideal for businesses requiring consistent operational support.',
        includes: [
          'up to 40 hours of virtual assistant support per month',
          'administrative task management',
          'coordination of communications and scheduling',
          'task monitoring and reporting'
        ],
        examples: ['ongoing administrative support', 'project coordination assistance', 'customer communication support']
      }
    }
  },

  'data-analytics': {
    title: 'Data Analytics & Reporting',
    category: 'Operations & Support',
    icon: <FaChartLine />,
    intro: 'Data analytics helps businesses understand performance, identify trends, and make better strategic decisions.',
    description: 'Without clear insights, companies often rely on assumptions rather than measurable information.',
    longDescription: 'Scale Link Alliance provides data analytics and reporting services that transform raw business data into structured reports and visual insights. These reports help business owners monitor performance, track progress, and identify opportunities for improvement.',

    whatItHelpsAchieve: [
      'understand key performance metrics',
      'identify trends in sales, marketing, and operations',
      'make informed business decisions',
      'track marketing or operational performance',
      'improve overall efficiency'
    ],

    howMeasured: [
      'number of reports created',
      'complexity of data analysis',
      'number of data sources analyzed',
      'creation of dashboards or visualizations'
    ],

    servicesInclude: [
      'Data analysis',
      'Business performance reports',
      'Dashboard creation',
      'Insight recommendations',
      'KPI tracking'
    ],

    tools: ['Google Analytics', 'Tableau', 'Power BI', 'Looker', 'Excel'],

    addOnOptions: [
      'automated reporting dashboards',
      'marketing campaign performance tracking',
      'CRM data analysis',
      'customer behavior analysis',
      'monthly reporting services'
    ],

    complementaryServices: [
      { name: 'CRM & Marketing Automation', reason: 'data collection and management' },
      { name: 'Lead Generation Services', reason: 'track prospect performance' },
      { name: 'SEO & Search Marketing', reason: 'measure search traffic growth' },
      { name: 'Paid Advertising Management', reason: 'analyze ad campaign performance' },
      { name: 'Website Development', reason: 'integrate analytics tools' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$300',
        description: 'Ideal for businesses needing basic performance insights.',
        includes: [
          '1 custom data report',
          'basic data analysis',
          'visual charts or graphs',
          'summary of key insights'
        ],
        examples: ['marketing performance report', 'sales activity summary', 'website traffic overview']
      },
      growth: {
        name: 'Growth Package',
        price: '$800',
        description: 'Ideal for businesses tracking multiple performance areas.',
        includes: [
          '3 custom reports',
          'visual dashboards or charts',
          'trend analysis',
          'summary recommendations'
        ],
        examples: ['marketing performance reports', 'sales pipeline reports', 'customer engagement analysis']
      },
      premium: {
        name: 'Premium Package',
        price: '$1,500',
        description: 'Ideal for businesses seeking ongoing performance monitoring.',
        includes: [
          'custom analytics dashboard',
          '7 custom data reports',
          'visual performance charts',
          'detailed trend analysis',
          'strategic insight summary'
        ]
      }
    }
  },

  'process-documentation': {
    title: 'Process Documentation & SOP Development',
    category: 'Operations & Support',
    icon: <FaFileAlt />,
    intro: 'Clear processes are essential for businesses that want to operate efficiently and scale effectively.',
    description: 'When workflows are undocumented, tasks become inconsistent, training takes longer, and operational mistakes are more likely.',
    longDescription: 'Scale Link Alliance provides Process Documentation and Standard Operating Procedure (SOP) development services that help businesses organize their workflows, create structured procedures, and ensure tasks can be performed consistently by teams or future hires.',

    whatItHelpsAchieve: [
      'standardize workflows and procedures',
      'improve team efficiency',
      'simplify employee training',
      'reduce operational errors',
      'create systems that support business growth'
    ],

    howMeasured: [
      'number of workflows documented',
      'complexity of business processes',
      'depth of documentation required',
      'inclusion of workflow diagrams or guides'
    ],

    servicesInclude: [
      'Workflow mapping',
      'SOP documentation',
      'Process improvement recommendations',
      'Operational guidelines',
      'Process diagrams'
    ],

    tools: ['Notion', 'Process Street', 'LucidChart', 'Google Docs', 'Trainual'],

    addOnOptions: [
      'team training documentation',
      'workflow automation recommendations',
      'internal operations manuals',
      'onboarding process documentation',
      'knowledge base development'
    ],

    complementaryServices: [
      { name: 'Project Management Support', reason: 'implement documented workflows' },
      { name: 'Virtual Assistant Services', reason: 'execute operational tasks' },
      { name: 'CRM & Marketing Automation', reason: 'automate processes' },
      { name: 'Data Analytics & Reporting', reason: 'measure operational performance' },
      { name: 'Data Entry & Processing', reason: 'manage workflow data' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$400',
        description: 'Ideal for businesses documenting a single workflow.',
        includes: [
          '1 documented business process',
          'step-by-step SOP document',
          'workflow outline or process map',
          'basic formatting for easy reference'
        ],
        examples: ['client onboarding process', 'customer support workflow', 'internal task procedure']
      },
      growth: {
        name: 'Growth Package',
        price: '$900',
        description: 'Ideal for businesses organizing multiple operational procedures.',
        includes: [
          '3 documented workflows',
          'structured SOP documents',
          'workflow diagrams or visual process maps',
          'process improvement recommendations'
        ],
        examples: ['sales process documentation', 'marketing workflow', 'operations procedures']
      },
      premium: {
        name: 'Premium Package',
        price: '$1,800',
        description: 'Ideal for businesses building a full operational framework.',
        includes: [
          '6+ documented workflows',
          'complete SOP manual or operations guide',
          'workflow diagrams and structured documentation',
          'recommendations for process optimization'
        ]
      }
    }
  },

  'project-management': {
    title: 'Project Management Support',
    category: 'Operations & Support',
    icon: <FaProjectDiagram />,
    intro: 'Successful projects require organization, coordination, and clear communication between team members and stakeholders.',
    description: 'Without proper project management, deadlines can be missed, responsibilities may become unclear, and project goals can be difficult to achieve.',
    longDescription: 'Scale Link Alliance provides project management support services that help businesses plan, organize, and oversee projects to ensure they are completed efficiently and on schedule.',

    whatItHelpsAchieve: [
      'keep projects organized and on schedule',
      'coordinate tasks and team responsibilities',
      'improve communication across teams',
      'track project progress and milestones',
      'ensure project objectives are completed successfully'
    ],

    howMeasured: [
      'number of projects or phases managed',
      'project complexity',
      'level of coordination required',
      'reporting and oversight responsibilities'
    ],

    servicesInclude: [
      'Project planning and scheduling',
      'Task coordination',
      'Progress tracking',
      'Team communication support',
      'Project reporting'
    ],

    tools: ['Asana', 'Trello', 'Monday.com', 'ClickUp', 'Jira', 'Basecamp'],

    addOnOptions: [
      'workflow optimization consulting',
      'team training on project management tools',
      'documentation of project processes',
      'reporting dashboards for project performance'
    ],

    complementaryServices: [
      { name: 'Process Documentation & SOP Development', reason: 'structured workflows' },
      { name: 'Virtual Assistant Services', reason: 'task execution support' },
      { name: 'Data Analytics & Reporting', reason: 'project performance tracking' },
      { name: 'CRM & Marketing Automation', reason: 'project automation tools' },
      { name: 'Website Development or Marketing Services', reason: 'projects being implemented' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$500',
        description: 'Ideal for managing a small project or short-term initiative.',
        includes: [
          'management of 1 project',
          'project planning and timeline development',
          'task coordination',
          'progress tracking and status updates'
        ],
        examples: ['website launch coordination', 'marketing campaign rollout', 'small operational project']
      },
      growth: {
        name: 'Growth Package',
        price: '$1,200',
        description: 'Ideal for businesses managing multiple tasks within a project.',
        includes: [
          'management of up to 3 project phases or workstreams',
          'project planning and scheduling',
          'task and milestone tracking',
          'team coordination and communication'
        ],
        examples: ['marketing campaign coordination', 'product launch planning', 'internal process improvement project']
      },
      premium: {
        name: 'Premium Package',
        price: '$2,500',
        description: 'Ideal for businesses requiring full project oversight.',
        includes: [
          'comprehensive project management support',
          'project planning and scheduling',
          'team coordination across departments',
          'progress tracking and milestone reporting',
          'project performance review'
        ],
        examples: ['complex operational projects', 'multi-phase marketing initiatives', 'system implementation projects']
      }
    }
  },

  'data-entry': {
    title: 'Data Entry & Processing',
    category: 'Operations & Support',
    icon: <FaDatabase />,
    intro: 'Accurate and organized data is essential for efficient business operations.',
    description: 'However, managing large volumes of information can be time-consuming and take focus away from higher-value activities.',
    longDescription: 'Scale Link Alliance provides data entry and processing services that help businesses organize, update, and manage information efficiently. Our team ensures data is entered accurately, formatted properly, and maintained in a structured system that supports your business operations.',

    whatItHelpsAchieve: [
      'organize business information efficiently',
      'maintain accurate records and databases',
      'reduce administrative workload',
      'improve data accessibility and management',
      'support operational and reporting processes'
    ],

    howMeasured: [
      'number of records processed',
      'complexity of data structure',
      'level of formatting required',
      'system or database used'
    ],

    servicesInclude: [
      'Database management',
      'Data cleansing and validation',
      'Spreadsheet organization',
      'Record keeping',
      'Data migration'
    ],

    tools: ['Excel', 'Google Sheets', 'Airtable', 'Monday.com', 'CRM systems'],

    addOnOptions: [
      'CRM database cleanup',
      'data migration between systems',
      'spreadsheet automation',
      'document digitization',
      'ongoing data management support'
    ],

    complementaryServices: [
      { name: 'CRM & Marketing Automation', reason: 'organize and automate data' },
      { name: 'Data Analytics & Reporting', reason: 'analyze business data' },
      { name: 'Virtual Assistant Services', reason: 'administrative support' },
      { name: 'Process Documentation & SOP Development', reason: 'standardize workflows' },
      { name: 'Lead Generation Services', reason: 'expand business databases' }
    ],

    packages: {
      starter: {
        name: 'Starter Package',
        price: '$150',
        description: 'Ideal for small administrative data tasks.',
        includes: [
          'up to 200 records entered or updated',
          'spreadsheet or database entry',
          'basic data formatting',
          'accuracy verification'
        ],
        examples: ['CRM contact entry', 'spreadsheet updates', 'product listing data']
      },
      growth: {
        name: 'Growth Package',
        price: '$400',
        description: 'Ideal for businesses managing larger datasets.',
        includes: [
          'up to 800 records entered or updated',
          'spreadsheet or database management',
          'data formatting and organization',
          'accuracy verification and review'
        ],
        examples: ['CRM database updates', 'product catalog entry', 'data consolidation projects']
      },
      premium: {
        name: 'Premium Package',
        price: '$800',
        description: 'Ideal for businesses processing large volumes of information.',
        includes: [
          'up to 2,000 records entered or updated',
          'structured data organization',
          'formatting and data cleanup',
          'verification and quality checks'
        ],
        examples: ['large CRM imports', 'product database updates', 'operational data processing']
      }
    }
  }
};

const ServiceDetailPage = () => {
  const { serviceSlug } = useParams();
  const service = SERVICES_DATA[serviceSlug];

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The requested service could not be located.</p>
          <Link
            to="/services"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Services
          </Link>
        </div>
      </div>
    );
  }

  // Function to generate slug for complementary services
  const getServiceSlug = (serviceName) => {
    const slugMap = {
      'Brand Identity & Logo Design': 'brand-identity',
      'Copywriting & Content Creation': 'copywriting',
      'Social Media Management': 'social-media-management',
      'Website Development': 'website-development',
      'Video Editing & Motion Graphics': 'video-editing',
      'Graphic Design': 'graphic-design',
      'Photography & Visual Assets': 'photography',
      'Paid Advertising Management': 'paid-advertising',
      'Landing Page Development': 'landing-pages',
      'SEO & Search Marketing': 'seo-marketing',
      'Email Marketing Campaigns': 'email-marketing',
      'Lead Generation Services': 'lead-generation',
      'CRM & Marketing Automation': 'crm-automation',
      'API Integration & Automation': 'api-integration',
      'Web Applications & SaaS Development': 'web-applications',
      'Data Analytics & Reporting': 'data-analytics',
      'Process Documentation & SOP Development': 'process-documentation',
      'Virtual Assistant Services': 'virtual-assistant',
      'Project Management Support': 'project-management',
      'Data Entry & Processing': 'data-entry',
      'Website Maintenance & Updates': 'website-maintenance',
      'E-Commerce Development': 'ecommerce-development',
      'Landing Pages & Sales Funnels': 'landing-pages',
      'UI/UX Graphic Design': 'graphic-design'
    };

    return slugMap[serviceName] || serviceName.toLowerCase().replace(/[&\s]/g, '-').replace(/--+/g, '-');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              {service.icon}
            </div>
            <span className="px-4 py-1 bg-white/10 rounded-full text-sm font-medium">
              {service.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {service.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-6">
            {service.intro}
          </p>

          <p className="text-lg text-gray-400 max-w-3xl mb-4">
            {service.longDescription}
          </p>
          <p className="text-sm text-gray-400 max-w-3xl mb-8 font-medium">
            Starting price options are shown during service selection. Custom quotes are available for larger or more detailed projects.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to={`/request-service?service=${serviceSlug}`}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <FaArrowRight className="mr-2" />
              Request This Service
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              <FaHeadset className="mr-2" />
              Talk to a Specialist
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* What This Service Helps Businesses Achieve */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What This Service Helps Businesses Achieve</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.whatItHelpsAchieve.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <FaCheck className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How This Service Is Measured */}
        <section className="mb-16 bg-gray-50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How This Service Is Measured</h2>
          <p className="text-gray-600 mb-4">This ensures transparent pricing and clear deliverables.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {service.howMeasured.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Services Include - UPDATED FROM "What We Offer" */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Services Include</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {service.servicesInclude.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaCheck className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tools & Technologies */}
        {service.tools && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <FaTools className="mr-3 text-gray-700" />
              Tools & Technologies
            </h2>
            <div className="flex flex-wrap gap-3">
              {service.tools.map((tool, index) => (
                <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                  {tool}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Add-On Options */}
        {service.addOnOptions && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add-On Options</h2>
            <p className="text-gray-600 mb-4">Businesses may also request additional services such as:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {service.addOnOptions.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pricing Packages */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Service Packages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.values(service.packages).map((pkg, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-xl shadow-lg border-2 ${index === 1 ? 'border-blue-500 relative' : 'border-gray-200'}`}
              >
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="mb-6">
                    <h4 className="text-2xl font-bold text-gray-900">{pkg.name}</h4>
                    <div className="text-3xl font-bold text-blue-600 mt-2 invisible">{pkg.price}</div>
                    <p className="text-gray-600 mt-2">{pkg.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.includes.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <FaCheck className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {pkg.examples && (
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Examples:</p>
                      <p className="text-xs text-gray-600">{pkg.examples.join(' • ')}</p>
                    </div>
                  )}

                  <Link
                    to={`/request-service?service=${serviceSlug}&package=${pkg.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-center block ${index === 1
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      } transition-colors`}
                  >
                    Choose {pkg.name}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Complementary Services */}
        {service.complementaryServices && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Complementary Services</h2>
            <p className="text-gray-600 mb-6">
              Businesses that order <strong>{service.title}</strong> often also benefit from:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {service.complementaryServices.map((item, index) => {
                const slug = getServiceSlug(item.name);
                return (
                  <Link
                    key={index}
                    to={`/services/${slug}`}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <div>
                      <span className="font-medium text-gray-900 group-hover:text-blue-600">{item.name}</span>
                      <p className="text-xs text-gray-500 mt-1">{item.reason}</p>
                    </div>
                    <FaArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>Save up to 10-20%</strong> when you bundle 2 or more services, or join the ScaleLink Alliance Network.
              </p>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Submit Service Request', desc: 'Fill out our simple request form with your needs' },
              { step: 2, title: 'We Review Your Needs', desc: 'Our specialists analyze requirements and scope' },
              { step: 3, title: 'You Receive a Quote', desc: 'Transparent pricing & timeline delivered' },
              { step: 4, title: 'Work Begins', desc: 'Professional execution with quality checks' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Do I need to be a ScaleLink Alliance member?',
                a: 'No. Services are available to all businesses. Membership is completely optional.'
              },
              {
                q: 'Can members also use services?',
                a: 'Yes. Members receive preferred access and pricing, but services are available to everyone.'
              },
              {
                q: 'Is there a minimum contract?',
                a: 'No. Projects are scoped per request. You can start with a one-time project.'
              },
              {
                q: 'What is the typical turnaround time?',
                a: 'Most projects start within 24-48 hours of approval. Urgent requests can begin same-day.'
              },
              {
                q: 'How do I know which package is right for me?',
                a: 'We offer a free consultation to assess your needs and recommend the best approach.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h4>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-12 bg-gray-50 rounded-2xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Get Professional Results?</h2>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Submit your service request today. No membership required, no commitments — just professional execution.
          </p>
          <p className="text-sm text-gray-500 mb-8 max-w-2xl mx-auto">
            Starting price options are shown during service selection. Custom quotes are available for larger or more detailed projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/request-service?service=${serviceSlug}`}
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <FaArrowRight className="mr-2" />
              Request Service Now
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors"
            >
              <FaHeadset className="mr-2" />
              Schedule Free Consultation
            </Link>
          </div>
        </section>
      </main>
    </motion.div>
  );
};

export default ServiceDetailPage;