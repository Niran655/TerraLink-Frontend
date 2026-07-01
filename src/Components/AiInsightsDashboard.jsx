import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Package,
  UserCheck,
  Calendar,
  AlertTriangle,
  FileText,
  HelpCircle,
  Clock,
  SparkleIcon,
} from "lucide-react";
import { GET_KPIS, GET_HEALTH_SCORE, GET_AUDIT_LOGS } from "../../graphql/queries";

export default function AiInsightsDashboard({ tenantId, language }) {
  const [activeTab, setActiveTab] = useState(0);

  // Queries
  const { data: healthData, loading: healthLoading } = useQuery(GET_HEALTH_SCORE, {
    variables: { tenantId },
    skip: !tenantId,
  });

  const { data: kpiData, loading: kpiLoading } = useQuery(GET_KPIS, {
    variables: { tenantId },
    skip: !tenantId,
  });

  const { data: auditData, loading: auditLoading } = useQuery(GET_AUDIT_LOGS, {
    variables: { filter: { tenantId } },
    skip: !tenantId,
  });

  if (healthLoading || kpiLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const score = healthData?.healthScore || {
    overallScore: 82,
    sales: 90,
    customers: 70,
    inventory: 85,
    employees: 80,
    riskLevel: "Low",
  };

  const kpis = kpiData?.kpis || [];

  // Group recommendation categories
  const revenueRecommendations = kpis.find((k) => k.metric === "Revenue Growth")?.recommendations || [];
  const customerRecommendations = kpis.find((k) => k.metric === "Customer Retention")?.recommendations || [];
  const inventoryRecommendations = kpis.find((k) => k.metric === "Inventory Turnover")?.recommendations || [];
  const employeeRecommendations = kpis.find((k) => k.metric === "Employee Productivity")?.recommendations || [];
  const marketingRecommendations = kpis.find((k) => k.metric === "Repeat Purchase Rate")?.recommendations || [];

  // Decision Intelligence: retrieve key factors and answers dynamically based on current health/KPIs
  const salesKpi = kpis.find((k) => k.metric === "Revenue Growth");
  const churnKpi = kpis.find((k) => k.metric === "Customer Retention");
  const invKpi = kpis.find((k) => k.metric === "Inventory Turnover");

  return (
    <Box sx={{ flexGrow: 1, p: 1, color: "text.primary" }}>
      {/* Title */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="h4" fontWeight="800" sx={{ background: "linear-gradient(45deg, #10b981, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Decision Intelligence
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enterprise Business Insights Dashboard & AI Recommendations
          </Typography>
        </Box>
        <Chip
          label={`Risk Level: ${score.riskLevel}`}
          color={score.riskLevel === "Low" ? "success" : score.riskLevel === "Medium" ? "warning" : "error"}
          variant="filled"
          sx={{ fontWeight: "700", px: 2, py: 1 }}
        />
      </Box>

      {/* Grid Layout */}
      <Grid container spacing={3}>
        {/* Business Health Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              borderRadius: 3,
              minHeight: "100%",
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" fontWeight="700" color="text.secondary" mb={3}>
                Business Health Score
              </Typography>
              <Box sx={{ position: "relative", display: "inline-flex", mb: 3 }}>
                <CircularProgress
                  variant="determinate"
                  value={score.overallScore}
                  size={140}
                  thickness={6}
                  sx={{ color: score.overallScore >= 80 ? "#10b981" : score.overallScore >= 60 ? "#f59e0b" : "#ef4444" }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h3" fontWeight="900" color="text.primary">
                    {score.overallScore}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={3} px={2}>
                Your business is performing well but has potential risks in customer retention and reorders.
              </Typography>
              <Box sx={{ width: "100%", px: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Sales Performance</Typography>
                  <Typography variant="body2" fontWeight="700">{score.sales}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={score.sales} color="success" sx={{ mb: 2, borderRadius: 2, height: 6 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Customer Retention</Typography>
                  <Typography variant="body2" fontWeight="700">{score.customers}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={score.customers} color="warning" sx={{ mb: 2, borderRadius: 2, height: 6 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Inventory Health</Typography>
                  <Typography variant="body2" fontWeight="700">{score.inventory}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={score.inventory} color="primary" sx={{ mb: 2, borderRadius: 2, height: 6 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Employees Performance</Typography>
                  <Typography variant="body2" fontWeight="700">{score.employees}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={score.employees} color="info" sx={{ borderRadius: 2, height: 6 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Timeline & Decision Intelligence */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Decision Intelligence Panel */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ textAlign: "left" }}>
                  <Typography variant="h6" fontWeight="700" color="primary" gutterBottom display="flex" alignItems="center">
                    <Activity size={20} style={{ marginRight: 8 }} />
                    Decision Intelligence Questions
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" fontWeight="800" color="text.primary">
                      1. What happened?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 2, mb: 1.5 }}>
                      Monthly sales grew by {salesKpi?.value || "12.4"}%, but customer visits dropped.
                    </Typography>

                    <Typography variant="subtitle2" fontWeight="800" color="text.primary">
                      2. Why did it happen?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 2, mb: 1.5 }}>
                      Factors include: {salesKpi?.topFactors?.join(", ") || "Rainy season, Competitor opening nearby"}.
                    </Typography>

                    <Typography variant="subtitle2" fontWeight="800" color="text.primary">
                      3. What should I do next?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 2, mb: 1.5 }}>
                      {salesKpi?.recommendations?.[0] || "Launch promotional campaigns"}, or reorder {invKpi?.topFactors?.[0] || "low stock items"}.
                    </Typography>

                    <Typography variant="subtitle2" fontWeight="800" color="text.primary">
                      4. What impact will it have?
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ pl: 2, fontWeight: "600" }}>
                      Estimated revenue increase: {salesKpi?.estimatedImpact?.revenueIncrease || "+8%"}.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* AI Timeline */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ textAlign: "left" }}>
                  <Typography variant="h6" fontWeight="700" color="primary" gutterBottom display="flex" alignItems="center">
                    <Clock size={20} style={{ marginRight: 8 }} />
                    AI Prediction & Operations Timeline
                  </Typography>
                  <Box sx={{ mt: 2, position: "relative", pl: 3, borderLeft: "2px solid rgba(255,255,255,0.1)" }}>
                    <Box sx={{ mb: 2, position: "relative" }}>
                      <Box sx={{ position: "absolute", left: -31, top: 4, width: 12, height: 12, borderRadius: "50%", bgcolor: "grey.600" }} />
                      <Typography variant="caption" color="text.secondary" fontWeight="700">YESTERDAY</Typography>
                      <Typography variant="body2">Sales drop of {salesKpi?.trend?.includes("Down") ? salesKpi.trend.split(" ")[1] : "5%"} was mitigated by active promotions.</Typography>
                    </Box>
                    <Box sx={{ mb: 2, position: "relative" }}>
                      <Box sx={{ position: "absolute", left: -31, top: 4, width: 12, height: 12, borderRadius: "50%", bgcolor: "warning.main" }} />
                      <Typography variant="caption" color="warning.main" fontWeight="700">TODAY</Typography>
                      <Typography variant="body2">Low safety stock alert triggered. Churn check completed for worst segment.</Typography>
                    </Box>
                    <Box sx={{ position: "relative" }}>
                      <Box sx={{ position: "absolute", left: -31, top: 4, width: 12, height: 12, borderRadius: "50%", bgcolor: "success.main" }} />
                      <Typography variant="caption" color="success.main" fontWeight="700">TOMORROW (EXPECTED)</Typography>
                      <Typography variant="body2">Sales forecast: {salesKpi?.estimatedImpact?.revenueIncrease || "increase by 8%"} expected if promo triggers.</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Recommendations engine */}
      <Card
        sx={{
          mt: 4,
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ textAlign: "left" }}>
          <Typography variant="h6" fontWeight="700" color="primary" gutterBottom display="flex" alignItems="center">
            <SparkleIcon size={20} style={{ marginRight: 8 }} />
            Actionable AI Recommendations
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
            <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} textColor="primary" indicatorColor="primary">
              <Tab label="Revenue" />
              <Tab label="Marketing" />
              <Tab label="Inventory" />
              <Tab label="Customer" />
              <Tab label="Employee" />
            </Tabs>
          </Box>
          <Box sx={{ p: 2 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="subtitle2" mb={1} color="text.secondary">Proposed Actions:</Typography>
                {revenueRecommendations.map((action, i) => (
                  <Typography key={i} variant="body2" mb={1}>✅ {action}</Typography>
                ))}
              </Box>
            )}
            {activeTab === 1 && (
              <Box>
                <Typography variant="subtitle2" mb={1} color="text.secondary">Proposed Campaigns:</Typography>
                {marketingRecommendations.map((action, i) => (
                  <Typography key={i} variant="body2" mb={1}>📢 {action}</Typography>
                ))}
              </Box>
            )}
            {activeTab === 2 && (
              <Box>
                <Typography variant="subtitle2" mb={1} color="text.secondary">Reorder & Stock Suggestions:</Typography>
                {inventoryRecommendations.map((action, i) => (
                  <Typography key={i} variant="body2" mb={1}>📦 {action}</Typography>
                ))}
              </Box>
            )}
            {activeTab === 3 && (
              <Box>
                <Typography variant="subtitle2" mb={1} color="text.secondary">Retention Campaigns:</Typography>
                {customerRecommendations.map((action, i) => (
                  <Typography key={i} variant="body2" mb={1}>👤 {action}</Typography>
                ))}
              </Box>
            )}
            {activeTab === 4 && (
              <Box>
                <Typography variant="subtitle2" mb={1} color="text.secondary">Attendance & Training Rules:</Typography>
                {employeeRecommendations.map((action, i) => (
                  <Typography key={i} variant="body2" mb={1}>💼 {action}</Typography>
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card
        sx={{
          mt: 4,
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ textAlign: "left" }}>
          <Typography variant="h6" fontWeight="700" color="primary" gutterBottom display="flex" alignItems="center">
            <FileText size={20} style={{ marginRight: 8 }} />
            AI Audit Log
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2, background: "transparent", border: "none", boxShadow: "none" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "700" }}>Question</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "700" }}>Model Used</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "700" }}>Accessed Modules</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "700" }}>Response Preview</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: "700" }}>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditData?.auditLogs?.slice(0, 5).map((log, i) => (
                  <TableRow key={i}>
                    <TableCell>{log.question}</TableCell>
                    <TableCell><Chip label={log.modelUsed} size="small" variant="outlined" color="primary" /></TableCell>
                    <TableCell>{log.modulesAccessed.join(", ")}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {log.response || "No reply"}
                    </TableCell>
                    <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                )) || (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No audit logs found</TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
