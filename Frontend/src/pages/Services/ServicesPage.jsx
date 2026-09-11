// src/pages/Services/ServicesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getServiceIcon } from '../../utils/serviceIcons';
import { subscribeToServiceUpdates } from '../../utils/serviceSync';
import {
  FaPaintBrush, FaVideo, FaPenNib, FaCogs, FaChartBar, FaDatabase,
  FaFileAlt, FaUsers, FaCheck, FaArrowRight, FaCode, FaGlobe,
  FaShoppingCart, FaRocket, FaAd, FaEnvelope, FaSearch, FaHeadset,
  FaProjectDiagram, FaCamera, FaPalette, FaCloudUploadAlt,
  FaShieldAlt, FaRegBuilding, FaChartLine, FaInfoCircle, FaRobot
} from 'react-icons/fa';

const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [apiServices, setApiServices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchApiServices = async () => {
      try {
        const res = await fetch(`/api/cms/services?catalogOnly=true&_t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (Array.isArray(data?.services) ? data.services : []);
          if (isMounted && list.length > 0) {
            setApiServices(list);
          }
        }
      } catch (err) {
        console.warn('Error fetching services catalog:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchApiServices();
    const unsubscribe = subscribeToServiceUpdates(() => {
      fetchApiServices();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

    useEffect(() => {
      document.title = 'Business Growth Services | ScaleLink Alliance';
  
      const setMeta = (name, content) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

  }, []);


      const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'websites-development', name: 'Build' },
    { id: 'marketing-growth', name: 'SEO' },
    { id: 'automation-technology', name: 'Automate' },
    { id: 'creative-support', name: 'Support' }
  ];

  const customQuoteCard = {
    id: 'custom-quote-card',
    slug: 'custom-quote',
    name: 'Request Custom Quote',
    category: 'all',
    icon: <FaCogs />,
    description: 'Need a specialized solution or looking to combine multiple services? Request a custom quote tailored to your business goals.',
    startingPrice: 'Custom Quote',
    features: ['Personalized consultation', 'Custom scope definition', 'Tailored solution', 'Flexible pricing'],
    whatItHelps: [
      'tailored solutions for unique project requirements',
      'combining multiple services into one custom package',
      'specialized scopes, timelines, and support levels',
      'seamless execution across different business areas'
    ],
    packages: { starter: { price: 'Custom Quote', includes: 'Personalized quote based on your specific needs' } }
  };


  const aiCustomQuoteCard = {
  id: 'ai-custom-quote-card',
  slug: 'ai-automation',
  name: 'Request AI Custom Quote',
  category: 'all',
  icon: <FaRobot />,
  description: 'Looking to build AI-powered tools, automations, or intelligent systems for your business? Request a custom AI quote tailored to your goals.',
  startingPrice: 'Custom Quote',
  features: ['AI workflow discovery', 'Custom automation design', 'Transparent AI project pricing', 'Ongoing AI support'],
  whatItHelps: [
    'automating repetitive tasks with AI',
    'building AI-powered customer tools',
    'integrating AI into existing workflows',
    'scoping AI feasibility for your business'
  ],
  packages: { starter: { price: 'Custom Quote', includes: 'Personalized AI quote based on your specific needs' } }
};

  const catalogSource = apiServices
    ? apiServices.map(s => ({
        id: s.id,
        slug: s.slug,
        name: s.title,
        category: s.category,
        icon: getServiceIcon(s.iconName || s.icon, { size: 20 }),
        description: s.description || s.intro,
        startingPrice: s.startingPrice,
        features: Array.isArray(s.features) ? s.features : [],
        whatItHelps: Array.isArray(s.whatItHelpsAchieve) ? s.whatItHelpsAchieve : (Array.isArray(s.whatItHelps) ? s.whatItHelps : []),
        packages: s.packages || {}
      }))
    : [];

  const filteredServices = [
    ...(activeCategory === 'all'
      ? catalogSource
      : catalogSource.filter(service => service.category === activeCategory)),
    customQuoteCard,
    aiCustomQuoteCard
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-black py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                ScaleLink Alliance Services
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Professional business & marketing services designed to help you grow — no membership required.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Important Clarifier */}
      <section className="py-12 bg-yellow-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 rounded-r-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                🚨 Important Clarification
              </h3>
              <p className="text-gray-800 mb-3">
                You can <strong>request a custom quote to get a solution built around your business.</strong> Some projects
                require a custom quote because every business has different goals, needs, timelines, and support levels.
              </p>
              <a
                href="#custom-solutions"
                className="inline-flex items-center text-blue-700 font-semibold hover:text-blue-900 transition-colors"
              >
                Read More <FaArrowRight className="ml-2" size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Our Service Categories
            </h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-6 font-medium text-lg">
              Explore our services below.
            </p>
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 border-l-4 border-l-blue-500 rounded-r-xl rounded-l-md max-w-2xl mx-auto mb-8 text-left shadow-sm transition-all duration-300 hover:shadow-md">
              <FaInfoCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
              <p className="text-sm leading-relaxed text-blue-800 font-medium">
                <span className="font-semibold text-blue-950">Starting price options</span> are shown during service selection. <span className="font-semibold text-blue-950">Custom quotes</span> are available for larger or more detailed projects.
              </p>
            </div>

            {/* Problem Navigation Callout */}
            <div className="max-w-2xl mx-auto mb-12 text-center">
              <Link 
                to="/services/guide-by-problem"
                className="inline-flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-sm hover:shadow-md hover:scale-102 transition-all duration-300 group text-left w-full"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:rotate-6 transition-transform">
                  <FaInfoCircle size={22} />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors">
                    Not Sure What Service You Need? Start With the Problem
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Navigate our services based on your business challenges & goals
                  </p>
                </div>
                <FaArrowRight className="text-blue-600 ml-auto group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="bg-white rounded-xl shadow border border-gray-200 p-6 animate-pulse flex flex-col h-full space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0" />
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-6 bg-gray-200 rounded w-1/4" />
                    </div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service, index) => {
                const isCustomQuoteCard = service.slug === 'custom-quote' || service.slug === 'ai-custom-quote';
                const isAICustomQuote = service.slug === 'ai-custom-quote';
                
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border overflow-hidden flex flex-col h-full ${
                      isCustomQuoteCard ? 'border-purple-300 bg-gradient-to-br from-purple-50/50 to-blue-50/50' : 'border-gray-200'
                    }`}
                  >
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl shrink-0 ${
                          isCustomQuoteCard ? 'bg-gradient-to-br from-purple-600 to-blue-600' : 'bg-gradient-to-br from-gray-800 to-gray-900'
                        }`}>
                          {service.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                      </div>

                      <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>

                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">What this helps achieve:</h4>
                        <ul className="space-y-1">
                          {service.whatItHelps.map((item, idx) => (
                            <li key={idx} className="flex items-start text-xs">
                              <FaCheck className="text-green-500 mt-0.5 mr-2 shrink-0" size={10} />
                              <span className="text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>


                      <div className="flex flex-col gap-2 mt-auto">
                        {isCustomQuoteCard ? (
                          // Custom Quote Cards - no "View Service Details" button, just "Request This Service" going to Step 2
                          <Link
                            to={`/request-service?service=${service.slug === 'ai-automation' ? 'ai-automation' : service.slug}&step=2`}
                            className={`py-2.5 font-semibold rounded-lg text-center text-sm transition-all ${
                              isAICustomQuote 
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            Request This Service
                          </Link>
                        ) : (
                          // Regular Services - have both buttons
                          <>
                            <Link
                              to={`/services/${service.slug}`}
                              className="py-2.5 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all text-center text-sm"
                            >
                              View Service Details
                            </Link>
                            <Link
                              to={`/request-service?service=${service.slug}`}
                              className="py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center text-sm"
                            >
                              Request This Service
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Custom Solutions Section */}
      <section id="custom-solutions" className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Custom Solutions</h2>
            <p className="text-gray-700 mb-4">
              You can <strong>request a custom quote to get a solution built around your business.</strong> Some projects
              require a custom quote because every business has different goals, needs, timelines, and support levels.
            </p>
            <p className="text-gray-700 mb-6">
              With a custom quote, you can benefit from:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-3 shrink-0" size={14} />
                <span className="text-gray-700"><strong>More accurate pricing</strong> based on your actual project scope</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-3 shrink-0" size={14} />
                <span className="text-gray-700"><strong>A solution built around your business goals</strong></span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-3 shrink-0" size={14} />
                <span className="text-gray-700"><strong>Flexibility for larger or more detailed projects</strong></span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-3 shrink-0" size={14} />
                <span className="text-gray-700"><strong>Better service recommendations</strong> based on what you need most</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-3 shrink-0" size={14} />
                <span className="text-gray-700"><strong>One company handling multiple areas</strong>, including web design, SEO, social media, marketing, and support</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-3 shrink-0" size={14} />
                <span className="text-gray-700"><strong>Free from</strong> the stress of <strong>managing separate freelancers or providers</strong></span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/request-service?service=custom-quote&step=2"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Request Custom Quote
              </Link>
              <Link
                to="/membership"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors text-center"
              >
                Learn About Membership
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              How Our Service Process Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                {
                  step: 1,
                  title: 'Request Service',
                  description: 'Submit service request with your needs and goals'
                },
                {
                  step: 2,
                  title: 'Needs Review',
                  description: 'We review and define scope with clear recommendations'
                },
                {
                  step: 3,
                  title: 'Receive Quote',
                  description: 'Get transparent pricing with defined deliverables'
                },
                {
                  step: 4,
                  title: 'Execution',
                  description: 'Specialists begin work with quality checks'
                },
                {
                  step: 5,
                  title: 'Delivery',
                  description: 'Receive completed work with revision options'
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Service FAQ
            </h3>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: Do I need to be a ScaleLink Alliance member?
                </h4>
                <p className="text-gray-600">
                  <strong>A:</strong> No. Services are available to all businesses. Membership is completely optional.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: Can members also use services?
                </h4>
                <p className="text-gray-600">
                  <strong>A:</strong> Yes. Members receive preferred access and pricing, but services are available to everyone.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: Is there a minimum contract?
                </h4>
                <p className="text-gray-600">
                  <strong>A:</strong> No. Projects are scoped per request. You can start with a one-time project.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: How are services measured?
                </h4>
                <p className="text-gray-600">
                  <strong>A:</strong> Each service has clear measurement criteria—number of assets, pages, hours, or leads—ensuring transparent pricing and deliverables.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Get Professional Work Done?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Submit your service request today. No membership required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/request-service"
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Request Service Now</span>
                <FaArrowRight />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;