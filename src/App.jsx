import React, { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import LandingPage from './components/landing/LandingPage'
import ReaderDashboard from './components/reader/ReaderDashboard'
import AlertContainer from './components/common/AlertContainer'
import AppLoader from './components/common/AppLoader'
import { Login, Register } from './components/auth/AuthPages'
import { VerifyOtp, ForgotPassword, ResetPassword } from './components/auth/AuthFlow'
import { AuthGuard } from './components/auth/AuthGuard'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { Overview } from './components/dashboard/Overview'
import { Library } from './components/dashboard/Library'
import { Settings } from './components/dashboard/Settings'

// Admin Citadel Imports
import { AdminLogin } from './components/admin/AdminLogin'
import { AdminGuard } from './components/admin/AdminGuard'
import { AdminOverview } from './components/admin/AdminOverview'
import { AdminFiles } from './components/admin/AdminFiles'
import { AdminSettings } from './components/admin/AdminSettings'

import { supabase } from '../supabase/supabaseClient'
import { setAuth, setInitializing, logout, selectAuth } from './store/slices/authSlice'
import { selectAdmin, logoutAdmin } from './store/slices/adminSlice'
import { startLoading, stopLoading } from './store/slices/loaderSlice'

function App() {
  const dispatch = useDispatch();
  const { isInitializing } = useSelector(selectAuth);
  const { isAdminAuthenticated } = useSelector(selectAdmin);

  useEffect(() => {
    // 1. Initial Session Handshake
    const initAuth = async () => {
      try {
        // Priority Protocol: If Admin is active, purge student traces
        if (localStorage.getItem('vocal_admin_session')) {
            await supabase.auth.signOut();
            dispatch(logout());
            dispatch(setInitializing(false));
            return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          dispatch(setAuth({ user: session.user, session }));
        } else {
          dispatch(setInitializing(false));
        }
      } catch (err) {
        console.error("Auth Handshake Error:", err);
        dispatch(setInitializing(false));
      }
    };

    initAuth();

    // 2. Real-time Authentication Sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Mutual Exclusion: If moving to student session, clear Admin
        if (localStorage.getItem('vocal_admin_session')) {
            dispatch(logoutAdmin());
        }
        dispatch(setAuth({ user: session.user, session }));
      } else {
        dispatch(logout());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  // 'Cloaking' Strategy: Only show AppLoader during first session check
  if (isInitializing) {
    return (
      <>
        <AlertContainer />
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'var(--bs-light)', zIndex: 9999 }}>
          <AppLoader />
        </div>
      </>
    );
  }

  return (
    <HashRouter>
      <AlertContainer />
      <AppLoader />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Universal Citadel Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Citadel Dashboard */}
        <Route path="/admin/dashboard" element={
          <AdminGuard>
            <DashboardLayout />
          </AdminGuard>
        }>
            <Route index element={<AdminOverview />} />
            <Route path="files" element={<AdminFiles />} />
            <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Protected Student Dashboard Core */}
        <Route path="/dashboard" element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }>
          <Route index element={<Overview />} />
          <Route path="library" element={<Library />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Individual Protected Reader Route */}
        <Route path="/reader" element={
          <AuthGuard>
            <ReaderDashboard />
          </AuthGuard>
        } />

        {/* Global Security Flows */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </HashRouter>
  )
}


export default App
