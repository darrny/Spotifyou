import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginWithSpotify } from '../utils/auth';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      const data = await loginWithSpotify();
      if (data) {
        // Redirect to the page they tried to visit or home
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Spotifyou
        </h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Your personal music companion powered by AI. Connect with your Spotify account to get started.
        </p>
        <button
          onClick={handleLogin}
          className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
        >
          Connect with Spotify
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-sm text-gray-500"
      >
        By continuing, you agree to share your Spotify data with Spotifyou
      </motion.div>
    </div>
  );
}

export default Login;