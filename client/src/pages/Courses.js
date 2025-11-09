import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const API_BASE_URL = 'https://portfolio-gci2.onrender.com/api';

const Courses = () => {
  const { darkMode } = useTheme();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    page: 1
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.level !== 'all') params.append('level', filters.level);
      params.append('page', filters.page);

      const response = await axios.get(`${API_BASE_URL}/courses?${params}`);
      const { data } = response.data;
      
      setCourses(data.courses);
      setCategories(data.categories);
      setLevels(data.levels);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Courses fetch error:', error);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, page: 1, [filterType]: value }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0);
  };

  if (loading && courses.length === 0) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-2xl">Loading Courses...</div>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Courses</h1>
          <p className="text-xl opacity-75 max-w-2xl mx-auto">
            Learn new skills with comprehensive courses on web development, design, and programming.
          </p>
        </div>

        {/* Filters */}
        <div className={`mb-8 p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-3">Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('category', 'all')}
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
                    onClick={() => handleFilterChange('category', category)}
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

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium mb-3">Level</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('level', 'all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    filters.level === 'all'
                      ? 'bg-blue-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Levels
                </button>
                {levels.map(level => (
                  <button
                    key={level}
                    onClick={() => handleFilterChange('level', level)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                      filters.level === level
                        ? 'bg-blue-500 text-white'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {courses.map(course => (
                <CourseCard key={course._id} course={course} darkMode={darkMode} />
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
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-2xl font-semibold mb-2">No courses found</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {filters.category !== 'all' || filters.level !== 'all'
                ? 'Try changing your filters' 
                : 'No courses have been published yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, darkMode }) => {
  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  return (
    <article className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {course.thumbnail && (
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getLevelColor(course.level)} text-white`}>
            {course.level}
          </span>
          <span className={`text-lg font-bold ${
            course.price === 0 ? 'text-green-500' : 'text-blue-500'
          }`}>
            {formatPrice(course.price)}
          </span>
        </div>
        
        <h2 className="text-xl font-bold mb-3">{course.title}</h2>
        
        <p className={`mb-4 line-clamp-3 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {course.shortDescription}
        </p>
        
        {/* Course Info */}
        <div className={`space-y-2 mb-4 text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <div className="flex items-center justify-between">
            <span>Duration:</span>
            <span className="font-medium">{course.duration}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Instructor:</span>
            <span className="font-medium">{course.instructor}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Students:</span>
            <span className="font-medium">{course.studentsEnrolled}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-medium">{course.rating}</span>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              ({course.studentsEnrolled} students)
            </span>
          </div>
          <span className={`text-sm capitalize ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {course.category}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 font-medium">
            Enroll Now
          </button>
          <button className={`px-4 py-2 rounded font-medium transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}>
            Details
          </button>
        </div>
      </div>
    </article>
  );
};

export default Courses;