import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Breadcrumbs,
  MenuItem,
  CircularProgress,
  IconButton,
  Avatar,
  Fade
} from "@mui/material";
import {
  CalendarMonth,
  AccessTime,
  Add,
  Assignment,
  WbSunny,
  NightsStay,
  WbTwilight,
  ChevronRight,
  TrendingUp,
  Schedule,
  CheckCircleOutline,
  WorkOutline
} from "@mui/icons-material";
import { GET_SHIFTS, GET_SHIFT_ASSIGNMENTS, GET_EMPLOYEES } from "../../graphql/queries";
import { CREATE_SHIFT, ASSIGN_SHIFT } from "../../graphql/mutation";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

export default function ShiftManagement() {
  const { language, setAlert } = useAuth();
  const { t } = translateLauguage(language);

  const [openShiftDialog, setOpenShiftDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);

  // New shift form state
  const [shiftName, setShiftName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState("#6366f1"); // modern indigo default

  // Assignment form state
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: shiftsData, loading: shiftsLoading, refetch: refetchShifts } = useQuery(GET_SHIFTS);
  const { data: assignmentsData, loading: assignmentsLoading, refetch: refetchAssignments } = useQuery(GET_SHIFT_ASSIGNMENTS);
  const { data: employeesData } = useQuery(GET_EMPLOYEES, { variables: { limit: 100 } });

  const [createShift, { loading: createLoading }] = useMutation(CREATE_SHIFT, {
    onCompleted: (res) => {
      if (res.createShift?.isSuccess) {
        setAlert(true, "success", "Shift created successfully");
        setOpenShiftDialog(false);
        setShiftName("");
        setStartTime("");
        setEndTime("");
        refetchShifts();
      } else {
        setAlert(true, "error", res.createShift?.message?.messageEn || "Failed to create shift");
      }
    }
  });

  const [assignShift, { loading: assignLoading }] = useMutation(ASSIGN_SHIFT, {
    onCompleted: (res) => {
      if (res.assignShift?.isSuccess) {
        setAlert(true, "success", "Shift assigned successfully");
        setOpenAssignDialog(false);
        setSelectedEmployee("");
        setSelectedShift("");
        setStartDate("");
        setEndDate("");
        refetchAssignments();
      } else {
        setAlert(true, "error", res.assignShift?.message?.messageEn || "Failed to assign shift");
      }
    }
  });

  const handleCreateShift = () => {
    if (!shiftName || !startTime || !endTime) {
      setAlert(true, "error", "Please fill all required fields");
      return;
    }
    createShift({
      variables: {
        input: { name: shiftName, startTime, endTime, color }
      }
    });
  };

  const handleAssignShift = () => {
    if (!selectedEmployee || !selectedShift || !startDate || !endDate) {
      setAlert(true, "error", "Please fill all fields");
      return;
    }
    assignShift({
      variables: {
        input: {
          employeeId: selectedEmployee,
          shiftId: selectedShift,
          startDate,
          endDate
        }
      }
    });
  };

  const shifts = shiftsData?.getShifts || [];
  const assignments = assignmentsData?.getShiftAssignments || [];
  const employees = employeesData?.getEmployees?.data || [];

  // Determine shift icon based on hours
  const getShiftIcon = (startHourStr) => {
    if (!startHourStr) return <WbSunny sx={{ color: "#f59e0b" }} />;
    const hour = parseInt(startHourStr.split(":")[0]);
    if (hour >= 18 || hour < 6) return <NightsStay sx={{ color: "#6366f1" }} />;
    if (hour >= 12) return <WbTwilight sx={{ color: "#3b82f6" }} />;
    return <WbSunny sx={{ color: "#eab308" }} />;
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Breadcrumbs / Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ mb: 4 }}>
        <Box>
          <Breadcrumbs separator={<ChevronRight fontSize="small" />} sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {t("hmr")}
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
              Shift Planner
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em" sx={{ color: "text.primary" }}>
            Shift Schedule & Rosters
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<AccessTime />}
            onClick={() => setOpenShiftDialog(true)}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              py: 1.2,
              borderWidth: "1.5px",
              borderColor: "rgba(99, 102, 241, 0.2)",
              color: "primary.main",
              "&:hover": { borderWidth: "1.5px", bgcolor: "rgba(99, 102, 241, 0.05)" }
            }}
          >
            New Shift Pattern
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAssignDialog(true)}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.2,
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              "&:hover": { boxShadow: "0 6px 20px rgba(99, 102, 241, 0.6)" }
            }}
          >
            Assign Roster
          </Button>
        </Stack>
      </Stack>

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: "20px",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.02)",
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0.01) 100%)"
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, boxShadow: "0px 8px 20px rgba(99, 102, 241, 0.25)" }}>
                <AccessTime />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={800} sx={{ color: "text.primary" }}>
                  {shifts.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Configured Patterns
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: "20px",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.02)",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.01) 100%)"
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
              <Avatar sx={{ bgcolor: "success.main", width: 56, height: 56, boxShadow: "0px 8px 20px rgba(16, 185, 129, 0.25)" }}>
                <CheckCircleOutline />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={800} sx={{ color: "text.primary" }}>
                  {assignments.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Active Schedules
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: "20px",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.02)",
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.01) 100%)"
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
              <Avatar sx={{ bgcolor: "warning.main", width: 56, height: 56, boxShadow: "0px 8px 20px rgba(245, 158, 11, 0.25)" }}>
                <WorkOutline />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={800} sx={{ color: "text.primary" }}>
                  {employees.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Total Employees
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Grid */}
      <Grid container spacing={4}>
        {/* Shifts List (Left) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            sx={{

              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0px 12px 40px rgba(0,0,0,0.03)",
              bgcolor: "background.paper",
              p: 1
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.2 }}>
                <AccessTime sx={{ color: "primary.main" }} /> Shift Patterns
              </Typography>

              {shiftsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : shifts.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No custom shifts defined. Click "New Shift Pattern" to get started.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {shifts.map((s) => (
                    <Fade in key={s._id}>
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: "16px",
                          bgcolor: "rgba(0,0,0,0.01)",
                          border: "1px solid rgba(0,0,0,0.04)",

                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "all 0.2s",
                          "&:hover": {
                            transform: "scale(1.01)",
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.02)"
                          }
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: "12px",
                              bgcolor: (s.color || "#6366f1") + "15",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            {getShiftIcon(s.startTime)}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700}>
                              {s.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Schedule sx={{ fontSize: 12 }} /> {s.startTime} - {s.endTime}
                            </Typography>
                          </Box>
                        </Stack>
                        <Chip
                          label={s.active ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            bgcolor: s.active ? "rgba(16, 185, 129, 0.1)" : "rgba(0,0,0,0.05)",
                            color: s.active ? "success.main" : "text.secondary"
                          }}
                        />
                      </Box>
                    </Fade>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Schedules Table (Right) */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            sx={{

              border: "1px solid rgba(0,0,0,0.07)",

              bgcolor: "background.paper",
              p: 1
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.2 }}>
                <CalendarMonth sx={{ color: "primary.main" }} /> Scheduled Rosters
              </Typography>

              {assignmentsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : assignments.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="body1" color="text.secondary" fontWeight={500} mb={1}>
                    Roster is empty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use the Roster Assigner to attach employee shifts.
                  </Typography>
                </Box>
              ) : (
                <TableContainer  >
                  <Table>
                    <TableHead sx={{ bgcolor: "rgba(0,0,0,0.01)" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}>Employee</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Shift Details</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Start Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>End Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignments.map((a) => (
                        <TableRow key={a._id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell sx={{ py: 2 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar sx={{ bgcolor: "primary.light", fontSize: "0.8rem", width: 32, height: 32, fontWeight: 700 }}>
                                {(a.employee?.nameEn || "?").charAt(0)}
                              </Avatar>
                              <Typography variant="body2" fontWeight={700}>
                                {a.employee?.nameEn || a.employee?.nameKh}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${a.shift?.name} (${a.shift?.startTime} - ${a.shift?.endTime})`}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                bgcolor: (a.shift?.color || "#6366f1") + "18",
                                color: a.shift?.color || "#6366f1",
                                border: `1.5px solid ${(a.shift?.color || "#6366f1") + "30"}`
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500, color: "text.secondary" }}>
                            {new Date(a.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500, color: "text.secondary" }}>
                            {new Date(a.endDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label="Active"
                              size="small"
                              color="success"
                              sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog: Create Shift */}
      <Dialog
        open={openShiftDialog}
        onClose={() => setOpenShiftDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.3rem" }}>Create Shift Pattern</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Pattern Name"
              size="small"
              fullWidth
              placeholder="e.g. Night Roster"
              value={shiftName}
              onChange={(e) => setShiftName(e.target.value)}
              InputProps={{ sx: { borderRadius: "10px" } }}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Start"
                type="time"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputProps={{ sx: { borderRadius: "10px" } }}
              />
              <TextField
                label="End"
                type="time"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputProps={{ sx: { borderRadius: "10px" } }}
              />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                Accent Color
              </Typography>
              <TextField
                type="color"
                size="small"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                sx={{
                  width: 60,
                  "& input": { p: 0, border: 0, height: 35, cursor: "pointer", borderRadius: "10px" }
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenShiftDialog(false)} color="inherit" sx={{ fontWeight: 600, textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateShift}
            variant="contained"
            disabled={createLoading}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              boxShadow: "0px 6px 14px rgba(99, 102, 241, 0.3)"
            }}
          >
            {createLoading ? "Saving..." : "Create Pattern"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Assign Shift */}
      <Dialog
        open={openAssignDialog}
        onClose={() => setOpenAssignDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.3rem" }}>Assign Roster</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              select
              label="Employee"
              size="small"
              fullWidth
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              InputProps={{ sx: { borderRadius: "10px" } }}
            >
              {employees.map((e) => (
                <MenuItem key={e._id} value={e._id}>
                  {e.nameEn || e.nameKh} ({e.position})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Shift Pattern"
              size="small"
              fullWidth
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              InputProps={{ sx: { borderRadius: "10px" } }}
            >
              {shifts.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  {s.name} ({s.startTime} - {s.endTime})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputProps={{ sx: { borderRadius: "10px" } }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputProps={{ sx: { borderRadius: "10px" } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenAssignDialog(false)} color="inherit" sx={{ fontWeight: 600, textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleAssignShift}
            variant="contained"
            disabled={assignLoading}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              boxShadow: "0px 6px 14px rgba(99, 102, 241, 0.3)"
            }}
          >
            {assignLoading ? "Saving..." : "Confirm Schedule"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
