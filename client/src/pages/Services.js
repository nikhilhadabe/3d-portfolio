import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Services = () => {
  const { darkMode } = useTheme();

  const services = [
    {
      icon: '💻',
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies like React, Node.js, and MongoDB.',
      features: ['Full-stack Development', 'Responsive Design', 'API Integration', 'Performance Optimization']
    },
    {
      icon: '📱',
      title: 'Mobile App Development',
      description: 'Cross-platform mobile applications for iOS and Android using React Native.',
      features: ['Cross-platform Apps', 'UI/UX Design', 'App Store Deployment', 'Push Notifications']
    },
    {
      icon: '🎨',
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces with focus on user experience and accessibility.',
      features: ['Wireframing', 'Prototyping', 'User Research', 'Design Systems']
    },
    {
      icon: '🔧',
      title: 'Technical Consulting',
      description: 'Expert advice on technology stack, architecture, and best practices for your projects.',
      features: ['Architecture Review', 'Code Audit', 'Performance Analysis', 'Best Practices']
    },
    {
      icon: '☁️',
      title: 'Cloud Solutions',
      description: 'Deployment and management of applications on cloud platforms like AWS and Azure.',
      features: ['Cloud Deployment', 'Serverless Architecture', 'CI/CD Pipelines', 'Monitoring']
    },
    {
      icon: '🚀',
      title: 'Performance Optimization',
      description: 'Improve your application speed, scalability, and overall user experience.',
      features: ['Speed Optimization', 'Database Tuning', 'Caching Strategies', 'Load Testing']
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Services</h1>
          <p className="text-xl opacity-75 max-w-2xl mx-auto">
            Comprehensive solutions to bring your ideas to life with cutting-edge technology and design.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} darkMode={darkMode} />
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Let's work together to create something amazing. Get in touch to discuss your project requirements.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold text-lg"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service, darkMode }) => {
  return (
    <div className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="text-4xl mb-4">{service.icon}</div>
      <h3 className="text-xl font-bold mb-3">{service.title}</h3>
      <p className={`mb-4 ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {service.description}
      </p>
      <ul className="space-y-2">
        {service.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Services;