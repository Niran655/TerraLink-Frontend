import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  MenuItem,
  TextField,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import {
  Download,
  Print,
  CalendarToday,
  Payments,
  ContactPage,
} from "@mui/icons-material";
import { useQuery } from "@apollo/client/react";
import {
  GET_EMPLOYEES_WITH_PAGINATION,
  GET_DEPARTMENTS_WITH_PAGINATION,
  GET_ATTENDANCES_WITH_PAGINATION,
  GET_EMPLOYEE_SALARIES_WITH_PAGINATION,
} from "../../graphql/queries";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import TableSkeleton from "../include/Loading";
import EmptyData from "../include/EmptyData";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FooterPagination from "../include/FooterPagination";

const cardSx = (theme) => ({
  borderRadius: "16px",
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
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

const formatCurrency = (value) =>
  value == null
    ? "$0.00"
    : `$${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

const formatDateLong = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  const hr = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${d}/${m}/${y} ${hr}:${min}`;
};

export default function HmrReport() {
  const theme = useTheme();
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
  const isDark = theme.palette.mode === "dark";

  const [activeTab, setActiveTab] = useState(0);
  const [selectedDept, setSelectedDept] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // GraphQL queries
  const { data: employeeData, loading: employeeLoading } = useQuery(GET_EMPLOYEES_WITH_PAGINATION, {
    variables: { page: 1, limit: 100, pagination: true },
  });

  const { data: departmentData } = useQuery(GET_DEPARTMENTS_WITH_PAGINATION, {
    variables: { page: 1, limit: 100, pagination: true },
  });

  const { data: attendanceData, loading: attendanceLoading } = useQuery(GET_ATTENDANCES_WITH_PAGINATION, {
    variables: {
      page: 1,
      limit: 100,
      pagination: true,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    },
  });

  const { data: salaryData, loading: salaryLoading } = useQuery(GET_EMPLOYEE_SALARIES_WITH_PAGINATION, {
    variables: { page: 1, limit: 100, pagination: true },
  });

  const departments = useMemo(() => {
    return departmentData?.getDepartmentsWithPagination?.data || [];
  }, [departmentData]);

  // Filtered lists
  const filteredEmployees = useMemo(() => {
    const employees = employeeData?.getEmployeesWithPagination?.data || [];
    if (selectedDept === "all") return employees;
    return employees.filter((emp) => emp.department?._id === selectedDept);
  }, [employeeData, selectedDept]);

  const filteredAttendance = useMemo(() => {
    const logs = attendanceData?.getAttendancesWithPagination?.data || [];
    if (selectedDept === "all") return logs;
    return logs.filter((log) => log.employee?.department?._id === selectedDept);
  }, [attendanceData, selectedDept]);

  const filteredSalaries = useMemo(() => {
    const salaries = salaryData?.getEmployeeSalariesWithPagination?.data || [];
    if (selectedDept === "all") return salaries;
    return salaries.filter((sal) => sal.employee?.department?._id === selectedDept);
  }, [salaryData, selectedDept]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, selectedDept, startDate, endDate]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredEmployees.slice(startIndex, startIndex + limit);
  }, [filteredEmployees, page, limit]);

  const paginatedAttendance = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredAttendance.slice(startIndex, startIndex + limit);
  }, [filteredAttendance, page, limit]);

  const paginatedSalaries = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredSalaries.slice(startIndex, startIndex + limit);
  }, [filteredSalaries, page, limit]);

  const currentTotalDocs = activeTab === 0 ? filteredAttendance.length : activeTab === 1 ? filteredSalaries.length : filteredEmployees.length;
  const currentTotalPages = Math.ceil(currentTotalDocs / limit) || 1;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTableHeaders = () => {
    if (activeTab === 0) {
      return ["No", "Employee Name", "Department", "Date", "Clock In", "Clock Out", "Status"];
    } else if (activeTab === 1) {
      return ["No", "Employee Name", "Department", "Base Salary", "Allowance", "Deduction", "Net Salary"];
    } else {
      return ["No", "Employee Name", "Department", "Position", "Phone", "Email", "Gender", "Status"];
    }
  };

  const getTableRows = () => {
    if (activeTab === 0) {
      return filteredAttendance.map((log, index) => [
        String(index + 1),
        log.employee?.nameEn || "-",
        log.employee?.department?.nameEn || "-",
        log.date ? new Date(log.date).toLocaleDateString() : "-",
        formatDateTime(log.clockIn),
        formatDateTime(log.clockOut),
        log.status || "present"
      ]);
    } else if (activeTab === 1) {
      return filteredSalaries.map((sal, index) => {
        const base = Number(sal.salary || 0);
        const allowance = Number(sal.allowance || 0);
        const deduction = Number(sal.deduction || 0);
        const net = base + allowance - deduction;
        return [
          String(index + 1),
          sal.employee?.nameEn || "-",
          sal.employee?.department?.nameEn || "-",
          formatCurrency(base),
          formatCurrency(allowance),
          formatCurrency(deduction),
          formatCurrency(net)
        ];
      });
    } else {
      return filteredEmployees.map((emp, index) => [
        String(index + 1),
        emp.nameEn || "-",
        emp.department?.nameEn || "-",
        emp.position || "-",
        emp.phone || "-",
        emp.email || "-",
        emp.gender || "-",
        emp.active ? "Active" : "Inactive"
      ]);
    }
  };

  // Export to Excel function
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("HMR Report");

    const headers = getTableHeaders();
    worksheet.columns = headers.map(h => ({ header: h, key: h.replace(/\s+/g, "").toLowerCase(), width: 20 }));

    const rows = getTableRows();
    rows.forEach(row => {
      const rowData = {};
      headers.forEach((h, idx) => {
        const key = h.replace(/\s+/g, "").toLowerCase();
        rowData[key] = row[idx];
      });
      worksheet.addRow(rowData);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `HMR-Report-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Corporate Cambodian Standard Print Layout matching Report.jsx
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const doc = printWindow.document;
    const companyName = user?.companyName || user?.shopName || user?.nameEn || "Smart Market";
    const address = user?.address || "Cambodia";
    const phone = user?.phone || "";
    const email = user?.email || "";
    const headers = getTableHeaders();
    const rows = getTableRows();
    const { language } = useAuth();
    const { t } = translateLauguage(language)

    const reportTitleEn = ["Attendance Log Report", "Payroll Details Report", "Employee Directory"][activeTab];
    const reportTitleKh = ["របាយការណ៍វត្តមានបុគ្គលិក", "របាយការណ៍ប្រាក់ខែបុគ្គលិក", "របាយការណ៍ព័ត៌មានបុគ្គលិក"][activeTab];

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
        <title>${reportTitleEn}</title>
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
          
          /* Header Layout */
          .header-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            align-items: flex-start;
            margin-bottom: 25px;
            width: 100%;
          }
          
          .national-header {
            text-align: center;
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
          }
          
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
            font-size: 8.5pt;
            color: #444444;
            margin: 2px 0;
          }
          
          /* Report Title */
          .report-title-container {
            text-align: center;
            margin-bottom: 20px;
            border-top: 2px solid #1D4592;
            border-bottom: 2px solid #1D4592;
            padding: 12px 0;
            background-color: #f4f7fc;
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
            border-bottom: 1px solid #1D4592;
            padding-bottom: 8px;
          }
          .meta-left { text-align: left; color: #333333; }
          .meta-right { text-align: right; color: #333333; }
          
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
            font-weight: 700; 
            font-size: 9pt; 
            text-align: center;
          }
          td { 
            border: 1px solid #b9cde5;
            padding: 8px 6px; 
            font-size: 8.5pt; 
            color: #000000;
          }
          tr:nth-child(even) td {
            background-color: #f9fbfd;
          }
          
          /* Signatures */
          .signatures-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            text-align: center;
            margin-top: 50px;
            page-break-inside: avoid;
          }
          .sig-title-kh {
            font-weight: 700;
            font-size: 9.5pt;
            color: #1D4592;
            margin-bottom: 2px;
          }
          .sig-title-en {
            font-size: 8.5pt;
            color: #555555;
            margin-bottom: 60px;
          }
          .sig-name {
            font-size: 9.5pt;
            font-weight: 600;
            border-bottom: 1px dotted #1D4592;
            width: 150px;
            margin: 0 auto;
            padding-bottom: 2px;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header-grid">
            <div class="company-info">
              <div class="company-title-kh">${companyName}</div>
              <div class="company-title-en">TERRALINK SOLUTIONS</div>
              <div class="company-details">
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
          
          <div class="report-title-container">
            <div class="report-title-kh">${reportTitleKh}</div>
            <div class="report-title-en">${reportTitleEn}</div>
          </div>
          
          <div class="meta-info-grid">
            <div class="meta-left">
              <p><strong>ប្រភេទ (Report Type):</strong> ${reportTitleEn}</p>
            </div>
            <div class="meta-right">
              <p>${khmerDateStr}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr>${row.map((cell, idx) => {
      const align = idx === 0 || idx === 1 ? "left" : "center";
      return `<td style="text-align:${align}">${cell}</td>`;
    }).join("")}</tr>`).join("")}
              ${rows.length === 0 ? `<tr><td colspan="${headers.length}" style="text-align:center">គ្មានទិន្នន័យស្រង់ចេញទេ (No data available)</td></tr>` : ""}
            </tbody>
          </table>
          
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
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          }
        </script>
      </body>
      </html>
    `);
    doc.close();
  };

  const currentLoading = activeTab === 0 ? attendanceLoading : activeTab === 1 ? salaryLoading : employeeLoading;
  const currentCount = activeTab === 0 ? filteredAttendance.length : activeTab === 1 ? filteredSalaries.length : filteredEmployees.length;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2 }}>
        {/* Title */}
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 3 }}>
          <Stack spacing={0.5} sx={{ textAlign: "left" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.text.primary, letterSpacing: "-0.02em" }}>
              {t("hmr_report") || "HMR Reports"}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
              Inspect, filter, print, and export employee lists, attendance grids, and salary sheets
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrint}
              sx={{ borderRadius: 1, textTransform: "none", fontWeight: 600, height: 36 }}
            >
              {t("print") || "Print"}
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleExport}
              disabled={currentCount === 0}
              sx={{ borderRadius: 1, textTransform: "none", fontWeight: 600, height: 36 }}
            >
              {t("export") || "Export Excel"}
            </Button>
          </Stack>
        </Stack>

        {/* Tabs Layout */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2.5 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="HMR Report Tabs"
            sx={{
              "& .MuiTab-root": { fontWeight: 600, textTransform: "none", fontSize: "0.85rem" }
            }}
          >
            <Tab icon={<CalendarToday />} iconPosition="start" label={t("attendance_logs")} />
            <Tab icon={<Payments />} iconPosition="start" label={t("payroll_details")} />
            <Tab icon={<ContactPage />} iconPosition="start" label={t("employee_directory")} />
          </Tabs>
        </Box>

        {/* Filters Box */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: "16px !important" }}>
            <Grid container spacing={1.5} alignItems="center">
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label={t("department") || "Department"}
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  sx={{ textAlign: "left" }}
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>
                      {language === "kh" ? dept.nameKh || dept.nameEn : dept.nameEn}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {activeTab === 0 && (
                <>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <DatePicker
                      label="Start Date"
                      format="dd/MM/yyyy"
                      value={startDate}
                      onChange={(newVal) => setStartDate(newVal)}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <DatePicker
                      label="End Date"
                      format="dd/MM/yyyy"
                      value={endDate}
                      onChange={(newVal) => setEndDate(newVal)}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Table Data */}

        <TableContainer>
          <Table size="small">
            {activeTab === 0 && (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell sx={thSx(theme)}>No</TableCell>
                    <TableCell sx={thSx(theme)}>Employee Name</TableCell>
                    <TableCell sx={thSx(theme)}>Department</TableCell>
                    <TableCell sx={thSx(theme)}>Date</TableCell>
                    <TableCell sx={thSx(theme)}>Clock In</TableCell>
                    <TableCell sx={thSx(theme)}>Clock Out</TableCell>
                    <TableCell align="center" sx={thSx(theme)}>Status</TableCell>
                  </TableRow>
                </TableHead>
                {currentLoading ? (
                  <TableSkeleton cols={7} rows={5} />
                ) : filteredAttendance.length === 0 ? (

                  <EmptyData />

                ) : (
                  <TableBody>
                    {paginatedAttendance.map((log, index) => (
                      <TableRow key={log._id} hover>
                        <TableCell sx={tdSx(theme)}>{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell sx={{ ...tdSx(theme), fontWeight: 600 }}>{language === "kh" ? log.employee?.nameKh || log.employee?.nameEn : log.employee?.nameEn}</TableCell>
                        <TableCell sx={tdSx(theme)}>{language === "kh" ? log.employee?.department?.nameKh || log.employee?.department?.nameEn : log.employee?.department?.nameEn || "-"}</TableCell>
                        <TableCell sx={tdSx(theme)}>{log.date ? new Date(log.date).toLocaleDateString() : "-"}</TableCell>
                        <TableCell sx={tdSx(theme)}>{formatDateTime(log.clockIn)}</TableCell>
                        <TableCell sx={tdSx(theme)}>{formatDateTime(log.clockOut)}</TableCell>
                        <TableCell align="center" sx={tdSx(theme)}>
                          <Chip
                            label={log.status || "present"}
                            size="small"
                            color={log.status === "late" ? "warning" : log.status === "absent" ? "error" : "success"}
                            variant="outlined"
                            sx={{ fontWeight: 700, textTransform: "capitalize", fontSize: "0.68rem", height: 20 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </>
            )}

            {activeTab === 1 && (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell sx={thSx(theme)}>No</TableCell>
                    <TableCell sx={thSx(theme)}>Employee Name</TableCell>
                    <TableCell sx={thSx(theme)}>Department</TableCell>
                    <TableCell align="right" sx={thSx(theme)}>Base Salary</TableCell>
                    <TableCell align="right" sx={thSx(theme)}>Allowance</TableCell>
                    <TableCell align="right" sx={thSx(theme)}>Deduction</TableCell>
                    <TableCell align="right" sx={thSx(theme)}>Net Salary</TableCell>
                  </TableRow>
                </TableHead>
                {currentLoading ? (
                  <TableSkeleton cols={7} rows={5} />
                ) : filteredSalaries.length === 0 ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}><EmptyData /></TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {paginatedSalaries.map((sal, index) => {
                      const base = Number(sal.salary || 0);
                      const allowance = Number(sal.allowance || 0);
                      const deduction = Number(sal.deduction || 0);
                      const net = base + allowance - deduction;
                      return (
                        <TableRow key={sal._id} hover>
                          <TableCell sx={tdSx(theme)}>{(page - 1) * limit + index + 1}</TableCell>
                          <TableCell sx={{ ...tdSx(theme), fontWeight: 600 }}>{language === "kh" ? sal.employee?.nameKh || sal.employee?.nameEn : sal.employee?.nameEn}</TableCell>
                          <TableCell sx={tdSx(theme)}>{language === "kh" ? sal.employee?.department?.nameKh || sal.employee?.department?.nameEn : sal.employee?.department?.nameEn || "-"}</TableCell>
                          <TableCell align="right" sx={tdSx(theme)}>{formatCurrency(base)}</TableCell>
                          <TableCell align="right" sx={tdSx(theme)}>{formatCurrency(allowance)}</TableCell>
                          <TableCell align="right" sx={tdSx(theme)}>{formatCurrency(deduction)}</TableCell>
                          <TableCell align="right" sx={{ ...tdSx(theme), fontWeight: 700, color: "success.main" }}>{formatCurrency(net)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                )}
              </>
            )}

            {activeTab === 2 && (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell sx={thSx(theme)}>No</TableCell>
                    <TableCell sx={thSx(theme)}>Employee Name</TableCell>
                    <TableCell sx={thSx(theme)}>Department</TableCell>
                    <TableCell sx={thSx(theme)}>Position</TableCell>
                    <TableCell sx={thSx(theme)}>Phone</TableCell>
                    <TableCell sx={thSx(theme)}>Email</TableCell>
                    <TableCell sx={thSx(theme)}>Gender</TableCell>
                    <TableCell align="center" sx={thSx(theme)}>Status</TableCell>
                  </TableRow>
                </TableHead>
                {currentLoading ? (
                  <TableSkeleton cols={8} rows={5} />
                ) : filteredEmployees.length === 0 ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}><EmptyData /></TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {paginatedEmployees.map((emp, index) => (
                      <TableRow key={emp._id} hover>
                        <TableCell sx={tdSx(theme)}>{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell sx={{ ...tdSx(theme), fontWeight: 600 }}>{language === "kh" ? emp.nameKh || emp.nameEn : emp.nameEn}</TableCell>
                        <TableCell sx={tdSx(theme)}>{language === "kh" ? emp.department?.nameKh || emp.department?.nameEn : emp.department?.nameEn || "-"}</TableCell>
                        <TableCell sx={tdSx(theme)}>{emp.position || "-"}</TableCell>
                        <TableCell sx={tdSx(theme)}>{emp.phone || "-"}</TableCell>
                        <TableCell sx={tdSx(theme)}>{emp.email || "-"}</TableCell>
                        <TableCell sx={{ ...tdSx(theme), textTransform: "capitalize" }}>{emp.gender || "-"}</TableCell>
                        <TableCell align="center" sx={tdSx(theme)}>
                          <Chip
                            label={emp.active ? "Active" : "Inactive"}
                            size="small"
                            color={emp.active ? "success" : "default"}
                            sx={{ fontWeight: 700, fontSize: "0.68rem", height: 20 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </>
            )}
          </Table>
        </TableContainer>

        {currentCount > 0 && (
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ padding: 2 }}
          >
            <FooterPagination
              totalPages={currentTotalPages}
              totalDocs={currentTotalDocs}
              limit={limit}
              page={page}
              setPage={setPage}
              handleLimit={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(1);
              }}
            />
          </Stack>
        )}
      </Box>
    </LocalizationProvider>
  );
}
