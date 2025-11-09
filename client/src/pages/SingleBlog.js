import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const API_BASE_URL = 'https://portfolio-gci2.onrender.com/api';

const SingleBlog = () => {
  const { slug } = useParams();
  const { darkMode } = useTheme();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/blogs/${slug}`);
      setBlog(response.data.data);
    } catch (error) {
      console.error('Blog fetch error:', error);
      setError('Blog not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-2xl">Loading Blog...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
          <p className="text-xl mb-8">The blog you're looking for doesn't exist.</p>
          <Link 
            to="/blog"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {blog.categories.map(category => (
              <span 
                key={category}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {category}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{blog.title}</h1>
          
          <div className={`flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-lg ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className="flex items-center space-x-3">
              {blog.author.avatar ? (
                <img 
                  src={blog.author.avatar} 
                  alt={blog.author.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {blog.author.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold">{blog.author.name}</p>
                <p>{blog.author.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>{formatDate(blog.createdAt)}</span>
              <span>•</span>
              <span>{blog.readTime} min read</span>
              <span>•</span>
              <span>👁️ {blog.views} views</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img 
              src={blog.featuredImage} 
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className={`prose prose-lg max-w-none ${
          darkMode 
            ? 'prose-invert prose-gray' 
            : 'prose-gray'
        }`}>
          <div 
            dangerouslySetInnerHTML={{ __html: blog.content }}
            className="blog-content"
          />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map(tag => (
                <span 
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blogs */}
        <div className="mt-12 text-center">
          <Link 
            to="/blog"
            className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <span>←</span>
            <span>Back to All Blogs</span>
          </Link>
        </div>
      </article>
    </div>
  );
};

export default SingleBlog;