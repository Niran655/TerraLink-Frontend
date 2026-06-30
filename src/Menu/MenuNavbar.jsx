import { BusinessOutlined, CategoryOutlined, EventAvailableOutlined, GroupOutlined, Inventory2Outlined, LocalShippingOutlined, PeopleAltOutlined, RestaurantOutlined, SecurityOutlined, StraightenOutlined } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, Stack, Tooltip, Typography, TextField, InputAdornment, Paper, ListItemText, Dialog } from "@mui/material";
// import { BadgePercent, BotMessageSquare, ChartNoAxesColumn, ChevronDown, Currency, FileText, LayoutDashboard, RotateCcw, ShoppingCart, TrendingDown, TrendingUp, Warehouse } from "lucide-react";
// import { Bell, Gift, Image, QrCode, Settings, Smartphone } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import {
  CalendarCheck,
  BadgePercent,
  Bot,
  BotMessageSquare,
  ChartNoAxesColumn,
  ChevronDown,
  Currency,
  FileText,
  LayoutDashboard,
  RotateCcw,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Warehouse,
  Bell,
  Gift,
  Image,
  QrCode,
  Settings,
  Smartphone,
  ShieldCheck,
  UserCog,
  Users,
  History,
  LogIn,
  Link2,
  Database,
  Download,
  KeyRound,
  Lock,
  FileLock,
  Fingerprint,
  Cloud,
  CloudDownload,
  UserCheck,
  Activity,
  Server,
  HardDrive,
  Globe,
  BadgeCheck,
  ScanFace,
  ShieldAlert,
  Network,
  FolderSync,
  Shield,
  Search,
} from "lucide-react";
import logo from "../assets/Image/header-logo.png";
import { useThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import { filterTenantMenuSections } from "../utils/tenantAccess";
import { businessMenuSections } from "./businessMenuData";
import "./menuNavbar.scss";

function getContrastText(hexColor) {
  if (!hexColor || !hexColor.startsWith("#")) return "#ffffff";
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

export default function MenuNavbar({ userPermissions = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
  const { sidebarColor, layoutMode, setLayoutMode } = useThemeContext();

  const isCompact = layoutMode === "compact";
  const isSidebar = layoutMode === "sidebar";

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const menuData = [
    {
      sectionKey: "main",
      pageTitle: t("main"),
      pageIcon: <LayoutDashboard className="icon" />,
      children: [
        {
          pageTitle: t("dashboard"),
          routeTo: "/dashboard",
          pageIcon: <LayoutDashboard className="icon" />,
        },
        {
          pageTitle: t("report"),
          routeTo: "/report",
          pageIcon: <ChartNoAxesColumn className="icon" />,
        },
        {
          pageTitle: "AI Chat",
          routeTo: "/chat",
          pageIcon: <BotMessageSquare className="icon" />,
        },
      ],
    },
    {
      sectionKey: "sales",
      pageTitle: t("sales"),
      pageIcon: <ShoppingCart className="icon" />,
      children: [
        {
          pageTitle: t("orders"),
          routeTo: "/order",
          pageIcon: <ShoppingCart className="icon" />,
          matchPaths: ["/order", "/order/view-order-detail"],
        },
        {
          pageTitle: t("sale"),
          routeTo: "/on-sale",
          pageIcon: <BadgePercent className="icon" />,
        },
        {
          pageTitle: t("period_invoice") || "Invoice",
          routeTo: "/invoice",
          pageIcon: <FileText className="icon" />,
        },
        {
          pageTitle: t("total_sale_return") || "Sales Return",
          routeTo: "/sale-return",
          pageIcon: <RotateCcw className="icon" />,
        },
      ],
    },
    {
      sectionKey: "finance",
      pageTitle: t("finance") || "Finance",
      pageIcon: <TrendingUp className="icon" />,
      children: [
        {
          pageTitle: t("income_report") || "Income",
          routeTo: "/income",
          pageIcon: <TrendingUp className="icon" />,
        },
        {
          pageTitle: t("period_expense") || "Expense",
          routeTo: "/expense",
          pageIcon: <TrendingDown className="icon" />,
        },
      ],
    },
    {
      sectionKey: "inventory",
      pageTitle: t("inventory"),
      pageIcon: <Warehouse className="icon" />,
      children: [
        {
          pageTitle: t("warehouse"),
          routeTo: "/warehouse",
          pageIcon: <Warehouse className="icon" />,
        },
        {
          pageTitle: t("products"),
          routeTo: "/product",
          pageIcon: <Inventory2Outlined className="icon" />,
        },
        {
          pageTitle: t("category"),
          routeTo: "/category",
          pageIcon: <CategoryOutlined className="icon" />,
        },
        {
          pageTitle: t("unit"),
          routeTo: "/unit",
          pageIcon: <StraightenOutlined className="icon" />,
        },
        {
          pageTitle: t("table"),
          routeTo: "/table",
          pageIcon: <RestaurantOutlined className="icon" />,
        },
      ],
    },
    {
      sectionKey: "people",
      pageTitle: t("user") || "User",
      pageIcon: <PeopleAltOutlined className="icon" />,
      children: [
        ...(user?.role === "superAdmin"
          ? [
            {
              pageTitle: t("tenants") || "Tenants",
              routeTo: "/setting/tenant",
              pageIcon: <BusinessOutlined className="icon" />,
            },
          ]
          : []),
        {
          pageTitle: t("user"),
          routeTo: "/user",
          pageIcon: <GroupOutlined className="icon" />,
        },
        {
          pageTitle: t("suppliers"),
          routeTo: "/supplier",
          pageIcon: <LocalShippingOutlined className="icon" />,
        },
        {
          pageTitle: t("customer"),
          routeTo: "/customer",
          pageIcon: <PeopleAltOutlined className="icon" />,
        },
      ],
    },
    {
      sectionKey: "hmr",
      pageTitle: t("hmr"),
      pageIcon: <GroupOutlined className="icon" />,
      children: [
        {
          pageTitle: t("hmr_dashboard") || "HMR Dashboard",
          routeTo: "/setting/hmr-dashboard",
          pageIcon: <LayoutDashboard className="icon" />,
        },
        {
          pageTitle: t("employee"),
          routeTo: "/setting/employee",
          pageIcon: <PeopleAltOutlined className="icon" />,
        },
        {
          pageTitle: t("department"),
          routeTo: "/setting/department",
          pageIcon: <GroupOutlined className="icon" />,
        },
        {
          pageTitle: t("employee_salary"),
          routeTo: "/setting/employee-salary",
          pageIcon: <Currency className="icon" />,
        },
        {
          pageTitle: t("employee_attendance") || "Employee Attendance",
          routeTo: "/setting/employee-attendance",
          pageIcon: <CalendarCheck className="icon" />,
        },
        {
          pageTitle: t("admin_attendance") || "Admin Attendance",
          routeTo: "/setting/admin-attendance",
          pageIcon: <UserCheck className="icon" />,
        },
        {
          pageTitle: t("attendance_qr") || "Attendance QR",
          routeTo: "/setting/attendance-qr",
          pageIcon: <QrCode className="icon" />,
        },
        {
          pageTitle: t("qr_check_in") || "QR Check In",
          routeTo: "/setting/attendance-qr-scan",
          pageIcon: <ScanFace className="icon" />,
        },
        {
          pageTitle: t("hmr_report") || "HMR Report",
          routeTo: "/setting/hmr-report",
          pageIcon: <ChartNoAxesColumn className="icon" />,
        },
      ],
    },
    ...businessMenuSections.map((section) => {
      const SectionIcon = section.icon;

      return {
        sectionKey: section.key,
        pageTitle: t(section.label),
        pageIcon: <SectionIcon className="icon" />,
        children: section.modules.map((module) => {
          const ModuleIcon = module.icon;

          return {
            pageTitle: t(module.label),
            routeTo: module.path,
            pageIcon: <ModuleIcon className="icon" />,
          };
        }),
      };
    }),

    {
      sectionKey: "settings",
      pageTitle: t("settings") || "Settings",
      pageIcon: <Settings className="icon" />,
      children: [
        {
          pageTitle: t("security_center") || "Security Center",
          routeTo: "/setting/security-center",
          pageIcon: <Shield className="icon" />,
          matchPaths: ["/setting/security-center"],
        },
        {
          pageTitle: t("account_security") || "Account Security",
          routeTo: "/setting/account-security",
          pageIcon: <ShieldCheck className="icon" />,
        },
        {
          pageTitle: t("active_sessions") || "Active Sessions",
          routeTo: "/setting/active-sessions",
          pageIcon: <Activity className="icon" />,
        },
        {
          pageTitle: t("login_history") || "Login History",
          routeTo: "/setting/login-history",
          pageIcon: <History className="icon" />,
        },
        {
          pageTitle: t("connected_accounts") || "Connected Accounts",
          routeTo: "/setting/social-accounts",
          pageIcon: <Link2 className="icon" />,
        },
        {
          pageTitle: t("roles_permissions") || "Roles & Permissions",
          routeTo: "/setting/permission",
          pageIcon: <Users className="icon" />,
        },
        {
          pageTitle: t("ai_permissions") || "AI Permissions",
          routeTo: "/setting/ai-permissions",
          pageIcon: <Bot className="icon" />,
        },
        {
          pageTitle: t("ai_activity_logs") || "AI Activity Logs",
          routeTo: "/setting/ai-activity-logs",
          pageIcon: <BotMessageSquare className="icon" />,
        },
        {
          pageTitle: t("data_ownership") || "Data Ownership",
          routeTo: "/setting/data-ownership",
          pageIcon: <Database className="icon" />,
        },
        {
          pageTitle: t("export_backup") || "Export & Backup",
          routeTo: "/setting/export-backup",
          pageIcon: <CloudDownload className="icon" />,
        },
        {
          pageTitle: t("security_alerts") || "Security Alerts",
          routeTo: "/setting/security-alerts",
          pageIcon: <ShieldAlert className="icon" />,
        },
        {
          pageTitle: t("api_keys_integrations") || "API Keys & Integrations",
          routeTo: "/setting/api-keys",
          pageIcon: <KeyRound className="icon" />,
        },
        {
          pageTitle: t("privacy_compliance") || "Privacy & Compliance",
          routeTo: "/setting/privacy-compliance",
          pageIcon: <FileLock className="icon" />,
        },
      ],
    },
  ];
  const visibleMenuData = filterTenantMenuSections(menuData, user, userPermissions);
  const flatMenuData = visibleMenuData.flatMap((section) => section.children);

  const filteredFeatures = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    const list = [];
    visibleMenuData.forEach((section) => {
      section.children.forEach((child) => {
        if (
          child.pageTitle.toLowerCase().includes(q) ||
          (section.pageTitle && section.pageTitle.toLowerCase().includes(q))
        ) {
          list.push({
            title: child.pageTitle,
            route: child.routeTo,
            section: section.pageTitle,
            icon: child.pageIcon
          });
        }
      });
    });
    return list;
  }, [searchQuery, visibleMenuData]);

  // Find which section should be active based on URL
  const initialActiveSection = visibleMenuData.find((section) =>
    section.children.some((child) => {
      const paths = child.matchPaths || [child.routeTo];
      return paths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
    })
  );

  const [activeDrilldown, setActiveDrilldown] = useState(
    initialActiveSection ? initialActiveSection.sectionKey : null
  );

  const textColor = getContrastText(sidebarColor);

  const isActive = (menu) => {
    const paths = menu.matchPaths || [menu.routeTo];
    return paths.some((path) => location.pathname === path);
  };

  const handleItemClick = (menu) => {
    if (menu.routeTo === "/chat" || menu.routeTo === "/app/ai") {
      const token = localStorage.getItem("token") || "";
      const shopId = localStorage.getItem("activeShopId") || "";
      const url = `${window.location.origin}/app/ai?token=${encodeURIComponent(token)}&shopId=${encodeURIComponent(shopId)}`;
      window.open(url, "_blank");
    } else if (menu.routeTo) {
      navigate(menu.routeTo);
    }
  };

  const handleLogoClick = () => {
    if (layoutMode === "default") setLayoutMode("compact");
    else if (layoutMode === "compact") setLayoutMode("sidebar");
    else setLayoutMode("default");
  };

  const itemSx = (active) => ({
    backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
    borderRadius: "6px",
    border: active
      ? "1px solid rgba(255,255,255,0.12)"
      : "1px solid transparent",
    mb: "2px",
    transition: "background-color 0.15s ease, border-color 0.15s ease",
    "&:hover": {
      backgroundColor: active
        ? "rgba(255,255,255,0.1)"
        : "rgba(255,255,255,0.06)",
    },
  });

  const btnSx = {
    color: textColor,
    borderRadius: "6px",
    px: isCompact ? 0 : 1.25,
    py: 0.75,
    minHeight: 36,
    justifyContent: isCompact ? "center" : "flex-start",
  };

  const childItemSx = {
    borderRadius: "6px",
    mb: "2px",
    width: "100%",
    border: "1px solid transparent",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
    },
  };

  const childBtnSx = {
    color: textColor,
    borderRadius: "6px",
    px: 1.25,
    py: 0.75,
    minHeight: 36,
    justifyContent: "flex-start",
  };

  const activeSectionData = visibleMenuData.find(s => s.sectionKey === activeDrilldown);

  return (
    <Box
      sx={{
        backgroundColor: sidebarColor,
        color: textColor,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        width: isSidebar ? "auto" : "100%",
        minWidth: isSidebar ? "80px" : "auto",
        "&::-webkit-scrollbar": { width: isSidebar ? "3px" : "4px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255,255,255,0.18)",
          borderRadius: "2px",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={isCompact ? 0 : 1.5}
        justifyContent={isCompact ? "center" : "flex-start"}
        sx={{
          px: isCompact ? 0 : 2,
          py: 2.3,
          flexShrink: 0,
          borderBottom: `1px solid rgba(255,255,255,0.07)`,
        }}
      >
        <Tooltip title={isCompact ? "Default" : "Compact"} placement="right" arrow>
          <Avatar
            alt="logo"
            src={logo}
            onClick={handleLogoClick}
            sx={{
              width: 28,
              height: 28,
              borderRadius: 0,
              flexShrink: 0,
              cursor: "pointer",
            }}
          />
        </Tooltip>
        {!isCompact && (
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.8125rem",
              color: textColor,
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              opacity: 0.95,
            }}
          >
            TERRALINK
          </Typography>
        )}
      </Stack>

      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {/* Search Input Trigger */}
        {!isCompact && (
          <Box
            onClick={() => setIsSearchOpen(true)}
            sx={{
              cursor: "pointer",
              px: 2,
              pt: 2,
              pb: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: 36,
                borderRadius: 0.5,
                px: 1.5,
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.4)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid transparent",
                transition: "all 0.15s ease",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  backgroundColor: "rgba(255, 255, 255, 0.08)"
                }
              }}
            >
              <Search size={16} style={{ marginRight: 8, color: "rgba(255,255,255,0.5)" }} />
              <span>{t("Find...") || "Find..."}</span>
              <Box sx={{ flexGrow: 1 }} />
              <Box
                sx={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 1,
                  px: 0.6,
                  py: 0.1,
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.4)"
                }}
              >
                Ctrl K
              </Box>
            </Box>
          </Box>
        )}

        {/* Modal Search Dialog */}
        <Dialog
          open={isSearchOpen}
          onClose={() => {
            setIsSearchOpen(false);
            setSearchQuery("");
          }}
          fullWidth
          maxWidth="sm"
          sx={{
            "& .MuiDialog-paper": {
              bgcolor: "#0c0c0e",
              backgroundImage: "none",
              borderRadius: 3,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "white",
              overflow: "hidden"
            },
            "& .MuiBackdrop-root": {
              backdropFilter: "blur(4px)",
              bgcolor: "rgba(0, 0, 0, 0.7)"
            }
          }}
        >
          {/* Search input in dialog */}
          <Box sx={{ p: 2, display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <Search size={20} style={{ color: "rgba(255,255,255,0.5)", marginRight: 12 }} />
            <TextField
              autoFocus
              fullWidth
              variant="standard"
              placeholder="Type a command or search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                disableUnderline: true,
                style: { color: "white", fontSize: "1rem" }
              }}
            />
            <Box
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              sx={{
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 1,
                px: 0.8,
                py: 0.2,
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.4)",
                "&:hover": { color: "white", borderColor: "white" }
              }}
            >
              ESC
            </Box>
          </Box>

          {/* Search results list in dialog */}
          <Box sx={{ maxHeight: 380, overflowY: "auto", p: 1 }}>
            {filteredFeatures.length > 0 ? (
              <List sx={{ p: 0 }}>
                {filteredFeatures.map((feat, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        handleItemClick({ routeTo: feat.route });
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      sx={{
                        borderRadius: 2,
                        py: 1.25,
                        px: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.06)"
                        }
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <ListItemIcon sx={{ minWidth: 0, color: "primary.main", "& svg, & .icon": { width: 18, height: 18 } }}>
                          {feat.icon || <Search size={18} />}
                        </ListItemIcon>
                        <Typography sx={{ color: "white", fontSize: "0.9rem", fontWeight: 600 }}>
                          {feat.title}
                        </Typography>
                      </Stack>
                      <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", fontWeight: 500 }}>
                        {feat.section}
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : searchQuery ? (
              <Box sx={{ p: 4, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                <Typography variant="body2">No results found for "{searchQuery}"</Typography>
              </Box>
            ) : (
              // Default list showing all modules when nothing is typed yet!
              <Box sx={{ p: 1 }}>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)", px: 2, py: 1, display: "block", fontWeight: 600, letterSpacing: "0.05em" }}>
                  ALL NAVIGATION CHANNELS
                </Typography>
                <List sx={{ p: 0 }}>
                  {visibleMenuData.flatMap(section =>
                    section.children.map((child, childIdx) => (
                      <ListItem key={`${section.sectionKey}-${childIdx}`} disablePadding>
                        <ListItemButton
                          onClick={() => {
                            handleItemClick({ routeTo: child.routeTo });
                            setIsSearchOpen(false);
                          }}
                          sx={{
                            borderRadius: 2,
                            py: 1,
                            px: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.06)" }
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <ListItemIcon sx={{ minWidth: 0, color: "rgba(255,255,255,0.4)", "& svg, & .icon": { width: 16, height: 16 } }}>
                              {child.pageIcon || <Search size={16} />}
                            </ListItemIcon>
                            <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem" }}>
                              {child.pageTitle}
                            </Typography>
                          </Stack>
                          <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>
                            {section.pageTitle}
                          </Typography>
                        </ListItemButton>
                      </ListItem>
                    ))
                  )}
                </List>
              </Box>
            )}
          </Box>
        </Dialog>

        <List sx={{ px: 1, pt: 1.5, pb: 0 }}>
          {isCompact ? (
            flatMenuData.map((menu, index) => {
              const active = isActive(menu);
              const menuKey = `compact-${menu.routeTo || menu.pageTitle}-${index}`;
              return (
                <Tooltip key={menuKey} title={menu.pageTitle} placement="right" arrow>
                  <ListItem disablePadding sx={itemSx(active)} onClick={() => handleItemClick(menu)}>
                    <ListItemButton sx={btnSx}>
                      <ListItemIcon
                        sx={{
                          color: active ? textColor : `${textColor}99`,
                          minWidth: 0,
                          mr: 0,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          "& svg, & .icon": { width: 18, height: 18 },
                        }}
                      >
                        {menu.pageIcon}
                      </ListItemIcon>
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              );
            })
          ) : activeDrilldown && activeSectionData ? (
            <>
              {/* Back button for drilldown */}
              <ListItem disablePadding sx={{ mb: 2 }}>
                <ListItemButton
                  onClick={() => setActiveDrilldown(null)}
                  sx={{
                    borderRadius: "6px",
                    px: 1,
                    py: 0.5,
                    color: `${textColor}aa`,
                    "&:hover": { color: textColor, backgroundColor: "rgba(255,255,255,0.06)" }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 1, color: "inherit" }}>
                    <ChevronDown size={18} style={{ transform: "rotate(90deg)" }} />
                  </ListItemIcon>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "inherit" }}>
                    {activeSectionData.pageTitle}
                  </Typography>
                </ListItemButton>
              </ListItem>

              {/* Children of the active section */}
              {activeSectionData.children.map((child) => {
                const active = isActive(child);
                const childKey = `${activeSectionData.sectionKey}-${child.routeTo || child.pageTitle}`;

                return (
                  <ListItem key={childKey} disablePadding sx={childItemSx} onClick={() => handleItemClick(child)}>
                    <ListItemButton sx={{
                      ...childBtnSx,
                      backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
                      color: active ? textColor : `${textColor}d9`,
                      "&:hover": {
                        backgroundColor: active ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
                        color: textColor
                      }
                    }}>
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 1.25,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "inherit",
                          "& svg, & .icon": { width: 18, height: 18 },
                        }}
                      >
                        {child.pageIcon || <Box sx={{ width: 18, height: 18 }} />}
                      </ListItemIcon>
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: active ? 600 : 400,
                          color: "inherit",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: 1.4,
                        }}
                      >
                        {child.pageTitle}
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </>
          ) : (
            /* Root Sections list */
            visibleMenuData.map((section, index) => {
              const sectionKey = `section-${section.sectionKey}-${index}`;
              const sectionActive = section.children.some((child) => isActive(child));

              return (
                <Box key={sectionKey} sx={{ mb: "2px" }}>
                  <ListItem disablePadding sx={{
                    borderRadius: "6px",
                    border: "1px solid transparent",
                    backgroundColor: sectionActive ? "rgba(255,255,255,0.08)" : "transparent",
                    transition: "background-color 0.15s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.06)",
                    }
                  }}>
                    <ListItemButton
                      sx={btnSx}
                      onClick={() => setActiveDrilldown(section.sectionKey)}
                    >
                      <ListItemIcon
                        sx={{
                          color: sectionActive ? textColor : `${textColor}99`,
                          minWidth: 0,
                          mr: 1.25,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          "& svg, & .icon": { width: 18, height: 18 },
                        }}
                      >
                        {section.pageIcon}
                      </ListItemIcon>
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: sectionActive ? 600 : 500,
                          color: sectionActive ? textColor : `${textColor}dd`,
                          flexGrow: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: 1.4,
                        }}
                      >
                        {section.pageTitle}
                      </Typography>
                      <ChevronDown
                        size={16}
                        style={{
                          transform: "rotate(-90deg)", // points right to indicate drilldown
                          color: `${textColor}66`,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Box>
              );
            })
          )}
        </List>
      </Box>
    </Box>
  );
}
