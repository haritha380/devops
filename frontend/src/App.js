import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Instruments from './pages/Instruments';
import InstrumentParts from './pages/InstrumentParts';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AdminInstruments from './pages/AdminInstruments';
import AdminInstrumentParts from './pages/AdminInstrumentParts';
import AdminProfile from './pages/AdminProfile';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/instruments" /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/instruments" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/instruments" /> : <Register />} />
      <Route path="/admin-login" element={user ? <Navigate to="/admin-instruments" /> : <AdminLogin />} />
      <Route
        path="/admin-instruments"
        element={
          <ProtectedRoute>
            <AdminInstruments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-instrument-parts"
        element={
          <ProtectedRoute>
            <AdminInstrumentParts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-profile"
        element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instruments"
        element={
          <ProtectedRoute>
            <Instruments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instrument-parts"
        element={
          <ProtectedRoute>
            <InstrumentParts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
