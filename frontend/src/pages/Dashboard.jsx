import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plane,
  AlertTriangle,
  Cloud,
  Sparkles,
  Users,
  Clock,
  ArrowUp,
  ArrowDown,
  Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../services/endpoints';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeTrips: 0,
    pendingApprovals: 0,
    monthlyRevenue: 0,
    revenueChange: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      const bookingsData = response.data.data || [];
      setBookings(bookingsData);

      // Calculate stats
      const active = bookingsData.filter((b) => b.status === 'confirmed').length;
      const pending = bookingsData.filter((b) => b.status === 'pending').length;
      const revenue = bookingsData.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      setStats({
        activeTrips: active,
        pendingApprovals: pending,
        monthlyRevenue: revenue,
        revenueChange: -3, // Mock data
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const safetyAlerts = [
    {
      type: 'critical',
      icon: AlertTriangle,
      title: 'CRITICAL DELAY',
      description: 'LHR Airport strike affecting arrivals for J. Smith (BA-215)',
      time: '2 mins ago',
    },
    {
      type: 'weather',
      icon: Cloud,
      title: 'WEATHER ALERT',
      description: 'Monsoon warning in Tokyo. Diverting flight rescheduling for H. Kim.',
      time: '15 mins ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-black py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wide">
                    TravelTech AI
                  </p>
                  <h1 className="text-2xl font-bold text-white">Enterprise Workspace</h1>
                </div>
              </div>
            </div>
            <Link
              to="/plan-trip"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 flex items-center space-x-2"
            >
              <Plane className="w-5 h-5" />
              <span>Plan New Trip</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Active Trips</p>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+11%</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-white">{stats.activeTrips}</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Pending Approvals</p>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                {stats.pendingApprovals}
              </span>
            </div>
            <div className="text-5xl font-bold text-white">{stats.pendingApprovals}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <TrendingDown className="h-4 w-4" />
                <span>-3%</span>
              </div>
            </div>
            <div className="text-5xl font-bold text-white">
              ${(stats.monthlyRevenue / 1000).toFixed(1)}k
            </div>
          </motion.div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Safety Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-gradient rounded-xl p-6 border border-slate-800"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-xl font-bold text-white">Safety Alerts</h2>
                </div>
                <span className="text-xs text-gray-400">Real-time Updates</span>
              </div>

              <div className="space-y-4">
                {safetyAlerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`${
                      alert.type === 'critical' ? 'alert-card' : 'bg-yellow-900/20'
                    } border-l-4 ${
                      alert.type === 'critical' ? 'border-red-500' : 'border-yellow-500'
                    } rounded-lg p-4`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          alert.type === 'critical'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        <alert.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3
                            className={`font-bold text-sm ${
                              alert.type === 'critical' ? 'text-red-400' : 'text-yellow-400'
                            }`}
                          >
                            {alert.title}
                          </h3>
                          <span className="text-xs text-gray-500">{alert.time}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{alert.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card-gradient rounded-xl p-6 border border-slate-800"
            >
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Calendar, label: 'Invoice', color: 'blue' },
                  { icon: Plane, label: 'Lodging', color: 'purple' },
                  { icon: Activity, label: 'Transport', color: 'green' },
                  { icon: Users, label: 'Share', color: 'orange' },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-all duration-200 group"
                  >
                    <div className={`p-3 rounded-lg bg-${action.color}-500/20 group-hover:bg-${action.color}-500/30 transition-colors`}>
                      <action.icon className={`h-6 w-6 text-${action.color}-400`} />
                    </div>
                    <span className="text-xs text-gray-300 font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Trips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card-gradient rounded-xl p-6 border border-slate-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Upcoming Trips</h2>
                <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <span>Filter</span>
                  <TrendingDown className="h-4 w-4" />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left text-xs text-gray-400 font-medium pb-3 uppercase tracking-wider">
                          Client Name
                        </th>
                        <th className="text-left text-xs text-gray-400 font-medium pb-3 uppercase tracking-wider">
                          Destination
                        </th>
                        <th className="text-left text-xs text-gray-400 font-medium pb-3 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="text-left text-xs text-gray-400 font-medium pb-3 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left text-xs text-gray-400 font-medium pb-3 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 3).map((booking, index) => (
                        <motion.tr
                          key={booking._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {(user?.name || 'U').charAt(0)}
                              </div>
                              <div>
                                <p className="text-white font-medium">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-400">{booking.bookingType}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <p className="text-white font-medium">
                              {booking.destination || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {booking.bookingDetails?.name || 'Details N/A'}
                            </p>
                          </td>
                          <td className="py-4">
                            <p className="text-white text-sm">
                              {booking.bookingDetails?.checkIn ||
                                booking.bookingDetails?.departure ||
                                'TBD'}
                            </p>
                            <p className="text-xs text-gray-400">2023</p>
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed'
                                  ? 'bg-green-500/20 text-green-400'
                                  : booking.status === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {booking.status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4">
                            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                              Manage
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No trips yet</h3>
                  <p className="text-gray-400 mb-6">Start planning your next adventure</p>
                  <Link
                    to="/demo"
                    className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Plan a Trip
                  </Link>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - AI Copilot Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card-gradient rounded-xl p-6 border border-slate-800 h-fit sticky top-24"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">AI Copilot</h2>
              </div>
              <button className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-sm text-gray-300 mb-2">
                  Hello Alex! I've monitored 1 new price drop for your London booking. Would you
                  like to update or keep the current choice?
                </p>
                <p className="text-xs text-gray-500">AI Agent • 3m41 AM</p>
              </div>

              <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-600/30">
                <p className="text-sm text-gray-200 font-medium mb-2">Draft Ready</p>
                <p className="text-sm text-gray-300 mb-3">
                  "Subject: Great news! I've found a lower price for your London trip."
                </p>
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Preview Email
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <p className="text-xs text-gray-500 mb-2">AI Agent • Just now</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button className="w-full text-sm text-gray-400 hover:text-white flex items-center justify-between p-3 bg-slate-800/30 rounded-lg transition-colors">
                <span>Chat Train transcript</span>
                <ArrowDown className="h-4 w-4" />
              </button>
              <button className="w-full mt-2 text-sm text-gray-400 hover:text-white flex items-center justify-between p-3 bg-slate-800/30 rounded-lg transition-colors">
                <span>Gas Invoice PDF</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
