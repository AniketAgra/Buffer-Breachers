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
} from 'lucide-react';
import { copilotAPI } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const Demo = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "👋 Hello! I'm your TBO Travel Copilot. I can help you plan trips, find flights and hotels, check safety information, and create personalized itineraries. What would you like to explore today?",
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

  const suggestionChips = [
    { icon: MapPin, text: 'Plan a trip to Dubai for 5 days', query: 'Plan a trip to Dubai for 5 days with budget of 1 lakh' },
    { icon: Hotel, text: 'Find luxury hotels in Maldives', query: 'Show me luxury hotels in Maldives' },
    { icon: Plane, text: 'Search flights to Goa', query: 'Find flights from Mumbai to Goa' },
    { icon: Shield, text: 'Safety info for Bangkok', query: 'Is Bangkok safe for solo female travelers?' },
  ];

  const handleSubmit = async (e, customQuery = null) => {
    e?.preventDefault();
    const query = customQuery || input.trim();
    if (!query) return;

    // Add user message
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

      // Add assistant message
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

  const renderMessageContent = (message) => {
    if (message.role === 'user') {
      return <p className="text-gray-800">{message.content}</p>;
    }

    // Assistant message
    return (
      <div>
        <p className="text-gray-800 mb-4 whitespace-pre-line">{message.content}</p>

        {/* Render structured data based on intent */}
        {message.data && (
          <div className="mt-4 space-y-4">
            {/* Hotels */}
            {message.data.hotels && message.data.hotels.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Hotel className="h-5 w-5 text-primary-600" />
                  Recommended Hotels
                </h4>
                <div className="space-y-3">
                  {message.data.hotels.slice(0, 3).map((hotel, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900">{hotel.name}</h5>
                          <p className="text-sm text-gray-600">{hotel.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600">
                            ₹{hotel.price?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">per night</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>⭐ {hotel.rating}/5</span>
                        <span>•</span>
                        <span className="capitalize">{hotel.category}</span>
                        {hotel.matchScore && (
                          <>
                            <span>•</span>
                            <Badge variant="success">
                              {Math.round(hotel.matchScore)}% match
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flights */}
            {message.data.flights && message.data.flights.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Plane className="h-5 w-5 text-primary-600" />
                  Available Flights
                </h4>
                <div className="space-y-3">
                  {message.data.flights.slice(0, 3).map((flight, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h5 className="font-semibold text-gray-900">{flight.airline}</h5>
                          <p className="text-sm text-gray-600">
                            {flight.from} → {flight.to}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600">
                            ₹{flight.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{flight.duration}</span>
                        <span>•</span>
                        <span>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}</span>
                        {flight.matchScore && (
                          <>
                            <span>•</span>
                            <Badge variant="success">
                              {Math.round(flight.matchScore)}% match
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities */}
            {message.data.activities && message.data.activities.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary-600" />
                  Suggested Activities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {message.data.activities.slice(0, 4).map((activity, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h5 className="font-semibold text-gray-900 text-sm">{activity.name}</h5>
                        <p className="text-sm font-bold text-primary-600">
                          ₹{activity.price?.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Badge variant="info" className="text-xs">
                          {activity.category}
                        </Badge>
                        <span>⭐ {activity.rating}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Score */}
            {message.data.safetyScore !== undefined && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Safety Information
                </h4>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-green-600">
                      {message.data.safetyScore.toFixed(1)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Overall Safety Score</p>
                      <p className="text-sm text-gray-600">Out of 10</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cost Estimate */}
            {message.data.costEstimate && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  Cost Estimate
                </h4>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700">Total Trip Cost</span>
                    <span className="text-2xl font-bold text-purple-600">
                      ₹{message.data.costEstimate.total?.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Flights:</span>
                      <span>₹{message.data.costEstimate.flights?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accommodation:</span>
                      <span>₹{message.data.costEstimate.accommodation?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Activities:</span>
                      <span>₹{message.data.costEstimate.activities?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Follow-up suggestions */}
        {message.data?.followUpSuggestions && message.data.followUpSuggestions.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">You might also ask:</p>
            <div className="flex flex-wrap gap-2">
              {message.data.followUpSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={(e) => handleSubmit(e, suggestion)}
                  className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)]">
        <div className="grid lg:grid-cols-4 gap-6 h-full">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary-100 p-2 rounded-full">
                  <Sparkles className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Copilot</h3>
                  <p className="text-xs text-gray-600">Powered by Rule-Based AI</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Try asking:</p>
                  <div className="space-y-2">
                    {suggestionChips.map((chip, index) => (
                      <button
                        key={index}
                        onClick={(e) => handleSubmit(e, chip.query)}
                        className="w-full flex items-center gap-2 text-left text-sm p-3 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors group"
                      >
                        <chip.icon className="h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                        <span className="text-gray-700 group-hover:text-primary-700">
                          {chip.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h4 className="font-semibold text-gray-900 mb-3">I can help with:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="bg-primary-100 p-1 rounded">
                    <MapPin className="h-3 w-3 text-primary-600" />
                  </div>
                  Trip planning & itineraries
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary-100 p-1 rounded">
                    <Hotel className="h-3 w-3 text-primary-600" />
                  </div>
                  Hotel recommendations
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary-100 p-1 rounded">
                    <Plane className="h-3 w-3 text-primary-600" />
                  </div>
                  Flight searches
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary-100 p-1 rounded">
                    <Shield className="h-3 w-3 text-primary-600" />
                  </div>
                  Safety information
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary-100 p-1 rounded">
                    <Activity className="h-3 w-3 text-primary-600" />
                  </div>
                  Activity suggestions
                </li>
              </ul>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col h-full">
            <Card className="flex-1 flex flex-col overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user'
                            ? 'bg-primary-600'
                            : 'bg-gradient-to-br from-purple-500 to-primary-600'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-white" />
                        )}
                      </div>

                      <div
                        className={`flex-1 max-w-3xl ${
                          message.role === 'user' ? 'text-right' : ''
                        }`}
                      >
                        <div
                          className={`inline-block p-4 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-primary-600 text-white'
                              : message.error
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-gray-100'
                          }`}
                        >
                          {renderMessageContent(message)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-2">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-primary-600 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-gray-100 p-4 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
                        <span className="text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about your travel plans..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading || !input.trim()} icon={Send}>
                    Send
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
