// src/pages/Services/ServiceDetailPage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPaintBrush, FaVideo, FaPenNib, FaCogs, FaChartBar, FaDatabase,
  FaUsers, FaCheck, FaArrowRight, FaRocket, FaFileAlt, FaCode,
  FaGlobe, FaShoppingCart, FaAd, FaEnvelope, FaSearch, FaHeadset,
  FaProjectDiagram, FaCamera, FaPalette, FaCloudUploadAlt, FaShieldAlt,
  FaRegBuilding, FaChartLine, FaTools, FaStar, FaClock, FaDollarSign,
  FaInfoCircle, FaChevronDown, FaChevronUp, FaSyncAlt, FaBriefcase,
  FaRobot, FaCalendar, FaChevronLeft, FaChevronRight, FaTimes, FaExpand
} from 'react-icons/fa';
import PackageComparison from '../../components/sections/PackageComparison';
import OrderSidebar from '../../components/sections/OrderSidebar';
import { SERVICE_GALLERY_LOCAL } from '../../data/serviceImagesLocal';

// ─── SERVICE IMAGES MAP ───
// Galleries here are the ORIGINAL remote fallback. getServiceImages()
// below prefers SERVICE_GALLERY_LOCAL (locally optimized webp files from
// scripts/optimize-images.mjs) and only falls back to these remote URLs
// for a slug that hasn't been processed yet.

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
      'https://i.ibb.co/RknZxzDx/Business-person-drawing-growth-chart.jpg',
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

// ─── COMPLETE SERVICES DATA WITH CORRECTED PRICES ───
const SERVICES_DATA = {
  // ─── 1. CONTENT, BRANDING & CREATIVE ───
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
    addOnOptions: ['brand identity design', 'social media design templates', 'infographic design', 'presentation design', 'marketing material design packages'],
    complementaryServices: [
      { name: 'Brand Identity & Logo Design', reason: 'consistent branding' },
      { name: 'Copywriting & Content Creation', reason: 'marketing messaging' },
      { name: 'Social Media Management', reason: 'content publishing' },
      { name: 'Website Development', reason: 'digital presence' },
      { name: 'Video Editing & Motion Graphics', reason: 'visual marketing content' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$35', description: 'Ideal for small design requests or single marketing assets.', includes: ['1 graphic design asset', 'basic design layout', 'web-ready file format', '1 revision round'] },
      growth: { name: 'Standard Package', price: '$175', description: 'Ideal for businesses producing multiple marketing materials.', includes: ['up to 5 graphic design assets', 'design variations or layouts', 'web-ready file formats', '2 revision rounds'] },
      premium: { name: 'Premium Package', price: '$499', description: 'Ideal for businesses running active marketing campaigns.', includes: ['up to 10 graphic design assets', 'consistent brand styling', 'multiple design formats', 'priority revisions and updates'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Design assets included', values: { basic: true, standard: true, premium: true } },
        { label: 'Multiple design variations', values: { basic: false, standard: true, premium: true } },
        { label: 'Web-ready file formats', values: { basic: true, standard: true, premium: true } },
        { label: 'Consistent brand styling', values: { basic: false, standard: false, premium: true } },
        { label: 'Multiple file formats', values: { basic: false, standard: false, premium: true } },
        { label: 'Priority revisions', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$35', packageName: 'Starter Package', shortDescription: '1 design asset, 1 revision, web-ready files', description: 'Ideal for small design requests or single marketing assets.', deliveryLabel: 'Shown during service selection', revisions: '1 revision round', includes: ['1 graphic design asset', 'basic design layout', 'web-ready file format', '1 revision round'] },
        standard: { price: '$175', packageName: 'Standard Package', shortDescription: 'Up to 5 design assets, 2 revisions', description: 'Ideal for businesses producing multiple marketing materials.', deliveryLabel: 'Shown during service selection', revisions: '2 revision rounds', includes: ['up to 5 graphic design assets', 'design variations or layouts', 'web-ready file formats', '2 revision rounds'] },
        premium: { price: '$499', packageName: 'Premium Package', shortDescription: 'Up to 10 design assets, priority turnaround', description: 'Ideal for businesses running active marketing campaigns.', deliveryLabel: 'Shown during service selection', revisions: 'Priority revisions', includes: ['up to 10 graphic design assets', 'consistent brand styling', 'multiple design formats', 'priority revisions and updates'] }
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
    addOnOptions: ['subtitles and captions', 'YouTube optimization', 'animated logo intros', 'promotional video scripting', 'thumbnail graphics'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'thumbnails, social media visuals' },
      { name: 'Copywriting & Content Creation', reason: 'video scripts' },
      { name: 'Social Media Management', reason: 'posting and engagement' },
      { name: 'Paid Advertising Management', reason: 'video ads' },
      { name: 'Landing Page Development', reason: 'conversion pages for campaigns' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$75', description: 'Ideal for small projects or social media videos.', includes: ['editing of 1 video up to 60 seconds', 'basic cuts and transitions', 'background music', 'simple motion graphics or text overlays', 'export optimized for social media'] },
      growth: { name: 'Standard Package', price: '$225', description: 'Ideal for businesses creating regular marketing content.', includes: ['editing of 3 videos up to 90 seconds each', 'branded intro/outro', 'motion graphics elements', 'text animations and transitions', 'color correction', 'export for social media and website use'] },
      premium: { name: 'Premium Package', price: '$599', description: 'Ideal for promotional campaigns or professional brand videos.', includes: ['editing of 5 videos up to 2 minutes each', 'advanced motion graphics', 'animated titles and brand elements', 'color grading', 'sound optimization', 'multiple export formats for marketing platforms'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Basic cuts & transitions', values: { basic: true, standard: true, premium: true } },
        { label: 'Background music', values: { basic: true, standard: true, premium: true } },
        { label: 'Branded intro/outro', values: { basic: false, standard: true, premium: true } },
        { label: 'Color correction', values: { basic: false, standard: true, premium: true } },
        { label: 'Advanced motion graphics', values: { basic: false, standard: false, premium: true } },
        { label: 'Color grading', values: { basic: false, standard: false, premium: true } },
        { label: 'Multiple export formats', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$75', packageName: 'Starter Package', shortDescription: '1 video up to 60 seconds, basic cuts, music', description: 'Ideal for small projects or social media videos.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['editing of 1 video up to 60 seconds', 'basic cuts and transitions', 'background music', 'simple motion graphics or text overlays', 'export optimized for social media'] },
        standard: { price: '$225', packageName: 'Standard Package', shortDescription: '3 videos up to 90 seconds each, branded intro/outro', description: 'Ideal for businesses creating regular marketing content.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['editing of 3 videos up to 90 seconds each', 'branded intro/outro', 'motion graphics elements', 'text animations and transitions', 'color correction', 'export for social media and website use'] },
        premium: { price: '$599', packageName: 'Premium Package', shortDescription: '5 videos up to 2 minutes each, advanced motion graphics', description: 'Ideal for promotional campaigns or professional brand videos.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['editing of 5 videos up to 2 minutes each', 'advanced motion graphics', 'animated titles and brand elements', 'color grading', 'sound optimization', 'multiple export formats for marketing platforms'] }
      }
    },
    sampleProject: {
      projectName: "MotionPro Brand Video",
      businessType: "Professional service business",
      projectSummary: "A video editing and motion graphics concept designed to help a business explain its services, build trust, and promote its offer on social media or a website.",
      servicesIncluded: ["Video editing", "Captions", "Branded text", "Motion graphics", "Background music", "Call-to-action screen", "Social media formatting"],
      portfolioCardText: "A polished business video concept built to capture attention, explain value, and support brand growth."
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
    addOnOptions: ['email marketing sequences', 'long-form blog content (2,000+ words)', 'sales page copywriting', 'website rewrite packages', 'editing and proofreading'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'visual marketing materials' },
      { name: 'Website Development', reason: 'publish the content' },
      { name: 'SEO & Search Marketing', reason: 'drive traffic' },
      { name: 'Email Marketing Campaigns', reason: 'send content to audiences' },
      { name: 'Social Media Management', reason: 'distribute content' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$75', description: 'Ideal for small content needs or single-page messaging.', includes: ['1 content piece up to 800 words', 'basic keyword research (if needed)', 'formatting for web readability', '1 revision round'] },
      growth: { name: 'Standard Package', price: '$225', description: 'Ideal for businesses producing regular content.', includes: ['3 content pieces up to 1,000 words each', 'content structure and messaging optimization', 'SEO-friendly formatting', '2 revision rounds'] },
      premium: { name: 'Premium Package', price: '$599', description: 'Ideal for businesses running content marketing campaigns.', includes: ['6 content pieces up to 1,200 words each', 'deeper keyword research and SEO optimization', 'brand voice alignment', 'content strategy recommendations', '2-3 revision rounds'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Content pieces included', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic keyword research', values: { basic: true, standard: true, premium: true } },
        { label: 'SEO-friendly formatting', values: { basic: false, standard: true, premium: true } },
        { label: 'Content structure optimization', values: { basic: false, standard: true, premium: true } },
        { label: 'Deeper SEO optimization', values: { basic: false, standard: false, premium: true } },
        { label: 'Brand voice alignment', values: { basic: false, standard: false, premium: true } },
        { label: 'Content strategy recommendations', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$75', packageName: 'Starter Package', shortDescription: '1 content piece up to 800 words, 1 revision', description: 'Ideal for small content needs or single-page messaging.', deliveryLabel: 'Shown during service selection', revisions: '1 revision round', includes: ['1 content piece up to 800 words', 'basic keyword research (if needed)', 'formatting for web readability', '1 revision round'] },
        standard: { price: '$225', packageName: 'Standard Package', shortDescription: '3 content pieces up to 1,000 words each, SEO formatting', description: 'Ideal for businesses producing regular content.', deliveryLabel: 'Shown during service selection', revisions: '2 revision rounds', includes: ['3 content pieces up to 1,000 words each', 'content structure and messaging optimization', 'SEO-friendly formatting', '2 revision rounds'] },
        premium: { price: '$599', packageName: 'Premium Package', shortDescription: '6 content pieces up to 1,200 words each, SEO optimization', description: 'Ideal for businesses running content marketing campaigns.', deliveryLabel: 'Shown during service selection', revisions: '2-3 revision rounds', includes: ['6 content pieces up to 1,200 words each', 'deeper keyword research and SEO optimization', 'brand voice alignment', 'content strategy recommendations', '2-3 revision rounds'] }
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
    addOnOptions: ['business card design', 'brand pattern or icon design', 'social media brand templates', 'marketing collateral design', 'brand guidelines document'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'marketing materials and social media graphics' },
      { name: 'Website Development', reason: 'brand-consistent website' },
      { name: 'Copywriting & Content Creation', reason: 'brand messaging' },
      { name: 'Social Media Management', reason: 'brand promotion' },
      { name: 'Photography & Visual Assets', reason: 'brand imagery' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$199', description: 'Ideal for small businesses launching a brand or refreshing their logo.', includes: ['1 custom logo concept', 'basic color palette selection', '1 revision round', 'logo files delivered in PNG and SVG formats'] },
      growth: { name: 'Standard Package', price: '$499', description: 'Ideal for businesses that want a more developed brand identity.', includes: ['3 logo design concepts', '2 revision rounds', 'brand color palette', 'typography selection', 'logo files in multiple formats (PNG, SVG, PDF)'] },
      premium: { name: 'Premium Package', price: '$999', description: 'Ideal for companies building a full professional brand identity.', includes: ['3-4 logo concepts', 'multiple revision rounds', 'brand color palette and typography', 'brand style guide', 'logo usage guidelines', 'complete brand identity package'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Logo concepts included', values: { basic: true, standard: true, premium: true } },
        { label: 'Color palette selection', values: { basic: true, standard: true, premium: true } },
        { label: 'Typography selection', values: { basic: false, standard: true, premium: true } },
        { label: 'Multiple file formats', values: { basic: false, standard: true, premium: true } },
        { label: 'Brand style guide', values: { basic: false, standard: false, premium: true } },
        { label: 'Logo usage guidelines', values: { basic: false, standard: false, premium: true } },
        { label: 'Complete brand identity package', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$199', packageName: 'Starter Package', shortDescription: '1 logo concept, basic palette, 1 revision', description: 'Ideal for small businesses launching a brand or refreshing their logo.', deliveryLabel: 'Shown during service selection', revisions: '1 revision round', includes: ['1 custom logo concept', 'basic color palette selection', '1 revision round', 'logo files delivered in PNG and SVG formats'] },
        standard: { price: '$499', packageName: 'Standard Package', shortDescription: '3 logo concepts, color palette, typography', description: 'Ideal for businesses that want a more developed brand identity.', deliveryLabel: 'Shown during service selection', revisions: '2 revision rounds', includes: ['3 logo design concepts', '2 revision rounds', 'brand color palette', 'typography selection', 'logo files in multiple formats (PNG, SVG, PDF)'] },
        premium: { price: '$999', packageName: 'Premium Package', shortDescription: '3-4 logo concepts, complete brand style guide', description: 'Ideal for companies building a full professional brand identity.', deliveryLabel: 'Shown during service selection', revisions: 'Multiple revision rounds', includes: ['3-4 logo concepts', 'multiple revision rounds', 'brand color palette and typography', 'brand style guide', 'logo usage guidelines', 'complete brand identity package'] }
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
    addOnOptions: ['background removal', 'product staging', 'lifestyle photography', 'photo retouching', 'custom image libraries for marketing'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'marketing materials using the photos' },
      { name: 'Website Development', reason: 'placing visuals on websites' },
      { name: 'Social Media Management', reason: 'posting branded content' },
      { name: 'Video Editing & Motion Graphics', reason: 'visual storytelling' },
      { name: 'Brand Identity & Logo Design', reason: 'complete visual branding' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$199', description: 'Ideal for small businesses needing essential visual content.', includes: ['10 professionally edited photos', '1 location or subject focus', 'basic color correction and editing', 'digital image delivery (web-ready format)'] },
      growth: { name: 'Standard Package', price: '$499', description: 'Ideal for businesses creating marketing content.', includes: ['25 professionally edited photos', 'multiple subjects or scenes', 'color correction and retouching', 'web and high-resolution formats'] },
      premium: { name: 'Premium Package', price: '$999', description: 'Ideal for brand campaigns and full marketing visuals.', includes: ['50 professionally edited photos', 'multi-scene photography session', 'advanced retouching and editing', 'full-resolution and web-ready images', 'image selection consultation'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Edited photos included', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic color correction', values: { basic: true, standard: true, premium: true } },
        { label: 'Multiple subjects/scenes', values: { basic: false, standard: true, premium: true } },
        { label: 'Photo retouching', values: { basic: false, standard: true, premium: true } },
        { label: 'High-resolution formats', values: { basic: false, standard: true, premium: true } },
        { label: 'Advanced retouching', values: { basic: false, standard: false, premium: true } },
        { label: 'Image selection consultation', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$199', packageName: 'Starter Package', shortDescription: '10 edited photos, 1 location, basic editing', description: 'Ideal for small businesses needing essential visual content.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['10 professionally edited photos', '1 location or subject focus', 'basic color correction and editing', 'digital image delivery (web-ready format)'] },
        standard: { price: '$499', packageName: 'Standard Package', shortDescription: '25 edited photos, multiple scenes, retouching', description: 'Ideal for businesses creating marketing content.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['25 professionally edited photos', 'multiple subjects or scenes', 'color correction and retouching', 'web and high-resolution formats'] },
        premium: { price: '$999', packageName: 'Premium Package', shortDescription: '50 edited photos, multi-scene session, advanced retouching', description: 'Ideal for brand campaigns and full marketing visuals.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['50 professionally edited photos', 'multi-scene photography session', 'advanced retouching and editing', 'full-resolution and web-ready images', 'image selection consultation'] }
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
// ─── 2. WEBSITE & WEB APP DEVELOPMENT ───
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
    addOnOptions: ['e-commerce functionality', 'landing page development', 'website content writing', 'advanced SEO optimization', 'website maintenance plans'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'website visuals and marketing materials' },
      { name: 'Copywriting & Content Creation', reason: 'website text and messaging' },
      { name: 'SEO & Search Marketing', reason: 'improve search visibility' },
      { name: 'Paid Advertising Management', reason: 'drive traffic to the website' },
      { name: 'Website Maintenance & Updates', reason: 'ongoing support' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$699', description: 'Ideal for small businesses launching their first website.', includes: ['up to 3 website pages', 'responsive mobile-friendly design', 'contact form setup', 'basic SEO page structure', 'website deployment and launch support'] },
      growth: { name: 'Standard Package', price: '$1,499', description: 'Ideal for businesses expanding their online presence.', includes: ['up to 7 website pages', 'responsive design', 'contact forms and lead capture', 'basic SEO optimization', 'integration of marketing tools'] },
      premium: { name: 'Premium Package', price: '$3,499', description: 'Ideal for businesses needing a full professional website.', includes: ['up to 12 website pages', 'responsive and modern layout', 'advanced forms and integrations', 'blog or content management setup', 'SEO-ready structure', 'launch and testing support'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Mobile-friendly design', values: { basic: true, standard: true, premium: true } },
        { label: 'Content upload', values: { basic: true, standard: true, premium: true } },
        { label: 'Contact form', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic SEO setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Speed optimization', values: { basic: false, standard: true, premium: true } },
        { label: 'Marketing tool integration', values: { basic: false, standard: true, premium: true } },
        { label: 'Blog / content management setup', values: { basic: false, standard: false, premium: true } },
        { label: 'Advanced forms & integrations', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$699', packageName: 'Starter Package', shortDescription: 'Up to 3 pages, responsive design, contact form', description: 'Ideal for small businesses launching their first website.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['up to 3 website pages', 'responsive mobile-friendly design', 'contact form setup', 'basic SEO page structure', 'website deployment and launch support'] },
        standard: { price: '$1,499', packageName: 'Standard Package', shortDescription: 'Up to 7 pages, advanced layout', description: 'Ideal for businesses expanding their online presence.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['up to 7 website pages', 'responsive design', 'contact forms and lead capture', 'basic SEO optimization', 'integration of marketing tools'] },
        premium: { price: '$3,499', packageName: 'Premium Package', shortDescription: '10+ pages, custom functionality', description: 'Ideal for businesses needing a full professional website.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['up to 12 website pages', 'responsive and modern layout', 'advanced forms and integrations', 'blog or content management setup', 'SEO-ready structure', 'launch and testing support'] }
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
    addOnOptions: ['copywriting for landing pages', 'email marketing automation', 'advertising campaign setup', 'A/B testing for conversions', 'CRM integration'],
    complementaryServices: [
      { name: 'Copywriting & Content Creation', reason: 'persuasive messaging' },
      { name: 'Graphic Design', reason: 'visual campaign assets' },
      { name: 'Paid Advertising Management', reason: 'traffic generation' },
      { name: 'Email Marketing Campaigns', reason: 'lead nurturing' },
      { name: 'CRM & Marketing Automation', reason: 'lead tracking' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$499', description: 'Ideal for businesses launching a simple marketing campaign.', includes: ['1 landing page design', 'lead capture form integration', 'mobile-responsive layout', 'basic analytics setup', 'call-to-action optimization'] },
      growth: { name: 'Standard Package', price: '$1,299', description: 'Ideal for businesses running structured marketing campaigns.', includes: ['3-page sales funnel', 'landing page + follow-up pages', 'lead capture forms', 'conversion-focused design', 'analytics integration'] },
      premium: { name: 'Premium Package', price: '$2,499', description: 'Ideal for businesses running full digital marketing funnels.', includes: ['complete sales funnel (5 pages)', 'multiple landing pages', 'advanced form integrations', 'email marketing integration', 'conversion optimization setup'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Lead capture form', values: { basic: true, standard: true, premium: true } },
        { label: 'Mobile-responsive layout', values: { basic: true, standard: true, premium: true } },
        { label: 'Analytics setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Call-to-action optimization', values: { basic: true, standard: true, premium: true } },
        { label: 'Multi-page funnel', values: { basic: false, standard: true, premium: true } },
        { label: 'Conversion-focused design', values: { basic: false, standard: true, premium: true } },
        { label: 'Email marketing integration', values: { basic: false, standard: false, premium: true } },
        { label: 'Conversion optimization setup', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$499', packageName: 'Starter Package', shortDescription: '1 landing page, lead capture form, mobile-responsive', description: 'Ideal for businesses launching a simple marketing campaign.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['1 landing page design', 'lead capture form integration', 'mobile-responsive layout', 'basic analytics setup', 'call-to-action optimization'] },
        standard: { price: '$1,299', packageName: 'Standard Package', shortDescription: '3-page sales funnel, conversion-focused design', description: 'Ideal for businesses running structured marketing campaigns.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['3-page sales funnel', 'landing page + follow-up pages', 'lead capture forms', 'conversion-focused design', 'analytics integration'] },
        premium: { price: '$2,499', packageName: 'Premium Package', shortDescription: 'Complete 5-page funnel, advanced integrations', description: 'Ideal for businesses running full digital marketing funnels.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['complete sales funnel (5 pages)', 'multiple landing pages', 'advanced form integrations', 'email marketing integration', 'conversion optimization setup'] }
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
    longDescription: 'Scale Link Alliance provides comprehensive e-commerce development services that help businesses launch and manage online stores designed for growth, usability, and reliability.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.9, reviews: 93, ordersInQueue: 6, verified: true },
    whatItHelpsAchieve: ['sell products online', 'manage inventory and orders', 'accept secure payments', 'expand to new markets', 'automate order processing'],
    howMeasured: ['number of products added', 'number of store pages created', 'payment and shipping integrations', 'additional features and automation'],
    servicesInclude: ['Online store setup', 'Product page design', 'Payment gateway integration', 'Shopping cart configuration', 'Order management tools'],
    tools: ['Shopify', 'WooCommerce', 'BigCommerce', 'Magento'],
    addOnOptions: ['product photography and visual assets', 'product description copywriting', 'email marketing integration', 'inventory automation', 'advanced analytics and reporting'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'product images and promotional materials' },
      { name: 'Copywriting & Content Creation', reason: 'product descriptions' },
      { name: 'Photography & Visual Assets', reason: 'product photography' },
      { name: 'SEO & Search Marketing', reason: 'drive organic traffic' },
      { name: 'Paid Advertising Management', reason: 'increase sales through ads' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$999', description: 'Ideal for small businesses launching their first online store.', includes: ['store setup with up to 10 products', 'product page design', 'payment gateway integration', 'basic shipping setup', 'mobile-responsive layout'] },
      growth: { name: 'Standard Package', price: '$2,499', description: 'Ideal for businesses expanding their product catalog.', includes: ['store setup with up to 50 products', 'product categories and navigation', 'payment and shipping integrations', 'customer account setup', 'basic SEO product structure'] },
      premium: { name: 'Premium Package', price: '$4,999', description: 'Ideal for businesses building a fully developed online store.', includes: ['store setup with up to 100 products', 'advanced store design', 'multiple payment gateways', 'shipping automation', 'product filtering and search features', 'performance optimization'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Mobile-responsive layout', values: { basic: true, standard: true, premium: true } },
        { label: 'Payment gateway integration', values: { basic: true, standard: true, premium: true } },
        { label: 'Shipping setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Customer account setup', values: { basic: false, standard: true, premium: true } },
        { label: 'Product categories & navigation', values: { basic: false, standard: true, premium: true } },
        { label: 'Multiple payment gateways', values: { basic: false, standard: false, premium: true } },
        { label: 'Product filtering & search', values: { basic: false, standard: false, premium: true } },
        { label: 'Performance optimization', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$999', packageName: 'Starter Package', shortDescription: 'Store setup with up to 10 products', description: 'Ideal for small businesses launching their first online store.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['store setup with up to 10 products', 'product page design', 'payment gateway integration', 'basic shipping setup', 'mobile-responsive layout'] },
        standard: { price: '$2,499', packageName: 'Standard Package', shortDescription: 'Store with up to 50 products, categories', description: 'Ideal for businesses expanding their product catalog.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['store setup with up to 50 products', 'product categories and navigation', 'payment and shipping integrations', 'customer account setup', 'basic SEO product structure'] },
        premium: { price: '$4,999', packageName: 'Premium Package', shortDescription: 'Store with up to 100 products, advanced design', description: 'Ideal for businesses building a fully developed online store.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['store setup with up to 100 products', 'advanced store design', 'multiple payment gateways', 'shipping automation', 'product filtering and search features', 'performance optimization'] }
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
    intro: 'Custom web applications and Software-as-a-Service (SaaS) platforms allow businesses to streamline operations, automate workflows, and create digital tools that support growth.',
    description: 'Unlike standard websites, web applications provide interactive functionality such as dashboards, user accounts, data management systems, and automation tools.',
    longDescription: 'Scale Link Alliance develops scalable web applications and SaaS solutions tailored to the specific operational needs of businesses, helping organizations improve efficiency and deliver digital services to their customers.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 67, ordersInQueue: 3, verified: true },
    whatItHelpsAchieve: ['internal business management systems', 'client portals and dashboards', 'workflow automation tools', 'subscription-based software platforms', 'online booking and scheduling systems', 'data management platforms'],
    howMeasured: ['number of application features or modules', 'complexity of functionality', 'integrations required', 'database architecture and scalability'],
    servicesInclude: ['Custom web application development', 'SaaS platform development', 'System integrations', 'Workflow automation tools', 'Database integration'],
    tools: ['React', 'Node.js', 'Python', 'Django', 'Ruby on Rails', 'PostgreSQL'],
    addOnOptions: ['payment gateway integration', 'subscription billing systems', 'third-party API integrations', 'advanced analytics dashboards', 'cloud hosting and infrastructure setup'],
    complementaryServices: [
      { name: 'API Integration & Automation', reason: 'connect systems' },
      { name: 'Website Development', reason: 'public-facing platform' },
      { name: 'UI/UX Graphic Design', reason: 'interface visuals' },
      { name: 'Data Analytics & Reporting', reason: 'application insights' },
      { name: 'Website Maintenance & Updates', reason: 'ongoing technical support' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$4,999', description: 'Ideal for businesses needing a simple custom web tool or internal system.', includes: ['1 custom web application feature or module', 'basic user interface design', 'database setup', 'user login and access control', 'basic functionality testing'] },
      growth: { name: 'Standard Package', price: '$14,999', description: 'Ideal for businesses building more advanced digital systems.', includes: ['multi-feature web application (up to 3 modules)', 'user account system', 'database integration', 'workflow automation features', 'responsive interface design'] },
      premium: { name: 'Premium Package', price: '$29,999', description: 'Ideal for businesses launching a SaaS platform or full digital product.', includes: ['complete SaaS application structure', 'multiple user roles and permissions', 'scalable database architecture', 'dashboard and reporting features', 'API integrations and automation', 'performance optimization and testing'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'User login & access control', values: { basic: true, standard: true, premium: true } },
        { label: 'Database setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Responsive interface design', values: { basic: false, standard: true, premium: true } },
        { label: 'Workflow automation features', values: { basic: false, standard: true, premium: true } },
        { label: 'Multiple user roles & permissions', values: { basic: false, standard: false, premium: true } },
        { label: 'Scalable database architecture', values: { basic: false, standard: false, premium: true } },
        { label: 'API integrations', values: { basic: false, standard: false, premium: true } },
        { label: 'Dashboard & reporting features', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$4,999', packageName: 'Starter Package', shortDescription: '1 custom feature/module, database setup', description: 'Ideal for businesses needing a simple custom web tool or internal system.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['1 custom web application feature or module', 'basic user interface design', 'database setup', 'user login and access control', 'basic functionality testing'] },
        standard: { price: '$14,999', packageName: 'Standard Package', shortDescription: 'Multi-feature application (up to 3 modules)', description: 'Ideal for businesses building more advanced digital systems.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['multi-feature web application (up to 3 modules)', 'user account system', 'database integration', 'workflow automation features', 'responsive interface design'] },
        premium: { price: '$29,999', packageName: 'Premium Package', shortDescription: 'Complete SaaS structure, multiple user roles', description: 'Ideal for businesses launching a SaaS platform or full digital product.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['complete SaaS application structure', 'multiple user roles and permissions', 'scalable database architecture', 'dashboard and reporting features', 'API integrations and automation', 'performance optimization and testing'] }
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
    addOnOptions: ['CRM setup and automation', 'marketing automation workflows', 'payment system integrations', 'reporting and data automation', 'ongoing automation maintenance'],
    complementaryServices: [
      { name: 'CRM & Marketing Automation', reason: 'lead management systems' },
      { name: 'Web Applications & SaaS Development', reason: 'custom digital tools' },
      { name: 'Data Analytics & Reporting', reason: 'analyze integrated data' },
      { name: 'Website Development', reason: 'connect websites with systems' },
      { name: 'Process Documentation & SOP Development', reason: 'document workflows' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$499', description: 'Ideal for businesses connecting two systems for the first time.', includes: ['1 system integration', 'basic data synchronization', 'simple workflow automation', 'testing and configuration'] },
      growth: { name: 'Standard Package', price: '$1,499', description: 'Ideal for businesses connecting multiple tools.', includes: ['up to 3 system integrations', 'workflow automation setup', 'data synchronization between platforms', 'automation testing and optimization'] },
      premium: { name: 'Premium Package', price: '$3,999', description: 'Ideal for businesses implementing full automation systems.', includes: ['multiple system integrations', 'advanced workflow automation', 'API configuration and data mapping', 'automation testing and optimization', 'documentation of automated workflows'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'System integrations included', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic data synchronization', values: { basic: true, standard: true, premium: true } },
        { label: 'Testing and configuration', values: { basic: true, standard: true, premium: true } },
        { label: 'Workflow automation setup', values: { basic: false, standard: true, premium: true } },
        { label: 'Multiple platform sync', values: { basic: false, standard: true, premium: true } },
        { label: 'Advanced workflow automation', values: { basic: false, standard: false, premium: true } },
        { label: 'API configuration & data mapping', values: { basic: false, standard: false, premium: true } },
        { label: 'Workflow documentation', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$499', packageName: 'Starter Package', shortDescription: '1 system integration, basic synchronization', description: 'Ideal for businesses connecting two systems for the first time.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['1 system integration', 'basic data synchronization', 'simple workflow automation', 'testing and configuration'] },
        standard: { price: '$1,499', packageName: 'Standard Package', shortDescription: 'Up to 3 system integrations, workflow automation', description: 'Ideal for businesses connecting multiple tools.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['up to 3 system integrations', 'workflow automation setup', 'data synchronization between platforms', 'automation testing and optimization'] },
        premium: { price: '$3,999', packageName: 'Premium Package', shortDescription: 'Multiple integrations, advanced automation', description: 'Ideal for businesses implementing full automation systems.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['multiple system integrations', 'advanced workflow automation', 'API configuration and data mapping', 'automation testing and optimization', 'documentation of automated workflows'] }
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
    addOnOptions: ['website backups and recovery', 'SEO updates and optimization', 'landing page creation', 'website performance audits', 'technical troubleshooting'],
    complementaryServices: [
      { name: 'Website Development', reason: 'new features or redesigns' },
      { name: 'SEO & Search Marketing', reason: 'improve search visibility' },
      { name: 'Graphic Design', reason: 'update visuals and marketing assets' },
      { name: 'Copywriting & Content Creation', reason: 'website content updates' },
      { name: 'Data Analytics & Reporting', reason: 'monitor website performance' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$149/month', description: 'Ideal for small websites needing occasional updates.', includes: ['up to 2 hours of maintenance per month', 'basic security monitoring', 'minor content updates', 'plugin and system updates', 'website performance check'] },
      growth: { name: 'Standard Package', price: '$349/month', description: 'Ideal for businesses regularly updating their website.', includes: ['up to 5 hours of maintenance per month', 'security monitoring and updates', 'content updates and small design changes', 'plugin and system updates', 'website performance optimization'] },
      premium: { name: 'Premium Package', price: '$899/month', description: 'Ideal for businesses that rely heavily on their website.', includes: ['up to 10 hours of maintenance per month', 'advanced security monitoring', 'priority support for website issues', 'regular content updates', 'performance optimization and technical adjustments'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Maintenance hours / month', values: { basic: true, standard: true, premium: true } },
        { label: 'Security monitoring', values: { basic: true, standard: true, premium: true } },
        { label: 'Plugin & system updates', values: { basic: true, standard: true, premium: true } },
        { label: 'Content updates', values: { basic: false, standard: true, premium: true } },
        { label: 'Performance optimization', values: { basic: false, standard: true, premium: true } },
        { label: 'Advanced security monitoring', values: { basic: false, standard: false, premium: true } },
        { label: 'Priority issue support', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$149/month', packageName: 'Starter Package', shortDescription: 'Up to 2 hours maintenance, security monitoring', description: 'Ideal for small websites needing occasional updates.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['up to 2 hours of maintenance per month', 'basic security monitoring', 'minor content updates', 'plugin and system updates', 'website performance check'] },
        standard: { price: '$349/month', packageName: 'Standard Package', shortDescription: 'Up to 5 hours maintenance, content updates', description: 'Ideal for businesses regularly updating their website.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['up to 5 hours of maintenance per month', 'security monitoring and updates', 'content updates and small design changes', 'plugin and system updates', 'website performance optimization'] },
        premium: { price: '$899/month', packageName: 'Premium Package', shortDescription: 'Up to 10 hours maintenance, priority support', description: 'Ideal for businesses that rely heavily on their website.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['up to 10 hours of maintenance per month', 'advanced security monitoring', 'priority support for website issues', 'regular content updates', 'performance optimization and technical adjustments'] }
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
    addOnOptions: ['payment integration', 'automated reminders', 'multi-staff support', 'custom booking rules', 'client management'],
    complementaryServices: [
      { name: 'Website Development', reason: 'integrate booking on your site' },
      { name: 'CRM & Marketing Automation', reason: 'manage customer data' },
      { name: 'Email Marketing Campaigns', reason: 'follow-up with customers' },
      { name: 'Virtual Assistant Services', reason: 'manage bookings' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$399', description: 'Ideal for businesses needing a simple booking system.', includes: ['Online booking system setup', 'Calendar integration', 'Email notifications', 'Mobile-friendly booking form', 'Basic customization'] },
      growth: { name: 'Standard Package', price: '$999', description: 'Ideal for businesses with multiple services or staff.', includes: ['Advanced booking system', 'Multiple service/slot configurations', 'Automated reminders', 'Payment integration', 'Customizable booking form'] },
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

  // ─── 3. WEBSITE GROWTH & MARKETING ───
  'social-media-management': {
    title: 'Social Media Management',
    category: 'Marketing & Growth',
    icon: <FaUsers />,
    intro: 'Social media platforms have become one of the most effective ways for businesses to connect with customers, promote services, and build brand awareness.',
    description: 'Maintaining a consistent and professional social media presence requires planning, content creation, and regular engagement.',
    longDescription: 'Scale Link Alliance provides comprehensive social media management services that help businesses maintain an active online presence, share valuable content, and connect with their audience in a professional and strategic way.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 203, ordersInQueue: 6, verified: true },
    whatItHelpsAchieve: ['increase brand visibility and awareness', 'engage with customers and followers', 'promote products and services', 'maintain a consistent content presence', 'support marketing and promotional campaigns'],
    howMeasured: ['number of posts created and published', 'engagement monitoring activities', 'platforms managed', 'performance reporting'],
    servicesInclude: ['Content posting and scheduling', 'Social media graphics', 'Audience engagement', 'Performance insights', 'Caption writing'],
    tools: ['Buffer', 'Hootsuite', 'Later', 'Sprout Social', 'Canva'],
    addOnOptions: ['social media advertising campaigns', 'short-form video content creation', 'content calendar planning', 'influencer outreach support', 'brand strategy consultation'],
    complementaryServices: [
      { name: 'Graphic Design', reason: 'visual social media content' },
      { name: 'Video Editing & Motion Graphics', reason: 'short-form video posts' },
      { name: 'Copywriting & Content Creation', reason: 'captions and messaging' },
      { name: 'Paid Advertising Management', reason: 'social media ads' },
      { name: 'Photography & Visual Assets', reason: 'content imagery' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$299/month', description: 'Ideal for small businesses maintaining a basic social media presence.', includes: ['8 social media posts per month', 'content scheduling', 'basic caption writing', 'engagement monitoring', 'performance overview'] },
      growth: { name: 'Standard Package', price: '$599/month', description: 'Ideal for businesses expanding their social media activity.', includes: ['15 social media posts per month', 'graphic content creation', 'caption writing and hashtags', 'audience engagement monitoring', 'monthly performance report'] },
      premium: { name: 'Premium Package', price: '$1,499/month', description: 'Ideal for businesses using social media as a primary marketing channel.', includes: ['30 social media posts per month', 'custom graphics and visuals', 'caption writing and strategy', 'engagement management', 'detailed performance reporting'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Posts per month', values: { basic: true, standard: true, premium: true } },
        { label: 'Content scheduling', values: { basic: true, standard: true, premium: true } },
        { label: 'Caption writing', values: { basic: true, standard: true, premium: true } },
        { label: 'Graphic content creation', values: { basic: false, standard: true, premium: true } },
        { label: 'Monthly performance report', values: { basic: false, standard: true, premium: true } },
        { label: 'Custom graphics & visuals', values: { basic: false, standard: false, premium: true } },
        { label: 'Detailed performance reporting', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$299/month', packageName: 'Starter Package', shortDescription: '8 posts/month, content scheduling', description: 'Ideal for small businesses maintaining a basic social media presence.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['8 social media posts per month', 'content scheduling', 'basic caption writing', 'engagement monitoring', 'performance overview'] },
        standard: { price: '$599/month', packageName: 'Standard Package', shortDescription: '15 posts/month, graphic content, monthly report', description: 'Ideal for businesses expanding their social media activity.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['15 social media posts per month', 'graphic content creation', 'caption writing and hashtags', 'audience engagement monitoring', 'monthly performance report'] },
        premium: { price: '$1,499/month', packageName: 'Premium Package', shortDescription: '30 posts/month, custom graphics, detailed reporting', description: 'Ideal for businesses using social media as a primary marketing channel.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['30 social media posts per month', 'custom graphics and visuals', 'caption writing and strategy', 'engagement management', 'detailed performance reporting'] }
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
    category: 'Marketing & Growth',
    icon: <FaSearch />,
    intro: 'Search Engine Optimization helps your business appear when potential customers search online for services or products related to your industry.',
    description: 'Effective SEO improves your website visibility in search engines, attracts targeted traffic, and supports long-term growth.',
    longDescription: 'Scale Link Alliance provides professional SEO and search marketing services designed to strengthen your online presence, optimize your website structure, and improve search rankings so the right audience can find your business.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.6, reviews: 78, ordersInQueue: 5, verified: true },
    whatItHelpsAchieve: ['increase website visibility in search engines', 'attract targeted organic traffic', 'improve search rankings for relevant keywords', 'strengthen online authority', 'generate more inquiries and leads'],
    howMeasured: ['number of pages optimized', 'keyword rankings', 'website traffic growth', 'search visibility improvements', 'lead generation from organic traffic'],
    servicesInclude: ['Keyword research', 'On-page SEO optimization', 'Technical SEO improvements', 'Content recommendations', 'Search performance tracking'],
    tools: ['SEMrush', 'Ahrefs', 'Google Search Console', 'Moz', 'Screaming Frog'],
    addOnOptions: ['blog content creation for SEO', 'local SEO optimization', 'competitor keyword analysis', 'SEO content strategy development', 'website technical SEO audits'],
    complementaryServices: [
      { name: 'Website Development', reason: 'SEO-friendly website structure' },
      { name: 'Copywriting & Content Creation', reason: 'optimized website content' },
      { name: 'Landing Pages & Sales Funnels', reason: 'convert search traffic' },
      { name: 'Graphic Design', reason: 'visual content for blog and marketing pages' },
      { name: 'Lead Generation Services', reason: 'expand sales opportunities' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$399/month', description: 'Ideal for small businesses beginning their SEO strategy.', includes: ['SEO audit of website', 'keyword research', 'optimization of up to 5 website pages', 'meta titles and descriptions', 'basic search performance tracking'] },
      growth: { name: 'Standard Package', price: '$899/month', description: 'Ideal for businesses actively working to improve search rankings.', includes: ['keyword research and strategy', 'optimization of up to 15 website pages', 'content optimization recommendations', 'technical SEO improvements', 'monthly performance report'] },
      premium: { name: 'Premium Package', price: '$1,999/month', description: 'Ideal for businesses seeking aggressive search growth.', includes: ['advanced keyword strategy', 'optimization of 30+ website pages', 'content strategy and recommendations', 'technical SEO improvements', 'backlink development guidance', 'monthly performance reporting and insights'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'SEO audit', values: { basic: true, standard: true, premium: true } },
        { label: 'Keyword research', values: { basic: true, standard: true, premium: true } },
        { label: 'Pages optimized', values: { basic: true, standard: true, premium: true } },
        { label: 'Technical SEO improvements', values: { basic: false, standard: true, premium: true } },
        { label: 'Monthly performance report', values: { basic: false, standard: true, premium: true } },
        { label: 'Advanced keyword strategy', values: { basic: false, standard: false, premium: true } },
        { label: 'Backlink development guidance', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$399/month', packageName: 'Starter Package', shortDescription: 'SEO audit, optimization of 5 pages', description: 'Ideal for small businesses beginning their SEO strategy.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['SEO audit of website', 'keyword research', 'optimization of up to 5 website pages', 'meta titles and descriptions', 'basic search performance tracking'] },
        standard: { price: '$899/month', packageName: 'Standard Package', shortDescription: 'Optimization of 15 pages, technical SEO', description: 'Ideal for businesses actively working to improve search rankings.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['keyword research and strategy', 'optimization of up to 15 website pages', 'content optimization recommendations', 'technical SEO improvements', 'monthly performance report'] },
        premium: { price: '$1,999/month', packageName: 'Premium Package', shortDescription: 'Optimization of 30+ pages, backlink guidance', description: 'Ideal for businesses seeking aggressive search growth.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['advanced keyword strategy', 'optimization of 30+ website pages', 'content strategy and recommendations', 'technical SEO improvements', 'backlink development guidance', 'monthly performance reporting and insights'] }
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
    category: 'Marketing & Growth',
    icon: <FaAd />,
    intro: 'Paid advertising can quickly generate leads and increase brand visibility.',
    description: 'We create and manage targeted advertising campaigns designed to reach the right audience and maximize return on investment.',
    longDescription: 'Scale Link Alliance provides professional paid advertising management services that help businesses quickly reach new customers and generate leads. We design and manage campaigns that target the right audience and maximize ROI.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.6, reviews: 71, ordersInQueue: 4, verified: true },
    whatItHelpsAchieve: ['reach new customers quickly', 'generate leads', 'increase brand visibility', 'target specific audiences', 'maximize marketing budget'],
    howMeasured: ['number of campaigns', 'audience targeting accuracy', 'conversion rates', 'return on ad spend'],
    servicesInclude: ['Google Ads management', 'Social media advertising', 'Audience targeting', 'Campaign performance optimization', 'Monthly reporting'],
    tools: ['Google Ads', 'Facebook Ads Manager', 'LinkedIn Ads', 'TikTok Ads'],
    addOnOptions: ['ad creative design', 'A/B testing', 'conversion tracking', 'budget optimization', 'performance analytics'],
    complementaryServices: [
      { name: 'Landing Pages', reason: 'conversion-optimized destinations' },
      { name: 'Copywriting', reason: 'ad messaging' },
      { name: 'Social Media', reason: 'organic support' },
      { name: 'Lead Generation', reason: 'integrated campaigns' },
      { name: 'Analytics', reason: 'performance tracking' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$399/month', description: 'Ideal for businesses launching their first ad campaigns.', includes: ['1 ad campaign', 'audience targeting', 'ad creative guidance', 'monthly report', 'basic optimization'] },
      growth: { name: 'Standard Package', price: '$899/month', description: 'Ideal for businesses running multiple campaigns.', includes: ['3 campaigns', 'advanced targeting', 'A/B testing', 'bi-weekly reports', 'regular optimization'] },
      premium: { name: 'Premium Package', price: '$1,999/month', description: 'Ideal for businesses requiring full ad management.', includes: ['full ad management', '10 campaigns', 'multi-platform campaigns', 'custom audiences', 'weekly reports', 'dedicated specialist'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Audience targeting', values: { basic: true, standard: true, premium: true } },
        { label: 'Ad creative guidance', values: { basic: true, standard: true, premium: true } },
        { label: 'Monthly report', values: { basic: true, standard: true, premium: true } },
        { label: 'A/B testing', values: { basic: false, standard: true, premium: true } },
        { label: 'Multi-platform campaigns', values: { basic: false, standard: false, premium: true } },
        { label: 'Custom audiences', values: { basic: false, standard: false, premium: true } },
        { label: 'Dedicated specialist', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$399/month', packageName: 'Starter Package', shortDescription: '1 ad campaign, audience targeting', description: 'Ideal for businesses launching their first ad campaigns.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['1 ad campaign', 'audience targeting', 'ad creative guidance', 'monthly report', 'basic optimization'] },
        standard: { price: '$899/month', packageName: 'Standard Package', shortDescription: '3 campaigns, audience targeting, monthly report', description: 'Ideal for businesses running multiple campaigns.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['3 campaigns', 'advanced targeting', 'A/B testing', 'bi-weekly reports', 'regular optimization'] },
        premium: { price: '$1,999/month', packageName: 'Premium Package', shortDescription: 'Full ad management, 10 campaigns, audience targeting', description: 'Ideal for businesses requiring full ad management.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['full ad management', '10 campaigns', 'multi-platform campaigns', 'custom audiences', 'weekly reports', 'dedicated specialist'] }
      }
    },
    sampleProject: {
      projectName: "AdGrowth Campaign Management",
      businessType: "Contractor / local service business",
      projectSummary: "A paid advertising concept created to help a business reach more potential customers through targeted online ad campaigns.",
      projectGoal: "Help the business attract better traffic, generate more leads, and promote its services to people who are more likely to take action.",
      servicesIncluded: ["Campaign planning", "Audience targeting", "Ad copy", "Creative direction", "Landing page recommendation", "Budget guidance", "Tracking setup", "Campaign monitoring", "Performance review"],
      portfolioCardText: "A paid advertising concept built to help businesses attract targeted traffic, generate leads, and track campaign performance."
    }
  },

  'email-marketing': {
    title: 'Email Marketing Campaigns',
    category: 'Marketing & Growth',
    icon: <FaEnvelope />,
    intro: 'Email marketing remains one of the most effective ways for businesses to communicate directly with their audience.',
    description: 'A well-designed email campaign can help nurture customer relationships, promote services or products, and encourage repeat engagement.',
    longDescription: 'Scale Link Alliance provides comprehensive email marketing campaign services that help businesses create professional email content, manage mailing lists, and deliver targeted messages that strengthen customer connections.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 94, ordersInQueue: 4, verified: true },
    whatItHelpsAchieve: ['maintain regular communication with customers', 'promote products, services, and announcements', 'nurture leads and prospects', 'increase customer engagement', 'encourage repeat business'],
    howMeasured: ['number of email campaigns created', 'level of customization and design', 'audience segmentation', 'performance tracking and reporting'],
    servicesInclude: ['Email campaign design', 'Newsletter creation', 'Marketing automation setup', 'Customer engagement emails', 'Campaign performance tracking'],
    tools: ['Mailchimp', 'Klaviyo', 'ActiveCampaign', 'ConvertKit', 'HubSpot'],
    addOnOptions: ['automated email sequences', 'newsletter design and management', 'email list growth strategies', 'CRM integration for email campaigns', 'campaign performance optimization'],
    complementaryServices: [
      { name: 'Lead Generation Services', reason: 'grow email lists' },
      { name: 'Copywriting & Content Creation', reason: 'email messaging' },
      { name: 'Graphic Design', reason: 'email visuals and templates' },
      { name: 'CRM & Marketing Automation', reason: 'automated workflows' },
      { name: 'Landing Pages & Sales Funnels', reason: 'convert email traffic' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$199', description: 'Ideal for businesses launching a simple email campaign.', includes: ['1 email campaign', 'email template design', 'content formatting', 'mailing list integration', 'campaign scheduling'] },
      growth: { name: 'Standard Package', price: '$499', description: 'Ideal for businesses running regular email communication.', includes: ['3 email campaigns', 'email template customization', 'campaign scheduling and delivery', 'basic audience segmentation', 'performance tracking summary'] },
      premium: { name: 'Premium Package', price: '$999', description: 'Ideal for businesses running structured email marketing programs.', includes: ['6 email campaigns', 'custom email templates', 'audience segmentation', 'performance analysis and reporting', 'campaign strategy recommendations'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Email campaigns included', values: { basic: true, standard: true, premium: true } },
        { label: 'Email template design', values: { basic: true, standard: true, premium: true } },
        { label: 'Mailing list integration', values: { basic: true, standard: true, premium: true } },
        { label: 'Audience segmentation', values: { basic: false, standard: true, premium: true } },
        { label: 'Performance tracking', values: { basic: false, standard: true, premium: true } },
        { label: 'Custom email templates', values: { basic: false, standard: false, premium: true } },
        { label: 'Campaign strategy recommendations', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$199', packageName: 'Starter Package', shortDescription: '1 email campaign, template design', description: 'Ideal for businesses launching a simple email campaign.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['1 email campaign', 'email template design', 'content formatting', 'mailing list integration', 'campaign scheduling'] },
        standard: { price: '$499', packageName: 'Standard Package', shortDescription: '3 email campaigns, audience segmentation', description: 'Ideal for businesses running regular email communication.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['3 email campaigns', 'email template customization', 'campaign scheduling and delivery', 'basic audience segmentation', 'performance tracking summary'] },
        premium: { price: '$999', packageName: 'Premium Package', shortDescription: '6 email campaigns, custom templates', description: 'Ideal for businesses running structured email marketing programs.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['6 email campaigns', 'custom email templates', 'audience segmentation', 'performance analysis and reporting', 'campaign strategy recommendations'] }
      }
    },
    sampleProject: {
      projectName: "InboxGrowth Email Campaign",
      businessType: "Online store",
      projectSummary: "An email marketing concept designed to help an online store welcome new subscribers, promote offers, recover missed sales, and encourage repeat purchases.",
      servicesIncluded: ["Welcome sequence", "Promotional emails", "Abandoned cart email", "Newsletter design", "Customer segmentation", "Reporting"],
      portfolioCardText: "An email marketing concept built to turn subscribers into customers and keep buyers engaged."
    }
  },

  'lead-generation': {
    title: 'Lead Generation Services',
    category: 'Marketing & Growth',
    icon: <FaRegBuilding />,
    intro: 'Consistent lead generation is essential for business growth.',
    description: 'Without a steady flow of potential customers, even the best products or services struggle to reach their full potential.',
    longDescription: 'Scale Link Alliance provides targeted lead generation services designed to help businesses identify and connect with qualified prospects who are more likely to be interested in their offerings.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.7, reviews: 82, ordersInQueue: 6, verified: true },
    whatItHelpsAchieve: ['identify potential customers', 'build a consistent sales pipeline', 'expand outreach opportunities', 'connect with targeted prospects', 'support marketing and sales efforts'],
    howMeasured: ['number of leads delivered', 'targeting criteria', 'level of research and qualification', 'delivery format of lead data'],
    servicesInclude: ['Target audience identification', 'Lead sourcing and research', 'Outreach strategies', 'Prospect qualification', 'Lead list delivery'],
    tools: ['LinkedIn Sales Navigator', 'Apollo.io', 'Hunter.io', 'CRM tools'],
    addOnOptions: ['CRM integration', 'outreach templates', 'follow-up sequences', 'lead enrichment', 'ongoing pipeline management'],
    complementaryServices: [
      { name: 'CRM & Marketing Automation', reason: 'manage leads' },
      { name: 'Email Marketing Campaigns', reason: 'contact prospects' },
      { name: 'Landing Pages & Sales Funnels', reason: 'convert leads' },
      { name: 'Paid Advertising Management', reason: 'generate additional leads' },
      { name: 'Copywriting & Content Creation', reason: 'sales messaging' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$199', description: 'Ideal for businesses building their initial lead pipeline.', includes: ['25 targeted leads', 'basic qualification', 'contact information', 'CSV export'] },
      growth: { name: 'Standard Package', price: '$599', description: 'Ideal for businesses scaling their sales efforts.', includes: ['100 leads', 'advanced qualification', 'enriched data', 'outreach templates', 'CRM integration support'] },
      premium: { name: 'Premium Package', price: '$1,499', description: 'Ideal for businesses needing ongoing lead flow.', includes: ['220 leads', 'monthly lead updates', 'full qualification', 'outreach support', 'strategy consultation'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Targeted leads included', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic qualification', values: { basic: true, standard: true, premium: true } },
        { label: 'Contact information / CSV export', values: { basic: true, standard: true, premium: true } },
        { label: 'Advanced qualification', values: { basic: false, standard: true, premium: true } },
        { label: 'Enriched data', values: { basic: false, standard: true, premium: true } },
        { label: 'Outreach templates', values: { basic: false, standard: true, premium: true } },
        { label: 'Monthly lead updates', values: { basic: false, standard: false, premium: true } },
        { label: 'Strategy consultation', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$199', packageName: 'Starter Package', shortDescription: '25 targeted leads, basic qualification', description: 'Ideal for businesses building their initial lead pipeline.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['25 targeted leads', 'basic qualification', 'contact information', 'CSV export'] },
        standard: { price: '$599', packageName: 'Standard Package', shortDescription: '100 leads, advanced qualification, enriched data', description: 'Ideal for businesses scaling their sales efforts.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['100 leads', 'advanced qualification', 'enriched data', 'outreach templates', 'CRM integration support'] },
        premium: { price: '$1,499', packageName: 'Premium Package', shortDescription: '220 leads, monthly lead updates, full qualification', description: 'Ideal for businesses needing ongoing lead flow.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['220 leads', 'monthly lead updates', 'full qualification', 'outreach support', 'strategy consultation'] }
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
    category: 'Marketing & Growth',
    icon: <FaStar />,
    intro: 'Your online reputation is one of the most important factors in building trust with potential customers.',
    description: 'Positive reviews and a strong reputation help businesses stand out, attract new customers, and build credibility in their industry.',
    longDescription: 'Scale Link Alliance provides reputation and review management services that help businesses collect positive reviews, respond to feedback professionally, and build a strong online reputation that attracts customers.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 45, ordersInQueue: 3, verified: true },
    whatItHelpsAchieve: ['build trust with potential customers', 'increase conversion rates', 'improve search rankings', 'stand out from competitors', 'strengthen brand credibility'],
    howMeasured: ['number of reviews collected', 'average rating improvement', 'review response rate', 'reputation score'],
    servicesInclude: ['Review collection system setup', 'Review monitoring', 'Response management', 'Reputation analysis', 'Monthly reporting'],
    tools: ['Google Business Profile', 'Trustpilot', 'Yelp', 'Birdeye', 'Reputation management platforms'],
    addOnOptions: ['review response templates', 'automated review requests', 'crisis response planning', 'competitive analysis', 'review generation campaigns'],
    complementaryServices: [
      { name: 'Social Media Management', reason: 'integrated reputation management' },
      { name: 'SEO & Search Marketing', reason: 'improve search visibility' },
      { name: 'Lead Generation Services', reason: 'convert reviews into leads' },
      { name: 'Email Marketing Campaigns', reason: 'request reviews' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$199', description: 'Ideal for businesses starting to collect reviews.', includes: ['Review collection system setup', 'Review monitoring', 'Basic response templates', 'Monthly review summary report'] },
      growth: { name: 'Standard Package', price: '$499', description: 'Ideal for businesses actively managing reviews.', includes: ['Advanced review collection', 'Multi-platform monitoring', 'Custom response management', 'Quarterly review analysis', 'Reputation improvement recommendations'] },
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

  // ─── 4. AUTOMATION, CRM & AI SYSTEMS ───
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
    addOnOptions: ['lead capture forms', 'automated workflows', 'lead scoring', 'pipeline tracking', 'analytics dashboards'],
    complementaryServices: [
      { name: 'Lead Generation', reason: 'feed leads into CRM' },
      { name: 'Email Marketing', reason: 'integrated campaigns' },
      { name: 'Web Development', reason: 'CRM-connected websites' },
      { name: 'API Integration', reason: 'system connectivity' },
      { name: 'Data Analytics', reason: 'performance tracking' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$499', description: 'Ideal for businesses implementing their first CRM.', includes: ['CRM setup', 'basic automation', 'lead capture forms', 'integration setup', 'documentation'] },
      growth: { name: 'Standard Package', price: '$1,499', description: 'Ideal for businesses scaling their automation.', includes: ['full CRM customization', 'email automation', 'lead scoring', 'pipeline management', 'analytics dashboard'] },
      premium: { name: 'Premium Package', price: '$2,999', description: 'Ideal for comprehensive marketing automation.', includes: ['complete marketing automation', 'multi-channel sequences', 'advanced lead scoring', 'custom reporting', 'strategy consultation', 'priority support'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'CRM setup', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic automation', values: { basic: true, standard: true, premium: true } },
        { label: 'Lead capture forms', values: { basic: true, standard: true, premium: true } },
        { label: 'Email automation', values: { basic: false, standard: true, premium: true } },
        { label: 'Lead scoring', values: { basic: false, standard: true, premium: true } },
        { label: 'Analytics dashboard', values: { basic: false, standard: true, premium: true } },
        { label: 'Multi-channel sequences', values: { basic: false, standard: false, premium: true } },
        { label: 'Priority support', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$499', packageName: 'Starter Package', shortDescription: 'CRM setup, basic automation, lead capture forms', description: 'Ideal for businesses implementing their first CRM.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['CRM setup', 'basic automation', 'lead capture forms', 'integration setup', 'documentation'] },
        standard: { price: '$1,499', packageName: 'Standard Package', shortDescription: 'Full CRM customization, email automation, lead scoring', description: 'Ideal for businesses scaling their automation.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['full CRM customization', 'email automation', 'lead scoring', 'pipeline management', 'analytics dashboard'] },
        premium: { price: '$2,999', packageName: 'Premium Package', shortDescription: 'Complete marketing automation, multi-channel sequences, reporting', description: 'Ideal for comprehensive marketing automation.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['complete marketing automation', 'multi-channel sequences', 'advanced lead scoring', 'custom reporting', 'strategy consultation', 'priority support'] }
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
    addOnOptions: ['CRM setup and integration', 'custom reporting dashboards', 'multi-channel notification routing', 'voice or call automation', 'ongoing automation maintenance and tuning'],
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
    description: 'Automating repetitive tasks frees up your team to focus on higher-value activities that drive growth.',
    longDescription: 'Scale Link Alliance provides business process automation services that help companies identify repetitive tasks, design automated workflows, and implement systems that save time and reduce errors.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.7, reviews: 38, ordersInQueue: 3, verified: true },
    whatItHelpsAchieve: ['reduce manual work', 'improve efficiency', 'eliminate errors', 'free up team time', 'scale operations without hiring'],
    howMeasured: ['number of automated workflows', 'time saved per task', 'error reduction rate', 'process complexity'],
    servicesInclude: ['Workflow mapping', 'Process automation setup', 'Integration with existing tools', 'Testing and optimization', 'Documentation'],
    tools: ['Zapier', 'Make', 'n8n', 'Microsoft Power Automate', 'Custom solutions'],
    addOnOptions: ['custom workflow development', 'API integration', 'training and documentation', 'ongoing support', 'advanced analytics'],
    complementaryServices: [
      { name: 'API Integration', reason: 'connect automated workflows' },
      { name: 'CRM & Marketing Automation', reason: 'automate sales processes' },
      { name: 'Data Analytics', reason: 'measure automation success' },
      { name: 'Process Documentation', reason: 'document workflows' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$299', description: 'Ideal for automating a single business process.', includes: ['1 automated workflow', 'Process mapping', 'Automation setup', 'Testing and documentation'] },
      growth: { name: 'Standard Package', price: '$999', description: 'Ideal for automating multiple business processes.', includes: ['3 automated workflows', 'Process mapping and optimization', 'Integration setup', 'Testing and documentation', 'Training support'] },
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
    addOnOptions: ['automated reporting dashboards', 'marketing campaign performance tracking', 'CRM data analysis', 'customer behavior analysis', 'monthly reporting services'],
    complementaryServices: [
      { name: 'CRM & Marketing Automation', reason: 'data collection and management' },
      { name: 'Lead Generation Services', reason: 'track prospect performance' },
      { name: 'SEO & Search Marketing', reason: 'measure search traffic growth' },
      { name: 'Paid Advertising Management', reason: 'analyze ad campaign performance' },
      { name: 'Website Development', reason: 'integrate analytics tools' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$199', description: 'Ideal for businesses needing basic performance insights.', includes: ['1 custom data report', 'basic data analysis', 'visual charts or graphs', 'summary of key insights'] },
      growth: { name: 'Standard Package', price: '$699', description: 'Ideal for businesses tracking multiple performance areas.', includes: ['3 custom reports', 'visual dashboards or charts', 'trend analysis', 'summary recommendations'] },
      premium: { name: 'Premium Package', price: '$1,999', description: 'Ideal for businesses seeking ongoing performance monitoring.', includes: ['custom analytics dashboard', '7 custom data reports', 'visual performance charts', 'detailed trend analysis', 'strategic insight summary'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Custom data reports', values: { basic: true, standard: true, premium: true } },
        { label: 'Visual charts or graphs', values: { basic: true, standard: true, premium: true } },
        { label: 'Trend analysis', values: { basic: false, standard: true, premium: true } },
        { label: 'Visual dashboards', values: { basic: false, standard: true, premium: true } },
        { label: 'Custom analytics dashboard', values: { basic: false, standard: false, premium: true } },
        { label: 'Strategic insight summary', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$199', packageName: 'Starter Package', shortDescription: '1 custom data report, basic analysis, visual charts', description: 'Ideal for businesses needing basic performance insights.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['1 custom data report', 'basic data analysis', 'visual charts or graphs', 'summary of key insights'] },
        standard: { price: '$699', packageName: 'Standard Package', shortDescription: '3 custom reports, dashboards, trend analysis, recommendations', description: 'Ideal for businesses tracking multiple performance areas.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['3 custom reports', 'visual dashboards or charts', 'trend analysis', 'summary recommendations'] },
        premium: { price: '$1,999', packageName: 'Premium Package', shortDescription: 'Custom analytics dashboard, multiple reports, strategic insights', description: 'Ideal for businesses seeking ongoing performance monitoring.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['custom analytics dashboard', '7 custom data reports', 'visual performance charts', 'detailed trend analysis', 'strategic insight summary'] }
      }
    },
    sampleProject: {
      projectName: "InsightTrack Business Reporting Dashboard",
      businessType: "Growing small business",
      projectSummary: "A data analytics and reporting concept designed to help a business understand performance across marketing, website traffic, leads, and customer activity.",
      projectGoal: "Give the business clearer insight into what is working, what needs improvement, and where growth opportunities may exist.",
      servicesIncluded: ["Performance dashboard setup", "Website traffic reports", "Lead tracking", "Campaign reporting", "KPI summaries", "Monthly insights", "Visual charts", "Recommendation notes"],
      portfolioCardText: "A reporting dashboard concept built to help businesses understand their numbers, track performance, and make smarter growth decisions."
    }
  },

  // ─── 5. BUSINESS STRATEGY & SUPPORT ───
  'business-consulting-growth-strategy': {
    title: 'Business Consulting & Growth Strategy',
    category: 'Operations & Support',
    icon: <FaBriefcase />,
    intro: 'Strategic guidance helps businesses identify opportunities, overcome challenges, and build a clear path to growth.',
    description: 'Our consulting services provide actionable insights and strategic recommendations to help you achieve your business goals.',
    longDescription: 'Scale Link Alliance provides business consulting and growth strategy services that help companies identify opportunities, develop actionable plans, and execute strategies that drive measurable results.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.9, reviews: 56, ordersInQueue: 3, verified: true },
    whatItHelpsAchieve: ['identify growth opportunities', 'develop strategic plans', 'overcome business challenges', 'improve decision-making', 'achieve business goals'],
    howMeasured: ['strategy sessions', 'action plans developed', 'recommendations provided', 'implementation support'],
    servicesInclude: ['Business assessment', 'Growth strategy development', 'Action plan creation', 'Implementation guidance', 'Performance tracking'],
    tools: ['Strategic frameworks', 'Business modeling', 'Market analysis', 'Competitive analysis', 'Financial modeling'],
    addOnOptions: ['quarterly strategy reviews', 'team workshops', 'market research', 'competitive analysis', 'implementation support'],
    complementaryServices: [
      { name: 'Data Analytics', reason: 'data-driven decisions' },
      { name: 'Lead Generation', reason: 'identify opportunities' },
      { name: 'Marketing Automation', reason: 'execute strategies' },
      { name: 'Process Documentation', reason: 'systemize operations' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$499', description: 'Ideal for businesses needing a standard plan.', includes: ['1 strategy session (60 min)', 'Business assessment', 'Growth recommendations', 'Action plan document'] },
      growth: { name: 'Standard Package', price: '$1,499', description: 'Ideal for businesses needing ongoing strategy support.', includes: ['3 strategy sessions (60 min each)', 'Growth strategy development', 'Implementation roadmap', 'Monthly progress reviews', 'Strategy adjustments'] },
      premium: { name: 'Premium Package', price: '$4,999', description: 'Ideal for businesses needing comprehensive strategic guidance.', includes: ['6 strategy sessions (90 min each)', 'Full business assessment', 'Detailed growth roadmap', 'Quarterly strategy reviews', 'Team support and implementation guidance', 'Priority access for consulting support'] }
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
        basic: { price: '$499', packageName: 'Starter Package', shortDescription: '1 strategy session, business assessment, action plan', description: 'Ideal for businesses needing a standard plan.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['1 strategy session (60 min)', 'Business assessment', 'Growth recommendations', 'Action plan document'] },
        standard: { price: '$1,499', packageName: 'Standard Package', shortDescription: '3 strategy sessions, implementation roadmap', description: 'Ideal for businesses needing ongoing strategy support.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['3 strategy sessions (60 min each)', 'Growth strategy development', 'Implementation roadmap', 'Monthly progress reviews', 'Strategy adjustments'] },
        premium: { price: '$4,999', packageName: 'Premium Package', shortDescription: '6 strategy sessions, full business assessment, quarterly reviews', description: 'Ideal for businesses needing comprehensive strategic guidance.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['6 strategy sessions (90 min each)', 'Full business assessment', 'Detailed growth roadmap', 'Quarterly strategy reviews', 'Team support and implementation guidance', 'Priority access for consulting support'] }
      }
    },
    sampleProject: {
      projectName: "GrowthMap Strategic Plan",
      businessType: "Service-based business",
      projectSummary: "A business consulting concept designed to help a company identify growth opportunities, develop a strategic plan, and achieve measurable results.",
      servicesIncluded: ["Business assessment", "Growth strategy", "Action plan", "Implementation roadmap", "Performance metrics", "Quarterly reviews"],
      portfolioCardText: "A business consulting concept built to help companies develop clear strategies, overcome challenges, and achieve sustainable growth."
    }
  },

  'virtual-assistant': {
    title: 'Virtual Assistant Services',
    category: 'Operations & Support',
    icon: <FaHeadset />,
    intro: 'Administrative and operational tasks can take valuable time away from strategic work and business growth.',
    description: 'Virtual assistants help businesses manage routine tasks efficiently, allowing business owners and teams to focus on higher-priority responsibilities.',
    longDescription: 'Scale Link Alliance provides professional virtual assistant services that support day-to-day business operations, administrative tasks, and organizational workflows.',
    sellerInfo: { name: 'ScaleLink Alliance Team', level: 'Professional', rating: 4.8, reviews: 178, ordersInQueue: 8, verified: true },
    whatItHelpsAchieve: ['reduce administrative workload', 'improve task organization and efficiency', 'support daily operational activities', 'manage communication and scheduling', 'free up time for business owners to focus on growth'],
    howMeasured: ['number of hours provided per month', 'scope of administrative tasks', 'level of coordination required', 'complexity of support activities'],
    servicesInclude: ['Email management', 'Calendar scheduling', 'Data entry', 'Administrative coordination', 'Customer support assistance'],
    tools: ['Google Workspace', 'Microsoft Office', 'Slack', 'Trello', 'Asana'],
    addOnOptions: ['travel booking', 'research tasks', 'document preparation', 'meeting scheduling', 'inbox management'],
    complementaryServices: [
      { name: 'Data Entry', reason: 'database management' },
      { name: 'Project Management', reason: 'task coordination' },
      { name: 'Process Documentation', reason: 'workflow standardization' },
      { name: 'Lead Generation', reason: 'outreach support' },
      { name: 'Customer Support', reason: 'client communication' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$149/month', description: 'Ideal for businesses needing light administrative support.', includes: ['up to 5 hours of virtual assistant support per month', 'email and calendar organization', 'basic administrative tasks', 'task tracking and reporting'] },
      growth: { name: 'Standard Package', price: '$399/month', description: 'Ideal for businesses needing regular operational assistance.', includes: ['up to 15 hours of virtual assistant support per month', 'administrative and scheduling support', 'basic customer communication assistance', 'document organization and data entry'] },
      premium: { name: 'Premium Package', price: '$999/month', description: 'Ideal for businesses requiring consistent operational support.', includes: ['up to 40 hours of virtual assistant support per month', 'administrative task management', 'coordination of communications and scheduling', 'task monitoring and reporting'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Support hours / month', values: { basic: true, standard: true, premium: true } },
        { label: 'Email & calendar organization', values: { basic: true, standard: true, premium: true } },
        { label: 'Task tracking & reporting', values: { basic: true, standard: true, premium: true } },
        { label: 'Customer communication assistance', values: { basic: false, standard: true, premium: true } },
        { label: 'Document organization & data entry', values: { basic: false, standard: true, premium: true } },
        { label: 'Full administrative management', values: { basic: false, standard: false, premium: true } },
        { label: 'Coordination across communications', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$149/month', packageName: 'Starter Package', shortDescription: 'Up to 5 hours support, email management, scheduling', description: 'Ideal for businesses needing light administrative support.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['up to 5 hours of virtual assistant support per month', 'email and calendar organization', 'basic administrative tasks', 'task tracking and reporting'] },
        standard: { price: '$399/month', packageName: 'Standard Package', shortDescription: 'Up to 15 hours support, administrative tasks, customer communication', description: 'Ideal for businesses needing regular operational assistance.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['up to 15 hours of virtual assistant support per month', 'administrative and scheduling support', 'basic customer communication assistance', 'document organization and data entry'] },
        premium: { price: '$999/month', packageName: 'Premium Package', shortDescription: 'Up to 40 hours support, full administrative management', description: 'Ideal for businesses requiring consistent operational support.', deliveryLabel: 'Shown during service selection', revisions: 'Ongoing monthly', includes: ['up to 40 hours of virtual assistant support per month', 'administrative task management', 'coordination of communications and scheduling', 'task monitoring and reporting'] }
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
    addOnOptions: ['workflow optimization consulting', 'team training on project management tools', 'documentation of project processes', 'reporting dashboards for project performance'],
    complementaryServices: [
      { name: 'Process Documentation & SOP Development', reason: 'structured workflows' },
      { name: 'Virtual Assistant Services', reason: 'task execution support' },
      { name: 'Data Analytics & Reporting', reason: 'project performance tracking' },
      { name: 'CRM & Marketing Automation', reason: 'project automation tools' },
      { name: 'Website Development or Marketing Services', reason: 'projects being implemented' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$499', description: 'Ideal for managing a small project or short-term initiative.', includes: ['management of 1 project', 'project planning and timeline development', 'task coordination', 'progress tracking and status updates'] },
      growth: { name: 'Standard Package', price: '$1,499', description: 'Ideal for businesses managing multiple tasks within a project.', includes: ['management of up to 3 project phases or workstreams', 'project planning and scheduling', 'task and milestone tracking', 'team coordination and communication'] },
      premium: { name: 'Premium Package', price: '$3,499', description: 'Ideal for businesses requiring full project oversight.', includes: ['comprehensive project management support', 'project planning and scheduling', 'team coordination across departments', 'progress tracking and milestone reporting', 'project performance review'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Projects / phases managed', values: { basic: true, standard: true, premium: true } },
        { label: 'Project planning & timeline', values: { basic: true, standard: true, premium: true } },
        { label: 'Task coordination', values: { basic: true, standard: true, premium: true } },
        { label: 'Milestone tracking', values: { basic: false, standard: true, premium: true } },
        { label: 'Team coordination across departments', values: { basic: false, standard: false, premium: true } },
        { label: 'Project performance review', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$499', packageName: 'Starter Package', shortDescription: 'Management of 1 project, timeline planning', description: 'Ideal for managing a small project or short-term initiative.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['management of 1 project', 'project planning and timeline development', 'task coordination', 'progress tracking and status updates'] },
        standard: { price: '$1,499', packageName: 'Standard Package', shortDescription: 'Management of up to 3 project phases, milestone tracking', description: 'Ideal for businesses managing multiple tasks within a project.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['management of up to 3 project phases or workstreams', 'project planning and scheduling', 'task and milestone tracking', 'team coordination and communication'] },
        premium: { price: '$3,499', packageName: 'Premium Package', shortDescription: 'Comprehensive project management, full oversight, reporting', description: 'Ideal for businesses requiring full project oversight.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['comprehensive project management support', 'project planning and scheduling', 'team coordination across departments', 'progress tracking and milestone reporting', 'project performance review'] }
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
    whatItHelpsAchieve: ['standardize workflows and procedures', 'improve team efficiency', 'simplify employee training', 'reduce operational errors', 'create systems that support business growth'],
    howMeasured: ['number of workflows documented', 'complexity of business processes', 'depth of documentation required', 'inclusion of workflow diagrams or guides'],
    servicesInclude: ['Workflow mapping', 'SOP documentation', 'Process improvement recommendations', 'Operational guidelines', 'Process diagrams'],
    tools: ['Notion', 'Process Street', 'LucidChart', 'Google Docs', 'Trainual'],
    addOnOptions: ['team training documentation', 'workflow automation recommendations', 'internal operations manuals', 'onboarding process documentation', 'knowledge base development'],
    complementaryServices: [
      { name: 'Project Management Support', reason: 'implement documented workflows' },
      { name: 'Virtual Assistant Services', reason: 'execute operational tasks' },
      { name: 'CRM & Marketing Automation', reason: 'automate processes' },
      { name: 'Data Analytics & Reporting', reason: 'measure operational performance' },
      { name: 'Data Entry & Processing', reason: 'manage workflow data' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$400', description: 'Ideal for businesses documenting a single workflow.', includes: ['1 documented business process', 'step-by-step SOP document', 'workflow outline or process map', 'basic formatting for easy reference'] },
      growth: { name: 'Standard Package', price: '$1,200', description: 'Ideal for businesses organizing multiple operational procedures.', includes: ['3 documented workflows', 'structured SOP documents', 'workflow diagrams or visual process maps', 'process improvement recommendations'] },
      premium: { name: 'Premium Package', price: '$3,500', description: 'Ideal for businesses building a full operational framework.', includes: ['6+ documented workflows', 'complete SOP manual or operations guide', 'workflow diagrams and structured documentation', 'recommendations for process optimization'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Documented workflows', values: { basic: true, standard: true, premium: true } },
        { label: 'Step-by-step SOP document', values: { basic: true, standard: true, premium: true } },
        { label: 'Workflow diagrams / process maps', values: { basic: false, standard: true, premium: true } },
        { label: 'Process improvement recommendations', values: { basic: false, standard: true, premium: true } },
        { label: 'Complete SOP manual', values: { basic: false, standard: false, premium: true } },
        { label: 'Process optimization recommendations', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$400', packageName: 'Starter Package', shortDescription: '1 documented workflow, step-by-step SOP, process map', description: 'Ideal for businesses documenting a single workflow.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['1 documented business process', 'step-by-step SOP document', 'workflow outline or process map', 'basic formatting for easy reference'] },
        standard: { price: '$1,200', packageName: 'Standard Package', shortDescription: '3 documented workflows, SOP documents, process diagrams', description: 'Ideal for businesses organizing multiple operational procedures.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['3 documented workflows', 'structured SOP documents', 'workflow diagrams or visual process maps', 'process improvement recommendations'] },
        premium: { price: '$3,500', packageName: 'Premium Package', shortDescription: '6+ documented workflows, complete SOP manual, operations guide', description: 'Ideal for businesses building a full operational framework.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['6+ documented workflows', 'complete SOP manual or operations guide', 'workflow diagrams and structured documentation', 'recommendations for process optimization'] }
      }
    },
    sampleProject: {
      projectName: "SOPBuilder Documentation System",
      businessType: "Growing small business",
      projectSummary: "A process documentation concept designed to help a business organize its operations, create standard procedures, and build systems that support growth.",
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
    addOnOptions: ['CRM database cleanup', 'data migration between systems', 'spreadsheet automation', 'document digitization', 'ongoing data management support'],
    complementaryServices: [
      { name: 'CRM & Marketing Automation', reason: 'organize and automate data' },
      { name: 'Data Analytics & Reporting', reason: 'analyze business data' },
      { name: 'Virtual Assistant Services', reason: 'administrative support' },
      { name: 'Process Documentation & SOP Development', reason: 'standardize workflows' },
      { name: 'Lead Generation Services', reason: 'expand business databases' }
    ],
    packages: {
      starter: { name: 'Starter Package', price: '$99', description: 'Ideal for small administrative data tasks.', includes: ['up to 200 records entered or updated', 'spreadsheet or database entry', 'basic data formatting', 'accuracy verification'] },
      growth: { name: 'Standard Package', price: '$299', description: 'Ideal for businesses managing larger datasets.', includes: ['up to 800 records entered or updated', 'spreadsheet or database management', 'data formatting and organization', 'accuracy verification and review'] },
      premium: { name: 'Premium Package', price: '$799', description: 'Ideal for businesses processing large volumes of information.', includes: ['up to 2,000 records entered or updated', 'structured data organization', 'formatting and data cleanup', 'verification and quality checks'] }
    },
    packageComparison: {
      tiers: ['basic', 'standard', 'premium'],
      rows: [
        { label: 'Records entered / updated', values: { basic: true, standard: true, premium: true } },
        { label: 'Basic data formatting', values: { basic: true, standard: true, premium: true } },
        { label: 'Accuracy verification', values: { basic: true, standard: true, premium: true } },
        { label: 'Database management', values: { basic: false, standard: true, premium: true } },
        { label: 'Data formatting & organization', values: { basic: false, standard: true, premium: true } },
        { label: 'Structured data organization', values: { basic: false, standard: false, premium: true } },
        { label: 'Quality checks', values: { basic: false, standard: false, premium: true } }
      ],
      details: {
        basic: { price: '$99', packageName: 'Starter Package', shortDescription: 'Up to 200 records, spreadsheet entry, basic formatting', description: 'Ideal for small administrative data tasks.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['up to 200 records entered or updated', 'spreadsheet or database entry', 'basic data formatting', 'accuracy verification'] },
        standard: { price: '$299', packageName: 'Standard Package', shortDescription: 'Up to 800 records, database management, data organization', description: 'Ideal for businesses managing larger datasets.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['up to 800 records entered or updated', 'spreadsheet or database management', 'data formatting and organization', 'accuracy verification and review'] },
        premium: { price: '$799', packageName: 'Premium Package', shortDescription: 'Up to 2,000 records, data cleanup, verification, quality checks', description: 'Ideal for businesses processing large volumes of information.', deliveryLabel: 'Shown during service selection', revisions: null, includes: ['up to 2,000 records entered or updated', 'structured data organization', 'formatting and data cleanup', 'verification and quality checks'] }
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

// ─── HELPER FUNCTIONS ───

// Gallery images now prefer the locally-optimized set generated by
// scripts/optimize-images.mjs (public/images/services/<slug>/*.webp).
// Falls back to the original remote gallery for any slug not yet processed.
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

// ─── IMAGE OPTIMIZATION HELPER (fallback path only) ───
// Only used for gallery images NOT yet covered by SERVICE_GALLERY_LOCAL.
// Once optimize-images.mjs has run for a slug, its images are already
// local (/images/services/...) and this passes them through untouched.
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
// Only sets `src` once the element is actually scrolled near the viewport
// (IntersectionObserver), instead of relying on native loading="lazy" —
// which can fire prematurely inside a horizontally-scrolling thumbnail
// strip and queue every request at once behind the browser's ~6
// concurrent-connections-per-host limit.
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

// ─── IMAGE GALLERY COMPONENT (full visibility) ───
const ImageGallery = ({ images, serviceTitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openFullscreen = () => setIsFullscreen(true);
  const closeFullscreen = () => setIsFullscreen(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFullscreen) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') closeFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentIndex]);

  // Warm the browser cache for the current image's fullscreen-res version
  // ahead of time, so clicking to expand doesn't pay a fresh network
  // round-trip. No-op (near-instant) once images are served locally.
  React.useEffect(() => {
    const img = new Image();
    img.src = optimizeImage(images[currentIndex], 1600, 82);
  }, [currentIndex, images]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="relative">
        <div
          className="rounded-xl overflow-hidden bg-gray-100 cursor-pointer group relative"
          onClick={openFullscreen}
        >
          <img
            src={optimizeImage(images[currentIndex], 1200)}
            alt={`${serviceTitle} - Image ${currentIndex + 1}`}
            width={1200}
            height={600}
            loading={currentIndex === 0 ? 'eager' : 'lazy'}
            fetchpriority={currentIndex === 0 ? 'high' : 'auto'}
            decoding="async"
            className="w-full h-auto max-h-[500px] object-contain bg-gray-50 transition-transform duration-300 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <span className="text-white text-sm font-semibold bg-black/60 px-4 py-2 rounded-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FaExpand className="inline" /> Click to view fullscreen
            </span>
          </div>
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-xl"
            >
              <FaChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-xl"
            >
              <FaChevronRight size={18} />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentIndex ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <LazyImg
                  src={optimizeImage(img, 100)}
                  alt={`Thumbnail ${idx + 1}`}
                  width={96}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <button onClick={closeFullscreen} className="absolute top-4 right-4 text-white/80 hover:text-white p-2 transition-colors z-10">
              <FaTimes size={28} />
            </button>
            <div className="absolute top-4 left-4 text-white/60 text-sm">{currentIndex + 1} / {images.length}</div>
            <div className="max-w-[90vw] max-h-[85vh] cursor-pointer" onClick={(e) => e.stopPropagation()}>
              <img
                src={optimizeImage(images[currentIndex], 1600, 82)}
                alt={`${serviceTitle} - Fullscreen`}
                loading="eager"
                decoding="async"
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            </div>
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all hover:scale-110">
                  <FaChevronLeft size={24} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all hover:scale-110">
                  <FaChevronRight size={24} />
                </button>
              </>
            )}
            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button key={idx} onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }} className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-white ring-2 ring-blue-400' : 'border-white/30 hover:border-white/60'}`}>
                    <LazyImg
                      src={optimizeImage(img, 100)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/30 text-xs hidden md:block">← → to navigate • ESC to close</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── MAIN COMPONENT ───
const ServiceDetailPage = () => {
  const { serviceSlug } = useParams();
  const service = SERVICES_DATA[serviceSlug];
  const [selectedPackage, setSelectedPackage] = useState('starter');

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The requested service could not be located.</p>
          <Link to="/services" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Browse All Services
          </Link>
        </div>
      </div>
    );
  }

  const images = getServiceImages(serviceSlug);
  const hasPackageComparison = service.packageComparison !== undefined && service.packageComparison !== null;
  const isCustomQuote = serviceSlug === 'ai-automation';

  const packageKeys = service.packages ? Object.keys(service.packages) : [];
  const validPackage = packageKeys.includes(selectedPackage) ? selectedPackage : (packageKeys[0] || '');
  const selectedPkg = validPackage && service.packages ? service.packages[validPackage] : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Hero Section with Image Gallery */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link to="/services" className="hover:text-blue-600">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{service.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Image Gallery + Content */}
            <div className="lg:col-span-2">
              <ImageGallery images={images.gallery} serviceTitle={service.title} />

              {service.sellerInfo && (
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {service.sellerInfo.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{service.sellerInfo.name}</p>
                      <p className="text-xs text-gray-500">{service.sellerInfo.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(service.sellerInfo.rating)}
                    <span className="text-sm font-semibold text-gray-900 ml-1">{service.sellerInfo.rating}</span>
                    <span className="text-sm text-gray-500">({service.sellerInfo.reviews} reviews)</span>
                  </div>
                  {service.sellerInfo.verified && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">✓ Verified</span>}
                  {service.sellerInfo.ordersInQueue && <span className="text-xs text-gray-500">{service.sellerInfo.ordersInQueue} orders in queue</span>}
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4">{service.title}</h1>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">{service.intro}</p>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.longDescription}</p>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                {isCustomQuote ? (
                  <>
                    <div className="text-center mb-4">
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full mb-2">Custom Quote Only</span>
                      <h3 className="text-2xl font-bold text-gray-900">Custom Quote</h3>
                      <p className="text-sm text-gray-500 mt-1">Based on your specific needs</p>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600"><FaClock className="text-gray-400" /><span>Custom delivery timeline</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600"><FaSyncAlt className="text-gray-400" /><span>Unlimited revisions</span></div>
                    </div>
                    <Link to="/request-service?service=custom-quote&step=2" className="block w-full py-3 px-4 bg-purple-600 text-white font-bold rounded-lg text-center hover:bg-purple-700 transition-colors shadow-md">Request Custom Quote</Link>
                    <Link to="/contact" className="block w-full mt-3 py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg text-center hover:bg-gray-50 transition-colors">Contact Me</Link>
                    <div className="mt-4 text-center"><p className="text-xs text-gray-400">Need flexibility? <Link to="/contact" className="text-blue-600 hover:underline">Hire by the hour</Link></p></div>
                  </>
                ) : (
                  <>
                    {packageKeys.length > 0 && (
                      <div className="mb-4">
                        <div className="flex border-b border-gray-200">
                          {packageKeys.map((pkgKey) => {
                            const pkg = service.packages[pkgKey];
                            const isActive = validPackage === pkgKey;
                            return (
                              <button key={pkgKey} onClick={() => setSelectedPackage(pkgKey)} className={`flex-1 py-2 text-sm font-semibold transition-all ${isActive ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                                {pkg?.name?.split(' ')[0] || pkgKey}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {selectedPkg && (
                      <>
                        <div className="mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{selectedPkg.name}</span>
                            <span className="text-2xl font-bold text-gray-900">{selectedPkg.price}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{selectedPkg.description}</p>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                          <span className="flex items-center gap-1"><FaClock className="text-gray-400" />Shown during selection</span>
                          <span className="flex items-center gap-1"><FaSyncAlt className="text-gray-400" />Unlimited Revisions</span>
                        </div>

                        {selectedPkg.includes && selectedPkg.includes.length > 0 && (
                          <div className="border-t border-gray-200 pt-3 mb-4">
                            <button className="w-full flex items-center justify-between text-sm font-semibold text-gray-900" onClick={() => { const el = document.getElementById('package-includes'); if (el) { el.classList.toggle('hidden'); } }}>
                              <span>What's Included</span>
                              <FaChevronDown className="text-gray-400 text-xs" />
                            </button>
                            <div id="package-includes" className="mt-2 space-y-1.5">
                              {selectedPkg.includes.map((item, idx) => (
                                <div key={idx} className="flex items-start text-sm text-gray-600">
                                  <FaCheck className="text-green-500 mr-2 mt-0.5 shrink-0" size={12} />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Link to={`/request-service?service=${serviceSlug}&package=${validPackage}`} className="block w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg text-center hover:bg-blue-700 transition-colors shadow-md">Continue</Link>
                        <Link to="/contact" className="block w-full mt-3 py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg text-center hover:bg-gray-50 transition-colors">Contact Me</Link>
                        <div className="mt-4 text-center"><p className="text-xs text-gray-400">Need flexibility? <Link to="/contact" className="text-blue-600 hover:underline">Hire by the hour</Link></p></div>
                      </>
                    )}
                  </>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><FaShieldAlt className="text-green-500" />Secure</span>
                  <span className="flex items-center gap-1"><FaClock className="text-blue-500" />5-Day Delivery</span>
                  <span className="flex items-center gap-1"><FaSyncAlt className="text-purple-500" />Unlimited Revisions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the page */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* What This Service Helps Businesses Achieve */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What This Service Helps Businesses Achieve</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.whatItHelpsAchieve.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <FaCheck className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How This Service Is Measured */}
        <section className="mb-16 bg-gray-50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How This Service Is Measured</h2>
          <p className="text-gray-600 mb-4">This ensures transparent pricing and clear deliverables.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {service.howMeasured.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Services Include */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Services Include</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {service.servicesInclude.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaCheck className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tools & Technologies */}
        {service.tools && service.tools.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <FaTools className="mr-3 text-gray-700" />
              Tools & Technologies
            </h2>
            <div className="flex flex-wrap gap-3">
              {service.tools.map((tool, index) => (
                <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">{tool}</span>
              ))}
            </div>
          </section>
        )}

        {/* Add-On Options */}
        {service.addOnOptions && service.addOnOptions.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add-On Options</h2>
            <p className="text-gray-600 mb-4">Businesses may also request additional services such as:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {service.addOnOptions.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Package Comparison Table */}
        {hasPackageComparison && (
          <section className="mb-16">
            <PackageComparison packageData={service.packageComparison} serviceSlug={serviceSlug} />
          </section>
        )}

        {/* Final CTA */}
        <section className="text-center py-12 bg-gray-50 rounded-2xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Get Professional Results?</h2>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">Submit your service request today. No membership required, no commitments — just professional execution.</p>
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 border-l-4 border-l-blue-500 rounded-r-xl rounded-l-md max-w-2xl mx-auto mb-8 text-left shadow-sm transition-all duration-300 hover:shadow-md">
            <FaInfoCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
            <p className="text-sm leading-relaxed text-blue-800 font-medium">
              <span className="font-semibold text-blue-950">Starting price options</span> are shown during service selection. <span className="font-semibold text-blue-950">Custom quotes</span> are available for larger or more detailed projects.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/request-service?service=custom-quote" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
              <FaArrowRight className="mr-2" /> Request Service Now
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors">
              <FaHeadset className="mr-2" /> Schedule Free Consultation
            </Link>
          </div>
        </section>
      </main>
    </motion.div>
  );
};

export default ServiceDetailPage;