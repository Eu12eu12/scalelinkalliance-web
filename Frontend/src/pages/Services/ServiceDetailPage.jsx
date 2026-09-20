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
  'business-consulting-growth-strategy': {
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
// ─── SKELETON LOADER ───
const ServiceDetailSkeleton = () => (
  <div className="w-full min-w-0 animate-pulse bg-white">
    <div className="border-b border-gray-200 py-6 sm:py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-4 bg-gray-200 rounded w-48 mb-6" />
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(290px,0.8fr)] gap-8">
          <div>
            <div className="w-full h-80 sm:h-96 bg-gray-100 rounded-2xl mb-4" />
            <div className="flex gap-3 mb-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="w-20 h-16 bg-gray-100 rounded-lg" />
              ))}
            </div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
          </div>
          <div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-10 bg-gray-200 rounded w-full mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-4 bg-gray-200 rounded w-full" />
                ))}
              </div>
              <div className="h-12 bg-gray-200 rounded-xl w-full mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
    'Business Consulting & Growth Strategy': 'business-consulting-growth-strategy'
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
  'email-marketing': ['email list growth', 'newsletter design', 'automated email sequences'],
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchBackendService = async () => {
      try {
        const res = await fetch(`/api/cms/services/${serviceSlug}?_t=${Date.now()}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } });
        if (res.ok) {
          const data = await res.json();
          const svc = (data && data.id) ? data : (data?.service || null);
          if (isMounted && svc) {
            setBackendService(svc);
          }
        }
      } catch (err) {
        console.warn('Error fetching service details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (serviceSlug) {
      setLoading(true);
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

  const service = backendService ? {
    ...backendService,
    title: backendService.title,
    category: (backendService.category || '').replace(/-/g, ' '),
    icon: getServiceIcon(backendService.iconName, { size: 20 }),
    whatItHelpsAchieve: Array.isArray(backendService.whatItHelpsAchieve) ? backendService.whatItHelpsAchieve : [],
    howMeasured: Array.isArray(backendService.howMeasured) ? backendService.howMeasured : [],
    servicesInclude: Array.isArray(backendService.servicesInclude) ? backendService.servicesInclude : [],
    tools: Array.isArray(backendService.tools) ? backendService.tools : [],
    complementaryServices: Array.isArray(backendService.complementaryServices) ? backendService.complementaryServices : [],
    packages: (backendService.packages && Object.keys(backendService.packages).length > 0)
      ? backendService.packages
      : {},
    packageComparison: backendService.packageComparison || null,
    sampleProject: backendService.sampleProject || null,
    sellerInfo: backendService.sellerInfo || { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.9, reviews: 150, ordersInQueue: 4, verified: true }
  } : null;
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

  if (loading) {
    return <ServiceDetailSkeleton />;
  }

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
  const rawGallery = (Array.isArray(backendService?.galleryImages) && backendService.galleryImages.length > 0)
    ? backendService.galleryImages
    : baseImages.gallery;

  const localGallery = (rawGallery || []).filter(img => typeof img === 'string' && img.startsWith('/images/'));
  const cleanedGallery = localGallery.length > 0 ? Array.from(new Set(localGallery)) : Array.from(new Set(rawGallery || []));

  const images = {
    main: backendService?.mainImage || baseImages.main,
    gallery: cleanedGallery
  };
  const isCustomQuote = serviceSlug === 'ai-automation';
  const hasPackageComparison = Boolean(
    !isCustomQuote &&
    service.packageComparison &&
    Array.isArray(service.packageComparison.tiers) &&
    service.packageComparison.tiers.length > 0 &&
    service.packageComparison.details &&
    Object.keys(service.packageComparison.details).length > 0
  );

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
                                starter: 'starter',
                                growth: 'growth',
                                premium: 'premium',
                                basic: 'starter',
                                standard: 'growth'
                              }[validPackage] || validPackage;
                              const hasSharedFeatureList = Boolean(
                                comparisonTier && service.packageComparison
                              );
                                                            const includedItems = hasSharedFeatureList
                                ? getPackageFeatures(serviceSlug, comparisonTier, service.packageComparison, service.packages)
                                : (selectedPkg.includes || []).filter((line) => !/^Everything in/i.test(line.trim()));

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
                const RelIcon = getServiceIcon(relSlug, { size: 16 }) || <FaCogs />;
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
                <PackageComparison
                  packageData={service.packageComparison}
                  packagesData={service.packages}
                  serviceSlug={serviceSlug}
                />
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
            <Link to="/request-service?service=custom-quote" className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors text-sm sm:text-base">
              <FaCogs className="mr-2" /> Custom Quote
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
