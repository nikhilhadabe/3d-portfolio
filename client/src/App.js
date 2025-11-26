import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import SingleBlog from './pages/SingleBlog';
import Projects from './pages/Projects';
import Courses from './pages/Courses';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';

// Admin Components
import AdminDashboard from './pages/AdminDashboard';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminProjects from './pages/admin/AdminProjects';
import AdminCourses from './pages/admin/AdminCourses';
import AdminUsers from './pages/admin/AdminUsers';

//google auth compnent
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

// Context
import { ThemeContextProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
    setLoading(false);

    document.title = "Nikhil Hadbe Portfolio"
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

 return (
  <AuthProvider>
    <AlertProvider>
      <ThemeContextProvider>
        <Router>
          <div className={`min-h-screen transition-colors duration-300 ${
            darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'
          }`}>
            <Navbar />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<SingleBlog />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/blogs" element={<AdminBlogs />} />
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeContextProvider>
    </AlertProvider>
  </AuthProvider>
);

}

export default App;