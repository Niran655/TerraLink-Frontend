import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { Restaurant } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Rating,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Edit,
  Gift,
  Globe,
  Image,
  Info,
  MapIcon,
  MapPinIcon,
  Megaphone,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  Star,
  Store,
  Trash2,
} from "lucide-react";
import { TabContext, TabPanel } from "@mui/lab";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

// ─── GraphQL Imports ──────────────────────────────────────────────────────
import {
  GET_CUISINES_TYPES_WITH_PAGINATION,
  GET_CUISINES_ORIGINS_WITH_PAGINATION,
  GET_MEAL_TYPES_PAGINATION,
  GET_SHOP_PROMOTION_WITH_PAGINATION,
  GET_SHOP_EVENT_WITH_PAGINATION,
} from "../../graphql/queries";
import {
  CREATE_CUISINE_TYPE,
  UPDATE_CUISINE_TYPE,
  DELETE_CUISINE_TYPE,
  CREATE_CUISINE_ORIGIN,
  UPDATE_CUISINE_ORIGIN,
  DELETE_CUISINE_ORIGIN,
  CREATE_MEAL_TYPE,
  UPDATE_MEAL_TYPE,
  DELETE_MEAL_TYPE,
  CREATE_SHOP_PROMOTION,
  UPDATE_SHOP_PROMOTION,
  DELETE_SHOP_PROMOTION,
  CREATE_SHOP_EVENT,
  UPDATE_SHOP_EVENT,
  DELETE_SHOP_EVENT,
} from "../../graphql/mutation";

 
import FooterPagination from "../include/FooterPagination";
import "../Styles/modernTable.scss";
import { useThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
import CuisineTypeAction from "../Components/mobile/cuisineType/cuisineTypeAction";
import CuisineTypeForm from "../Components/mobile/cuisineType/CuisineTypeForm";
import CuisineOrigin from "../../../backend/src/models/CuisineOrigin";
import CuisineOriginForm from "../Components/mobile/cuisineOrigine/cuisineOrigineForm";
import CuisineOriginAction from "../Components/mobile/cuisineOrigine/cuisineOrigineAction";

 
const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "published":
    case "visible":
    case "approved":
    case "scheduled":
      return "success";
    case "pending":
      return "warning";
    case "inactive":
    case "draft":
    case "hidden":
    case "rejected":
    case "completed":
      return "error";
    default:
      return "default";
  }
};


const MobileApp = () => {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { layoutMode } = useThemeContext();
  const { setAlert } = useAuth();

  const [tab, setTab] = useState("1");
  const [navMode, setNavMode] = useState(layoutMode === "compact" ? "compact" : "default");

  // ─── Shop ID ──────────────────────────────────────────────────────
  const shopId = localStorage.getItem("activeShopId");

  // ─── Local state for non‑table tabs (static) ──────────────────
  const [about, setAbout] = useState({
    shortDescription: "",
    description: "",
    history: "",
    mission: "",
    keywords: "",
  });
  const [shopInfo, setShopInfo] = useState({
    name: "",
    nameKh: "",
    shopCode: "",
    type: "",
    logo: null,
    cover: null,
  });
  const [hours, setHours] = useState({
    monday: { open: "08:00", close: "22:00", open24: false, closed: false },
    tuesday: { open: "08:00", close: "22:00", open24: false, closed: false },
    wednesday: { open: "08:00", close: "22:00", open24: false, closed: false },
    thursday: { open: "08:00", close: "22:00", open24: false, closed: false },
    friday: { open: "08:00", close: "23:00", open24: false, closed: false },
    saturday: { open: "09:00", close: "23:00", open24: false, closed: false },
    sunday: { open: "09:00", close: "21:00", open24: false, closed: false },
    holiday: { open: "", close: "", open24: false, closed: true },
  });
  const [address, setAddress] = useState({
    country: "",
    province: "",
    district: "",
    commune: "",
    village: "",
    street: "",
    latitude: "",
    longitude: "",
    googleMap: "",
    parking: "",
  });
  const [contact, setContact] = useState({
    phone: "",
    mobile: "",
    telegram: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    website: "",
    email: "",
  });
  const [rewards, setRewards] = useState({
    enabled: true,
    points: 5,
    checkin: 10,
    review: 20,
    purchase: 1,
    referral: 30,
    birthday: 25,
    vipLevel: "Gold",
    coupon: "",
  });
  const [aiKnowledge, setAiKnowledge] = useState({
    businessStory: "",
    menu: "",
    services: "",
    popularItems: "",
    faq: "",
    reservationPolicy: "",
    deliveryPolicy: "",
    cancellationPolicy: "",
    parking: "",
    petFriendly: "",
    paymentMethods: "",
    additionalNotes: "",
  });
  const [settings, setSettings] = useState({
    booking: true,
    reviews: true,
    rewards: true,
    delivery: true,
    aiChat: false,
    qrCheckin: true,
    events: true,
    promotions: true,
    callButton: true,
    navigation: true,
  });

  // ─── Cuisine Types (Tab 4) ──────────────────────────────────────
  const [cuisineTypePage, setCuisineTypePage] = useState(1);
  const [cuisineTypeLimit, setCuisineTypeLimit] = useState(5);
  const [cuisineTypeKeyword, setCuisineTypeKeyword] = useState("");
  const [cuisineTypeStatus, setCuisineTypeStatus] = useState("All");
  const [openCuisineTypeDialog, setOpenCuisineTypeDialog] = useState(false);
  const [editingCuisineType, setEditingCuisineType] = useState(null);
  const [cuisineTypeForm, setCuisineTypeForm] = useState({ name: "", status: "active" });

  const { data: cuisineTypesData, loading: cuisineTypesLoading, refetch: refetchCuisineTypes } = useQuery(
    GET_CUISINES_TYPES_WITH_PAGINATION,
    {
      variables: {
        shopId,
        page: cuisineTypePage,
        limit: cuisineTypeLimit,
        keyword: cuisineTypeKeyword,
        status: cuisineTypeStatus === "All" ? undefined : cuisineTypeStatus,
      },
      skip: !shopId,
    }
  );
  const cuisineTypes = cuisineTypesData?.getCuisineTypesWithPagination?.data || [];
  console.log("cuisineTypes",cuisineTypes)
  const cuisineTypesPaginator = cuisineTypesData?.getCuisineTypesWithPagination?.paginator;

  const [createCuisineType] = useMutation(CREATE_CUISINE_TYPE, {
    onCompleted: (data) => {
      if (data.createCuisineType?.isSuccess) {
        setAlert(true, "success", data.createCuisineType.message);
        setOpenCuisineTypeDialog(false);
        refetchCuisineTypes();
      } else setAlert(true, "error", data.createCuisineType.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const [updateCuisineType] = useMutation(UPDATE_CUISINE_TYPE, {
    onCompleted: (data) => {
      if (data.updateCuisineType?.isSuccess) {
        setAlert(true, "success", data.updateCuisineType.message);
        setOpenCuisineTypeDialog(false);
        refetchCuisineTypes();
      } else setAlert(true, "error", data.updateCuisineType.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const [deleteCuisineType] = useMutation(DELETE_CUISINE_TYPE, {
    onCompleted: (data) => {
      if (data.deleteCuisineType?.isSuccess) {
        setAlert(true, "success", data.deleteCuisineType.message);
        refetchCuisineTypes();
      } else setAlert(true, "error", data.deleteCuisineType.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const handleSaveCuisineType = () => {
    if (editingCuisineType) {
      updateCuisineType({ variables: { id: editingCuisineType._id, input: cuisineTypeForm } });
    } else {
      createCuisineType({ variables: { shopId, input: cuisineTypeForm } });
    }
  };
  const handleDeleteCuisineType = (id) => {
    if (window.confirm(t("confirm_delete"))) deleteCuisineType({ variables: { id } });
  };

  // ─── Cuisine Origins (Tab 5) ──────────────────────────────────
  const [cuisineOriginPage, setCuisineOriginPage] = useState(1);
  const [cuisineOriginLimit, setCuisineOriginLimit] = useState(5);
  const [cuisineOriginKeyword, setCuisineOriginKeyword] = useState("");
  const [cuisineOriginStatus, setCuisineOriginStatus] = useState("All");
  const [openCuisineOriginDialog, setOpenCuisineOriginDialog] = useState(false);
  const [editingCuisineOrigin, setEditingCuisineOrigin] = useState(null);
  const [cuisineOriginForm, setCuisineOriginForm] = useState({ name: "", status: "active" });

  const { data: cuisineOriginsData, loading: cuisineOriginsLoading, refetch: refetchCuisineOrigins } = useQuery(
    GET_CUISINES_ORIGINS_WITH_PAGINATION,
    {
      variables: {
        shopId,
        page: cuisineOriginPage,
        limit: cuisineOriginLimit,
        keyword: cuisineOriginKeyword,
        status: cuisineOriginStatus === "All" ? undefined : cuisineOriginStatus,
      },
      skip: !shopId,
    }
  );
  const cuisineOrigins = cuisineOriginsData?.getCuisineOriginsWithPagination?.data || [];
  const cuisineOriginsPaginator = cuisineOriginsData?.getCuisineOriginsWithPagination?.paginator;

  const [createCuisineOrigin] = useMutation(CREATE_CUISINE_ORIGIN, {
    onCompleted: (data) => {
      if (data.createCuisineOrigin?.isSuccess) {
        setAlert(true, "success", data.createCuisineOrigin.message);
        setOpenCuisineOriginDialog(false);
        refetchCuisineOrigins();
      } else setAlert(true, "error", data.createCuisineOrigin.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const [updateCuisineOrigin] = useMutation(UPDATE_CUISINE_ORIGIN, {
    onCompleted: (data) => {
      if (data.updateCuisineOrigin?.isSuccess) {
        setAlert(true, "success", data.updateCuisineOrigin.message);
        setOpenCuisineOriginDialog(false);
        refetchCuisineOrigins();
      } else setAlert(true, "error", data.updateCuisineOrigin.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const [deleteCuisineOrigin] = useMutation(DELETE_CUISINE_ORIGIN, {
    onCompleted: (data) => {
      if (data.deleteCuisineOrigin?.isSuccess) {
        setAlert(true, "success", data.deleteCuisineOrigin.message);
        refetchCuisineOrigins();
      } else setAlert(true, "error", data.deleteCuisineOrigin.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const handleSaveCuisineOrigin = () => {
    if (editingCuisineOrigin) {
      updateCuisineOrigin({ variables: { id: editingCuisineOrigin._id, input: cuisineOriginForm } });
    } else {
      createCuisineOrigin({ variables: { shopId, input: cuisineOriginForm } });
    }
  };
  const handleDeleteCuisineOrigin = (id) => {
    if (window.confirm(t("confirm_delete"))) deleteCuisineOrigin({ variables: { id } });
  };

  // ─── Meal Types (Tab 6) ──────────────────────────────────────
  const [mealTypePage, setMealTypePage] = useState(1);
  const [mealTypeLimit, setMealTypeLimit] = useState(5);
  const [mealTypeKeyword, setMealTypeKeyword] = useState("");
  const [mealTypeStatus, setMealTypeStatus] = useState("All");
  const [openMealTypeDialog, setOpenMealTypeDialog] = useState(false);
  const [editingMealType, setEditingMealType] = useState(null);
  const [mealTypeForm, setMealTypeForm] = useState({ name: "", status: "active" });

  const { data: mealTypesData, loading: mealTypesLoading, refetch: refetchMealTypes } = useQuery(
    GET_MEAL_TYPES_PAGINATION,
    {
      variables: {
        shopId,
        page: mealTypePage,
        limit: mealTypeLimit,
        keyword: mealTypeKeyword,
        status: mealTypeStatus === "All" ? undefined : mealTypeStatus,
      },
      skip: !shopId,
    }
  );
  const mealTypes = mealTypesData?.getMealTypes?.data || [];
  const mealTypesPaginator = mealTypesData?.getMealTypes?.paginator;

  const [createMealType] = useMutation(CREATE_MEAL_TYPE, {
    onCompleted: (data) => {
      if (data.createMealType?.isSuccess) {
        setAlert(true, "success", data.createMealType.message);
        setOpenMealTypeDialog(false);
        refetchMealTypes();
      } else setAlert(true, "error", data.createMealType.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const [updateMealType] = useMutation(UPDATE_MEAL_TYPE, {
    onCompleted: (data) => {
      if (data.updateMealType?.isSuccess) {
        setAlert(true, "success", data.updateMealType.message);
        setOpenMealTypeDialog(false);
        refetchMealTypes();
      } else setAlert(true, "error", data.updateMealType.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const [deleteMealType] = useMutation(DELETE_MEAL_TYPE, {
    onCompleted: (data) => {
      if (data.deleteMealType?.isSuccess) {
        setAlert(true, "success", data.deleteMealType.message);
        refetchMealTypes();
      } else setAlert(true, "error", data.deleteMealType.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const handleSaveMealType = () => {
    if (editingMealType) {
      updateMealType({ variables: { id: editingMealType._id, input: mealTypeForm } });
    } else {
      createMealType({ variables: { shopId, input: mealTypeForm } });
    }
  };
  const handleDeleteMealType = (id) => {
    if (window.confirm(t("confirm_delete"))) deleteMealType({ variables: { id } });
  };

  // ─── Promotions (Tab 13) ──────────────────────────────────────
  const [promotionPage, setPromotionPage] = useState(1);
  const [promotionLimit, setPromotionLimit] = useState(5);
  const [promotionKeyword, setPromotionKeyword] = useState("");
  const [promotionStatus, setPromotionStatus] = useState("All");
  const [openPromotionDialog, setOpenPromotionDialog] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [promotionForm, setPromotionForm] = useState({
    type: "banner",
    title: "",
    description: "",
    discount: 0,
    startDate: "",
    endDate: "",
    status: "active",
  });

  const { data: promotionsData, loading: promotionsLoading, refetch: refetchPromotions } = useQuery(
    GET_SHOP_PROMOTION_WITH_PAGINATION,
    {
      variables: {
        shopId,
        page: promotionPage,
        limit: promotionLimit,
        keyword: promotionKeyword,
        status: promotionStatus === "All" ? undefined : promotionStatus,
      },
      skip: !shopId,
    }
  );
  const promotions = promotionsData?.getShopPromotions?.data || [];
  const promotionsPaginator = promotionsData?.getShopPromotions?.paginator;

  const [createPromotion] = useMutation(CREATE_SHOP_PROMOTION, {
    onCompleted: (data) => {
      if (data.createShopPromotion?.isSuccess) {
        setAlert(true, "success", data.createShopPromotion.message);
        setOpenPromotionDialog(false);
        refetchPromotions();
      } else setAlert(true, "error", data.createShopPromotion.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const [updatePromotion] = useMutation(UPDATE_SHOP_PROMOTION, {
    onCompleted: (data) => {
      if (data.updateShopPromotion?.isSuccess) {
        setAlert(true, "success", data.updateShopPromotion.message);
        setOpenPromotionDialog(false);
        refetchPromotions();
      } else setAlert(true, "error", data.updateShopPromotion.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const [deletePromotion] = useMutation(DELETE_SHOP_PROMOTION, {
    onCompleted: (data) => {
      if (data.deleteShopPromotion?.isSuccess) {
        setAlert(true, "success", data.deleteShopPromotion.message);
        refetchPromotions();
      } else setAlert(true, "error", data.deleteShopPromotion.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const handleSavePromotion = () => {
    if (editingPromotion) {
      updatePromotion({ variables: { _id: editingPromotion._id, input: promotionForm } });
    } else {
      createPromotion({ variables: { shopId, input: promotionForm } });
    }
  };
  const handleDeletePromotion = (id) => {
    if (window.confirm(t("confirm_delete"))) deletePromotion({ variables: { _id: id } });
  };

  // ─── Events (Tab 14) ──────────────────────────────────────────
  const [eventPage, setEventPage] = useState(1);
  const [eventLimit, setEventLimit] = useState(5);
  const [eventKeyword, setEventKeyword] = useState("");
  const [eventStatus, setEventStatus] = useState("All");
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    status: "scheduled",
  });

  const { data: eventsData, loading: eventsLoading, refetch: refetchEvents } = useQuery(
    GET_SHOP_EVENT_WITH_PAGINATION,
    {
      variables: {
        shopId,
        page: eventPage,
        limit: eventLimit,
        keyword: eventKeyword,
        status: eventStatus === "All" ? undefined : eventStatus,
      },
      skip: !shopId,
    }
  );
  const events = eventsData?.getShopEvents?.data || [];
  const eventsPaginator = eventsData?.getShopEvents?.paginator;

  const [createEvent] = useMutation(CREATE_SHOP_EVENT, {
    onCompleted: (data) => {
      if (data.createShopEvent?.isSuccess) {
        setAlert(true, "success", data.createShopEvent.message);
        setOpenEventDialog(false);
        refetchEvents();
      } else setAlert(true, "error", data.createShopEvent.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const [updateEvent] = useMutation(UPDATE_SHOP_EVENT, {
    onCompleted: (data) => {
      if (data.updateShopEvent?.isSuccess) {
        setAlert(true, "success", data.updateShopEvent.message);
        setOpenEventDialog(false);
        refetchEvents();
      } else setAlert(true, "error", data.updateShopEvent.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const [deleteEvent] = useMutation(DELETE_SHOP_EVENT, {
    onCompleted: (data) => {
      if (data.deleteShopEvent?.isSuccess) {
        setAlert(true, "success", data.deleteShopEvent.message);
        refetchEvents();
      } else setAlert(true, "error", data.deleteShopEvent.message);
    },
    onError: (err) => setAlert(true, "error", err.message),
  });
  const handleSaveEvent = () => {
    if (editingEvent) {
      updateEvent({ variables: { _id: editingEvent._id, input: eventForm } });
    } else {
      createEvent({ variables: { shopId, input: eventForm } });
    }
  };
  const handleDeleteEvent = (id) => {
    if (window.confirm(t("confirm_delete"))) deleteEvent({ variables: { _id: id } });
  };

  // ─── Render Toolbar ────────────────────────────────────────────
  const renderToolbar = ({ keyword, setKeyword, setPage, status, setStatus, statusItems, extraFields, action }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" }, flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center" sx={{ flex: 1 }}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="body2" fontWeight={500} mb={0.5}>{t("search")}</Typography>
          <TextField type="search" size="small" placeholder={t("search") + "..."} value={keyword} fullWidth
            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> }}
          />
        </Grid>
        {statusItems && (
          <Grid size={{ xs: 12, sm: 2 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>{t("status")}</Typography>
            <TextField select fullWidth size="small" value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              {statusItems.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
            </TextField>
          </Grid>
        )}
        {extraFields && extraFields.map((field, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 2 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>{field.label}</Typography>
            {field.type === "select" ? (
              <TextField select fullWidth size="small" value={field.value}
                onChange={(e) => { field.setValue(e.target.value); setPage(1); }}
              >
                {field.options.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
              </TextField>
            ) : (
              <TextField type="date" fullWidth size="small" value={field.value}
                onChange={(e) => { field.setValue(e.target.value); setPage(1); }}
                InputLabelProps={{ shrink: true }}
              />
            )}
          </Grid>
        ))}
      </Grid>
      {action && <Stack direction="row" sx={{ alignSelf: { xs: "flex-end", md: "auto" } }}>{action}</Stack>}
    </Box>
  );

  const handleLimit = (setter, pageSetter) => (e) => {
    setter(parseInt(e.target.value, 10));
    pageSetter(1);
  };

  // ─── Navigation Tabs ──────────────────────────────────────────
  const isNavCompact = navMode === "compact" && !isMobile;
  const navTabs = [
    { value: "1", label: t("about"), icon: Info },
    { value: "2", label: t("shop_information"), icon: Store },
    { value: "3", label: t("business_hours"), icon: Clock },
    { value: "4", label: t("cuisine_types"), icon: Restaurant },
    { value: "5", label: t("cuisine_origins"), icon: Globe },
    { value: "6", label: t("meal_types"), icon: Coffee },
    { value: "7", label: t("gallery"), icon: Image },
    { value: "8", label: t("address_location"), icon: MapIcon },
    { value: "9", label: t("contact_information"), icon: Phone },
    { value: "10", label: t("customer_reviews"), icon: Star },
    { value: "11", label: t("rewards_program"), icon: Gift },
    { value: "12", label: t("ai_assistant"), icon: Gift },
    { value: "13", label: t("promotions"), icon: Megaphone },
    { value: "14", label: t("events"), icon: Calendar },
    { value: "15", label: t("mobile_settings"), icon: Settings },
  ];

  // ─── Render ────────────────────────────────────────────────────
  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Breadcrumbs separator="/">
        <Typography sx={{ borderLeft: "3px solid #1D4592", pl: 1.5 }}>{t("shop_management")}</Typography>
      </Breadcrumbs>

      <TabContext value={tab}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* Navigation */}
          <Grid size={{ xs: 12, sm: isNavCompact ? 1 : 3, md: isNavCompact ? 1 : 2 }}>
            <Paper elevation={0} sx={{ p: isNavCompact ? 1 : 2, height: "70vh", borderRadius: 1, position: "relative", overflowY: "auto" }}>
              {!isMobile && (
                <Tooltip title={isNavCompact ? "Show labels" : "Compact"} placement="right" arrow>
                  <IconButton size="small" onClick={() => setNavMode((prev) => (prev === "compact" ? "default" : "compact"))}
                    sx={{ position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, zIndex: 2,
                      bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, boxShadow: theme.shadows[2],
                      "&:hover": { bgcolor: "background.paper" } }}
                  >
                    {isNavCompact ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                  </IconButton>
                </Tooltip>
              )}
              <Stack direction="column" spacing={0.5} alignItems={isNavCompact ? "center" : "stretch"}>
                {navTabs.map((item) => {
                  const Icon = item.icon;
                  const active = tab === item.value;
                  const button = (
                    <Button fullWidth={!isNavCompact} variant={active ? "contained" : "text"} onClick={() => setTab(item.value)}
                      aria-label={item.label} sx={{ minWidth: isNavCompact ? 40 : 0, width: isNavCompact ? 40 : "100%", height: 36,
                        px: isNavCompact ? 0 : 1.5, justifyContent: isNavCompact ? "center" : "flex-start", textTransform: "none", fontSize: "0.8rem" }}
                    >
                      <Icon size={16} />
                      {!isNavCompact && <Box component="span" sx={{ ml: 1 }}>{item.label}</Box>}
                    </Button>
                  );
                  return isNavCompact ? <Tooltip key={item.value} title={item.label} placement="right" arrow>{button}</Tooltip> : <Box key={item.value}>{button}</Box>;
                })}
              </Stack>
            </Paper>
          </Grid>

          {/* Content */}
          <Grid size={{ xs: 12, sm: isNavCompact ? 11 : 9, md: isNavCompact ? 11 : 10 }}>
            {/* ========== Tab 1: About ========== */}
            <TabPanel value="1" sx={{ p: 0 }}>
              <Paper sx={{ p: 3, textAlign: "left" }}>
                <Typography variant="h6" gutterBottom>{t("about")}</Typography>
                <Typography variant="body2" mb={2} color="text.secondary">{t("edit_business_description")}</Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">{t("short_description")}</Typography>
                    <TextField fullWidth size="small" value={about.shortDescription}
                      onChange={(e) => setAbout({ ...about, shortDescription: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">{t("long_description")}</Typography>
                    <TextField multiline rows={4} fullWidth size="small" value={about.description}
                      onChange={(e) => setAbout({ ...about, description: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">{t("history")}</Typography>
                    <TextField multiline rows={3} fullWidth size="small" value={about.history}
                      onChange={(e) => setAbout({ ...about, history: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">{t("mission")}</Typography>
                    <TextField multiline rows={3} fullWidth size="small" value={about.mission}
                      onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">{t("keywords")}</Typography>
                    <TextField fullWidth size="small" placeholder="Khmer food, authentic, local..." value={about.keywords}
                      onChange={(e) => setAbout({ ...about, keywords: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button variant="contained" onClick={() => alert(t("save_not_implemented"))}>{t("save")}</Button>
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>

            {/* ========== Tab 2: Shop Information ========== */}
            <TabPanel value="2" sx={{ p: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={2} textAlign="left">{t("shop_information")}</Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      <TextField label={t("business_name")} fullWidth size="small" value={shopInfo.name}
                        onChange={(e) => setShopInfo({ ...shopInfo, name: e.target.value })}
                      />
                      <TextField label={t("khmer_name")} fullWidth size="small" value={shopInfo.nameKh}
                        onChange={(e) => setShopInfo({ ...shopInfo, nameKh: e.target.value })}
                      />
                      <TextField label={t("shop_code")} fullWidth size="small" value={shopInfo.shopCode}
                        onChange={(e) => setShopInfo({ ...shopInfo, shopCode: e.target.value })}
                      />
                      <TextField select label={t("business_type")} fullWidth size="small" value={shopInfo.type}
                        onChange={(e) => setShopInfo({ ...shopInfo, type: e.target.value })}
                      >
                        {["Restaurant", "Cafe", "Hotel", "Bakery", "Bar", "Shopping Mall", "Spa", "Gym", "Tourism"].map((type) => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      <Box><Typography>{t("logo")}</Typography><Button variant="contained" component="label">{t("upload")}<input type="file" hidden /></Button></Box>
                      <Box><Typography>{t("cover_photo")}</Typography><Button variant="contained" component="label">{t("upload")}<input type="file" hidden /></Button></Box>
                      <Button variant="contained" onClick={() => alert(t("save_not_implemented"))}>{t("save")}</Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>

            {/* ========== Tab 3: Business Hours ========== */}
            <TabPanel value="3" sx={{ p: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography textAlign="left" variant="h6" gutterBottom>{t("business_hours")}</Typography>
                <Grid container spacing={2}>
                  {Object.entries(hours).map(([day, times]) => {
                    if (day === "holiday") return null;
                    return (
                      <Grid key={day} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                          <Typography sx={{ textTransform: "capitalize", fontWeight: 600 }}>{day}</Typography>
                          <Stack spacing={1} sx={{ mt: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <TextField type="time" size="small" label={t("open")} value={times.open}
                                onChange={(e) => setHours({ ...hours, [day]: { ...times, open: e.target.value } })}
                                InputLabelProps={{ shrink: true }} disabled={times.closed} sx={{ width: 100 }}
                              />
                              <TextField type="time" size="small" label={t("close")} value={times.close}
                                onChange={(e) => setHours({ ...hours, [day]: { ...times, close: e.target.value } })}
                                InputLabelProps={{ shrink: true }} disabled={times.closed || times.open24} sx={{ width: 100 }}
                              />
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Switch size="small" checked={times.open24}
                                  onChange={() => setHours({ ...hours, [day]: { ...times, open24: !times.open24, closed: false } })}
                                  disabled={times.closed}
                                />
                                <Typography variant="caption">24h</Typography>
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Switch size="small" checked={times.closed}
                                  onChange={() => setHours({ ...hours, [day]: { ...times, closed: !times.closed, open24: false } })}
                                />
                                <Typography variant="caption">{t("closed")}</Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Card>
                      </Grid>
                    );
                  })}
                  <Grid size={{ xs: 12 }}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography sx={{ fontWeight: 600 }}>{t("holiday")}</Typography>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        <Switch checked={hours.holiday.closed}
                          onChange={() => setHours({ ...hours, holiday: { ...hours.holiday, closed: !hours.holiday.closed } })}
                        />
                        <Typography variant="caption">{t("closed_on_holidays")}</Typography>
                      </Stack>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button variant="contained" onClick={() => alert(t("save_not_implemented"))}>{t("save")}</Button>
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>

            {/* ========== Tab 4: Cuisine Types ========== */}
            <TabPanel value="4" sx={{ p: 0 }}>
              {renderToolbar({
                keyword: cuisineTypeKeyword,
                setKeyword: setCuisineTypeKeyword,
                setPage: setCuisineTypePage,
                status: cuisineTypeStatus,
                setStatus: setCuisineTypeStatus,
                statusItems: [
                  { value: "All", label: t("all") },
                  { value: "active", label: t("active") },
                  { value: "inactive", label: t("inactive") },
                ],
                action: (
                  <Button variant="contained" startIcon={<Plus size={18} />}
                    onClick={()=>setOpenCuisineTypeDialog(true)}
                  >
                    {t("create")}
                  </Button>
                ),
              })}
              {
                openCuisineTypeDialog && (
                  <CuisineTypeForm  dialogTitle="Create"
              open={openCuisineTypeDialog}
              onClose={() => setOpenCuisineTypeDialog(false)}
              setRefetch={refetchCuisineTypes}
              shopId={shopId}
              t={t} />
                )
              }
              <TableContainer className="table-container">
                <Table className="table">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("no")}</TableCell>
                       <TableCell>{t(`khmer_name`)}</TableCell>
                      <TableCell>{t(`english_name`)}</TableCell>
                      <TableCell>{t("status")}</TableCell>
                      <TableCell align="right">{t("action")}</TableCell>
                    </TableRow>
                  </TableHead>
                  {cuisineTypesLoading ? <CircularIndeterminate /> :
                    cuisineTypes.length === 0 ? <EmptyData /> :
                    <TableBody>
                      {cuisineTypes.map((row, index) => (
                        <TableRow key={row._id} className="table-row">
                          <TableCell>{(cuisineTypesPaginator?.slNo || 0) + index}</TableCell>
                          <TableCell>{row.nameKh}</TableCell>
                          <TableCell>{row.nameEn}</TableCell>
                          
                          <TableCell>
                            <Chip label={t(row.status)} color={statusColor(row.status)} size="small"
                              onClick={() => {
                                const newStatus = row.status === "active" ? "inactive" : "active";
                                updateCuisineType({ variables: { id: row._id, input: { name: row.name, status: newStatus } } });
                              }}
                              sx={{ cursor: "pointer" }}
                            />
                          </TableCell>
                          <TableCell align="right">
                           <CuisineTypeAction data={row} setRefetch={refetchCuisineTypes} t={t} shopId={shopId}  />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  }
                </Table>
                <Stack alignItems="flex-end" p={2}>
                  <FooterPagination
                    page={cuisineTypePage}
                    limit={cuisineTypeLimit}
                    setPage={setCuisineTypePage}
                    handleLimit={handleLimit(setCuisineTypeLimit, setCuisineTypePage)}
                    totalDocs={cuisineTypesPaginator?.totalDocs}
                    totalPages={cuisineTypesPaginator?.totalPages}
                  />
                </Stack>
              </TableContainer>
            </TabPanel>

            {/* ========== Tab 5: Cuisine Origins ========== */}
            <TabPanel value="5" sx={{ p: 0 }}>
              {renderToolbar({
                keyword: cuisineOriginKeyword,
                setKeyword: setCuisineOriginKeyword,
                setPage: setCuisineOriginPage,
                status: cuisineOriginStatus,
                setStatus: setCuisineOriginStatus,
                statusItems: [
                  { value: "All", label: t("all") },
                  { value: "active", label: t("active") },
                  { value: "inactive", label: t("inactive") },
                ],
                action: (
                  <Button variant="contained" startIcon={<Plus size={18} />}
                       onClick={()=>setOpenCuisineOriginDialog(true)}
                  >
                    {t("create")}
                  </Button>
                ),
              })}
              {
                openCuisineOriginDialog && (
                  <CuisineOriginForm dialogTitle="Create"
              open={openCuisineOriginDialog}
              onClose={() => setOpenCuisineOriginDialog(false)}
              setRefetch={refetchCuisineOrigins}
              shopId={shopId}
              t={t}  />
                )
              }
              <TableContainer className="table-container">
                <Table className="table">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("no")}</TableCell>
                      <TableCell>{t("khmer_name")}</TableCell>
                      <TableCell>{t("english_name")}</TableCell>
                      <TableCell>{t("status")}</TableCell>
                      <TableCell align="right">{t("action")}</TableCell>
                    </TableRow>
                  </TableHead>
                  {cuisineOriginsLoading ? <CircularIndeterminate /> :
                    cuisineOrigins.length === 0 ? <EmptyData /> :
                    <TableBody>
                      {cuisineOrigins.map((row, index) => (
                        <TableRow key={row._id} className="table-row">
                          <TableCell>{(cuisineOriginsPaginator?.slNo || 0) + index}</TableCell>
                            <TableCell>{row.nameKh}</TableCell>
                          <TableCell>{row.nameEn}</TableCell>
                          <TableCell>
                            <Chip label={t(row.status)} color={statusColor(row.status)} size="small"
                              onClick={() => {
                                const newStatus = row.status === "active" ? "inactive" : "active";
                                updateCuisineOrigin({ variables: { id: row._id, input: { name: row.name, status: newStatus } } });
                              }}
                              sx={{ cursor: "pointer" }}
                            />
                          </TableCell>
                          <TableCell align="right">
                              <CuisineOriginAction  data={row} setRefetch={refetchCuisineOrigins} t={t} shopId={shopId} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  }
                </Table>
                <Stack alignItems="flex-end" p={2}>
                  <FooterPagination
                    page={cuisineOriginPage}
                    limit={cuisineOriginLimit}
                    setPage={setCuisineOriginPage}
                    handleLimit={handleLimit(setCuisineOriginLimit, setCuisineOriginPage)}
                    totalDocs={cuisineOriginsPaginator?.totalDocs}
                    totalPages={cuisineOriginsPaginator?.totalPages}
                  />
                </Stack>
              </TableContainer>
              
            </TabPanel>

            {/* ========== Tab 6: Meal Types ========== */}
            <TabPanel value="6" sx={{ p: 0 }}>
              {renderToolbar({
                keyword: mealTypeKeyword,
                setKeyword: setMealTypeKeyword,
                setPage: setMealTypePage,
                status: mealTypeStatus,
                setStatus: setMealTypeStatus,
                statusItems: [
                  { value: "All", label: t("all") },
                  { value: "active", label: t("active") },
                  { value: "inactive", label: t("inactive") },
                ],
                action: (
                  <Button variant="contained" startIcon={<Plus size={18} />}
                    onClick={() => { setEditingMealType(null); setMealTypeForm({ name: "", status: "active" }); setOpenMealTypeDialog(true); }}
                  >
                    {t("add_meal_type")}
                  </Button>
                ),
              })}
              <TableContainer className="table-container">
                <Table className="table">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("no")}</TableCell>
                      <TableCell>{t("name")}</TableCell>
                      <TableCell>{t("status")}</TableCell>
                      <TableCell align="right">{t("action")}</TableCell>
                    </TableRow>
                  </TableHead>
                  {mealTypesLoading ? <CircularIndeterminate /> :
                    mealTypes.length === 0 ? <EmptyData /> :
                    <TableBody>
                      {mealTypes.map((row, index) => (
                        <TableRow key={row._id} className="table-row">
                          <TableCell>{(mealTypesPaginator?.slNo || 0) + index}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>
                            <Chip label={t(row.status)} color={statusColor(row.status)} size="small"
                              onClick={() => {
                                const newStatus = row.status === "active" ? "inactive" : "active";
                                updateMealType({ variables: { id: row._id, input: { name: row.name, status: newStatus } } });
                              }}
                              sx={{ cursor: "pointer" }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => { setEditingMealType(row); setMealTypeForm({ name: row.name, status: row.status }); setOpenMealTypeDialog(true); }}>
                              <Edit size={16} />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteMealType(row._id)}>
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  }
                </Table>
                <Stack alignItems="flex-end" p={2}>
                  <FooterPagination
                    page={mealTypePage}
                    limit={mealTypeLimit}
                    setPage={setMealTypePage}
                    handleLimit={handleLimit(setMealTypeLimit, setMealTypePage)}
                    totalDocs={mealTypesPaginator?.totalDocs}
                    totalPages={mealTypesPaginator?.totalPages}
                  />
                </Stack>
              </TableContainer>
           
            </TabPanel>

            {/* ========== Tab 7: Gallery (placeholder) ========== */}
            <TabPanel value="7" sx={{ p: 0 }}>
              {renderToolbar({
                keyword: null,
                setKeyword: null,
                setPage: null,
                action: <Button variant="contained" startIcon={<LibraryAddOutlinedIcon />}>{t("upload_image")}</Button>,
              })}
              <TableContainer className="table-container">
                <Table className="table">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("image")}</TableCell>
                      <TableCell>{t("title")}</TableCell>
                      <TableCell>{t("category")}</TableCell>
                      <TableCell>{t("cover")}</TableCell>
                      <TableCell>{t("status")}</TableCell>
                      <TableCell align="right">{t("action")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody><TableRow><TableCell colSpan={6}><EmptyData /></TableCell></TableRow></TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* ========== Tab 8: Address & Location ========== */}
            <TabPanel value="8" sx={{ p: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>{t("address_location")}</Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      <TextField select label={t("country")} fullWidth size="small" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })}>
                        <MenuItem value="Cambodia">Cambodia</MenuItem><MenuItem value="Thailand">Thailand</MenuItem><MenuItem value="Vietnam">Vietnam</MenuItem>
                      </TextField>
                      <TextField label={t("province")} fullWidth size="small" value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value })} />
                      <TextField label={t("district")} fullWidth size="small" value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} />
                      <TextField label={t("commune")} fullWidth size="small" value={address.commune} onChange={(e) => setAddress({ ...address, commune: e.target.value })} />
                      <TextField label={t("village")} fullWidth size="small" value={address.village} onChange={(e) => setAddress({ ...address, village: e.target.value })} />
                      <TextField label={t("street")} fullWidth size="small" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      <TextField label={t("latitude")} fullWidth size="small" value={address.latitude} onChange={(e) => setAddress({ ...address, latitude: e.target.value })} />
                      <TextField label={t("longitude")} fullWidth size="small" value={address.longitude} onChange={(e) => setAddress({ ...address, longitude: e.target.value })} />
                      <TextField label={t("google_map")} fullWidth size="small" value={address.googleMap} onChange={(e) => setAddress({ ...address, googleMap: e.target.value })} />
                      <TextField label={t("parking")} fullWidth size="small" value={address.parking} onChange={(e) => setAddress({ ...address, parking: e.target.value })} />
                      <Button variant="outlined" startIcon={<MapPinIcon size={16} />}>📍 {t("pick_on_map")}</Button>
                      <Button variant="contained" onClick={() => alert(t("save_not_implemented"))}>{t("save")}</Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>

            {/* ========== Tab 9: Contact Information ========== */}
            <TabPanel value="9" sx={{ p: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>{t("contact_information")}</Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      <TextField label={t("phone")} fullWidth size="small" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                      <TextField label={t("mobile")} fullWidth size="small" value={contact.mobile} onChange={(e) => setContact({ ...contact, mobile: e.target.value })} />
                      <TextField label="Telegram" fullWidth size="small" value={contact.telegram} onChange={(e) => setContact({ ...contact, telegram: e.target.value })} />
                      <TextField label="WhatsApp" fullWidth size="small" value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} />
                      <TextField label="Facebook" fullWidth size="small" value={contact.facebook} onChange={(e) => setContact({ ...contact, facebook: e.target.value })} />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      <TextField label="Instagram" fullWidth size="small" value={contact.instagram} onChange={(e) => setContact({ ...contact, instagram: e.target.value })} />
                      <TextField label="TikTok" fullWidth size="small" value={contact.tiktok} onChange={(e) => setContact({ ...contact, tiktok: e.target.value })} />
                      <TextField label={t("website")} fullWidth size="small" value={contact.website} onChange={(e) => setContact({ ...contact, website: e.target.value })} />
                      <TextField label={t("email")} fullWidth size="small" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                      <Button variant="contained" onClick={() => alert(t("save_not_implemented"))}>{t("save")}</Button>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>{t("preview")}</Typography>
                      <Stack direction="row" spacing={2}>
                        <Button size="small" startIcon={<Phone size={14} />}>☎ {t("call")}</Button>
                        <Button size="small" startIcon={<Globe size={14} />}>🌐 {t("website")}</Button>
                        <Button size="small" startIcon={<Store size={14} />}>📘 Facebook</Button>
                        <Button size="small" startIcon={<Send size={14} />}>✈ Telegram</Button>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>

            {/* ========== Tab 10: Customer Reviews ========== */}
            <TabPanel value="10" sx={{ p: 0 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 4 }}>
                    <Stack alignItems="center">
                      <Typography variant="h2">4.8</Typography>
                      <Rating value={4.8} precision={0.1} readOnly size="large" />
                      <Typography variant="body2" color="text.secondary">{t("overall_rating")}</Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="body2">{t("total_reviews")}: <strong>256</strong></Typography>
                      <Typography variant="body2">5 ★ (180)</Typography>
                      <Typography variant="body2">4 ★ (50)</Typography>
                      <Typography variant="body2">3 ★ (16)</Typography>
                      <Typography variant="body2">2 ★ (6)</Typography>
                      <Typography variant="body2">1 ★ (4)</Typography>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {renderToolbar({
                    keyword: null,
                    setKeyword: null,
                    setPage: null,
                    status: null,
                    setStatus: null,
                    statusItems: [
                      { value: "All", label: t("all") },
                      { value: "visible", label: t("visible") },
                      { value: "hidden", label: t("hidden") },
                      { value: "reported", label: t("reported") },
                    ],
                  })}
                  <TableContainer className="table-container">
                    <Table className="table">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t("customer")}</TableCell>
                          <TableCell align="center">{t("rating")}</TableCell>
                          <TableCell>{t("comment")}</TableCell>
                          <TableCell>{t("reply")}</TableCell>
                          <TableCell>{t("status")}</TableCell>
                          <TableCell align="right">{t("action")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody><TableRow><TableCell colSpan={6}><EmptyData /></TableCell></TableRow></TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </TabPanel>

            {/* ========== Tab 11: Rewards Program ========== */}
            <TabPanel value="11" sx={{ p: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>{t("rewards_program")}</Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography>{t("enable_rewards")}</Typography>
                        <Switch checked={rewards.enabled} onChange={() => setRewards({ ...rewards, enabled: !rewards.enabled })} />
                      </Stack>
                      <TextField label={t("reward_points")} type="number" size="small" value={rewards.points} onChange={(e) => setRewards({ ...rewards, points: parseInt(e.target.value) })} InputProps={{ endAdornment: <InputAdornment position="end">Points per $</InputAdornment> }} />
                      <TextField label={t("checkin_reward")} type="number" size="small" value={rewards.checkin} onChange={(e) => setRewards({ ...rewards, checkin: parseInt(e.target.value) })} InputProps={{ endAdornment: <InputAdornment position="end">Points</InputAdornment> }} />
                      <TextField label={t("review_reward")} type="number" size="small" value={rewards.review} onChange={(e) => setRewards({ ...rewards, review: parseInt(e.target.value) })} InputProps={{ endAdornment: <InputAdornment position="end">Points</InputAdornment> }} />
                      <TextField label={t("purchase_reward")} type="number" size="small" value={rewards.purchase} onChange={(e) => setRewards({ ...rewards, purchase: parseInt(e.target.value) })} InputProps={{ endAdornment: <InputAdornment position="end">Point per $</InputAdornment> }} />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      <TextField label={t("referral_reward")} type="number" size="small" value={rewards.referral} onChange={(e) => setRewards({ ...rewards, referral: parseInt(e.target.value) })} InputProps={{ endAdornment: <InputAdornment position="end">Points</InputAdornment> }} />
                      <TextField label={t("birthday_reward")} type="number" size="small" value={rewards.birthday} onChange={(e) => setRewards({ ...rewards, birthday: parseInt(e.target.value) })} InputProps={{ endAdornment: <InputAdornment position="end">Points</InputAdornment> }} />
                      <TextField select label={t("vip_level")} size="small" value={rewards.vipLevel} onChange={(e) => setRewards({ ...rewards, vipLevel: e.target.value })}>
                        <MenuItem value="Silver">Silver</MenuItem><MenuItem value="Gold">Gold</MenuItem><MenuItem value="Platinum">Platinum</MenuItem>
                      </TextField>
                      <TextField label={t("coupon")} size="small" value={rewards.coupon} onChange={(e) => setRewards({ ...rewards, coupon: e.target.value })} />
                      <Button variant="contained" onClick={() => alert(t("save_not_implemented"))}>{t("save")}</Button>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: "action.hover" }}>
                      <Typography variant="subtitle2">{t("example")}</Typography>
                      <Stack direction="row" spacing={4}>
                        <Typography variant="body2">📝 {t("review")}: +{rewards.review} Points</Typography>
                        <Typography variant="body2">📍 {t("check_in")}: +{rewards.checkin} Points</Typography>
                        <Typography variant="body2">🛒 {t("purchase")}: {rewards.purchase} Point = $1</Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>

            {/* ========== Tab 12: AI Assistant ========== */}
            <TabPanel value="12" sx={{ p: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>{t("ai_assistant")}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>{t("ai_knowledge_base")}</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}><TextField label={t("business_story")} multiline rows={2} fullWidth size="small" value={aiKnowledge.businessStory} onChange={(e) => setAiKnowledge({ ...aiKnowledge, businessStory: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField label={t("menu")} multiline rows={2} fullWidth size="small" value={aiKnowledge.menu} onChange={(e) => setAiKnowledge({ ...aiKnowledge, menu: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField label={t("services")} multiline rows={2} fullWidth size="small" value={aiKnowledge.services} onChange={(e) => setAiKnowledge({ ...aiKnowledge, services: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField label={t("popular_items")} multiline rows={2} fullWidth size="small" value={aiKnowledge.popularItems} onChange={(e) => setAiKnowledge({ ...aiKnowledge, popularItems: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12 }}><TextField label={t("faq")} multiline rows={3} fullWidth size="small" placeholder="Q: Do you have parking? A: Yes, free parking..." value={aiKnowledge.faq} onChange={(e) => setAiKnowledge({ ...aiKnowledge, faq: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12, md: 4 }}><TextField label={t("reservation_policy")} multiline rows={2} fullWidth size="small" value={aiKnowledge.reservationPolicy} onChange={(e) => setAiKnowledge({ ...aiKnowledge, reservationPolicy: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12, md: 4 }}><TextField label={t("delivery_policy")} multiline rows={2} fullWidth size="small" value={aiKnowledge.deliveryPolicy} onChange={(e) => setAiKnowledge({ ...aiKnowledge, deliveryPolicy: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12, md: 4 }}><TextField label={t("cancellation_policy")} multiline rows={2} fullWidth size="small" value={aiKnowledge.cancellationPolicy} onChange={(e) => setAiKnowledge({ ...aiKnowledge, cancellationPolicy: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12, md: 4 }}><TextField label={t("parking")} fullWidth size="small" value={aiKnowledge.parking} onChange={(e) => setAiKnowledge({ ...aiKnowledge, parking: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12, md: 4 }}><TextField label={t("pet_friendly")} fullWidth size="small" value={aiKnowledge.petFriendly} onChange={(e) => setAiKnowledge({ ...aiKnowledge, petFriendly: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12, md: 4 }}><TextField label={t("payment_methods")} fullWidth size="small" value={aiKnowledge.paymentMethods} onChange={(e) => setAiKnowledge({ ...aiKnowledge, paymentMethods: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12 }}><TextField label={t("additional_notes")} multiline rows={2} fullWidth size="small" value={aiKnowledge.additionalNotes} onChange={(e) => setAiKnowledge({ ...aiKnowledge, additionalNotes: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12 }}><Button variant="contained" onClick={() => alert(t("save_not_implemented"))}>{t("save")}</Button></Grid>
                </Grid>
              </Paper>
            </TabPanel>

            {/* ========== Tab 13: Promotions ========== */}
            <TabPanel value="13" sx={{ p: 0 }}>
              {renderToolbar({
                keyword: promotionKeyword,
                setKeyword: setPromotionKeyword,
                setPage: setPromotionPage,
                status: promotionStatus,
                setStatus: setPromotionStatus,
                statusItems: [
                  { value: "All", label: t("all") },
                  { value: "active", label: t("active") },
                  { value: "inactive", label: t("inactive") },
                ],
                action: (
                  <Button variant="contained" startIcon={<Plus size={18} />}
                    onClick={() => { setEditingPromotion(null); setPromotionForm({ type: "banner", title: "", description: "", discount: 0, startDate: "", endDate: "", status: "active" }); setOpenPromotionDialog(true); }}
                  >
                    {t("add_promotion")}
                  </Button>
                ),
              })}
              <TableContainer className="table-container">
                <Table className="table">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("no")}</TableCell>
                      <TableCell>{t("type")}</TableCell>
                      <TableCell>{t("title")}</TableCell>
                      <TableCell align="right">{t("discount")}</TableCell>
                      <TableCell>{t("start_date")}</TableCell>
                      <TableCell>{t("end_date")}</TableCell>
                      <TableCell>{t("status")}</TableCell>
                      <TableCell align="right">{t("action")}</TableCell>
                    </TableRow>
                  </TableHead>
                  {promotionsLoading ? <CircularIndeterminate /> :
                    promotions.length === 0 ? <EmptyData /> :
                    <TableBody>
                      {promotions.map((row, index) => (
                        <TableRow key={row._id} className="table-row">
                          <TableCell>{(promotionsPaginator?.slNo || 0) + index}</TableCell>
                          <TableCell>{t(row.type)}</TableCell>
                          <TableCell>{row.title}</TableCell>
                          <TableCell align="right">{row.discount}%</TableCell>
                          <TableCell>{row.startDate}</TableCell>
                          <TableCell>{row.endDate}</TableCell>
                          <TableCell>
                            <Chip label={t(row.status)} color={statusColor(row.status)} size="small"
                              onClick={() => {
                                const newStatus = row.status === "active" ? "inactive" : "active";
                                updatePromotion({ variables: { _id: row._id, input: { ...row, status: newStatus } } });
                              }}
                              sx={{ cursor: "pointer" }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => { setEditingPromotion(row); setPromotionForm({ ...row }); setOpenPromotionDialog(true); }}>
                              <Edit size={16} />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeletePromotion(row._id)}>
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  }
                </Table>
                <Stack alignItems="flex-end" p={2}>
                  <FooterPagination
                    page={promotionPage}
                    limit={promotionLimit}
                    setPage={setPromotionPage}
                    handleLimit={handleLimit(setPromotionLimit, setPromotionPage)}
                    totalDocs={promotionsPaginator?.totalDocs}
                    totalPages={promotionsPaginator?.totalPages}
                  />
                </Stack>
              </TableContainer>

              <Dialog open={openPromotionDialog} onClose={() => setOpenPromotionDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingPromotion ? t("edit_promotion") : t("add_promotion")}</DialogTitle>
                <DialogContent>
                  <TextField select margin="dense" label={t("type")} fullWidth size="small" value={promotionForm.type} onChange={(e) => setPromotionForm({ ...promotionForm, type: e.target.value })}>
                    <MenuItem value="banner">{t("banner")}</MenuItem>
                    <MenuItem value="coupon">{t("coupon")}</MenuItem>
                    <MenuItem value="discount">{t("discount")}</MenuItem>
                    <MenuItem value="flash_sale">{t("flash_sale")}</MenuItem>
                    <MenuItem value="happy_hour">{t("happy_hour")}</MenuItem>
                    <MenuItem value="buy1get1">{t("buy_1_get_1")}</MenuItem>
                  </TextField>
                  <TextField margin="dense" label={t("title")} fullWidth size="small" value={promotionForm.title} onChange={(e) => setPromotionForm({ ...promotionForm, title: e.target.value })} />
                  <TextField margin="dense" label={t("description")} fullWidth size="small" value={promotionForm.description} onChange={(e) => setPromotionForm({ ...promotionForm, description: e.target.value })} />
                  <TextField margin="dense" label={t("discount")} type="number" fullWidth size="small" value={promotionForm.discount} onChange={(e) => setPromotionForm({ ...promotionForm, discount: parseInt(e.target.value) || 0 })} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
                  <TextField margin="dense" label={t("start_date")} type="date" fullWidth size="small" value={promotionForm.startDate} onChange={(e) => setPromotionForm({ ...promotionForm, startDate: e.target.value })} InputLabelProps={{ shrink: true }} />
                  <TextField margin="dense" label={t("end_date")} type="date" fullWidth size="small" value={promotionForm.endDate} onChange={(e) => setPromotionForm({ ...promotionForm, endDate: e.target.value })} InputLabelProps={{ shrink: true }} />
                  <TextField select margin="dense" label={t("status")} fullWidth size="small" value={promotionForm.status} onChange={(e) => setPromotionForm({ ...promotionForm, status: e.target.value })}>
                    <MenuItem value="active">{t("active")}</MenuItem>
                    <MenuItem value="inactive">{t("inactive")}</MenuItem>
                  </TextField>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenPromotionDialog(false)}>{t("cancel")}</Button>
                  <Button variant="contained" onClick={handleSavePromotion}>{t("save")}</Button>
                </DialogActions>
              </Dialog>
            </TabPanel>

            {/* ========== Tab 14: Events ========== */}
            <TabPanel value="14" sx={{ p: 0 }}>
              {renderToolbar({
                keyword: eventKeyword,
                setKeyword: setEventKeyword,
                setPage: setEventPage,
                status: eventStatus,
                setStatus: setEventStatus,
                statusItems: [
                  { value: "All", label: t("all") },
                  { value: "scheduled", label: t("scheduled") },
                  { value: "active", label: t("active") },
                  { value: "completed", label: t("completed") },
                ],
                action: (
                  <Button variant="contained" startIcon={<Plus size={18} />}
                    onClick={() => { setEditingEvent(null); setEventForm({ title: "", description: "", date: "", status: "scheduled" }); setOpenEventDialog(true); }}
                  >
                    {t("add_event")}
                  </Button>
                ),
              })}
              <TableContainer className="table-container">
                <Table className="table">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("no")}</TableCell>
                      <TableCell>{t("title")}</TableCell>
                      <TableCell>{t("description")}</TableCell>
                      <TableCell>{t("date")}</TableCell>
                      <TableCell>{t("status")}</TableCell>
                      <TableCell align="right">{t("action")}</TableCell>
                    </TableRow>
                  </TableHead>
                  {eventsLoading ? <CircularIndeterminate /> :
                    events.length === 0 ? <EmptyData /> :
                    <TableBody>
                      {events.map((row, index) => (
                        <TableRow key={row._id} className="table-row">
                          <TableCell>{(eventsPaginator?.slNo || 0) + index}</TableCell>
                          <TableCell>{row.title}</TableCell>
                          <TableCell>{row.description}</TableCell>
                          <TableCell>{new Date(row.date).toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip label={t(row.status)} color={statusColor(row.status)} size="small"
                              onClick={() => {
                                const statuses = ["scheduled", "active", "completed"];
                                const currentIdx = statuses.indexOf(row.status);
                                const nextStatus = statuses[(currentIdx + 1) % statuses.length];
                                updateEvent({ variables: { _id: row._id, input: { ...row, status: nextStatus } } });
                              }}
                              sx={{ cursor: "pointer" }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => { setEditingEvent(row); setEventForm({ ...row }); setOpenEventDialog(true); }}>
                              <Edit size={16} />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteEvent(row._id)}>
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  }
                </Table>
                <Stack alignItems="flex-end" p={2}>
                  <FooterPagination
                    page={eventPage}
                    limit={eventLimit}
                    setPage={setEventPage}
                    handleLimit={handleLimit(setEventLimit, setEventPage)}
                    totalDocs={eventsPaginator?.totalDocs}
                    totalPages={eventsPaginator?.totalPages}
                  />
                </Stack>
              </TableContainer>

              <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingEvent ? t("edit_event") : t("add_event")}</DialogTitle>
                <DialogContent>
                  <TextField autoFocus margin="dense" label={t("title")} fullWidth size="small" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
                  <TextField margin="dense" label={t("description")} fullWidth size="small" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
                  <TextField margin="dense" label={t("date")} type="datetime-local" fullWidth size="small" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} InputLabelProps={{ shrink: true }} />
                  <TextField select margin="dense" label={t("status")} fullWidth size="small" value={eventForm.status} onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}>
                    <MenuItem value="scheduled">{t("scheduled")}</MenuItem>
                    <MenuItem value="active">{t("active")}</MenuItem>
                    <MenuItem value="completed">{t("completed")}</MenuItem>
                  </TextField>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenEventDialog(false)}>{t("cancel")}</Button>
                  <Button variant="contained" onClick={handleSaveEvent}>{t("save")}</Button>
                </DialogActions>
              </Dialog>
            </TabPanel>

            {/* ========== Tab 15: Mobile Settings ========== */}
            <TabPanel value="15" sx={{ p: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>{t("mobile_settings")}</Typography>
                <Grid container spacing={2}>
                  {Object.entries(settings).map(([key, value]) => (
                    <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography>{t(key)}</Typography>
                        <Switch checked={value} onChange={() => setSettings({ ...settings, [key]: !value })} />
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => alert(t("save_not_implemented"))}>{t("save")}</Button>
              </Paper>
            </TabPanel>
          </Grid>
        </Grid>
      </TabContext>
    </Box>
  );
};

export default MobileApp;