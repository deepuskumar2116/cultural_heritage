import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TouristHome from './pages/TouristHome';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/tourist/home" 
          element={
            <ProtectedRoute requiredRole="tourist">
              <TouristHome />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
