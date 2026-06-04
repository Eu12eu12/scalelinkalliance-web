// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const navigation = {
    main: [
      { name: 'Home', href: '/' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Chapters', href: '/chapters' },
      { name: 'Membership', href: '/membership' },
      { name: 'Services', href: '/services' },
      { name: 'About Us', href: '/about' },
      { name: 'Resources', href: '/resources' },
      { name: 'Contact', href: '/contact' },
    ],
    secondary: [
      { name: 'Become a Chapter Director', href: '/become-director' },
      { name: 'Service Request', href: '/request-service' },
      { name: 'Privacy Policy', href: '/legal#privacy' },
      { name: 'Terms of Service', href: '/legal#terms' },
    ],
    social: [
      { name: 'LinkedIn', icon: FaLinkedin, href: '#' },
      { name: 'Twitter', icon: FaTwitter, href: '#' },
      { name: 'Facebook', icon: FaFacebook, href: '#' },
      { name: 'Instagram', icon: FaInstagram, href: '#' },
    ]
  };

  return (
    <footer style={{ background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1e 100%)' }} className="text-white">

      {/* Top accent line */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #3b82f6, #1d4ed8, #3b82f6)' }} />

      {/* Main footer content */}
      <div className="container mx-auto px-6 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex justify-center mb-5">
              <Link to="/" className="inline-block">
                <img 
                  src="/scalelink-logo-footer.png" 
                  alt="ScaleLink Alliance" 
                  className="h-14 w-auto object-contain" 
                />
              </Link>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-7">
              A professional business growth organization helping companies scale through structured referral networking and on-demand business services.
            </p>

            {/* Social icons */}
            <div className="flex items-center space-x-3">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-label={item.name}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.25)';
                    e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <item.icon className="h-4 w-4 text-slate-400 hover:text-blue-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-blue-500 inline-block" />
              Contact Us
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <FaMapMarkerAlt className="text-blue-400 w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm leading-relaxed">2250 Point Blvd</p>
                  <p className="text-slate-400 text-sm">Elgin, IL 60123</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <FaPhone className="text-blue-400 w-3.5 h-3.5" />
                </div>
                <a href="tel:+18156690642" className="text-slate-400 text-sm hover:text-white transition-colors">
                  +1 · 815 · 669 · 0642
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <FaEnvelope className="text-blue-400 w-3.5 h-3.5" />
                </div>
                <a href="mailto:contact@scalelinkalliance.com" className="text-slate-400 text-sm hover:text-white transition-colors break-all">
                  contact@scalelinkalliance.com
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links — split into two columns */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-blue-500 inline-block" />
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {navigation.main.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-slate-400 text-sm hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span
                    className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="container mx-auto px-6 lg:px-12">
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
      </div>

      {/* Bottom bar */}
      <div className="container mx-auto px-6 lg:px-12 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Copyright + tagline */}
          <div className="text-center md:text-left">
            <p className="text-slate-500 text-xs">
              &copy; {new Date().getFullYear()} ScaleLink Alliance. All rights reserved.
            </p>
            <p className="text-slate-600 text-xs mt-1 tracking-wide">
              📍 Local Chapters &nbsp;·&nbsp; 🌐 National Expansion &nbsp;·&nbsp; 📈 Relationship-Driven Growth
            </p>
          </div>

          {/* Secondary links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            {navigation.secondary.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-slate-500 hover:text-slate-300 text-xs transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;