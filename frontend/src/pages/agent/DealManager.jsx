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
} from 'lucide-react';
import { agentAPI } from '../../services/endpoints';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';

const DealManager = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: 1,
  });
  const [dealResults, setDealResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await agentAPI.compareDeals({
        ...searchCriteria,
        budget: parseFloat(searchCriteria.budget),
        travelers: parseInt(searchCriteria.travelers),
      });
      setDealResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to compare deals');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'good':
        return 'success';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deal Manager</h1>
          <p className="text-gray-600">
            Compare deals, find the best value, and ensure no opportunities are missed
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Deals</h2>
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <Input
                label="Destination"
                name="destination"
                value={searchCriteria.destination}
                onChange={handleChange}
                placeholder="e.g., Dubai, Goa"
                required
              />
              <Input
                label="Start Date"
                type="date"
                name="startDate"
                value={searchCriteria.startDate}
                onChange={handleChange}
                required
              />
              <Input
                label="End Date"
                type="date"
                name="endDate"
                value={searchCriteria.endDate}
                onChange={handleChange}
                required
              />
              <Input
                label="Budget (₹)"
                type="number"
                name="budget"
                value={searchCriteria.budget}
                onChange={handleChange}
                placeholder="e.g., 50000"
                required
              />
              <Input
                label="Travelers"
                type="number"
                name="travelers"
                value={searchCriteria.travelers}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? 'Searching...' : 'Compare Deals'}
            </Button>
          </form>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {dealResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Insights */}
            {dealResults.insights && dealResults.insights.length > 0 && (
              <Card>
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
                </div>
                <div className="space-y-2">
                  {dealResults.insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        insight.severity === 'good'
                          ? 'bg-green-50 border border-green-200'
                          : insight.severity === 'warning'
                          ? 'bg-yellow-50 border border-yellow-200'
                          : 'bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <div className="flex items-start">
                        <Badge variant={getSeverityColor(insight.severity)} className="mr-2">
                          {insight.type}
                        </Badge>
                        <p className="text-sm text-gray-700">{insight.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Best Deal */}
            {dealResults.bestDeal && (
              <Card className="border-2 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Badge variant="success" className="mr-2">
                      Best Deal
                    </Badge>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {dealResults.bestDeal.packageName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{dealResults.bestDeal.totalPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      ₹{dealResults.bestDeal.pricePerPerson.toLocaleString()}/person
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">
                      {dealResults.bestDeal.duration} days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Accommodation</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {dealResults.bestDeal.accommodationType}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-blue-600 mr-1" />
                    <div>
                      <p className="text-sm text-gray-600">Safety</p>
                      <p className="font-semibold text-gray-900">
                        {dealResults.bestDeal.safetyScore}/10
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-600 mr-1" />
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="font-semibold text-gray-900">
                        {dealResults.bestDeal.rating}/5
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Score Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Price</p>
                      <p className="font-semibold">{dealResults.bestDeal.scores.price.toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Safety</p>
                      <p className="font-semibold">{dealResults.bestDeal.scores.safety.toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Rating</p>
                      <p className="font-semibold">{dealResults.bestDeal.scores.rating.toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Value</p>
                      <p className="font-semibold">{dealResults.bestDeal.scores.value.toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Overall</p>
                      <p className="font-semibold text-green-600">
                        {dealResults.bestDeal.scores.composite.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Alternatives */}
            {dealResults.alternatives && dealResults.alternatives.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Alternative Options ({dealResults.alternatives.length})
                </h3>
                <div className="space-y-4">
                  {dealResults.alternatives.map((deal, index) => (
                    <Card key={index}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {deal.packageName}
                          </h4>
                          {deal.comparison && (
                            <div className="flex items-center text-sm text-gray-600">
                              {deal.comparison.priceDifference < 0 ? (
                                <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                              ) : (
                                <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                              )}
                              <span>{deal.comparison.message}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            ₹{deal.totalPrice.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {deal.comparison?.priceDifferencePercent}% vs best
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 text-blue-600 mr-1" />
                          <span>{deal.safetyScore}/10</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-600 mr-1" />
                          <span>{deal.rating}/5</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                          <span>Score: {deal.scores.composite.toFixed(0)}</span>
                        </div>
                        <div className="text-gray-600">{deal.accommodationType}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Analysis Complete</h3>
                  <p className="text-gray-600">
                    Analyzed {dealResults.totalDealsAnalyzed} deals for your criteria
                  </p>
                </div>
                <Button variant="primary">Select & Continue</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DealManager;
