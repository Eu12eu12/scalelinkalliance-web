// src/components/sections/PackageComparison.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaClock, FaSyncAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// All features from the service documentation - each as a separate row
export const SERVICE_FEATURES = {
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

// Feature name mapping to match the image format
const FEATURE_LABELS = {
  'Initial SEO audit': 'SEO audit',
  'Keyword research for up to 10 target keywords': 'Keyword research',
  'Optimization of up to 5 priority pages': 'Pages optimized',
  'Basic technical SEO checks': 'Technical SEO improvements',
  'Monthly performance report': 'Monthly performance report',
  'Monthly recommendations': 'Monthly recommendations',
  'Enhanced on-page SEO': 'Advanced keyword strategy',
  'Competitor SEO review': 'Competitor analysis',
  'Backlink opportunity research': 'Backlink development guidance',
  'Monthly strategy review': 'Monthly strategy review',
  'Detailed executive reporting': 'Detailed executive reporting'
};


// Shared source of truth for package inclusions.
// Higher tiers inherit the features of lower tiers whenever the service feature
// catalog contains those tiers. For services that are not in SERVICE_FEATURES,
// fall back to that service's packageComparison rows so every service still gets
// the same long-form package list used by the comparison table.
export const getPackageFeatures = (serviceSlug, tier, packageData = null) => {
  const tierOrder = ['basic', 'standard', 'premium'];
  const tierIndex = tierOrder.indexOf(tier);
  if (tierIndex === -1) return [];

  const serviceFeatures = SERVICE_FEATURES[serviceSlug];

  if (serviceFeatures) {
    const combined = [];
    for (let index = 0; index <= tierIndex; index += 1) {
      const currentTier = tierOrder[index];
      (serviceFeatures[currentTier] || []).forEach((feature) => {
        if (!feature.startsWith('Everything in') && !combined.includes(feature)) {
          combined.push(feature);
        }
      });
    }

    return combined.map((feature) => FEATURE_LABELS[feature] || feature);
  }

  return (packageData?.rows || [])
    .filter((row) => row?.values?.[tier])
    .map((row) => row.label)
    .filter(Boolean);
};

const PackageComparison = ({ packageData, serviceSlug, onTabChange }) => {
  const tierLabels = { basic: 'Basic', standard: 'Standard', premium: 'Premium' };
  const [activeTab, setActiveTab] = useState(packageData.tiers[0]);
  const [includesOpen, setIncludesOpen] = useState(true);
  const activeDetail = packageData.details[activeTab];

  const handleTabChange = (tier) => {
    setActiveTab(tier);
    if (onTabChange) onTabChange(tier);
  };

  const tiers = ['basic', 'standard', 'premium'];
  const tierFeatures = Object.fromEntries(
    tiers.map((tier) => [tier, getPackageFeatures(serviceSlug, tier, packageData)])
  );

  // Build the comparison table from the exact same feature lists shown in
  // the active package detail panel. This keeps both views in sync.
  const allFeatures = [...new Set(
    tiers.flatMap((tier) => tierFeatures[tier] || [])
  )];

  const comparisonRows = allFeatures.map((label) => ({
    label,
    values: {
      basic: tierFeatures.basic.includes(label),
      standard: tierFeatures.standard.includes(label),
      premium: tierFeatures.premium.includes(label)
    }
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[600px] md:min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left p-4 text-sm font-semibold text-gray-700 w-1/4 whitespace-normal break-words"></th>
              {packageData.tiers.map((tier) => {
                const d = packageData.details[tier];
                return (
                  <th 
                    key={tier}
                    className={`text-left p-4 align-top cursor-pointer min-w-[160px] whitespace-normal break-words ${
                      activeTab === tier ? 'border-b-2 border-blue-600' : ''
                    }`}
                    onClick={() => handleTabChange(tier)}
                  >
                    <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      {tierLabels[tier]}
                    </div>
                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
                      {d.packageName}
                    </div>
                    <div className="text-xs text-gray-500 leading-relaxed normal-case font-normal mt-1">
                      {d.shortDescription}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, idx) => (
              <tr 
                key={idx} 
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}
              >
                <td className="p-3 text-sm text-gray-700 border-b border-gray-100 whitespace-normal break-words">
                  {row.label}
                </td>
                {packageData.tiers.map((tier) => (
                  <td key={tier} className="p-3 border-b border-gray-100 whitespace-normal break-words">
                    <FaCheck
                      className={row.values[tier] ? 'text-green-600' : 'text-gray-300'}
                      size={16}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right side detail panel - now below the table */}
      <div className="p-6 border-t border-gray-200 bg-gray-50/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {packageData.tiers.map((tier) => (
              <button
                key={tier}
                onClick={() => handleTabChange(tier)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                  activeTab === tier
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {tierLabels[tier]}
              </button>
            ))}
          </div>
          <span className="text-lg font-bold text-gray-900">{activeDetail.price}</span>
        </div>

        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
          <span className="font-semibold">{activeDetail.packageName}</span>{' '}
          {activeDetail.shortDescription}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1.5">
            <FaClock size={13} />
            {activeDetail.deliveryLabel}
          </span>
          {activeDetail.revisions && (
            <span className="flex items-center gap-1.5">
              <FaSyncAlt size={12} />
              {activeDetail.revisions}
            </span>
          )}
        </div>

        <button
          onClick={() => setIncludesOpen(!includesOpen)}
          className="w-full flex items-center justify-between py-2.5 border-t border-gray-200 text-left"
        >
          <span className="text-sm font-semibold text-gray-900">What's Included</span>
          {includesOpen
            ? <FaChevronUp size={14} className="text-gray-500" />
            : <FaChevronDown size={14} className="text-gray-500" />
          }
        </button>

        {includesOpen && (
          <ul className="space-y-1.5 mt-3 pb-1 max-h-[300px] overflow-y-auto">
            {getPackageFeatures(serviceSlug, activeTab, packageData).map((item, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-700">
                <FaCheck className="text-green-600 mr-2.5 mt-0.5 shrink-0" size={12} />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PackageComparison;