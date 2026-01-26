import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Select,
  MenuItem,
  Chip,
  Card,
  Snackbar,
  Alert,
  FormControl,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
  PlayArrow as PlayIcon,
  CompareArrows as ConvertIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
  ShowChart as ChartIcon,
  DataUsage as DataIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  analysisAPI,
  apiKeyAPI,
  subscriptionAPI,
  projectAPI,
} from "../services/api";
import api from "../services/api";
import AnalysisResults from "./AnalysisResults";

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "#ffffff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  borderBottom: "1px solid #f0f0f0",
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: "linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "1.5rem",
  flexGrow: 1,
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: "#757575",
  fontSize: "0.875rem",
  marginTop: "-4px",
}));

const ProjectSelector = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: "#f5f7ff",
  padding: "8px 16px",
  borderRadius: "8px",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "8px",
  },
}));

const ActionToolbar = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "12px",
  padding: "16px 0",
  flexWrap: "wrap",
  [theme.breakpoints.down("md")]: {
    gap: "8px",
  },
}));

const ActionButton = styled(Button)(({ theme, bgcolor }) => ({
  textTransform: "none",
  borderRadius: "8px",
  padding: "8px 16px",
  fontWeight: 600,
  fontSize: "14px",
  background: bgcolor || "#5e6ff2",
  color: "#ffffff",
  "&:hover": {
    background: bgcolor ? `${bgcolor}dd` : "#4c5ed7",
    transform: "translateY(-1px)",
  },
  transition: "all 0.2s ease",
  [theme.breakpoints.down("sm")]: {
    padding: "6px 12px",
    fontSize: "13px",
  },
}));

const OutlinedActionButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  borderRadius: "8px",
  padding: "8px 16px",
  fontWeight: 600,
  fontSize: "14px",
  border: "1px solid #e0e0e0",
  color: "#212121",
  background: "#ffffff",
  "&:hover": {
    background: "#f5f5f5",
    borderColor: "#5e6ff2",
  },
  transition: "all 0.2s ease",
  [theme.breakpoints.down("sm")]: {
    padding: "6px 12px",
    fontSize: "13px",
  },
}));

const UploadArea = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragging",
})(({ theme, isDragging }) => ({
  border: "2px dashed #e0e0e0",
  borderRadius: "12px",
  padding: "60px 40px",
  textAlign: "center",
  background: isDragging ? "#f5f7ff" : "#fafafa",
  borderColor: isDragging ? "#5e6ff2" : "#e0e0e0",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    background: "#f5f7ff",
    borderColor: "#5e6ff2",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "40px 20px",
  },
}));

const EmptyStateCard = styled(Card)(({ theme }) => ({
  padding: "40px",
  textAlign: "center",
  background: "#ffffff",
  border: "1px solid #f0f0f0",
  borderRadius: "12px",
  marginTop: "24px",
  [theme.breakpoints.down("sm")]: {
    padding: "24px",
  },
}));

const ProjectWorkspace = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // NAVIGATION HANDLERS
  const handleViewDetail = (process, index) => {
    console.log(
      `🔍 Viewing workflow detail for: ${process.name} (Index: ${index})`,
    );
    navigate("/workflow-detail", {
      state: {
        workflow: process,
        allWorkflows: analysisData.processes,
        currentIndex: index,
      },
    });
  };

  // Get user from localStorage with proper field mapping
  const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const currentUser = {
    name:
      storedUser.full_name ||
      storedUser.name ||
      storedUser.email?.split("@")[0] ||
      "User",
    email: storedUser.email || "",
    user_id: storedUser.user_id || storedUser.id || "",
  };

  // Fetch projects from backend on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        console.log("Fetching projects from API...");
        const data = await projectAPI.getAll();
        console.log("Projects received:", data);
        setProjects(data || []);

        // Set active project
        const activeId = localStorage.getItem("activeProjectId");
        const lastProjectStr = localStorage.getItem("currentProject");
        let lastProject = null;
        try {
          lastProject = lastProjectStr ? JSON.parse(lastProjectStr) : null;
        } catch (e) {
          console.error("Error parsing lastProject from localStorage", e);
        }

        if (data && data.length > 0) {
          const match = data.find(
            (p) =>
              p.project_id === activeId ||
              (lastProject && p.project_id === lastProject.project_id),
          );
          console.log("Match found:", match);
          setCurrentProject(match || data[0]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setSnackbarMessage("❌ Failed to load projects from database");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Load saved analysis results when project changes
  useEffect(() => {
    loadProjectAnalysis();
  }, [currentProject]);

  const handleProjectChange = (event) => {
    const selectedProject = projects.find(
      (p) => p.project_id === event.target.value,
    );
    if (selectedProject) {
      setCurrentProject(selectedProject);
    }
  };

  const handleLogout = () => {
    console.log("👋 User logging out");
    localStorage.clear();
    navigate("/");
  };

  const handleNewProject = () => {
    navigate("/dashboard");
  };

  const handleDeleteProject = () => {
    if (!currentProject) return;
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteDialogOpen(false);
    try {
      await projectAPI.delete(currentProject.project_id);
      setSnackbarMessage("✅ Project deleted successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Update local state
      const remainingProjects = projects.filter(
        (p) => p.project_id !== currentProject.project_id,
      );
      setProjects(remainingProjects);

      // Switch to another project or clear selection
      if (remainingProjects.length > 0) {
        setCurrentProject(remainingProjects[0]);
      } else {
        setCurrentProject(null);
        // Optionally direct back to dashboard if no projects left
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setSnackbarMessage("❌ Failed to delete project");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const getAcceptedExtensions = () => {
    if (!currentProject) return [];
    if (currentProject.platform === "UiPath") {
      return [".xaml", ".xml"];
    } else if (
      currentProject.platform === "Blue Prism" ||
      currentProject.platform === "BluePrism"
    ) {
      return [".bp"];
    }
    return [];
  };

  const handleFiles = (files) => {
    const acceptedExt = getAcceptedExtensions();
    const validFiles = files.filter((file) =>
      acceptedExt.some((ext) => file.name.toLowerCase().endsWith(ext)),
    );

    if (validFiles.length === 0) {
      const extList = acceptedExt.join(", ");
      setSnackbarMessage(
        `❌ Please upload ${currentProject.platform} workflow files (${extList})`,
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (validFiles.length !== files.length) {
      const extList = acceptedExt.join(", ");
      setSnackbarMessage(
        `⚠️ Some files were skipped. Only ${extList} files are allowed`,
      );
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }

    setUploadedFiles([...uploadedFiles, ...validFiles]);
    if (validFiles.length === files.length) {
      setSnackbarMessage(
        `✅ ${validFiles.length} workflow file(s) uploaded successfully!`,
      );
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    }

    console.log(
      "📁 Uploaded files:",
      validFiles.map((f) => f.name),
    );
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) {
      setSnackbarMessage("❌ Please upload at least one file");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    setAnalyzing(true);

    try {
      console.log("📤 Uploading files to backend for analysis...");

      // Authentication is already handled by apiRequest (using authToken)
      // No need for redundant apiKey logic here as backend uses JWT

      // Upload all files to backend
      const uploadResults = await api.analysis.uploadMultiple(uploadedFiles, {
        projectId: currentProject?.project_id,
      });

      console.log("✅ Upload results:", uploadResults);

      const processes = uploadResults.map((result, index) => {
        const fileName = uploadedFiles[index].name;

        return {
          name:
            result.workflowName?.replace(/\.(xaml|bp|xml)$/i, "") || fileName,
          platform: result.platform || currentProject?.platform || "Unknown",

          complexity: result.complexityScore || 0,
          level: result.complexityLevel || "Low",
          activities: result.totalActivities || 0,
          effort: result.estimatedEffortHours || 0,

          risks: result.riskIndicators || [],
          workflow_id: result.id,
          activityBreakdown: result.activityBreakdown || {},
          analyzedDate: result.analyzedAt || new Date().toLocaleString(),

          fullAnalysis: {
            ...result,
            analysis: {
              activity_breakdown: result.activityBreakdown || {},
            },
          },
        };
      });

      // Calculate aggregate metrics from the processed data
      const totalActivities = processes.reduce(
        (sum, p) => sum + Number(p.activities),
        0,
      );
      const avgComplexity =
        processes.reduce((sum, p) => sum + Number(p.complexity), 0) /
        processes.length;
      const highRiskProcesses = processes.filter((p) =>
        ["Very High", "Critical", "High"].includes(p.level),
      ).length;

      const analysisResults = {
        totalProcesses: processes.length,
        avgComplexity: Math.round(avgComplexity * 10) / 10,
        totalActivities: totalActivities,
        highRiskProcesses: highRiskProcesses,
        processes: processes,
        analyzedAt: new Date().toISOString(),
        projectId: currentProject.project_id,
        projectName: currentProject.name,
      };

      // Store in component state
      setAnalysisData(analysisResults);

      // Persist to localStorage for cross-page access
      localStorage.setItem(
        `project_${currentProject.project_id}_analysis`,
        JSON.stringify(analysisResults),
      );

      console.log(
        `💾 Analysis results saved to localStorage for project: ${currentProject.name}`,
      );

      setSnackbarMessage(
        `✅ ${uploadedFiles.length} file(s) analyzed successfully!`,
      );
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setAnalyzing(false);
      setUploadedFiles([]);
      
      // Refresh analysis data by re-triggering the useEffect
      setTimeout(() => {
        setCurrentProject({...currentProject}); // Trigger useEffect to reload analysis
      }, 1000);
    } catch (error) {
      console.error("❌ Analysis error:", error);
      setSnackbarMessage(`❌ Analysis failed: ${error.message}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setAnalyzing(false);
    }
  };

  const handleActionClick = (action) => {
    console.log(`🎯 Action clicked: ${action}`);

    // Navigate to respective pages
    switch (action) {
      case "Workflow Analyzer":
        navigate("/workflow-analyzer");
        break;
      case "UiPath to BluePrism":
        navigate("/uipath-to-blueprism");
        break;
      case "Code Review":
        navigate("/code-review");
        break;
      case "Custom Rules":
        navigate("/custom-rules");
        break;
      case "Refresh":
        handleRefresh();
        break;
      case "Export CSV":
        handleExportCSV();
        break;
      case "Export JSON":
        handleExportJSON();
        break;
      default:
        setSnackbarMessage(`🚀 ${action} feature coming soon!`);
        setSnackbarSeverity("info");
        setOpenSnackbar(true);
    }
  };

  const loadProjectAnalysis = async () => {
    if (currentProject?.project_id) {
      console.log("📂 Loading analysis for project:", currentProject.name, currentProject.project_id);
      localStorage.setItem("activeProjectId", currentProject.project_id);
      localStorage.setItem("currentProject", JSON.stringify(currentProject));

      try {
        const history = await analysisAPI.getHistory(
          currentProject.project_id,
        );

        if (history && history.length > 0) {
          const completedAnalyses = history.filter(
            (h) => {
              return (h.status === "completed" || h.status === "COMPLETED") && (h.metrics || h.complexity);
            }
          );
          
          if (completedAnalyses.length > 0) {
            const processes = completedAnalyses.map((h) => {
              const r = h;

              let complexityScore = 50;
              let complexityLevel = "Medium";

              console.log("fff: "+r.workflowName)

              if (r.complexity && typeof r.complexity === "object") {
                complexityScore = r.complexity.score || 50;
                complexityLevel = r.complexity.level || "Medium";
              } else {
                complexityScore = r.complexity || 50;
                complexityLevel = complexityScore > 80 ? "High" : complexityScore > 50 ? "Medium" : "Low";
              }

              return {
                name:
                  r.workflowName ||
                  r.name ||
                  h.file_name?.replace(/\.(xaml|bp|xml)$/i, "") ||
                  "Unknown",
                platform: currentProject.platform,
                complexity: complexityScore,
                level: complexityLevel,
                activities: r.metrics?.activity_count || 0,
                effort: ((r.metrics?.activity_count || 0) * 0.4).toFixed(1),
                risks: r.code_review?.findings?.map(f => f.message) || ["No issues found"],
                workflow_id: r.workflow_id || r.id,
                fullAnalysis: {
                  ...r,
                  analysis: {
                    activity_breakdown: r.activity_breakdown || {
                      Other: r.metrics?.activity_count || 0,
                    },
                  },
                },
              };
            });

            const totalActivities = processes.reduce(
              (sum, p) => sum + Number(p.activities),
              0,
            );
            const avgComplexity =
              processes.length > 0
                ? processes.reduce(
                    (sum, p) => sum + Number(p.complexity),
                    0,
                  ) / processes.length
                : 0;
            const highRiskProcesses = processes.filter((p) =>
              ["High", "Very High", "Critical"].includes(p.level),
            ).length;

            const aggregatedData = {
              totalProcesses: processes.length,
              avgComplexity: Math.round(avgComplexity * 10) / 10,
              totalActivities: totalActivities,
              highRiskProcesses: highRiskProcesses,
              processes: processes,
              analyzedAt: new Date().toISOString(),
              projectId: currentProject.project_id,
              projectName: currentProject.name,
            };

            setAnalysisData(aggregatedData);
            setShowResults(false);
          } else {
            setAnalysisData(null);
            setShowResults(false);
          }
        } else {
          setAnalysisData(null);
          setShowResults(false);
          setUploadedFiles([]);
        }
      } catch (error) {
        if (error.status === 404) {
          console.log(
            "ℹ️ Analysis history endpoint not available yet. Showing empty workspace.",
          );
        } else {
          console.error("Failed to load project analysis:", error);
        }
        setAnalysisData(null);
        setShowResults(false);
      }
    }
  };

  const handleOnWorkflowDelete = async () => {
    await loadProjectAnalysis();
  }

  const handleOnWorkflowUpdate = async () => {
    await loadProjectAnalysis();
  }

  const handleRefresh = async () => {
    console.log("🔄 Refreshing workspace...");
    setLoading(true);
    try {
      const data = await projectAPI.getAll();
      setProjects(data || []);
      setSnackbarMessage("✅ Workspace refreshed successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Refresh error:", error);
      setSnackbarMessage("❌ Failed to refresh projects");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const handleExportCSV = () => {
    console.log("📊 Exporting to CSV...");

    // Create CSV content
    const csvContent = [
      [
        "Project ID",
        "Project Name",
        "Description",
        "Platform",
        "Workflows",
        "Created At",
      ].join(","),
      ...projects.map((p) =>
        [
          p.project_id || p.id,
          `"${p.name}"`,
          `"${p.description}"`,
          p.platform,
          p.workflows,
          p.created_at || p.createdAt || new Date().toISOString(),
        ].join(","),
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `iaap_projects_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbarMessage("✅ Projects exported to CSV successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  const handleExportJSON = () => {
    console.log("📄 Exporting to JSON...");

    // Create JSON content
    const jsonContent = JSON.stringify(
      {
        exportDate: new Date().toISOString(),
        totalProjects: projects.length,
        projects: projects,
      },
      null,
      2,
    );

    // Create download link
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `iaap_projects_${new Date().toISOString().split("T")[0]}.json`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbarMessage("✅ Projects exported to JSON successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafbfc",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <LinearProgress sx={{ width: 300, mb: 2, borderRadius: 4 }} />
          <Typography color="textSecondary">Loading workspace...</Typography>
        </Box>
      </Box>
    );
  }

  // // Show analysis results page if analysis is complete
  // if (showResults && analysisData) {
  //   return (
  //     <Box sx={{ minHeight: "100vh", background: "#fafbfc" }}>
  //       <StyledAppBar position="static">
  //         <Toolbar>
  //           <IconButton
  //             onClick={() => setShowResults(false)}
  //             sx={{ color: "#212121", mr: 2 }}
  //           >
  //             <ArrowBackIcon />
  //           </IconButton>
  //           <Box sx={{ flexGrow: 1 }}>
  //             <Logo>Automation Project Analyzer</Logo>
  //             <Subtitle>Analysis Results</Subtitle>
  //           </Box>
  //           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
  //             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  //               <PersonIcon sx={{ color: "#757575", fontSize: 20 }} />
  //               <Typography
  //                 sx={{
  //                   color: "#212121",
  //                   fontWeight: 500,
  //                   display: { xs: "none", sm: "block" },
  //                 }}
  //               >
  //                 {currentUser.name}
  //               </Typography>
  //             </Box>
  //             <IconButton
  //               onClick={handleLogout}
  //               sx={{
  //                 color: "#757575",
  //                 "&:hover": {
  //                   color: "#f44336",
  //                   background: "rgba(244, 67, 54, 0.08)",
  //                 },
  //               }}
  //             >
  //               <LogoutIcon />
  //             </IconButton>
  //           </Box>
  //         </Toolbar>
  //       </StyledAppBar>

  //       <Container maxWidth="xl" sx={{ mt: 3 }}>
  //         <Alert severity="success" sx={{ mb: 3, borderRadius: "8px" }}>
  //           {uploadedFiles.length} file(s) uploaded successfully
  //         </Alert>

  //         <AnalysisResults
  //           analysisData={analysisData}
  //           onViewDetail={handleViewDetail}
  //         />
  //       </Container>
  //     </Box>
  //   );
  // }

  return (
    <Box sx={{ minHeight: "100vh", background: "#fafbfc" }}>
      {/* App Bar */}
      <StyledAppBar position="static">
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Logo variant="h6">Automation Project Analyzer</Logo>
            <Subtitle>Intelligent Automation Analysis Platform</Subtitle>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard")}
              sx={{
                color: "#757575",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { background: "rgba(0,0,0,0.04)" },
              }}
            >
              Back to Dashboard
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
              <PersonIcon sx={{ color: "#757575", fontSize: 20 }} />
              <Typography
                sx={{
                  color: "#212121",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                {currentUser.name}
              </Typography>
            </Box>
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#757575",
                "&:hover": {
                  color: "#f44336",
                  background: "rgba(244, 67, 54, 0.08)",
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Project Selector Bar */}
      <Box
        sx={{ background: "#ffffff", borderBottom: "1px solid #f0f0f0", py: 2 }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <ProjectSelector>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FolderIcon sx={{ color: "#5e6ff2", fontSize: 24 }} />
                <Typography
                  sx={{ fontWeight: 600, color: "#212121", fontSize: "14px" }}
                >
                  Active Project:
                </Typography>
              </Box>

              {projects.length > 0 && currentProject && (
                <>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <Select
                      value={currentProject.project_id}
                      onChange={handleProjectChange}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        background: "#ffffff",
                        borderRadius: "6px",
                      }}
                    >
                      {projects.map((project) => (
                        <MenuItem
                          key={project.project_id}
                          value={project.project_id}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background:
                                  project.platform === "UiPath"
                                    ? "#9d4edd"
                                    : "#5e6ff2",
                              }}
                            />
                            {project.name} ({project.workflows} workflows)
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Chip
                    label={currentProject.platform}
                    size="small"
                    sx={{
                      background:
                        "linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)",
                      color: "#ffffff",
                      fontWeight: 600,
                    }}
                  />
                </>
              )}

              {projects.length === 0 && (
                <Typography sx={{ fontSize: "13px", color: "#757575" }}>
                  No projects found. Create one to get started.
                </Typography>
              )}
            </ProjectSelector>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleNewProject}
                sx={{
                  background:
                    "linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #4c5ed7 0%, #8939c9 100%)",
                  },
                }}
              >
                New Project
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteProject}
                sx={{
                  borderColor: "#f44336",
                  color: "#f44336",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#d32f2f",
                    background: "rgba(244, 67, 54, 0.08)",
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Action Toolbar */}
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <ActionToolbar>
          <ActionButton
            startIcon={<PlayIcon />}
            bgcolor="#9d4edd"
            onClick={() => handleActionClick("Workflow Analyzer")}
          >
            Workflow Analyzer
          </ActionButton>
          <ActionButton
            startIcon={<ConvertIcon />}
            bgcolor="#5e6ff2"
            onClick={() => handleActionClick("UiPath to BluePrism")}
          >
            UiPath to BluePrism
          </ActionButton>
          <ActionButton
            startIcon={<SecurityIcon />}
            bgcolor="#f44336"
            onClick={() => handleActionClick("Code Review")}
          >
            Code Review
          </ActionButton>
          <ActionButton
            startIcon={<SettingsIcon />}
            bgcolor="#ff9800"
            onClick={() => handleActionClick("Custom Rules")}
          >
            Custom Rules
          </ActionButton>
          <OutlinedActionButton
            startIcon={<RefreshIcon />}
            onClick={() => handleActionClick("Refresh")}
          >
            Refresh
          </OutlinedActionButton>
          <OutlinedActionButton
            startIcon={<DownloadIcon />}
            onClick={() => handleActionClick("Export CSV")}
          >
            Export CSV
          </OutlinedActionButton>
          <OutlinedActionButton
            startIcon={<DownloadIcon />}
            onClick={() => handleActionClick("Export JSON")}
          >
            Export JSON
          </OutlinedActionButton>
        </ActionToolbar>

        {/* Project Info */}
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#212121",
              fontSize: { xs: "2rem", sm: "3rem" },
            }}
          >
            {currentProject?.name || "Select a Project"}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#757575",
              mt: 1,
            }}
          >
            {currentProject?.description || ""}
          </Typography>
        </Box>

        {/* Platform Badge */}
        {currentProject && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#212121",
                mb: 1,
              }}
            >
              Project Platform:
            </Typography>
            <Chip
              label={currentProject.platform}
              sx={{
                background: "linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "14px",
                padding: "4px 8px",
              }}
            />
          </Box>
        )}

        {/* Upload Area */}
        <UploadArea
          isDragging={isDragging}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <UploadIcon sx={{ fontSize: 64, color: "#9e9e9e", mb: 2 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#212121",
              mb: 1,
            }}
          >
            Upload {currentProject?.platform || "RPA"}{" "}
            {currentProject?.platform === "UiPath" ? "XAML" : "BP"} Workflow
            Files
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#757575",
              mb: 3,
            }}
          >
            Drag and drop your {currentProject?.platform || "RPA"}{" "}
            {getAcceptedExtensions().join(", ")} files here, or click to browse
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: "#212121",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                background: "#424242",
              },
            }}
          >
            Browse Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={getAcceptedExtensions().join(",")}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </UploadArea>

        {/* Empty State or File List */}
        {uploadedFiles.length === 0 ? (
          (!analysisData) ? (
          <EmptyStateCard>
            <Typography
              variant="body1"
              sx={{
                color: "#757575",
              }}
            >
              No workflows analyzed yet. Upload your workflow files to get
              started.
            </Typography>
          </EmptyStateCard> ) : (
            <Card sx={{ mt: 3, p: 3 }}>
            <AnalysisResults
            analysisData={analysisData}
            onViewDetail={handleViewDetail}
            setSnackbarMessage= {setSnackbarMessage}
            setSnackbarSeverity = {setSnackbarSeverity}
            setOpenSnackbar = {setOpenSnackbar}
            onDelete = {handleOnWorkflowDelete}
            onWorkflowUpdated = {handleOnWorkflowUpdate}
          /></Card>
          )
        ) : (
          <Card sx={{ mt: 3, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Selected Files ({uploadedFiles.length})
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}
            >
              {uploadedFiles.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    background: "#ffffff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FolderIcon sx={{ color: "#5e6ff2" }} />
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
                        {file.name}
                      </Typography>
                      <Typography sx={{ color: "#757575", fontSize: "12px" }}>
                        {(file.size / 1024).toFixed(2)} KB
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(index)}
                    sx={{ color: "#757575" }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>

            {analyzing && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}
                >
                  Analyzing workflows...
                </Typography>
                <LinearProgress
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    "& .MuiLinearProgress-bar": {
                      background:
                        "linear-gradient(90deg, #9d4edd 0%, #f44336 100%)",
                    },
                  }}
                />
              </Box>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={analyzing ? null : <CheckIcon />}
              onClick={handleAnalyze}
              disabled={analyzing}
              sx={{
                background: "linear-gradient(90deg, #9d4edd 0%, #f44336 100%)",
                color: "#ffffff",
                padding: "14px 28px",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #8939c9 0%, #d32f2f 100%)",
                },
                "&:disabled": {
                  background: "#e0e0e0",
                  color: "#9e9e9e",
                },
              }}
            >
              {analyzing
                ? "Analyzing..."
                : `Upload and Analyze ${uploadedFiles.length} File(s)`}
            </Button>
          </Card>
        )}
      </Container>

      {/* Deletion Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          style: {
            borderRadius: "12px",
            padding: "8px",
          },
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 700 }}>
          {"Confirm Project Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the project{" "}
            <strong>"{currentProject?.name}"</strong>? This action cannot be
            undone and all associated analysis data will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: "#757575",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            autoFocus
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": {
                background: "#d32f2f",
                boxShadow: "none",
              },
            }}
          >
            Delete Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectWorkspace;
