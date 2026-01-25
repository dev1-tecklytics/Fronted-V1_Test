import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingIcon,
  Extension as ExtensionIcon,
  AccountTree as TreeIcon,
  Timer as TimerIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Build as BuildIcon,
  Lightbulb as LightbulbIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  DataUsage as DataIcon,
  CompareArrows as ConvertIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

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
}));

const MetricCard = styled(Card)(({ theme }) => ({
  padding: "24px",
  borderRadius: "12px",
  border: "1px solid #f0f0f0",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    transform: "translateY(-2px)",
  },
}));

const IconWrapper = styled(Box)(({ bgcolor }) => ({
  width: 56,
  height: 56,
  borderRadius: "12px",
  background: bgcolor || "#e3f2fd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const RiskBadge = styled(Chip)(({ severity }) => {
  const colors = {
    high: { bg: "#ffebee", color: "#d32f2f" },
    medium: { bg: "#fff3e0", color: "#f57c00" },
    low: { bg: "#e8f5e9", color: "#388e3c" },
  };
  const color = colors[severity] || colors.medium;
  return {
    background: color.bg,
    color: color.color,
    fontWeight: 600,
    fontSize: "13px",
  };
});

const SuggestionCard = styled(Card)(({ theme }) => ({
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e3f2fd",
  background: "#fafbff",
  marginBottom: "12px",
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: "#5e6ff2",
    boxShadow: "0 4px 12px rgba(94, 111, 242, 0.1)",
  },
}));

const WorkflowDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // NAVIGATION SEQUENCE DATA
  const allWorkflows = location.state?.allWorkflows || [];
  const initialIndex = location.state?.currentIndex || 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Get workflow data from sequence or state
  const workflowData =
    allWorkflows.length > 0
      ? allWorkflows[currentIndex]
      : location.state?.workflow || {
          name: "Untitled Workflow",
          platform: "UiPath",
          complexity: 286.5,
          level: "Very High",
          activities: 150,
          effort: 68.7,
          risks: ["High Nesting", "Large Workflow", "No Error Handling"],
          file: "Main.xaml",
          project: "nn",
          nestingDepth: 44,
          variables: 1,
          invokedWorkflows: 2,
          exceptionHandlers: 0,
          customCode: false,
          analyzedDate: "1/6/2026",
        };

  const [expandedSuggestion, setExpandedSuggestion] = useState(null);

  const handleBack = () => {
    navigate("/workspace");
  };

  const handleNext = () => {
    if (currentIndex < allWorkflows.length - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  // Get full analysis from current workflow
  const fullAnalysis = workflowData?.fullAnalysis;

  // Process activities breakdown from analysis
  const activityBreakdown = fullAnalysis?.activityBreakdown
    ? Object.entries(fullAnalysis.activityBreakdown).map(
        ([category, count]) => ({
          category,
          count,
          icon:
            category === "Control" || category === "Control Flow" ? (
              <TreeIcon />
            ) : category === "Data" || category === "Data Manipulation" ? (
              <DataIcon />
            ) : category === "UI" || category === "UI Automation" ? (
              <ConvertIcon />
            ) : category === "Excel" ? (
              <DataIcon />
            ) : (
              <ExtensionIcon />
            ),
        }),
      )
    : [
        {
          category: "Other",
          count: Number(workflowData.activities || 0),
          icon: <ExtensionIcon />,
        },
      ];

  // Process migration preview data from analysis
  const migrationData = fullAnalysis?.migration?.mappings
    ? fullAnalysis.migration.mappings.reduce((acc, current) => {
        const existing = acc.find(
          (item) => item.source === current.source_activity,
        );
        if (existing) {
          existing.count += 1;
          existing.effort += current.effort_hours || 0;
        } else {
          acc.push({
            source: current.source_activity,
            target: current.target_activity || "Complex Mapping",
            status: current.mapping_type?.toUpperCase() || "COMPLEX",
            count: 1,
            effort: current.effort_hours || 8.0,
            notes: current.notes || "AI recommends custom logic",
          });
        }
        return acc;
      }, [])
    : [
        {
          source: "Activity",
          target: "BP Equivalent",
          status: "N/A",
          count: workflowData.activities,
          effort: workflowData.effort,
          notes: "Run analysis for details",
        },
      ];

  // Use AI generated suggestions if available, otherwise fallback to generic ones
  const suggestions = fullAnalysis?.suggestions ||
    workflowData?.suggestions || [
      {
        id: 1,
        priority: "high",
        title: "Analyze with Gemini AI",
        description:
          "Run the full analysis to get personalized improvement suggestions powered by Google Gemini.",
        impact: "High",
        effort: "Low",
        benefits: [
          "Personalized insights",
          "Implementation steps",
          "Confidence scores",
        ],
        steps: ["Upload your .xaml file", "Click Analyze", "View results here"],
      },
    ];

  // Aggregates for migration preview
  const compatBreakdown = fullAnalysis?.migration?.compatibility_breakdown || {
    direct: 0,
    partial: 0,
    complex: 0,
    "n/a": 0,
  };
  const compatibilityScore = Number(
    fullAnalysis?.compatibilityScore ||
      fullAnalysis?.migration?.compatibility_score ||
      0,
  );
  const migrationEffort = Number(
    fullAnalysis?.estimatedEffortHours ||
      fullAnalysis?.migration?.total_effort_hours ||
      0,
  );
  const avgEffort = Number(fullAnalysis?.migration?.estimated_days || 0);

  return (
    <Box sx={{ minHeight: "100vh", background: "#fafbfc" }}>
      {/* App Bar */}
      <StyledAppBar position="static">
        <Toolbar>
          <IconButton onClick={handleBack} sx={{ color: "#212121", mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Logo>Workflow Analysis Details</Logo>
          {allWorkflows.length > 0 && (
            <Typography
              sx={{
                mx: 3,
                color: "#757575",
                fontWeight: 500,
                fontSize: "0.9rem",
              }}
            >
              Workflow {currentIndex + 1} of {allWorkflows.length}
            </Typography>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={() => navigate("/dashboard")}
            sx={{ color: "#757575", textTransform: "none", mr: 2 }}
          >
            Dashboard
          </Button>
          <Tooltip title="Previous Workflow">
            <IconButton
              onClick={handlePrev}
              disabled={currentIndex === 0 || allWorkflows.length === 0}
              sx={{ color: "#757575" }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Next Workflow">
            <IconButton
              onClick={handleNext}
              disabled={
                currentIndex === allWorkflows.length - 1 ||
                allWorkflows.length === 0
              }
              sx={{ color: "#757575" }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {workflowData.name}
            </Typography>
            <Chip
              label={workflowData.platform}
              size="small"
              sx={{ background: "#f3e5f5", color: "#9c27b0", fontWeight: 600 }}
            />
            <Chip
              label={workflowData.level}
              size="small"
              sx={{ background: "#ffebee", color: "#d32f2f", fontWeight: 600 }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: "#757575" }}>
            Project: {workflowData.project || "N/A"} • File:{" "}
            {workflowData.file || workflowData.name + ".xaml"} (
            {Number(workflowData.fileSize || 123.49).toFixed(2)} KB)
          </Typography>
        </Box>

        {/* Key Metrics */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <MetricCard>
            <IconWrapper bgcolor="#e3f2fd">
              <TrendingIcon sx={{ color: "#2196f3", fontSize: 28 }} />
            </IconWrapper>
            <Box>
              <Typography sx={{ fontSize: "14px", color: "#757575" }}>
                Complexity Score
              </Typography>
              <Typography sx={{ fontSize: "32px", fontWeight: 700 }}>
                {workflowData.complexity}
              </Typography>
            </Box>
          </MetricCard>

          <MetricCard>
            <IconWrapper bgcolor="#f3e5f5">
              <ExtensionIcon sx={{ color: "#9c27b0", fontSize: 28 }} />
            </IconWrapper>
            <Box>
              <Typography sx={{ fontSize: "14px", color: "#757575" }}>
                Total Activities
              </Typography>
              <Typography sx={{ fontSize: "32px", fontWeight: 700 }}>
                {workflowData.activities}
              </Typography>
            </Box>
          </MetricCard>

          <MetricCard>
            <IconWrapper bgcolor="#e8f5e9">
              <TreeIcon sx={{ color: "#4caf50", fontSize: 28 }} />
            </IconWrapper>
            <Box>
              <Typography sx={{ fontSize: "14px", color: "#757575" }}>
                Nesting Depth
              </Typography>
              <Typography sx={{ fontSize: "32px", fontWeight: 700 }}>
                {workflowData.nestingDepth || 0}
              </Typography>
            </Box>
          </MetricCard>

          <MetricCard>
            <IconWrapper bgcolor="#fff3e0">
              <TimerIcon sx={{ color: "#f57c00", fontSize: 28 }} />
            </IconWrapper>
            <Box>
              <Typography sx={{ fontSize: "14px", color: "#757575" }}>
                Estimated Effort
              </Typography>
              <Typography sx={{ fontSize: "32px", fontWeight: 700 }}>
                {workflowData.effort}h
              </Typography>
            </Box>
          </MetricCard>
        </Box>

        {/* Workflow Metadata */}
        <Card
          sx={{
            p: 3,
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Workflow Metadata
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: "13px", color: "#757575", mb: 0.5 }}>
                Variables
              </Typography>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                {workflowData.variables || 0}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: "13px", color: "#757575", mb: 0.5 }}>
                Invoked Workflows
              </Typography>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                {workflowData.invokedWorkflows || 0}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: "13px", color: "#757575", mb: 0.5 }}>
                Exception Handlers
              </Typography>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                {workflowData.exceptionHandlers || 0}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: "13px", color: "#757575", mb: 0.5 }}>
                Custom Code
              </Typography>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                {workflowData.customCode ? "Yes" : "No"}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: "13px", color: "#757575", mb: 0.5 }}>
                Analyzed
              </Typography>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                {workflowData.analyzedDate || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                color: "#757575",
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <WarningIcon sx={{ fontSize: 18, color: "#f57c00" }} />
              Risk Indicators
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {(workflowData.risks || []).map((risk, index) => (
                <RiskBadge
                  key={index}
                  label={risk}
                  severity="high"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </Card>

        {/* Activity Breakdown */}
        <Card
          sx={{
            p: 3,
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Activity Breakdown by Category
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
              gap: 2,
            }}
          >
            {activityBreakdown.map((item, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: "center",
                  p: 2,
                  background: "#fafafa",
                  borderRadius: "8px",
                }}
              >
                <Box sx={{ color: "#757575", mb: 1 }}>{item.icon}</Box>
                <Typography
                  sx={{ fontSize: "13px", color: "#757575", mb: 0.5 }}
                >
                  {item.category}
                </Typography>
                <Typography sx={{ fontSize: "28px", fontWeight: 700 }}>
                  {item.count}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>

        {/* Action Buttons */}
        <Card
          sx={{
            p: 3,
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
            mb: 3,
          }}
        >
          <Button
            onClick={() => router.push(`/workflows/${params.id}/variable-analysis`)}
            sx={{
              background: "linear-gradient(to right, #9c27b0, #e91e63)",
              color: "white",
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              py: 1.5,
              "&:hover": {
                background: "linear-gradient(to right, #7b1fa2, #c2185b)",
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Variable Analysis
            </Typography>
          </Button>
        </Card>

        {/* Migration Preview */}
        <Card
          sx={{
            p: 3,
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <ConvertIcon sx={{ color: "#5e6ff2" }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Migration Preview
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "14px", color: "#757575", mb: 2 }}>
            UiPath → BluePrism Activity Mappings
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                background: "#e8f5e9",
                borderRadius: "8px",
              }}
            >
              <CheckIcon sx={{ color: "#4caf50", fontSize: 20 }} />
              <Typography sx={{ fontSize: "24px", fontWeight: 700 }}>
                {compatBreakdown.direct}
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "#757575" }}>
                Direct
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                background: "#fff3e0",
                borderRadius: "8px",
              }}
            >
              <WarningIcon sx={{ color: "#f57c00", fontSize: 20 }} />
              <Typography sx={{ fontSize: "24px", fontWeight: 700 }}>
                {compatBreakdown.partial}
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "#757575" }}>
                Partial
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                background: "#fff3e0",
                borderRadius: "8px",
              }}
            >
              <BuildIcon sx={{ color: "#f57c00", fontSize: 20 }} />
              <Typography sx={{ fontSize: "24px", fontWeight: 700 }}>
                {compatBreakdown.complex}
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "#757575" }}>
                Complex
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                background: "#ffebee",
                borderRadius: "8px",
              }}
            >
              <ErrorIcon sx={{ color: "#d32f2f", fontSize: 20 }} />
              <Typography sx={{ fontSize: "24px", fontWeight: 700 }}>
                {compatBreakdown["n/a"]}
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "#757575" }}>
                Incompatible
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                background: "#e3f2fd",
                borderRadius: "8px",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{ fontSize: "32px", fontWeight: 700, color: "#2196f3" }}
              >
                {compatibilityScore.toFixed(1)}%
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "#757575" }}>
                Compatibility
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: "14px", color: "#757575", mb: 1 }}>
              Estimated Migration Effort
            </Typography>
            <Typography
              sx={{ fontSize: "28px", fontWeight: 700, color: "#2196f3" }}
            >
              {Number(migrationEffort).toFixed(1)} hours
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#757575" }}>
              Avg per Activity:{" "}
              {(
                Number(migrationEffort) / (Number(workflowData.activities) || 1)
              ).toFixed(1)}
              h
            </Typography>
          </Box>

          <TableContainer
            component={Paper}
            sx={{ boxShadow: "none", border: "1px solid #f0f0f0" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Source Activity
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Target Equivalent
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Count</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Effort (h)</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {migrationData.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{row.source}</TableCell>
                    <TableCell>{row.target}</TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          row.status === "DIRECT" ? (
                            <CheckIcon />
                          ) : row.status === "PARTIAL" ? (
                            <WarningIcon />
                          ) : (
                            <ErrorIcon />
                          )
                        }
                        label={row.status}
                        size="small"
                        sx={{
                          background:
                            row.status === "DIRECT"
                              ? "#e8f5e9"
                              : row.status === "PARTIAL"
                                ? "#fff3e0"
                                : "#ffebee",
                          color:
                            row.status === "DIRECT"
                              ? "#4caf50"
                              : row.status === "PARTIAL"
                                ? "#f57c00"
                                : "#d32f2f",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.count}</TableCell>
                    <TableCell>{Number(row.effort || 0).toFixed(1)}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "12px", color: "#757575" }}>
                        {row.notes}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Alert severity="info" sx={{ mt: 2, borderRadius: "8px" }}>
            <Typography sx={{ fontSize: "13px" }}>
              <strong>Legend:</strong> ✅ Direct: 11 mapping available • ⚠️
              Partial: Similar but requires adjustments • 🔧 Complex:
              Significant redesign needed • ❌ N/A: No equivalent, custom
              solution required
            </Typography>
          </Alert>
        </Card>

        {/* Improvement Suggestions */}
        <Card sx={{ p: 3, borderRadius: "12px", border: "1px solid #f0f0f0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <LightbulbIcon sx={{ color: "#ffa726", fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Improvement Suggestions
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "14px", color: "#757575", mb: 3 }}>
            Based on the analysis, here are actionable recommendations to
            improve this workflow:
          </Typography>

          {suggestions.map((suggestion) => (
            <Accordion
              key={suggestion.id}
              expanded={expandedSuggestion === suggestion.id}
              onChange={() =>
                setExpandedSuggestion(
                  expandedSuggestion === suggestion.id ? null : suggestion.id,
                )
              }
              sx={{
                mb: 2,
                borderRadius: "12px !important",
                border: "1px solid #e3f2fd",
                "&:before": { display: "none" },
                boxShadow: "none",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <RiskBadge
                    label={suggestion.priority.toUpperCase()}
                    severity={suggestion.priority}
                    size="small"
                  />
                  <Typography sx={{ fontWeight: 600, flex: 1 }}>
                    {suggestion.title}
                  </Typography>
                  <Chip
                    label={`Impact: ${suggestion.impact}`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`Effort: ${suggestion.effort}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ pl: 2 }}>
                  <Typography
                    sx={{ fontSize: "14px", color: "#757575", mb: 2 }}
                  >
                    {suggestion.description}
                  </Typography>

                  <Typography sx={{ fontSize: "14px", fontWeight: 600, mb: 1 }}>
                    Benefits:
                  </Typography>
                  <List dense>
                    {suggestion.benefits.map((benefit, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon sx={{ color: "#4caf50", fontSize: 18 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={benefit}
                          primaryTypographyProps={{ fontSize: "14px" }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, mb: 1, mt: 2 }}
                  >
                    Implementation Steps:
                  </Typography>
                  <List dense>
                    {(
                      suggestion.implementation_steps ||
                      suggestion.steps ||
                      []
                    ).map((step, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: "#5e6ff2",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            {index + 1}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={step}
                          primaryTypographyProps={{ fontSize: "14px" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Card>

        {/* Bottom Navigation Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 4,
            justifyContent: "center",
            pb: 4,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handlePrev}
            disabled={currentIndex === 0 || allWorkflows.length === 0}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              borderColor: "#e0e0e0",
              color: "#757575",
            }}
          >
            Previous Workflow
          </Button>

          <Button
            variant="contained"
            onClick={handleBack}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 4,
              background: "#212121",
              "&:hover": { background: "#424242" },
            }}
          >
            Back to List
          </Button>

          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleNext}
            disabled={
              currentIndex === allWorkflows.length - 1 ||
              allWorkflows.length === 0
            }
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              background: "linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)",
            }}
          >
            Next Workflow
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default WorkflowDetail;
