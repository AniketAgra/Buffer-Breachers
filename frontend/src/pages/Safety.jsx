import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  Users,
  Heart,
  Cloud,
  Home,
  TrendingDown,
  CheckCircle,
  XCircle,
  Search,
} from 'lucide-react';
import { safetyAPI } from '../services/endpoints';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

const Safety = () => {
  const [selectedDest, setSelectedDest] = useState('Dubai');
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
    'Jaipur',
  ];

  const safetyCategories = [
    { key: 'crime', label: 'Crime Rate', icon: Shield, color: 'text-blue-600' },
    { key: 'health', label: 'Health & Sanitation', icon: Heart, color: 'text-green-600' },
    { key: 'womenSafety', label: 'Women Safety', icon: Users, color: 'text-purple-600' },
    { key: 'soloTraveler', label: 'Solo Traveler', icon: Users, color: 'text-orange-600' },
    {
      key: 'naturalDisasters',
      label: 'Natural Disasters',
      icon: Cloud,
      color: 'text-yellow-600',
    },
    { key: 'terrorism', label: 'Political Stability', icon: Home, color: 'text-red-600' },
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
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    if (score >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Moderate';
    return 'Caution';
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-yellow-300" />
              <span className="text-yellow-300 font-semibold text-lg">Safety Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Travel with
              <span className="block text-yellow-300">Confidence</span>
            </h1>
            <p className="text-xl text-gray-100">
              Comprehensive safety scoring across 6 categories with demographic-specific insights
              for women, solo travelers, and families.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Destination Selector */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="text-gray-700 font-medium flex items-center gap-2">
              <Search className="h-5 w-5" />
              Select Destination:
            </span>
            {destinations.map((dest) => (
              <Button
                key={dest}
                variant={selectedDest === dest ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedDest(dest)}
              >
                {dest}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : safetyData ? (
        <>
          {/* Overall Safety Score */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedDest} Safety Score
                  </h2>
                  <div className="flex items-center justify-center gap-8 mb-6">
                    <div>
                      <div className="text-6xl font-bold text-primary-600 mb-2">
                        {safetyData.overallScore?.toFixed(1) || '7.0'}
                      </div>
                      <div className="text-gray-600">Out of 10</div>
                    </div>
                    <div className="text-left">
                      <Badge
                        variant={
                          (safetyData.overallScore || 7) >= 7
                            ? 'success'
                            : (safetyData.overallScore || 7) >= 5
                            ? 'warning'
                            : 'danger'
                        }
                        className="text-lg px-4 py-2"
                      >
                        {getScoreLabel(safetyData.overallScore || 7)}
                      </Badge>
                      <p className="text-gray-600 mt-2">Safety Rating</p>
                    </div>
                  </div>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Based on comprehensive analysis across crime, health, natural disasters,
                    political stability, and demographic-specific safety factors.
                  </p>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Category Breakdown */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Safety Breakdown</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Detailed analysis across multiple safety categories
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safetyCategories.map((category, index) => (
                  <motion.div
                    key={category.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <category.icon className={`h-6 w-6 ${category.color}`} />
                          <h3 className="font-semibold text-gray-900">{category.label}</h3>
                        </div>
                        <div className="text-2xl font-bold text-primary-600">
                          {safetyData.categoryScores?.[category.key]?.toFixed(1) || '7.0'}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(safetyData.categoryScores?.[category.key] || 7) * 10}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full ${getScoreColor(
                            safetyData.categoryScores?.[category.key] || 7
                          )}`}
                        />
                      </div>

                      <div className="mt-2 text-sm text-gray-600">
                        {getScoreLabel(safetyData.categoryScores?.[category.key] || 7)}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Safety Warnings */}
          {safetyData.warnings && safetyData.warnings.length > 0 && (
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    <h2 className="text-3xl font-bold text-gray-900">Safety Advisories</h2>
                  </div>

                  <div className="space-y-4">
                    {safetyData.warnings.map((warning, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="border-l-4 border-yellow-500">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-gray-800 font-medium mb-1">{warning.title}</p>
                              <p className="text-gray-600 text-sm">{warning.description}</p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {/* Recommendations */}
          {safetyData.recommendations && safetyData.recommendations.length > 0 && (
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <h2 className="text-3xl font-bold text-gray-900">Safety Tips</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {safetyData.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{rec}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>
          )}
        </>
      ) : null}

      {/* How Safety Scoring Works */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-8 text-center">How We Calculate Safety Scores</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-yellow-300">Data Sources</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Government travel advisories</li>
                  <li>• Local crime statistics</li>
                  <li>• Health & sanitation reports</li>
                  <li>• Traveler reviews & feedback</li>
                  <li>• Real-time alert systems</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-yellow-300">Scoring Algorithm</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 6 category weighted scoring</li>
                  <li>• Demographic-specific analysis</li>
                  <li>• Time-based relevance</li>
                  <li>• Area-wise granularity</li>
                  <li>• 0-10 scale with color coding</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Safety;
