import React, { useState } from "react";
import { Box, Typography, Paper, Stack, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Snackbar, Alert, CircularProgress } from "@mui/material";
import { MonitorPlay, Smartphone, Laptop, LogOut, ShieldAlert } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

const GET_ACTIVE_SESSIONS = gql`
  query GetActiveSessions {
    getActiveSessions {
      id
      device
      browser
      os
      ipAddress
      location
      lastActive
      active
      current
    }
  }
`;

const LOGOUT_ALL_SESSIONS = gql`
  mutation LogoutAllSessions {
    logoutAllSessions {
      isSuccess
      message {
        messageEn
      }
    }
  }
`;

const REVOKE_SESSION = gql`
  mutation RevokeSession($id: ID!) {
    revokeSession(id: $id) {
      isSuccess
      message {
        messageEn
      }
    }
  }
`;

import TableSkeleton from "../include/Loading";

export default function ActiveSessions() {
  const { data, loading, refetch } = useQuery(GET_ACTIVE_SESSIONS, { fetchPolicy: "network-only" });
  const [logoutAll, { loading: loggingOutAll }] = useMutation(LOGOUT_ALL_SESSIONS);
  const [revokeSession] = useMutation(REVOKE_SESSION);
  
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const handleLogoutAll = async () => {
    try {
      const { data: res } = await logoutAll();
      if (res.logoutAllSessions.isSuccess) {
        setToast({ open: true, message: res.logoutAllSessions.message.messageEn, severity: "success" });
        refetch();
      }
    } catch (err) {
      setToast({ open: true, message: "Failed to logout all sessions.", severity: "error" });
    }
  };

  const handleRevoke = async (id) => {
    try {
      const { data: res } = await revokeSession({ variables: { id } });
      if (res.revokeSession.isSuccess) {
        setToast({ open: true, message: res.revokeSession.message.messageEn, severity: "success" });
        refetch();
      }
    } catch (err) {
      setToast({ open: true, message: "Failed to revoke session.", severity: "error" });
    }
  };

  const getDeviceIcon = (device) => {
    const d = device?.toLowerCase() || "";
    if (d.includes("mobile") || d.includes("iphone") || d.includes("android")) return <Smartphone size={24} color="#555" />;
    if (d.includes("mac") || d.includes("windows") || d.includes("linux")) return <Laptop size={24} color="#555" />;
    return <MonitorPlay size={24} color="#555" />;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ color: "#FF9800" }}>
            <MonitorPlay size={32} />
          </Box>
          <Box sx={{textAlign:"start"}}>
            <Typography variant="h4" fontWeight="700" color="text.primary">Active Sessions</Typography>
            <Typography variant="body2" color="text.secondary">
              Review where your account is currently logged in and secure your access.
            </Typography>
          </Box>
        </Stack>
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<ShieldAlert size={18} />}
          onClick={handleLogoutAll}
          disabled={loggingOutAll}
           
        >
          {loggingOutAll ? "Logging out..." : "Log Out All Devices"}
        </Button>
      </Stack>

      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Device</TableCell>
                <TableCell>Location & IP</TableCell>
                <TableCell>Last Activity</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableSkeleton cols={4} rows={3} />
              ) : data?.getActiveSessions?.length > 0 ? (
                data.getActiveSessions.map((session) => (
                  <TableRow key={session.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        {getDeviceIcon(session.device)}
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {session.device} • {session.os}
                            {session.current && (
                              <Chip label="Current Session" size="small" color="success" sx={{ ml: 1, height: 20, fontSize: '0.65rem' }} />
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{session.browser}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{session.location}</Typography>
                      <Typography variant="caption" color="text.secondary">{session.ipAddress}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{new Date(session.lastActive).toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {!session.current && (
                        <Button 
                          size="small" 
                          color="error" 
                          startIcon={<LogOut size={16} />}
                          onClick={() => handleRevoke(session.id)}
                          sx={{ textTransform: "none", fontWeight: 600 }}
                        >
                          Log Out
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No active sessions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
