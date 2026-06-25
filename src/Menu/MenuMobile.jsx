import { ExpandLess, ExpandMore } from "@mui/icons-material"; // kept for potential future use
import { useLocation, useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material";
import {
  Bag2,
  Category,
  DocumentText1,
  Messages2,
  Shop,          // for Store page
  Tag,
} from "iconsax-react";
import { useState } from "react";

import { useThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { filterTenantMenuSections } from "../utils/tenantAccess";
import { translateLauguage } from "../function/translate";
import Logo from "../assets/Image/logo.png"
import "./menuNavbar.scss";
import { businessMenuSections } from "./businessMenuData";

export default function MenuMobile({ onNavigate, showLabels }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarColor, layoutMode } = useThemeContext();
  const { user, language } = useAuth();
  const { t } = translateLauguage(language);
  const [settingsOpen, setSettingsOpen] = useState(
    location.pathname.startsWith("/setting")
  );
  const [businessOpen, setBusinessOpen] = useState({
    cms: location.pathname.startsWith("/cms") || location.pathname === "/social-cms",
    crm: location.pathname.startsWith("/crm"),
  });

 
  const labelsVisible =
    typeof showLabels === "boolean" ? showLabels : layoutMode !== "compact";

  const settingGroups = [
    {
      title: "Inventory",
      items: [
        { pageTitle: "Products", routeTo: "/setting/product" },
        { pageTitle: "Category", routeTo: "/setting/category" },
        { pageTitle: "Units", routeTo: "/setting/unit" },
      ],
    },
    {
      title: "People",
      items: [
        ...(user?.role === "superAdmin"
          ? [{ pageTitle: "Tenants", routeTo: "/setting/tenant" }]
          : []),
        { pageTitle: "Users", routeTo: "/setting/user" },
        { pageTitle: "Suppliers", routeTo: "/setting/supplier" },
        { pageTitle: "Customers", routeTo: "/setting/customer" },
        { pageTitle: "Permission", routeTo: "/setting/permission" },
      ],
    },
    {
      title: "Restaurant",
      items: [{ pageTitle: "Tables", routeTo: "/setting/table" }],
    },
    {
      title: "HMR",
      items: [
        { pageTitle: "Employees", routeTo: "/setting/employee" },
        { pageTitle: "Departments", routeTo: "/setting/department" },
        { pageTitle: "Employee Salary", routeTo: "/setting/employee-salary" },
        { pageTitle: "Employee Attendance", routeTo: "/setting/employee-attendance" },
        { pageTitle: "Admin Attendance", routeTo: "/setting/admin-attendance" },
        { pageTitle: "Attendance QR", routeTo: "/setting/attendance-qr" },
        { pageTitle: "QR Check In", routeTo: "/setting/attendance-qr-scan" },
      ],
    },
  ];

 
  const menuData = [
    {
      pageTitle: "Dashboard",
      routeTo: "/dashboard",
      pageIcon: <Category className="icon" />,
    },
    {
      pageTitle: "Store",
      routeTo: "/store",
      pageIcon: <Shop className="icon" />,
    },
    {
      pageTitle: "Order",
      routeTo: "/order",
      pageIcon: <Tag className="icon" />,
      matchPaths: ["/order", "/order/view-order-detail"],
    },
    {
      pageTitle: "Chat",
      routeTo: "/chat",
      pageIcon: <Messages2 className="icon" />,
    },
    {
      pageTitle: "On Sale",
      routeTo: "/on-sale",
      pageIcon: <Bag2 className="icon" />,
    },
    {
      pageTitle: "Reports",
      routeTo: "/report",
      pageIcon: <DocumentText1 className="icon" />,
    },
  ];
  const visibleSettingGroups = filterTenantMenuSections(settingGroups, user);
  const visibleMenuData = filterTenantMenuSections([{ items: menuData }], user)[0]?.items || [];
  const visibleBusinessSections = filterTenantMenuSections(
    businessMenuSections.map((section) => ({
      title: t(section.label),
      key: section.key,
      icon: section.icon,
      items: section.modules.map((module) => ({
        pageTitle: t(module.label),
        routeTo: module.path,
        path: module.path,
      })),
    })),
    user
  );

  const isActive = (menu) => {
    const paths = menu.matchPaths || [menu.routeTo];
    return paths.some((path) => location.pathname === path);
  };

  return (
    <Box
      sx={{
        backgroundColor: sidebarColor,
        color: "white",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{ flex: 1, py: 2 }}
      >
 
        <Stack direction="column" spacing={2} alignItems="center">
          <Avatar
            alt="logo"
            src={Logo}
            sx={{
              width: labelsVisible ? 48 : 40,
              height: labelsVisible ? 48 : 40,
              mt: 1,
            }}
          />

          <List sx={{ width: "100%", px: 0 }}>
            {visibleMenuData.map((menu) => {
              const active = isActive(menu);

              return (
                <ListItem
                  key={menu.pageTitle}
                  disablePadding
                  onClick={() => {
                    if (menu.routeTo === "/chat" || menu.routeTo === "/app/ai") {
                      const token = localStorage.getItem("token") || "";
                      const shopId = localStorage.getItem("activeShopId") || "";
                      const url = `${window.location.origin}/app/ai?token=${encodeURIComponent(token)}&shopId=${encodeURIComponent(shopId)}`;
                      window.open(url, "_blank");
                    } else {
                      navigate(menu.routeTo);
                    }
                    if (typeof onNavigate === "function") onNavigate();
                  }}
                  sx={{
                    backgroundColor: active
                      ? "rgba(255, 255, 255, 0.15)"
                      : "transparent",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: active
                        ? "rgba(255, 255, 255, 0.15)"
                        : "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <ListItemButton
                    sx={{
                      color: "white",
                      justifyContent: labelsVisible ? "flex-start" : "center",
                      px: labelsVisible ? 2 : 0,
                      py: 1,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        display: "flex",
                        justifyContent: "center",
                        mr: labelsVisible ? 2 : 0,
                        color: "inherit",
                      }}
                    >
                      {menu.pageIcon}
                    </ListItemIcon>
                    {labelsVisible && (
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, lineHeight: 1.5 }}
                      >
                        {menu.pageTitle}
                      </Typography>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <List sx={{ width: "100%", px: 0 }}>
            {visibleBusinessSections.map((section) => {
              const SectionIcon = section.icon;
              const sectionActive = section.items.some(
                (item) => location.pathname === item.routeTo
              );
              const isOpen = businessOpen[section.key];

              return (
                <Box key={section.key}>
                  <ListItem
                    disablePadding
                    onClick={() => {
                      if (labelsVisible) {
                        setBusinessOpen((prev) => ({
                          ...prev,
                          [section.key]: !prev[section.key],
                        }));
                      } else if (section.items[0]) {
                        navigate(section.items[0].routeTo);
                        if (typeof onNavigate === "function") onNavigate();
                      }
                    }}
                    sx={{
                      backgroundColor: sectionActive
                        ? "rgba(255, 255, 255, 0.15)"
                        : "transparent",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor: sectionActive
                          ? "rgba(255, 255, 255, 0.15)"
                          : "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <ListItemButton
                      sx={{
                        color: "white",
                        justifyContent: labelsVisible ? "flex-start" : "center",
                        px: labelsVisible ? 2 : 0,
                        py: 1,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          display: "flex",
                          justifyContent: "center",
                          mr: labelsVisible ? 2 : 0,
                          color: "inherit",
                        }}
                      >
                        <SectionIcon className="icon" />
                      </ListItemIcon>
                      {labelsVisible && (
                        <>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, flexGrow: 1 }}
                          >
                            {section.title}
                          </Typography>
                          {isOpen ? <ExpandLess /> : <ExpandMore />}
                        </>
                      )}
                    </ListItemButton>
                  </ListItem>

                  {labelsVisible && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {section.items.map((child) => {
                          const active = location.pathname === child.routeTo;

                          return (
                            <ListItem
                              key={child.routeTo}
                              disablePadding
                              onClick={() => {
                                navigate(child.routeTo);
                                if (typeof onNavigate === "function") onNavigate();
                              }}
                              sx={{
                                backgroundColor: active
                                  ? "rgba(255, 255, 255, 0.15)"
                                  : "transparent",
                                "&:hover": {
                                  backgroundColor: active
                                    ? "rgba(255, 255, 255, 0.15)"
                                    : "rgba(255, 255, 255, 0.1)",
                                },
                              }}
                            >
                              <ListItemButton sx={{ color: "white", pl: 3, py: 0.75 }}>
                                <Box
                                  sx={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: "50%",
                                    bgcolor: active
                                      ? "white"
                                      : "rgba(255,255,255,0.45)",
                                    mr: 1.5,
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: active ? 700 : 400 }}
                                >
                                  {child.pageTitle}
                                </Typography>
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </Box>
              );
            })}
          </List>
        </Stack>
 
        <List sx={{ width: "100%", px: 0 }}>
          <ListItem
            disablePadding
            onClick={() => {
              if (labelsVisible) {
                setSettingsOpen((prev) => !prev);
              } else {
                navigate("/setting");
                if (typeof onNavigate === "function") onNavigate();
              }
            }}
            sx={{
              backgroundColor:
                location.pathname.startsWith("/setting")
                  ? "rgba(255, 255, 255, 0.15)"
                  : "transparent",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor:
                  location.pathname.startsWith("/setting")
                    ? "rgba(255, 255, 255, 0.15)"
                    : "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemButton
              sx={{
                color: "white",
                justifyContent: labelsVisible ? "flex-start" : "center",
                px: labelsVisible ? 2 : 0,
                py: 1,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  display: "flex",
                  justifyContent: "center",
                  mr: labelsVisible ? 2 : 0,
                  color: "inherit",
                }}
              >
                <IoSettingsOutline size={25} className="icon" />
              </ListItemIcon>
              {labelsVisible && (
                <>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, flexGrow: 1 }}
                  >
                    Setting
                  </Typography>
                  {settingsOpen ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>
          </ListItem>
          {labelsVisible && (
            <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {visibleSettingGroups.map((group) => (
                  <Box key={group.title} sx={{ mb: 0.75 }}>
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.65)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        px: 2,
                        py: 0.75,
                      }}
                    >
                      {group.title}
                    </Typography>
                    {group.items.map((child) => {
                      const active = location.pathname === child.routeTo;

                      return (
                        <ListItem
                          key={child.routeTo}
                          disablePadding
                          onClick={() => {
                            navigate(child.routeTo);
                            if (typeof onNavigate === "function") onNavigate();
                          }}
                          sx={{
                            backgroundColor: active
                              ? "rgba(255, 255, 255, 0.15)"
                              : "transparent",
                            "&:hover": {
                              backgroundColor: active
                                ? "rgba(255, 255, 255, 0.15)"
                                : "rgba(255, 255, 255, 0.1)",
                            },
                          }}
                        >
                          <ListItemButton sx={{ color: "white", pl: 3, py: 0.75 }}>
                            <Box
                              sx={{
                                width: 4,
                                height: 4,
                                borderRadius: "50%",
                                bgcolor: active
                                  ? "white"
                                  : "rgba(255,255,255,0.45)",
                                mr: 1.5,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: active ? 700 : 400 }}
                            >
                              {child.pageTitle}
                            </Typography>
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </Box>
                ))}
              </List>
            </Collapse>
          )}
        </List>
      </Stack>
    </Box>
  );
}
