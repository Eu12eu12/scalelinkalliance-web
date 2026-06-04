// src/components/sections/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHandshake, FaUserTie, FaChartLine, FaGlobe, FaArrowRight, FaBriefcase } from 'react-icons/fa';

const HeroSection = () => {
  const valuePoints = [
    {
      icon: <FaHandshake />,
      title: 'Weekly Referral Meetings',
      description: 'Structured, purpose-driven networking sessions'
    },
    {
      icon: <FaUserTie />,
      title: 'Industry Exclusivity',
      description: 'No competition within your chapter'
    },
    {
      icon: <FaChartLine />,
      title: 'Proven Structure',
      description: 'Accountability and measurable results'
    },
    {
      icon: <FaGlobe />,
      title: 'Local to Global',
      description: 'Chapters nationwide with expansion plans'
    }
  ];

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Ocean Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://pixabay.com/videos/waves-water-sea-ocean-landscape-22183/"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        {/* Gradient Overlay for better content readability */}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/30"></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
      </div>

      {/* Background pattern - now over video */}
      <div className="absolute inset-0 opacity-10 z-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-blue-600/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-4 border border-white/20">
                  Structured Growth Through Trusted Referrals
                </span>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                  Scale Your Business Through
                  <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-blue-100 mt-2">
                    High-Quality Referrals
                  </span>
                  <span className="block text-white mt-2">
                    & Strategic Partnerships
                  </span>
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  ScaleLink Alliance connects growth-focused professionals into curated chapters that generate <strong className="text-blue-200">real business, not empty networking</strong>.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/membership"
                    className="px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm border border-white/20"
                  >
                    <span>Apply to Join</span>
                    <FaArrowRight />
                  </Link>
                  <Link
                    to="/chapters"
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/30 shadow-md hover:bg-white/20 transition-all duration-300"
                  >
                    Find a Chapter
                  </Link>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/services"
                    className="px-8 py-4 bg-linear-to-r from-white/20 to-white/10 backdrop-blur-sm text-white font-semibold rounded-lg shadow-md hover:from-white/30 hover:to-white/20 transition-all duration-300 flex items-center justify-center space-x-2 border border-white/20"
                  >
                    <FaBriefcase />
                    <span>Explore Services</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/30 shadow-sm hover:bg-white/20 transition-all duration-300"
                  >
                    Book Intro Call
                  </Link>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-white/20">
                <p className="text-white/80 text-sm mb-4">Trusted by professionals across industries:</p>
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-white/80 text-sm">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">42</div>
                    <div className="text-white/80 text-sm">Chapters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">$85M+</div>
                    <div className="text-white/80 text-sm">Business Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">96%</div>
                    <div className="text-white/80 text-sm">Retention Rate</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Why ScaleLink Alliance?
                </h3>
                
                <div className="space-y-6">
                  {valuePoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      className="flex items-start space-x-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
                    >
                      <div className="shrink-0 w-12 h-12 bg-linear-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                        {point.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">{point.title}</h4>
                        <p className="text-white/90">{point.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="text-center">
                    <p className="text-white/90 mb-4">
                      <strong className="text-white">ScaleLink Alliance</strong> is a professional business growth organization that helps companies scale through <strong className="text-white">structured referral networking</strong> and <strong className="text-white">on-demand business services</strong>.
                    </p>
                    <Link
                      to="/about"
                      className="inline-flex items-center text-blue-200 hover:text-blue-100 font-semibold"
                    >
                      Learn more about us
                      <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-linear-to-br from-blue-400 to-blue-600 rounded-full opacity-20 backdrop-blur-sm"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-linear-to-br from-blue-300 to-blue-500 rounded-full opacity-20 backdrop-blur-sm"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;