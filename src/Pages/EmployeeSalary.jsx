import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Receipt,
  PlayArrow,
  CheckCircle,
  Payment,
  Timeline,
  AttachMoney,
  PersonOutline
} from "@mui/icons-material";
import {
  GET_PAYROLL_PERIODS,
  GET_PAYROLL_DASHBOARD,
  GET_PAYSLIPS,
  GET_EMPLOYEE_SALARIES_WITH_PAGINATION
} from "../../graphql/queries";
import {
  GENERATE_PAYROLL,
  APPROVE_PAYROLL,
  PAY_PAYROLL
} from "../../graphql/mutation";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import FooterPagination from "../include/FooterPagination";
import CircularIndeterminate from "../include/Loading";
import EmployeeSalaryAction from "../Components/employeeSalary/EmployeeSalaryAction";
import EmployeeSalaryForm from "../Components/employeeSalary/EmployeeSalaryForm";
import "../Styles/TableStyle.scss";

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

export default function EmployeeSalary() {
  const { language, setAlert } = useAuth();
  const { t } = translateLauguage(language);

  const [activeTab, setActiveTab] = useState(0);

  // Tab 1 state
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [payMethod, setPayMethod] = useState("Bank Transfer");
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const [activePayrollItem, setActivePayrollItem] = useState(null);

  // Tab 2 (Standard config) state
  const [openConfig, setOpenConfig] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");

  const { data: periodsData } = useQuery(GET_PAYROLL_PERIODS);
  const { data: dashboardData, loading: dashLoading, refetch: refetchDash } = useQuery(GET_PAYROLL_DASHBOARD, {
    variables: { periodId: selectedPeriod },
    skip: !selectedPeriod
  });

  const { data: payslipsData, refetch: refetchPayslips } = useQuery(GET_PAYSLIPS);

  const { data: salariesData, loading: salariesLoading, refetch: refetchSalaries } = useQuery(GET_EMPLOYEE_SALARIES_WITH_PAGINATION, {
    variables: { page, limit, pagination: true, keyword },
  });

  const [generatePayroll, { loading: genLoading }] = useMutation(GENERATE_PAYROLL, {
    onCompleted: (res) => {
      if (res.generatePayroll?.isSuccess) {
        setAlert(true, "success", "Payroll generated successfully");
        refetchDash();
        refetchPayslips();
      } else {
        setAlert(true, "error", res.generatePayroll?.message?.messageEn || "Failed to generate payroll");
      }
    }
  });

  const [approvePayroll, { loading: appLoading }] = useMutation(APPROVE_PAYROLL, {
    onCompleted: (res) => {
      if (res.approvePayroll?.isSuccess) {
        setAlert(true, "success", "Payroll approved successfully");
        refetchDash();
        refetchPayslips();
      } else {
        setAlert(true, "error", res.approvePayroll?.message?.messageEn || "Failed to approve payroll");
      }
    }
  });

  const [payPayroll, { loading: payingLoading }] = useMutation(PAY_PAYROLL, {
    onCompleted: (res) => {
      if (res.payPayroll?.isSuccess) {
        setAlert(true, "success", "Payroll payment registered successfully");
        setOpenPayDialog(false);
        refetchDash();
        refetchPayslips();
      } else {
        setAlert(true, "error", res.payPayroll?.message?.messageEn || "Failed to pay payroll");
      }
    }
  });

  const handleGenerate = () => {
    if (!selectedPeriod) {
      setAlert(true, "error", "Please select a payroll period first");
      return;
    }
    generatePayroll({ variables: { periodId: selectedPeriod } });
  };

  const handleApprove = (payrollId) => {
    approvePayroll({ variables: { payrollId } });
  };

  const handlePaySubmit = () => {
    if (!activePayrollItem) return;
    payPayroll({
      variables: {
        payrollId: activePayrollItem.payroll?._id,
        paymentMethod: payMethod
      }
    });
  };

  const periods = periodsData?.getPayrollPeriods || [];
  const payslips = payslipsData?.getPayslips || [];
  const dashboard = dashboardData?.getPayrollDashboard || {
    totalPayrollCost: 0,
    totalEmployees: 0,
    pendingPayrollCount: 0,
    overtimeCost: 0,
    bonusCost: 0,
    deductionCost: 0
  };

  const salaries = salariesData?.getEmployeeSalariesWithPagination?.data || [];
  const paginator = salariesData?.getEmployeeSalariesWithPagination?.paginator || {};

  const handleLimit = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1);
  };

  return (
    <Box>
      <Breadcrumbs separator="/">
        <Typography component={RouterLink} to="/setting" sx={{ textDecoration: "none", borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}>
          {t("setting")}
        </Typography>
        <Typography fontWeight={600}>Payroll & Salary Hub</Typography>
      </Breadcrumbs>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
        <Tabs value={activeTab} onChange={(_, nv) => setActiveTab(nv)} textColor="primary" indicatorColor="primary">
          <Tab label="Payroll Runs & Processing" />
          <Tab label="Standard Configurations" />
          <Tab label="Generated Payslips" />
        </Tabs>
      </Box>

      {/* Tab 0: Payroll Runs */}
      {activeTab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <TextField
              select
              label="Select Payroll Period"
              size="small"
              sx={{ width: 300 }}
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periods.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.name} ({new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()})
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={handleGenerate}
              disabled={genLoading || !selectedPeriod}
              sx={{ height: 40 }}
            >
              {genLoading ? "Generating..." : "Generate Payroll"}
            </Button>
          </Stack>

          {selectedPeriod && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "primary.dark", color: "#fff", borderRadius: "12px" }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Total Payroll Cost</Typography>
                    <Typography variant="h5" fontWeight={700}>{money(dashboard.totalPayrollCost)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "info.dark", color: "#fff", borderRadius: "12px" }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Bonus Payments</Typography>
                    <Typography variant="h5" fontWeight={700}>{money(dashboard.bonusCost)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "warning.dark", color: "#fff", borderRadius: "12px" }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Overtime Cost</Typography>
                    <Typography variant="h5" fontWeight={700}>{money(dashboard.overtimeCost)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "error.dark", color: "#fff", borderRadius: "12px" }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Deductions / Penalties</Typography>
                    <Typography variant="h5" fontWeight={700}>{money(dashboard.deductionCost)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* List of processed items */}
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Processed Salaries
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid rgba(0,0,0,0.05)" }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Base Salary</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Overtime</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Commission/Bonus</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Allowances</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Deductions</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Net Salary</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payslips.filter(ps => ps.payroll?.payrollPeriod?._id === selectedPeriod).map((ps) => (
                  <TableRow key={ps._id} hover>
                    <TableCell>{ps.payroll?.employee?.nameEn || ps.payroll?.employee?.nameKh}</TableCell>
                    <TableCell>{money(ps.payroll?.basicSalary)}</TableCell>
                    <TableCell>{money(ps.payroll?.overtimePay)}</TableCell>
                    <TableCell>{money(ps.payroll?.commission + ps.payroll?.bonus)}</TableCell>
                    <TableCell>{money(ps.payroll?.allowances)}</TableCell>
                    <TableCell sx={{ color: "error.main" }}>-{money(ps.payroll?.deductions)}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "success.main" }}>{money(ps.payroll?.netSalary)}</TableCell>
                    <TableCell>
                      <Chip
                        label={ps.payroll?.status}
                        size="small"
                        color={
                          ps.payroll?.status === "Paid"
                            ? "success"
                            : ps.payroll?.status === "Approved"
                            ? "info"
                            : "warning"
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      {ps.payroll?.status === "Draft" && (
                        <Button
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => handleApprove(ps.payroll?._id)}
                          disabled={appLoading}
                        >
                          Approve
                        </Button>
                      )}
                      {ps.payroll?.status === "Approved" && (
                        <Button
                          size="small"
                          color="success"
                          variant="contained"
                          startIcon={<Payment />}
                          onClick={() => {
                            setActivePayrollItem(ps);
                            setOpenPayDialog(true);
                          }}
                        >
                          Pay
                        </Button>
                      )}
                      {ps.payroll?.status === "Paid" && "-"}
                    </TableCell>
                  </TableRow>
                ))}
                {payslips.filter(ps => ps.payroll?.payrollPeriod?._id === selectedPeriod).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No records for this period. Click "Generate Payroll" above.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Tab 1: Standard Config */}
      {activeTab === 1 && (
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search basic configurations..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              sx={{ width: 300 }}
            />
            <Button variant="contained" onClick={() => setOpenConfig(true)}>
              Add Configuration
            </Button>
          </Stack>

          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid rgba(0,0,0,0.05)" }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                <TableRow>
                  <TableCell>{t("no")}</TableCell>
                  <TableCell>{t("employee")}</TableCell>
                  <TableCell>{t("department")}</TableCell>
                  <TableCell>{t("base_salary")}</TableCell>
                  <TableCell>{t("allowance")}</TableCell>
                  <TableCell>{t("deduction")}</TableCell>
                  <TableCell>{t("effective_date")}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              {salariesLoading ? (
                <CircularIndeterminate cols={8} />
              ) : salaries.length === 0 ? (
                <EmptyData />
              ) : (
                <TableBody>
                  {salaries.map((salary, index) => (
                    <TableRow key={salary._id} className="table-row">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{salary.employee?.nameEn || salary.employee?.nameKh}</TableCell>
                      <TableCell>{salary.employee?.department?.nameEn}</TableCell>
                      <TableCell>{money(salary.baseSalary)}</TableCell>
                      <TableCell>{money(salary.allowance)}</TableCell>
                      <TableCell>{money(salary.deduction)}</TableCell>
                      <TableCell>{new Date(salary.effectiveDate).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <EmployeeSalaryAction salaryId={salary._id} salaryData={salary} setRefetch={refetchSalaries} t={t} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
            <Stack direction="row" justifyContent="flex-end" p={2}>
              <FooterPagination page={page} limit={limit} setPage={setPage} handleLimit={handleLimit} totalDocs={paginator.totalDocs} totalPages={paginator.totalPages} />
            </Stack>
          </TableContainer>

          {openConfig && <EmployeeSalaryForm open={openConfig} onClose={() => setOpenConfig(false)} dialogTitle="Create" setRefetch={refetchSalaries} t={t} />}
        </Box>
      )}

      {/* Tab 2: Generated Payslips */}
      {activeTab === 2 && (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {payslips.map((ps) => (
              <Grid item xs={12} sm={6} md={4} key={ps._id}>
                <Card sx={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)" }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2" fontWeight={700}>
                        Payslip #{ps.payslipNumber}
                      </Typography>
                      <Chip label={ps.payroll?.status} color={ps.payroll?.status === "Paid" ? "success" : "warning"} size="small" />
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Employee: <b>{ps.payroll?.employee?.nameEn || ps.payroll?.employee?.nameKh}</b>
                    </Typography>
                    <Typography variant="body2">
                      Period: <b>{ps.payroll?.payrollPeriod?.name}</b>
                    </Typography>
                    <Typography variant="h6" color="primary.main" fontWeight={700} sx={{ mt: 2 }}>
                      Net: {money(ps.payroll?.netSalary)}
                    </Typography>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Receipt />}
                      sx={{ mt: 2, borderRadius: "8px" }}
                      onClick={() => {
                        // Quick browser printing preview simulation
                        const printWindow = window.open("", "_blank");
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Payslip #${ps.payslipNumber}</title>
                              <style>
                                body { font-family: sans-serif; padding: 40px; }
                                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
                                .details { margin: 20px 0; display: flex; justify-content: space-between; }
                                .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                                .table th { background-color: #f2f2f2; }
                                .total { text-align: right; margin-top: 20px; font-size: 20px; font-weight: bold; }
                              </style>
                            </head>
                            <body>
                              <div class="header">
                                <h1>TerraLink Corp</h1>
                                <h3>Official Employee Payslip</h3>
                              </div>
                              <div class="details">
                                <div>
                                  <p><b>Employee Code:</b> ${ps.payroll?.employee?.employeeCode || 'N/A'}</p>
                                  <p><b>Name:</b> ${ps.payroll?.employee?.nameEn}</p>
                                  <p><b>Position:</b> ${ps.payroll?.employee?.position || 'Staff'}</p>
                                </div>
                                <div>
                                  <p><b>Payslip Number:</b> ${ps.payslipNumber}</p>
                                  <p><b>Period:</b> ${ps.payroll?.payrollPeriod?.name}</p>
                                  <p><b>Payment Method:</b> ${ps.payroll?.paymentMethod}</p>
                                </div>
                              </div>
                              <table class="table">
                                <thead>
                                  <tr>
                                    <th>Description</th>
                                    <th>Amount ($)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr><td>Basic Salary</td><td>$${ps.payroll?.basicSalary.toFixed(2)}</td></tr>
                                  <tr><td>Overtime Pay</td><td>$${ps.payroll?.overtimePay.toFixed(2)}</td></tr>
                                  <tr><td>Commission / Bonuses</td><td>$${(ps.payroll?.commission + ps.payroll?.bonus).toFixed(2)}</td></tr>
                                  <tr><td>Allowances</td><td>$${ps.payroll?.allowances.toFixed(2)}</td></tr>
                                  <tr><td>Tax & Deductions</td><td style="color: red">-$${(ps.payroll?.tax + ps.payroll?.deductions).toFixed(2)}</td></tr>
                                </tbody>
                              </table>
                              <div class="total">
                                Net Take-home Pay: $${ps.payroll?.netSalary.toFixed(2)}
                              </div>
                              <script>
                                window.print();
                              </script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      }}
                    >
                      Print / Download Payslip
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {payslips.length === 0 && (
              <Box sx={{ width: "100%", p: 4, textAlign: "center" }}>
                <EmptyData />
              </Box>
            )}
          </Grid>
        </Box>
      )}

      {/* Pay Confirmation Dialog */}
      <Dialog open={openPayDialog} onClose={() => setOpenPayDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Process Salary Payment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2">
              Paying <b>{activePayrollItem?.payroll?.employee?.nameEn}</b> total net salary of <b>{money(activePayrollItem?.payroll?.netSalary)}</b>
            </Typography>
            <TextField
              select
              label="Payment Method"
              size="small"
              fullWidth
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
            >
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              <MenuItem value="ABA Mobile">ABA QR Pay</MenuItem>
              <MenuItem value="Acleda ToanChet">Acleda Wallet</MenuItem>
              <MenuItem value="Cash">Cash Handover</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenPayDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handlePaySubmit} variant="contained" color="success" disabled={payingLoading}>
            {payingLoading ? "Processing..." : "Confirm Payment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
