// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/layout/ErrorBoundary';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import ChaptersPage from './pages/Chapters/ChaptersPage';
import ChapterDetailPage from './pages/Chapters/ChapterDetailPage';
import MembershipPage from './pages/Memberships/MembershipPage';
import ServicesPage from './pages/Services/ServicesPage';
import ServiceDetailPage from './pages/Services/ServiceDetailPage';
import ServiceRequestPage from './pages/Services/ServiceRequestPage';
import BecomeDirectorPage from './pages/Director/BecomeDirectorPage';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import Legal from './pages/Legal';
import FAQPage from './pages/FAQPage';
import VerifyEmail from './pages/VerifyEmail';
import ClientPortalPage from './pages/ClientPortalPage';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminResources from './pages/Admin/AdminResources';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminPartners from './pages/Admin/AdminPartners';
import AdminNoticeBoard from './pages/Admin/AdminNoticeBoard';
import AdminNotifications from './pages/Admin/Notifications';
import HubReports from './pages/Admin/HubReports';
import CompleteProfile from './pages/Admin/CompleteProfile';
import WorkHistory from './pages/Admin/WorkHistory';
import BusinessPartnersPage from './pages/BusinessPartnersPage';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/hub');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!isAdminRoute && <Header />}
      <main className="grow">
        <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/chapters" element={<ChaptersPage />} />
              <Route path="/chapters/:city" element={<ChapterDetailPage />} />
              <Route path="/membership" element={<MembershipPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:serviceSlug" element={<ServiceDetailPage />} />
              <Route path="/request-service" element={<ServiceRequestPage />} />
              <Route path="/become-director" element={<BecomeDirectorPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/track-job/:token" element={<ClientPortalPage />} />
              
              {/* CMS Hub Routes */}
              <Route path="/hub/login" element={<AdminLogin />} />
              <Route path="/hub/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
              <Route path="/hub" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/hub/resources" element={<ProtectedRoute><AdminResources /></ProtectedRoute>} />
              <Route path="/hub/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
              <Route path="/hub/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
              <Route path="/hub/partners" element={<ProtectedRoute requiredRole="super_admin"><AdminPartners /></ProtectedRoute>} />
              <Route path="/hub/notice-board" element={<ProtectedRoute><AdminNoticeBoard /></ProtectedRoute>} />
              <Route path="/hub/work-history" element={<ProtectedRoute><WorkHistory /></ProtectedRoute>} />
              <Route path="/hub/notifications" element={<ProtectedRoute><AdminNotifications /></ProtectedRoute>} />
              <Route path="/hub/reports" element={<ProtectedRoute requiredRole="super_admin"><HubReports /></ProtectedRoute>} />
              <Route path="/business-partners" element={<BusinessPartnersPage />} />

              {/* Catch all route for 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          {!isAdminRoute && <Footer />}
        </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <AppContent />
        <ToastContainer position="bottom-right" theme="colored" />
      </Router>
    </ErrorBoundary>
  );
}


export default App;