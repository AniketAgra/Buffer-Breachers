import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Plane,
  Hotel,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingAPI, copilotAPI } from '../services/endpoints';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    totalSpent: 0,
    savedAmount: 0,
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
      const upcoming = bookingsData.filter(
        (b) => b.status === 'confirmed' || b.status === 'pending'
      ).length;
      const totalSpent = bookingsData.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      setStats({
        totalTrips: bookingsData.length,
        upcomingTrips: upcoming,
        totalSpent: totalSpent,
        savedAmount: Math.floor(totalSpent * 0.15), // Estimated 15% savings
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'gray';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'flight':
        return Plane;
      case 'hotel':
        return Hotel;
      case 'activity':
        return Activity;
      default:
        return MapPin;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your travel plans</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Bookings',
              value: stats.totalTrips,
              icon: Calendar,
              color: 'text-blue-600',
              bg: 'bg-blue-100',
            },
            {
              label: 'Upcoming Trips',
              value: stats.upcomingTrips,
              icon: Plane,
              color: 'text-green-600',
              bg: 'bg-green-100',
            },
            {
              label: 'Total Spent',
              value: `₹${(stats.totalSpent / 1000).toFixed(1)}k`,
              icon: DollarSign,
              color: 'text-purple-600',
              bg: 'bg-purple-100',
            },
            {
              label: 'Money Saved',
              value: `₹${(stats.savedAmount / 1000).toFixed(1)}k`,
              icon: TrendingUp,
              color: 'text-orange-600',
              bg: 'bg-orange-100',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-full`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to explore?</h2>
                <p className="text-gray-600">Plan your next adventure with our AI copilot</p>
              </div>
              <Link to="/demo">
                <Button>Start Planning</Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Bookings</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                All
              </Button>
              <Button variant="ghost" size="sm">
                Upcoming
              </Button>
              <Button variant="ghost" size="sm">
                Completed
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking, index) => {
                const TypeIcon = getTypeIcon(booking.bookingType);
                return (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card hover={false}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="bg-primary-100 p-3 rounded-lg">
                            <TypeIcon className="h-6 w-6 text-primary-600" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {booking.bookingDetails?.name ||
                                  `${booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)} Booking`}
                              </h3>
                              <Badge variant={getStatusVariant(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{booking.destination || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {booking.bookingDetails?.checkIn ||
                                    booking.bookingDetails?.departure ||
                                    'Date TBD'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-semibold text-gray-900">
                                  ₹{booking.totalPrice?.toLocaleString() || '0'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {booking.status === 'confirmed' && (
                            <Button variant="ghost" size="sm">
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-6">
                  Start planning your next adventure with our AI copilot
                </p>
                <Link to="/demo">
                  <Button>Plan a Trip</Button>
                </Link>
              </div>
            </Card>
          )}
        </motion.div>

        {/* User Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Travel Preferences</h2>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Budget</p>
                <p className="font-medium text-gray-900 capitalize">
                  {user?.preferences?.budget || 'Medium'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Travel Style</p>
                <p className="font-medium text-gray-900 capitalize">
                  {user?.preferences?.travelStyle || 'Balanced'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Accommodation</p>
                <p className="font-medium text-gray-900 capitalize">
                  {user?.preferences?.accommodation || 'Hotel'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Transportation</p>
                <p className="font-medium text-gray-900 capitalize">
                  {user?.preferences?.transportation || 'Flight'}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
