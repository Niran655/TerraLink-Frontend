import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import {
  BusinessOutlined,
  CategoryOutlined,
  GroupOutlined,
  Inventory2Outlined,
  LocalShippingOutlined,
  PeopleAltOutlined,
  RestaurantOutlined,
  SecurityOutlined,
  StraightenOutlined,
} from "@mui/icons-material";
import {
  ExternalLink,
  LayoutDashboard,
  Shrink,
  Store,
  ChevronsUpDown,
  BadgePercent,
  BotMessageSquare,
  ChartNoAxesColumn,
  FileText,
  RotateCcw,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Warehouse,
  Search,
  X,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  MenuItem,
  Menu as MuiMenu,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  InputBase,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import CambodiaFlag from "../assets/Image/cambodiaflag.png";
import EnglishFlag from "../assets/Image/englishflag.png";
import logo from "../assets/Image/small-logo.png";
import { useThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import Menu from "./menu/Menu";
import { MenuMobile, MenuNavbar } from "../Menu";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { GET_ALL_SHOP, GET_OPEN_SHIFT, GET_MY_PERMISSIONS } from "../../graphql/queries";
import {
  canAccessShop,
  filterTenantMenuSections,
} from "../utils/tenantAccess";
import { businessMenuSections } from "../Menu/businessMenuData";

export default function AppLayout() {
  const {
    sidebarColor,
    topbarColor,
    layoutMode,
    mobileDrawerWidth,
    mobileShowLabels,
  } = useThemeContext();
  const { logout, language, changeLanguage, quickAlert, setAlert, user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = translateLauguage(language);
  const id = localStorage.getItem("activeShopId");
  const [activeTab, setActiveTab] = useState("orders");
  const isPosPage = location.pathname.startsWith("/store/pos/");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [storeMenuAnchor, setStoreMenuAnchor] = useState(null);
  const [horizontalMenuPosition, setHorizontalMenuPosition] = useState(null);
  const [activeHorizontalSection, setActiveHorizontalSection] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);


  const isTopNav = layoutMode === "top";
  const isCompact = layoutMode === "compact";


  const sidebarWidth = isTopNav ? 0 : isCompact ? 75 : 250;

  useEffect(() => {
    if (isPosPage) {
      const path = location.pathname;
      if (path.includes("/pos/")) setActiveTab("pos");
      else if (path.includes("/orders/")) setActiveTab("orders");
      else if (path.includes("/kitchen/")) setActiveTab("kitchen");
      else if (path.includes("/reservation/")) setActiveTab("reservation");
      else if (path.includes("/table/")) setActiveTab("table");
    }
  }, [location, isPosPage]);

  const [selectedFlag, setSelectedFlag] = useState(
    language === "kh" ? CambodiaFlag : EnglishFlag
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    language === "kh" ? "ភាសាខ្មែរ" : "English"
  );

  const { data: shopData, loading: shopLoading } = useQuery(GET_ALL_SHOP, {
    variables: { id: user?._id || "" },
    fetchPolicy: "cache-and-network",
  });
  const [checkOpenShift] = useLazyQuery(GET_OPEN_SHIFT);

  const { data: permissionData } = useQuery(GET_MY_PERMISSIONS, {
    skip: !user,
    fetchPolicy: "cache-and-network",
  });

  const userPermissions = useMemo(() => {
    return permissionData?.getMyPermissions?.permissions || [];
  }, [permissionData]);

  const stores = useMemo(
    () => (shopData?.getAllShops || []).filter((shop) => canAccessShop(user, shop?._id)),
    [shopData, user]
  );

  useEffect(() => {
    if (!isPosPage || !id || stores.length === 0) return;
    if (!canAccessShop(user, id)) {
      localStorage.removeItem("activeShopId");
      quickAlert("error", "You do not have access to this shop", "អ្នកមិនមានសិទ្ធិចូលហាងនេះទេ");
      navigate("/store", { replace: true });
    }
  }, [id, isPosPage, navigate, quickAlert, stores.length, user]);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnchorEl(e.currentTarget);
    setMenuPosition({
      top: rect.bottom,
      left: rect.right,
    });
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPosition(null);
  };
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };
  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toggleLanguage = () => {
    const newLang = language === "kh" ? "en" : "kh";
    changeLanguage(newLang);
    localStorage.setItem("language", newLang);
    setSelectedFlag(newLang === "kh" ? CambodiaFlag : EnglishFlag);
    setSelectedLanguage(newLang === "kh" ? "ភាសាខ្មែរ" : "English");
  };


  const menuItems = [
    // {
    //   icon: LayoutDashboard,
    //   label: `${t("dashboard")}`,
    //   path: "/dashboard",
    // },
    { icon: Store, label: `${t("store")}`, path: "/store", dropdown: true },
    // {
    //   icon: ChartColumnIncreasing,
    //   label: `${t("report")}`,
    //   path: "/report",
    // },
    // {
    //   icon: Settings2,
    //   label: `${t("setting")}`,
    //   path: "/setting",
    // },
  ];

  const horizontalSections = [
    {
      key: "main",
      label: t("main"),
      icon: LayoutDashboard,
      items: [
        { label: t("dashboard"), path: "/dashboard", icon: LayoutDashboard },
        { label: t("report"), path: "/report", icon: ChartNoAxesColumn },
        { label: "AI Chat", path: "/chat", icon: BotMessageSquare },
      ],
    },
    {
      key: "sales",
      label: t("sales"),
      icon: ShoppingCart,
      items: [
        { label: t("orders"), path: "/order", icon: ShoppingCart },
        { label: t("sale"), path: "/on-sale", icon: BadgePercent },
        { label: t("period_invoice") || "Invoice", path: "/invoice", icon: FileText },
        { label: t("total_sale_return") || "Sales Return", path: "/sale-return", icon: RotateCcw },
      ],
    },
    {
      key: "finance",
      label: t("finance") || "Finance",
      icon: TrendingUp,
      items: [
        { label: t("income_report") || "Income", path: "/income", icon: TrendingUp },
        { label: t("period_expense") || "Expense", path: "/expense", icon: TrendingDown },
      ],
    },
    {
      key: "inventory",
      label: t("inventory"),
      icon: Inventory2Outlined,
      items: [
        { label: t("warehouse"), path: "/warehouse", icon: Warehouse },
        { label: t("products"), path: "/setting/product", icon: Inventory2Outlined },
        { label: t("category"), path: "/setting/category", icon: CategoryOutlined },
        { label: t("unit"), path: "/setting/unit", icon: StraightenOutlined },
      ],
    },
    {
      key: "people",
      label: t("people"),
      icon: PeopleAltOutlined,
      items: [
        ...(user?.role === "superAdmin"
          ? [{ label: t("tenants") || "Tenants", path: "/setting/tenant", icon: BusinessOutlined }]
          : []),
        { label: t("user"), path: "/setting/user", icon: GroupOutlined },
        { label: t("suppliers"), path: "/setting/supplier", icon: LocalShippingOutlined },
        { label: t("customer"), path: "/setting/customer", icon: PeopleAltOutlined },
        { label: t("permission"), path: "/setting/permission", icon: SecurityOutlined },
      ],
    },
    {
      key: "restaurant",
      label: t("restaurant"),
      icon: RestaurantOutlined,
      items: [
        { label: t("table"), path: "/setting/table", icon: RestaurantOutlined },
      ],
    },
    ...businessMenuSections.map((section) => ({
      key: section.key,
      label: t(section.label),
      icon: section.icon,
      items: section.modules.map((module) => ({
        label: t(module.label),
        path: module.path,
        icon: module.icon,
      })),
    })),
  ];

  const tabs = [
    { key: "pos", label: t("pos"), link: `/store/pos/${id}` },
    { key: "orders", label: t("orders"), link: `/store/orders/${id}` },
    { key: "kitchen", label: t("kitchen"), link: `/store/kitchen/${id}` },
    {
      key: "reservation",
      label: t("reservation"),
      link: `/store/reservation/${id}`,
    },
    { key: "table", label: t("table"), link: `/store/table/${id}` },
  ];

  const sidebarBg = sidebarColor;
  const topbarSx = {
    bgcolor: `${topbarColor} !important`,
    backgroundImage: "none !important",
    boxShadow: "none !important",
    border: "0 !important",
    borderBottom: "0 !important",
    outline: "0 !important",
  };

  const handleStoreMenuOpen = (event) => {
    setStoreMenuAnchor(event.currentTarget);
  };

  const handleStoreMenuClose = () => {
    setStoreMenuAnchor(null);
  };

  const handleHorizontalMenuOpen = (event, section) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHorizontalMenuPosition({
      top: rect.bottom,
      left: rect.left,
    });
    setActiveHorizontalSection(section);
  };

  const handleHorizontalMenuClose = () => {
    setHorizontalMenuPosition(null);
    setActiveHorizontalSection(null);
  };

  const handleHorizontalNavigate = (path) => {
    handleHorizontalMenuClose();
    if (path === "/chat" || path === "/app/ai") {
      const token = localStorage.getItem("token") || "";
      const shopId = localStorage.getItem("activeShopId") || "";
      const url = `${window.location.origin}/app/ai?token=${encodeURIComponent(token)}&shopId=${encodeURIComponent(shopId)}`;
      window.open(url, "_blank");
    } else {
      navigate(path);
    }
  };

  const handleGoToShop = async (shopId) => {
    handleStoreMenuClose();
    if (!shopId) {
      navigate("/store");
      return;
    }

    if (!canAccessShop(user, shopId)) {
      quickAlert("error", "You do not have access to this shop", "អ្នកមិនមានសិទ្ធិចូលហាងនេះទេ");
      return;
    }

    const userId = user?._id;
    if (!userId) {
      quickAlert(true, "error", {
        messageEn: "User not found",
        messageKh: "រកមិនឃើញអ្នកប្រើប្រាស់",
      });
      return;
    }

    try {
      const { data } = await checkOpenShift({
        variables: { userId, shopId },
        fetchPolicy: "network-only",
      });

      if (!data?.getOpenShift) {
        quickAlert(
          "warning",
          "Please start your shift before entering POS",
          "សូមបើកវេនការងារជាមុនសិន"
        );
        return;
      }

      localStorage.setItem("activeShopId", shopId);
      navigate(`/store/pos/${shopId}`);
    } catch (error) {
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    }
  };

  const handleGoToStore = () => {
    handleStoreMenuClose();
    window.location.href = `${window.location.origin}/store`;
  };

  const visibleHorizontalSections = useMemo(
    () => filterTenantMenuSections(horizontalSections, user, userPermissions),
    [horizontalSections, user, userPermissions]
  );

  const StoreDropdownMenu = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStores = stores.filter((shop) => {
      const name =
        language === "kh"
          ? shop?.nameKh || shop?.nameEn
          : shop?.nameEn || shop?.nameKh;
      return name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
      <MuiMenu
        anchorEl={storeMenuAnchor}
        open={Boolean(storeMenuAnchor)}
        onClose={() => {
          handleStoreMenuClose();
          setSearchQuery("");
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 340,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: theme.shadows[8],
              maxHeight: "none",
            },
          },
          backdrop: {
            sx: {
              backdropFilter: "none",
              backgroundColor: "transparent",
            },
          },
        }}
      >

        <Box sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
          
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.25,
              py: 0.75,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              bgcolor: "action.hover",
              "&:focus-within": {
                borderColor: "primary.main",
                bgcolor: "background.paper",
                boxShadow: `0 0 0 3px ${theme.palette.primary.main}22`,
              },
              transition: "all 0.15s ease",
            }}
          >
            <Search size={15} style={{ color: theme.palette.text.secondary, flexShrink: 0 }} />
            <InputBase
              autoFocus
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                fontSize: "0.85rem",
                "& input": { p: 0, lineHeight: 1.5 },
              }}
            />
            {searchQuery && (
              <IconButton
                size="small"
                onClick={() => setSearchQuery("")}
                sx={{ p: 0.25, color: "text.secondary" }}
              >
                <X size={13} />
              </IconButton>
            )}
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "text.disabled",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 0.5,
                px: 0.5,
                lineHeight: 1.6,
                flexShrink: 0,
              }}
            >
              Esc
            </Typography>
          </Box>
        </Box>


        <Divider />


        <Box
          sx={{
            maxHeight: 280,
            overflowY: "auto",
            px: 0.75,
            py: 0.75,
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.divider,
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: theme.palette.text.disabled,
            },
            scrollbarWidth: "thin",
            scrollbarColor: `${theme.palette.divider} transparent`,
          }}
        >
          {shopLoading ? (
            <Box sx={{ px: 2, py: 2 }}>
              <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                {t("loading")}
              </Typography>
            </Box>
          ) : filteredStores.length === 0 ? (
            <Box sx={{ px: 2, py: 2.5, textAlign: "center" }}>
              <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : t("no_stores_found") || "No stores found"}
              </Typography>
            </Box>
          ) : (
            filteredStores.map((shop) => {
              const isActiveShop = shop?._id === id;
              const shopName =
                language === "kh"
                  ? shop?.nameKh || shop?.nameEn
                  : shop?.nameEn || shop?.nameKh;
              return (
                <MenuItem
                  key={shop?._id}
                  onClick={() => handleGoToShop(shop?._id)}
                  sx={{
                    gap: 1.5,
                    alignItems: "center",
                    py: 1,
                    px: 1,
                    borderRadius: 1,
                    mb: 0.25,
                    bgcolor: isActiveShop ? "action.selected" : "transparent",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Avatar
                    src={shop?.image}
                    variant="rounded"
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: isActiveShop ? "primary.main" : "action.hover",
                      color: isActiveShop ? "primary.contrastText" : "text.primary",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      borderRadius: 1,
                    }}
                  >
                    {(shopName || "S").slice(0, 1).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 700 }} noWrap>
                      {shopName || t("store")}
                    </Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }} noWrap>
                      {isActiveShop
                        ? t("active") || "Active"
                        : shop?.code || shop?._id?.slice(-8)}
                    </Typography>
                  </Box>
                  {isActiveShop ? (
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <ExternalLink size={14} style={{ color: theme.palette.text.disabled, flexShrink: 0 }} />
                  )}
                </MenuItem>
              );
            })
          )}
        </Box>

        {/* Divider above footer */}
        <Divider />

        {/* Footer Button */}
        <Box sx={{ p: 0.75 }}>
          <Button
            fullWidth
            onClick={handleGoToStore}
            startIcon={
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "action.hover",
                }}
              >
                <Store size={15} />
              </Box>
            }
            sx={{
              justifyContent: "flex-start",
              gap: 0.5,
              py: 1,
              px: 1,
              borderRadius: 1,
              textTransform: "none",
              color: "text.primary",
              fontWeight: 700,
              fontSize: "0.88rem",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": {
                bgcolor: "action.hover",
                borderColor: "text.disabled",
              },
            }}
          >
            {t("store_settings")}
          </Button>
        </Box>
      </MuiMenu>
    );
  };

  const ProfileMenu = () => (
    <MuiMenu
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      anchorReference="anchorPosition"
      anchorPosition={menuPosition || undefined}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      slotProps={{
        paper: {
          sx: {
            mt: 1.5,
            minWidth: 160,
            boxShadow: theme.shadows[4],
            transformOrigin: "right top !important",
          },
        },
      }}
    >
      <MenuItem onClick={handleProfile}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        {t(`profile`)}
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        {t(`logout`)}
      </MenuItem>
    </MuiMenu>
  );

  const HorizontalMenuBar = () => (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.75}
        sx={{
          width: "100%",
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {visibleHorizontalSections.map((section) => {
          const SectionIcon = section.icon;
          const isActiveSection = section.items.some((item) =>
            location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
          );

          return (
            <Button
              key={section.key}
              onClick={(event) => handleHorizontalMenuOpen(event, section)}
              startIcon={<SectionIcon size={17} />}
              endIcon={<ChevronsUpDown size={14} />}
              sx={{
                flexShrink: 0,
                minHeight: 36,
                px: 1.5,
                borderRadius: 1,
                textTransform: "none",
                fontWeight: isActiveSection ? 700 : 500,
                color: theme.palette.getContrastText(topbarColor),
                bgcolor: isActiveSection ? "rgba(255,255,255,0.16)" : "transparent",
                border: "1px solid",
                borderColor: isActiveSection ? "rgba(255,255,255,0.28)" : "transparent",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.12)",
                  borderColor: "rgba(255,255,255,0.18)",
                },
              }}
            >
              {section.label}
            </Button>
          );
        })}
      </Stack>

      <MuiMenu
        open={Boolean(horizontalMenuPosition)}
        onClose={handleHorizontalMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={horizontalMenuPosition || undefined}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.75,
              minWidth: 220,
              borderRadius: 1.5,
              boxShadow: theme.shadows[6],
            },
          },
          backdrop: {
            sx: {
              backdropFilter: "none",
              backgroundColor: "transparent",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            px: 1.25,
            py: 0.75,
          }}
        >
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700 }} noWrap>
            {activeHorizontalSection?.label}
          </Typography>
          <Tooltip title={t("close")}>
            <IconButton
              size="small"
              aria-label={t("close")}
              onClick={handleHorizontalMenuClose}
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1,
                color: "text.secondary",
                "&:hover": {
                  color: "error.main",
                  bgcolor: "action.hover",
                },
              }}
            >
              <X size={15} />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider />

        {(activeHorizontalSection?.items || []).map((item) => {
          const ItemIcon = item.icon;
          const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

          return (
            <MenuItem
              key={item.path}
              selected={active}
              onClick={() => handleHorizontalNavigate(item.path)}
              sx={{ gap: 1.25, py: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <ItemIcon size={17} />
              </ListItemIcon>
              {item.label}
            </MenuItem>
          );
        })}
      </MuiMenu>
    </>
  );


  const RightActions = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton
        onClick={handleToggleFullscreen}
        sx={{ color: theme.palette.getContrastText(topbarColor) }}
      >
        <Shrink size={20} />
      </IconButton>
      <Tooltip title={selectedLanguage}>
        <IconButton
          onClick={toggleLanguage}
          sx={{ color: theme.palette.getContrastText(topbarColor) }}
        >
          <Avatar src={selectedFlag} sx={{ width: 30, height: 30 }} />
        </IconButton>
      </Tooltip>

      <ButtonBase
        onClick={handleMenuOpen}
        sx={{ borderRadius: theme.shape.borderRadius }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            sx={{ width: 32, height: 32 }}
            src={user?.image}
            alt={user?.nameKh}
          />
          {!isExtraSmall && (
            <Typography
              sx={{ color: theme.palette.getContrastText(topbarColor) }}
            >
              {user?.nameKh}
            </Typography>
          )}
        </Stack>
      </ButtonBase>

    </Box>
  );

  const isSettingsRoute = location.pathname.startsWith("/setting");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        bgcolor: theme.palette.background.default,
      }}
    >

      {(!isPosPage && (!isMobile && (!isTopNav || isSettingsRoute))) && (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            top: 0,
            height: "100vh",
            width: sidebarWidth || 250, // Default to 250 for SettingsSidebar if it was 0 for TopNav
            bgcolor: sidebarBg,
            color: theme.palette.getContrastText(sidebarBg),
            borderRight: `1px solid ${theme.palette.divider}`,
            zIndex: theme.zIndex.drawer,
            overflow: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <MenuNavbar userPermissions={userPermissions} />
        </Box>
      )}


      {!isPosPage && isMobile && (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: mobileDrawerWidth,
              bgcolor: sidebarBg,
              color: theme.palette.getContrastText(sidebarBg),
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          <MenuMobile
            onNavigate={handleDrawerToggle}
            showLabels={mobileShowLabels}
            userPermissions={userPermissions}
          />
        </Drawer>
      )}


      <Box
        sx={{
          marginLeft: !isPosPage && !isMobile && (!isTopNav || isSettingsRoute) ? `${sidebarWidth || 250}px` : 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: theme.transitions.create("margin-left", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >

        {!isPosPage && (
          <AppBar
            position="sticky"
            color="default"
            sx={topbarSx}
          >
            <Toolbar sx={{ justifyContent: "space-between", gap: 1 }}>

              {isMobile && (
                <IconButton
                  onClick={handleDrawerToggle}
                  edge="start"
                  sx={{ color: theme.palette.getContrastText(topbarColor) }}
                >
                  <MenuIcon />
                </IconButton>
              )}


              {!isMobile && isTopNav && (
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <ButtonBase
                    onClick={() => navigate("/dashboard")}
                    sx={{ borderRadius: 1, p: 0.5 }}
                  >
                    <Avatar
                      alt="logo"
                      src={logo}
                      sx={{ width: 30, height: 30, borderRadius: 0 }}
                    />
                  </ButtonBase>
                  <Button
                    onClick={handleStoreMenuOpen}
                    startIcon={<Store size={18} />}
                    endIcon={<ChevronsUpDown size={15} />}
                    sx={{
                      minHeight: 35,
                      borderRadius: 1,
                      px: 1.5,
                      textTransform: "none",
                      fontWeight: 600,
                      color: theme.palette.getContrastText(topbarColor),
                      bgcolor: location.pathname.startsWith("/store")
                        ? "rgba(255,255,255,0.16)"
                        : "transparent",
                      border: "1px solid",
                      borderColor: location.pathname.startsWith("/store")
                        ? "rgba(255,255,255,0.28)"
                        : "transparent",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.12)",
                        borderColor: "rgba(255,255,255,0.18)",
                      },
                    }}
                  >
                    {t("store")}
                  </Button>
                </Stack>
              )}


              {!isMobile && !isTopNav && (
                <Box display="flex" gap={1}>
                  {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActiveItem = location.pathname.startsWith(item.path);
                    const buttonSx = {
                      position: "relative",
                      minHeight: 35,
                      borderRadius: 1,
                      px: 1.5,
                      gap: 1,
                      textTransform: "none",
                      fontWeight: isActiveItem ? 700 : 500,
                      color: theme.palette.getContrastText(topbarColor),
                      bgcolor: isActiveItem
                        ? "rgba(255,255,255,0.16)"
                        : "transparent",
                      border: "1px solid",
                      borderColor: isActiveItem
                        ? "rgba(255,255,255,0.28)"
                        : "transparent",
                      boxShadow: isActiveItem
                        ? "0 6px 18px rgba(0,0,0,0.12)"
                        : "none",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.12)",
                        borderColor: "rgba(255,255,255,0.18)",
                      },
                    };
                    const buttonContent = (
                      <>
                        <Box
                          component="span"
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 1.5,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconComponent size={18} strokeWidth={2.2} />
                        </Box>
                        {item.label}
                        {item.dropdown && <ChevronsUpDown  size={15} />}
                      </>
                    );

                    if (item.dropdown) {
                      return (
                        <Button
                          key={item.path}
                          onClick={handleStoreMenuOpen}
                          sx={buttonSx}
                        >
                          {buttonContent}
                        </Button>
                      );
                    }

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        style={{ textDecoration: "none" }}
                      >
                        <Button sx={buttonSx}>{buttonContent}</Button>
                      </Link>
                    );
                  })}
                </Box>
              )}

              {isMobile && <Box flex={1} />}
              {!isMobile && isTopNav && <Box flex={1} />}

              <RightActions />
            </Toolbar>

            {!isMobile && isTopNav && (
              <Toolbar
                variant="dense"
                sx={{
                  minHeight: "44px !important",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  px: 2,
                }}
              >
                <HorizontalMenuBar />
              </Toolbar>
            )}
          </AppBar>
        )}

        {isPosPage && (
          <>
            <AppBar
              position="sticky"
              color="default"
              sx={topbarSx}
            >
              <Toolbar
                sx={{
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  rowGap: 1,
                  py: { xs: 0.5, sm: 0 },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Link
                    to={`/store/pos/${id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button>
                      {!isExtraSmall && (
                        <Typography
                          sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                        >
                          {t("pos_system")}
                        </Typography>
                      )}
                    </Button>
                  </Link>
                  <IconButton
                    onClick={handleOpen}
                    sx={{
                      borderRadius: 1,
                      color: theme.palette.getContrastText(topbarColor),
                      bgcolor: "rgba(255,255,255,0.1)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                    }}
                  >
                    <GridViewOutlinedIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <Box
                  sx={{
                    flex: { xs: "1 1 100%", sm: "0 1 auto" },
                    order: { xs: 3, sm: 2 },
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                    maxWidth: "100%",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ display: "inline-flex", px: 1 }}
                  >
                    {tabs.map((tab) => (
                      <Button
                        key={tab.key}
                        variant={activeTab === tab.key ? "contained" : "text"}
                        onClick={() => setActiveTab(tab.key)}
                        component={Link}
                        to={tab.link}
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          bgcolor:
                            activeTab === tab.key
                              ? theme.palette.primary.main
                              : "transparent",
                          color:
                            activeTab === tab.key
                              ? theme.palette.primary.contrastText
                              : theme.palette.getContrastText(topbarColor),
                          "&:hover": {
                            bgcolor:
                              activeTab === tab.key
                                ? theme.palette.primary.dark
                                : "rgba(255,255,255,0.1)",
                          },
                        }}
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </Stack>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    order: { xs: 2, sm: 3 },
                  }}
                >
                  <Tooltip title={selectedLanguage}>
                    <IconButton
                      onClick={toggleLanguage}
                      sx={{ color: theme.palette.getContrastText(topbarColor) }}
                    >
                      <Avatar src={selectedFlag} sx={{ width: 30, height: 30 }} />
                    </IconButton>
                  </Tooltip>

                  <ButtonBase
                    onClick={handleMenuOpen}
                    sx={{ borderRadius: theme.shape.borderRadius }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        sx={{ width: 32, height: 32 }}
                        src={user?.image}
                        alt={user?.nameKh}
                      />
                      {!isExtraSmall && (
                        <Typography
                          sx={{
                            color: theme.palette.getContrastText(topbarColor),
                          }}
                        >
                          {user?.nameKh}
                        </Typography>
                      )}
                    </Stack>
                  </ButtonBase>
                </Box>
              </Toolbar>
            </AppBar>
            {open && <Menu open={open} onClose={handleClose} t={t} />}
          </>
        )}

        <StoreDropdownMenu />
        <ProfileMenu />


        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: isPosPage ? { xs: 0.5, sm: 1 } : { xs: 2, sm: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
