import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, DollarSign, Calendar, Plus } from 'lucide-react';
import { agentAPI } from '../../services/endpoints';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const ClientManager = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClientEmail, setNewClientEmail] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await agentAPI.getClients();
      setClients(response.data.clients);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setAdding(true);

    try {
      const response = await agentAPI.assignClient(newClientEmail);
      if (response.data.success) {
        await fetchClients();
        setShowAddModal(false);
        setNewClientEmail('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add client');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Manager</h1>
            <p className="text-gray-600">View and manage your client portfolio</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} icon={Plus}>
            Add Client
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {clients.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Clients Yet</h3>
            <p className="text-gray-600 mb-4">
              Start by adding clients to your portfolio
            </p>
            <Button onClick={() => setShowAddModal(true)}>Add Your First Client</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={client._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {client.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Mail className="h-4 w-4 mr-1" />
                      {client.email}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Active Bookings
                      </span>
                      <span className="font-semibold text-gray-900">
                        {client.stats?.activeBookings || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Total Spent
                      </span>
                      <span className="font-semibold text-gray-900">
                        ₹{((client.stats?.totalSpent || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Bookings</span>
                      <span className="font-semibold text-gray-900">
                        {client.stats?.totalBookings || 0}
                      </span>
                    </div>
                  </div>

                  {client.preferences && (
                    <div className="border-t pt-3">
                      <p className="text-xs text-gray-600 mb-2">Preferences</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {client.preferences.budget}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                          {client.preferences.travelStyle}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <Button variant="outline" size="sm" fullWidth>
                      View Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Client Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Client"
        >
          <form onSubmit={handleAddClient}>
            <Input
              label="Client Email"
              type="email"
              value={newClientEmail}
              onChange={(e) => setNewClientEmail(e.target.value)}
              placeholder="client@example.com"
              required
            />
            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button type="submit" disabled={adding} fullWidth>
                {adding ? 'Adding...' : 'Add Client'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ClientManager;
