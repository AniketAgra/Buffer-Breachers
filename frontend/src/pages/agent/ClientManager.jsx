import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Mail,
  DollarSign,
  Calendar,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Phone,
  MapPin,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { agentAPI } from '../../services/endpoints';

const ClientManager = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@techcorp.com',
      company: 'TechCorp Inc.',
      phone: '+1 (555) 123-4567',
      location: 'New York, USA',
      status: 'active',
      activeTrips: 2,
      totalSpent: 45000,
      upcomingTrips: 1,
      lastBooking: '2 days ago',
      preferences: ['Business Class', 'Luxury Hotels'],
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'm.chen@globalventures.com',
      company: 'Global Ventures',
      phone: '+1 (555) 987-6543',
      location: 'San Francisco, USA',
      status: 'active',
      activeTrips: 1,
      totalSpent: 28000,
      upcomingTrips: 3,
      lastBooking: '1 week ago',
      preferences: ['Economy Class', 'Budget Friendly'],
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.r@designstudio.com',
      company: 'Design Studio',
      phone: '+1 (555) 246-8135',
      location: 'Los Angeles, USA',
      status: 'pending',
      activeTrips: 0,
      totalSpent: 0,
      upcomingTrips: 1,
      lastBooking: 'Never',
      preferences: ['First Class', 'Boutique Hotels'],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Client Portfolio</h1>
              <p className="text-slate-400">Manage and track all your clients</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add New Client</span>
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
                placeholder="Search clients by name, email, or company..."
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="px-4 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-all flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Client Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Clients',
              value: clients.length,
              icon: Users,
              color: 'from-cyan-500 to-blue-500',
            },
            {
              label: 'Active Trips',
              value: clients.reduce((sum, c) => sum + c.activeTrips, 0),
              icon: TrendingUp,
              color: 'from-green-500 to-emerald-500',
            },
            {
              label: 'Total Revenue',
              value: `$${(clients.reduce((sum, c) => sum + c.totalSpent, 0) / 1000).toFixed(0)}K`,
              icon: DollarSign,
              color: 'from-purple-500 to-pink-500',
            },
            {
              label: 'Upcoming',
              value: clients.reduce((sum, c) => sum + c.upcomingTrips, 0),
              icon: Calendar,
              color: 'from-amber-500 to-orange-500',
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

        {/* Client Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group cursor-pointer"
              onClick={() => setSelectedClient(client)}
            >
              {/* Card Header */}
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {client.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{client.name}</h3>
                      <p className="text-slate-400 text-sm">{client.company}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-slate-400">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{client.location}</span>
                  </div>
                </div>
              </div>

              {/* Card Stats */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Active</p>
                    <p className="text-white font-semibold">{client.activeTrips}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Upcoming</p>
                    <p className="text-white font-semibold">{client.upcomingTrips}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Spent</p>
                    <p className="text-white font-semibold">
                      ${(client.totalSpent / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      client.status === 'active'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                        : client.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                    }`}
                  >
                    {client.status.toUpperCase()}
                  </span>
                  <p className="text-slate-500 text-xs flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {client.lastBooking}
                  </p>
                </div>

                {/* Preferences */}
                {client.preferences.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <div className="flex flex-wrap gap-2">
                      {client.preferences.map((pref, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded border border-cyan-500/30"
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6">
                <button className="w-full py-2 bg-slate-700/50 hover:bg-cyan-500 border border-slate-600 hover:border-cyan-500 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition-all group-hover:bg-cyan-500 group-hover:border-cyan-500 group-hover:text-white">
                  View Full Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientManager;
