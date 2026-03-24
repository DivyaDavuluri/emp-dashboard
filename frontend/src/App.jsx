
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminPanel from './pages/AdminPanel';
import LeaveTracker from './pages/LeaveTracker';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import EmployeeDetails from '@/features/manager/pages/EmployeeDetails';
import Unauthorized from '@/pages/Unauthorized';
import LeaveApplication from '@/features/employee/pages/LeaveApplication';
import LeaveApproval from '@/features/manager/pages/LeaveApproval';
import UserManagement from '@/features/admin/pages/UserManagement';
import SystemConfig from '@/features/admin/pages/SystemConfig';
import TeamDirectory from '@/features/manager/pages/TeamDirectory';
import ProductivityReports from '@/features/manager/pages/ProductivityReports';
import SessionTracking from '@/features/employee/pages/SessionTracking';
import BreakTracking from '@/features/employee/pages/BreakTracking';
import MeetingLogging from '@/features/employee/pages/MeetingLogging';
import PersonalReports from '@/features/employee/pages/PersonalReports';

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <RoleBasedRedirect />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                <Layout>
                  <EmployeeDashboard />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/manager" element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <Layout>
                  <ManagerDashboard />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AdminPanel />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/leave" element={
              <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                <Layout>
                  <LeaveTracker />
                </Layout>
              </ProtectedRoute>
            } />

            
            {/* Default catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </ErrorBoundary>
    </Router>
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Wrap protected routes in a layout with Sidebar and Header */}
            <Route element={<ProtectedRoute allowedRoles={['Employee', 'Manager', 'Admin']} />}>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="unauthorized" element={<Unauthorized />} />
                <Route path="employee/:id" element={<EmployeeDetails />} />

                {/* Employee only routes */}
                <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
                  <Route path="session" element={<SessionTracking />} />
                  <Route path="breaks" element={<BreakTracking />} />
                  <Route path="meetings" element={<MeetingLogging />} />
                  <Route path="leave/apply" element={<LeaveApplication />} />
                  <Route path="reports/personal" element={<PersonalReports />} />
                </Route>

                {/* Manager only routes */}
                <Route element={<ProtectedRoute allowedRoles={['Manager']} />}>
                  <Route path="team" element={<TeamDirectory />} />
                  <Route path="leave/approve" element={<LeaveApproval />} />
                  <Route path="reports/team" element={<ProductivityReports />} />
                </Route>

                {/* Admin only routes */}
                <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                  <Route path="admin/users" element={<UserManagement />} />
                  <Route path="admin/config" element={<SystemConfig />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

const AppLayout = () => {
  return (
    <div className="layout-wrapper">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-body">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;
