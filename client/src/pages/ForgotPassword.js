import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'https://portfolio-gci2.onrender.com/api';

const ForgotPassword = () => {
  const { darkMode } = useTheme();
  const { alert } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      setEmailSent(true);
    } catch (err) {
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-md w-full space-y-8 p-8 rounded-2xl shadow-xl transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm">
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-500 hover:text-blue-400 transition-colors duration-300"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {emailSent ? (
          <div className={`text-center p-6 rounded-lg ${
            darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'
          }`}>
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-xl font-semibold mb-2">Check Your Email!</h3>
            <p>We've sent password reset instructions to:</p>
            <p className="font-semibold mt-2">{email}</p>
            <p className="mt-4 text-sm">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setEmailSent(false)}
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                try again
              </button>
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;