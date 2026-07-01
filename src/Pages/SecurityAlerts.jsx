import React, { useState } from "react";
import { Box, Typography, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, CircularProgress } from "@mui/material";
import { Bell, CheckCircle } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

import TableSkeleton from "../include/Loading";

const GET_ALERTS = gql`
  query GetSecurityAlerts {
    getSecurityAlerts {
      id
      type
      severity
      message
      read
      createdAt
    }
  }
`;

const MARK_READ = gql`
  mutation MarkAlertRead($id: ID!) {
    markAlertRead(id: $id) {
      isSuccess
    }
  }
`;

export default function SecurityAlerts() {
  const { data, loading, refetch } = useQuery(GET_ALERTS, { fetchPolicy: "network-only" });
  const [markRead] = useMutation(MARK_READ);

  const handleMarkRead = async (id) => {
    try {
      await markRead({ variables: { id } });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const getSeverityChip = (sev) => {
    if (sev === "CRITICAL" || sev === "HIGH") return <Chip label={sev} size="small" color="error" />;
    if (sev === "MEDIUM") return <Chip label={sev} size="small" color="warning" />;
    return <Chip label={sev} size="small" color="info" />;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Box sx={{   color: "#F44336" }}>
          <Bell size={32} />
        </Box>
        <Box textAlign={"start"}>
          <Typography variant="h4" fontWeight="700" color="text.primary">Security Alerts</Typography>
          <Typography variant="body2" textAlign={"start"} color="text.secondary">
            Important system notifications and security events.
          </Typography>
        </Box>
      </Stack>

      <Paper >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Message</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <TableSkeleton cols={5} rows={3} />
            ) : data?.getSecurityAlerts?.length > 0 ? (
              <TableBody>
                {data.getSecurityAlerts.map((alert) => (
                  <TableRow key={alert.id} hover sx={{ opacity: alert.read ? 0.6 : 1, bgcolor: !alert.read ? "action.hover" : "inherit" }}>
                    <TableCell><Typography variant="body2">{new Date(alert.createdAt).toLocaleString()}</Typography></TableCell>
                    <TableCell>{getSeverityChip(alert.severity)}</TableCell>
                    <TableCell><Typography variant="body2" fontWeight="500">{alert.type.replace(/_/g, " ")}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{alert.message}</Typography></TableCell>
                    <TableCell align="right">
                      {!alert.read && (
                        <IconButton size="small" color="primary" onClick={() => handleMarkRead(alert.id)} title="Mark as read">
                          <CheckCircle size={20} />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No security alerts found.
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
