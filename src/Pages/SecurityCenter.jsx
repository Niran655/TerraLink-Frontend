import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import {
  Shield,
  ShieldCheck,
  Smartphone,
  Globe,
  AlertTriangle,
  BrainCircuit,
  DatabaseBackup,
  HardDrive,
  Lock,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  CloudDownload,
  Trash2,
  Key,
  Mail,
  Heart,
  CheckCircle,
  XCircle,
  FileText,
  User,
  ShoppingBag,
  Box as BoxIcon,
  Users,
  Tag,
  DollarSign,
  FileBarChart,
  Laptop,
  MonitorPlay,
  Activity,
  LineChart,
  BarChart,
  AreaChart,
} from "lucide-react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { SecurityCenterSkeleton } from "../include/Skeletons";
import Chart from "react-apexcharts";

// Queries and Mutations
const GET_SECURITY_DASHBOARD = gql`
  query GetSecurityDashboard {
    getSecurityDashboard {
      securityScore
      activeSessionsCount
      failedLoginsCount
      aiRequestsCount
      connectedAccountsCount
      backupsCount
      storageUsed
    }
  }
`;

const GET_ACTIVE_SESSIONS = gql`
  query GetActiveSessions {
    getActiveSessions {
      id
      device
      browser
      os
      ipAddress
      location
      lastActive
      active
      current
    }
  }
`;

const GET_LOGIN_HISTORY = gql`
  query GetLoginHistory {
    getLoginHistory {
      id
      date
      device
      browser
      ipAddress
      location
      status
      reason
    }
  }
`;

const GET_AI_LOGS = gql`
  query GetAIAuditLogs {
    getAIAuditLogs {
      id
      date
      user
      question
      provider
      modulesAccessed
      status
    }
  }
`;

const GET_AI_PERMISSIONS = gql`
  query GetAIPermissions {
    getAIPermissions {
      sales
      orders
      inventory
      customers
      promotions
      attendance
      payroll
      financialStatements
      supplierContracts
      employeePersonalData
      apiKeys
    }
  }
`;

const GET_ACCOUNT_SECURITY = gql`
  query GetAccountSecurity {
    getAccountSecurity {
      twoFactorEnabled
      recoveryEmail
      trustedDevices
      passwordUpdatedAt
      securityScore
    }
  }
`;

const GET_FACEBOOK_PAGES = gql`
  query GetFacebookPages($shopId: ID) {
    facebookPages(shopId: $shopId) {
      _id
      pageId
      pageName
      pageCategory
      pagePicture
      active
      lastSyncedAt
      tokenExpiresAt
    }
  }
`;

const LOGOUT_ALL_SESSIONS = gql`
  mutation LogoutAllSessions {
    logoutAllSessions {
      isSuccess
      message {
        messageEn
      }
    }
  }
`;

const REVOKE_SESSION = gql`
  mutation RevokeSession($id: ID!) {
    revokeSession(id: $id) {
      isSuccess
      message {
        messageEn
      }
    }
  }
`;

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.08H5.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function SecurityCenter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const activeShopId = localStorage.getItem("activeShopId");

  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [trendsChartType, setTrendsChartType] = useState("line");

  // Query Hooks
  const { data: dashboardData, loading: dashboardLoading } = useQuery(GET_SECURITY_DASHBOARD, { fetchPolicy: "network-only" });
  const { data: sessionsData, loading: sessionsLoading, refetch: refetchSessions } = useQuery(GET_ACTIVE_SESSIONS, { fetchPolicy: "network-only" });
  const { data: loginHistoryData, loading: historyLoading } = useQuery(GET_LOGIN_HISTORY, { fetchPolicy: "network-only" });
  const { data: aiLogsData, loading: aiLogsLoading } = useQuery(GET_AI_LOGS, { fetchPolicy: "network-only" });
  const { data: aiPermissionsData, loading: aiPermissionsLoading } = useQuery(GET_AI_PERMISSIONS, { fetchPolicy: "network-only" });
  const { data: accountSecurityData, loading: accountSecurityLoading } = useQuery(GET_ACCOUNT_SECURITY, { fetchPolicy: "network-only" });
  const { data: fbPagesData, loading: fbPagesLoading } = useQuery(GET_FACEBOOK_PAGES, { variables: { shopId: activeShopId || "" }, fetchPolicy: "network-only" });

  // Mutation Hooks
  const [logoutAll, { loading: loggingOutAll }] = useMutation(LOGOUT_ALL_SESSIONS);
  const [revokeSession] = useMutation(REVOKE_SESSION);

  const handleLogoutAll = async () => {
    try {
      const { data: res } = await logoutAll();
      if (res?.logoutAllSessions?.isSuccess) {
        setToast({ open: true, message: res.logoutAllSessions.message.messageEn, severity: "success" });
        refetchSessions();
      }
    } catch (err) {
      setToast({ open: true, message: "Failed to logout all sessions.", severity: "error" });
    }
  };

  const handleRevoke = async (id) => {
    try {
      const { data: res } = await revokeSession({ variables: { id } });
      if (res?.revokeSession?.isSuccess) {
        setToast({ open: true, message: res.revokeSession.message.messageEn, severity: "success" });
        refetchSessions();
      }
    } catch (err) {
      setToast({ open: true, message: "Failed to revoke session.", severity: "error" });
    }
  };

  const getDeviceIcon = (device) => {
    const d = device?.toLowerCase() || "";
    if (d.includes("mobile") || d.includes("iphone") || d.includes("android")) return <Smartphone size={20} color="#555" />;
    if (d.includes("mac") || d.includes("windows") || d.includes("linux")) return <Laptop size={20} color="#555" />;
    return <MonitorPlay size={20} color="#555" />;
  };

  const score = dashboardData?.getSecurityDashboard?.securityScore ?? 75;
  const activeSessions = sessionsData?.getActiveSessions || [];
  const loginHistory = loginHistoryData?.getLoginHistory || [];
  const aiLogs = aiLogsData?.getAIAuditLogs || [];
  const aiPermissions = aiPermissionsData?.getAIPermissions || {};
  const is2FAEnabled = accountSecurityData?.getAccountSecurity?.twoFactorEnabled || false;
  const connectedPages = fbPagesData?.facebookPages || [];

  const isLoading = dashboardLoading || sessionsLoading || historyLoading || aiLogsLoading || aiPermissionsLoading || accountSecurityLoading || fbPagesLoading;

  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
        <SecurityCenterSkeleton />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>

      {/* Banner Card */}
      <Paper
        sx={{
          p: 3,
          mb: 4,

          bgcolor: "rgba(25, 118, 210, 0.04)",
          border: "1px solid",
          borderColor: "rgba(25, 118, 210, 0.12)",
          boxShadow: "none"
        }}
      >
        <Grid container spacing={3} alignItems="center" justifyContent="space-between">
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start" textAlign="start">
              <Box sx={{ p: 1.5, color: "white", mt: 0.5 }}>
                <Shield size={24} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="700" color="text.primary">Your data belongs to you</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  TerraLink only stores and processes your data to provide services. You have full control over your business data.
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: "start", md: "right" } }}>
            <Stack direction="row" spacing={2} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CloudDownload size={18} />}
                onClick={() => navigate('/setting/export-backup')}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Export Data
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Trash2 size={18} />}
                onClick={() => navigate('/setting/data-ownership')}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Delete Account
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Metrics Row */}
      <Grid container spacing={3} mb={4}>
        {/* Metric 1: Account Security */}
        <Grid size={{ xs: 12, sm: 6, lg: 2.4, md: 4 }}>
          <Paper
            onClick={() => navigate('/setting/account-security')}
            sx={{ p: 3, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", cursor: "pointer", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", textAlign: "start" }}
          >
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ p: 1, bgcolor: "rgba(76, 175, 80, 0.1)", color: "#4CAF50" }}>
                  <ShieldCheck size={24} />
                </Box>
                <Chip label="Secure" size="small" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
              </Stack>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="600">Account Security</Typography>
                <Typography variant="h6" fontWeight="700" color="text.primary" mt={0.5}>Your account is secure</Typography>
              </Box>
            </Stack>
            <Box sx={{ mt: 3, pt: 1.5, borderTop: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption" color="text.secondary">Two-Factor Auth</Typography>
              <Typography variant="caption" color={is2FAEnabled ? "success.main" : "warning.main"} fontWeight="700">
                {is2FAEnabled ? "Enabled" : "Disabled"}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Metric 2: Active Sessions */}
        <Grid size={{ xs: 12, sm: 6, lg: 2.4, md: 4 }}>
          <Paper
            onClick={() => navigate('/setting/active-sessions')}
            sx={{ p: 3, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", cursor: "pointer", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", textAlign: "start" }}
          >
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ p: 1, bgcolor: "rgba(156, 39, 176, 0.1)", color: "#9C27B0" }}>
                  <Laptop size={24} />
                </Box>
              </Stack>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="600">Active Sessions</Typography>
                <Typography variant="h4" fontWeight="800" color="text.primary" mt={0.5}>
                  {activeSessions.length || dashboardData?.getSecurityDashboard?.activeSessionsCount || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">Active sessions</Typography>
              </Box>
            </Stack>
            <Box sx={{ mt: 3, pt: 1.5, borderTop: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" color="text.secondary">View all sessions</Typography>
              <ChevronRight size={14} style={{ color: "#aaa" }} />
            </Box>
          </Paper>
        </Grid>

        {/* Metric 3: Login Alerts */}
        <Grid size={{ xs: 12, sm: 6, lg: 2.4, md: 4 }}>
          <Paper
            onClick={() => navigate('/setting/security-alerts')}
            sx={{ p: 3, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", cursor: "pointer", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", textAlign: "start" }}
          >
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ p: 1, bgcolor: "rgba(255, 152, 0, 0.1)", color: "#FF9800", borderRadius: 1 }}>
                  <AlertTriangle size={24} />
                </Box>
              </Stack>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="600">Login Alerts</Typography>
                <Typography variant="h4" fontWeight="800" color="text.primary" mt={0.5}>
                  {dashboardData?.getSecurityDashboard?.failedLoginsCount || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">Recent alerts</Typography>
              </Box>
            </Stack>
            <Box sx={{ mt: 3, pt: 1.5, borderTop: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption" color={dashboardData?.getSecurityDashboard?.failedLoginsCount ? "error.main" : "success.main"} fontWeight="700">
                {dashboardData?.getSecurityDashboard?.failedLoginsCount ? "Action Required" : "All clear"}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Metric 4: AI Requests */}
        <Grid size={{ xs: 12, sm: 6, lg: 2.4, md: 4 }}>
          <Paper
            onClick={() => navigate('/setting/ai-activity-logs')}
            sx={{ p: 3, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", cursor: "pointer", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", textAlign: "start" }}
          >
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ p: 1, bgcolor: "rgba(33, 150, 243, 0.1)", color: "#2196F3" }}>
                  <BrainCircuit size={24} />
                </Box>
              </Stack>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="600">AI Requests (This Month)</Typography>
                <Stack direction="row" spacing={1} alignItems="baseline" mt={0.5}>
                  <Typography variant="h4" fontWeight="800" color="text.primary">
                    {dashboardData?.getSecurityDashboard?.aiRequestsCount || 0}
                  </Typography>
                  <Chip label="↓ 12%" size="small" color="success" sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }} />
                </Stack>
                <Typography variant="caption" color="text.secondary">vs last month</Typography>
              </Box>
            </Stack>
            <Box sx={{ mt: 3, pt: 1.5, borderTop: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" color="text.secondary">View AI logs</Typography>
              <ChevronRight size={14} style={{ color: "#aaa" }} />
            </Box>
          </Paper>
        </Grid>

        {/* Metric 5: Security Observability */}
        <Grid size={{ xs: 12, sm: 6, lg: 2.4, md: 4 }}>
          <Paper
            onClick={() => navigate('/setting/security-observability')}
            sx={{ p: 3, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", cursor: "pointer", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", textAlign: "start" }}
          >
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ p: 1, bgcolor: "rgba(2, 136, 209, 0.1)", color: "#0288d1" }}>
                  <Activity size={24} />
                </Box>
                <Chip label="Live" size="small" color="info" variant="outlined" sx={{ fontWeight: 600 }} />
              </Stack>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="600">API Observability</Typography>
                <Typography variant="h6" fontWeight="700" color="text.primary" mt={0.5}>Monitor API Health</Typography>
              </Box>
            </Stack>
            <Box sx={{ mt: 3, pt: 1.5, borderTop: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" color="text.secondary">View request & mutation logs</Typography>
              <ChevronRight size={14} style={{ color: "#aaa" }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Security Trends Chart Card */}
      <Paper sx={{ p: 3, mb: 4, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "background.paper" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Box textAlign="start">
            <Typography variant="subtitle1" fontWeight="700">Security & API Event Trends</Typography>
            <Typography variant="caption" color="text.secondary">
              Progression log of authentication requests and generated security warnings.
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} sx={{ bgcolor: "action.hover", p: 0.5, borderRadius: 1.5 }}>
            <IconButton size="small" onClick={() => setTrendsChartType("line")} color={trendsChartType === "line" ? "primary" : "default"}>
              <LineChart size={16} />
            </IconButton>
            <IconButton size="small" onClick={() => setTrendsChartType("bar")} color={trendsChartType === "bar" ? "primary" : "default"}>
              <BarChart size={16} />
            </IconButton>
            <IconButton size="small" onClick={() => setTrendsChartType("area")} color={trendsChartType === "area" ? "primary" : "default"}>
              <AreaChart size={16} />
            </IconButton>
          </Stack>
        </Stack>
        <Box sx={{ width: "100%", height: 260 }}>
          <Chart
            options={{
              chart: { id: "security-trends-chart", toolbar: { show: false }, background: "transparent" },
              theme: { mode: "dark" },
              colors: ["#2196F3", "#F44336"],
              stroke: { curve: "smooth", width: 2.5 },
              xaxis: {
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                labels: { style: { colors: "#888888" } }
              },
              yaxis: { labels: { style: { colors: "#888888" } } },
              grid: { borderColor: "rgba(255, 255, 255, 0.08)", strokeDashArray: 4 },
              tooltip: { theme: "dark" }
            }}
            series={[
              { name: "API Requests", data: [65, 82, 70, 54, 91, 68, 77] },
              { name: "Security Alerts", data: [0, 1, 0, 2, 0, 0, 1] }
            ]}
            type={trendsChartType}
            height="100%"
          />
        </Box>
      </Paper>

      {/* Row 1: Active Sessions & Connected Accounts */}
      <Grid container spacing={3} mb={4}>

        {/* Active Sessions Widget */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="700" color="text.primary">Active Sessions</Typography>
                <Button component={RouterLink} to="/setting/active-sessions" variant="text" size="small" sx={{ fontWeight: 600, textTransform: "none" }}>
                  View All
                </Button>
              </Stack>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>DEVICE</TableCell>
                      <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>LOCATION</TableCell>
                      <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>IP ADDRESS</TableCell>
                      <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>LAST ACTIVE</TableCell>
                      <TableCell sx={{ color: "text.secondary", fontWeight: 600 }} align="right">ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeSessions.length > 0 ? (
                      activeSessions.slice(0, 2).map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            <Stack direction="row" spacing={1.5} alignItems="center" textAlign="start">
                              {getDeviceIcon(session.device)}
                              <Box>
                                <Typography variant="body2" fontWeight="600">{session.device} • {session.os}</Typography>
                                <Typography variant="caption" color="text.secondary">{session.browser}</Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center" textAlign="start">
                              <Typography variant="body2">🇰🇭</Typography>
                              <Typography variant="body2">{session.location || "Phnom Penh, Cambodia"}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{session.ipAddress}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: session.current ? "success.main" : "text.disabled" }} />
                              <Typography variant="body2">{session.current ? "Now" : "10m ago"}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            {session.current ? (
                              <Chip label="Current" size="small" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
                            ) : (
                              <Button
                                variant="text"
                                color="error"
                                size="small"
                                onClick={() => handleRevoke(session.id)}
                                sx={{ textTransform: "none", fontWeight: 600 }}
                              >
                                Logout
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // Mock Row fallback
                      <>
                        <TableRow>
                          <TableCell>
                            <Stack direction="row" spacing={1.5} alignItems="center" textAlign="start">
                              <Laptop size={20} color="#555" />
                              <Box>
                                <Typography variant="body2" fontWeight="600">Windows • Chrome</Typography>
                                <Typography variant="caption" color="text.secondary">Desktop</Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center" textAlign="start">
                              <Typography variant="body2">🇰🇭</Typography>
                              <Typography variant="body2">Phnom Penh, Cambodia</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>103.26.12.45</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "success.main" }} />
                              <Typography variant="body2">Now</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <Chip label="Current" size="small" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Stack direction="row" spacing={1.5} alignItems="center" textAlign="start">
                              <Smartphone size={20} color="#555" />
                              <Box>
                                <Typography variant="body2" fontWeight="600">iPhone 14 • Safari</Typography>
                                <Typography variant="caption" color="text.secondary">Mobile</Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center" textAlign="start">
                              <Typography variant="body2">🇰🇭</Typography>
                              <Typography variant="body2">Siem Reap, Cambodia</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>118.70.12.33</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "text.disabled" }} />
                              <Typography variant="body2">10m ago</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <Button variant="text" color="error" size="small" sx={{ textTransform: "none", fontWeight: 600 }}>
                              Logout
                            </Button>
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box mt={2} textAlign="center">
              <Button
                variant="text"
                color="error"
                onClick={handleLogoutAll}
                disabled={loggingOutAll}
                sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.85rem" }}
              >
                Logout All Other Sessions
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Connected Accounts Widget */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", height: "100%", textAlign: "start" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="700" color="text.primary">Connected Accounts</Typography>
              <Button component={RouterLink} to="/setting/social-accounts" variant="text" size="small" sx={{ fontWeight: 600, textTransform: "none" }}>
                Manage
              </Button>
            </Stack>

            <List disablePadding>
              {/* Google Integration */}
              <ListItem
                disableGutters
                secondaryAction={
                  <Chip label="Connected" size="small" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
                }
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1, bgcolor: "action.hover" }}>
                    <GoogleIcon />
                  </Box>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="700">Google Account</Typography>}
                    secondary={<Typography variant="caption" color="text.secondary">{user?.email || "niranroem@gmail.com"}</Typography>}
                  />
                </Stack>
              </ListItem>

              <Divider sx={{ my: 1.5 }} />

              {/* Facebook Integration */}
              <ListItem
                disableGutters
                secondaryAction={
                  connectedPages.length > 0 ? (
                    <Chip label="Connected" size="small" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      component={RouterLink}
                      to="/setting/social-accounts"
                      sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                      Connect
                    </Button>
                  )
                }
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1, bgcolor: "action.hover" }}>
                    <FacebookIcon />
                  </Box>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="700">Facebook Page</Typography>}
                    secondary={<Typography variant="caption" color="text.secondary">{connectedPages[0]?.pageName || "Terra Coffee Shop"}</Typography>}
                  />
                </Stack>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Row 2: Breakdown Row */}
      <Grid container spacing={3} mb={4}>

        {/* Recent Login History */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", height: "100%", textAlign: "start" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body1" fontWeight="700" color="text.primary">Recent Login History</Typography>
              <Button component={RouterLink} to="/setting/login-history" variant="text" size="small" sx={{ fontWeight: 600, textTransform: "none", fontSize: "0.8rem" }}>
                View All
              </Button>
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.75rem", p: 1 }}>DATE & TIME</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.75rem", p: 1 }}>DEVICE & BROWSER</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.75rem", p: 1 }}>IP ADDRESS</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.75rem", p: 1 }} align="right">STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loginHistory.length > 0 ? (
                    loginHistory.slice(0, 3).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>
                          {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          <br />
                          {new Date(item.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>
                          <Typography variant="caption" fontWeight="600">{item.device}</Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">{item.browser}</Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>{item.ipAddress}</TableCell>
                        <TableCell sx={{ p: 1 }} align="right">
                          <Chip
                            label={item.status === "SUCCESS" ? "Success" : "Failed"}
                            size="small"
                            color={item.status === "SUCCESS" ? "success" : "error"}
                            sx={{ height: 18, fontSize: "0.65rem", fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    // Fallback rows matching mockup
                    <>
                      <TableRow>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>
                          Jun 28, 2026
                          <br />
                          10:30 AM
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>
                          Windows
                          <br />
                          Chrome
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>103.26.12.45</TableCell>
                        <TableCell sx={{ p: 1 }} align="right">
                          <Chip label="Success" size="small" color="success" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 600 }} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>
                          Jun 28, 2026
                          <br />
                          09:15 AM
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>
                          iPhone
                          <br />
                          Safari
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>118.70.12.33</TableCell>
                        <TableCell sx={{ p: 1 }} align="right">
                          <Chip label="Success" size="small" color="success" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 600 }} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>
                          Jun 27, 2026
                          <br />
                          08:40 PM
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>
                          Android
                          <br />
                          Chrome
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>122.155.22.10</TableCell>
                        <TableCell sx={{ p: 1 }} align="right">
                          <Chip label="Failed" size="small" color="error" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 600 }} />
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* AI Access Permissions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", height: "100%", textAlign: "start" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body1" fontWeight="700" color="text.primary">AI Access Permissions</Typography>
              <Button component={RouterLink} to="/setting/ai-permissions" variant="text" size="small" sx={{ fontWeight: 600, textTransform: "none", fontSize: "0.8rem" }}>
                Manage
              </Button>
            </Stack>

            <List disablePadding>
              {[
                { key: "sales", label: "Sales", icon: <ShoppingBag size={16} /> },
                { key: "inventory", label: "Inventory", icon: <BoxIcon size={16} /> },
                { key: "customers", label: "Customers", icon: <Users size={16} /> },
                { key: "promotions", label: "Promotions", icon: <Tag size={16} /> },
                { key: "payroll", label: "Payroll", icon: <DollarSign size={16} /> },
                { key: "financialStatements", label: "Financial Statements", icon: <FileBarChart size={16} /> },
              ].map((perm) => {
                const isAllowed = aiPermissions[perm.key] !== false; // default allowed
                return (
                  <ListItem
                    key={perm.key}
                    disableGutters
                    sx={{ py: 0.75 }}
                    secondaryAction={
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        {isAllowed ? (
                          <>
                            <CheckCircle size={14} color="#4CAF50" />
                            <Typography variant="caption" color="success.main" fontWeight="600">Allowed</Typography>
                          </>
                        ) : (
                          <>
                            <XCircle size={14} color="#F44336" />
                            <Typography variant="caption" color="error.main" fontWeight="600">Blocked</Typography>
                          </>
                        )}
                      </Stack>
                    }
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center" }}>
                        {perm.icon}
                      </Box>
                      <Typography variant="body2" color="text.primary">{perm.label}</Typography>
                    </Stack>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* AI Activity */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", height: "100%", textAlign: "start" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body1" fontWeight="700" color="text.primary">AI Activity (Recent)</Typography>
              <Button component={RouterLink} to="/setting/ai-activity-logs" variant="text" size="small" sx={{ fontWeight: 600, textTransform: "none", fontSize: "0.8rem" }}>
                View All
              </Button>
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.75rem", p: 1 }}>QUESTION</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.75rem", p: 1 }}>MODULES ACCESSED</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.75rem", p: 1 }} align="right">DATE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {aiLogs.length > 0 ? (
                    aiLogs.slice(0, 3).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem", maxWidth: 120 }}>
                          <Typography variant="caption" noWrap display="block" title={log.question}>
                            {log.question}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>
                          <Typography variant="caption" color="text.secondary">
                            {log.modulesAccessed?.join(", ") || "General"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }} align="right">
                          {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    // Fallback rows matching mockup
                    <>
                      <TableRow>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem", maxWidth: 120 }}>
                          <Typography variant="caption" noWrap display="block" title="Why did sales decrease this month?">
                            Why did sales decrease this month?
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>
                          <Typography variant="caption" color="text.secondary">
                            Sales, Orders, Customers
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }} align="right">Jun 28</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem", maxWidth: 120 }}>
                          <Typography variant="caption" noWrap display="block" title="What products are low in stock?">
                            What products are low in stock?
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>
                          <Typography variant="caption" color="text.secondary">
                            Inventory, Products
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }} align="right">Jun 28</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem", maxWidth: 120 }}>
                          <Typography variant="caption" noWrap display="block" title="Customer purchase behavior?">
                            Customer purchase behavior?
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }}>
                          <Typography variant="caption" color="text.secondary">
                            Customers, Sales
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1, fontSize: "0.75rem" }} align="right">Jun 27</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer Info Banner */}
      <Paper
        sx={{
          p: 2.5,

          bgcolor: "action.hover",
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider"
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between" textAlign="start">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ color: "primary.main", display: "flex", alignItems: "center" }}>
              <Lock size={20} />
            </Box>
            <Typography variant="body2" color="text.secondary" fontWeight="500">
              <strong>Your security is our priority.</strong> We use encryption, secure servers, and strict access controls to keep your data safe.
            </Typography>
          </Stack>
          <Button
            component={RouterLink}
            to="/privacy"
            variant="text"
            endIcon={<ExternalLink size={14} />}
            sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.85rem" }}
          >
            Learn more about security
          </Button>
        </Stack>
      </Paper>

      {/* Snackbar Toasts */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>

    </Box>
  );
}