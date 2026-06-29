import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Stack, Switch, Divider, CircularProgress, Alert, Button, Snackbar } from "@mui/material";
import { ShieldAlert, Save } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

const GET_AI_PERMISSIONS = gql`
  query GetAIPermissions {
    getAIPermissions {
      sales
      orders
      inventory
      customers
      promotions
      attendance
      payroll
      financialStatements
      supplierContracts
      employeePersonalData
      apiKeys
    }
  }
`;

const UPDATE_AI_PERMISSIONS = gql`
  mutation UpdateAIPermissions($input: AIPermissionInput) {
    updateAIPermissions(input: $input) {
      isSuccess
      message {
        messageEn
      }
    }
  }
`;

const permissionGroups = [
  {
    title: "General Business Data",
    description: "Basic data needed for daily operational analysis.",
    keys: ["sales", "orders", "inventory", "customers", "promotions"],
  },
  {
    title: "Employee & HR Data",
    description: "Sensitive employee information and scheduling.",
    keys: ["attendance", "payroll", "employeePersonalData"],
  },
  {
    title: "Financial & Security Data",
    description: "Highly sensitive financial and system access data.",
    keys: ["financialStatements", "supplierContracts", "apiKeys"],
  }
];

const formatLabel = (key) => {
  const labels = {
    sales: "Sales Data",
    orders: "Orders & Transactions",
    inventory: "Inventory & Stock",
    customers: "Customer Information",
    promotions: "Promotions & Marketing",
    attendance: "Employee Attendance",
    payroll: "Payroll & Salary",
    financialStatements: "Financial Statements",
    supplierContracts: "Supplier Contracts",
    employeePersonalData: "Employee Personal Data",
    apiKeys: "System API Keys"
  };
  return labels[key] || key;
};

import { AIPermissionsSkeleton } from "../include/Skeletons";

export default function AIPermissions() {
  const { data, loading, error } = useQuery(GET_AI_PERMISSIONS, { fetchPolicy: "network-only" });
  const [updateAIPermissions, { loading: updating }] = useMutation(UPDATE_AI_PERMISSIONS);
  
  const [permissions, setPermissions] = useState({});
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (data && data.getAIPermissions) {
      const { __typename, ...rest } = data.getAIPermissions;
      setPermissions(rest);
    }
  }, [data]);

  const handleToggle = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      const { data: res } = await updateAIPermissions({ variables: { input: permissions } });
      if (res.updateAIPermissions.isSuccess) {
        setToast({ open: true, message: res.updateAIPermissions.message.messageEn, severity: "success" });
      }
    } catch (err) {
      setToast({ open: true, message: "Failed to update permissions.", severity: "error" });
    }
  };

  if (error) return <Alert severity="error">Failed to load AI Permissions</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{color: "#2E7D32" }}>
            <ShieldAlert size={32} />
          </Box>
          <Box sx={{textAlign:"start"}}>
            <Typography variant="h4" fontWeight="700" color="text.primary">AI Permissions</Typography>
            <Typography variant="body2" color="text.secondary">
              Control exactly what data TerraLink AI models are allowed to analyze.
            </Typography>
          </Box>
        </Stack>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Save size={18} />}
          onClick={handleSave}
          disabled={updating}
         
        >
          {updating ? "Saving..." : "Save Changes"}
        </Button>
      </Stack>

      <Stack spacing={3}>
        {loading ? (
          <AIPermissionsSkeleton />
        ) : (
          permissionGroups.map((group, idx) => (
          <Paper key={idx} sx={{ p: 3, border: 1, borderColor: "divider", boxShadow: "none", bgcolor: "background.paper",textAlign:"start" }}>
            <Typography variant="h6" fontWeight="600" mb={1}>{group.title}</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>{group.description}</Typography>
            
            <Stack divider={<Divider flexItem />} spacing={2}>
              {group.keys.map(key => (
                <Stack key={key} direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2" fontWeight="600">{formatLabel(key)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {permissions[key] ? "AI has access to analyze this data." : "AI is restricted from accessing this data."}
                    </Typography>
                  </Box>
                  <Switch 
                    checked={!!permissions[key]} 
                    onChange={() => handleToggle(key)}
                    color={group.title.includes("Financial") ? "error" : "primary"}
                  />
                </Stack>
              ))}
            </Stack>
          </Paper>
        ))
       )}
      </Stack>

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
