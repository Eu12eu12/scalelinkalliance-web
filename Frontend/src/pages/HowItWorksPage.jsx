// src/pages/HowItWorksPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaHandshake, FaChartLine, FaBriefcase, FaCalendarCheck, 
  FaUserCheck, FaArrowRight, FaCheckCircle, FaTimesCircle, FaPaintBrush,
  FaVideo, FaPenNib, FaPalette, FaCamera, FaCode, FaRocket, FaShoppingCart,
  FaGlobe, FaCloudUploadAlt, FaShieldAlt, FaAd, FaEnvelope, FaSearch,
  FaHeadset, FaProjectDiagram, FaDatabase, FaFileAlt, FaChartBar,
  FaRegBuilding, FaCogs, FaBuilding
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HowItWorksPage = () => {
  const [activeTab, setActiveTab] = useState('network');

  // Images from the provided URLs
  const images = {
    network: 'https://image2url.com/r2/default/images/1774353122343-8aa294ba-b330-44d0-b7e0-3de067be087e.jpeg',
    services: 'https://image2url.com/r2/default/images/1774353201111-1eb8e101-7307-48e1-b565-5e18f8eec4a2.jpeg',
    growth: 'https://image2url.com/r2/default/images/1774353242591-51c285d9-8148-4e95-be8a-7957262dfb78.jpeg'
  };

  const networkSteps = [
    {
      step: 1,
      icon: <FaUserCheck />,
      title: 'Apply & Qualify',
      description: 'Submit your application. We verify business credibility and check industry availability.',
      details: 'Every member is vetted to ensure professionalism and industry exclusivity.'
    },
    {
      step: 2,
      icon: <FaUsers />,
      title: 'Get Connected',
      description: 'We connect you with the right chapter and professionals in your industry.',
      details: 'Qualified applicants are matched with chapters that have open seats in their industry.'
    },
    {
      step: 3,
      icon: <FaCalendarCheck />,
      title: 'Attend Weekly Meetings',
      description: 'Join structured meetings focused on referral exchange and relationship building.',
      details: 'Members meet weekly for 90-minute sessions with clear agendas and accountability.'
    },
    {
      step: 4,
      icon: <FaHandshake />,
      title: 'Build Trust & Refer',
      description: 'Develop long-term relationships that generate consistent, high-quality referrals.',
      details: 'Growth compounds through trust and consistency, not volume of connections.'
    },
    {
      step: 5,
      icon: <FaChartLine />,
      title: 'Scale With Accountability',
      description: 'Track referrals, measure ROI, and receive support for predictable growth.',
      details: 'Performance metrics and leadership support keep growth on track.'
    }
  ];

  const servicesSteps = [
    {
      step: 1,
      title: 'Request Service',
      description: 'Submit a service request outlining your needs, goals, and timeline.',
      details: 'No membership required. Services are completely standalone.'
    },
    {
      step: 2,
      title: 'Needs Review',
      description: 'Our team reviews your request, clarifies objectives, and defines scope.',
      details: 'No pressure. No upselling. Just clear recommendations.'
    },
    {
      step: 3,
      title: 'Receive Quote',
      description: 'Get transparent pricing with defined deliverables and timeline expectations.',
      details: 'You approve before any work begins.'
    },
    {
      step: 4,
      title: 'Execution',
      description: 'Specialists begin work with quality checks and regular updates.',
      details: 'Account manager oversees delivery from start to finish.'
    },
    {
      step: 5,
      title: 'Delivery & Support',
      description: 'Receive completed work and optional ongoing support.',
      details: 'Projects delivered on schedule with revision options per scope.'
    }
  ];

  const whoItsFor = [
    'Business owners & entrepreneurs',
    'Consultants & agencies',
    'Financial, legal, and real estate professionals',
    'Technology & service providers',
    'B2B companies seeking warm introductions'
  ];

  // Outcomes for Network
  const networkOutcomes = [
    'Consistent qualified referrals',
    'Strategic business partnerships',
    'Weekly accountability and support',
    'Industry exclusivity protection',
    'Long-term relationship building'
  ];

  // Outcomes for Services
  const servicesOutcomes = [
    'Professional execution without hiring',
    'Flexible, scalable support',
    'Fast turnaround times',
    'Transparent pricing',
    'Done-for-you delivery'
  ];

  // All 22 services organized by category with proper slugs
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

  // Comparison table data
  const comparisonData = [
    {
      feature: 'Membership Required',
      network: <FaCheckCircle className="text-green-600" />,
      services: <FaTimesCircle className="text-red-600" />
    },
    {
      feature: 'Weekly Meetings',
      network: 'Required',
      services: 'Not Required'
    },
    {
      feature: 'Industry Exclusivity',
      network: 'Yes - No competitors in chapter',
      services: 'No - Open to all'
    },
    {
      feature: 'Service Request Access',
      network: 'Yes',
      services: 'Yes'
    },
    {
      feature: 'Referral Exchange',
      network: 'Core focus',
      services: 'Not applicable'
    },
    {
      feature: 'Business Support',
      network: 'Included',
      services: 'À la carte'
    },
    {
      feature: 'Best For',
      network: 'Referral-driven professionals',
      services: 'Any business needing execution'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="absolute inset-0">
          <img
            src={images.growth}
            alt="Business growth"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                How ScaleLink Alliance Works
              </h1>
              <p className="text-xl text-white/90 mb-6">
                A proven system for business growth through structured relationships <strong>OR</strong> professional execution
              </p>
              
              {/* Clear differentiation banner */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-white text-xl" />
                    </div>
                    <span className="text-white font-semibold">
                      Use our services <strong>without</strong> membership
                    </span>
                  </div>
                  <div className="text-white text-lg">
                    <strong>OR</strong>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <FaUsers className="text-white text-xl" />
                    </div>
                    <span className="text-white font-semibold">
                      Join the network for referrals <strong>with</strong> membership
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-white/80 text-lg font-medium">
                Choose what works for your business. There's <strong>no obligation</strong> either way.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Clear Comparison Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Network vs Services: Clear Differences
            </h2>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 border-b">
                <div className="md:col-span-1 p-6 bg-gray-50">
                  <h3 className="text-xl font-bold text-gray-900">Feature Comparison</h3>
                </div>
                <div className="p-6 bg-blue-50">
                  <h3 className="text-xl font-bold text-blue-700 mb-2">Referrals Network</h3>
                  <p className="text-sm text-gray-600">Membership-based referral networking</p>
                </div>
                <div className="p-6 bg-gray-50">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Done-For-You Services</h3>
                  <p className="text-sm text-gray-600">Professional services - <strong>No membership required</strong></p>
                </div>
              </div>
              
              {comparisonData.map((row, index) => (
                <div key={index} className={`grid grid-cols-1 md:grid-cols-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="md:col-span-1 p-6 border-b md:border-b-0 md:border-r border-gray-200">
                    <h4 className="font-semibold text-gray-900">{row.feature}</h4>
                  </div>
                  <div className="p-6 border-b md:border-b-0 border-gray-200 flex items-center">
                    {typeof row.network === 'string' ? (
                      <span className="font-medium text-gray-900">{row.network}</span>
                    ) : (
                      row.network
                    )}
                  </div>
                  <div className="p-6 flex items-center">
                    {typeof row.services === 'string' ? (
                      <span className={`font-medium ${row.feature === 'Membership Required' ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                        {row.services}
                      </span>
                    ) : (
                      row.services
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Key Takeaway */}
            <div className="mt-8 flex justify-center">
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-r-lg max-w-3xl">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Key Takeaway
                </h4>
                <p className="text-gray-700 text-lg">
                  <strong>You can use ScaleLink Alliance Services without being a network member.</strong>
                  <br />
                  The two offerings are completely independent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs for Network vs Services */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Choose Your Path to Growth
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6 mb-12">
              <div 
                onClick={() => setActiveTab('network')}
                className={`cursor-pointer flex-1 p-8 rounded-2xl transition-all duration-300 ${
                  activeTab === 'network' 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl scale-105' 
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 rounded-lg ${
                    activeTab === 'network' ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <FaUsers className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Referrals Network</h3>
                    <p className={`mt-1 ${activeTab === 'network' ? 'text-blue-100' : 'text-blue-600'}`}>
                      <strong>Membership Required</strong>
                    </p>
                  </div>
                </div>
                <p className={`mb-6 ${activeTab === 'network' ? 'text-blue-100' : 'text-gray-600'}`}>
                  Structured referral networking through local chapters. Industry exclusivity ensures no competition.
                </p>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${activeTab === 'network' ? 'text-white' : 'text-blue-600'}`}>
                    For referral-driven professionals
                  </span>
                  {activeTab === 'network' && <FaArrowRight className="text-xl" />}
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('services')}
                className={`cursor-pointer flex-1 p-8 rounded-2xl transition-all duration-300 ${
                  activeTab === 'services'
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-2xl scale-105'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 rounded-lg ${
                    activeTab === 'services' ? 'bg-white/20' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <FaBriefcase className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Done-For-You Services</h3>
                    <p className={`mt-1 ${activeTab === 'services' ? 'text-gray-200' : 'text-green-600 font-bold'}`}>
                      <strong>No Membership Required</strong>
                    </p>
                  </div>
                </div>
                <p className={`mb-6 ${activeTab === 'services' ? 'text-gray-200' : 'text-gray-600'}`}>
                  Professional business and marketing services. Available to all businesses, whether you're a member or not.
                </p>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${activeTab === 'services' ? 'text-white' : 'text-gray-700'}`}>
                    For any business needing execution
                  </span>
                  {activeTab === 'services' && <FaArrowRight className="text-xl" />}
                </div>
              </div>
            </div>

            {/* Network Flow */}
            {activeTab === 'network' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={images.network}
                    alt="Network connections"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/60 flex items-center justify-center">
                    <h2 className="text-3xl font-bold text-white text-center">
                      A Structured Referral Network Built for Long-Term Business Growth
                    </h2>
                  </div>
                </div>
                
                <div className="p-8">
                  <p className="text-gray-600 text-lg mb-8 text-center">
                    ScaleLink Alliance operates through <strong>local chapters</strong> made up of{' '}
                    <strong>non-competing professionals</strong> who meet weekly to build trust, exchange qualified referrals, 
                    and grow their businesses through relationships.
                  </p>

                  {/* Steps */}
                  <div className="relative">
                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-200 to-blue-400"></div>
                    
                    {networkSteps.map((step, index) => (
                      <div key={step.step} className={`flex flex-col lg:flex-row items-center mb-12 lg:mb-16 ${
                        index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                      }`}>
                        <div className="lg:w-1/2 flex justify-center lg:justify-end lg:pr-12 mb-6 lg:mb-0">
                          <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                              {step.icon}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                              {step.step}
                            </div>
                          </div>
                        </div>
                        
                        <div className="lg:w-1/2 lg:pl-12">
                          <div className="bg-gray-50 rounded-xl p-6 shadow-lg">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-700 mb-3">{step.description}</p>
                            <p className="text-gray-600 text-sm">{step.details}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Outcomes for Network */}
                  <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What You Get</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {networkOutcomes.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <FaCheckCircle className="text-green-600 shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Who It's For */}
                  <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                      Who This Is For
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {whoItsFor.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 text-center">
                      <p className="text-gray-700 mb-6">
                        If referrals matter to your business, <strong>ScaleLink Alliance belongs in your growth strategy</strong>.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                          to="/membership"
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                          Apply for Membership
                        </Link>
                        <Link
                          to="/chapters"
                          className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          Find a Chapter Near You
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Services Flow */}
            {activeTab === 'services' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={images.services}
                    alt="Business services"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-800/60 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-white mb-2">
                        Professional Business & Marketing Services
                      </h2>
                      <p className="text-white/90 text-lg">
                        <strong>Available to all businesses - No membership required</strong>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <p className="text-gray-600 text-lg mb-8 text-center">
                    ScaleLink Alliance Services provides done-for-you creative, marketing, and operational support 
                    for businesses that want execution without networking commitments.
                  </p>

                  {/* ALL 22 SERVICES - Organized by Category */}
                  <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                      Our Complete Service Offering (22 Services)
                    </h3>
                    
                    <div className="space-y-8">
                      {allServices.map((category, catIndex) => {
                        const CategoryIcon = category.icon;
                        const colorClasses = {
                          purple: 'bg-purple-50 border-purple-200 text-purple-700',
                          indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
                          green: 'bg-green-50 border-green-200 text-green-700',
                          orange: 'bg-orange-50 border-orange-200 text-orange-700'
                        };
                        
                        return (
                          <div key={catIndex} className="border-2 border-gray-100 rounded-xl overflow-hidden">
                            <div className={`${colorClasses[category.color]} p-4 border-b`}>
                              <div className="flex items-center space-x-3">
                                <CategoryIcon className="text-2xl" />
                                <h4 className="text-xl font-bold">{category.category}</h4>
                                <span className="ml-auto text-sm font-medium">
                                  {category.services.length} services
                                </span>
                              </div>
                            </div>
                            <div className="p-4 bg-white">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {category.services.map((service, sIndex) => {
                                  const ServiceIcon = service.icon;
                                  return (
                                    <Link
                                      key={sIndex}
                                      to={service.slug.includes('custom-quote') ? `/request-service?service=${service.slug}` : `/services/${service.slug}`}
                                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200"
                                    >
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        category.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                        category.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                                        category.color === 'green' ? 'bg-green-100 text-green-600' :
                                        'bg-orange-100 text-orange-600'
                                      }`}>
                                        <ServiceIcon className="text-sm" />
                                      </div>
                                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1">
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
                  </div>

                  {/* Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                    {servicesSteps.map((step) => (
                      <div key={step.step} className="text-center">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                          {step.step}
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Outcomes for Services */}
                  <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What You Get</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {servicesOutcomes.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <FaCheckCircle className="text-green-600 shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Important Clarifier */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8 mt-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                        <FaCheckCircle className="text-white text-2xl" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">
                          Important Clarification
                        </h4>
                        <p className="text-gray-700 text-lg">
                          <strong>ScaleLink Alliance Services is completely independent from chapters and membership.</strong>
                          <br />
                          <span className="text-green-700 font-bold">
                            You can use our services without ever joining the network. No membership required. No referral obligations.
                          </span>
                        </p>
                        <p className="text-gray-600 mt-3">
                          Some clients use services only. Some members also use services. There is{' '}
                          <strong>no requirement or obligation</strong> either way.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-8 text-center">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-3">
                        Ready to Get Started?
                      </h4>
                      <p className="text-gray-700 mb-4">
                        <strong>Remember:</strong> You don't need to be a network member to use our services.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                          to="/request-service"
                          className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-lg hover:from-gray-900 hover:to-black transition-all"
                        >
                          Request Services <span className="text-green-400">(No Membership)</span>
                        </Link>
                        <Link
                          to="/services"
                          className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-lg border-2 border-gray-800 hover:bg-gray-50 transition-colors"
                        >
                          View All Services
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Need Clarity? We're Here to Help
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Still unsure which path is right for your business? We can help you decide.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all"
              >
                Schedule a Consultation
              </Link>
              <Link
                to="/faq"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                View FAQs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link
          to="/contact"
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2 animate-pulse"
        >
          <FaArrowRight className="text-sm" />
          <span className="font-semibold">Book a Free Growth Call</span>
        </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;