import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane,
  Brain,
  Shield,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Planning',
      description:
        'Intelligent trip planning with personalized recommendations based on your preferences.',
    },
    {
      icon: Shield,
      title: 'Safety Intelligence',
      description:
        'Real-time safety scores and alerts for destinations with demographic-specific insights.',
    },
    {
      icon: MapPin,
      title: 'Smart Itineraries',
      description:
        'Automated day-wise itinerary generation with optimized routes and timing.',
    },
    {
      icon: Calendar,
      title: 'Booking Management',
      description:
        'Seamless booking simulation for flights, hotels, and activities in one place.',
    },
    {
      icon: DollarSign,
      title: 'Budget Optimization',
      description:
        'Dynamic pricing engine with budget allocation and cost-saving suggestions.',
    },
    {
      icon: Users,
      title: 'Personalized Experience',
      description:
        'Travel recommendations tailored to solo, family, or group travel preferences.',
    },
  ];

  const stats = [
    { label: 'Destinations', value: '50+' },
    { label: 'Hotels', value: '5000+' },
    { label: 'Activities', value: '1000+' },
    { label: 'Happy Travelers', value: '10K+' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-yellow-300" />
                <span className="text-yellow-300 font-semibold">AI-Powered Travel Assistant</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your Smart Travel
                <span className="block text-yellow-300">Copilot</span>
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Plan perfect trips with AI-powered recommendations, safety intelligence, and
                personalized itineraries. No ML models, just smart rule-based algorithms.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/demo">
                  <Button size="lg" variant="secondary">
                    Try AI Copilot
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" className="bg-white/10 hover:bg-white/20 border-2 border-white">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-300 rounded-full blur-3xl opacity-20"></div>
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=600&fit=crop"
                  alt="Travel Planning"
                  className="relative rounded-2xl shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Perfect Travel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI copilot combines intelligent planning, safety intelligence, and personalized
              recommendations to make travel planning effortless.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-primary-100 p-4 rounded-full mb-4">
                      <feature.icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to your perfect trip</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Tell Us Your Preferences',
                description:
                  'Share your destination, budget, travel dates, and preferences with our AI copilot.',
              },
              {
                step: '02',
                title: 'Get Personalized Recommendations',
                description:
                  'Receive AI-powered suggestions for flights, hotels, activities, and itineraries.',
              },
              {
                step: '03',
                title: 'Book & Manage Your Trip',
                description:
                  'Review safety insights, book your selections, and track everything in one dashboard.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-primary-100 mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
              Join thousands of travelers who trust TBO Travel Copilot for intelligent trip
              planning and safety-first travel experiences.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
