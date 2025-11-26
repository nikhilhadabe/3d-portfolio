import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'https://portfolio-gci2.onrender.com/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('verifying');

  useEffect(() => {
    verifyEmailToken();
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/verify-email/${token}`);
      setVerificationStatus('success');
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Verify email error:', err);
      setVerificationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/send-verification`);
    } catch (err) {
      console.error('Resend verification error:', err);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Verifying your email...</h2>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-4">Email Verified!</h1>
          <p className="text-xl mb-6">Your email has been verified successfully.</p>
          <p className="text-gray-500 dark:text-gray-400">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
        <p className="mb-6">This verification link is invalid or has expired.</p>
        
        {user ? (
          <button
            onClick={resendVerification}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold"
          >
            Resend Verification Email
          </button>
        ) : (
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold inline-block"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;