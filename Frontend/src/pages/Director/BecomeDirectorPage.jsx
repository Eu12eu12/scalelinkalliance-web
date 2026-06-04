// src/pages/Director/BecomeDirectorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaAward, FaUsers, FaChartLine, FaDollarSign, FaGraduationCap, FaHandshake, FaArrowRight } from 'react-icons/fa';

const BecomeDirectorPage = () => {
  const directorBenefits = [
    {
      icon: <FaDollarSign />,
      title: 'Revenue Sharing',
      description: 'Earn recurring income through membership fees and chapter growth.'
    },
    {
      icon: <FaAward />,
      title: 'Leadership Training',
      description: 'Receive comprehensive training and ongoing support from HQ.'
    },
    {
      icon: <FaUsers />,
      title: 'Market Authority',
      description: 'Establish yourself as a leader in your local business community.'
    },
    {
      icon: <FaChartLine />,
      title: 'Growth Potential',
      description: 'Scale your impact and income as your chapter expands.'
    }
  ];

  const requirements = [
    'Minimum 2 years in business or leadership role',
    'Strong local professional network',
    'Excellent communication and organizational skills',
    'Commitment to chapter growth and member success'
  ];

  const directorProcess = [
    {
      step: 1,
      title: 'Apply',
      description: 'Submit your director application and business background'
    },
    {
      step: 2,
      title: 'Interview',
      description: 'Meet with our expansion team to discuss fit and opportunity'
    },
    {
      step: 3,
      title: 'Training',
      description: 'Complete comprehensive director training program'
    },
    {
      step: 4,
      title: 'Launch',
      description: 'Launch your chapter with HQ support and marketing'
    }
  ];

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
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Become a ScaleLink Alliance Chapter Director
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                Lead a local business network. Build influence. Earn recurring income.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is a Chapter Director */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  What is a Chapter Director?
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  A <strong>Chapter Director</strong> launches and leads a local ScaleLink Alliance chapter, 
                  facilitating meetings, onboarding members, and maintaining professional standards — with full 
                  support from ScaleLink Alliance HQ.
                </p>
                <p className="text-gray-600">
                  Directors are entrepreneurs who combine their local business knowledge with our proven 
                  system to create thriving professional communities.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <FaGraduationCap className="text-3xl" />
                  <h3 className="text-2xl font-bold">What We Provide</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-300 mt-1">✓</span>
                    <span>Complete branding & operational systems</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-300 mt-1">✓</span>
                    <span>Meeting structure & materials</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-300 mt-1">✓</span>
                    <span>Membership onboarding process</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-300 mt-1">✓</span>
                    <span>CRM & referral tracking platform</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-300 mt-1">✓</span>
                    <span>Marketing & launch support</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-300 mt-1">✓</span>
                    <span>Ongoing training & coaching</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Director Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Director Benefits
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {directorBenefits.map((benefit, index) => (
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

      {/* Who This Is For */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Who This Is For
                </h2>
                <div className="space-y-4">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{req}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Ideal Candidates Include:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Established business professionals</li>
                    <li>• Natural leaders and connectors</li>
                    <li>• Entrepreneurs with local influence</li>
                    <li>• Retired executives seeking new challenges</li>
                    <li>• Professionals wanting to build a legacy business</li>
                  </ul>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  The Director Process
                </h2>
                <div className="space-y-6">
                  {directorProcess.map((step) => (
                    <div key={step.step} className="flex items-start space-x-4">
                      <div className="shrink-0 w-12 h-12 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Lead a Chapter in Your Market?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Join our team of successful Chapter Directors building thriving business communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact?interest=director"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Apply to Become a Director</span>
                <FaArrowRight />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Schedule Discovery Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  How much does it cost to become a Chapter Director?
                </h4>
                <p className="text-gray-600">
                  There is typically a licensing or franchise fee, which varies by market size. 
                  This includes all training, systems, and launch support. Contact us for specific 
                  investment details for your market.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  What kind of support do Directors receive?
                </h4>
                <p className="text-gray-600">
                  Directors receive comprehensive training, marketing materials, operational systems, 
                  ongoing coaching, and access to our referral tracking platform. HQ provides support 
                  throughout the launch and growth phases.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  How much time does being a Director require?
                </h4>
                <p className="text-gray-600">
                  Typically 10-15 hours per week during launch phase, reducing to 5-10 hours weekly 
                  once the chapter is established. Much of the work can be scheduled around your 
                  existing business commitments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeDirectorPage;