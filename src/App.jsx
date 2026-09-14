import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout, Global & SEO Components
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import DrawerMenu from './components/DrawerMenu';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ToastContainer';
import SEO from './components/SEO';
import CleanlinessAIBot from './components/CleanlinessAIBot';

// Dedicated Dashboards & Pages
import CitizenDashboard from './pages/CitizenDashboard';
import CrewTasks from './pages/CrewTasks';
import SupervisorDashboard from './pages/SupervisorDashboard';
import HomeOverview from './pages/HomeOverview';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportIssue from './pages/ReportIssue';
import MyComplaints from './pages/MyComplaints';
import ComplaintDetail from './pages/ComplaintDetail';
import BulkPickup from './pages/BulkPickup';
import BulkPickupManage from './pages/BulkPickupManage';
import ReportsAnalytics from './pages/ReportsAnalytics';
import WorkforceEquipment from './pages/WorkforceEquipment';
import FleetVehicles from './pages/FleetVehicles';
import CollectionSchedule from './pages/CollectionSchedule';
import PublicFeed from './pages/PublicFeed';

// Component to dynamically direct user to their role dashboard
function RoleDashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'crew') return <Navigate to="/crew/dashboard" replace />;
  return <Navigate to="/citizen/dashboard" replace />;
}

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Dynamic SEO Meta Controller */}
      <SEO />

      {/* Top Navigation Header */}
      <Navbar onOpenDrawer={() => setIsDrawerOpen(true)} />

      {/* Main Viewport Content */}
      <main className="app-main">
        <Routes>
          {/* Public & Login Portals */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={<PublicFeed />} />
          <Route path="/complaint/:id" element={<ComplaintDetail />} />
          
          {/* Root Redirect to Role-specific Dashboard */}
          <Route path="/" element={<RoleDashboardRedirect />} />
          <Route path="/home" element={<HomeOverview />} />

          {/* 1. Dedicated Citizen Dashboard & Citizen Routes */}
          <Route 
            path="/citizen/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                <CitizenDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/report" 
            element={
              <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                <ReportIssue />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-complaints" 
            element={
              <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                <MyComplaints />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bulk-pickup" 
            element={
              <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                <BulkPickup />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/schedule" 
            element={
              <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                <CollectionSchedule />
              </ProtectedRoute>
            } 
          />

          {/* 2. Dedicated Crew / Field Driver Dashboard (Accessible to Crew & Admin) */}
          <Route 
            path="/crew/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['crew', 'admin']}>
                <CrewTasks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/crew" 
            element={
              <ProtectedRoute allowedRoles={['crew', 'admin']}>
                <CrewTasks />
              </ProtectedRoute>
            } 
          />

          {/* 3. Dedicated Admin / Municipal Command Dashboard */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SupervisorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SupervisorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ReportsAnalytics />
              </ProtectedRoute>
            } 
          />

          {/* Shared Crew & Admin Operations Routes */}
          <Route 
            path="/bulk-pickup-manage" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'crew']}>
                <BulkPickupManage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/workforce" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'crew']}>
                <WorkforceEquipment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vehicles" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'crew']}>
                <FleetVehicles />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Interactive AI Cleanliness EcoBot */}
      <CleanlinessAIBot />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Slide-out Menu Drawer */}
      <DrawerMenu 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      {/* Notifications Container */}
      <ToastContainer />
    </div>
  );
}
