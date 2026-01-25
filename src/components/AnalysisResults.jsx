import React from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import {
  TrendingUp as TrendingIcon,
  ShowChart as ChartIcon,
  DataUsage as DataIcon,
  Warning as WarningIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
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
  ResponsiveContainer,
} from "recharts";

const AnalysisResults = ({ analysisData, onViewDetail, onDelete }) => {
  return (
    <>
      {/* Statistics Cards */}
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
          <Card
            sx={{
              p: 2.5,
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "8px",
                background: "#e3f2fd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingIcon sx={{ color: "#2196f3", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "14px", color: "#757575" }}>
                Total Processes
              </Typography>
              <Typography sx={{ fontSize: "28px", fontWeight: 700 }}>
                {analysisData.totalProcesses}
              </Typography>
            </Box>
          </Card>

          <Card
            sx={{
              p: 2.5,
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "8px",
                background: "#f3e5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChartIcon sx={{ color: "#9c27b0", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "14px", color: "#757575" }}>
                Avg Complexity Score
              </Typography>
              <Typography sx={{ fontSize: "28px", fontWeight: 700 }}>
                {analysisData.avgComplexity}
              </Typography>
            </Box>
          </Card>

          <Card
            sx={{
              p: 2.5,
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "8px",
                background: "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DataIcon sx={{ color: "#4caf50", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "14px", color: "#757575" }}>
                Total Activities
              </Typography>
              <Typography sx={{ fontSize: "28px", fontWeight: 700 }}>
                {analysisData.totalActivities}
              </Typography>
            </Box>
          </Card>

          <Card
            sx={{
              p: 2.5,
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "8px",
                background: "#ffebee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WarningIcon sx={{ color: "#f44336", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "14px", color: "#757575" }}>
                High-Risk Processes
              </Typography>
              <Typography sx={{ fontSize: "28px", fontWeight: 700 }}>
                {analysisData.highRiskProcesses}
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* Charts Section */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 3,
            mb: 3,
          }}
        >
          {/* Complexity Distribution Chart */}
          <Card
            sx={{ p: 3, borderRadius: "12px", border: "1px solid #f0f0f0" }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Complexity Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: "Low",
                    value: analysisData.processes.filter(
                      (p) => p.level === "Low",
                    ).length,
                  },
                  {
                    name: "Medium",
                    value: analysisData.processes.filter(
                      (p) => p.level === "Medium",
                    ).length,
                  },
                  {
                    name: "High",
                    value: analysisData.processes.filter(
                      (p) => p.level === "High",
                    ).length,
                  },
                  {
                    name: "Very High",
                    value: analysisData.processes.filter(
                      (p) =>
                        p.level === "Very High" || p.level === "Critical",
                    ).length,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#757575" />
                <YAxis stroke="#757575" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#ff6b6b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Activity Type Breakdown Chart */}
          <Card
            sx={{ p: 3, borderRadius: "12px", border: "1px solid #f0f0f0" }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Activity Type Breakdown
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 300,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(
                      analysisData.processes.reduce((acc, process) => {
                        const breakdown = process.activityBreakdown || {};
                        Object.entries(breakdown).forEach(([key, value]) => {
                          acc[key] = (acc[key] || 0) + value;
                        });
                        return acc;
                      }, {}),
                    ).map(([name, value]) => ({
                      name,
                      value,
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={130}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {Object.entries(
                      analysisData.processes.reduce((acc, process) => {
                        const breakdown = process.activityBreakdown || {};
                        Object.entries(breakdown).forEach(([key, value]) => {
                          acc[key] = (acc[key] || 0) + value;
                        });
                        return acc;
                      }, {}),
                    ).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [
                            "#4fc3f7",
                            "#ff6b6b",
                            "#ffa726",
                            "#ab47bc",
                            "#66bb6a",
                          ][index % 5]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Box>

        {/* Process Inventory Table */}
        <Card
          sx={{ p: 3, borderRadius: "12px", border: "1px solid #f0f0f0" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Process Inventory
            </Typography>
            <Chip label="All Levels" size="small" />
          </Box>

          <TableContainer
            component={Paper}
            sx={{ boxShadow: "none", border: "1px solid #f0f0f0" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Process Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>PLATFORM</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Complexity</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>LEVEL</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Activities</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Effort (hrs)</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    RISK INDICATORS
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analysisData.processes.map((process, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{process.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={process.platform}
                        size="small"
                        sx={{
                          background: "#f3e5f5",
                          color: "#9c27b0",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>{process.complexity}</TableCell>
                    <TableCell>
                      <Chip
                        label={process.level}
                        size="small"
                        sx={{
                          background: "#ffebee",
                          color: "#d32f2f",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>{process.activities}</TableCell>
                    <TableCell>{process.effort}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "12px", color: "#757575" }}>
                        {process.risks.join(", ")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          sx={{
                            color: "#6b7280",
                            background: "transparent",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            "&:hover": {
                              background: "#f9fafb",
                              color: "#374151",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail(process, index);
                          }}
                          title="View detailed analysis"
                        >
                          <ViewIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            color: "#2563eb",
                            "&:hover": {
                              color: "#1d4ed8",
                              background: "#eff6ff",
                            },
                          }}
                          title="Edit workflow"
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            color: "#dc2626",
                            background: "transparent",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            "&:hover": {
                              color: "#b91c1c",
                              background: "#fef2f2",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(process.workflow_id, process.name);
                          }}
                          title="Delete workflow"
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </>
    );
  };

export default AnalysisResults;