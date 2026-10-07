import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaUsers, FaCalendarAlt, FaArrowRight, FaCheck, FaTimes } from 'react-icons/fa';
import ContactForm from '../components/forms/ContactForm';

const ContactPage = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [contactType, setContactType] = useState('general');

  useEffect(() => {
      document.title = 'Contact ScaleLink Alliance | Business Services & Partnerships';
  
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

  const contactInfo = {
    headquarters: {
      address: '2250 Point Blvd, Elgin, IL 60123',
      phone: '+1 (815) 669 0642',
      email: 'support@scalelinkalliance.com',
      hours: 'Mon-Fri 9am-6pm EST'
    },
    chapterSupport: {
      phone: '+1 (815) 669 0642',
      email: 'support@scalelinkalliance.com'
    },
    servicesSupport: {
      phone: '+1 (815) 669 0642',
      email: 'support@scalelinkalliance.com'
    }
  };

  const timeSlots = [
    { id: 1, date: 'Monday, Apr 15', time: '9:00 AM EST', available: true },
    { id: 2, date: 'Monday, Apr 15', time: '2:00 PM EST', available: true },
    { id: 3, date: 'Tuesday, Apr 16', time: '10:30 AM EST', available: true },
    { id: 4, date: 'Tuesday, Apr 16', time: '3:30 PM EST', available: false },
    { id: 5, date: 'Wednesday, Apr 17', time: '11:00 AM EST', available: true },
    { id: 6, date: 'Thursday, Apr 18', time: '1:00 PM EST', available: true },
  ];

  const faqs = [
    {
      question: 'How quickly will I hear back after contacting you?',
      answer: 'We respond to all inquiries within 24 hours during business days (Monday-Friday). For urgent project requirements, please call our main line directly.'
    },
    {
      question: 'What happens during a Growth Review or project consultation?',
      answer: 'Our senior specialists review your current digital infrastructure, lead capture mechanisms, and CRM workflows to identify immediate opportunities for measurable growth.'
    },
    {
      question: 'How do project milestones and quotes work?',
      answer: 'Every quote comes with fixed scope, clear milestone deliverables, and guaranteed transparent pricing. You approve each deliverable before subsequent payments are due.'
    },
    {
      question: 'What is the fastest way to get started?',
      answer: 'You can request a Free Website & Business Growth Review, or submit a direct service inquiry using the form below with your project requirements.'
    }
  ];

  const contactTypes = [
    { id: 'general', label: 'General Inquiry', description: 'General questions about ScaleLink Alliance' },
    { id: 'services', label: 'Services Inquiry', description: 'Questions about our done-for-you digital services' },
    { id: 'review', label: 'Growth Diagnostic', description: 'Request a Free Website & Business Systems Review' },
    { id: 'quote', label: 'Custom Project Quote', description: 'Scope a new website, web app, or automation system' },
    { id: 'support', label: 'Client Support & Care', description: 'Technical assistance and ongoing maintenance' },
    { id: 'press', label: 'Partnerships & Media', description: 'Media inquiries and technology partnerships' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Contact ScaleLink Alliance
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                Ready to scale your business through strategic partnerships? Get in touch with our team.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Type Selection */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    What can we help you with?
                  </h3>
                  <div className="space-y-3">
                    {contactTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setContactType(type.id)}
                        className={`w-full text-left p-4 rounded-lg transition-all ${
                          contactType === type.id
                            ? 'bg-slate-50 border-2 border-[#18264A]'
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{type.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Quick Contacts</h4>
                    <div className="space-y-3">
                      <a href={`tel:${contactInfo.headquarters.phone}`} className="flex items-center text-[#18264A] hover:text-emerald-700">
                        <FaPhone className="mr-3" />
                        <span>{contactInfo.headquarters.phone}</span>
                      </a>
                      <a href={`mailto:${contactInfo.headquarters.email}`} className="flex items-center text-[#18264A] hover:text-emerald-700">
                        <FaEnvelope className="mr-3" />
                        <span>{contactInfo.headquarters.email}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Send Us a Message
                  </h2>
                  <ContactForm contactType={contactType} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Headquarters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="text-[#18264A] text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Headquarters</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-700">{contactInfo.headquarters.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaPhone className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-700">{contactInfo.headquarters.phone}</p>
                      <p className="text-gray-500 text-sm">Main Office</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaEnvelope className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-700">{contactInfo.headquarters.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaClock className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-700">{contactInfo.headquarters.hours}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Client Care & Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <FaUsers className="text-[#18264A] text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Client Care & Support</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaPhone className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-700">{contactInfo.chapterSupport.phone}</p>
                      <p className="text-gray-500 text-sm">Technical & maintenance inquiries</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaEnvelope className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-700">{contactInfo.chapterSupport.email}</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-sm text-gray-700">
                      For active project support, Care plan updates, and portal assistance.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Services Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="text-gray-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Services Support</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaPhone className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-700">{contactInfo.servicesSupport.phone}</p>
                      <p className="text-gray-500 text-sm">Service inquiries only</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaEnvelope className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-700">{contactInfo.servicesSupport.email}</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      For service requests, project inquiries, and pricing information.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule a Call */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Schedule a Discovery Call
            </h2>
            <p className="text-gray-600 text-center mb-12">
              Book a 30-minute call with our team to learn how ScaleLink Alliance can help grow your business.
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedTime(slot.id)}
                    disabled={!slot.available}
                    className={`p-4 rounded-xl text-center transition-all ${
                      selectedTime === slot.id
                        ? 'bg-[#18264A] text-white font-bold'
                        : slot.available
                        ? 'bg-white border-2 border-gray-200 hover:border-[#18264A]'
                        : 'bg-gray-100 border-2 border-gray-200 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-semibold mb-2">{slot.date}</div>
                    <div className="mb-3">{slot.time}</div>
                    <div className="flex items-center justify-center">
                      {slot.available ? (
                        <>
                          <FaCheck className="mr-2" />
                          <span>Available</span>
                        </>
                      ) : (
                        <>
                          <FaTimes className="mr-2" />
                          <span>Booked</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="text-center">
                <button
                  disabled={!selectedTime}
                  onClick={() => {
                    const slot = timeSlots.find(s => s.id === selectedTime);
                    if (slot) {
                      alert(`Thank you! Your discovery call has been scheduled for ${slot.date} at ${slot.time}. We'll send a calendar invitation to your email.`);
                      setSelectedTime(null);
                    }
                  }}
                  className={`px-8 py-4 rounded-lg font-semibold transition-colors ${
                    selectedTime
                      ? 'bg-[#18264A] text-white font-bold hover:bg-[#101c38]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Schedule Selected Time
                </button>
                <p className="mt-3 text-gray-500 text-sm">
                  Select a time slot above to schedule your call
                </p>
              </div>
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
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#18264A]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Whether you're interested in networking or professional services, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/free-website-review"
                className="px-8 py-4 bg-white text-[#18264A] font-bold rounded-xl hover:bg-slate-100 shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <span>Get a Free Growth Review</span>
                <FaArrowRight />
              </Link>
              <Link
                to="/request-service"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Request Service
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;