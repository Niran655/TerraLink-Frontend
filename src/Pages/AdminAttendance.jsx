import { useMutation, useQuery } from "@apollo/client/react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  InputAdornment,
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
} from "@mui/material";
import dayjs from "dayjs";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { UPDATE_LEAVE_REQUEST_STATUS } from "../../graphql/mutation";
import { GET_ATTENDANCES_WITH_PAGINATION, GET_LEAVE_REQUESTS_WITH_PAGINATION } from "../../graphql/queries";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import FooterPagination from "../include/FooterPagination";
import CircularIndeterminate from "../include/Loading";
import "../Styles/TableStyle.scss";

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

export default function AdminAttendance() {
  const { language, setAlert } = useAuth();
  const { t } = translateLauguage(language);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const { data, loading } = useQuery(GET_ATTENDANCES_WITH_PAGINATION, {
    variables: {
      page,
      limit,
      pagination: true,
      keyword,
      status: status === "all" ? null : status,
      startDate: selectedDate ? dayjs(selectedDate).startOf("day").toISOString() : null,
      endDate: selectedDate ? dayjs(selectedDate).endOf("day").toISOString() : null,
    },
    fetchPolicy: "cache-and-network",
  });

  const attendances = data?.getAttendancesWithPagination?.data || [];
  const paginator = data?.getAttendancesWithPagination?.paginator || {};

  const { data: leaveData, refetch: refetchLeaveRequests } = useQuery(GET_LEAVE_REQUESTS_WITH_PAGINATION, {
    variables: { page: 1, limit: 20, pagination: true, status: "pending" },
    fetchPolicy: "cache-and-network",
  });
  const leaveRequests = leaveData?.getLeaveRequestsWithPagination?.data || [];

  const [updateLeaveStatus, { loading: updatingLeave }] = useMutation(UPDATE_LEAVE_REQUEST_STATUS, {
    onCompleted: ({ updateLeaveRequestStatus }) => {
      setAlert(true, updateLeaveRequestStatus?.isSuccess ? "success" : "error", updateLeaveRequestStatus?.message);
      refetchLeaveRequests();
    },
    onError: (error) => {
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Breadcrumbs separator="/">
          <Typography component={RouterLink} to="/" sx={{ textDecoration: "none", borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}>
            Attendance
          </Typography>
          <Typography fontWeight={600}>Admin View</Typography>
        </Breadcrumbs>

        <Typography variant="h5" fontWeight={700} mt={4}>Attendance</Typography>
        <Typography color="text.secondary" mb={3}>Manage your Attendance</Typography>

        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2, mb: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>Pending Leave Requests</Typography>
          {leaveRequests.length === 0 ? (
            <Typography color="text.secondary">No pending leave requests.</Typography>
          ) : (
            <Grid container spacing={2}>
              {leaveRequests.map((request) => (
                <Grid size={{ xs: 12, md: 6 }} key={request._id}>
                  <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={2}>
                      <Box>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar src={request.employee?.image || ""} sx={{ width: 40, height: 40 }}>
                            {(request.employee?.nameEn || request.employee?.nameKh || "?").charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={700}>{request.employee?.nameEn || request.employee?.nameKh || "-"}</Typography>
                            <Typography color="text.secondary" fontSize={13}>{dayjs(request.date).format("DD MMM YYYY")}</Typography>
                          </Box>
                        </Stack>
                      </Box>
                      <Chip size="small" color="warning" label={request.status} />
                    </Stack>
                    <Typography sx={{ my: 1.5 }}>{request.reason}</Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        disabled={updatingLeave}
                        onClick={() => updateLeaveStatus({ variables: { id: request._id, status: "approved" } })}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={updatingLeave}
                        onClick={() => updateLeaveStatus({ variables: { id: request._id, status: "rejected" } })}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
          <Grid container spacing={2} alignItems="center" sx={{ p: 2 }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                value={keyword}
                placeholder={`${t("search") || "Search"}...`}
                onChange={(event) => {
                  setKeyword(event.target.value);
                  setPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }} ml="auto">
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                  setPage(1);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    placeholder: "Select Date",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="all">Select Status</MenuItem>
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="late">Late</MenuItem>
                <MenuItem value="half_day">Half Day</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="holiday">Holiday</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <TableContainer>
            <Table className="table">
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
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
              {loading ? (
                <CircularIndeterminate />
              ) : attendances.length === 0 ? (
                <EmptyData />
              ) : (
                <TableBody>
                  {attendances.map((row) => (
                    <TableRow key={row._id} className="table-row">
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar src={row.employee?.image || ""} sx={{ width: 40, height: 40 }}>
                            {(row.employee?.nameEn || row.employee?.nameKh || "?").charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>{row.employee?.nameEn || row.employee?.nameKh || "-"}</Typography>
                            <Typography variant="body2" color="text.secondary">{row.employee?.position || row.employee?.department?.nameEn || "-"}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{row.date ? dayjs(row.date).format("DD MMM YYYY") : "-"}</TableCell>
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

          <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
            <FooterPagination
              page={page}
              limit={limit}
              setPage={setPage}
              handleLimit={(event) => {
                setLimit(parseInt(event.target.value, 10));
                setPage(1);
              }}
              totalDocs={paginator.totalDocs}
              totalPages={paginator.totalPages}
            />
          </Stack>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
