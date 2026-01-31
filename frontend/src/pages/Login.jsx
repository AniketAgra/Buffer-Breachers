import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Plane } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/endpoints';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CLIENT', // Default to CLIENT
    preferences: {
      budget: 'mid-range',
      travelStyle: 'solo',
      accommodation: 'hotel',
      transportation: 'economy',
    },
    agentDetails: {
      license: '',
      specialization: [],
    },
  });

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Reset role-specific fields when switching roles
    if (name === 'role') {
      if (value === 'CLIENT') {
        setFormData((prev) => ({
          ...prev,
          agentDetails: { license: '', specialization: [] },
        }));
      } else if (value === 'AGENT') {
        setFormData((prev) => ({
          ...prev,
          preferences: {
            budget: 'mid-range',
            travelStyle: 'solo',
            accommodation: 'hotel',
            transportation: 'economy',
          },
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });
        const userData = response.data.data.user;
        authLogin(userData, response.data.data.token);
        
        // Redirect based on role
        if (userData.role === 'AGENT') {
          navigate('/agent/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Register
        const response = await authAPI.register(formData);
        const userData = response.data.data.user;
        authLogin(userData, response.data.data.token);
        
        // Redirect based on role (new users default to CLIENT)
        if (userData.role === 'AGENT') {
          navigate('/agent/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // Handle validation errors with detailed field messages
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <Plane className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin
                ? 'Sign in to access your travel dashboard'
                : 'Join TBO Travel Copilot today'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  icon={User}
                  required
                />
                
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I am a... *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role: 'CLIENT' }))}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.role === 'CLIENT'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <User className={`h-6 w-6 mx-auto mb-2 ${
                        formData.role === 'CLIENT' ? 'text-primary-600' : 'text-gray-400'
                      }`} />
                      <div className={`font-semibold ${
                        formData.role === 'CLIENT' ? 'text-primary-600' : 'text-gray-700'
                      }`}>
                        Client
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Looking to travel</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role: 'AGENT' }))}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.role === 'AGENT'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Plane className={`h-6 w-6 mx-auto mb-2 ${
                        formData.role === 'AGENT' ? 'text-primary-600' : 'text-gray-400'
                      }`} />
                      <div className={`font-semibold ${
                        formData.role === 'AGENT' ? 'text-primary-600' : 'text-gray-700'
                      }`}>
                        Travel Agent
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Managing clients</div>
                    </button>
                  </div>
                </div>
              </>
            )}

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={Mail}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            {!isLogin && (
              <div className="space-y-3">
                {formData.role === 'CLIENT' ? (
                  <>
                    <label className="block text-sm font-medium text-gray-700">
                      Travel Preferences
                    </label>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Budget</label>
                      <select
                        name="preferences.budget"
                        value={formData.preferences.budget}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="budget">Budget-Friendly</option>
                        <option value="mid-range">Mid-Range</option>
                        <option value="luxury">Luxury</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Travel Style</label>
                      <select
                        name="preferences.travelStyle"
                        value={formData.preferences.travelStyle}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="solo">Solo</option>
                        <option value="couple">Couple</option>
                        <option value="family">Family</option>
                        <option value="friends">Friends</option>
                        <option value="business">Business</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-gray-700">
                      Agent Details (Optional)
                    </label>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">License Number</label>
                      <input
                        type="text"
                        name="agentDetails.license"
                        value={formData.agentDetails.license}
                        onChange={handleChange}
                        placeholder="e.g., TA-12345"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Specialization</label>
                      <input
                        type="text"
                        name="agentDetails.specialization"
                        placeholder="e.g., Luxury Travel, Adventure Tours"
                        onChange={(e) => {
                          const specs = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setFormData((prev) => ({
                            ...prev,
                            agentDetails: { ...prev.agentDetails, specialization: specs },
                          }));
                        }}
                        className="input-field"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple with commas</p>
                    </div>
                  </>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <Link to="/demo" className="text-sm text-gray-600 hover:text-primary-600">
                Try demo without account →
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
