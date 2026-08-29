import React from 'react';
import {
  FaPaintBrush, FaVideo, FaPenNib, FaCogs, FaChartBar, FaDatabase,
  FaFileAlt, FaUsers, FaCheck, FaArrowRight, FaCode, FaGlobe,
  FaShoppingCart, FaRocket, FaAd, FaEnvelope, FaSearch, FaHeadset,
  FaProjectDiagram, FaCamera, FaPalette, FaCloudUploadAlt,
  FaShieldAlt, FaRegBuilding, FaChartLine, FaInfoCircle, FaRobot,
  FaTools, FaStar, FaClock, FaDollarSign, FaBriefcase, FaCalendar,
  FaLayerGroup, FaMobileAlt, FaServer, FaBullhorn, FaBrain, FaLock
} from 'react-icons/fa';

export const ICON_MAP = {
  FaPaintBrush,
  FaVideo,
  FaPenNib,
  FaCogs,
  FaChartBar,
  FaDatabase,
  FaFileAlt,
  FaUsers,
  FaCheck,
  FaArrowRight,
  FaCode,
  FaGlobe,
  FaShoppingCart,
  FaRocket,
  FaAd,
  FaEnvelope,
  FaSearch,
  FaHeadset,
  FaProjectDiagram,
  FaCamera,
  FaPalette,
  FaCloudUploadAlt,
  FaShieldAlt,
  FaRegBuilding,
  FaChartLine,
  FaInfoCircle,
  FaRobot,
  FaTools,
  FaStar,
  FaClock,
  FaDollarSign,
  FaBriefcase,
  FaCalendar,
  FaLayerGroup,
  FaMobileAlt,
  FaServer,
  FaBullhorn,
  FaBrain,
  FaLock
};

export const AVAILABLE_SERVICE_ICONS = [
  { name: 'FaPaintBrush', label: 'Paint Brush (Design)', component: FaPaintBrush },
  { name: 'FaVideo', label: 'Video Camera (Video)', component: FaVideo },
  { name: 'FaPenNib', label: 'Pen Nib (Copywriting)', component: FaPenNib },
  { name: 'FaPalette', label: 'Palette (Branding)', component: FaPalette },
  { name: 'FaCamera', label: 'Camera (Photography)', component: FaCamera },
  { name: 'FaGlobe', label: 'Globe (Website Development)', component: FaGlobe },
  { name: 'FaCode', label: 'Code (Web Apps/Development)', component: FaCode },
  { name: 'FaShoppingCart', label: 'Shopping Cart (E-Commerce)', component: FaShoppingCart },
  { name: 'FaRocket', label: 'Rocket (Landing Pages)', component: FaRocket },
  { name: 'FaCogs', label: 'Cogs / Settings (API/Automation)', component: FaCogs },
  { name: 'FaRobot', label: 'Robot (AI & Automation)', component: FaRobot },
  { name: 'FaBrain', label: 'Brain (Intelligence/AI)', component: FaBrain },
  { name: 'FaSearch', label: 'Search (SEO)', component: FaSearch },
  { name: 'FaAd', label: 'Megaphone / Ad (Paid Ads)', component: FaAd },
  { name: 'FaBullhorn', label: 'Bullhorn (Marketing)', component: FaBullhorn },
  { name: 'FaEnvelope', label: 'Envelope (Email Marketing)', component: FaEnvelope },
  { name: 'FaUsers', label: 'Users (Social Media / Leads)', component: FaUsers },
  { name: 'FaStar', label: 'Star (Reviews & Reputation)', component: FaStar },
  { name: 'FaChartBar', label: 'Bar Chart (Analytics)', component: FaChartBar },
  { name: 'FaChartLine', label: 'Line Chart (Growth Strategy)', component: FaChartLine },
  { name: 'FaDatabase', label: 'Database (Data Entry / Processing)', component: FaDatabase },
  { name: 'FaHeadset', label: 'Headset (Virtual Assistant)', component: FaHeadset },
  { name: 'FaProjectDiagram', label: 'Project Diagram (Coordination)', component: FaProjectDiagram },
  { name: 'FaFileAlt', label: 'Document (SOPs & Documentation)', component: FaFileAlt },
  { name: 'FaCalendar', label: 'Calendar (Online Booking)', component: FaCalendar },
  { name: 'FaShieldAlt', label: 'Shield (Maintenance & Security)', component: FaShieldAlt },
  { name: 'FaTools', label: 'Tools (Support & Repairs)', component: FaTools },
  { name: 'FaCloudUploadAlt', label: 'Cloud (Cloud & Integrations)', component: FaCloudUploadAlt }
];

export const getServiceIcon = (iconIdentifier, props = {}) => {
  if (!iconIdentifier) return <FaCogs {...props} />;
  
  if (React.isValidElement(iconIdentifier)) {
    return React.cloneElement(iconIdentifier, props);
  }

  if (typeof iconIdentifier === 'string') {
    const cleanName = iconIdentifier.trim();
    const Comp = ICON_MAP[cleanName];
    if (Comp) return <Comp {...props} />;
  }

  if (typeof iconIdentifier === 'function') {
    const Comp = iconIdentifier;
    return <Comp {...props} />;
  }

  return <FaCogs {...props} />;
};
