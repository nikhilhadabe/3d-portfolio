import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-8 transition-colors duration-300 ${
      document.documentElement.classList.contains('dark') 
        ? 'bg-gray-800 text-white' 
        : 'bg-gray-100 text-gray-800'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-2xl font-bold">
              Portfolio :- Nikhil Hadbe
            </Link>
            <p className="mt-2 text-sm">
              © {currentYear} All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
           <a href="https://www.threads.com/@nikhil_hadabe" className="flex items-center space-x-2 hover:text-blue-500 transition-colors duration-300">
               <i className="ri-threads-line text-xl"></i>
              <span>Thread</span>
            </a>
  
           <a href="https://www.linkedin.com/in/nikhil-hadbe-668345253" className="flex items-center space-x-2 hover:text-blue-500 transition-colors duration-300">
               <i className="ri-linkedin-fill text-xl"></i>
               <span>LinkedIn</span>
             </a>
  
            <a href="https://github.com/nikhilhadabe" className="flex items-center space-x-2 hover:text-blue-500 transition-colors duration-300">
                 <i className="ri-github-fill text-xl"></i>
                 <span>GitHub</span>
             </a>
  
             <a href="https://www.instagram.com/nikhil_hadabe?igsh=MXg2bmgxNzlnMGV4dg==" className="flex items-center space-x-2 hover:text-blue-500 transition-colors duration-300">
                 <i className="ri-instagram-line text-xl"></i>
                 <span>Instagram</span>
               </a>
          </div>


        </div>
      </div>
    </footer>
  );
};

export default Footer;