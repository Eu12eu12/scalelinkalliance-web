// src/pages/FAQPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaQuestionCircle, 
  FaUsers, 
  FaHandshake, 
  FaChartLine, 
  FaBriefcase, 
  FaUserCheck, 
  FaArrowRight, 
  FaCheckCircle, 
  FaTimesCircle,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaFileAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const FAQPage = () => {
  const [openSections, setOpenSections] = useState({
    general: true,
    membership: false,
    services: false,
    participation: false,
    operational: false,
    gettingStarted: false
  });

  const [openQuestions, setOpenQuestions] = useState({});

  const toggleSection = (section) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
  };

  const toggleQuestion = (index) => {
    setOpenQuestions({
      ...openQuestions,
      [index]: !openQuestions[index]
    });
  };

  // FAQ data organized from the document
  const faqData = [
    {
      category: 'General Questions',
      icon: <FaQuestionCircle />,
      questions: [
        {
          q: 'What is Scale Link Alliance?',
          a: 'Scale Link Alliance is a professional growth network that helps businesses scale through strategic connections, trusted relationships, and intentional collaboration. We connect business owners and professionals with opportunities, referrals, and resources designed to support sustainable growth.'
        },
        {
          q: 'How does Scale Link Alliance work?',
          a: 'We operate by aligning businesses with the right people, services, and opportunities within our curated network. Members and service clients benefit from strategic introductions, collaboration opportunities, and ongoing relationship-based growth support.'
        },
        {
          q: 'Who is Scale Link Alliance designed for?',
          a: 'Our network is built for business owners, entrepreneurs, professional service providers, and growth-focused teams. If you are looking to expand your reach, build stronger relationships, and access meaningful opportunities, Scale Link Alliance is designed for you.',
          bulletPoints: [
            'Business owners',
            'Entrepreneurs',
            'Professional service providers',
            'Growth-focused teams'
          ]
        }
      ]
    },
    {
      category: 'Membership Questions',
      icon: <FaUsers />,
      questions: [
        {
          q: 'Do I have to become a member to work with Scale Link Alliance?',
          a: 'No. While membership offers ongoing access to the network and collaboration ecosystem, businesses can also engage through individual services and targeted introductions without committing to membership.'
        },
        {
          q: 'What are the benefits of becoming a member?',
          a: 'Members gain access to curated professional connections, referral-based opportunities, strategic collaboration sessions, insights, resources, and growth discussions—all within a structured environment focused on long-term business growth.',
          bulletPoints: [
            'Curated professional connections',
            'Referral-based opportunities',
            'Strategic collaboration sessions',
            'Insights, resources, and growth discussions',
            'A structured environment focused on long-term business growth'
          ]
        },
        {
          q: 'Is membership exclusive?',
          a: 'Membership may be limited based on industry category, geographic region, or alignment with the alliance\'s mission to maintain quality connections and meaningful collaboration.'
        }
      ]
    },
    {
      category: 'Services (Non-Membership) Questions',
      icon: <FaBriefcase />,
      questions: [
        {
          q: 'What if I\'m not ready to join as a member?',
          a: 'Businesses can still benefit from Scale Link Alliance through direct services such as strategic introductions, referral matchmaking, and business growth consultations without a membership commitment.'
        },
        {
          q: 'How are introductions and referrals handled?',
          a: 'Introductions are made intentionally based on business goals, alignment, and relevance. While we facilitate connections, outcomes depend on the participating businesses and their collaboration efforts.'
        },
        {
          q: 'Are referrals guaranteed?',
          a: 'No. Scale Link Alliance provides access to opportunities and strategic connections, but results depend on factors such as business readiness, service quality, and engagement level. We focus on positioning businesses for growth rather than promising specific results.'
        }
      ]
    },
    {
      category: 'Participation & Expectations',
      icon: <FaHandshake />,
      questions: [
        {
          q: 'What is expected from members or service participants?',
          a: 'Participants are expected to engage professionally, collaborate respectfully, and contribute to the overall integrity of the network. Active participation and relationship-building significantly enhance results.'
        },
        {
          q: 'How quickly will I see results?',
          a: 'Growth timelines vary depending on each business\'s industry, engagement level, and collaboration efforts. Scale Link Alliance is designed for sustainable growth rather than quick, transactional outcomes.'
        },
        {
          q: 'Can any business join the alliance?',
          a: 'We work with businesses that align with our mission of trust-based collaboration and growth. Acceptance may depend on factors such as professionalism, service quality, and alignment with our network values.'
        }
      ]
    },
    {
      category: 'Operational & Legal Clarity',
      icon: <FaFileAlt />,
      questions: [
        {
          q: 'Does Scale Link Alliance provide legal, financial, or professional advice?',
          a: 'No. We provide connections, collaboration opportunities, and strategic growth support. Businesses should consult their own legal, financial, or professional advisors for specific guidance.'
        },
        {
          q: 'Are partnerships or collaborations guaranteed?',
          a: 'No. While we facilitate meaningful introductions and opportunities, final business relationships are determined independently by the participating parties.'
        },
        {
          q: 'Can services or memberships change over time?',
          a: 'Yes. Scale Link Alliance may update its programs, services, or offerings as the network evolves to better support member and client needs.'
        }
      ]
    },
    {
      category: 'Getting Started',
      icon: <FaUserCheck />,
      questions: [
        {
          q: 'How do I get started?',
          a: 'You can begin by contacting us through the website, requesting more information, or applying for membership or services. We will assess your goals and recommend the most suitable path for engagement.'
        },
        {
          q: 'How can I contact Scale Link Alliance?',
          a: 'You can reach us via website contact form, email, or phone.',
          contact: {
            website: 'www.scalelinkalliance.com/contact',
            email: 'Support@scalelinkalliance.com',
            phone: '+1-815-669-0642'
          }
        },
        {
          q: 'What makes Scale Link Alliance different from traditional networking groups?',
          a: 'Traditional networking focuses on exchanging contacts. Scale Link Alliance focuses on building intentional, trust-based relationships that lead to strategic opportunities and sustainable business growth.',
          comparison: [
            'Traditional networking: Exchanging contacts',
            'Scale Link Alliance: Building intentional, trust-based relationships that lead to strategic opportunities and sustainable business growth'
          ]
        }
      ]
    }
  ];

  // Quick stats
  const stats = [
    { label: 'Industries Represented', value: '50+' },
    { label: 'Active Chapters', value: '25+' },
    { label: 'Member Satisfaction', value: '96%' },
    { label: 'Avg. Referrals/Year', value: '150+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-600 to-blue-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Everything you need to know about Scale Link Alliance
              </p>
              
              {/* Quick Contact */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:Support@scalelinkalliance.com"
                  className="inline-flex items-center justify-center space-x-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <FaEnvelope />
                  <span>Support@scalelinkalliance.com</span>
                </a>
                <a 
                  href="tel:+18156690642"
                  className="inline-flex items-center justify-center space-x-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <FaPhone />
                  <span>+1-815-669-0642</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Jump to Category:</h2>
              <div className="flex flex-wrap gap-3">
                {faqData.map((category, idx) => (
                  <a
                    key={idx}
                    href={`#${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm font-medium"
                  >
                    {category.category}
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-6">
              {faqData.map((category, categoryIndex) => (
                <motion.div
                  key={categoryIndex}
                  id={category.category.toLowerCase().replace(/\s+/g, '-')}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden scroll-mt-24"
                >
                  {/* Category Header */}
                  <div
                    onClick={() => toggleSection(Object.keys(openSections)[categoryIndex])}
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                        {category.icon}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {category.category}
                      </h2>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700">
                      {openSections[Object.keys(openSections)[categoryIndex]] ? (
                        <FaChevronUp size={20} />
                      ) : (
                        <FaChevronDown size={20} />
                      )}
                    </button>
                  </div>

                  {/* Questions */}
                  {openSections[Object.keys(openSections)[categoryIndex]] && (
                    <div className="border-t border-gray-200">
                      {category.questions.map((item, questionIndex) => {
                        const uniqueId = `${categoryIndex}-${questionIndex}`;
                        return (
                          <div key={questionIndex} className="border-b last:border-b-0">
                            <div
                              onClick={() => toggleQuestion(uniqueId)}
                              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              <h3 className="text-lg font-semibold text-gray-800 pr-8">
                                {item.q}
                              </h3>
                              <button className="text-blue-600 hover:text-blue-800">
                                {openQuestions[uniqueId] ? <FaChevronUp /> : <FaChevronDown />}
                              </button>
                            </div>
                            
                            {openQuestions[uniqueId] && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="px-6 pb-6"
                              >
                                <div className="bg-gray-50 rounded-lg p-6">
                                  <p className="text-gray-700 mb-4">{item.a}</p>
                                  
                                  {/* Bullet Points */}
                                  {item.bulletPoints && (
                                    <ul className="space-y-2 mb-4">
                                      {item.bulletPoints.map((point, idx) => (
                                        <li key={idx} className="flex items-start space-x-3">
                                          <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                          <span className="text-gray-700">{point}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                  
                                  {/* Contact Information */}
                                  {item.contact && (
                                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                      <h4 className="font-semibold text-gray-900 mb-3">Contact Information:</h4>
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                          <FaGlobe className="text-blue-600" />
                                          <a href="https://www.scalelinkalliance.com" className="text-blue-600 hover:underline">
                                            {item.contact.website}
                                          </a>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          <FaEnvelope className="text-blue-600" />
                                          <a href={`mailto:${item.contact.email}`} className="text-blue-600 hover:underline">
                                            {item.contact.email}
                                          </a>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          <FaPhone className="text-blue-600" />
                                          <a href={`tel:${item.contact.phone}`} className="text-blue-600 hover:underline">
                                            {item.contact.phone}
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Comparison */}
                                  {item.comparison && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {item.comparison.map((comp, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                                          {idx === 0 ? (
                                            <div className="flex items-start space-x-2">
                                              <FaTimesCircle className="text-red-500 mt-1 flex-shrink-0" />
                                              <span className="text-gray-700">{comp}</span>
                                            </div>
                                          ) : (
                                            <div className="flex items-start space-x-2">
                                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                              <span className="text-gray-700 font-medium">{comp}</span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Still Have Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 bg-linear-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-lg opacity-90 mb-6">
                We're here to help you find the right path for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Learn How It Works
                </Link>
              </div>
            </motion.div>

            {/* Quick Links */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Quick Links:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/membership" className="text-blue-600 hover:underline">Membership</Link>
                <span className="text-gray-400">•</span>
                <Link to="/services" className="text-blue-600 hover:underline">Services</Link>
                <span className="text-gray-400">•</span>
                <Link to="/chapters" className="text-blue-600 hover:underline">Find a Chapter</Link>
                <span className="text-gray-400">•</span>
                <Link to="/resources" className="text-blue-600 hover:underline">Resources</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;