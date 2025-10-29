import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Hero from '../components/Hero';
import axios from 'axios';

const Home = () => {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({});
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch featured projects
      const projectsResponse = await axios.get('/api/projects?featured=true&limit=3');
      const blogsResponse = await axios.get('/api/blogs?limit=3');
      
      setFeaturedProjects(projectsResponse.data.data.projects);
      setRecentBlogs(blogsResponse.data.data.blogs);

      // Calculate stats (you can create a dedicated stats endpoint)
      const statsData = {
        projects: projectsResponse.data.data.pagination.totalProjects,
        blogs: blogsResponse.data.data.pagination.totalBlogs,
        experience: '3+', // Hardcoded for now
        clients: '50+' // Hardcoded for now
      };
      setStats(statsData);
    } catch (error) {
      console.error('Home data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <StatsSection stats={stats} darkMode={darkMode} />

      {/* Featured Projects */}
      <FeaturedProjects 
        projects={featuredProjects} 
        loading={loading}
        darkMode={darkMode} 
      />

      {/* Recent Blogs */}
      <RecentBlogs 
        blogs={recentBlogs} 
        loading={loading}
        darkMode={darkMode} 
      />

      {/* Services Preview */}
      <ServicesPreview darkMode={darkMode} />

      {/* CTA Section */}
      <CTASection darkMode={darkMode} />
    </div>
  );
};

// Stats Section Component
const StatsSection = ({ stats, darkMode }) => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <StatCard
          number={stats.projects || '0'}
          label="Projects Completed"
          icon="💼"
          darkMode={darkMode}
        />
        <StatCard
          number={stats.blogs || '0'}
          label="Blog Posts"
          icon="📝"
          darkMode={darkMode}
        />
        <StatCard
          number={stats.experience || '3+'}
          label="Years Experience"
          icon="⭐"
          darkMode={darkMode}
        />
        <StatCard
          number={stats.clients || '50+'}
          label="Happy Clients"
          icon="😊"
          darkMode={darkMode}
        />
      </div>
    </div>
  </section>
);

const StatCard = ({ number, label, icon, darkMode }) => (
  <div className={`text-center p-6 rounded-2xl transition-colors duration-300 ${
    darkMode ? 'bg-gray-800' : 'bg-gray-50'
  }`}>
    <div className="text-4xl mb-4">{icon}</div>
    <div className="text-3xl md:text-4xl font-bold mb-2">{number}</div>
    <div className={`text-lg ${
      darkMode ? 'text-gray-400' : 'text-gray-600'
    }`}>
      {label}
    </div>
  </div>
);

// Featured Projects Component
const FeaturedProjects = ({ projects, loading, darkMode }) => (
  <section className={`py-20 ${
    darkMode ? 'bg-gray-800' : 'bg-gray-50'
  }`}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
        <p className="text-xl opacity-75 max-w-2xl mx-auto">
          Check out some of my recent work and creative projects
        </p>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="text-xl">Loading projects...</div>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map(project => (
            <ProjectCard key={project._id} project={project} darkMode={darkMode} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl opacity-75">No featured projects yet</p>
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          to="/projects"
          className="inline-block px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold text-lg"
        >
          View All Projects
        </Link>
      </div>
    </div>
  </section>
);

const ProjectCard = ({ project, darkMode }) => (
  <div className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
    darkMode ? 'bg-gray-700' : 'bg-white'
  }`}>
    {project.images && project.images.length > 0 && (
      <img 
        src={project.images[0]} 
        alt={project.title}
        className="w-full h-48 object-cover"
      />
    )}
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
      <p className={`mb-4 ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {project.shortDescription}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.slice(0, 3).map(tech => (
          <span 
            key={tech}
            className={`px-2 py-1 rounded text-xs ${
              darkMode ? 'bg-gray-600' : 'bg-gray-200'
            }`}
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex space-x-2">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition-colors duration-300 text-sm"
          >
            Live Demo
          </a>
        )}
        <Link
          to="/projects"
          className={`flex-1 px-3 py-2 text-center rounded text-sm font-medium transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-600 hover:bg-gray-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          Details
        </Link>
      </div>
    </div>
  </div>
);

// Recent Blogs Component
const RecentBlogs = ({ blogs, loading, darkMode }) => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Blog Posts</h2>
        <p className="text-xl opacity-75 max-w-2xl mx-auto">
          Latest thoughts, tutorials, and insights about technology and development
        </p>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="text-xl">Loading blogs...</div>
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} darkMode={darkMode} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl opacity-75">No blog posts yet</p>
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          to="/blog"
          className="inline-block px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold text-lg"
        >
          Read All Blogs
        </Link>
      </div>
    </div>
  </section>
);

const BlogCard = ({ blog, darkMode }) => (
  <div className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
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
        {blog.categories.slice(0, 2).map(category => (
          <span 
            key={category}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          >
            {category}
          </span>
        ))}
      </div>
      
      <h3 className="text-xl font-bold mb-3">{blog.title}</h3>
      
      <p className={`mb-4 line-clamp-3 ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {blog.excerpt}
      </p>
      
      <div className="flex items-center justify-between text-sm">
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          {new Date(blog.createdAt).toLocaleDateString()}
        </span>
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          {blog.readTime} min read
        </span>
      </div>
      
      <Link 
        to={`/blog/${blog.slug}`}
        className={`block w-full mt-4 px-4 py-2 text-center rounded-lg font-medium transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-700 hover:bg-gray-600' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        Read More
      </Link>
    </div>
  </div>
);

// Services Preview Component
const ServicesPreview = ({ darkMode }) => (
  <section className={`py-20 ${
    darkMode ? 'bg-gray-800' : 'bg-gray-50'
  }`}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">My Services</h2>
        <p className="text-xl opacity-75 max-w-2xl mx-auto">
          Comprehensive solutions to bring your ideas to life
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <ServicePreviewCard
          icon="💻"
          title="Web Development"
          description="Custom web applications with modern technologies"
          darkMode={darkMode}
        />
        <ServicePreviewCard
          icon="📱"
          title="Mobile Development"
          description="Cross-platform mobile apps for iOS and Android"
          darkMode={darkMode}
        />
        <ServicePreviewCard
          icon="🎨"
          title="UI/UX Design"
          description="Beautiful and intuitive user interfaces"
          darkMode={darkMode}
        />
      </div>

      <div className="text-center mt-12">
        <Link
          to="/services"
          className="inline-block px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold text-lg"
        >
          View All Services
        </Link>
      </div>
    </div>
  </section>
);

const ServicePreviewCard = ({ icon, title, description, darkMode }) => (
  <div className={`text-center p-6 rounded-2xl transition-colors duration-300 ${
    darkMode ? 'bg-gray-700' : 'bg-white'
  }`}>
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
      {description}
    </p>
  </div>
);

// CTA Section Component
const CTASection = ({ darkMode }) => (
  <section className="py-20">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Ready to Start Your Project?
      </h2>
      <p className="text-xl opacity-75 mb-8 max-w-2xl mx-auto">
        Let's work together to create something amazing. Get in touch to discuss your project requirements.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/contact"
          className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold text-lg"
        >
          Get In Touch
        </Link>
        <Link
          to="/projects"
          className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          View My Work
        </Link>
      </div>
    </div>
  </section>
);

export default Home;