
import { useState, useMemo, useCallback } from "react";
import {
  Box, Button, Card, CardContent, Chip, Grid, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Tooltip, Typography, LinearProgress,
  Divider, MenuItem, Avatar, Menu,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ArrowUpward, ArrowDownward, Download, Print,
  MonetizationOn, TrendingUp, Receipt, AttachMoney,
  OpenInNew, KeyboardArrowDown, Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import { useQuery } from "@apollo/client/react";
import {
  GET_FULL_DASHBOARD,
  GET_CHART_DATA,
  GET_RECENT_TRANSACTIONS_BY_TYPE,
  GET_ORDER_CATEGORY_STATS,
} from "../../graphql/queries";
import ErrorPage from "../include/ErrorPage";
import Chart from "react-apexcharts";
import DashboardSkeleton from "../Components/dashboard/DashboardSkeleton";


const formatCurrency = (v) => (v != null ? `$${Number(v).toFixed(2)}` : "$0.00");
const formatDateLong = (v) => (!v ? "-" : dayjs(v).format("MMMM D, YYYY"));
const formatDateShort = (v) => (!v ? "-" : dayjs(v).format("DD MMM YYYY"));
const formatFileDate = (v = new Date()) => dayjs(v).format("YYYY-MM-DD");

const PERIOD_OPTIONS = [
  { code: "1D", label: "Today" },
  { code: "1W", label: "Weekly" },
  { code: "1M", label: "Monthly" },
  { code: "3M", label: "3 Months" },
  { code: "6M", label: "6 Months" },
  { code: "All", label: "All Time" },
];


const getStatusStyle = (status, theme) => {
  const s = status?.toLowerCase();
  if (s === "completed" || s === "paid" || s === "new")
    return { bg: theme.palette.success.light + "30", color: theme.palette.success.main };
  if (s === "pending")
    return { bg: theme.palette.warning.light + "30", color: theme.palette.warning.main };
  if (s === "overdue" || s === "unpaid" || s === "cancelled")
    return { bg: theme.palette.error.light + "30", color: theme.palette.error.main };
  return { bg: theme.palette.action.hover, color: theme.palette.text.secondary };
};


const cardSx = (theme) => ({
  borderRadius: "16px",
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
  transition: "box-shadow 0.2s",
  "&:hover": { boxShadow: theme.shadows[4] },
});

const thSx = (theme) => ({
  bgcolor: theme.palette.action.hover,
  fontSize: "0.70rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: theme.palette.text.primary,
  borderBottom: `2px solid ${theme.palette.divider}`,
  py: 1.2,
});

const tdSx = (theme) => ({
  fontSize: "0.80rem",
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  py: 1.1,
});


const SkeletonRows = ({ count = 5, cols = 3, opacity = 0.25 }) => {
  const theme = useTheme();
  return Array.from({ length: count }).map((_, i) => (
    <TableRow key={`sk-${i}`}>
      <TableCell colSpan={cols} sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.2 }}>
        <Box sx={{ height: 10, borderRadius: 2, bgcolor: theme.palette.divider, opacity, width: `${50 + ((i * 17) % 45)}%` }} />
      </TableCell>
    </TableRow>
  ));
};

const SkeletonCustomerRows = ({ count = 5 }) => {
  const theme = useTheme();
  return Array.from({ length: count }).map((_, i) => (
    <Stack key={`sck-${i}`} direction="row" justifyContent="space-between" alignItems="center" sx={{ opacity: 0.22 }}>
      <Stack direction="row" alignItems="center" spacing={1.4}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2.5, bgcolor: theme.palette.divider }} />
        <Box>
          <Box sx={{ height: 10, borderRadius: 2, bgcolor: theme.palette.divider, mb: 0.6, width: `${55 + i * 10}px` }} />
          <Box sx={{ height: 8, borderRadius: 2, bgcolor: theme.palette.divider, width: 70 }} />
        </Box>
      </Stack>
      <Box sx={{ height: 10, borderRadius: 2, bgcolor: theme.palette.divider, width: 52 }} />
    </Stack>
  ));
};


const PeriodPills = ({ active, onChange }) => {
  const theme = useTheme();
  return (
    <ToggleButtonGroup
      value={active}
      exclusive
      onChange={(e, value) => value && onChange(value)}
      size="small"
      sx={{
        backgroundColor: theme.palette.action.hover,
        borderRadius: "5px",
        padding: "3px",
        border: `1px solid ${theme.palette.divider}`,
        "& .MuiToggleButton-root": {
          border: "none", px: 1.4, py: 0.45,
          fontSize: "0.72rem", fontWeight: 600, textTransform: "none",
          color: theme.palette.text.secondary, borderRadius: "7px !important",
          lineHeight: 1.4,
        },
        "& .Mui-selected": {
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: theme.palette.common.white,
          boxShadow: `0 2px 8px ${theme.palette.primary.main}70`,
        },
        "& .MuiToggleButton-root:hover": { backgroundColor: theme.palette.action.selected, color: theme.palette.primary.main },
      }}
    >
      {PERIOD_OPTIONS.map(({ code }) => (
        <ToggleButton key={code} value={code}>
          {code}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

const PeriodDropdown = ({ active, onChange }) => {
  const theme = useTheme();
  const [anchor, setAnchor] = useState(null);
  const current = PERIOD_OPTIONS.find(o => o.code === active) || PERIOD_OPTIONS[1];
  return (
    <>
      <Box
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          px: 1.2, py: 0.45, border: `1px solid ${theme.palette.divider}`, borderRadius: 1,
          fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", color: theme.palette.primary.main,
          display: "flex", alignItems: "center", gap: 0.4, bgcolor: theme.palette.action.hover,
          "&:hover": { bgcolor: theme.palette.action.selected, borderColor: theme.palette.primary.main },
          transition: "all 0.15s",
        }}
      >
        {current.label} <KeyboardArrowDown sx={{ fontSize: 14 }} />
      </Box>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: 1,
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
            minWidth: 140,
            mt: 0.5,
          },
        }}
      >
        {PERIOD_OPTIONS.map(({ code, label }) => (
          <MenuItem
            key={code}
            selected={active === code}
            onClick={() => { onChange(code); setAnchor(null); }}
            sx={{
              fontSize: "0.78rem",
              color: active === code ? theme.palette.primary.main : theme.palette.text.primary,
              fontWeight: active === code ? 700 : 400,
              borderRadius: 1,
              "&.Mui-selected": { bgcolor: theme.palette.action.selected },
              "&:hover": { bgcolor: theme.palette.action.hover, color: theme.palette.primary.main },
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const SectionTitle = ({ children, action }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.8}>
      <Stack direction="row" alignItems="center" spacing={1.2}>
        <Box sx={{ width: 3.5, height: 18, borderRadius: 4, bgcolor: theme.palette.primary.main }} />
        <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: theme.palette.text.primary, letterSpacing: "-0.01em" }}>
          {children}
        </Typography>
      </Stack>
      {action}
    </Stack>
  );
};

const DashboardActionButton = ({ icon, title, subtitle, onClick, primary }) => {
  const theme = useTheme();
  return (
    <Button
      onClick={onClick}
      variant={primary ? "contained" : "outlined"}
      startIcon={icon}
      sx={{
        minWidth: { xs: "100%", sm: 150 },
        justifyContent: "flex-start",
        px: 1.5,
        py: 1,
        borderRadius: 1,
        textAlign: "left",
        bgcolor: primary ? theme.palette.primary.main : theme.palette.background.paper,
      }}
    >
      <Box>
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 800, lineHeight: 1.1 }}>
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.65rem",
            lineHeight: 1.2,
            color: primary ? "rgba(255,255,255,0.78)" : "text.secondary",
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Button>
  );
};

const ViewAllBtn = () => {
  const theme = useTheme();
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  return (
    <Button
      size="small"
      endIcon={<OpenInNew sx={{ fontSize: 11 }} />}
      sx={{
        fontSize: "0.72rem", color: theme.palette.primary.main, textTransform: "none",
        p: 0, minWidth: 0, fontWeight: 600,
        "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
      }}
    >
      {t("view_all")}
    </Button>
  );
};

const TrendPill = ({ trend, change, light }) => {
  const theme = useTheme();
  const isUp = trend === "up";
  const color = isUp ? theme.palette.success.main : theme.palette.error.main;
  const bgColor = light
    ? "rgba(255,255,255,.18)"
    : isUp
      ? theme.palette.success.light + "30"
      : theme.palette.error.light + "30";
  const Icon = isUp ? ArrowUpward : ArrowDownward;
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.3}
      sx={{
        px: 0.9, py: 0.25, borderRadius: 10, display: "inline-flex",
        bgcolor: bgColor,
      }}
    >
      <Icon sx={{ fontSize: 10, color: light ? "#fff" : color }} />
      <Typography sx={{ fontSize: "0.67rem", fontWeight: 700, color: light ? "#fff" : color }}>
        {Math.abs(change).toFixed(1)}%
      </Typography>
    </Stack>
  );
};

const ScrollChart = ({ children, count }) => (
  <Box
    sx={{
      overflowX: count > 14 ? "auto" : "hidden",
      "&::-webkit-scrollbar": { height: 5 },
      "&::-webkit-scrollbar-track": { bgcolor: "action.hover", borderRadius: 10 },
      "&::-webkit-scrollbar-thumb": { bgcolor: "primary.light", borderRadius: 10, "&:hover": { bgcolor: "primary.main" } },
    }}
  >
    <Box sx={{ minWidth: count > 14 ? Math.max(count * 58, 700) : "100%", width: count > 14 ? Math.max(count * 58, 700) : "100%" }}>
      {children}
    </Box>
  </Box>
);

const StableProgress = ({ loading }) => {
  const theme = useTheme();
  return (
    <LinearProgress
      sx={{
        borderRadius: 4,
        bgcolor: theme.palette.action.hover,
        "& .MuiLinearProgress-bar": { bgcolor: theme.palette.primary.main },
        mb: 1,
        visibility: loading ? "visible" : "hidden",
      }}
    />
  );
};

// const TX_TABS = [
//   { key: "sale", label: "Sale" },
//   { key: "purchase", label: "Purchase" },
//   { key: "quotation", label: "Quotation" },
//   { key: "expense", label: "Expenses" },
//   { key: "invoice", label: "Invoice" },
// ];


export default function Dashboard() {
  const theme = useTheme();
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
  const savedStoreId = localStorage.getItem("activeShopId");
  const TX_TABS = [
    { key: "sale", label: t("period_sale") },
    { key: "purchase", label: t("period_purchase") },
    { key: "quotation", label: t("period_quotation") },
    { key: "expense", label: t("period_expense") },
    { key: "invoice", label: t("period_invoice") },
  ];
  const [period, setPeriod] = useState("month");
  const [customStart, setCustomStart] = useState(null);
  const [customEnd, setCustomEnd] = useState(null);
  const [spPeriod, setSpPeriod] = useState("1M");
  const [statsPeriod, setStatsPeriod] = useState("1M");
  const [txTab, setTxTab] = useState("sale");
  const [txPeriod, setTxPeriod] = useState("1M");
  const [bottomPeriod, setBottomPeriod] = useState("1W");

  const getQueryVars = () => {
    if (period === "custom")
      return { period: "customRange", startDate: customStart?.format("YYYY-MM-DD") || null, endDate: customEnd?.format("YYYY-MM-DD") || null };
    return { period, startDate: null, endDate: null };
  };

  const { data, loading, error, refetch } = useQuery(GET_FULL_DASHBOARD, {
    variables: { shopId: savedStoreId, ...getQueryVars() },
    skip: period === "custom" && (!customStart || !customEnd),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const { data: spData, loading: spLoading } = useQuery(GET_CHART_DATA, { variables: { shopId: savedStoreId, period: spPeriod }, fetchPolicy: "cache-and-network" });
  const { data: statsData, loading: statsLoading } = useQuery(GET_CHART_DATA, { variables: { shopId: savedStoreId, period: statsPeriod }, fetchPolicy: "cache-and-network" });
  const { data: txData, loading: txLoading } = useQuery(GET_RECENT_TRANSACTIONS_BY_TYPE, { variables: { shopId: savedStoreId, txType: txTab, period: txPeriod, page: 1, limit: 8 }, fetchPolicy: "cache-and-network" });
  const { data: bottomData, loading: bottomLoading } = useQuery(GET_ORDER_CATEGORY_STATS, { variables: { shopId: savedStoreId, period: bottomPeriod }, fetchPolicy: "cache-and-network" });

  const dashboard = data?.getFullDashboard;
  const overview = dashboard?.overview || {};
  const overallInfo = dashboard?.overallInfo || { suppliers: 0, customers: 0, orders: 0 };
  const custOverview = dashboard?.customerOverview || { firstTime: 0, return: 0, firstTimePercent: 0, returnPercent: 0 };
  const topSelling = dashboard?.topSellingProducts || [];
  const lowStock = dashboard?.lowStockProducts || [];
  const productExpiryAlerts = dashboard?.productExpiryAlerts || [];
  const recentSales = dashboard?.recentSales || [];
  const topCustomers = dashboard?.topCustomers || [];

  const spChart = spData?.getChartData || { labels: [], sales: [], purchases: [] };
  const statsChart = statsData?.getChartData || { labels: [], sales: [], purchases: [] };
  const recentTx = txData?.getRecentTransactionsByType?.items || [];

  const bottomStats = bottomData?.getOrderCategoryStats;
  const topCategories = bottomStats?.topCategories || [];
  const catStats = bottomStats?.categoryStatistics || { totalCategories: 0, totalProducts: 0 };
  const orderStats = {
    labels: bottomStats?.orderLabels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: bottomStats?.orderValues || [0, 0, 0, 0, 0, 0, 0],
  };

  const filterLabel = { today: "Today", week: "Week", month: "Month", year: "Year", custom: "Custom" }[period] || period;


  const commonChartBase = {
    toolbar: { show: false },
    background: "transparent",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  };

  const makeBarOpts = (chartData, stacked = false) => {
    const count = chartData.labels.length;
    return {
      chart: { ...commonChartBase, type: "bar", stacked },
      colors: [theme.palette.primary.main, theme.palette.secondary.main],
      plotOptions: {
        bar: {
          borderRadius: stacked ? 2 : 4,
          columnWidth: count > 20 ? "78%" : (stacked ? "52%" : "44%"),
          dataLabels: { position: "top" },
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: !stacked, width: 2, colors: ["transparent"] },
      grid: { borderColor: theme.palette.divider, strokeDashArray: 4, xaxis: { lines: { show: false } } },
      xaxis: {
        categories: chartData.labels.length > 0 ? chartData.labels : ["—"],
        axisBorder: { show: false }, axisTicks: { show: false },
        labels: { style: { colors: theme.palette.text.secondary, fontSize: "11px", fontFamily: "inherit" }, rotate: count > 20 ? -45 : 0 },
      },
      yaxis: {
        labels: {
          formatter: (v) => `$${(v / 1000).toFixed(0)}K`,
          style: { colors: theme.palette.text.secondary, fontSize: "11px", fontFamily: "inherit" },
        },
      },
      tooltip: { theme: theme.palette.mode === "dark" ? "dark" : "light", y: { formatter: formatCurrency } },
      legend: {
        position: "top", horizontalAlign: "left",
        markers: { width: 9, height: 9, radius: 3 },
        labels: { colors: theme.palette.text.primary },
        fontSize: "12px",
      },
      fill: { opacity: stacked ? 0.92 : 1 },
      noData: { text: "No data available", align: "center", verticalAlign: "middle", style: { color: theme.palette.text.secondary, fontSize: "13px" } },
    };
  };

  const customerDonutOpts = {
    chart: { ...commonChartBase, type: "donut" },
    labels: [t("first_time") || "First Time", t("return") || "Return"],
    colors: [theme.palette.primary.main, theme.palette.primary.dark],
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: { donut: { size: "72%", labels: { show: true, total: { show: true, label: "Total", fontSize: "12px", formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString() } } } },
    },
    stroke: { width: 0 },
    tooltip: { y: { formatter: (v) => `${v.toLocaleString()} customers` } },
    noData: { text: "No data", align: "center", verticalAlign: "middle", style: { color: theme.palette.text.secondary, fontSize: "12px" } },
  };

  // Category donut colors from theme palette
  const categoryColors = useMemo(() => {
    return [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ];
  }, [theme]);

  const categoryDonutOpts = {
    chart: { ...commonChartBase, type: "donut" },
    labels: topCategories.length > 0 ? topCategories.map((c) => c.name) : ["No Data"],
    colors: topCategories.length > 0 ? categoryColors : [theme.palette.divider],
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "65%" } } },
    stroke: { width: 0 },
    tooltip: { y: { formatter: formatCurrency } },
  };

  const orderStatsOpts = {
    chart: { ...commonChartBase, type: "bar" },
    colors: [theme.palette.primary.light],
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "52%" } },
    dataLabels: { enabled: false },
    grid: { borderColor: theme.palette.divider, strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    xaxis: {
      categories: orderStats.labels, axisBorder: { show: false }, axisTicks: { show: false },
      labels: { style: { colors: theme.palette.text.secondary, fontSize: "11px" } },
    },
    yaxis: { labels: { style: { colors: theme.palette.text.secondary, fontSize: "11px" } } },
    tooltip: { theme: theme.palette.mode === "dark" ? "dark" : "light" },
    fill: {
      type: "gradient",
      gradient: { shade: "light", gradientToColors: [theme.palette.primary.main], shadeIntensity: 0.5, type: "horizontal", opacityFrom: 0.75, opacityTo: 1 },
    },
    noData: { text: "No data available", align: "center", verticalAlign: "middle", style: { color: theme.palette.text.secondary, fontSize: "13px" } },
  };


  const handlePeriodChange = (p) => {
    setPeriod(p);
    if (p !== "custom") refetch({ shopId: savedStoreId, period: p, startDate: null, endDate: null });
  };
  const applyCustomRange = () => {
    if (customStart && customEnd)
      refetch({ shopId: savedStoreId, period: "customRange", startDate: customStart.format("YYYY-MM-DD"), endDate: customEnd.format("YYYY-MM-DD") });
  };
  const handlePrint = () => setTimeout(() => window.print(), 80);


  const printData = useMemo(() => {
    const companyName = user?.companyName || user?.shopName || "Smart Market";
    const phone = user?.phone || "(000) 000-0000";
    const email = user?.email || "support@smartmarket.com";
    const address = user?.address || "Cambodia";
    const invoiceNumber = `DASH-${dayjs().format("YYYYMMDD")}-${String(savedStoreId || "ALL").slice(-4).toUpperCase()}`;
    const periodText = period === "custom" && customStart && customEnd
      ? `${formatDateLong(customStart)} – ${formatDateLong(customEnd)}`
      : filterLabel;

    const summaryRows = [
      ["Total Sales", formatCurrency(overview.totalSales?.value || 0), `${(overview.totalSales?.percentageChange || 0).toFixed(1)}%`],
      ["Total Sales Return", formatCurrency(overview.totalSalesReturn?.value || 0), `${(overview.totalSalesReturn?.percentageChange || 0).toFixed(1)}%`],
      ["Total Purchase", formatCurrency(overview.totalPurchase?.value || 0), `${(overview.totalPurchase?.percentageChange || 0).toFixed(1)}%`],
      ["Total Purchase Return", formatCurrency(overview.totalPurchaseReturn?.value || 0), `${(overview.totalPurchaseReturn?.percentageChange || 0).toFixed(1)}%`],
      ["Profit", formatCurrency(overview.profit?.value || 0), `${(overview.profit?.percentageChange || 0).toFixed(1)}%`],
      ["Invoice Due", formatCurrency(overview.invoiceDue?.value || 0), `${(overview.invoiceDue?.percentageChange || 0).toFixed(1)}%`],
      ["Total Expenses", formatCurrency(overview.totalExpenses?.value || 0), `${(overview.totalExpenses?.percentageChange || 0).toFixed(1)}%`],
      ["Payment Returns", formatCurrency(overview.totalPaymentReturns?.value || 0), `${(overview.totalPaymentReturns?.percentageChange || 0).toFixed(1)}%`],
    ];
    const chartRows = spChart.labels.map((l, i) => [l, formatCurrency(spChart.sales[i]), formatCurrency(spChart.purchases[i])]);
    const infoRows = [["Suppliers", overallInfo.suppliers], ["Customers", overallInfo.customers], ["Orders", overallInfo.orders]];
    const custRows = [["First Time", custOverview.firstTime, `${custOverview.firstTimePercent.toFixed(1)}%`], ["Return", custOverview.return, `${custOverview.returnPercent.toFixed(1)}%`]];
    const topProdRows = topSelling.map(p => [p.productName, p.sales, formatCurrency(p.revenue)]);
    const topSellingTotalOrders = topSelling.reduce((sum, item) => sum + Number(item.sales || item.orders || 0), 0);
    const topSellingSubtotal = topSelling.reduce((sum, item) => sum + Number(item.revenue || item.amount || 0), 0);
    const topSellingTax = topSellingSubtotal * 0.07;
    const topItemRows = topSelling.map((p, index) => {
      const orders = Number(p.sales || p.orders || 0);
      const share = topSellingTotalOrders > 0 ? `${((orders / topSellingTotalOrders) * 100).toFixed(1)}%` : "0.0%";
      return [p.productName || "-", index + 1, orders, share];
    });
    const paymentRows = [
      ["Payment Method", "Dashboard Summary"],
      ["Bank Name", user?.bankName || `${companyName} Bank`],
      ["Account Name", user?.accountName || `${companyName} Services`],
      ["Account Number", user?.accountNumber || "9876 5432 1234 5678"],
      ["Routing Number", user?.routingNumber || "123456789"],
    ];
    const lowStockRows = lowStock.map(p => [p.productName, p.stock, p.minStock]);
    const expiryRows = productExpiryAlerts.map(p => [p.productName, p.batchNo || "-", formatDateShort(p.expiryDate), p.stock, p.daysUntilExpiry]);
    const rSalesRows = recentSales.map(s => [s.productName, s.category, formatCurrency(s.amount), formatDateLong(s.date)]);
    const rTxRows = recentTx.map(tx => [formatDateLong(tx.date), tx.customer, tx.quantity, formatCurrency(tx.price), tx.status, formatCurrency(tx.total)]);
    const topCustRows = topCustomers.map(c => [c.name, c.country || "-", c.orders, formatCurrency(c.totalSpent)]);
    const topCatRows = topCategories.map(c => [c.name, formatCurrency(c.salesAmount)]);
    const orderRows = orderStats.labels.map((l, i) => [l, orderStats.values[i]]);
    const catStatRows = [["Total Categories", catStats.totalCategories], ["Total Products", catStats.totalProducts]];
    const dashboardSections = [
      { title: "Dashboard Summary", headers: ["Metric", "Value", "Change"], rows: summaryRows },
      { title: "Sales vs Purchase", headers: ["Period", "Sales", "Purchases"], rows: chartRows },
      { title: "Overall Information", headers: ["Metric", "Count"], rows: infoRows },
      { title: "Customer Overview", headers: ["Type", "Count", "Percentage"], rows: custRows },
      { title: "Top Selling Products", headers: ["Product", "Sales", "Revenue"], rows: topProdRows },
      { title: "Low Stock Products", headers: ["Product", "Stock", "Min Stock"], rows: lowStockRows },
      { title: "Product Expiry Alerts", headers: ["Product", "Batch", "Expiry Date", "Stock", "Days Left"], rows: expiryRows },
      { title: "Recent Sales", headers: ["Product", "Category", "Amount", "Date"], rows: rSalesRows },
      { title: "Recent Transactions", headers: ["Date", "Customer", "Qty", "Price", "Status", "Total"], rows: rTxRows },
      { title: "Top Customers", headers: ["Name", "Country", "Orders", "Total Spent"], rows: topCustRows },
      { title: "Top Categories", headers: ["Category", "Sales Amount"], rows: topCatRows },
      { title: "Order Statistics", headers: ["Label", "Orders"], rows: orderRows },
      { title: "Category Statistics", headers: ["Metric", "Count"], rows: catStatRows },
    ];

    return {
      companyName, phone, email, address, invoiceNumber,
      invoiceDate: formatDateLong(new Date()), periodText,
      dueDate: formatDateLong(dayjs().add(7, "day")),
      subtotal: topSellingSubtotal,
      tax: topSellingTax,
      total: topSellingSubtotal + topSellingTax,
      topItemRows,
      paymentRows,
      dashboardSections,
      summaryRows, chartRows, infoRows, custRows, topProdRows, lowStockRows, expiryRows, rSalesRows, rTxRows, topCustRows, topCatRows, orderRows, catStatRows,
      hasChart: chartRows.length > 0, hasTopProd: topProdRows.length > 0, hasLowStock: lowStockRows.length > 0, hasExpiry: expiryRows.length > 0,
      hasRSales: rSalesRows.length > 0, hasRTx: rTxRows.length > 0, hasTopCust: topCustRows.length > 0, hasTopCat: topCatRows.length > 0,
    };
  }, [dashboard, period, customStart, customEnd, user, savedStoreId, filterLabel, overview, spChart, overallInfo, custOverview, topSelling, lowStock, productExpiryAlerts, recentSales, recentTx, topCustomers, topCategories, orderStats, catStats]);


  const handleExportExcel = async () => {
    const wb = new ExcelJS.Workbook();
    wb.creator = "Smart Market";
    wb.created = new Date();

    const C = {
      blue: "FF4472C4",
      yellow: "FFFFD93D",
      darkBlue: "FF2F5597",
      white: "FFFFFFFF",
      sheet: "FFF4F4F4",
      grid: "FFD9E2F3",
      dark: "FF1F2937",
    };
    const thinBlue = { style: "thin", color: { argb: C.blue } };
    const thinGrid = { style: "thin", color: { argb: C.grid } };
    const tb = { top: thinGrid, left: thinGrid, bottom: thinGrid, right: thinGrid };
    const headerBorder = { top: thinBlue, left: thinBlue, bottom: thinBlue, right: thinBlue };
    const fill = (argb) => ({ type: "pattern", pattern: "solid", fgColor: { argb } });
    const applyMergeStyle = (ws, range, style) => {
      ws.getCell(range.split(":")[0]).style = { ...ws.getCell(range.split(":")[0]).style, ...style };
    };
    const money = (value) => `$${Number(value || 0).toFixed(2)}`;
    const paintSheetRow = (ws, row) => {
      for (let col = 1; col <= 12; col += 1) {
        ws.getCell(row, col).fill = fill(C.sheet);
      }
    };
    const getSpans = (count) => {
      const base = Math.floor(12 / count);
      const extra = 12 % count;
      let start = 1;
      return Array.from({ length: count }).map((_, index) => {
        const size = base + (index < extra ? 1 : 0);
        const span = [start, start + size - 1];
        start += size;
        return span;
      });
    };
    const mergeCell = (ws, row, startCol, endCol, value, style = {}) => {
      const start = ws.getCell(row, startCol).address;
      const end = ws.getCell(row, endCol).address;
      if (startCol !== endCol) ws.mergeCells(`${start}:${end}`);
      const cell = ws.getCell(row, startCol);
      cell.value = value;
      cell.style = { ...cell.style, ...style };
      return cell;
    };

    const invoiceSheet = wb.addWorksheet("Dashboard Invoice", {
      pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
      views: [{ showGridLines: true }],
    });
    invoiceSheet.properties.defaultRowHeight = 18;
    invoiceSheet.columns = [
      { width: 4 }, { width: 18 }, { width: 10 }, { width: 10 },
      { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 },
      { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 },
    ];

    for (let row = 1; row <= 32; row += 1) paintSheetRow(invoiceSheet, row);

    invoiceSheet.mergeCells("A2:F6");
    invoiceSheet.mergeCells("G2:L6");
    invoiceSheet.getCell("A2").value = {
      richText: [
        { text: `${printData.companyName}\n`, font: { name: "Calibri", size: 16, bold: true, color: { argb: C.white } } },
        { text: `dashboard analytics\n${printData.address}\n${printData.phone}\n${printData.email}`, font: { name: "Calibri", size: 10, color: { argb: C.white } } },
      ],
    };
    invoiceSheet.getCell("A2").alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    invoiceSheet.getCell("G2").value = {
      richText: [
        { text: "INVOICE\n", font: { name: "Calibri", size: 34, bold: true, color: { argb: C.yellow } } },
        { text: `Invoice Number: ${printData.invoiceNumber}\nInvoice Date: ${printData.invoiceDate}\nDue Date: ${printData.dueDate}`, font: { name: "Calibri", size: 10, bold: true, color: { argb: C.white } } },
      ],
    };
    invoiceSheet.getCell("G2").alignment = { vertical: "middle", horizontal: "right", wrapText: true };
    ["A2:F6", "G2:L6"].forEach((range) => applyMergeStyle(invoiceSheet, range, { fill: fill(C.blue) }));
    invoiceSheet.mergeCells("A7:L7");
    invoiceSheet.getCell("A7").fill = fill(C.yellow);

    invoiceSheet.mergeCells("B9:E10");
    invoiceSheet.getCell("B9").value = "Invoice To";
    invoiceSheet.getCell("B9").font = { name: "Calibri", size: 14, bold: true, color: { argb: C.darkBlue } };
    invoiceSheet.getCell("B9").alignment = { horizontal: "center", vertical: "middle" };
    invoiceSheet.mergeCells("H9:L11");
    invoiceSheet.getCell("H9").value = {
      richText: [
        { text: `${printData.companyName}\n`, font: { name: "Calibri", size: 13, bold: true, color: { argb: C.darkBlue } } },
        { text: `${printData.address}\nPeriod: ${printData.periodText}`, font: { name: "Calibri", size: 10, color: { argb: C.dark } } },
      ],
    };
    invoiceSheet.getCell("H9").alignment = { horizontal: "center", vertical: "middle", wrapText: true };

    invoiceSheet.mergeCells("A13:L13");
    invoiceSheet.getCell("A13").value = "Top Selling Items";
    invoiceSheet.getCell("A13").font = { name: "Calibri", size: 12, bold: true, color: { argb: C.darkBlue } };
    invoiceSheet.getCell("A13").border = { bottom: { style: "thin", color: { argb: C.blue } } };
    [
      ["A14:E14", "Item"],
      ["F14:H14", "Rank"],
      ["I14:J14", "Orders"],
      ["K14:L14", "Share"],
    ].forEach(([range, label]) => {
      invoiceSheet.mergeCells(range);
      const cell = invoiceSheet.getCell(range.split(":")[0]);
      cell.value = label;
      cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: C.white } };
      cell.fill = fill(C.blue);
      cell.alignment = { horizontal: label === "Item" ? "left" : "center", vertical: "middle" };
      cell.border = headerBorder;
    });

    const itemRows = printData.topItemRows.length > 0 ? printData.topItemRows : [["No data", "-", "-", "-"]];
    itemRows.forEach((row, index) => {
      const excelRow = 15 + index;
      [
        [`A${excelRow}:E${excelRow}`, row[0], "left"],
        [`F${excelRow}:H${excelRow}`, row[1], "center"],
        [`I${excelRow}:J${excelRow}`, row[2], "center"],
        [`K${excelRow}:L${excelRow}`, row[3], "right"],
      ].forEach(([range, value, align]) => {
        invoiceSheet.mergeCells(range);
        const cell = invoiceSheet.getCell(range.split(":")[0]);
        cell.value = value;
        cell.font = { name: "Calibri", size: 10, color: { argb: C.dark } };
        cell.border = tb;
        cell.alignment = { horizontal: align, vertical: "middle" };
      });
    });

    const totalsStart = Math.max(20, 15 + itemRows.length + 1);
    [
      ["Sub Total", money(printData.subtotal), false],
      ["Tax (7%)", money(printData.tax), false],
      ["TOTAL", money(printData.total), true],
    ].forEach(([label, value, strong], index) => {
      const row = totalsStart + index;
      invoiceSheet.mergeCells(`H${row}:J${row}`);
      invoiceSheet.mergeCells(`K${row}:L${row}`);
      invoiceSheet.getCell(`H${row}`).value = label;
      invoiceSheet.getCell(`K${row}`).value = value;
      [invoiceSheet.getCell(`H${row}`), invoiceSheet.getCell(`K${row}`)].forEach((cell) => {
        cell.font = { name: "Calibri", size: strong ? 14 : 10, bold: true, color: { argb: strong ? C.darkBlue : C.dark } };
        cell.alignment = { horizontal: cell.address.startsWith("K") ? "right" : "left", vertical: "middle" };
        cell.border = { top: thinBlue, bottom: strong ? thinBlue : thinGrid };
      });
    });

    const paymentStart = totalsStart + 5;
    invoiceSheet.mergeCells(`A${paymentStart}:L${paymentStart}`);
    invoiceSheet.getCell(`A${paymentStart}`).value = "Payment Information";
    invoiceSheet.getCell(`A${paymentStart}`).font = { name: "Calibri", size: 16, bold: true, color: { argb: C.darkBlue } };
    invoiceSheet.getCell(`A${paymentStart}`).alignment = { horizontal: "center", vertical: "middle" };
    invoiceSheet.getCell(`A${paymentStart}`).border = { top: thinBlue };
    printData.paymentRows.forEach(([label, value], index) => {
      const row = paymentStart + index + 1;
      invoiceSheet.mergeCells(`D${row}:F${row}`);
      invoiceSheet.mergeCells(`H${row}:L${row}`);
      invoiceSheet.getCell(`D${row}`).value = `${label}:`;
      invoiceSheet.getCell(`H${row}`).value = value;
      invoiceSheet.getCell(`D${row}`).font = { name: "Calibri", size: 10, bold: true, color: { argb: C.dark } };
      invoiceSheet.getCell(`H${row}`).font = { name: "Calibri", size: 10, color: { argb: C.dark } };
      invoiceSheet.getCell(`D${row}`).alignment = { horizontal: "right" };
      invoiceSheet.getCell(`H${row}`).alignment = { horizontal: "center" };
    });

    const addInvoiceSection = (startRow, title, headers, rows) => {
      const safeRows = rows.length > 0 ? rows : [headers.map((_, index) => (index === 0 ? "No data" : "-"))];
      const spans = getSpans(headers.length);
      for (let row = startRow; row <= startRow + safeRows.length + 2; row += 1) paintSheetRow(invoiceSheet, row);

      invoiceSheet.mergeCells(`A${startRow}:L${startRow}`);
      invoiceSheet.getCell(`A${startRow}`).value = title;
      invoiceSheet.getCell(`A${startRow}`).font = { name: "Calibri", size: 12, bold: true, color: { argb: C.darkBlue } };
      invoiceSheet.getCell(`A${startRow}`).alignment = { horizontal: "left", vertical: "middle" };
      invoiceSheet.getCell(`A${startRow}`).border = { bottom: thinBlue };

      headers.forEach((header, index) => {
        const [startCol, endCol] = spans[index];
        mergeCell(invoiceSheet, startRow + 1, startCol, endCol, header, {
          font: { name: "Calibri", size: 10, bold: true, color: { argb: C.white } },
          fill: fill(C.blue),
          alignment: { horizontal: index === 0 ? "left" : "center", vertical: "middle", wrapText: true },
          border: headerBorder,
        });
      });

      safeRows.forEach((rowData, rowIndex) => {
        const excelRow = startRow + 2 + rowIndex;
        rowData.forEach((value, colIndex) => {
          const [startCol, endCol] = spans[colIndex];
          mergeCell(invoiceSheet, excelRow, startCol, endCol, value ?? "-", {
            font: { name: "Calibri", size: 10, color: { argb: C.dark } },
            alignment: { horizontal: colIndex === 0 ? "left" : "right", vertical: "middle", wrapText: true },
            border: tb,
          });
        });
      });

      return startRow + safeRows.length + 4;
    };

    let sectionStart = paymentStart + printData.paymentRows.length + 4;
    printData.dashboardSections.forEach((section) => {
      sectionStart = addInvoiceSection(sectionStart, section.title, section.headers, section.rows);
    });

    const hs = { font: { name: "Calibri", size: 11, bold: true, color: { argb: C.white } }, fill: fill(C.blue), alignment: { horizontal: "center", vertical: "middle" }, border: tb };
    const addSheet = (name, title, headers, rows) => {
      const ws = wb.addWorksheet(name);
      ws.addRow([title]).font = { size: 14, bold: true, color: { argb: C.dark } };
      ws.addRow([]);
      const hr = ws.addRow(headers);
      hr.eachCell(c => { c.font = hs.font; c.fill = hs.fill; c.alignment = hs.alignment; c.border = hs.border; });
      rows.forEach(r => { const dr = ws.addRow(r); dr.eachCell((c, col) => { c.border = tb; c.alignment = { vertical: "middle", horizontal: col === 1 ? "left" : "right" }; }); });
      ws.autoFilter = { from: { row: hr.number, column: 1 }, to: { row: hr.number, column: headers.length } };
    };
    addSheet("Summary", "Dashboard Summary", ["Metric", "Value", "Change"], printData.summaryRows);
    if (printData.hasChart) addSheet("Sales & Purchase", "Sales vs Purchase", ["Period", "Sales", "Purchases"], printData.chartRows);
    addSheet("Overall Info", "Overall Information", ["Metric", "Count"], printData.infoRows);
    addSheet("Customer Overview", "Customer Overview", ["Type", "Count", "Percentage"], printData.custRows);
    if (printData.hasTopProd) addSheet("Top Products", "Top Selling Products", ["Product", "Sales", "Revenue"], printData.topProdRows);
    if (printData.hasLowStock) addSheet("Low Stock", "Low Stock Products", ["Product", "Stock", "Min Stock"], printData.lowStockRows);
    if (printData.hasExpiry) addSheet("Expiry Alerts", "Product Expiry Alerts", ["Product", "Batch", "Expiry Date", "Stock", "Days Left"], printData.expiryRows);
    if (printData.hasRSales) addSheet("Recent Sales", "Recent Sales", ["Product", "Category", "Amount", "Date"], printData.rSalesRows);
    if (printData.hasRTx) addSheet("Transactions", "Recent Transactions", ["Date", "Customer", "Qty", "Price", "Status", "Total"], printData.rTxRows);
    if (printData.hasTopCust) addSheet("Top Customers", "Top Customers", ["Name", "Country", "Orders", "Total Spent"], printData.topCustRows);
    if (printData.hasTopCat) addSheet("Top Categories", "Top Categories", ["Category", "Sales Amount"], printData.topCatRows);
    addSheet("Order Stats", "Order Statistics", ["Label", "Orders"], printData.orderRows);
    addSheet("Category Stats", "Category Statistics", ["Metric", "Count"], printData.catStatRows);
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `dashboard_${period}_${formatFileDate()}.xlsx`);
  };


  if (loading && !dashboard) return (
    <Box    >
      {/* <LinearProgress sx={{ borderRadius: 4, bgcolor: theme.palette.action.hover, "& .MuiLinearProgress-bar": { bgcolor: theme.palette.primary.main } }} />
      <Typography sx={{ mt: 2, fontSize: "0.875rem", color: theme.palette.text.secondary }}>{t("loading") || "Loading..."}</Typography> */}
      <DashboardSkeleton />
    </Box>
  );
  if (error) return <ErrorPage t={t} error={error} refetch={refetch} />;


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <style>{`@media print{@page{size:A4 portrait;margin:1.2cm 0.8cm;}body *{visibility:hidden;}#pdr,#pdr *{visibility:visible;}#pdr{position:fixed;left:0;top:0;width:100%;background:#f4f6fb;color:#111827;-webkit-print-color-adjust:exact;print-color-adjust:exact;}thead{display:table-header-group;}}`}</style>

      <Box sx={{ width: "100%", bgcolor: theme.palette.background.default, pb: 5 }}>
        <Box sx={{ "@media print": { display: "none" } }}>


          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{
                width: 38, height: 38, borderRadius: 1,
                bgcolor: theme.palette.primary.main, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 14px ${theme.palette.primary.main}70`,
              }}>
                <DashboardIcon sx={{ fontSize: 20, color: theme.palette.common.white }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: theme.palette.text.primary, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  {t("dashboard") || "Dashboard"}
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.secondary }}>
                  {formatDateLong(new Date())}
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{
                p: 0.75,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
               
              }}
            >
              <DashboardActionButton
                icon={<Download sx={{ fontSize: 18 }} />}
                title={t("export_excel")}
                 
                onClick={handleExportExcel}
              />
              <DashboardActionButton
                icon={<Print sx={{ fontSize: 18 }} />}
                title={t("print")}
 
                onClick={handlePrint}
                primary
              />
            </Stack>
          </Stack>

          <Box>

            <Box
              sx={{
                bgcolor: theme.palette.background.paper, borderRadius: 1, border: `1px solid ${theme.palette.divider}`,
                px: 2.5, py: 1.8, mb: 2.5,

              }}
            >
              <Grid container spacing={1.5} alignItems="center">
                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    select fullWidth size="small"
                    label={t("period") || "Period"}
                    value={period}
                    onChange={(e) => handlePeriodChange(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        textAlign: "left",
                        "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
                    }}
                  >
                    <MenuItem value="today">{t("today") || "Today"}</MenuItem>
                    <MenuItem value="week"> {t("week") || "Week"}</MenuItem>
                    <MenuItem value="month">{t("month") || "Month"}</MenuItem>
                    <MenuItem value="year"> {t("year") || "Year"}</MenuItem>
                    <MenuItem value="custom">{t("custom_range") || "Custom Range"}</MenuItem>
                  </TextField>
                </Grid>

                {period === "custom" && (
                  <>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <DatePicker
                        label={t("start_date")}
                        value={customStart}
                        onChange={setCustomStart}
                        slotProps={{ textField: { size: "small", fullWidth: true, sx: { "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main } } } } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <DatePicker
                        label={t("end_date")}
                        value={customEnd}
                        onChange={setCustomEnd}
                        slotProps={{ textField: { size: "small", fullWidth: true, sx: { "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main } } } } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <Button
                        variant="contained"
                        onClick={applyCustomRange}
                        disabled={!customStart || !customEnd}
                        sx={{
                          bgcolor: theme.palette.primary.main, borderRadius: 1, textTransform: "none",
                          fontWeight: 600, height: 36, px: 2.5,
                          boxShadow: `0 2px 8px ${theme.palette.primary.main}70`,
                          "&:hover": { bgcolor: theme.palette.primary.dark },
                        }}
                      >
                        {t("apply")}
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>


            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              {[
                {
                  title: t("total_sales") || "Total Sales",
                  value: overview.totalSales?.value || 0,
                  change: overview.totalSales?.percentageChange || 0,
                  trend: overview.totalSales?.trend || "up",
                  bg: `linear-gradient(135deg, ${theme.palette.primary.main} 0%)`,
                },
                {
                  title: t("total_sale_return") || "Total Sales Return",
                  value: overview.totalSalesReturn?.value || 0,
                  change: overview.totalSalesReturn?.percentageChange || 0,
                  trend: overview.totalSalesReturn?.trend || "down",
                  bg: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                },
                {
                  title: t("total_purchase") || "Total Purchase",
                  value: overview.totalPurchase?.value || 0,
                  change: overview.totalPurchase?.percentageChange || 0,
                  trend: overview.totalPurchase?.trend || "up",
                  bg: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.light} 100%)`,
                },
                {
                  title: t("total_purchase_return") || "Total Purchase Return",
                  value: overview.totalPurchaseReturn?.value || 0,
                  change: overview.totalPurchaseReturn?.percentageChange || 0,
                  trend: overview.totalPurchaseReturn?.trend || "up",
                  bg: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                },
              ].map((card, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                  <Box sx={{
                    background: card.bg,
                    borderRadius: "8px",
                    px: 2.5, py: 2.2,
                    position: "relative", overflow: "hidden",
                    minHeight: 82,
                    boxShadow: `0 4px 18px ${theme.palette.primary.main}40`,
                  }}>
                    <Box sx={{ position: "absolute", right: -20, top: -20, width: 80, height: 80, borderRadius: "50%", bgcolor: "rgba(255,255,255,.08)" }} />
                    <Box sx={{ position: "absolute", right: 22, bottom: -30, width: 56, height: 56, borderRadius: "50%", bgcolor: "rgba(255,255,255,.05)" }} />
                    <Box sx={{ position: "absolute", left: -14, bottom: -14, width: 48, height: 48, borderRadius: "50%", bgcolor: "rgba(255,255,255,.05)" }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ position: "relative", zIndex: 1 }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.67rem", color: "rgba(255,255,255,.8)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.6 }}>
                          {card.title}
                        </Typography>
                        <Typography sx={{ fontSize: "1.55rem", fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.02em" }}>
                          {formatCurrency(card.value)}
                        </Typography>
                      </Box>
                      <TrendPill trend={card.trend} change={card.change} light />
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>


            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              {[
                { title: t("profit") || "Profit", value: overview.profit?.value || 0, change: overview.profit?.percentageChange || 0, trend: overview.profit?.trend || "up", icon: <TrendingUp sx={{ fontSize: 18, color: theme.palette.primary.main }} />, iconBg: theme.palette.primary.light + "30" },
                { title: t("invoice_due") || "Invoice Due", value: overview.invoiceDue?.value || 0, change: overview.invoiceDue?.percentageChange || 0, trend: overview.invoiceDue?.trend || "up", icon: <Receipt sx={{ fontSize: 18, color: theme.palette.warning.main }} />, iconBg: theme.palette.warning.light + "30" },
                { title: t("total_expenses") || "Total Expenses", value: overview.totalExpenses?.value || 0, change: overview.totalExpenses?.percentageChange || 0, trend: overview.totalExpenses?.trend || "up", icon: <AttachMoney sx={{ fontSize: 18, color: theme.palette.info.main }} />, iconBg: theme.palette.info.light + "30" },
                { title: t("total_payment_returns") || "Payment Returns", value: overview.totalPaymentReturns?.value || 0, change: overview.totalPaymentReturns?.percentageChange || 0, trend: overview.totalPaymentReturns?.trend || "down", icon: <MonetizationOn sx={{ fontSize: 18, color: theme.palette.secondary.main }} />, iconBg: theme.palette.secondary.light + "30" },
              ].map((card, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                  <Card >
                    <CardContent sx={{ py: "16px !important", px: "18px !important" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: theme.palette.text.secondary, mb: 0.4 }}>
                            {card.title}
                          </Typography>
                          <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: theme.palette.text.primary, mb: 0.7, letterSpacing: "-0.02em" }}>
                            {formatCurrency(card.value)}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.8}>
                            <TrendPill trend={card.trend} change={card.change} />
                            <Typography sx={{ fontSize: "0.64rem", color: theme.palette.text.secondary }}>{t("vs_last_period")}</Typography>
                          </Stack>
                        </Box>
                        <Box sx={{
                          width: 42, height: 42, borderRadius: 1,
                          bgcolor: card.iconBg,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
                        }}>
                          {card.icon}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>


            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Card sx={cardSx(theme)}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2}>
                      <SectionTitle>{t("sales_purchase") || "Sales & Purchase"}</SectionTitle>
                      <PeriodPills active={spPeriod} onChange={setSpPeriod} />
                    </Stack>
                    <StableProgress loading={spLoading} />
                    <Box sx={{ opacity: spLoading ? 0.35 : 1, transition: "opacity .3s", minHeight: 280 }}>
                      <ScrollChart count={Math.max(spChart.labels.length, 1)}>
                        <Chart
                          options={makeBarOpts(spChart, false)}
                          series={[
                            { name: t("sales") || "Total Sales", data: spChart.sales.length > 0 ? spChart.sales : [0] },
                            { name: t("purchases") || "Total Purchase", data: spChart.purchases.length > 0 ? spChart.purchases : [0] },
                          ]}
                          type="bar" height={280}
                        />
                      </ScrollChart>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ ...cardSx(theme), height: "100%" }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <SectionTitle>{t("overall_info") || "Overall Information"}</SectionTitle>

                    <Grid container sx={{ mb: 2 }}>
                      {[
                        { label: t("suppliers") || "Suppliers", value: overallInfo.suppliers, color: theme.palette.success.main },
                        { label: t("customer") || "Customers", value: overallInfo.customers, color: theme.palette.primary.main },
                        { label: t("orders") || "Orders", value: overallInfo.orders, color: theme.palette.warning.main },
                      ].map((item, i) => (
                        <Grid size={4} key={i}>
                          <Box sx={{
                            textAlign: "center", py: 1.5,
                            borderRight: i < 2 ? `1px solid ${theme.palette.divider}` : "none",
                          }}>
                            <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: item.color, letterSpacing: "-0.02em" }}>
                              {item.value.toLocaleString()}
                            </Typography>
                            <Typography sx={{ fontSize: "0.66rem", color: theme.palette.text.secondary, mt: 0.2 }}>{item.label}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    <Divider sx={{ borderColor: theme.palette.divider, mb: 1.8 }} />

                    <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: theme.palette.text.primary, mb: 1.2 }}>
                      {t("customer_overview") || "Customers Overview"}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minHeight: 130 }}>
                      <Box sx={{ flexShrink: 0 }}>
                        <Chart
                          options={customerDonutOpts}
                          series={[custOverview.firstTime || 0, custOverview.return || 0]}
                          type="donut" height={130} width={130}
                        />
                      </Box>
                      <Stack spacing={1.4} flex={1}>
                        {[
                          { label: t("first_time") || "First Time", value: custOverview.firstTime, pct: custOverview.firstTimePercent, color: theme.palette.primary.main },
                          { label: t("return") || "Return", value: custOverview.return, pct: custOverview.returnPercent, color: theme.palette.primary.dark },
                        ].map((row, i) => (
                          <Box key={i}>
                            <Stack direction="row" justifyContent="space-between" mb={0.4}>
                              <Stack direction="row" alignItems="center" spacing={0.7}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: row.color }} />
                                <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.secondary }}>{row.label}</Typography>
                              </Stack>
                              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: theme.palette.text.primary }}>
                                {row.value.toLocaleString()}
                              </Typography>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(row.pct || 0, 100)}
                              sx={{
                                height: 5, borderRadius: 3,
                                bgcolor: `${row.color}1A`,
                                "& .MuiLinearProgress-bar": { bgcolor: row.color, borderRadius: 3 },
                              }}
                            />
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>


            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={cardSx(theme)}>
                  <CardContent sx={{ pb: "12px !important", p: "20px !important" }}>
                    <SectionTitle action={<ViewAllBtn />}>{t("top_selling_products") || "Top Selling Products"}</SectionTitle>
                    <TableContainer sx={{ minHeight: 220 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={thSx(theme)}>{t("product") || "Product"}</TableCell>
                            <TableCell align="right" sx={thSx(theme)}>{t("sales") || "Sales"}</TableCell>
                            <TableCell align="right" sx={thSx(theme)}>{t("revenue") || "Revenue"}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {topSelling.length === 0
                            ? <SkeletonRows count={5} cols={3} opacity={loading ? 0.4 : 0.2} />
                            : topSelling.map((item, idx) => (
                              <TableRow key={idx} hover sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: theme.palette.action.hover } }}>
                                <TableCell sx={tdSx(theme)}>
                                  <Stack direction="row" alignItems="center" spacing={1.4}>
                                    <Avatar sx={{
                                      width: 30, height: 30, borderRadius: 2,
                                      bgcolor: `${theme.palette.primary.main}15`, color: theme.palette.primary.main,
                                      fontSize: "0.68rem", fontWeight: 700,
                                    }}>
                                      {(item.productName || "?")[0]}
                                    </Avatar>
                                    <Box>
                                      <Typography sx={{ fontSize: "0.79rem", fontWeight: 600, color: theme.palette.text.primary, lineHeight: 1.2 }}>{item.productName}</Typography>
                                      <Typography sx={{ fontSize: "0.64rem", color: theme.palette.text.secondary }}>${(item.revenue / (item.sales || 1)).toFixed(2)} avg</Typography>
                                    </Box>
                                  </Stack>
                                </TableCell>
                                <TableCell align="right" sx={{ ...tdSx(theme), fontWeight: 600 }}>{item.sales}</TableCell>
                                <TableCell align="right" sx={{ ...tdSx(theme), fontWeight: 700, color: theme.palette.primary.main }}>{formatCurrency(item.revenue)}</TableCell>
                              </TableRow>
                            ))
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>


              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={cardSx(theme)}>
                  <CardContent sx={{ pb: "12px !important", p: "20px !important" }}>
                    <SectionTitle action={<ViewAllBtn />}>{t("low_stock_products") || "Low Stock Products"}</SectionTitle>
                    <TableContainer sx={{ minHeight: 220 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={thSx(theme)}>{t("product") || "Product"}</TableCell>
                            <TableCell sx={thSx(theme)}>ID</TableCell>
                            <TableCell align="right" sx={thSx(theme)}>{t("stock") || "Stock"}</TableCell>
                            <TableCell align="right" sx={thSx(theme)}>{t("min_stock") || "Min"}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {lowStock.length === 0
                            ? <SkeletonRows count={5} cols={4} opacity={loading ? 0.4 : 0.2} />
                            : lowStock.map((item, idx) => (
                              <TableRow key={idx} hover sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: theme.palette.action.hover } }}>
                                <TableCell sx={tdSx(theme)}>
                                  <Stack direction="row" alignItems="center" spacing={1.4}>
                                    <Avatar sx={{ width: 30, height: 30, borderRadius: 2, bgcolor: theme.palette.action.hover, color: theme.palette.text.secondary, fontSize: "0.65rem" }}>
                                      {(item.productName || "?")[0]}
                                    </Avatar>
                                    <Typography sx={{ fontSize: "0.79rem", color: theme.palette.text.primary }}>{item.productName}</Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell sx={{ ...tdSx(theme), fontSize: "0.7rem", color: theme.palette.text.secondary }}>{item.id || "-"}</TableCell>
                                <TableCell align="right">
                                  <Chip
                                    label={item.stock <= item.minStock ? `${item.stock} low` : item.stock}
                                    size="small"
                                    sx={{
                                      fontWeight: 700, fontSize: "0.64rem", borderRadius: 6, height: 20,
                                      bgcolor: item.stock <= item.minStock ? theme.palette.error.light + "30" : theme.palette.success.light + "30",
                                      color: item.stock <= item.minStock ? theme.palette.error.main : theme.palette.success.main,
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="right" sx={tdSx(theme)}>{item.minStock}</TableCell>
                              </TableRow>
                            ))
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>


            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              <Grid size={{ xs: 12 }}>
                <Card sx={cardSx(theme)}>
                  <CardContent sx={{ pb: "12px !important", p: "20px !important" }}>
                    <SectionTitle action={<ViewAllBtn />}>{t("product_expiry") || "Product Expiry"}</SectionTitle>
                    <TableContainer sx={{ minHeight: 220 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={thSx(theme)}>{t("product") || "Product"}</TableCell>
                            <TableCell sx={thSx(theme)}>{t("batch") || "Batch"}</TableCell>
                            <TableCell sx={thSx(theme)}>{t("expiry_date") || "Expiry Date"}</TableCell>
                            <TableCell align="right" sx={thSx(theme)}>{t("stock") || "Stock"}</TableCell>
                            <TableCell align="right" sx={thSx(theme)}>{t("days_left") || "Days Left"}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productExpiryAlerts.length === 0
                            ? <SkeletonRows count={5} cols={5} opacity={loading ? 0.4 : 0.2} />
                            : productExpiryAlerts.map((item, idx) => {
                              const isExpired = Number(item.daysUntilExpiry) < 0;
                              const isUrgent = Number(item.daysUntilExpiry) <= 3;
                              return (
                                <TableRow key={idx} hover sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: theme.palette.action.hover } }}>
                                  <TableCell sx={tdSx(theme)}>
                                    <Stack direction="row" alignItems="center" spacing={1.4}>
                                      <Avatar sx={{ width: 30, height: 30, borderRadius: 2, bgcolor: theme.palette.warning.light + "30", color: theme.palette.warning.main, fontSize: "0.65rem" }}>
                                        {(item.productName || "?")[0]}
                                      </Avatar>
                                      <Typography sx={{ fontSize: "0.79rem", color: theme.palette.text.primary }}>{item.productName}</Typography>
                                    </Stack>
                                  </TableCell>
                                  <TableCell sx={tdSx(theme)}>{item.batchNo || "-"}</TableCell>
                                  <TableCell sx={tdSx(theme)}>{formatDateShort(item.expiryDate)}</TableCell>
                                  <TableCell align="right" sx={tdSx(theme)}>{item.stock ?? 0}</TableCell>
                                  <TableCell align="right">
                                    <Chip
                                      label={isExpired ? `${Math.abs(item.daysUntilExpiry)} expired` : item.daysUntilExpiry}
                                      size="small"
                                      sx={{
                                        fontWeight: 700, fontSize: "0.64rem", borderRadius: 6, height: 20,
                                        bgcolor: (isExpired || isUrgent) ? theme.palette.error.light + "30" : theme.palette.warning.light + "30",
                                        color: (isExpired || isUrgent) ? theme.palette.error.main : theme.palette.warning.main,
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>


            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Card sx={cardSx(theme)}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={0.8}>
                      <SectionTitle>{t("sales_stats") || "Sales Statistics"}</SectionTitle>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={0.6}>
                          <Box sx={{ width: 9, height: 9, borderRadius: 2, bgcolor: theme.palette.primary.main }} />
                          <Typography sx={{ fontSize: "0.67rem", color: theme.palette.text.secondary }}>{t("sales") || "Revenue"}</Typography>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, color: theme.palette.primary.main }}>{formatCurrency(overview.totalSales?.value || 0)}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.6}>
                          <Box sx={{ width: 9, height: 9, borderRadius: 2, bgcolor: theme.palette.secondary.main }} />
                          <Typography sx={{ fontSize: "0.67rem", color: theme.palette.text.secondary }}>{t("purchases") || "Purchase"}</Typography>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, color: theme.palette.secondary.main }}>{formatCurrency(overview.totalPurchase?.value || 0)}</Typography>
                        </Stack>
                      </Stack>
                    </Stack>

                    <Stack direction="row" justifyContent="flex-end" mb={1.2}>
                      <PeriodPills active={statsPeriod} onChange={setStatsPeriod} />
                    </Stack>

                    <StableProgress loading={statsLoading} />

                    <Box sx={{ opacity: statsLoading ? 0.35 : 1, transition: "opacity .3s", minHeight: 250 }}>
                      <ScrollChart count={Math.max(statsChart.labels.length, 1)}>
                        <Chart
                          options={makeBarOpts(statsChart, true)}
                          series={[
                            { name: t("sales") || "Sales", data: statsChart.sales.length > 0 ? statsChart.sales : [0] },
                            { name: t("purchases") || "Purchase", data: statsChart.purchases.length > 0 ? statsChart.purchases : [0] },
                          ]}
                          type="bar" height={250}
                        />
                      </ScrollChart>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Card sx={{ ...cardSx(theme), height: "100%" }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <SectionTitle>{t("recent_transactions") || "Recent Transactions"}</SectionTitle>
                      <PeriodPills active={txPeriod} onChange={setTxPeriod} />
                    </Stack>

                    <Stack
                      direction="row"
                      sx={{
                        borderBottom: `2px solid ${theme.palette.divider}`, mb: 1.8,
                        overflowX: "auto", "&::-webkit-scrollbar": { display: "none" },
                      }}
                    >
                      {TX_TABS.map((tab) => {
                        const active = txTab === tab.key;
                        return (
                          <Typography
                            key={tab.key}
                            onClick={() => setTxTab(tab.key)}
                            sx={{
                              fontSize: "0.69rem", fontWeight: active ? 700 : 500,
                              color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                              pb: 0.9, px: 1.1,
                              borderBottom: active ? `2px solid ${theme.palette.primary.main}` : "2px solid transparent",
                              mb: "-2px",
                              cursor: "pointer", whiteSpace: "nowrap",
                              "&:hover": { color: theme.palette.primary.main },
                              transition: "color .15s",
                            }}
                          >
                            {tab.label}
                          </Typography>
                        );
                      })}
                    </Stack>

                    <StableProgress loading={txLoading} />

                    <TableContainer sx={{ minHeight: 260 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={thSx(theme)}>{t("customer") || "Customer"}</TableCell>
                            <TableCell sx={thSx(theme)}>{t("due_date")}</TableCell>
                            <TableCell sx={thSx(theme)}>{t("status")}</TableCell>
                            <TableCell align="right" sx={thSx(theme)}>{t("amount")}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {txLoading
                            ? <SkeletonRows count={6} cols={4} opacity={0.4} />
                            : recentTx.length === 0
                              ? <SkeletonRows count={6} cols={4} opacity={0.18} />
                              : recentTx.map((item, idx) => {
                                const sc = getStatusStyle(item.status, theme);
                                return (
                                  <TableRow key={idx} hover sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: theme.palette.action.hover } }}>
                                    <TableCell sx={tdSx(theme)}>
                                      <Stack direction="row" alignItems="center" spacing={1.1}>
                                        <Avatar sx={{
                                          width: 26, height: 26,
                                          bgcolor: `${categoryColors[idx % categoryColors.length]}18`,
                                          color: categoryColors[idx % categoryColors.length],
                                          fontSize: "0.62rem", fontWeight: 700,
                                        }}>
                                          {(item.customer || "?")[0]}
                                        </Avatar>
                                        <Box>
                                          <Typography sx={{ fontSize: "0.76rem", fontWeight: 600, color: theme.palette.text.primary, lineHeight: 1.2 }}>{item.customer}</Typography>
                                          <Typography sx={{ fontSize: "0.62rem", color: theme.palette.text.secondary }}>#{item.id || idx}</Typography>
                                        </Box>
                                      </Stack>
                                    </TableCell>
                                    <TableCell sx={{ ...tdSx(theme), fontSize: "0.7rem", color: theme.palette.text.secondary }}>{formatDateShort(item.date)}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={item.status}
                                        size="small"
                                        sx={{ fontWeight: 700, fontSize: "0.62rem", borderRadius: 6, height: 19, bgcolor: sc.bg, color: sc.color }}
                                      />
                                    </TableCell>
                                    <TableCell align="right" sx={{ ...tdSx(theme), fontWeight: 700, color: theme.palette.primary.main }}>{formatCurrency(item.total)}</TableCell>
                                  </TableRow>
                                );
                              })
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>


            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Card sx={{ ...cardSx(theme), height: "100%" }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <SectionTitle action={<ViewAllBtn />}>{t("top_customers") || "Top Customers"}</SectionTitle>
                    <Stack spacing={2} sx={{ minHeight: 220 }}>
                      {topCustomers.length === 0
                        ? <SkeletonCustomerRows count={5} />
                        : topCustomers.map((item, idx) => (
                          <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" alignItems="center" spacing={1.3}>
                              <Avatar sx={{
                                width: 36, height: 36, borderRadius: 2.5,
                                bgcolor: `${categoryColors[idx % categoryColors.length]}15`,
                                color: categoryColors[idx % categoryColors.length],
                                fontSize: "0.74rem", fontWeight: 700,
                              }}>
                                {(item.name || "?")[0]}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontSize: "0.79rem", fontWeight: 600, color: theme.palette.text.primary, lineHeight: 1.2 }}>{item.name}</Typography>
                                <Typography sx={{ fontSize: "0.63rem", color: theme.palette.text.secondary }}>{item.country || "-"} · {item.orders} orders</Typography>
                              </Box>
                            </Stack>
                            <Typography sx={{ fontSize: "0.79rem", fontWeight: 700, color: theme.palette.primary.main }}>{formatCurrency(item.totalSpent)}</Typography>
                          </Stack>
                        ))
                      }
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ ...cardSx(theme), height: "100%" }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <SectionTitle action={<PeriodDropdown active={bottomPeriod} onChange={setBottomPeriod} />}>
                      {t("top_categories") || "Top Categories"}
                    </SectionTitle>

                    <StableProgress loading={bottomLoading} />

                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minHeight: 160 }}>
                      <Box sx={{ flexShrink: 0, opacity: bottomLoading ? 0.35 : 1, transition: "opacity .3s" }}>
                        <Chart
                          options={categoryDonutOpts}
                          series={topCategories.length > 0 ? topCategories.map(c => c.salesAmount) : [1]}
                          type="donut" height={160} width={160}
                        />
                      </Box>
                      <Stack spacing={1.3} flex={1}>
                        {topCategories.length === 0
                          ? Array.from({ length: 4 }).map((_, i) => (
                            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{ opacity: 0.22 }}>
                              <Stack direction="row" alignItems="center" spacing={0.8}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: theme.palette.divider }} />
                                <Box sx={{ height: 9, borderRadius: 2, bgcolor: theme.palette.divider, width: `${40 + i * 12}px` }} />
                              </Stack>
                              <Box sx={{ height: 9, borderRadius: 2, bgcolor: theme.palette.divider, width: 32 }} />
                            </Stack>
                          ))
                          : topCategories.slice(0, 5).map((cat, i) => (
                            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                              <Stack direction="row" alignItems="center" spacing={0.8}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: categoryColors[i % categoryColors.length] }} />
                                <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.secondary }}>{cat.name}</Typography>
                              </Stack>
                              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: theme.palette.text.primary }}>{cat.salesAmount?.toLocaleString()}</Typography>
                            </Stack>
                          ))
                        }
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 1.8, borderColor: theme.palette.divider }} />
                    <Stack direction="row" justifyContent="space-around">
                      {[
                        { label: t("category"), value: catStats.totalCategories },
                        { label: t("product"), value: catStats.totalProducts },
                      ].map((s, i) => (
                        <Box key={i} sx={{ textAlign: "center" }}>
                          <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: theme.palette.primary.main, letterSpacing: "-0.02em" }}>{s.value}</Typography>
                          <Typography sx={{ fontSize: "0.65rem", color: theme.palette.text.secondary }}>{s.label}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Card sx={{ ...cardSx(theme), height: "100%" }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <SectionTitle action={<PeriodDropdown active={bottomPeriod} onChange={setBottomPeriod} />}>
                      {t("order_statistics") || "Order Statistics"}
                    </SectionTitle>

                    <StableProgress loading={bottomLoading} />

                    <Box sx={{ opacity: bottomLoading ? 0.35 : 1, transition: "opacity .3s", minHeight: 260 }}>
                      <Chart
                        options={orderStatsOpts}
                        series={[{ name: t("orders") || "Orders", data: orderStats.values }]}
                        type="bar" height={260}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>


        <Box id="pdr" sx={{ position: "fixed", left: "-10000px", top: 0, width: "100%", visibility: "hidden", "@media print": { position: "relative", left: 0, top: 0, visibility: "visible" } }}>
          <Box sx={{ bgcolor: "#f4f4f4", minHeight: "100vh", p: 0.5 }}>
            <Box sx={{ width: "100%", maxWidth: 920, mx: "auto", bgcolor: "#f4f4f4", color: "#1f2937", fontFamily: "Calibri, Arial, sans-serif" }}>
              <Stack direction="row" sx={{ bgcolor: "#4472c4", color: "#fff", minHeight: 150 }}>
                <Box sx={{ width: "52%", p: 2.2 }}>
                  <Typography sx={{ fontSize: 24, fontWeight: 800, lineHeight: 1.1 }}>
                    {printData.companyName}
                  </Typography>
                  <Typography sx={{ fontSize: 13, lineHeight: 1.9, mt: 0.5 }}>
                    dashboard analytics<br />
                    {printData.address}<br />
                    {printData.phone}<br />
                    {printData.email}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, p: 2.2, textAlign: "right" }}>
                  <Typography sx={{ fontSize: 54, lineHeight: 1, fontWeight: 900, color: "#ffd93d", letterSpacing: 0 }}>
                    INVOICE
                  </Typography>
                  <Typography sx={{ fontSize: 13, lineHeight: 1.9, fontWeight: 700, mt: 0.7 }}>
                    Invoice Number: {printData.invoiceNumber}<br />
                    Invoice Date: {printData.invoiceDate}<br />
                    Due Date: {printData.dueDate}
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ height: 26, bgcolor: "#ffd93d" }} />

              <Grid container sx={{ minHeight: 126, alignItems: "center" }}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ textAlign: "center", fontSize: 21, fontWeight: 800, color: "#2f5597" }}>
                    Invoice To
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ textAlign: "center", fontSize: 21, fontWeight: 800, color: "#2f5597" }}>
                    {printData.companyName}
                  </Typography>
                  <Typography sx={{ textAlign: "center", fontSize: 13, lineHeight: 1.8 }}>
                    {printData.address}<br />
                    Period: {printData.periodText}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ borderTop: "1.5px solid #4472c4", mb: 0.8 }}>
                <Typography sx={{ fontSize: 18, lineHeight: 1.5, fontWeight: 800, color: "#2f5597", px: 0.5 }}>
                  Top Selling Items
                </Typography>
              </Box>

              <Table size="small" sx={{ tableLayout: "fixed", width: "100%", "& td, & th": { fontFamily: "Calibri, Arial, sans-serif" } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "43%", bgcolor: "#4472c4", color: "#fff", fontSize: 16, fontWeight: 800, py: 0.6, borderRight: "1px solid #d9e2f3" }}>Item</TableCell>
                    <TableCell align="center" sx={{ width: "24%", bgcolor: "#4472c4", color: "#fff", fontSize: 16, fontWeight: 800, py: 0.6, borderRight: "1px solid #d9e2f3" }}>Rank</TableCell>
                    <TableCell align="center" sx={{ width: "17%", bgcolor: "#4472c4", color: "#fff", fontSize: 16, fontWeight: 800, py: 0.6, borderRight: "1px solid #d9e2f3" }}>Orders</TableCell>
                    <TableCell align="right" sx={{ width: "16%", bgcolor: "#4472c4", color: "#fff", fontSize: 16, fontWeight: 800, py: 0.6 }}>Share</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(printData.topItemRows.length > 0 ? printData.topItemRows : [["No data", "-", "-", "-"]]).map((row, index) => (
                    <TableRow key={`${row[0]}-${index}`}>
                      <TableCell sx={{ fontSize: 13, py: 0.55, borderBottom: "1px solid #d9e2f3" }}>{row[0]}</TableCell>
                      <TableCell align="center" sx={{ fontSize: 13, py: 0.55, borderBottom: "1px solid #d9e2f3" }}>{row[1]}</TableCell>
                      <TableCell align="center" sx={{ fontSize: 13, py: 0.55, borderBottom: "1px solid #d9e2f3" }}>{row[2]}</TableCell>
                      <TableCell align="right" sx={{ fontSize: 13, py: 0.55, borderBottom: "1px solid #d9e2f3" }}>{row[3]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Grid container sx={{ mt: 2.8, borderBottom: "1.5px solid #4472c4", pb: 1.2 }}>
                <Grid size={{ xs: 7 }} />
                <Grid size={{ xs: 5 }}>
                  {[
                    ["Sub Total", formatCurrency(printData.subtotal), false],
                    ["Tax (7%)", formatCurrency(printData.tax), false],
                    ["TOTAL", formatCurrency(printData.total), true],
                  ].map(([label, value, strong]) => (
                    <Stack key={label} direction="row" justifyContent="space-between" sx={{ borderTop: "1.5px solid #4472c4", py: 0.45 }}>
                      <Typography sx={{ fontSize: strong ? 19 : 13, fontWeight: 800, color: strong ? "#2f5597" : "#1f2937" }}>{label}</Typography>
                      <Typography sx={{ fontSize: strong ? 20 : 13, fontWeight: 800, color: strong ? "#2f5597" : "#1f2937" }}>{value}</Typography>
                    </Stack>
                  ))}
                </Grid>
              </Grid>

              <Box sx={{ pt: 0.8 }}>
                <Typography sx={{ textAlign: "center", fontSize: 24, fontWeight: 800, color: "#2f5597", lineHeight: 1.3 }}>
                  Payment Information
                </Typography>
                <Box sx={{ width: "62%", mx: "auto", mt: 0.6 }}>
                  {printData.paymentRows.map(([label, value]) => (
                    <Stack key={label} direction="row" sx={{ py: 0.25 }}>
                      <Typography sx={{ width: "45%", textAlign: "right", pr: 2, fontSize: 14, fontWeight: 800 }}>
                        {label}:
                      </Typography>
                      <Typography sx={{ flex: 1, textAlign: "center", fontSize: 14 }}>
                        {value}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                {printData.dashboardSections.map((section) => (
                  <Box key={section.title} sx={{ mt: 2.2, breakInside: "avoid" }}>
                    <Box sx={{ borderTop: "1.5px solid #4472c4", mb: 0.6 }}>
                      <Typography sx={{ fontSize: 16, lineHeight: 1.5, fontWeight: 800, color: "#2f5597", px: 0.5 }}>
                        {section.title}
                      </Typography>
                    </Box>
                    <Table size="small" sx={{ tableLayout: "fixed", width: "100%", "& td, & th": { fontFamily: "Calibri, Arial, sans-serif" } }}>
                      <TableHead>
                        <TableRow>
                          {section.headers.map((header, index) => (
                            <TableCell
                              key={header}
                              align={index === 0 ? "left" : "right"}
                              sx={{ bgcolor: "#4472c4", color: "#fff", fontSize: 12, fontWeight: 800, py: 0.45, borderRight: "1px solid #d9e2f3" }}
                            >
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(section.rows.length > 0 ? section.rows : [section.headers.map((_, index) => (index === 0 ? "No data" : "-"))]).map((row, rowIndex) => (
                          <TableRow key={`${section.title}-${rowIndex}`}>
                            {row.map((cell, cellIndex) => (
                              <TableCell
                                key={`${section.title}-${rowIndex}-${cellIndex}`}
                                align={cellIndex === 0 ? "left" : "right"}
                                sx={{ fontSize: 11, py: 0.4, borderBottom: "1px solid #d9e2f3", overflowWrap: "anywhere" }}
                              >
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
