import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Mail, MapPin, Phone, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Plane className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">
                TBO Travel<span className="text-primary-500">Copilot</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              AI-powered travel planning platform that helps you discover, plan, and book
              your perfect journey with personalized recommendations and safety intelligence.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-primary-500 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-primary-500 transition-colors">
                  Safety Intelligence
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-primary-500 transition-colors">
                  Try Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-500" />
                <span>support@tbocopilot.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-500" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary-500 mt-1" />
                <span>Bangalore, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} TBO Travel Copilot. Built for TBO Hackathon.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
