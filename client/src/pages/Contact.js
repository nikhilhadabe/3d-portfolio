import React, { useState } from 'react';
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAlert } from '../context/AlertContext';
import axios from 'axios';

const API_BASE_URL = 'https://portfolio-gci2.onrender.com/api';

const Contact = () => {
  const { darkMode } = useTheme();
  const { success, error, info } = useAlert();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, formData);
      success(response.data.message);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      info('Feel free to send another message anytime!');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl opacity-75 max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can work together to bring your ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <ContactInfo
                icon="📧"
                title="Email"
                content="nikhilhadabe31@gmail.com"
                darkMode={darkMode}
              />
              <ContactInfo
                icon="📱"
                title="Phone"
                content="+91 9021388541"
                darkMode={darkMode}
              />
              <ContactInfo
                icon="📍"
                title="Location"
                content="Pune, India"
                darkMode={darkMode}
              />
              <ContactInfo
                icon="🕒"
                title="Working Hours"
                content="Mon - Fri: 9:00 AM - 6:00 PM"
                darkMode={darkMode}
              />
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Follow Me</h3>
              <div className="flex space-x-4">
               <SocialLink href="https://www.threads.com/@nikhil_hadabe" icon={<FaTwitter />} label="Twitter" darkMode={darkMode} />
               <SocialLink href="https://www.linkedin.com/in/nikhil-hadbe-668345253" icon={<FaLinkedin />} label="LinkedIn" darkMode={darkMode} />
               <SocialLink href="https://github.com/nikhilhadabe" icon={<FaGithub />} label="GitHub" darkMode={darkMode} />
               <SocialLink href="https://www.instagram.com/nikhil_hadabe?igsh=MXg2bmgxNzlnMGV4dg==" icon={<FaInstagram />} label="Instagram" darkMode={darkMode} />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`p-8 rounded-2xl shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className="text-2xl font-bold mb-6">Send Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-semibold"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Info Component
const ContactInfo = ({ icon, title, content, darkMode }) => (
  <div className="flex items-start space-x-4">
    <div className="text-2xl">{icon}</div>
    <div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{content}</p>
    </div>
  </div>
);

// Social Link Component
const SocialLink = ({ href, icon, label, darkMode }) => (
  <a
    href={href}
    className={`p-3 rounded-lg transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    }`}
    aria-label={label}
  >
    <span className="text-xl">{icon}</span>
  </a>
);

export default Contact;