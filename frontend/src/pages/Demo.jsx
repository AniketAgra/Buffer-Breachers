import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  MapPin,
  DollarSign,
  Calendar,
  Users as UsersIcon,
  Plane,
  Hotel,
  Activity,
  Shield,
  CheckCircle2,
  CloudRain,
  Mic,
  Plus,
  Building2,
  FileText,
  BarChart3,
  Settings,
  Home,
  Map,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { copilotAPI } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';

const Demo = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello Sarah! I've loaded the corporate travel policy for Alex Rivers' trip to London next week. He needs a hotel near the Shard and a morning flight. How can I assist you today?",
      timestamp: new Date(),
    },
    {
      role: 'user',
      content:
        "Show me 3 recommended hotels that are within the £300/night limit and have business lounges.",
      timestamp: new Date(),
    },
    {
      role: 'assistant',
      content:
        "I've found 3 hotels that match the requirements and the corporate policy. The Shangri-La is currently over budget, but I've included it as it's the closest to the meeting.",
      hotels: [
        {
          name: 'The Hoxton, Southwark',
          location: '0.4 miles from Shard',
          price: 245,
          image: 'hotel1',
          match: true,
        },
        {
          name: 'CitizenM London Bridge',
          location: '0.2 miles from Shard',
          price: 189,
          image: 'hotel2',
          match: true,
        },
      ],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e, customQuery = null) => {
    e?.preventDefault();
    const query = customQuery || input.trim();
    if (!query) return;

    const userMessage = {
      role: 'user',
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await copilotAPI.query({ message: query });
      const data = response.data;

      const assistantMessage = {
        role: 'assistant',
        content: data.response.conversationalResponse || data.response.message || 'I processed your request.',
        data: data.response.data,
        intent: data.intent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content:
          error.response?.data?.message ||
          'Sorry, I encountered an error. Please try again.',
        error: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-slate-800/50 border-r border-slate-700/50 flex flex-col">
        {/* Workspace Header */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Global Corp</h3>
              <p className="text-xs text-slate-400">Premium Enterprise</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Navigation</p>
          <nav className="space-y-1">
            {[
              { icon: Home, label: 'Overview', active: false },
              { icon: Bot, label: 'AI Copilot', active: true },
              { icon: Map, label: 'Itineraries', active: false },
              { icon: BarChart3, label: 'Reports', active: false },
              { icon: Shield, label: 'Policy Manager', active: false },
            ].map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                  item.active
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Credits */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-2 text-slate-400">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">CREDITS</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">768 / 1000 AI tokens used</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-800/30 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-5 h-5 text-cyan-400" />
            <span className="text-slate-400 text-sm">AI Assistant /</span>
            <span className="text-white font-medium">Corporate Trip to London</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs font-semibold">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>POLICY COMPLIANT</span>
            </span>
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-semibold">
              AGENT MODE ACTIVE
            </span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {message.role === 'user' ? (
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="max-w-2xl">
                      <div className="bg-slate-700/50 rounded-2xl rounded-tr-sm px-4 py-3">
                        <p className="text-slate-200 text-sm">{message.content}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 max-w-4xl">
                      {message.content && (
                        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl rounded-tl-sm px-4 py-3 mb-4">
                          <p className="text-slate-200 text-sm leading-relaxed">{message.content}</p>
                        </div>
                      )}

                      {/* Hotel Cards */}
                      {message.hotels && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {message.hotels.map((hotel, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden group hover:border-cyan-500/50 transition-all"
                            >
                              <div className="relative h-48 bg-slate-700">
                                {hotel.match && (
                                  <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                                    MATCH
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                              </div>
                              <div className="p-4">
                                <h4 className="text-white font-semibold mb-1">{hotel.name}</h4>
                                <p className="text-slate-400 text-sm mb-3 flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {hotel.location}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-2xl font-bold text-cyan-400">
                                      £{hotel.price}
                                    </p>
                                    <p className="text-xs text-slate-500">/night</p>
                                  </div>
                                  <button className="w-10 h-10 bg-slate-700 hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-all group-hover:scale-110">
                                    <Plus className="w-5 h-5 text-white" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Render structured data */}
                      {message.data && message.data.hotels && message.data.hotels.length > 0 && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {message.data.hotels.slice(0, 3).map((hotel, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all"
                            >
                              <div className="p-4">
                                <h4 className="text-white font-semibold mb-1">{hotel.name}</h4>
                                <p className="text-slate-400 text-sm mb-3">{hotel.location}</p>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-2xl font-bold text-cyan-400">
                                      ₹{hotel.price?.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-500">per night</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-slate-400">⭐ {hotel.rating}/5</p>
                                    {hotel.matchScore && (
                                      <p className="text-xs text-green-400">
                                        {Math.round(hotel.matchScore)}% match
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {message.data && message.data.flights && message.data.flights.length > 0 && (
                        <div className="space-y-3">
                          {message.data.flights.slice(0, 3).map((flight, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/50 transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-white font-semibold">{flight.airline}</h4>
                                  <p className="text-slate-400 text-sm">
                                    {flight.from} → {flight.to}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {flight.duration} • {flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-cyan-400">
                                    ₹{flight.price?.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-800/50 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-slate-400 text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-3 border-t border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center space-x-2">
            {[
              { icon: Hotel, label: 'Suggest Hotels' },
              { icon: Shield, label: 'Check Safety' },
              { icon: TrendingUp, label: 'Compare Flights' },
              { icon: FileText, label: 'Generate Quote' },
            ].map((action, index) => (
              <button
                key={index}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg transition-all text-slate-300 hover:text-white text-sm"
              >
                <action.icon className="w-4 h-4" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-slate-800/50 border-t border-slate-700/50">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <button
              type="button"
              className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-all"
            >
              <Plus className="w-5 h-5 text-slate-300" />
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI to find options, compare, or book..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                disabled={loading}
              />
            </div>
            <button
              type="button"
              className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-all"
            >
              <Mic className="w-5 h-5 text-slate-300" />
            </button>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </form>
          <p className="text-xs text-slate-500 text-center mt-3">
            TravelCopilot AI can make mistakes. Verify important travel details.
          </p>
        </div>
      </div>

      {/* Right Sidebar - Trip Context */}
      <div className="w-80 bg-slate-800/30 border-l border-slate-700/50 p-6 overflow-y-auto">
        <h3 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider">
          Trip Context
        </h3>

        {/* Destinations */}
        <div className="mb-6">
          <h4 className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Destinations
          </h4>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h5 className="text-white font-semibold">London, UK</h5>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Safety Score</span>
                <span className="text-green-400 font-semibold">92/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Weather</span>
                <span className="text-slate-300 flex items-center">
                  <CloudRain className="w-4 h-4 mr-1" />
                  14°C, Rainy
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Traveler Policy */}
        <div className="mb-6">
          <h4 className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Traveler Policy
          </h4>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h5 className="text-white font-semibold mb-1">Alex Rivers</h5>
            <p className="text-slate-400 text-sm mb-3">Director, IT</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Business Class Allowed</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>£500/night Max</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Lounge Access Required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Flight Pricing */}
        <div>
          <h4 className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Live Flight Pricing
          </h4>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">JFK → LHR</span>
              <span className="text-cyan-400 font-semibold">£2,140</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">SFO → LHR</span>
              <span className="text-cyan-400 font-semibold">£2,650</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
