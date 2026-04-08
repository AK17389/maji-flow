// ============================================================
// Maji Flow - Smart Water Management System
// React frontend (mirrors Flask app routing logic)
//
// Flask Routes Equivalent:
//   GET  /           → LandingPage
//   GET  /login      → LoginPage
//   POST /login      → login() in store
//   GET  /register   → RegisterPage
//   POST /register   → register() in store
//   GET  /dashboard  → ResidentDashboard (protected)
//   GET  /utility    → UtilityDashboard (protected)
//   GET  /logout     → logout() in store
//   GET  /api/kiosks          → fetchKiosks()
//   GET  /api/network-stats   → fetchNetworkStats()
//   POST /api/topup           → topup()
// ============================================================

import { useState, useEffect } from 'react';
import { useAppStore } from './lib/store';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResidentDashboard from './pages/ResidentDashboard';
import UtilityDashboard from './pages/UtilityDashboard';

type Page = 'landing' | 'login' | 'register' | 'resident_dashboard' | 'utility_dashboard';

export default function App() {
  const { isAuthenticated, currentUser } = useAppStore();
  const [page, setPage] = useState<Page>('landing');

  // On load: if already authenticated, redirect to correct dashboard
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setPage(currentUser.role === 'utility' ? 'utility_dashboard' : 'resident_dashboard');
    }
  }, []);

  const navigate = (target: string) => {
    // Role-based redirect guard (like Flask's @login_required)
    if (target === 'resident_dashboard' || target === 'utility_dashboard') {
      if (!isAuthenticated) {
        setPage('login');
        return;
      }
    }
    setPage(target as Page);
  };

  // Route rendering (equivalent to Flask's url_for and render_template)
  return (
    <>
      {page === 'landing' && <LandingPage onNavigate={navigate} />}
      {page === 'login' && <LoginPage onNavigate={navigate} />}
      {page === 'register' && <RegisterPage onNavigate={navigate} />}
      {page === 'resident_dashboard' && <ResidentDashboard onNavigate={navigate} />}
      {page === 'utility_dashboard' && <UtilityDashboard onNavigate={navigate} />}
    </>
  );
}
