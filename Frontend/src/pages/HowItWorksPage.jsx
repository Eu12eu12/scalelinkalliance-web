// src/pages/HowItWorksPage.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaChartLine, FaBriefcase, FaArrowRight, FaCheckCircle, 
  FaPaintBrush, FaVideo, FaPenNib, FaPalette, FaCamera, FaCode, 
  FaRocket, FaShoppingCart, FaGlobe, FaCloudUploadAlt, FaShieldAlt, 
  FaAd, FaEnvelope, FaSearch, FaHeadset, FaProjectDiagram, FaDatabase, 
  FaFileAlt, FaChartBar, FaRegBuilding, FaCogs, FaSearchPlus,
  FaClipboardList, FaLayerGroup, FaTools, FaCheckDouble, FaLifeRing
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HowItWorksPage = () => {
  useEffect(() => {
    document.title = 'How It Works | ScaleLink Alliance - Done-For-You Business Systems & Digital Services';

    const setMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta(
      'description',
      'Discover how ScaleLink Alliance helps businesses build, automate, and grow digital systems with transparent milestones, dedicated project portals, and ongoing care.'
    );
  }, []);

  // 6-Stage Delivery Workflow (Document 2: Discover → Audit → Plan → Build → Launch → Care)
  const deliveryWorkflow = [
    {
      step: 1,
      icon: <FaSearchPlus className="text-2xl" />,
      title: '1. Discover',
      subtitle: 'Goals & Requirements Discovery',
      description: 'We learn your business model, target audience, and current customer acquisition bottlenecks to understand exactly where systems can be improved.',
      details: 'Initial discovery questionnaire, growth diagnostic review, and clear alignment on business priorities.'
    },
    {
      step: 2,
      icon: <FaClipboardList className="text-2xl" />,
      title: '2. Audit',
      subtitle: 'Comprehensive Systems Review',
      description: 'Our technical team analyzes your current website, conversion pathways, SEO health, lead capture mechanisms, and CRM workflows.',
      details: 'Identification of speed bottlenecks, drop-off points, mobile UX issues, and missed follow-up opportunities.'
    },
    {
      step: 3,
      icon: <FaLayerGroup className="text-2xl" />,
      title: '3. Plan',
      subtitle: 'Scope, Milestones & Fixed Pricing',
      description: 'We develop a tailored execution plan with clear scope, transparent milestones, realistic timelines, and guaranteed pricing with zero hidden fees.',
      details: 'Deliverable breakdown, timeline schedule, and milestone-based payment structure protecting both parties.'
    },
    {
      step: 4,
      icon: <FaTools className="text-2xl" />,
      title: '4. Build',
      subtitle: 'Expert Done-For-You Implementation',
      description: 'Dedicated developers, designers, and automation specialists build your systems with regular milestone updates and rigorous QA testing.',
      details: 'Modern clean code, responsive layouts, automated workflows, and continuous quality checks.'
    },
    {
      step: 5,
      icon: <FaRocket className="text-2xl" />,
      title: '5. Launch',
      subtitle: 'Rigorous Verification & Deployment',
      description: 'We conduct final cross-browser checks, analytics instrumentation, speed optimization, and domain verification before pushing live seamlessly.',
      details: 'Zero-downtime deployment, automated form testing, event tracking validation, and post-launch verification.'
    },
    {
      step: 6,
      icon: <FaLifeRing className="text-2xl" />,
      title: '6. Care',
      subtitle: 'Project Portal & Ongoing Support',
      description: 'Gain ongoing peace of mind with continuous technical maintenance, security monitoring, regular updates, and on-demand specialist support.',
      details: 'Direct access to your dedicated Project Tracking Portal, priority support requests, and proactive upkeep.'
    }
  ];

  // 3 Service Starting Points (Document 2 Section 6)
  const startingPoints = [
    {
      badge: 'New Foundation',
      title: 'Start From Scratch',
      description: 'Build a high-performance website, web app, or automated system from the ground up designed specifically to convert visitors into clients.',
      link: '/build-from-scratch',
      cta: 'Explore New Build',
      features: [
        'Custom modern UI/UX design',
        'Mobile-first responsive architecture',
        'Built-in lead capture & CRM integration',
        'Search engine optimized structure',
        'Fast, secure, scalable infrastructure'
      ]
    },
    {
      badge: 'Enhance & Optimize',
      title: 'Scale What Already Exists',
      description: 'Improve an existing website that is underperforming, slow, outdated, or failing to convert traffic into qualified inbound enquiries.',
      link: '/scale-existing-website',
      cta: 'Scale Existing Site',
      features: [
        'Conversion rate optimization (CRO)',
        'Page speed & mobile performance tune-up',
        'Automated lead follow-up & CRM pipelines',
        'Brand modernization & UI polish',
        'Analytics & tracking fixes'
      ]
    },
    {
      badge: 'Targeted Solutions',
      title: 'Standalone Services',
      description: 'Access individual on-demand services across web development, paid advertising, SEO, CRM, automation, or creative support.',
      link: '/services',
      cta: 'Browse 20+ Services',
      features: [
        'Single service engagement with no bloat',
        'Direct specialist assignment',
        'Transparent milestone-based pricing',
        'Dedicated tracking portal access',
        'Add complementary services as you grow'
      ]
    }
  ];

  // All 22 Services categorized
  const allServices = [
    {
      category: 'Creative & Content',
      icon: FaPaintBrush,
      color: 'purple',
      services: [
        { name: 'Graphic Design', slug: 'graphic-design', icon: FaPaintBrush },
        { name: 'Video Editing & Motion Graphics', slug: 'video-editing', icon: FaVideo },
        { name: 'Copywriting & Content Creation', slug: 'copywriting', icon: FaPenNib },
        { name: 'Brand Identity & Logo Design', slug: 'brand-identity', icon: FaPalette },
        { name: 'Photography & Visual Assets', slug: 'photography', icon: FaCamera },
        { name: 'Request Custom Quote', slug: 'custom-quote-creative', icon: FaCogs }
      ]
    },
    {
      category: 'Tech & Development',
      icon: FaCode,
      color: 'indigo',
      services: [
        { name: 'Website Development', slug: 'website-development', icon: FaCode },
        { name: 'Landing Pages & Sales Funnels', slug: 'landing-pages', icon: FaRocket },
        { name: 'E-Commerce Development', slug: 'ecommerce-development', icon: FaShoppingCart },
        { name: 'Web Applications & SaaS Development', slug: 'web-applications', icon: FaGlobe },
        { name: 'API Integration & Automation', slug: 'api-integration', icon: FaCloudUploadAlt },
        { name: 'Website Maintenance & Updates', slug: 'website-maintenance', icon: FaShieldAlt },
        { name: 'Request Custom Quote', slug: 'custom-quote-tech', icon: FaCogs }
      ]
    },
    {
      category: 'Marketing & Growth',
      icon: FaChartLine,
      color: 'green',
      services: [
        { name: 'Social Media Management', slug: 'social-media-management', icon: FaUsers },
        { name: 'SEO & Search Marketing', slug: 'seo-marketing', icon: FaSearch },
        { name: 'Paid Advertising Management', slug: 'paid-advertising', icon: FaAd },
        { name: 'Email Marketing Campaigns', slug: 'email-marketing', icon: FaEnvelope },
        { name: 'Lead Generation Services', slug: 'lead-generation', icon: FaRegBuilding },
        { name: 'CRM & Marketing Automation', slug: 'crm-automation', icon: FaCogs },
        { name: 'Request Custom Quote', slug: 'custom-quote-marketing', icon: FaCogs }
      ]
    },
    {
      category: 'Operations & Support',
      icon: FaBriefcase,
      color: 'orange',
      services: [
        { name: 'Virtual Assistant Services', slug: 'virtual-assistant', icon: FaHeadset },
        { name: 'Data Analytics & Reporting', slug: 'data-analytics', icon: FaChartBar },
        { name: 'Process Documentation & SOP Development', slug: 'process-documentation', icon: FaFileAlt },
        { name: 'Project Management Support', slug: 'project-management', icon: FaProjectDiagram },
        { name: 'Data Entry & Processing', slug: 'data-entry', icon: FaDatabase },
        { name: 'Request Custom Quote', slug: 'custom-quote-operations', icon: FaCogs }
      ]
    }
  ];

  // Business System Outcomes (Document 2 Section 6)
  const outcomes = [
    'A stronger system for attracting and converting qualified opportunities',
    'Automated lead capture with instant multi-channel follow-up',
    'Fast, mobile-optimized website engineered for real business conversions',
    'Real-time transparency via your dedicated Project Tracking Portal',
    'Milestone-based payment protection ensuring work is verified before final payment',
    'One coordinated partner for design, development, marketing, automation, and Care'
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* 🚀 HERO SECTION */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-[#18264A] text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider mb-6">
                <span>Done-For-You Delivery & Care</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
                How ScaleLink Alliance Works
              </h1>
              <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-8">
                A structured, transparent process to build, automate, and scale the digital systems behind your business growth — with fixed milestones and zero guesswork.
              </p>

              {/* Core Pillars */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2">
                <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center">
                  <div className="text-emerald-400 font-bold text-sm mb-1">100% Done-For-You</div>
                  <div className="text-xs text-slate-300">Expert Team Execution</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center">
                  <div className="text-emerald-400 font-bold text-sm mb-1">Milestone Protected</div>
                  <div className="text-xs text-slate-300">Pay as Work is Approved</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center">
                  <div className="text-emerald-400 font-bold text-sm mb-1">Project Portal</div>
                  <div className="text-xs text-slate-300">Live Status & Files</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center">
                  <div className="text-emerald-400 font-bold text-sm mb-1">Ongoing Care</div>
                  <div className="text-xs text-slate-300">Support & Maintenance</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🎯 3 SERVICE STARTING POINTS */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-emerald-700 font-semibold text-xs uppercase tracking-widest block mb-2">
              Flexible Engagement Models
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Choose Your Starting Point
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Every business is at a different stage. ScaleLink provides three clear entry pathways tailored to where you are today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {startingPoints.map((point, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <span className="inline-block px-3 py-1 bg-slate-100 text-[#18264A] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                    {point.badge}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-[#18264A] transition-colors">
                    {point.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {point.description}
                  </p>
                  <div className="space-y-2.5 mb-8">
                    {point.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <FaCheckCircle className="text-emerald-600 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  to={point.link}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-[#18264A] text-slate-800 hover:text-white font-semibold text-sm transition-all duration-200"
                >
                  <span>{point.cta}</span>
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⚙️ 6-STAGE DELIVERY WORKFLOW */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-emerald-700 font-semibold text-xs uppercase tracking-widest block mb-2">
              Our 6-Stage Process
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              From Initial Diagnostic to Seamless Care
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              How our team manages scope, deliverables, quality assurance, and execution every step of the way.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {deliveryWorkflow.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow grid sm:grid-cols-[80px_1fr] gap-6 items-start"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#18264A] text-white flex items-center justify-center shrink-0 shadow-md">
                  {item.icon}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.subtitle}
                    </span>
                  </div>
                  <p className="text-slate-700 text-base leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <FaCheckDouble className="text-emerald-600 shrink-0" />
                    <span>{item.details}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📦 22 SERVICES CATALOG OVERVIEW */}
      <section className="py-20 lg:py-24 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-emerald-700 font-semibold text-xs uppercase tracking-widest block mb-2">
              Comprehensive Capabilities
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Our Complete Service Offering (20+ Services)
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              One accountable team delivering creative, technical, marketing, and operational execution.
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {allServices.map((category, catIndex) => {
              const CategoryIcon = category.icon;
              const colorClasses = {
                purple: 'bg-purple-50 border-purple-200 text-purple-700',
                indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
                green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                orange: 'bg-amber-50 border-amber-200 text-amber-700'
              };

              return (
                <div key={catIndex} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className={`${colorClasses[category.color]} p-4 sm:px-6 border-b`}>
                    <div className="flex items-center space-x-3">
                      <CategoryIcon className="text-xl" />
                      <h3 className="text-lg font-bold">{category.category}</h3>
                      <span className="ml-auto text-xs font-bold px-2.5 py-1 bg-white/80 rounded-full">
                        {category.services.length} services
                      </span>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {category.services.map((service, sIndex) => {
                        const ServiceIcon = service.icon;
                        return (
                          <Link
                            key={sIndex}
                            to={`/request-service`}
                            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#18264A] text-slate-700 group-hover:text-white flex items-center justify-center transition-colors">
                              <ServiceIcon className="text-xs" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 group-hover:text-[#18264A] transition-colors flex-1">
                              {service.name}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#18264A] text-white font-semibold text-sm hover:bg-[#131f3c] transition-all shadow-md"
            >
              <span>Explore All Services & Pricing</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      {/* 🛡️ PROJECT TRACKING PORTAL & MILESTONES */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-emerald-700 font-semibold text-xs uppercase tracking-widest block mb-2">
                  Client Transparency
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-6">
                  Complete Visibility Through Your Dedicated Client Portal
                </h2>
                <p className="text-slate-600 text-base leading-relaxed mb-6">
                  No wondering what's happening or chasing email threads. Every ScaleLink client receives access to our centralized project tracking hub where you can view live milestone progress, review drafts, and sign off on deliverables.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-emerald-600 mt-1 shrink-0 text-base" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">Real-Time Milestone Tracking</h4>
                      <p className="text-slate-600 text-xs">Track every task from discovery through QA and launch in real time.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-emerald-600 mt-1 shrink-0 text-base" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">Milestone-Based Payment Security</h4>
                      <p className="text-slate-600 text-xs">Payments are tied to approved milestones. You never pay in full upfront without verified deliverables.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-emerald-600 mt-1 shrink-0 text-base" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">Centralized Assets & Communications</h4>
                      <p className="text-slate-600 text-xs">All designs, code repositories, staging links, and invoices organized in one secure place.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What You Get Box */}
              <div className="bg-[#18264A] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">
                  What You Receive With ScaleLink
                </h3>
                <div className="space-y-4 mb-8">
                  {outcomes.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <FaCheckCircle className="text-emerald-400 mt-1 shrink-0 text-sm" />
                      <span className="text-slate-200 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/15">
                  <Link
                    to="/free-website-review"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-md"
                  >
                    <span>Request a Free Business Growth Review</span>
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 FINAL CTA SECTION */}
      <section className="py-20 bg-[#18264A] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 tracking-tight">
              Ready to strengthen the systems behind your growth?
            </h2>
            <p className="text-lg text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed">
              Let ScaleLink review your current website, lead-generation process and follow-up systems and identify the improvements that can create the greatest business impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/free-website-review"
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg text-base"
              >
                Get My Free Review
              </Link>
              <Link
                to="/services"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl transition-colors text-base"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
