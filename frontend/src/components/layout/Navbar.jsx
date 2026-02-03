import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X, User, LogOut, LayoutDashboard, Plane, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout, isAgent, isClient } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-primary-600 dark:text-blue-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              TBO Travel<span className="text-primary-600 dark:text-blue-500">Copilot</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              to="/safety"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Safety Intelligence
            </Link>
            {isAuthenticated ? (
              <>
                {isAgent() ? (
                  // Agent Navigation
                  <>
                    <Link
                      to="/agent/dashboard"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/agent/deals"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                      Deals
                    </Link>
                    <Link
                      to="/agent/clients"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                      Clients
                    </Link>
                  </>
                ) : (
                  // Client Navigation
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/demo"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                      AI Copilot
                    </Link>
                  </>
                )}
                
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium">
                    <User className="h-5 w-5" />
                    <span>{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-2 hidden group-hover:block border border-gray-200 dark:border-slate-700">
                    <Link
                      to={isAgent() ? "/agent/dashboard" : "/dashboard"}
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <Link to="/login" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/features"
              className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/safety"
              className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Safety Intelligence
            </Link>
            {isAuthenticated ? (
              <>
                {isAgent() ? (
                  // Agent Mobile Navigation
                  <>
                    <Link
                      to="/agent/dashboard"
                      className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/agent/deals"
                      className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Deals
                    </Link>
                    <Link
                      to="/agent/clients"
                      className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Clients
                    </Link>
                  </>
                ) : (
                  // Client Mobile Navigation
                  <>
                    <Link
                      to="/dashboard"
                      className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/demo"
                      className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      AI Copilot
                    </Link>
                  </>
                )}
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <Link
                  to="/login"
                  className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
