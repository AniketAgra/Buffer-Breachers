import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Shield,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Search,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Globe,
  MessageSquare,
  Map,
  Bell,
  FileText,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';

const Features = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: 'AI Travel Copilot',
      description:
        'Natural language processing for travel agents and customers. Handles multi-segment bookings and natural language queries.',
      link: 'Sample Itinerary: Paris to Italy',
      linkAction: 'View AI Demo',
      badge: 'NEW',
      iconColor: 'from-cyan-500 to-cyan-600',
      iconBg: 'bg-cyan-500/10',
    },
    {
      icon: Globe,
      title: 'Unified Global Search',
      description:
        'Aggregate millions of flight, hotel, and tour rentals to a single, high-speed comparative search engine.',
      link: 'Paris - JAN 15 to JAN 18',
      linkAction: 'View Search',
      iconColor: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500/10',
    },
    {
      icon: MapPin,
      title: 'Smart Itinerary Builder',
      description:
        'Drag-and-drop multi-destination trip planning with automated conflict detection and logistics.',
      chart: true,
      iconColor: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-500/10',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Price Intelligence',
      description:
        'Dynamic price monitoring and AI-driven forecasting to secure the best possible rates.',
      priceChart: true,
      iconColor: 'from-cyan-500 to-cyan-600',
      iconBg: 'bg-cyan-500/10',
    },
    {
      icon: Shield,
      title: 'Safety Score Intelligence',
      description:
        'Comprehensive safety rating system for every destination updated in real-time with local data.',
      safetyScore: '82',
      safetyZone: 'High-Confidence Zone',
      iconColor: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500/10',
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Assistance',
      description:
        'Global emergency response network connecting agents with direct priority line for agents.',
      emergencyButton: true,
      iconColor: 'from-red-500 to-red-600',
      iconBg: 'bg-red-500/10',
    },
    {
      icon: Map,
      title: 'Safe Area Mapping',
      description:
        'Interactive heatmaps and safe path navigation based on live incident reporting and policy data.',
      map: true,
      iconColor: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-500/10',
    },
    {
      icon: FileText,
      title: 'Visa & Policy Engine',
      description:
        'Automated documentation and global policy checks tailored to specific nationality and more.',
      policyButton: true,
      iconColor: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500/10',
    },
    {
      icon: Bell,
      title: 'Smart Travel Alerts',
      description:
        'Real-time geofencing, flight delays, and situational updates pushed directly to travelers.',
      alertBadge: 'Gate change: B24 → C12',
      iconColor: 'from-cyan-500 to-cyan-600',
      iconBg: 'bg-cyan-500/10',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto mb-4"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-slate-300 text-transparent bg-clip-text">
                Intelligence at Every Step
              </span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Empowering travel agents and enterprise travelers with the world's most advanced AI-driven booking ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section Title */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="container mx-auto max-w-7xl">
          <div className="border-l-4 border-cyan-400 pl-4">
            <h2 className="text-2xl font-bold text-white">The Suite: Core Capabilities</h2>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300 group"
              >
                {/* Icon */}
                <div className={`${feature.iconBg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 bg-gradient-to-r ${feature.iconColor} text-transparent`} style={{ stroke: 'url(#gradient)' }}>
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </feature.icon>
                </div>

                {/* Badge */}
                {feature.badge && (
                  <span className="inline-block bg-cyan-400/10 text-cyan-400 text-xs font-semibold px-2 py-1 rounded mb-3">
                    {feature.badge}
                  </span>
                )}

                {/* Title */}
                <h3 className="text-white font-semibold text-lg mb-3">{feature.title}</h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Interactive Elements */}
                {feature.link && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-cyan-400">📍</span>
                      <span className="text-slate-300">{feature.link}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-cyan-400">✈️</span>
                      <span className="text-slate-300">Direct</span>
                      <span className="text-slate-500">JAN 16</span>
                      <span className="text-slate-300">3h 15m</span>
                    </div>
                  </div>
                )}

                {feature.chart && (
                  <div className="flex items-end space-x-1 h-16">
                    {[60, 45, 70, 85, 65, 90, 75].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                )}

                {feature.priceChart && (
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Today', price: '$847', color: 'bg-slate-600' },
                      { label: 'Tomorrow', price: '$782', color: 'bg-slate-600' },
                      { label: 'Feb 10', price: '$695', color: 'bg-slate-600' },
                      { label: 'Best', price: '$623', color: 'bg-cyan-500' },
                    ].map((item, i) => (
                      <div key={i} className={`${item.color} rounded p-2 text-center`}>
                        <div className="text-xs text-slate-300">{item.label}</div>
                        <div className="text-sm font-semibold text-white mt-1">{item.price}</div>
                      </div>
                    ))}
                  </div>
                )}

                {feature.safetyScore && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl font-bold text-white">{feature.safetyScore}</span>
                      <span className="text-xs text-slate-400">Safety Score</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${feature.safetyScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-400">{feature.safetyZone}</p>
                  </div>
                )}

                {feature.emergencyButton && (
                  <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all">
                    ACTIVATE HELP
                  </button>
                )}

                {feature.map && (
                  <div className="relative h-32 bg-slate-700/30 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20"></div>
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                  </div>
                )}

                {feature.policyButton && (
                  <button className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-medium py-2 px-4 rounded-lg transition-all text-sm">
                    🌍 POLICY COMPLIANCE CHECKER
                  </button>
                )}

                {feature.alertBadge && (
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-400 text-xs font-medium">{feature.alertBadge}</span>
                    </div>
                  </div>
                )}

                {/* Action Link */}
                {feature.linkAction && (
                  <a
                    href="#"
                    className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm font-medium mt-4 group-hover:translate-x-1 transition-transform"
                  >
                    {feature.linkAction}
                    <span className="ml-2">→</span>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Coverage Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="border-l-4 border-cyan-400 pl-4 mb-8">
            <h2 className="text-2xl font-bold text-white">Global Intelligence Coverage</h2>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
            <div className="aspect-video bg-slate-700/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Interactive Global Coverage Map</p>
                <p className="text-slate-500 text-sm mt-2">300×300 Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg"></div>
                <span className="text-white font-semibold">TBO Smart Travel</span>
              </div>
              <p className="text-slate-400 text-sm">
                The next generation of travel management powered by enterprise-grade AI.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-white font-semibold mb-4">PLATFORM</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">API Integration</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">White Label</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">COMPANY</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Security</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">SUPPORT</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Legal</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">
              © 2025 TBO Smart Travel Copilot. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
