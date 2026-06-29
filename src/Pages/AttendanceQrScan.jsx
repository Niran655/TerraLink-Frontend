import { useMutation, useQuery } from "@apollo/client/react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Fade,
} from "@mui/material";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Camera, CheckCircle2, LogIn, LogOut, ScanLine, AlertTriangle, Calendar, ClipboardList } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";

import {
  CLOCK_IN_ATTENDANCE,
  CLOCK_OUT_ATTENDANCE,
  CREATE_LEAVE_REQUEST,
  LOGIN_EMPLOYEE,
} from "../../graphql/mutation";
import {
  GET_ATTENDANCES_WITH_PAGINATION,
  GET_LEAVE_REQUESTS_WITH_PAGINATION,
  GET_TODAY_ATTENDANCE,
} from "../../graphql/queries";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

const loginValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

// Custom styles for glassmorphism and animations
const styleSheet = `
  @keyframes scanLaser {
    0% { top: 0%; }
    50% { top: 100%; }
    100% { top: 0%; }
  }
  @keyframes pulseGlow {
    0% { box-shadow: 0 0 5px rgba(29, 69, 146, 0.4); }
    50% { box-shadow: 0 0 15px rgba(29, 69, 146, 0.8); }
    100% { box-shadow: 0 0 5px rgba(29, 69, 146, 0.4); }
  }
  .glass-card {
    background: rgba(10, 22, 44, 0.65) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 24px !important;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4) !important;
  }
  .glass-input .MuiOutlinedInput-root {
    background: rgba(255, 255, 255, 0.04) !important;
    border-radius: 14px !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    transition: all 0.3s ease !important;
  }
  .glass-input .MuiOutlinedInput-root:hover {
    border-color: rgba(255, 255, 255, 0.2) !important;
  }
  .glass-input .MuiOutlinedInput-root.Mui-focused {
    border-color: #2196f3 !important;
    box-shadow: 0 0 8px rgba(33, 150, 243, 0.25) !important;
  }
  .scanner-overlay {
    position: relative;
    overflow: hidden;
  }
  .scanner-laser {
    position: absolute;
    left: 0;
    width: 100%;
    height: 3px;
    background: #2196f3;
    box-shadow: 0 0 10px #2196f3, 0 0 20px #2196f3;
    animation: scanLaser 3s linear infinite;
    pointer-events: none;
    z-index: 10;
  }
`;

export default function AttendanceQrScan() {
  const { language, setAlert } = useAuth();
  const { t } = translateLauguage(language);
  const [searchParams] = useSearchParams();
  const [scannerActive, setScannerActive] = useState(false);
  const [qrScanned, setQrScanned] = useState(searchParams.get("scan") === "1");
  const [showPassword, setShowPassword] = useState(false);
  const [employeeToken, setEmployeeToken] = useState(() => localStorage.getItem("attendance_employee_token") || "");
  const [employeeAccount, setEmployeeAccount] = useState(() => {
    try {
      const saved = localStorage.getItem("attendance_employee");
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("attendance_employee");
      return null;
    }
  });
  const autoClockInRef = useRef("");

  const [loginMutation, { loading: loggingIn }] = useMutation(LOGIN_EMPLOYEE, {
    onCompleted: ({ loginEmployee }) => {
      if (!loginEmployee) return;
      setEmployeeToken(loginEmployee.token);
      setEmployeeAccount(loginEmployee.employee);
      localStorage.setItem("attendance_employee_token", loginEmployee.token);
      localStorage.setItem("attendance_employee", JSON.stringify(loginEmployee.employee));
    },
    onError: (error) => {
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  const selectedEmployee = useMemo(() => employeeAccount, [employeeAccount]);
  const employeeId = selectedEmployee?._id || "";

  const { data: todayData, loading: todayLoading, refetch } = useQuery(GET_TODAY_ATTENDANCE, {
    variables: { employeeId },
    skip: !employeeId || !employeeToken,
    fetchPolicy: "cache-and-network",
    context: {
      headers: {
        authorization: employeeToken ? `Bearer ${employeeToken}` : "",
      },
    },
  });
  const todayAttendance = todayData?.getTodayAttendance;

  const employeeAuthContext = {
    headers: {
      authorization: employeeToken ? `Bearer ${employeeToken}` : "",
    },
  };

  const { data: historyData, refetch: refetchHistory } = useQuery(GET_ATTENDANCES_WITH_PAGINATION, {
    variables: { page: 1, limit: 7, pagination: true, employeeId },
    skip: !employeeId || !employeeToken,
    fetchPolicy: "cache-and-network",
    context: employeeAuthContext,
  });
  const attendanceHistory = historyData?.getAttendancesWithPagination?.data || [];

  const { data: leaveData, refetch: refetchLeaveRequests } = useQuery(GET_LEAVE_REQUESTS_WITH_PAGINATION, {
    variables: { page: 1, limit: 5, pagination: true, employeeId },
    skip: !employeeId || !employeeToken,
    fetchPolicy: "cache-and-network",
    context: employeeAuthContext,
  });
  const leaveRequests = leaveData?.getLeaveRequestsWithPagination?.data || [];

  const [clockIn, { loading }] = useMutation(CLOCK_IN_ATTENDANCE, {
    onCompleted: ({ clockInAttendance }) => {
      setAlert(true, clockInAttendance?.isSuccess ? "success" : "error", clockInAttendance?.message);
      if (employeeId) refetch();
      refetchHistory();
    },
    onError: (error) => {
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });
  const [clockOut, { loading: clockingOut }] = useMutation(CLOCK_OUT_ATTENDANCE, {
    onCompleted: ({ clockOutAttendance }) => {
      setAlert(true, clockOutAttendance?.isSuccess ? "success" : "error", clockOutAttendance?.message);
      refetch();
      refetchHistory();
    },
    onError: (error) => {
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });
  const [createLeaveRequest, { loading: creatingLeave }] = useMutation(CREATE_LEAVE_REQUEST, {
    onCompleted: ({ createLeaveRequest }) => {
      setAlert(true, createLeaveRequest?.isSuccess ? "success" : "error", createLeaveRequest?.message);
      refetchLeaveRequests();
    },
    onError: (error) => {
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  useEffect(() => {
    if (!qrScanned || !employeeId || todayLoading || todayAttendance?.clockIn || loading) return;
    const autoClockInKey = `${employeeId}:${dayjs().format("YYYY-MM-DD")}`;
    if (autoClockInRef.current === autoClockInKey) return;
    autoClockInRef.current = autoClockInKey;
    clockIn({
      variables: { employeeId },
      context: { headers: { authorization: `Bearer ${employeeToken}` } },
    });
  }, [clockIn, employeeId, employeeToken, loading, qrScanned, todayAttendance?.clockIn, todayLoading]);

  useEffect(() => {
    if (!scannerActive) return undefined;

    const scanner = new Html5QrcodeScanner(
      "attendance-qr-reader",
      {
        fps: 10,
        qrbox: { width: 260, height: 260 },
        rememberLastUsedCamera: false,
        videoConstraints: {
          facingMode: { ideal: "environment" },
        },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        try {
          const decodedUrl = new URL(decodedText);
          if (decodedUrl.pathname !== "/setting/attendance-qr-scan" || decodedUrl.searchParams.get("scan") !== "1") {
            setAlert(true, "error", { messageEn: "Invalid attendance QR", messageKh: "Invalid attendance QR" });
            return;
          }
        } catch {
          setAlert(true, "error", { messageEn: "Invalid attendance QR", messageKh: "Invalid attendance QR" });
          return;
        }
        setQrScanned(true);
        setScannerActive(false);
        scanner.clear();
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannerActive, setAlert]);

  const handleLoginSubmit = (values) => {
    loginMutation({ variables: values });
  };

  const handleLogout = () => {
    setEmployeeToken("");
    setEmployeeAccount(null);
    localStorage.removeItem("attendance_employee_token");
    localStorage.removeItem("attendance_employee");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0f1c3f 0%, #060b19 100%)",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 4,
      }}
    >
      <style>{styleSheet}</style>
      
      <Box className="glass-card" sx={{ width: "100%", maxWidth: 480, p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3} alignItems="stretch">
          
          <Stack alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 68,
                height: 68,
                borderRadius: "18px",
                background: "rgba(33, 150, 243, 0.15)",
                display: "grid",
                placeItems: "center",
                border: "1px solid rgba(33, 150, 243, 0.3)",
              }}
            >
              <ScanLine size={36} color="#2196f3" />
            </Box>
            <Typography variant="h5" fontWeight={800} color="#ffffff" sx={{ letterSpacing: 0.5 }}>
              TerraLink HRM
            </Typography>
            <Typography color="rgba(255,255,255,0.6)" variant="body2" textAlign="center">
              {selectedEmployee ? "Ready for QR check-in & leave request management." : "Login with your credentials to manage attendance."}
            </Typography>
          </Stack>

          {!selectedEmployee ? (
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginValidationSchema}
              onSubmit={handleLoginSubmit}
            >
              {({ errors, touched, handleChange, values }) => (
                <Form>
                  <Stack spacing={2.5}>
                    <TextField
                      className="glass-input"
                      name="email"
                      variant="outlined"
                      value={values.email}
                      onChange={handleChange}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      fullWidth
                      placeholder="Email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined fontSize="small" sx={{ color: "rgba(255,255,255,0.4)" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ input: { color: "#ffffff" } }}
                    />
                    <TextField
                      className="glass-input"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      value={values.password}
                      onChange={handleChange}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      fullWidth
                      placeholder="Password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined fontSize="small" sx={{ color: "rgba(255,255,255,0.4)" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword((value) => !value)} edge="end" size="small">
                              {showPassword ? <VisibilityOff fontSize="small" sx={{ color: "rgba(255,255,255,0.4)" }} /> : <Visibility fontSize="small" sx={{ color: "rgba(255,255,255,0.4)" }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ input: { color: "#ffffff" } }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loggingIn}
                      startIcon={<LogIn size={18} />}
                      sx={{
                        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                        borderRadius: "14px",
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 700,
                        boxShadow: "0 4px 15px rgba(30, 60, 114, 0.4)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)",
                        }
                      }}
                    >
                      {loggingIn ? "Logging in..." : "Login to Portal"}
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          ) : (
            <Fade in timeout={400}>
              <Stack spacing={3}>
                
                {/* Profile Card */}
                <Box
                  sx={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "18px",
                    p: 2.5,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={selectedEmployee.image || ""}
                      sx={{
                        width: 58,
                        height: 58,
                        border: "2px solid rgba(33, 150, 243, 0.4)",
                        background: "rgba(33, 150, 243, 0.1)",
                      }}
                    >
                      {(selectedEmployee.nameEn || selectedEmployee.nameKh || "?").charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={800} color="#ffffff" variant="subtitle1">
                        {selectedEmployee.nameEn || selectedEmployee.nameKh}
                      </Typography>
                      <Typography color="rgba(255,255,255,0.5)" variant="body2">
                        {selectedEmployee.position || "-"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} mt={2.5} alignItems="center">
                    <Chip
                      size="small"
                      sx={{
                        bgcolor: todayAttendance?.clockIn ? "rgba(76, 175, 80, 0.15)" : qrScanned ? "rgba(255, 152, 0, 0.15)" : "rgba(255,255,255,0.08)",
                        color: todayAttendance?.clockIn ? "#4caf50" : qrScanned ? "#ff9800" : "rgba(255,255,255,0.6)",
                        fontWeight: 600,
                        border: todayAttendance?.clockIn ? "1px solid rgba(76,175,80,0.3)" : qrScanned ? "1px solid rgba(255,152,0,0.3)" : "1px solid rgba(255,255,255,0.1)",
                      }}
                      label={
                        todayAttendance?.clockIn
                          ? `Checked in ${dayjs(todayAttendance.clockIn).format("hh:mm A")}`
                          : qrScanned
                            ? "Checking in..."
                            : "Scan QR to check in"
                      }
                    />
                    {todayAttendance?.clockIn && <CheckCircle2 size={18} color="#4caf50" />}
                  </Stack>
                </Box>

                {/* QR Scanner Controls */}
                {!qrScanned && (
                  <Button
                    variant={scannerActive ? "outlined" : "contained"}
                    startIcon={<Camera size={18} />}
                    onClick={() => setScannerActive((active) => !active)}
                    sx={{
                      py: 1.5,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 700,
                      background: scannerActive ? "transparent" : "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
                      borderColor: scannerActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
                      color: "#ffffff",
                      "&:hover": {
                        background: scannerActive ? "rgba(255, 255, 255, 0.05)" : "linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)",
                        borderColor: scannerActive ? "#ffffff" : "transparent",
                      }
                    }}
                  >
                    {scannerActive ? "Close Scanner" : "Scan QR"}
                  </Button>
                )}

                {scannerActive && (
                  <Box className="scanner-overlay" sx={{ borderRadius: "18px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div className="scanner-laser" />
                    <Box id="attendance-qr-reader" />
                  </Box>
                )}

                {/* Clock Actions */}
                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    startIcon={todayAttendance?.clockIn ? <CheckCircle2 size={18} /> : <LogIn size={18} />}
                    disabled={!employeeId || !qrScanned || loading || Boolean(todayAttendance?.clockIn)}
                    onClick={() =>
                      clockIn({
                        variables: { employeeId },
                        context: { headers: { authorization: `Bearer ${employeeToken}` } },
                      })
                    }
                    sx={{
                      borderRadius: "14px",
                      py: 1.5,
                      textTransform: "none",
                      fontWeight: 700,
                      background: todayAttendance?.clockIn ? "rgba(76, 175, 80, 0.2)" : "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                      color: "#ffffff",
                      boxShadow: "0 4px 15px rgba(56, 239, 125, 0.25)",
                      "&:hover": {
                        background: todayAttendance?.clockIn ? "rgba(76, 175, 80, 0.2)" : "linear-gradient(135deg, #38ef7d 0%, #11998e 100%)",
                      }
                    }}
                  >
                    {todayAttendance?.clockIn ? "Checked In" : loading ? "Checking In..." : "Check In"}
                  </Button>

                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    color="warning"
                    disabled={!employeeId || !todayAttendance?.clockIn || Boolean(todayAttendance?.clockOut) || clockingOut}
                    onClick={() =>
                      clockOut({
                        variables: { employeeId },
                        context: { headers: { authorization: `Bearer ${employeeToken}` } },
                      })
                    }
                    sx={{
                      borderRadius: "14px",
                      py: 1.5,
                      textTransform: "none",
                      fontWeight: 700,
                      background: todayAttendance?.clockOut ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)",
                      color: todayAttendance?.clockOut ? "rgba(255,255,255,0.4)" : "#ffffff",
                      boxShadow: todayAttendance?.clockOut ? "none" : "0 4px 15px rgba(255, 94, 98, 0.25)",
                      "&:hover": {
                        background: todayAttendance?.clockOut ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #ff5e62 0%, #ff9966 100%)",
                      }
                    }}
                  >
                    {todayAttendance?.clockOut ? `Out: ${dayjs(todayAttendance.clockOut).format("hh:mm A")}` : clockingOut ? "Checking Out..." : "Check Out"}
                  </Button>
                </Stack>

                {/* Ask Leave Section */}
                <Box
                  sx={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "18px",
                    p: 2.5,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <Calendar size={18} color="#2196f3" />
                    <Typography fontWeight={800} color="#ffffff">
                      Ask Leave
                    </Typography>
                  </Stack>
                  
                  <Formik
                    initialValues={{ date: dayjs().format("YYYY-MM-DD"), reason: "" }}
                    validationSchema={Yup.object({
                      date: Yup.string().required("Date is required"),
                      reason: Yup.string().required("Reason is required"),
                    })}
                    onSubmit={(values, helpers) => {
                      createLeaveRequest({
                        variables: { input: { employeeId, date: values.date, reason: values.reason } },
                        context: { headers: { authorization: `Bearer ${employeeToken}` } },
                      });
                      helpers.resetForm({ values: { date: dayjs().format("YYYY-MM-DD"), reason: "" } });
                    }}
                  >
                    {({ errors, touched, handleChange, values }) => (
                      <Form>
                        <Stack spacing={2}>
                          <TextField
                            className="glass-input"
                            name="date"
                            type="date"
                            value={values.date}
                            onChange={handleChange}
                            error={touched.date && Boolean(errors.date)}
                            helperText={touched.date && errors.date}
                            fullWidth
                            sx={{ input: { color: "#ffffff" } }}
                          />
                          <TextField
                            className="glass-input"
                            name="reason"
                            value={values.reason}
                            onChange={handleChange}
                            error={touched.reason && Boolean(errors.reason)}
                            helperText={touched.reason && errors.reason}
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="State reason here..."
                            sx={{ textarea: { color: "#ffffff" } }}
                          />
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={creatingLeave}
                            sx={{
                              py: 1.2,
                              borderRadius: "12px",
                              textTransform: "none",
                              fontWeight: 700,
                              background: "rgba(33, 150, 243, 0.15)",
                              color: "#2196f3",
                              border: "1px solid rgba(33, 150, 243, 0.3)",
                              "&:hover": {
                                background: "rgba(33, 150, 243, 0.25)",
                              }
                            }}
                          >
                            {creatingLeave ? "Sending..." : "Submit Request"}
                          </Button>
                        </Stack>
                      </Form>
                    )}
                  </Formik>
                </Box>

                {/* Attendance Logs */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                    <ClipboardList size={18} color="#00e676" />
                    <Typography fontWeight={800} color="#ffffff">
                      My Attendance
                    </Typography>
                  </Stack>
                  <Grid container spacing={1.5}>
                    {attendanceHistory.slice(0, 3).map((row) => (
                      <Grid item xs={12} key={row._id}>
                        <Box
                          sx={{
                            background: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            borderRadius: "14px",
                            p: 2,
                            transition: "all 0.2s",
                            "&:hover": {
                              borderColor: "rgba(255,255,255,0.15)",
                              background: "rgba(255,255,255,0.04)",
                            }
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography fontWeight={700} color="#ffffff" variant="body2">
                              {dayjs(row.date).format("DD MMM YYYY")}
                            </Typography>
                            <Chip
                              size="small"
                              label={row.status || "-"}
                              sx={{
                                height: 20,
                                fontSize: 11,
                                fontWeight: 700,
                                textTransform: "capitalize",
                                bgcolor:
                                  row.status === "present"
                                    ? "rgba(76, 175, 80, 0.15)"
                                    : row.status === "late" || row.status === "half_day"
                                    ? "rgba(255, 152, 0, 0.15)"
                                    : "rgba(244, 67, 54, 0.15)",
                                color:
                                  row.status === "present"
                                    ? "#4caf50"
                                    : row.status === "late" || row.status === "half_day"
                                    ? "#ff9800"
                                    : "#f44336",
                              }}
                            />
                          </Stack>
                          <Typography color="rgba(255, 255, 255, 0.5)" sx={{ mt: 0.5, fontSize: 12 }}>
                            In: {row.clockIn ? dayjs(row.clockIn).format("hh:mm A") : "-"} · Out: {row.clockOut ? dayjs(row.clockOut).format("hh:mm A") : "-"}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                    {attendanceHistory.length === 0 && (
                      <Grid item xs={12}>
                        <Typography color="rgba(255,255,255,0.4)" variant="body2" textAlign="center" sx={{ py: 2 }}>
                          No recent logs available.
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* Leave Requests Logs */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                    <AlertTriangle size={18} color="#ff9800" />
                    <Typography fontWeight={800} color="#ffffff">
                      My Leave Requests
                    </Typography>
                  </Stack>
                  <Stack spacing={1.5}>
                    {leaveRequests.slice(0, 3).map((row) => (
                      <Box
                        key={row._id}
                        sx={{
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          borderRadius: "14px",
                          p: 2,
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight={700} color="#ffffff" variant="body2">
                            {dayjs(row.date).format("DD MMM YYYY")}
                          </Typography>
                          <Chip
                            size="small"
                            label={row.status}
                            sx={{
                              height: 20,
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "capitalize",
                              bgcolor:
                                row.status === "approved"
                                  ? "rgba(76, 175, 80, 0.15)"
                                  : row.status === "rejected"
                                  ? "rgba(244, 67, 54, 0.15)"
                                  : "rgba(255, 152, 0, 0.15)",
                              color:
                                row.status === "approved"
                                  ? "#4caf50"
                                  : row.status === "rejected"
                                  ? "#f44336"
                                  : "#ff9800",
                            }}
                          />
                        </Stack>
                        <Typography color="rgba(255,255,255,0.5)" sx={{ mt: 0.5, fontSize: 12 }}>
                          {row.reason}
                        </Typography>
                        {row.adminRemark && (
                          <Typography color="#ffc107" sx={{ mt: 0.5, fontSize: 11 }}>
                            Remark: {row.adminRemark}
                          </Typography>
                        )}
                      </Box>
                    ))}
                    {leaveRequests.length === 0 && (
                      <Typography color="rgba(255,255,255,0.4)" variant="body2" textAlign="center" sx={{ py: 2 }}>
                        No recent requests.
                      </Typography>
                    )}
                  </Stack>
                </Box>

                <Button
                  variant="text"
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    color: "rgba(255, 255, 255, 0.4)",
                    textTransform: "none",
                    "&:hover": { color: "#ffffff", background: "rgba(255,255,255,0.05)" }
                  }}
                >
                  Logout from Portal
                </Button>
              </Stack>
            </Fade>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
