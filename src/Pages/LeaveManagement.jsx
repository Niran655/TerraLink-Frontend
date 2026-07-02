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
  Fade,
  Step,
  Stepper,
  StepLabel
} from "@mui/material";
import {
  Check,
  Close,
  AttachFile,
  EventAvailable,
  HourglassEmpty,
  CancelOutlined,
  CheckCircle,
  ChevronRight,
  Add
} from "@mui/icons-material";
import { GET_LEAVE_REQUESTS } from "../../graphql/queries";
import { APPROVE_LEAVE, SUBMIT_LEAVE_REQUEST } from "../../graphql/mutation";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

export default function LeaveManagement() {
  const { language, setAlert, user } = useAuth();
  const { t } = translateLauguage(language);

  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);

  // New leave request state
  const [leaveType, setLeaveType] = useState("Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  // Review states
  const [remark, setRemark] = useState("");

  const { data, loading, refetch } = useQuery(GET_LEAVE_REQUESTS);

  const [submitLeaveRequest, { loading: requestLoading }] = useMutation(SUBMIT_LEAVE_REQUEST, {
    onCompleted: (res) => {
      if (res.submitLeaveRequest?.isSuccess) {
        setAlert(true, "success", "Leave request submitted successfully");
        setOpenRequestDialog(false);
        setLeaveType("Annual Leave");
        setStartDate("");
        setEndDate("");
        setReason("");
        refetch();
      } else {
        setAlert(true, "error", res.submitLeaveRequest?.message?.messageEn || "Failed to submit request");
      }
    }
  });

  const [approveLeave, { loading: reviewLoading }] = useMutation(APPROVE_LEAVE, {
    onCompleted: (res) => {
      if (res.approveLeave?.isSuccess) {
        setAlert(true, "success", "Leave request review registered");
        setOpenReviewDialog(false);
        setRemark("");
        refetch();
      } else {
        setAlert(true, "error", res.approveLeave?.message?.messageEn || "Failed to review leave");
      }
    }
  });

  const handleSubmitRequest = () => {
    if (!startDate || !endDate || !reason) {
      setAlert(true, "error", "Please fill all required fields");
      return;
    }
    submitLeaveRequest({
      variables: {
        input: { leaveType, startDate, endDate, reason }
      }
    });
  };

  const handleReview = (status) => {
    if (!activeRequest) return;

    const stage = user?.role === "manager" ? "manager" : "hr";
    const finalStatus = status === "approved" ? (stage === "manager" ? "manager_approved" : "approved") : "rejected";

    approveLeave({
      variables: {
        id: activeRequest._id,
        stage,
        status: finalStatus,
        remark
      }
    });
  };

  const requests = data?.getLeaveRequests || [];

  // Statistics calculation
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === "pending" || r.status === "manager_approved").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  // Determine request active step in stepper
  const getStepperActiveStep = (status) => {
    if (status === "pending") return 1;
    if (status === "manager_approved") return 2;
    if (status === "approved") return 3;
    return 0; // rejected/cancelled
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ mb: 4 }}>
        <Box>
          <Breadcrumbs separator={<ChevronRight fontSize="small" />} sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {t("hmr")}
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
              Leaves
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em" sx={{ color: "text.primary" }}>
            Leaves & Absence Directory
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenRequestDialog(true)}
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
          Submit Request
        </Button>
      </Stack>

      {/* Analytics KPI section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "All Requests", count: totalCount, icon: <EventAvailable />, color: "#6366f1", bg: "rgba(99, 102, 241, 0.05)" },
          { label: "Awaiting Action", count: pendingCount, icon: <HourglassEmpty />, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.05)" },
          { label: "Approved Leaves", count: approvedCount, icon: <CheckCircle />, color: "#10b981", bg: "rgba(16, 185, 129, 0.05)" },
          { label: "Rejected Leaves", count: rejectedCount, icon: <CancelOutlined />, color: "#ef4444", bg: "rgba(239, 68, 68, 0.05)" }
        ].map((c, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ borderRadius: "20px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0px 10px 30px rgba(0,0,0,0.02)", background: `linear-gradient(135deg, ${c.bg} 0%, rgba(255,255,255,0) 100%)` }}>
              <CardContent sx={{ display: "flex", alignItems: "center", justifyItems: "space-between", p: 3, gap: 2 }}>
                <Avatar sx={{ bgcolor: c.color, width: 48, height: 48, boxShadow: `0px 4px 14px ${c.color}25` }}>
                  {c.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={850}>
                    {c.count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {c.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Requests Listing */}
      <Card sx={{ borderRadius: "24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0px 12px 40px rgba(0,0,0,0.03)", bgcolor: "background.paper", p: 1 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3 }}>
            Leaves Directory
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={32} />
            </Box>
          ) : requests.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="body1" color="text.secondary" fontWeight={500} mb={1}>
                No leave requests found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click "Submit Request" above to request a leave absence.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid rgba(0,0,0,0.04)", borderRadius: "16px" }}>
              <Table>
                <TableHead sx={{ bgcolor: "rgba(0,0,0,0.01)" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Leave Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Period</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Days</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Reason</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Workflow Timeline</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Approval</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "text.secondary" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((r) => (
                    <TableRow key={r._id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ bgcolor: "primary.light", fontSize: "0.8rem", width: 32, height: 32, fontWeight: 700 }}>
                            {(r.employee?.nameEn || "?").charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700}>
                              {r.employee?.nameEn || r.employee?.nameKh}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                              {r.employee?.position}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={r.leaveType}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: r.leaveType === "Sick Leave" ? "rgba(239, 68, 68, 0.08)" : "rgba(99, 102, 241, 0.08)",
                            color: r.leaveType === "Sick Leave" ? "error.main" : "primary.main"
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                        {new Date(r.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })} - {new Date(r.endDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{r.totalDays || 1}</TableCell>
                      <TableCell sx={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "text.secondary", fontWeight: 500 }}>
                        {r.reason}
                      </TableCell>
                      <TableCell sx={{ minWidth: 200 }}>
                        {r.status === "rejected" ? (
                          <Typography variant="caption" color="error.main" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <CancelOutlined sx={{ fontSize: 14 }} /> Request Rejected
                          </Typography>
                        ) : (
                          <Stepper activeStep={getStepperActiveStep(r.status)} alternativeLabel size="small" sx={{ "& .MuiStepLabel-label": { fontSize: "0.6rem", fontWeight: 700 } }}>
                            <Step><StepLabel>Request</StepLabel></Step>
                            <Step><StepLabel>Manager</StepLabel></Step>
                            <Step><StepLabel>HR Final</StepLabel></Step>
                          </Stepper>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            r.status === "approved"
                              ? "HR Approved"
                              : r.status === "rejected"
                              ? "Rejected"
                              : r.status === "manager_approved"
                              ? "Mgmt Approved"
                              : "Pending"
                          }
                          size="small"
                          color={
                            r.status === "approved"
                              ? "success"
                              : r.status === "rejected"
                              ? "error"
                              : r.status === "manager_approved"
                              ? "info"
                              : "warning"
                          }
                          sx={{ fontWeight: 700, fontSize: "0.68rem" }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {(r.status === "pending" && user?.role === "manager") ||
                        ((r.status === "pending" || r.status === "manager_approved") && user?.role === "hr") ? (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setActiveRequest(r);
                              setOpenReviewDialog(true);
                            }}
                            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: "0.75rem", px: 2 }}
                          >
                            Review
                          </Button>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Dialog: Request Leave */}
      <Dialog
        open={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.3rem" }}>Submit Leave Request</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              select
              label="Leave Type"
              size="small"
              fullWidth
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              InputProps={{ sx: { borderRadius: "10px" } }}
            >
              <MenuItem value="Annual Leave">Annual Leave</MenuItem>
              <MenuItem value="Sick Leave">Sick Leave</MenuItem>
              <MenuItem value="Unpaid Leave">Unpaid Leave</MenuItem>
              <MenuItem value="Maternity Leave">Maternity Leave</MenuItem>
              <MenuItem value="Emergency Leave">Emergency Leave</MenuItem>
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
            <TextField
              label="Reason / Remarks"
              size="small"
              multiline
              rows={3}
              fullWidth
              placeholder="Provide context for this leave..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              InputProps={{ sx: { borderRadius: "10px" } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenRequestDialog(false)} color="inherit" sx={{ fontWeight: 600, textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRequest}
            variant="contained"
            disabled={requestLoading}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              boxShadow: "0px 6px 14px rgba(99, 102, 241, 0.3)"
            }}
          >
            {requestLoading ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Leave Review */}
      <Dialog
        open={openReviewDialog}
        onClose={() => setOpenReviewDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.3rem" }}>Review Leave Request</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
              Reviewing request for <b>{activeRequest?.employee?.nameEn}</b>
            </Typography>
            <TextField
              label="Review Remarks"
              size="small"
              multiline
              rows={3}
              fullWidth
              placeholder="Provide comments or conditions..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              InputProps={{ sx: { borderRadius: "10px" } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, justifyContent: "space-between" }}>
          <Button onClick={() => setOpenReviewDialog(false)} color="inherit" sx={{ fontWeight: 600, textTransform: "none" }}>
            Cancel
          </Button>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Close />}
              disabled={reviewLoading}
              onClick={() => handleReview("rejected")}
              sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600 }}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<Check />}
              disabled={reviewLoading}
              onClick={() => handleReview("approved")}
              sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, boxShadow: "0px 4px 12px rgba(16, 185, 129, 0.3)" }}
            >
              Approve
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
