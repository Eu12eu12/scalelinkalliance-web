// src/pages/Services/GuideByProblemPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaArrowRight, FaBullhorn, FaGlobe, 
  FaInfoCircle, FaShareAlt, FaShoppingCart, FaEnvelope, 
  FaClock, FaSitemap, FaCode, FaShieldAlt, FaChartLine,
  FaHome
} from 'react-icons/fa';

const GuideByProblemPage = () => {
  const problems = [
    {
      icon: <FaBullhorn className="text-2xl text-orange-600" />,
      title: "1. “I need more customers or leads.”",
      desc: "Every business needs a steady flow of opportunities. These services help you find prospects, rank on search engines, run ads, and convert traffic.",
      solutions: [
        { 
          name: "Lead Generation Services", 
          path: "/services/lead-generation",
          desc: "Helps your business find potential customers, build prospect lists, create outreach systems, and generate more sales opportunities."
        },
        { 
          name: "SEO & Search Marketing", 
          path: "/services/seo-marketing",
          desc: "Helps more people find your business on search engines when they are already looking for your services."
        },
        { 
          name: "Paid Advertising Management", 
          path: "/services/paid-advertising",
          desc: "Helps drive targeted traffic through online ads and campaigns."
        },
        { 
          name: "Landing Pages & Sales Funnels", 
          path: "/services/landing-pages",
          desc: "Creates focused pages designed to turn visitors into leads, calls, quote requests, or customers."
        },
        { 
          name: "CRM Setup & Marketing Automation", 
          path: "/services/crm-automation",
          desc: "Helps track leads and follow up automatically so opportunities do not get lost."
        }
      ],
      ctaText: "Get More Leads",
      ctaPath: "/services",
      bgColor: "from-orange-500/5 to-amber-500/5 border-orange-100"
    },
    {
      icon: <FaGlobe className="text-2xl text-blue-600" />,
      title: "2. “My website does not look professional.”",
      desc: "Your website is your digital storefront. Build credibility and convert visitors with a modern layout, updated content, and clear messaging.",
      solutions: [
        { 
          name: "Website Development", 
          path: "/services/website-development",
          desc: "Builds a clean, professional, mobile-friendly website that explains your business and encourages visitors to take action."
        },
        { 
          name: "Website Maintenance & Updates", 
          path: "/services/website-maintenance",
          desc: "Keeps your website updated, secure, and working properly."
        },
        { 
          name: "Copywriting & Content Creation", 
          path: "/services/copywriting",
          desc: "Improves website messaging so visitors can quickly understand your services."
        },
        { 
          name: "Photography & Visual Assets", 
          path: "/services/photography",
          desc: "Adds stronger visuals that build trust and make your business look more credible."
        },
        { 
          name: "Graphic Design", 
          path: "/services/graphic-design",
          desc: "Creates branded visuals, icons, banners, and page graphics to improve presentation."
        }
      ],
      ctaText: "Improve My Website",
      ctaPath: "/services",
      bgColor: "from-blue-500/5 to-indigo-500/5 border-blue-100"
    },
    {
      icon: <FaInfoCircle className="text-2xl text-indigo-600" />,
      title: "3. “People do not understand what my business offers.”",
      desc: "Clarify your core messaging, visually communicate your services, and make your value proposition instantly clear to prospects.",
      solutions: [
        { 
          name: "Copywriting & Content Creation", 
          path: "/services/copywriting",
          desc: "Clarifies your message so customers understand what you do, who you help, and why they should choose you."
        },
        { 
          name: "Brand Identity & Logo Design", 
          path: "/services/brand-identity",
          desc: "Creates a stronger brand look and message so your business feels more professional and memorable."
        },
        { 
          name: "Video Editing & Motion Graphics", 
          path: "/services/video-editing",
          desc: "Explains your services through short, engaging videos that make your offer easier to understand."
        },
        { 
          name: "Graphic Design", 
          path: "/services/graphic-design",
          desc: "Turns your message into clean visuals for websites, social media, ads, and presentations."
        }
      ],
      ctaText: "Clarify My Message",
      ctaPath: "/services",
      bgColor: "from-indigo-500/5 to-purple-500/5 border-indigo-100"
    },
    {
      icon: <FaShareAlt className="text-2xl text-pink-600" />,
      title: "4. “I need better social media content.”",
      desc: "Establish a consistent brand presence across platforms with high-quality visual designs, reels/short-form videos, and engaging copywriting.",
      solutions: [
        { 
          name: "Social Media Management", 
          path: "/services/social-media-management",
          desc: "Helps plan, create, and manage consistent content across platforms."
        },
        { 
          name: "Graphic Design", 
          path: "/services/graphic-design",
          desc: "Creates branded social media graphics, promotional posts, and campaign visuals."
        },
        { 
          name: "Copywriting & Content Creation", 
          path: "/services/copywriting",
          desc: "Writes captions, posts, content ideas, and promotional messaging."
        },
        { 
          name: "Video Editing & Motion Graphics", 
          path: "/services/video-editing",
          desc: "Creates short-form video content for Reels, TikTok, Shorts, Facebook, and LinkedIn."
        },
        { 
          name: "Photography & Visual Assets", 
          path: "/services/photography",
          desc: "Provides stronger images and visuals for social media posts and brand content."
        }
      ],
      ctaText: "Build My Social Media Presence",
      ctaPath: "/services",
      bgColor: "from-pink-500/5 to-rose-500/5 border-pink-100"
    },
    {
      icon: <FaShoppingCart className="text-2xl text-emerald-600" />,
      title: "5. “I need help selling products online.”",
      desc: "Build a seamless e-commerce experience, optimize checkout flows, attract targeted store traffic, and drive repeat customer purchases.",
      solutions: [
        { 
          name: "E-Commerce Development", 
          path: "/services/ecommerce-development",
          desc: "Builds or improves your online store, product pages, checkout flow, and shopping experience."
        },
        { 
          name: "Website Development", 
          path: "/services/website-development",
          desc: "Creates a professional site or storefront that builds trust."
        },
        { 
          name: "Email Marketing Campaigns", 
          path: "/services/email-marketing",
          desc: "Helps bring back visitors, promote offers, and encourage repeat purchases."
        },
        { 
          name: "Paid Advertising Management", 
          path: "/services/paid-advertising",
          desc: "Drives targeted traffic to your store or product pages."
        },
        { 
          name: "Data Analytics & Reports", 
          path: "/services/data-analytics",
          desc: "Tracks sales, traffic, customer behavior, and campaign performance."
        }
      ],
      ctaText: "Grow My Online Store",
      ctaPath: "/services",
      bgColor: "from-emerald-500/5 to-teal-500/5 border-emerald-100"
    },
    {
      icon: <FaEnvelope className="text-2xl text-cyan-600" />,
      title: "6. “I need better follow-up with leads and customers.”",
      desc: "Organize lead pipelines and automate follow-up emails, newsletters, and reminders so no opportunity slips through the cracks.",
      solutions: [
        { 
          name: "CRM Setup & Marketing Automation", 
          path: "/services/crm-automation",
          desc: "Organizes leads, tracks customer stages, and automates follow-up."
        },
        { 
          name: "Email Marketing Campaigns", 
          path: "/services/email-marketing",
          desc: "Creates welcome emails, follow-up sequences, promotional campaigns, and newsletters."
        },
        { 
          name: "Lead Generation Services", 
          path: "/services/lead-generation",
          desc: "Builds the front-end system to bring in prospects and track them."
        },
        { 
          name: "Virtual Assistant Services", 
          path: "/services/virtual-assistant",
          desc: "Helps with manual follow-ups, scheduling, inbox support, and customer communication."
        }
      ],
      ctaText: "Improve My Follow-Up System",
      ctaPath: "/services",
      bgColor: "from-cyan-500/5 to-sky-500/5 border-cyan-100"
    },
    {
      icon: <FaClock className="text-2xl text-violet-600" />,
      title: "7. “I waste too much time on admin work.”",
      desc: "Delegate scheduling, inbox support, data entry, and project tracking to dedicated operations professionals so you can focus on core growth.",
      solutions: [
        { 
          name: "Virtual Assistant Services", 
          path: "/services/virtual-assistant",
          desc: "Supports scheduling, inbox management, customer follow-ups, research, and daily admin tasks."
        },
        { 
          name: "Data Entry & Processing", 
          path: "/services/data-entry",
          desc: "Organizes spreadsheets, customer records, product data, CRM information, and documents."
        },
        { 
          name: "Project Management Support", 
          path: "/services/project-management",
          desc: "Helps manage tasks, deadlines, team communication, and project progress."
        },
        { 
          name: "Operations Support Systems", 
          path: "/services/process-documentation",
          desc: "Creates better systems for daily business operations and customer support."
        }
      ],
      ctaText: "Get Business Support",
      ctaPath: "/services",
      bgColor: "from-violet-500/5 to-purple-500/5 border-violet-100"
    },
    {
      icon: <FaSitemap className="text-2xl text-teal-600" />,
      title: "8. “My business systems are not organized.”",
      desc: "Connect your business applications, centralize your client profiles, and automate repetitive tasks using secure integrations.",
      solutions: [
        { 
          name: "CRM Setup & Marketing Automation", 
          path: "/services/crm-automation",
          desc: "Creates a central system for leads, customers, follow-ups, and sales stages."
        },
        { 
          name: "Business Process Automation", 
          path: "/services/process-documentation",
          desc: "Reduces repetitive manual work through workflows, reminders, forms, and system connections."
        },
        { 
          name: "API Integration", 
          path: "/services/api-integration",
          desc: "Connects different platforms so data moves between your website, CRM, email system, payment tools, and reports."
        },
        { 
          name: "Data Analytics & Reports", 
          path: "/services/data-analytics",
          desc: "Helps track what is happening in your business so you can make better decisions."
        }
      ],
      ctaText: "Organize My Business Systems",
      ctaPath: "/services",
      bgColor: "from-teal-500/5 to-green-500/5 border-teal-100"
    },
    {
      icon: <FaCode className="text-2xl text-purple-600" />,
      title: "9. “I need custom software or a business tool.”",
      desc: "Develop specialized portals, internal dashboards, custom booking flows, or client software applications built around your workflows.",
      solutions: [
        { 
          name: "Web Application Development", 
          path: "/services/web-applications",
          desc: "Builds custom dashboards, portals, client systems, booking tools, internal platforms, or business applications."
        },
        { 
          name: "API Integration", 
          path: "/services/api-integration",
          desc: "Connects the application with other tools and platforms."
        },
        { 
          name: "Data Analytics & Reports", 
          path: "/services/data-analytics",
          desc: "Adds reporting dashboards and performance tracking."
        },
        { 
          name: "Project Management Support", 
          path: "/services/project-management",
          desc: "Helps organize the development process and keep the project on track."
        }
      ],
      ctaText: "Build My Custom System",
      ctaPath: "/services",
      bgColor: "from-purple-500/5 to-fuchsia-500/5 border-purple-100"
    },
    {
      icon: <FaShieldAlt className="text-2xl text-rose-600" />,
      title: "10. “I need more trust and credibility.”",
      desc: "Leverage premium photography, professional copywriting, brand styling, and review collection systems to show customers you are a reliable leader.",
      solutions: [
        { 
          name: "Website Development", 
          path: "/services/website-development",
          desc: "Creates a stronger online presence and a better first impression."
        },
        { 
          name: "Photography & Visual Assets", 
          path: "/services/photography",
          desc: "Adds professional images, service visuals, team photos, and branded assets."
        },
        { 
          name: "Brand Identity & Logo Design", 
          path: "/services/brand-identity",
          desc: "Improves how your business looks and feels to customers."
        },
        { 
          name: "Reputation & Review Management", 
          path: "/services/custom-quote",
          desc: "Helps collect reviews, showcase testimonials, and build social proof."
        },
        { 
          name: "Copywriting & Content Creation", 
          path: "/services/copywriting",
          desc: "Writes trust-building website sections, bios, service descriptions, and calls to action."
        }
      ],
      ctaText: "Build More Trust",
      ctaPath: "/services",
      bgColor: "from-rose-500/5 to-red-500/5 border-rose-100"
    },
    {
      icon: <FaChartLine className="text-2xl text-emerald-600" />,
      title: "11. “I need better business direction.”",
      desc: "Partner with consulting experts to map your roadmap, establish tracking dashboards, and structure lead gen systems for growth.",
      solutions: [
        { 
          name: "Business Consulting & Growth Strategy", 
          path: "/services/custom-quote",
          desc: "Helps identify your biggest growth problems and create a clearer action plan."
        },
        { 
          name: "Data Analytics & Reports", 
          path: "/services/data-analytics",
          desc: "Shows what is working, what needs improvement, and where opportunities exist."
        },
        { 
          name: "Lead Generation Services", 
          path: "/services/lead-generation",
          desc: "Creates a plan to bring in more business opportunities."
        },
        { 
          name: "Marketing Automation", 
          path: "/services/crm-automation",
          desc: "Helps make your growth process more organized and consistent."
        }
      ],
      ctaText: "Create My Growth Plan",
      ctaPath: "/services",
      bgColor: "from-emerald-500/5 to-green-500/5 border-emerald-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link 
              to="/services" 
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-6 group"
            >
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Service Categories
            </Link>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              ScaleLink Alliance Guide to Services by Problem
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl leading-relaxed mb-4">
              Use this guide to help you quickly understand which ScaleLink Alliance service best fits your business needs.
            </p>
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 text-sm text-gray-700 leading-relaxed max-w-4xl">
              <span className="font-bold text-blue-900 block mb-2">Not Sure What Service You Need? Start With the Problem.</span>
              Every business has different needs. Some need more leads. Some need a better website. Others need stronger systems, better content, or reliable support. Use this guide to find the ScaleLink Alliance services that match the problem you want to solve.
            </div>
          </div>

          {/* 11 Problems Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {problems.map((prob, index) => {
              const isEvenCol = index % 2 === 0;
              const cardBg = isEvenCol 
                ? "from-blue-500/5 to-indigo-500/5 border-blue-100" 
                : "from-teal-500/5 to-emerald-500/5 border-teal-100";
              const themedIcon = React.cloneElement(prob.icon, {
                className: `text-2xl ${isEvenCol ? 'text-blue-600' : 'text-teal-600'}`
              });

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`bg-white bg-gradient-to-br ${cardBg} border rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}
                >
                  {/* Header & Icon */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm shrink-0">
                      {themedIcon}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                      {prob.title}
                    </h2>
                  </div>

                  {/* Subtitle / Description */}
                  <p className="text-gray-650 text-sm md:text-base mb-6 leading-relaxed flex-grow">
                    {prob.desc}
                  </p>

                  {/* Recommended Services Links */}
                  <div className="space-y-4 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Recommended Services:
                    </span>
                    {prob.solutions.map((sol, sIdx) => (
                      <div
                        key={sIdx}
                        className="border-b border-gray-100 pb-3 last:border-0"
                      >
                        <Link
                          to={sol.path}
                          className="flex items-center justify-between text-sm md:text-base text-gray-900 font-bold hover:text-blue-600 transition-colors group/link"
                        >
                          <span className="underline decoration-gray-200 group-hover/link:decoration-blue-400">
                            {sol.name}
                          </span>
                          <FaArrowRight size={10} className="text-gray-300 group-hover/link:text-blue-500 group-hover/link:translate-x-0.5 transition-all" />
                        </Link>
                        <p className="text-xs md:text-sm text-gray-500 mt-1 leading-normal">
                          {sol.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Action CTA Button */}
                  <Link
                    to={prob.ctaPath}
                    className="w-full text-center py-3 bg-white hover:bg-blue-600 hover:text-white text-blue-600 font-bold border border-blue-200 hover:border-blue-600 rounded-xl text-sm transition-all duration-300 shadow-sm shadow-blue-50 mt-auto"
                  >
                    {prob.ctaText}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Return to Homepage Button */}
          <div className="text-center pt-8 border-t border-gray-200">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
            >
              <FaHome size={14} />
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideByProblemPage;
