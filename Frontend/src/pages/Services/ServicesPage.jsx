// src/pages/Services/ServicesPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaPaintBrush, FaVideo, FaPenNib, FaCogs, FaChartBar, FaDatabase,
  FaFileAlt, FaUsers, FaCheck, FaArrowRight, FaCode, FaGlobe,
  FaShoppingCart, FaRocket, FaAd, FaEnvelope, FaSearch, FaHeadset,
  FaProjectDiagram, FaCamera, FaPalette, FaCloudUploadAlt,
  FaShieldAlt, FaRegBuilding, FaChartLine, FaInfoCircle
} from 'react-icons/fa';

const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // All services from the documentation
  const services = [
    // Creative & Content Services (5)
    {
      id: 1,
      slug: 'graphic-design',
      name: 'Graphic Design',
      category: 'creative',
      icon: <FaPaintBrush />,
      description: 'Strong visual design helps businesses communicate clearly, attract attention, and create a professional brand presence.',
      startingPrice: '$35',
      features: [
        'Social media graphics',
        'Marketing flyers and posters',
        'Business cards and stationery',
        'Presentation and report visuals',
        'Advertising graphics and banners'
      ],
      whatItHelps: [
        'create professional marketing materials',
        'strengthen brand recognition',
        'improve the visual impact of marketing campaigns',
        'communicate ideas clearly through visuals',
        'build a consistent brand image across platforms'
      ],
      packages: {
        starter: { price: '$35', includes: '1 graphic design asset, 1 revision, web-ready files' },
        growth: { price: '$175', includes: 'up to 5 graphic design assets, 2 revision rounds' },
        premium: { price: '$499', includes: 'up to 10 graphic design assets, priority revisions' }
      }
    },
    {
      id: 2,
      slug: 'video-editing',
      name: 'Video Editing & Motion Graphics',
      category: 'creative',
      icon: <FaVideo />,
      description: 'Video content is one of the most powerful ways to capture attention and engage audiences. Transform raw footage into polished visual stories.',
      startingPrice: '$75',
      features: [
        'Promotional videos',
        'Social media video edits',
        'Motion graphics and animations',
        'Video branding elements',
        'Short-form marketing videos'
      ],
      whatItHelps: [
        'social media marketing',
        'promotional videos',
        'product demonstrations',
        'business presentations',
        'online advertising',
        'website video content'
      ],
      packages: {
        starter: { price: '$75', includes: '1 video up to 60 seconds, basic cuts, music, simple motion graphics' },
        growth: { price: '$225', includes: '3 videos up to 90 seconds each, branded intro/outro, motion graphics' },
        premium: { price: '$599', includes: '5 videos up to 2 minutes each, advanced motion graphics, color grading' }
      }
    },
    {
      id: 3,
      slug: 'copywriting',
      name: 'Copywriting & Content Creation',
      category: 'creative',
      icon: <FaPenNib />,
      description: 'Clear and persuasive content is essential for turning visitors into customers. Our copywriting services help you communicate your value.',
      startingPrice: '$75',
      features: [
        'Website content',
        'Marketing copy',
        'Blog articles',
        'Social media captions',
        'Email marketing content'
      ],
      whatItHelps: [
        'website pages',
        'blog articles',
        'marketing campaigns',
        'email newsletters',
        'social media captions',
        'product descriptions',
        'advertising copy'
      ],
      packages: {
        starter: { price: '$75', includes: '1 content piece up to 800 words, basic keyword research, 1 revision' },
        growth: { price: '$225', includes: '3 content pieces up to 1,000 words each, SEO-friendly formatting, 2 revisions' },
        premium: { price: '$599', includes: '6 content pieces up to 1,200 words each, SEO optimization, brand voice alignment' }
      }
    },
    {
      id: 4,
      slug: 'brand-identity',
      name: 'Brand Identity & Logo Design',
      category: 'creative',
      icon: <FaPalette />,
      description: 'Your brand identity is the visual foundation of your business. A well-designed logo and consistent brand system help customers recognize your company.',
      startingPrice: '$199',
      features: [
        'Custom logo design',
        'Brand color palette',
        'Typography selection',
        'Brand style guide',
        'Visual brand assets'
      ],
      whatItHelps: [
        'establish a recognizable brand',
        'maintain visual consistency across platforms',
        'improve marketing effectiveness',
        'create a professional first impression',
        'strengthen customer trust and credibility'
      ],
      packages: {
        starter: { price: '$199', includes: '1 custom logo concept, basic color palette, 1 revision, PNG + SVG files' },
        growth: { price: '$499', includes: '3 logo concepts, color palette, typography, 2 revisions, multiple formats' },
        premium: { price: '$999', includes: '3-4 logo concepts, complete brand style guide, unlimited revisions' }
      }
    },
    {
      id: 5,
      slug: 'photography',
      name: 'Photography & Visual Assets',
      category: 'creative',
      icon: <FaCamera />,
      description: 'High-quality visual imagery plays a critical role in how businesses present themselves to customers. Professional photos strengthen brand credibility.',
      startingPrice: '$199',
      features: [
        'Business and team photography',
        'Product photography',
        'Website imagery',
        'Marketing visuals',
        'Promotional image assets'
      ],
      whatItHelps: [
        'present a professional brand image',
        'showcase products and services visually',
        'improve website and social media engagement',
        'strengthen marketing campaigns',
        'build a recognizable visual identity'
      ],
      packages: {
        starter: { price: '$199', includes: '10 professionally edited photos, 1 location, basic editing, web-ready files' },
        growth: { price: '$499', includes: '25 professionally edited photos, multiple scenes, retouching, high-res formats' },
        premium: { price: '$999', includes: '50 professionally edited photos, multi-scene session, advanced retouching' }
      },
    },

    // Tech & Development Services (6)
    {
      id: 6,
      slug: 'website-development',
      name: 'Website Development',
      category: 'tech',
      icon: <FaCode />,
      description: 'Your website is often the first place potential customers learn about your business. A well-designed website builds credibility and communicates your value.',
      startingPrice: '$699',
      features: [
        'Custom website design',
        'Mobile-friendly layout',
        'Basic SEO setup',
        'Contact and lead capture forms',
        'Website launch support'
      ],
      whatItHelps: [
        'establish an online presence',
        'showcase services and products',
        'capture leads and inquiries',
        'support marketing campaigns',
        'provide information to customers'
      ],
      packages: {
        starter: { price: '$699', includes: 'up to 3 website pages, responsive design, contact form, basic SEO' },
        growth: { price: '$1,499', includes: 'up to 7 website pages, advanced layout, marketing tool integration' },
        premium: { price: '$3,499', includes: 'up to 12 website pages, blog setup, advanced forms, SEO-ready' }
      }
    },
    {
      id: 7,
      slug: 'landing-pages',
      name: 'Landing Pages & Sales Funnels',
      category: 'tech',
      icon: <FaRocket />,
      description: 'Landing pages and sales funnels are designed to turn visitors into leads and customers. They focus on a single goal: encouraging visitors to take action.',
      startingPrice: '$499',
      features: [
        'Conversion-focused landing page design',
        'Lead capture forms',
        'Marketing funnel integration',
        'Analytics setup',
        'Call-to-action optimization'
      ],
      whatItHelps: [
        'generate leads',
        'promote products or services',
        'run marketing campaigns',
        'capture email subscribers',
        'guide visitors through a sales process'
      ],
      packages: {
        starter: { price: '$499', includes: '1 landing page, lead capture form, mobile-responsive, analytics' },
        growth: { price: '$1,299', includes: '3-page sales funnel, conversion-focused design, email integration' },
        premium: { price: '$2,499', includes: 'complete 5-page funnel, advanced integrations, conversion optimization' }
      }
    },
    {
      id: 8,
      slug: 'ecommerce-development',
      name: 'E-Commerce Development',
      category: 'tech',
      icon: <FaShoppingCart />,
      description: 'E-commerce platforms allow businesses to sell products online, reach a broader audience, and manage transactions efficiently.',
      startingPrice: '$999',
      features: [
        'Online store setup',
        'Product page design',
        'Payment gateway integration',
        'Shopping cart configuration',
        'Order management tools'
      ],
      whatItHelps: [
        'sell products online',
        'manage inventory and orders',
        'accept secure payments',
        'expand to new markets',
        'automate order processing'
      ],
      packages: {
        starter: { price: '$999', includes: 'store setup with up to 10 products, payment gateway, shipping setup' },
        growth: { price: '$2,499', includes: 'store with up to 50 products, categories, customer accounts' },
        premium: { price: '$4,999', includes: 'store with up to 100 products, advanced design, product filtering' }
      }
    },
    {
      id: 9,
      slug: 'web-applications',
      name: 'Web Applications & SaaS Development',
      category: 'tech',
      icon: <FaGlobe />,
      description: 'Custom web applications and SaaS platforms allow businesses to streamline operations, automate workflows, and create digital tools that support growth.',
      startingPrice: '$4,999',
      features: [
        'Custom web application development',
        'SaaS platform development',
        'System integrations',
        'Workflow automation tools',
        'Database integration'
      ],
      whatItHelps: [
        'internal business management systems',
        'client portals and dashboards',
        'workflow automation tools',
        'subscription-based software platforms',
        'online booking and scheduling systems',
        'data management platforms'
      ],
      packages: {
        starter: { price: '$4,999', includes: '1 custom feature/module, database setup, user login system' },
        growth: { price: '$14,999', includes: 'multi-feature application (up to 3 modules), user accounts, workflow automation' },
        premium: { price: '$29,999', includes: 'complete SaaS structure, multiple user roles, API integrations' }
      }
    },
    {
      id: 10,
      slug: 'api-integration',
      name: 'API Integration & Automation',
      category: 'tech',
      icon: <FaCloudUploadAlt />,
      description: 'Modern businesses rely on multiple digital tools. API integrations connect your systems and automate repetitive workflows.',
      startingPrice: '$499',
      features: [
        'System integrations',
        'Data synchronization',
        'Workflow automation',
        'API configuration',
        'Integration troubleshooting'
      ],
      whatItHelps: [
        'connect software platforms',
        'reduce manual data entry',
        'improve workflow efficiency',
        'ensure accurate data synchronization',
        'streamline operations'
      ],
      packages: {
        starter: { price: '$499', includes: '1 system integration, basic data synchronization, simple workflow automation' },
        growth: { price: '$1,499', includes: 'up to 3 system integrations, workflow automation, data synchronization' },
        premium: { price: '$3,999', includes: 'multiple integrations, advanced workflow automation, API configuration' }
      }
    },
    {
      id: 11,
      slug: 'website-maintenance',
      name: 'Website Maintenance & Updates',
      category: 'tech',
      icon: <FaShieldAlt />,
      description: 'A website requires regular updates, monitoring, and maintenance to remain secure, functional, and effective.',
      startingPrice: '$149/month',
      features: [
        'Website updates and patches',
        'Security monitoring',
        'Performance checks',
        'Content updates',
        'Technical support'
      ],
      whatItHelps: [
        'keep website secure and up to date',
        'fix technical issues quickly',
        'update website content when needed',
        'maintain website performance',
        'ensure site supports marketing efforts'
      ],
      packages: {
        starter: { price: '$149/month', includes: 'up to 2 hours maintenance, security monitoring, minor updates' },
        growth: { price: '$349/month', includes: 'up to 5 hours maintenance, content updates, performance optimization' },
        premium: { price: '$899/month', includes: 'up to 10 hours maintenance, priority support, advanced security' }
      },
    },

    // Marketing & Growth Services (6)
    {
      id: 12,
      slug: 'social-media-management',
      name: 'Social Media Management',
      category: 'marketing',
      icon: <FaUsers />,
      description: 'Social media platforms are effective ways for businesses to connect with customers, promote services, and build brand awareness.',
      startingPrice: '$299/month',
      features: [
        'Content posting and scheduling',
        'Social media graphics',
        'Audience engagement',
        'Performance insights',
        'Caption writing'
      ],
      whatItHelps: [
        'increase brand visibility',
        'engage with customers',
        'promote products and services',
        'maintain consistent content presence',
        'support marketing campaigns'
      ],
      packages: {
        starter: { price: '$299/month', includes: '8 posts per month, content scheduling, engagement monitoring' },
        growth: { price: '$599/month', includes: '15 posts per month, graphic content, monthly report' },
        premium: { price: '$1,499/month', includes: '30 posts per month, custom graphics, detailed reporting' }
      }
    },
    {
      id: 13,
      slug: 'seo-marketing',
      name: 'SEO & Search Marketing',
      category: 'marketing',
      icon: <FaSearch />,
      description: 'Search Engine Optimization helps your business appear when potential customers search online for services related to your industry.',
      startingPrice: '$399/month',
      features: [
        'Keyword research',
        'On-page SEO optimization',
        'Technical SEO improvements',
        'Content recommendations',
        'Search performance tracking'
      ],
      whatItHelps: [
        'increase website visibility',
        'attract targeted organic traffic',
        'improve search rankings',
        'strengthen online authority',
        'generate more inquiries'
      ],
      packages: {
        starter: { price: '$399/month', includes: 'SEO audit, optimization of 5 pages, keyword research' },
        growth: { price: '$899/month', includes: 'optimization of 15 pages, technical SEO, monthly report' },
        premium: { price: '$1,999/month', includes: 'optimization of 30+ pages, backlink guidance, strategy' }
      }
    },
    {
      id: 14,
      slug: 'paid-advertising',
      name: 'Paid Advertising Management',
      category: 'marketing',
      icon: <FaAd />,
      description: 'Paid advertising can quickly generate leads and increase brand visibility. We create targeted campaigns designed to maximize ROI.',
      startingPrice: '$399/month',
      features: [
        'Google Ads management',
        'Social media advertising',
        'Audience targeting',
        'Campaign performance optimization',
        'Monthly reporting'
      ],
      whatItHelps: [
        'reach new customers quickly',
        'generate leads',
        'increase brand visibility',
        'target specific audiences',
        'maximize marketing budget'
      ],
      packages: {
        starter: { price: '$399/month', includes: '1 ad campaign, audience targeting, monthly report' },
        growth: { price: '$899/month', includes: '3 campaigns, audience targeting, monthly report' },
        premium: { price: '$1,999/month', includes: 'full ad management, 10 campaigns, audience targeting' }
      }
    },
    {
      id: 15,
      slug: 'email-marketing',
      name: 'Email Marketing Campaigns',
      category: 'marketing',
      icon: <FaEnvelope />,
      description: 'Email marketing remains one of the most effective ways for businesses to communicate directly with their audience.',
      startingPrice: '$199',
      features: [
        'Email campaign design',
        'Newsletter creation',
        'Marketing automation setup',
        'Customer engagement emails',
        'Campaign performance tracking'
      ],
      whatItHelps: [
        'maintain regular customer communication',
        'promote products and announcements',
        'nurture leads and prospects',
        'increase customer engagement',
        'encourage repeat business'
      ],
      packages: {
        starter: { price: '$199', includes: '1 email campaign, template design, mailing list integration' },
        growth: { price: '$499', includes: '3 email campaigns, audience segmentation, performance tracking' },
        premium: { price: '$999', includes: '6 email campaigns, custom templates, strategy recommendations' }
      }
    },
    {
      id: 16,
      slug: 'lead-generation',
      name: 'Lead Generation Services',
      category: 'marketing',
      icon: <FaRegBuilding />,
      description: 'Consistent lead generation is essential for business growth. We help identify and connect you with qualified prospects.',
      startingPrice: '$199',
      features: [
        'Target audience identification',
        'Lead sourcing and research',
        'Outreach strategies',
        'Prospect qualification',
        'Lead list delivery'
      ],
      whatItHelps: [
        'identify potential customers',
        'build consistent sales pipeline',
        'expand outreach opportunities',
        'connect with targeted prospects',
        'support sales efforts'
      ],
      packages: {
        starter: { price: '$199', includes: '25 targeted leads, basic qualification, contact information' },
        growth: { price: '$599', includes: '100 leads, advanced qualification, enriched data' },
        premium: { price: '$1,499', includes: '220 leads, monthly lead updates, full qualification' }
      }
    },
    {
      id: 17,
      slug: 'crm-automation',
      name: 'CRM & Marketing Automation',
      category: 'marketing',
      icon: <FaCogs />,
      description: 'CRM systems, funnels, and automations that capture leads and improve conversion efficiency.',
      startingPrice: '$499',
      features: [
        'CRM setup and customization',
        'Sales funnel development',
        'Email automation sequences',
        'Lead tracking and scoring',
        'Integration with existing tools'
      ],
      whatItHelps: [
        'manage customer relationships',
        'automate marketing workflows',
        'track leads and conversions',
        'improve sales efficiency',
        'scale customer engagement'
      ],
      packages: {
        starter: { price: '$499', includes: 'CRM setup, basic automation, lead capture forms' },
        growth: { price: '$1,499', includes: 'full CRM customization, email automation, lead scoring' },
        premium: { price: '$2,999', includes: 'complete marketing automation, multi-channel sequences, reporting' }
      },
    },

    // Operations & Support Services (5)
    {
      id: 18,
      slug: 'virtual-assistant',
      name: 'Virtual Assistant Services',
      category: 'operations',
      icon: <FaHeadset />,
      description: 'Administrative and operational tasks can take valuable time away from strategic work. Virtual assistants help manage routine tasks efficiently.',
      startingPrice: '$149/month',
      features: [
        'Email and calendar management',
        'Data entry',
        'Administrative support',
        'Task coordination',
        'Customer support assistance'
      ],
      whatItHelps: [
        'reduce administrative workload',
        'improve task organization',
        'support daily operations',
        'manage communication',
        'free up time for business owners'
      ],
      packages: {
        starter: { price: '$149/month', includes: 'up to 5 hours support, email management, scheduling' },
        growth: { price: '$399/month', includes: 'up to 15 hours support, administrative tasks, customer communication' },
        premium: { price: '$999/month', includes: 'up to 40 hours support, full administrative management' }
      }
    },
    {
      id: 19,
      slug: 'data-analytics',
      name: 'Data Analytics & Reporting',
      category: 'operations',
      icon: <FaChartLine />,
      description: 'Data analytics helps businesses understand performance, identify trends, and make better strategic decisions.',
      startingPrice: '$199/month',
      features: [
        'Data analysis',
        'Business performance reports',
        'Dashboard creation',
        'Insight recommendations',
        'KPI tracking'
      ],
      whatItHelps: [
        'understand key performance metrics',
        'identify trends in sales and marketing',
        'make informed business decisions',
        'track marketing performance',
        'improve overall efficiency'
      ],
      packages: {
        starter: { price: '$199/month', includes: '1 custom data report, basic analysis, visual charts' },
        growth: { price: '$699/month', includes: '3 custom reports, dashboards, trend analysis, recommendations' },
        premium: { price: '$1,999/month', includes: 'custom analytics dashboard, multiple reports, strategic insights' }
      }
    },
    {
      id: 20,
      slug: 'process-documentation',
      name: 'Process Documentation & SOP Development',
      category: 'operations',
      icon: <FaFileAlt />,
      description: 'Clear processes are essential for businesses that want to operate efficiently and scale effectively.',
      startingPrice: '$400',
      features: [
        'Workflow mapping',
        'SOP documentation',
        'Process improvement recommendations',
        'Operational guidelines',
        'Process diagrams'
      ],
      whatItHelps: [
        'standardize workflows',
        'improve team efficiency',
        'simplify employee training',
        'reduce operational errors',
        'create systems that support growth'
      ],
      packages: {
        starter: { price: '$400', includes: '1 documented workflow, step-by-step SOP, process map' },
        growth: { price: '$1,200', includes: '3 documented workflows, SOP documents, process diagrams' },
        premium: { price: '$3,500', includes: '6+ documented workflows, complete SOP manual, operations guide' }
      }
    },
    {
      id: 21,
      slug: 'project-management',
      name: 'Project Management Support',
      category: 'operations',
      icon: <FaProjectDiagram />,
      description: 'Successful projects require organization, coordination, and clear communication between team members.',
      startingPrice: '$499',
      features: [
        'Project planning and scheduling',
        'Task coordination',
        'Progress tracking',
        'Team communication support',
        'Project reporting'
      ],
      whatItHelps: [
        'keep projects organized',
        'coordinate tasks',
        'improve team communication',
        'track project milestones',
        'ensure project completion'
      ],
      packages: {
        starter: { price: '$499', includes: 'management of 1 project, timeline planning, progress tracking' },
        growth: { price: '$1,499', includes: 'management of up to 3 project phases, milestone tracking' },
        premium: { price: '$3,499', includes: 'comprehensive project management, full oversight, reporting' }
      }
    },
    {
      id: 22,
      slug: 'data-entry',
      name: 'Data Entry & Processing',
      category: 'operations',
      icon: <FaDatabase />,
      description: 'Accurate and organized data is essential for efficient business operations. We help manage large volumes of information.',
      startingPrice: '$99',
      features: [
        'Database management',
        'Data cleansing and validation',
        'Spreadsheet organization',
        'Record keeping',
        'Data migration'
      ],
      whatItHelps: [
        'organize business information',
        'maintain accurate records',
        'reduce administrative workload',
        'improve data accessibility',
        'support operational processes'
      ],
      packages: {
        starter: { price: '$99', includes: 'up to 200 records, spreadsheet entry, basic formatting' },
        growth: { price: '$299', includes: 'up to 800 records, database management, data organization' },
        premium: { price: '$799', includes: 'up to 2,000 records, data cleanup, verification, quality checks' }
      },
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'creative', name: 'Creative & Content' },
    { id: 'tech', name: 'Tech & Development' },
    { id: 'marketing', name: 'Marketing & Growth' },
    { id: 'operations', name: 'Operations & Support' }
  ];

  const customQuoteCard = {
    id: 'custom-quote-card',
    slug: 'custom-quote',
    name: 'Request Custom Quote',
    category: 'all',
    icon: <FaCogs />,
    description: 'Need a specialized solution or looking to combine multiple services? Request a custom quote tailored to your business goals.',
    startingPrice: 'Custom Quote',
    features: ['Personalized consultation', 'Custom scope definition', 'Tailored solution', 'Flexible pricing'],
    whatItHelps: [
      'tailored solutions for unique project requirements',
      'combining multiple services into one custom package',
      'specialized scopes, timelines, and support levels',
      'seamless execution across different business areas'
    ],
    packages: { starter: { price: 'Custom Quote', includes: 'Personalized quote based on your specific needs' } }
  };

  const filteredServices = [
    ...(activeCategory === 'all'
      ? services
      : services.filter(service => service.category === activeCategory)),
    customQuoteCard
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-black py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                ScaleLink Alliance Services
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Professional business & marketing services designed to help you grow — no membership required.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Important Clarifier */}
      <section className="py-12 bg-yellow-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 rounded-r-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                🚨 Important Clarification
              </h3>
              <p className="text-gray-800 mb-3">
                You can <strong>request a custom quote to get a solution built around your business.</strong> Some projects
                require a custom quote because every business has different goals, needs, timelines, and support levels.
              </p>
              <a
                href="#custom-solutions"
                className="inline-flex items-center text-blue-700 font-semibold hover:text-blue-900 transition-colors"
              >
                Read More <FaArrowRight className="ml-2" size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Our Service Categories
            </h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-6 font-medium text-lg">
              Explore our services below.
            </p>
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 border-l-4 border-l-blue-500 rounded-r-xl rounded-l-md max-w-2xl mx-auto mb-8 text-left shadow-sm transition-all duration-300 hover:shadow-md">
              <FaInfoCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
              <p className="text-sm leading-relaxed text-blue-800 font-medium">
                <span className="font-semibold text-blue-950">Starting price options</span> are shown during service selection. <span className="font-semibold text-blue-950">Custom quotes</span> are available for larger or more detailed projects.
              </p>
            </div>

            {/* Problem Navigation Callout */}
            <div className="max-w-2xl mx-auto mb-12 text-center">
              <Link 
                to="/services/guide-by-problem"
                className="inline-flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-sm hover:shadow-md hover:scale-102 transition-all duration-300 group text-left w-full"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:rotate-6 transition-transform">
                  <FaInfoCircle size={22} />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors">
                    Not Sure What Service You Need? Start With the Problem
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Navigate our services based on your business challenges & goals
                  </p>
                </div>
                <FaArrowRight className="text-blue-600 ml-auto group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden flex flex-col h-full"
                >
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-white text-xl shrink-0">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                    </div>

                    <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">What this helps achieve:</h4>
                      <ul className="space-y-1">
                        {service.whatItHelps.map((item, idx) => (
                          <li key={idx} className="flex items-start text-xs">
                            <FaCheck className="text-green-500 mt-0.5 mr-2 shrink-0" size={10} />
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>


                    <div className="flex flex-col gap-2 mt-auto">
                      {service.slug.includes('custom-quote') ? (
                        <div className="py-2.5 bg-gray-100 text-gray-400 font-semibold rounded-lg text-center text-sm cursor-not-allowed">
                          Detailed Breakdown via Form
                        </div>
                      ) : (
                        <Link
                          to={`/services/${service.slug}`}
                          className="py-2.5 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all text-center text-sm"
                        >
                          View Service Details
                        </Link>
                      )}
                      <Link
                        to={service.slug === 'custom-quote' ? '/request-service' : `/request-service?service=${service.slug}`}
                        className="py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center text-sm"
                      >
                        Request This Service
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Custom Solutions Section */}
      <section id="custom-solutions" className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Custom Solutions</h2>
            <p className="text-gray-700 mb-4">
              You can <strong>request a custom quote to get a solution built around your business.</strong> Some projects
              require a custom quote because every business has different goals, needs, timelines, and support levels.
            </p>
            <p className="text-gray-700 mb-6">
              With a custom quote, you can benefit from:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-3 shrink-0" size={14} />
                <span className="text-gray-700"><strong>More accurate pricing</strong> based on your actual project scope</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-3 shrink-0" size={14} />
                <span className="text-gray-700"><strong>A solution built around your business goals</strong></span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-3 shrink-0" size={14} />
                <span className="text-gray-700"><strong>Flexibility for larger or more detailed projects</strong></span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-3 shrink-0" size={14} />
                <span className="text-gray-700"><strong>Better service recommendations</strong> based on what you need most</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-3 shrink-0" size={14} />
                <span className="text-gray-700"><strong>One company handling multiple areas</strong>, including web design, SEO, social media, marketing, and support</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-3 shrink-0" size={14} />
                <span className="text-gray-700"><strong>Free from</strong> the stress of <strong>managing separate freelancers or providers</strong></span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/request-service"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Request Custom Quote
              </Link>
              <Link
                to="/membership"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors text-center"
              >
                Learn About Membership
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              How Our Service Process Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                {
                  step: 1,
                  title: 'Request Service',
                  description: 'Submit service request with your needs and goals'
                },
                {
                  step: 2,
                  title: 'Needs Review',
                  description: 'We review and define scope with clear recommendations'
                },
                {
                  step: 3,
                  title: 'Receive Quote',
                  description: 'Get transparent pricing with defined deliverables'
                },
                {
                  step: 4,
                  title: 'Execution',
                  description: 'Specialists begin work with quality checks'
                },
                {
                  step: 5,
                  title: 'Delivery',
                  description: 'Receive completed work with revision options'
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Service FAQ
            </h3>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: Do I need to be a ScaleLink Alliance member?
                </h4>
                <p className="text-gray-600">
                  <strong>A:</strong> No. Services are available to all businesses. Membership is completely optional.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: Can members also use services?
                </h4>
                <p className="text-gray-600">
                  <strong>A:</strong> Yes. Members receive preferred access and pricing, but services are available to everyone.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: Is there a minimum contract?
                </h4>
                <p className="text-gray-600">
                  <strong>A:</strong> No. Projects are scoped per request. You can start with a one-time project.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: How are services measured?
                </h4>
                <p className="text-gray-600">
                  <strong>A:</strong> Each service has clear measurement criteria—number of assets, pages, hours, or leads—ensuring transparent pricing and deliverables.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                <strong>Not sure which service best fits your needs?</strong>
              </p>
              <p className="text-gray-600 mb-6">
                Tell us about your goals, and we'll recommend the right solution for your business.
              </p>
              <Link
                to="/contact"
                className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Request a Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Get Professional Work Done?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Submit your service request today. No membership required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/request-service"
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Request Service Now</span>
                <FaArrowRight />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;