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
        // Register - prepare data based on role
        const registrationData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        // Add optional phone
        if (formData.phone) {
          registrationData.phone = formData.phone;
        }

        // Add role-specific data
        if (formData.role === 'CLIENT') {
          registrationData.preferences = formData.preferences;
        } else if (formData.role === 'AGENT') {
          registrationData.agentDetails = formData.agentDetails;
        }

        console.log('Sending registration data:', { ...registrationData, password: '[REDACTED]' });

        const response = await authAPI.register(registrationData);
        const userData = response.data.data.user;
        
        console.log('Registration response - user data:', userData);
        
        authLogin(userData, response.data.data.token);
        
        // Redirect based on role
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">
                    {isLogin ? 'Welcome Back' : 'Join Us'}
                  </span>
                </h1>
                <p className="text-slate-300 text-lg">
                  {isLogin
                    ? 'Sign in to access your travel dashboard'
                    : 'Create your account and start your journey'}
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John"
                        required
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      />
                    </div>
                    
                    {/* Role Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        I AM A...
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, role: 'CLIENT' }))}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            formData.role === 'CLIENT'
                              ? 'border-cyan-400 bg-cyan-400/10'
                              : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                          }`}
                        >
                          <User className={`h-6 w-6 mx-auto mb-2 ${
                            formData.role === 'CLIENT' ? 'text-cyan-400' : 'text-slate-400'
                          }`} />
                          <div className={`font-semibold ${
                            formData.role === 'CLIENT' ? 'text-cyan-400' : 'text-slate-300'
                          }`}>
                            Client
                          </div>
                          <div className="text-xs text-slate-400 mt-1">Looking to travel</div>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, role: 'AGENT' }))}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            formData.role === 'AGENT'
                              ? 'border-cyan-400 bg-cyan-400/10'
                              : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                          }`}
                        >
                          <Plane className={`h-6 w-6 mx-auto mb-2 ${
                            formData.role === 'AGENT' ? 'text-cyan-400' : 'text-slate-400'
                          }`} />
                          <div className={`font-semibold ${
                            formData.role === 'AGENT' ? 'text-cyan-400' : 'text-slate-300'
                          }`}>
                            Travel Agent
                          </div>
                          <div className="text-xs text-slate-400 mt-1">Managing clients</div>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {!isLogin && 'LAST NAME'}
                    {!isLogin && (
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all mt-2"
                      />
                    )}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    WORK EMAIL
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      COMPANY NAME
                    </label>
                    <input
                      type="text"
                      name="company"
                      placeholder="e.g. Global Travel Group"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    />
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      AGENT COUNT
                    </label>
                    <select
                      name="agentCount"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    >
                      <option value="">Select range</option>
                      <option value="1-10">1-10 agents</option>
                      <option value="11-50">11-50 agents</option>
                      <option value="51-200">51-200 agents</option>
                      <option value="200+">200+ agents</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-4">
                    {formData.role === 'CLIENT' ? (
                      <>
                        <label className="block text-sm font-medium text-slate-300">
                          Travel Preferences
                        </label>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Budget</label>
                          <select
                            name="preferences.budget"
                            value={formData.preferences.budget}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                          >
                            <option value="budget">Budget-Friendly</option>
                            <option value="mid-range">Mid-Range</option>
                            <option value="luxury">Luxury</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Travel Style</label>
                          <select
                            name="preferences.travelStyle"
                            value={formData.preferences.travelStyle}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
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
                        <label className="block text-sm font-medium text-slate-300">
                          Agent Details (Optional)
                        </label>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">License Number</label>
                          <input
                            type="text"
                            name="agentDetails.license"
                            value={formData.agentDetails.license}
                            onChange={handleChange}
                            placeholder="e.g., TA-12345"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Specialization</label>
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
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                          />
                          <p className="text-xs text-slate-500 mt-1">Separate multiple with commas</p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-slate-900 font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    isLogin ? 'Sign In to Dashboard' : 'Schedule My Live Demo'
                  )}
                </button>

                {!isLogin && (
                  <p className="text-xs text-slate-400 text-center mt-4">
                    By creating your account, you agree to our{' '}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300">Terms and Privacy Policy</a>
                  </p>
                )}
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>

              {isLogin && (
                <div className="mt-4 text-center">
                  <Link to="/demo" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                    Try demo without account →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Side - Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block space-y-6"
          >
            {/* Security Assurance */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Security Assurance</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Military-grade encryption and SOC2 Type II compliance ensure your agency data remains impenetrable.
                  </p>
                  <div className="flex items-center space-x-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      SOC2 Certified
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      ISO 27001
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      AES-256
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Privacy */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Data Privacy Commitment</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Your business data belongs to you. We believe in GDPR and CCPA regulations with total data control.
                  </p>
                </div>
              </div>
            </div>

            {/* Global Trust */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Plane className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Global Scale Established</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Trusted by 500+ agencies worldwide
                  </p>
                  <div className="flex items-center space-x-2 mt-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-slate-800"></div>
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-slate-800"></div>
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border-2 border-slate-800"></div>
                      <div className="w-8 h-8 bg-slate-700 rounded-full border-2 border-slate-800 flex items-center justify-center">
                        <span className="text-xs text-slate-300">+500</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
