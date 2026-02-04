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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Dashboard</h1>
          <p className="text-gray-600">
            Manage clients, compare deals, and plan trips efficiently
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Clients</p>
                  <h3 className="text-3xl font-bold">{stats?.totalClients || 0}</h3>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">Active Bookings</p>
                  <h3 className="text-3xl font-bold">{stats?.activeBookings || 0}</h3>
                </div>
                <CheckCircle className="h-12 w-12 text-green-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm mb-1">Active Plans</p>
                  <h3 className="text-3xl font-bold">{stats?.activePlans || 0}</h3>
                </div>
                <Calendar className="h-12 w-12 text-purple-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-bold">
                    ₹{((stats?.totalRevenue || 0) / 1000).toFixed(0)}K
                  </h3>
                </div>
                <TrendingUp className="h-12 w-12 text-orange-200" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center mb-4">
              <Search className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Find Best Deals</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Compare deals across multiple providers and ensure no opportunities are missed
            </p>
            <Link to="/agent/deals">
              <Button variant="primary" fullWidth>
                Compare Deals
              </Button>
            </Link>
          </Card>

          <Card>
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Manage Clients</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View and manage your client portfolio, add new clients, track their bookings
            </p>
            <Link to="/agent/clients">
              <Button variant="outline" fullWidth>
                View Clients
              </Button>
            </Link>
          </Card>

          <Card>
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Plan New Trip</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Create optimized trip plans for clients with AI-powered recommendations
            </p>
            <Link to="/agent/trips/plan">
              <Button variant="secondary" fullWidth>
                Plan Trip
              </Button>
            </Link>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Bookings</span>
                <span className="font-semibold text-gray-900">
                  {stats?.totalBookings || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Plans Created</span>
                <span className="font-semibold text-gray-900">
                  {stats?.totalPlans || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg. Booking Value</span>
                <span className="font-semibold text-gray-900">
                  ₹{(stats?.averageBookingValue || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Potential Revenue</span>
                <span className="font-semibold text-green-600">
                  ₹{((stats?.potentialRevenue || 0) / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Always compare at least 3-5 deals before finalizing a booking
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Consider safety scores along with price when recommending deals
                </p>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Early bookings (60+ days) typically offer 15-20% better prices
                </p>
              </div>
              <div className="flex items-start">
                <DollarSign className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Use the deal validator to ensure optimal value for clients
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
