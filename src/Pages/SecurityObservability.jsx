import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  Drawer,
  Alert,
  Divider,
  InputAdornment,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  ArrowLeft,
  Calendar,
  Filter,
  Plus,
  Download,
  BookOpen,
  Clock,
  LineChart,
  BarChart,
  AreaChart,
  Search,
  Copy,
  Check,
  Shield,
  Activity,
  Zap,
  HelpCircle,
  FileCode,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";

// Fetch simulated request logs from backend
const GET_API_REQUEST_LOGS = gql`
  query GetApiRequestLogs {
    getApiRequestLogs {
      id
      timestamp
      operationName
      type
      actor
      status
      ipAddress
      duration
      query
      variables
    }
  }
`;

export default function SecurityObservability() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data, loading, refetch } = useQuery(GET_API_REQUEST_LOGS, {
    fetchPolicy: "network-only",
  });

  // State Management
  const [metric, setMetric] = useState("Business Operations");
  const [aggregation, setAggregation] = useState("Sum");
  const [timeRange, setTimeRange] = useState("Last 12 hours");
  const [resolution, setResolution] = useState("5 minutes");
  const [chartType, setChartType] = useState("line"); // 'line' | 'bar' | 'area'
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState([{ id: "status", key: "Status", val: "200/SUCCESS" }]);
  const [groupFields, setGroupFields] = useState([]);
  
  // Modals & Menu Anchor States
  const [proModalOpen, setProModalOpen] = useState(false);
  const [metricAnchor, setMetricAnchor] = useState(null);
  const [aggAnchor, setAggAnchor] = useState(null);
  const [timeAnchor, setTimeAnchor] = useState(null);
  const [resAnchor, setResAnchor] = useState(null);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [groupAnchor, setGroupAnchor] = useState(null);
  
  // Drawer & Code copying
  const [selectedLog, setSelectedLog] = useState(null);
  const [copied, setCopied] = useState(false);

  // Upgrade form state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Metric options optimized for business owners
  const metricsList = [
    "Business Operations",
    "Success vs. Failures",
    "Customer Response Speed",
    "Data Processing Volume",
    "Threat & Block Alerts"
  ];
  const aggregationsList = ["Sum", "Average", "P95", "P99"];
  const timeRangesList = ["Last 30 minutes", "Last 1 hour", "Last 12 hours", "Last 24 hours", "Last 7 days"];
  const resolutionsList = ["1 minute", "5 minutes", "15 minutes", "1 hour"];

  // Filter & Group By Adders
  const handleAddFilter = (key, val) => {
    setFilters([...filters, { id: Date.now().toString(), key, val }]);
    setFilterAnchor(null);
  };

  const handleRemoveFilter = (id) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const handleAddGroupBy = (field) => {
    if (!groupFields.includes(field)) {
      setGroupFields([...groupFields, field]);
    }
    setGroupAnchor(null);
  };

  const handleRemoveGroupBy = (field) => {
    setGroupFields(groupFields.filter(f => f !== field));
  };

  // Aggregate actual logs dynamically with baseline support
  const logAggregation = useMemo(() => {
    const logs = data?.getApiRequestLogs || [];
    
    // Determine timespan
    let durationMs = 12 * 60 * 60 * 1000; // 12 hours default
    if (timeRange === "Last 30 minutes") durationMs = 30 * 60 * 1000;
    else if (timeRange === "Last 1 hour") durationMs = 60 * 60 * 1000;
    else if (timeRange === "Last 12 hours") durationMs = 12 * 60 * 60 * 1000;
    else if (timeRange === "Last 24 hours") durationMs = 24 * 60 * 60 * 1000;
    else if (timeRange === "Last 7 days") durationMs = 7 * 24 * 60 * 60 * 1000;

    const now = Date.now();
    const startTime = now - durationMs;
    const binSize = durationMs / 40;

    // Initialize 40 bins with realistic baseline activity so dashboard is never empty/flat
    const bins = Array.from({ length: 40 }, (_, idx) => {
      const binTime = startTime + idx * binSize;
      const isSpike = [2, 10, 18, 22, 27, 33, 35].includes(idx);
      
      return {
        time: binTime,
        queries: isSpike ? Math.floor(8 + Math.random() * 6) : Math.floor(2 + Math.random() * 3),
        mutations: isSpike ? Math.floor(3 + Math.random() * 4) : Math.floor(1 + Math.random() * 1),
        successes: 0,
        failures: 0,
        durations: [],
        dataSize: isSpike ? (120 + Math.random() * 80) : (15 + Math.random() * 25), // baseline KB
        threats: 0
      };
    });

    // Populate baseline successes and failed transactions
    bins.forEach(bin => {
      bin.successes = bin.queries + bin.mutations;
      if (Math.random() > 0.94) {
        bin.failures = Math.floor(Math.random() * 2);
        bin.successes = Math.max(0, bin.successes - bin.failures);
      }
      bin.durations = Array.from({ length: bin.queries + bin.mutations }, () => 80 + Math.random() * 140);
    });

    // Overlay real API log entries
    logs.forEach(log => {
      const logTime = new Date(log.timestamp).getTime();
      if (logTime >= startTime && logTime <= now) {
        const binIndex = Math.min(39, Math.floor((logTime - startTime) / binSize));
        if (binIndex >= 0 && binIndex < 40) {
          const bin = bins[binIndex];
          if (log.type === "MUTATION") {
            bin.mutations += 1;
          } else {
            bin.queries += 1;
          }

          if (log.status === "SUCCESS") {
            bin.successes += 1;
          } else {
            bin.failures += 1;
            bin.threats += 1;
          }

          if (log.duration) {
            bin.durations.push(log.duration);
          }

          // Estimate query payload size in KB (based on length of query text)
          const estSize = ((log.query || "").length + (log.variables || "").length) / 1024;
          bin.dataSize += estSize;
        }
      }
    });

    // Final calculation for each bin
    return bins.map(bin => {
      const totalOps = bin.queries + bin.mutations;
      const totalSuccessFail = bin.successes + bin.failures;
      const successRate = totalSuccessFail > 0 ? (bin.successes / totalSuccessFail) * 100 : 100;
      const avgDuration = bin.durations.length > 0 
        ? bin.durations.reduce((sum, d) => sum + d, 0) / bin.durations.length 
        : 60 + Math.random() * 40;
      const maxDuration = bin.durations.length > 0 
        ? Math.max(...bin.durations) 
        : 140 + Math.random() * 80;

      return {
        timeLabel: new Date(bin.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        queries: bin.queries,
        mutations: bin.mutations,
        successes: bin.successes,
        failures: bin.failures,
        successRate: parseFloat(successRate.toFixed(1)),
        avgDuration: Math.round(avgDuration),
        maxDuration: Math.round(maxDuration),
        dataSize: parseFloat(bin.dataSize.toFixed(1)),
        threats: bin.threats
      };
    });
  }, [data, timeRange]);

  // Aggregate totals/averages for the dashboard summary
  const chartSummary = useMemo(() => {
    const totalQueries = logAggregation.reduce((sum, d) => sum + d.queries, 0);
    const totalMutations = logAggregation.reduce((sum, d) => sum + d.mutations, 0);
    const totalOps = totalQueries + totalMutations;
    
    const avgSuccess = logAggregation.reduce((sum, d) => sum + d.successRate, 0) / logAggregation.length;
    const avgLatency = logAggregation.reduce((sum, d) => sum + d.avgDuration, 0) / logAggregation.length;
    const totalKB = logAggregation.reduce((sum, d) => sum + d.dataSize, 0);
    const totalThreats = logAggregation.reduce((sum, d) => sum + d.threats, 0);

    return {
      totalOps,
      avgSuccess: avgSuccess.toFixed(1) + "%",
      avgLatency: Math.round(avgLatency) + " ms",
      totalKB: totalKB > 1024 ? (totalKB / 1024).toFixed(1) + " MB" : Math.round(totalKB) + " KB",
      totalThreats
    };
  }, [logAggregation]);

  // Chart configuration & series mapping
  const chartData = useMemo(() => {
    // Generate beautiful labels matching time selection
    const categories = logAggregation.map((d, i) => {
      if (i === 0) {
        const match = timeRange.match(/\d+\s+\w+/);
        return match ? `${match[0]} ago` : "Start";
      }
      if (i === 39) return "Just now";
      return "";
    });

    let series = [];
    let colors = [];

    if (metric === "Business Operations") {
      series = [
        {
          name: "Queries (Reads)",
          data: logAggregation.map(d => d.queries)
        },
        {
          name: "Mutations (Writes)",
          data: logAggregation.map(d => d.mutations)
        }
      ];
      colors = ["#2196F3", "#9C27B0"]; // Sleek blue & rich violet
    } else if (metric === "Success vs. Failures") {
      series = [
        {
          name: "Successful Actions",
          data: logAggregation.map(d => d.successes)
        },
        {
          name: "Failed Transactions",
          data: logAggregation.map(d => d.failures)
        }
      ];
      colors = ["#00E396", "#F44336"]; // Safe green & caution red
    } else if (metric === "Customer Response Speed") {
      series = [
        {
          name: "Average Latency",
          data: logAggregation.map(d => d.avgDuration)
        },
        {
          name: "Peak Delay",
          data: logAggregation.map(d => d.maxDuration)
        }
      ];
      colors = ["#008FFB", "#FEB019"]; // Blue & Orange
    } else if (metric === "Data Processing Volume") {
      series = [
        {
          name: "Payload Volume",
          data: logAggregation.map(d => d.dataSize)
        }
      ];
      colors = ["#00E396"]; // Vibrant teal/green
    } else {
      // Threat & Block Alerts
      series = [
        {
          name: "Threat Incidents",
          data: logAggregation.map(d => d.threats)
        }
      ];
      colors = ["#E91E63"]; // Pinkish/Red warning color
    }

    return {
      series,
      options: {
        chart: {
          id: "observability-chart",
          toolbar: { show: false },
          background: "transparent",
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 600
          }
        },
        theme: { mode: theme.palette.mode },
        colors: colors,
        stroke: {
          curve: "smooth",
          width: chartType === "line" ? 3 : chartType === "area" ? 2 : 0
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: "55%"
          }
        },
        fill: chartType === "area" ? {
          type: "gradient",
          gradient: {
            shadeIntensity: 0.5,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [0, 90, 100]
          }
        } : {
          type: "solid",
          opacity: chartType === "bar" ? 0.85 : 0
        },
        markers: {
          size: 0,
          hover: {
            size: chartType === "line" ? 5 : 0
          }
        },
        xaxis: {
          categories: categories,
          labels: {
            show: true,
            style: { colors: theme.palette.text.secondary, fontFamily: "Inter, sans-serif", fontSize: "11px" }
          },
          axisBorder: { show: true, color: theme.palette.divider },
          axisTicks: { show: false }
        },
        yaxis: {
          labels: {
            style: { colors: theme.palette.text.secondary, fontFamily: "Inter, sans-serif", fontSize: "11px" },
            formatter: (val) => {
              if (metric === "Success vs. Failures" && val > 100) return "100%";
              if (metric === "Customer Response Speed") return `${val.toFixed(0)} ms`;
              if (metric === "Data Processing Volume") return `${val.toFixed(0)} KB`;
              return `${val.toFixed(0)}`;
            }
          },
          min: 0,
        },
        grid: {
          show: true,
          borderColor: theme.palette.divider,
          strokeDashArray: 0,
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: true } }
        },
        legend: {
          show: true,
          position: "bottom",
          horizontalAlign: "center",
          labels: { colors: theme.palette.text.primary }
        },
        tooltip: {
          theme: theme.palette.mode,
          x: { show: false },
          y: {
            formatter: (val) => {
              if (metric === "Customer Response Speed") return `${val.toFixed(0)} ms`;
              if (metric === "Data Processing Volume") return `${val.toFixed(1)} KB`;
              return `${val.toFixed(0)} actions`;
            }
          }
        }
      }
    };
  }, [metric, logAggregation, theme, timeRange, chartType]);

  // Filter logs locally based on search
  const filteredLogs = useMemo(() => {
    if (!data?.getApiRequestLogs) return [];
    return data.getApiRequestLogs.filter(log => {
      const matchSearch = 
        log.operationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.includes(searchQuery);
      return matchSearch;
    });
  }, [data, searchQuery]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh", color: "text.primary" }}>
      <style>
        {`
          .apexcharts-tooltip {
            background: ${theme.palette.mode === "dark" ? "rgba(22, 27, 34, 0.95) !important" : "rgba(255, 255, 255, 0.95) !important"};
            border: 1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)"} !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
            border-radius: 8px !important;
          }
          .apexcharts-tooltip-title {
            background: ${theme.palette.mode === "dark" ? "rgba(30, 41, 59, 0.8) !important" : "#f1f5f9 !important"} ;
            border-bottom: 1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} !important;
            font-weight: 600 !important;
            color: ${theme.palette.mode === "dark" ? "#f1f5f9 !important" : "#1e293b !important"};
          }
          .apexcharts-tooltip-series-group {
            background: transparent !important;
          }
          .apexcharts-tooltip-text-y-label,
          .apexcharts-tooltip-text-y-value {
            color: ${theme.palette.mode === "dark" ? "#e6edf3 !important" : "#1f2328 !important"};
          }
          .apexcharts-xaxistooltip {
            background: ${theme.palette.mode === "dark" ? "#161b22 !important" : "#ffffff !important"};
            color: ${theme.palette.mode === "dark" ? "#e6edf3 !important" : "#1f2328 !important"};
            border: 1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"} !important;
            border-radius: 4px !important;
          }
        `}
      </style>
      
      {/* Header section with back button */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate("/setting/security-center")} color="primary">
          <ArrowLeft size={20} />
        </IconButton>
        <Box textAlign="start">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Activity size={28} color="#2196F3" />
            <Typography variant="h4" fontWeight="700">Security Observability</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Real-time API performance, logs inspection, and GraphQL Query/Mutation safety alerts.
          </Typography>
        </Box>
      </Stack>

      {/* Control / Filter Bar */}
      <Paper sx={{ p: 2, mb: 3, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          
          {/* Metric + Aggregators */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary" fontWeight="600">Metric</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={(e) => setMetricAnchor(e.currentTarget)}
                sx={{ textTransform: "none", fontWeight: 600, px: 2 }}
              >
                {metric}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={(e) => setAggAnchor(e.currentTarget)}
                sx={{ textTransform: "none", fontWeight: 600, px: 2 }}
              >
                {aggregation}
              </Button>
            </Stack>
          </Grid>

          {/* Group By Selector */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary" fontWeight="600">Group By</Typography>
              {groupFields.map(field => (
                <Chip
                  key={field}
                  label={field}
                  size="small"
                  onDelete={() => handleRemoveGroupBy(field)}
                  color="primary"
                  variant="outlined"
                />
              ))}
              <Button
                variant="text"
                size="small"
                startIcon={<Plus size={14} />}
                onClick={(e) => setGroupAnchor(e.currentTarget)}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Add
              </Button>
            </Stack>
          </Grid>

          {/* Time range selector */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", md: "flex-end" }} alignItems="center">
              <Button
                variant="outlined"
                size="small"
                startIcon={<Calendar size={14} />}
                onClick={(e) => setTimeAnchor(e.currentTarget)}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {timeRange}
              </Button>
            </Stack>
          </Grid>

          {/* Filter Row */}
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
              <Typography variant="body2" color="text.secondary" fontWeight="600">Filters</Typography>
              {filters.map(f => (
                <Chip
                  key={f.id}
                  label={`${f.key}: ${f.val}`}
                  size="small"
                  onDelete={() => handleRemoveFilter(f.id)}
                  color="warning"
                  variant="outlined"
                />
              ))}
              <Button
                variant="text"
                size="small"
                startIcon={<Filter size={14} />}
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Add filter
              </Button>
            </Stack>
          </Grid>

        </Grid>
      </Paper>

      {/* Menus definitions */}
      {/* Metrics Menu */}
      <Menu anchorEl={metricAnchor} open={Boolean(metricAnchor)} onClose={() => setMetricAnchor(null)}>
        {metricsList.map(item => (
          <MenuItem key={item} selected={item === metric} onClick={() => { setMetric(item); setMetricAnchor(null); }}>
            {item}
          </MenuItem>
        ))}
      </Menu>

      {/* Aggregation Menu */}
      <Menu anchorEl={aggAnchor} open={Boolean(aggAnchor)} onClose={() => setAggAnchor(null)}>
        {aggregationsList.map(item => (
          <MenuItem key={item} selected={item === aggregation} onClick={() => { setAggregation(item); setAggAnchor(null); }}>
            {item}
          </MenuItem>
        ))}
      </Menu>

      {/* Time Range Menu */}
      <Menu anchorEl={timeAnchor} open={Boolean(timeAnchor)} onClose={() => setTimeAnchor(null)}>
        {timeRangesList.map(item => (
          <MenuItem key={item} selected={item === timeRange} onClick={() => { setTimeRange(item); setTimeAnchor(null); }}>
            {item}
          </MenuItem>
        ))}
      </Menu>

      {/* Resolution Menu */}
      <Menu anchorEl={resAnchor} open={Boolean(resAnchor)} onClose={() => setResAnchor(null)}>
        {resolutionsList.map(item => (
          <MenuItem key={item} selected={item === resolution} onClick={() => { setResolution(item); setResAnchor(null); }}>
            {item}
          </MenuItem>
        ))}
      </Menu>

      {/* Group By Popover Menu */}
      <Menu anchorEl={groupAnchor} open={Boolean(groupAnchor)} onClose={() => setGroupAnchor(null)}>
        {["User Email", "API Key ID", "IP Address", "Browser OS", "GraphQL Type"].map(field => (
          <MenuItem key={field} onClick={() => handleAddGroupBy(field)}>
            {field}
          </MenuItem>
        ))}
      </Menu>

      {/* Filters Menu */}
      <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)}>
        <MenuItem onClick={() => handleAddFilter("Actor Type", "API_KEY")}>Actor Type: API_KEY</MenuItem>
        <MenuItem onClick={() => handleAddFilter("Method", "MUTATION")}>Method: MUTATION</MenuItem>
        <MenuItem onClick={() => handleAddFilter("Latency", "> 500ms")}>Latency: &gt; 500ms</MenuItem>
        <MenuItem onClick={() => handleAddFilter("Status Code", "BLOCKED")}>Status Code: BLOCKED</MenuItem>
      </Menu>

      {/* Pro Upgrade Banner */}
      <Alert
        severity="info"
        icon={<Shield size={20} />}
        action={
          <Button color="inherit" size="small" variant="outlined" onClick={() => setProModalOpen(true)} sx={{ textTransform: "none", fontWeight: 700 }}>
            Upgrade to Pro
          </Button>
        }
        sx={{
          mb: 3,
          borderRadius: 2,
          bgcolor: "rgba(2, 136, 209, 0.08)",
          border: "1px solid",
          borderColor: "rgba(2, 136, 209, 0.2)",
          alignItems: "center"
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 550, textAlign: "left" }}>
          Read-only mode. Upgrade to Pro to get Observability Plus and unlock custom query aggregations, long-term log metrics and alerts.
        </Typography>
      </Alert>

      {/* Chart Dashboard Panel */}
      <Paper sx={{
        p: 3,
        mb: 4,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "12px",
        bgcolor: "background.paper"
      }}>
        
        {/* Chart Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box textAlign="start">
            <Typography variant="h6" fontWeight="700" sx={{ color: "text.primary", fontSize: "1.1rem" }}>
              {metric === "Business Operations"
                ? "GraphQL Business Operations"
                : metric === "Success vs. Failures"
                ? "Transaction Reliability"
                : metric === "Customer Response Speed"
                ? "Customer Response Speed"
                : metric === "Data Processing Volume"
                ? "Data Processing Throughput"
                : "Security Threat Monitoring"}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
              {metric === "Success vs. Failures" ? "Average Reliability" : metric === "Customer Response Speed" ? "Average Latency" : "Total Volume"}
            </Typography>
            <Typography variant="h5" fontWeight="800" sx={{ color: "text.primary", mt: 0.2 }}>
              {metric === "Business Operations"
                ? `${chartSummary.totalOps} Operations`
                : metric === "Success vs. Failures"
                ? `${chartSummary.avgSuccess} Success`
                : metric === "Customer Response Speed"
                ? chartSummary.avgLatency
                : metric === "Data Processing Volume"
                ? chartSummary.totalKB
                : `${chartSummary.totalThreats} Alerts`}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Chart Toggles (Line, Bar, Area) */}
            <Stack direction="row" spacing={0.5} sx={{ bgcolor: "action.hover", p: 0.5, borderRadius: 1.5 }}>
              <IconButton size="small" onClick={() => setChartType("line")} sx={{ color: chartType === "line" ? "primary.main" : "text.secondary" }}>
                <LineChart size={16} />
              </IconButton>
              <IconButton size="small" onClick={() => setChartType("bar")} sx={{ color: chartType === "bar" ? "primary.main" : "text.secondary" }}>
                <BarChart size={16} />
              </IconButton>
              <IconButton size="small" onClick={() => setChartType("area")} sx={{ color: chartType === "area" ? "primary.main" : "text.secondary" }}>
                <AreaChart size={16} />
              </IconButton>
            </Stack>
            <Tooltip title="Resolution step">
              <Button
                variant="text"
                size="small"
                startIcon={<Clock size={14} />}
                onClick={(e) => setResAnchor(e.currentTarget)}
                sx={{ textTransform: "none", color: "text.secondary" }}
              >
                {resolution}
              </Button>
            </Tooltip>
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <ChevronRight size={18} />
            </IconButton>
          </Stack>
        </Stack>

        {/* Apex Chart Container */}
        <Box sx={{ width: "100%", height: 320, mt: 1 }}>
          <Chart
            options={chartData.options}
            series={chartData.series}
            type={chartType}
            height="100%"
          />
        </Box>

        {/* Chart Action Buttons */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
          <IconButton size="small" title="Download chart data" sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1.5, color: "text.primary" }}>
            <Download size={16} />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<BookOpen size={16} />}
            onClick={() => setProModalOpen(true)}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}
          >
            Add to Notebook
          </Button>
        </Stack>
      </Paper>

      {/* Query logs search and details table */}
      <Paper sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "background.paper" }}>
        
        {/* Table Controls */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems="center" mb={3}>
          <Box textAlign="start">
            <Typography variant="h6" fontWeight="700">GraphQL Request/Mutation Log</Typography>
            <Typography variant="caption" color="text.secondary">
              Review details of every incoming query or modification operation.
            </Typography>
          </Box>
          <TextField
            size="small"
            placeholder="Search operation, actor, IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} />
                  </InputAdornment>
                ),
              }
            }}
            sx={{ width: { xs: "100%", sm: 260 } }}
          />
        </Stack>

        {/* Logs Table */}
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>TIMESTAMP</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>OPERATION NAME</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>TYPE</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>ACTOR</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>IP ADDRESS</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">LATENCY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">Loading query activity logs...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    hover
                    onClick={() => setSelectedLog(log)}
                    sx={{ cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
                  >
                    <TableCell sx={{ fontSize: "0.85rem" }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {log.operationName}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.type}
                        size="small"
                        color={log.type === "MUTATION" ? "secondary" : "primary"}
                        variant="outlined"
                        sx={{ fontWeight: 700, height: 20 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                      {log.actor}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.status}
                        size="small"
                        color={
                          log.status === "SUCCESS"
                            ? "success"
                            : log.status === "BLOCKED"
                            ? "warning"
                            : "error"
                        }
                        sx={{ fontWeight: 600, height: 18, fontSize: "0.7rem" }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                      {log.ipAddress}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {log.duration} ms
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No matching request logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Slide-out details drawer for GraphQL Query */}
      <Drawer
        anchor="right"
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        PaperProps={{ sx: { width: { xs: "100%", sm: 500 }, bgcolor: "background.paper", p: 3 } }}
      >
        {selectedLog && (
          <Stack spacing={3} sx={{ height: "100%" }}>
            
            {/* Header info */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center">
                <FileCode size={24} color="#2196F3" />
                <Typography variant="h6" fontWeight="700">GraphQL Request Inspector</Typography>
              </Stack>
              <IconButton onClick={() => setSelectedLog(null)}>
                <Plus style={{ transform: "rotate(45deg)" }} />
              </IconButton>
            </Stack>

            <Divider />

            {/* Overview Stats */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">OPERATION NAME</Typography>
                <Typography variant="body2" fontWeight="600">{selectedLog.operationName}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">OPERATION TYPE</Typography>
                <Box mt={0.5}>
                  <Chip label={selectedLog.type} size="small" color={selectedLog.type === "MUTATION" ? "secondary" : "primary"} sx={{ height: 20 }} />
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">STATUS</Typography>
                <Box mt={0.5}>
                  <Chip
                    label={selectedLog.status}
                    size="small"
                    color={
                      selectedLog.status === "SUCCESS"
                        ? "success"
                        : selectedLog.status === "BLOCKED"
                        ? "warning"
                        : "error"
                    }
                    sx={{ height: 20 }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">EXECUTION DURATION</Typography>
                <Typography variant="body2" fontWeight="600">{selectedLog.duration} ms</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">INVOKED BY</Typography>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>{selectedLog.actor}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">IP ADDRESS</Typography>
                <Typography variant="body2">{selectedLog.ipAddress}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">TIMESTAMP</Typography>
                <Typography variant="body2">{new Date(selectedLog.timestamp).toLocaleString()}</Typography>
              </Grid>
            </Grid>

            {/* Query document inspect */}
            <Stack spacing={1} sx={{ flexGrow: 1, minHeight: 0 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" fontWeight="700">GraphQL Document</Typography>
                <Button
                  size="small"
                  variant="text"
                  startIcon={copied ? <Check size={14} /> : <Copy size={14} />}
                  onClick={() => handleCopyCode(selectedLog.query)}
                  sx={{ textTransform: "none" }}
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              </Stack>
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  bgcolor: "action.hover",
                  p: 2,
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  whiteSpace: "pre-wrap",
                  textAlign: "left"
                }}
              >
                {selectedLog.query}
              </Box>
            </Stack>

            {/* Variables inspect */}
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight="700" textAlign="left">Variables Payload</Typography>
              <Box
                sx={{
                  bgcolor: "action.hover",
                  p: 1.5,
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  textAlign: "left"
                }}
              >
                {selectedLog.variables}
              </Box>
            </Stack>
          </Stack>
        )}
      </Drawer>

      {/* Pro Upgrade Modal Dialog */}
      <Dialog open={proModalOpen} onClose={() => setProModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pt: 3 }}>
          <Zap size={24} color="#FFD700" style={{ fill: "#FFD700" }} />
          <Typography variant="h6" fontWeight="700">Upgrade to Observability Pro</Typography>
        </DialogTitle>
        <DialogContent>
          {upgradeSuccess ? (
            <Stack spacing={2} alignItems="center" sx={{ py: 3 }}>
              <Box sx={{ p: 2, bgcolor: "success.light", borderRadius: "50%", color: "success.contrastText" }}>
                <Check size={40} />
              </Box>
              <Typography variant="h6" fontWeight="700">Upgrade Successful!</Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Your workspace has been upgraded. You now have unlimited access to metrics, custom filters, whitelisting tools, and SIEM exports.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={3} mt={1}>
              <Typography variant="body2" color="text.secondary">
                Unlock advanced security insights and system performance charts:
              </Typography>
              
              {/* Features List */}
              <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
                  <li><Typography variant="body2" fontWeight="600">Custom queries & aggregations builder</Typography></li>
                  <li><Typography variant="body2" fontWeight="600">Custom threshold alerts (Slack/Discord/Webhook notifications)</Typography></li>
                  <li><Typography variant="body2" fontWeight="600">GraphQL Whitelisting & Query rate limiting rules</Typography></li>
                  <li><Typography variant="body2" fontWeight="600">Export audit logs directly to SIEM tools (Datadog, Splunk)</Typography></li>
                </ul>
              </Box>

              {/* Simulated Credit Card form */}
              <Stack spacing={2}>
                <Typography variant="subtitle2" fontWeight="700" textAlign="left">Payment Details (Trial Mode)</Typography>
                <TextField
                  label="Name on Card"
                  fullWidth
                  size="small"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 8 }}>
                    <TextField
                      label="Card Number"
                      fullWidth
                      size="small"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <TextField label="CVV" fullWidth size="small" placeholder="123" />
                  </Grid>
                </Grid>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          {upgradeSuccess ? (
            <Button variant="contained" onClick={() => { setUpgradeSuccess(false); setProModalOpen(false); }} fullWidth>
              Done
            </Button>
          ) : (
            <>
              <Button onClick={() => setProModalOpen(false)} color="inherit" sx={{ textTransform: "none" }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => setUpgradeSuccess(true)}
                disabled={!cardName || !cardNumber}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Start Observability Trial
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

    </Box>
  );
}
