// src/components/sections/Testimonials.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight, FaUserTie, FaBuilding, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'James Akinson',
      title: 'Managing Partner',
      company: 'Akinson & Associates',
      quote: "The weekly meetings are structured and focused. Instead of vague networking conversations, I leave with real introductions and qualified referrals.",
      rating: 5,
      type: 'network',
      focus: 'Referral Growth',
      icon: <FaUserTie />
    },
    {
      id: 2,
      name: 'Sarah Goodman',
      title: 'Founder',
      company: 'Innovate Solutions',
      quote: "ScaleLink Alliance Services helped us completely redesign our brand. The process was efficient and the results exceeded our expectations.",
      rating: 5,
      type: 'services',
      focus: 'Service Quality',
      icon: <FaBuilding />
    },
    {
      id: 3,
      name: 'Benjamin Dunkin',
      title: 'Founder',
      company: 'Bunkin Creative Agency',
      quote: "As a creative agency owner, having ScaleLink Services available when my team needs extra capacity is incredibly valuable. It allows us to take on larger projects without hiring additional staff.",
      rating: 5,
      type: 'services',
      focus: 'Agency Support',
      icon: <FaBuilding />
    },
    {
      id: 4,
      name: 'Larry Oberhue',
      title: 'Managing Director',
      company: 'Oberhue Financial Group',
      quote: "Since joining the network, we've generated several new client relationships purely through referrals from other members.",
      rating: 5,
      type: 'network',
      focus: 'ROI',
      icon: <FaUserTie />
    }
  ];

  const networkTestimonials = testimonials.filter(t => t.type === 'network');
  const servicesTestimonials = testimonials.filter(t => t.type === 'services');

  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);

  const nextTestimonial = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Get initials for avatar placeholder
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Members & Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real businesses using ScaleLink Alliance
            </p>
          </motion.div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
            <div className="text-gray-600 text-sm">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">$2.5M+</div>
            <div className="text-gray-600 text-sm">Referrals Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">98%</div>
            <div className="text-gray-600 text-sm">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">3x</div>
            <div className="text-gray-600 text-sm">Avg. Member Growth</div>
          </div>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-blue-600 rounded-br-3xl flex items-center justify-center">
              <FaQuoteLeft className="text-white text-3xl" />
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="p-8 md:p-12"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Profile Avatar - No Image */}
                  <div className="md:w-1/3 flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl">
                        {getInitials(testimonials[currentIndex].name)}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        {testimonials[currentIndex].icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mt-4">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-gray-600">{testimonials[currentIndex].title}</p>
                    <p className="text-blue-600 font-semibold">{testimonials[currentIndex].company}</p>
                    
                    {/* Rating Stars */}
                    <div className="flex items-center mt-3">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonials[currentIndex].rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    {/* Focus Badge */}
                    <div className="mt-4 inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {testimonials[currentIndex].focus}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="md:w-2/3">
                    <FaQuoteLeft className="text-blue-200 text-3xl mb-4" />
                    <p className="text-xl text-gray-700 leading-relaxed mb-6">
                      "{testimonials[currentIndex].quote}"
                    </p>
                    <FaQuoteRight className="text-blue-200 text-3xl ml-auto" />
                    
                    {/* Type Badge */}
                    <div className="mt-6 flex items-center justify-end">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        testimonials[currentIndex].type === 'network'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {testimonials[currentIndex].type === 'network' ? 'Network Member' : 'Services Client'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all z-10"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all z-10"
            >
              <FaChevronRight />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAutoplay(false);
                    setCurrentIndex(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-blue-600'
                      : 'bg-gray-300 hover:bg-blue-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Category-Specific Testimonials */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Network Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaUserTie className="mr-3 text-blue-600" />
              Network Members
            </h3>
            <div className="space-y-6">
              {networkTestimonials.slice(0, 2).map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-lg mr-4 shrink-0">
                      {getInitials(testimonial.name)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm italic">"{testimonial.quote}"</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {testimonial.focus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Services Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaBuilding className="mr-3 text-gray-700" />
              Services Clients
            </h3>
            <div className="space-y-6">
              {servicesTestimonials.slice(0, 2).map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-lg mr-4 shrink-0">
                      {getInitials(testimonial.name)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm italic">"{testimonial.quote}"</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      {testimonial.focus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Join hundreds of successful businesses growing with ScaleLink Alliance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/membership"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              Apply for Membership
            </Link>
            <Link
              to="/services"
              className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg"
            >
              Request Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;