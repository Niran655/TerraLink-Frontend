import React, { useState } from "react";
import { Box, Typography, Paper, Stack, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Snackbar, Alert } from "@mui/material";
import { History, Trash2, Download } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

import TableSkeleton from "../include/Loading";

const GET_LOGIN_HISTORY = gql`
  query GetLoginHistory {
    getLoginHistory {
      id
      date
      device
      browser
      ipAddress
      location
      status
      reason
    }
  }
`;

const CLEAR_LOGIN_HISTORY = gql`
  mutation ClearLoginHistory {
    clearLoginHistory {
      isSuccess
      message {
        messageEn
      }
    }
  }
`;

export default function LoginHistory() {
  const { data, loading, refetch } = useQuery(GET_LOGIN_HISTORY, { fetchPolicy: "network-only" });
  const [clearHistory, { loading: clearing }] = useMutation(CLEAR_LOGIN_HISTORY);
  
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const handleClearHistory = async () => {
    try {
      const { data: res } = await clearHistory();
      if (res.clearLoginHistory.isSuccess) {
        setToast({ open: true, message: res.clearLoginHistory.message.messageEn, severity: "success" });
        refetch();
      }
    } catch (err) {
      setToast({ open: true, message: "Failed to clear history.", severity: "error" });
    }
  };

  const getStatusChip = (status) => {
    if (status === 'SUCCESS') return <Chip label="SUCCESS" size="small" color="success" />;
    if (status === 'SUSPICIOUS') return <Chip label="SUSPICIOUS" size="small" color="warning" />;
    return <Chip label="FAILED" size="small" color="error" />;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{color: "#1976D2" }}>
            <History size={32} />
          </Box>
          <Box sx={{textAlign:"start"}}>
            <Typography variant="h4" fontWeight="700" color="text.primary">Login History</Typography>
            <Typography variant="body2" color="text.secondary">
              Review every login attempt to your TerraLink account.
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<Download size={18} />}
           
          >
            Export Logs
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            startIcon={<Trash2 size={18} />}
            onClick={handleClearHistory}
            disabled={clearing}
           
          >
            {clearing ? "Clearing..." : "Clear History"}
          </Button>
        </Stack>
      </Stack>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Device Info</TableCell>
                <TableCell>Location & IP</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Reason / Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableSkeleton cols={5} rows={5} />
              ) : data?.getLoginHistory?.length > 0 ? (
                data.getLoginHistory.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Typography variant="body2">{new Date(log.date).toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="500">{log.device}</Typography>
                      <Typography variant="caption" color="text.secondary">{log.browser}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.location}</Typography>
                      <Typography variant="caption" color="text.secondary">{log.ipAddress}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {getStatusChip(log.status || (log.reason ? 'FAILED' : 'SUCCESS'))}
                        {log.reason && (
                          <Typography variant="caption" color="error">{log.reason}</Typography>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No login history records found.
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
