import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Plane,
  Hotel,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Send,
  Bot,
  Shield,
  FileUp,
  DollarSign,
  Settings,
  Map,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { agentAPI } from '../../services/endpoints';

const TripPlanner = () => {
  const [activeTrip, setActiveTrip] = useState({
    title: 'Paris Business Summit',
    date: 'October 14-18, 2024',
    traveler: 'Julianne Moore',
    status: 'ACTIVE PLANNING',
  });

  const [itinerary, setItinerary] = useState([
    {
      type: 'flight',
      title: 'Flight AF123 Departure',
      location: 'JFK Terminal 4',
      time: '10:30 PM (Sun)',
      status: 'CONFIRMED',
      icon: Plane,
    },
    {
      type: 'flight',
      title: 'Arrival: Charles de Gaulle',
      location: '10:30 AM',
      time: 'Terminal 2E',
      icon: Plane,
    },
    {
      type: 'hotel',
      title: 'Check-in: Hotel Le Maurice',
      location: '3:00 PM',
      address: '228 Rue de Rivoli',
      status: 'SUGGESTED',
      icon: Hotel,
      actions: ['Confirm', 'Change'],
    },
    {
      type: 'meeting',
      title: 'Afternoon: Open Window for Meetings',
      time: '8:00 PM',
      subtitle: 'Client Dinner at Septime (Pending Reservation)',
      icon: Users,
    },
  ]);

  const [copilotMessages, setCopilotMessages] = useState([
    {
      type: 'recommendation',
      content:
        'I\'ve noticed the current hotel selection, ••Hotel Le Maurice••, is near a scheduled demonstration on Oct 15th.\n\nI recommend considering ••Hotel Regina Louvre••! Instead. It\'s 400m away, has a 9.2 safety rating, and is $120 cheaper per night for your client\'s dates.',
    },
    {
      type: 'alert',
      title: 'Price Drop Alert',
      content: 'Business class to CDG dropped by $420',
      action: 'Apply Savings',
    },
    {
      type: 'safety',
      title: 'Safety Heatmap: 1st Arrondissement',
      subtitle: 'Updated 3 mins ago based on local news alerts',
      map: true,
    },
  ]);

  const [suggestions, setSuggestions] = useState([
    'Find a safer hotel in Paris',
    'Draft an email for my client',
    'Show flight alternatives',
  ]);

  const [chatInput, setChatInput] = useState('');

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Left Panel - Itinerary */}
      <div className="w-1/2 border-r border-slate-700/50 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/50 border-b border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                {activeTrip.status}
              </span>
              <h1 className="text-3xl font-bold text-white mt-1">{activeTrip.title}</h1>
              <p className="text-slate-400 text-sm mt-1">
                {activeTrip.date} • 1 Traveler: {activeTrip.traveler}
              </p>
            </div>
            <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 text-sm font-medium flex items-center space-x-2 transition-all">
              <FileUp className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-1">
            {/* Day Header */}
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                DAY 1: MONDAY, OCT 14
              </span>
            </div>

            {/* Itinerary Items */}
            {itinerary.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Vertical Line */}
                {index < itinerary.length - 1 && (
                  <div className="absolute left-[15px] top-12 bottom-0 w-px bg-slate-700"></div>
                )}

                <div className="flex items-start space-x-4 mb-6">
                  {/* Icon */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.type === 'flight'
                        ? 'bg-blue-500/10 text-blue-400'
                        : item.type === 'hotel'
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'bg-purple-500/10 text-purple-400'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                          <p className="text-slate-400 text-sm">
                            {item.time}
                            {item.location && (
                              <>
                                {' • '}
                                <span>{item.location}</span>
                              </>
                            )}
                          </p>
                          {item.address && (
                            <p className="text-slate-500 text-xs mt-1">{item.address}</p>
                          )}
                          {item.subtitle && (
                            <p className="text-slate-400 text-sm mt-2">{item.subtitle}</p>
                          )}
                        </div>

                        {/* Status Badge */}
                        {item.status && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.status === 'CONFIRMED'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            }`}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {item.actions && (
                        <div className="flex items-center space-x-2 mt-3">
                          {item.actions.map((action, idx) => (
                            <button
                              key={idx}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                action === 'Confirm'
                                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                                  : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600'
                              }`}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Copilot Advisor */}
      <div className="w-1/2 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/30 border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div>
              <h2 className="text-white font-semibold">Copilot Advisor</h2>
              <p className="text-slate-400 text-xs">Analyzing real-time travel data...</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {copilotMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {message.type === 'recommendation' && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {message.content}
                  </p>
                </div>
              )}

              {message.type === 'alert' && (
                <div className="bg-slate-800/50 border border-cyan-500/30 rounded-xl p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingDown className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{message.title}</h4>
                        <p className="text-slate-400 text-sm">{message.content}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-semibold transition-all">
                      {message.action}
                    </button>
                  </div>
                </div>
              )}

              {message.type === 'safety' && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-1">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <h4 className="text-white font-semibold">{message.title}</h4>
                    </div>
                    <p className="text-slate-400 text-xs">{message.subtitle}</p>
                  </div>
                  {message.map && (
                    <div className="relative h-48 bg-slate-700/30">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-yellow-500/10 to-green-500/20"></div>
                      <div className="absolute top-3 right-3 px-3 py-1 bg-red-500/90 text-white text-xs font-semibold rounded-full">
                        Active Incident
                      </div>
                      <Map className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-slate-600" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Suggestions */}
        <div className="px-6 py-3 border-t border-slate-700/50">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600 rounded-full text-slate-300 text-sm transition-all"
                onClick={() => setChatInput(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-6 bg-slate-800/50 border-t border-slate-700/50">
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center transition-all">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Copilot anything..."
              className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <div className="flex items-center space-x-4 text-slate-500">
              <button className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>SECURE ENCRYPTION</span>
              </button>
              <button className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
                <Settings className="w-3 h-3" />
                <span>ENTERPRISE DATA</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
