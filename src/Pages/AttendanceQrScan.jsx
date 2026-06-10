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
} from "@mui/material";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Camera, CheckCircle2, LogIn, ScanLine } from "lucide-react";
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
        bgcolor: "background.default",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 480, border: "1px solid", borderColor: "divider", borderRadius: 1, p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2} alignItems="stretch">
          <Stack alignItems="center" spacing={1}>
            <ScanLine size={42} color="#1D4592" />
            <Typography variant="h5" fontWeight={800}>Attendance Check In</Typography>
            <Typography color="text.secondary" textAlign="center">
              {selectedEmployee ? "Your attendance account is ready for QR check in." : "Login with your staff account to continue."}
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
                  <Stack spacing={2}>
                    <TextField
                      name="email"
                      size="small"
                      value={values.email}
                      onChange={handleChange}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      fullWidth
                      placeholder={t("email") || "Email"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      name="password"
                      type={showPassword ? "text" : "password"}
                      size="small"
                      value={values.password}
                      onChange={handleChange}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      fullWidth
                      placeholder={t("password") || "Password"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword((value) => !value)} edge="end" size="small">
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button type="submit" variant="contained" size="large" disabled={loggingIn} startIcon={<LogIn size={18} />}>
                      {loggingIn ? "Logging in..." : t("login") || "Login"}
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          ) : (
            <>
              {!qrScanned && (
                <Button
                  variant={scannerActive ? "outlined" : "contained"}
                  startIcon={<Camera size={18} />}
                  onClick={() => setScannerActive((active) => !active)}
                >
                  {scannerActive ? "Close Scanner" : "Scan QR"}
                </Button>
              )}

              {scannerActive && (
                <Box sx={{ overflow: "hidden", borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
                  <Box id="attendance-qr-reader" />
                </Box>
              )}

              {selectedEmployee ? (
                <Box sx={{ bgcolor: "action.hover", borderRadius: 1, p: 2 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar src={selectedEmployee.image || ""} sx={{ width: 54, height: 54 }}>
                      {(selectedEmployee.nameEn || selectedEmployee.nameKh || "?").charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={700}>{selectedEmployee.nameEn || selectedEmployee.nameKh}</Typography>
                      <Typography color="text.secondary">{selectedEmployee.position || "-"}</Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} mt={1} alignItems="center">
                    <Chip
                      size="small"
                      color={todayAttendance?.clockIn ? "success" : qrScanned ? "warning" : "default"}
                      label={
                        todayAttendance?.clockIn
                          ? `Checked in ${dayjs(todayAttendance.clockIn).format("hh:mm A")}`
                          : qrScanned
                            ? "Checking in..."
                            : "Scan QR to check in"
                      }
                    />
                    {todayAttendance?.clockIn && <CheckCircle2 size={18} color="#2e7d32" />}
                  </Stack>
                </Box>
              ) : (
                <Box sx={{ bgcolor: "action.hover", borderRadius: 1, p: 2 }}>
                  <Typography fontWeight={700}>No staff profile found</Typography>
                  <Typography color="text.secondary">
                    Login with an employee account created from Employee setup.
                  </Typography>
                </Box>
              )}

              <Button
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
              >
                {todayAttendance?.clockIn ? "Checked In" : loading ? "Checking In..." : "Check In"}
              </Button>
              <Button
                size="large"
                variant="outlined"
                color="warning"
                disabled={!employeeId || !todayAttendance?.clockIn || Boolean(todayAttendance?.clockOut) || clockingOut}
                onClick={() =>
                  clockOut({
                    variables: { employeeId },
                    context: { headers: { authorization: `Bearer ${employeeToken}` } },
                  })
                }
              >
                {todayAttendance?.clockOut ? `Checked Out ${dayjs(todayAttendance.clockOut).format("hh:mm A")}` : clockingOut ? "Checking Out..." : "Check Out"}
              </Button>

              <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 }}>
                <Typography fontWeight={700} mb={1}>Ask Leave</Typography>
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
                      <Stack spacing={1.5}>
                        <TextField
                          name="date"
                          type="date"
                          size="small"
                          value={values.date}
                          onChange={handleChange}
                          error={touched.date && Boolean(errors.date)}
                          helperText={touched.date && errors.date}
                          fullWidth
                        />
                        <TextField
                          name="reason"
                          size="small"
                          value={values.reason}
                          onChange={handleChange}
                          error={touched.reason && Boolean(errors.reason)}
                          helperText={touched.reason && errors.reason}
                          fullWidth
                          multiline
                          rows={2}
                          placeholder="Reason"
                        />
                        <Button type="submit" variant="contained" disabled={creatingLeave}>
                          {creatingLeave ? "Sending..." : "Send Request"}
                        </Button>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              </Box>

              <Box>
                <Typography fontWeight={700} mb={1}>My Attendance</Typography>
                <Grid container spacing={1}>
                  {attendanceHistory.map((row) => (
                    <Grid size={{ xs: 12 }} key={row._id}>
                      <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight={700}>{dayjs(row.date).format("DD MMM YYYY")}</Typography>
                          <Chip size="small" label={row.status || "-"} />
                        </Stack>
                        <Typography color="text.secondary" fontSize={13}>
                          In: {row.clockIn ? dayjs(row.clockIn).format("hh:mm A") : "-"} · Out: {row.clockOut ? dayjs(row.clockOut).format("hh:mm A") : "-"}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box>
                <Typography fontWeight={700} mb={1}>My Leave Requests</Typography>
                <Stack spacing={1}>
                  {leaveRequests.map((row) => (
                    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 1.5 }} key={row._id}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight={700}>{dayjs(row.date).format("DD MMM YYYY")}</Typography>
                        <Chip
                          size="small"
                          color={row.status === "approved" ? "success" : row.status === "rejected" ? "error" : "warning"}
                          label={row.status}
                        />
                      </Stack>
                      <Typography color="text.secondary" fontSize={13}>{row.reason}</Typography>
                      {row.adminRemark && <Typography color="text.secondary" fontSize={12}>Admin: {row.adminRemark}</Typography>}
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Button variant="text" color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
