import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane,
  Brain,
  Shield,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  Globe2,
  CheckCircle2,
  Bell,
  Monitor,
  BookOpen,
} from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 text-sm font-medium">NEXT-GEN B2B TRAVEL</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-white">Book Smarter. Travel Safer.</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                Powered by AI.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              The ultimate enterprise-grade travel technology platform designed to optimize procurement and ensure global traveler safety through real-time intelligence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/login">
                <button className="group px-8 py-4 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-slate-900 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/demo">
                <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold rounded-lg transition-all duration-200">
                  View Demo
                </button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-slate-800 pt-12">
              <p className="text-slate-500 text-sm mb-6 uppercase tracking-wider">
                Trusted by Global Enterprises
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: Shield, label: 'ISO 27001 Certified' },
                  { icon: Lock, label: 'GDPR Compliant' },
                  { icon: Globe2, label: 'Global Security Partners' },
                  { icon: CheckCircle2, label: 'SLA Guaranteed' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-center space-x-2 text-slate-400"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* What is TBO Smart Copilot Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                  The Platform
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                What is TBO Smart Copilot?
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                TBO Smart Copilot is not just a booking tool. It's an intelligent orchestration layer that sits between your travel needs and the global inventory. We use machine learning to predict price fluctuations, identify safety risks, and automate policy enforcement.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text mb-2">
                    2.5M+
                  </div>
                  <div className="text-slate-500 text-sm uppercase tracking-wider">
                    Global Properties
                  </div>
                </div>
                <div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text mb-2">
                    40%
                  </div>
                  <div className="text-slate-500 text-sm uppercase tracking-wider">
                    Avg. Cost Savings
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - AI Visualization */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-12 border border-slate-700 overflow-hidden">
                {/* Hologram effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
                
                {/* AI Circle */}
                <div className="relative mx-auto w-64 h-64">
                  {/* Outer rings */}
                  <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-4 border border-cyan-400/20 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
                  <div className="absolute inset-8 border border-cyan-400/10 rounded-full"></div>
                  
                  {/* Center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-xl opacity-50"></div>
                      <div className="relative bg-slate-800 rounded-full p-8 border border-cyan-400/50">
                        <Brain className="w-16 h-16 text-cyan-400" />
                      </div>
                    </div>
                  </div>

                  {/* Orbiting dots */}
                  <div className="absolute top-1/2 left-0 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Bottom glow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seamless Efficiency in 4 Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Seamless Efficiency in 4 Steps
            </h2>
            <p className="text-slate-400 text-lg">
              Our AI engine handles the complexity so your team can focus on what matters.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Database,
                number: '01',
                title: 'Connect Data',
                description: 'Integrate your enterprise systems and employee travel profiles instantly.',
              },
              {
                icon: Brain,
                number: '02',
                title: 'AI Optimization',
                description: 'Algorithms scan millions of options to find optimal routes and rates.',
              },
              {
                icon: Shield,
                number: '03',
                title: 'Book Safely',
                description: 'One-click bookings that are automatically policy-compliant and secure.',
              },
              {
                icon: Monitor,
                number: '04',
                title: '24/7 Monitoring',
                description: 'Real-time alerts and duty of care for your entire traveling workforce.',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 group"
              >
                {/* Number */}
                <div className="absolute top-6 right-6 text-6xl font-bold text-slate-700/50 group-hover:text-slate-700 transition-colors">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="bg-cyan-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 relative z-10">
                  <step.icon className="w-6 h-6 text-cyan-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3 relative z-10">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Traveler Safety Intelligence */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Traveler Safety Intelligence
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Our dashboard provides a command center view of your entire traveling workforce. Monitor global risks, weather disruptions, and health advisories in real-time.
              </p>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {[
                  'Automated Duty of Care Reporting',
                  'Geo-fencing & Real-time Location Tracking',
                  'Instant Emergency Broadcast Alerts',
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-cyan-400/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-white">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Link to="/safety">
                <button className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all">
                  Explore Safety Features
                </button>
              </Link>
            </motion.div>

            {/* Right - Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-slate-900 rounded-xl border border-slate-700 overflow-hidden p-6">
                {/* Browser chrome */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>

                {/* Map container */}
                <div className="bg-slate-800 rounded-lg p-6 mb-4">
                  <div className="relative h-48 bg-slate-700/30 rounded-lg overflow-hidden">
                    {/* World map placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Globe2 className="w-24 h-24 text-slate-600" />
                    </div>
                    {/* Location markers */}
                    <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-1/4 left-2/3 w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>

                {/* Alert */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-red-400 text-sm font-semibold">HIGH ALERT</span>
                      <span className="text-red-400 text-xs">Flight Delay: NYC</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Status bars */}
                <div className="mt-4 space-y-2">
                  {[60, 80, 40].map((width, index) => (
                    <div key={index} className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-600 rounded-full"
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg"></div>
                <span className="text-white font-semibold">TBO SMART</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Building the future of B2B travel with artificial intelligence and global scale.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </a>
                <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
                </a>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Solutions</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/features" className="hover:text-cyan-400 transition-colors">Corporate Travel</Link></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Travel Agencies</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Procurement Teams</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Expense Management</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Compliance</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Safety Guides</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact Sales</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">
              © 2024 TBO Smart Travel Copilot. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-slate-500">
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Cookies Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
