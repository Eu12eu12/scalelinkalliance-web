// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronDown, FaUserTie, FaBriefcase } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  // Updated navigation order to match design
  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About Us', path: '/about' },
    { 
      name: 'Chapters', 
      path: '/chapters',
      dropdown: [
        { name: 'Find a Chapter', path: '/chapters' },
        { name: 'Start a Chapter', path: '/become-director' }
      ]
    },
    { name: 'Membership', path: '/membership' },
    { 
      name: 'Services', 
      path: '/services',
      hasBadge: true,
      badgeText: 'NEW',
      dropdown: [
        { name: 'Our Services', path: '/services' },
        { name: 'Request Service', path: '/request-service' }
      ]
    },
    { 
      name: 'More', 
      path: '#',
      dropdown: [
        { name: 'Resources', path: '/resources' },
        { name: 'Partners', path: '/business-partners' },
        { name: 'Contact', path: '/contact' }
      ]
    },
  ];

  const ctaButtons = [
    { name: 'Apply to Join', path: '/membership', icon: <FaUserTie />, variant: 'primary' },
    { name: 'Request Service', path: '/services', icon: <FaBriefcase />, variant: 'secondary' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md overflow-visible">
      <nav className="container mx-auto pl-2 pr-4 overflow-visible">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img 
              src="/scalelink-logo.png" 
              alt="ScaleLink ALLIANCE" 
              className="h-16 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="flex flex-col">
                    <h1 class="text-2xl font-bold text-gray-900 tracking-tight leading-none">
                      ScaleLink
                    </h1>
                    <p class="text-xs text-gray-600 uppercase tracking-[0.2em] font-semibold mt-0.5">
                      ALLIANCE
                    </p>
                  </div>
                `;
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className={`flex items-center space-x-1 px-2 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      isActive(item.path) 
                        ? 'text-blue-600 bg-blue-50 font-semibold' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}>
                      <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
                      {item.hasBadge && (
                        <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold uppercase bg-red-500 text-white rounded-full">
                          {item.badgeText}
                        </span>
                      )}
                      <FaChevronDown className={`text-xs transition-transform ${
                        openDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    <AnimatePresence>
                      {openDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-l-2 border-transparent hover:border-blue-600 transition-all"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`px-2 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
                      isActive(item.path) 
                        ? 'text-blue-600 bg-blue-50 font-semibold' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-2 ml-6 shrink-0">
            {ctaButtons.map((button) => (
              <Link
                key={button.name}
                to={button.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm whitespace-nowrap ${
                  button.variant === 'primary'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black shadow-md hover:shadow-lg'
                }`}
              >
                {button.icon}
                <span>{button.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            aria-label="Menu"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-gray-200">
                {navigation.map((item) => (
                  <div key={item.name} className="mb-2">
                    {item.dropdown ? (
                      <>
                        <div className="flex items-center justify-between px-3 py-2 text-gray-700 font-semibold">
                          <span className="text-sm">{item.name}</span>
                          {item.hasBadge && (
                            <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase bg-red-500 text-white rounded-full">
                              {item.badgeText}
                            </span>
                          )}
                        </div>
                        <div className="pl-6">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        className={`block px-3 py-2 rounded-lg text-sm ${
                          isActive(item.path)
                            ? 'text-blue-600 bg-blue-50 font-semibold'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  {ctaButtons.map((button) => (
                    <Link
                      key={button.name}
                      to={button.path}
                      className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm ${
                        button.variant === 'primary'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                          : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {button.icon}
                      <span>{button.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;