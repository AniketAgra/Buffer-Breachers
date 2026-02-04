import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Plane,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  Shield,
  Hotel,
  MessageSquare,
  AlertCircle,
  User,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PlanTrip = () => {
  const { user } = useAuth();
  const [assignedAgent, setAssignedAgent] = useState(null);
  const [tripDetails, setTripDetails] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: '',
    purpose: '',
  });
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentStep, setCurrentStep] = useState('initial'); // initial, planning, confirmed

  useEffect(() => {
    // Simulate agent assignment
    setTimeout(() => {
      setAssignedAgent({
        name: 'Sarah Jenkins',
        title: 'Lead Corporate Travel Agent',
        avatar: 'SJ',
        status: 'online',
      });
      setMessages([
        {
          id: 1,
          sender: 'agent',
          content: "Hello! I'm Sarah, your dedicated travel agent. I'm here to help you plan the perfect trip. Let's start by understanding your requirements.",
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          sender: 'agent',
          content: 'Could you tell me where you would like to travel and your preferred dates?',
          timestamp: new Date().toISOString(),
        },
      ]);
    }, 1000);
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'client',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        id: messages.length + 2,
        sender: 'agent',
        content: "Thank you for that information. I'm working on finding the best options for you. This will take just a moment...",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, agentResponse]);
    }, 1500);
  };

  const requirements = [
    {
      icon: MapPin,
      label: 'Destination',
      value: tripDetails.destination || 'Not specified',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Calendar,
      label: 'Travel Dates',
      value: tripDetails.startDate && tripDetails.endDate 
        ? `${tripDetails.startDate} - ${tripDetails.endDate}` 
        : 'Not specified',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      label: 'Travelers',
      value: tripDetails.travelers || 'Not specified',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: DollarSign,
      label: 'Budget',
      value: tripDetails.budget ? `$${tripDetails.budget}` : 'Not specified',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Plan Your Trip</h1>
              <p className="text-slate-400 text-sm">Collaborative trip planning with your agent</p>
            </div>
            {assignedAgent && (
              <div className="flex items-center space-x-3 bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-600/50">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {assignedAgent.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{assignedAgent.name}</p>
                  <p className="text-slate-400 text-xs">{assignedAgent.title}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-semibold">ONLINE</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Sidebar - Requirements */}
          <div className="space-y-6">
            {/* Trip Requirements */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-cyan-400" />
                Trip Requirements
              </h3>
              <div className="space-y-3">
                {requirements.map((req, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 bg-gradient-to-br ${req.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <req.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-400 text-xs">{req.label}</p>
                        <p className="text-white text-sm font-medium truncate">{req.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Status Updates */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-amber-400" />
                Status Updates
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm">Agent Assigned</p>
                    <p className="text-slate-500 text-xs">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
                  <div>
                    <p className="text-white text-sm">Gathering Requirements</p>
                    <p className="text-slate-500 text-xs">In progress</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-slate-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-slate-500 text-sm">Search Options</p>
                    <p className="text-slate-600 text-xs">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Notice */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">Secure Planning</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Your conversation is end-to-end encrypted. All payment information is secured with enterprise-grade protection.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Chat Interface */}
          <div className="col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-xl flex flex-col h-[calc(100vh-240px)]">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-white font-semibold">Planning Discussion</h3>
                </div>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/30">
                  LIVE SESSION
                </span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.sender === 'client'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        : 'bg-slate-700/50 border border-slate-600/50'
                    } rounded-2xl px-4 py-3`}
                  >
                    {message.sender === 'agent' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {assignedAgent?.avatar}
                        </div>
                        <span className="text-slate-400 text-xs font-semibold">
                          {assignedAgent?.name}
                        </span>
                      </div>
                    )}
                    <p className={`text-sm ${message.sender === 'client' ? 'text-white' : 'text-slate-200'}`}>
                      {message.content}
                    </p>
                    <p className={`text-xs mt-2 ${message.sender === 'client' ? 'text-cyan-100' : 'text-slate-500'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator (optional) */}
              {/* <div className="flex items-center space-x-2">
                <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-slate-700/50">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message to your agent..."
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs">
                <p className="text-slate-500">Press Enter to send</p>
                <div className="flex items-center space-x-3">
                  <button className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>ENCRYPTED</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTrip;
