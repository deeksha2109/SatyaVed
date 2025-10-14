import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-maroon-800 dark:bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-golden-400" style={{ fontFamily: 'Cinzel' }}>
                सत्यवेद
              </span>
              <span className="text-xl font-semibold" style={{ fontFamily: 'Cinzel' }}>
                Satyaved
              </span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Unveiling Ancient Wisdom, One Myth at a Time. Preserving cultural heritage 
              through the power of storytelling and modern technology.
            </p>
            <div className="flex items-center text-gray-300">
              <span>Made with </span>
              <Heart className="mx-1 text-red-400" size={16} fill="currentColor" />
              <span> for preserving culture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-golden-400">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { path: '/', label: 'Home' },
                { path: '/myths', label: 'Browse Myths' },
                { path: '/about', label: 'About Us' },
                { path: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-golden-400 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-golden-400">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <Mail size={16} className="mr-2 text-golden-400" />
                info@satyaved.com
              </li>
              <li className="flex items-center text-gray-300">
                <Phone size={16} className="mr-2 text-golden-400" />
                +91 98765 43210
              </li>
              <li className="flex items-center text-gray-300">
                <MapPin size={16} className="mr-2 text-golden-400" />
                Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-maroon-700 dark:border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2025 Satyaved. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-golden-400 text-sm transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-300 hover:text-golden-400 text-sm transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;