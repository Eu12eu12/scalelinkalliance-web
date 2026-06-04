// src/pages/Chapters/ChaptersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaSearch, FaArrowRight, FaBuilding, FaHandshake } from 'react-icons/fa';
import ChapterCard from '../../components/sections/ChapterCard';
import { chapters } from '../../data/chapters';

const ChaptersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [filteredChapters, setFilteredChapters] = useState(chapters);
  const [isLoading, setIsLoading] = useState(false);

  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'northeast', name: 'Northeast' },
    { id: 'midwest', name: 'Midwest' },
    { id: 'south', name: 'South' },
    { id: 'west', name: 'West' },
  ];

  const meetingDays = [
    { id: 'all', name: 'Any Day' },
    { id: 'Monday', name: 'Monday' },
    { id: 'Tuesday', name: 'Tuesday' },
    { id: 'Wednesday', name: 'Wednesday' },
    { id: 'Thursday', name: 'Thursday' },
    { id: 'Friday', name: 'Friday' },
  ];

  const stats = {
    totalChapters: chapters.length,
    totalMembers: chapters.reduce((sum, chapter) => sum + chapter.members.total, 0),
    openSeats: chapters.reduce((sum, chapter) => sum + chapter.members.openSeats, 0),
    averageSize: Math.round(chapters.reduce((sum, chapter) => sum + chapter.members.total, 0) / chapters.length)
  };

  useEffect(() => {
    setIsLoading(true);
    
    let filtered = [...chapters];
    
    // Filter by search term (city or state)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(chapter => 
        chapter.city.toLowerCase().includes(term) ||
        (chapter.state && chapter.state.toLowerCase().includes(term)) ||
        chapter.name.toLowerCase().includes(term)
      );
    }
    
    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(chapter => chapter.region === selectedRegion);
    }
    
    // Filter by meeting day
    if (selectedDay !== 'all') {
      filtered = filtered.filter(chapter => chapter.meeting?.day === selectedDay);
    }
    
    setTimeout(() => {
      setFilteredChapters(filtered);
      setIsLoading(false);
    }, 300);
  }, [searchTerm, selectedRegion, selectedDay]);

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
                Find a ScaleLink Alliance Chapter Near You
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                Connect with a local group of trusted, non-competing professionals committed to structured referral-based growth.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalChapters}</div>
              <div className="text-gray-700 font-semibold">Chapters</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalMembers}</div>
              <div className="text-gray-700 font-semibold">Active Members</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.openSeats}</div>
              <div className="text-gray-700 font-semibold">Open Seats</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.averageSize}</div>
              <div className="text-gray-700 font-semibold">Avg. Chapter Size</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Find Your Perfect Chapter
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search by City or State
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="e.g., New York, NY, Chicago..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Filter by Region
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {regions.map(region => (
                      <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meeting Day
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {meetingDays.map(day => (
                      <option key={day.id} value={day.id}>{day.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('all');
                  setSelectedDay('all');
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Available Chapters
                <span className="text-gray-600 text-lg font-normal ml-2">
                  ({filteredChapters.length} found)
                </span>
              </h3>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading chapters...</p>
              </div>
            ) : filteredChapters.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl border-2 border-blue-100">
                <FaBuilding className="text-blue-300 text-6xl mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-gray-900 mb-3">No Chapter Found in Your Area</h4>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                  We're actively expanding! If you don't see a chapter in your city, you can:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Link
                    to="/membership"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg inline-flex items-center justify-center gap-2"
                  >
                    <FaHandshake />
                    Apply for Membership
                  </Link>
                  <Link
                    to="/become-director"
                    className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <FaBuilding />
                    Start a Chapter
                  </Link>
                </div>
                <p className="text-gray-500 text-sm">
                  Your application helps us prioritize new chapter locations.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredChapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ChapterCard chapter={chapter} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Start a Chapter CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Lead?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Become a Chapter Director and build a community of growth-focused professionals in your city.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/become-director"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-xl inline-flex items-center justify-center gap-2"
              >
                <FaBuilding />
                Start a Chapter
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  How many members are in each chapter?
                </h4>
                <p className="text-gray-600">
                  Most chapters operate with 25-35 members, capped to maintain quality and exclusivity. 
                  Chapters grow in phases from launch (12-18 members) to mature (30-35 members).
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Can there be competitors in my chapter?
                </h4>
                <p className="text-gray-600">
                  No. Only <strong>one business per industry</strong> is allowed in each chapter. This protects 
                  exclusivity and ensures valuable, non-redundant connections.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  What if my city doesn't have a chapter?
                </h4>
                <p className="text-gray-600">
                  You can still apply for membership! Your application helps us identify demand in your area. 
                  You can also consider starting a chapter as a Chapter Director in your city.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChaptersPage;