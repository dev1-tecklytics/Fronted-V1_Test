import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProjectWorkspace from './components/ProjectWorkspace';
import WorkflowAnalyzer from './components/WorkflowAnalyzer';
import UiPathToBluePrism from './components/UiPathToBluePrism';
import CodeReviewTool from './components/CodeReviewTool';
import CustomRules from './components/CustomRules';
import PricingPage from './components/PricingPage';
import MySubscription from './components/MySubscription';
import APIKeysManagement from './components/APIKeysManagement';
import WorkflowDetail from './components/WorkflowDetail';
import VariableAnalysis from './components/VariableAnalysis';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#5e6ff2',
    },
    secondary: {
      main: '#9d4edd',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {

  const isAuthenticated = !!localStorage.getItem('authToken');

  if (!isAuthenticated) {
    console.warn('🔒 Route protected. Redirecting to login.');
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/workspace" element={<ProtectedRoute><ProjectWorkspace /></ProtectedRoute>} />
          <Route path="/workflow-analyzer" element={<ProtectedRoute><WorkflowAnalyzer /></ProtectedRoute>} />
          <Route path="/uipath-to-blueprism" element={<ProtectedRoute><UiPathToBluePrism /></ProtectedRoute>} />
          <Route path="/code-review" element={<ProtectedRoute><CodeReviewTool /></ProtectedRoute>} />
          <Route path="/custom-rules" element={<ProtectedRoute><CustomRules /></ProtectedRoute>} />
          <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><MySubscription /></ProtectedRoute>} />
          <Route path="/api-keys" element={<ProtectedRoute><APIKeysManagement /></ProtectedRoute>} />
          <Route path="/workflow-detail" element={<ProtectedRoute><WorkflowDetail /></ProtectedRoute>} />
          <Route path="/variable-analysis" element={<ProtectedRoute><VariableAnalysis /></ProtectedRoute>} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
