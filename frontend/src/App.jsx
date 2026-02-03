import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import Safety from './pages/Safety';
import Dashboard from './pages/Dashboard';
import Demo from './pages/Demo';
import Login from './pages/Login';

// Agent pages (lazy loaded)
const AgentDashboard = React.lazy(() => import('./pages/agent/AgentDashboard'));
const DealManager = React.lazy(() => import('./pages/agent/DealManager'));
const ClientManager = React.lazy(() => import('./pages/agent/ClientManager'));
const TripPlanner = React.lazy(() => import('./pages/agent/TripPlanner'));

// Protected Route Component
const ProtectedRoute = ({ children, requireAgent = false, requireClient = false }) => {
  const { isAuthenticated, loading, isAgent, isClient } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAgent && !isAgent()) {
    return <Navigate to="/dashboard" />;
  }

  if (requireClient && !isClient()) {
    return <Navigate to="/agent/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <React.Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-blue-500"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/login" element={<Login />} />
              
              {/* Client Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireClient>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/demo"
                element={
                  <ProtectedRoute requireClient>
                    <Demo />
                  </ProtectedRoute>
                }
              />
              
              {/* Agent Routes */}
              <Route
                path="/agent/dashboard"
                element={
                  <ProtectedRoute requireAgent>
                    <AgentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agent/deals"
                element={
                  <ProtectedRoute requireAgent>
                    <DealManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agent/clients"
                element={
                  <ProtectedRoute requireAgent>
                    <ClientManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agent/trips/plan"
                element={
                  <ProtectedRoute requireAgent>
                    <TripPlanner />
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </React.Suspense>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
