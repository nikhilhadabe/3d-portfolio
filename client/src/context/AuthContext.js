import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

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
        showAlert(`Welcome back, ${response.data.name}!`, 'success');
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
        showAlert('Account created successfully! Welcome! 🎉', 'success');
      }
      
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      showAlert(message, 'error');
      throw new Error(message);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      if (loginAttempts >= 3) {
        showAlert('Too many login attempts. Please wait 30 seconds and try again.', 'error');
        throw new Error('Rate limit exceeded');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(response.data);
        setLoginAttempts(0);
        showAlert(`Welcome back, ${response.data.name}! 👋`, 'success');
      }
      
      return response.data;
    } catch (err) {
      if (err.response?.status === 429) {
        const retryAfter = err.response.headers['retry-after'] || 30;
        showAlert(`Too many login attempts. Please wait ${retryAfter} seconds before trying again.`, 'error');
        setLoginAttempts(prev => prev + 1);
        
        setTimeout(() => {
          setLoginAttempts(0);
        }, 3000);
      } else {
        const message = err.response?.data?.message || 'Login failed';
        showAlert(message, 'error');
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
    setLoginAttempts(0);
    showAlert('You have been logged out successfully. See you soon! 👋', 'success');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, userData);
      setUser(response.data);
      showAlert('Profile updated successfully! ✅', 'success');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      showAlert(message, 'error');
      throw new Error(message);
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    alert
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {alert.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${
          alert.type === 'success' 
            ? 'bg-green-50 border-green-500 text-green-800'
            : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          <div className="flex items-center space-x-3">
            <span className="text-xl">{alert.type === 'success' ? '✅' : '❌'}</span>
            <span className="font-medium">{alert.message}</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};