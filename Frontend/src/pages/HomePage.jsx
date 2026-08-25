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
import ComparisonTable from '../components/sections/ComparisonTable';
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
    hero: 'https://cdn.phototourl.com/free/2026-07-18-bc90a5a0-13c0-4190-936d-229aca3c8447.jpg',
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
      gradient: 'from-blue-600 to-blue-800',
      accent: 'bg-blue-400/20',
      tag: 'Most Popular'
    },
    {
      slug: 'graphic-design',
      name: 'Graphic Design',
      icon: <FaPaintBrush className="text-4xl text-white" />,
      gradient: 'from-purple-500 to-purple-700',
      accent: 'bg-purple-400/20',
      tag: 'Top Rated'
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
      tag: 'High ROI'
    },
    {
      slug: 'video-editing',
      name: 'Video Editing',
      icon: <FaVideo className="text-4xl text-white" />,
      gradient: 'from-red-500 to-red-700',
      accent: 'bg-red-400/20',
      tag: 'Trending'
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
      tag: 'Fast Results'
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
      gradient: 'from-indigo-500 to-indigo-700',
      accent: 'bg-indigo-400/20',
      tag: 'Scale Faster'
    },
    {
      slug: 'ai-automation',
      name: 'AI Automation',
      icon: <FaRobot className="text-4xl text-white" />,
      gradient: 'from-violet-600 to-purple-800',
      accent: 'bg-violet-400/20',
      tag: 'New'
    }
  ];

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  const featuredServices = [
    {
      id: 1,
      slug: 'graphic-design',
      name: 'Graphic Design',
      icon: <FaPaintBrush />,
      description: 'Strong visual design helps businesses communicate clearly, attract attention, and create a professional brand presence.',
      startingPrice: '$35',
      packages: {
        starter: { price: '$35', name: 'Starter Package', includes: '1 design asset, 1 revision, web-ready files' },
        growth: { price: '$175', name: 'Standard Package', includes: '5 design assets, 2 revisions' },
        premium: { price: '$499', name: 'Premium Package', includes: '10 design assets, priority turnaround' }
      }
    },
    {
      id: 2,
      slug: 'website-development',
      name: 'Website Development',
      icon: <FaCode />,
      description: 'Your website is often the first place potential customers learn about your business. A well-designed website builds credibility.',
      startingPrice: '$699',
      packages: {
        starter: { price: '$699', name: 'Starter Package', includes: 'up to 3 pages, responsive design, contact form' },
        growth: { price: '$1,499', name: 'Standard Package', includes: 'up to 7 pages, advanced layout' },
        premium: { price: '$3,499', name: 'Premium Package', includes: '10+ pages, custom functionality' }
      }
    },
    {
      id: 3,
      slug: 'social-media-management',
      name: 'Social Media Management',
      icon: <FaUsers />,
      description: 'Maintain a consistent and professional social media presence with content planning, creation, and regular engagement.',
      startingPrice: '$299/month',
      packages: {
        starter: { price: '$299/month', name: 'Starter Package', includes: '8 posts/month, content scheduling' },
        growth: { price: '$599/month', name: 'Standard Package', includes: '15 posts/month, graphic content, monthly report' },
        premium: { price: '$1,499/month', name: 'Premium Package', includes: '30 posts/month, custom graphics, detailed reporting' }
      }
    }
  ];

  const valuePoints = [
    { icon: <FaHandshake />, title: 'Weekly Referral Meetings', desc: 'Structured, purpose-driven networking' },
    { icon: <FaUserTie />, title: 'Industry Exclusivity', desc: 'No competition within your chapter' },
    { icon: <FaChartLine />, title: 'Proven Structure', desc: 'Accountability and measurable results' },
    { icon: <FaGlobe />, title: 'Local to Global', desc: 'Chapters nationwide with expansion plans' },
  ];

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
      icon: <FaProjectDiagram />,
      title: 'Dedicated Project Tracking Portal',
      shortDesc: 'See your project progress after purchasing.',
      details: 'Once your project is established, you receive access to a dedicated project tracking portal where you can monitor project progress and production steps, view your current project status, communicate directly with your Support Representative, keep important project communication organized, and access or download completed project packages. No separate account or password is required.',
      image: '/images/Fah.jpeg'
    },
    {
      number: '04',
      icon: <FaHandshake />,
      title: 'Clear Pricing & Milestone-Based Payments',
      shortDesc: 'Defined scope, pricing, and milestones.',
      details: 'Know what you are paying for before work begins. Your project can include a defined scope, deliverables, pricing, milestones, and project requirements. This helps reduce unexpected costs and gives you a clearer understanding of what will be delivered. For applicable projects, payments can be structured around agreed milestones rather than treating the entire project as one undefined transaction.'
    },
    {
      number: '05',
      icon: <FaRocket />,
      title: 'Focused on Business Results, Not Just Deliverables',
      shortDesc: 'Work connected to meaningful outcomes.',
      details: "Completing the work is only part of the objective. A website should support your business goals, marketing should help reach the right audience, and automation should make a useful business process more efficient. We look beyond individual tasks and consider outcomes such as more qualified leads, better customer experiences, improved efficiency, a stronger digital presence, better business processes, and long-term growth."
    },
    {
      number: '06',
      icon: <FaShieldAlt />,
      title: 'Payment & Escrow Protection',
      shortDesc: 'Greater accountability around project payments.',
      details: "For projects using ScaleLink's applicable payment protection process, project funds can be managed according to agreed project terms and milestones. This creates greater accountability between payment and project delivery and gives clients additional confidence when purchasing professional services online."
    },
    {
      number: '07',
      icon: <FaCheckCircle />,
      title: 'Satisfaction Protection',
      shortDesc: 'Work reviewed against the agreed scope.',
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
    { q: 'Do I need to join the network to use services?', a: 'No. You can access services independently.' },
    { q: 'What types of businesses join?', a: 'Consultants, agencies, service providers, and growing companies.' },
    { q: 'How fast can I see results?', a: 'Many businesses begin seeing opportunities within weeks.' },
    { q: 'Is this better than hiring staff?', a: 'Yes—ScaleLink gives you flexible, on-demand support without long-term costs.' }
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

    setMeta('description', 'Grow your business with ScaleLink Alliance through website development, SEO, lead generation, automation, digital marketing and strategic business connections.');
    setMeta('keywords', 'business growth services, digital business services, website development services, digital marketing services, business automation services, business growth solutions, professional business network');
  }, []);

  return (
    <div className="overflow-hidden">
      {/* 🔥 SECTION 1: HERO SECTION */}
      <section className="relative py-20 lg:py-32 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <picture className="block w-full h-full">
            <source 
              media="(max-width: 640px)" 
              srcSet="https://cdn.phototourl.com/free/2026-07-18-bc90a5a0-13c0-4190-936d-229aca3c8447.jpg?w=640&h=800&fit=crop"
            />
            <source 
              media="(max-width: 1024px)" 
              srcSet="https://cdn.phototourl.com/free/2026-07-18-bc90a5a0-13c0-4190-936d-229aca3c8447.jpg?w=1024&h=768&fit=crop"
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
              {/* Original Headline */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight max-w-none mx-auto">
                Grow Your Business With the Right Digital Services and Connections
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto px-4">
                ScaleLink Alliance helps businesses build powerful websites, web applications, and digital growth systems that attract customers, improve operations, and support long-term growth.
              </p>

              {/* Original buttons - maintaining previous styling */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 px-4">
                <Link
                  to="build-from-scratch"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-2xl hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
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

              {/* NEW: Free Website Review Section - Before the helper card */}
              <div className="mb-4 max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4 sm:gap-6 bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                      <FaStar className="text-sm" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold text-sm">
                        Is Your Website Costing You Customers?
                      </p>
                      <p className="text-white/50 text-xs">
                        Get a free professional review
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/free-website-review"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 hover:scale-105 transition-all duration-300 text-sm shadow-lg shadow-amber-500/20 whitespace-nowrap"
                  >
                    <span>Get My Free Review</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
                  </Link>
                </div>
                <p className="text-white/40 text-xs mt-2">
                  No obligation. Get actionable insights for your website.
                </p>
              </div>

              {/* Helper card - "Not sure what service you need?" - maintaining previous styling */}
              <div className="bg-black/45 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left mx-4">
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  Not Sure What Service You Need? Start With the Problem.
                </h3>
                <Link
                  to="/services/guide-by-problem"
                  className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-sm shrink-0 hover:scale-105 shadow-lg shadow-blue-500/20"
                >
                  Start Here <FaArrowRight className="ml-2 text-xs" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* 🎯 SECTION 2: CHOOSE YOUR PATH */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                  <FaUsers className="text-6xl text-blue-600" />
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <FaUsers className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Get More Clients Through Referrals</h2>
                </div>
                <p className="text-gray-700 mb-6">
                  Join a trusted network of professionals designed to generate qualified referrals, build partnerships, and create consistent business opportunities.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    <span className="text-gray-700">Receive qualified referrals</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    <span className="text-gray-700">Build strategic partnerships</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    <span className="text-gray-700">Expand your network</span>
                  </li>
                </ul>
                <Link
                  to="/membership"
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Join the Network
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                  <FaBuilding className="text-6xl text-gray-600" />
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                    <FaBuilding className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Get Work Done Without Hiring</h2>
                </div>
                <p className="text-gray-700 mb-6">
                  Access expert support across design, marketing, development, and operations—on demand.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    <span className="text-gray-700">No hiring required</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    <span className="text-gray-700">Flexible, scalable support</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    <span className="text-gray-700">Done-for-you execution</span>
                  </li>
                </ul>
                <Link
                  to="/services"
                  className="inline-block px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Hire Services
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
                  Everything Your Business Needs to Grow
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
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
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
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
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
                    <span className="text-gray-700">You lack the right connections</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaTimesCircle className="text-red-500 text-xl" />
                    <span className="text-gray-700">You're doing everything yourself</span>
                  </div>
                </div>
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                  <p className="text-lg text-gray-800">
                    <strong>ScaleLink Alliance</strong> solves this by combining <strong>strategic referrals with on-demand business services</strong>—giving you both opportunities and execution.
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
                <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg">
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
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg"
              >
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Your Path</h3>
                <p className="text-gray-600">Join the network or request services based on your needs.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg"
              >
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Get Connected or Supported</h3>
                <p className="text-gray-600">We connect you with professionals or assign expert support.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg"
              >
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Start Seeing Results</h3>
                <p className="text-gray-600">Generate opportunities, reduce workload, and grow faster.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 💰 SECTION 5: OUTCOMES with Image */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
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
                    'Consistent business opportunities',
                    'Stronger professional connections',
                    'Reduced workload and stress',
                    'Access to expert services on demand',
                    'A system designed for long-term growth'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <FaCheckCircle className="text-green-400 text-xl shrink-0" />
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
              <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-blue-500">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">
                  "As a creative agency owner, having ScaleLink Services available when my team needs extra capacity is incredibly valuable. It allows us to take on larger projects without hiring additional staff."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    BD
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Benjamin Dunkin</p>
                    <p className="text-sm text-gray-500">Bunkin Creative Agency</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-blue-500">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">
                  "ScaleLink Alliance Services helped us completely redesign our brand. The process was efficient and the results exceeded our expectations."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
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

      {/* ⚡ SECTION 7: FEATURED SERVICES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">
              Done-For-You Standard Systems
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12">
              Professional services to help you scale without hiring
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 transition-all hover:shadow-2xl hover:border-blue-300"
                >
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl mr-3">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    <div className="text-2xl font-bold text-blue-600 mb-4 invisible">Starting at {service.startingPrice}</div>
                    <div className="space-y-3 mb-6">
                      {Object.entries(service.packages).map(([key, pkg]) => (
                        <div key={key} className="flex items-start p-2 bg-gray-50 rounded-lg">
                          <FaCheckCircle className="text-green-500 mr-2 mt-0.5 shrink-0 text-sm" />
                          <div>
                            <span className="font-semibold text-gray-800 text-sm">{pkg.name}:</span>
                            <span className="text-gray-600 text-sm ml-1">{pkg.includes}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      to={`/services/${service.slug}`}
                      className="block w-full py-3 text-center font-semibold rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/services"
                className="inline-block px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🧲 SECTION 8: WHY SCALELINK ALLIANCE */}
      <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-[0.18em]">
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
                  className="group relative overflow-hidden text-left bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />

                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center shrink-0 ring-1 ring-blue-100 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <span className="text-xs font-black tracking-[0.2em] text-gray-300 group-hover:text-blue-500 transition-colors">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">
                    {item.shortDesc}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
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
                  <div className={`grid ${whyWorkData[selectedWhyWork].image ? 'lg:grid-cols-[0.9fr_1.1fr]' : ''}`}>
                    <div className="p-6 sm:p-8 lg:p-10">
                      <p className="text-gray-700 text-base sm:text-lg leading-8">
                        {whyWorkData[selectedWhyWork].details}
                      </p>

                      {selectedWhyWork === 2 && (
                        <div className="mt-7 space-y-3">
                          <div className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400 mb-3">
                            What your portal gives you
                          </div>
                          {[
                            'Monitor project progress and production steps',
                            'View your current project status',
                            'Communicate with your Support Representative',
                            'Keep project communication organized',
                            'Access and download completed project packages',
                            'No separate account or password required'
                          ].map((feature) => (
                            <div key={feature} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3.5">
                              <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                <FaCheckCircle className="text-sm" />
                              </span>
                              <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {whyWorkData[selectedWhyWork].image && (
                      <div className="p-5 sm:p-7 lg:p-8 bg-slate-50 border-t lg:border-t-0 lg:border-l border-gray-100">
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

                          <div className="relative bg-gray-100">
                            <img
                              src="https://www.image2url.com/r2/default/images/1787666355043-5c438831-cf2e-493f-aeea-2492ae89d51c.jpeg"
                              alt="ScaleLink Alliance dedicated project tracking portal"
                              className="block w-full h-auto max-h-[52vh] object-contain bg-white"
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3 text-center">
                          A live-style preview of the dedicated project tracking portal.
                        </p>
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
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 hover:scale-[1.02] transition-all"
            >
              Hire Services Now
              <FaArrowRight className="text-sm" />
            </Link>
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Whether you need more opportunities or expert execution, ScaleLink Alliance gives you the system to scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/membership"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-xl"
              >
                Join the Network
              </Link>
              <Link
                to="/services"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Hire Services
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition-colors"
              >
                Book a Free Growth Call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;