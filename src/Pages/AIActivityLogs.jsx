import React from "react";
import { Box, Typography, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress } from "@mui/material";
import { Activity, BrainCircuit } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

import TableSkeleton from "../include/Loading";

const GET_AI_LOGS = gql`
  query GetAIAuditLogs {
    getAIAuditLogs {
      id
      date
      user
      question
      provider
      modulesAccessed
      status
    }
  }
`;

export default function AIActivityLogs() {
  const { data, loading } = useQuery(GET_AI_LOGS, { fetchPolicy: "network-only" });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Box sx={{  color: "#673AB7" }}>
          <BrainCircuit size={32} />
        </Box>
        <Box sx={{textAlign:"start"}}>
          <Typography variant="h4" fontWeight="700" color="text.primary">AI Activity Logs</Typography>
          <Typography variant="body2" color="text.secondary">
            Complete audit trail of every AI interaction in your workspace.
          </Typography>
        </Box>
      </Stack>

      <Paper >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Prompt / Question</TableCell>
                <TableCell>Modules Accessed</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <TableSkeleton cols={6} rows={3} />
            ) : data?.getAIAuditLogs?.length > 0 ? (
              <TableBody>
                {data.getAIAuditLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell><Typography variant="body2">{new Date(log.date).toLocaleString()}</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight="500">{log.user}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{log.question}</Typography></TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {log.modulesAccessed?.map(m => (
                          <Chip key={m} label={m} size="small" variant="outlined" sx={{ mb: 0.5 }} />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{log.provider}</Typography></TableCell>
                    <TableCell align="right">
                      <Chip label={log.status} size="small" color="success" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No AI activity logs found.
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
