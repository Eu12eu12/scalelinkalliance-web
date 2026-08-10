#!/usr/bin/env node
/**
 * scripts/optimize-images.mjs
 *
 * One-time build step: downloads every ibb.co gallery image referenced in
 * ServiceDetailPage.jsx, resizes + converts each to WebP, and saves them
 * locally under /public/images/services/<slug>/. Also writes a mapping
 * file (src/data/serviceImagesLocal.js) you import instead of hitting
 * a remote proxy at runtime.
 *
 * Usage:
 *   npm install sharp
 *   node scripts/optimize-images.mjs
 *
 * Safe to interrupt and re-run — already-converted images are skipped.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import crypto from 'crypto';

// ─── CONFIG ───
const OUTPUT_DIR = path.resolve('public/images/services');
const MAPPING_FILE = path.resolve('src/data/serviceImagesLocal.js');
const TARGET_WIDTH = 900;
const WEBP_QUALITY = 78;
const CONCURRENCY = 4;          // parallel downloads at a time — kept low; ibb.co appears to throttle bursts
const FETCH_TIMEOUT_MS = 30000; // give a single download up to 30s before treating it as stuck
const MAX_RETRIES = 4;          // retry a failed/timed-out download this many times before giving up
const RETRY_DELAY_MS = 1500;    // base delay between retries (grows each attempt)

// Plain Node fetch sends no User-Agent, which some image hosts (ibb.co
// included) silently throttle or drop rather than reject outright — the
// request just hangs until your own timeout fires. Sending browser-like
// headers avoids that.
const REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
  'Referer': 'https://ibb.co/'
};

// ─── SOURCE URLS ───
const GALLERIES = {
  'graphic-design': [
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
  ],
  'video-editing': [
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
  ],
  'copywriting': [
    'https://i.ibb.co/6R4fRHSy/Camera-and-Fruit-and-Person.jpg',
    'https://i.ibb.co/BJTYNGx/Computer-and-mic.jpg',
    'https://i.ibb.co/1fBW2yz2/Deck-and-person.jpg',
    'https://i.ibb.co/jkKsd5qh/Two-women-talk-show.jpg',
    'https://i.ibb.co/dJ2kMKgG/video-editing-workstation.jpg',
    'https://i.ibb.co/236FXqZR/Woman-with-cat-reading-article.jpg',
    'https://i.ibb.co/YF2RF8zS/Woman-with-photo-Demonstration.jpg',
    'https://i.ibb.co/VWRph4Dr/writer-workplace.jpg'
  ],
  'brand-identity': [
    'https://i.ibb.co/tPxmm1Gw/Blue-Corporate-Identity-Kit.jpg',
    'https://i.ibb.co/HQBMqnG/Brand-Guidelines-Book.jpg',
    'https://i.ibb.co/4R6jjvcT/corporate-identity-template-for-your-business-includes-CD-Cover-Business-Card-folder-ruler-Envelope.jpg',
    'https://i.ibb.co/ymyC3HPF/Landscape-Company-Branding.jpg',
    'https://i.ibb.co/C5zmKCYY/Red-Branding-Stationery.jpg',
    'https://i.ibb.co/4ZMJL2tP/Restaurant-Brand-Identity-Mockups.jpg',
    'https://i.ibb.co/KjCyrMrY/Road-Company-Branding-Package.jpg',
    'https://i.ibb.co/9m528j4j/Road-Company-Brand-Identity.jpg'
  ],
  'photography': [
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
  ],
  'website-development': [
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
  ],
  'landing-pages': [
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
  ],
  'ecommerce-development': [
    'https://i.ibb.co/v6VQrCJb/Customer-Shopping-Online.jpg',
    'https://i.ibb.co/Zp00n1qM/Mobile-e-Commerce-App.jpg',
    'https://i.ibb.co/JW30L4TT/Modern-e-Commerce-Purchase.jpg',
    'https://i.ibb.co/B5cwfFPM/Online-Shopping-Workspace.jpg',
    'https://i.ibb.co/jPRbV1Wq/Real-e-Commerce-Store-on-Laptop.jpg'
  ],
  'web-applications': [
    'https://i.ibb.co/gM3R6Sgn/Cloud-computing-meeting.jpg',
    'https://i.ibb.co/wFCTsCyM/Dashboard-UI-on-laptop.jpg',
    'https://i.ibb.co/zTj9ysvP/Modern-analytics-dashboard-over-laptop.jpg',
    'https://i.ibb.co/20wvqs6m/Modern-application-UI-windows.jpg',
    'https://i.ibb.co/cSVBt5JF/Saa-S-concept-collage.jpg',
    'https://i.ibb.co/kppWM1Y/Saa-S-product-being-developed-or-demonstrated.jpg'
  ],
  'api-integration': [
    'https://ibb.co/jPx8j6KS',
    'https://ibb.co/7xFVPBc7',
    'https://ibb.co/sDNg6dC',
    'https://ibb.co/LhNYgrR7',
    'https://ibb.co/DmM66y7',
    'https://ibb.co/s9jGzvPR',
    'https://ibb.co/fYSxKJCs'
  ],
  'website-maintenance': [
    'https://i.ibb.co/LXh5VzHH/Hands-typing-on-a-keyboard.jpg',
    'https://i.ibb.co/HfWHjdtT/Person-holding-a-laptop.jpg',
    'https://i.ibb.co/T5ZmV5L/Person-interacting-with-a-website-interface.jpg',
    'https://i.ibb.co/DH11CV4V/Planned-maintenance.jpg'
  ],
  'online-booking-systems': [
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
  ],
  'social-media-management': [
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
  ],
  'seo-marketing': [
    'https://i.ibb.co/jZw0rytN/Business-consultant-presenting-ideas-across-a-tablet-and-laptop.jpg',
    'https://i.ibb.co/CpxDGpc6/Laptop-with-SEO-dashboard.jpg',
    'https://i.ibb.co/S4C9LXSs/man-and-woman-discuss-seo.jpg',
    'https://i.ibb.co/CprDG2Qz/people-discussing-a-project-with-laptops-tablets-and-documents.jpg',
    'https://i.ibb.co/4wsyvqjF/SEO-search-bar-with-two-people-collaborating.jpg',
    'https://i.ibb.co/wr7fgFmF/The-team-reviewing-charts-while-someone-works-on-the-laptop.jpg',
    'https://i.ibb.co/Psbw84rD/Woman-clicking-a-search-button.jpg'
  ],
  'paid-advertising': [
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
  ],
  'email-marketing': [
    'https://i.ibb.co/1xhsg1X/Digital-Marketing-Concept-Startup-Project-Work.jpg',
    'https://i.ibb.co/tMHz43tb/Digital-Marketing-on-Laptop.jpg',
    'https://i.ibb.co/gbf3wkfQ/Email-Engagement.jpg',
    'https://i.ibb.co/GfHJ1JWX/e-Mail-Marketing-Doodle.jpg',
    'https://i.ibb.co/JjfyHJJB/Email-notifications-and-analytics-together.jpg',
    'https://i.ibb.co/9Htx5DqQ/Inbox-management-visualization.jpg',
    'https://i.ibb.co/JRwq6dBY/Shows-the-entire-email-marketing-funnel-product.png',
    'https://i.ibb.co/5W2sVFjj/Person-managing-email-campaigns-on-a-laptop.jpg'
  ],
  'lead-generation': [
    'https://i.ibb.co/dZFFMz4/Designer-using-drawing-tablet.jpg',
    'https://i.ibb.co/7xgGgY6D/Developer-building-a-landing-page.jpg',
    'https://i.ibb.co/kg5ztzXp/Digital-Marketing-Meeting.jpg',
    'https://i.ibb.co/3yFwpyhL/Lead-Generation-Network.jpg',
    'https://i.ibb.co/twrB98nG/Lead-Generation-on-Laptop.jpg',
    'https://i.ibb.co/HDrwV1KS/lead-generation-outline-infographics.jpg',
    'https://i.ibb.co/N6QtXKX5/Lead-generation-process-diagram.jpg',
    'https://i.ibb.co/Kp94vjyP/Tablet-with-Lead-Generation.jpg',
    'https://i.ibb.co/0pj76Vq9/Tablet-with-Lead-Generation-Network.jpg'
  ],
  'crm-automation': [
    'https://i.ibb.co/fG4xm2v9/CRM-dashboard-with-analytics-and-KPI-overlays.jpg',
    'https://i.ibb.co/ZRmH9zxK/CRM-displayed-on-a-laptop-in-a-real-office.jpg',
    'https://i.ibb.co/JjvDJ6kH/CRM-text-is-pushed-left-and-competes-with-all-the-hexagons.jpg',
    'https://i.ibb.co/YFdJs1Xk/Marketing-automation.jpg',
    'https://i.ibb.co/yFnMy2hN/Person-interacting-with-a-CRM-interface-on-a-laptop.jpg',
    'https://i.ibb.co/CpVqxY6P/Tablet-displaying-dashboards-in-a-real-office.jpg',
    'https://i.ibb.co/Pvc7x9cn/Team-collaboration-plus-CRM-overlay.jpg',
    'https://i.ibb.co/S4dMN8cg/The-person-interacting-with-a-CRM-dashboard-on-a-laptop.jpg',
    'https://i.ibb.co/bg6cGxZ1/We-implement-CRM-systems.jpg'
  ],
  'ai-automation': [
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
  ],
  'data-analytics': [
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
  ],
  'virtual-assistant': [
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
  ],
  'project-management': [
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
  ],
  'process-documentation': [
    'https://i.ibb.co/SDJkjW06/Business-meeting-with-reports-tablet-and-lipboard.jpg',
    'https://i.ibb.co/b5yZxBXm/Business-team-reviewing-reports-and-process-documents.jpg',
    'https://i.ibb.co/1Sy84Pm/Close-up-of-reports-with-laptop-and-tablet.jpg',
    'https://i.ibb.co/213dMk2y/Document-workflow-over-a-real-laptop.jpg',
    'https://i.ibb.co/WNF9fxW3/Person-reviewing-analytics-on-tablet.jpg',
    'https://i.ibb.co/Nngdcd1m/Project-Lifecycle-Flowchart-Mapping-Workflow-for-Creative-and-Manufacturing.jpg',
    'https://i.ibb.co/DDwJBrNr/Swimlane-flowchart-mapping-cross-functional-corporate-processes.jpg',
    'https://i.ibb.co/tdg1vn5/workflow-line-infographics.jpg'
  ],
  'data-entry': [
    'https://i.ibb.co/1Y3yCWg0/Credit-Card-on-Laptop.jpg',
    'https://i.ibb.co/ch4KyGvg/Customer-Support-Representative.jpg',
    'https://i.ibb.co/Zztxysqq/DATA-on-the-Office-Window.jpg',
    'https://i.ibb.co/6cBK34Nd/Office-Employee-Working.jpg',
    'https://i.ibb.co/Zz44n3sw/Office-Staff-Using-Business-Software.jpg',
    'https://i.ibb.co/B26f8fJ9/Online-Payment-Processing.jpg',
    'https://i.ibb.co/MyMgNn34/Professional-Typing.jpg',
    'https://i.ibb.co/TBV5mK6x/Warehouse-Data-Processing.jpg'
  ]
};

// ─── HELPERS ───
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ibb.co gives out two different kinds of link:
//   https://i.ibb.co/CODE/filename.jpg   → the actual image bytes (fine to fetch directly)
//   https://ibb.co/CODE                  → a VIEWER PAGE (HTML) that displays the image —
//                                          fetching this directly gets you a webpage, not
//                                          an image, so sharp() fails on every single one.
// This resolves the second kind by fetching the page and pulling the real
// image URL out of its <meta property="og:image"> tag.
async function resolveDirectImageUrl(url) {
  if (/^https?:\/\/i\.ibb\.co\//i.test(url)) return url; // already direct
  if (!/^https?:\/\/ibb\.co\//i.test(url)) return url;   // some other host (catbox.moe etc.) — already direct

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: REQUEST_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching viewer page ${url}`);
    const html = await res.text();
    const match =
      html.match(/<meta property="og:image" content="([^"]+)"/i) ||
      html.match(/<img[^>]+id="image-viewer-image"[^>]+src="([^"]+)"/i);
    if (!match) throw new Error(`Could not find a direct image URL on viewer page ${url}`);
    return match[1];
  } finally {
    clearTimeout(timeout);
  }
}

async function downloadAndConvertOnce(url, outPath) {
  const directUrl = await resolveDirectImageUrl(url);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(directUrl, { signal: controller.signal, headers: REQUEST_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${directUrl}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    await sharp(buffer)
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outPath);
  } finally {
    clearTimeout(timeout);
  }
}

async function downloadAndConvert(url, outPath) {
  let lastErr;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await downloadAndConvertOnce(url, outPath);
      return;
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt); // 1s, then 2s, then 3s
      }
    }
  }
  throw lastErr;
}

async function runPool(tasks, concurrency) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      try {
        results[idx] = await tasks[idx]();
      } catch (err) {
        results[idx] = { error: err.message };
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

// ─── MAIN ───
async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(MAPPING_FILE), { recursive: true });

  const mapping = {};
  let done = 0;
  let failed = 0;
  const total = Object.values(GALLERIES).reduce((n, arr) => n + arr.length, 0);

  // Flatten every image across every slug into ONE task queue so all
  // CONCURRENCY workers stay busy across slug boundaries instead of
  // pausing between each slug's batch (which is what slowed things down).
  const allTasks = [];
  for (const [slug, urls] of Object.entries(GALLERIES)) {
    const slugDir = path.join(OUTPUT_DIR, slug);
    fs.mkdirSync(slugDir, { recursive: true });
    mapping[slug] = new Array(urls.length);

    urls.forEach((url, idx) => {
      allTasks.push(async () => {
        const filename = `${String(idx + 1).padStart(2, '0')}.webp`;
        const outPath = path.join(slugDir, filename);
        const publicPath = `/images/services/${slug}/${filename}`;

        if (fs.existsSync(outPath)) {
          mapping[slug][idx] = publicPath;
          done++;
          return;
        }

        try {
          await downloadAndConvert(url, outPath);
          mapping[slug][idx] = publicPath;
          done++;
          process.stdout.write(`\r  Processed ${done}/${total} (${failed} failed)`);
        } catch (err) {
          failed++;
          mapping[slug][idx] = url; // fall back to the original remote URL
          console.error(`\n  FAILED: ${slug} #${idx + 1} — ${err.message} (kept remote URL)`);
        }
      });
    });
  }

  await runPool(allTasks, CONCURRENCY);

  console.log(`\n\nDone. ${done}/${total} images converted, ${failed} kept as remote fallback.`);

  // ─── DUPLICATE DETECTION ───
  // Different URLs sometimes turn out to be the same photo (uploaded
  // twice under different links). Hash every converted file's content
  // and flag any matches within the same gallery, along with the exact
  // source URLs responsible, so you know which one(s) to swap out.
  console.log('\nChecking for duplicate images within each gallery...');
  let anyDuplicates = false;
  for (const [slug, urls] of Object.entries(GALLERIES)) {
    const slugDir = path.join(OUTPUT_DIR, slug);
    const hashGroups = {}; // hash -> [{ index, url, file }]

    urls.forEach((url, idx) => {
      const filePath = path.join(slugDir, `${String(idx + 1).padStart(2, '0')}.webp`);
      if (!fs.existsSync(filePath)) return; // wasn't converted (kept remote) — can't hash it
      const hash = crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
      (hashGroups[hash] ||= []).push({ index: idx + 1, url });
    });

    for (const group of Object.values(hashGroups)) {
      if (group.length > 1) {
        anyDuplicates = true;
        console.log(`\n  DUPLICATE in "${slug}" — these ${group.length} entries are the exact same image:`);
        group.forEach(({ index, url }) => console.log(`    #${index}: ${url}`));
      }
    }
  }
  if (!anyDuplicates) {
    console.log('  None found — every converted image is unique within its gallery.');
  } else {
    console.log('\n  Replace all but one URL in each duplicate group above with a different photo, then re-run this script.');
  }

  const fileContents = `// AUTO-GENERATED by scripts/optimize-images.mjs — do not edit by hand.
// Re-run the script to regenerate after changing image sources.
export const SERVICE_GALLERY_LOCAL = ${JSON.stringify(mapping, null, 2)};
`;
  fs.writeFileSync(MAPPING_FILE, fileContents);
  console.log(`Mapping written to ${path.relative(process.cwd(), MAPPING_FILE)}`);
  console.log(`Images written to ${path.relative(process.cwd(), OUTPUT_DIR)}/<slug>/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
