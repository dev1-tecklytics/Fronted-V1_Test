import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Grid,
  IconButton,
  AppBar,
  Toolbar,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { variableAnalysisAPI } from '../services/api';

const VariableAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workflow } = location.state || {};
  
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (workflow?.workflow_id) {
      fetchAnalysis();
    }
  }, [workflow]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const data = await variableAnalysisAPI.getAnalysis(workflow.workflow_id);
      setAnalysis(data.analysis || data);
    } catch (error) {
      if (error.status === 404) {
        setAnalysis(null);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError(null);
      const data = await variableAnalysisAPI.runAnalysis(workflow.workflow_id);
      setAnalysis(data.analysis || data);
    } catch (error) {
      setError(error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <TrendingUpIcon />;
    if (score >= 60) return <RemoveIcon />;
    return <TrendingDownIcon />;
  };

  const getSeverityChip = (severity) => {
    const colors = {
      High: { bgcolor: '#f44336', color: 'white' },
      Medium: { bgcolor: '#ff9800', color: 'white' },
      Low: { bgcolor: '#2196f3', color: 'white' }
    };
    return (
      <Chip 
        label={severity} 
        size="small" 
        sx={colors[severity]} 
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafbfc' }}>
        <AppBar position="static" sx={{ bgcolor: 'white', color: 'black', boxShadow: 1 }}>
          <Toolbar>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ color: '#757575' }}>
              Back
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  const IssueSection = ({ title, issues = [], icon, color }) => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box sx={{ color }}>{icon}</Box>
          <Typography variant="h6">{title}</Typography>
          <Chip label={issues.length} variant="outlined" size="small" />
        </Box>
        
        {issues.length === 0 ? (
          <Alert severity="success" icon={<CheckCircleIcon />}>
            No issues found in this category
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {issues.map((issue, index) => (
              <Card key={index} variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography 
                        component="code" 
                        sx={{ 
                          bgcolor: '#f5f5f5', 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          fontFamily: 'monospace'
                        }}
                      >
                        {issue.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ({issue.type})
                      </Typography>
                      {getSeverityChip(issue.severity)}
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {issue.issue}
                    </Typography>
                  </Box>
                </Box>
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Recommendation:</strong> {issue.recommendation}
                  </Typography>
                </Alert>
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafbfc' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'black', boxShadow: 1 }}>
        <Toolbar>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ color: '#757575', mr: 2 }}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <CodeIcon sx={{ color: '#9c27b0' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Variable & Argument Analysis
              </Typography>
              {workflow && (
                <Typography variant="body2" color="textSecondary">
                  {workflow.name}
                </Typography>
              )}
            </Box>
          </Box>
          {!analysis && (
            <Button
              variant="contained"
              onClick={handleAnalyze}
              disabled={analyzing}
              startIcon={analyzing ? null : <CodeIcon />}
              sx={{
                background: 'linear-gradient(90deg, #9c27b0 0%, #e91e63 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #7b1fa2 0%, #c2185b 100%)',
                }
              }}
            >
              {analyzing ? 'Analyzing...' : 'Run Analysis'}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {!analysis ? (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <CodeIcon sx={{ fontSize: 64, color: '#9e9e9e', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                No Analysis Yet
              </Typography>
              <Typography color="textSecondary" sx={{ mb: 4 }}>
                Click "Run Analysis" to analyze variables and arguments in this workflow
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleAnalyze}
                disabled={analyzing}
                startIcon={<CodeIcon />}
                sx={{
                  background: 'linear-gradient(90deg, #9c27b0 0%, #e91e63 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #7b1fa2 0%, #c2185b 100%)',
                  }
                }}
              >
                {analyzing ? 'Analyzing...' : 'Start Analysis'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Score Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { label: 'Overall Score', value: analysis.overall_score || 0 },
                { label: 'Usage Score', value: analysis.usage_score || 0 },
                { label: 'Type Safety Score', value: analysis.type_score || 0 },
                { label: 'Naming Score', value: analysis.naming_score || 0 }
              ].map((score, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        {score.label}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 700, 
                            color: getScoreColor(score.value) 
                          }}
                        >
                          {score.value}
                        </Typography>
                        <Box sx={{ color: getScoreColor(score.value) }}>
                          {getScoreIcon(score.value)}
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={score.value} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getScoreColor(score.value)
                          }
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Summary */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Summary
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Analyzed on {new Date(analysis.analyzed_at).toLocaleString()}
                </Typography>
                <Grid container spacing={4} sx={{ textAlign: 'center' }}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3' }}>
                      {analysis.total_variables || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Variables
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#9c27b0' }}>
                      {analysis.total_arguments || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Arguments
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                      {(analysis.unused_variables?.length || 0) + (analysis.unused_arguments?.length || 0)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Unused
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800' }}>
                      {analysis.naming_violations?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Naming Issues
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Issues */}
            <IssueSection
              title="Unused Variables"
              issues={analysis.unused_variables || []}
              icon={<CancelIcon />}
              color="#f44336"
            />

            <IssueSection
              title="Unused Arguments"
              issues={analysis.unused_arguments || []}
              icon={<CancelIcon />}
              color="#f44336"
            />

            <IssueSection
              title="Type Mismatches"
              issues={analysis.type_mismatches || []}
              icon={<WarningIcon />}
              color="#ff9800"
            />

            <IssueSection
              title="Scope Optimization"
              issues={analysis.scope_issues || []}
              icon={<WarningIcon />}
              color="#2196f3"
            />

            <IssueSection
              title="Naming Convention Violations"
              issues={analysis.naming_violations || []}
              icon={<WarningIcon />}
              color="#ff5722"
            />
          </>
        )}
      </Container>
    </Box>
  );
};

export default VariableAnalysis;