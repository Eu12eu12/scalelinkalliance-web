import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaHandshake, FaChartLine, FaUserTie, 
  FaCalendarCheck, FaShieldAlt, FaArrowRight, 
  FaCheck, FaTimes, FaQuestionCircle, FaGift, FaClock 
} from 'react-icons/fa';
import MembershipForm from '../../components/forms/MembershipForm';

const MembershipPage = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const membershipBenefits = [
    {
      icon: <FaShieldAlt />,
      title: 'Industry Exclusivity',
      description: 'One protected seat per chapter - no competition within your local group.'
    },
    {
      icon: <FaCalendarCheck />,
      title: 'Weekly Structured Meetings',
      description: 'Consistent 90-minute sessions focused on referral exchange and relationship building.'
    },
    {
      icon: <FaHandshake />,
      title: 'Qualified Referral Exchange',
      description: 'Receive warm introductions from trusted members who understand your business.'
    },
    {
      icon: <FaChartLine />,
      title: 'Referral Tracking & ROI',
      description: 'Track all referrals with our system and measure your networking ROI.'
    },
    {
      icon: <FaUserTie />,
      title: 'Professional Visibility',
      description: 'Build credibility and authority within your local business community.'
    },
    {
      icon: <FaUsers />,
      title: 'Leadership Opportunities',
      description: 'Grow into chapter leadership roles and expand your influence.'
    }
  ];

  const roleComparison = [
    {
      role: 'Guest / Visitor',
      who: 'Exploring professionals',
      what: 'Attend 1-2 meetings, no referrals, no exclusivity',
      paid: false,
      features: ['May visit 1-2 times', 'No referral exchange', 'No industry protection', 'No guarantees']
    },
    {
      role: 'Member',
      who: 'Business owners & decision-makers',
      what: 'Hold exclusive industry seat, participate weekly, build referral relationships',
      paid: true,
      features: ['Weekly meetings', 'Protected industry seat', 'Referral tracking', 'Leadership access', 'Annual dues']
    },
    {
      role: 'Chapter Director',
      who: 'Leaders & entrepreneurs',
      what: 'Lead a chapter, enforce standards, earn revenue share',
      paid: true,
      features: ['Chapter leadership', 'Revenue sharing', 'Training & support', 'Market authority', 'Scaling potential']
    }
  ];

  const faqs = [
    {
      question: 'Is membership guaranteed once I apply?',
      answer: 'No. Membership is approved based on industry availability, professionalism, and chapter fit. We ensure each chapter maintains the right mix of complementary businesses.'
    },
    {
      question: 'How does the free month work?',
      answer: 'New approved members get their first month completely free with full access to all membership benefits. No credit card required upfront. After 30 days, you can choose to continue with a paid membership or cancel with no obligations.'
    },
    {
      question: 'How many members are in each chapter?',
      answer: 'Most chapters operate with 25-35 members, capped to maintain quality and exclusivity. Chapters grow in phases from launch (12-18 members) to mature (30-35 members).'
    },
    {
      question: 'Can there be competitors in my chapter?',
      answer: 'No. Only one business per industry is allowed in each chapter. This protects exclusivity and ensures valuable, non-redundant connections among complementary businesses.'
    },
    {
      question: 'How often do chapters meet?',
      answer: 'Chapters meet weekly, typically for 60-90 minutes. Consistent attendance is required to maintain the quality of referrals and relationships within the chapter.'
    },
    {
      question: 'Is attendance required?',
      answer: 'Yes. Consistent attendance protects the quality of referrals and relationships. Most chapters require 85% attendance, with substitute arrangements when necessary.'
    },
    {
      question: 'Are referrals guaranteed?',
      answer: 'No. Referrals are earned through trust, participation, and clarity — not promised. Our system creates the environment for referrals, but results depend on active engagement.'
    },
    {
      question: 'Can I visit before joining?',
      answer: 'Yes. Qualified applicants are invited to visit a chapter meeting as our guest before final approval. This ensures alignment with the chapter culture and structure.'
    },
    {
      question: 'What happens if my chapter is full?',
      answer: 'You may join a waitlist or be directed to another nearby chapter. We also help members explore adjacent industry categories that might be available.'
    },
    {
      question: 'Can I cancel my membership?',
      answer: 'You can cancel anytime during your free month with no charge. After the free period, memberships are typically non-refundable once onboarding begins, except where required by law. We require a 6-month minimum commitment for paid memberships to ensure continuity.'
    },
    {
      question: 'Can I become a Chapter Director later?',
      answer: 'Yes. High-performing members are often invited to leadership opportunities. Many Chapter Directors start as regular members within the network.'
    }
  ];

  const investmentRanges = [
    { region: 'Major Metro Areas', annual: '$1,200 - $1,600', monthly: '$100 - $133' },
    { region: 'Mid-Sized Cities', annual: '$960 - $1,200', monthly: '$80 - $100' },
    { region: 'Smaller Markets', annual: '$720 - $960', monthly: '$60 - $80' }
  ];

  // Smooth scroll handler for "Apply Now" buttons
  const scrollToApply = () => {
    const element = document.getElementById('apply');
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed header (pt-20)
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full mb-6 font-bold text-lg">
                <FaGift className="mr-2" />
                <span>Limited Time: First Month FREE</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                ScaleLink Alliance Membership
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                A structured referral network for professionals who take growth seriously. 
                Start risk-free with 30 days complimentary access.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Membership Really Means */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What Membership Really Means
              </h2>
              <div className="bg-linear-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-8 rounded-r-lg text-left">
                <p className="text-xl text-gray-900 mb-4">
                  Membership at <strong>ScaleLink Alliance</strong> is <strong>not a subscription</strong> and <strong>not casual networking</strong>.
                </p>
                <p className="text-gray-700">
                  It is a <strong>paid, approved seat</strong> inside a <strong>local chapter</strong> of non-competing professionals who meet weekly to exchange qualified business referrals.
                </p>
                <p className="text-gray-700 mt-4 font-semibold">
                  You are not buying meetings. You are joining a <span className="text-blue-600">business growth system</span>.
                </p>
              </div>
            </motion.div>

            {/* Free Month Promo Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-linear-to-r from-green-500 to-green-600 rounded-2xl p-8 mb-12 text-white text-center shadow-xl"
            >
              <div className="flex items-center justify-center mb-4">
                <FaGift className="text-4xl mr-4" />
                <FaClock className="text-4xl" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Join Now & Get Your First Month FREE</h3>
              <p className="text-xl mb-6 opacity-95">
                No credit card required. No obligations. Experience full membership benefits for 30 days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={scrollToApply}
                  className="px-8 py-4 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Claim Your Free Month
                </button>
              </div>
              <p className="mt-4 text-sm opacity-90">
                After 30 days, continue from just $60/month. Cancel anytime during your free month.
              </p>
            </motion.div>

            {/* Who Membership Is For */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Who Membership Is For
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <FaCheck className="text-green-500 mr-2" />
                    Designed For:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 shrink-0"></div>
                      <span>Business owners & decision-makers</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 shrink-0"></div>
                      <span>Professionals who rely on referrals</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 shrink-0"></div>
                      <span>Service providers with a clear offer</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 shrink-0"></div>
                      <span>People willing to show up consistently</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <FaTimes className="text-red-500 mr-2" />
                    Not For:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 shrink-0"></div>
                      <span>Those seeking instant results without effort</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 shrink-0"></div>
                      <span>Social networkers only</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 shrink-0"></div>
                      <span>Businesses unwilling to refer others</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 shrink-0"></div>
                      <span>Those preferring unstructured networking</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="text-center mt-8">
                <p className="text-gray-700">
                  If your business grows through trust and relationships, this is for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              What You Get as a Member
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {membershipBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-blue-600 text-3xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How Membership Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How Membership Works
            </h2>
            
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: 'Apply',
                  description: 'Tell us about your business, experience, and industry.'
                },
                {
                  step: 2,
                  title: 'Review',
                  description: 'We check industry availability and assess chapter fit.'
                },
                {
                  step: 3,
                  title: 'Visit',
                  description: 'Attend a chapter meeting as our guest to experience the structure.'
                },
                {
                  step: 4,
                  title: 'Approve & Activate',
                  description: 'Receive invitation to join and get your first month FREE immediately.'
                },
                {
                  step: 5,
                  title: 'Experience & Decide',
                  description: 'Enjoy full membership for 30 days. Continue with paid membership or cancel anytime.'
                }
              ].map((step, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                    step.step === 4 ? 'bg-linear-to-br from-green-500 to-green-600' : 'bg-linear-to-br from-blue-600 to-blue-800'
                  }`}>
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                      {step.step === 4 && <span className="ml-2 text-green-600 text-sm font-bold">FREE MONTH</span>}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-700 mb-6">
                <strong>Membership is selective by design.</strong> We protect quality through careful vetting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Comparison */}
      <section className="py-16 bg-linear-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Membership vs Director vs Guest
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {roleComparison.map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                    role.role === 'Member' ? 'ring-2 ring-green-500 ring-offset-2' : ''
                  }`}
                >
                  <div className={`p-6 ${
                    role.role === 'Member' 
                      ? 'bg-linear-to-r from-green-500 to-green-600' 
                      : 'bg-gray-800'
                  } text-white`}>
                    <h3 className="text-xl font-bold mb-2">{role.role}</h3>
                    <p className="text-sm opacity-90">{role.who}</p>
                    {role.role === 'Member' && (
                      <div className="mt-3 inline-block px-3 py-1 bg-white text-green-600 text-xs font-bold rounded-full">
                        1st MONTH FREE
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">{role.what}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-gray-900">Paid:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          role.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {role.paid ? 'Yes (after free month)' : 'No'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {role.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0 ${
                              role.paid ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {role.paid ? (
                                <FaCheck className="text-green-600 text-xs" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              )}
                            </div>
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* UPDATED BUTTONS WITH SMOOTH SCROLL */}
                    {role.role === 'Member' ? (
                      <button
                        onClick={scrollToApply}
                        className="block w-full py-3 text-center rounded-lg font-semibold transition-colors bg-linear-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg"
                      >
                        Start Free Trial
                      </button>
                    ) : role.role === 'Chapter Director' ? (
                      <Link
                        to="/become-director"
                        className="block w-full py-3 text-center rounded-lg font-semibold transition-colors bg-gray-800 text-white hover:bg-gray-900"
                      >
                        Become Director
                      </Link>
                    ) : (
                      <Link
                        to="/contact"
                        className="block w-full py-3 text-center rounded-lg font-semibold transition-colors bg-gray-800 text-white hover:bg-gray-900"
                      >
                        Schedule Visit
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Membership Investment */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Membership Investment
            </h2>
            
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 mb-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4 font-bold">
                  <FaGift className="mr-2" />
                  Special Launch Offer
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  First Month Absolutely FREE
                </h3>
                <p className="text-gray-600 mb-4">
                  No credit card required. No hidden fees. Experience everything risk-free.
                </p>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  $0
                  <span className="text-lg text-gray-500 font-normal line-through ml-2">$100-133</span>
                </div>
                <p className="text-sm text-gray-500">First 30 days complimentary</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  After your free month, membership is billed annually or monthly and varies by region.
                </p>
                <div className="text-3xl font-bold text-gray-900">
                  Typical investment: <span className="text-blue-600">$720 – $1,200 per year</span>
                </div>
                <p className="text-gray-600 mt-2">
                  One quality referral often covers the full annual cost.
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Region</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Annual</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investmentRanges.map((range, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-gray-700">{range.region}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{range.annual}</td>
                        <td className="px-4 py-3 text-gray-700">{range.monthly}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-8">
                Exact pricing determined during application process based on chapter location and industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-linear-to-r from-green-500 to-green-600 rounded-2xl p-8 mb-8 text-white text-center">
              <FaGift className="text-5xl mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                Claim Your Free Month
              </h2>
              <p className="text-xl opacity-95">
                Apply now and get 30 days of full membership access at no cost.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Start Your Application
                </h3>
                <p className="text-gray-600">
                  Complete the form below to begin your membership application. 
                  We'll review your information and contact you within 24 hours to activate your free month.
                </p>
              </div>
              
              <MembershipForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaQuestionCircle className="text-blue-600 mr-3 shrink-0" />
                      <span className="font-semibold text-gray-900">{faq.question}</span>
                    </div>
                    <div className={`transform transition-transform ${
                      activeFAQ === index ? 'rotate-180' : ''
                    }`}>
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {activeFAQ === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-linear-to-r from-green-500 to-green-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <FaGift className="text-6xl mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Join?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Start your free month today. No credit card required. No obligations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToApply}
                className="px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Get First Month Free</span>
                <FaArrowRight />
              </button>
              <Link
                to="/chapters"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Visit a Chapter
              </Link>
            </div>
            <p className="mt-6 text-sm opacity-90">
              After 30 days, continue from just $60/month. Cancel anytime during your free trial.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MembershipPage;