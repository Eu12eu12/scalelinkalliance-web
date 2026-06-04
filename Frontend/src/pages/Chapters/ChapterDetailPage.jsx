// src/pages/Chapters/ChapterDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaClock, FaUserCheck, FaUserPlus, FaArrowLeft, FaPhone, FaEnvelope } from 'react-icons/fa';
import IndustrySeats from '../../components/business/IndustrySeats';
import { chapters } from '../../data/chapters';

const ChapterDetailPage = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const foundChapter = chapters.find(c => c.slug === city);
      setChapter(foundChapter);
      setLoading(false);
    }, 300);
  }, [city]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading chapter details...</p>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Chapter Not Found</h2>
          <p className="text-gray-600 mb-8">The chapter you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/chapters')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Chapters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/chapters" className="hover:text-blue-600">Chapters</Link>
            <span>/</span>
            <span>{chapter.city}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 bg-linear-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/chapters')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-8"
          >
            <FaArrowLeft />
            <span>Back to Chapters</span>
          </button>
          
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                ScaleLink Alliance — {chapter.name}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                A curated group of non-competing business professionals who meet weekly to exchange 
                qualified referrals, build trusted partnerships, and scale their businesses through structured accountability.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaMapMarkerAlt className="text-blue-600 text-xl" />
                    <span className="font-semibold text-gray-900">Location</span>
                  </div>
                  <p className="text-gray-700">{chapter.address}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaCalendarAlt className="text-blue-600 text-xl" />
                    <span className="font-semibold text-gray-900">Meeting Time</span>
                  </div>
                  <p className="text-gray-700">{chapter.meeting.day}, {chapter.meeting.time}</p>
                  <p className="text-gray-600 text-sm">{chapter.meeting.type} • {chapter.meeting.location}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaUsers className="text-blue-600 text-xl" />
                    <span className="font-semibold text-gray-900">Members</span>
                  </div>
                  <p className="text-gray-700">{chapter.members.total} / {chapter.members.capacity} seats filled</p>
                  <p className="text-gray-600 text-sm">{chapter.members.openSeats} open seats available</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('seats')}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                activeTab === 'seats'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Industry Seats
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                activeTab === 'benefits'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Benefits
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                activeTab === 'contact'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Contact Chapter
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      How This Chapter Works
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          <FaCalendarAlt className="text-blue-600 text-xl" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Weekly Structured Meetings</h4>
                          <p className="text-gray-600">
                            Members meet {chapter.meeting.day.toLowerCase()}s at {chapter.meeting.time} for focused 
                            referral exchange and relationship building. Meetings follow a proven structure 
                            that maximizes value and efficiency.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          <FaUserCheck className="text-blue-600 text-xl" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">One Business Per Industry</h4>
                          <p className="text-gray-600">
                            Each chapter maintains strict industry exclusivity. This means no internal 
                            competition—only collaboration and support among complementary businesses.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          <FaClock className="text-blue-600 text-xl" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Referral Tracking & Accountability</h4>
                          <p className="text-gray-600">
                            All referrals are tracked through our system, providing clear ROI data. Members 
                            maintain accountability to each other, ensuring consistent participation and 
                            quality referrals.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Chapter Leadership</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold">
                          JD
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">John Director</h4>
                          <p className="text-gray-600 text-sm">Chapter Director</p>
                          <p className="text-gray-600 text-sm">3 years experience</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold">
                          AL
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Alex Leader</h4>
                          <p className="text-gray-600 text-sm">Assistant Director</p>
                          <p className="text-gray-600 text-sm">2 years experience</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <IndustrySeats 
                    filled={chapter.industries.filled}
                    open={chapter.industries.open}
                    chapterId={chapter.id}
                  />
                </div>
              </motion.div>
            )}

            {/* Industry Seats Tab */}
            {activeTab === 'seats' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <IndustrySeats 
                  filled={chapter.industries.filled}
                  open={chapter.industries.open}
                  chapterId={chapter.id}
                />
                
                <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">About Industry Exclusivity</h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      ScaleLink Alliance maintains <strong>one business per industry per chapter</strong> to ensure:
                    </p>
                    <ul className="space-y-2 pl-5">
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                        <span><strong>No internal competition</strong> within the chapter</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                        <span><strong>Maximized referral potential</strong> across complementary businesses</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                        <span><strong>Protected membership investment</strong> through exclusivity</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                        <span><strong>Higher quality referrals</strong> when members aren't competing</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Benefits Tab */}
            {activeTab === 'benefits' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Benefits of Joining This Chapter</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-green-600 font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Warm Introductions</h4>
                        <p className="text-gray-600">Receive qualified referrals from trusted members who understand your business.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-green-600 font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No Internal Competition</h4>
                        <p className="text-gray-600">Your industry seat is protected—no competing businesses in your chapter.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-green-600 font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Local Credibility</h4>
                        <p className="text-gray-600">Build your reputation through association with other respected professionals.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-green-600 font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Long-Term Partnerships</h4>
                        <p className="text-gray-600">Develop relationships that go beyond referrals to strategic partnerships.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-green-600 font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Accountability Structure</h4>
                        <p className="text-gray-600">Weekly meetings keep you focused on growth goals and referral activity.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-green-600 font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Leadership Opportunities</h4>
                        <p className="text-gray-600">Grow into chapter leadership roles as you establish yourself in the network.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact This Chapter</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaPhone className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Phone</h4>
                        <p className="text-gray-600">(815) 669 0642</p>
                        <p className="text-gray-500 text-sm">Chapter Director: John Director</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaEnvelope className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Email</h4>
                        <p className="text-gray-600">{chapter.slug}@scalelinkalliance.com</p>
                        <p className="text-gray-500 text-sm">Typically responds within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaCalendarAlt className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Schedule a Visit</h4>
                        <p className="text-gray-600">Attend a meeting as our guest</p>
                        <p className="text-gray-500 text-sm">See our structure in action</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Apply to Join</h3>
                  <p className="text-gray-600 mb-6">
                    Ready to become part of this chapter? Start your application process below.
                  </p>
                  
                  <div className="space-y-4">
                    <Link
                      to="/membership"
                      className="block w-full py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 text-center transition-all"
                    >
                      Apply to Join This Chapter
                    </Link>
                    
                    <Link
                      to={`/contact?chapter=${chapter.id}`}
                      className="block w-full py-4 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 text-center transition-colors"
                    >
                      Book a Visit as Guest
                    </Link>
                    
                    <Link
                      to={`/contact?interest=info`}
                      className="block w-full py-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 text-center transition-colors"
                    >
                      Request More Information
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChapterDetailPage;