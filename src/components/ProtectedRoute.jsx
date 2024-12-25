import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/auth';
import { LoadingSpinner } from './ErrorBoundary';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
      } catch (error) {
        console.error('Error checking auth session:', error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    // Redirect to login with the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;