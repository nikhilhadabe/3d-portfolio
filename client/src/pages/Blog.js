import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const API_BASE_URL = 'https://portfolio-gci2.onrender.com/api';

const Blog = () => {
  const { darkMode } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    page: 1
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchBlogs();
  }, [filters]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page);

      const response = await axios.get(`${API_BASE_URL}/blogs?${params}`);
      const { data } = response.data;
      
      setBlogs(data.blogs);
      setCategories(data.categories);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Blog fetch error:', error);
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1, search: e.target.search.value }));
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({ ...prev, page: 1, category }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0);
  };

  if (loading && blogs.length === 0) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-2xl">Loading Blogs...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl opacity-75 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, 3D design, and technology.
          </p>
        </div>

        {/* Filters */}
        <div className={`mb-8 p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                name="search"
                placeholder="Search blogs..."
                className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold"
              >
                Search
              </button>
            </div>
          </form>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                filters.category === 'all'
                  ? 'bg-blue-500 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  filters.category === category
                    ? 'bg-blue-500 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogs.map(blog => (
                <BlogCard key={blog._id} blog={blog} darkMode={darkMode} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.total > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    filters.page === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : darkMode
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                
                {[...Array(pagination.total)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                      filters.page === i + 1
                        ? 'bg-blue-500 text-white'
                        : darkMode
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === pagination.total}
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    filters.page === pagination.total
                      ? 'opacity-50 cursor-not-allowed'
                      : darkMode
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={`text-center py-12 rounded-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold mb-2">No blogs found</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {filters.search || filters.category !== 'all' 
                ? 'Try changing your search filters' 
                : 'No blogs have been published yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Blog Card Component
const BlogCard = ({ blog, darkMode }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {blog.featuredImage && (
        <img 
          src={blog.featuredImage} 
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.categories.map(category => (
            <span 
              key={category}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {category}
            </span>
          ))}
        </div>
        
        <h2 className="text-xl font-bold mb-3 line-clamp-2">
          <Link 
            to={`/blog/${blog.slug}`}
            className="hover:text-blue-500 transition-colors duration-300"
          >
            {blog.title}
          </Link>
        </h2>
        
        <p className={`mb-4 line-clamp-3 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {blog.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            {blog.author.avatar ? (
              <img 
                src={blog.author.avatar} 
                alt={blog.author.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {blog.author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {blog.author.name}
            </span>
          </div>
          <div className={`flex items-center space-x-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <span>{formatDate(blog.createdAt)}</span>
            <span>•</span>
            <span>{blog.readTime} min read</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-1">
            <span>👁️</span>
            <span className="text-sm">{blog.views} views</span>
          </div>
          <Link 
            to={`/blog/${blog.slug}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Blog;