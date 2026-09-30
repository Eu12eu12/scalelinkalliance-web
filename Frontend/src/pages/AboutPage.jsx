// src/pages/AboutPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBullseye,
  FaEye,
  FaHandshake,
  FaUsers,
  FaShieldAlt,
  FaRocket,
  FaLightbulb,
  FaEnvelopeOpenText,
  FaCheckCircle,
  FaCode,
  FaCogs,
  FaArrowRight,
  FaProjectDiagram,
  FaLaptopCode,
  FaChartLine,
  FaHeadset
} from 'react-icons/fa';
import Testimonials from '../components/sections/Testimonials';

const AboutPage = () => {
  // =========================================================
  // PAGE META
  // =========================================================
  useEffect(() => {
    document.title = 'About ScaleLink Alliance | Done-For-You Business Systems & Digital Services';

    const description =
      'ScaleLink Alliance is a done-for-you digital growth partner that helps businesses build, market, automate, and support the systems behind customer acquisition and operations.';

    let meta = document.querySelector('meta[name="description"]');

    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }

    meta.content = description;
  }, []);

  // =========================================================
  // LEADERSHIP TEAM
  // =========================================================
  const teamMembers = [
    {
      name: 'Marcus Vance',
      role: 'Founder & Managing Partner',
      bio: 'Over 15 years experience building digital businesses, scaling systems, and driving operational excellence for growing companies.',
      image:
        'https://image2url.com/r2/default/images/1773233215286-9dc730cb-98e3-4f90-8e12-32a222384a22.jpg',
    },
    {
      name: 'Sarah Chen',
      role: 'Chief Operating Officer',
      bio: 'Operations specialist with expertise in scaling digital service delivery, workflow automation, and cross-functional engineering teams.',
      image:
        'https://image2url.com/r2/default/images/1773233273187-bb373ba0-21a4-4444-a90f-90e6fa3a985f.jpg',
    },
    {
      name: 'David Rodriguez',
      role: 'Head of Digital Solutions & Client Operations',
      bio: 'Specializes in digital architecture, systems integration, and seamless project delivery. Ensures every client engagement achieves measurable business impact.',
      image:
        'https://image2url.com/r2/default/images/1773233320641-6e3e5668-b7eb-4ef9-8134-8c83bf87ea5d.jpg',
    },
    {
      name: 'Elena Rostova',
      role: 'Director of Client Strategy & Success',
      bio: 'Customer success and digital strategist focused on maximizing client ROI, smooth project onboarding, and measurable growth outcomes.',
      image:
        'https://image2url.com/r2/default/images/1773233371381-156d4945-e7d0-4045-b6df-ba72531015ee.jpg',
    },
  ];

  // =========================================================
  // CORE VALUES
  // =========================================================
  const values = [
    {
      icon: <FaBullseye />,
      title: 'Purpose-Driven Execution',
      description:
        'Quality over shortcuts — every line of code, marketing campaign, and automation system is built to achieve tangible business outcomes.',
    },
    {
      icon: <FaHandshake />,
      title: 'Strategic Systems',
      description:
        'Growth through alignment with scalable technology, high-converting design, and automated customer acquisition pipelines.',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Trust & Milestone Protection',
      description:
        'Clear scopes, fixed milestone approvals, and honest recommendations with zero hidden fees or surprise invoices.',
    },
    {
      icon: <FaLightbulb />,
      title: 'Sustainable Growth',
      description:
        'Focusing on building long-term digital infrastructure and reliable customer pipelines rather than temporary quick fixes.',
    },
  ];

  // =========================================================
  // MILESTONES
  // =========================================================
  const milestones = [
    {
      year: '2016',
      event: 'Agency Founded',
      description:
        'Started delivering custom web development, digital solutions, and business systems for growing businesses.',
    },
    {
      year: '2019',
      event: 'Digital Services Expansion',
      description:
        'Broadened capabilities to full-stack web development, SEO, performance marketing, and creative assets.',
    },
    {
      year: '2022',
      event: 'CRM & Systems Automation',
      description:
        'Pioneered automated lead capture, CRM pipelines, and integrated business operations for high-converting clients.',
    },
    {
      year: '2024',
      event: 'Dedicated Project Tracking Portal',
      description:
        'Launched real-time milestone portal giving clients 100% transparency into delivery progress, files, and approvals.',
    },
    {
      year: '2026',
      event: 'Unified Digital Growth Partner',
      description:
        'Solidified as a comprehensive done-for-you growth partner, helping businesses build, automate, and scale with ongoing Care.',
    },
  ];

  // =========================================================
  // STATS
  // =========================================================
  const stats = [
    {
      number: '20+',
      label: 'Digital Services Offered',
    },
    {
      number: '50+',
      label: 'Industries Represented',
    },
    {
      number: '99%',
      label: 'Client Satisfaction',
    },
    {
      number: '100%',
      label: 'Milestone Protected',
    },
  ];

  // =========================================================
  // CORE CAPABILITIES
  // =========================================================
  const capabilities = [
    {
      icon: <FaCode className="text-xl" />,
      title: 'Build & Develop',
      description: 'High-performance websites, custom web applications, e-commerce stores, and high-converting landing pages built on modern, secure stacks.',
      services: ['Custom Website Development', 'Landing Pages & Funnels', 'E-Commerce Stores', 'Web Applications & SaaS']
    },
    {
      icon: <FaChartLine className="text-xl" />,
      title: 'Attract & Market',
      description: 'Targeted customer acquisition campaigns that put your business directly in front of qualified buyers actively searching for your solutions.',
      services: ['SEO & Organic Search', 'Paid Advertising Management', 'Lead Generation Systems', 'Social Media & Content']
    },
    {
      icon: <FaCogs className="text-xl" />,
      title: 'Convert & Automate',
      description: 'Automated workflows and CRM architectures that instantly capture inbound inquiries, qualify prospects, and nurture leads to closing.',
      services: ['CRM Integration & Setup', 'Lead Follow-Up Automation', 'AI Chatbots & Conversational UI', 'API & Workflow Automation']
    },
    {
      icon: <FaHeadset className="text-xl" />,
      title: 'Care & Support',
      description: 'Continuous technical maintenance, security monitoring, regular updates, and on-demand specialist support to keep systems running at peak speed.',
      services: ['Monthly Maintenance & Care', 'Dedicated Project Tracking Portal', 'Performance Optimization', 'On-Demand Specialist Support']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 py-20 lg:py-24 border-b border-slate-100">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-[#18264A]/10 text-[#18264A] text-xs font-bold uppercase tracking-wider">
                About ScaleLink Alliance
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                Build Better Systems. Attract More Customers.{' '}
                <span className="block text-[#18264A]">
                  Grow With One Team.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                ScaleLink Alliance is a done-for-you digital growth partner helping businesses build, market, automate, and support the digital systems behind customer acquisition and operations under one coordinated relationship.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/free-website-review"
                  className="px-8 py-4 bg-[#18264A] text-white font-bold rounded-xl hover:bg-[#131f3c] transition-all shadow-lg hover:shadow-xl text-sm"
                >
                  Get a Free Growth Review
                </Link>

                <Link
                  to="/services"
                  className="px-8 py-4 bg-white text-[#18264A] font-semibold rounded-xl border-2 border-slate-200 hover:border-[#18264A] hover:bg-slate-50 transition-all text-sm"
                >
                  Explore Our Services
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MESSAGE FROM LEADERSHIP
      ===================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border border-slate-200 shadow-xl"
            >
              <div className="relative p-7 md:p-12 lg:p-14">
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#18264A] text-white flex items-center justify-center shadow-lg rotate-[-3deg]">
                    <FaEnvelopeOpenText className="text-white text-2xl md:text-3xl" />
                  </div>
                </div>

                <div className="text-center max-w-3xl mx-auto mb-10">
                  <span className="text-xs font-bold tracking-widest uppercase text-emerald-700">
                    A Message from Leadership
                  </span>

                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mt-2">
                    Why We Built ScaleLink Alliance
                  </h2>
                </div>

                <div className="space-y-6 text-slate-700 leading-relaxed text-base md:text-lg">
                  <p>
                    Growing a business today is harder than ever. Not because there is a lack of tools, software, or freelancers — but because there are too many disconnected pieces.
                  </p>

                  <p>
                    Most business owners find themselves juggling a freelance designer who doesn't understand marketing, a marketing agency that can't fix website technical issues, and software tools that don't speak to each other. When leads fail to convert or technical issues arise, everyone points fingers at someone else.
                  </p>

                  <p>
                    We created <strong>ScaleLink Alliance</strong> to eliminate that chaos. We bring website development, digital marketing, CRM automation, and ongoing technical support under one accountable team.
                  </p>

                  <p>
                    Whether we are building a high-converting website from scratch, scaling an existing platform, or automating your customer follow-up, our team operates with full transparency, fixed milestones, and a relentless focus on bottom-line business results.
                  </p>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-center sm:text-left">
                    <h4 className="text-lg font-bold text-slate-900">
                      The ScaleLink Leadership Team
                    </h4>
                    <p className="text-slate-500 text-sm">
                      ScaleLink Alliance Management
                    </p>
                  </div>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#18264A] hover:text-emerald-700 transition-colors"
                  >
                    <span>Speak With Our Team</span>
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MISSION & VISION
      ===================================================== */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-700">
                Guiding Principles
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                Our Mission & Vision
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#18264A] text-white flex items-center justify-center mb-6 shadow-md">
                  <FaBullseye className="text-2xl text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  To empower ambitious businesses with high-converting websites, automated workflows, and robust digital systems that drive predictable customer acquisition and operational efficiency.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#18264A] text-white flex items-center justify-center mb-6 shadow-md">
                  <FaEye className="text-2xl text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  To become the most reliable, transparent, and results-driven digital execution partner for growing companies worldwide — eliminating technical complexity so business owners can focus on scale.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CORE VALUES
      ===================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-700">
                What We Stand For
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                Our Core Values
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((val, index) => (
                <div
                  key={val.title}
                  className="bg-slate-50 rounded-2xl p-7 border border-slate-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#18264A] text-emerald-400 flex items-center justify-center text-xl mb-5 shadow-sm">
                    {val.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {val.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHAT MAKES US DIFFERENT
      ===================================================== */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-700">
                Why ScaleLink
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                A Dedicated Growth Partner, Not an Uncoordinated Marketplace
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FaUsers />,
                  title: 'One Accountable Delivery Team',
                  description:
                    'Instead of managing 5 disconnected freelancers or agencies, you work with one coordinated team across web, marketing, automation, and support.',
                },
                {
                  icon: <FaProjectDiagram />,
                  title: 'Transparent Milestone Delivery',
                  description:
                    'Every project has defined deliverables and milestone approvals. Track live progress, files, and status directly in your Project Tracking Portal.',
                },
                {
                  icon: <FaShieldAlt />,
                  title: 'Long-Term Proactive Care',
                  description:
                    'We never build and abandon. Our continuous Care plans protect your systems with ongoing updates, security monitoring, and priority technical support.',
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="w-14 h-14 bg-[#18264A] rounded-2xl text-emerald-400 flex items-center justify-center text-2xl mb-6 shadow-md">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS BANNER
      ===================================================== */}
      <section className="py-16 bg-[#18264A] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl lg:text-5xl font-extrabold text-emerald-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-300 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          LEADERSHIP TEAM SECTION
      ===================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-700">
                The Experts Behind Your Systems
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                Leadership Team
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
                      {member.role}
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR JOURNEY / MILESTONES
      ===================================================== */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-700">
                Our Evolution
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                A Decade of Digital Excellence
              </h2>
            </div>

            <div className="space-y-6">
              {milestones.map((m) => (
                <div
                  key={m.year}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6"
                >
                  <div className="px-5 py-3 rounded-xl bg-[#18264A] text-white font-extrabold text-xl shrink-0 shadow-sm">
                    {m.year}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {m.event}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CORE DIGITAL CAPABILITIES (REPLACED DUAL BLOCK)
      ===================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-700">
                End-To-End Execution
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                Our Core Digital Capabilities
              </h2>
              <p className="text-slate-600 text-base max-w-2xl mx-auto mt-4">
                Everything required to establish, automate, and grow your digital presence under one accountable partner.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {capabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="bg-slate-50 rounded-2xl p-7 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#18264A] text-emerald-400 flex items-center justify-center mb-5 shadow-sm">
                      {cap.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {cap.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-6">
                      {cap.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      {cap.services.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <FaCheckCircle className="text-emerald-600 shrink-0 text-[10px]" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#18264A] hover:text-emerald-700 transition-colors pt-3 border-t border-slate-200"
                  >
                    <span>View Capabilities</span>
                    <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}
      <Testimonials />

      {/* =====================================================
          FINAL CTA SECTION
      ===================================================== */}
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

export default AboutPage;
