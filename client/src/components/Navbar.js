import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAlert } from '../context/AlertContext';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const { success } = useAlert(); // ADD THIS HOOK
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Projects', path: '/projects' },
    { name: 'Courses', path: '/courses' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
   // success('You have been logged out successfully. See you soon! 👋'); // ADD THIS ALERT
  };

  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            Portfolio
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-blue-500 transition-colors duration-300 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {darkMode ? '🌙' : '☀️'}
            </button>

            {/* Auth Links / User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </button>

                {isProfileOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 transition-colors duration-300 ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                  }`}>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-600 transition-colors duration-300"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-gray-600 transition-colors duration-300"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors duration-300"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 font-medium ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 font-medium"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-between">
              <span className={`w-full h-0.5 transition-all duration-300 ${
                darkMode ? 'bg-white' : 'bg-gray-800'
              } ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
              <span className={`w-full h-0.5 transition-all duration-300 ${
                darkMode ? 'bg-white' : 'bg-gray-800'
              } ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`w-full h-0.5 transition-all duration-300 ${
                darkMode ? 'bg-white' : 'bg-gray-800'
              } ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t transition-colors duration-300 ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="py-2 hover:text-blue-500 transition-colors duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-300 dark:border-gray-700 flex flex-col space-y-4">
                <button
                  onClick={toggleDarkMode}
                  className="text-left py-2 font-medium"
                >
                  {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
                
                {user ? (
                  <>
                    <div className="py-2 font-medium border-b border-gray-300 dark:border-gray-700">
                      Hello, {user.name}
                    </div>
                    <Link
                      to="/profile"
                      className="py-2 hover:text-blue-500 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="py-2 hover:text-blue-500 transition-colors duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-left py-2 text-red-500 hover:text-red-400 transition-colors duration-300"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="py-2 text-center rounded-lg transition-colors duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="py-2 text-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Signup
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;