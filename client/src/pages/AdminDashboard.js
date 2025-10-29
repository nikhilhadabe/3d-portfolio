import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dashboard');
      const { data } = response.data;
      
      setStats(data.stats);
      setRecentUsers(data.recentUsers);
      setRecentBlogs(data.recentBlogs);
    } catch (error) {
      console.error('Dashboard error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-lg opacity-75">Welcome back, {user.name}!</p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg ${
            darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon="👥"
              darkMode={darkMode}
            />
            <StatCard
              title="Total Blogs"
              value={stats.totalBlogs}
              icon="📝"
              darkMode={darkMode}
            />
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              icon="💼"
              darkMode={darkMode}
            />
            <StatCard
              title="Total Courses"
              value={stats.totalCourses}
              icon="🎓"
              darkMode={darkMode}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users - FIXED */}
          <div className={`rounded-2xl shadow-lg transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold">Recent Users</h3>
            </div>
            <div className="p-6">
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user._id} className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className={`text-xs mt-1 truncate ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {user.email}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 mt-1 ${
                        user.role === 'admin' 
                          ? 'bg-purple-500 text-white' 
                          : darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-200 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No users found
                </p>
              )}
            </div>
          </div>

          {/* Recent Blogs - FIXED */}
          <div className={`rounded-2xl shadow-lg transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold">Recent Blogs</h3>
            </div>
            <div className="p-6">
              {recentBlogs.length > 0 ? (
                <div className="space-y-4">
                  {recentBlogs.map((blog) => (
                    <div key={blog._id} className="flex items-start justify-between gap-3">
                      {/* Blog content - takes most space */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{blog.title}</p>
                        <p className={`text-xs mt-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          By {blog.author.name} • {blog.views} views
                        </p>
                      </div>
                      {/* Status badge - fixed width */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 mt-1 ${
                        blog.isPublished 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-500 text-white'
                      }`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No blogs found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`mt-8 rounded-2xl shadow-lg transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold">Quick Actions</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton
              title="Manage Users"
              description="View and manage all users"
              icon="👥"
              onClick={() => navigate('/admin/users')}
              darkMode={darkMode}
            />
            <ActionButton
              title="Manage Blogs"
              description="Create and edit blog posts"
              icon="📝"
              onClick={() => navigate('/admin/blogs')}
              darkMode={darkMode}
            />
            <ActionButton
              title="Manage Projects"
              description="Add and manage projects"
              icon="💼"
              onClick={() => navigate('/admin/projects')}
              darkMode={darkMode}
            />
            <ActionButton
              title="Manage Courses"
              description="Create and manage courses"
              icon="🎓"
              onClick={() => navigate('/admin/courses')}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, darkMode }) => (
  <div className={`rounded-2xl p-6 shadow-lg transition-colors duration-300 ${
    darkMode ? 'bg-gray-800' : 'bg-white'
  }`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-medium ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {title}
        </p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  </div>
);

// Action Button Component
const ActionButton = ({ title, description, icon, onClick, darkMode }) => (
  <button
    onClick={onClick}
    className={`text-left p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
      darkMode 
        ? 'bg-gray-700 hover:bg-gray-600' 
        : 'bg-gray-100 hover:bg-gray-200'
    }`}
  >
    <div className="text-2xl mb-2">{icon}</div>
    <h4 className="font-semibold mb-1">{title}</h4>
    <p className={`text-sm ${
      darkMode ? 'text-gray-400' : 'text-gray-600'
    }`}>
      {description}
    </p>
  </button>
);

export default AdminDashboard;