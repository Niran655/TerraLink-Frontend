import React, { useState } from "react";
import { Box, Typography, Paper, Stack, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Snackbar, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { KeyRound, Plus, Trash2, RefreshCw, Eye, EyeOff, LineChart, BarChart, AreaChart } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import Chart from "react-apexcharts";

import TableSkeleton from "../include/Loading";

const GET_API_KEYS = gql`
  query GetApiKeys {
    getApiKeys {
      id
      name
      key
      permissions
      lastUsedAt
      active
    }
  }
`;

const CREATE_API_KEY = gql`mutation CreateApiKey($name: String!, $permissions: [String]) { createApiKey(name: $name, permissions: $permissions) { isSuccess } }`;
const REVOKE_API_KEY = gql`mutation RevokeApiKey($id: ID!) { revokeApiKey(id: $id) { isSuccess } }`;
const REGENERATE_API_KEY = gql`mutation RegenerateApiKey($id: ID!) { regenerateApiKey(id: $id) { isSuccess } }`;

export default function APIKeys() {
  const { data, loading, refetch } = useQuery(GET_API_KEYS, { fetchPolicy: "network-only" });
  const [createKey] = useMutation(CREATE_API_KEY);
  const [revokeKey] = useMutation(REVOKE_API_KEY);
  const [regenKey] = useMutation(REGENERATE_API_KEY);

  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [openCreate, setOpenCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showKey, setShowKey] = useState({});
  const [chartType, setChartType] = useState("line");

  const handleCreate = async () => {
    try {
      await createKey({ variables: { name: newKeyName, permissions: ["READ"] } });
      setToast({ open: true, message: "API Key created.", severity: "success" });
      setOpenCreate(false);
      setNewKeyName("");
      refetch();
    } catch (err) {
      setToast({ open: true, message: "Failed to create API key.", severity: "error" });
    }
  };

  const handleRevoke = async (id) => {
    try {
      await revokeKey({ variables: { id } });
      setToast({ open: true, message: "API Key revoked.", severity: "success" });
      refetch();
    } catch (err) {
      setToast({ open: true, message: "Failed to revoke API key.", severity: "error" });
    }
  };

  const handleRegenerate = async (id) => {
    try {
      await regenKey({ variables: { id } });
      setToast({ open: true, message: "API Key regenerated.", severity: "success" });
      refetch();
    } catch (err) {
      setToast({ open: true, message: "Failed to regenerate API key.", severity: "error" });
    }
  };

  const toggleShowKey = (id) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{  color: "#009688" }}>
            <KeyRound size={32} />
          </Box>
          <Box textAlign={"start"}>
            <Typography variant="h4" fontWeight="700" color="text.primary">API Keys & Integrations</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage API keys for external applications to securely access your data.
            </Typography>
          </Box>
        </Stack>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Plus size={18} />}
          onClick={() => setOpenCreate(true)}
 
        >
          Create New Key
        </Button>
      </Stack>

      <Paper  >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Key Name</TableCell>
                <TableCell>API Key</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Last Used</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <TableSkeleton cols={5} rows={3} />
            ) : data?.getApiKeys?.length > 0 ? (
              <TableBody>
                {data.getApiKeys.map((k) => (
                  <TableRow key={k.id} hover>
                    <TableCell><Typography variant="body2" fontWeight="500">{k.name}</Typography></TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>
                          {showKey[k.id] ? k.key : "••••••••••••••••••••••••"}
                        </Typography>
                        <IconButton size="small" onClick={() => toggleShowKey(k.id)}>
                          {showKey[k.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {k.permissions?.map(p => <Chip key={p} label={p} size="small" variant="outlined" sx={{ mr: 0.5 }} />)}
                    </TableCell>
                    <TableCell><Typography variant="body2">{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "Never"}</Typography></TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleRegenerate(k.id)} title="Regenerate">
                        <RefreshCw size={18} />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleRevoke(k.id)} title="Revoke">
                        <Trash2 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No API keys created yet.
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Paper>

      {/* API Key Usage Activity Chart */}
      <Paper sx={{ p: 3, mt: 4, mb: 4, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "background.paper" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Box textAlign="start">
            <Typography variant="subtitle1" fontWeight="700">API Key Usage Overview</Typography>
            <Typography variant="caption" color="text.secondary">
              API requests volume directed from external integration channels (Zapier, Facebook, Custom).
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} sx={{ bgcolor: "action.hover", p: 0.5, borderRadius: 1.5 }}>
            <IconButton size="small" onClick={() => setChartType("line")} color={chartType === "line" ? "primary" : "default"}>
              <LineChart size={16} />
            </IconButton>
            <IconButton size="small" onClick={() => setChartType("bar")} color={chartType === "bar" ? "primary" : "default"}>
              <BarChart size={16} />
            </IconButton>
            <IconButton size="small" onClick={() => setChartType("area")} color={chartType === "area" ? "primary" : "default"}>
              <AreaChart size={16} />
            </IconButton>
          </Stack>
        </Stack>
        <Box sx={{ width: "100%", height: 240 }}>
          <Chart
            options={{
              chart: { id: "api-keys-usage-chart", toolbar: { show: false }, background: "transparent" },
              theme: { mode: "dark" },
              colors: ["#009688"],
              stroke: { curve: "smooth", width: 2.5 },
              xaxis: {
                categories: ["Jun 23", "Jun 24", "Jun 25", "Jun 26", "Jun 27", "Jun 28", "Jun 29"],
                labels: { style: { colors: "#888888" } }
              },
              yaxis: { labels: { style: { colors: "#888888" } } },
              grid: { borderColor: "rgba(255, 255, 255, 0.08)", strokeDashArray: 4 },
              tooltip: { theme: "dark" }
            }}
            series={[
              { name: "Requests Volume", data: [450, 680, 520, 930, 480, 710, 890] }
            ]}
            type={chartType}
            height="100%"
          />
        </Box>
      </Paper>

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New API Key</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>Give your new API key a descriptive name so you can easily identify its purpose.</Typography>
          <TextField fullWidth variant="outlined" label="Key Name (e.g., Zapier Integration)" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenCreate(false)} color="inherit" sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleCreate} color="primary" variant="contained" disabled={!newKeyName} sx={{ textTransform: 'none' }}>Create Key</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}
