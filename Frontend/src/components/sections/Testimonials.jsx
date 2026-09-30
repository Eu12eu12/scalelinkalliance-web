// src/components/sections/Testimonials.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaQuoteLeft, 
  FaQuoteRight, 
  FaStar, 
  FaChevronLeft, 
  FaChevronRight, 
  FaBuilding, 
  FaCode,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Michael Rodriguez',
      company: 'Apex Commercial Capital',
      role: 'Managing Partner',
      quote: "ScaleLink completely redesigned our client acquisition infrastructure. Our new website load time dropped by 65%, and the automated CRM follow-up sequence captured 42 new qualified inquiries in the first month alone.",
      rating: 5,
      focus: 'Web & CRM Automation',
      metric: '+180% Inbound Leads'
    },
    {
      id: 2,
      name: 'Jennifer Walsh',
      company: 'Walsh Financial Advisory',
      role: 'Founder & CEO',
      quote: "Before ScaleLink, we were managing three separate contractors who never communicated. ScaleLink gave us one accountable team that handled our website redesign, SEO strategy, and booking automation seamlessly.",
      rating: 5,
      focus: 'Done-For-You Systems',
      metric: 'One Coordinated Team'
    },
    {
      id: 3,
      name: 'Marcus Thorne',
      company: 'Thorne Logistics Group',
      role: 'Operations Director',
      quote: "The milestone payment structure and dedicated project portal gave us total peace of mind. We always knew what stage the engineering team was on, deliverables were right on schedule, and the quality was world-class.",
      rating: 5,
      focus: 'Milestone Execution',
      metric: '100% On-Time Delivery'
    },
    {
      id: 4,
      name: 'David Sterling',
      company: 'Sterling Legal Advisors',
      role: 'Principal Attorney',
      quote: "Their monthly Care plan is invaluable. Any time we need copy updates, speed optimizations, or technical adjustments, their team resolves it within hours. It feels like having our own senior in-house tech department.",
      rating: 5,
      focus: 'Ongoing Care & Support',
      metric: 'Continuous Maintenance'
    }
  ];

  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 7000);
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

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('');
  };

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 block mb-2">
            Proven Business Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Trusted by Growing Companies Nationwide
          </h2>
          <p className="text-lg text-slate-600 mt-4">
            Hear from business leaders who rely on ScaleLink Alliance to build, automate, and scale their digital systems.
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative bg-slate-50 rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-[1fr_auto] gap-8 items-center"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <FaStar key={i} className="text-amber-400 text-sm" />
                    ))}
                  </div>
                  <p className="text-lg sm:text-xl text-slate-800 leading-relaxed font-medium mb-6 italic">
                    "{testimonials[currentIndex].quote}"
                  </p>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      {testimonials[currentIndex].role} · {testimonials[currentIndex].company}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 text-center min-w-[180px]">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                    {testimonials[currentIndex].focus}
                  </span>
                  <div className="text-xl font-extrabold text-[#18264A]">
                    {testimonials[currentIndex].metric}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav Arrows */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAutoplay(false);
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'w-8 bg-[#18264A]' : 'w-2 bg-slate-300'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prevTestimonial}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <FaChevronLeft className="text-xs" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
                  aria-label="Next testimonial"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <FaStar key={i} className="text-amber-400 text-xs" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 italic">
                  "{t.quote}"
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                <p className="text-[11px] text-slate-500">{t.company}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center max-w-xl mx-auto">
          <p className="text-slate-600 text-sm mb-6">
            Ready to experience reliable, transparent digital execution for your business?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/free-website-review"
              className="px-6 py-3 rounded-xl bg-[#18264A] text-white font-bold text-sm hover:bg-[#131f3c] transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              <span>Get a Free Growth Review</span>
              <FaArrowRight className="text-xs" />
            </Link>
            <Link
              to="/services"
              className="px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
