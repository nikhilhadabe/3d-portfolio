import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAlert } from './AlertContext';

const AuthContext = createContext();
const API_BASE_URL = 'https://portfolio-gci2.onrender.com/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { success, error } = useAlert();

  // Check if user is logged in on app start
  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`${API_BASE_URL}/auth/profile`);
        setUser(response.data);
        success(`Welcome back, ${response.data.name}!`);
      }
    } catch (err) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(response.data);
        success('Account created successfully! Welcome! 🎉');
      }
      
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      error(message);
      throw new Error(message);
    }
  };

  // Login user - UPDATED WITH RATE LIMITING PROTECTION
  const login = async (email, password) => {
    try {
      // Prevent too many rapid attempts
      if (loginAttempts >= 3) {
        error('Too many login attempts. Please wait 30 seconds and try again.');
        throw new Error('Rate limit exceeded');
      }

      // Add delay to prevent rapid requests (1 second minimum)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(response.data);
        setLoginAttempts(0); // Reset attempts on successful login
        success(`Welcome back, ${response.data.name}! 👋`);
      }
      
      return response.data;
    } catch (err) {
      // Handle rate limiting specifically
      if (err.response?.status === 429) {
        const retryAfter = err.response.headers['retry-after'] || 30;
        error(`Too many login attempts. Please wait ${retryAfter} seconds before trying again.`);
        setLoginAttempts(prev => prev + 1);
        
        // Auto-reset attempts after 3 seconds
        setTimeout(() => {
          setLoginAttempts(0);
        }, 3000);
      } else {
        const message = err.response?.data?.message || 'Login failed';
        error(message);
        setLoginAttempts(prev => prev + 1);
      }
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setLoginAttempts(0); // Reset attempts on logout
    success('You have been logged out successfully. See you soon! 👋');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, userData);
      setUser(response.data);
      success('Profile updated successfully! ✅');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      error(message);
      throw new Error(message);
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};