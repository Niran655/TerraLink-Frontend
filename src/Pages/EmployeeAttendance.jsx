import { useMutation, useQuery } from "@apollo/client/react";
import { alpha, useTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { CalendarDays, Coffee, LogIn, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  CLOCK_IN_ATTENDANCE,
  CLOCK_OUT_ATTENDANCE,
  END_ATTENDANCE_BREAK,
  START_ATTENDANCE_BREAK,
} from "../../graphql/mutation";
import {
  GET_ATTENDANCE_OVERVIEW,
  GET_ATTENDANCES_WITH_PAGINATION,
  GET_EMPLOYEES_WITH_PAGINATION,
  GET_TODAY_ATTENDANCE,
} from "../../graphql/queries";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
import "../Styles/TableStyle.scss";

const formatDate = (value) => (value ? dayjs(value).format("DD MMM YYYY") : "-");
const formatTime = (value) => (value ? dayjs(value).format("hh:mm A") : "-");
const formatMinutes = (minutes = 0) => {
  const safeMinutes = Math.max(0, Number(minutes || 0));
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;
  return `${String(hours).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m`;
};

const statusColor = (status) => {
  if (status === "present") return "success";
  if (status === "late" || status === "half_day") return "warning";
  if (status === "absent") return "error";
  if (status === "holiday") return "secondary";
  return "default";
};

export default function EmployeeAttendance() {
  const theme = useTheme();
  const { language, setAlert } = useAuth();
  const { t } = translateLauguage(language);
  const [employeeId, setEmployeeId] = useState(() => localStorage.getItem("attendanceEmployeeId") || "");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (employeeId) localStorage.setItem("attendanceEmployeeId", employeeId);
  }, [employeeId]);

  const { data: employeeData } = useQuery(GET_EMPLOYEES_WITH_PAGINATION, {
    variables: { page: 1, limit: 100, pagination: false, keyword: "", active: true },
  });

  const employees = employeeData?.getEmployeesWithPagination?.data || [];
  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee._id === employeeId) || null,
    [employeeId, employees]
  );

  const todayVariables = { employeeId };
  const { data: todayData, refetch: refetchToday } = useQuery(GET_TODAY_ATTENDANCE, {
    variables: todayVariables,
    skip: !employeeId,
    fetchPolicy: "cache-and-network",
  });
  const { data: overviewData, refetch: refetchOverview } = useQuery(GET_ATTENDANCE_OVERVIEW, {
    variables: { employeeId: employeeId || null, month: dayjs().month() + 1, year: dayjs().year() },
    skip: !employeeId,
    fetchPolicy: "cache-and-network",
  });
  const { data: historyData, loading: historyLoading, refetch: refetchHistory } = useQuery(GET_ATTENDANCES_WITH_PAGINATION, {
    variables: { page: 1, limit: 10, pagination: true, employeeId: employeeId || null },
    skip: !employeeId,
    fetchPolicy: "cache-and-network",
  });

  const todayAttendance = todayData?.getTodayAttendance;
  const overview = overviewData?.getAttendanceOverview || {};
  const history = historyData?.getAttendancesWithPagination?.data || [];

  const refresh = () => {
    refetchToday();
    refetchOverview();
    refetchHistory();
  };

  const handleDone = (resultKey) => (response) => {
    const result = response?.[resultKey];
    setAlert(true, result?.isSuccess ? "success" : "error", result?.message);
    refresh();
  };

  const handleError = (error) => {
    setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
  };

  const [clockIn, { loading: clockingIn }] = useMutation(CLOCK_IN_ATTENDANCE, {
    onCompleted: handleDone("clockInAttendance"),
    onError: handleError,
  });
  const [clockOut, { loading: clockingOut }] = useMutation(CLOCK_OUT_ATTENDANCE, {
    onCompleted: handleDone("clockOutAttendance"),
    onError: handleError,
  });
  const [startBreak, { loading: startingBreak }] = useMutation(START_ATTENDANCE_BREAK, {
    onCompleted: handleDone("startAttendanceBreak"),
    onError: handleError,
  });
  const [endBreak, { loading: endingBreak }] = useMutation(END_ATTENDANCE_BREAK, {
    onCompleted: handleDone("endAttendanceBreak"),
    onError: handleError,
  });

  const isOnBreak = Boolean(todayAttendance?.breakStart);
  const disabled = !employeeId || clockingIn || clockingOut || startingBreak || endingBreak;

  const overviewCards = [
    [t("total_working_days"), overview.totalWorkingDays || 0, theme.palette.warning.main],
    [t("absent_days"), overview.absentDays || 0, theme.palette.error.main],
    [t("present_days"), overview.presentDays || 0, theme.palette.primary.main],
    [t("half_days"), overview.halfDays || 0, theme.palette.warning.dark],
    [t("late_days"), overview.lateDays || 0, theme.palette.info.main],
    [t("holiday"), overview.holidayDays || 0, theme.palette.success.main],
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Breadcrumbs separator="/">
          <Typography component={RouterLink} to="/" sx={{ textDecoration: "none", borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}>
            {t(`attendance`)}
          </Typography>
          <Typography fontWeight={600}>Employee Attendance</Typography>
        </Breadcrumbs>

        <Grid container spacing={2} mt={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 3, height: "100%" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={700}>{t(`attendance`)}</Typography>
                <Typography color="primary" fontWeight={700}>{dayjs().format("DD MMM YYYY")}</Typography>
              </Stack>
              <Autocomplete
                options={employees}
                value={selectedEmployee}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                getOptionLabel={(employee) => employee ? `${employee.nameEn || employee.nameKh} - ${employee.position || "-"}` : ""}
                onChange={(_, employee) => setEmployeeId(employee?._id || "")}
                renderInput={(params) => <TextField {...params} size="small" placeholder="Select employee" />}
              />
              <Stack direction="row" spacing={2} alignItems="center" my={3}>
                <CalendarDays size={42} color="#1D4592" />
                <Box>
                  <Typography variant="h4" fontWeight={800}>{dayjs(now).format("HH:mm:ss")}</Typography>
                  <Typography color="text.secondary">Current Time</Typography>
                </Box>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                {!todayAttendance?.clockIn ? (
                  <Button fullWidth variant="contained" startIcon={<LogIn size={18} />} disabled={disabled} onClick={() => clockIn({ variables: { employeeId } })}>
                    {t(`check_in`)}
                  </Button>
                ) : (
                  <Button fullWidth variant="contained" color="warning" startIcon={<LogOut size={18} />} disabled={disabled || Boolean(todayAttendance?.clockOut)} onClick={() => clockOut({ variables: { employeeId } })}>
                    Clock Out
                  </Button>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  color={isOnBreak ? "success" : "info"}
                  startIcon={<Coffee size={18} />}
                  disabled={disabled || !todayAttendance?.clockIn || Boolean(todayAttendance?.clockOut)}
                  onClick={() => (isOnBreak ? endBreak : startBreak)({ variables: { employeeId } })}
                >
                  {isOnBreak ? "End Break" : "Break"}
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 3, height: "100%" }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Days Overview This Month</Typography>
              <Grid container spacing={2}>
                {overviewCards.map(([label, value, color]) => (
                  <Grid key={label} size={{ xs: 6, sm: 4, md: 2 }}>
                    <Stack alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          bgcolor: alpha(color, theme.palette.mode === "dark" ? 0.18 : 0.12),
                          border: "1px solid",
                          borderColor: alpha(color, theme.palette.mode === "dark" ? 0.28 : 0.22),
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Typography variant="h5" fontWeight={900} color={color}>
                          {String(value).padStart(2, "0")}
                        </Typography>
                      </Box>
                      <Typography textAlign="center" fontWeight={600}>{label}</Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <TableContainer className="table-container" sx={{ mt: 3 }}>
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Clock In</TableCell>
                <TableCell>Clock Out</TableCell>
                <TableCell>Production</TableCell>
                <TableCell>Break</TableCell>
                <TableCell>Overtime</TableCell>
                <TableCell>Total Hours</TableCell>
              </TableRow>
            </TableHead>
            {historyLoading ? (
              <CircularIndeterminate cols={8} />
            ) : history.length === 0 ? (
              <EmptyData />
            ) : (
              <TableBody>
                {history.map((row) => (
                  <TableRow key={row._id} className="table-row">
                    <TableCell>{formatDate(row.date)}</TableCell>
                    <TableCell><Chip size="small" label={row.status} color={statusColor(row.status)} /></TableCell>
                    <TableCell>{formatTime(row.clockIn)}</TableCell>
                    <TableCell>{formatTime(row.clockOut)}</TableCell>
                    <TableCell>{formatMinutes(row.productionMinutes)}</TableCell>
                    <TableCell>{formatMinutes(row.breakMinutes)}</TableCell>
                    <TableCell>{formatMinutes(row.overtimeMinutes)}</TableCell>
                    <TableCell>{formatMinutes(row.totalMinutes)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
}
