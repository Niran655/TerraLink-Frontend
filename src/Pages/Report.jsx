
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
    const reportTabValue = tabs[activeTab].value;
    const companyName = user?.companyName || user?.shopName || user?.nameEn || "Smart Market";
    const phone = user?.phone || "";
    const email = user?.email || "";
    const address = user?.address || "Cambodia";
    const headers = getTableHeaders();
    const rows = getTableRows();
    const totalRevenue = reportData?.totalRevenue || reportData?.totalIncome || 0;
    const generatedDate = formatDateLong(new Date());
    const detailViewLabel = reportTabValue === "sale"
      ? saleDetailOptions.find(o => o.value === saleDetailView)?.label || ""
      : "";

    const reportTitleKhmer = {
      sale: "របាយការណ៍លក់",
      purchase: "របាយការណ៍ទិញ",
      inventory: "របាយការណ៍សារពើភ័ណ្ឌ",
      invoice: "របាយការណ៍វិក្កយបត្រ",
      supplier: "របាយការណ៍អ្នកផ្គត់ផ្គង់",
      supplierDue: "របាយការណ៍ជំពាក់អ្នកផ្គត់ផ្គង់",
      customer: "របាយការណ៍អតិថិជន",
      customerDue: "របាយការណ៍ជំពាក់អតិថិជន",
      product: "របាយការណ៍ផលិតផល",
      productExpiry: "របាយការណ៍ផលិតផលហួសកាលកំណត់",
      productAlert: "របាយការណ៍ផលិតផលមានការព្រមានបរិមាណ",
      expense: "របាយការណ៍ចំណាយ",
      income: "របាយការណ៍ចំណូល",
      tax: "របាយការណ៍ពន្ធ",
      pnl: "របាយការណ៍ចំណេញ និងខាត",
      annual: "របាយការណ៍ប្រចាំឆ្នាំ",
    }[reportTabValue] || "របាយការណ៍";

    const getKhmerDateString = (date) => {
      const khmerMonths = [
        "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
        "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
      ];
      const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
      const toKhmerNum = (num) => String(num).split("").map(d => khmerNumbers[Number(d)] || d).join("");
      
      const day = toKhmerNum(date.getDate());
      const month = khmerMonths[date.getMonth()];
      const year = toKhmerNum(date.getFullYear());
      return `រាជធានីភ្នំពេញ, ថ្ងៃទី${day} ខែ${month} ឆ្នាំ${year}`;
    };
    const khmerDateStr = getKhmerDateString(new Date());

    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${reportTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Moul&family=Siemreap:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page { size: A4 portrait; margin: 1.5cm 1.5cm 2cm 1.5cm; }
          body { 
            font-family: 'Siemreap', 'Inter', sans-serif; 
            background: white; 
            color: #000000; 
            line-height: 1.6; 
            font-size: 11pt;
          }
          .print-container { 
            width: 100%; 
            margin: 0 auto; 
          }
          
          /* Header Grid Layout */
          .header-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: flex-start;
            margin-bottom: 30px;
            width: 100%;
          }
          
          /* National Header Styles */
          .national-header {
            text-align: center;
            justify-self: end;
          }
          .national-title {
            font-family: 'Moul', serif;
            font-size: 11pt;
            color: #1D4592;
            margin-bottom: 2px;
          }
          .national-motto {
            font-family: 'Siemreap', sans-serif;
            font-size: 9.5pt;
            font-weight: 600;
            color: #333333;
          }
          .national-divider {
            border-bottom: 1.5px solid #1D4592;
            width: 80px;
            margin: 4px auto 0 auto;
            position: relative;
          }
          .national-divider::after {
            content: "";
            display: block;
            border-bottom: 0.5px solid #1D4592;
            width: 50px;
            margin: 2px auto 0 auto;
          }
          
          /* Company Info Styles */
          .company-info {
            text-align: left;
          }
          .company-title-kh {
            font-family: 'Moul', serif;
            font-size: 12pt;
            color: #1D4592;
            margin-bottom: 4px;
          }
          .company-title-en {
            font-family: 'Inter', sans-serif;
            font-size: 10pt;
            font-weight: 700;
            color: #555555;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }
          .company-details p {
            font-family: 'Siemreap', 'Inter', sans-serif;
            font-size: 8.5pt;
            color: #444444;
            line-height: 1.4;
            margin: 2px 0;
          }
          
          /* Report Title Section */
          .report-title-container {
            text-align: center;
            margin-bottom: 25px;
            border-top: 2px solid #1D4592;
            border-bottom: 2px solid #1D4592;
            padding: 12px 0;
            background-color: #f4f7fc;
            clear: both;
          }
          .report-title-kh {
            font-family: 'Moul', serif;
            font-size: 14pt;
            color: #1D4592;
            margin-bottom: 4px;
          }
          .report-title-en {
            font-family: 'Inter', sans-serif;
            font-size: 11pt;
            font-weight: 700;
            color: #333333;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          /* Meta Info */
          .meta-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            margin-bottom: 20px;
            font-size: 9pt;
            font-family: 'Siemreap', sans-serif;
            border-bottom: 1px solid #1D4592;
            padding-bottom: 8px;
          }
          .meta-left {
            text-align: left;
            color: #333333;
          }
          .meta-right {
            text-align: right;
            color: #333333;
          }
          
          /* Table Styles */
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 25px; 
          }
          th { 
            border: 1px solid #1D4592;
            background: #1D4592; 
            color: #ffffff; 
            padding: 8px 6px; 
            font-family: 'Siemreap', 'Inter', sans-serif;
            font-weight: 700; 
            font-size: 9pt; 
            text-align: center;
          }
          td { 
            border: 1px solid #b9cde5;
            padding: 8px 6px; 
            font-family: 'Siemreap', 'Inter', sans-serif;
            font-size: 8.5pt; 
            color: #000000;
          }
          tr:nth-child(even) td {
            background-color: #f9fbfd;
          }
          
          /* Totals Box */
          .totals-container {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
          }
          .totals-table {
            width: 280px;
            border-collapse: collapse;
            margin-bottom: 0;
            border: 1px solid #1D4592;
          }
          .totals-table td {
            padding: 6px 8px;
            font-size: 9pt;
            border: 1px solid #1D4592;
          }
          .totals-table td.label {
            font-weight: 600;
            text-align: left;
            background: #f4f7fc;
            color: #1D4592;
          }
          .totals-table td.val {
            text-align: right;
            font-weight: 700;
            color: #000000;
          }
          
          /* Signatures Grid */
          .signatures-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            text-align: center;
            margin-top: 50px;
            page-break-inside: avoid;
          }
          .signature-col {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .sig-title-kh {
            font-family: 'Siemreap', sans-serif;
            font-weight: 700;
            font-size: 9.5pt;
            color: #1D4592;
            margin-bottom: 2px;
          }
          .sig-title-en {
            font-family: 'Inter', sans-serif;
            font-size: 8.5pt;
            color: #555555;
            margin-bottom: 60px;
          }
          .sig-name {
            font-family: 'Siemreap', sans-serif;
            font-size: 9.5pt;
            font-weight: 600;
            border-bottom: 1px dotted #1D4592;
            width: 150px;
            padding-bottom: 2px;
          }
          
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            th { 
              background-color: #1D4592 !important; 
              color: #ffffff !important;
              border: 1px solid #1D4592 !important;
            }
            td {
              border: 1px solid #b9cde5 !important;
            }
            tr:nth-child(even) td {
              background-color: #f9fbfd !important;
            }
            .report-title-container {
              background-color: #f4f7fc !important;
              border-top: 2px solid #1D4592 !important;
              border-bottom: 2px solid #1D4592 !important;
            }
            .totals-table td.label {
              background-color: #f4f7fc !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          
          <!-- Top Header Grid -->
          <div class="header-grid">
            <div class="company-info">
              <div class="company-title-kh">${companyName}</div>
              <div class="company-title-en">TERRALINK PARTNER</div>
              <div class="company-details">
                <p>លេខអត្តសញ្ញាណកម្ម អតប (VAT TIN): ${user?.vatNumber || "N/A"}</p>
                <p>អាសយដ្ឋាន: ${address}</p>
                <p>ទូរស័ព្ទ: ${phone} | អ៊ីមែល: ${email}</p>
              </div>
            </div>
            <div class="national-header">
              <div class="national-title">ព្រះរាជាណាចក្រកម្ពុជា</div>
              <div class="national-motto">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
              <div class="national-divider"></div>
            </div>
          </div>
          
          <!-- Report Title Container -->
          <div class="report-title-container">
            <div class="report-title-kh">${reportTitleKhmer}</div>
            <div class="report-title-en">${reportTitle}</div>
          </div>
          
          <!-- Metadata Info Block -->
          <div class="meta-info-grid">
            <div class="meta-left">
              <p><strong>រយៈពេល (Period):</strong> ${formatDateLong(dateRange.start)} – ${formatDateLong(dateRange.end)}</p>
              ${detailViewLabel ? `<p><strong>ប្រភេទ (Type):</strong> ${detailViewLabel}</p>` : ""}
            </div>
            <div class="meta-right">
              <p>${khmerDateStr}</p>
              <p><strong>ហាង (Shop ID):</strong> ${shopId || "All Shops"}</p>
            </div>
          </div>
          
          <!-- Main Table -->
          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr>${row.map((cell, idx) => {
                const isNumeric = typeof cell === "string" && cell.startsWith("$");
                const align = idx === 0 ? "left" : isNumeric ? "right" : "center";
                return `<td style="text-align:${align}">${cell}</td>`;
              }).join("")}</tr>`).join("")}
              ${rows.length === 0 ? `<tr><td colspan="${headers.length}" style="text-align:center">គ្មានទិន្នន័យស្រង់ចេញទេ (No data available)</td></tr>` : ""}
            </tbody>
          </table>
          
          <!-- Totals Area -->
          ${totalRevenue && reportTabValue === "sale" && saleDetailView !== "recentTransactions" ? `
          <div class="totals-container">
            <table class="totals-table">
              <tr>
                <td class="label">សរុប (Total Revenue)</td>
                <td class="val">${formatCurrency(totalRevenue)}</td>
              </tr>
              <tr>
                <td class="label" style="font-weight: 700;">សរុបរួម (Grand Total)</td>
                <td class="val" style="font-size: 11pt;">${formatCurrency(totalRevenue)}</td>
              </tr>
            </table>
          </div>` : ""}
          
          <!-- Signatures Section -->
          <div class="signatures-grid">
            <div class="signature-col">
              <div class="sig-title-kh">រៀបចំដោយ</div>
              <div class="sig-title-en">Prepared By</div>
              <div class="sig-name"></div>
            </div>
            <div class="signature-col">
              <div class="sig-title-kh">ពិនិត្យដោយ</div>
              <div class="sig-title-en">Checked By</div>
              <div class="sig-name"></div>
            </div>
            <div class="signature-col">
              <div class="sig-title-kh">អនុម័តដោយ</div>
              <div class="sig-title-en">Approved By</div>
              <div class="sig-name"></div>
            </div>
          </div>
          
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
        <CircularIndeterminate cols={getTableHeaders()?.length || 5} />
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
