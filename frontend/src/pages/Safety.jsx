import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  Users,
  Heart,
  Cloud,
  Home,
  TrendingUp,
  TrendingDown,
  Activity,
  MapPin,
  Phone,
  ChevronRight,
  Download,
  Share2,
} from 'lucide-react';
import { safetyAPI } from '../services/endpoints';

const Safety = () => {
  const [selectedDest, setSelectedDest] = useState('London');
  const [safetyData, setSafetyData] = useState(null);
  const [loading, setLoading] = useState(false);

  const destinations = [
    'Dubai',
    'Goa',
    'Paris',
    'Maldives',
    'Bangkok',
    'Manali',
    'Singapore',
    'London',
  ];

  useEffect(() => {
    fetchSafetyData();
  }, [selectedDest]);

  const fetchSafetyData = async () => {
    setLoading(true);
    try {
      const response = await safetyAPI.getDestinationSafety(selectedDest);
      setSafetyData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch safety data:', error);
      // Set mock data for demo
      setSafetyData({
        overallScore: 8.2,
        categoryScores: {
          political: 8.8,
          health: 7.6,
          infra: 9.2,
          digital: 8.5,
        },
        status: 'Stable',
        riskLevel: 'LOW RISK',
      });
    } finally {
      setLoading(false);
    }
  };

  const liveAlerts = [
    {
      type: 'storm',
      icon: Cloud,
      title: 'Storm Warning',
      description: 'Heavy rainstorm expected between 14:00 - 18:00. Commercial traffic normal.',
      time: 'Just Now',
      priority: 'medium',
    },
    {
      type: 'tube',
      icon: AlertTriangle,
      title: 'Tube Strike',
      description: 'London Tube may strike due to climate aware ahead.',
      time: '12 mins ago',
      priority: 'high',
    },
    {
      type: 'logistics',
      icon: Activity,
      title: 'Heathrow Logistics',
      description: 'New terminal 3 baggage system maintenance. Allow 30 mins extra for check.',
      time: '1 hour ago',
      priority: 'low',
    },
  ];

  const emergencyContacts = [
    {
      name: 'US Embassy, London',
      type: 'DIPLOMATIC MISSION',
      address: '24 Grosvenor Square, London W1J 7LL',
      phone: '+44 20 7499 9000',
    },
    {
      name: 'Emergency Medical Services',
      type: 'NATIONAL SERVICE',
      phone: '999',
    },
  ];

  const CircularProgress = ({ value, size = 200, strokeWidth = 12 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 10) * circumference;

    const getColor = (score) => {
      if (score >= 8) return '#10B981'; // green
      if (score >= 6) return '#F59E0B'; // yellow
      return '#EF4444'; // red
    };

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-black">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-blue-400 text-sm font-semibold uppercase tracking-wide">
                  ENTERPRISE PROTECTION
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {selectedDest}, {selectedDest === 'London' ? 'United Kingdom' : 'Destination'}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-400">
                  <Activity className="h-4 w-4" />
                  Global Safety Index: Updated 2 mins ago
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 transition-colors border border-slate-700">
                <Share2 className="h-4 w-4" />
                <span className="hidden md:inline">Share</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                <Download className="h-4 w-4" />
                <span className="hidden md:inline">Download Full Intelligence Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Selector */}
      <div className="bg-slate-900/50 border-b border-slate-800 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-400 font-medium flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Select Destination:
            </span>
            {destinations.map((dest) => (
              <button
                key={dest}
                onClick={() => setSelectedDest(dest)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedDest === dest
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Safety Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-gradient rounded-xl p-8 border border-slate-800"
            >
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <CircularProgress value={safetyData?.overallScore || 8.2} size={220} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl font-bold text-white">
                      {(safetyData?.overallScore || 8.2).toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">
                      SAFETY INDEX
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Destination Safety Level: {safetyData?.status || 'Stable'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {selectedDest} is currently experiencing a low-risk environment. Public
                      services are operating at full capacity and no major civil unrest is
                      reported in the primary tourist or business districts.
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
                        {safetyData?.riskLevel || 'LOW RISK'}
                      </span>
                      <span className="px-4 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/30">
                        STABLE INFRASTRUCTURE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Metrics */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  {
                    label: 'POLITICAL',
                    value: safetyData?.categoryScores?.political || 8.8,
                    change: '+2%',
                    trend: 'up',
                  },
                  {
                    label: 'HEALTH',
                    value: safetyData?.categoryScores?.health || 7.6,
                    change: '+1%',
                    trend: 'up',
                  },
                  {
                    label: 'INFRA',
                    value: safetyData?.categoryScores?.infra || 9.2,
                    change: '-1%',
                    trend: 'down',
                  },
                  {
                    label: 'DIGITAL',
                    value: safetyData?.categoryScores?.digital || 8.5,
                    change: '+4%',
                    trend: 'up',
                  },
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="metric-card p-4 text-center"
                  >
                    <p className="text-xs text-gray-400 uppercase mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold text-white mb-1">
                      {metric.value.toFixed(1)}/10
                    </p>
                    <div
                      className={`flex items-center justify-center gap-1 text-xs ${
                        metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{metric.change}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Expanded Map Link */}
              <button className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5" />
                Expanded Map
              </button>
            </motion.div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live Disruption Feed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-gradient rounded-xl p-6 border border-slate-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h2 className="text-xl font-bold text-white">Live Disruption Feed</h2>
                  </div>
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold border border-red-500/30">
                    3 HIGH PRIORITY
                  </span>
                </div>

                <div className="space-y-4">
                  {liveAlerts.map((alert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            alert.priority === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : alert.priority === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          <alert.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-white font-semibold">{alert.title}</h3>
                            <span className="text-xs text-gray-500">{alert.time}</span>
                          </div>
                          <p className="text-gray-400 text-sm">{alert.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button className="w-full mt-4 py-2 text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                  View All Disruption History
                  <ChevronRight className="h-4 w-4" />
                </button>
              </motion.div>

              {/* Emergency Directory */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card-gradient rounded-xl p-6 border border-slate-800"
              >
                <h2 className="text-xl font-bold text-white mb-6">Emergency Directory</h2>

                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="h-4 w-4 text-blue-400" />
                            <h3 className="text-white font-semibold">{contact.name}</h3>
                          </div>
                          <p className="text-xs text-blue-400 uppercase mb-2">{contact.type}</p>
                          {contact.address && (
                            <p className="text-sm text-gray-400 mb-2">{contact.address}</p>
                          )}
                          <p className="text-2xl font-bold text-white">{contact.phone}</p>
                        </div>
                        {index === 0 ? (
                          <MapPin className="h-5 w-5 text-blue-400" />
                        ) : (
                          <Activity className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Safe Area Mapping */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="card-gradient rounded-xl p-6 border border-slate-800"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Safe Area Mapping</h2>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                    Expanded Map
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Real-time crime & incident density
                </p>

                {/* Map placeholder */}
                <div className="bg-slate-800/50 rounded-lg h-64 flex items-center justify-center border border-slate-700">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500">Interactive Map View</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Showing high safety zones and caution areas
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-400">High Safety Zones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                    <span className="text-sm text-gray-400">Caution Areas</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Safety;
