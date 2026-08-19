// src/pages/ScaleExistingWebsite.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaShieldAlt, FaSearch, FaRegBuilding, FaAd, FaEnvelope,
  FaUsers, FaCogs, FaCloudUploadAlt, FaRobot, FaChartLine,
  FaHeadset, FaProjectDiagram, FaArrowRight, FaCheckCircle,
  FaRocket, FaStar, FaClock, FaDatabase, FaBriefcase
} from 'react-icons/fa';

const services = [
  {
    slug: 'website-maintenance',
    name: 'Website Maintenance & Updates',
    icon: <FaShieldAlt />,
    gradient: 'from-slate-500 to-slate-700',
    description: 'Keep your website secure, fast, and up to date with regular maintenance, content updates, and performance monitoring.',
    bestFor: 'Businesses with existing sites needing ongoing care',
    includes: ['Up to 10 hrs/month maintenance', 'Security monitoring', 'Content updates', 'Priority support'],
  },
  {
    slug: 'seo-marketing',
    name: 'SEO & Search Marketing',
    icon: <FaSearch />,
    gradient: 'from-green-500 to-emerald-700',
    description: 'Improve your search rankings so the right customers find you first — organic traffic that keeps growing over time.',
    bestFor: 'Businesses wanting more organic website visitors',
    includes: ['30+ page optimization', 'Keyword strategy', 'Technical SEO', 'Monthly reporting'],
  },
  {
    slug: 'lead-generation',
    name: 'Lead Generation Services',
    icon: <FaRegBuilding />,
    gradient: 'from-blue-500 to-blue-700',
    description: 'A steady flow of qualified prospects delivered to your pipeline so your sales team always has someone to talk to.',
    bestFor: 'Businesses needing a consistent sales pipeline',
    includes: ['Up to 220 targeted leads', 'Advanced qualification', 'Monthly updates', 'Outreach support'],
  },
  {
    slug: 'paid-advertising',
    name: 'Paid Advertising Management',
    icon: <FaAd />,
    gradient: 'from-cyan-500 to-cyan-700',
    description: 'ROI-driven ad campaigns on Google and social platforms — targeted to your audience and optimized for results.',
    bestFor: 'Businesses wanting fast, measurable traffic and leads',
    includes: ['Up to 10 campaigns', 'Multi-platform ads', 'Audience targeting', 'Weekly reporting'],
  },
  {
    slug: 'email-marketing',
    name: 'Email Marketing Campaigns',
    icon: <FaEnvelope />,
    gradient: 'from-violet-500 to-violet-700',
    description: 'Professional email campaigns that nurture leads, promote offers, and keep your audience engaged with your brand.',
    bestFor: 'Businesses with an existing email list to activate',
    includes: ['Up to 6 campaigns', 'Custom templates', 'Audience segmentation', 'Performance reporting'],
  },
  {
    slug: 'social-media-management',
    name: 'Social Media Management',
    icon: <FaUsers />,
    gradient: 'from-pink-500 to-rose-600',
    description: 'Consistent, professional social media presence — content, scheduling, graphics, and engagement handled for you.',
    bestFor: 'Businesses wanting steady social media growth',
    includes: ['30 posts/month', 'Custom graphics', 'Caption strategy', 'Detailed reporting'],
  },
  {
    slug: 'crm-automation',
    name: 'CRM & Marketing Automation',
    icon: <FaCogs />,
    gradient: 'from-indigo-500 to-indigo-700',
    description: 'Set up automated workflows that capture leads, send follow-ups, score prospects, and manage your pipeline — without manual effort.',
    bestFor: 'Businesses losing leads to slow or inconsistent follow-up',
    includes: ['Full CRM setup', 'Email automation', 'Lead scoring', 'Pipeline management'],
  },
  {
    slug: 'api-integration',
    name: 'API Integration & Automation',
    icon: <FaCloudUploadAlt />,
    gradient: 'from-teal-500 to-teal-700',
    description: 'Connect your tools so data flows automatically between your CRM, website, marketing platforms, and more.',
    bestFor: 'Businesses spending time on manual data transfers',
    includes: ['Multiple integrations', 'Workflow automation', 'API configuration', 'Documentation'],
  },
  {
    slug: 'ai-automation',
    name: 'AI Automation Systems',
    icon: <FaRobot />,
    gradient: 'from-purple-600 to-purple-800',
    description: 'Custom AI workflows that handle follow-up, customer support, reporting, and repetitive tasks — so your team focuses on what matters.',
    bestFor: 'Businesses wanting to reduce manual workload with AI',
    includes: ['Custom AI workflow design', 'CRM integration', 'Notification routing', 'Ongoing tuning'],
    badge: 'New'
  },
  {
    slug: 'data-analytics',
    name: 'Data Analytics & Reporting',
    icon: <FaChartLine />,
    gradient: 'from-amber-500 to-orange-600',
    description: 'Turn your business data into clear, actionable reports and dashboards so you always know what\'s working and what to improve.',
    bestFor: 'Businesses making decisions without clear data',
    includes: ['Up to 7 custom reports', 'Analytics dashboard', 'Trend analysis', 'Strategic insights'],
  },
  {
    slug: 'virtual-assistant',
    name: 'Virtual Assistant Services',
    icon: <FaHeadset />,
    gradient: 'from-sky-500 to-sky-700',
    description: 'Experienced virtual assistants who handle administrative tasks, scheduling, customer communication, and daily operations.',
    bestFor: 'Business owners overwhelmed with admin work',
    includes: ['Up to 40 hrs/month', 'Email & calendar management', 'Customer communication', 'Task reporting'],
  },
  {
    slug: 'project-management',
    name: 'Project Management Support',
    icon: <FaProjectDiagram />,
    gradient: 'from-lime-500 to-green-600',
    description: 'Professional project coordination to keep your initiatives on schedule, on budget, and properly communicated across your team.',
    bestFor: 'Businesses running complex or multi-phase projects',
    includes: ['Full project oversight', 'Milestone tracking', 'Team coordination', 'Progress reporting'],
  },
];

const outcomes = [
  { icon: <FaSearch />, stat: 'More Traffic', desc: 'SEO and paid ads drive the right visitors to your existing site' },
  { icon: <FaRocket />, stat: 'More Leads', desc: 'Optimized funnels and automation capture and convert more prospects' },
  { icon: <FaCogs />, stat: 'Less Manual Work', desc: 'CRM and AI automation handle the tasks your team shouldn\'t be doing' },
  { icon: <FaChartLine />, stat: 'Clearer Data', desc: 'Analytics and reporting show exactly what\'s working and what to improve' },
];

const ScaleExistingWebsite = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-emerald-950 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-600/20 border border-green-500/30 text-green-300 text-sm font-semibold rounded-full mb-6">
                <FaChartLine className="text-xs" /> Already Have a Website?
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Turn Your Existing Website
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200 mt-1">
                  Into a Growth Engine
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                Already have a website but not getting the results you want? We help you optimize, market, automate, and scale what you already have — driving more traffic, leads, and revenue without starting over.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/request-service?path=scale_existing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-xl shadow-green-900/40"
                >
                  Scale My Website <FaArrowRight />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                >
                  Talk to a Specialist
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Outcomes strip */}
      <section className="py-12 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {outcomes.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3 text-lg">
                  {item.icon}
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">{item.stat}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Choose How You Want to Scale
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Pick one service to start or combine several into a standard package. Every service is tailored to your existing setup and goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Gradient header */}
                  <div className={`bg-gradient-to-r ${service.gradient} p-5 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white text-lg">
                        {service.icon}
                      </div>
                      <h3 className="text-white font-bold text-sm leading-snug">{service.name}</h3>
                    </div>
                    {service.badge && (
                      <span className="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full shrink-0">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Best for</p>
                    <p className="text-xs text-gray-600 mb-4">{service.bestFor}</p>

                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">What's included</p>
                    <ul className="space-y-1 mb-5 flex-grow">
                      {service.includes.map((inc, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                          <FaCheckCircle className="text-green-500 shrink-0 mt-0.5" size={11} />
                          {inc}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col gap-2 mt-auto">
                      <Link
                        to={`/services/${service.slug}`}
                        className="block py-2.5 text-center text-sm font-semibold rounded-xl bg-gray-900 text-white hover:bg-black transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/request-service?service=${service.slug}&path=scale_existing`}
                        className="block py-2.5 text-center text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
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

      {/* Bundle callout */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
                <FaBriefcase className="text-green-600 text-2xl" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Save up to 20% when you bundle services
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Combining SEO + Paid Ads + Social Media? Or CRM + Email Marketing + Lead Generation? Bundling services with ScaleLink Alliance gives you better results at a lower cost — with one team managing everything.
                </p>
              </div>
              <Link
                to="/request-service?service=custom-quote"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
              >
                Request a Bundle Quote <FaArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Guide-by-problem callout */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="container mx-auto px-4">
          <div className="bg-black/45 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              Not Sure What Service You Need? Start With the Problem.
            </h3>
            <Link
              to="/services/guide-by-problem"
              className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all text-sm shrink-0 hover:scale-105 shadow-lg shadow-green-500/20"
            >
              Start Here <FaArrowRight className="ml-2 text-xs" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ScaleExistingWebsite;