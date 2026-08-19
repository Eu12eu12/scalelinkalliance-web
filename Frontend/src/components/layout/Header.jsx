// Frontend/src/components/layout/Header.jsx
import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBars, FaTimes, FaChevronDown, FaUserTie, FaBriefcase,
  FaCode, FaGlobe, FaShoppingCart, FaRocket, FaPaintBrush,
  FaPenNib, FaPalette, FaCamera, FaVideo, FaSearch, FaAd,
  FaEnvelope, FaUsers, FaRegBuilding, FaCogs, FaCloudUploadAlt,
  FaRobot, FaHeadset, FaFileAlt, FaProjectDiagram, FaDatabase,
  FaChartLine, FaShieldAlt, FaArrowRight, FaDesktop, FaChartBar,
  FaStar
} from 'react-icons/fa';

// ─── Service data for mega-menus ────────────────────────────────────────────

const buildFromScratchServices = [
  { name: 'Website Development', path: '/services/website-development', icon: <FaCode />, desc: 'Custom websites built to convert' },
  { name: 'Web Applications & SaaS', path: '/services/web-applications', icon: <FaGlobe />, desc: 'Custom dashboards & platforms' },
  { name: 'E-Commerce Development', path: '/services/ecommerce-development', icon: <FaShoppingCart />, desc: 'Online stores that sell' },
  { name: 'Landing Pages & Funnels', path: '/services/landing-pages', icon: <FaRocket />, desc: 'High-converting campaign pages' },
  { name: 'Brand Identity & Logo', path: '/services/brand-identity', icon: <FaPalette />, desc: 'Visual foundation for your brand' },
  { name: 'Copywriting & Content', path: '/services/copywriting', icon: <FaPenNib />, desc: 'Words that attract and convert' },
  { name: 'Graphic Design', path: '/services/graphic-design', icon: <FaPaintBrush />, desc: 'Marketing materials & visuals' },
  { name: 'Photography & Visual Assets', path: '/services/photography', icon: <FaCamera />, desc: 'Professional brand imagery' },
  { name: 'Video Editing & Motion', path: '/services/video-editing', icon: <FaVideo />, desc: 'Polished video content' },
];

const scaleExistingServices = [
  { name: 'Website Maintenance', path: '/services/website-maintenance', icon: <FaShieldAlt />, desc: 'Keep your site secure & fast' },
  { name: 'SEO & Search Marketing', path: '/services/seo-marketing', icon: <FaSearch />, desc: 'Rank higher, get found faster' },
  { name: 'Lead Generation', path: '/services/lead-generation', icon: <FaRegBuilding />, desc: 'Qualified prospects delivered' },
  { name: 'Paid Advertising', path: '/services/paid-advertising', icon: <FaAd />, desc: 'ROI-driven ad campaigns' },
  { name: 'Email Marketing', path: '/services/email-marketing', icon: <FaEnvelope />, desc: 'Campaigns that drive action' },
  { name: 'Social Media Management', path: '/services/social-media-management', icon: <FaUsers />, desc: 'Consistent presence & growth' },
  { name: 'CRM & Marketing Automation', path: '/services/crm-automation', icon: <FaCogs />, desc: 'Automate your lead follow-up' },
  { name: 'API Integration', path: '/services/api-integration', icon: <FaCloudUploadAlt />, desc: 'Connect your business tools' },
  { name: 'AI Automation Systems', path: '/services/ai-automation', icon: <FaRobot />, desc: 'Smart workflows, less manual work' },
  { name: 'Data Analytics & Reporting', path: '/services/data-analytics', icon: <FaChartLine />, desc: 'Insights that drive decisions' },
  { name: 'Virtual Assistant Services', path: '/services/virtual-assistant', icon: <FaHeadset />, desc: 'Operational support on demand' },
  { name: 'Project Management', path: '/services/project-management', icon: <FaProjectDiagram />, desc: 'Keep projects on track' },
];

const servicesDropdownCategories = [
  {
    category: 'Website & Web App Development',
    icon: <FaCode />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    services: [
      { name: 'Website Development', path: '/services/website-development' },
      { name: 'Web Applications & SaaS', path: '/services/web-applications' },
      { name: 'E-Commerce Development', path: '/services/ecommerce-development' },
      { name: 'Landing Pages & Funnels', path: '/services/landing-pages' },
    ]
  },
  {
    category: 'Website Growth & Marketing',
    icon: <FaChartBar />,
    color: 'text-green-600',
    bg: 'bg-green-50',
    services: [
      { name: 'SEO & Search Marketing', path: '/services/seo-marketing' },
      { name: 'Lead Generation', path: '/services/lead-generation' },
      { name: 'Paid Advertising', path: '/services/paid-advertising' },
      { name: 'Email Marketing', path: '/services/email-marketing' },
      { name: 'Social Media Management', path: '/services/social-media-management' },
    ]
  },
  {
    category: 'Content, Branding & Creative',
    icon: <FaPaintBrush />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    services: [
      { name: 'Graphic Design', path: '/services/graphic-design' },
      { name: 'Brand Identity & Logo', path: '/services/brand-identity' },
      { name: 'Copywriting & Content', path: '/services/copywriting' },
      { name: 'Photography & Visual Assets', path: '/services/photography' },
      { name: 'Video Editing & Motion', path: '/services/video-editing' },
    ]
  },
  {
    category: 'Automation, CRM & Integration',
    icon: <FaRobot />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    services: [
      { name: 'CRM & Marketing Automation', path: '/services/crm-automation' },
      { name: 'AI Automation Systems', path: '/services/ai-automation' },
      { name: 'API Integration', path: '/services/api-integration' },
      { name: 'Data Analytics & Reporting', path: '/services/data-analytics' },
      { name: 'Data Entry & Processing', path: '/services/data-entry' },
    ]
  },
  {
    category: 'Business Support & Operations',
    icon: <FaHeadset />,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    services: [
      { name: 'Virtual Assistant Services', path: '/services/virtual-assistant' },
      { name: 'Project Management', path: '/services/project-management' },
      { name: 'Process Documentation', path: '/services/process-documentation' },
      { name: 'Website Maintenance', path: '/services/website-maintenance' },
    ]
  },
];

// ─── MegaMenu: Services ──────────────────────────────────────────────────────
const ServicesMegaMenu = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.18 }}
    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[780px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
  >
    <div className="p-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
        Browse by Category
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {servicesDropdownCategories.map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-sm ${cat.color}`}>{cat.icon}</span>
              <span className="text-xs font-bold text-gray-700 leading-tight">{cat.category}</span>
            </div>
            <ul className="space-y-1">
              {cat.services.map((s) => (
                <li key={s.name}>
                  <Link
                    to={s.path}
                    onClick={onClose}
                    className="block text-xs text-gray-500 hover:text-blue-600 hover:translate-x-0.5 transition-all py-0.5"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-gray-400">22+ professional services available</span>
        <Link
          to="/services"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all services <FaArrowRight size={10} />
        </Link>
      </div>
    </div>
  </motion.div>
);

// ─── MegaMenu: Build From Scratch ───────────────────────────────────────────
const BuildMegaMenu = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.18 }}
    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[620px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
  >
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
          <FaDesktop className="text-white text-base" />
        </div>
        <div>
          <p className="text-white font-bold text-sm">Start From Scratch</p>
          <p className="text-blue-200 text-xs">Need a brand-new digital platform? We build it from the ground up.</p>
        </div>
      </div>
    </div>
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {buildFromScratchServices.map((s) => (
        <Link
          key={s.name}
          to={s.path}
          onClick={onClose}
          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-blue-50 transition-colors group"
        >
          <span className="text-blue-500 mt-0.5 text-sm shrink-0 group-hover:text-blue-600">{s.icon}</span>
          <div>
            <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 leading-snug">{s.name}</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-tight">{s.desc}</p>
          </div>
        </Link>
      ))}
    </div>
    <div className="px-5 pb-5">
      <Link
        to="/request-service?path=start_from_scratch"
        onClick={onClose}
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
      >
        Build My Website <FaArrowRight size={11} />
      </Link>
    </div>
  </motion.div>
);

// ─── MegaMenu: Scale Existing ────────────────────────────────────────────────
const ScaleMegaMenu = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.18 }}
    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
  >
    <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
          <FaChartLine className="text-white text-base" />
        </div>
        <div>
          <p className="text-white font-bold text-sm">Scale My Existing Website</p>
          <p className="text-green-200 text-xs">Already have a website? We optimize, grow, and automate it.</p>
        </div>
      </div>
    </div>
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {scaleExistingServices.map((s) => (
        <Link
          key={s.name}
          to={s.path}
          onClick={onClose}
          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-green-50 transition-colors group"
        >
          <span className="text-green-500 mt-0.5 text-sm shrink-0 group-hover:text-green-600">{s.icon}</span>
          <div>
            <p className="text-xs font-semibold text-gray-800 group-hover:text-green-600 leading-snug">{s.name}</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-tight">{s.desc}</p>
          </div>
        </Link>
      ))}
    </div>
    <div className="px-5 pb-5">
      <Link
        to="/request-service?path=scale_existing"
        onClick={onClose}
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
      >
        Scale My Website <FaArrowRight size={11} />
      </Link>
    </div>
  </motion.div>
);

// ─── Simple dropdown ─────────────────────────────────────────────────────────
const SimpleDropdown = ({ items, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.18 }}
    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
  >
    {items.map((item) => (
      <Link
        key={item.name}
        to={item.path}
        onClick={onClose}
        className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-l-2 border-transparent hover:border-blue-500 transition-all"
      >
        {item.name}
      </Link>
    ))}
  </motion.div>
);

// ─── Main Header ─────────────────────────────────────────────────────────────
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const timeoutRef = useRef(null);
  const location = useLocation();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleMouseEnter = (name) => {
    clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const closeDropdown = () => setOpenDropdown(null);

  const moreItems = [
    { name: 'Find a Chapter', path: '/chapters' },
    { name: 'Start a Chapter', path: '/become-director' },
    { name: 'Resources', path: '/resources' },
    { name: 'Business Partners', path: '/business-partners' },
    { name: 'Contact', path: '/contact' },
  ];

  const mobileSections = [
    { label: 'Home', path: '/', isLink: true },
    { label: 'How It Works', path: '/how-it-works', isLink: true },
    { label: 'About Us', path: '/about', isLink: true },
    { label: 'Membership', path: '/membership', isLink: true },
    {
      label: 'Services',
      children: servicesDropdownCategories.map(cat => ({
        heading: cat.category,
        items: cat.services
      }))
    },
    { label: 'Build From Scratch', path: '/build-from-scratch', isLink: true },
    { label: 'Scale Existing Website', path: '/scale-existing-website', isLink: true },
    {
      label: 'More',
      children: [{ heading: 'Other Links', items: moreItems }]
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/scalelink-logo.png"
              alt="ScaleLink Alliance"
              className="h-12 sm:h-16 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="flex flex-col">
                    <h1 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-none">ScaleLink</h1>
                    <p class="text-[10px] sm:text-xs text-gray-600 uppercase tracking-[0.2em] font-semibold mt-0.5">ALLIANCE</p>
                  </div>
                `;
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive('/') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/how-it-works"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive('/how-it-works') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              How It Works
            </Link>

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive('/services') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}>
                Services
                <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold uppercase bg-red-500 text-white rounded-full">NEW</span>
                <FaChevronDown className={`text-xs transition-transform ${openDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'services' && (
                  <ServicesMegaMenu onClose={closeDropdown} />
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/build-from-scratch"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive('/build-from-scratch') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <FaDesktop className="text-xs text-blue-500" />
              Build From Scratch
            </Link>

            <Link
              to="/scale-existing-website"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive('/scale-existing-website') ? 'text-green-600 bg-green-50 font-semibold' : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <FaChartLine className="text-xs text-green-500" />
              Scale Existing
            </Link>

            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive('/about') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              About Us
            </Link>

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('more')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                More
                <FaChevronDown className={`text-xs transition-transform ${openDropdown === 'more' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'more' && (
                  <SimpleDropdown items={moreItems} onClose={closeDropdown} />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2 ml-4 shrink-0">
            <Link
              to="/membership"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all whitespace-nowrap"
            >
              <FaUserTie />
              Join The Network
            </Link>
            <Link
              to="/free-website-review"
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-400/30 hover:scale-105 transition-all whitespace-nowrap"
            >
              <FaStar className="text-sm" />
              <span className="hidden sm:inline">Free Website Review</span>
              <span className="sm:hidden">Review</span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            aria-label="Menu"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-gray-200"
            >
              <div className="py-4 space-y-1">
                {mobileSections.map((section) => (
                  <div key={section.label}>
                    {section.isLink ? (
                      <Link
                        to={section.path}
                        className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive(section.path)
                            ? 'text-blue-600 bg-blue-50 font-semibold'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {section.label}
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => setMobileExpanded(mobileExpanded === section.label ? null : section.label)}
                          className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                          <span className={
                            section.label === 'Build From Scratch' ? 'text-blue-700' :
                            section.label === 'Scale Existing Website' ? 'text-green-700' : ''
                          }>
                            {section.label}
                          </span>
                          <FaChevronDown className={`text-xs text-gray-400 transition-transform ${
                            mobileExpanded === section.label ? 'rotate-180' : ''
                          }`} />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === section.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              {section.children.map((group) => (
                                <div key={group.heading} className="pl-4 pb-2">
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 pt-2 pb-1">
                                    {group.heading}
                                  </p>
                                  {group.items.map((item) => (
                                    <Link
                                      key={item.name}
                                      to={item.path}
                                      className="block px-2 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      onClick={() => { setIsMenuOpen(false); setMobileExpanded(null); }}
                                    >
                                      {item.name}
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                ))}

                {/* Mobile CTAs */}
                <div className="pt-3 mt-3 border-t border-gray-200 space-y-2 px-1">
                  <Link
                    to="/membership"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUserTie /> Apply to Join
                  </Link>
                  <Link
                    to="/free-website-review"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaStar /> Free Website Review
                  </Link>
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