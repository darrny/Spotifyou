import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Mic2, 
  Music, 
  Sparkles,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { logout } from '../utils/auth';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/top-artists', label: 'Top Artists', icon: Mic2 },
  { path: '/top-songs', label: 'Top Songs', icon: Music },
  { path: '/ai-recommendations', label: 'Recommendations', icon: Sparkles },
];

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Minimal Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 text-white hover:bg-green-600/20 rounded-lg transition-colors"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay when sidebar is open */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="fixed top-0 left-0 h-screen w-64 z-40 bg-[#212121] border-r border-white/5 shadow-xl"
          >
            <div className="flex flex-col h-full pt-20">
              <nav className="flex-grow p-6">
                <ul className="space-y-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                            location.pathname === item.path
                              ? 'bg-green-600/20 text-green-400'
                              : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-green-400'
                          }`}
                        >
                          <Icon size={20} />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Logout Button */}
              <div className="p-6 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors w-full p-3 rounded-lg hover:bg-[#2a2a2a]"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

export default Layout;