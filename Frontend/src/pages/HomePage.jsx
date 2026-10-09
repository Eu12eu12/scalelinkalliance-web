// src/pages/HomePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHandshake, FaUserTie, FaChartLine, FaGlobe, FaArrowRight, 
  FaCheckCircle, FaTimesCircle, FaBuilding, FaUsers, FaStar,
  FaRocket, FaBriefcase, FaHeadset, FaCogs, FaPaintBrush,
  FaVideo, FaPenNib, FaPalette, FaCamera, FaCode, FaShoppingCart,
  FaEnvelope, FaSearch, FaDatabase, FaFileAlt, FaProjectDiagram, FaShieldAlt,
  FaChevronLeft, FaChevronRight, FaRobot, FaAd, FaTimes
} from 'react-icons/fa';
import ChapterCard from '../components/sections/ChapterCard';
import FreeWebsiteReviewSection from '../components/sections/FreeWebsiteReviewSection';

const HomePage = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [selectedWhyWork, setSelectedWhyWork] = useState(0);
  const [isWhyWorkModalOpen, setIsWhyWorkModalOpen] = useState(false);
  const videoRef = useRef(null);
  const scrollRef = useRef(null);
  const whyWorkDetailRef = useRef(null);

  const images = {
    hero: '/hero-bg.jpg',
    network: 'https://image2url.com/r2/default/images/1774353122343-8aa294ba-b330-44d0-b7e0-3de067be087e.jpeg',
    services: 'https://image2url.com/r2/default/images/1774353201111-1eb8e101-7307-48e1-b565-5e18f8eec4a2.jpeg',
    growth: 'https://image2url.com/r2/default/images/1774353242591-51c285d9-8148-4e95-be8a-7957262dfb78.jpeg',
    testimonial: 'https://image2url.com/r2/default/images/1774353377426-3cf3bd24-0864-4229-8159-8631af1e5899.jpg',
    results: 'https://image2url.com/r2/default/images/1774370621484-0a34f5a5-19b9-44ca-9ff1-1a03ac18c894.jpg'
  };

  // Popular services for horizontal scroll
  const popularServices = [
    {
      slug: 'website-development',
      name: 'Website Development',
      icon: <FaCode className="text-4xl text-white" />,
      gradient: 'from-[#18264A] to-[#101c38]',
      accent: 'bg-emerald-500/20',
      tag: 'Popular'
    },
    {
      slug: 'graphic-design',
      name: 'Graphic Design',
      icon: <FaPaintBrush className="text-4xl text-white" />,
      gradient: 'from-[#18264A] to-[#101c38]',
      accent: 'bg-purple-400/20',
      tag: 'In Demand'
    },
    {
      slug: 'photography & visual assets',
      name: 'Photography & Visual Assets',
      icon: <FaCamera className="text-4xl text-white" />,
      gradient: 'from-pink-500 to-rose-600',
      accent: 'bg-pink-400/20',
      tag: 'In Demand'
    },
    {
      slug: 'seo-marketing',
      name: 'SEO & Search Marketing',
      icon: <FaSearch className="text-4xl text-white" />,
      gradient: 'from-green-500 to-emerald-700',
      accent: 'bg-green-400/20',
      tag: 'Growth Focused'
    },
    {
      slug: 'video-editing',
      name: 'Video Editing',
      icon: <FaVideo className="text-4xl text-white" />,
      gradient: 'from-red-500 to-red-700',
      accent: 'bg-red-400/20',
      tag: 'Popular'
    },
    {
      slug: 'brand-identity',
      name: 'Brand Identity & Logo',
      icon: <FaPalette className="text-4xl text-white" />,
      gradient: 'from-orange-500 to-amber-600',
      accent: 'bg-orange-400/20',
      tag: 'Essential'
    },
    {
      slug: 'paid-advertising',
      name: 'Paid Advertising',
      icon: <FaAd className="text-4xl text-white" />,
      gradient: 'from-cyan-500 to-cyan-700',
      accent: 'bg-cyan-400/20',
      tag: 'New'
    },
    {
      slug: 'ecommerce-development',
      name: 'E-Commerce Development',
      icon: <FaShoppingCart className="text-4xl text-white" />,
      gradient: 'from-teal-500 to-teal-700',
      accent: 'bg-teal-400/20',
      tag: 'Popular'
    },
    {
      slug: 'crm-automation',
      name: 'CRM & Automation',
      icon: <FaCogs className="text-4xl text-white" />,
      gradient: 'from-emerald-500 to-teal-700',
      accent: 'bg-indigo-400/20',
      tag: 'Automation'
    },
    {
      slug: 'ai-automation',
      name: 'AI Automation',
      icon: <FaRobot className="text-4xl text-white" />,
      gradient: 'from-violet-600 to-purple-800',
      accent: 'bg-violet-400/20',
      tag: 'Automation'
    }
  ];

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  const whyWorkData = [
    {
      number: '01',
      icon: <FaBriefcase />,
      title: 'One Team for Multiple Business Needs',
      shortDesc: 'Multiple capabilities, one professional relationship.',
      details: 'Get the expertise you need without managing multiple providers. Access web development, digital marketing, design, content, automation, and business support through one professional relationship. Whether your project requires one specialized service or several services working together, ScaleLink Alliance helps coordinate the work under one roof.'
    },
    {
      number: '02',
      icon: <FaCogs />,
      title: 'Solutions Built Around You',
      shortDesc: 'Solutions based on your business goals.',
      details: "Your business isn't one-size-fits-all, so your solution shouldn't be either. We consider your goals, challenges, requirements, budget, and growth priorities before determining the appropriate approach. That means your project is structured around what your business is actually trying to accomplish—not simply around completing a task."
    },
    {
      number: '03',
      icon: <FaHandshake />,
      title: 'Clear Pricing & Milestone-Based Payments',
      shortDesc: 'Defined scope, pricing, and milestones.',
      details: 'Know what you are paying for before work begins. Your project can include a defined scope, deliverables, pricing, milestones, and project requirements. This helps reduce unexpected costs and gives you a clearer understanding of what will be delivered. For applicable projects, payments can be structured around agreed milestones rather than treating the entire project as one undefined transaction.'
    },
    {
      number: '04',
      icon: <FaRocket />,
      title: 'Focused on Business Results, Not Just Deliverables',
      shortDesc: 'Work connected to meaningful outcomes.',
      details: "Completing the work is only part of the objective. A website should support your business goals, marketing should help reach the right audience, and automation should make a useful business process more efficient. We look beyond individual tasks and consider outcomes such as more qualified leads, better customer experiences, improved efficiency, a stronger digital presence, better business processes, and long-term growth."
    },
    {
      number: '05',
      icon: <FaShieldAlt />,
      title: 'Milestone-Based Payment Protection',
      shortDesc: 'Greater accountability around project payments.',
      details: "For projects using ScaleLink's applicable payment protection process, project funds can be managed according to agreed project terms and milestones. This creates greater accountability between payment and project delivery and gives clients additional confidence when purchasing professional services online.",
      learnMoreLink: '/legal?tab=escrow',
      learnMoreLabel: 'View Full Payment Protection Details'
    },
    {
      number: '06',
      icon: <FaCheckCircle />,
      title: 'Scope & Quality Protection',
      shortDesc: 'Work is reviewed against the agreed project scope before final delivery.',
      details: 'Projects are reviewed against the agreed scope, requirements, and specifications to help ensure the completed work meets the expected professional standards. If something within the agreed scope requires attention, our structured project process provides a clear path for addressing it before completion.'
    }
  ];

  const handleWhyWorkSelect = (index) => {
    setSelectedWhyWork(index);
    setIsWhyWorkModalOpen(true);
  };

  useEffect(() => {
    if (!isWhyWorkModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsWhyWorkModalOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isWhyWorkModalOpen]);

  const faqs = [
    { 
      q: 'Can I purchase a single service, or do I need a package?', 
      a: 'You can purchase individual standalone services (such as website maintenance, SEO, paid advertising, or CRM automation) or choose comprehensive end-to-end growth solutions depending on your immediate requirements.' 
    },
    { 
      q: 'Do I need a new website, or can ScaleLink improve my existing one?', 
      a: 'Both. If you have an existing website, our Scale Existing pathway audits performance, fixes conversion leaks, and adds automation. If you need a fresh start, our Start From Scratch pathway builds from the ground up.' 
    },
    { 
      q: 'How do project milestones and payments work?', 
      a: 'Every project includes a defined scope, deliverables, and milestone schedule. For applicable projects, payments are managed on a milestone basis, giving you full accountability and peace of mind before work is completed.' 
    },
    { 
      q: 'How does ScaleLink compare with hiring in-house or juggling freelancers?', 
      a: 'ScaleLink gives you an entire coordinated digital team—developers, marketers, designers, and automation specialists—under one professional relationship without the recruitment costs, management overhead, or payroll of hiring full-time staff.' 
    }
  ];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log("Autoplay prevented:", err);
        setVideoError(true);
      });
    }
  }, []);

  useEffect(() => {
    document.title = 'Business Growth, Web & Marketing Services | ScaleLink Alliance';

    const setMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('description', 'ScaleLink Alliance is a done-for-you digital growth partner that helps businesses build, market, automate and support the systems behind customer acquisition and operations.');
    setMeta('keywords', 'business growth services, digital business services, website development, SEO marketing, lead generation, CRM automation, digital growth partner');
  }, []);

  return (
    <div className="overflow-hidden">
      {/* 🔥 SECTION 1: HERO SECTION */}
      <section className="relative py-20 lg:py-32 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <picture className="block w-full h-full">
            <source 
              media="(max-width: 640px)" 
              srcSet={images.hero}
            />
            <source 
              media="(max-width: 1024px)" 
              srcSet={images.hero}
            />
            <img
              src={images.hero}
              alt="Business growth background"
              className="w-full h-full object-cover object-center"
              loading="eager"
              style={{ 
                objectPosition: 'center 15%',
              }}
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20 w-full">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Hero Headline */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight max-w-none mx-auto">
                Build Better Systems. Attract More Customers. Grow With One Team.
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto px-4 leading-relaxed">
                ScaleLink Alliance helps businesses build and improve the digital systems behind growth — websites, lead generation, CRM, automation, marketing and ongoing technical support under one professional relationship.
              </p>

              {/* Original buttons - maintaining previous styling */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 px-4">
                <Link
                  to="build-from-scratch"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#18264A] to-[#101c38] text-white font-semibold rounded-lg shadow-2xl hover:from-[#101c38] hover:to-[#0a1224] hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <span>Start From Scratch</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/scale-existing-website"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-2xl hover:from-green-700 hover:to-green-800 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <span>Scale My Existing Website</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Helper card - "Not sure what service you need?" - maintaining previous styling */}
              <div className="bg-black/45 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left mx-4">
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  Not Sure What Service You Need? Start With the Problem.
                </h3>
                <Link
                  to="/services/guide-by-problem"
                  className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#18264A] hover:bg-[#101c38] text-white font-bold rounded-xl transition-all text-sm shrink-0 hover:scale-105 shadow-md"
                >
                  Start Here <FaArrowRight className="ml-2 text-xs" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* 🎯 SECTION 2: CHOOSE YOUR STARTING POINT */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#18264A] text-xs font-bold uppercase tracking-[0.18em]">
                Service Pathways
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4">
                Choose Your Starting Point
              </h2>
              <p className="text-gray-600 font-medium">
                Whether you need a brand-new platform, optimization for an existing setup, or specialized standalone services.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1: Start From Scratch */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-slate-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 bg-[#18264A] rounded-xl flex items-center justify-center mb-6 text-white text-xl shadow-md group-hover:scale-110 transition-transform">
                    <FaCode />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Start From Scratch</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Need a brand-new digital platform? We design and build custom websites, web applications, branding, and conversion funnels from the ground up.
                  </p>
                  <ul className="space-y-2.5 mb-8 text-sm">
                    <li className="flex items-center text-gray-700">
                      <FaCheckCircle className="text-emerald-500 mr-2 shrink-0 text-xs" />
                      <span>Custom websites & web apps</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <FaCheckCircle className="text-emerald-500 mr-2 shrink-0 text-xs" />
                      <span>Brand identity & conversion funnels</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <FaCheckCircle className="text-emerald-500 mr-2 shrink-0 text-xs" />
                      <span>Complete launch & deployment</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/build-from-scratch"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#18264A] text-white font-bold rounded-xl hover:bg-[#101c38] transition-colors shadow-md text-sm"
                >
                  Start From Scratch <FaArrowRight className="text-xs" />
                </Link>
              </motion.div>

              {/* Card 2: Scale Existing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-emerald-50/60 to-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-emerald-100 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-6 text-white text-xl shadow-md group-hover:scale-110 transition-transform">
                    <FaChartLine />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Scale What Already Exists</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Already have a website or software? We optimize conversions, rank higher on search, automate lead follow-up, and provide ongoing maintenance.
                  </p>
                  <ul className="space-y-2.5 mb-8 text-sm">
                    <li className="flex items-center text-gray-700">
                      <FaCheckCircle className="text-emerald-500 mr-2 shrink-0 text-xs" />
                      <span>SEO & paid advertising</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <FaCheckCircle className="text-emerald-500 mr-2 shrink-0 text-xs" />
                      <span>CRM & workflow automation</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <FaCheckCircle className="text-emerald-500 mr-2 shrink-0 text-xs" />
                      <span>Ongoing Care & technical maintenance</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/scale-existing-website"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-md text-sm"
                >
                  Scale Existing Website <FaArrowRight className="text-xs" />
                </Link>
              </motion.div>

              {/* Card 3: Standalone Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-slate-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 bg-[#18264A] rounded-xl flex items-center justify-center mb-6 text-white text-xl shadow-md group-hover:scale-110 transition-transform">
                    <FaCogs />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Standalone Services</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Need specific digital execution without a full overhaul? Pick from 20+ on-demand services across web development, marketing, and automation.
                  </p>
                  <ul className="space-y-2.5 mb-8 text-sm">
                    <li className="flex items-center text-gray-700">
                      <FaCheckCircle className="text-emerald-500 mr-2 shrink-0 text-xs" />
                      <span>Pay only for what you need</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <FaCheckCircle className="text-emerald-500 mr-2 shrink-0 text-xs" />
                      <span>Milestone-protected delivery</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <FaCheckCircle className="text-emerald-500 mr-2 shrink-0 text-xs" />
                      <span>Dedicated client tracking portal</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#18264A] text-white font-semibold rounded-xl hover:bg-[#101c38] transition-colors shadow-md text-sm"
                >
                  Explore All Services <FaArrowRight className="text-xs" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header row */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Build, Attract, Convert, Scale
                </h2>
                <p className="text-gray-500 mt-1">Explore what other businesses are using to grow</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => scroll('left')}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 hover:shadow-md transition-all"
                  aria-label="Scroll left"
                >
                  <FaChevronLeft className="text-gray-600 text-sm" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 hover:shadow-md transition-all"
                  aria-label="Scroll right"
                >
                  <FaChevronRight className="text-gray-600 text-sm" />
                </button>
              </div>
            </div>

            {/* Scroll container */}
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto pb-4 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {popularServices.map((service, index) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="flex-shrink-0 w-52 group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image area — gradient + icon */}
                    <div className={`bg-gradient-to-br ${service.gradient} h-36 flex flex-col items-center justify-center relative overflow-hidden`}>
                      {/* Decorative circles */}
                      <div className={`absolute top-2 right-2 w-16 h-16 rounded-full ${service.accent}`}></div>
                      <div className={`absolute bottom-0 left-0 w-20 h-20 rounded-full ${service.accent}`}></div>
                      {/* Icon */}
                      <div className="relative z-10">
                        {service.icon}
                      </div>
                      {/* Tag badge */}
                      <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        {service.tag}
                      </span>
                    </div>
                    {/* Label */}
                    <div className="bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-[#18264A] transition-colors leading-snug">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        View details <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* View all link */}
            <div className="text-center mt-8">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-[#18264A] font-bold hover:text-emerald-700 transition-colors"
              >
                View all services <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>
        </div>

      {/* 💡 SECTION 3: PROBLEM / PAIN with Image */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Most Businesses Struggle to Grow Consistently
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  You may have a great product or service—but growth can feel unpredictable.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaTimesCircle className="text-red-500 text-xl" />
                    <span className="text-gray-700">Leads come inconsistently</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaTimesCircle className="text-red-500 text-xl" />
                    <span className="text-gray-700">Hiring is expensive and time-consuming</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaTimesCircle className="text-red-500 text-xl" />
                    <span className="text-gray-700">Your leads are not being captured or followed up consistently</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaTimesCircle className="text-red-500 text-xl" />
                    <span className="text-gray-700">You're doing everything yourself</span>
                  </div>
                </div>
                <div className="mt-8 p-6 bg-slate-50 border border-slate-200 border-l-4 border-l-[#18264A] rounded-xl">
                  <p className="text-lg text-gray-800">
                    <strong>ScaleLink Alliance</strong> solves this with <strong>one coordinated team to build, market, automate and support</strong> the digital systems behind customer acquisition and business growth.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <img
                  src={images.growth}
                  alt="Business growth visualization"
                  className="rounded-2xl shadow-2xl w-full object-cover"
                />
                <div className="absolute -bottom-4 -left-4 bg-[#18264A] text-white p-4 rounded-xl shadow-lg">
                  <FaRocket className="text-3xl" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 SECTION 4: HOW IT WORKS */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0 }}
                className="text-center p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm"
              >
                <div className="w-16 h-16 bg-[#18264A] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Your Starting Point</h3>
                <p className="text-gray-600">Build new from scratch, scale an existing platform, or select standalone services.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm"
              >
                <div className="w-16 h-16 bg-[#18264A] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Audit & Plan</h3>
                <p className="text-gray-600">We audit your systems, define deliverables and milestone pricing, and assign dedicated specialists.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm"
              >
                <div className="w-16 h-16 bg-[#18264A] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Build, Launch & Support</h3>
                <p className="text-gray-600">Execute with milestone protection, follow progress in your live portal, and scale with ongoing Care.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 💰 SECTION 5: OUTCOMES with Image */}
      <section className="py-20 bg-[#18264A] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  What You Get
                </h2>
                <div className="space-y-4">
                  {[
                    'A stronger system for attracting and converting qualified opportunities',
                    'Better lead capture, CRM automation, and consistent follow-up',
                    'One coordinated team across web, marketing, automation, and support',
                    'Transparent pricing and milestone-based project protection',
                    'Predictable digital systems built for long-term business growth'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <FaCheckCircle className="text-emerald-400 text-xl shrink-0" />
                      <span className="text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={images.results}
                  alt="Business results visualization"
                  className="rounded-2xl shadow-2xl w-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
              Trusted by Growing Businesses
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-[#18264A]">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">
                  "As a creative agency owner, having ScaleLink Services available when my team needs extra capacity is incredibly valuable. It allows us to take on larger projects without hiring additional staff."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#18264A] rounded-full flex items-center justify-center text-white font-bold mr-3">
                    BD
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Benjamin Dunkin</p>
                    <p className="text-sm text-gray-500">Bunkin Creative Agency</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-[#18264A]">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">
                  "ScaleLink Alliance Services helped us completely redesign our brand. The process was efficient and the results exceeded our expectations."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#18264A] rounded-full flex items-center justify-center text-white font-bold mr-3">
                    SL
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Goodman</p>
                    <p className="text-sm text-gray-500">Innovate Solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ SECTION 7: DEDICATED PROJECT TRACKING PORTAL */}
      <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-[0.18em] mb-5">
                  <FaProjectDiagram className="text-[11px]" />
                  Client Experience
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                  Know Exactly What's Happening With Your Project
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Every ScaleLink project includes a dedicated tracking portal where you can follow progress, communicate with your representative, provide resources, and access completed deliverables.
                </p>

                <div className="space-y-3">
                  {[
                    'Monitor project progress and production steps',
                    'View your current project status',
                    'Communicate with your Support Representative',
                    'Keep project communication organized',
                    'Access and download completed project packages',
                    'No separate account or password required'
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
                      <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FaCheckCircle className="text-sm" />
                      </span>
                      <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
                  {/* Mock browser header */}
                  <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-400 truncate">
                      scalelinkalliance.com / project-portal
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>

                  <img
                    src="https://www.image2url.com/r2/default/images/1787666355043-5c438831-cf2e-493f-aeea-2492ae89d51c.jpeg"
                    alt="ScaleLink Alliance dedicated project tracking portal"
                    className="block w-full h-auto object-contain bg-white"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  A live-style preview of the dedicated project tracking portal.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 🧲 SECTION 8: WHY SCALELINK ALLIANCE */}
      <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-[0.18em]">
                Why ScaleLink
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-4">
                Why Work With ScaleLink Alliance?
              </h2>
              <p className="text-gray-600 font-medium leading-relaxed">
                Professional expertise, transparent pricing, project visibility, and built-in protection—from start to finish.
              </p>
            </div>

            {/* Compact grid — click any card to open the full experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {whyWorkData.map((item, index) => (
                <motion.button
                  key={item.number}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  onClick={() => handleWhyWorkSelect(index)}
                  aria-haspopup="dialog"
                  className="group relative overflow-hidden text-left bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18264A] focus-visible:ring-offset-2"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-[#18264A] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />

                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br bg-slate-100 text-[#18264A] flex items-center justify-center shrink-0 ring-1 ring-slate-200 group-hover:bg-[#18264A] group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <span className="text-xs font-black tracking-[0.2em] text-gray-300 group-hover:text-[#18264A] transition-colors">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug text-gray-900 mb-3 group-hover:text-[#18264A] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">
                    {item.shortDesc}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#18264A]">
                    Explore reason
                    <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Mini pop-up experience */}
        <AnimatePresence>
          {isWhyWorkModalOpen && (
            <motion.div
              className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-md p-4 sm:p-6 lg:p-10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setIsWhyWorkModalOpen(false);
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="why-work-modal-title"
            >
              <motion.div
                ref={whyWorkDetailRef}
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-[28px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)] border border-white/70"
              >
                {/* Modal chrome / hero */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#172554] via-[#1d4ed8] to-[#4f46e5] px-6 sm:px-8 lg:px-10 py-7 sm:py-8 text-white">
                  <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-cyan-300/10 blur-3xl" />

                  <div className="relative flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/12 border border-white/15 backdrop-blur-sm px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white/90 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,0.14)]" />
                        ScaleLink Insight
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-white/10 border border-white/15 items-center justify-center shrink-0 backdrop-blur-sm">
                          {whyWorkData[selectedWhyWork].icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold tracking-[0.18em] uppercase text-white/55 mb-1">
                            Reason {whyWorkData[selectedWhyWork].number}
                          </p>
                          <h3 id="why-work-modal-title" className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight pr-4">
                            {whyWorkData[selectedWhyWork].title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsWhyWorkModalOpen(false)}
                      className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center shrink-0 transition-colors"
                      aria-label="Close details"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {/* Scrollable body */}
                <div className="max-h-[calc(92vh-170px)] overflow-y-auto overscroll-contain">
                  <div className="p-6 sm:p-8 lg:p-10">
                    <p className="text-gray-700 text-base sm:text-lg leading-8">
                      {whyWorkData[selectedWhyWork].details}
                    </p>

                    {whyWorkData[selectedWhyWork].learnMoreLink && (
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <Link
                          to={whyWorkData[selectedWhyWork].learnMoreLink}
                          onClick={() => setIsWhyWorkModalOpen(false)}
                          className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#18264A] to-[#101c38] text-white font-semibold rounded-lg shadow-lg hover:from-[#101c38] hover:to-[#0a1224] hover:scale-105 transition-all duration-300"
                        >
                          <span>{whyWorkData[selectedWhyWork].learnMoreLabel || 'View More Details'}</span>
                          <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* CTA after Why ScaleLink Alliance */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            
          </div>
        </div>
      </section>

      {/* 🛑 SECTION 9: FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h4>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 SECTION 10: FINAL CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-[#18264A] to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to strengthen the systems behind your growth?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Let ScaleLink review your current website, lead-generation process and follow-up systems and identify the improvements that can create the greatest business impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/free-website-review"
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:scale-105"
              >
                Get My Free Review
              </Link>
              <Link
                to="/services"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold rounded-xl transition-all backdrop-blur-xs"
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

export default HomePage;