import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace" element={<ProjectWorkspace />} />
          <Route path="/workflow-analyzer" element={<WorkflowAnalyzer />} />
          <Route path="/uipath-to-blueprism" element={<UiPathToBluePrism />} />
          <Route path="/code-review" element={<CodeReviewTool />} />
          <Route path="/custom-rules" element={<CustomRules />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/subscription" element={<MySubscription />} />
          <Route path="/api-keys" element={<APIKeysManagement />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
