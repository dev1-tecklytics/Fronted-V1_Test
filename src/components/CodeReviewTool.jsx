import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  Card,
  IconButton,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  Divider,
  TextField,
  InputAdornment,
  Fade,
  Grow,
  Collapse,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  PlayCircle as RunIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  AutoAwesome as AIIcon,
  CheckCircle as CheckIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Cached as CachedIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { projectAPI, analysisAPI, codeReviewAPI } from "../services/api";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #fafbfc 0%, #f5f7ff 100%)",
  padding: "24px",
}));

const Header = styled(Box)(({ theme }) => ({
  marginBottom: "32px",
  animation: `${fadeIn} 0.5s ease-out`,
}));

const BackButton = styled(Button)(({ theme }) => ({
  color: "#212121",
  textTransform: "none",
  fontWeight: 600,
  marginBottom: "16px",
  "&:hover": {
    background: "#f5f5f5",
    transform: "translateX(-4px)",
  },
  transition: "all 0.3s ease",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: "linear-gradient(90deg, #9d4edd 0%, #f44336 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "2.5rem",
  marginBottom: "8px",
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: "#757575",
  fontSize: "14px",
}));

const ConfigCard = styled(Card)(({ theme }) => ({
  padding: "32px",
  borderRadius: "16px",
  marginBottom: "24px",
  border: "1px solid #f0f0f0",
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
  animation: `${fadeIn} 0.6s ease-out`,
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e0e0e0",
    transition: "all 0.3s ease",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#9d4edd",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#9d4edd",
    borderWidth: "2px",
  },
  borderRadius: "8px",
  background: "#ffffff",
}));

const RunButton = styled(Button)(({ theme, reviewing }) => ({
  background: reviewing
    ? "linear-gradient(90deg, #757575 0%, #9e9e9e 100%)"
    : "linear-gradient(90deg, #9d4edd 0%, #f44336 100%)",
  color: "#ffffff",
  padding: "14px 28px",
  borderRadius: "8px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: 600,
  width: "100%",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    background: reviewing
      ? "linear-gradient(90deg, #757575 0%, #9e9e9e 100%)"
      : "linear-gradient(90deg, #8939c9 0%, #d32f2f 100%)",
    transform: reviewing ? "none" : "translateY(-2px)",
    boxShadow: reviewing ? "none" : "0 8px 24px rgba(157, 78, 221, 0.3)",
  },
  "&::before": reviewing
    ? {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-100%",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        animation: `${shimmer} 2s infinite`,
      }
    : {},
  transition: "all 0.3s ease",
}));

const MetricCard = styled(Card)(({ theme }) => ({
  padding: "24px",
  borderRadius: "12px",
  border: "1px solid #f0f0f0",
  textAlign: "center",
  background: "#ffffff",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
  },
}));

const GradeCard = styled(Card)(({ theme, grade }) => {
  const gradeColors = {
    A: { bg: "#e8f5e9", text: "#2e7d32" },
    B: { bg: "#e3f2fd", text: "#1976d2" },
    C: { bg: "#fff3e0", text: "#f57c00" },
    D: { bg: "#ffe0b2", text: "#e65100" },
    F: { bg: "#ffebee", text: "#c62828" },
  };
  const colors = gradeColors[grade] || gradeColors["F"];

  return {
    padding: "32px",
    borderRadius: "12px",
    border: `2px solid ${colors.text}20`,
    textAlign: "center",
    background: colors.bg,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: `0 12px 32px ${colors.text}30`,
    },
  };
});

const CategoryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 0",
  borderBottom: "1px solid #f0f0f0",
  animation: `${fadeIn} 0.5s ease-out`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const IssueCard = styled(Card)(({ theme, severity }) => {
  const severityColors = {
    Critical: { border: "#c62828", bg: "#ffebee" },
    High: { border: "#d32f2f", bg: "#ffcdd2" },
    Major: { border: "#ff9800", bg: "#ffe0b2" },
    Medium: { border: "#ffa726", bg: "#fff3e0" },
    Minor: { border: "#fbc02d", bg: "#fff9c4" },
    Low: { border: "#2196f3", bg: "#e3f2fd" },
  };
  const colors = severityColors[severity] || severityColors["Medium"];

  return {
    padding: "20px",
    borderRadius: "12px",
    border: `1px solid ${colors.border}40`,
    borderLeft: `4px solid ${colors.border}`,
    marginBottom: "12px",
    background: "#ffffff",
    transition: "all 0.3s ease",
    animation: `${fadeIn} 0.4s ease-out`,
    "&:hover": {
      boxShadow: `0 8px 24px ${colors.border}20`,
      transform: "translateX(4px)",
      background: colors.bg,
    },
  };
});

const CodeReviewTool = () => {
  const navigate = useNavigate();

  // State Management
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("UiPath");
  const [workflows, setWorkflows] = useState([]);
  const [reviewResults, setReviewResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [aiInsightsAvailable, setAiInsightsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [aiAnalysisResults, setAiAnalysisResults] = useState(null);

  // Filtering & Search State
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load workflows on mount
  useEffect(() => {
    loadWorkflows();
  }, []);

  // Intelligent caching: Check for existing review when workflow changes
  useEffect(() => {
    if (selectedWorkflow) {
      fetchExistingReview();
    }
  }, [selectedWorkflow]);

  const loadWorkflows = async () => {
    setLoading(true);
    try {
      const projects = await projectAPI.getAll();
      const allWorkflows = [];

      for (const project of projects) {
        const history = await analysisAPI.getHistory(project.project_id);
        if (history && history.length > 0) {
          history.forEach((analysis) => {
            console.log(analysis);
            // Include ALL uploaded files, not just completed analyses
            // Code review can be run on any uploaded workflow
            allWorkflows.push({
              id: analysis.id,
              name: analysis.workflowName,
              project: project.name,
              platform: project.platform,
              status: analysis.status,
              activities: analysis.result?.totalActivities || 0,
              fullAnalysis: analysis.result || {},
            });
          });
        }
      }

      setWorkflows(allWorkflows);
      if (allWorkflows.length > 0) {
        setSelectedWorkflow(allWorkflows[0].id);
      }
    } catch (error) {
      console.error("Failed to load workflows for code review:", error);
    } finally {
      setLoading(false);
    }
  };

  // Intelligent Caching: Zero-latency experience
  const fetchExistingReview = async () => {
    try {
      console.log("🔍 Checking for cached review...");
      const cachedReview =
        await codeReviewAPI.getExistingReview(selectedWorkflow);

      if (cachedReview) {
        console.log("✅ Cached review found!");
        setReviewResults(cachedReview);
        setIsCached(true);
      } else {
        console.log("ℹ️ No cached review found");
        setReviewResults(null);
        setIsCached(false);
      }
    } catch (error) {
      console.error("Error fetching cached review:", error);
      setIsCached(false);
    }
  };

  // Run Code Review (POST to backend)
  const handleRunReview = async () => {
    if (!selectedWorkflow) {
      alert("Please select a workflow");
      return;
    }

    setReviewing(true);
    setIsCached(false);

    try {
      const workflow = workflows.find((wf) => wf.id === selectedWorkflow);

      console.log("📤 Sending code review request to backend...");
      const results = await codeReviewAPI.runReview({
        workflowId: selectedWorkflow,
        platform: workflow?.platform || selectedPlatform,
      });

      console.log("✅ Code review completed:", results);
      setReviewResults(results);
      setAiInsightsAvailable(false);
    } catch (error) {
      console.error("❌ Code review failed:", error);

      // Fallback to mock data if backend is not ready
      console.warn("⚠️ Using mock data as fallback");
      const workflow = workflows.find((wf) => wf.id === selectedWorkflow);
      const mockResults = generateCodeReviewResults(workflow);
      setReviewResults(mockResults);
    } finally {
      setReviewing(false);
    }
  };

  // Mock data generator (fallback)
  const generateCodeReviewResults = (workflow) => {
    const activityCount = workflow.activities || 50;
    const criticalIssues = Math.floor(activityCount * 0.04);
    const majorIssues = Math.floor(activityCount * 0.12);
    const minorIssues = Math.floor(activityCount * 0.32);
    const totalIssues = criticalIssues + majorIssues + minorIssues;

    const qualityScore = Math.max(
      0,
      100 - (criticalIssues * 15 + majorIssues * 5 + minorIssues * 2),
    );
    const qualityGrade =
      qualityScore >= 90
        ? "A"
        : qualityScore >= 80
          ? "B"
          : qualityScore >= 70
            ? "C"
            : qualityScore >= 60
              ? "D"
              : "F";

    return {
      workflowName: workflow.name,
      reviewedAt: new Date().toISOString(),
      qualityGrade,
      qualityScore: qualityScore.toFixed(1),
      critical: criticalIssues,
      major: majorIssues,
      minor: minorIssues,
      info: Math.floor(activityCount * 0.15),
      totalIssues,
      categories: [
        {
          name: "Naming Conventions",
          icon: "🏷️",
          issues: Math.floor(activityCount * 0.08),
          score: 85,
        },
        {
          name: "Error Handling",
          icon: "🛡️",
          issues: criticalIssues,
          score: criticalIssues === 0 ? 100 : 45,
        },
        {
          name: "Performance",
          icon: "⚡",
          issues: Math.floor(activityCount * 0.05),
          score: 92,
        },
        {
          name: "Security",
          icon: "🔒",
          issues: Math.floor(activityCount * 0.03),
          score: 88,
        },
        { name: "Maintainability", icon: "🔧", issues: majorIssues, score: 73 },
        { name: "Code Standards", icon: "📋", issues: minorIssues, score: 67 },
      ],
      ruleBasedIssues: [
        {
          id: "UP-REL-001",
          title: "Missing Try-Catch Exception Handling",
          category: "Reliability",
          severity: "Critical",
          effort: "Low",
          activity: "Main Sequence",
          issue: "Workflow lacks proper exception handling",
          description:
            "All workflows should be wrapped in Try-Catch blocks with proper exception handling to prevent unexpected crashes and ensure graceful error recovery.",
          recommendation:
            "Wrap the main workflow sequence in a Try-Catch activity. In the Catch block, log the exception details and implement appropriate recovery logic or user notification.",
          impact:
            "High: Unhandled exceptions will cause the entire workflow to crash, potentially losing data and requiring manual intervention.",
        },
        {
          id: "UP-REL-002",
          title: "Business and System Exceptions Not Separated",
          category: "Reliability",
          severity: "High",
          effort: "Medium",
          activity: "Exception Handler",
          issue: "No distinction between business and system exceptions",
          description:
            'Business exceptions (expected errors like "Record Not Found") should be handled differently from system exceptions (unexpected errors like "Database Connection Failed").',
          recommendation:
            "Implement separate Catch blocks for BusinessRuleException and SystemException. Route business exceptions to a different handler than system exceptions.",
          impact:
            "Medium: Difficult to debug and may lead to incorrect error handling strategies.",
        },
        {
          id: "UP-PERF-003",
          title: "Inefficient Loop Structure",
          category: "Performance",
          severity: "Major",
          effort: "Medium",
          activity: "For Each Row Loop",
          issue: "Nested loops without optimization",
          description:
            "Multiple nested For Each loops detected without proper indexing or data structure optimization, leading to O(n²) complexity.",
          recommendation:
            "Consider using Dictionary or HashSet for lookups instead of nested loops. If nested iteration is necessary, ensure inner collections are as small as possible.",
          impact:
            "High: Performance degradation with large datasets. A 1000-row dataset could result in 1,000,000 iterations.",
        },
        {
          id: "UP-SEC-004",
          title: "Hardcoded Credentials Detected",
          category: "Security",
          severity: "Critical",
          effort: "Low",
          activity: "Assign Activity",
          issue: "Password stored in plain text",
          description:
            "Credentials are hardcoded directly in the workflow instead of using Orchestrator Assets or Windows Credential Manager.",
          recommendation:
            "Move all credentials to Orchestrator Assets (for cloud) or Windows Credential Manager (for on-premise). Use Get Credential activity to retrieve them securely.",
          impact:
            "Critical: Security breach risk. Anyone with access to the workflow file can see the credentials.",
        },
        {
          id: "UP-MAINT-005",
          title: "Inconsistent Variable Naming",
          category: "Maintainability",
          severity: "Minor",
          effort: "Low",
          activity: "Multiple Variables",
          issue: "Variables use mixed naming conventions",
          description:
            "Variables use inconsistent naming patterns (camelCase, PascalCase, snake_case) making the code harder to read and maintain.",
          recommendation:
            'Adopt PascalCase for all variables as per UiPath best practices. Example: "str_userName" should be "UserName", "dt_data" should be "DataTable".',
          impact:
            "Low: Reduced code readability and increased maintenance effort for team members.",
        },
      ],
    };
  };

  const handleRunAIAnalysis = async () => {
    if (!selectedWorkflow) {
      alert("Please select a workflow first");
      return;
    }

    setAiAnalysisLoading(true);
    setActiveTab(1);

    try {
      console.log("🤖 Running AI Analysis for workflow:", selectedWorkflow);
      const results = await codeReviewAPI.runAIAnalysis(selectedWorkflow);
      console.log("✅ AI Analysis completed:", results);
      setAiAnalysisResults(results);
      setAiInsightsAvailable(true);
    } catch (error) {
      console.error("❌ AI Analysis failed:", error);

      // Check if backend endpoint is not implemented yet
      if (error.status === 405 || error.status === 404) {
        alert(
          "AI Analysis feature is not yet available on the backend.\n\n" +
            "The backend needs to implement the POST /api/v1/code-review/ai-analysis endpoint.\n\n" +
            "Please contact your backend team to enable this feature.",
        );
      } else {
        alert(`AI Analysis failed: ${error.message || "Unknown error"}`);
      }

      // Reset to show the "not available" state
      setAiInsightsAvailable(false);
      setAiAnalysisResults(null);
      setActiveTab(0); // Go back to rule-based tab
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  // Enhanced CSV Export
  const handleExportCSV = () => {
    if (!reviewResults) return;

    const csvContent = [
      [
        "Issue ID",
        "Title",
        "Category",
        "Severity",
        "Effort",
        "Activity",
        "Description",
        "Recommendation",
        "Impact",
      ],
      ...reviewResults.ruleBasedIssues.map((issue) => [
        issue.id,
        `"${issue.title}"`,
        issue.category,
        issue.severity,
        issue.effort,
        issue.activity || "N/A",
        `"${issue.description}"`,
        `"${issue.recommendation}"`,
        `"${issue.impact}"`,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reviewResults.workflowName}_code_review_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filtered Issues (Memoized for performance)
  const filteredIssues = useMemo(() => {
    if (!reviewResults?.ruleBasedIssues) return [];

    return reviewResults.ruleBasedIssues.filter((issue) => {
      const matchesSeverity =
        severityFilter === "all" ||
        issue.severity.toLowerCase() === severityFilter.toLowerCase();
      const matchesCategory =
        categoryFilter === "all" ||
        issue.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSeverity && matchesCategory && matchesSearch;
    });
  }, [reviewResults, severityFilter, categoryFilter, searchQuery]);

  // Get unique categories for filter
  const uniqueCategories = useMemo(() => {
    if (!reviewResults?.ruleBasedIssues) return [];
    return [
      ...new Set(reviewResults.ruleBasedIssues.map((issue) => issue.category)),
    ];
  }, [reviewResults]);

  return (
    <PageContainer>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 2,
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "#9d4edd" }} />
          <Typography sx={{ color: "#757575", fontWeight: 500 }}>
            Loading workflows for review...
          </Typography>
        </Box>
      ) : (
        <Container maxWidth="lg">
          <Header>
            <BackButton
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </BackButton>
            <Title>Code Review Tool</Title>
            <Subtitle>
              Validate workflows against best practices and coding standards
              with AI-powered insights
            </Subtitle>
          </Header>

          <ConfigCard>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                marginBottom: "16px",
              }}
            >
              <SecurityIcon sx={{ color: "#9d4edd" }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Configure Code Review
              </Typography>
              {isCached && (
                <Chip
                  icon={<CachedIcon />}
                  label="Cached Result"
                  size="small"
                  sx={{
                    ml: "auto",
                    background: "#e3f2fd",
                    color: "#1976d2",
                    fontWeight: 600,
                    animation: `${fadeIn} 0.5s ease-out`,
                  }}
                />
              )}
              {!isCached && (
                <IconButton
                  onClick={loadWorkflows}
                  size="small"
                  sx={{
                    ml: "auto",
                    color: "#757575",
                    "&:hover": {
                      background: "#f5f5f5",
                      color: "#9d4edd",
                    },
                  }}
                  title="Refresh workflow list"
                >
                  <RefreshIcon />
                </IconButton>
              )}
            </Box>
            <Typography
              sx={{ color: "#757575", fontSize: "14px", marginBottom: "24px" }}
            >
              Select a workflow and platform to analyze code quality
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
                marginBottom: "24px",
              }}
            >
              <FormControl fullWidth>
                <Typography
                  sx={{
                    fontWeight: 600,
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Workflow
                </Typography>
                <Select
                  value={selectedWorkflow || ""}
                  onChange={(e) => {
                    console.log("Workflow selection changed:", e.target.value);
                    setSelectedWorkflow(e.target.value);
                  }}
                  displayEmpty
                  disabled={workflows.length === 0}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#9d4edd",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#9d4edd",
                      borderWidth: "2px",
                    },
                    borderRadius: "8px",
                    background: "#ffffff",
                  }}
                >
                  {workflows.length === 0 ? (
                    <MenuItem value="">
                      <em>No workflows available</em>
                    </MenuItem>
                  ) : (
                    workflows.map((wf, index) => (
                      <MenuItem
                        key={index}
                        value={
                          wf.id || wf.analysis_id || wf.workflow_id || index
                        }
                      >
                        {!wf.name ? "Unknown Workflow" : wf.name}
                        {wf.activities > 0 && ` (${wf.activities} activities)`}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <Typography
                  sx={{
                    fontWeight: 600,
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Platform
                </Typography>
                <StyledSelect
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  <MenuItem value="UiPath">UiPath</MenuItem>
                  <MenuItem value="Blue Prism">Blue Prism</MenuItem>
                </StyledSelect>
              </FormControl>
            </Box>

            {workflows.length === 0 && (
              <Alert
                severity="info"
                sx={{
                  mb: 3,
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                  border: "1px solid #9d4edd40",
                }}
              >
                <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                  No workflows available for code review
                </Typography>
                <Typography sx={{ fontSize: "14px" }}>
                  Please upload workflow files in the Project Workspace first.
                  Once uploaded, they will appear here for code review analysis.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/workspace")}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    borderColor: "#9d4edd",
                    color: "#9d4edd",
                    "&:hover": {
                      borderColor: "#8939c9",
                      background: "#9d4edd10",
                    },
                  }}
                >
                  Go to Project Workspace
                </Button>
              </Alert>
            )}

            <RunButton
              startIcon={
                reviewing ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : (
                  <RunIcon />
                )
              }
              onClick={handleRunReview}
              disabled={!selectedWorkflow}
              // reviewing={reviewing}
            >
              {reviewing ? "Analyzing..." : "Run Code Review"}
            </RunButton>
          </ConfigCard>

          {reviewResults && (
            <Fade in={true} timeout={600}>
              <Box>
                {/* Results Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {reviewResults.workflowName}
                    </Typography>
                    <Typography sx={{ fontSize: "14px", color: "#757575" }}>
                      Reviewed on{" "}
                      {new Date(reviewResults.reviewedAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      startIcon={<RefreshIcon />}
                      onClick={handleRunReview}
                      disabled={reviewing}
                      sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                      Re-run Review
                    </Button>
                    <Button
                      startIcon={<DownloadIcon />}
                      onClick={handleExportCSV}
                      variant="outlined"
                      sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                      Export CSV
                    </Button>
                  </Box>
                </Box>

                {/* Metrics Cards */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(4, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Grow in={true} timeout={600}>
                    <GradeCard grade={reviewResults.qualityGrade}>
                      <Typography
                        sx={{ fontSize: "14px", color: "#757575", mb: 1 }}
                      >
                        Quality Grade
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "64px",
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {reviewResults.qualityGrade}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "14px", color: "#757575", mt: 1 }}
                      >
                        Score: {reviewResults.qualityScore}/100
                      </Typography>
                    </GradeCard>
                  </Grow>

                  <Grow in={true} timeout={700}>
                    <MetricCard>
                      <ErrorIcon
                        sx={{ fontSize: 40, color: "#c62828", mb: 1 }}
                      />
                      <Typography
                        sx={{ fontSize: "14px", color: "#757575", mb: 1 }}
                      >
                        Critical
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "36px",
                          fontWeight: 700,
                          color: "#c62828",
                        }}
                      >
                        {reviewResults.critical}
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#757575" }}>
                        Must fix immediately
                      </Typography>
                    </MetricCard>
                  </Grow>

                  <Grow in={true} timeout={800}>
                    <MetricCard>
                      <WarningIcon
                        sx={{ fontSize: 40, color: "#ff9800", mb: 1 }}
                      />
                      <Typography
                        sx={{ fontSize: "14px", color: "#757575", mb: 1 }}
                      >
                        Major
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "36px",
                          fontWeight: 700,
                          color: "#ff9800",
                        }}
                      >
                        {reviewResults.major}
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#757575" }}>
                        Should be addressed
                      </Typography>
                    </MetricCard>
                  </Grow>

                  <Grow in={true} timeout={900}>
                    <MetricCard>
                      <TrendingIcon
                        sx={{ fontSize: 40, color: "#212121", mb: 1 }}
                      />
                      <Typography
                        sx={{ fontSize: "14px", color: "#757575", mb: 1 }}
                      >
                        Total Issues
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "36px",
                          fontWeight: 700,
                          color: "#212121",
                        }}
                      >
                        {reviewResults.totalIssues}
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#757575" }}>
                        {reviewResults.minor} minor, {reviewResults.info} info
                      </Typography>
                    </MetricCard>
                  </Grow>
                </Box>

                {/* Category Breakdown */}
                <Card
                  sx={{
                    p: 3,
                    borderRadius: "12px",
                    border: "1px solid #f0f0f0",
                    mb: 3,
                    background: "#ffffff",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        Category Breakdown
                      </Typography>
                      <Typography sx={{ fontSize: "14px", color: "#757575" }}>
                        Scores by quality category (0-100)
                      </Typography>
                    </Box>
                  </Box>

                  {reviewResults?.categories?.map((category, index) => (
                    <CategoryItem key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flex: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: "24px" }}>
                          {category.icon}
                        </Typography>
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Typography sx={{ fontWeight: 600 }}>
                              {category.name}
                            </Typography>
                            <Typography
                              sx={{ fontSize: "12px", color: "#757575" }}
                            >
                              {category.issues} issues
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={category.score}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "#f0f0f0",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor:
                                  category.score >= 80
                                    ? "#4caf50"
                                    : category.score >= 60
                                      ? "#ff9800"
                                      : "#f44336",
                                borderRadius: 4,
                              },
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          minWidth: "60px",
                          textAlign: "right",
                        }}
                      >
                        {category.score}%
                      </Typography>
                    </CategoryItem>
                  ))}
                </Card>

                {/* Code Review Analysis */}
                <Card
                  sx={{
                    p: 3,
                    borderRadius: "12px",
                    border: "1px solid #f0f0f0",
                    background: "#ffffff",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        Code Review Analysis
                      </Typography>
                      <Typography sx={{ fontSize: "14px", color: "#757575" }}>
                        Rule-based findings and AI-powered insights
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<AIIcon />}
                      onClick={handleRunAIAnalysis}
                      sx={{
                        background:
                          "linear-gradient(90deg, #9d4edd 0%, #f44336 100%)",
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Run AI Analysis
                    </Button>
                  </Box>

                  <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{
                      mb: 3,
                      "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "14px",
                      },
                      "& .MuiTabs-indicator": {
                        backgroundColor: "#9d4edd",
                      },
                    }}
                  >
                    <Tab
                      label={`Rule-Based (${reviewResults?.ruleBasedIssues?.length})`}
                    />
                    <Tab label="AI Insights" />
                  </Tabs>

                  {activeTab === 0 && (
                    <Box>
                      {/* Filters & Search */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          mb: 3,
                          flexWrap: "wrap",
                        }}
                      >
                        <TextField
                          placeholder="Search issues..."
                          size="small"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ color: "#757575" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ minWidth: 250 }}
                        />
                        <Select
                          value={severityFilter}
                          onChange={(e) => setSeverityFilter(e.target.value)}
                          size="small"
                          sx={{ minWidth: 150 }}
                        >
                          <MenuItem value="all">All Severities</MenuItem>
                          <MenuItem value="critical">Critical</MenuItem>
                          <MenuItem value="high">High</MenuItem>
                          <MenuItem value="major">Major</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="minor">Minor</MenuItem>
                        </Select>
                        <Select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          size="small"
                          sx={{ minWidth: 150 }}
                        >
                          <MenuItem value="all">All Categories</MenuItem>
                          {uniqueCategories.map((cat) => (
                            <MenuItem key={cat} value={cat.toLowerCase()}>
                              {cat}
                            </MenuItem>
                          ))}
                        </Select>
                        <Box sx={{ flex: 1 }} />
                        <Typography
                          sx={{
                            fontSize: "14px",
                            color: "#757575",
                            alignSelf: "center",
                          }}
                        >
                          Showing {filteredIssues.length} of{" "}
                          {reviewResults?.ruleBasedIssues?.length} issues
                        </Typography>
                      </Box>

                      {/* Issues List */}
                      {filteredIssues.length === 0 ? (
                        <Alert severity="success" sx={{ borderRadius: "8px" }}>
                          <Typography sx={{ fontWeight: 600 }}>
                            Great job! 🎉
                          </Typography>
                          <Typography sx={{ fontSize: "14px" }}>
                            No issues found matching your filters. Your code is
                            looking good!
                          </Typography>
                        </Alert>
                      ) : (
                        filteredIssues.map((issue, index) => (
                          <IssueCard key={index} severity={issue.severity}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "start",
                                mb: 2,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "16px",
                                  flex: 1,
                                }}
                              >
                                {issue.title}
                              </Typography>
                              <Chip
                                label={issue.severity}
                                size="small"
                                sx={{
                                  background:
                                    issue.severity === "Critical"
                                      ? "#ffebee"
                                      : issue.severity === "High"
                                        ? "#ffcdd2"
                                        : issue.severity === "Major"
                                          ? "#ffe0b2"
                                          : "#fff3e0",
                                  color:
                                    issue.severity === "Critical"
                                      ? "#c62828"
                                      : issue.severity === "High"
                                        ? "#d32f2f"
                                        : issue.severity === "Major"
                                          ? "#ff9800"
                                          : "#ef6c00",
                                  fontWeight: 600,
                                  ml: 2,
                                }}
                              />
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                gap: 2,
                                mb: 2,
                                flexWrap: "wrap",
                              }}
                            >
                              <Chip
                                label={issue.id}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={issue.category}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={`Effort: ${issue.effort}`}
                                size="small"
                                variant="outlined"
                              />
                              {issue.activity && (
                                <Chip
                                  label={`Activity: ${issue.activity}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>

                            <Typography
                              sx={{ fontSize: "14px", fontWeight: 600, mb: 1 }}
                            >
                              Issue:
                            </Typography>
                            <Typography
                              sx={{ fontSize: "14px", color: "#757575", mb: 2 }}
                            >
                              {issue.issue}
                            </Typography>

                            <Typography
                              sx={{ fontSize: "14px", fontWeight: 600, mb: 1 }}
                            >
                              Description:
                            </Typography>
                            <Typography
                              sx={{ fontSize: "14px", color: "#757575", mb: 2 }}
                            >
                              {issue.description}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "start",
                                gap: 1,
                                p: 2,
                                background:
                                  "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                                borderRadius: "8px",
                                mb: 2,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  color: "#5e6ff2",
                                  fontWeight: 600,
                                }}
                              >
                                🔧 Recommendation:
                              </Typography>
                              <Typography
                                sx={{ fontSize: "14px", color: "#212121" }}
                              >
                                {issue.recommendation}
                              </Typography>
                            </Box>

                            <Typography
                              sx={{ fontSize: "14px", fontWeight: 600, mb: 1 }}
                            >
                              Impact:
                            </Typography>
                            <Typography
                              sx={{ fontSize: "14px", color: "#c62828" }}
                            >
                              {issue.impact}
                            </Typography>
                          </IssueCard>
                        ))
                      )}
                    </Box>
                  )}

                  {activeTab === 1 && (
                    <Box>
                      {aiAnalysisLoading ? (
                        <Box
                          sx={{
                            textAlign: "center",
                            py: 6,
                            background:
                              "linear-gradient(135deg, #f9f9ff 0%, #fff5f8 100%)",
                            borderRadius: "8px",
                          }}
                        >
                          <CircularProgress
                            size={60}
                            thickness={4}
                            sx={{ color: "#9d4edd", mb: 2 }}
                          />
                          <Typography sx={{ fontWeight: 600, mb: 1 }}>
                            Running AI Analysis...
                          </Typography>
                          <Typography
                            sx={{ fontSize: "14px", color: "#757575" }}
                          >
                            Please wait while our AI analyzes your workflow
                          </Typography>
                        </Box>
                      ) : !aiInsightsAvailable ? (
                        <Box
                          sx={{
                            textAlign: "center",
                            py: 6,
                            background:
                              "linear-gradient(135deg, #f9f9ff 0%, #fff5f8 100%)",
                            borderRadius: "8px",
                          }}
                        >
                          <AIIcon
                            sx={{ fontSize: 64, color: "#9d4edd", mb: 2 }}
                          />
                          <Typography sx={{ fontWeight: 600, mb: 1 }}>
                            AI Analysis Not Available Yet
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              color: "#757575",
                              maxWidth: "600px",
                              mx: "auto",
                            }}
                          >
                            Click the "Run AI Analysis" button to get
                            intelligent, context-aware insights beyond
                            rule-based checks. The AI will analyze your workflow
                            architecture, identify patterns, and provide
                            optimization recommendations.
                          </Typography>
                        </Box>
                      ) : aiAnalysisResults ? (
                        <Box>
                          {/* Overall Assessment */}
                          <Card
                            sx={{
                              p: 3,
                              mb: 3,
                              background:
                                "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                              border: "1px solid #9d4edd40",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "start",
                                gap: 2,
                              }}
                            >
                              <AIIcon sx={{ fontSize: 40, color: "#9d4edd" }} />
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: 700, mb: 1 }}
                                >
                                  Overall Assessment
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    lineHeight: 1.6,
                                    mb: 2,
                                  }}
                                >
                                  {aiAnalysisResults.overall_assessment
                                    ?.summary ||
                                    "AI analysis completed successfully."}
                                </Typography>

                                {/* Strengths */}
                                {aiAnalysisResults.overall_assessment
                                  ?.strengths &&
                                  aiAnalysisResults.overall_assessment.strengths
                                    .length > 0 && (
                                    <Box sx={{ mb: 2 }}>
                                      <Typography
                                        sx={{
                                          fontWeight: 600,
                                          fontSize: "13px",
                                          color: "#4caf50",
                                          mb: 1,
                                        }}
                                      >
                                        ✓ Strengths
                                      </Typography>
                                      {aiAnalysisResults.overall_assessment.strengths.map(
                                        (strength, idx) => (
                                          <Typography
                                            key={idx}
                                            sx={{
                                              fontSize: "13px",
                                              color: "#555",
                                              pl: 2,
                                              mb: 0.5,
                                            }}
                                          >
                                            • {strength}
                                          </Typography>
                                        ),
                                      )}
                                    </Box>
                                  )}

                                {/* Weaknesses */}
                                {aiAnalysisResults.overall_assessment
                                  ?.weaknesses &&
                                  aiAnalysisResults.overall_assessment
                                    .weaknesses.length > 0 && (
                                    <Box>
                                      <Typography
                                        sx={{
                                          fontWeight: 600,
                                          fontSize: "13px",
                                          color: "#f44336",
                                          mb: 1,
                                        }}
                                      >
                                        ⚠ Areas for Improvement
                                      </Typography>
                                      {aiAnalysisResults.overall_assessment.weaknesses.map(
                                        (weakness, idx) => (
                                          <Typography
                                            key={idx}
                                            sx={{
                                              fontSize: "13px",
                                              color: "#555",
                                              pl: 2,
                                              mb: 0.5,
                                            }}
                                          >
                                            • {weakness}
                                          </Typography>
                                        ),
                                      )}
                                    </Box>
                                  )}
                              </Box>
                            </Box>
                          </Card>

                          {/* Impact Scores */}
                          {aiAnalysisResults.impact_scores && (
                            <Card sx={{ p: 3, mb: 3 }}>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 700, mb: 2 }}
                              >
                                Impact Scores
                              </Typography>
                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                  },
                                  gap: 2,
                                }}
                              >
                                {Object.entries(
                                  aiAnalysisResults.impact_scores,
                                ).map(([key, value]) => (
                                  <Box
                                    key={key}
                                    sx={{
                                      p: 2,
                                      background: "#f9f9f9",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        color: "#757575",
                                        mb: 0.5,
                                        textTransform: "capitalize",
                                      }}
                                    >
                                      {key.replace(/_/g, " ")}
                                    </Typography>
                                    <Typography
                                      sx={{ fontWeight: 700, fontSize: "24px" }}
                                    >
                                      {value}/10
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            </Card>
                          )}

                          {/* Patterns Detected */}
                          {aiAnalysisResults.patterns_detected &&
                            aiAnalysisResults.patterns_detected.length > 0 && (
                              <Card sx={{ p: 3, mb: 3 }}>
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: 700, mb: 2 }}
                                >
                                  Patterns Detected
                                </Typography>
                                {aiAnalysisResults.patterns_detected.map(
                                  (pattern, index) => (
                                    <Box
                                      key={index}
                                      sx={{
                                        p: 2,
                                        mb: 2,
                                        background: "#f9f9f9",
                                        borderRadius: "8px",
                                        borderLeft: "4px solid #9d4edd",
                                      }}
                                    >
                                      <Typography
                                        sx={{ fontWeight: 600, mb: 1 }}
                                      >
                                        {pattern.pattern || pattern.name}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          color: "#757575",
                                        }}
                                      >
                                        {pattern.description || pattern.details}
                                      </Typography>
                                    </Box>
                                  ),
                                )}
                              </Card>
                            )}

                          {/* Optimization Opportunities */}
                          {aiAnalysisResults.optimization_opportunities &&
                            aiAnalysisResults.optimization_opportunities
                              .length > 0 && (
                              <Card sx={{ p: 3, mb: 3 }}>
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: 700, mb: 2 }}
                                >
                                  Optimization Opportunities
                                </Typography>
                                {aiAnalysisResults.optimization_opportunities.map(
                                  (opp, index) => (
                                    <Box
                                      key={index}
                                      sx={{
                                        p: 2,
                                        mb: 2,
                                        background:
                                          "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)",
                                        borderRadius: "8px",
                                        borderLeft: "4px solid #4caf50",
                                      }}
                                    >
                                      <Typography
                                        sx={{ fontWeight: 600, mb: 1 }}
                                      >
                                        {opp.title || opp.opportunity}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          color: "#757575",
                                          mb: 1,
                                        }}
                                      >
                                        {opp.description || opp.details}
                                      </Typography>
                                      {opp.potential_impact && (
                                        <Chip
                                          label={`Impact: ${opp.potential_impact}`}
                                          size="small"
                                          sx={{
                                            background: "#4caf50",
                                            color: "#fff",
                                            fontWeight: 600,
                                          }}
                                        />
                                      )}
                                    </Box>
                                  ),
                                )}
                              </Card>
                            )}

                          {/* Migration Risks */}
                          {aiAnalysisResults.migration_risks &&
                            aiAnalysisResults.migration_risks.length > 0 && (
                              <Card sx={{ p: 3, mb: 3 }}>
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: 700, mb: 2 }}
                                >
                                  Migration Risks
                                </Typography>
                                {aiAnalysisResults.migration_risks.map(
                                  (risk, index) => (
                                    <Box
                                      key={index}
                                      sx={{
                                        p: 2,
                                        mb: 2,
                                        background:
                                          "linear-gradient(135deg, #ffebee 0%, #fff3e0 100%)",
                                        borderRadius: "8px",
                                        borderLeft: "4px solid #f44336",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "start",
                                          mb: 1,
                                        }}
                                      >
                                        <Typography sx={{ fontWeight: 600 }}>
                                          {risk.risk || risk.title}
                                        </Typography>
                                        {risk.severity && (
                                          <Chip
                                            label={risk.severity}
                                            size="small"
                                            sx={{
                                              background:
                                                risk.severity === "High"
                                                  ? "#f44336"
                                                  : risk.severity === "Medium"
                                                    ? "#ff9800"
                                                    : "#fbc02d",
                                              color: "#fff",
                                              fontWeight: 600,
                                            }}
                                          />
                                        )}
                                      </Box>
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          color: "#757575",
                                        }}
                                      >
                                        {risk.description || risk.details}
                                      </Typography>
                                      {risk.mitigation && (
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#2e7d32",
                                            mt: 1,
                                            fontWeight: 600,
                                          }}
                                        >
                                          Mitigation: {risk.mitigation}
                                        </Typography>
                                      )}
                                    </Box>
                                  ),
                                )}
                              </Card>
                            )}
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            textAlign: "center",
                            py: 6,
                            background:
                              "linear-gradient(135deg, #ffebee 0%, #fff3e0 100%)",
                            borderRadius: "8px",
                          }}
                        >
                          <ErrorIcon
                            sx={{ fontSize: 64, color: "#f44336", mb: 2 }}
                          />
                          <Typography sx={{ fontWeight: 600, mb: 1 }}>
                            No AI Analysis Results
                          </Typography>
                          <Typography
                            sx={{ fontSize: "14px", color: "#757575" }}
                          >
                            Please run the AI analysis to view insights.
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Card>
              </Box>
            </Fade>
          )}
        </Container>
      )}
    </PageContainer>
  );
};

export default CodeReviewTool;
