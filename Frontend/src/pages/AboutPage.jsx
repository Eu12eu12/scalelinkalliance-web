// src/pages/AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBullseye, 
  FaEye, 
  FaHandshake, 
  FaChartLine, 
  FaUsers, 
  FaShieldAlt, 
  FaRocket, 
  FaAward, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaNetworkWired, 
  FaLightbulb,
  FaEnvelopeOpenText
} from 'react-icons/fa';
import Testimonials from '../components/sections/Testimonials';

const AboutPage = () => {
 const teamMembers = [
  {
    name: 'Alex Johnson',
    role: 'Founder & CEO',
    bio: 'Former tech executive with 15+ years in business development and strategic partnerships. Founded ScaleLink Alliance to solve the networking ROI problem.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    experience: '15 years'
  },
  {
    name: 'Sarah Chen',
    role: 'Chief Operations Officer',
    bio: 'Operations specialist with expertise in scaling professional networks and service organizations. Manages chapter operations and member experience.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    experience: '12 years'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Head of Chapter Development',
    bio: 'Former franchise executive with a passion for building sustainable business communities. Leads chapter expansion and director training.',
    image: 'https://image2url.com/r2/default/images/1773327055941-a6784d9c-e5bf-456e-953f-956fb3a54448.jpg',
    experience: '10 years'
  },
  {
    name: 'Jessica Williams',
    role: 'Director of Member Success',
    bio: 'Customer success expert focused on maximizing member ROI and satisfaction. Manages onboarding and ongoing member support.',
    image: 'https://image2url.com/r2/default/images/1773233371381-156d4945-e7d0-4045-b6df-ba72531015ee.jpg',
    experience: '8 years'
  }
];

  const values = [
    {
      icon: <FaNetworkWired />,
      title: 'Intentional Connections',
      description: 'Quality over quantity - Every connection has a purpose, every interaction adds value.'
    },
    {
      icon: <FaHandshake />,
      title: 'Strategic Collaboration',
      description: 'Growth through alignment with the right people, systems, and opportunities.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Trust Over Transactions',
      description: 'Building relationships that last, not just completing deals.'
    },
    {
      icon: <FaLightbulb />,
      title: 'Smarter Growth',
      description: 'Focusing on long-term, sustainable growth rather than quick wins.'
    }
  ];

  const milestones = [
    { year: '2016', event: 'ScaleLink Alliance Founded', description: 'Founded on September 14, 2016 in Elgin, IL' },
    { year: '2017', event: 'First Chapter Launch', description: 'Launched inaugural chapter with 12 founding members' },
    { year: '2018', event: 'Network Expansion', description: 'Expanded to 5 chapters across Midwest' },
    { year: '2019', event: 'Services Division Launch', description: 'Added professional business services division' },
    { year: '2020', event: 'National Expansion', description: 'Expanded to East and West coasts' },
    { year: '2021', event: 'Digital Platform', description: 'Launched proprietary referral tracking system' },
    { year: '2022', event: 'Chapter Director Program', description: 'Launched chapter director licensing program' },
    { year: '2023', event: '25+ Chapters', description: 'Grew to 25+ chapters nationwide' }
  ];

  const stats = [
    { number: '500+', label: 'Active Members' },
    { number: '42', label: 'Chapters Nationwide' },
    { number: '$85M+', label: 'Business Generated' },
    { number: '96%', label: 'Member Retention Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                About Scale Link Alliance
              </h1>
              <p className="text-2xl text-blue-700 font-semibold mb-4">
                Where the Right Connections Drive Real Growth
              </p>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                We help businesses scale through intentional connections and strategic collaboration.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Letter from the Founder - NEW SECTION */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100"
            >
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <FaEnvelopeOpenText className="text-white text-2xl" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Letter to Business Leaders
              </h2>
              
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg font-medium text-blue-800">
                  Dear Business Leaders,
                </p>
                
                <p>
                  Every successful business grows through <strong>relationships, trust, and opportunity</strong>. But for many entrepreneurs and professionals, those opportunities are often limited by a simple challenge: access to the right connections and support at the right time.
                </p>
                
                <p>
                  The idea for <strong>ScaleLink Alliance</strong> came from observing a common problem in the business world. Many companies had strong products, valuable expertise, and the drive to grow—but they were missing two critical elements: <strong>consistent referrals and access to reliable professional services</strong> that could help them scale.
                </p>
                
                <p>
                  Traditional networking groups often promise connections, but they rarely provide the structure or collaboration needed to turn those connections into meaningful business growth. On the other hand, hiring outside agencies or freelancers for specialized services can be costly, unpredictable, and disconnected from a company's broader growth strategy.
                </p>
                
                <p>
                  ScaleLink Alliance was founded to bridge that gap.
                </p>
                
                <p>
                  The vision was simple but powerful: create a professional ecosystem where businesses could not only <strong>connect with trusted partners and referral sources</strong>, but also <strong>access high-quality services that help them execute and grow</strong>.
                </p>
                
                <p>
                  By combining a structured referral network with on-demand business services, ScaleLink Alliance gives companies the ability to expand their reach, strengthen their partnerships, and scale their operations without the burden of building large internal teams.
                </p>
                
                <p>
                  Members of the alliance benefit from more than just introductions—they gain access to a collaborative environment where professionals support one another's success through shared opportunities and trusted relationships.
                </p>
                
                <p>
                  At the same time, businesses that need specialized support can rely on the ScaleLink Alliance Services team to deliver the creative, technical, marketing, and operational expertise required to move their business forward.
                </p>
                
                <p className="text-xl font-bold text-blue-700 pt-4">
                  Today, ScaleLink Alliance exists for one purpose:
                </p>
                
                <p className="text-lg font-semibold bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600">
                  <strong>to help businesses grow faster through strategic referrals, trusted partnerships, and on-demand business services.</strong>
                </p>
                
                <p>
                  Because when the right people are connected, and the right support is available, businesses don't just survive—they scale.
                </p>
                
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <p className="font-semibold text-gray-900">Sincerely,</p>
                  <p className="text-xl font-bold text-blue-700 mt-2">Alex Johnson</p>
                  <p className="text-gray-600">Founder & CEO</p>
                  <p className="text-gray-600">ScaleLink Alliance</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Our Purpose
                  </h2>
                  <div className="space-y-4 text-gray-600">
                    <p className="text-lg font-medium text-blue-700">
                      Scale Link Alliance exists for one reason: to help businesses scale through <strong>intentional connections and strategic collaboration</strong>.
                    </p>
                    <p>
                      We believe growth doesn't come from chasing contacts or surface-level networking — it comes from aligning with the <strong>right people, systems, and opportunities</strong>.
                    </p>
                    <p>
                      What started as a simple idea has grown into a structured alliance designed to help businesses move from <strong>stagnation to scale</strong>.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <FaBullseye className="text-blue-600 mr-3" />
                    Our Mission
                  </h3>
                  <div className="bg-blue-50 rounded-xl p-6">
                    <p className="text-lg text-gray-700 font-medium">
                      To help business owners and professionals <strong>scale smarter, not harder</strong>.
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                        <span className="text-gray-600">Meaningful relationships</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                        <span className="text-gray-600">Strategic partnerships</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                        <span className="text-gray-600">Long-term, sustainable growth</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
                  <div className="flex items-center space-x-3 mb-6">
                    <FaBullseye className="text-3xl" />
                    <h3 className="text-2xl font-bold">Our Bio</h3>
                  </div>
                  <p className="mb-6">
                    "ScaleLink Alliance is a premier networking company firmly dedicated to handling remote work from other businesses, or providing specialized personnel to help businesses overloaded with work. Founded on September 14, 2016, our team of experts is committed to handling the workload efficiently, ensuring that every client receives relief from increased backlogs."
                  </p>
                  <div className="flex items-center space-x-4 mt-8">
                    <div className="flex-1">
                      <div className="text-3xl font-bold">2016</div>
                      <div className="text-sm opacity-90">Founded</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold">2</div>
                      <div className="text-sm opacity-90">Business Divisions</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold">25+</div>
                      <div className="text-sm opacity-90">Cities</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Scale Link Alliance was created after seeing a common problem: Talented businesses working hard — but growing slowly — because they lacked the right network and support.
              </p>
              <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
                At the same time, we saw others scale faster through access to people, knowledge, and opportunity. That gap became our mission.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              What Makes Us Different
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaNetworkWired className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Not a Generic Networking Group</h3>
                <p className="text-gray-600">
                  We're built on quality over quantity, trust over transactions, and growth over noise.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaRocket className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Collaboration with Intention</h3>
                <p className="text-gray-600">
                  Every connection has a purpose. Every interaction adds value.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUsers className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">For Growth-Focused Professionals</h3>
                <p className="text-gray-600">
                  Serving business owners, entrepreneurs, and professionals who value clarity, alignment, and real progress.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Our Core Values
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 shadow-lg text-center border border-gray-200"
                >
                  <div className="text-blue-600 text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <FaEye className="text-5xl" />
              </div>
              <h2 className="text-3xl font-bold mb-6">
                The Vision
              </h2>
              <p className="text-2xl font-semibold mb-6">
                We're building a trusted ecosystem where businesses grow together, not alone.
              </p>
              <div className="text-xl space-y-2">
                <p className="font-bold">Scale smarter. Connect better. Grow stronger.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Who We Serve
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-blue-50 rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Business Owners</h3>
                <p className="text-gray-600">Looking to scale through strategic partnerships</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Entrepreneurs</h3>
                <p className="text-gray-600">Building companies with sustainable growth</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Professionals</h3>
                <p className="text-gray-600">Seeking to expand their network and influence</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Growth-Focused Teams</h3>
                <p className="text-gray-600">Committed to intentional, results-driven expansion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Our Journey in Time
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-200 to-blue-400"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  <div className="md:w-1/2 flex justify-center md:justify-end md:pr-12 mb-6 md:mb-0">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                        {milestone.year}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.event}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Our Impact by Numbers
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center text-white"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* Leadership Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Meet Our Leadership Team
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
                >
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <div className="text-blue-600 font-semibold mb-3">{member.role}</div>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <FaAward className="mr-2" />
                      {member.experience} experience
                    </div>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Explanation */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Business Structure
            </h2>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ScaleLink Alliance (Parent Brand)
                </h3>
                <p className="text-gray-600 mb-6">
                  We operate two clear business lines under one unified brand:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
                    <h4 className="text-lg font-bold text-blue-800 mb-3">ScaleLink Alliance Network</h4>
                    <p className="text-gray-700 mb-4">
                      → Chapters & Membership (referral-based growth)
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                        <span>Local chapters with weekly meetings</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                        <span>Industry exclusivity protection</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                        <span>Structured referral exchange</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">ScaleLink Alliance Services</h4>
                    <p className="text-gray-700 mb-4">
                      → On-demand business & marketing execution
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></div>
                        <span>No membership required</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></div>
                        <span>Creative, marketing & operational services</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></div>
                        <span>Standalone from networking division</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  Important Clarifier
                </h4>
                <p className="text-gray-700">
                  <strong>Not interested in networking? No problem.</strong> Many businesses work with ScaleLink Alliance only for services. Membership and chapters are optional, not required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Scale Smarter?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join a network where connections have purpose and growth has structure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/membership"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                Become a Member
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;