import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isVerified, setIsVerified] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const token = localStorage.getItem('cms_token');
  
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerified(false);
        return;
      }

      try {
        const response = await fetch('/api/cms/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsVerified(true);
          setUserRole(data.user?.role);
          
          // Check for incomplete profile
          const isCompletingProfile = window.location.pathname === '/hub/complete-profile';
          if (data.user?.role === 'worker' && !data.user?.isProfileComplete && !isCompletingProfile) {
            window.location.href = '/hub/complete-profile';
          }
        } else {
          localStorage.removeItem('cms_token');
          setIsVerified(false);
        }
      } catch (error) {
        console.error('Verification error:', error);
        // On network error, we might want to retry or fail gracefully. For now, we deny access for safety.
        setIsVerified(false);
      }
    };

    verifyToken();
  }, [token]);

  // While checking validity, show a loading state
  if (isVerified === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isVerified) {
    return <Navigate to="/hub/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/hub" replace />;
  }

  return children;
};

export default ProtectedRoute;
