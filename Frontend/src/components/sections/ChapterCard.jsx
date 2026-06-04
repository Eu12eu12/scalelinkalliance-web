// src/components/sections/ChapterCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaUserCheck, FaUserPlus, FaArrowRight } from 'react-icons/fa';

const ChapterCard = ({ chapter }) => {
  // Handle both flat structure (from HomePage) and nested structure
  const totalMembers = typeof chapter.members === 'object' ? chapter.members?.total : chapter.members || 0;
  const capacity = chapter.members?.capacity || 30;
  const openSeats = chapter.openSeats !== undefined ? chapter.openSeats : (chapter.members?.openSeats || Math.max(0, capacity - totalMembers));
  
  // Calculate filled percentage safely
  const filledPercentage = capacity > 0 ? Math.round((totalMembers / capacity) * 100) : 0;
  
  // Handle meeting data
  const meetingString = typeof chapter.meeting === 'string' ? chapter.meeting : null;
  const meetingDay = chapter.meeting?.day || '';
  const meetingTime = chapter.meeting?.time || '';
  const meetingType = chapter.meeting?.type || 'In-Person';
  
  // Determine status color
  const getStatusColor = (seats) => {
    if (seats === 0) return 'bg-red-100 text-red-800 border-red-200';
    if (seats <= 2) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };
  
  const getStatusText = (seats) => {
    if (seats === 0) return 'Waitlist Only';
    if (seats <= 2) return 'Limited Seats';
    return `${seats} Seats Open`;
  };

  // Create slug for linking
  const chapterSlug = chapter.slug || chapter.city?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-200">
      {/* Chapter Image */}
      <Link to={`/chapters/${chapterSlug}`} className="block relative h-48 overflow-hidden">
        <img 
          src={chapter.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'}
          alt={chapter.name || chapter.city}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(openSeats)}`}>
            {getStatusText(openSeats)}
          </span>
        </div>
      </Link>
      
      {/* Chapter Content */}
      <div className="p-6">
        {/* Chapter Name and Location */}
        <Link to={`/chapters/${chapterSlug}`} className="block mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-1">
            {chapter.name || `${chapter.city} Chapter`}
          </h3>
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2 text-gray-400 shrink-0" />
            <span>{chapter.city}{chapter.state ? `, ${chapter.state}` : ''}</span>
          </div>
        </Link>
        
        {/* Meeting Details */}
        <div className="mb-4">
          {meetingString ? (
            <div className="flex items-center text-gray-700">
              <FaCalendarAlt className="mr-2 text-gray-400 shrink-0" />
              <span className="font-medium">{meetingString}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center text-gray-700 mb-1">
                <FaCalendarAlt className="mr-2 text-gray-400 shrink-0" />
                <span className="font-medium">{meetingDay}{meetingDay && meetingTime ? ', ' : ''}{meetingTime}</span>
              </div>
              <div className="text-sm text-gray-500 ml-6">
                {meetingType} Meeting
              </div>
            </>
          )}
        </div>
        
        {/* Members Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center text-gray-700">
              <FaUsers className="mr-2 text-gray-400 shrink-0" />
              <span className="text-sm font-medium">Members: {totalMembers}/{capacity}</span>
            </div>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {filledPercentage}% filled
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                filledPercentage >= 90 ? 'bg-red-500' : 
                filledPercentage >= 70 ? 'bg-amber-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(filledPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Open Industries Preview */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <FaUserPlus className="mr-2 text-blue-500 shrink-0" />
            <span className="font-semibold text-gray-900">Open Industries</span>
          </div>
          
          {chapter.industries?.open && chapter.industries.open.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {chapter.industries.open.slice(0, 3).map((industry, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                  {industry}
                </span>
              ))}
              {chapter.industries.open.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  +{chapter.industries.open.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Contact for industry availability</p>
          )}
        </div>
        
        {/* Industry Exclusivity Badge */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <FaUserCheck className="mr-2 text-green-500 shrink-0" />
            <span className="text-sm font-medium text-gray-700">Industry Exclusivity Enforced</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Only one business per industry per chapter
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/chapters/${chapterSlug}`}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center space-x-2 group/btn"
          >
            <span>View Details</span>
            <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to={`/membership?chapter=${chapterSlug}`}
            className="flex-1 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-center"
          >
            Apply to Join
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChapterCard;