// src/pages/BuildFromScratch.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCode, FaGlobe, FaShoppingCart, FaRocket, FaPaintBrush,
  FaPenNib, FaPalette, FaCamera, FaVideo, FaArrowRight,
  FaCheckCircle, FaDesktop, FaStar, FaClock, FaShieldAlt
} from 'react-icons/fa';

const services = [
  {
    slug: 'website-development',
    name: 'Website Development',
    icon: <FaCode />,
    gradient: 'from-blue-500 to-blue-700',
    description: 'Custom websites built to represent your brand, capture leads, and convert visitors into customers.',
    bestFor: 'Businesses launching their first professional website',
    includes: ['Up to 12 pages', 'Mobile-friendly design', 'Contact forms & SEO', 'Launch support'],
  },
  {
    slug: 'web-applications',
    name: 'Web Applications & SaaS',
    icon: <FaGlobe />,
    gradient: 'from-indigo-500 to-indigo-700',
    description: 'Custom dashboards, client portals, booking tools, and SaaS platforms built to your exact workflow.',
    bestFor: 'Businesses needing custom digital tools or software',
    includes: ['User login & access control', 'Database integration', 'Workflow automation', 'API integrations'],
  },
  {
    slug: 'ecommerce-development',
    name: 'E-Commerce Development',
    icon: <FaShoppingCart />,
    gradient: 'from-teal-500 to-teal-700',
    description: 'Online stores built to sell — with smooth checkout, inventory management, and payment integration.',
    bestFor: 'Businesses selling products online',
    includes: ['Up to 100 products', 'Payment gateway setup', 'Mobile-optimized store', 'Order management'],
  },
  {
    slug: 'landing-pages',
    name: 'Landing Pages & Sales Funnels',
    icon: <FaRocket />,
    gradient: 'from-orange-500 to-orange-700',
    description: 'Conversion-focused pages and multi-step funnels built around a single goal: turning visitors into leads.',
    bestFor: 'Campaigns, product launches, and lead generation',
    includes: ['Up to 5 funnel pages', 'Lead capture forms', 'Analytics setup', 'CTA optimization'],
  },
  {
    slug: 'brand-identity',
    name: 'Brand Identity & Logo Design',
    icon: <FaPalette />,
    gradient: 'from-purple-500 to-purple-700',
    description: 'A complete visual identity — logo, colors, typography, and brand guidelines — that makes you look professional and memorable.',
    bestFor: 'New businesses or rebranding projects',
    includes: ['Logo concepts', 'Color palette', 'Typography selection', 'Brand style guide'],
  },
  {
    slug: 'copywriting',
    name: 'Copywriting & Content Creation',
    icon: <FaPenNib />,
    gradient: 'from-rose-500 to-rose-700',
    description: 'Clear, persuasive copy for your website, campaigns, emails, and more — written to attract customers and drive action.',
    bestFor: 'New websites, product launches, marketing campaigns',
    includes: ['Website copy', 'SEO-friendly formatting', 'Brand voice alignment', 'Multiple revisions'],
  },
  {
    slug: 'graphic-design',
    name: 'Graphic Design',
    icon: <FaPaintBrush />,
    gradient: 'from-pink-500 to-pink-700',
    description: 'Professional marketing materials — social media graphics, flyers, banners, and presentations — that communicate your value visually.',
    bestFor: 'Marketing campaigns, social media, promotional materials',
    includes: ['Up to 10 design assets', 'Web-ready formats', 'Brand-consistent styling', 'Priority revisions'],
  },
  {
    slug: 'photography',
    name: 'Photography & Visual Assets',
    icon: <FaCamera />,
    gradient: 'from-amber-500 to-amber-700',
    description: 'Professional photography that gives your business a credible, polished visual presence across all platforms.',
    bestFor: 'New websites, product launches, brand building',
    includes: ['Up to 50 edited photos', 'Multi-scene sessions', 'High-resolution delivery', 'Advanced retouching'],
  },
  {
    slug: 'video-editing',
    name: 'Video Editing & Motion Graphics',
    icon: <FaVideo />,
    gradient: 'from-red-500 to-red-700',
    description: 'Polished promotional videos, social media clips, and motion graphics that communicate your brand story effectively.',
    bestFor: 'Social media marketing, product demos, brand videos',
    includes: ['Up to 5 videos', 'Motion graphics', 'Color grading', 'Multiple export formats'],
  },
];

const whyBuild = [
  { icon: <FaDesktop />, title: 'Built around your brand', desc: 'Every project is custom — no templates, no shortcuts.' },
  { icon: <FaShieldAlt />, title: 'Milestone-based payments', desc: 'You pay as deliverables are completed, not upfront.' },
  { icon: <FaStar />, title: 'Professional quality guaranteed', desc: 'Our satisfaction policy ensures work meets your specs.' },
  { icon: <FaClock />, title: 'One company, multiple services', desc: 'Design, dev, copy, and media — all under one roof.' },
];

const BuildFromScratch = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-950 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold rounded-full mb-6">
                <FaDesktop className="text-xs" /> Start From Scratch
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Build a Powerful Digital
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200 mt-1">
                  Presence From Day One
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                Need a brand-new website, web app, online store, or complete brand identity? We build it from the ground up — designed to represent your business and drive real results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/request-service?path=start_from_scratch"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-xl shadow-blue-900/40"
                >
                  Start My Project <FaArrowRight />
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

      {/* Why build section */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {whyBuild.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3 text-lg">
                  {item.icon}
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">{item.title}</p>
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
                Choose Your Starting Point
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Every service below is available as a standalone project or as part of a bundled package. All built from scratch, around your goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Gradient header */}
                  <div className={`bg-gradient-to-r ${service.gradient} p-5 flex items-center gap-3`}>
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white text-lg">
                      {service.icon}
                    </div>
                    <h3 className="text-white font-bold text-base leading-snug">{service.name}</h3>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Best for</p>
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
                        to={`/request-service?service=${service.slug}&path=start_from_scratch`}
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

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Not Sure Where to Start?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Tell us about your business goals and we'll recommend the right starting point — no commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/request-service?path=start_from_scratch"
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
              >
                Start My Project
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                Book a Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BuildFromScratch;