import { BusinessOutlined, CategoryOutlined, EventAvailableOutlined, GroupOutlined, Inventory2Outlined, LocalShippingOutlined, PeopleAltOutlined, RestaurantOutlined, SecurityOutlined, StraightenOutlined } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, Stack, Tooltip, Typography } from "@mui/material";
import { BadgePercent, BotMessageSquare, ChartNoAxesColumn, ChevronDown, Currency, FileText, LayoutDashboard, RotateCcw, ShoppingCart, TrendingDown, TrendingUp, Warehouse } from "lucide-react";
import { Bell, Gift, Image, QrCode, Settings, Smartphone } from "lucide-react";
import { useState } from "react";

import logo from "../assets/Image/small-logo.png";
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

export default function MenuNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
  const { sidebarColor, layoutMode, setLayoutMode } = useThemeContext();

  const isCompact = layoutMode === "compact";
  const isSidebar = layoutMode === "sidebar";

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
          routeTo: "/setting/product",
          pageIcon: <Inventory2Outlined className="icon" />,
        },
        {
          pageTitle: t("category"),
          routeTo: "/setting/category",
          pageIcon: <CategoryOutlined className="icon" />,
        },
        {
          pageTitle: t("unit"),
          routeTo: "/setting/unit",
          pageIcon: <StraightenOutlined className="icon" />,
        },
      ],
    },
    {
      sectionKey: "people",
      pageTitle: t("people"),
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
          routeTo: "/setting/user",
          pageIcon: <GroupOutlined className="icon" />,
        },
        {
          pageTitle: t("suppliers"),
          routeTo: "/setting/supplier",
          pageIcon: <LocalShippingOutlined className="icon" />,
        },
        {
          pageTitle: t("customer"),
          routeTo: "/setting/customer",
          pageIcon: <PeopleAltOutlined className="icon" />,
        },
        {
          pageTitle: t("permission"),
          routeTo: "/setting/permission",
          pageIcon: <SecurityOutlined className="icon" />,
        },
      ],
    },
    {
      sectionKey: "restaurant",
      pageTitle: t("restaurant"),
      pageIcon: <RestaurantOutlined className="icon" />,
      children: [
        {
          pageTitle: t("table"),
          routeTo: "/setting/table",
          pageIcon: <RestaurantOutlined className="icon" />,
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
  const flatMenuData = visibleMenuData.flatMap((section) => section.children);
  const [openSections, setOpenSections] = useState(() =>
    visibleMenuData.reduce((acc, section) => {
      const hasActiveChild = section.children.some((child) => {
        const paths = child.matchPaths || [child.routeTo];
        return paths.some((path) => location.pathname === path);
      });

      return { ...acc, [section.sectionKey]: hasActiveChild };
    }, {})
  );

  const textColor = getContrastText(sidebarColor);

  const isActive = (menu) => {
    const paths = menu.matchPaths || [menu.routeTo];
    return paths.some((path) => location.pathname === path);
  };

  const handleItemClick = (menu) => {
    if (menu.routeTo) {
      navigate(menu.routeTo);
    }
  };

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
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

  const sectionSx = (open) => ({
    backgroundColor: open ? "rgba(255,255,255,0.12)" : "transparent",
    borderRadius: "8px",
    border: open ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
    mb: open ? 0.75 : 1,
    transition: "background-color 0.15s ease, border-color 0.15s ease",
    "&:hover": {
      backgroundColor: open ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
    },
  });

  const childItemSx = {
    borderRadius: "6px",
    mb: "2px",
    ml: 1,
    width: "calc(100% - 8px)",
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
    py: 0.6,
    minHeight: 34,
    justifyContent: "flex-start",
  };

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
            LIKA WEB APP SYSTEM
          </Typography>
        )}
      </Stack>

      {/* ── Menu items ──────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <List sx={{ px: 1, pt: 1.5, pb: 0 }}>
          {(isCompact ? flatMenuData : visibleMenuData).map((menu, index) => {
            if (isCompact) {
              const active = isActive(menu);
              const menuKey = `compact-${menu.routeTo || menu.pageTitle}-${index}`;

              const row = (
                <ListItem
                  key={menuKey}
                  disablePadding
                  sx={itemSx(active)}
                  onClick={() => handleItemClick(menu)}
                >
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
              );

              return (
                <Tooltip key={menuKey} title={menu.pageTitle} placement="right" arrow>
                  {row}
                </Tooltip>
              );
            }

            const section = menu;
            const sectionKey = `section-${section.sectionKey}-${index}`;
            const sectionOpen = openSections[section.sectionKey];
            const sectionActive = section.children.some((child) => isActive(child));

            return (
              <Box key={sectionKey} sx={{ mb: 0.75 }}>
                <ListItem disablePadding sx={sectionSx(sectionOpen)}>
                  <ListItemButton sx={btnSx} onClick={() => toggleSection(section.sectionKey)}>
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
                        fontSize: "0.8375rem",
                        fontWeight: sectionActive ? 700 : 600,
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
                        transform: sectionOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.18s ease",
                        color: `${textColor}cc`,
                      }}
                    />
                  </ListItemButton>
                </ListItem>

                <Collapse in={sectionOpen} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ pb: 0.5 }}>
                    {section.children.map((child) => {
                      const active = isActive(child);
                      const childKey = `${section.sectionKey}-${child.routeTo || child.pageTitle}`;

                      return (
                        <ListItem key={childKey} disablePadding sx={childItemSx} onClick={() => handleItemClick(child)}>
                          <ListItemButton sx={childBtnSx}>
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: 1.15,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: "50%",
                                  border: `2px solid ${active ? "#ffb86c" : `${textColor}cc`}`,
                                  backgroundColor: active ? "#ffb86c" : "transparent",
                                }}
                              />
                            </ListItemIcon>
                            <Typography
                              sx={{
                                fontSize: "0.8125rem",
                                fontWeight: active ? 600 : 400,
                                color: active ? "#ffb86c" : `${textColor}d9`,
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
                  </List>
                </Collapse>
              </Box>
            );

          })}
        </List>
      </Box>
 
    </Box>
  );
}
