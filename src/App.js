import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FolderProvider } from './context/FolderContext'; // Add FolderProvider
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <FolderProvider> {/* Wrap the app in FolderProvider */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth isSignup={true} />} />

            {/* Private Route for Dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </FolderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
