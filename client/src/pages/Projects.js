import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const Projects = () => {
  const { darkMode } = useTheme();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    page: 1
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.append('category', filters.category);
      params.append('page', filters.page);

      const response = await axios.get(`/api/projects?${params}`);
      const { data } = response.data;
      
      setProjects(data.projects);
      setCategories(data.categories);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Projects fetch error:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({ ...prev, page: 1, category }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0);
  };

  if (loading && projects.length === 0) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-2xl">Loading Projects...</div>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
          <p className="text-xl opacity-75 max-w-2xl mx-auto">
            A collection of my work including web applications, 3D designs, and creative projects.
          </p>
        </div>

        {/* Filters */}
        <div className={`mb-8 p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex flex-wrap gap-2 justify-center">
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
                {category.charAt(0).toUpperCase() + category.slice(1)}
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

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {projects.map(project => (
                <ProjectCard key={project._id} project={project} darkMode={darkMode} />
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
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-2xl font-semibold mb-2">No projects found</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {filters.category !== 'all' 
                ? 'Try changing your category filter' 
                : 'No projects have been added yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, darkMode }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'planned': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <article className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {project.images && project.images.length > 0 && (
        <img 
          src={project.images[0]} 
          alt={project.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
            getStatusColor(project.status)
          } text-white`}>
            {project.status.replace('-', ' ')}
          </span>
          {project.featured && (
            <span className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">
              ⭐ Featured
            </span>
          )}
        </div>
        
        <h2 className="text-xl font-bold mb-3">{project.title}</h2>
        
        <p className={`mb-4 line-clamp-3 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {project.shortDescription}
        </p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map(tech => (
            <span 
              key={tech}
              className={`px-2 py-1 rounded text-xs font-medium ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className={`px-2 py-1 rounded text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className={`capitalize ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {project.category}
          </span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            {formatDate(project.createdAt)}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-700">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition-colors duration-300 text-sm font-medium"
            >
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 px-3 py-2 text-center rounded text-sm font-medium transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default Projects;