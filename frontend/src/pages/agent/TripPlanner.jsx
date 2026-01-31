import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, DollarSign, MapPin, CheckCircle } from 'lucide-react';
import { agentAPI } from '../../services/endpoints';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';

const TripPlanner = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [planData, setPlanData] = useState({
    clientId: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: 1,
  });
  const [dealComparison, setDealComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Deal Review, 3: Confirm

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await agentAPI.getClients();
      setClients(response.data.clients);
    } catch (err) {
      console.error('Failed to load clients', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlanData((prev) => ({ ...prev, [name]: value }));
  };

  const handleComparDeals = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await agentAPI.compareDeals({
        ...planData,
        budget: parseFloat(planData.budget),
        travelers: parseInt(planData.travelers),
      });
      setDealComparison(response.data);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to compare deals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async () => {
    setCreating(true);

    try {
      const response = await agentAPI.createTrip({
        ...planData,
        budget: parseFloat(planData.budget),
        travelers: parseInt(planData.travelers),
      });

      if (response.data.success) {
        setStep(3);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create trip plan');
    } finally {
      setCreating(false);
    }
  };

  const selectedClient = clients.find((c) => c._id === planData.clientId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Planner</h1>
          <p className="text-gray-600">
            Create optimized trip plans for clients with intelligent deal comparison
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                1
              </div>
              <div className="ml-2 text-sm font-medium">Trip Details</div>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300">
              <div
                className={`h-full transition-all ${
                  step >= 2 ? 'bg-primary-600' : 'bg-gray-300'
                }`}
                style={{ width: step >= 2 ? '100%' : '0%' }}
              />
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                2
              </div>
              <div className="ml-2 text-sm font-medium">Review Deals</div>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300">
              <div
                className={`h-full transition-all ${
                  step >= 3 ? 'bg-primary-600' : 'bg-gray-300'
                }`}
                style={{ width: step >= 3 ? '100%' : '0%' }}
              />
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                3
              </div>
              <div className="ml-2 text-sm font-medium">Confirm</div>
            </div>
          </div>
        </div>

        {/* Step 1: Form */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Enter Trip Details
              </h2>
              <form onSubmit={handleComparDeals}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Client *
                    </label>
                    <select
                      name="clientId"
                      value={planData.clientId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">-- Select Client --</option>
                      {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.name} ({client.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedClient && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                      <div className="flex gap-4">
                        <span>
                          <strong>Budget:</strong> {selectedClient.preferences?.budget}
                        </span>
                        <span>
                          <strong>Style:</strong> {selectedClient.preferences?.travelStyle}
                        </span>
                      </div>
                    </div>
                  )}

                  <Input
                    label="Destination"
                    name="destination"
                    value={planData.destination}
                    onChange={handleChange}
                    placeholder="e.g., Dubai, Goa, Singapore"
                    icon={MapPin}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      type="date"
                      name="startDate"
                      value={planData.startDate}
                      onChange={handleChange}
                      icon={Calendar}
                      required
                    />
                    <Input
                      label="End Date"
                      type="date"
                      name="endDate"
                      value={planData.endDate}
                      onChange={handleChange}
                      icon={Calendar}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Budget (₹)"
                      type="number"
                      name="budget"
                      value={planData.budget}
                      onChange={handleChange}
                      placeholder="e.g., 50000"
                      icon={DollarSign}
                      required
                    />
                    <Input
                      label="Number of Travelers"
                      type="number"
                      name="travelers"
                      value={planData.travelers}
                      onChange={handleChange}
                      min="1"
                      icon={Users}
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Button type="submit" disabled={loading} fullWidth>
                    {loading ? 'Analyzing Deals...' : 'Compare Deals'}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Deal Review */}
        {step === 2 && dealComparison && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Best Deal</h2>
                <Badge variant="success">Recommended</Badge>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {dealComparison.bestDeal.packageName}
                </h3>
                <div className="text-2xl font-bold text-green-600 mt-2">
                  ₹{dealComparison.bestDeal.totalPrice.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">
                  ₹{dealComparison.bestDeal.pricePerPerson.toLocaleString()}/person
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{dealComparison.bestDeal.duration} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Safety Score</p>
                  <p className="font-semibold">
                    {dealComparison.bestDeal.safetyScore}/10
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="font-semibold">{dealComparison.bestDeal.rating}/5</p>
                </div>
              </div>

              {dealComparison.insights && dealComparison.insights.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Insights</h4>
                  <div className="space-y-2">
                    {dealComparison.insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded text-sm ${
                          insight.severity === 'good'
                            ? 'bg-green-50 text-green-700'
                            : insight.severity === 'warning'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {insight.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} fullWidth>
                Back
              </Button>
              <Button onClick={handleCreateTrip} disabled={creating} fullWidth>
                {creating ? 'Creating...' : 'Create Trip Plan'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Trip Plan Created Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                The trip plan has been saved and is ready to share with your client
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate('/agent/dashboard')}>
                  Back to Dashboard
                </Button>
                <Button onClick={() => navigate('/agent/clients')}>View Clients</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TripPlanner;
