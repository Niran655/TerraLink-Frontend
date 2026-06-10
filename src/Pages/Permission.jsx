import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { RefreshCw, Save } from "lucide-react";

import { SAVE_ROLE_PERMISSIONS } from "../../graphql/mutation";
import { GET_ROLE_PERMISSIONS } from "../../graphql/queries";
import { useAuth } from "../Context/AuthContext";

const roles = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "cashier", label: "Cashier" },
  { value: "stock_controller", label: "Stock Controller" },
];

const modules = [
  { value: "dashboard", label: "Dashboard" },
  { value: "pos", label: "POS" },
  { value: "holdResumeSale", label: "Hold/Resume Sale" },
  { value: "refundReturn", label: "Refund / Return" },
  { value: "products", label: "Products" },
  { value: "categories", label: "Categories" },
  { value: "customers", label: "Customers" },
  { value: "reports", label: "Reports" },
  { value: "settings", label: "Settings" },
];

const actions = ["view", "add", "edit", "delete", "export", "approveVoid"];

const actionLabels = {
  view: "View",
  add: "Add",
  edit: "Edit",
  delete: "Delete",
  export: "Export",
  approveVoid: "Approved/Void",
};

const buildPermissions = () =>
  roles.reduce((roleAcc, role) => {
    roleAcc[role.value] = modules.reduce((moduleAcc, module) => {
      moduleAcc[module.value] = actions.reduce((actionAcc, action) => {
        actionAcc[action] = role.value === "owner" || role.value === "admin";
        return actionAcc;
      }, {});
      return moduleAcc;
    }, {});
    return roleAcc;
  }, {});

const mergeRolePermissions = (rolePermissions = []) => {
  const next = buildPermissions();

  rolePermissions.forEach((rolePermission) => {
    next[rolePermission.role] = {
      ...next[rolePermission.role],
      ...rolePermission.permissions.reduce((moduleAcc, permission) => {
        moduleAcc[permission.module] = {
          ...moduleAcc[permission.module],
          ...permission.actions,
        };
        return moduleAcc;
      }, {}),
    };
  });

  return next;
};

export default function Permission() {
  const theme = useTheme();
  const { setAlert } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedRole, setSelectedRole] = useState("owner");
  const [permissions, setPermissions] = useState(buildPermissions);

  const { data, loading, refetch } = useQuery(GET_ROLE_PERMISSIONS, {
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    },
  });

  useEffect(() => {
    if (data?.getRolePermissions) {
      setPermissions(mergeRolePermissions(data.getRolePermissions));
    }
  }, [data]);

  const [saveRolePermissions, { loading: saving }] = useMutation(
    SAVE_ROLE_PERMISSIONS,
    {
      onCompleted: ({ saveRolePermissions }) => {
        if (saveRolePermissions?.isSuccess) {
          setAlert(true, "success", saveRolePermissions.message);
          refetch();
        } else {
          setAlert(true, "error", saveRolePermissions?.message);
        }
      },
      onError: (error) => {
        setAlert(true, "error", {
          messageEn: error.message,
          messageKh: error.message,
        });
      },
    }
  );

  const togglePermission = (module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [module]: {
          ...prev[selectedRole][module],
          [action]: !prev[selectedRole][module][action],
        },
      },
    }));
  };

  const handleRevertAll = () => {
    refetch();
  };

  const handleSave = () => {
    saveRolePermissions({
      variables: {
        role: selectedRole,
        permissions: modules.map((module) => ({
          module: module.value,
          actions: actions.reduce((acc, action) => {
            acc[action] = Boolean(permissions[selectedRole]?.[module.value]?.[action]);
            return acc;
          }, {}),
        })),
      },
    });
  };

  const selectedRoleLabel =
    roles.find((role) => role.value === selectedRole)?.label || selectedRole;

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            Permissions
          </Typography>
          <Tooltip title="Reload permissions">
            <IconButton
              onClick={handleRevertAll}
              disabled={loading || saving}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                width: 40,
                height: 40,
              }}
            >
              {loading ? <CircularProgress size={18} /> : <RefreshCw size={18} />}
            </IconButton>
          </Tooltip>
        </Stack>

        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
          onClick={handleSave}
          disabled={saving || loading}
          sx={{ alignSelf: { xs: "flex-start", sm: "center" }, px: 2.5, py: 1.2 }}
        >
          Save Changes
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 1,
              minHeight: { md: 496 },
           
            }}
          >
            <Typography variant="h5" fontWeight={800} mb={3}>
              Roles
            </Typography>

            <Stack spacing={1.25}>
              {roles.map((role) => {
                const active = selectedRole === role.value;
                return (
                  <Button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    fullWidth
                    variant="text"
                    sx={{
                      justifyContent: "flex-start",
                      px: 2,
                      py: 1.25,
                      color: active ? "text.primary" : "text.secondary",
                      bgcolor: active
                        ? theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.1)"
                          : "action.selected"
                        : "transparent",
                      fontWeight: active ? 800 : 700,
                      "&:hover": {
                        bgcolor: active ? "action.selected" : "action.hover",
                      },
                    }}
                  >
                    {role.label}
                  </Button>
                );
              })}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.5}
            mb={2}
          >
            <Typography variant="h6" fontWeight={800}>
              Role : {selectedRoleLabel}
            </Typography>

            <Button
              variant="text"
              startIcon={
                <Checkbox
                  checked={false}
                  size="small"
                  tabIndex={-1}
                  disableRipple
                  sx={{ p: 0, color: "text.secondary" }}
                />
              }
              onClick={handleRevertAll}
              disabled={loading || saving}
              sx={{ color: "text.secondary" }}
            >
              Revert All
            </Button>
          </Stack>

          <Paper
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              borderRadius: 1,
         
            }}
          >
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table
                size={isMobile ? "small" : "medium"}
                sx={{
                  minWidth: 920,
                  "& th": {
                    bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "grey.100",
                    fontWeight: 800,
                  },
                  "& th, & td": {
                    borderColor: theme.palette.divider,
                    py: 1.7,
                  },
                  "& td:not(:first-of-type), & th:not(:first-of-type)": {
                    textAlign: "center",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Module</TableCell>
                    {actions.map((action) => (
                      <TableCell key={action}>{actionLabels[action]}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module.value} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{module.label}</TableCell>
                      {actions.map((action) => (
                        <TableCell key={action}>
                          <Checkbox
                            checked={Boolean(permissions[selectedRole]?.[module.value]?.[action])}
                            onChange={() => togglePermission(module.value, action)}
                            disabled={loading || saving}
                            sx={{
                              color: "text.secondary",
                              "&.Mui-checked": {
                                color: theme.palette.primary.main,
                              },
                            }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1.25}
              mt={4}
              pt={3}
              borderTop={`1px solid ${theme.palette.divider}`}
            >
              <Button variant="outlined" onClick={handleRevertAll} disabled={loading || saving}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving || loading}
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
              >
                Save Changes
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
