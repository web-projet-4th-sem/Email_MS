import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import LecturerDashboard from './components/Dashboard/LecturerDashboard';
import LoadingSpinner from './components/UI/LoadingSpinner';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  const getDashboardComponent = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'lecturer':
        return <LecturerDashboard />;
      default:
        return null;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard/*" 
            element={user ? getDashboardComponent() : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;