import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  TrendingDown,
  TrendingUp,
  Shield,
  Star,
  AlertCircle,
  DollarSign,
  Target,
  CheckCircle,
  Clock,
  Users,
  Briefcase,
  Filter,
  MoreVertical,
  ArrowRight,
  Calendar,
  Zap,
} from 'lucide-react';
import { agentAPI } from '../../services/endpoints';

const DealManager = () => {
  const [deals, setDeals] = useState([
    {
      id: 1,
      client: 'Sarah Johnson',
      clientCompany: 'TechCorp Inc.',
      destination: 'Paris, France',
      travelDates: 'Mar 15-22, 2024',
      value: 45000,
      status: 'negotiating',
      priority: 'high',
      savings: 5200,
      lastActivity: '2 hours ago',
      travelers: 3,
      type: 'Business Summit',
    },
    {
      id: 2,
      client: 'Michael Chen',
      clientCompany: 'Global Ventures',
      destination: 'Tokyo, Japan',
      travelDates: 'Apr 5-12, 2024',
      value: 38000,
      status: 'pending',
      priority: 'medium',
      savings: 3100,
      lastActivity: '1 day ago',
      travelers: 2,
      type: 'Conference',
    },
    {
      id: 3,
      client: 'Emily Rodriguez',
      clientCompany: 'Design Studio',
      destination: 'Dubai, UAE',
      travelDates: 'Mar 28-Apr 2, 2024',
      value: 52000,
      status: 'confirmed',
      priority: 'high',
      savings: 6800,
      lastActivity: '3 days ago',
      travelers: 4,
      type: 'Team Building',
    },
    {
      id: 4,
      client: 'David Park',
      clientCompany: 'InnoTech Solutions',
      destination: 'London, UK',
      travelDates: 'May 10-15, 2024',
      value: 29000,
      status: 'negotiating',
      priority: 'low',
      savings: 2400,
      lastActivity: '5 hours ago',
      travelers: 2,
      type: 'Client Meeting',
    },
    {
      id: 5,
      client: 'Lisa Thompson',
      clientCompany: 'MediaWorks',
      destination: 'Singapore',
      travelDates: 'Jun 1-7, 2024',
      value: 41000,
      status: 'pending',
      priority: 'medium',
      savings: 4500,
      lastActivity: '2 days ago',
      travelers: 3,
      type: 'Product Launch',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.clientCompany.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || deal.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'CONFIRMED',
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          border: 'border-green-500/30',
          icon: CheckCircle,
        };
      case 'negotiating':
        return {
          label: 'NEGOTIATING',
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          icon: Clock,
        };
      case 'pending':
        return {
          label: 'PENDING',
          bg: 'bg-cyan-500/10',
          text: 'text-cyan-400',
          border: 'border-cyan-500/30',
          icon: AlertCircle,
        };
      default:
        return {
          label: status.toUpperCase(),
          bg: 'bg-slate-500/10',
          text: 'text-slate-400',
          border: 'border-slate-500/30',
          icon: AlertCircle,
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-amber-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-slate-400';
    }
  };

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const totalSavings = deals.reduce((sum, deal) => sum + deal.savings, 0);
  const activeDeals = deals.filter((d) => d.status !== 'confirmed').length;
  const confirmedDeals = deals.filter((d) => d.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Deal Pipeline</h1>
              <p className="text-slate-400">Track and manage client travel deals</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>New Deal</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search deals by client, company, or destination..."
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="negotiating">Negotiating</option>
              <option value="pending">Pending</option>
            </select>
            <button className="px-4 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-all flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Pipeline',
              value: `$${(totalValue / 1000).toFixed(0)}K`,
              icon: DollarSign,
              color: 'from-cyan-500 to-blue-500',
            },
            {
              label: 'Total Savings',
              value: `$${(totalSavings / 1000).toFixed(1)}K`,
              icon: TrendingDown,
              color: 'from-green-500 to-emerald-500',
            },
            {
              label: 'Active Deals',
              value: activeDeals,
              icon: Clock,
              color: 'from-amber-500 to-orange-500',
            },
            {
              label: 'Confirmed',
              value: confirmedDeals,
              icon: CheckCircle,
              color: 'from-purple-500 to-pink-500',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Deal Cards */}
        <div className="space-y-4">
          {filteredDeals.map((deal, index) => {
            const statusConfig = getStatusConfig(deal.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{deal.client}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} flex items-center space-x-1`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusConfig.label}</span>
                        </span>
                        <span className={`text-xs font-semibold ${getPriorityColor(deal.priority)}`}>
                          {deal.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-1">{deal.clientCompany}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {deal.type}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {deal.travelDates}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {deal.travelers} travelers
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">
                        ${(deal.value / 1000).toFixed(1)}K
                      </div>
                      <div className="flex items-center text-green-400 text-sm font-semibold">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        ${(deal.savings / 1000).toFixed(1)}K saved
                      </div>
                      <p className="text-slate-500 text-xs mt-2 flex items-center justify-end">
                        <Clock className="w-3 h-3 mr-1" />
                        {deal.lastActivity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Target className="w-5 h-5" />
                      <span className="text-sm">{deal.destination}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition-all">
                        View Details
                      </button>
                      {deal.status !== 'confirmed' && (
                        <button className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white text-sm font-semibold rounded-lg transition-all flex items-center space-x-1">
                          <Zap className="w-4 h-4" />
                          <span>Quick Action</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DealManager;
