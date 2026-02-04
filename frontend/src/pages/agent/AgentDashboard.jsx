import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  LayoutDashboard,
  Plane,
  MessageSquare,
  Wallet,
  Shield,
  Sparkles,
  ArrowUp,
  ArrowRight,
  CloudRain,
  Hotel,
  MapPin,
} from 'lucide-react';
import { agentAPI } from '../../services/endpoints';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeNav, setActiveNav] = useState('overview');

  const upcomingDeadlines = [
    {
      id: 1,
      clientName: 'Alice Smith',
      initials: 'AS',
      destination: 'Paris, France',
      date: 'Oct 12, 2024',
      status: 'Awaiting Visa',
      statusColor: 'bg-yellow-500/20 text-yellow-400',
      action: 'Remind Client',
    },
    {
      id: 2,
      clientName: 'Marcus Kane',
      initials: 'MK',
      destination: 'Tokyo, Japan',
      date: 'Oct 15, 2024',
      status: 'Confirmed',
      statusColor: 'bg-green-500/20 text-green-400',
      action: 'Send Itinerary',
    },
    {
      id: 3,
      clientName: 'Laura Jenkins',
      initials: 'LJ',
      destination: 'New York, USA',
      date: 'Oct 18, 2024',
      status: 'Payment Pending',
      statusColor: 'bg-blue-500/20 text-blue-400',
      action: 'Check Invoice',
    },
  ];

  const aiSuggestions = [
    {
      icon: Sparkles,
      iconColor: 'text-yellow-400',
      title: 'Price drop detected',
      description: "for Smith's Paris trip. Potential savings: $240.",
      action: 'NOTIFY CLIENT?',
    },
    {
      icon: CloudRain,
      iconColor: 'text-red-400',
      title: 'Severe weather warning',
      description: 'for Tokyo. Flight impacts expected on Oct 15.',
      action: 'UPDATE MARCUS?',
    },
    {
      icon: Hotel,
      iconColor: 'text-blue-400',
      title: 'Hotel availability low',
      description: 'for Jenkins in NYC. 2 rooms left at preferred rate.',
      action: 'SECURE ROOM',
    },
  ];

  const navigationItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'trips', icon: Plane, label: 'Active Trips' },
    { id: 'messages', icon: MessageSquare, label: 'Client Messages' },
    { id: 'commission', icon: Wallet, label: 'Commission' },
    { id: 'alerts', icon: Shield, label: 'Security Alerts' },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await agentAPI.getDashboard();
      setStats(response.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl max-w-md">
          <p className="font-medium mb-2">Error Loading Dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-screen w-48 bg-slate-900/50 border-r border-slate-800 backdrop-blur-xl z-40">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <Plane className="h-6 w-6 text-cyan-400" />
            <span className="font-bold text-lg">TravelAI</span>
          </div>
          
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeNav === item.id
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-sm font-bold">SJ</span>
            </div>
            <div>
              <p className="text-sm font-medium">Sarah Jenkins</p>
              <p className="text-xs text-slate-400">Senior Agent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-48 p-8">
        {/* Top Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Active Bookings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Active Bookings</p>
                <h3 className="text-4xl font-bold">1,284</h3>
              </div>
              <Calendar className="h-10 w-10 text-cyan-400" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400 text-sm font-semibold flex items-center">
                <ArrowUp className="h-4 w-4" />
                +15.4%
              </span>
              <span className="text-slate-500 text-sm">from last month</span>
            </div>
          </motion.div>

          {/* Monthly Revenue Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Monthly Revenue</p>
              <span className="text-green-400 text-sm font-semibold">+8.4%</span>
            </div>
            <h3 className="text-4xl font-bold mb-3">$42,500</h3>
            {/* Mini Chart */}
            <div className="h-16 flex items-end space-x-1">
              {[40, 65, 55, 75, 60, 85, 70, 90, 75, 80, 85, 80].map((height, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t opacity-70" style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </motion.div>

          {/* High-Risk Alerts Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-red-900/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">High-Risk Alerts</p>
                <h3 className="text-4xl font-bold text-red-400">12</h3>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-400" />
            </div>
            <p className="text-slate-400 text-sm mb-2">Clients in affected areas</p>
            <button className="text-cyan-400 text-sm font-medium hover:underline flex items-center">
              Review safety protocols <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Upcoming Client Deadlines */}
          <div className="col-span-2 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Upcoming Client Deadlines</h3>
                <button className="text-cyan-400 text-sm font-medium hover:underline">
                  View All
                </button>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 pb-3 border-b border-slate-800">
                <div className="col-span-3">Client Name</div>
                <div className="col-span-3">Destination</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-4">Action</div>
              </div>

              {/* Table Rows */}
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <motion.div
                    key={deadline.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="grid grid-cols-12 gap-4 items-center py-4 px-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all"
                  >
                    <div className="col-span-3 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold">
                        {deadline.initials}
                      </div>
                      <span className="font-medium">{deadline.clientName}</span>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="font-medium">{deadline.destination.split(',')[0]}</p>
                          <p className="text-xs text-slate-500">Departs: {deadline.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${deadline.statusColor}`}>
                        {deadline.status}
                      </span>
                    </div>
                    <div className="col-span-4">
                      <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors w-full">
                        {deadline.action}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - AI Copilot */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">AI COPILOT</h3>
              </div>

              <div className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + 0.1 * index }}
                    className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50"
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <suggestion.icon className={`h-5 w-5 ${suggestion.iconColor} mt-0.5`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">
                          <span className={suggestion.iconColor}>{suggestion.title}</span>
                        </p>
                        <p className="text-sm text-slate-400">{suggestion.description}</p>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-lg text-xs font-semibold transition-all">
                      {suggestion.action}
                    </button>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-4 px-4 py-2 text-cyan-400 text-sm font-medium hover:underline flex items-center justify-center">
                Ask Copilot something <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AgentDashboard;