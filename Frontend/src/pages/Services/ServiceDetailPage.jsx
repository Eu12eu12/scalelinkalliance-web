// src/pages/Services/ServiceDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPaintBrush, FaVideo, FaPenNib, FaCogs, FaChartBar, FaDatabase,
  FaUsers, FaCheck, FaArrowRight, FaRocket, FaFileAlt, FaCode,
  FaGlobe, FaShoppingCart, FaAd, FaEnvelope, FaSearch, FaHeadset,
  FaProjectDiagram, FaCamera, FaPalette, FaCloudUploadAlt, FaShieldAlt,
  FaRegBuilding, FaChartLine, FaTools, FaStar, FaClock, FaDollarSign,
  FaInfoCircle, FaChevronDown, FaChevronUp, FaSyncAlt, FaBriefcase,
  FaRobot, FaCalendar, FaChevronLeft, FaChevronRight, FaTimes
} from 'react-icons/fa';
import PackageComparison, { getPackageFeatures } from '../../components/sections/PackageComparison';
import OrderSidebar from '../../components/sections/OrderSidebar';
import { SERVICE_GALLERY_LOCAL } from '../../data/serviceImagesLocal';
import { getServiceIcon } from '../../utils/serviceIcons';
import { subscribeToServiceUpdates } from '../../utils/serviceSync';

// ─── SERVICE IMAGES MAP ───
const SERVICE_IMAGES = {
  'graphic-design': {
    main: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/mrmWQ9x2/Artist-sketching-illustrations.jpg',
      'https://i.ibb.co/KpKrSMtJ/BUY-NOW-typography.jpg',
      'https://i.ibb.co/fY2nxxC0/Color-palette-with-T-shirt-mockups.jpg',
      'https://i.ibb.co/d01fct4q/Designer-color-matching-printed-photo.jpg',
      'https://i.ibb.co/r2xS2JYS/Designer-editing-photos-on-monitor.jpg',
      'https://i.ibb.co/C5WtWVVG/Designer-reviewing-colors-with-graphics-tablet.jpg',
      'https://i.ibb.co/gnzxjMw/Designer-using-drawing-tablet.jpg',
      'https://i.ibb.co/SZRwc7n/Graphic-Design-Illustration.jpg',
      'https://i.ibb.co/k227d0Dp/Initial-Signature-Photography-logo-presentation.jpg',
      'https://i.ibb.co/fVkw3tTX/Isometric-statistic-diagram-set-Data-analysis-charts-futuristic-chart-elements-3d-infographic-vector.jpg',
      'https://i.ibb.co/QZ9KP5H/Logo-design-sketches-on-desk.jpg',
      'https://i.ibb.co/RpwvSjvV/Modern-design-workspace.jpg',
      'https://i.ibb.co/twJmnx6v/Team-discussing-color-palettes.jpg',
      'https://i.ibb.co/ynVtCBbn/Wedding-Invitation-Design.jpg'
    ]
  },
  'video-editing': {
    main: 'https://images.unsplash.com/photo-1574717024453-3540565bb6f0?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/pvj6d94B/Clean-workstation.jpg',
      'https://i.ibb.co/9HNNF9cq/communicating-a-professional-production-workflow.jpg',
      'https://i.ibb.co/whbxMhNZ/Editing-with-a-client-on-a-video-call.jpg',
      'https://i.ibb.co/zh59fMTd/Great-dual-monitor-editing-setup-with-visible-timeline-and-color-controls.jpg',
      'https://i.ibb.co/XfNRjHGX/Modern-editing-studio.jpg',
      'https://i.ibb.co/PvmKXW0P/Nice-office-showing-the-studio.jpg',
      'https://i.ibb.co/rR3T47XT/person-editing-on-a-dual-monitor-setup.jpg',
      'https://i.ibb.co/Df2knkJq/professional-color-gradingediting-suite.jpg',
      'https://i.ibb.co/8Dv5F2dR/Real-editor-actively-working-on-a-timeline.jpg',
      'https://i.ibb.co/99jm4zRL/Shows-an-editor-working-in-Premiere-Pro.jpg',
      'https://i.ibb.co/YFPjg0wF/someone-actively-editing-video.jpg',
      'https://i.ibb.co/LzY44XfM/wider-view-showing-the-complete-workstation.jpg'
    ]
  },
  'copywriting': {
    main: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/6R4fRHSy/Camera-and-Fruit-and-Person.jpg',
      'https://i.ibb.co/BJTYNGx/Computer-and-mic.jpg',
      'https://i.ibb.co/1fBW2yz2/Deck-and-person.jpg',
      'https://i.ibb.co/jkKsd5qh/Two-women-talk-show.jpg',
      'https://i.ibb.co/dJ2kMKgG/video-editing-workstation.jpg',
      'https://i.ibb.co/236FXqZR/Woman-with-cat-reading-article.jpg',
      'https://i.ibb.co/YF2RF8zS/Woman-with-photo-Demonstration.jpg',
      'https://i.ibb.co/VWRph4Dr/writer-workplace.jpg'
    ]
  },
  'brand-identity': {
    main: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/tPxmm1Gw/Blue-Corporate-Identity-Kit.jpg',
      'https://i.ibb.co/HQBMqnG/Brand-Guidelines-Book.jpg',
      'https://i.ibb.co/4R6jjvcT/corporate-identity-template-for-your-business-includes-CD-Cover-Business-Card-folder-ruler-Envelope.jpg',
      'https://i.ibb.co/ymyC3HPF/Landscape-Company-Branding.jpg',
      'https://i.ibb.co/C5zmKCYY/Red-Branding-Stationery.jpg',
      'https://i.ibb.co/4ZMJL2tP/Restaurant-Brand-Identity-Mockups.jpg',
      'https://i.ibb.co/KjCyrMrY/Road-Company-Branding-Package.jpg',
      'https://i.ibb.co/9m528j4j/Road-Company-Brand-Identity.jpg'
    ]
  },
  'photography': {
    main: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/5W74B7Sk/Artist-creating-content.jpg',
      'https://i.ibb.co/XfthLFyC/brands-targeting-families-schools-or-community-organizations.jpg',
      'https://i.ibb.co/s9ygNt4d/Camera-photographing-products.jpg',
      'https://i.ibb.co/jPRtfrHV/Designer-at-workstation.jpg',
      'https://i.ibb.co/CKKMNd5H/Food-photography-shoot.jpg',
      'https://i.ibb.co/gbtzv57H/Great-business-portrait-with-a-professional-camera.jpg',
      'https://i.ibb.co/JRTzTNzw/Jewelry-product-photography-setup.jpg',
      'https://i.ibb.co/DHTX9mKT/Modern-lifestyle-photography.jpg',
      'https://i.ibb.co/S7x6P81F/Photographer-with-medium-format-camera.jpg',
      'https://i.ibb.co/mk5g5mB/Product-styling-session.jpg',
      'https://i.ibb.co/YBgtm30J/real-behind-the-scenes-commercial-photoshoot.jpg'
    ]
  },
  'website-development': {
    main: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/21hzdC1B/Clean-Blue-Portfolio-Website.jpg',
      'https://i.ibb.co/LX1wLZ70/e-Commerce-layout.jpg',
      'https://i.ibb.co/tTfVYxdw/Hands-designing-mobile-wireframes-on-paper.jpg',
      'https://i.ibb.co/7JK9r66P/Home-page-inspiration.jpg',
      'https://i.ibb.co/PZmgzXPT/Human-resources.jpg',
      'https://i.ibb.co/35kv86vQ/Modern-Vector-Business-Website.jpg',
      'https://i.ibb.co/vxGwmYj1/Person-drawing-homepage.jpg',
      'https://i.ibb.co/4gd7MC65/Responsive-Business-Website.jpg',
      'https://i.ibb.co/wNS5HygD/Team-reviewing-a-wireframe-together.jpg',
      'https://i.ibb.co/xqNsmY5s/The-designer-creating-a-website-wireframe-on-the-whiteboard.jpg',
      'https://i.ibb.co/7N1Z6qh9/website-colors.jpg',
      'https://i.ibb.co/TGb8tLq/website-design-on-desktop.jpg',
      'https://i.ibb.co/RkTfwhzd/Website-development.jpg',
      'https://i.ibb.co/V0n3tjj7/Web-developer.jpg',
      'https://i.ibb.co/GQzV1fcT/Whiteboard-UI-planning.jpg'
    ]
  },
  'landing-pages': {
    main: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/G4cbBWZ4/Business-Analysts.jpg',
      'https://i.ibb.co/Z6pLKMyK/Children-playing-instrument-and-singing-before-jury.jpg',
      'https://i.ibb.co/ZzQ0GFGB/Contact-Us-Landing-Page.jpg',
      'https://i.ibb.co/VY7d5S7L/Cyber-Monday-Sale-V7-05.jpg',
      'https://i.ibb.co/fdmLDt7L/Cyber-Monday.jpg',
      'https://i.ibb.co/nsPmfTJ5/Dark-Gradient-Landing-Page.jpg',
      'https://i.ibb.co/q3NXPyRW/Ecommerce-Landing-Page.jpg',
      'https://i.ibb.co/k2dHLbFg/Empower-Your-Business.jpg',
      'https://i.ibb.co/6J76HTkp/FAQ-flat-vector-illustration.jpg',
      'https://i.ibb.co/1GJYDHQ7/gradient-sales-landing-page.jpg',
      'https://i.ibb.co/DH5QQny5/Grow-Your-Business.jpg',
      'https://i.ibb.co/NdvqzPg6/Landing-Page-Login-Screen.jpg',
      'https://i.ibb.co/zhbxr2GP/Metaverse.jpg',
      'https://i.ibb.co/qYMPT9wK/Online-Banking-Landing-Page.jpg',
      'https://i.ibb.co/CpqbZsgZ/Online-workout.jpg',
      'https://i.ibb.co/nsgLPdSj/Tiny-people-making-coffee.jpg',
      'https://i.ibb.co/NgwytsqD/Tiny-programmers-in-analysis-process-of-data.jpg',
      'https://i.ibb.co/mVcC0WCs/Women-caring-about-new-idea.jpg'
    ]
  },
  'ecommerce-development': {
    main: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/v6VQrCJb/Customer-Shopping-Online.jpg',
      'https://i.ibb.co/Zp00n1qM/Mobile-e-Commerce-App.jpg',
      'https://i.ibb.co/JW30L4TT/Modern-e-Commerce-Purchase.jpg',
      'https://i.ibb.co/B5cwfFPM/Online-Shopping-Workspace.jpg',
      'https://i.ibb.co/jPRbV1Wq/Real-e-Commerce-Store-on-Laptop.jpg'
    ]
  },
  'web-applications': {
    main: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/gM3R6Sgn/Cloud-computing-meeting.jpg',
      'https://i.ibb.co/wFCTsCyM/Dashboard-UI-on-laptop.jpg',
      'https://i.ibb.co/zTj9ysvP/Modern-analytics-dashboard-over-laptop.jpg',
      'https://i.ibb.co/20wvqs6m/Modern-application-UI-windows.jpg',
      'https://i.ibb.co/cSVBt5JF/Saa-S-concept-collage.jpg',
      'https://i.ibb.co/kppWM1Y/Saa-S-product-being-developed-or-demonstrated.jpg'
    ]
  },
  'api-integration': {
    main: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/srV1bGd/API-Integration-on-Laptop.jpg',
      'https://files.catbox.moe/2r9hsz.jpg',
      'https://files.catbox.moe/3whuwm.jpg',
      'https://i.ibb.co/WpskT9mB/Business-Workflow-Planning.jpg',
      'https://i.ibb.co/TM9Lynf6/Cloud-Architecture.jpg',
      'https://i.ibb.co/Fbh932jd/Hand-Drawn-Workflow-Diagram.jpg',
      'https://files.catbox.moe/0fa7w2.jpg'
    ]
  },
  'website-maintenance': {
    main: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/LXh5VzHH/Hands-typing-on-a-keyboard.jpg',
      'https://i.ibb.co/HfWHjdtT/Person-holding-a-laptop.jpg',
      'https://i.ibb.co/T5ZmV5L/Person-interacting-with-a-website-interface.jpg',
      'https://i.ibb.co/DH11CV4V/Planned-maintenance.jpg'
    ]
  },
  'online-booking-systems': {
    main: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/bMnLC28F/Booking-System-Team-Meeting.jpg',
      'https://i.ibb.co/b59WGRd1/Calendar-Dashboard-on-Laptop.jpg',
      'https://i.ibb.co/chYNzxv2/Calendar-Scheduling-Interface.jpg',
      'https://i.ibb.co/fVh7x4S1/Doctor-Appointment-website.jpg',
      'https://i.ibb.co/VcZn98HD/Laptop-with-Book-Online-website.jpg',
      'https://i.ibb.co/5WsZDDyr/Mobile-Online-Booking-app.jpg',
      'https://i.ibb.co/ccK5hbLm/Newsletter-Signup.jpg',
      'https://i.ibb.co/sJtmnS9V/Person-using-a-Book-Appointment-website-on-a-laptop.jpg',
      'https://i.ibb.co/KpqtgJDD/Person-using-Online-Booking-website-on-laptop.jpg',
      'https://i.ibb.co/WvTH1DDH/Phone-scheduling-appointment.jpg',
      'https://i.ibb.co/svTbHtcp/Tablet-with-Booking-interface.jpg',
      'https://i.ibb.co/tM1wnBWY/Top-down-workspace-with-booking-on-phone.jpg',
      'https://i.ibb.co/ks0w6cS2/Typing-booking-into-a-search-bar.jpg'
    ]
  },
  'social-media-management': {
    main: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/qL6xTSsC/A-lifestyle-creator-making-content-outdoors.jpg',
      'https://i.ibb.co/nqrfXWpz/content-creation-product-photography-and-brand-promotion.png',
      'https://i.ibb.co/kVC6CTff/content-production-setup-with-lighting-camera-people-collaborating-and-filming.jpg',
      'https://i.ibb.co/Gfm03Fz8/creative-team-brainstorming-reviewing-a-project.jpg',
      'https://i.ibb.co/HwxF9xh/natural-home-office-creator-setup.jpg',
      'https://i.ibb.co/Kp55n8yT/podcasting-video-production-and-social-content-creation.jpg',
      'https://i.ibb.co/S4yXm2M8/Podcast-video-setup.jpg',
      'https://i.ibb.co/G4DvnZgp/professional-meeting-with-social-media-discussion.jpg',
      'https://i.ibb.co/hRLYZHhf/someone-scheduling-posts-or-managing-campaigns.jpg',
      'https://i.ibb.co/QvHsYkwh/Two-people-collaborating-over-a-laptop.jpg'
    ]
  },
  'seo-marketing': {
    main: 'https://images.unsplash.com/photo-1432889821006-8e42f3c6ddb9?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/jZw0rytN/Business-consultant-presenting-ideas-across-a-tablet-and-laptop.jpg',
      'https://i.ibb.co/CpxDGpc6/Laptop-with-SEO-dashboard.jpg',
      'https://i.ibb.co/S4C9LXSs/man-and-woman-discuss-seo.jpg',
      'https://i.ibb.co/CprDG2Qz/people-discussing-a-project-with-laptops-tablets-and-documents.jpg',
      'https://i.ibb.co/4wsyvqjF/SEO-search-bar-with-two-people-collaborating.jpg',
      'https://i.ibb.co/wr7fgFmF/The-team-reviewing-charts-while-someone-works-on-the-laptop.jpg',
      'https://i.ibb.co/Psbw84rD/Woman-clicking-a-search-button.jpg'
    ]
  },
  'paid-advertising': {
    main: 'https://images.unsplash.com/photo-1432889821006-8e42f3c6ddb9?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/dsVBK3st/Business-person-typing-with-ad-overlay.jpg',
      'https://i.ibb.co/r2xZkRgj/digital-advertising-dashboard.jpg',
      'https://i.ibb.co/CK3GHgdD/Excellent-marketing-dashboard.jpg',
      'https://i.ibb.co/s9G2W86x/Executive-interacting-with-an-advertising-interface.jpg',
      'https://i.ibb.co/TMkJ3H1V/Great-analytics-ads-dashboard-realistic-laptop.jpg',
      'https://i.ibb.co/XrGjhmYg/Modern-paid-advertising-on-laptop.jpg',
      'https://i.ibb.co/QWmdp2z/More-of-a-landing-page-illustration-than-portfolio-work.jpg',
      'https://i.ibb.co/nstCbVW5/Nice-combination-of-ads-analytics-and-business-presentation.jpg',
      'https://i.ibb.co/xcH7wfJ/Nice-real-world-laptop-with-digital-marketing-interface.jpg',
      'https://i.ibb.co/1G0jPShs/Real-people-discussing-campaigns-with-dashboards-overlaid.jpg'
    ]
  },
  'email-marketing': {
    main: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/1xhsg1X/Digital-Marketing-Concept-Startup-Project-Work.jpg',
      'https://i.ibb.co/tMHz43tb/Digital-Marketing-on-Laptop.jpg',
      'https://i.ibb.co/gbf3wkfQ/Email-Engagement.jpg',
      'https://i.ibb.co/GfHJ1JWX/e-Mail-Marketing-Doodle.jpg',
      'https://i.ibb.co/JjfyHJJB/Email-notifications-and-analytics-together.jpg',
      'https://i.ibb.co/9Htx5DqQ/Inbox-management-visualization.jpg',
      'https://i.ibb.co/JRwq6dBY/Shows-the-entire-email-marketing-funnel-product.png',
      'https://i.ibb.co/5W2sVFjj/Person-managing-email-campaigns-on-a-laptop.jpg'
    ]
  },
  'lead-generation': {
    main: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/dZFFMz4/Designer-using-drawing-tablet.jpg',
      'https://i.ibb.co/7xgGgY6D/Developer-building-a-landing-page.jpg',
      'https://i.ibb.co/kg5ztzXp/Digital-Marketing-Meeting.jpg',
      'https://i.ibb.co/3yFwpyhL/Lead-Generation-Network.jpg',
      'https://i.ibb.co/twrB98nG/Lead-Generation-on-Laptop.jpg',
      'https://i.ibb.co/HDrwV1KS/lead-generation-outline-infographics.jpg',
      'https://i.ibb.co/N6QtXKX5/Lead-generation-process-diagram.jpg',
      'https://i.ibb.co/Kp94vjyP/Tablet-with-Lead-Generation.jpg',
      'https://i.ibb.co/0pj76Vq9/Tablet-with-Lead-Generation-Network.jpg'
    ]
  },
  'reputation-review-management': {
    main: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=500&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=500&fit=crop'
    ]
  },
  'crm-automation': {
    main: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/fG4xm2v9/CRM-dashboard-with-analytics-and-KPI-overlays.jpg',
      'https://i.ibb.co/ZRmH9zxK/CRM-displayed-on-a-laptop-in-a-real-office.jpg',
      'https://i.ibb.co/JjvDJ6kH/CRM-text-is-pushed-left-and-competes-with-all-the-hexagons.jpg',
      'https://i.ibb.co/YFdJs1Xk/Marketing-automation.jpg',
      'https://i.ibb.co/yFnMy2hN/Person-interacting-with-a-CRM-interface-on-a-laptop.jpg',
      'https://i.ibb.co/CpVqxY6P/Tablet-displaying-dashboards-in-a-real-office.jpg',
      'https://i.ibb.co/Pvc7x9cn/Team-collaboration-plus-CRM-overlay.jpg',
      'https://i.ibb.co/S4dMN8cg/The-person-interacting-with-a-CRM-dashboard-on-a-laptop.jpg',
      'https://i.ibb.co/bg6cGxZ1/We-implement-CRM-systems.jpg'
    ]
  },
  'ai-automation': {
    main: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
    gallery: [
      'https://ibb.co/tTdH28M6',
      'https://ibb.co/ymgrk6gf',
      'https://ibb.co/GG86gL9',
      'https://ibb.co/RxjHg2f',
      'https://ibb.co/8DWbsg3y',
      'https://ibb.co/RTVRWwmP',
      'https://ibb.co/BV55kZjF',
      'https://ibb.co/HDSxb1Q0',
      'https://ibb.co/hJYjfthq',
      'https://ibb.co/yB6twpPn',
      'https://ibb.co/Y4psZ6kS'
    ]
  },
  'business-process-automation': {
    main: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop'
    ]
  },
  'data-analytics': {
    main: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/HT9km5FP/analytics-dashboards-on-actual-devices.jpg',
      'https://i.ibb.co/4gPkkr5L/A-consultant-presenting-reports-and-dashboards.jpg',
      'https://i.ibb.co/JRpZgtV7/Client-reviewing-reports-on-a-tablet.jpg',
      'https://i.ibb.co/pjGhF7RR/consulting-and-business-intelligence.jpg',
      'https://i.ibb.co/8Djn3wwr/financial-analysis-workspace.jpg',
      'https://i.ibb.co/RphxGCcq/Modern-dashboard-on-a-laptop-with-someone-actively-analyzing-the-data.jpg',
      'https://i.ibb.co/JWxz3GW6/person-analyzing-dashboards.jpg',
      'https://i.ibb.co/Q3z4JFgy/person-working-inside-a-reporting-dashboard.jpg',
      'https://i.ibb.co/5WVNCJBf/real-analytics-dashboard.jpg',
      'https://i.ibb.co/ynwQfwn8/Real-charts-and-KPIs.jpg',
      'https://i.ibb.co/rKQFQyJ6/Shows-inventory-analytics-in-a-warehouse-using-a-dashboard.jpg',
      'https://i.ibb.co/gMymzwfD/Very-modern-Saa-S-analytics-interface.jpg'
    ]
  },
  'business-consulting-Standard-strategy': {
    main: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=500&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=500&fit=crop'
    ]
  },
  'virtual-assistant': {
    main: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/HLPXzN2p/Friendly-professional-wearing-a-headset.jpg',
      'https://i.ibb.co/svRzDpP6/Friendly-remote-support-specialist-at-a-desk.jpg',
      'https://i.ibb.co/bgskn6g2/lifestyle-image-showing-voice-communication-while-working-on-a-laptop.jpg',
      'https://i.ibb.co/pBLykyLy/Natural-close-up-of-a-headset-conversation.jpg',
      'https://i.ibb.co/jZz1QS0H/Natural-photo-of-someone-using-voice-communication.jpg',
      'https://i.ibb.co/LXJdnv1C/Professional-executive-assistant-at-a-real-desk.jpg',
      'https://i.ibb.co/pBqfRpFL/Professional-on-a-headset-in-a-video-meeting.jpg',
      'https://i.ibb.co/qY61bVD7/Professional-working-at-a-laptop-using-voice-assistance.jpg',
      'https://i.ibb.co/ch4KyGvg/Customer-Support-Representative.jpg',
      'https://i.ibb.co/svqkqKHQ/Warm-customer-support-close-up.jpg'
    ]
  },
  'project-management': {
    main: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/3mYfVM51/Business-meeting-reviewing-reports-and-charts.jpg',
      'https://i.ibb.co/RknZxzDx/Business-person-drawing-Standard-chart.jpg',
      'https://i.ibb.co/wNGBk7Br/Consultant-reviewing-paperwork-with-client.jpg',
      'https://i.ibb.co/zhYZHLg9/Handshake-between-client-and-project-manager.jpg',
      'https://i.ibb.co/dwcXxd3z/High-five-after-project-success.jpg',
      'https://i.ibb.co/wNSjfGF0/People-reviewing-analytics-on-printed-reports.jpg',
      'https://i.ibb.co/whPmqzyB/People-reviewing-UX-wireframes-with-project-management-overlay.jpg',
      'https://i.ibb.co/Tqqhyx02/Project-Management-interface.jpg',
      'https://i.ibb.co/tPNGpp7M/Team-discussing-work-over-laptop-with-a-walkie-talkie.jpg',
      'https://i.ibb.co/bj5Y828b/Team-reviewing-blueprints-around-the-table.jpg'
    ]
  },
  'process-documentation': {
    main: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/SDJkjW06/Business-meeting-with-reports-tablet-and-lipboard.jpg',
      'https://i.ibb.co/b5yZxBXm/Business-team-reviewing-reports-and-process-documents.jpg',
      'https://i.ibb.co/1Sy84Pm/Close-up-of-reports-with-laptop-and-tablet.jpg',
      'https://i.ibb.co/213dMk2y/Document-workflow-over-a-real-laptop.jpg',
      'https://i.ibb.co/WNF9fxW3/Person-reviewing-analytics-on-tablet.jpg',
      'https://i.ibb.co/Nngdcd1m/Project-Lifecycle-Flowchart-Mapping-Workflow-for-Creative-and-Manufacturing.jpg',
      'https://i.ibb.co/DDwJBrNr/Swimlane-flowchart-mapping-cross-functional-corporate-processes.jpg',
      'https://i.ibb.co/tdg1vn5/workflow-line-infographics.jpg'
    ]
  },
  'data-entry': {
    main: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop',
    gallery: [
      'https://i.ibb.co/1Y3yCWg0/Credit-Card-on-Laptop.jpg',
      'https://i.ibb.co/ch4KyGvg/Customer-Support-Representative.jpg',
      'https://i.ibb.co/Zztxysqq/DATA-on-the-Office-Window.jpg',
      'https://i.ibb.co/6cBK34Nd/Office-Employee-Working.jpg',
      'https://i.ibb.co/Zz44n3sw/Office-Staff-Using-Business-Software.jpg',
      'https://i.ibb.co/B26f8fJ9/Online-Payment-Processing.jpg',
      'https://i.ibb.co/MyMgNn34/Professional-Typing.jpg',
      'https://i.ibb.co/TBV5mK6x/Warehouse-Data-Processing.jpg'
    ]
  }
};

// ─── COMPLETE SERVICES DATA ───
const SERVICES_DATA = {
  'graphic-design': {
    title: 'Graphic Design Services',
    category: 'Creative & Content',
    icon: <FaPaintBrush />,
    intro: 'Strong visual design helps businesses communicate clearly, attract attention, and create a professional brand presence.',
    description: 'Whether for marketing materials, social media content, or digital advertising, effective design plays an essential role in how businesses present themselves to their audience.',
    longDescription: 'Scale Link Alliance provides graphic design services that help businesses create visually compelling materials that support branding, marketing campaigns, and promotional efforts.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.9, reviews: 237, ordersInQueue: 9, verified: true },
    whatItHelpsAchieve: ['create professional marketing materials', 'strengthen brand recognition', 'improve the visual impact of marketing campaigns', 'communicate ideas clearly through visuals', 'build a consistent brand image across platforms'],
    howMeasured: ['number of design assets created', 'number of revisions required', 'complexity of design elements', 'number of formats delivered'],
    servicesInclude: ['Social media graphics', 'Marketing flyers and posters', 'Business cards and stationery', 'Presentation and report visuals', 'Advertising graphics and banners'],
    tools: ['Adobe Creative Suite', 'Figma', 'Canva', 'Procreate', 'Sketch'],
    complementaryServices: [
      { name: 'Brand Identity & Logo Design', reason: 'consistent branding' },
      { name: 'Copywriting & Content Creation', reason: 'marketing messaging' },
      { name: 'Social Media Management', reason: 'content publishing' },
      { name: 'Website Development', reason: 'digital presence' },
      { name: 'Video Editing & Motion Graphics', reason: 'visual marketing content' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$49', description: 'Best for a single marketing asset — e.g. flyer, promotional graphic, social graphic, or simple banner.', includes: ['1 marketing asset', '1 finished size/format', 'Basic custom design', 'Client-provided brand assets', '1 revision round', 'Final web-ready file'] },
      Standard: { name: 'Standard Package', price: '$199', description: 'Standard Design Package — a coordinated set of marketing assets.', includes: ['Up to 5 coordinated assets', 'Consistent visual direction', 'Up to 2 sizes per core design where required', 'Basic image sourcing', '2 revision rounds', 'Web-ready final files'] },
      premium: { name: 'Premium Package', price: '$499', description: 'Premium Design Package — for businesses running full marketing campaigns.', includes: ['Up to 12 coordinated marketing assets', 'Creative direction', 'Brand-consistent design system', 'Multiple campaign formats', 'Up to 3 revision rounds', 'Organized final files', 'Print-ready files when required'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: '1 marketing asset', values: { basic: true, standard: true, premium: true } },
        { label: '1 finished size/format', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic custom design', values: { basic: true, standard: true, premium: true } },
        { label: 'Client-provided brand assets', values: { basic: true, standard: true, premium: true } },
        { label: '1 revision round', values: { basic: true, standard: true, premium: true } },
        { label: 'Final web-ready file', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 5 coordinated assets', values: { basic: false, standard: true, premium: true } },
        { label: 'Consistent visual direction', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 2 sizes per core design where required', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic image sourcing', values: { basic: false, standard: true, premium: true } },
        { label: '2 revision rounds', values: { basic: false, standard: true, premium: true } },
        { label: 'Web-ready final files', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 12 coordinated marketing assets', values: { basic: false, standard: false, premium: true } },
        { label: 'Creative direction', values: { basic: false, standard: false, premium: true } },
        { label: 'Brand-consistent design system', values: { basic: false, standard: false, premium: true } },
        { label: 'Multiple campaign formats', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 3 revision rounds', values: { basic: false, standard: false, premium: true } },
        { label: 'Organized final files', values: { basic: false, standard: false, premium: true } },
        { label: 'Print-ready files when required', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$49', packageName: 'Starter Package', shortDescription: '1 marketing asset, 1 revision round, final web-ready file', description: 'Best for a single marketing asset — e.g. flyer, promotional graphic, social graphic, or simple banner.', deliveryLabel: 'Shown during service selection', revisions: '1 revision round', includes: ['1 marketing asset', '1 finished size/format', 'Basic custom design', 'Client-provided brand assets', '1 revision round', 'Final web-ready file'] },
        standard: { price: '$199', packageName: 'Standard Package', shortDescription: 'Up to 5 coordinated assets, 2 revision rounds', description: 'Standard Design Package — a coordinated set of marketing assets.', deliveryLabel: 'Shown during service selection', revisions: '2 revision rounds', includes: ['Up to 5 coordinated assets', 'Consistent visual direction', 'Up to 2 sizes per core design where required', 'Basic image sourcing', '2 revision rounds', 'Web-ready final files'] },
        premium: { price: '$499', packageName: 'Premium Package', shortDescription: 'Up to 12 coordinated assets, print-ready files', description: 'Premium Design Package — for businesses running full marketing campaigns.', deliveryLabel: 'Shown during service selection', revisions: 'Up to 3 revision rounds', includes: ['Up to 12 coordinated marketing assets', 'Creative direction', 'Brand-consistent design system', 'Multiple campaign formats', 'Up to 3 revision rounds', 'Organized final files', 'Print-ready files when required'] }
      }
    },
    sampleProject: {
      projectName: "VisualEdge Promo Design Pack",
      businessType: "Local service business",
      projectSummary: "A professional graphic design concept created to help a business promote its services with clean, branded visuals across digital and print platforms.",
      servicesIncluded: ["Social media graphics", "Flyer design", "Promotional banners", "Service highlight graphics", "Branded layout", "Call-to-action visuals"],
      portfolioCardText: "A branded graphic design concept built to help a business look professional, promote offers clearly, and attract more attention."
    }
  },
  'video-editing': {
    title: 'Video Editing & Motion Graphics',
    category: 'Creative & Content',
    icon: <FaVideo />,
    intro: 'Video content is one of the most powerful ways to capture attention and engage audiences.',
    description: 'Our video editing and motion graphics services transform raw footage into polished visual stories that communicate your message and promote your business effectively.',
    longDescription: 'Scale Link Alliance provides professional video editing and motion graphics services that help businesses create engaging video content for marketing, social media, and brand promotion.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 189, ordersInQueue: 5, verified: true },
    whatItHelpsAchieve: ['social media marketing', 'promotional videos', 'product demonstrations', 'business presentations', 'online advertising', 'website video content'],
    howMeasured: ['number of videos', 'video length', 'motion graphics complexity', 'number of revisions'],
    servicesInclude: ['Promotional videos', 'Social media video edits', 'Motion graphics and animations', 'Video branding elements', 'Short-form marketing videos'],
    tools: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'thumbnails, social media visuals' },
      { name: 'Copywriting & Content Creation', reason: 'video scripts' },
      { name: 'Social Media Management', reason: 'posting and engagement' },
      { name: 'Paid Advertising Management', reason: 'video ads' },
      { name: 'Landing Page Development', reason: 'conversion pages for campaigns' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$99', description: 'Best for a single short video up to 60 seconds.', includes: ['1 video up to 60 seconds', 'Basic cuts', 'Basic transitions', 'Text/captions', 'Basic audio balancing', 'Client-provided footage', '1 aspect ratio', '1 revision round', 'Final exported video'] },
      Standard: { name: 'Standard Package', price: '$299', description: 'A single longer video with professional polish.', includes: ['1 video up to 5 minutes', 'Professional editing', 'B-roll placement', 'Titles/text graphics', 'Basic motion graphics', 'Audio cleanup', 'Color correction', 'Captions', 'Up to 2 aspect ratios', '2 revision rounds'] },
      premium: { name: 'Premium Package', price: '$699', description: 'A long-form video or a small batch of short-form videos.', includes: ['1 long-form video up to 12 minutes OR up to 5 short-form videos from supplied footage', 'Advanced editing', 'Motion graphics', 'B-roll', 'Audio enhancement', 'Color correction', 'Captions', 'Branded graphics', 'Multiple export formats', 'Up to 3 revision rounds'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: '1 video up to 60 seconds', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic cuts', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic transitions', values: { basic: true, standard: true, premium: true } },
        { label: 'Text/captions', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic audio balancing', values: { basic: true, standard: true, premium: true } },
        { label: 'Client-provided footage', values: { basic: true, standard: true, premium: true } },
        { label: '1 aspect ratio', values: { basic: true, standard: true, premium: true } },
        { label: '1 revision round', values: { basic: true, standard: true, premium: true } },
        { label: 'Final exported video', values: { basic: true, standard: true, premium: true } },
        { label: '1 video up to 5 minutes', values: { basic: false, standard: true, premium: true } },
        { label: 'Professional editing', values: { basic: false, standard: true, premium: true } },
        { label: 'B-roll placement', values: { basic: false, standard: true, premium: true } },
        { label: 'Titles/text graphics', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic motion graphics', values: { basic: false, standard: true, premium: true } },
        { label: 'Audio cleanup', values: { basic: false, standard: true, premium: true } },
        { label: 'Color correction', values: { basic: false, standard: true, premium: true } },
        { label: 'Captions', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 2 aspect ratios', values: { basic: false, standard: true, premium: true } },
        { label: '2 revision rounds', values: { basic: false, standard: true, premium: true } },
        { label: '1 long-form video up to 12 minutes OR up to 5 short-form videos from supplied footage', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced editing', values: { basic: false, standard: false, premium: true } },
        { label: 'Motion graphics', values: { basic: false, standard: false, premium: true } },
        { label: 'B-roll', values: { basic: false, standard: false, premium: true } },
        { label: 'Audio enhancement', values: { basic: false, standard: false, premium: true } },
        { label: 'Branded graphics', values: { basic: false, standard: false, premium: true } },
        { label: 'Multiple export formats', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 3 revision rounds', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$99', packageName: 'Starter Package', shortDescription: '1 video up to 60 seconds, basic cuts, 1 revision', description: 'Best for a single short video up to 60 seconds.', deliveryLabel: 'Shown during service selection', revisions: '1 revision round', includes: ['1 video up to 60 seconds', 'Basic cuts', 'Basic transitions', 'Text/captions', 'Basic audio balancing', 'Client-provided footage', '1 aspect ratio', '1 revision round', 'Final exported video'] },
        standard: { price: '$299', packageName: 'Standard Package', shortDescription: '1 video up to 5 minutes, professional editing, 2 revisions', description: 'A single longer video with professional polish.', deliveryLabel: 'Shown during service selection', revisions: '2 revision rounds', includes: ['1 video up to 5 minutes', 'Professional editing', 'B-roll placement', 'Titles/text graphics', 'Basic motion graphics', 'Audio cleanup', 'Color correction', 'Captions', 'Up to 2 aspect ratios', '2 revision rounds'] },
        premium: { price: '$699', packageName: 'Premium Package', shortDescription: 'Long-form or up to 5 short-form videos, advanced editing', description: 'A long-form video or a small batch of short-form videos.', deliveryLabel: 'Shown during service selection', revisions: 'Up to 3 revision rounds', includes: ['1 long-form video up to 12 minutes OR up to 5 short-form videos from supplied footage', 'Advanced editing', 'Motion graphics', 'B-roll', 'Audio enhancement', 'Color correction', 'Captions', 'Branded graphics', 'Multiple export formats', 'Up to 3 revision rounds'] }
      }
    },
    sampleProject: {
      projectName: "MotionPro Brand Video",
      businessType: "Professional service business",
      projectSummary: "A video editing and motion graphics concept designed to help a business explain its services, build trust, and promote its offer on social media or a website.",
      servicesIncluded: ["Video editing", "Captions", "Branded text", "Motion graphics", "Background music", "Call-to-action screen", "Social media formatting"],
      portfolioCardText: "A polished business video concept built to capture attention, explain value, and support brand Standard."
    }
  },
  'copywriting': {
    title: 'Copywriting & Content Creation',
    category: 'Creative & Content',
    icon: <FaPenNib />,
    intro: 'Clear and persuasive content is essential for turning visitors into customers.',
    description: 'Our copywriting services help you communicate your value, tell your story, and encourage action through well-crafted messaging.',
    longDescription: 'Scale Link Alliance provides professional copywriting and content creation services that help businesses communicate clearly, build trust, and convert visitors into customers.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.9, reviews: 312, ordersInQueue: 7, verified: true },
    whatItHelpsAchieve: ['website pages', 'blog articles', 'marketing campaigns', 'email newsletters', 'social media captions', 'product descriptions', 'advertising copy'],
    howMeasured: ['number of content pieces', 'word count', 'number of revisions', 'research and SEO requirements'],
    servicesInclude: ['Website content', 'Marketing copy', 'Blog articles', 'Social media captions', 'Email marketing content'],
    tools: ['SEMrush', 'Ahrefs', 'Grammarly', 'Hemingway Editor'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'visual marketing materials' },
      { name: 'Website Development', reason: 'publish the content' },
      { name: 'SEO & Search Marketing', reason: 'drive traffic' },
      { name: 'Email Marketing Campaigns', reason: 'send content to audiences' },
      { name: 'Social Media Management', reason: 'distribute content' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$99', description: 'Small content needs or single-page messaging.', includes: ['Blog/article up to 800 words, OR short sales page, OR email copy package, OR small website-page rewrite', 'Topic research', 'Brand-tone alignment', 'Basic SEO considerations where applicable', '1 revision round'] },
      Standard: { name: 'Standard Package', price: '$299', description: 'Businesses needing multiple content pieces with keyword awareness.', includes: ['Up to 2,500 total words', 'Up to 3 content pieces/pages', 'Keyword consideration', 'CTA development', 'Headline development', 'Basic competitor/content review', '2 revision rounds'] },
      premium: { name: 'Premium Package', price: '$699', description: 'Businesses running content marketing campaigns.', includes: ['Up to 6,000 total words', 'Up to 6 pages/content pieces', 'Content strategy', 'SEO-oriented structure where applicable', 'Conversion-focused CTA development', 'Brand voice consistency', 'Content formatting recommendations', 'Up to 3 revision rounds'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Blog/article up to 800 words, OR short sales page, OR email copy package, OR small website-page rewrite', values: { basic: true, standard: true, premium: true } },
        { label: 'Topic research', values: { basic: true, standard: true, premium: true } },
        { label: 'Brand-tone alignment', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic SEO considerations where applicable', values: { basic: true, standard: true, premium: true } },
        { label: '1 revision round', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 2,500 total words', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 3 content pieces/pages', values: { basic: false, standard: true, premium: true } },
        { label: 'Keyword consideration', values: { basic: false, standard: true, premium: true } },
        { label: 'CTA development', values: { basic: false, standard: true, premium: true } },
        { label: 'Headline development', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic competitor/content review', values: { basic: false, standard: true, premium: true } },
        { label: '2 revision rounds', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 6,000 total words', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 6 pages/content pieces', values: { basic: false, standard: false, premium: true } },
        { label: 'Content strategy', values: { basic: false, standard: false, premium: true } },
        { label: 'SEO-oriented structure where applicable', values: { basic: false, standard: false, premium: true } },
        { label: 'Conversion-focused CTA development', values: { basic: false, standard: false, premium: true } },
        { label: 'Brand voice consistency', values: { basic: false, standard: false, premium: true } },
        { label: 'Content formatting recommendations', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 3 revision rounds', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$99', packageName: 'Starter Package', shortDescription: '1 content piece up to 800 words, 1 revision round', description: 'Small content needs or single-page messaging.', deliveryLabel: 'Shown during service selection', revisions: '1 revision round', includes: ['Blog/article up to 800 words, OR short sales page, OR email copy package, OR small website-page rewrite', 'Topic research', 'Brand-tone alignment', 'Basic SEO considerations where applicable', '1 revision round'] },
        standard: { price: '$299', packageName: 'Standard Package', shortDescription: 'Up to 2,500 words across 3 pieces, 2 revisions', description: 'Businesses needing multiple content pieces with keyword awareness.', deliveryLabel: 'Shown during service selection', revisions: '2 revision rounds', includes: ['Up to 2,500 total words', 'Up to 3 content pieces/pages', 'Keyword consideration', 'CTA development', 'Headline development', 'Basic competitor/content review', '2 revision rounds'] },
        premium: { price: '$699', packageName: 'Premium Package', shortDescription: 'Up to 6,000 words across 6 pieces, content strategy', description: 'Businesses running content marketing campaigns.', deliveryLabel: 'Shown during service selection', revisions: 'Up to 3 revision rounds', includes: ['Up to 6,000 total words', 'Up to 6 pages/content pieces', 'Content strategy', 'SEO-oriented structure where applicable', 'Conversion-focused CTA development', 'Brand voice consistency', 'Content formatting recommendations', 'Up to 3 revision rounds'] }
      }
    },
    sampleProject: {
      projectName: "ClearMessage Website Copy Package",
      businessType: "Professional service company",
      projectSummary: "A content creation concept designed to help a business explain its services clearly, build trust, and encourage visitors to take action.",
      servicesIncluded: ["Homepage copy", "Service page copy", "Short business bio", "Call-to-action writing", "Web readability formatting", "Basic keyword research"],
      portfolioCardText: "A website copy concept built to make a business message clearer, more persuasive, and easier for customers to understand."
    }
  },
  'brand-identity': {
    title: 'Brand Identity & Logo Design',
    category: 'Creative & Content',
    icon: <FaPalette />,
    intro: 'Your brand identity is the visual foundation of your business.',
    description: 'A well-designed logo and consistent brand system help customers recognize your company, build trust, and differentiate your business from competitors.',
    longDescription: 'Scale Link Alliance provides professional brand identity and logo design services that help businesses establish a strong visual presence across marketing materials, websites, and digital platforms.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.9, reviews: 412, ordersInQueue: 12, verified: true },
    whatItHelpsAchieve: ['establish a recognizable brand', 'maintain visual consistency across platforms', 'improve marketing effectiveness', 'create a professional first impression', 'strengthen customer trust and credibility'],
    howMeasured: ['number of logo concepts', 'revision rounds', 'additional brand assets included', 'development of brand guidelines'],
    servicesInclude: ['Custom logo design', 'Brand color palette', 'Typography selection', 'Brand style guide', 'Visual brand assets'],
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma', 'Procreate'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'marketing materials and social media graphics' },
      { name: 'Website Development', reason: 'brand-consistent website' },
      { name: 'Copywriting & Content Creation', reason: 'brand messaging' },
      { name: 'Social Media Management', reason: 'brand promotion' },
      { name: 'Photography & Visual Assets', reason: 'brand imagery' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$249', description: 'Starter Identity — small businesses launching a brand or refreshing their logo.', includes: ['Brand discovery questionnaire', '2 initial logo concepts', '2 revision rounds', 'Primary logo', 'Basic color palette', 'Basic typography recommendations', 'PNG, JPG and transparent logo files'] },
      Standard: { name: 'Standard Package', price: '$599', description: 'Standard Identity — businesses that want a more developed brand identity.', includes: ['Brand discovery', '3 initial logo concepts', 'Primary logo', 'Secondary logo variation', 'Icon/mark', 'Color palette', 'Typography system', 'Social profile assets', 'Basic brand guidelines', '3 revision rounds', 'Organized final files'] },
      premium: { name: 'Premium Package', price: '$1,299', description: 'Premium Brand Identity — companies building a full professional brand identity.', includes: ['Brand strategy session', 'Competitive visual review', '3 refined creative directions', 'Primary and secondary logos', 'Brand mark', 'Color system', 'Typography system', 'Brand imagery direction', 'Social assets', 'Basic business-card/letterhead templates', 'Comprehensive brand guideline document', 'Up to 3 revision rounds', 'Complete final-file package'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Brand discovery questionnaire', values: { basic: true, standard: true, premium: true } },
        { label: '2 initial logo concepts', values: { basic: true, standard: true, premium: true } },
        { label: '2 revision rounds', values: { basic: true, standard: true, premium: true } },
        { label: 'Primary logo', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic color palette', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic typography recommendations', values: { basic: true, standard: true, premium: true } },
        { label: 'PNG, JPG and transparent logo files', values: { basic: true, standard: true, premium: true } },
        { label: 'Brand discovery', values: { basic: false, standard: true, premium: true } },
        { label: '3 initial logo concepts', values: { basic: false, standard: true, premium: true } },
        { label: 'Secondary logo variation', values: { basic: false, standard: true, premium: true } },
        { label: 'Icon/mark', values: { basic: false, standard: true, premium: true } },
        { label: 'Color palette', values: { basic: false, standard: true, premium: true } },
        { label: 'Typography system', values: { basic: false, standard: true, premium: true } },
        { label: 'Social profile assets', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic brand guidelines', values: { basic: false, standard: true, premium: true } },
        { label: '3 revision rounds', values: { basic: false, standard: true, premium: true } },
        { label: 'Organized final files', values: { basic: false, standard: true, premium: true } },
        { label: 'Brand strategy session', values: { basic: false, standard: false, premium: true } },
        { label: 'Competitive visual review', values: { basic: false, standard: false, premium: true } },
        { label: '3 refined creative directions', values: { basic: false, standard: false, premium: true } },
        { label: 'Primary and secondary logos', values: { basic: false, standard: false, premium: true } },
        { label: 'Brand mark', values: { basic: false, standard: false, premium: true } },
        { label: 'Color system', values: { basic: false, standard: false, premium: true } },
        { label: 'Brand imagery direction', values: { basic: false, standard: false, premium: true } },
        { label: 'Social assets', values: { basic: false, standard: false, premium: true } },
        { label: 'Basic business-card/letterhead templates', values: { basic: false, standard: false, premium: true } },
        { label: 'Comprehensive brand guideline document', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 3 revision rounds', values: { basic: false, standard: false, premium: true } },
        { label: 'Complete final-file package', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$249', packageName: 'Starter Package', shortDescription: '2 logo concepts, basic palette, 2 revisions', description: 'Starter Identity — small businesses launching a brand or refreshing their logo.', deliveryLabel: 'Shown during service selection', revisions: '2 revision rounds', includes: ['Brand discovery questionnaire', '2 initial logo concepts', '2 revision rounds', 'Primary logo', 'Basic color palette', 'Basic typography recommendations', 'PNG, JPG and transparent logo files'] },
        standard: { price: '$599', packageName: 'Standard Package', shortDescription: '3 logo concepts, secondary logo, typography system', description: 'Standard Identity — businesses that want a more developed brand identity.', deliveryLabel: 'Shown during service selection', revisions: '3 revision rounds', includes: ['Brand discovery', '3 initial logo concepts', 'Primary logo', 'Secondary logo variation', 'Icon/mark', 'Color palette', 'Typography system', 'Social profile assets', 'Basic brand guidelines', '3 revision rounds', 'Organized final files'] },
        premium: { price: '$1,299', packageName: 'Premium Package', shortDescription: '3 creative directions, complete brand guideline document', description: 'Premium Brand Identity — companies building a full professional brand identity.', deliveryLabel: 'Shown during service selection', revisions: 'Up to 3 revision rounds', includes: ['Brand strategy session', 'Competitive visual review', '3 refined creative directions', 'Primary and secondary logos', 'Brand mark', 'Color system', 'Typography system', 'Brand imagery direction', 'Social assets', 'Basic business-card/letterhead templates', 'Comprehensive brand guideline document', 'Up to 3 revision rounds', 'Complete final-file package'] }
      }
    },
    sampleProject: {
      projectName: "FreshStart Brand Identity Concept",
      businessType: "Startup business",
      projectSummary: "A complete brand identity concept created to help a new business look professional, memorable, and ready to enter the market.",
      servicesIncluded: ["Logo concept", "Color palette", "Font pairing", "Brand style direction", "Business card mock-up", "Social media profile branding"],
      portfolioCardText: "A brand identity concept built to give a startup a professional look, consistent visuals, and stronger market presence."
    }
  },
  'photography': {
    title: 'Photography & Visual Assets',
    category: 'Creative & Content',
    icon: <FaCamera />,
    intro: 'High-quality visual imagery plays a critical role in how businesses present themselves to customers.',
    description: 'Professional photography helps establish credibility, attract attention, and communicate the value of your products, services, and brand.',
    longDescription: 'Scale Link Alliance provides professional photography and visual asset services that give businesses professional images for use across websites, social media, marketing campaigns, and promotional materials.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.7, reviews: 156, ordersInQueue: 4, verified: true },
    whatItHelpsAchieve: ['present a professional brand image', 'showcase products and services visually', 'improve website and social media engagement', 'strengthen marketing campaigns', 'build a recognizable visual identity'],
    howMeasured: ['number of edited photos delivered', 'number of locations or scenes', 'level of editing and retouching', 'project scope or session length'],
    servicesInclude: ['Business and team photography', 'Product photography', 'Website imagery', 'Marketing visuals', 'Promotional image assets'],
    tools: ['Professional camera equipment', 'Adobe Lightroom', 'Adobe Photoshop'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'marketing materials using the photos' },
      { name: 'Website Development', reason: 'placing visuals on websites' },
      { name: 'Social Media Management', reason: 'posting branded content' },
      { name: 'Video Editing & Motion Graphics', reason: 'visual storytelling' },
      { name: 'Brand Identity & Logo Design', reason: 'complete visual branding' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$249', description: 'Small businesses needing essential visual content.', includes: ['Up to 1 hour on location', 'Up to 10 edited final photographs', 'Basic color correction', 'Web-resolution files', 'One local location'] },
      Standard: { name: 'Standard Package', price: '$599', description: 'Businesses creating marketing content.', includes: ['Up to 2.5 hours', 'Up to 30 edited photographs', 'Product/team/location combinations', 'Enhanced retouching', 'Web and high-resolution files', 'Basic shot planning'] },
      premium: { name: 'Premium Package', price: '$1,299', description: 'Brand campaigns and full marketing visuals.', includes: ['Up to half-day shoot', 'Up to 60 edited photographs', 'Pre-shoot planning', 'Multiple setups', 'Advanced retouching', 'Web and high-resolution files', 'Organized image library'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Up to 1 hour on location', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 10 edited final photographs', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic color correction', values: { basic: true, standard: true, premium: true } },
        { label: 'Web-resolution files', values: { basic: true, standard: true, premium: true } },
        { label: 'One local location', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 2.5 hours', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 30 edited photographs', values: { basic: false, standard: true, premium: true } },
        { label: 'Product/team/location combinations', values: { basic: false, standard: true, premium: true } },
        { label: 'Enhanced retouching', values: { basic: false, standard: true, premium: true } },
        { label: 'Web and high-resolution files', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic shot planning', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to half-day shoot', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 60 edited photographs', values: { basic: false, standard: false, premium: true } },
        { label: 'Pre-shoot planning', values: { basic: false, standard: false, premium: true } },
        { label: 'Multiple setups', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced retouching', values: { basic: false, standard: false, premium: true } },
        { label: 'Organized image library', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$249', packageName: 'Starter Package', shortDescription: 'Up to 1 hour on location, 10 edited photos', description: 'Small businesses needing essential visual content.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Up to 1 hour on location', 'Up to 10 edited final photographs', 'Basic color correction', 'Web-resolution files', 'One local location'] },
        standard: { price: '$599', packageName: 'Standard Package', shortDescription: 'Up to 2.5 hours, 30 edited photos, enhanced retouching', description: 'Businesses creating marketing content.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Up to 2.5 hours', 'Up to 30 edited photographs', 'Product/team/location combinations', 'Enhanced retouching', 'Web and high-resolution files', 'Basic shot planning'] },
        premium: { price: '$1,299', packageName: 'Premium Package', shortDescription: 'Up to half-day shoot, 60 edited photos, advanced retouching', description: 'Brand campaigns and full marketing visuals.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Up to half-day shoot', 'Up to 60 edited photographs', 'Pre-shoot planning', 'Multiple setups', 'Advanced retouching', 'Web and high-resolution files', 'Organized image library'] }
      }
    },
    sampleProject: {
      projectName: "ProductEdge Brand Photography",
      businessType: "E-commerce and retail brand",
      projectSummary: "A professional commercial photography concept designed to showcase products in high resolution, build brand authority, and increase online sales.",
      projectGoal: "Help the business present products with commercial-grade imagery that highlights quality and details.",
      servicesIncluded: ["Commercial product shots", "Lifestyle brand imagery", "High-resolution editing", "Color correction", "Social media formatting", "Lighting setup"],
      portfolioCardText: "A professional brand photography concept built to showcase products clearly, look premium, and elevate brand imagery."
    }
  },
  'website-development': {
    title: 'Website Development',
    category: 'Tech & Development',
    icon: <FaCode />,
    intro: 'Your website is often the first place potential customers learn about your business.',
    description: 'A well-designed website builds credibility, communicates your value clearly, and provides a platform where visitors can become customers.',
    longDescription: 'Scale Link Alliance develops modern, responsive websites designed to help businesses present their services professionally, capture leads, and support marketing efforts.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 156, ordersInQueue: 8, verified: true },
    whatItHelpsAchieve: ['establish an online presence', 'showcase services and products', 'capture leads and inquiries', 'support marketing campaigns', 'provide information to customers'],
    howMeasured: ['number of pages created', 'level of design customization', 'integrations required', 'additional functionality'],
    servicesInclude: ['Custom website design', 'Mobile-friendly layout', 'Basic SEO setup', 'Contact and lead capture forms', 'Website launch support'],
    tools: ['React', 'Node.js', 'WordPress', 'Webflow', 'HTML/CSS/JavaScript'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'website visuals and marketing materials' },
      { name: 'Copywriting & Content Creation', reason: 'website text and messaging' },
      { name: 'SEO & Search Marketing', reason: 'improve search visibility' },
      { name: 'Paid Advertising Management', reason: 'drive traffic to the website' },
      { name: 'Website Maintenance & Updates', reason: 'ongoing support' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$799', description: 'New businesses, local businesses, consultants, and companies needing a professional online presence.', includes: ['Up to 5 core website pages', 'Custom homepage design', 'Mobile and tablet responsive design', 'Contact form', 'Click-to-call and email functionality', 'Social media links', 'Basic on-page SEO setup', 'Page titles and meta descriptions', 'Basic image optimization', 'Google Analytics setup', 'Google Search Console setup', 'SSL configuration assistance', 'Basic speed optimization', 'One primary conversion CTA', 'Two revision rounds', 'Basic launch support'] },
      Standard: { name: 'Standard Package', price: '$1,799', description: 'Established businesses that want their website to actively support lead generation and marketing.', includes: ['Everything in Starter', 'Up to 10 pages', 'More customized page layouts', 'Blog or resource section', 'Up to 2 lead-generation forms', 'Thank-you page', 'CRM or email platform connection', 'Basic conversion tracking', 'Enhanced on-page SEO', 'Internal linking setup', 'XML sitemap configuration', 'Robots.txt configuration', 'Basic schema implementation where appropriate', 'Website analytics configuration', 'Basic lead funnel structure', 'Three revision rounds', 'CMS training session'] },
      premium: { name: 'Premium Package', price: '$3,999', description: 'Growing businesses requiring a larger, conversion-focused digital presence.', includes: ['Everything in Standard', 'Up to 20 pages', 'Custom UX/UI direction', 'Advanced page layouts', 'Conversion-focused page architecture', 'Multiple service or location pages', 'Up to 5 lead-generation forms', 'Advanced CRM/form integrations', 'Marketing automation connection', 'Advanced analytics and conversion tracking', 'Enhanced technical SEO setup', 'Custom website components', 'Resource/download functionality', 'Basic booking or scheduling integration', 'Advanced site navigation', 'Staging environment', 'Three revision rounds per major design phase', 'Team training', 'Post-launch review'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Up to 5 core website pages', values: { basic: true, standard: true, premium: true } },
        { label: 'Custom homepage design', values: { basic: true, standard: true, premium: true } },
        { label: 'Mobile and tablet responsive design', values: { basic: true, standard: true, premium: true } },
        { label: 'Contact form', values: { basic: true, standard: true, premium: true } },
        { label: 'Click-to-call and email functionality', values: { basic: true, standard: true, premium: true } },
        { label: 'Social media links', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic on-page SEO setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Page titles and meta descriptions', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic image optimization', values: { basic: true, standard: true, premium: true } },
        { label: 'Google Analytics setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Google Search Console setup', values: { basic: true, standard: true, premium: true } },
        { label: 'SSL configuration assistance', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic speed optimization', values: { basic: true, standard: true, premium: true } },
        { label: 'One primary conversion CTA', values: { basic: true, standard: true, premium: true } },
        { label: 'Two revision rounds', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic launch support', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 10 pages', values: { basic: false, standard: true, premium: true } },
        { label: 'More customized page layouts', values: { basic: false, standard: true, premium: true } },
        { label: 'Blog or resource section', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 2 lead-generation forms', values: { basic: false, standard: true, premium: true } },
        { label: 'Thank-you page', values: { basic: false, standard: true, premium: true } },
        { label: 'CRM or email platform connection', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic conversion tracking', values: { basic: false, standard: true, premium: true } },
        { label: 'Enhanced on-page SEO', values: { basic: false, standard: true, premium: true } },
        { label: 'Internal linking setup', values: { basic: false, standard: true, premium: true } },
        { label: 'XML sitemap configuration', values: { basic: false, standard: true, premium: true } },
        { label: 'Robots.txt configuration', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic schema implementation where appropriate', values: { basic: false, standard: true, premium: true } },
        { label: 'Website analytics configuration', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic lead funnel structure', values: { basic: false, standard: true, premium: true } },
        { label: 'Three revision rounds', values: { basic: false, standard: true, premium: true } },
        { label: 'CMS training session', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 20 pages', values: { basic: false, standard: false, premium: true } },
        { label: 'Custom UX/UI direction', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced page layouts', values: { basic: false, standard: false, premium: true } },
        { label: 'Conversion-focused page architecture', values: { basic: false, standard: false, premium: true } },
        { label: 'Multiple service or location pages', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 5 lead-generation forms', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced CRM/form integrations', values: { basic: false, standard: false, premium: true } },
        { label: 'Marketing automation connection', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced analytics and conversion tracking', values: { basic: false, standard: false, premium: true } },
        { label: 'Enhanced technical SEO setup', values: { basic: false, standard: false, premium: true } },
        { label: 'Custom website components', values: { basic: false, standard: false, premium: true } },
        { label: 'Resource/download functionality', values: { basic: false, standard: false, premium: true } },
        { label: 'Basic booking or scheduling integration', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced site navigation', values: { basic: false, standard: false, premium: true } },
        { label: 'Staging environment', values: { basic: false, standard: false, premium: true } },
        { label: 'Three revision rounds per major design phase', values: { basic: false, standard: false, premium: true } },
        { label: 'Team training', values: { basic: false, standard: false, premium: true } },
        { label: 'Post-launch review', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$799', packageName: 'Starter Package', shortDescription: 'Up to 5 pages, responsive design, contact form', description: 'New businesses, local businesses, consultants, and companies needing a professional online presence.', deliveryLabel: 'Shown during service selection', revisions: 'Two revision rounds', includes: ['Up to 5 core website pages', 'Custom homepage design', 'Mobile and tablet responsive design', 'Contact form', 'Click-to-call and email functionality', 'Social media links', 'Basic on-page SEO setup', 'Page titles and meta descriptions', 'Basic image optimization', 'Google Analytics setup', 'Google Search Console setup', 'SSL configuration assistance', 'Basic speed optimization', 'One primary conversion CTA', 'Two revision rounds', 'Basic launch support'] },
        standard: { price: '$1,799', packageName: 'Standard Package', shortDescription: 'Up to 10 pages, lead-generation forms, CMS training', description: 'Established businesses that want their website to actively support lead generation and marketing.', deliveryLabel: 'Shown during service selection', revisions: 'Three revision rounds', includes: ['Everything in Starter', 'Up to 10 pages', 'More customized page layouts', 'Blog or resource section', 'Up to 2 lead-generation forms', 'Thank-you page', 'CRM or email platform connection', 'Basic conversion tracking', 'Enhanced on-page SEO', 'Internal linking setup', 'XML sitemap configuration', 'Robots.txt configuration', 'Basic schema implementation where appropriate', 'Website analytics configuration', 'Basic lead funnel structure', 'Three revision rounds', 'CMS training session'] },
        premium: { price: '$3,999', packageName: 'Premium Package', shortDescription: 'Up to 20 pages, custom UX/UI, staging environment', description: 'Growing businesses requiring a larger, conversion-focused digital presence.', deliveryLabel: 'Shown during service selection', revisions: 'Three revision rounds per major design phase', includes: ['Everything in Standard', 'Up to 20 pages', 'Custom UX/UI direction', 'Advanced page layouts', 'Conversion-focused page architecture', 'Multiple service or location pages', 'Up to 5 lead-generation forms', 'Advanced CRM/form integrations', 'Marketing automation connection', 'Advanced analytics and conversion tracking', 'Enhanced technical SEO setup', 'Custom website components', 'Resource/download functionality', 'Basic booking or scheduling integration', 'Advanced site navigation', 'Staging environment', 'Three revision rounds per major design phase', 'Team training', 'Post-launch review'] }
      }
    },
    sampleProject: {
      projectName: "ContractorPro Website Redesign",
      businessType: "Home improvement contractor",
      projectSummary: "A professional contractor website concept designed to help visitors quickly understand services, view completed work, and request a quote.",
      servicesIncluded: ["Website design", "Service pages", "Contact form", "Mobile-friendly layout", "Homepage messaging", "Basic SEO structure"],
      portfolioCardText: "A clean contractor website concept built to improve trust, explain services clearly, and generate more quote requests."
    }
  },
  'landing-pages': {
    title: 'Landing Pages & Sales Funnels',
    category: 'Tech & Development',
    icon: <FaRocket />,
    intro: 'Landing pages and sales funnels are designed to turn visitors into leads and customers.',
    description: 'Unlike general websites, landing pages focus on a single goal—encouraging visitors to take action such as signing up, requesting a quote, or making a purchase.',
    longDescription: 'Scale Link Alliance develops high-converting landing pages and sales funnels that guide visitors through a structured process designed to improve conversions and generate measurable results.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.7, reviews: 89, ordersInQueue: 5, verified: true },
    whatItHelpsAchieve: ['generate leads', 'promote products or services', 'run marketing campaigns', 'capture email subscribers', 'guide visitors through a sales process'],
    howMeasured: ['number of pages designed', 'level of funnel complexity', 'integrations with marketing tools', 'optimization features'],
    servicesInclude: ['Conversion-focused landing page design', 'Lead capture forms', 'Marketing funnel integration', 'Analytics setup', 'Call-to-action optimization'],
    tools: ['Webflow', 'Unbounce', 'Instapage', 'WordPress', 'React'],
    complementaryServices: [
      { name: 'Copywriting & Content Creation', reason: 'persuasive messaging' },
      { name: 'Graphic Design', reason: 'visual campaign assets' },
      { name: 'Paid Advertising Management', reason: 'traffic generation' },
      { name: 'Email Marketing Campaigns', reason: 'lead nurturing' },
      { name: 'CRM & Marketing Automation', reason: 'lead tracking' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$399', description: 'Best for a single offer, campaign, lead magnet, consultation, or advertisement.', includes: ['1 custom landing page', 'Mobile responsive design', 'Lead capture form', 'Thank-you page', 'One primary CTA', 'Basic conversion tracking', 'Email/CRM form connection', 'Basic copy formatting', 'Two revision rounds'] },
      Standard: { name: 'Standard Package', price: '$899', description: 'Businesses running campaigns that need more than a single page.', includes: ['Up to 3 funnel pages', 'Landing page', 'Thank-you/confirmation page', 'Secondary conversion page', 'Lead form integration', 'CRM/email integration', 'Conversion tracking', 'Basic automation setup', 'Mobile optimization', 'A/B testing-ready structure', 'Up to 2 audience paths', 'Three revision rounds'] },
      premium: { name: 'Premium Package', price: '$1,999', description: 'Businesses building a complete customer-acquisition funnel.', includes: ['Up to 6 funnel pages', 'Custom conversion-focused design', 'Lead capture system', 'Booking or checkout integration', 'CRM integration', 'Up to 5 automated follow-up emails', 'Conversion tracking', 'Analytics setup', 'Basic funnel automation', 'Lead tagging/segmentation', 'Thank-you and next-step flows', 'A/B test configuration for one key page', 'Three revision rounds', 'Funnel walkthrough'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: '1 custom landing page', values: { basic: true, standard: true, premium: true } },
        { label: 'Mobile responsive design', values: { basic: true, standard: true, premium: true } },
        { label: 'Lead capture form', values: { basic: true, standard: true, premium: true } },
        { label: 'Thank-you page', values: { basic: true, standard: true, premium: true } },
        { label: 'One primary CTA', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic conversion tracking', values: { basic: true, standard: true, premium: true } },
        { label: 'Email/CRM form connection', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic copy formatting', values: { basic: true, standard: true, premium: true } },
        { label: 'Two revision rounds', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 3 funnel pages', values: { basic: false, standard: true, premium: true } },
        { label: 'Landing page', values: { basic: false, standard: true, premium: true } },
        { label: 'Thank-you/confirmation page', values: { basic: false, standard: true, premium: true } },
        { label: 'Secondary conversion page', values: { basic: false, standard: true, premium: true } },
        { label: 'Lead form integration', values: { basic: false, standard: true, premium: true } },
        { label: 'CRM/email integration', values: { basic: false, standard: true, premium: true } },
        { label: 'Conversion tracking', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic automation setup', values: { basic: false, standard: true, premium: true } },
        { label: 'Mobile optimization', values: { basic: false, standard: true, premium: true } },
        { label: 'A/B testing-ready structure', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 2 audience paths', values: { basic: false, standard: true, premium: true } },
        { label: 'Three revision rounds', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 6 funnel pages', values: { basic: false, standard: false, premium: true } },
        { label: 'Custom conversion-focused design', values: { basic: false, standard: false, premium: true } },
        { label: 'Lead capture system', values: { basic: false, standard: false, premium: true } },
        { label: 'Booking or checkout integration', values: { basic: false, standard: false, premium: true } },
        { label: 'CRM integration', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 5 automated follow-up emails', values: { basic: false, standard: false, premium: true } },
        { label: 'Analytics setup', values: { basic: false, standard: false, premium: true } },
        { label: 'Basic funnel automation', values: { basic: false, standard: false, premium: true } },
        { label: 'Lead tagging/segmentation', values: { basic: false, standard: false, premium: true } },
        { label: 'Thank-you and next-step flows', values: { basic: false, standard: false, premium: true } },
        { label: 'A/B test configuration for one key page', values: { basic: false, standard: false, premium: true } },
        { label: 'Funnel walkthrough', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$399', packageName: 'Starter Package', shortDescription: '1 landing page, lead capture form, mobile-responsive', description: 'Best for a single offer, campaign, lead magnet, consultation, or advertisement.', deliveryLabel: 'Shown during service selection', revisions: 'Two revision rounds', includes: ['1 custom landing page', 'Mobile responsive design', 'Lead capture form', 'Thank-you page', 'One primary CTA', 'Basic conversion tracking', 'Email/CRM form connection', 'Basic copy formatting', 'Two revision rounds'] },
        standard: { price: '$899', packageName: 'Standard Package', shortDescription: 'Up to 3 funnel pages, CRM/email integration', description: 'Businesses running campaigns that need more than a single page.', deliveryLabel: 'Shown during service selection', revisions: 'Three revision rounds', includes: ['Up to 3 funnel pages', 'Landing page', 'Thank-you/confirmation page', 'Secondary conversion page', 'Lead form integration', 'CRM/email integration', 'Conversion tracking', 'Basic automation setup', 'Mobile optimization', 'A/B testing-ready structure', 'Up to 2 audience paths', 'Three revision rounds'] },
        premium: { price: '$1,999', packageName: 'Premium Package', shortDescription: 'Up to 6 funnel pages, booking/checkout integration', description: 'Businesses building a complete customer-acquisition funnel.', deliveryLabel: 'Shown during service selection', revisions: 'Three revision rounds', includes: ['Up to 6 funnel pages', 'Custom conversion-focused design', 'Lead capture system', 'Booking or checkout integration', 'CRM integration', 'Up to 5 automated follow-up emails', 'Conversion tracking', 'Analytics setup', 'Basic funnel automation', 'Lead tagging/segmentation', 'Thank-you and next-step flows', 'A/B test configuration for one key page', 'Three revision rounds', 'Funnel walkthrough'] }
      }
    },
    sampleProject: {
      projectName: "QuoteFlow Landing Page",
      businessType: "Contractor / home service company",
      projectSummary: "A conversion-focused landing page concept designed to help a business collect quote requests and turn visitors into leads.",
      servicesIncluded: ["Hero section", "Service benefits", "Trust section", "Lead form", "Call-to-action buttons", "Mobile layout", "Simple SEO structure"],
      portfolioCardText: "A landing page concept built to capture leads, explain the offer quickly, and encourage visitors to request a quote."
    }
  },
  'ecommerce-development': {
    title: 'E-Commerce Development',
    category: 'Tech & Development',
    icon: <FaShoppingCart />,
    intro: 'E-commerce platforms allow businesses to sell products and services online, reach a broader audience, and manage transactions efficiently.',
    description: 'A professionally developed online store ensures customers can browse products easily, complete purchases securely, and return for future orders.',
    longDescription: 'Scale Link Alliance provides comprehensive e-commerce development services that help businesses launch and manage online stores designed for Standard, usability, and reliability.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.9, reviews: 93, ordersInQueue: 6, verified: true },
    whatItHelpsAchieve: ['sell products online', 'manage inventory and orders', 'accept secure payments', 'expand to new markets', 'automate order processing'],
    howMeasured: ['number of products added', 'number of store pages created', 'payment and shipping integrations', 'additional features and automation'],
    servicesInclude: ['Online store setup', 'Product page design', 'Payment gateway integration', 'Shopping cart configuration', 'Order management tools'],
    tools: ['Shopify', 'WooCommerce', 'BigCommerce', 'Magento'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'product images and promotional materials' },
      { name: 'Copywriting & Content Creation', reason: 'product descriptions' },
      { name: 'Photography & Visual Assets', reason: 'product photography' },
      { name: 'SEO & Search Marketing', reason: 'drive organic traffic' },
      { name: 'Paid Advertising Management', reason: 'increase sales through ads' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$1,199', description: 'Best for new or smaller online stores.', includes: ['Store setup', 'Up to 10 products', 'Up to 5 informational pages', 'Mobile responsive design', 'Product category setup', 'Shopping cart', 'Checkout configuration', 'One payment gateway', 'Basic shipping configuration', 'Basic tax settings', 'Order notification setup', 'Google Analytics', 'Basic SEO setup', 'Two revision rounds', 'Store management training'] },
      Standard: { name: 'Standard Package', price: '$2,999', description: 'Established businesses expanding online sales.', includes: ['Everything in Starter', 'Up to 50 products', 'Advanced product variations', 'Coupon/discount functionality', 'Abandoned-cart setup where supported', 'Email marketing integration', 'Enhanced analytics', 'Enhanced product SEO', 'Customer account functionality', 'Review functionality', 'Up to 2 payment gateways', 'Advanced shipping rules', 'Basic product-data import', 'Three revision rounds'] },
      premium: { name: 'Premium Package', price: '$5,999', description: 'Businesses requiring a more advanced commerce environment.', includes: ['Everything in Standard', 'Up to 150 initial products', 'Advanced product/category structure', 'Custom storefront components', 'Enhanced checkout configuration', 'Advanced conversion tracking', 'CRM integration', 'Advanced email automation', 'Subscription functionality where platform-supported', 'Multi-location or advanced inventory configuration where supported', 'Advanced shipping logic', 'Data migration assistance', 'Custom reporting configuration', 'Team training'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Store setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 10 products', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 5 informational pages', values: { basic: true, standard: true, premium: true } },
        { label: 'Mobile responsive design', values: { basic: true, standard: true, premium: true } },
        { label: 'Product category setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Shopping cart', values: { basic: true, standard: true, premium: true } },
        { label: 'Checkout configuration', values: { basic: true, standard: true, premium: true } },
        { label: 'One payment gateway', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic shipping configuration', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic tax settings', values: { basic: true, standard: true, premium: true } },
        { label: 'Order notification setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Google Analytics', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic SEO setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Two revision rounds', values: { basic: true, standard: true, premium: true } },
        { label: 'Store management training', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 50 products', values: { basic: false, standard: true, premium: true } },
        { label: 'Advanced product variations', values: { basic: false, standard: true, premium: true } },
        { label: 'Coupon/discount functionality', values: { basic: false, standard: true, premium: true } },
        { label: 'Abandoned-cart setup where supported', values: { basic: false, standard: true, premium: true } },
        { label: 'Email marketing integration', values: { basic: false, standard: true, premium: true } },
        { label: 'Enhanced analytics', values: { basic: false, standard: true, premium: true } },
        { label: 'Enhanced product SEO', values: { basic: false, standard: true, premium: true } },
        { label: 'Customer account functionality', values: { basic: false, standard: true, premium: true } },
        { label: 'Review functionality', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 2 payment gateways', values: { basic: false, standard: true, premium: true } },
        { label: 'Advanced shipping rules', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic product-data import', values: { basic: false, standard: true, premium: true } },
        { label: 'Three revision rounds', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 150 initial products', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced product/category structure', values: { basic: false, standard: false, premium: true } },
        { label: 'Custom storefront components', values: { basic: false, standard: false, premium: true } },
        { label: 'Enhanced checkout configuration', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced conversion tracking', values: { basic: false, standard: false, premium: true } },
        { label: 'CRM integration', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced email automation', values: { basic: false, standard: false, premium: true } },
        { label: 'Subscription functionality where platform-supported', values: { basic: false, standard: false, premium: true } },
        { label: 'Multi-location or advanced inventory configuration where supported', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced shipping logic', values: { basic: false, standard: false, premium: true } },
        { label: 'Data migration assistance', values: { basic: false, standard: false, premium: true } },
        { label: 'Custom reporting configuration', values: { basic: false, standard: false, premium: true } },
        { label: 'Team training', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$1,199', packageName: 'Starter Package', shortDescription: 'Store setup with up to 10 products', description: 'Best for new or smaller online stores.', deliveryLabel: 'Shown during service selection', revisions: 'Two revision rounds', includes: ['Store setup', 'Up to 10 products', 'Up to 5 informational pages', 'Mobile responsive design', 'Product category setup', 'Shopping cart', 'Checkout configuration', 'One payment gateway', 'Basic shipping configuration', 'Basic tax settings', 'Order notification setup', 'Google Analytics', 'Basic SEO setup', 'Two revision rounds', 'Store management training'] },
        standard: { price: '$2,999', packageName: 'Standard Package', shortDescription: 'Store with up to 50 products, coupons, customer accounts', description: 'Established businesses expanding online sales.', deliveryLabel: 'Shown during service selection', revisions: 'Three revision rounds', includes: ['Everything in Starter', 'Up to 50 products', 'Advanced product variations', 'Coupon/discount functionality', 'Abandoned-cart setup where supported', 'Email marketing integration', 'Enhanced analytics', 'Enhanced product SEO', 'Customer account functionality', 'Review functionality', 'Up to 2 payment gateways', 'Advanced shipping rules', 'Basic product-data import', 'Three revision rounds'] },
        premium: { price: '$5,999', packageName: 'Premium Package', shortDescription: 'Store with up to 150 products, custom storefront, CRM', description: 'Businesses requiring a more advanced commerce environment.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Everything in Standard', 'Up to 150 initial products', 'Advanced product/category structure', 'Custom storefront components', 'Enhanced checkout configuration', 'Advanced conversion tracking', 'CRM integration', 'Advanced email automation', 'Subscription functionality where platform-supported', 'Multi-location or advanced inventory configuration where supported', 'Advanced shipping logic', 'Data migration assistance', 'Custom reporting configuration', 'Team training'] }
      }
    },
    sampleProject: {
      projectName: "UrbanStyle Online Store",
      businessType: "Fashion and lifestyle brand",
      projectSummary: "A modern e-commerce store concept designed to help customers browse products, trust the brand, and complete purchases smoothly.",
      servicesIncluded: ["Product pages", "Homepage banner", "Cart layout", "Checkout flow", "Mobile store design", "Product category structure"],
      portfolioCardText: "A stylish online store concept built for product discovery, smooth checkout, and stronger online sales."
    }
  },
  'web-applications': {
    title: 'Web Applications & SaaS Development',
    category: 'Tech & Development',
    icon: <FaGlobe />,
    intro: 'Custom web applications and Software-as-a-Service (SaaS) platforms allow businesses to streamline operations, automate workflows, and create digital tools that support Standard.',
    description: 'Unlike standard websites, web applications provide interactive functionality such as dashboards, user accounts, data management systems, and automation tools.',
    longDescription: 'Scale Link Alliance develops scalable web applications and SaaS solutions tailored to the specific operational needs of businesses, helping organizations improve efficiency and deliver digital services to their customers.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 67, ordersInQueue: 3, verified: true },
    whatItHelpsAchieve: ['internal business management systems', 'client portals and dashboards', 'workflow automation tools', 'subscription-based software platforms', 'online booking and scheduling systems', 'data management platforms'],
    howMeasured: ['number of application features or modules', 'complexity of functionality', 'integrations required', 'database architecture and scalability'],
    servicesInclude: ['Custom web application development', 'SaaS platform development', 'System integrations', 'Workflow automation tools', 'Database integration'],
    tools: ['React', 'Node.js', 'Python', 'Django', 'Ruby on Rails', 'PostgreSQL'],
    complementaryServices: [
      { name: 'API Integration & Automation', reason: 'connect systems' },
      { name: 'Website Development', reason: 'public-facing platform' },
      { name: 'UI/UX Graphic Design', reason: 'interface visuals' },
      { name: 'Data Analytics & Reporting', reason: 'application insights' },
      { name: 'Website Maintenance & Updates', reason: 'ongoing technical support' }
    ],
    packages: {
      starter: { name: 'Starter MVP', price: '$4,999', description: 'Best for validating a focused software concept.', includes: ['Requirements workshop', 'Basic product architecture', 'User authentication', '1 primary user role', 'Up to 5 core application screens', 'Database setup', 'Basic admin functionality', '1 third-party integration', 'Responsive interface', 'Testing', 'Deployment assistance', 'Basic technical documentation'] },
      Standard: { name: 'Standard Application', price: '$11,999', description: 'Businesses building more advanced digital systems.', includes: ['Product planning', 'Up to 15 core screens', 'Up to 2 user roles', 'Advanced database structure', 'Admin dashboard', 'Up to 3 integrations', 'Notification functionality', 'User-account management', 'Responsive application', 'QA testing', 'Deployment', 'Documentation', 'Team handoff'] },
      premium: { name: 'Premium SaaS / Custom Platform', price: '$24,999', description: 'Best for larger custom software platforms — final pricing established after technical discovery.', includes: ['Complex product architecture', 'Multiple user roles', 'Subscription/billing systems', 'Custom dashboards', 'Advanced database architecture', 'API integrations', 'Automated workflows', 'Role-based permissions', 'Reporting', 'Notifications', 'Staging/production environments', 'Advanced QA', 'Deployment', 'Technical documentation', 'Post-launch support'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Requirements workshop', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic product architecture', values: { basic: true, standard: true, premium: true } },
        { label: 'User authentication', values: { basic: true, standard: true, premium: true } },
        { label: '1 primary user role', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 5 core application screens', values: { basic: true, standard: true, premium: true } },
        { label: 'Database setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic admin functionality', values: { basic: true, standard: true, premium: true } },
        { label: '1 third-party integration', values: { basic: true, standard: true, premium: true } },
        { label: 'Responsive interface', values: { basic: true, standard: true, premium: true } },
        { label: 'Testing', values: { basic: true, standard: true, premium: true } },
        { label: 'Deployment assistance', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic technical documentation', values: { basic: true, standard: true, premium: true } },
        { label: 'Product planning', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 15 core screens', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 2 user roles', values: { basic: false, standard: true, premium: true } },
        { label: 'Advanced database structure', values: { basic: false, standard: true, premium: true } },
        { label: 'Admin dashboard', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 3 integrations', values: { basic: false, standard: true, premium: true } },
        { label: 'Notification functionality', values: { basic: false, standard: true, premium: true } },
        { label: 'User-account management', values: { basic: false, standard: true, premium: true } },
        { label: 'Responsive application', values: { basic: false, standard: true, premium: true } },
        { label: 'QA testing', values: { basic: false, standard: true, premium: true } },
        { label: 'Deployment', values: { basic: false, standard: true, premium: true } },
        { label: 'Documentation', values: { basic: false, standard: true, premium: true } },
        { label: 'Team handoff', values: { basic: false, standard: true, premium: true } },
        { label: 'Complex product architecture', values: { basic: false, standard: false, premium: true } },
        { label: 'Multiple user roles', values: { basic: false, standard: false, premium: true } },
        { label: 'Subscription/billing systems', values: { basic: false, standard: false, premium: true } },
        { label: 'Custom dashboards', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced database architecture', values: { basic: false, standard: false, premium: true } },
        { label: 'API integrations', values: { basic: false, standard: false, premium: true } },
        { label: 'Automated workflows', values: { basic: false, standard: false, premium: true } },
        { label: 'Role-based permissions', values: { basic: false, standard: false, premium: true } },
        { label: 'Reporting', values: { basic: false, standard: false, premium: true } },
        { label: 'Notifications', values: { basic: false, standard: false, premium: true } },
        { label: 'Staging/production environments', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced QA', values: { basic: false, standard: false, premium: true } },
        { label: 'Technical documentation', values: { basic: false, standard: false, premium: true } },
        { label: 'Post-launch support', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$4,999', packageName: 'Starter MVP', shortDescription: '1 user role, up to 5 core screens, database setup', description: 'Best for validating a focused software concept.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Requirements workshop', 'Basic product architecture', 'User authentication', '1 primary user role', 'Up to 5 core application screens', 'Database setup', 'Basic admin functionality', '1 third-party integration', 'Responsive interface', 'Testing', 'Deployment assistance', 'Basic technical documentation'] },
        standard: { price: '$11,999', packageName: 'Standard Application', shortDescription: 'Up to 15 core screens, up to 2 user roles, admin dashboard', description: 'Businesses building more advanced digital systems.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Product planning', 'Up to 15 core screens', 'Up to 2 user roles', 'Advanced database structure', 'Admin dashboard', 'Up to 3 integrations', 'Notification functionality', 'User-account management', 'Responsive application', 'QA testing', 'Deployment', 'Documentation', 'Team handoff'] },
        premium: { price: '$24,999', packageName: 'Premium SaaS / Custom Platform', shortDescription: 'Complex architecture, multiple user roles, billing systems', description: 'Best for larger custom software platforms — final pricing established after technical discovery.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Complex product architecture', 'Multiple user roles', 'Subscription/billing systems', 'Custom dashboards', 'Advanced database architecture', 'API integrations', 'Automated workflows', 'Role-based permissions', 'Reporting', 'Notifications', 'Staging/production environments', 'Advanced QA', 'Deployment', 'Technical documentation', 'Post-launch support'] }
      }
    },
    sampleProject: {
      projectName: "ServiceHub Client Dashboard",
      businessType: "Business service company",
      projectSummary: "A custom web application concept that helps a business manage clients, projects, reports, appointments, and internal tasks from one dashboard.",
      servicesIncluded: ["Dashboard design", "Client management", "Project tracking", "Analytics cards", "Calendar view", "Reports", "User interface planning"],
      portfolioCardText: "A business dashboard concept built to organize clients, projects, reports, and daily operations in one place."
    }
  },
  'api-integration': {
    title: 'API Integration & Automation',
    category: 'Tech & Development',
    icon: <FaCloudUploadAlt />,
    intro: 'Modern businesses rely on multiple digital tools such as CRMs, marketing platforms, accounting software, and websites.',
    description: 'When systems do not communicate with each other, businesses often spend valuable time manually transferring information between platforms.',
    longDescription: 'Scale Link Alliance provides API integration and automation services that connect your systems and automate repetitive workflows. These integrations improve efficiency, reduce manual work, and ensure that data flows seamlessly across your business tools.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.7, reviews: 54, ordersInQueue: 4, verified: true },
    whatItHelpsAchieve: ['connect software platforms and business systems', 'reduce manual data entry and repetitive tasks', 'improve workflow efficiency', 'ensure accurate data synchronization', 'streamline operations and communication between tools'],
    howMeasured: ['number of systems integrated', 'number of automated workflows', 'complexity of data mapping', 'customization requirements'],
    servicesInclude: ['System integrations', 'Data synchronization', 'Workflow automation', 'API configuration', 'Integration troubleshooting'],
    tools: ['Zapier', 'Make', 'n8n', 'Custom APIs', 'REST', 'GraphQL'],
    complementaryServices: [
      { name: 'CRM & Marketing Automation', reason: 'lead management systems' },
      { name: 'Web Applications & SaaS Development', reason: 'custom digital tools' },
      { name: 'Data Analytics & Reporting', reason: 'analyze integrated data' },
      { name: 'Website Development', reason: 'connect websites with systems' },
      { name: 'Process Documentation & SOP Development', reason: 'document workflows' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$499', description: 'Starter Integration.', includes: ['1 straightforward system integration', 'Up to 2 API endpoints/actions', 'Authentication configuration', 'Basic data mapping', 'Testing', 'Basic error handling', 'Documentation'] },
      Standard: { name: 'Standard Package', price: '$1,299', description: 'Standard Integration.', includes: ['Integration of up to 2 systems', 'Up to 6 endpoints/actions', 'Advanced data mapping', 'Workflow logic', 'Error logging', 'Testing environment', 'Documentation', 'Deployment assistance'] },
      premium: { name: 'Premium Package', price: '$3,499', description: 'Premium Integration.', includes: ['Up to 3 interconnected systems', 'Up to 15 endpoints/actions', 'Complex workflow logic', 'Data transformations', 'Authentication/security configuration', 'Error handling and logging', 'Testing', 'Deployment support', 'Technical documentation', 'Post-launch review'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: '1 straightforward system integration', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 2 API endpoints/actions', values: { basic: true, standard: true, premium: true } },
        { label: 'Authentication configuration', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic data mapping', values: { basic: true, standard: true, premium: true } },
        { label: 'Testing', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic error handling', values: { basic: true, standard: true, premium: true } },
        { label: 'Documentation', values: { basic: true, standard: true, premium: true } },
        { label: 'Integration of up to 2 systems', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 6 endpoints/actions', values: { basic: false, standard: true, premium: true } },
        { label: 'Advanced data mapping', values: { basic: false, standard: true, premium: true } },
        { label: 'Workflow logic', values: { basic: false, standard: true, premium: true } },
        { label: 'Error logging', values: { basic: false, standard: true, premium: true } },
        { label: 'Testing environment', values: { basic: false, standard: true, premium: true } },
        { label: 'Deployment assistance', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 3 interconnected systems', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 15 endpoints/actions', values: { basic: false, standard: false, premium: true } },
        { label: 'Complex workflow logic', values: { basic: false, standard: false, premium: true } },
        { label: 'Data transformations', values: { basic: false, standard: false, premium: true } },
        { label: 'Authentication/security configuration', values: { basic: false, standard: false, premium: true } },
        { label: 'Error handling and logging', values: { basic: false, standard: false, premium: true } },
        { label: 'Deployment support', values: { basic: false, standard: false, premium: true } },
        { label: 'Technical documentation', values: { basic: false, standard: false, premium: true } },
        { label: 'Post-launch review', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$499', packageName: 'Starter Package', shortDescription: '1 system integration, basic data mapping', description: 'Starter Integration.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['1 straightforward system integration', 'Up to 2 API endpoints/actions', 'Authentication configuration', 'Basic data mapping', 'Testing', 'Basic error handling', 'Documentation'] },
        standard: { price: '$1,299', packageName: 'Standard Package', shortDescription: 'Up to 2 systems, up to 6 endpoints, workflow logic', description: 'Standard Integration.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Integration of up to 2 systems', 'Up to 6 endpoints/actions', 'Advanced data mapping', 'Workflow logic', 'Error logging', 'Testing environment', 'Documentation', 'Deployment assistance'] },
        premium: { price: '$3,499', packageName: 'Premium Package', shortDescription: 'Up to 3 systems, up to 15 endpoints, complex logic', description: 'Premium Integration.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Up to 3 interconnected systems', 'Up to 15 endpoints/actions', 'Complex workflow logic', 'Data transformations', 'Authentication/security configuration', 'Error handling and logging', 'Testing', 'Deployment support', 'Technical documentation', 'Post-launch review'] }
      }
    },
    sampleProject: {
      projectName: "SyncFlow Business Integration",
      businessType: "E-commerce and service business",
      projectSummary: "An API integration concept designed to connect business tools so customer data, orders, forms, payments, and reports move smoothly between systems.",
      servicesIncluded: ["CRM integration", "Payment connection", "Email platform connection", "Website form automation", "Reporting sync", "Workflow mapping"],
      portfolioCardText: "An integration concept built to connect business tools, reduce manual work, and improve daily operations."
    }
  },
  'website-maintenance': {
    title: 'Website Maintenance & Updates',
    category: 'Tech & Development',
    icon: <FaShieldAlt />,
    intro: 'A website requires regular updates, monitoring, and maintenance to remain secure, functional, and effective.',
    description: 'Without ongoing maintenance, websites can experience technical issues, outdated content, security vulnerabilities, and reduced performance.',
    longDescription: 'Scale Link Alliance provides comprehensive website maintenance and update services that help businesses keep their websites secure, updated, and operating smoothly while ensuring the site continues to support marketing and customer engagement efforts.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 112, ordersInQueue: 7, verified: true },
    whatItHelpsAchieve: ['keep website secure and up to date', 'fix technical issues quickly', 'update website content when needed', 'maintain website performance', 'ensure site continues supporting marketing efforts'],
    howMeasured: ['number of maintenance hours per month', 'complexity of updates', 'level of monitoring required', 'additional technical support requests'],
    servicesInclude: ['Website updates and patches', 'Security monitoring', 'Performance checks', 'Content updates', 'Technical support'],
    tools: ['WordPress', 'React', 'Node.js', 'PHP', 'Security plugins'],
    complementaryServices: [
      { name: 'Website Development', reason: 'new features or redesigns' },
      { name: 'SEO & Search Marketing', reason: 'improve search visibility' },
      { name: 'Graphic Design', reason: 'update visuals and marketing assets' },
      { name: 'Copywriting & Content Creation', reason: 'website content updates' },
      { name: 'Data Analytics & Reporting', reason: 'monitor website performance' }
    ],
    packages: {
      starter: { name: 'Starter Care', price: '$149/month', description: 'Up to 2 hours of website work per month.', includes: ['Up to 2 hours of website work per month', 'Core/plugin updates where applicable', 'Basic backup monitoring', 'Basic uptime checks', 'Minor content edits', 'Basic technical health review', 'Monthly maintenance summary'] },
      Standard: { name: 'Standard Care', price: '$349/month', description: 'Up to 5 support hours per month.', includes: ['Up to 5 support hours per month', 'Updates', 'Backup monitoring', 'Uptime monitoring', 'Content changes', 'Minor design adjustments', 'Basic speed review', 'Form/function testing', 'Priority support', 'Monthly maintenance report'] },
      premium: { name: 'Premium Care', price: '$799/month', description: 'Up to 10 support hours per month.', includes: ['Up to 10 support hours per month', 'Everything in Standard', 'Priority issue handling', 'Regular site health review', 'Conversion-form testing', 'Analytics review', 'Minor page creation', 'Minor development work', 'Monthly strategy recommendations'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Up to 2 hours of website work per month', values: { basic: true, standard: true, premium: true } },
        { label: 'Core/plugin updates where applicable', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic backup monitoring', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic uptime checks', values: { basic: true, standard: true, premium: true } },
        { label: 'Minor content edits', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic technical health review', values: { basic: true, standard: true, premium: true } },
        { label: 'Monthly maintenance summary', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 5 support hours per month', values: { basic: false, standard: true, premium: true } },
        { label: 'Updates', values: { basic: false, standard: true, premium: true } },
        { label: 'Backup monitoring', values: { basic: false, standard: true, premium: true } },
        { label: 'Uptime monitoring', values: { basic: false, standard: true, premium: true } },
        { label: 'Content changes', values: { basic: false, standard: true, premium: true } },
        { label: 'Minor design adjustments', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic speed review', values: { basic: false, standard: true, premium: true } },
        { label: 'Form/function testing', values: { basic: false, standard: true, premium: true } },
        { label: 'Priority support', values: { basic: false, standard: true, premium: true } },
        { label: 'Monthly maintenance report', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 10 support hours per month', values: { basic: false, standard: false, premium: true } },
        { label: 'Priority issue handling', values: { basic: false, standard: false, premium: true } },
        { label: 'Regular site health review', values: { basic: false, standard: false, premium: true } },
        { label: 'Conversion-form testing', values: { basic: false, standard: false, premium: true } },
        { label: 'Analytics review', values: { basic: false, standard: false, premium: true } },
        { label: 'Minor page creation', values: { basic: false, standard: false, premium: true } },
        { label: 'Minor development work', values: { basic: false, standard: false, premium: true } },
        { label: 'Monthly strategy recommendations', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$149/month', packageName: 'Starter Care', shortDescription: 'Up to 2 hours maintenance, basic monitoring', description: 'Up to 2 hours of website work per month.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 2 hours of website work per month', 'Core/plugin updates where applicable', 'Basic backup monitoring', 'Basic uptime checks', 'Minor content edits', 'Basic technical health review', 'Monthly maintenance summary'] },
        standard: { price: '$349/month', packageName: 'Standard Care', shortDescription: 'Up to 5 hours maintenance, content updates', description: 'Up to 5 support hours per month.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 5 support hours per month', 'Updates', 'Backup monitoring', 'Uptime monitoring', 'Content changes', 'Minor design adjustments', 'Basic speed review', 'Form/function testing', 'Priority support', 'Monthly maintenance report'] },
        premium: { price: '$799/month', packageName: 'Premium Care', shortDescription: 'Up to 10 hours maintenance, priority support', description: 'Up to 10 support hours per month.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 10 support hours per month', 'Everything in Standard', 'Priority issue handling', 'Regular site health review', 'Conversion-form testing', 'Analytics review', 'Minor page creation', 'Minor development work', 'Monthly strategy recommendations'] }
      }
    },
    sampleProject: {
      projectName: "SiteCare Website Support Plan",
      businessType: "Local service business",
      projectSummary: "A website maintenance concept designed to help a business keep its website updated, secure, professional, and working properly as the business grows.",
      projectGoal: "Help the business avoid outdated content, broken links, poor performance, and missed customer opportunities by keeping the website active and maintained.",
      servicesIncluded: ["Website updates", "Content edits", "Plugin/theme updates", "Page adjustments", "Image updates", "Basic performance checks", "Broken link checks", "Contact form testing", "Monthly website review"],
      portfolioCardText: "A website maintenance concept built to keep a business website updated, professional, secure, and ready for customers."
    }
  },
  'online-booking-systems': {
    title: 'Online Booking Systems',
    category: 'Tech & Development',
    icon: <FaCalendar />,
    intro: 'Online booking systems allow customers to schedule appointments, services, or reservations directly through your website.',
    description: 'A professional booking system reduces administrative work, eliminates phone tag, and provides a seamless experience for your customers.',
    longDescription: 'Scale Link Alliance develops custom online booking systems that integrate with your website, calendar, and customer management tools to streamline appointment scheduling and reservations.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.7, reviews: 45, ordersInQueue: 3, verified: true },
    whatItHelpsAchieve: ['streamline appointment scheduling', 'reduce administrative workload', 'improve customer experience', 'eliminate phone tag', 'automate reminders and follow-ups'],
    howMeasured: ['number of booking slots', 'integration complexity', 'customization level', 'automation features'],
    servicesInclude: ['Online booking system setup', 'Calendar integration', 'Email notifications', 'Mobile-friendly booking form', 'Basic customization'],
    tools: ['Calendly API', 'Google Calendar', 'Outlook', 'Zapier', 'Custom booking systems'],
    complementaryServices: [
      { name: 'Website Development', reason: 'integrate booking on your site' },
      { name: 'CRM & Marketing Automation', reason: 'manage customer data' },
      { name: 'Email Marketing Campaigns', reason: 'follow-up with customers' },
      { name: 'Virtual Assistant Services', reason: 'manage bookings' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$399', description: 'Ideal for businesses needing a simple booking system.', includes: ['Online booking system setup', 'Calendar integration', 'Email notifications', 'Mobile-friendly booking form', 'Basic customization'] },
      Standard: { name: 'Standard Package', price: '$999', description: 'Ideal for businesses with multiple services or staff.', includes: ['Advanced booking system', 'Multiple service/slot configurations', 'Automated reminders', 'Payment integration', 'Customizable booking form'] },
      premium: { name: 'Premium Package', price: '$1,999', description: 'Ideal for businesses needing full booking automation.', includes: ['Full booking automation system', 'Multi-location support', 'Advanced notifications', 'CRM integration', 'Reporting and analytics'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Calendar integration', values: { basic: true, standard: true, premium: true } },
        { label: 'Email notifications', values: { basic: true, standard: true, premium: true } },
        { label: 'Mobile-friendly booking form', values: { basic: true, standard: true, premium: true } },
        { label: 'Automated reminders', values: { basic: false, standard: true, premium: true } },
        { label: 'Payment integration', values: { basic: false, standard: true, premium: true } },
        { label: 'Multi-location support', values: { basic: false, standard: false, premium: true } },
        { label: 'CRM integration', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$399', packageName: 'Starter Package', shortDescription: 'Simple booking system setup', description: 'Ideal for businesses needing a simple booking system.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Online booking system setup', 'Calendar integration', 'Email notifications', 'Mobile-friendly booking form', 'Basic customization'] },
        standard: { price: '$999', packageName: 'Standard Package', shortDescription: 'Advanced booking with multiple services', description: 'Ideal for businesses with multiple services or staff.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Advanced booking system', 'Multiple service/slot configurations', 'Automated reminders', 'Payment integration', 'Customizable booking form'] },
        premium: { price: '$1,999', packageName: 'Premium Package', shortDescription: 'Full booking automation system', description: 'Ideal for businesses needing full booking automation.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Full booking automation system', 'Multi-location support', 'Advanced notifications', 'CRM integration', 'Reporting and analytics'] }
      }
    },
    sampleProject: {
      projectName: "BookFlow Appointment System",
      businessType: "Service-based business",
      projectSummary: "A custom online booking system designed to help a business manage appointments, send reminders, and streamline customer scheduling.",
      servicesIncluded: ["Booking calendar", "Email/SMS reminders", "Service selection", "Staff assignment", "Payment integration", "Customer management"],
      portfolioCardText: "An online booking concept built to streamline scheduling, reduce no-shows, and improve customer experience."
    }
  },
  'social-media-management': {
    title: 'Social Media Management',
    category: 'Marketing & Standard',
    icon: <FaUsers />,
    intro: 'Social media platforms have become one of the most effective ways for businesses to connect with customers, promote services, and build brand awareness.',
    description: 'Maintaining a consistent and professional social media presence requires planning, content creation, and regular engagement.',
    longDescription: 'Scale Link Alliance provides comprehensive social media management services that help businesses maintain an active online presence, share valuable content, and connect with their audience in a professional and strategic way.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 203, ordersInQueue: 6, verified: true },
    whatItHelpsAchieve: ['increase brand visibility and awareness', 'engage with customers and followers', 'promote products and services', 'maintain a consistent content presence', 'support marketing and promotional campaigns'],
    howMeasured: ['number of posts created and published', 'engagement monitoring activities', 'platforms managed', 'performance reporting'],
    servicesInclude: ['Content posting and scheduling', 'Social media graphics', 'Audience engagement', 'Performance insights', 'Caption writing'],
    tools: ['Buffer', 'Hootsuite', 'Later', 'Sprout Social', 'Canva'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'visual social media content' },
      { name: 'Video Editing & Motion Graphics', reason: 'short-form video posts' },
      { name: 'Copywriting & Content Creation', reason: 'captions and messaging' },
      { name: 'Paid Advertising Management', reason: 'social media ads' },
      { name: 'Photography & Visual Assets', reason: 'content imagery' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$349/month', description: 'Businesses that need a consistent presence.', includes: ['1 social platform', 'Up to 8 feed posts per month', 'Caption writing', 'Basic graphic creation', 'Hashtag/topic research where relevant', 'Content scheduling', 'Monthly content calendar', 'Basic monthly report', 'One revision round on the monthly content batch'] },
      Standard: { name: 'Standard Package', price: '$699/month', description: 'Standard tier social media management.', includes: ['Up to 2 platforms', 'Up to 16 feed posts per month', 'Up to 4 short-form videos/reels using provided or existing footage', 'Caption writing', 'Graphic design', 'Monthly content calendar', 'Scheduling', 'Basic community-response support', 'Monthly analytics', 'Monthly strategy review'] },
      premium: { name: 'Premium Package', price: '$1,499/month', description: 'Premium tier social media management.', includes: ['Up to 3 platforms', 'Up to 24 feed posts per month', 'Up to 8 short-form videos', 'Content calendar', 'Graphic design', 'Caption/copy development', 'Scheduling', 'Basic weekday community management', 'Social listening', 'Monthly campaign planning', 'Performance reporting', 'Monthly strategy call', 'Ongoing optimization'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: '1 social platform', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 8 feed posts per month', values: { basic: true, standard: true, premium: true } },
        { label: 'Caption writing', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic graphic creation', values: { basic: true, standard: true, premium: true } },
        { label: 'Hashtag/topic research where relevant', values: { basic: true, standard: true, premium: true } },
        { label: 'Content scheduling', values: { basic: true, standard: true, premium: true } },
        { label: 'Monthly content calendar', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic monthly report', values: { basic: true, standard: true, premium: true } },
        { label: 'One revision round on the monthly content batch', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 2 platforms', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 16 feed posts per month', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 4 short-form videos/reels using provided or existing footage', values: { basic: false, standard: true, premium: true } },
        { label: 'Graphic design', values: { basic: false, standard: true, premium: true } },
        { label: 'Scheduling', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic community-response support', values: { basic: false, standard: true, premium: true } },
        { label: 'Monthly analytics', values: { basic: false, standard: true, premium: true } },
        { label: 'Monthly strategy review', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 3 platforms', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 24 feed posts per month', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 8 short-form videos', values: { basic: false, standard: false, premium: true } },
        { label: 'Content calendar', values: { basic: false, standard: false, premium: true } },
        { label: 'Caption/copy development', values: { basic: false, standard: false, premium: true } },
        { label: 'Basic weekday community management', values: { basic: false, standard: false, premium: true } },
        { label: 'Social listening', values: { basic: false, standard: false, premium: true } },
        { label: 'Monthly campaign planning', values: { basic: false, standard: false, premium: true } },
        { label: 'Performance reporting', values: { basic: false, standard: false, premium: true } },
        { label: 'Monthly strategy call', values: { basic: false, standard: false, premium: true } },
        { label: 'Ongoing optimization', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$349/month', packageName: 'Starter Package', shortDescription: '1 platform, 8 posts/month, content scheduling', description: 'Businesses that need a consistent presence.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['1 social platform', 'Up to 8 feed posts per month', 'Caption writing', 'Basic graphic creation', 'Hashtag/topic research where relevant', 'Content scheduling', 'Monthly content calendar', 'Basic monthly report', 'One revision round on the monthly content batch'] },
        standard: { price: '$699/month', packageName: 'Standard Package', shortDescription: '2 platforms, 16 posts/month, short-form videos', description: 'Standard tier social media management.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 2 platforms', 'Up to 16 feed posts per month', 'Up to 4 short-form videos/reels using provided or existing footage', 'Caption writing', 'Graphic design', 'Monthly content calendar', 'Scheduling', 'Basic community-response support', 'Monthly analytics', 'Monthly strategy review'] },
        premium: { price: '$1,499/month', packageName: 'Premium Package', shortDescription: '3 platforms, 24 posts/month, community management', description: 'Premium tier social media management.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 3 platforms', 'Up to 24 feed posts per month', 'Up to 8 short-form videos', 'Content calendar', 'Graphic design', 'Caption/copy development', 'Scheduling', 'Basic weekday community management', 'Social listening', 'Monthly campaign planning', 'Performance reporting', 'Monthly strategy call', 'Ongoing optimization'] }
      }
    },
    sampleProject: {
      projectName: "BrandLift Social Campaign",
      businessType: "Beauty and wellness brand",
      projectSummary: "A social media management concept focused on improving brand consistency, engagement, and visibility across social platforms.",
      servicesIncluded: ["Content calendar", "Branded post templates", "Caption writing", "Campaign planning", "Platform optimization", "Performance tracking"],
      portfolioCardText: "A social media campaign concept built to strengthen brand presence, improve consistency, and increase engagement."
    }
  },
  'seo-marketing': {
    title: 'SEO & Search Marketing',
    category: 'Marketing & Standard',
    icon: <FaSearch />,
    intro: 'Search Engine Optimization helps your business appear when potential customers search online for services or products related to your industry.',
    description: 'Effective SEO improves your website visibility in search engines, attracts targeted traffic, and supports long-term Standard.',
    longDescription: 'Scale Link Alliance provides professional SEO and search marketing services designed to strengthen your online presence, optimize your website structure, and improve search rankings so the right audience can find your business.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.6, reviews: 78, ordersInQueue: 5, verified: true },
    whatItHelpsAchieve: ['increase website visibility in search engines', 'attract targeted organic traffic', 'improve search rankings for relevant keywords', 'strengthen online authority', 'generate more inquiries and leads'],
    howMeasured: ['number of pages optimized', 'keyword rankings', 'website traffic Standard', 'search visibility improvements', 'lead generation from organic traffic'],
    servicesInclude: ['Keyword research', 'On-page SEO optimization', 'Technical SEO improvements', 'Content recommendations', 'Search performance tracking'],
    tools: ['SEMrush', 'Ahrefs', 'Google Search Console', 'Moz', 'Screaming Frog'],
    complementaryServices: [
      { name: 'Website Development', reason: 'SEO-friendly website structure' },
      { name: 'Copywriting & Content Creation', reason: 'optimized website content' },
      { name: 'Landing Pages & Sales Funnels', reason: 'convert search traffic' },
      { name: 'Graphic Design', reason: 'visual content for blog and marketing pages' },
      { name: 'Lead Generation Services', reason: 'expand sales opportunities' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$499/month', description: 'Small businesses beginning to build organic search visibility.', includes: ['Initial SEO audit', 'Keyword research for up to 10 target keywords', 'Optimization of up to 5 priority pages', 'Page title optimization', 'Meta description optimization', 'Heading structure review', 'Internal-link improvements', 'Google Search Console review', 'Google Analytics review', 'XML sitemap review', 'Basic technical SEO checks', 'One existing page/content optimization per month', 'Monthly ranking review', 'Monthly performance report', 'Monthly recommendations'] },
      Standard: { name: 'Standard Package', price: '$999/month', description: 'Most Popular — everything in Starter, plus expanded keyword tracking and content.', includes: ['Everything in Starter', 'Up to 20 tracked target keywords', 'Optimization across up to 15 priority pages', 'Competitor SEO review', 'Two SEO-focused content pieces or substantial content optimizations per month', 'Enhanced internal-link strategy', 'Technical issue monitoring', 'Search intent analysis', 'Content-gap analysis', 'Local SEO optimization when applicable', 'Google Business Profile recommendations when applicable', 'Basic structured-data recommendations', 'Conversion-page SEO review', 'Monthly strategy review'] },
      premium: { name: 'Premium Package', price: '$1,999/month', description: 'Businesses pursuing more aggressive organic Standard.', includes: ['Everything in Standard', 'Up to 40 tracked keywords', 'Up to 30 priority pages', 'Up to 4 SEO content pieces or major optimizations per month', 'Advanced competitor research', 'Advanced content-gap analysis', 'Technical SEO monitoring', 'Schema strategy', 'Multi-service or multi-location SEO strategy', 'Content-cluster planning', 'Link opportunity research and outreach strategy', 'Conversion optimization recommendations', 'Priority implementation support', 'Monthly strategy call', 'Detailed executive reporting'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Initial SEO audit', values: { basic: true, standard: true, premium: true } },
        { label: 'Keyword research for up to 10 target keywords', values: { basic: true, standard: true, premium: true } },
        { label: 'Optimization of up to 5 priority pages', values: { basic: true, standard: true, premium: true } },
        { label: 'Page title optimization', values: { basic: true, standard: true, premium: true } },
        { label: 'Meta description optimization', values: { basic: true, standard: true, premium: true } },
        { label: 'Heading structure review', values: { basic: true, standard: true, premium: true } },
        { label: 'Internal-link improvements', values: { basic: true, standard: true, premium: true } },
        { label: 'Google Search Console review', values: { basic: true, standard: true, premium: true } },
        { label: 'Google Analytics review', values: { basic: true, standard: true, premium: true } },
        { label: 'XML sitemap review', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic technical SEO checks', values: { basic: true, standard: true, premium: true } },
        { label: 'One existing page/content optimization per month', values: { basic: true, standard: true, premium: true } },
        { label: 'Monthly ranking review', values: { basic: true, standard: true, premium: true } },
        { label: 'Monthly performance report', values: { basic: true, standard: true, premium: true } },
        { label: 'Monthly recommendations', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 20 tracked target keywords', values: { basic: false, standard: true, premium: true } },
        { label: 'Optimization across up to 15 priority pages', values: { basic: false, standard: true, premium: true } },
        { label: 'Competitor SEO review', values: { basic: false, standard: true, premium: true } },
        { label: 'Two SEO-focused content pieces or substantial content optimizations per month', values: { basic: false, standard: true, premium: true } },
        { label: 'Enhanced internal-link strategy', values: { basic: false, standard: true, premium: true } },
        { label: 'Technical issue monitoring', values: { basic: false, standard: true, premium: true } },
        { label: 'Search intent analysis', values: { basic: false, standard: true, premium: true } },
        { label: 'Content-gap analysis', values: { basic: false, standard: true, premium: true } },
        { label: 'Local SEO optimization when applicable', values: { basic: false, standard: true, premium: true } },
        { label: 'Google Business Profile recommendations when applicable', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic structured-data recommendations', values: { basic: false, standard: true, premium: true } },
        { label: 'Conversion-page SEO review', values: { basic: false, standard: true, premium: true } },
        { label: 'Monthly strategy review', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 40 tracked keywords', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 30 priority pages', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 4 SEO content pieces or major optimizations per month', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced competitor research', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced content-gap analysis', values: { basic: false, standard: false, premium: true } },
        { label: 'Technical SEO monitoring', values: { basic: false, standard: false, premium: true } },
        { label: 'Schema strategy', values: { basic: false, standard: false, premium: true } },
        { label: 'Multi-service or multi-location SEO strategy', values: { basic: false, standard: false, premium: true } },
        { label: 'Content-cluster planning', values: { basic: false, standard: false, premium: true } },
        { label: 'Link opportunity research and outreach strategy', values: { basic: false, standard: false, premium: true } },
        { label: 'Conversion optimization recommendations', values: { basic: false, standard: false, premium: true } },
        { label: 'Priority implementation support', values: { basic: false, standard: false, premium: true } },
        { label: 'Monthly strategy call', values: { basic: false, standard: false, premium: true } },
        { label: 'Detailed executive reporting', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$499/month', packageName: 'Starter Package', shortDescription: 'SEO audit, 10 keywords, optimization of 5 pages', description: 'Small businesses beginning to build organic search visibility.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Initial SEO audit', 'Keyword research for up to 10 target keywords', 'Optimization of up to 5 priority pages', 'Page title optimization', 'Meta description optimization', 'Heading structure review', 'Internal-link improvements', 'Google Search Console review', 'Google Analytics review', 'XML sitemap review', 'Basic technical SEO checks', 'One existing page/content optimization per month', 'Monthly ranking review', 'Monthly performance report', 'Monthly recommendations'] },
        standard: { price: '$999/month', packageName: 'Standard Package', shortDescription: '20 keywords, optimization of 15 pages, content pieces', description: 'Most Popular — everything in Starter, plus expanded keyword tracking and content.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Everything in Starter', 'Up to 20 tracked target keywords', 'Optimization across up to 15 priority pages', 'Competitor SEO review', 'Two SEO-focused content pieces or substantial content optimizations per month', 'Enhanced internal-link strategy', 'Technical issue monitoring', 'Search intent analysis', 'Content-gap analysis', 'Local SEO optimization when applicable', 'Google Business Profile recommendations when applicable', 'Basic structured-data recommendations', 'Conversion-page SEO review', 'Monthly strategy review'] },
        premium: { price: '$1,999/month', packageName: 'Premium Package', shortDescription: '40 keywords, 30 pages, schema & outreach strategy', description: 'Businesses pursuing more aggressive organic Standard.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Everything in Standard', 'Up to 40 tracked keywords', 'Up to 30 priority pages', 'Up to 4 SEO content pieces or major optimizations per month', 'Advanced competitor research', 'Advanced content-gap analysis', 'Technical SEO monitoring', 'Schema strategy', 'Multi-service or multi-location SEO strategy', 'Content-cluster planning', 'Link opportunity research and outreach strategy', 'Conversion optimization recommendations', 'Priority implementation support', 'Monthly strategy call', 'Detailed executive reporting'] }
      }
    },
    sampleProject: {
      projectName: "LocalRank SEO Campaign",
      businessType: "Local service business",
      projectSummary: "A search marketing concept created to help a local business improve online visibility and attract more qualified leads from search engines.",
      servicesIncluded: ["Keyword research", "On-page SEO", "Local SEO", "Service page optimization", "Technical SEO review", "Reporting dashboard"],
      portfolioCardText: "An SEO campaign concept built to improve visibility, target local keywords, and attract more qualified website visitors."
    }
  },
  'paid-advertising': {
    title: 'Paid Advertising Management',
    category: 'Marketing & Standard',
    icon: <FaAd />,
    intro: 'Paid advertising can quickly generate leads and increase brand visibility.',
    description: 'We create and manage targeted advertising campaigns designed to reach the right audience and maximize return on investment.',
    longDescription: 'Scale Link Alliance provides professional paid advertising management services that help businesses quickly reach new customers and generate leads. We design and manage campaigns that target the right audience and maximize ROI.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.6, reviews: 71, ordersInQueue: 4, verified: true },
    whatItHelpsAchieve: ['reach new customers quickly', 'generate leads', 'increase brand visibility', 'target specific audiences', 'maximize marketing budget'],
    howMeasured: ['number of campaigns', 'audience targeting accuracy', 'conversion rates', 'return on ad spend'],
    servicesInclude: ['Google Ads management', 'Social media advertising', 'Audience targeting', 'Campaign performance optimization', 'Monthly reporting'],
    tools: ['Google Ads', 'Facebook Ads Manager', 'LinkedIn Ads', 'TikTok Ads'],
    complementaryServices: [
      { name: 'Landing Pages', reason: 'conversion-optimized destinations' },
      { name: 'Copywriting', reason: 'ad messaging' },
      { name: 'Social Media', reason: 'organic support' },
      { name: 'Lead Generation', reason: 'integrated campaigns' },
      { name: 'Analytics', reason: 'performance tracking' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$399/month', description: 'Smaller businesses testing paid acquisition. Recommended for lower-spend campaigns.', includes: ['1 advertising platform', 'Up to 1 active campaign', 'Up to 3 ad groups/ad sets', 'Initial campaign setup', 'Basic keyword or audience research', 'Up to 6 ad variations', 'Conversion tracking setup', 'Budget monitoring', 'Basic optimization', 'Negative keyword management where applicable', 'Monthly report', 'One monthly campaign review'] },
      Standard: { name: 'Standard Package', price: '$799/month', description: 'Everything in Starter, plus more campaigns and testing.', includes: ['Everything in Starter', 'Up to 2 active campaigns', 'Up to 8 ad groups/ad sets', 'Up to 12 active ad variations', 'Enhanced audience/keyword research', 'Retargeting campaign setup', 'Landing-page recommendations', 'Weekly optimization', 'Search-term analysis', 'Bid/budget adjustments', 'Basic creative testing', 'Conversion-performance analysis', 'Monthly strategy call'] },
      premium: { name: 'Premium Package', price: '$1,499/month', description: 'For larger or more complex advertising programs.', includes: ['Multi-campaign management', 'Up to 2 advertising platforms', 'Advanced audience segmentation', 'Advanced retargeting', 'Creative testing', 'Conversion tracking', 'Funnel performance analysis', 'Weekly performance monitoring', 'Budget allocation recommendations', 'Advanced keyword/search-term management', 'Landing-page recommendations', 'Monthly strategy call', 'Executive reporting'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: '1 advertising platform', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 1 active campaign', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 3 ad groups/ad sets', values: { basic: true, standard: true, premium: true } },
        { label: 'Initial campaign setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic keyword or audience research', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 6 ad variations', values: { basic: true, standard: true, premium: true } },
        { label: 'Conversion tracking setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Budget monitoring', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic optimization', values: { basic: true, standard: true, premium: true } },
        { label: 'Negative keyword management where applicable', values: { basic: true, standard: true, premium: true } },
        { label: 'Monthly report', values: { basic: true, standard: true, premium: true } },
        { label: 'One monthly campaign review', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 2 active campaigns', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 8 ad groups/ad sets', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 12 active ad variations', values: { basic: false, standard: true, premium: true } },
        { label: 'Enhanced audience/keyword research', values: { basic: false, standard: true, premium: true } },
        { label: 'Retargeting campaign setup', values: { basic: false, standard: true, premium: true } },
        { label: 'Landing-page recommendations', values: { basic: false, standard: true, premium: true } },
        { label: 'Weekly optimization', values: { basic: false, standard: true, premium: true } },
        { label: 'Search-term analysis', values: { basic: false, standard: true, premium: true } },
        { label: 'Bid/budget adjustments', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic creative testing', values: { basic: false, standard: true, premium: true } },
        { label: 'Conversion-performance analysis', values: { basic: false, standard: true, premium: true } },
        { label: 'Monthly strategy call', values: { basic: false, standard: true, premium: true } },
        { label: 'Multi-campaign management', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 2 advertising platforms', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced audience segmentation', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced retargeting', values: { basic: false, standard: false, premium: true } },
        { label: 'Creative testing', values: { basic: false, standard: false, premium: true } },
        { label: 'Conversion tracking', values: { basic: false, standard: false, premium: true } },
        { label: 'Funnel performance analysis', values: { basic: false, standard: false, premium: true } },
        { label: 'Weekly performance monitoring', values: { basic: false, standard: false, premium: true } },
        { label: 'Budget allocation recommendations', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced keyword/search-term management', values: { basic: false, standard: false, premium: true } },
        { label: 'Executive reporting', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$399/month', packageName: 'Starter Package', shortDescription: '1 platform, 1 campaign, conversion tracking', description: 'Smaller businesses testing paid acquisition. Recommended for lower-spend campaigns.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['1 advertising platform', 'Up to 1 active campaign', 'Up to 3 ad groups/ad sets', 'Initial campaign setup', 'Basic keyword or audience research', 'Up to 6 ad variations', 'Conversion tracking setup', 'Budget monitoring', 'Basic optimization', 'Negative keyword management where applicable', 'Monthly report', 'One monthly campaign review'] },
        standard: { price: '$799/month', packageName: 'Standard Package', shortDescription: 'Up to 2 campaigns, retargeting, weekly optimization', description: 'Everything in Starter, plus more campaigns and testing.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Everything in Starter', 'Up to 2 active campaigns', 'Up to 8 ad groups/ad sets', 'Up to 12 active ad variations', 'Enhanced audience/keyword research', 'Retargeting campaign setup', 'Landing-page recommendations', 'Weekly optimization', 'Search-term analysis', 'Bid/budget adjustments', 'Basic creative testing', 'Conversion-performance analysis', 'Monthly strategy call'] },
        premium: { price: '$1,499/month', packageName: 'Premium Package', shortDescription: 'Multi-campaign management, up to 2 platforms', description: 'For larger or more complex advertising programs.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Multi-campaign management', 'Up to 2 advertising platforms', 'Advanced audience segmentation', 'Advanced retargeting', 'Creative testing', 'Conversion tracking', 'Funnel performance analysis', 'Weekly performance monitoring', 'Budget allocation recommendations', 'Advanced keyword/search-term management', 'Landing-page recommendations', 'Monthly strategy call', 'Executive reporting'] }
      }
    },
    sampleProject: {
      projectName: "AdStandard Campaign Management",
      businessType: "Contractor / local service business",
      projectSummary: "A paid advertising concept created to help a business reach more potential customers through targeted online ad campaigns.",
      projectGoal: "Help the business attract better traffic, generate more leads, and promote its services to people who are more likely to take action.",
      servicesIncluded: ["Campaign planning", "Audience targeting", "Ad copy", "Creative direction", "Landing page recommendation", "Budget guidance", "Tracking setup", "Campaign monitoring", "Performance review"],
      portfolioCardText: "A paid advertising concept built to help businesses attract targeted traffic, generate leads, and track campaign performance."
    }
  },
  'email-marketing': {
    title: 'Email Marketing Campaigns',
    category: 'Marketing & Standard',
    icon: <FaEnvelope />,
    intro: 'Email marketing remains one of the most effective ways for businesses to communicate directly with their audience.',
    description: 'A well-designed email campaign can help nurture customer relationships, promote services or products, and encourage repeat engagement.',
    longDescription: 'Scale Link Alliance provides comprehensive email marketing campaign services that help businesses create professional email content, manage mailing lists, and deliver targeted messages that strengthen customer connections.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 94, ordersInQueue: 4, verified: true },
    whatItHelpsAchieve: ['maintain regular communication with customers', 'promote products, services, and announcements', 'nurture leads and prospects', 'increase customer engagement', 'encourage repeat business'],
    howMeasured: ['number of email campaigns created', 'level of customization and design', 'audience segmentation', 'performance tracking and reporting'],
    servicesInclude: ['Email campaign design', 'Newsletter creation', 'Marketing automation setup', 'Customer engagement emails', 'Campaign performance tracking'],
    tools: ['Mailchimp', 'Klaviyo', 'ActiveCampaign', 'ConvertKit', 'HubSpot'],
    complementaryServices: [
      { name: 'Lead Generation Services', reason: 'grow email lists' },
      { name: 'Copywriting & Content Creation', reason: 'email messaging' },
      { name: 'Graphic Design', reason: 'email visuals and templates' },
      { name: 'CRM & Marketing Automation', reason: 'automated workflows' },
      { name: 'Landing Pages & Sales Funnels', reason: 'convert email traffic' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$249', description: 'Best for a single promotion or announcement.', includes: ['1 email campaign', 'Email layout/design', 'Basic copy editing', 'CTA setup', 'Basic segmentation', 'Links and tracking', 'Test send', 'Mobile review', 'One revision round', 'Campaign performance summary'] },
      Standard: { name: 'Standard Package', price: '$599', description: 'Standard Campaign.', includes: ['Up to 4 emails', 'Campaign strategy', 'Email layout/design', 'Subject-line development', 'Basic copywriting', 'Audience segmentation', 'CTA strategy', 'UTM/tracking setup', 'Scheduling', 'Basic automation', 'Performance report', 'Two revision rounds'] },
      premium: { name: 'Premium Package', price: '$1,199', description: 'Premium Campaign.', includes: ['Up to 8 emails', 'Full campaign strategy', 'Copywriting', 'Design/layout', 'Segmentation strategy', 'Automated email flow', 'Lead tagging', 'Basic A/B testing', 'Conversion tracking', 'Performance analysis', 'Optimization recommendations', 'Two revision rounds'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: '1 email campaign', values: { basic: true, standard: true, premium: true } },
        { label: 'Email layout/design', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic copy editing', values: { basic: true, standard: true, premium: true } },
        { label: 'CTA setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic segmentation', values: { basic: true, standard: true, premium: true } },
        { label: 'Links and tracking', values: { basic: true, standard: true, premium: true } },
        { label: 'Test send', values: { basic: true, standard: true, premium: true } },
        { label: 'Mobile review', values: { basic: true, standard: true, premium: true } },
        { label: 'One revision round', values: { basic: true, standard: true, premium: true } },
        { label: 'Campaign performance summary', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 4 emails', values: { basic: false, standard: true, premium: true } },
        { label: 'Campaign strategy', values: { basic: false, standard: true, premium: true } },
        { label: 'Subject-line development', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic copywriting', values: { basic: false, standard: true, premium: true } },
        { label: 'Audience segmentation', values: { basic: false, standard: true, premium: true } },
        { label: 'CTA strategy', values: { basic: false, standard: true, premium: true } },
        { label: 'UTM/tracking setup', values: { basic: false, standard: true, premium: true } },
        { label: 'Scheduling', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic automation', values: { basic: false, standard: true, premium: true } },
        { label: 'Performance report', values: { basic: false, standard: true, premium: true } },
        { label: 'Two revision rounds', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 8 emails', values: { basic: false, standard: false, premium: true } },
        { label: 'Full campaign strategy', values: { basic: false, standard: false, premium: true } },
        { label: 'Copywriting', values: { basic: false, standard: false, premium: true } },
        { label: 'Design/layout', values: { basic: false, standard: false, premium: true } },
        { label: 'Segmentation strategy', values: { basic: false, standard: false, premium: true } },
        { label: 'Automated email flow', values: { basic: false, standard: false, premium: true } },
        { label: 'Lead tagging', values: { basic: false, standard: false, premium: true } },
        { label: 'Basic A/B testing', values: { basic: false, standard: false, premium: true } },
        { label: 'Conversion tracking', values: { basic: false, standard: false, premium: true } },
        { label: 'Performance analysis', values: { basic: false, standard: false, premium: true } },
        { label: 'Optimization recommendations', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$249', packageName: 'Starter Package', shortDescription: '1 email campaign, layout/design, 1 revision', description: 'Best for a single promotion or announcement.', deliveryLabel: 'Shown during service selection', revisions: 'One revision round', includes: ['1 email campaign', 'Email layout/design', 'Basic copy editing', 'CTA setup', 'Basic segmentation', 'Links and tracking', 'Test send', 'Mobile review', 'One revision round', 'Campaign performance summary'] },
        standard: { price: '$599', packageName: 'Standard Package', shortDescription: 'Up to 4 emails, campaign strategy, 2 revisions', description: 'Standard Campaign.', deliveryLabel: 'Shown during service selection', revisions: 'Two revision rounds', includes: ['Up to 4 emails', 'Campaign strategy', 'Email layout/design', 'Subject-line development', 'Basic copywriting', 'Audience segmentation', 'CTA strategy', 'UTM/tracking setup', 'Scheduling', 'Basic automation', 'Performance report', 'Two revision rounds'] },
        premium: { price: '$1,199', packageName: 'Premium Package', shortDescription: 'Up to 8 emails, automated flow, A/B testing', description: 'Premium Campaign.', deliveryLabel: 'Shown during service selection', revisions: 'Two revision rounds', includes: ['Up to 8 emails', 'Full campaign strategy', 'Copywriting', 'Design/layout', 'Segmentation strategy', 'Automated email flow', 'Lead tagging', 'Basic A/B testing', 'Conversion tracking', 'Performance analysis', 'Optimization recommendations', 'Two revision rounds'] }
      }
    },
    sampleProject: {
      projectName: "InboxStandard Email Campaign",
      businessType: "Online store",
      projectSummary: "An email marketing concept designed to help an online store welcome new subscribers, promote offers, recover missed sales, and encourage repeat purchases.",
      servicesIncluded: ["Welcome sequence", "Promotional emails", "Abandoned cart email", "Newsletter design", "Customer segmentation", "Reporting"],
      portfolioCardText: "An email marketing concept built to turn subscribers into customers and keep buyers engaged."
    }
  },
  'lead-generation': {
    title: 'Lead Generation Services',
    category: 'Marketing & Standard',
    icon: <FaRegBuilding />,
    intro: 'Consistent lead generation is essential for business Standard.',
    description: 'Without a steady flow of potential customers, even the best products or services struggle to reach their full potential.',
    longDescription: 'Scale Link Alliance provides targeted lead generation services designed to help businesses identify and connect with qualified prospects who are more likely to be interested in their offerings.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.7, reviews: 82, ordersInQueue: 6, verified: true },
    whatItHelpsAchieve: ['identify potential customers', 'build a consistent sales pipeline', 'expand outreach opportunities', 'connect with targeted prospects', 'support marketing and sales efforts'],
    howMeasured: ['number of leads delivered', 'targeting criteria', 'level of research and qualification', 'delivery format of lead data'],
    servicesInclude: ['Target audience identification', 'Lead sourcing and research', 'Outreach strategies', 'Prospect qualification', 'Lead list delivery'],
    tools: ['LinkedIn Sales Navigator', 'Apollo.io', 'Hunter.io', 'CRM tools'],
    complementaryServices: [
      { name: 'CRM & Marketing Automation', reason: 'manage leads' },
      { name: 'Email Marketing Campaigns', reason: 'contact prospects' },
      { name: 'Landing Pages & Sales Funnels', reason: 'convert leads' },
      { name: 'Paid Advertising Management', reason: 'generate additional leads' },
      { name: 'Copywriting & Content Creation', reason: 'sales messaging' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$299/month', description: 'Starter Lead Generation.', includes: ['Ideal customer profile definition', 'Basic target-market research', 'Prospecting criteria', 'Up to 150 prospect records per month', 'Basic lead-list organization', 'Contact-data cleanup', 'One outreach sequence framework', 'Lead tracking sheet or basic CRM structure', 'Monthly results summary'] },
      Standard: { name: 'Standard Package', price: '$699/month', description: 'Standard Lead Generation.', includes: ['Everything in Starter', 'Up to 500 prospect records per month', 'Multiple target segments', 'Enhanced prospect research', 'Up to 2 outreach sequences', 'Basic personalization framework', 'CRM import assistance', 'Lead tagging', 'Follow-up workflow', 'Monthly performance analysis', 'Strategy adjustments'] },
      premium: { name: 'Premium Package', price: '$1,499/month', description: 'Premium Lead Generation.', includes: ['Up to 1,000 prospect records per month', 'Multiple customer profiles', 'Advanced account research', 'Multi-step outreach strategy', 'CRM pipeline setup', 'Lead qualification framework', 'Follow-up automation', 'Reporting dashboard', 'Ongoing campaign refinement', 'Monthly strategy session'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Ideal customer profile definition', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic target-market research', values: { basic: true, standard: true, premium: true } },
        { label: 'Prospecting criteria', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 150 prospect records per month', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic lead-list organization', values: { basic: true, standard: true, premium: true } },
        { label: 'Contact-data cleanup', values: { basic: true, standard: true, premium: true } },
        { label: 'One outreach sequence framework', values: { basic: true, standard: true, premium: true } },
        { label: 'Lead tracking sheet or basic CRM structure', values: { basic: true, standard: true, premium: true } },
        { label: 'Monthly results summary', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 500 prospect records per month', values: { basic: false, standard: true, premium: true } },
        { label: 'Multiple target segments', values: { basic: false, standard: true, premium: true } },
        { label: 'Enhanced prospect research', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 2 outreach sequences', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic personalization framework', values: { basic: false, standard: true, premium: true } },
        { label: 'CRM import assistance', values: { basic: false, standard: true, premium: true } },
        { label: 'Lead tagging', values: { basic: false, standard: true, premium: true } },
        { label: 'Follow-up workflow', values: { basic: false, standard: true, premium: true } },
        { label: 'Monthly performance analysis', values: { basic: false, standard: true, premium: true } },
        { label: 'Strategy adjustments', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 1,000 prospect records per month', values: { basic: false, standard: false, premium: true } },
        { label: 'Multiple customer profiles', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced account research', values: { basic: false, standard: false, premium: true } },
        { label: 'Multi-step outreach strategy', values: { basic: false, standard: false, premium: true } },
        { label: 'CRM pipeline setup', values: { basic: false, standard: false, premium: true } },
        { label: 'Lead qualification framework', values: { basic: false, standard: false, premium: true } },
        { label: 'Follow-up automation', values: { basic: false, standard: false, premium: true } },
        { label: 'Reporting dashboard', values: { basic: false, standard: false, premium: true } },
        { label: 'Ongoing campaign refinement', values: { basic: false, standard: false, premium: true } },
        { label: 'Monthly strategy session', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$299/month', packageName: 'Starter Package', shortDescription: 'Up to 150 prospect records per month', description: 'Starter Lead Generation.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Ideal customer profile definition', 'Basic target-market research', 'Prospecting criteria', 'Up to 150 prospect records per month', 'Basic lead-list organization', 'Contact-data cleanup', 'One outreach sequence framework', 'Lead tracking sheet or basic CRM structure', 'Monthly results summary'] },
        standard: { price: '$699/month', packageName: 'Standard Package', shortDescription: 'Up to 500 prospect records per month', description: 'Standard Lead Generation.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Everything in Starter', 'Up to 500 prospect records per month', 'Multiple target segments', 'Enhanced prospect research', 'Up to 2 outreach sequences', 'Basic personalization framework', 'CRM import assistance', 'Lead tagging', 'Follow-up workflow', 'Monthly performance analysis', 'Strategy adjustments'] },
        premium: { price: '$1,499/month', packageName: 'Premium Package', shortDescription: 'Up to 1,000 prospect records per month', description: 'Premium Lead Generation.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 1,000 prospect records per month', 'Multiple customer profiles', 'Advanced account research', 'Multi-step outreach strategy', 'CRM pipeline setup', 'Lead qualification framework', 'Follow-up automation', 'Reporting dashboard', 'Ongoing campaign refinement', 'Monthly strategy session'] }
      }
    },
    sampleProject: {
      projectName: "LeadFlow Outreach Campaign",
      businessType: "B2B service company",
      projectSummary: "A lead generation concept designed to help a service business identify qualified prospects, organize outreach, and create more sales opportunities.",
      servicesIncluded: ["Lead research", "Prospect list building", "Outreach messaging", "Landing page support", "CRM setup", "Follow-up tracking"],
      portfolioCardText: "A lead generation campaign concept built to identify qualified prospects and create more sales conversations."
    }
  },
  'reputation-review-management': {
    title: 'Reputation & Review Management',
    category: 'Marketing & Standard',
    icon: <FaStar />,
    intro: 'Your online reputation is one of the most important factors in building trust with potential customers.',
    description: 'Positive reviews and a strong reputation help businesses stand out, attract new customers, and build credibility in their industry.',
    longDescription: 'Scale Link Alliance provides reputation and review management services that help businesses collect positive reviews, respond to feedback professionally, and build a strong online reputation that attracts customers.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 45, ordersInQueue: 3, verified: true },
    whatItHelpsAchieve: ['build trust with potential customers', 'increase conversion rates', 'improve search rankings', 'stand out from competitors', 'strengthen brand credibility'],
    howMeasured: ['number of reviews collected', 'average rating improvement', 'review response rate', 'reputation score'],
    servicesInclude: ['Review collection system setup', 'Review monitoring', 'Response management', 'Reputation analysis', 'Monthly reporting'],
    tools: ['Google Business Profile', 'Trustpilot', 'Yelp', 'Birdeye', 'Reputation management platforms'],
    complementaryServices: [
      { name: 'Social Media Management', reason: 'integrated reputation management' },
      { name: 'SEO & Search Marketing', reason: 'improve search visibility' },
      { name: 'Lead Generation Services', reason: 'convert reviews into leads' },
      { name: 'Email Marketing Campaigns', reason: 'request reviews' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$199', description: 'Ideal for businesses starting to collect reviews.', includes: ['Review collection system setup', 'Review monitoring', 'Basic response templates', 'Monthly review summary report'] },
      Standard: { name: 'Standard Package', price: '$499', description: 'Ideal for businesses actively managing reviews.', includes: ['Advanced review collection', 'Multi-platform monitoring', 'Custom response management', 'Quarterly review analysis', 'Reputation improvement recommendations'] },
      premium: { name: 'Premium Package', price: '$999', description: 'Ideal for businesses prioritizing reputation management.', includes: ['Full review management system', 'Automated review requests', 'Crisis response support', 'Monthly detailed reporting', 'Strategic reputation standard plan'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Review collection system', values: { basic: true, standard: true, premium: true } },
        { label: 'Review monitoring', values: { basic: true, standard: true, premium: true } },
        { label: 'Monthly report', values: { basic: true, standard: true, premium: true } },
        { label: 'Multi-platform monitoring', values: { basic: false, standard: true, premium: true } },
        { label: 'Custom response management', values: { basic: false, standard: true, premium: true } },
        { label: 'Automated review requests', values: { basic: false, standard: false, premium: true } },
        { label: 'Crisis response support', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$199', packageName: 'Starter Package', shortDescription: 'Review collection setup, basic monitoring', description: 'Ideal for businesses starting to collect reviews.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Review collection system setup', 'Review monitoring', 'Basic response templates', 'Monthly review summary report'] },
        standard: { price: '$499', packageName: 'Standard Package', shortDescription: 'Advanced collection, multi-platform monitoring', description: 'Ideal for businesses actively managing reviews.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Advanced review collection', 'Multi-platform monitoring', 'Custom response management', 'Quarterly review analysis', 'Reputation improvement recommendations'] },
        premium: { price: '$999', packageName: 'Premium Package', shortDescription: 'Full management system, automated requests', description: 'Ideal for businesses prioritizing reputation management.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Full review management system', 'Automated review requests', 'Crisis response support', 'Monthly detailed reporting', 'Strategic reputation standard plan'] }
      }
    },
    sampleProject: {
      projectName: "TrustBuilder Review Management",
      businessType: "Local service business",
      projectSummary: "A reputation management concept designed to help a business collect positive reviews, respond professionally, and build trust with potential customers.",
      servicesIncluded: ["Review collection", "Response templates", "Multi-platform monitoring", "Review analysis", "Reputation reporting"],
      portfolioCardText: "A reputation management concept built to help businesses build trust, attract customers, and strengthen their online presence."
    }
  },
  'crm-automation': {
    title: 'CRM & Marketing Automation',
    category: 'Automation & AI',
    icon: <FaCogs />,
    intro: 'CRM systems, funnels, and automations that capture leads and improve conversion efficiency.',
    description: 'Set up systems that work automatically to capture leads, nurture prospects, and improve conversion efficiency.',
    longDescription: 'Scale Link Alliance provides comprehensive CRM and marketing automation services that help businesses organize leads, track customer communication, and automate follow-up so no opportunity is missed.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.7, reviews: 54, ordersInQueue: 4, verified: true },
    whatItHelpsAchieve: ['manage customer relationships', 'automate marketing workflows', 'track leads and conversions', 'improve sales efficiency', 'scale customer engagement'],
    howMeasured: ['CRM setup complexity', 'number of automation workflows', 'integrations completed', 'lead tracking accuracy'],
    servicesInclude: ['CRM setup and customization', 'Sales funnel development', 'Email automation sequences', 'Lead tracking and scoring', 'Integration with existing tools'],
    tools: ['HubSpot', 'Salesforce', 'ActiveCampaign', 'Klaviyo', 'Zapier', 'Make'],
    complementaryServices: [
      { name: 'Lead Generation', reason: 'feed leads into CRM' },
      { name: 'Email Marketing', reason: 'integrated campaigns' },
      { name: 'Web Development', reason: 'CRM-connected websites' },
      { name: 'API Integration', reason: 'system connectivity' },
      { name: 'Data Analytics', reason: 'performance tracking' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$499', description: 'Starter Automation — businesses replacing basic manual follow-up.', includes: ['1 CRM pipeline', 'Basic CRM configuration', 'Up to 2 forms', 'Up to 3 automated workflows', 'Contact tagging', 'Basic lead notifications', '1 third-party integration', 'Testing', 'Basic documentation', 'One training session'] },
      Standard: { name: 'Standard Package', price: '$1,299', description: 'Standard Automation.', includes: ['Up to 2 CRM pipelines', 'Up to 5 automated workflows', 'Up to 3 integrations', 'Lead routing', 'Email follow-up automation', 'Task automation', 'Contact segmentation', 'Pipeline stages', 'Basic dashboard', 'Testing and QA', 'Documentation', 'Team training'] },
      premium: { name: 'Premium Package', price: '$2,999', description: 'Premium Automation.', includes: ['Up to 4 pipelines', 'Up to 12 automated workflows', 'Up to 6 integrations', 'Advanced lead routing', 'Multi-step customer journeys', 'Sales automation', 'Marketing automation', 'Customer tagging/scoring rules', 'Reporting dashboard', 'Advanced workflow testing', 'Documentation', 'Up to 2 hours of team training', 'Post-launch optimization review'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: '1 CRM pipeline', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic CRM configuration', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 2 forms', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 3 automated workflows', values: { basic: true, standard: true, premium: true } },
        { label: 'Contact tagging', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic lead notifications', values: { basic: true, standard: true, premium: true } },
        { label: '1 third-party integration', values: { basic: true, standard: true, premium: true } },
        { label: 'Testing', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic documentation', values: { basic: true, standard: true, premium: true } },
        { label: 'One training session', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 2 CRM pipelines', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 5 automated workflows', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 3 integrations', values: { basic: false, standard: true, premium: true } },
        { label: 'Lead routing', values: { basic: false, standard: true, premium: true } },
        { label: 'Email follow-up automation', values: { basic: false, standard: true, premium: true } },
        { label: 'Task automation', values: { basic: false, standard: true, premium: true } },
        { label: 'Contact segmentation', values: { basic: false, standard: true, premium: true } },
        { label: 'Pipeline stages', values: { basic: false, standard: true, premium: true } },
        { label: 'Basic dashboard', values: { basic: false, standard: true, premium: true } },
        { label: 'Testing and QA', values: { basic: false, standard: true, premium: true } },
        { label: 'Documentation', values: { basic: false, standard: true, premium: true } },
        { label: 'Team training', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 4 pipelines', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 12 automated workflows', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 6 integrations', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced lead routing', values: { basic: false, standard: false, premium: true } },
        { label: 'Multi-step customer journeys', values: { basic: false, standard: false, premium: true } },
        { label: 'Sales automation', values: { basic: false, standard: false, premium: true } },
        { label: 'Marketing automation', values: { basic: false, standard: false, premium: true } },
        { label: 'Customer tagging/scoring rules', values: { basic: false, standard: false, premium: true } },
        { label: 'Reporting dashboard', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced workflow testing', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 2 hours of team training', values: { basic: false, standard: false, premium: true } },
        { label: 'Post-launch optimization review', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$499', packageName: 'Starter Package', shortDescription: '1 CRM pipeline, basic configuration, 1 integration', description: 'Starter Automation — businesses replacing basic manual follow-up.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['1 CRM pipeline', 'Basic CRM configuration', 'Up to 2 forms', 'Up to 3 automated workflows', 'Contact tagging', 'Basic lead notifications', '1 third-party integration', 'Testing', 'Basic documentation', 'One training session'] },
        standard: { price: '$1,299', packageName: 'Standard Package', shortDescription: 'Up to 2 pipelines, up to 5 workflows, lead routing', description: 'Standard Automation.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Up to 2 CRM pipelines', 'Up to 5 automated workflows', 'Up to 3 integrations', 'Lead routing', 'Email follow-up automation', 'Task automation', 'Contact segmentation', 'Pipeline stages', 'Basic dashboard', 'Testing and QA', 'Documentation', 'Team training'] },
        premium: { price: '$2,999', packageName: 'Premium Package', shortDescription: 'Up to 4 pipelines, up to 12 workflows, full automation', description: 'Premium Automation.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Up to 4 pipelines', 'Up to 12 automated workflows', 'Up to 6 integrations', 'Advanced lead routing', 'Multi-step customer journeys', 'Sales automation', 'Marketing automation', 'Customer tagging/scoring rules', 'Reporting dashboard', 'Advanced workflow testing', 'Documentation', 'Up to 2 hours of team training', 'Post-launch optimization review'] }
      }
    },
    sampleProject: {
      projectName: "ClientFlow CRM & Automation System",
      businessType: "Sales-focused service company",
      projectSummary: "A CRM and marketing automation concept created to help a business organize leads, track customer communication, and automate follow-up.",
      projectGoal: "Help the business reduce missed opportunities by keeping leads organized and making follow-up more consistent.",
      servicesIncluded: ["CRM setup", "Pipeline stages", "Contact fields", "Lead tagging", "Automated email follow-ups", "Task reminders", "Form connection", "Customer status updates", "Reporting setup"],
      portfolioCardText: "A CRM and automation concept built to help businesses manage leads, automate follow-up, and improve customer communication."
    }
  },
  'ai-automation': {
    title: 'AI Automation & Smart Business Systems',
    category: 'Automation & AI',
    icon: <FaRobot />,
    intro: 'Custom AI workflows designed to help your business save time, improve follow-up, support customers faster, and operate with more structure.',
    description: 'Every AI automation project is custom quoted because the right solution depends on your workflow, tools, goals, and business process.',
    longDescription: 'Scale Link Alliance designs custom AI automation systems based on what your business wants to improve — from missed follow-ups to manual reporting to scattered lead management across multiple platforms.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.9, reviews: 67, ordersInQueue: 4, verified: true },
    whatItHelpsAchieve: ['reduce repeated manual tasks', 'catch follow-ups that would otherwise be missed', 'manage leads across multiple platforms', 'provide faster AI-assisted customer support', 'automate internal reporting and notifications', 'create smarter, more consistent internal workflows'],
    howMeasured: ['complexity of the workflow being automated', 'number of tools and systems involved', 'volume of tasks or messages handled', 'level of custom logic required'],
    servicesInclude: ['AI lead follow-up systems', 'AI customer support chatbots', 'AI appointment booking assistants', 'AI voice or call automation', 'AI email response workflows', 'AI CRM update automation', 'AI reporting dashboards', 'AI content workflow automation', 'AI sales assistant systems', 'AI internal task automation'],
    tools: ['Zapier', 'Make', 'n8n', 'Custom APIs', 'OpenAI / Claude API', 'CRM platforms'],
    complementaryServices: [
      { name: 'CRM & Marketing Automation', reason: 'organize the leads the automation manages' },
      { name: 'API Integration & Automation', reason: 'connect the tools your automation depends on' },
      { name: 'Data Analytics & Reporting', reason: 'turn automated activity into insight' },
      { name: 'Website Development', reason: 'connect automation to your site or forms' },
      { name: 'Virtual Assistant Services', reason: 'human backup alongside automation' }
    ],
    packages: {
      custom: { name: 'Custom Quote Only', price: 'Custom Quote', description: 'AI automation does not use standard package pricing because every project depends on the tools, workflows, and goals involved.', includes: ['a discovery conversation about your current process', 'a recommended automation approach based on your tools', 'transparent custom pricing before work begins', 'a clear scope of what the automation will and will not do'] }
    },
    sampleProject: {
      projectName: "FollowUpAI Lead & Support Automation",
      businessType: "Service-based business with multiple lead sources",
      projectSummary: "An AI automation concept designed to help a business catch every lead, respond faster, and reduce manual follow-up work across email, forms, and CRM.",
      projectGoal: "Help the business stop losing leads to slow response times and manual, inconsistent follow-up.",
      servicesIncluded: ["AI lead follow-up sequence", "Form-to-CRM automation", "AI email response drafting", "Notification routing", "Weekly automated reporting", "Workflow documentation"],
      portfolioCardText: "An AI automation concept built to help a business respond faster, follow up consistently, and spend less time on repetitive manual work."
    }
  },
  'business-process-automation': {
    title: 'Business Process Automation',
    category: 'Automation & AI',
    icon: <FaSyncAlt />,
    intro: 'Business process automation helps companies streamline operations, reduce manual work, and improve efficiency.',
    description: 'Automating repetitive tasks frees up your team to focus on higher-value activities that drive Standard.',
    longDescription: 'Scale Link Alliance provides business process automation services that help companies identify repetitive tasks, design automated workflows, and implement systems that save time and reduce errors.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.7, reviews: 38, ordersInQueue: 3, verified: true },
    whatItHelpsAchieve: ['reduce manual work', 'improve efficiency', 'eliminate errors', 'free up team time', 'scale operations without hiring'],
    howMeasured: ['number of automated workflows', 'time saved per task', 'error reduction rate', 'process complexity'],
    servicesInclude: ['Workflow mapping', 'Process automation setup', 'Integration with existing tools', 'Testing and optimization', 'Documentation'],
    tools: ['Zapier', 'Make', 'n8n', 'Microsoft Power Automate', 'Custom solutions'],
    complementaryServices: [
      { name: 'API Integration', reason: 'connect automated workflows' },
      { name: 'CRM & Marketing Automation', reason: 'automate sales processes' },
      { name: 'Data Analytics', reason: 'measure automation success' },
      { name: 'Process Documentation', reason: 'document workflows' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$299', description: 'Ideal for automating a single business process.', includes: ['1 automated workflow', 'Process mapping', 'Automation setup', 'Testing and documentation'] },
      Standard: { name: 'Standard Package', price: '$999', description: 'Ideal for automating multiple business processes.', includes: ['3 automated workflows', 'Process mapping and optimization', 'Integration setup', 'Testing and documentation', 'Training support'] },
      premium: { name: 'Premium Package', price: '$2,499', description: 'Ideal for full business process automation.', includes: ['5+ automated workflows', 'Full process optimization', 'Multi-system integration', 'Comprehensive documentation', 'Team training and ongoing support'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Automated workflows', values: { basic: true, standard: true, premium: true } },
        { label: 'Process mapping', values: { basic: true, standard: true, premium: true } },
        { label: 'Testing and documentation', values: { basic: true, standard: true, premium: true } },
        { label: 'Integration setup', values: { basic: false, standard: true, premium: true } },
        { label: 'Training support', values: { basic: false, standard: true, premium: true } },
        { label: 'Multi-system integration', values: { basic: false, standard: false, premium: true } },
        { label: 'Ongoing support', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$299', packageName: 'Starter Package', shortDescription: '1 automated workflow, process mapping', description: 'Ideal for automating a single business process.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['1 automated workflow', 'Process mapping', 'Automation setup', 'Testing and documentation'] },
        standard: { price: '$999', packageName: 'Standard Package', shortDescription: '3 automated workflows, integration setup', description: 'Ideal for automating multiple business processes.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['3 automated workflows', 'Process mapping and optimization', 'Integration setup', 'Testing and documentation', 'Training support'] },
        premium: { price: '$2,499', packageName: 'Premium Package', shortDescription: '5+ automated workflows, multi-system integration', description: 'Ideal for full business process automation.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['5+ automated workflows', 'Full process optimization', 'Multi-system integration', 'Comprehensive documentation', 'Team training and ongoing support'] }
      }
    },
    sampleProject: {
      projectName: "WorkflowPro Operations System",
      businessType: "Growing small business",
      projectSummary: "A business automation concept designed to reduce repetitive manual tasks and help a company operate more efficiently.",
      servicesIncluded: ["Workflow mapping", "Form automation", "Task routing", "Notification setup", "CRM updates", "Process documentation"],
      portfolioCardText: "An automation concept built to simplify daily operations, reduce manual work, and keep business tasks moving smoothly."
    }
  },
  'data-analytics': {
    title: 'Data Analytics & Reporting',
    category: 'Automation & AI',
    icon: <FaChartLine />,
    intro: 'Data analytics helps businesses understand performance, identify trends, and make better strategic decisions.',
    description: 'Without clear insights, companies often rely on assumptions rather than measurable information.',
    longDescription: 'Scale Link Alliance provides data analytics and reporting services that transform raw business data into structured reports and visual insights that help business owners monitor performance, track progress, and identify opportunities for improvement.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 43, ordersInQueue: 2, verified: true },
    whatItHelpsAchieve: ['understand key performance metrics', 'identify trends in sales, marketing, and operations', 'make informed business decisions', 'track marketing or operational performance', 'improve overall efficiency'],
    howMeasured: ['number of reports created', 'complexity of data analysis', 'number of data sources analyzed', 'creation of dashboards or visualizations'],
    servicesInclude: ['Data analysis', 'Business performance reports', 'Dashboard creation', 'Insight recommendations', 'KPI tracking'],
    tools: ['Google Analytics', 'Tableau', 'Power BI', 'Looker', 'Excel'],
    complementaryServices: [
      { name: 'CRM & Marketing Automation', reason: 'data collection and management' },
      { name: 'Lead Generation Services', reason: 'track prospect performance' },
      { name: 'SEO & Search Marketing', reason: 'measure search traffic Standard' },
      { name: 'Paid Advertising Management', reason: 'analyze ad campaign performance' },
      { name: 'Website Development', reason: 'integrate analytics tools' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$249', description: 'Starter Analysis.', includes: ['Up to 1 primary data source', 'Data cleanup for the agreed dataset', 'Up to 8 key metrics', 'One basic dashboard/report', 'Key observations', 'One revision round'] },
      Standard: { name: 'Standard Package', price: '$699/month', description: 'Standard Analytics.', includes: ['Up to 3 regular data sources', 'Monthly dashboard updates', 'KPI tracking', 'Trend analysis', 'Monthly performance report', 'Data-quality review', 'Recommendations', 'One monthly review meeting'] },
      premium: { name: 'Premium Package', price: '$1,499/month', description: 'Premium Analytics.', includes: ['Up to 5 regular data sources', 'Advanced dashboards', 'Department/channel segmentation', 'KPI framework', 'Trend analysis', 'Conversion/performance analysis', 'Monthly executive report', 'Regular dashboard refreshes', 'Monthly strategy meeting', 'Improvement recommendations'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Up to 1 primary data source', values: { basic: true, standard: true, premium: true } },
        { label: 'Data cleanup for the agreed dataset', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 8 key metrics', values: { basic: true, standard: true, premium: true } },
        { label: 'One basic dashboard/report', values: { basic: true, standard: true, premium: true } },
        { label: 'Key observations', values: { basic: true, standard: true, premium: true } },
        { label: 'One revision round', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 3 regular data sources', values: { basic: false, standard: true, premium: true } },
        { label: 'Monthly dashboard updates', values: { basic: false, standard: true, premium: true } },
        { label: 'KPI tracking', values: { basic: false, standard: true, premium: true } },
        { label: 'Trend analysis', values: { basic: false, standard: true, premium: true } },
        { label: 'Monthly performance report', values: { basic: false, standard: true, premium: true } },
        { label: 'Data-quality review', values: { basic: false, standard: true, premium: true } },
        { label: 'Recommendations', values: { basic: false, standard: true, premium: true } },
        { label: 'One monthly review meeting', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 5 regular data sources', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced dashboards', values: { basic: false, standard: false, premium: true } },
        { label: 'Department/channel segmentation', values: { basic: false, standard: false, premium: true } },
        { label: 'KPI framework', values: { basic: false, standard: false, premium: true } },
        { label: 'Conversion/performance analysis', values: { basic: false, standard: false, premium: true } },
        { label: 'Monthly executive report', values: { basic: false, standard: false, premium: true } },
        { label: 'Regular dashboard refreshes', values: { basic: false, standard: false, premium: true } },
        { label: 'Monthly strategy meeting', values: { basic: false, standard: false, premium: true } },
        { label: 'Improvement recommendations', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$249', packageName: 'Starter Package', shortDescription: '1 data source, 1 basic dashboard/report', description: 'Starter Analysis.', deliveryLabel: 'Shown during service selection', revisions: 'One revision round', includes: ['Up to 1 primary data source', 'Data cleanup for the agreed dataset', 'Up to 8 key metrics', 'One basic dashboard/report', 'Key observations', 'One revision round'] },
        standard: { price: '$699/month', packageName: 'Standard Package', shortDescription: 'Up to 3 data sources, monthly dashboard updates', description: 'Standard Analytics.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 3 regular data sources', 'Monthly dashboard updates', 'KPI tracking', 'Trend analysis', 'Monthly performance report', 'Data-quality review', 'Recommendations', 'One monthly review meeting'] },
        premium: { price: '$1,499/month', packageName: 'Premium Package', shortDescription: 'Up to 5 data sources, advanced dashboards', description: 'Premium Analytics.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 5 regular data sources', 'Advanced dashboards', 'Department/channel segmentation', 'KPI framework', 'Trend analysis', 'Conversion/performance analysis', 'Monthly executive report', 'Regular dashboard refreshes', 'Monthly strategy meeting', 'Improvement recommendations'] }
      }
    },
    sampleProject: {
      projectName: "InsightTrack Business Reporting Dashboard",
      businessType: "Growing small business",
      projectSummary: "A data analytics and reporting concept designed to help a business understand performance across marketing, website traffic, leads, and customer activity.",
      projectGoal: "Give the business clearer insight into what is working, what needs improvement, and where Standard opportunities may exist.",
      servicesIncluded: ["Performance dashboard setup", "Website traffic reports", "Lead tracking", "Campaign reporting", "KPI summaries", "Monthly insights", "Visual charts", "Recommendation notes"],
      portfolioCardText: "A reporting dashboard concept built to help businesses understand their numbers, track performance, and make smarter Standard decisions."
    }
  },
  'business-consulting-Standard-strategy': {
    title: 'Business Consulting & Standard Strategy',
    category: 'Operations & Support',
    icon: <FaBriefcase />,
    intro: 'Strategic guidance helps businesses identify opportunities, overcome challenges, and build a clear path to Standard.',
    description: 'Our consulting services provide actionable insights and strategic recommendations to help you achieve your business goals.',
    longDescription: 'Scale Link Alliance provides business consulting and Standard strategy services that help companies identify opportunities, develop actionable plans, and execute strategies that drive measurable results.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.9, reviews: 56, ordersInQueue: 3, verified: true },
    whatItHelpsAchieve: ['identify Standard opportunities', 'develop strategic plans', 'overcome business challenges', 'improve decision-making', 'achieve business goals'],
    howMeasured: ['strategy sessions', 'action plans developed', 'recommendations provided', 'implementation support'],
    servicesInclude: ['Business assessment', 'Standard strategy development', 'Action plan creation', 'Implementation guidance', 'Performance tracking'],
    tools: ['Strategic frameworks', 'Business modeling', 'Market analysis', 'Competitive analysis', 'Financial modeling'],
    complementaryServices: [
      { name: 'Data Analytics', reason: 'data-driven decisions' },
      { name: 'Lead Generation', reason: 'identify opportunities' },
      { name: 'Marketing Automation', reason: 'execute strategies' },
      { name: 'Process Documentation', reason: 'systemize operations' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$499', description: 'Ideal for businesses needing a standard plan.', includes: ['1 strategy session (60 min)', 'Business assessment', 'Standard recommendations', 'Action plan document'] },
      Standard: { name: 'Standard Package', price: '$1,499', description: 'Ideal for businesses needing ongoing strategy support.', includes: ['3 strategy sessions (60 min each)', 'Standard strategy development', 'Implementation roadmap', 'Monthly progress reviews', 'Strategy adjustments'] },
      premium: { name: 'Premium Package', price: '$4,999', description: 'Ideal for businesses needing comprehensive strategic guidance.', includes: ['6 strategy sessions (90 min each)', 'Full business assessment', 'Detailed Standard roadmap', 'Quarterly strategy reviews', 'Team support and implementation guidance', 'Priority access for consulting support'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Strategy sessions', values: { basic: true, standard: true, premium: true } },
        { label: 'Business assessment', values: { basic: true, standard: true, premium: true } },
        { label: 'Action plan document', values: { basic: true, standard: true, premium: true } },
        { label: 'Implementation roadmap', values: { basic: false, standard: true, premium: true } },
        { label: 'Monthly progress reviews', values: { basic: false, standard: true, premium: true } },
        { label: 'Quarterly strategy reviews', values: { basic: false, standard: false, premium: true } },
        { label: 'Team support and implementation', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$499', packageName: 'Starter Package', shortDescription: '1 strategy session, business assessment, action plan', description: 'Ideal for businesses needing a standard plan.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['1 strategy session (60 min)', 'Business assessment', 'Standard recommendations', 'Action plan document'] },
        standard: { price: '$1,499', packageName: 'Standard Package', shortDescription: '3 strategy sessions, implementation roadmap', description: 'Ideal for businesses needing ongoing strategy support.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['3 strategy sessions (60 min each)', 'Standard strategy development', 'Implementation roadmap', 'Monthly progress reviews', 'Strategy adjustments'] },
        premium: { price: '$4,999', packageName: 'Premium Package', shortDescription: '6 strategy sessions, full business assessment, quarterly reviews', description: 'Ideal for businesses needing comprehensive strategic guidance.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['6 strategy sessions (90 min each)', 'Full business assessment', 'Detailed Standard roadmap', 'Quarterly strategy reviews', 'Team support and implementation guidance', 'Priority access for consulting support'] }
      }
    },
    sampleProject: {
      projectName: "StandardMap Strategic Plan",
      businessType: "Service-based business",
      projectSummary: "A business consulting concept designed to help a company identify Standard opportunities, develop a strategic plan, and achieve measurable results.",
      servicesIncluded: ["Business assessment", "Standard strategy", "Action plan", "Implementation roadmap", "Performance metrics", "Quarterly reviews"],
      portfolioCardText: "A business consulting concept built to help companies develop clear strategies, overcome challenges, and achieve sustainable Standard."
    }
  },
  'virtual-assistant': {
    title: 'Virtual Assistant Services',
    category: 'Operations & Support',
    icon: <FaHeadset />,
    intro: 'Administrative and operational tasks can take valuable time away from strategic work and business Standard.',
    description: 'Virtual assistants help businesses manage routine tasks efficiently, allowing business owners and teams to focus on higher-priority responsibilities.',
    longDescription: 'Scale Link Alliance provides professional virtual assistant services that support day-to-day business operations, administrative tasks, and organizational workflows.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 178, ordersInQueue: 8, verified: true },
    whatItHelpsAchieve: ['reduce administrative workload', 'improve task organization and efficiency', 'support daily operational activities', 'manage communication and scheduling', 'free up time for business owners to focus on Standard'],
    howMeasured: ['number of hours provided per month', 'scope of administrative tasks', 'level of coordination required', 'complexity of support activities'],
    servicesInclude: ['Email management', 'Calendar scheduling', 'Data entry', 'Administrative coordination', 'Customer support assistance'],
    tools: ['Google Workspace', 'Microsoft Office', 'Slack', 'Trello', 'Asana'],
    complementaryServices: [
      { name: 'Data Entry', reason: 'database management' },
      { name: 'Project Management', reason: 'task coordination' },
      { name: 'Process Documentation', reason: 'workflow standardization' },
      { name: 'Lead Generation', reason: 'outreach support' },
      { name: 'Customer Support', reason: 'client communication' }
    ],
    packages: {
      starter: { name: 'Starter VA', price: '$199/month', description: 'Up to 10 hours per month.', includes: ['Up to 10 hours per month', 'Basic administrative tasks', 'Calendar support', 'Data organization', 'Basic research', 'Document formatting', 'Routine email assistance'] },
      Standard: { name: 'Standard VA', price: '$499/month', description: 'Up to 25 hours per month.', includes: ['Up to 25 hours per month', 'Everything in Starter', 'CRM updates', 'Customer follow-up support', 'Content scheduling', 'Reporting assistance', 'Process support', 'Recurring administrative workflows'] },
      premium: { name: 'Premium VA', price: '$899/month', description: 'Up to 50 hours per month.', includes: ['Up to 50 hours per month', 'Advanced administrative support', 'CRM management', 'Customer-service support', 'Research', 'Reporting', 'Content administration', 'Project coordination', 'Recurring operations support'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Up to 10 hours per month', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic administrative tasks', values: { basic: true, standard: true, premium: true } },
        { label: 'Calendar support', values: { basic: true, standard: true, premium: true } },
        { label: 'Data organization', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic research', values: { basic: true, standard: true, premium: true } },
        { label: 'Document formatting', values: { basic: true, standard: true, premium: true } },
        { label: 'Routine email assistance', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 25 hours per month', values: { basic: false, standard: true, premium: true } },
        { label: 'CRM updates', values: { basic: false, standard: true, premium: true } },
        { label: 'Customer follow-up support', values: { basic: false, standard: true, premium: true } },
        { label: 'Content scheduling', values: { basic: false, standard: true, premium: true } },
        { label: 'Reporting assistance', values: { basic: false, standard: true, premium: true } },
        { label: 'Process support', values: { basic: false, standard: true, premium: true } },
        { label: 'Recurring administrative workflows', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 50 hours per month', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced administrative support', values: { basic: false, standard: false, premium: true } },
        { label: 'CRM management', values: { basic: false, standard: false, premium: true } },
        { label: 'Customer-service support', values: { basic: false, standard: false, premium: true } },
        { label: 'Research', values: { basic: false, standard: false, premium: true } },
        { label: 'Reporting', values: { basic: false, standard: false, premium: true } },
        { label: 'Content administration', values: { basic: false, standard: false, premium: true } },
        { label: 'Project coordination', values: { basic: false, standard: false, premium: true } },
        { label: 'Recurring operations support', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$199/month', packageName: 'Starter VA', shortDescription: 'Up to 10 hours per month, basic admin support', description: 'Up to 10 hours per month.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 10 hours per month', 'Basic administrative tasks', 'Calendar support', 'Data organization', 'Basic research', 'Document formatting', 'Routine email assistance'] },
        standard: { price: '$499/month', packageName: 'Standard VA', shortDescription: 'Up to 25 hours per month, CRM updates', description: 'Up to 25 hours per month.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 25 hours per month', 'Everything in Starter', 'CRM updates', 'Customer follow-up support', 'Content scheduling', 'Reporting assistance', 'Process support', 'Recurring administrative workflows'] },
        premium: { price: '$899/month', packageName: 'Premium VA', shortDescription: 'Up to 50 hours per month, advanced admin support', description: 'Up to 50 hours per month.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 50 hours per month', 'Advanced administrative support', 'CRM management', 'Customer-service support', 'Research', 'Reporting', 'Content administration', 'Project coordination', 'Recurring operations support'] }
      }
    },
    sampleProject: {
      projectName: "AdminEase Support System",
      businessType: "Consultant / small business owner",
      projectSummary: "A virtual assistant support concept designed to help a busy business owner save time by organizing daily tasks, communication, and follow-ups.",
      servicesIncluded: ["Email management", "Appointment scheduling", "Research", "Data entry", "Customer follow-ups", "Weekly task reporting"],
      portfolioCardText: "A virtual assistant support concept built to handle admin tasks, scheduling, inbox management, and customer follow-ups."
    }
  },
  'project-management': {
    title: 'Project Management Support',
    category: 'Operations & Support',
    icon: <FaProjectDiagram />,
    intro: 'Successful projects require organization, coordination, and clear communication between team members and stakeholders.',
    description: 'Without proper project management, deadlines can be missed, responsibilities may become unclear, and project goals can be difficult to achieve.',
    longDescription: 'Scale Link Alliance provides project management support services that help businesses plan, organize, and oversee projects to ensure they are completed efficiently and on schedule.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.7, reviews: 62, ordersInQueue: 4, verified: true },
    whatItHelpsAchieve: ['keep projects organized and on schedule', 'coordinate tasks and team responsibilities', 'improve communication across teams', 'track project progress and milestones', 'ensure project objectives are completed successfully'],
    howMeasured: ['number of projects or phases managed', 'project complexity', 'level of coordination required', 'reporting and oversight responsibilities'],
    servicesInclude: ['Project planning and scheduling', 'Task coordination', 'Progress tracking', 'Team communication support', 'Project reporting'],
    tools: ['Asana', 'Trello', 'Monday.com', 'ClickUp', 'Jira', 'Basecamp'],
    complementaryServices: [
      { name: 'Process Documentation & SOP Development', reason: 'structured workflows' },
      { name: 'Virtual Assistant Services', reason: 'task execution support' },
      { name: 'Data Analytics & Reporting', reason: 'project performance tracking' },
      { name: 'CRM & Marketing Automation', reason: 'project automation tools' },
      { name: 'Website Development or Marketing Services', reason: 'projects being implemented' }
    ],
    packages: {
      starter: { name: 'Starter PM Support', price: '$499/month', description: 'Up to 10 hours per month.', includes: ['Up to 10 hours per month', 'Project tracking', 'Task organization', 'Deadline tracking', 'Basic status reports', 'Team follow-up', 'One weekly coordination touchpoint'] },
      Standard: { name: 'Standard PM Support', price: '$1,199/month', description: 'Up to 25 hours per month.', includes: ['Up to 25 hours per month', 'Project planning', 'Task management', 'Team coordination', 'Risk/issue tracking', 'Weekly reporting', 'Meeting coordination', 'Documentation', 'Stakeholder updates'] },
      premium: { name: 'Premium Fractional PM', price: '$2,499/month', description: 'Up to 50 hours per month.', includes: ['Up to 50 hours per month', 'Multi-workstream coordination', 'Project planning', 'Schedule management', 'Risk management', 'Stakeholder management', 'Team coordination', 'Weekly reporting', 'Project documentation', 'Leadership updates', 'Continuous project oversight'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Up to 10 hours per month', values: { basic: true, standard: true, premium: true } },
        { label: 'Project tracking', values: { basic: true, standard: true, premium: true } },
        { label: 'Task organization', values: { basic: true, standard: true, premium: true } },
        { label: 'Deadline tracking', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic status reports', values: { basic: true, standard: true, premium: true } },
        { label: 'Team follow-up', values: { basic: true, standard: true, premium: true } },
        { label: 'One weekly coordination touchpoint', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 25 hours per month', values: { basic: false, standard: true, premium: true } },
        { label: 'Project planning', values: { basic: false, standard: true, premium: true } },
        { label: 'Task management', values: { basic: false, standard: true, premium: true } },
        { label: 'Team coordination', values: { basic: false, standard: true, premium: true } },
        { label: 'Risk/issue tracking', values: { basic: false, standard: true, premium: true } },
        { label: 'Weekly reporting', values: { basic: false, standard: true, premium: true } },
        { label: 'Meeting coordination', values: { basic: false, standard: true, premium: true } },
        { label: 'Documentation', values: { basic: false, standard: true, premium: true } },
        { label: 'Stakeholder updates', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 50 hours per month', values: { basic: false, standard: false, premium: true } },
        { label: 'Multi-workstream coordination', values: { basic: false, standard: false, premium: true } },
        { label: 'Schedule management', values: { basic: false, standard: false, premium: true } },
        { label: 'Risk management', values: { basic: false, standard: false, premium: true } },
        { label: 'Stakeholder management', values: { basic: false, standard: false, premium: true } },
        { label: 'Project documentation', values: { basic: false, standard: false, premium: true } },
        { label: 'Leadership updates', values: { basic: false, standard: false, premium: true } },
        { label: 'Continuous project oversight', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$499/month', packageName: 'Starter PM Support', shortDescription: 'Up to 10 hours per month, project tracking', description: 'Up to 10 hours per month.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 10 hours per month', 'Project tracking', 'Task organization', 'Deadline tracking', 'Basic status reports', 'Team follow-up', 'One weekly coordination touchpoint'] },
        standard: { price: '$1,199/month', packageName: 'Standard PM Support', shortDescription: 'Up to 25 hours per month, project planning', description: 'Up to 25 hours per month.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 25 hours per month', 'Project planning', 'Task management', 'Team coordination', 'Risk/issue tracking', 'Weekly reporting', 'Meeting coordination', 'Documentation', 'Stakeholder updates'] },
        premium: { price: '$2,499/month', packageName: 'Premium Fractional PM', shortDescription: 'Up to 50 hours per month, multi-workstream coordination', description: 'Up to 50 hours per month.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 50 hours per month', 'Multi-workstream coordination', 'Project planning', 'Schedule management', 'Risk management', 'Stakeholder management', 'Team coordination', 'Weekly reporting', 'Project documentation', 'Leadership updates', 'Continuous project oversight'] }
      }
    },
    sampleProject: {
      projectName: "ProjectFlow Team Coordination System",
      businessType: "Service-based business / agency",
      projectSummary: "A project management support concept designed to help a business organize tasks, deadlines, team responsibilities, and project progress.",
      projectGoal: "Help the business manage projects more smoothly, reduce confusion, and keep team members aligned from start to finish.",
      servicesIncluded: ["Task board setup", "Project timeline creation", "Milestone tracking", "Team assignment structure", "Progress updates", "Communication process", "Document organization", "Reporting support"],
      portfolioCardText: "A project management concept built to help businesses organize tasks, manage deadlines, and keep projects moving efficiently."
    }
  },
  'process-documentation': {
    title: 'Process Documentation & SOP Development',
    category: 'Operations & Support',
    icon: <FaFileAlt />,
    intro: 'Clear processes are essential for businesses that want to operate efficiently and scale effectively.',
    description: 'When workflows are undocumented, tasks become inconsistent, training takes longer, and operational mistakes are more likely.',
    longDescription: 'Scale Link Alliance provides Process Documentation and Standard Operating Procedure (SOP) development services that help businesses organize their workflows, create structured procedures, and ensure tasks can be performed consistently by teams or future hires.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 45, ordersInQueue: 2, verified: true },
    whatItHelpsAchieve: ['standardize workflows and procedures', 'improve team efficiency', 'simplify employee training', 'reduce operational errors', 'create systems that support business Standard'],
    howMeasured: ['number of workflows documented', 'complexity of business processes', 'depth of documentation required', 'inclusion of workflow diagrams or guides'],
    servicesInclude: ['Workflow mapping', 'SOP documentation', 'Process improvement recommendations', 'Operational guidelines', 'Process diagrams'],
    tools: ['Notion', 'Process Street', 'LucidChart', 'Google Docs', 'Trainual'],
    complementaryServices: [
      { name: 'Project Management Support', reason: 'implement documented workflows' },
      { name: 'Virtual Assistant Services', reason: 'execute operational tasks' },
      { name: 'CRM & Marketing Automation', reason: 'automate processes' },
      { name: 'Data Analytics & Reporting', reason: 'measure operational performance' },
      { name: 'Data Entry & Processing', reason: 'manage workflow data' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$399', description: 'Documenting a single workflow.', includes: ['Up to 3 SOPs', 'Up to approximately 15 total finished pages', 'Process review', 'Step-by-step documentation', 'Basic formatting', 'One revision round'] },
      Standard: { name: 'Standard Package', price: '$999', description: 'Organizing multiple operational procedures.', includes: ['Up to 8 SOPs', 'Up to approximately 40 total finished pages', 'Process interviews', 'Workflow documentation', 'Roles/responsibilities', 'Templates/checklists where applicable', 'Standardized formatting', 'Two revision rounds'] },
      premium: { name: 'Premium Package', price: '$2,499', description: 'Building a full operational framework.', includes: ['Up to 20 SOPs', 'Up to approximately 100 total finished pages', 'Stakeholder interviews', 'Process mapping', 'Roles and responsibility documentation', 'Operational checklists', 'Templates', 'Documentation structure', 'Implementation recommendations', 'Up to 3 revision rounds'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Up to 3 SOPs', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to approximately 15 total finished pages', values: { basic: true, standard: true, premium: true } },
        { label: 'Process review', values: { basic: true, standard: true, premium: true } },
        { label: 'Step-by-step documentation', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic formatting', values: { basic: true, standard: true, premium: true } },
        { label: 'One revision round', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 8 SOPs', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to approximately 40 total finished pages', values: { basic: false, standard: true, premium: true } },
        { label: 'Process interviews', values: { basic: false, standard: true, premium: true } },
        { label: 'Workflow documentation', values: { basic: false, standard: true, premium: true } },
        { label: 'Roles/responsibilities', values: { basic: false, standard: true, premium: true } },
        { label: 'Templates/checklists where applicable', values: { basic: false, standard: true, premium: true } },
        { label: 'Standardized formatting', values: { basic: false, standard: true, premium: true } },
        { label: 'Two revision rounds', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 20 SOPs', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to approximately 100 total finished pages', values: { basic: false, standard: false, premium: true } },
        { label: 'Stakeholder interviews', values: { basic: false, standard: false, premium: true } },
        { label: 'Process mapping', values: { basic: false, standard: false, premium: true } },
        { label: 'Roles and responsibility documentation', values: { basic: false, standard: false, premium: true } },
        { label: 'Operational checklists', values: { basic: false, standard: false, premium: true } },
        { label: 'Templates', values: { basic: false, standard: false, premium: true } },
        { label: 'Documentation structure', values: { basic: false, standard: false, premium: true } },
        { label: 'Implementation recommendations', values: { basic: false, standard: false, premium: true } },
        { label: 'Up to 3 revision rounds', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$399', packageName: 'Starter Package', shortDescription: 'Up to 3 SOPs, approx. 15 finished pages', description: 'Documenting a single workflow.', deliveryLabel: 'Shown during service selection', revisions: 'One revision round', includes: ['Up to 3 SOPs', 'Up to approximately 15 total finished pages', 'Process review', 'Step-by-step documentation', 'Basic formatting', 'One revision round'] },
        standard: { price: '$999', packageName: 'Standard Package', shortDescription: 'Up to 8 SOPs, approx. 40 finished pages', description: 'Organizing multiple operational procedures.', deliveryLabel: 'Shown during service selection', revisions: 'Two revision rounds', includes: ['Up to 8 SOPs', 'Up to approximately 40 total finished pages', 'Process interviews', 'Workflow documentation', 'Roles/responsibilities', 'Templates/checklists where applicable', 'Standardized formatting', 'Two revision rounds'] },
        premium: { price: '$2,499', packageName: 'Premium Package', shortDescription: 'Up to 20 SOPs, approx. 100 finished pages', description: 'Building a full operational framework.', deliveryLabel: 'Shown during service selection', revisions: 'Up to 3 revision rounds', includes: ['Up to 20 SOPs', 'Up to approximately 100 total finished pages', 'Stakeholder interviews', 'Process mapping', 'Roles and responsibility documentation', 'Operational checklists', 'Templates', 'Documentation structure', 'Implementation recommendations', 'Up to 3 revision rounds'] }
      }
    },
    sampleProject: {
      projectName: "SOPBuilder Documentation System",
      businessType: "Growing small business",
      projectSummary: "A process documentation concept designed to help a business organize its operations, create standard procedures, and build systems that support Standard.",
      servicesIncluded: ["Workflow mapping", "SOP documentation", "Process diagrams", "Training materials", "Operations manual", "Process improvement recommendations"],
      portfolioCardText: "A process documentation concept built to help businesses standardize operations, improve efficiency, and scale with confidence."
    }
  },
  'data-entry': {
    title: 'Data Entry & Processing',
    category: 'Operations & Support',
    icon: <FaDatabase />,
    intro: 'Accurate and organized data is essential for efficient business operations.',
    description: 'However, managing large volumes of information can be time-consuming and take focus away from higher-value activities.',
    longDescription: 'Scale Link Alliance provides data entry and processing services that help businesses organize, update, and manage information efficiently. Our team ensures data is entered accurately, formatted properly, and maintained in a structured system that supports your business operations.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.7, reviews: 89, ordersInQueue: 6, verified: true },
    whatItHelpsAchieve: ['organize business information efficiently', 'maintain accurate records and databases', 'reduce administrative workload', 'improve data accessibility and management', 'support operational and reporting processes'],
    howMeasured: ['number of records processed', 'complexity of data structure', 'level of formatting required', 'system or database used'],
    servicesInclude: ['Database management', 'Data cleansing and validation', 'Spreadsheet organization', 'Record keeping', 'Data migration'],
    tools: ['Excel', 'Google Sheets', 'Airtable', 'Monday.com', 'CRM systems'],
    complementaryServices: [
      { name: 'CRM & Marketing Automation', reason: 'organize and automate data' },
      { name: 'Data Analytics & Reporting', reason: 'analyze business data' },
      { name: 'Virtual Assistant Services', reason: 'administrative support' },
      { name: 'Process Documentation & SOP Development', reason: 'standardize workflows' },
      { name: 'Lead Generation Services', reason: 'expand business databases' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$99', description: 'Small administrative data tasks.', includes: ['Up to 500 straightforward records', 'Data entry', 'Basic formatting', 'Basic duplicate review', 'Basic quality check', 'One agreed data source/output format'] },
      Standard: { name: 'Standard Package', price: '$299', description: 'Businesses managing larger datasets.', includes: ['Up to 2,000 straightforward records', 'Data entry', 'Data cleanup', 'Formatting', 'Duplicate detection', 'Categorization', 'Quality review', 'Up to 2 output formats'] },
      premium: { name: 'Premium Package', price: '$699/month', description: 'Recurring monthly data processing.', includes: ['Up to 5,000 straightforward records per month', 'Recurring processing', 'Data cleanup', 'Categorization', 'Formatting', 'Quality-control checks', 'Regular status reporting'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Up to 500 straightforward records', values: { basic: true, standard: true, premium: true } },
        { label: 'Data entry', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic formatting', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic duplicate review', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic quality check', values: { basic: true, standard: true, premium: true } },
        { label: 'One agreed data source/output format', values: { basic: true, standard: true, premium: true } },
        { label: 'Up to 2,000 straightforward records', values: { basic: false, standard: true, premium: true } },
        { label: 'Data cleanup', values: { basic: false, standard: true, premium: true } },
        { label: 'Formatting', values: { basic: false, standard: true, premium: true } },
        { label: 'Duplicate detection', values: { basic: false, standard: true, premium: true } },
        { label: 'Categorization', values: { basic: false, standard: true, premium: true } },
        { label: 'Quality review', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 2 output formats', values: { basic: false, standard: true, premium: true } },
        { label: 'Up to 5,000 straightforward records per month', values: { basic: false, standard: false, premium: true } },
        { label: 'Recurring processing', values: { basic: false, standard: false, premium: true } },
        { label: 'Quality-control checks', values: { basic: false, standard: false, premium: true } },
        { label: 'Regular status reporting', values: { basic: false, standard: false, premium: true } },
      ],
      details: {
        basic: { price: '$99', packageName: 'Starter Package', shortDescription: 'Up to 500 records, basic formatting', description: 'Small administrative data tasks.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Up to 500 straightforward records', 'Data entry', 'Basic formatting', 'Basic duplicate review', 'Basic quality check', 'One agreed data source/output format'] },
        standard: { price: '$299', packageName: 'Standard Package', shortDescription: 'Up to 2,000 records, cleanup and categorization', description: 'Businesses managing larger datasets.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['Up to 2,000 straightforward records', 'Data entry', 'Data cleanup', 'Formatting', 'Duplicate detection', 'Categorization', 'Quality review', 'Up to 2 output formats'] },
        premium: { price: '$699/month', packageName: 'Premium Package', shortDescription: 'Up to 5,000 records/month, recurring processing', description: 'Recurring monthly data processing.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['Up to 5,000 straightforward records per month', 'Recurring processing', 'Data cleanup', 'Categorization', 'Formatting', 'Quality-control checks', 'Regular status reporting'] }
      }
    },
    sampleProject: {
      projectName: "DataClean Processing Support",
      businessType: "Administrative / operations-focused business",
      projectSummary: "A data entry and processing concept created to help a business organize, clean, update, and manage important information accurately.",
      projectGoal: "Help the business save time, reduce errors, and maintain clean records for customers, products, leads, reports, or internal operations.",
      servicesIncluded: ["Data entry", "Spreadsheet organization", "Contact list cleanup", "CRM data updates", "Product data entry", "Document processing", "File organization", "Data formatting", "Quality checks"],
      portfolioCardText: "A data processing concept built to help businesses organize information, reduce manual workload, and keep records accurate."
    }
  }
};

// ─── SEO META (from ScaleLink SEO doc) ───
const SEO_META = {
  'website-development': { title: 'Website Development Services for Businesses | ScaleLink Alliance', description: 'Build a professional, responsive and conversion-focused business website with ScaleLink Alliance website design and development services.', keywords: 'website development services, business website development, custom website development, professional website design, small business website development, responsive web development' },
  'seo-marketing': { title: 'SEO Services for Businesses | ScaleLink Alliance', description: 'Increase search visibility and qualified website traffic with ScaleLink Alliance SEO services, including technical SEO, content, keywords and optimization.', keywords: 'SEO services for businesses, small business SEO services, search engine optimization services, technical SEO services, on-page SEO, SEO consulting, organic search marketing' },
  'lead-generation': { title: 'Lead Generation Services for Businesses | ScaleLink Alliance', description: 'Generate more qualified business opportunities through strategic lead generation campaigns, landing pages, search marketing and automated follow-up.', keywords: 'lead generation services, B2B lead generation services, online lead generation, business lead generation, qualified leads, digital lead generation, customer acquisition services' },
  'landing-pages': { title: 'Landing Page & Sales Funnel Development | ScaleLink Alliance', description: 'Convert more visitors into leads and customers with professionally designed landing pages and sales funnels built around your campaign goals.', keywords: 'landing page design services' },
  'crm-automation': { title: 'CRM & Marketing Automation Services | ScaleLink Alliance', description: 'Automate lead management, follow-up, customer communication and business workflows with CRM and marketing automation from ScaleLink Alliance.', keywords: 'CRM automation services' },
  'api-integration': { title: 'API Integration Services for Businesses | ScaleLink Alliance', description: 'Connect your websites, CRMs, payment systems, marketing tools and business software with custom API integration services from ScaleLink Alliance.', keywords: 'API integration services, business API integration, CRM integration services, software integration, website API integration, custom API development, system integration' },
  'ai-automation': { title: 'AI & Business Automation Services | ScaleLink Alliance', description: 'Automate repetitive work, customer communication, lead handling and business workflows with practical AI automation solutions.', keywords: 'AI automation services for businesses' },
  'web-applications': { title: 'Custom Web Application Development | ScaleLink Alliance', description: 'Build custom business web applications, client portals, dashboards and SaaS platforms with ScaleLink Alliance development services.', keywords: 'custom web application development' },
  'ecommerce-development': { title: 'E-commerce Website Development | ScaleLink Alliance', description: 'Build an online store designed to sell, with product setup, checkout, payments and conversion optimization built in.', keywords: 'ecommerce development services' },
  'email-marketing': { title: 'Email Marketing & Automation Services | ScaleLink Alliance', description: 'Turn leads into customers with strategic email campaigns, automation, segmentation and reporting from ScaleLink Alliance.', keywords: 'email marketing services' },
  'paid-advertising': { title: 'PPC & Paid Advertising Management | ScaleLink Alliance', description: 'Paid advertising designed to generate qualified opportunities through Google Ads, Microsoft Ads and conversion-focused campaigns.', keywords: 'PPC management services' },
  'data-analytics': { title: 'Business Data Analytics Services | ScaleLink Alliance', description: 'Turn business data into better decisions with reporting, dashboards, marketing analytics and performance tracking.', keywords: 'business data analytics services' },
  'graphic-design': { title: 'Business Graphic Design Services | ScaleLink Alliance', description: 'Professional visual design for marketing graphics, social media, advertising creative and sales materials.', keywords: 'graphic design services for businesses' },
  'brand-identity': { title: 'Brand Identity & Logo Design | ScaleLink Alliance', description: 'Build a brand customers recognize and remember with logo design, brand identity systems and guidelines.', keywords: 'brand identity design services' },
  'copywriting': { title: 'Copywriting & Content Creation | ScaleLink Alliance', description: 'Content designed to inform, persuade and convert — website copy, SEO content, sales copy and more.', keywords: 'business copywriting services' },
  'video-editing': { title: 'Video Editing & Motion Graphics | ScaleLink Alliance', description: 'Professional video content built for your brand, from social clips to full promotional videos.', keywords: 'business video editing services' },
  'photography': { title: 'Business Photography Services | ScaleLink Alliance', description: 'Visual assets that strengthen your brand — website imagery, product visuals and promotional photography.', keywords: 'business photography services' },
  'website-maintenance': { title: 'Website Maintenance & Support | ScaleLink Alliance', description: 'Keep your business website secure, updated and working with ongoing maintenance and support.', keywords: 'website maintenance services' },
  'virtual-assistant': { title: 'Virtual Assistant Services for Businesses | ScaleLink Alliance', description: 'Reliable business support without adding full-time overhead — administrative, CRM, and customer support help.', keywords: 'virtual assistant services for businesses' },
  'data-entry': { title: 'Business Data Entry Services | ScaleLink Alliance', description: 'Accurate data processing for your business, from records entry to cleanup and categorization.', keywords: 'business data entry services' },
};

// ─── HELPER FUNCTIONS ───
const getServiceImages = (slug) => {
  const entry = SERVICE_IMAGES[slug];
  const fallback = {
    main: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop'
    ]
  };
  const localGallery = SERVICE_GALLERY_LOCAL[slug];
  return {
    main: entry?.main || fallback.main,
    gallery: (localGallery && localGallery.length > 0) ? localGallery : (entry?.gallery || fallback.gallery)
  };
};

const optimizeImage = (url, width, quality = 75) => {
  if (!url) return url;
  if (url.includes('images.unsplash.com')) return url;
  if (url.startsWith('/images/')) return url;
  const encoded = encodeURIComponent(url);
  return `https://images.weserv.nl/?url=${encoded}&w=${width}&q=${quality}&output=webp&fit=cover`;
};

const getServiceSlug = (serviceName) => {
  const slugMap = {
    'Brand Identity & Logo Design': 'brand-identity',
    'Copywriting & Content Creation': 'copywriting',
    'Social Media Management': 'social-media-management',
    'Website Development': 'website-development',
    'Video Editing & Motion Graphics': 'video-editing',
    'Graphic Design': 'graphic-design',
    'Photography & Visual Assets': 'photography',
    'Paid Advertising Management': 'paid-advertising',
    'Landing Page Development': 'landing-pages',
    'SEO & Search Marketing': 'seo-marketing',
    'Email Marketing Campaigns': 'email-marketing',
    'Lead Generation Services': 'lead-generation',
    'CRM & Marketing Automation': 'crm-automation',
    'API Integration & Automation': 'api-integration',
    'Web Applications & SaaS Development': 'web-applications',
    'Data Analytics & Reporting': 'data-analytics',
    'Process Documentation & SOP Development': 'process-documentation',
    'Virtual Assistant Services': 'virtual-assistant',
    'Project Management Support': 'project-management',
    'Data Entry & Processing': 'data-entry',
    'Website Maintenance & Updates': 'website-maintenance',
    'E-Commerce Development': 'ecommerce-development',
    'Landing Pages & Sales Funnels': 'landing-pages',
    'UI/UX Graphic Design': 'graphic-design',
    'AI Automation & Smart Business Systems': 'ai-automation',
    'Online Booking Systems': 'online-booking-systems',
    'Reputation & Review Management': 'reputation-review-management',
    'Business Process Automation': 'business-process-automation',
    'Business Consulting & Standard Strategy': 'business-consulting-Standard-strategy'
  };
  return slugMap[serviceName] || serviceName.toLowerCase().replace(/[&\s]/g, '-').replace(/--+/g, '-');
};

// ─── Matches an add-on option's free text to a real service, if one exists ───
const ADDON_MATCH_KEYWORDS = {
  'brand-identity': ['brand identity', 'logo design', 'logo concept'],
  'graphic-design': ['graphic design', 'design assets', 'social media design templates', 'infographic design', 'presentation design', 'marketing material design'],
  'copywriting': ['copywriting', 'blog content', 'sales page copywriting', 'website rewrite', 'editing and proofreading', 'email marketing sequences'],
  'photography': ['photography', 'product staging', 'lifestyle photography', 'photo retouching', 'background removal', 'image libraries'],
  'video-editing': ['subtitles and captions', 'youtube optimization', 'animated logo intros', 'video scripting', 'thumbnail graphics'],
  'website-development': ['website content writing', 'website maintenance plans'],
  'website-maintenance': ['website backups', 'website performance audits', 'technical troubleshooting'],
  'seo-marketing': ['seo', 'local seo', 'competitor keyword analysis', 'seo content strategy', 'technical seo audits'],
  'landing-pages': ['landing page', 'a/b testing for conversions'],
  'ecommerce-development': ['inventory automation', 'product description copywriting'],
  'crm-automation': ['crm setup', 'lead scoring', 'pipeline tracking', 'analytics dashboards', 'marketing automation workflows'],
  'api-integration': ['api integration', 'crm integration', 'system integrations'],
  'email-marketing': ['email list Standard', 'newsletter design', 'automated email sequences'],
  'lead-generation': ['outreach templates', 'follow-up sequences', 'lead enrichment'],
  'data-analytics': ['automated reporting dashboards', 'campaign performance tracking', 'customer behavior analysis'],
  'social-media-management': ['social media advertising', 'short-form video content', 'content calendar planning', 'influencer outreach'],
  'paid-advertising': ['ad creative design', 'conversion tracking', 'budget optimization'],
  'virtual-assistant': ['travel booking', 'document preparation', 'meeting scheduling', 'inbox management'],
  'process-documentation': ['team training documentation', 'onboarding process documentation', 'knowledge base development'],
  'data-entry': ['crm database cleanup', 'data migration', 'document digitization'],
};

const matchAddOnToServiceSlug = (addOnText) => {
  const lower = addOnText.toLowerCase();
  for (const [slug, keywords] of Object.entries(ADDON_MATCH_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return slug;
  }
  return null;
};

const renderStars = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating || 0)) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
    } else if (i < Math.ceil(rating || 0) && (rating || 0) % 1 >= 0.5) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-sm opacity-50" />);
    } else {
      stars.push(<FaStar key={i} className="text-gray-300 text-sm" />);
    }
  }
  return stars;
};

// ─── LAZY IMAGE ───
const LazyImg = ({ src, alt, className, width, height }) => {
  const ref = React.useRef(null);
  const [inView, setInView] = useState(false);

  React.useEffect(() => {
    if (!ref.current || inView) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '150px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <img
      ref={ref}
      src={inView ? src : undefined}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      className={className}
    />
  );
};

// ─── IMAGE GALLERY COMPONENT ───
const ImageGallery = ({ images, serviceTitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];

  const nextImage = () => {
    if (safeImages.length < 2) return;
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = () => {
    if (safeImages.length < 2) return;
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  useEffect(() => {
    if (!isViewerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsViewerOpen(false);
      if (event.key === 'ArrowRight') nextImage();
      if (event.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isViewerOpen, safeImages.length]);

  if (!safeImages.length) return null;

  const currentImage = safeImages[currentIndex];

  return (
    <>
      <section className="w-full min-w-0" aria-label={`${serviceTitle} gallery`}>
        <button
          type="button"
          onClick={() => setIsViewerOpen(true)}
          className="group relative block w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label={`Open ${serviceTitle} image ${currentIndex + 1}`}
        >
          <div className="relative aspect-[16/9] w-full min-h-[180px] sm:min-h-[220px] md:min-h-[280px] lg:min-h-[320px] max-h-[520px]">
            <img
              src={optimizeImage(currentImage, 1000, 78)}
              alt={`${serviceTitle} preview ${currentIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading={currentIndex === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex items-end justify-between gap-3">
              <span className="inline-flex items-center rounded-full bg-black/65 backdrop-blur-sm px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-white">
                Click to view full image
              </span>

              {safeImages.length > 1 && (
                <span className="shrink-0 rounded-full bg-black/65 backdrop-blur-sm px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white">
                  {currentIndex + 1} / {safeImages.length}
                </span>
              )}
            </div>
          </div>
        </button>

        {safeImages.length > 1 && (
          <div className="mt-3 flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={prevImage}
              className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white shadow-sm text-slate-700 flex items-center justify-center hover:bg-slate-50"
              aria-label="Previous image"
            >
              <FaChevronLeft size={13} />
            </button>

            <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              <div className="flex gap-2 w-max pr-1">
                {safeImages.map((image, index) => (
                  <button
                    type="button"
                    key={`${index}-${image}`}
                    onClick={() => setCurrentIndex(index)}
                    className={`shrink-0 w-16 h-10 sm:w-20 sm:h-12 rounded-lg overflow-hidden border-2 ${
                      index === currentIndex
                        ? 'border-blue-600 ring-2 ring-blue-100'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                    aria-label={`Select image ${index + 1}`}
                  >
                    <img
                      src={optimizeImage(image, 120, 70)}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={nextImage}
              className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white shadow-sm text-slate-700 flex items-center justify-center hover:bg-slate-50"
              aria-label="Next image"
            >
              <FaChevronRight size={13} />
            </button>
          </div>
        )}
      </section>

      <AnimatePresence>
        {isViewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-sm p-3 sm:p-5 md:p-8 flex items-center justify-center"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsViewerOpen(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`${serviceTitle} image viewer`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.985, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-7xl min-w-0"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="truncate text-sm sm:text-base font-semibold text-white">{serviceTitle}</p>
                  <p className="text-[10px] sm:text-xs text-white/50">
                    {currentIndex + 1} of {safeImages.length}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsViewerOpen(false)}
                  className="shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center"
                  aria-label="Close image viewer"
                >
                  <FaTimes size={17} />
                </button>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <div className="max-h-[78vh] min-h-[240px] overflow-auto flex items-center justify-center p-1 sm:p-3">
                  <img
                    src={optimizeImage(currentImage, 1800, 88)}
                    alt={`${serviceTitle} full image ${currentIndex + 1}`}
                    className="block max-w-full max-h-[75vh] w-auto h-auto object-contain"
                    loading="eager"
                    decoding="async"
                  />
                </div>

                {safeImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/55 hover:bg-black/75 border border-white/10 text-white flex items-center justify-center"
                      aria-label="Previous image"
                    >
                      <FaChevronLeft />
                    </button>

                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/55 hover:bg-black/75 border border-white/10 text-white flex items-center justify-center"
                      aria-label="Next image"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </div>

              <p className="mt-2 text-center text-[10px] sm:text-xs text-white/40">
                Press Esc or click outside to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── MAIN COMPONENT ───
const ServiceDetailPage = () => {
  const { serviceSlug } = useParams();
  const [backendService, setBackendService] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchBackendService = async () => {
      try {
        const res = await fetch(`/api/cms/services/${serviceSlug}`);
        if (res.ok) {
          const data = await res.json();
          const svc = (data && data.id) ? data : (data?.service || null);
          if (isMounted && svc) {
            setBackendService(svc);
          }
        }
      } catch (err) {
        console.warn('Using local fallback for service details:', err);
      }
    };

    if (serviceSlug) {
      fetchBackendService();
    }

    const unsubscribe = subscribeToServiceUpdates((payload) => {
      if (serviceSlug) {
        fetchBackendService();
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [serviceSlug]);

  const staticService = SERVICES_DATA[serviceSlug];
  const service = backendService ? {
    ...backendService,
    title: backendService.title,
    category: (backendService.category || '').replace(/-/g, ' '),
    icon: getServiceIcon(backendService.iconName, { size: 20 }),
    whatItHelpsAchieve: Array.isArray(backendService.whatItHelpsAchieve) ? backendService.whatItHelpsAchieve : (staticService ? staticService.whatItHelpsAchieve : []),
    howMeasured: Array.isArray(backendService.howMeasured) ? backendService.howMeasured : (staticService ? staticService.howMeasured : []),
    servicesInclude: Array.isArray(backendService.servicesInclude) ? backendService.servicesInclude : (staticService ? staticService.servicesInclude : []),
    tools: Array.isArray(backendService.tools) ? backendService.tools : (staticService ? staticService.tools : []),
    complementaryServices: Array.isArray(backendService.complementaryServices) ? backendService.complementaryServices : (staticService ? staticService.complementaryServices : []),
    packages: (backendService.packages && Object.keys(backendService.packages).length > 0)
      ? backendService.packages
      : (staticService ? staticService.packages : {}),
    packageComparison: backendService.packageComparison || (staticService ? staticService.packageComparison : null),
    sampleProject: backendService.sampleProject || (staticService ? staticService.sampleProject : null),
    sellerInfo: backendService.sellerInfo || (staticService ? staticService.sellerInfo : { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.9, reviews: 150, ordersInQueue: 4, verified: true })
  } : staticService;
  useEffect(() => {
    if (!service) return;
    const meta = SEO_META[serviceSlug];
    document.title = meta?.title || `${service.title} | ScaleLink Alliance`;

    const setMeta = (name, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('description', meta?.description || service.intro);
    setMeta('keywords', meta?.keywords);
  }, [serviceSlug, service]);
  const [selectedPackage, setSelectedPackage] = useState('starter');
  const [showIncludes, setShowIncludes] = useState(true);

  // Always show "What's Included" the moment a package tab is chosen
  const selectPackage = (pkgKey) => {
    setSelectedPackage(pkgKey);
    setShowIncludes(true);
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Service Not Found</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">The requested service could not be located.</p>
          <Link to="/services" className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
            Browse All Services
          </Link>
        </div>
      </div>
    );
  }

  const baseImages = getServiceImages(serviceSlug);
  const images = {
    main: backendService?.mainImage || baseImages.main,
    gallery: (Array.isArray(backendService?.galleryImages) && backendService.galleryImages.length > 0)
      ? backendService.galleryImages
      : baseImages.gallery
  };
  const hasPackageComparison = service.packageComparison !== undefined && service.packageComparison !== null;
  const isCustomQuote = serviceSlug === 'ai-automation';

  const packageKeys = service.packages ? Object.keys(service.packages) : [];
  const validPackage = packageKeys.includes(selectedPackage) ? selectedPackage : (packageKeys[0] || '');
  const selectedPkg = validPackage && service.packages ? service.packages[validPackage] : null;

  return (
    <motion.div className="w-full min-w-0 overflow-x-clip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Hero Section with Image Gallery */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 flex-wrap break-words">
            <Link to="/services" className="hover:text-blue-600">Services</Link>
            <span className="mx-1 sm:mx-2">/</span>
            <span className="text-gray-900 truncate">{service.title}</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(290px,0.8fr)] gap-5 sm:gap-6 lg:gap-8 items-start">
            {/* Left: Image Gallery + Content */}
            <div className="min-w-0 w-full">
              <ImageGallery images={images.gallery} serviceTitle={service.title} />

              {service.sellerInfo && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 sm:mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {service.sellerInfo.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm">{service.sellerInfo.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">{service.sellerInfo.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
                    {renderStars(service.sellerInfo.rating)}
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 ml-1">{service.sellerInfo.rating}</span>
                    <span className="text-[10px] sm:text-sm text-gray-500">({service.sellerInfo.reviews} reviews)</span>
                  </div>
                  {service.sellerInfo.verified && <span className="px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 text-[10px] sm:text-xs font-semibold rounded-full">✓ Verified</span>}
                  {service.sellerInfo.ordersInQueue && <span className="text-[10px] sm:text-xs text-gray-500">{service.sellerInfo.ordersInQueue} orders in queue</span>}
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-3 sm:mt-4 mb-2 sm:mb-4 break-words">{service.title}</h1>
              <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed break-words">{service.intro}</p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed break-words">{service.longDescription}</p>
            </div>

            {/* Right Sidebar */}
            <div className="min-w-0 w-full">
              <div className="xl:sticky xl:top-24 relative bg-white border border-gray-200 rounded-xl shadow-lg p-4 sm:p-6">
                {isCustomQuote ? (
                  <>
                    <div className="text-center mb-3 sm:mb-4">
                      <span className="inline-block bg-purple-100 text-purple-800 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-2">Custom Quote Only</span>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Custom Quote</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">Based on your specific needs</p>
                    </div>
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600"><FaClock className="text-gray-400 shrink-0" /><span>Custom delivery timeline</span></div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600"><FaSyncAlt className="text-gray-400 shrink-0" /><span>Unlimited revisions</span></div>
                    </div>
                    <Link to="/request-service?service=ai-automation&step=2" className="block w-full py-2.5 sm:py-3 px-4 bg-purple-600 text-white font-bold rounded-lg text-center hover:bg-purple-700 transition-colors shadow-md text-sm sm:text-base">Request AI Custom Quote</Link>
                    <Link to="/contact" className="block w-full mt-2 sm:mt-3 py-2.5 sm:py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg text-center hover:bg-gray-50 transition-colors text-sm sm:text-base">Contact Me</Link>
                    <div className="mt-3 sm:mt-4 text-center"><p className="text-[10px] sm:text-xs text-gray-400">Need flexibility? <Link to="/contact" className="text-blue-600 hover:underline">Hire by the hour</Link></p></div>
                  </>
                ) : (
                  <>
                    {packageKeys.length > 0 && (
                      <div className="mb-3 sm:mb-4">
                        <div className="flex flex-wrap border-b border-gray-200 -mx-0.5 sm:-mx-1">
                          {packageKeys.map((pkgKey) => {
                            const pkg = service.packages[pkgKey];
                            const isActive = validPackage === pkgKey;
                            return (
                              <button key={pkgKey} onClick={() => selectPackage(pkgKey)} className={`flex-1 py-1.5 sm:py-2 px-0.5 sm:px-1 text-[10px] sm:text-xs font-semibold transition-all truncate ${isActive ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                                {pkg?.name?.split(' ')[0] || pkgKey}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {selectedPkg && (
                      <>
                        <div className="mb-3 sm:mb-4">
                          <span className="text-xs sm:text-sm text-gray-500">{selectedPkg.name}</span>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{selectedPkg.description}</p>
                          <p className="text-[10px] sm:text-xs text-blue-600 font-semibold mt-2">Pricing shown at checkout</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        </div>

                        {selectedPkg && (
                          <div className="border-t border-gray-200 pt-2 sm:pt-3 mb-3 sm:mb-4">
                            {(() => {
                              const comparisonTier = {
                                starter: 'basic',
                                Standard: 'standard',
                                standard: 'standard',
                                basic: 'basic',
                                premium: 'premium'
                              }[validPackage];
                              const hasSharedFeatureList = Boolean(
                                comparisonTier && service.packageComparison
                              );
                              const includedItems = hasSharedFeatureList
                                ? getPackageFeatures(serviceSlug, comparisonTier, service.packageComparison)
                                : (selectedPkg.includes || []);

                              return (
                                <>
                                  <button
                                    className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-900"
                                    onClick={() => setShowIncludes(v => !v)}
                                  >
                                    <span>What's Included</span>
                                    <FaChevronDown className={`text-gray-400 text-[10px] sm:text-xs transition-transform ${showIncludes ? 'rotate-180' : ''}`} />
                                  </button>
                                  {showIncludes && (
                                    <div className="mt-1.5 sm:mt-2 space-y-1 sm:space-y-1.5 max-h-72 overflow-y-auto pr-1">
                                      {includedItems.map((item, idx) => (
                                        <div key={idx} className="flex items-start text-xs sm:text-sm text-gray-600">
                                          <FaCheck className="text-green-500 mr-1.5 sm:mr-2 mt-0.5 shrink-0" size={10} />
                                          <span className="break-words">{item}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}

                        <Link to={`/request-service?service=${serviceSlug}&package=${validPackage}`} className="block w-full py-2.5 sm:py-3 px-4 bg-blue-600 text-white font-bold rounded-lg text-center hover:bg-blue-700 transition-colors shadow-md text-sm sm:text-base">Continue</Link>
                        <Link to="/contact" className="block w-full mt-2 sm:mt-3 py-2.5 sm:py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg text-center hover:bg-gray-50 transition-colors text-sm sm:text-base">Contact Me</Link>
                        <div className="mt-3 sm:mt-4 text-center"><p className="text-[10px] sm:text-xs text-gray-400">Need flexibility? <Link to="/contact" className="text-blue-600 hover:underline">Hire by the hour</Link></p></div>
                      </>
                    )}
                  </>
                )}

                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex flex-wrap justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500">
                  <span className="flex items-center gap-1"><FaShieldAlt className="text-green-500 shrink-0" />Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the page */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
        {/* What This Service Helps Businesses Achieve */}
        <section className="mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">What This Service Helps Businesses Achieve</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {service.whatItHelpsAchieve.map((item, index) => (
              <div key={index} className="flex items-start space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-blue-50 rounded-lg">
                <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How This Service Is Measured */}
        <section className="mb-10 sm:mb-16 w-full min-w-0 overflow-hidden bg-gray-50 p-4 sm:p-6 md:p-8 rounded-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">How This Service Is Measured</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">This ensures transparent pricing and clear deliverables.</p>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {service.howMeasured.map((item, index) => (
              <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mt-1.5 sm:mt-2 shrink-0"></div>
                <span className="text-sm sm:text-base text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Services Include */}
        <section className="mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">Services Include</h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {service.servicesInclude.map((item, index) => (
              <div key={index} className="flex items-start space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 sm:mt-1 shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tools & Technologies */}
        {service.tools && service.tools.length > 0 && (
          <section className="mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 flex items-center">
              <FaTools className="mr-2 sm:mr-3 text-gray-700 shrink-0" />
              Tools & Technologies
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {service.tools.map((tool, index) => (
                <span key={index} className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-xs sm:text-sm">{tool}</span>
              ))}
            </div>
          </section>
        )}


        {/* Related Services */}
        {service.complementaryServices && service.complementaryServices.length > 0 && (
          <section className="mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Related Services</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {service.complementaryServices.map((rel, index) => {
                const relSlug = getServiceSlug(rel.name);
                const RelIcon = SERVICES_DATA[relSlug]?.icon || <FaCogs />;
                return (
                  <Link
                    key={index}
                    to={`/services/${relSlug}`}
                    className="flex items-start gap-3 p-3 sm:p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
                  >
                    <span className="text-blue-600 mt-0.5 shrink-0">{RelIcon}</span>
                    <span>
                      <span className="block text-sm font-semibold text-gray-900 group-hover:text-blue-600">{rel.name}</span>
                      <span className="block text-xs text-gray-500 mt-0.5">For {rel.reason}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Package Comparison Table */}
        {hasPackageComparison && (
          <section className="mb-10 sm:mb-16 w-full min-w-0">
            <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain">
              <div className="min-w-0 sm:min-w-[720px]">
                <PackageComparison packageData={service.packageComparison} serviceSlug={serviceSlug} />
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="w-full min-w-0 text-center py-8 sm:py-12 bg-gray-50 rounded-2xl px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Ready to Get Professional Results?</h2>
          <p className="text-base sm:text-xl text-gray-600 mb-4 max-w-3xl mx-auto">Submit your service request today. No membership required, no commitments — just professional execution.</p>
          <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-200 border-l-4 border-l-blue-500 rounded-r-xl rounded-l-md max-w-2xl mx-auto mb-6 sm:mb-8 text-left shadow-sm transition-all duration-300 hover:shadow-md">
            <FaInfoCircle className="text-blue-600 shrink-0 mt-0.5" size={16} />
            <p className="text-xs sm:text-sm leading-relaxed text-blue-800 font-medium">
              <span className="font-semibold text-blue-950">Starting price options</span> are shown during service selection. <span className="font-semibold text-blue-950">Custom quotes</span> are available for larger or more detailed projects.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to={`/request-service?service=${serviceSlug}&package=${validPackage}`} className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base">
              <FaArrowRight className="mr-2" /> Request Service Now
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors text-sm sm:text-base">
              <FaHeadset className="mr-2" /> Schedule Free Consultation
            </Link>
          </div>
        </section>
      </main>

      {/* Responsive helper styles */}
      <style>{`
        @media (max-width: 640px) {
          button, 
          label,
          input[type="checkbox"],
          input[type="radio"] {
            touch-action: manipulation;
          }
          button {
            min-height: 44px;
          }
          input, select, textarea {
            font-size: 16px !important;
          }
        }
        @media (min-width: 480px) {
          .xs\\:block {
            display: block !important;
          }
        }
        @media (max-width: 479px) {
          .xs\\:block {
            display: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default ServiceDetailPage;
