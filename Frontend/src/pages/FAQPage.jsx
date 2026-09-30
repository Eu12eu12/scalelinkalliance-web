// src/pages/FAQPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaQuestionCircle, 
  FaBriefcase, 
  FaUserCheck, 
  FaArrowRight, 
  FaCheckCircle, 
  FaEnvelope,
  FaPhone,
  FaChevronDown,
  FaChevronUp,
  FaShieldAlt,
  FaProjectDiagram,
  FaCode,
  FaCogs
} from 'react-icons/fa';

const FAQPage = () => {
  useEffect(() => {
    document.title = 'Frequently Asked Questions | ScaleLink Alliance - Business Systems & Services';

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
      'Frequently asked questions about ScaleLink Alliance digital services, website builds, milestones, payment protection, and ongoing care.'
    );
  }, []);

  const [openSections, setOpenSections] = useState({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true
  });

  const [openQuestions, setOpenQuestions] = useState({
    '0-0': true,
    '1-0': true,
    '2-0': true
  });

  const toggleSection = (index) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleQuestion = (catIdx, qIdx) => {
    const key = `${catIdx}-${qIdx}`;
    setOpenQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Structured Service & Operational FAQ Data (Document 2 Guidelines)
  const faqData = [
    {
      category: 'General & Overview',
      id: 'general',
      icon: <FaQuestionCircle />,
      questions: [
        {
          q: 'What is ScaleLink Alliance?',
          a: 'ScaleLink Alliance is a done-for-you digital growth partner. We build, market, automate, and support the digital systems behind customer acquisition and business operations — giving you one dedicated, accountable team instead of having to manage multiple disconnected freelancers or agencies.'
        },
        {
          q: 'Who is ScaleLink Alliance designed for?',
          a: 'Our services are engineered for ambitious business owners, entrepreneurs, professional service providers, B2B companies, and growing teams who require dependable digital execution without the overhead of hiring an internal tech and marketing department.',
          bulletPoints: [
            'Business owners scaling their customer acquisition systems',
            'Companies needing a modern, high-converting website or web app',
            'Service providers wanting automated lead capture & CRM pipelines',
            'Businesses seeking transparent milestone-based project execution'
          ]
        },
        {
          q: 'What makes ScaleLink Alliance different from traditional agencies?',
          a: 'Traditional agencies often charge open-ended monthly retainers with vague deliverables, or focus on only one isolated tactic (like ads only or design only). ScaleLink provides transparent milestone-based delivery across your entire digital infrastructure: web development, lead capture, CRM automation, and proactive ongoing Care with a dedicated project tracking portal.'
        }
      ]
    },
    {
      category: 'Services & Starting Points',
      id: 'services',
      icon: <FaBriefcase />,
      questions: [
        {
          q: 'Can I purchase a single standalone service?',
          a: 'Yes. All of our 20+ digital services can be engaged individually on an à la carte basis. Whether you need SEO optimization, CRM automation, paid advertising management, or custom copywriting, each service comes with clearly defined scopes, deliverables, and fixed milestone pricing.'
        },
        {
          q: 'Do I need a brand-new website, or can ScaleLink improve my existing one?',
          a: 'We support both starting points! If your current website already has traffic or existing rankings, our "Scale What Already Exists" pathway focuses on speed optimization, conversion rate enhancement, automated lead capture, and design upgrades without rebuilding from scratch.'
        },
        {
          q: 'How do the three service pathways work?',
          a: 'We provide three straightforward ways to engage based on your current business needs:',
          bulletPoints: [
            'Start From Scratch: Complete end-to-end design and build of a new high-converting website, web app, or business system.',
            'Scale What Already Exists: Modernize, speed up, and optimize an existing website for higher lead conversion and retention.',
            'Standalone Services: Targeted solutions across SEO, paid ads, CRM workflows, API integration, and creative assets.'
          ]
        },
        {
          q: 'What technologies and platforms do you support?',
          a: 'Our engineering and marketing teams work with modern, battle-tested platforms including React, Next.js, Node.js, Tailwind CSS, WordPress/WooCommerce, Shopify, Webflow, custom REST APIs, and leading CRM systems (HubSpot, GoHighLevel, ActiveCampaign, etc.).'
        }
      ]
    },
    {
      category: 'Milestone-Based Payment Protection',
      id: 'payment-protection',
      icon: <FaShieldAlt />,
      questions: [
        {
          q: 'How does ScaleLink Alliance protect project payments?',
          a: 'We use structured milestone-based payment schedules to create a fair, transparent, and low-risk project experience. Project costs are divided into clear milestone stages tied directly to agreed deliverables. You review and approve each phase before remaining milestone payments are due.'
        },
        {
          q: 'When are funds released or applied?',
          a: 'Funds are applied as defined milestones are completed and verified by you (for example: wireframe approval, staging site review, or final launch sign-off). This ensures our team delivers exactly what was promised before proceeding to the next stage.'
        },
        {
          q: 'Are deposits refundable?',
          a: 'Initial milestone deposits cover dedicated architecture, planning, and design hours. Once milestone work has commenced, that phase deposit is applied to the active delivery work. If you choose to pause or cancel before work begins, unallocated funds are returned per our service agreement.'
        },
        {
          q: 'What happens if I request changes or extra features?',
          a: 'Every project quote includes defined revision rounds within the agreed scope. If you request major changes, new custom features, or additional pages outside the original plan, we provide a clear, fixed-price addendum quote for your approval before any extra work begins.'
        }
      ]
    },
    {
      category: 'Project Tracking Portal & Delivery',
      id: 'portal',
      icon: <FaProjectDiagram />,
      questions: [
        {
          q: 'How do I track my project status?',
          a: 'Every client receives access to our centralized Project Tracking Portal. You can monitor live milestone progress, view staging links, download deliverable files, and communicate directly with your dedicated project team with complete visibility.'
        },
        {
          q: 'Who manages my project and communication?',
          a: 'You are paired with a dedicated ScaleLink Project Manager who oversees your designers, developers, and systems specialists. Your project manager serves as your central point of contact, ensuring deadlines are met and communication is clear and prompt.'
        },
        {
          q: 'What happens after my project launches?',
          a: 'We conduct comprehensive post-launch verification, analytics tracking checks, and speed optimization. Beyond launch, we offer continuous Care plans that provide ongoing technical maintenance, security monitoring, regular software updates, and priority on-demand support.'
        }
      ]
    },
    {
      category: 'Getting Started & Growth Review',
      id: 'getting-started',
      icon: <FaUserCheck />,
      questions: [
        {
          q: 'What happens during the Free Website & Business Growth Review?',
          a: 'Our technical team conducts a comprehensive diagnostic of your current digital setup. We analyze page speed, mobile usability, SEO structure, conversion bottlenecks, and lead follow-up mechanisms, delivering a clear actionable summary of high-impact improvements.'
        },
        {
          q: 'How do I get started?',
          a: 'You can begin by requesting your Free Website & Business Growth Review, exploring our standalone services catalog, or booking a consultation call to discuss your exact project goals.'
        },
        {
          q: 'How can I contact ScaleLink Alliance?',
          a: 'You can reach our team anytime via email, phone, or our online contact form:',
          contact: {
            website: 'www.scalelinkalliance.com/contact',
            email: 'Support@scalelinkalliance.com',
            phone: '+1-815-669-0642'
          }
        }
      ]
    }
  ];

  // Quick stats (Document 2 Guidelines)
  const stats = [
    { label: 'Industries Represented', value: '50+' },
    { label: 'Services Offered', value: '20+' },
    { label: 'Client Satisfaction', value: '99%' },
    { label: 'Milestone Protected', value: '100%' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* 🚀 HERO SECTION */}
      <section className="bg-[#18264A] text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider mb-6">
                <span>Knowledge & Clarity Hub</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto mb-8 leading-relaxed">
                Clear answers about our digital services, build processes, milestone payment protection, and ongoing client care.
              </p>

              {/* Quick Contact Badges */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:Support@scalelinkalliance.com"
                  className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xs text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <FaEnvelope className="text-emerald-400" />
                  <span>Support@scalelinkalliance.com</span>
                </a>
                <a
                  href="tel:+18156690642"
                  className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xs text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <FaPhone className="text-emerald-400" />
                  <span>+1-815-669-0642</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 📊 QUICK STATS BANNER */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-3">
                <div className="text-3xl lg:text-4xl font-extrabold text-[#18264A] mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📑 FAQ ACCORDION CONTENT */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category Quick Jump */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-10 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Jump to Category:
              </h2>
              <div className="flex flex-wrap gap-2">
                {faqData.map((category, idx) => (
                  <a
                    key={idx}
                    href={`#${category.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#18264A] text-slate-700 hover:text-white text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    <span>{category.icon}</span>
                    <span>{category.category}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Category Sections */}
            <div className="space-y-8">
              {faqData.map((category, catIndex) => (
                <div 
                  key={catIndex} 
                  id={category.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  {/* Category Header */}
                  <div
                    onClick={() => toggleSection(catIndex)}
                    className="p-5 sm:px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center space-x-3 text-[#18264A]">
                      <span className="text-xl text-emerald-600">{category.icon}</span>
                      <h2 className="text-xl font-bold text-slate-900">
                        {category.category}
                      </h2>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {category.questions.length}
                      </span>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 text-sm">
                      {openSections[catIndex] ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {/* Question Items */}
                  {openSections[catIndex] && (
                    <div className="p-4 sm:p-6 divide-y divide-slate-100">
                      {category.questions.map((item, qIndex) => {
                        const isOpen = openQuestions[`${catIndex}-${qIndex}`];
                        return (
                          <div key={qIndex} className="py-4 first:pt-1 last:pb-1">
                            <div
                              onClick={() => toggleQuestion(catIndex, qIndex)}
                              className="flex items-start justify-between cursor-pointer group"
                            >
                              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#18264A] transition-colors pr-4">
                                {item.q}
                              </h3>
                              <button className="text-slate-400 group-hover:text-[#18264A] mt-1 shrink-0 text-xs">
                                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                              </button>
                            </div>

                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.2 }}
                                className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed space-y-3"
                              >
                                <p>{item.a}</p>

                                {item.bulletPoints && (
                                  <ul className="space-y-1.5 pl-2 mt-2">
                                    {item.bulletPoints.map((point, ptIdx) => (
                                      <li key={ptIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                                        <FaCheckCircle className="text-emerald-600 mt-1 shrink-0 text-xs" />
                                        <span>{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {item.contact && (
                                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-3 text-xs sm:text-sm space-y-1.5">
                                    <div><strong>Website:</strong> <Link to="/contact" className="text-emerald-700 underline font-semibold">{item.contact.website}</Link></div>
                                    <div><strong>Email:</strong> <a href={`mailto:${item.contact.email}`} className="text-emerald-700 underline font-semibold">{item.contact.email}</a></div>
                                    <div><strong>Phone:</strong> <a href={`tel:${item.contact.phone}`} className="text-emerald-700 underline font-semibold">{item.contact.phone}</a></div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
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
                to="/contact"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl transition-colors text-base"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
