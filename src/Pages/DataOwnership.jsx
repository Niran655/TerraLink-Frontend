import React, { useState } from "react";
import { Box, Typography, Paper, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, Divider } from "@mui/material";
import { ShieldCheck, Download, Trash2, FileText, AlertTriangle } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const REQUEST_DATA_DELETION = gql`
  mutation RequestDataDeletion($reason: String) {
    requestDataDeletion(reason: $reason) {
      isSuccess
      message {
        messageEn
      }
    }
  }
`;

export default function DataOwnership() {
  const navigate = useNavigate();
  const [requestDeletion, { loading }] = useMutation(REQUEST_DATA_DELETION);
  const [openDialog, setOpenDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const handleDeleteRequest = async () => {
    try {
      const { data } = await requestDeletion({ variables: { reason } });
      if (data.requestDataDeletion.isSuccess) {
        setToast({ open: true, message: data.requestDataDeletion.message.messageEn, severity: "success" });
        setOpenDialog(false);
      }
    } catch (err) {
      setToast({ open: true, message: "Failed to submit deletion request.", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Box sx={{ color: "#1976D2" }}>
          <ShieldCheck size={32} />
        </Box>
        <Box sx={{textAlign:"start"}}>
          <Typography variant="h4" fontWeight="700" color="text.primary">Data Ownership</Typography>
          <Typography variant="body2" color="text.secondary">
            Your business owns all its data. TerraLink acts only as a secure processor.
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3}>
        <Paper sx={{ p: 4, border: 1, borderColor: "divider", boxShadow: "none", textAlign: "center", bgcolor: "background.paper" }}>
          <ShieldCheck size={64} color="#1976D2" style={{ marginBottom: 16 }} />
          <Typography variant="h5" fontWeight="600" mb={2}>Absolute Data Sovereignty</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
            We believe in your fundamental right to data ownership. You have complete control over your business data. 
            You can export it at any time, or request complete and irreversible deletion from our servers.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<Download size={20} />}
              onClick={() => navigate('/setting/export-backup')}
              
            >
              Export All Data
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              size="large"
              startIcon={<Trash2 size={20} />}
              onClick={() => setOpenDialog(true)}
              
            >
              Request Account Deletion
            </Button>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3,   border: 1, borderColor: "divider", boxShadow: "none", bgcolor: "background.paper" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <FileText size={24} color="#555" />
            <Typography variant="h6" fontWeight="600">Legal & Compliance Policies</Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            <Button variant="text" sx={{ justifyContent: "flex-start", color: "text.primary", fontWeight: 500 }} onClick={() => navigate('/setting/privacy-compliance')}>
              View Data Retention Policy
            </Button>
            <Button variant="text" sx={{ justifyContent: "flex-start", color: "text.primary", fontWeight: 500 }} onClick={() => navigate('/setting/privacy-compliance')}>
              View AI Processing Policy
            </Button>
          </Stack>
        </Paper>
      </Stack>

      {/* Deletion Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          <AlertTriangle size={24} />
          Request Data Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={3}>
            This action will notify our security team to permanently delete all your tenant data from TerraLink servers within 30 days. This action cannot be easily undone.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            label="Reason for deletion (Optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit" sx={{ textTransform: "none" }}>Cancel</Button>
          <Button 
            onClick={handleDeleteRequest} 
            color="error" 
            variant="contained" 
            disabled={loading}
            sx={{ textTransform: "none" }}
          >
            {loading ? "Submitting..." : "Confirm Deletion Request"}
          </Button>
        </DialogActions>
      </Dialog>

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
