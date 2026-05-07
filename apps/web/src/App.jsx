import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Layout Components
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

// Pages
import VegaMailerLanding from '@/pages/VegaMailerLanding.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import PrivacyPage from '@/pages/PrivacyPage.jsx';
import TermsPage from '@/pages/TermsPage.jsx';

// Dashboard Pages (Kept for existing routes)
import DashboardLayout from './components/DashboardLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DomainsPage from './pages/DomainsPage.jsx';
import SubscribersPage from './pages/SubscribersPage.jsx';
import CampaignsPage from './pages/CampaignsPage.jsx';
import TemplatesPage from './pages/TemplatesPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Landing Routes */}
              <Route path="/" element={<VegaMailerLanding />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              
              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardPage />} />
                <Route path="domains" element={<DomainsPage />} />
                <Route path="subscribers" element={<SubscribersPage />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" theme="dark" />
      </Router>
    </AuthProvider>
  );
}

export default App;