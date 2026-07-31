// src/components/sections/PathSelector.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDesktop, FaChartLine, FaRobot, FaArrowRight, FaInfoCircle } from 'react-icons/fa';

const PathSelector = () => {
  return (
    <section className="py-16 bg-amber-50" id="choose-path">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              How Can We Help You Grow?
            </h2>
            <p className="text-gray-600 text-lg">
              Choose the service that best fits your current needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* CARD 1: START FROM SCRATCH */}
            <motion.div
              id="start-from-scratch"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 border-2 border-blue-500 shadow-lg hover:shadow-xl transition-all flex flex-col"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <FaDesktop className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Start From Scratch</h3>
              <p className="text-gray-600 mb-3">
                <strong>Need a brand-new website, store, landing page, booking system, or web application?</strong>
              </p>
              <p className="text-gray-600 mb-4 flex-grow">
                We build custom digital platforms from the ground up to represent your brand, explain your services, and help visitors become customers.
              </p>
              
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Services include:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Website Development</li>
                  <li>• Web Application Development</li>
                  <li>• E-Commerce Development</li>
                  <li>• Landing Pages & Sales Funnels</li>
                  <li>• Online Booking Systems</li>
                  <li>• Brand Identity & Logo Design</li>
                  <li>• Copywriting & Content Creation</li>
                  <li>• Graphic Design</li>
                </ul>
              </div>

              <Link
                to="/request-service?path=start_from_scratch"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mt-auto"
              >
                Build My Website
              </Link>
            </motion.div>

            {/* CARD 2: SCALE EXISTING */}
            <motion.div
              id="scale-existing"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 border-2 border-green-500 shadow-lg hover:shadow-xl transition-all flex flex-col"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <FaChartLine className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Scale My Existing Website</h3>
              <p className="text-gray-600 mb-3">
                <strong>Already have a website?</strong>
              </p>
              <p className="text-gray-600 mb-4 flex-grow">
                We help improve, optimize, and scale your existing website so it can drive more traffic, leads, sales, follow-up, automation, and business growth.
              </p>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Services include:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Website Maintenance & Updates</li>
                  <li>• SEO & Search Marketing</li>
                  <li>• Lead Generation Services</li>
                  <li>• Paid Advertising Management</li>
                  <li>• Email Marketing Campaigns</li>
                  <li>• CRM Setup & Marketing Automation</li>
                  <li>• API Integration</li>
                  <li>• Business Process Automation</li>
                  <li>• Data Analytics & Reports</li>
                  <li>• Social Media Management</li>
                </ul>
              </div>

              <Link
                to="/request-service?path=scale_existing"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors mt-auto"
              >
                Scale My Website
              </Link>
            </motion.div>

            {/* CARD 3: AI AUTOMATION - NEW */}
            <motion.div
              id="ai-automation"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border-2 border-purple-500 shadow-lg hover:shadow-xl transition-all flex flex-col"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <FaRobot className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Automation & Smart Systems</h3>
              <p className="text-gray-600 mb-3">
                <strong>Want to save time, reduce manual work, and improve how your business handles leads, customers, follow-ups, and operations?</strong>
              </p>
              <p className="text-gray-600 mb-4 flex-grow">
                We design custom AI automation systems based on what your business wants to improve. Every project is custom quoted because the right solution depends on your workflow, tools, and goals.
              </p>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Examples include:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• AI lead follow-up systems</li>
                  <li>• AI customer support chatbots</li>
                  <li>• AI appointment booking assistants</li>
                  <li>• AI email response workflows</li>
                  <li>• AI reporting dashboards</li>
                  <li>• AI content workflow automation</li>
                  <li>• AI sales assistant systems</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-800">
                  <strong>Custom Quote Only:</strong> Every AI automation project is custom quoted based on your specific workflow, tools, and goals.
                </p>
              </div>

              <Link
                to="/request-service?path=ai_automation_custom"
                className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors mt-auto"
              >
                Request AI Automation Quote
              </Link>
            </motion.div>
          </div>

          {/* Not sure callout */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-2xl mx-auto mt-10 text-left">
            <FaInfoCircle className="text-blue-600 shrink-0 mt-0.5" size={16} />
            <p className="text-sm text-blue-800">
              Not sure which option is right for you? <Link to="/contact" className="font-semibold underline hover:text-blue-900">Contact us</Link> and we'll help you choose the best path for your business.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathSelector;