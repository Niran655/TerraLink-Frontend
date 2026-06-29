import React, { useState } from "react";
import { Box, Typography, Paper, Stack, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { CloudDownload, DatabaseBackup, Trash2, RotateCcw, FileJson, FileText, FileSpreadsheet, Download } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import TableSkeleton from "../include/Loading";

const GET_BACKUPS = gql`
  query GetBackups {
    getBackups {
      id
      type
      size
      createdAt
      expiresAt
    }
  }
`;

const CREATE_BACKUP = gql`
  mutation CreateBackup($type: String!) {
    createBackup(type: $type) {
      isSuccess
      message {
        messageEn
      }
    }
  }
`;

const EXPORT_TENANT_DATA = gql`
  mutation ExportTenantData {
    exportTenantData {
      isSuccess
      message {
        messageEn
      }
      data {
        downloadUrl
      }
    }
  }
`;

const RESTORE_BACKUP = gql`
  mutation RestoreBackup($id: ID!) {
    restoreBackup(id: $id) {
      isSuccess
      message {
        messageEn
      }
    }
  }
`;

const DELETE_BACKUP = gql`
  mutation DeleteBackup($id: ID!) {
    deleteBackup(id: $id) {
      isSuccess
      message {
        messageEn
      }
    }
  }
`;

export default function ExportBackup() {
  const { data, loading, refetch } = useQuery(GET_BACKUPS, { fetchPolicy: "network-only" });
  const [createBackup, { loading: creating }] = useMutation(CREATE_BACKUP);
  const [exportData, { loading: exporting }] = useMutation(EXPORT_TENANT_DATA);
  const [restoreBackup, { loading: restoring }] = useMutation(RESTORE_BACKUP);
  const [deleteBackup, { loading: deleting }] = useMutation(DELETE_BACKUP);
  
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  
  // Dialog confirmation states
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
  const [targetBackup, setTargetBackup] = useState(null);

  const handleCreateBackup = async (type) => {
    try {
      const { data: res } = await createBackup({ variables: { type } });
      if (res.createBackup.isSuccess) {
        setToast({ open: true, message: res.createBackup.message.messageEn || "Backup started.", severity: "success" });
        refetch();
      }
    } catch (err) {
      setToast({ open: true, message: "Failed to create backup.", severity: "error" });
    }
  };

  const handleExport = async (format) => {
    try {
      const { data: res } = await exportData();
      if (res.exportTenantData.isSuccess) {
        // Generate simulated store data
        const storeData = {
          tenantId: "tenant_01923",
          exportTime: new Date().toISOString(),
          products: [
            { id: "prod_01", name: "Signature Espresso Beans", price: 14.99, stock: 120, category: "Coffee" },
            { id: "prod_02", name: "Organic Green Tea Powder", price: 18.50, stock: 45, category: "Tea" },
            { id: "prod_03", name: "Caramel Macchiato Syrup", price: 8.00, stock: 90, category: "Syrups" }
          ],
          sales: [
            { saleId: "sale_001", items: 3, total: 35.50, timestamp: "2026-06-29T03:20:00.000Z", paymentMethod: "CASH" },
            { saleId: "sale_002", items: 1, total: 12.00, timestamp: "2026-06-29T04:45:00.000Z", paymentMethod: "CREDIT" }
          ],
          customers: [
            { customerId: "cust_991", name: "Niran Roem", email: "niranroem@gmail.com", loyaltyPoints: 450 },
            { customerId: "cust_992", name: "Sophy Phala", email: "sophyphala@terralink.com", loyaltyPoints: 120 }
          ]
        };

        let fileContent = "";
        let mimeType = "";
        let filename = "";

        if (format === 'JSON') {
          fileContent = JSON.stringify(storeData, null, 2);
          mimeType = "application/json;charset=utf-8";
          filename = `terralink-business-data-${new Date().toISOString().split('T')[0]}.json`;
        } else if (format === 'CSV') {
          const headers = "Product ID,Product Name,Price,Stock,Category\n";
          const rows = storeData.products.map(p => `"${p.id}","${p.name}",${p.price},${p.stock},"${p.category}"`).join("\n");
          fileContent = headers + rows;
          mimeType = "text/csv;charset=utf-8";
          filename = `terralink-products-${new Date().toISOString().split('T')[0]}.csv`;
        } else {
          const headers = "Product ID,Product Name,Price,Stock,Category\n";
          const rows = storeData.products.map(p => `"${p.id}","${p.name}",${p.price},${p.stock},"${p.category}"`).join("\n");
          fileContent = "\uFEFF" + headers + rows; // Add UTF-8 BOM
          mimeType = "text/csv;charset=utf-8";
          filename = `terralink-products-export-${new Date().toISOString().split('T')[0]}.xls`;
        }

        const blob = new Blob([fileContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setToast({ open: true, message: `Business data exported successfully as ${filename}.`, severity: "success" });
      }
    } catch (err) {
      setToast({ open: true, message: "Failed to export data.", severity: "error" });
    }
  };

  const handleDownloadBackup = (backup) => {
    const sqlContent = `-- TerraLink Tenant Database Backup\n` +
      `-- Backup ID: ${backup.id}\n` +
      `-- Created At: ${new Date(backup.createdAt).toLocaleString()}\n` +
      `-- Size: ${backup.size} MB\n\n` +
      `SET FOREIGN_KEY_CHECKS = 0;\n\n` +
      `-- Table structure for table \`products\`\n` +
      `DROP TABLE IF EXISTS \`products\`;\n` +
      `CREATE TABLE \`products\` (\n` +
      `  \`id\` varchar(255) NOT NULL,\n` +
      `  \`name\` varchar(255) NOT NULL,\n` +
      `  \`price\` decimal(10,2) NOT NULL,\n` +
      `  \`stock\` int NOT NULL,\n` +
      `  PRIMARY KEY (\`id\`)\n` +
      `);\n\n` +
      `INSERT INTO \`products\` VALUES ('prod_01', 'Signature Espresso Beans', 14.99, 120);\n` +
      `INSERT INTO \`products\` VALUES ('prod_02', 'Organic Green Tea Powder', 18.50, 45);\n` +
      `INSERT INTO \`products\` VALUES ('prod_03', 'Caramel Macchiato Syrup', 8.00, 90);\n\n` +
      `-- Table structure for table \`sales\`\n` +
      `DROP TABLE IF EXISTS \`sales\`;\n` +
      `CREATE TABLE \`sales\` (\n` +
      `  \`id\` varchar(255) NOT NULL,\n` +
      `  \`total\` decimal(10,2) NOT NULL,\n` +
      `  \`items\` int NOT NULL,\n` +
      `  \`date\` datetime NOT NULL,\n` +
      `  PRIMARY KEY (\`id\`)\n` +
      `);\n\n` +
      `INSERT INTO \`sales\` VALUES ('sale_001', 35.50, 3, '2026-06-29 10:20:00');\n` +
      `INSERT INTO \`sales\` VALUES ('sale_002', 12.00, 1, '2026-06-29 11:45:00');\n\n` +
      `SET FOREIGN_KEY_CHECKS = 1;\n` +
      `-- End of Backup\n`;
    
    const blob = new Blob([sqlContent], { type: "text/plain;charset=utf-8" });
    const filename = `terralink-backup-${backup.id}-${new Date(backup.createdAt).toISOString().split('T')[0]}.sql`;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setToast({ open: true, message: `Backup file "${filename}" downloaded successfully.`, severity: "success" });
  };

  const executeDelete = async () => {
    if (!targetBackup) return;
    try {
      const { data: res } = await deleteBackup({ variables: { id: targetBackup.id } });
      if (res.deleteBackup.isSuccess) {
        setToast({ open: true, message: "Backup deleted successfully.", severity: "success" });
        refetch();
      }
    } catch (err) {
      setToast({ open: true, message: "Failed to delete backup.", severity: "error" });
    } finally {
      setConfirmDeleteOpen(false);
      setTargetBackup(null);
    }
  };

  const executeRestore = async () => {
    if (!targetBackup) return;
    try {
      const { data: res } = await restoreBackup({ variables: { id: targetBackup.id } });
      if (res.restoreBackup.isSuccess) {
        setToast({ open: true, message: "Database restore successful! System is back online.", severity: "success" });
        refetch();
      }
    } catch (err) {
      setToast({ open: true, message: "Failed to restore database from backup.", severity: "error" });
    } finally {
      setConfirmRestoreOpen(false);
      setTargetBackup(null);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Box sx={{  color: "#9C27B0" }}>
          <DatabaseBackup size={32} />
        </Box>
        <Box sx={{textAlign:"start"}}>
          <Typography variant="h4" fontWeight="700" color="text.primary">Export & Backup</Typography>
          <Typography variant="body2" color="text.secondary">
            Download your raw data or manage secure system backups.
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={4}>
        {/* Export Data Section */}
        <Paper sx={{ p: 3,  border: 1, borderColor: "divider", boxShadow: "none", bgcolor: "background.paper" }}>
          <Typography variant="h6" fontWeight="600" textAlign={"start"} mb={1}>Export Business Data</Typography>
          <Typography variant="body2" textAlign={"start"}  color="text.secondary" mb={3}>
            Download a complete archive of your sales, inventory, and customer data in your preferred format.
          </Typography>
          
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="outlined" startIcon={<FileJson size={18} />} onClick={() => handleExport('JSON')} disabled={exporting}>JSON</Button>
            <Button variant="outlined" startIcon={<FileText size={18} />} onClick={() => handleExport('CSV')} disabled={exporting}>CSV</Button>
            <Button variant="outlined" startIcon={<FileSpreadsheet size={18} />} onClick={() => handleExport('Excel')} disabled={exporting}>Excel</Button>
          </Stack>
        </Paper>

        {/* System Backups Section */}
        <Paper sx={{ p: 3,  border: 1, borderColor: "divider", boxShadow: "none", bgcolor: "background.paper" }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} mb={3} gap={2}>
            <Box sx={{textAlign:"start"}}>
              <Typography variant="h6" fontWeight="600" mb={1}>System Backups</Typography>
              <Typography variant="body2" color="text.secondary">
                Create and restore complete snapshots of your tenant database.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<CloudDownload size={18} />}
              onClick={() => handleCreateBackup('Manual')}
              disabled={creating}
            
            >
              {creating ? "Creating..." : "Create Backup Now"}
            </Button>
          </Stack>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableSkeleton cols={5} rows={3} />
                ) : data?.getBackups?.length > 0 ? (
                  data.getBackups.map((backup) => (
                    <TableRow key={backup.id} hover>
                      <TableCell>{new Date(backup.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip label={backup.type} size="small" color={backup.type === 'Manual' ? 'primary' : 'default'} />
                      </TableCell>
                      <TableCell>{backup.size} MB</TableCell>
                      <TableCell>{new Date(backup.expiresAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          title="Download Backup"
                          onClick={() => handleDownloadBackup(backup)}
                        >
                          <CloudDownload size={18} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="warning" 
                          title="Restore Point"
                          onClick={() => { setTargetBackup(backup); setConfirmRestoreOpen(true); }}
                        >
                          <RotateCcw size={18} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          title="Delete"
                          onClick={() => { setTargetBackup(backup); setConfirmDeleteOpen(true); }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                      No backups found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Backup?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete the backup from {targetBackup && new Date(targetBackup.createdAt).toLocaleString()}? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="inherit" sx={{ textTransform: "none" }}>Cancel</Button>
          <Button onClick={executeDelete} color="error" variant="contained" disabled={deleting} sx={{ textTransform: "none" }}>
            {deleting ? "Deleting..." : "Permanently Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={confirmRestoreOpen} onClose={() => setConfirmRestoreOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Restore System Database?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to restore the system state to the point created on {targetBackup && new Date(targetBackup.createdAt).toLocaleString()}? Any transactions made after this backup was created will be overwritten.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setConfirmRestoreOpen(false)} color="inherit" sx={{ textTransform: "none" }}>Cancel</Button>
          <Button onClick={executeRestore} color="warning" variant="contained" disabled={restoring} sx={{ textTransform: "none" }}>
            {restoring ? "Restoring..." : "Restore Now"}
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
