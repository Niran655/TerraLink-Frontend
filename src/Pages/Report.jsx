
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PercentIcon from "@mui/icons-material/Percent";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Search as SearchIcon,
  Assessment as AssessmentIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Typography,
  Alert,
  Tab,
  Tabs,
  TableBody,
  Card,
  CardContent,
  FormControl,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  GET_SALE_REPORT,
  GET_PURCHASE_REPORT,
  GET_INVENTORY_REPORT,
  GET_INVOICE_REPORT,
  GET_SUPPLIER_REPORT,
  GET_SUPPLIER_DUE_REPORT,
  GET_CUSTOMER_REPORT,
  GET_CUSTOMER_DUE_REPORT,
  GET_PRODUCT_REPORT,
  GET_PRODUCT_EXPIRY_REPORT,
  GET_PRODUCT_QUANTITY_ALERT,
  GET_EXPENSE_REPORT,
  GET_INCOME_REPORT,
  GET_TAX_REPORT,
  GET_PROFIT_LOSS_REPORT,
  GET_ANNUAL_REPORT,
} from "../../graphql/queries";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import FooterPagination from "../include/FooterPagination";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
import {
  DollarSign,    
  ShoppingCart, 
  Package,      
  Receipt,      
  Factory,       
  AlertTriangle, 
  Users,         
  Bell,         
  Tag,          
  Clock,        
  AlertCircle,   
  TrendingDown,  
  TrendingUp,    
  Landmark,      
  BarChart2,     
  CalendarDays,  
  
} from "lucide-react";

const formatCurrency = (value) =>
  value == null
    ? "$0.00"
    : `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

const formatDateLong = (value) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "-";
  return value.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateShort = (value) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "-";
  return value.toLocaleDateString("en-US");
};

const formatFileDate = (value = new Date()) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "report";
  return value.toISOString().slice(0, 10);
};


const TAB_ICONS = {
  sale:         <DollarSign    size={16} />,
  purchase:     <ShoppingCart  size={16} />,
  inventory:    <Package       size={16} />,
  invoice:      <Receipt       size={16} />,
  supplier:     <Factory       size={16} />,
  supplierDue:  <AlertTriangle size={16} />,
  customer:     <Users         size={16} />,
  customerDue:  <Bell          size={16} />,
  product:      <Tag           size={16} />,
  productExpiry:<Clock         size={16} />,
  productAlert: <AlertCircle   size={16} />,
  expense:      <TrendingDown  size={16} />,
  income:       <TrendingUp    size={16} />,
  tax:          <Landmark      size={16} />,
  pnl:          <BarChart2     size={16} />,
  annual:       <CalendarDays  size={16} />,
};


const SummaryCard = ({ label, value, colorName = "primary", icon }) => {
  const theme = useTheme();

  const getColor = () => {
    switch (colorName) {
      case "primary": return theme.palette.primary.main;
      case "success": return theme.palette.success.main;
      case "warning": return theme.palette.warning.main;
      default: return theme.palette.primary.main;
    }
  };
  const mainColor = getColor();
  return (
    <Card
      variant="outlined"
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.2s, transform 0.2s",
        
      }}
    >
      <CardContent sx={{ pt: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "0.7rem",
              }}
            >
              {label}
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: mainColor, fontWeight: 700, mt: 0.5, letterSpacing: "-0.02em" }}
            >
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              borderRadius: 1,
              backgroundColor: mainColor + "33",
              width: 44,
              height: 44,
              fontSize: "1.4rem",
              color: mainColor,
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};


const ReportPage = ({ shopId = null }) => {
  const theme = useTheme();
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: t("sale_report") || "Sale Report", value: "sale" },
    { label: t("purchase_report") || "Purchase Report", value: "purchase" },
    { label: t("inventory_report") || "Inventory Report", value: "inventory" },
    { label: t("invoice_report") || "Invoice Report", value: "invoice" },
    { label: t("supplier_report") || "Supplier Report", value: "supplier" },
    { label: t("supplier_due") || "Supplier Due", value: "supplierDue" },
    { label: t("customer_report") || "Customer Report", value: "customer" },
    { label: t("customer_due") || "Customer Due", value: "customerDue" },
    { label: t("product_report") || "Product Report", value: "product" },
    { label: t("product_expiry") || "Product Expiry", value: "productExpiry" },
    { label: t("product_alert") || "Product Alert", value: "productAlert" },
    { label: t("expense_report") || "Expense Report", value: "expense" },
    { label: t("income_report") || "Income Report", value: "income" },
    { label: t("tax_report") || "Tax Report", value: "tax" },
    { label: t("profit_loss") || "Profit & Loss", value: "pnl" },
    { label: t("annual_report") || "Annual Report", value: "annual" },
  ];

  const [dateRange, setDateRange] = useState({ start: thirtyDaysAgo, end: today });
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [daysThreshold, setDaysThreshold] = useState(30);
  const [categoryId, setCategoryId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [saleDetailView, setSaleDetailView] = useState("bestSellers");
  const saleDetailOptions = [
    { value: "bestSellers", label: t("best_sellers") || "Best Sellers" },
    { value: "paymentMethod", label: t("sales_by_payment_method") || "Sales by Payment Method" },
    { value: "orderType", label: t("sales_by_order_type") || "Sales by Order Type" },
    { value: "dailySales", label: t("daily_sales") || "Daily Sales" },
    { value: "recentTransactions", label: t("recent_transactions") || "Recent Transactions" },
  ];

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination] = useState(true);

  useEffect(() => {
    setPage(1);
    setSearchQuery("");
  }, [activeTab, dateRange, selectedYear, categoryId, saleDetailView]);

  const getQueryVariables = () => {
    const common = { shopId, page, limit, pagination };
    const currentTab = tabs[activeTab].value;
    switch (currentTab) {
      case "sale":
      case "purchase":
      case "invoice":
      case "customer":
      case "expense":
      case "income":
        return {
          ...common,
          startDate: dateRange.start?.toISOString(),
          endDate: dateRange.end?.toISOString(),
        };
      case "inventory":
        return {
          shopId,
          startDate: dateRange.start?.toISOString(),
          endDate: dateRange.end?.toISOString(),
          page, limit, pagination,
        };
      case "supplier":
      case "supplierDue":
        return { shopId };
      case "customerDue":
        return { shopId, page, limit, pagination };
      case "product":
        return { shopId, categoryId: categoryId || undefined, page, limit, pagination };
      case "productExpiry":
        return { shopId, daysThreshold, page, limit, pagination };
      case "productAlert":
        return { shopId, page, limit, pagination };
      case "tax":
      case "pnl":
        return {
          shopId,
          startDate: dateRange.start?.toISOString(),
          endDate: dateRange.end?.toISOString(),
        };
      case "annual":
        return { shopId, year: selectedYear };
      default:
        return {};
    }
  };

  const getQuery = () => {
    const currentTab = tabs[activeTab].value;
    switch (currentTab) {
      case "sale": return GET_SALE_REPORT;
      case "purchase": return GET_PURCHASE_REPORT;
      case "inventory": return GET_INVENTORY_REPORT;
      case "invoice": return GET_INVOICE_REPORT;
      case "supplier": return GET_SUPPLIER_REPORT;
      case "supplierDue": return GET_SUPPLIER_DUE_REPORT;
      case "customer": return GET_CUSTOMER_REPORT;
      case "customerDue": return GET_CUSTOMER_DUE_REPORT;
      case "product": return GET_PRODUCT_REPORT;
      case "productExpiry": return GET_PRODUCT_EXPIRY_REPORT;
      case "productAlert": return GET_PRODUCT_QUANTITY_ALERT;
      case "expense": return GET_EXPENSE_REPORT;
      case "income": return GET_INCOME_REPORT;
      case "tax": return GET_TAX_REPORT;
      case "pnl": return GET_PROFIT_LOSS_REPORT;
      case "annual": return GET_ANNUAL_REPORT;
      default: return null;
    }
  };

  const query = getQuery();
  const variables = getQueryVariables();
  const { data, loading, error } = useQuery(query, {
    variables,
    skip: !query,
    fetchPolicy: "network-only",
  });

  const reportData = data?.[Object.keys(data || {})[0]];

  const getTableHeaders = () => {
    const currentTab = tabs[activeTab].value;
    if (currentTab === "sale") {
      switch (saleDetailView) {
        case "bestSellers":
          return [t("product") || "Product", t("units_sold") || "Units Sold", t("revenue") || "Revenue"];
        case "paymentMethod":
          return [t("payment_method") || "Payment Method", t("orders_count") || "Orders Count", t("total_amount") || "Total Amount"];
        case "orderType":
          return [t("order_type") || "Order Type", t("orders_count") || "Orders Count", t("total_amount") || "Total Amount"];
        case "dailySales":
          return [t("date") || "Date", t("orders") || "Orders", t("revenue") || "Revenue"];
        case "recentTransactions":
          return [t("transaction_id") || "Transaction ID", t("date") || "Date", t("customer") || "Customer", t("type") || "Type", t("amount") || "Amount", t("status") || "Status"];
        default:
          return [t("product") || "Product", t("units_sold") || "Units Sold", t("revenue") || "Revenue"];
      }
    }
    switch (currentTab) {
      case "purchase": return [t("order_#") || "Order #", t("supplier") || "Supplier", t("total_amount") || "Total Amount", t("status") || "Status", t("date") || "Date"];
      case "inventory": return [t("product") || "Product", t("stock") || "Stock", t("unit_cost") || "Unit Cost", t("total_value") || "Total Value"];
      case "invoice": return [t("invoice_#") || "Invoice #", t("customer") || "Customer", t("total") || "Total", t("paid") || "Paid", t("due") || "Due", t("status") || "Status"];
      case "supplier": return [t("supplier") || "Supplier", t("total_orders") || "Total Orders", t("total_purchased") || "Total Purchased", t("last_order_date") || "Last Order Date"];
      case "supplierDue": return [t("supplier") || "Supplier", t("due_amount") || "Due Amount", t("overdue_days") || "Overdue Days"];
      case "customer": return [t("customer") || "Customer", t("phone") || "Phone", t("total_orders") || "Orders", t("total_spent") || "Total Spent"];
      case "customerDue": return [t("customer") || "Customer", t("phone") || "Phone", t("due_amount") || "Due Amount"];
      case "product": return [t("product") || "Product", t("category") || "Category", t("status") || "Status"];
      case "productExpiry": return [t("product") || "Product", t("batch") || "Batch", t("expiry_date") || "Expiry Date", t("stock") || "Stock", t("days_left") || "Days Left"];
      case "productAlert": return [t("product") || "Product", t("current_stock") || "Current Stock", t("min_stock_level") || "Min Stock Level"];
      case "expense": return [t("category") || "Category", t("amount") || "Amount", t("date") || "Date", t("description") || "Description"];
      case "income": return [t("source") || "Source", t("amount") || "Amount", t("date") || "Date", t("description") || "Description"];
      case "tax": return [t("tax_rate") || "Tax Rate", t("taxable_sales") || "Taxable Sales", t("tax_amount") || "Tax Amount"];
      case "pnl": return [t("metric") || "Metric", t("amount") || "Amount"];
      case "annual": return [t("month") || "Month", t("revenue") || "Revenue", t("orders") || "Orders"];
      default: return [];
    }
  };

  const getTableRows = () => {
    const currentTab = tabs[activeTab].value;
    const d = reportData;
    if (!d) return [];

    if (currentTab === "sale") {
      switch (saleDetailView) {
        case "bestSellers": return (d.bestSellers || []).map(item => [item.productName, item.totalQuantity, formatCurrency(item.totalRevenue)]);
        case "paymentMethod": return (d.salesByPaymentMethod || []).map(m => [m.method, m.count, formatCurrency(m.amount)]);
        case "orderType": return (d.salesByOrderType || []).map(t => [t.type, t.count, formatCurrency(t.amount)]);
        case "dailySales": return (d.dailySales || []).map(day => [formatDateShort(new Date(day.date)), day.orders, formatCurrency(day.revenue)]);
        case "recentTransactions": return (d.recentTransactions || []).map(tx => [tx.id, formatDateShort(new Date(tx.date)), tx.customer, tx.type, formatCurrency(tx.amount), tx.status]);
        default: return [];
      }
    }

    switch (currentTab) {
      case "purchase": return (d.recentPurchases || []).map(p => [p.orderNumber, p.supplierName, formatCurrency(p.totalAmount), p.status, formatDateShort(new Date(p.createdAt))]);
      case "inventory": return (d.inventoryValuation || []).map(i => [i.productName, i.stockQty, formatCurrency(i.unitCost), formatCurrency(i.totalValue)]);
      case "invoice": return (d.invoices || []).map(inv => [inv.invoiceNumber, inv.customerName, formatCurrency(inv.total), formatCurrency(inv.paid), formatCurrency(inv.due), inv.status]);
      case "supplier": return (d.supplierPerformance || []).map(s => [s.supplierName, s.totalOrders, formatCurrency(s.totalPurchased), formatDateShort(new Date(s.lastOrderDate))]);
      case "supplierDue": return (d.suppliersWithDue || []).map(due => [due.supplierName, formatCurrency(due.dueAmount), due.overdueDays]);
      case "customer": return (d.customers || []).map(c => [c.customerName, c.customerPhone, c.totalOrders, formatCurrency(c.totalSpent)]);
      case "customerDue": return (d.customersWithDue || []).map(due => [due.customerName, due.customerPhone, formatCurrency(due.dueAmount)]);
      case "product": return (d.productList || []).map(p => [p.productName, p.category, p.status]);
      case "productExpiry": return [...(d.expiredProducts || []), ...(d.expiringSoon || [])].map(e => [e.productName, e.batchNo || "-", formatDateShort(new Date(e.expiryDate)), e.stock, e.daysUntilExpiry]);
      case "productAlert": return (d.lowStockProducts || []).map(l => [l.productName, l.currentStock, l.minStockLevel]);
      case "expense": return (d.expensesList || []).map(e => [e.category, formatCurrency(e.amount), formatDateShort(new Date(e.date)), e.description || ""]);
      case "income": return (d.incomesList || []).map(i => [i.source, formatCurrency(i.amount), formatDateShort(new Date(i.date)), i.description || ""]);
      case "tax": return (d.taxBreakdown || []).map(t => [`${t.taxRate * 100}%`, formatCurrency(t.taxableSales), formatCurrency(t.taxAmount)]);
      case "pnl": {
        const b = d.breakdown || {};
        return [
          [t("sales_revenue") || "Sales Revenue", formatCurrency(b.salesRevenue)],
          [t("other_income") || "Other Income", formatCurrency(b.otherIncome)],
          [t("cost_of_goods_sold") || "Cost of Goods Sold", formatCurrency(b.costOfGoodsSold)],
          [t("gross_profit") || "Gross Profit", formatCurrency(d.grossProfit)],
          [t("operating_expenses") || "Operating Expenses", formatCurrency(d.operatingExpenses)],
          [t("net_profit") || "Net Profit", formatCurrency(d.netProfit)],
          [t("profit_margin") || "Profit Margin", `${d.profitMargin?.toFixed(2)}%`],
        ];
      }
      case "annual": {
        return (d.monthlyData || []).map((month) => {
          const monthIndex = Number(month.month?.split("-")[1]) - 1;
          const monthName = Number.isInteger(monthIndex)
            ? new Date(d.year, monthIndex, 1).toLocaleString("default", { month: "long" })
            : month.month;
          return [monthName, formatCurrency(month.revenue || 0), month.orders || 0];
        });
      }
      default: return [];
    }
  };

  const getPaginator = () => {
    const currentTab = tabs[activeTab].value;
    if (!reportData) return null;
    if (currentTab === "sale") {
      return saleDetailView === "recentTransactions" ? reportData.paginator : null;
    }
    switch (currentTab) {
      case "purchase": return reportData.paginator;
      case "inventory": return reportData.valuationPaginator;
      case "invoice": return reportData.paginator;
      case "customer": return reportData.paginator;
      case "customerDue": return reportData.paginator;
      case "product": return reportData.paginator;
      case "productExpiry": return reportData.expiringPaginator || reportData.expiredPaginator;
      case "productAlert": return reportData.lowStockPaginator;
      case "expense": return reportData.paginator;
      case "income": return reportData.paginator;
      default: return null;
    }
  };

  const paginator = getPaginator();
  const totalPages = paginator?.totalPages && paginator.totalDocs > 0 ? paginator.totalPages : 0;
  const totalDocs = paginator?.totalDocs || 0;

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const doc = printWindow.document;
    const reportTitle = tabs[activeTab].label;
    const companyName = user?.companyName || user?.shopName || user?.nameEn || "Smart Market";
    const phone = user?.phone || "";
    const email = user?.email || "";
    const address = user?.address || "Cambodia";
    const headers = getTableHeaders();
    const rows = getTableRows();
    const totalRevenue = reportData?.totalRevenue || reportData?.totalIncome || 0;
    const generatedDate = formatDateLong(new Date());
    const detailViewLabel = tabs[activeTab].value === "sale"
      ? saleDetailOptions.find(o => o.value === saleDetailView)?.label || ""
      : "";

    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${reportTitle}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page { size: A4 portrait; margin: 1.8cm 1.5cm; }
          body { font-family: 'Segoe UI', sans-serif; background: white; color: #1e293b; line-height: 1.5; }
          .print-container { max-width: 100%; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1976D2; padding-bottom: 20px; margin-bottom: 20px; }
          .company-info h1 { font-size: 28px; font-weight: 700; color: #1976D2; margin-bottom: 8px; }
          .company-info p { font-size: 12px; color: #475569; margin: 2px 0; }
          .report-info { text-align: right; }
          .report-info h2 { font-size: 24px; font-weight: 600; color: #1976D2; margin-bottom: 8px; }
          .report-info p { font-size: 12px; color: #475569; }
          .filters { background: #E3F2FD; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; font-size: 12px; display: flex; justify-content: space-between; flex-wrap: wrap; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { background: #1976D2; color: white; padding: 12px 8px; font-weight: 600; font-size: 13px; text-align: left; }
          td { padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
          tr:nth-child(even) td { background: #F8FAFF; }
          .totals { display: flex; justify-content: flex-end; margin-top: 20px; padding-top: 12px; border-top: 2px solid #1976D2; }
          .totals-box { width: 300px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
          .totals-row.total { font-weight: 700; font-size: 16px; border-top: 1px solid #cbd5e1; margin-top: 6px; padding-top: 8px; }
          .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
          @media print { th { background: #1976D2 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <div class="company-info">
              <h1>${companyName}</h1>
              <p>${address}</p>
              <p>📞 ${phone} | ✉️ ${email}</p>
            </div>
            <div class="report-info">
              <h2>${reportTitle}</h2>
              ${detailViewLabel ? `<p>${t("view") || "View"}: ${detailViewLabel}</p>` : ""}
              <p>${t("date") || "Date"}: ${generatedDate}</p>
              <p>${t("shop") || "Shop"}: ${shopId || t("all_shops") || "All Shops"}</p>
            </div>
          </div>
          <div class="filters">
            <span><strong>${t("period") || "Period"}:</strong> ${formatDateLong(dateRange.start)} – ${formatDateLong(dateRange.end)}</span>
            <span><strong>${t("generated") || "Generated"}:</strong> ${generatedDate}</span>
          </div>
          <table>
            <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</thead>
            <tbody>
              ${rows.map(row => `<tr>${row.map((cell, idx) => {
      const isNumeric = typeof cell === "string" && cell.startsWith("$");
      const align = idx === 0 ? "left" : isNumeric ? "right" : "center";
      return `<td style="text-align:${align}">${cell}</td>`;
    }).join("")}</tr>`).join("")}
              ${rows.length === 0 ? `<tr><td colspan="${headers.length}" style="text-align:center">${t("no_data") || "No data available"}</td></tr>` : ""}
            </tbody>
          </table>
          ${totalRevenue && tabs[activeTab].value === "sale" && saleDetailView !== "recentTransactions" ? `
          <div class="totals">
            <div class="totals-box">
              <div class="totals-row"><span>${t("total_revenue") || "Total Revenue"}</span><span>${formatCurrency(totalRevenue)}</span></div>
              <div class="totals-row total"><span>${t("grand_total") || "GRAND TOTAL"}</span><span>${formatCurrency(totalRevenue)}</span></div>
            </div>
          </div>` : ""}
          <div class="footer"><p>${t("thank_you") || "Thank you for choosing"} ${companyName} | ${t("system_generated") || "System generated report"}</p></div>
        </div>
      </body>
      </html>
    `);
    doc.close();
    printWindow.print();
  };

  const handleExport = async () => {
    if (!reportData) return;
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet(tabs[activeTab].label);
    ws.columns = getTableHeaders().map(() => ({ width: 20 }));
    ws.addRow(getTableHeaders());
    getTableRows().forEach(row => ws.addRow(row));
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `${tabs[activeTab].label}-${formatFileDate()}.xlsx`);
  };

  const currentTabValue = tabs[activeTab].value;
  const showDateFilter = !["supplier", "supplierDue", "productAlert", "annual"].includes(currentTabValue);

  const renderContent = () => {
    if (loading) return (
      <Table>
        <CircularIndeterminate />
      </Table>
    );
    if (error) return (
      <Alert severity="error" sx={{ my: 2, }}>
        {t("failed_to_load_report")}: {error.message}
      </Alert>
    );
    if (!reportData) return <EmptyData />;

    const rows = getTableRows();
    const headers = getTableHeaders();

    return (
      <>

        {currentTabValue === "sale" && saleDetailView !== "recentTransactions" && (
  <Grid container spacing={2.5} sx={{ mb: 3 }}>
    <Grid size={{ xs: 12, md: 4 }}>
      <SummaryCard
        label={t("total_revenue")}
        value={formatCurrency(reportData.totalRevenue)}
        colorName="primary"
        icon={<AttachMoneyIcon />}
      />
    </Grid>

    <Grid size={{ xs: 12, md: 4 }}>
      <SummaryCard
        label={t("total_orders")}
        value={reportData.totalSalesCount || 0}
        colorName="success"
        icon={<ShoppingCartIcon />}
      />
    </Grid>

    <Grid size={{ xs: 12, md: 4 }}>
      <SummaryCard
        label={t("average_order_value")}
        value={formatCurrency(reportData.averageOrderValue)}
        colorName="warning"
        icon={<BarChartIcon />}
      />
    </Grid>
  </Grid>
)}


{currentTabValue === "pnl" && (
  <Grid container spacing={2.5} sx={{ mb: 3 }}>
    <Grid size={{ xs: 12, md: 6 }}>
      <SummaryCard
        label={t("net_profit") || "Net Profit"}
        value={formatCurrency(reportData.netProfit)}
        colorName="primary"
        icon={<TrendingUpIcon />}
      />
    </Grid>

    <Grid size={{ xs: 12, md: 6 }}>
      <SummaryCard
        label={t("profit_margin") || "Profit Margin"}
        value={`${reportData.profitMargin?.toFixed(2)}%`}
        colorName="success"
        icon={<PercentIcon />}
      />
    </Grid>
  </Grid>
)}

  
        <Paper
          variant="outlined"
          sx={{
            mb: 2,
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
            boxShadow: theme.shadows[1],
          }}
        >
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow >
                  {headers.map((h, idx) => (
                    <TableCell
                      key={idx}
                      sx={{
                      
                        py: 1.8,
                        px: 2,
                        textTransform: "uppercase",
                        borderBottom: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {rows.length > 0 ? (
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow
                      key={i}
                      sx={{
                        "&:nth-of-type(even)": { bgcolor: theme.palette.action.hover },
                        "&:hover": {
                          bgcolor: theme.palette.action.selected,
                          transition: "background 0.15s",
                        },
                        "&:last-child td": { borderBottom: "none" },
                      }}
                    >
                      {row.map((cell, j) => (
                        <TableCell
                          key={j}
                          sx={{
                            py: 1.4,
                            px: 2,
                            fontSize: "0.85rem",
                            color: theme.palette.text.primary,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                    
                          {typeof cell === "string" && ["paid", "unpaid", "pending", "overdue", "active", "inactive", "completed", "cancelled"].includes(cell.toLowerCase()) ? (
                            <Chip
                              label={cell}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                bgcolor:
                                  ["paid", "active", "completed"].includes(cell.toLowerCase())
                                    ? theme.palette.success.light + "30"
                                    : ["overdue", "cancelled"].includes(cell.toLowerCase())
                                      ? theme.palette.error.light + "30"
                                      : theme.palette.warning.light + "30",
                                color:
                                  ["paid", "active", "completed"].includes(cell.toLowerCase())
                                    ? theme.palette.success.main
                                    : ["overdue", "cancelled"].includes(cell.toLowerCase())
                                      ? theme.palette.error.main
                                      : theme.palette.warning.main,
                                border: "none",
                              }}
                            />
                          ) : cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              ) : (

                <EmptyData />

              )}
            </Table>
          </TableContainer>
        </Paper>


        {paginator && totalDocs > 0 && totalPages > 0 && (
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ padding: 2 }}
          >
            <FooterPagination
              totalPages={totalPages}
              totalDocs={totalDocs}
              limit={limit}
              page={page}
              setPage={setPage}
              handleLimit={handleLimitChange}
              Type={currentTabValue}
            />
          </Stack>

        )}
      </>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          thead { display: table-header-group; }
          tr, td, th { break-inside: avoid; }
        }
      `}</style>

      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          mx: "auto",
          px: { xs: 1, sm: 2, md: 0 },

          bgcolor: theme.palette.background.default,
        }}
      >
        <Box className="no-print">

          <Paper
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%)`,

              px: 3,
              py: 2,
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              boxShadow: theme.shadows[4],
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  width: 40,
                  height: 40,
                }}
              >
                <AssessmentIcon sx={{ color: "white", fontSize: 22 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: 700, lineHeight: 1.2, fontSize: "1.1rem" }}
                >
                  {t("reports")}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
                  {tabs[activeTab].label}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.15)",
                    borderColor: "white",
                  },
                }}
              >
                {t("print") || "Print"}
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
                sx={{
                  bgcolor: "white",
                  color: theme.palette.primary.dark,
                  fontWeight: 700,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: theme.palette.primary.light,
                    boxShadow: "none",
                  },
                }}
              >
                {t("export_excel") || "Export Excel"}
              </Button>
            </Stack>
          </Paper>


          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              mb: 2.5,
              overflow: "hidden",
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, newVal) => setActiveTab(newVal)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTabs-indicator": {
                  height: 3,
                  bgcolor: theme.palette.primary.main,
                },
                "& .MuiTab-root": {
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  textTransform: "none",
                  color: theme.palette.text.secondary,
                  minHeight: 52,
                  px: 2.5,
                  gap: 0.5,
                  "&.Mui-selected": { color: theme.palette.primary.main },
                },
              }}
            >
             {tabs.map((tab, idx) => (
  <Tab
    key={idx}
    label={
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {TAB_ICONS[tab.value]}
        <span>{tab.label}</span>
      </Stack>
    }
  />
))}
            </Tabs>
          </Paper>


          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,

              px: 2.5,
              py: 2,
              mb: 3,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <FilterListIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main, letterSpacing: "0.04em" }}>
                {t("filters") || "FILTERS"}
              </Typography>
              <Divider sx={{ flex: 1 }} />
              {(dateRange.start || dateRange.end) && showDateFilter && (
                <Chip
                  size="small"
                  label={`${formatDateShort(dateRange.start)} – ${formatDateShort(dateRange.end)}`}
                  sx={{ bgcolor: theme.palette.primary.light + "30", color: theme.palette.primary.dark, fontWeight: 600, fontSize: "0.7rem" }}
                />
              )}
            </Stack>

            <Grid container spacing={2} alignItems="flex-end">
              {showDateFilter && (
                <>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography sx={{textAlign: "left"}}>
                      {t("start_date")}
                    </Typography>
                    <DatePicker
                      value={dateRange.start}
                      onChange={(newVal) => setDateRange({ ...dateRange, start: newVal })}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,

                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography sx={{textAlign: "left"}}>
                      {t("end_date")}
                    </Typography>
                    <DatePicker
                      value={dateRange.end}
                      onChange={(newVal) => setDateRange({ ...dateRange, end: newVal })}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main },
                            },
                          },
                        },
                      }}
                    />
                  </Grid>
                </>
              )}

              {currentTabValue === "annual" && (
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography sx={{textAlign: "left"}}>
                    {t("year")}
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value) || 2025)}

                  />
                </Grid>
              )}

              {currentTabValue === "productExpiry" && (
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography sx={{textAlign:'left'}}>
                    {t("days_threshold")}
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={daysThreshold}
                    onChange={(e) => setDaysThreshold(parseInt(e.target.value) || 30)}

                  />
                </Grid>
              )}

              {currentTabValue === "product" && (
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography sx={{textAlign: "left"}}>
                    {t("category")}
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder={t("category_id") || "Category ID"}
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}

                  />
                </Grid>
              )}

              {currentTabValue === "sale" && (
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography>
                    {t("view") || "View"}
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={saleDetailView}
                      onChange={(e) => setSaleDetailView(e.target.value)}

                    >
                      {saleDetailOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}


              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography sx={{textAlign: "left"}}>
                  {t("search")}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={t("search")}
                  
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}

                />
              </Grid>
            </Grid>
          </Paper>
        </Box>


        <Box id="print-area" sx={{ display: "none", "@media print": { display: "block" } }} />


        <Box>{renderContent()}</Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportPage;
