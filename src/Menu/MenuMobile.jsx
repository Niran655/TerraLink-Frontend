import { BusinessOutlined, CategoryOutlined, EventAvailableOutlined, GroupOutlined, Inventory2Outlined, LocalShippingOutlined, PeopleAltOutlined, RestaurantOutlined, SecurityOutlined, StraightenOutlined } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Box, List, ListItem, ListItemButton, ListItemIcon, Stack, Typography } from "@mui/material";
import { BadgePercent, BotMessageSquare, ChartNoAxesColumn, ChevronDown, Currency, FileText, LayoutDashboard, RotateCcw, ShoppingCart, TrendingDown, TrendingUp, Warehouse, Settings } from "lucide-react";
import { useState } from "react";

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

export default function MenuMobile({ onNavigate, showLabels = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
  const { sidebarColor } = useThemeContext();

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
          pageIcon: <EventAvailableOutlined className="icon" />,
        },
        {
          pageTitle: t("admin_attendance") || "Admin Attendance",
          routeTo: "/setting/admin-attendance",
          pageIcon: <EventAvailableOutlined className="icon" />,
        },
        {
          pageTitle: t("attendance_qr") || "Attendance QR",
          routeTo: "/setting/attendance-qr",
          pageIcon: <EventAvailableOutlined className="icon" />,
        },
        {
          pageTitle: t("qr_check_in") || "QR Check In",
          routeTo: "/setting/attendance-qr-scan",
          pageIcon: <EventAvailableOutlined className="icon" />,
        },
      ],
    },
    {
      sectionKey: "settings",
      pageTitle: t("settings") || "Settings",
      pageIcon: <Settings className="icon" />,
      children: [
        {
          pageTitle: t("account_security") || "Account Security",
          routeTo: "/setting/account-security",
          pageIcon: <SecurityOutlined className="icon" />,
        },
        {
          pageTitle: t("active_sessions") || "Active Sessions",
          routeTo: "/setting/active-sessions",
          pageIcon: <SecurityOutlined className="icon" />,
        },
        {
          pageTitle: t("login_history") || "Login History",
          routeTo: "/setting/login-history",
          pageIcon: <SecurityOutlined className="icon" />,
        },
        {
          pageTitle: t("connected_accounts") || "Connected Accounts",
          routeTo: "/setting/social-accounts",
          pageIcon: <SecurityOutlined className="icon" />,
        },
        {
          pageTitle: t("roles_permissions") || "Roles & Permissions",
          routeTo: "/setting/permission",
          pageIcon: <SecurityOutlined className="icon" />,
        },
        {
          pageTitle: t("ai_permissions") || "AI Permissions",
          routeTo: "/setting/ai-permissions",
          pageIcon: <SecurityOutlined className="icon" />,
        },
        {
          pageTitle: t("ai_activity_logs") || "AI Activity Logs",
          routeTo: "/setting/ai-activity-logs",
          pageIcon: <SecurityOutlined className="icon" />,
        },
        {
          pageTitle: t("data_ownership") || "Data Ownership",
          routeTo: "/setting/data-ownership",
          pageIcon: <SecurityOutlined className="icon" />,
        },
        {
          pageTitle: t("export_backup") || "Export & Backup",
          routeTo: "/setting/export-backup",
          pageIcon: <SecurityOutlined className="icon" />,
        },
        {
          pageTitle: t("security_alerts") || "Security Alerts",
          routeTo: "/setting/security-alerts",
          pageIcon: <SecurityOutlined className="icon" />,
        },
        {
          pageTitle: t("api_keys_integrations") || "API Keys & Integrations",
          routeTo: "/setting/api-keys",
          pageIcon: <SecurityOutlined className="icon" />,
        },
        {
          pageTitle: t("privacy_compliance") || "Privacy & Compliance",
          routeTo: "/setting/privacy-compliance",
          pageIcon: <SecurityOutlined className="icon" />,
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
  ];
  
  const visibleMenuData = filterTenantMenuSections(menuData, user);

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
    return paths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
  };

  const handleItemClick = (menu) => {
    if (menu.routeTo === "/chat" || menu.routeTo === "/app/ai") {
      const token = localStorage.getItem("token") || "";
      const shopId = localStorage.getItem("activeShopId") || "";
      const url = `${window.location.origin}/app/ai?token=${encodeURIComponent(token)}&shopId=${encodeURIComponent(shopId)}`;
      window.open(url, "_blank");
    } else if (menu.routeTo) {
      navigate(menu.routeTo);
      if (typeof onNavigate === "function") onNavigate();
    }
  };

  const btnSx = {
    color: textColor,
    borderRadius: "6px",
    px: 1.25,
    py: 0.75,
    minHeight: 36,
    justifyContent: "flex-start",
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
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        width: "100%",
        "&::-webkit-scrollbar": { width: "4px" },
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
        spacing={1.5}
        justifyContent="flex-start"
        sx={{
          px: 2,
          py: 2.3,
          flexShrink: 0,
          borderBottom: `1px solid rgba(255,255,255,0.07)`,
        }}
      >
        <Avatar
          alt="logo"
          src={logo}
          sx={{
            width: 28,
            height: 28,
            borderRadius: 0,
            flexShrink: 0,
          }}
        />
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
      </Stack>

      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <List sx={{ px: 1, pt: 1.5, pb: 0 }}>
          {activeDrilldown && activeSectionData ? (
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
                          color: "inherit"
                        }}
                      >
                        {child.pageIcon || <Box sx={{ width: 16, height: 16 }} />}
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
