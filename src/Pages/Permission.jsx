import { useEffect, useState, useMemo } from "react";
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
  Typography,
  useMediaQuery,
  useTheme,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Divider,
  Switch,
  Card,
  Chip,
  FormControlLabel
} from "@mui/material";
import {
  RefreshCw,
  Save,
  ShieldCheck,
  UserCog,
  Users,
  ShoppingCart,
  Warehouse,
  Search,
  Undo2,
  Check,
  AlertCircle,
  LayoutDashboard,
  Megaphone,
  Briefcase,
  UsersRound,
  FileBarChart,
  Settings,
  ChevronDown,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  Plus,
  Trash2,
  Eye,
  Download,
  Key
} from "lucide-react";

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
  { value: "cms", label: "CMS" },
  { value: "crm", label: "CRM" },
  { value: "hr", label: "HR" },
  { value: "inventory", label: "Inventory" },
  { value: "sale", label: "Sale" },
  { value: "finance", label: "Finance" },
  { value: "holdResumeSale", label: "Hold/Resume Sale" },
  { value: "refundReturn", label: "Refund / Return" },
  { value: "products", label: "Products" },
  { value: "categories", label: "Categories" },
  { value: "customers", label: "Customers" },
  { value: "reports", label: "Reports" },
  { value: "settings", label: "Settings" },
];

const roleMetadata = {
  owner: {
    label: "Owner",
    desc: "Full administrative access with complete billing and settings control.",
    icon: ShieldCheck,
    color: "#4CAF50",
    bgColor: "rgba(76, 175, 80, 0.08)"
  },
  admin: {
    label: "Admin",
    desc: "Supervise all tenant operations, employee schedules, and security keys.",
    icon: UserCog,
    color: "#2196F3",
    bgColor: "rgba(33, 150, 243, 0.08)"
  },
  manager: {
    label: "Manager",
    desc: "Oversee daily branch sales, record items, and export reports.",
    icon: Users,
    color: "#9C27B0",
    bgColor: "rgba(156, 39, 176, 0.08)"
  },
  cashier: {
    label: "Cashier",
    desc: "Process custom sales checkout, hold tickets, and register refunds.",
    icon: ShoppingCart,
    color: "#FF9800",
    bgColor: "rgba(255, 152, 0, 0.08)"
  },
  stock_controller: {
    label: "Stock Controller",
    desc: "Adjust warehouse supplies, catalog product details, and categories.",
    icon: Warehouse,
    color: "#00BCD4",
    bgColor: "rgba(0, 188, 212, 0.08)"
  }
};

const moduleGroups = [
  {
    name: "Sales & Checkout Registry",
    desc: "Register checkout, cash flow management, and order adjustments",
    icon: ShoppingCart,
    modules: [
      { value: "pos", label: "Point of Sale (POS)", desc: "Enable barcode sales register and customer checkout", icon: ShoppingCart },
      { value: "holdResumeSale", label: "Hold/Resume Carts", desc: "Allows cashiers to hold shopping sessions and resume later", icon: SlidersHorizontal },
      { value: "refundReturn", label: "Refunds & Returns", desc: "Allows issuing cash refunds and recording returned inventory items", icon: RotateCcw },
      { value: "sale", label: "Sales & Invoices", desc: "View transaction archives, receipt logs, and shift orders", icon: FileBarChart }
    ]
  },
  {
    name: "Products & Stock Management",
    desc: "Catalog items, pricing configurations, and warehouse stock control",
    icon: Warehouse,
    modules: [
      { value: "inventory", label: "Inventory movements", desc: "Adjust stocks, manage warehouse transfers, and view locations", icon: Warehouse },
      { value: "products", label: "Product Database", desc: "Configure barcode listings, pricing grids, and unit rules", icon: Layers },
      { value: "categories", label: "Catalog Categories", desc: "Group items into search categories and departments", icon: Layers }
    ]
  },
  {
    name: "CMS & CRM Relations",
    desc: "Customer data portals, social integrations, and content feeds",
    icon: UsersRound,
    modules: [
      { value: "cms", label: "Content Management (CMS)", desc: "Publish system blogs, store announcements, and social content feeds", icon: Megaphone },
      { value: "crm", label: "Customer Relations (CRM)", desc: "Track customer lead points, loyalty programs, and relationship tracking", icon: UsersRound },
      { value: "customers", label: "Customer Profile Directory", desc: "Add, edit, or search customer loyalty profile details", icon: UsersRound }
    ]
  },
  {
    name: "Administration & Analytics",
    desc: "General site reports, workforce scheduling, and security permissions",
    icon: Settings,
    modules: [
      { value: "dashboard", label: "Dashboard Analytics", desc: "View real-time sales overview charts and summary counters", icon: LayoutDashboard },
      { value: "reports", label: "Reports & Financials", desc: "Generate shift reviews, custom audit summaries, and CSV data exports", icon: FileBarChart },
      { value: "hr", label: "HR & Team Attendance", desc: "Schedule employees, review work logs, and configure salaries", icon: Briefcase },
      { value: "settings", label: "System Preferences", desc: "Configure global shop settings, tenant setups, and security scopes", icon: Settings }
    ]
  }
];

const actions = ["view", "add", "edit", "delete", "export", "approveVoid"];

const actionLabels = {
  view: "View",
  add: "Add",
  edit: "Edit",
  delete: "Delete",
  export: "Export",
  approveVoid: "Void"
};

const actionTooltips = {
  view: "Allowed to access page and view dataset logs",
  add: "Allowed to insert new database entry records",
  edit: "Allowed to update values on existing database lines",
  delete: "Allowed to purge or disable entry logs",
  export: "Allowed to download CSV spreadsheet archives",
  approveVoid: "Allowed to authorize void checks or special managers overrides"
};

const actionIcons = {
  view: <Eye size={14} />,
  add: <Plus size={14} />,
  edit: <Save size={14} />,
  delete: <Trash2 size={14} />,
  export: <Download size={14} />,
  approveVoid: <Key size={14} />
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
  const [pristinePermissions, setPristinePermissions] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState(
    moduleGroups.reduce((acc, group) => {
      acc[group.name] = true;
      return acc;
    }, {})
  );

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
      const merged = mergeRolePermissions(data.getRolePermissions);
      setPermissions(merged);
      setPristinePermissions(JSON.parse(JSON.stringify(merged)));
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

  const togglePermission = (moduleValue, action) => {
    if (selectedRole === "owner") return; // Bypassed/Read-only representation for owner
    setPermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [moduleValue]: {
          ...prev[selectedRole][moduleValue],
          [action]: !prev[selectedRole][moduleValue][action],
        },
      },
    }));
  };

  const handleRevertAll = () => {
    if (pristinePermissions) {
      setPermissions(JSON.parse(JSON.stringify(pristinePermissions)));
      setAlert(true, "info", {
        messageEn: "Changes reverted to last saved state",
        messageKh: "ការផ្លាស់ប្តូរត្រូវបានត្រឡប់ទៅសភាពដើមវិញ"
      });
    }
  };

  const handleSave = () => {
    const flatModules = moduleGroups.flatMap(group => group.modules);
    saveRolePermissions({
      variables: {
        role: selectedRole,
        permissions: flatModules.map((module) => ({
          module: module.value,
          actions: actions.reduce((acc, action) => {
            acc[action] = Boolean(permissions[selectedRole]?.[module.value]?.[action]);
            return acc;
          }, {}),
        })),
      },
    });
  };

  const setModulePreset = (moduleValue, presetType) => {
    if (selectedRole === "owner") return;
    setPermissions(prev => {
      const nextRole = { ...prev[selectedRole] };
      const nextActions = { ...nextRole[moduleValue] };

      actions.forEach(action => {
        if (presetType === "full") {
          nextActions[action] = true;
        } else if (presetType === "readonly") {
          nextActions[action] = action === "view";
        } else {
          nextActions[action] = false;
        }
      });

      return {
        ...prev,
        [selectedRole]: {
          ...nextRole,
          [moduleValue]: nextActions
        }
      };
    });
  };

  const setAllModulesPreset = (presetType) => {
    if (selectedRole === "owner") return;
    setPermissions(prev => {
      const nextRole = { ...prev[selectedRole] };

      Object.keys(nextRole).forEach(mod => {
        const nextActions = { ...nextRole[mod] };
        actions.forEach(action => {
          if (presetType === "full") {
            nextActions[action] = true;
          } else if (presetType === "readonly") {
            nextActions[action] = action === "view";
          } else {
            nextActions[action] = false;
          }
        });
        nextRole[mod] = nextActions;
      });

      return {
        ...prev,
        [selectedRole]: nextRole
      };
    });
  };

  const hasUnsavedChanges = useMemo(() => {
    if (!pristinePermissions || !permissions) return false;
    return JSON.stringify(permissions[selectedRole]) !== JSON.stringify(pristinePermissions[selectedRole]);
  }, [permissions, pristinePermissions, selectedRole]);

  const isModuleEdited = (moduleValue) => {
    if (!pristinePermissions || !permissions) return false;
    return JSON.stringify(permissions[selectedRole]?.[moduleValue]) !==
      JSON.stringify(pristinePermissions[selectedRole]?.[moduleValue]);
  };

  const selectedRoleMetadata = roleMetadata[selectedRole] || {
    label: selectedRole,
    desc: "",
    icon: ShieldCheck,
    color: theme.palette.primary.main,
    bgColor: "action.hover"
  };

  const RoleIcon = selectedRoleMetadata.icon;

  const toggleAccordion = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  return (
    <Box sx={{ width: "100%", pb: hasUnsavedChanges ? 12 : 4 }}>
      {/* Top Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "transparent",
          border: "1px solid",
          borderColor: "divider",
          background: theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(0, 0, 0, 0) 100%)"
            : "linear-gradient(135deg, rgba(33, 150, 243, 0.02) 0%, rgba(0, 0, 0, 0) 100%)",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
          <Box textAlign="start">
            <Typography variant="h4" fontWeight={900} letterSpacing="-0.5px">
              Roles & Access Control
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Configure feature visibilities and action authorizations for each team category in the tenant workspace.
            </Typography>
          </Box>
          <Tooltip title="Reload permissions database">
            <IconButton
              onClick={() => refetch()}
              disabled={loading || saving}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "transparent",
                width: 44,
                height: 44,
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease",
                "&:hover": { transform: "rotate(180deg)" }
              }}
            >
              {loading ? <CircularProgress size={20} /> : <RefreshCw size={20} />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>

      <Grid container spacing={4}>

        <Grid size={{ xs: 12, md: 4, lg: 3.5 }}>
          <Box sx={{ position: "sticky", top: "96px", zIndex: 5 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1" fontWeight={850} color="text.primary" textAlign="start">
                System Roles
              </Typography>
              {roles.map((role) => {
                const isActive = selectedRole === role.value;
                const meta = roleMetadata[role.value] || { label: role.label, desc: "", icon: ShieldCheck, color: "#9e9e9e" };
                const CardIcon = meta.icon;

                return (
                  <Card
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    sx={{
                      p: 2.5,
                      cursor: "pointer",

                      border: "1px solid",
                      borderColor: isActive ? meta.color : "divider",
                      bgcolor: isActive ? meta.bgColor : "transparent",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: isActive ? "translateY(-2px)" : "none",
                      boxShadow: isActive
                        ? `0 6px 20px -5px ${meta.color}33`
                        : "none",
                      "&:hover": {
                        borderColor: isActive ? meta.color : theme.palette.text.disabled,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      }
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start" textAlign="start">
                      <Box
                        sx={{
                          p: 1.25,

                          color: meta.color,

                        }}
                      >
                        <CardIcon size={22} />
                      </Box>
                      <Box flex={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                            {meta.label}
                          </Typography>
                          {role.value === "owner" && (
                            <Chip label="Bypassed" size="small" color="success" variant="outlined" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700 }} />
                          )}
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5, lineHeight: 1.3 }}>
                          {meta.desc}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                );
              })}
            </Stack>
          </Box>
        </Grid>

        {/* Right Role Details and Grid */}
        <Grid size={{ xs: 12, md: 8, lg: 8.5 }}>
          {/* Preset Toolbars & Search */}
          <Typography variant="subtitle1" fontWeight={850} color="text.primary" textAlign="start" mb={1.5}>
            Permissions Settings
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "transparent"
            }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2} textAlign="start">
                <Box
                  sx={{
                    p: 1.2,
                    color: selectedRoleMetadata.color
                  }}
                >
                  <RoleIcon size={24} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={850}>
                    {selectedRoleMetadata.label} Scope
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Review and configure modules visibility for role.
                  </Typography>
                </Box>
              </Stack>

              {selectedRole !== "owner" && (
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    startIcon={<Check size={14} />}
                    onClick={() => setAllModulesPreset("full")}
                    sx={{ textTransform: "none", fontWeight: 700 }}
                  >
                    Full Access
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="inherit"
                    startIcon={<Eye size={14} />}
                    onClick={() => setAllModulesPreset("readonly")}
                    sx={{ textTransform: "none", fontWeight: 700, borderColor: "divider" }}
                  >
                    Read-Only
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<Trash2 size={14} />}
                    onClick={() => setAllModulesPreset("deny")}
                    sx={{ textTransform: "none", fontWeight: 700 }}
                  >
                    Deny All
                  </Button>
                </Stack>
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <TextField
              fullWidth
              size="small"
              placeholder="Search sections or specific action modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} style={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "action.hover",
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "divider" },
                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                }
              }}
            />
          </Paper>

          {/* Action Column Tooltips Info */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,

              border: "1px solid",
              borderColor: "divider",
              bgcolor: "action.hover"
            }}
          >
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                LEGEND / ACTION PERMISSIONS:
              </Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {actions.map((act) => (
                  <Tooltip key={act} title={actionTooltips[act]} arrow placement="top">
                    <Chip
                      icon={actionIcons[act]}
                      label={actionLabels[act]}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        borderColor: "divider",
                        bgcolor: "transparent",
                        px: 1,
                        borderRadius: 0.5,
                        cursor: "help"
                      }}
                    />
                  </Tooltip>
                ))}
              </Stack>
            </Stack>
          </Paper>

          {/* Accordion List */}
          <Stack spacing={2}>
            {moduleGroups.map((group) => {
              // Filter modules based on search query
              const filteredModulesInGroup = group.modules.filter((m) =>
                m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.desc.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredModulesInGroup.length === 0) return null;

              const GroupIcon = group.icon;
              const isExpanded = expandedGroups[group.name] !== false;

              return (
                <Accordion
                  key={group.name}
                  expanded={isExpanded}
                  onChange={() => toggleAccordion(group.name)}
                  elevation={0}
                  disableGutters
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    bgcolor: "transparent",
                    background: "none",
                    "&:before": { display: "none" },
                    mb: 1
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ChevronDown size={18} />}
                    sx={{
                      bgcolor: "transparent",
                      borderBottom: isExpanded ? "1px solid" : "none",
                      borderColor: "divider",
                      py: 1
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" textAlign="start">
                      <Box sx={{ p: 1, borderRadius: 1, bgcolor: "action.hover", color: "primary.main" }}>
                        <GroupIcon size={18} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={850}>
                          {group.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {group.desc}
                        </Typography>
                      </Box>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <Stack divider={<Divider />}>
                      {filteredModulesInGroup.map((module) => {
                        const isEdited = isModuleEdited(module.value);
                        const ModuleRowIcon = module.icon;

                        return (
                          <Box
                            key={module.value}
                            sx={{
                              p: 3,
                              bgcolor: isEdited ? "rgba(255, 152, 0, 0.03)" : "transparent",
                              transition: "background-color 0.2s ease"
                            }}
                          >
                            <Grid container spacing={2} alignItems="center">
                              {/* Left Info Column */}
                              <Grid size={{ xs: 12, lg: 4.5 }} textAlign="start">
                                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                  <Box sx={{ p: 0.75, mt: 0.25, borderRadius: 0.75, bgcolor: "action.selected", color: "text.secondary" }}>
                                    <ModuleRowIcon size={16} />
                                  </Box>
                                  <Box>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Typography variant="body2" fontWeight={800}>
                                        {module.label}
                                      </Typography>
                                      {isEdited && (
                                        <Chip
                                          label="Edited"
                                          size="small"
                                          color="warning"
                                          sx={{ height: 16, fontSize: "0.6rem", fontWeight: 700 }}
                                        />
                                      )}
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5, lineHeight: 1.25 }}>
                                      {module.desc}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Grid>

                              {/* Action Switch Grid */}
                              <Grid size={{ xs: 12, lg: 7.5 }}>
                                <Stack direction="row" justifyContent={{ xs: "flex-start", lg: "flex-end" }} alignItems="center" spacing={1.5} flexWrap="wrap" useFlexGap>
                                  {/* Row Quick Presets */}
                                  {selectedRole !== "owner" && (
                                    <Stack direction="row" spacing={0.5} sx={{ borderRight: "1px solid", borderColor: "divider", pr: 1.5 }}>
                                      <Tooltip title="Preset: grant view-only">
                                        <Button
                                          size="small"
                                          variant="text"
                                          onClick={() => setModulePreset(module.value, "readonly")}
                                          sx={{ minWidth: 0, px: 1, py: 0.5, fontSize: "0.65rem", fontWeight: 700 }}
                                        >
                                          Read
                                        </Button>
                                      </Tooltip>
                                      <Tooltip title="Preset: grant all actions">
                                        <Button
                                          size="small"
                                          variant="text"
                                          onClick={() => setModulePreset(module.value, "full")}
                                          sx={{ minWidth: 0, px: 1, py: 0.5, fontSize: "0.65rem", fontWeight: 700 }}
                                        >
                                          Full
                                        </Button>
                                      </Tooltip>
                                    </Stack>
                                  )}

                                  {/* Action Checks */}
                                  {actions.map((action) => {
                                    const isChecked = Boolean(permissions[selectedRole]?.[module.value]?.[action]);

                                    return (
                                      <Tooltip key={action} title={`${actionLabels[action]}: ${actionTooltips[action]}`} arrow>
                                        <FormControlLabel
                                          control={
                                            selectedRole === "owner" ? (
                                              <Checkbox checked={true} disabled size="small" color="success" />
                                            ) : (
                                              <Switch
                                                size="small"
                                                checked={isChecked}
                                                onChange={() => togglePermission(module.value, action)}
                                                disabled={loading || saving}
                                              />
                                            )
                                          }
                                          label={
                                            <Typography variant="caption" fontWeight={700} color={isChecked ? "text.primary" : "text.secondary"}>
                                              {actionLabels[action]}
                                            </Typography>
                                          }
                                          sx={{
                                            m: 0,
                                            mr: 1,
                                            "& .MuiFormControlLabel-label": { ml: 0.5 }
                                          }}
                                        />
                                      </Tooltip>
                                    );
                                  })}
                                </Stack>
                              </Grid>
                            </Grid>
                          </Box>
                        );
                      })}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        </Grid>
      </Grid>

      {/* Floating Save Banner */}
      {hasUnsavedChanges && (
        <Paper
          elevation={10}
          sx={{
            position: "fixed",
            bottom: 24,
            left: { xs: 16, md: "calc(250px + 24px)" },
            right: 16,
            p: 2,

            bgcolor: "rgba(30, 30, 40, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid",
            borderColor: "warning.main",
            zIndex: 1000,
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)",
            transition: "all 0.3s ease"
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1.5} textAlign="start">
              <Box
                sx={{
                  p: 1,


                  color: "white"
                }}
              >
                <AlertCircle size={20} />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={850}>
                  Unsaved Changes Detected
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  You modified permissions for role: <strong>{selectedRoleMetadata.label}</strong>.
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.5} width={{ xs: "100%", sm: "auto" }} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Undo2 size={16} />}
                onClick={handleRevertAll}
                disabled={saving || loading}
                sx={{ textTransform: "none", fontWeight: 700, borderColor: "divider" }}
              >
                Discard
              </Button>
              <Button
                variant="contained"
                color="warning"
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save size={16} />}
                onClick={handleSave}
                disabled={saving || loading}
                sx={{ textTransform: "none", fontWeight: 850, px: 3 }}
              >
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
