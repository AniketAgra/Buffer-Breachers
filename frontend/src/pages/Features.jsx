import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Shield,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Search,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Globe,
  MessageSquare,
} from 'lucide-react';
import Card from '../components/common/Card';

const Features = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Planning',
      description:
        'Our rule-based AI copilot understands natural language queries and provides intelligent trip recommendations.',
      features: [
        'Intent classification with keyword scoring',
        'Entity extraction (destination, budget, dates)',
        'Context-aware recommendations',
        'Follow-up question handling',
      ],
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Shield,
      title: 'Safety Intelligence',
      description:
        'Comprehensive safety scoring system with real-time alerts and demographic-specific insights.',
      features: [
        'Multi-category safety scoring (0-10 scale)',
        'Women, solo, family safety analysis',
        'Active alerts and warnings',
        'Area-wise safety ratings',
      ],
      color: 'from-green-500 to-green-600',
    },
    {
      icon: MapPin,
      title: 'Smart Itineraries',
      description:
        'Automated day-wise itinerary generation with optimized routes and activity scheduling.',
      features: [
        'Day-by-day planning with timings',
        '2-3 activities per day optimization',
        'Meal and leisure time allocation',
        'Conflict-free scheduling',
      ],
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: DollarSign,
      title: 'Dynamic Pricing',
      description:
        'Intelligent pricing engine with surge pricing, discounts, and budget optimization algorithms.',
      features: [
        'Surge pricing (peak seasons +40%)',
        'Advance booking discounts (up to 15%)',
        'Budget allocation by category',
        'Cost-saving suggestions',
      ],
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  const additionalFeatures = [
    {
      icon: Search,
      title: 'Intelligent Search',
      description: 'Advanced filtering and scoring algorithms for flights, hotels, and activities.',
    },
    {
      icon: Calendar,
      title: 'Booking Management',
      description: 'Complete booking lifecycle with cancellation policies and refund calculations.',
    },
    {
      icon: Users,
      title: 'Personalized Profiles',
      description: 'User preferences drive all recommendations for tailored experiences.',
    },
    {
      icon: TrendingUp,
      title: 'Weighted Scoring',
      description: 'Multi-factor scoring (price 35%, rating 25%, location 20%) for optimal results.',
    },
    {
      icon: Globe,
      title: 'Multi-Destination',
      description: 'Support for 50+ destinations with comprehensive mock data.',
    },
    {
      icon: MessageSquare,
      title: 'Conversational UI',
      description: 'Natural language chat interface with contextual responses.',
    },
  ];

  const technicalSpecs = [
    {
      category: 'Intent Classification',
      details: [
        'TRIP_PLANNING - Complete trip recommendations',
        'HOTEL_SEARCH - Hotel-specific queries',
        'FLIGHT_SEARCH - Flight booking assistance',
        'SAFETY_INQUIRY - Safety information requests',
        'RECOMMENDATION - Personalized suggestions',
      ],
    },
    {
      category: 'Scoring Algorithm',
      details: [
        'Hotels: Price 35%, Rating 25%, Location 20%',
        'Flights: Price 40%, Direct 25%, Duration 15%',
        'Activities: Category 35%, Price 25%, Rating 25%',
        'Safety: 6 categories with 0-10 scoring',
      ],
    },
    {
      category: 'Budget Support',
      details: [
        'Natural language: "1 lakh", "₹50k", "50000"',
        'Smart allocation: Flights 30-35%, Hotels 25-40%',
        'Dynamic adjustments based on trip length',
        'Optimization suggestions for budget constraints',
      ],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-yellow-300" />
              <span className="text-yellow-300 font-semibold text-lg">Platform Features</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Rule-Based AI,
              <span className="block text-yellow-300">Real Results</span>
            </h1>
            <p className="text-xl text-gray-100">
              No machine learning models, no Python. Just intelligent algorithms, decision trees,
              and scoring systems that deliver personalized travel experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-lg mb-4`}>
                    <feature.icon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">More Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A complete suite of tools to make travel planning effortless
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="bg-primary-100 p-3 rounded-lg inline-block mb-3">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technical Deep Dive</h2>
            <p className="text-xl text-gray-600">
              Transparent algorithms powering your travel decisions
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {technicalSpecs.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b">
                    {spec.category}
                  </h3>
                  <ul className="space-y-3">
                    {spec.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="bg-primary-100 p-1 rounded-full mt-0.5">
                          <CheckCircle className="h-3 w-3 text-primary-600" />
                        </div>
                        <span className="text-sm text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h2 className="text-4xl font-bold mb-6">Experience the AI Copilot</h2>
            <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
              Try our intelligent travel assistant and see how rule-based AI can transform your
              trip planning.
            </p>
            <a
              href="/demo"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Try Demo Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;
