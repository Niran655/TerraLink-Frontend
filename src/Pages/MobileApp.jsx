// import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
// import { useMutation, useQuery } from "@apollo/client/react";
// import { Restaurant } from "@mui/icons-material";
// import { Box, Breadcrumbs, Button, Card, Chip, Grid, IconButton, InputAdornment, MenuItem, Paper, Rating, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
// import { Calendar, ChevronLeft, ChevronRight, Clock, Coffee, Gift, Globe, Image, Info, MapIcon, MapPinIcon, Megaphone, Phone, Plus, Search, Send, Settings, Star, Store } from "lucide-react";
// import { TabContext, TabPanel } from "@mui/lab";
// import { useEffect, useState } from "react";
// import CuisineOriginAction from "../Components/mobile/cuisineOrigine/CuisineOrigineAction";
// import CuisineOriginForm from "../Components/mobile/cuisineOrigine/CuisineOrigineForm";
// import CuisineTypeAction from "../Components/mobile/cuisineType/CuisineTypeAction";
// import CuisineTypeForm from "../Components/mobile/cuisineType/CuisineTypeForm";
// import PromotionAction from "../Components/mobile/promotion/PromotionAction";
// import MealTypeAction from "../Components/mobile/mealType/MealTypeAction";
// import PromotionForm from "../Components/mobile/promotion/PromotionForm";
// import GalleryAction from "../Components/mobile/gallery/GalleryAction";
// import MealTypeForm from "../Components/mobile/mealType/MealTypeForm";
// import GalleryForm from "../Components/mobile/gallery/GalleryForm";
// import EventAction from "../Components/mobile/event/EventAction";
// import EventForm from "../Components/mobile/event/EventForm";
// import FooterPagination from "../include/FooterPagination";
// import "../Styles/modernTable.scss";
// import { useThemeContext } from "../Context/ThemeContext";
// import { UPDATE_SHOP_PROFILE } from "../../graphql/mutation";
// import { useAuth } from "../Context/AuthContext";
// import { GET_CUISINES_ORIGINS_WITH_PAGINATION, GET_CUISINES_TYPES_WITH_PAGINATION, GET_MEAL_TYPES_PAGINATION, GET_SHOP_EVENT_WITH_PAGINATION, GET_SHOP_GALLERY_WITH_PAGINATION, GET_SHOP_PROFILE, GET_SHOP_PROMOTION_WITH_PAGINATION } from "../../graphql/queries";
// import { translateLauguage } from "../function/translate";
// import EmptyData from "../include/EmptyData";
// import CircularIndeterminate from "../include/Loading";
// // ─── Helper: statusColor ─────────────────────────────────────────
// const statusColor = (status) => {
//   switch (status?.toLowerCase()) {
//     case "active":
//     case "published":
//     case "visible":
//     case "approved":
//     case "scheduled":
//       return "success";
//     case "pending":
//       return "warning";
//     case "inactive":
//     case "draft":
//     case "hidden":
//     case "rejected":
//     case "completed":
//       return "error";
//     default:
//       return "default";
//   }
// };
// // ─── Default hours (ensures every day has open/close fields) ───
// const defaultDayHours = {
//   open: "08:00",
//   close: "22:00",
//   open24: false,
//   closed: false,
// };
// const defaultHours = {
//   monday: { ...defaultDayHours },
//   tuesday: { ...defaultDayHours },
//   wednesday: { ...defaultDayHours },
//   thursday: { ...defaultDayHours },
//   friday: { ...defaultDayHours },
//   saturday: { ...defaultDayHours },
//   sunday: { ...defaultDayHours },
//   holiday: { open: "", close: "", open24: false, closed: true },
//   specialHours: "",
// };
// const mergeHours = (apiHours) => {
//   if (!apiHours) return defaultHours;
//   const merged = { ...defaultHours };
//   for (const day of Object.keys(defaultHours)) {
//     if (apiHours[day]) {
//       merged[day] = { ...defaultHours[day], ...apiHours[day] };
//     }
//   }
//   return merged;
// };
// // ─── Component ──────────────────────────────────────────────────────
// const MobileApp = () => {
//   const { language } = useAuth();
//   const { t } = translateLauguage(language);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const { layoutMode } = useThemeContext();
//   const { setAlert } = useAuth();
//   const [tab, setTab] = useState("1");
//   const [navMode, setNavMode] = useState(layoutMode === "compact" ? "compact" : "default");
//   const shopId = localStorage.getItem("activeShopId");
//   // ─── Helper: remove __typename ──────────────────────────────────
//   const removeTypename = (obj) => {
//     if (Array.isArray(obj)) {
//       return obj.map(removeTypename);
//     }
//     if (obj && typeof obj === "object") {
//       const newObj = {};
//       for (const [key, value] of Object.entries(obj)) {
//         if (key !== "__typename") {
//           newObj[key] = removeTypename(value);
//         }
//       }
//       return newObj;
//     }
//     return obj;
//   };
//   // ─── State ──────────────────────────────────────────────────────
//   const [about, setAbout] = useState({
//     shortDescription: "",
//     description: "",
//     history: "",
//     mission: "",
//     keywords: "",
//   });
//   const [shopInfo, setShopInfo] = useState({
//     name: "",
//     nameKh: "",
//     shopCode: "",
//     type: "",
//     logo: null,
//     cover: null,
//   });
//   const [hours, setHours] = useState(defaultHours);
//   const [address, setAddress] = useState({
//     country: "",
//     province: "",
//     district: "",
//     commune: "",
//     village: "",
//     street: "",
//     latitude: "",
//     longitude: "",
//     googleMap: "",
//     parking: "",
//   });
//   const [contact, setContact] = useState({
//     phone: "",
//     mobile: "",
//     telegram: "",
//     whatsapp: "",
//     facebook: "",
//     instagram: "",
//     tiktok: "",
//     website: "",
//     email: "",
//   });
//   const [rewards, setRewards] = useState({
//     enabled: true,
//     points: 5,
//     checkin: 10,
//     review: 20,
//     purchase: 1,
//     referral: 30,
//     birthday: 25,
//     vipLevel: "Gold",
//     coupon: "",
//   });
//   const [aiKnowledge, setAiKnowledge] = useState({
//     businessStory: "",
//     menu: "",
//     services: "",
//     popularItems: "",
//     faq: "",
//     reservationPolicy: "",
//     deliveryPolicy: "",
//     cancellationPolicy: "",
//     parking: "",
//     petFriendly: "",
//     paymentMethods: "",
//     additionalNotes: "",
//   });
//   const [settings, setSettings] = useState({
//     booking: true,
//     reviews: true,
//     rewards: true,
//     delivery: true,
//     aiChat: false,
//     qrCheckin: true,
//     events: true,
//     promotions: true,
//     callButton: true,
//     navigation: true,
//   });
//   // ─── Fetch Shop Profile ──────────────────────────────────────────
//   const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useQuery(GET_SHOP_PROFILE, {
//     variables: { shopId },
//     skip: !shopId,
//   });
//   useEffect(() => {
//     if (profileData) {
//       console.log("📦 Shop profile data:", profileData);
//       const shop = profileData?.getShopProfile;
//       if (shop) {
//         setAbout({
//           shortDescription: shop.shortDescription || "",
//           description: shop.description || "",
//           history: shop.history || "",
//           mission: shop.mission || "",
//           keywords: shop.keywords?.join(", ") || "",
//         });
//         setShopInfo({
//           name: shop.nameEn || "",
//           nameKh: shop.nameKh || "",
//           shopCode: shop.code || "",
//           type: shop.type || "",
//           logo: shop.image || null,
//           cover: null,
//         });
//         // Safely merge opening hours
//         setHours(mergeHours(shop.openingHours));
//         if (shop.location) setAddress(shop.location);
//         if (shop.contactInfo) setContact(shop.contactInfo);
//         if (shop.rewardsSettings) setRewards(shop.rewardsSettings);
//         if (shop.aiKnowledge) setAiKnowledge(shop.aiKnowledge);
//         if (shop.mobileSettings) setSettings(shop.mobileSettings);
//       }
//     }
//   }, [profileData]);
//   // ─── Update Shop Profile Mutation ────────────────────────────────
//   const [updateShopProfile] = useMutation(UPDATE_SHOP_PROFILE, {
//     onCompleted: (data) => {
//       console.log("✅ Mutation response:", data);
//       const result = data?.updateShopProfile;
//       if (result?.isSuccess) {
//         setAlert(true, "success", result.message?.messageEn || "Updated");
//         refetchProfile();
//       } else {
//         setAlert(true, "error", result.message?.messageEn || "Update failed");
//       }
//     },
//     onError: (err) => {
//       console.error("❌ Mutation error details:", {
//         message: err.message,
//         graphQLErrors: err.graphQLErrors,
//         networkError: err.networkError,
//         stack: err.stack,
//       });
//       setAlert(true, "error", err.message || "Network or server error");
//     },
//   });
//   const handleSaveSection = (input) => {
//     if (!shopId) {
//       setAlert(true, "error", "Shop ID is missing");
//       return;
//     }
//     const cleanedInput = removeTypename(input);
//     console.log("🔄 Saving cleaned input:", cleanedInput);
//     updateShopProfile({ variables: { shopId, input: cleanedInput } });
//   };
//   // ─── Cuisine Types (Tab 4) ──────────────────────────────────────
//   const [cuisineTypePage, setCuisineTypePage] = useState(1);
//   const [cuisineTypeLimit, setCuisineTypeLimit] = useState(5);
//   const [cuisineTypeKeyword, setCuisineTypeKeyword] = useState("");
//   const [cuisineTypeStatus, setCuisineTypeStatus] = useState("All");
//   const [openCuisineTypeDialog, setOpenCuisineTypeDialog] = useState(false);
//   const [editingCuisineType, setEditingCuisineType] = useState(null);
//   const {
//     data: cuisineTypesData,
//     loading: cuisineTypesLoading,
//     refetch: refetchCuisineTypes,
//   } = useQuery(GET_CUISINES_TYPES_WITH_PAGINATION, {
//     variables: {
//       shopId,
//       page: cuisineTypePage,
//       limit: cuisineTypeLimit,
//       keyword: cuisineTypeKeyword,
//       status: cuisineTypeStatus === "All" ? undefined : cuisineTypeStatus,
//     },
//     skip: !shopId,
//   });
//   const cuisineTypes = cuisineTypesData?.getCuisineTypesWithPagination?.data || [];
//   const cuisineTypesPaginator = cuisineTypesData?.getCuisineTypesWithPagination?.paginator;
//   // ─── Cuisine Origins (Tab 5) ──────────────────────────────────
//   const [cuisineOriginPage, setCuisineOriginPage] = useState(1);
//   const [cuisineOriginLimit, setCuisineOriginLimit] = useState(5);
//   const [cuisineOriginKeyword, setCuisineOriginKeyword] = useState("");
//   const [cuisineOriginStatus, setCuisineOriginStatus] = useState("All");
//   const [openCuisineOriginDialog, setOpenCuisineOriginDialog] = useState(false);
//   const [editingCuisineOrigin, setEditingCuisineOrigin] = useState(null);
//   const {
//     data: cuisineOriginsData,
//     loading: cuisineOriginsLoading,
//     refetch: refetchCuisineOrigins,
//   } = useQuery(GET_CUISINES_ORIGINS_WITH_PAGINATION, {
//     variables: {
//       shopId,
//       page: cuisineOriginPage,
//       limit: cuisineOriginLimit,
//       keyword: cuisineOriginKeyword,
//       status: cuisineOriginStatus === "All" ? undefined : cuisineOriginStatus,
//     },
//     skip: !shopId,
//   });
//   const cuisineOrigins = cuisineOriginsData?.getCuisineOriginsWithPagination?.data || [];
//   const cuisineOriginsPaginator = cuisineOriginsData?.getCuisineOriginsWithPagination?.paginator;
//   // ─── Meal Types (Tab 6) ──────────────────────────────────────
//   const [mealTypePage, setMealTypePage] = useState(1);
//   const [mealTypeLimit, setMealTypeLimit] = useState(5);
//   const [mealTypeKeyword, setMealTypeKeyword] = useState("");
//   const [mealTypeStatus, setMealTypeStatus] = useState("All");
//   const [openMealTypeDialog, setOpenMealTypeDialog] = useState(false);
//   const [editingMealType, setEditingMealType] = useState(null);
//   const {
//     data: mealTypesData,
//     loading: mealTypesLoading,
//     refetch: refetchMealTypes,
//   } = useQuery(GET_MEAL_TYPES_PAGINATION, {
//     variables: {
//       shopId,
//       page: mealTypePage,
//       limit: mealTypeLimit,
//       keyword: mealTypeKeyword,
//       status: mealTypeStatus === "All" ? undefined : mealTypeStatus,
//     },
//     skip: !shopId,
//   });
//   const mealTypes = mealTypesData?.getMealTypesWithPagination?.data || [];
//   const mealTypesPaginator = mealTypesData?.getMealTypesWithPagination?.paginator;
//   // ─── Gallery (Tab 7) ──────────────────────────────────────────
//   const [galleryPage, setGalleryPage] = useState(1);
//   const [galleryLimit, setGalleryLimit] = useState(5);
//   const [galleryKeyword, setGalleryKeyword] = useState("");
//   const [galleryStatus, setGalleryStatus] = useState("All");
//   const [openGalleryDialog, setOpenGalleryDialog] = useState(false);
//   const [editingGalleryImage, setEditingGalleryImage] = useState(null);
//   const {
//     data: galleryData,
//     loading: galleryLoading,
//     refetch: refetchGallery,
//   } = useQuery(GET_SHOP_GALLERY_WITH_PAGINATION, {
//     variables: {
//       shopId,
//       page: galleryPage,
//       limit: galleryLimit,
//       keyword: galleryKeyword,
//       status: galleryStatus === "All" ? undefined : galleryStatus,
//     },
//     skip: !shopId,
//   });
//   const gallery = galleryData?.getShopGalleryWithPagination?.data || [];
//   const galleryPaginator = galleryData?.getShopGalleryWithPagination?.paginator;
//   // ─── Promotions (Tab 13) ──────────────────────────────────────
//   const [promotionPage, setPromotionPage] = useState(1);
//   const [promotionLimit, setPromotionLimit] = useState(5);
//   const [promotionKeyword, setPromotionKeyword] = useState("");
//   const [promotionStatus, setPromotionStatus] = useState("All");
//   const [openPromotionDialog, setOpenPromotionDialog] = useState(false);
//   const [editingPromotion, setEditingPromotion] = useState(null);
//   const {
//     data: promotionsData,
//     loading: promotionsLoading,
//     refetch: refetchPromotions,
//   } = useQuery(GET_SHOP_PROMOTION_WITH_PAGINATION, {
//     variables: {
//       shopId,
//       page: promotionPage,
//       limit: promotionLimit,
//       keyword: promotionKeyword,
//       status: promotionStatus === "All" ? undefined : promotionStatus,
//     },
//     skip: !shopId,
//   });
//   const promotions = promotionsData?.getShopPromotions?.data || [];
//   const promotionsPaginator = promotionsData?.getShopPromotions?.paginator;
//   // ─── Events (Tab 14) ──────────────────────────────────────────
//   const [eventPage, setEventPage] = useState(1);
//   const [eventLimit, setEventLimit] = useState(5);
//   const [eventKeyword, setEventKeyword] = useState("");
//   const [eventStatus, setEventStatus] = useState("All");
//   const [openEventDialog, setOpenEventDialog] = useState(false);
//   const [editingEvent, setEditingEvent] = useState(null);
//   const {
//     data: eventsData,
//     loading: eventsLoading,
//     refetch: refetchEvents,
//   } = useQuery(GET_SHOP_EVENT_WITH_PAGINATION, {
//     variables: {
//       shopId,
//       page: eventPage,
//       limit: eventLimit,
//       keyword: eventKeyword,
//       status: eventStatus === "All" ? undefined : eventStatus,
//     },
//     skip: !shopId,
//   });
//   const events = eventsData?.getShopEvents?.data || [];
//   const eventsPaginator = eventsData?.getShopEvents?.paginator;
//   // ─── Render Toolbar ──────────────────────────────────────────────
//   const renderToolbar = ({
//     keyword,
//     setKeyword,
//     setPage,
//     status,
//     setStatus,
//     statusItems,
//     extraFields,
//     action,
//   }) => (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: { xs: "stretch", md: "center" },
//         flexDirection: { xs: "column", md: "row" },
//         gap: 2,
//         mb: 2,
//       }}
//     >
//       <Grid container spacing={2} alignItems="center" sx={{ flex: 1 }}>
//         <Grid size={{ xs: 12, sm: 3 }}>
//           <Typography variant="body2" fontWeight={500} mb={0.5}>
//             {t("search")}
//           </Typography>
//           <TextField
//             type="search"
//             size="small"
//             placeholder={t("search") + "..."}
//             value={keyword}
//             fullWidth
//             onChange={(e) => {
//               setKeyword(e.target.value);
//               setPage(1);
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search size={18} />
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Grid>
//         {statusItems && (
//           <Grid size={{ xs: 12, sm: 2 }}>
//             <Typography variant="body2" fontWeight={500} mb={0.5}>
//               {t("status")}
//             </Typography>
//             <TextField
//               select
//               fullWidth
//               size="small"
//               value={status}
//               onChange={(e) => {
//                 setStatus(e.target.value);
//                 setPage(1);
//               }}
//             >
//               {statusItems.map((item) => (
//                 <MenuItem key={item.value} value={item.value}>
//                   {item.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//         )}
//         {extraFields &&
//           extraFields.map((field, idx) => (
//             <Grid key={idx} size={{ xs: 12, sm: 2 }}>
//               <Typography variant="body2" fontWeight={500} mb={0.5}>
//                 {field.label}
//               </Typography>
//               {field.type === "select" ? (
//                 <TextField
//                   select
//                   fullWidth
//                   size="small"
//                   value={field.value}
//                   onChange={(e) => {
//                     field.setValue(e.target.value);
//                     setPage(1);
//                   }}
//                 >
//                   {field.options.map((opt) => (
//                     <MenuItem key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               ) : (
//                 <TextField
//                   type="date"
//                   fullWidth
//                   size="small"
//                   value={field.value}
//                   onChange={(e) => {
//                     field.setValue(e.target.value);
//                     setPage(1);
//                   }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               )}
//             </Grid>
//           ))}
//       </Grid>
//       {action && (
//         <Stack direction="row" sx={{ alignSelf: { xs: "flex-end", md: "auto" } }}>
//           {action}
//         </Stack>
//       )}
//     </Box>
//   );
//   const handleLimit = (setter, pageSetter) => (e) => {
//     setter(parseInt(e.target.value, 10));
//     pageSetter(1);
//   };
//   // ─── Navigation Tabs ──────────────────────────────────────────
//   const isNavCompact = navMode === "compact" && !isMobile;
//   const navTabs = [
//     { value: "1", label: t("about"), icon: Info },
//     { value: "2", label: t("shop_information"), icon: Store },
//     { value: "3", label: t("business_hours"), icon: Clock },
//     { value: "4", label: t("cuisine_types"), icon: Restaurant },
//     { value: "5", label: t("cuisine_origins"), icon: Globe },
//     { value: "6", label: t("meal_types"), icon: Coffee },
//     { value: "7", label: t("gallery"), icon: Image },
//     { value: "8", label: t("address_location"), icon: MapIcon },
//     { value: "9", label: t("contact_information"), icon: Phone },
//     { value: "10", label: t("customer_reviews"), icon: Star },
//     { value: "11", label: t("rewards_program"), icon: Gift },
//     { value: "12", label: t("ai_assistant"), icon: Gift },
//     { value: "13", label: t("promotions"), icon: Megaphone },
//     { value: "14", label: t("events"), icon: Calendar },
//     { value: "15", label: t("mobile_settings"), icon: Settings },
//   ];
//   if (profileLoading) return <CircularIndeterminate />;
//   // ─── Main render ──────────────────────────────────────────────────
//   return (
//     <Box sx={{ width: "100%", p: 2 }}>
//       <Breadcrumbs separator="/">
//         <Typography sx={{ borderLeft: "3px solid #1D4592", pl: 1.5 }}>
//           {t("shop_management")}
//         </Typography>
//       </Breadcrumbs>
//       <TabContext value={tab}>
//         <Grid container spacing={2} sx={{ mt: 2 }}>
//           {/* Navigation */}
//           <Grid
//             size={{
//               xs: 12,
//               sm: isNavCompact ? 1 : 3,
//               md: isNavCompact ? 1 : 2,
//             }}
//           >
//             <Paper
//               elevation={0}
//               sx={{
//                 p: isNavCompact ? 1 : 2,
//                 height: "70vh",
//                 borderRadius: 1,
//                 position: "relative",
//                 overflowY: "auto",
//               }}
//             >
//               {!isMobile && (
//                 <Tooltip title={isNavCompact ? "Show labels" : "Compact"} placement="right" arrow>
//                   <IconButton
//                     size="small"
//                     onClick={() => setNavMode((prev) => (prev === "compact" ? "default" : "compact"))}
//                     sx={{
//                       position: "absolute",
//                       right: -14,
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       width: 28,
//                       height: 28,
//                       zIndex: 2,
//                       bgcolor: "background.paper",
//                       border: `1px solid ${theme.palette.divider}`,
//                       boxShadow: theme.shadows[2],
//                       "&:hover": { bgcolor: "background.paper" },
//                     }}
//                   >
//                     {isNavCompact ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
//                   </IconButton>
//                 </Tooltip>
//               )}
//               <Stack direction="column" spacing={0.5} alignItems={isNavCompact ? "center" : "stretch"}>
//                 {navTabs.map((item) => {
//                   const Icon = item.icon;
//                   const active = tab === item.value;
//                   const button = (
//                     <Button
//                       fullWidth={!isNavCompact}
//                       variant={active ? "contained" : "text"}
//                       onClick={() => setTab(item.value)}
//                       aria-label={item.label}
//                       sx={{
//                         minWidth: isNavCompact ? 40 : 0,
//                         width: isNavCompact ? 40 : "100%",
//                         height: 36,
//                         px: isNavCompact ? 0 : 1.5,
//                         justifyContent: isNavCompact ? "center" : "flex-start",
//                         textTransform: "none",
//                         fontSize: "0.8rem",
//                       }}
//                     >
//                       <Icon size={16} />
//                       {!isNavCompact && <Box component="span" sx={{ ml: 1 }}>{item.label}</Box>}
//                     </Button>
//                   );
//                   return isNavCompact ? (
//                     <Tooltip key={item.value} title={item.label} placement="right" arrow>
//                       {button}
//                     </Tooltip>
//                   ) : (
//                     <Box key={item.value}>{button}</Box>
//                   );
//                 })}
//               </Stack>
//             </Paper>
//           </Grid>
//           {/* Content */}
//           <Grid
//             size={{
//               xs: 12,
//               sm: isNavCompact ? 11 : 9,
//               md: isNavCompact ? 11 : 10,
//             }}
//           >
//             {/* ========== Tab 1: About ========== */}
//             <TabPanel value="1" sx={{ p: 0 }}>
//               <Paper sx={{ p: 3, textAlign: "left" }}>
//                 <Typography variant="h6" gutterBottom>
//                   {t("about")}
//                 </Typography>
//                 <Typography variant="body2" mb={2} color="text.secondary">
//                   {t("edit_business_description")}
//                 </Typography>
//                 <Grid container spacing={3}>
//                   <Grid size={{ xs: 12 }}>
//                     <Typography variant="body2" color="text.secondary">
//                       {t("short_description")}
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       value={about.shortDescription}
//                       onChange={(e) => setAbout({ ...about, shortDescription: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12 }}>
//                     <Typography variant="body2" color="text.secondary">
//                       {t("long_description")}
//                     </Typography>
//                     <TextField
//                       multiline
//                       rows={4}
//                       fullWidth
//                       size="small"
//                       value={about.description}
//                       onChange={(e) => setAbout({ ...about, description: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Typography variant="body2" color="text.secondary">
//                       {t("history")}
//                     </Typography>
//                     <TextField
//                       multiline
//                       rows={3}
//                       fullWidth
//                       size="small"
//                       value={about.history}
//                       onChange={(e) => setAbout({ ...about, history: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Typography variant="body2" color="text.secondary">
//                       {t("mission")}
//                     </Typography>
//                     <TextField
//                       multiline
//                       rows={3}
//                       fullWidth
//                       size="small"
//                       value={about.mission}
//                       onChange={(e) => setAbout({ ...about, mission: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12 }}>
//                     <Typography variant="body2" color="text.secondary">
//                       {t("keywords")}
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       placeholder="Khmer food, authentic, local..."
//                       value={about.keywords}
//                       onChange={(e) => setAbout({ ...about, keywords: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12 }}>
//                     <Button
//                       variant="contained"
//                       onClick={() => {
//                         const input = {
//                           shortDescription: about.shortDescription,
//                           description: about.description,
//                           history: about.history,
//                           mission: about.mission,
//                           keywords: about.keywords
//                             .split(",")
//                             .map((k) => k.trim())
//                             .filter(Boolean),
//                         };
//                         handleSaveSection(input);
//                       }}
//                     >
//                       {t("save")}
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </TabPanel>
//             {/* ========== Tab 2: Shop Information ========== */}
//             <TabPanel value="2" sx={{ p: 0 }}>
//               <Paper sx={{ p: 3 }}>
//                 <Typography variant="h6" mb={2} textAlign="left">
//                   {t("shop_information")}
//                 </Typography>
//                 <Grid container spacing={3}>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Stack spacing={2}>
//                       <TextField
//                         label={t("business_name")}
//                         fullWidth
//                         size="small"
//                         value={shopInfo.name}
//                         onChange={(e) => setShopInfo({ ...shopInfo, name: e.target.value })}
//                       />
//                       <TextField
//                         label={t("khmer_name")}
//                         fullWidth
//                         size="small"
//                         value={shopInfo.nameKh}
//                         onChange={(e) => setShopInfo({ ...shopInfo, nameKh: e.target.value })}
//                       />
//                       <TextField
//                         label={t("shop_code")}
//                         fullWidth
//                         size="small"
//                         value={shopInfo.shopCode}
//                         onChange={(e) => setShopInfo({ ...shopInfo, shopCode: e.target.value })}
//                       />
//                       <TextField
//                         select
//                         label={t("business_type")}
//                         fullWidth
//                         size="small"
//                         value={shopInfo.type}
//                         onChange={(e) => setShopInfo({ ...shopInfo, type: e.target.value })}
//                       >
//                         {["Restaurant", "Cafe", "Hotel", "Bakery", "Bar", "Shopping Mall", "Spa", "Gym", "Tourism"].map(
//                           (type) => (
//                             <MenuItem key={type} value={type}>
//                               {type}
//                             </MenuItem>
//                           )
//                         )}
//                       </TextField>
//                     </Stack>
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Stack spacing={2}>
//                       <Box>
//                         <Typography>{t("logo")}</Typography>
//                         <Button variant="contained" component="label">
//                           {t("upload")}
//                           <input type="file" hidden />
//                         </Button>
//                       </Box>
//                       <Box>
//                         <Typography>{t("cover_photo")}</Typography>
//                         <Button variant="contained" component="label">
//                           {t("upload")}
//                           <input type="file" hidden />
//                         </Button>
//                       </Box>
//                       <Button
//                         variant="contained"
//                         onClick={() => {
//                           const input = {
//                             nameEn: shopInfo.name || "",
//                             nameKh: shopInfo.nameKh || "",
//                             code: shopInfo.shopCode || "",
//                             type: shopInfo.type || "",
//                             image: shopInfo.logo || "",
//                           };
//                           handleSaveSection(input);
//                         }}
//                       >
//                         {t("save")}
//                       </Button>
//                     </Stack>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </TabPanel>
//             {/* ========== Tab 3: Business Hours ========== */}
//             <TabPanel value="3" sx={{ p: 0 }}>
//               <Paper sx={{ p: 3 }}>
//                 <Typography textAlign="left" variant="h6" gutterBottom>
//                   {t("business_hours")}
//                 </Typography>
//                 <Grid container spacing={2}>
//                   {Object.entries(hours).map(([day, times]) => {
//                     if (day === "holiday") return null;
//                     return (
//                       <Grid key={day} size={{ xs: 12, sm: 6, md: 4 }}>
//                         <Card variant="outlined" sx={{ p: 2 }}>
//                           <Typography sx={{ textTransform: "capitalize", fontWeight: 600 }}>{day}</Typography>
//                           <Stack spacing={1} sx={{ mt: 1 }}>
//                             <Stack direction="row" spacing={1} alignItems="center">
//                               <TextField
//                                 type="time"
//                                 size="small"
//                                 label={t("open")}
//                                 value={times.open}
//                                 onChange={(e) =>
//                                   setHours({
//                                     ...hours,
//                                     [day]: { ...times, open: e.target.value },
//                                   })
//                                 }
//                                 InputLabelProps={{ shrink: true }}
//                                 disabled={times.closed}
//                                 sx={{ width: 100 }}
//                               />
//                               <TextField
//                                 type="time"
//                                 size="small"
//                                 label={t("close")}
//                                 value={times.close}
//                                 onChange={(e) =>
//                                   setHours({
//                                     ...hours,
//                                     [day]: { ...times, close: e.target.value },
//                                   })
//                                 }
//                                 InputLabelProps={{ shrink: true }}
//                                 disabled={times.closed || times.open24}
//                                 sx={{ width: 100 }}
//                               />
//                             </Stack>
//                             <Stack direction="row" spacing={2} alignItems="center">
//                               <Stack direction="row" alignItems="center" spacing={0.5}>
//                                 <Switch
//                                   size="small"
//                                   checked={times.open24}
//                                   onChange={() =>
//                                     setHours({
//                                       ...hours,
//                                       [day]: { ...times, open24: !times.open24, closed: false },
//                                     })
//                                   }
//                                   disabled={times.closed}
//                                 />
//                                 <Typography variant="caption">24h</Typography>
//                               </Stack>
//                               <Stack direction="row" alignItems="center" spacing={0.5}>
//                                 <Switch
//                                   size="small"
//                                   checked={times.closed}
//                                   onChange={() =>
//                                     setHours({
//                                       ...hours,
//                                       [day]: { ...times, closed: !times.closed, open24: false },
//                                     })
//                                   }
//                                 />
//                                 <Typography variant="caption">{t("closed")}</Typography>
//                               </Stack>
//                             </Stack>
//                           </Stack>
//                         </Card>
//                       </Grid>
//                     );
//                   })}
//                   <Grid size={{ xs: 12 }}>
//                     <Card variant="outlined" sx={{ p: 2 }}>
//                       <Typography sx={{ fontWeight: 600 }}>{t("holiday")}</Typography>
//                       <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
//                         <Switch
//                           checked={hours.holiday.closed}
//                           onChange={() =>
//                             setHours({
//                               ...hours,
//                               holiday: { ...hours.holiday, closed: !hours.holiday.closed },
//                             })
//                           }
//                         />
//                         <Typography variant="caption">{t("closed_on_holidays")}</Typography>
//                       </Stack>
//                     </Card>
//                   </Grid>
//                   <Grid size={{ xs: 12 }}>
//                     <Button
//                       variant="contained"
//                       onClick={() => {
//                         const input = { openingHours: hours };
//                         handleSaveSection(input);
//                       }}
//                     >
//                       {t("save")}
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </TabPanel>
//             {/* ========== Tab 4: Cuisine Types ========== */}
//             <TabPanel value="4" sx={{ p: 0 }}>
//               {renderToolbar({
//                 keyword: cuisineTypeKeyword,
//                 setKeyword: setCuisineTypeKeyword,
//                 setPage: setCuisineTypePage,
//                 status: cuisineTypeStatus,
//                 setStatus: setCuisineTypeStatus,
//                 statusItems: [
//                   { value: "All", label: t("all") },
//                   { value: "active", label: t("active") },
//                   { value: "inactive", label: t("inactive") },
//                 ],
//                 action: (
//                   <Button
//                     variant="contained"
//                     startIcon={<LibraryAddOutlinedIcon size={18} />}
//                     onClick={() => {
//                       setEditingCuisineType(null);
//                       setOpenCuisineTypeDialog(true);
//                     }}
//                   >
//                     {t("create")}
//                   </Button>
//                 ),
//               })}
//               <CuisineTypeForm
//                 open={openCuisineTypeDialog}
//                 onClose={() => setOpenCuisineTypeDialog(false)}
//                 cuisineTypeData={editingCuisineType}
//                 setRefetch={refetchCuisineTypes}
//                 shopId={shopId}
//                 t={t}
//               />
//               <TableContainer className="table-container">
//                 <Table className="table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>{t("no")}</TableCell>
//                       <TableCell>{t("khmer_name")}</TableCell>
//                       <TableCell>{t("english_name")}</TableCell>
//                       <TableCell>{t("status")}</TableCell>
//                       <TableCell align="right">{t("action")}</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   {cuisineTypesLoading ? (
//                     <CircularIndeterminate />
//                   ) : cuisineTypes.length === 0 ? (
//                     <EmptyData />
//                   ) : (
//                     <TableBody>
//                       {cuisineTypes.map((row, index) => (
//                         <TableRow key={row._id} className="table-row">
//                           <TableCell>{(cuisineTypesPaginator?.slNo || 0) + index}</TableCell>
//                           <TableCell>{row.nameKh}</TableCell>
//                           <TableCell>{row.nameEn}</TableCell>
//                           <TableCell>
//                             <Chip
//                               label={t(row.status)}
//                               color={statusColor(row.status)}
//                               size="small"
//                               sx={{ cursor: "pointer" }}
//                             />
//                           </TableCell>
//                           <TableCell align="right">
//                             <CuisineTypeAction
//                               data={row}
//                               setRefetch={refetchCuisineTypes}
//                               t={t}
//                               shopId={shopId}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   )}
//                 </Table>
//                 <Stack alignItems="flex-end" p={2}>
//                   <FooterPagination
//                     page={cuisineTypePage}
//                     limit={cuisineTypeLimit}
//                     setPage={setCuisineTypePage}
//                     handleLimit={handleLimit(setCuisineTypeLimit, setCuisineTypePage)}
//                     totalDocs={cuisineTypesPaginator?.totalDocs}
//                     totalPages={cuisineTypesPaginator?.totalPages}
//                   />
//                 </Stack>
//               </TableContainer>
//             </TabPanel>
//             {/* ========== Tab 5: Cuisine Origins ========== */}
//             <TabPanel value="5" sx={{ p: 0 }}>
//               {renderToolbar({
//                 keyword: cuisineOriginKeyword,
//                 setKeyword: setCuisineOriginKeyword,
//                 setPage: setCuisineOriginPage,
//                 status: cuisineOriginStatus,
//                 setStatus: setCuisineOriginStatus,
//                 statusItems: [
//                   { value: "All", label: t("all") },
//                   { value: "active", label: t("active") },
//                   { value: "inactive", label: t("inactive") },
//                 ],
//                 action: (
//                   <Button
//                     variant="contained"
//                     startIcon={<LibraryAddOutlinedIcon size={18} />}
//                     onClick={() => {
//                       setEditingCuisineOrigin(null);
//                       setOpenCuisineOriginDialog(true);
//                     }}
//                   >
//                     {t("create")}
//                   </Button>
//                 ),
//               })}
//               <CuisineOriginForm
//                 open={openCuisineOriginDialog}
//                 onClose={() => setOpenCuisineOriginDialog(false)}
//                 cuisineOriginData={editingCuisineOrigin}
//                 setRefetch={refetchCuisineOrigins}
//                 shopId={shopId}
//                 t={t}
//               />
//               <TableContainer className="table-container">
//                 <Table className="table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>{t("no")}</TableCell>
//                       <TableCell>{t("khmer_name")}</TableCell>
//                       <TableCell>{t("english_name")}</TableCell>
//                       <TableCell>{t("status")}</TableCell>
//                       <TableCell align="right">{t("action")}</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   {cuisineOriginsLoading ? (
//                     <CircularIndeterminate />
//                   ) : cuisineOrigins.length === 0 ? (
//                     <EmptyData />
//                   ) : (
//                     <TableBody>
//                       {cuisineOrigins.map((row, index) => (
//                         <TableRow key={row._id} className="table-row">
//                           <TableCell>{(cuisineOriginsPaginator?.slNo || 0) + index}</TableCell>
//                           <TableCell>{row.nameKh}</TableCell>
//                           <TableCell>{row.nameEn}</TableCell>
//                           <TableCell>
//                             <Chip
//                               label={t(row.status)}
//                               color={statusColor(row.status)}
//                               size="small"
//                               sx={{ cursor: "pointer" }}
//                             />
//                           </TableCell>
//                           <TableCell align="right">
//                             <CuisineOriginAction
//                               data={row}
//                               setRefetch={refetchCuisineOrigins}
//                               t={t}
//                               shopId={shopId}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   )}
//                 </Table>
//                 <Stack alignItems="flex-end" p={2}>
//                   <FooterPagination
//                     page={cuisineOriginPage}
//                     limit={cuisineOriginLimit}
//                     setPage={setCuisineOriginPage}
//                     handleLimit={handleLimit(setCuisineOriginLimit, setCuisineOriginPage)}
//                     totalDocs={cuisineOriginsPaginator?.totalDocs}
//                     totalPages={cuisineOriginsPaginator?.totalPages}
//                   />
//                 </Stack>
//               </TableContainer>
//             </TabPanel>
//             {/* ========== Tab 6: Meal Types ========== */}
//             <TabPanel value="6" sx={{ p: 0 }}>
//               {renderToolbar({
//                 keyword: mealTypeKeyword,
//                 setKeyword: setMealTypeKeyword,
//                 setPage: setMealTypePage,
//                 status: mealTypeStatus,
//                 setStatus: setMealTypeStatus,
//                 statusItems: [
//                   { value: "All", label: t("all") },
//                   { value: "active", label: t("active") },
//                   { value: "inactive", label: t("inactive") },
//                 ],
//                 action: (
//                   <Button
//                     variant="contained"
//                     startIcon={<LibraryAddOutlinedIcon size={18} />}
//                     onClick={() => {
//                       setEditingMealType(null);
//                       setOpenMealTypeDialog(true);
//                     }}
//                   >
//                     {t("create")}
//                   </Button>
//                 ),
//               })}
//               <MealTypeForm
//                 open={openMealTypeDialog}
//                 onClose={() => setOpenMealTypeDialog(false)}
//                 mealTypeData={editingMealType}
//                 setRefetch={refetchMealTypes}
//                 shopId={shopId}
//                 t={t}
//               />
//               <TableContainer className="table-container">
//                 <Table className="table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>{t("no")}</TableCell>
//                       <TableCell>{t("khmer_name")}</TableCell>
//                       <TableCell>{t("english_name")}</TableCell>
//                       <TableCell>{t("status")}</TableCell>
//                       <TableCell align="right">{t("action")}</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   {mealTypesLoading ? (
//                     <CircularIndeterminate />
//                   ) : mealTypes.length === 0 ? (
//                     <EmptyData />
//                   ) : (
//                     <TableBody>
//                       {mealTypes.map((row, index) => (
//                         <TableRow key={row._id} className="table-row">
//                           <TableCell>{(mealTypesPaginator?.slNo || 0) + index}</TableCell>
//                           <TableCell>{row.nameKh}</TableCell>
//                           <TableCell>{row.nameEn}</TableCell>
//                           <TableCell>
//                             <Chip
//                               label={t(row.status)}
//                               color={statusColor(row.status)}
//                               size="small"
//                               sx={{ cursor: "pointer" }}
//                             />
//                           </TableCell>
//                           <TableCell align="right">
//                             <MealTypeAction data={row} setRefetch={refetchMealTypes} t={t} shopId={shopId} />
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   )}
//                 </Table>
//                 <Stack alignItems="flex-end" p={2}>
//                   <FooterPagination
//                     page={mealTypePage}
//                     limit={mealTypeLimit}
//                     setPage={setMealTypePage}
//                     handleLimit={handleLimit(setMealTypeLimit, setMealTypePage)}
//                     totalDocs={mealTypesPaginator?.totalDocs}
//                     totalPages={mealTypesPaginator?.totalPages}
//                   />
//                 </Stack>
//               </TableContainer>
//             </TabPanel>
//             {/* ========== Tab 7: Gallery ========== */}
//             <TabPanel value="7" sx={{ p: 0 }}>
//               {renderToolbar({
//                 keyword: galleryKeyword,
//                 setKeyword: setGalleryKeyword,
//                 setPage: setGalleryPage,
//                 status: galleryStatus,
//                 setStatus: setGalleryStatus,
//                 statusItems: [
//                   { value: "All", label: t("all") },
//                   { value: "active", label: t("active") },
//                   { value: "inactive", label: t("inactive") },
//                 ],
//                 action: (
//                   <Button
//                     variant="contained"
//                     startIcon={<LibraryAddOutlinedIcon size={18} />}
//                     onClick={() => {
//                       setEditingGalleryImage(null);
//                       setOpenGalleryDialog(true);
//                     }}
//                   >
//                     {t("upload_image")}
//                   </Button>
//                 ),
//               })}
//               <GalleryForm
//                 open={openGalleryDialog}
//                 onClose={() => setOpenGalleryDialog(false)}
//                 galleryData={editingGalleryImage}
//                 setRefetch={refetchGallery}
//                 shopId={shopId}
//                 t={t}
//               />
//               <TableContainer className="table-container">
//                 <Table className="table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>{t("image")}</TableCell>
//                       <TableCell>{t("title")}</TableCell>
//                       <TableCell>{t("category")}</TableCell>
//                       <TableCell>{t("cover")}</TableCell>
//                       <TableCell>{t("status")}</TableCell>
//                       <TableCell align="right">{t("action")}</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   {galleryLoading ? (
//                     <CircularIndeterminate />
//                   ) : gallery.length === 0 ? (
//                     <EmptyData />
//                   ) : (
//                     <TableBody>
//                       {gallery.map((row) => (
//                         <TableRow key={row._id} className="table-row">
//                           <TableCell>
//                             <img
//                               src={row.image}
//                               alt={row.title}
//                               style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
//                             />
//                           </TableCell>
//                           <TableCell>{row.title}</TableCell>
//                           <TableCell>{row.category}</TableCell>
//                           <TableCell>
//                             {row.cover ? (
//                               <Chip label={t("cover")} size="small" color="primary" />
//                             ) : (
//                               <Button size="small">{t("set_cover")}</Button>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             <Chip label={t(row.status)} color={statusColor(row.status)} size="small" />
//                           </TableCell>
//                           <TableCell align="right">
//                             <GalleryAction
//                               data={row}
//                               setRefetch={refetchGallery}
//                               t={t}
//                               shopId={shopId}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   )}
//                 </Table>
//                 <Stack alignItems="flex-end" p={2}>
//                   <FooterPagination
//                     page={galleryPage}
//                     limit={galleryLimit}
//                     setPage={setGalleryPage}
//                     handleLimit={handleLimit(setGalleryLimit, setGalleryPage)}
//                     totalDocs={galleryPaginator?.totalDocs}
//                     totalPages={galleryPaginator?.totalPages}
//                   />
//                 </Stack>
//               </TableContainer>
//             </TabPanel>
//             {/* ========== Tab 8: Address & Location ========== */}
//             <TabPanel value="8" sx={{ p: 0 }}>
//               <Paper sx={{ p: 3 }}>
//                 <Typography variant="h6" gutterBottom>
//                   {t("address_location")}
//                 </Typography>
//                 <Grid container spacing={3}>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Stack spacing={2}>
//                       <TextField
//                         select
//                         label={t("country")}
//                         fullWidth
//                         size="small"
//                         value={address.country}
//                         onChange={(e) => setAddress({ ...address, country: e.target.value })}
//                       >
//                         <MenuItem value="Cambodia">Cambodia</MenuItem>
//                         <MenuItem value="Thailand">Thailand</MenuItem>
//                         <MenuItem value="Vietnam">Vietnam</MenuItem>
//                       </TextField>
//                       <TextField
//                         label={t("province")}
//                         fullWidth
//                         size="small"
//                         value={address.province}
//                         onChange={(e) => setAddress({ ...address, province: e.target.value })}
//                       />
//                       <TextField
//                         label={t("district")}
//                         fullWidth
//                         size="small"
//                         value={address.district}
//                         onChange={(e) => setAddress({ ...address, district: e.target.value })}
//                       />
//                       <TextField
//                         label={t("commune")}
//                         fullWidth
//                         size="small"
//                         value={address.commune}
//                         onChange={(e) => setAddress({ ...address, commune: e.target.value })}
//                       />
//                       <TextField
//                         label={t("village")}
//                         fullWidth
//                         size="small"
//                         value={address.village}
//                         onChange={(e) => setAddress({ ...address, village: e.target.value })}
//                       />
//                       <TextField
//                         label={t("street")}
//                         fullWidth
//                         size="small"
//                         value={address.street}
//                         onChange={(e) => setAddress({ ...address, street: e.target.value })}
//                       />
//                     </Stack>
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Stack spacing={2}>
//                       <TextField
//                         label={t("latitude")}
//                         fullWidth
//                         size="small"
//                         value={address.latitude}
//                         onChange={(e) => setAddress({ ...address, latitude: e.target.value })}
//                       />
//                       <TextField
//                         label={t("longitude")}
//                         fullWidth
//                         size="small"
//                         value={address.longitude}
//                         onChange={(e) => setAddress({ ...address, longitude: e.target.value })}
//                       />
//                       <TextField
//                         label={t("google_map")}
//                         fullWidth
//                         size="small"
//                         value={address.googleMap}
//                         onChange={(e) => setAddress({ ...address, googleMap: e.target.value })}
//                       />
//                       <TextField
//                         label={t("parking")}
//                         fullWidth
//                         size="small"
//                         value={address.parking}
//                         onChange={(e) => setAddress({ ...address, parking: e.target.value })}
//                       />
//                       <Button variant="outlined" startIcon={<MapPinIcon size={16} />}>
//                         📍 {t("pick_on_map")}
//                       </Button>
//                       <Button
//                         variant="contained"
//                         onClick={() => {
//                           const input = { location: address };
//                           handleSaveSection(input);
//                         }}
//                       >
//                         {t("save")}
//                       </Button>
//                     </Stack>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </TabPanel>
//             {/* ========== Tab 9: Contact Information ========== */}
//             <TabPanel value="9" sx={{ p: 0 }}>
//               <Paper sx={{ p: 3 }}>
//                 <Typography variant="h6" gutterBottom>
//                   {t("contact_information")}
//                 </Typography>
//                 <Grid container spacing={3}>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Stack spacing={2}>
//                       <TextField
//                         label={t("phone")}
//                         fullWidth
//                         size="small"
//                         value={contact.phone}
//                         onChange={(e) => setContact({ ...contact, phone: e.target.value })}
//                       />
//                       <TextField
//                         label={t("mobile")}
//                         fullWidth
//                         size="small"
//                         value={contact.mobile}
//                         onChange={(e) => setContact({ ...contact, mobile: e.target.value })}
//                       />
//                       <TextField
//                         label="Telegram"
//                         fullWidth
//                         size="small"
//                         value={contact.telegram}
//                         onChange={(e) => setContact({ ...contact, telegram: e.target.value })}
//                       />
//                       <TextField
//                         label="WhatsApp"
//                         fullWidth
//                         size="small"
//                         value={contact.whatsapp}
//                         onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
//                       />
//                       <TextField
//                         label="Facebook"
//                         fullWidth
//                         size="small"
//                         value={contact.facebook}
//                         onChange={(e) => setContact({ ...contact, facebook: e.target.value })}
//                       />
//                     </Stack>
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Stack spacing={2}>
//                       <TextField
//                         label="Instagram"
//                         fullWidth
//                         size="small"
//                         value={contact.instagram}
//                         onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
//                       />
//                       <TextField
//                         label="TikTok"
//                         fullWidth
//                         size="small"
//                         value={contact.tiktok}
//                         onChange={(e) => setContact({ ...contact, tiktok: e.target.value })}
//                       />
//                       <TextField
//                         label={t("website")}
//                         fullWidth
//                         size="small"
//                         value={contact.website}
//                         onChange={(e) => setContact({ ...contact, website: e.target.value })}
//                       />
//                       <TextField
//                         label={t("email")}
//                         fullWidth
//                         size="small"
//                         value={contact.email}
//                         onChange={(e) => setContact({ ...contact, email: e.target.value })}
//                       />
//                       <Button
//                         variant="contained"
//                         onClick={() => {
//                           const input = { contactInfo: contact };
//                           handleSaveSection(input);
//                         }}
//                       >
//                         {t("save")}
//                       </Button>
//                     </Stack>
//                   </Grid>
//                   <Grid size={{ xs: 12 }}>
//                     <Paper variant="outlined" sx={{ p: 2 }}>
//                       <Typography variant="subtitle2" gutterBottom>
//                         {t("preview")}
//                       </Typography>
//                       <Stack direction="row" spacing={2}>
//                         <Button size="small" startIcon={<Phone size={14} />}>
//                           ☎ {t("call")}
//                         </Button>
//                         <Button size="small" startIcon={<Globe size={14} />}>
//                           🌐 {t("website")}
//                         </Button>
//                         <Button size="small" startIcon={<Store size={14} />}>
//                           📘 Facebook
//                         </Button>
//                         <Button size="small" startIcon={<Send size={14} />}>
//                           ✈ Telegram
//                         </Button>
//                       </Stack>
//                     </Paper>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </TabPanel>
//             {/* ========== Tab 10: Customer Reviews ========== */}
//             <TabPanel value="10" sx={{ p: 0 }}>
//               <Grid container spacing={3}>
//                 <Grid size={{ xs: 12 }}>
//                   <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 4 }}>
//                     <Stack alignItems="center">
//                       <Typography variant="h2">4.8</Typography>
//                       <Rating value={4.8} precision={0.1} readOnly size="large" />
//                       <Typography variant="body2" color="text.secondary">
//                         {t("overall_rating")}
//                       </Typography>
//                     </Stack>
//                     <Stack>
//                       <Typography variant="body2">
//                         {t("total_reviews")}: <strong>256</strong>
//                       </Typography>
//                       <Typography variant="body2">5 ★ (180)</Typography>
//                       <Typography variant="body2">4 ★ (50)</Typography>
//                       <Typography variant="body2">3 ★ (16)</Typography>
//                       <Typography variant="body2">2 ★ (6)</Typography>
//                       <Typography variant="body2">1 ★ (4)</Typography>
//                     </Stack>
//                   </Paper>
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   {renderToolbar({
//                     keyword: null,
//                     setKeyword: null,
//                     setPage: null,
//                     status: null,
//                     setStatus: null,
//                     statusItems: [
//                       { value: "All", label: t("all") },
//                       { value: "visible", label: t("visible") },
//                       { value: "hidden", label: t("hidden") },
//                       { value: "reported", label: t("reported") },
//                     ],
//                   })}
//                   <TableContainer className="table-container">
//                     <Table className="table">
//                       <TableHead>
//                         <TableRow>
//                           <TableCell>{t("customer")}</TableCell>
//                           <TableCell align="center">{t("rating")}</TableCell>
//                           <TableCell>{t("comment")}</TableCell>
//                           <TableCell>{t("reply")}</TableCell>
//                           <TableCell>{t("status")}</TableCell>
//                           <TableCell align="right">{t("action")}</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         <TableRow>
//                           <TableCell colSpan={6}>
//                             <EmptyData />
//                           </TableCell>
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Grid>
//               </Grid>
//             </TabPanel>
//             {/* ========== Tab 11: Rewards Program ========== */}
//             <TabPanel value="11" sx={{ p: 0 }}>
//               <Paper sx={{ p: 3 }}>
//                 <Typography variant="h6" gutterBottom>
//                   {t("rewards_program")}
//                 </Typography>
//                 <Grid container spacing={3}>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Stack spacing={2}>
//                       <Stack direction="row" alignItems="center" justifyContent="space-between">
//                         <Typography>{t("enable_rewards")}</Typography>
//                         <Switch
//                           checked={rewards.enabled}
//                           onChange={() => setRewards({ ...rewards, enabled: !rewards.enabled })}
//                         />
//                       </Stack>
//                       <TextField
//                         label={t("reward_points")}
//                         type="number"
//                         size="small"
//                         value={rewards.points}
//                         onChange={(e) => setRewards({ ...rewards, points: parseInt(e.target.value) })}
//                         InputProps={{
//                           endAdornment: <InputAdornment position="end">Points per $</InputAdornment>,
//                         }}
//                       />
//                       <TextField
//                         label={t("checkin_reward")}
//                         type="number"
//                         size="small"
//                         value={rewards.checkin}
//                         onChange={(e) => setRewards({ ...rewards, checkin: parseInt(e.target.value) })}
//                         InputProps={{ endAdornment: <InputAdornment position="end">Points</InputAdornment> }}
//                       />
//                       <TextField
//                         label={t("review_reward")}
//                         type="number"
//                         size="small"
//                         value={rewards.review}
//                         onChange={(e) => setRewards({ ...rewards, review: parseInt(e.target.value) })}
//                         InputProps={{ endAdornment: <InputAdornment position="end">Points</InputAdornment> }}
//                       />
//                       <TextField
//                         label={t("purchase_reward")}
//                         type="number"
//                         size="small"
//                         value={rewards.purchase}
//                         onChange={(e) => setRewards({ ...rewards, purchase: parseInt(e.target.value) })}
//                         InputProps={{
//                           endAdornment: <InputAdornment position="end">Point per $</InputAdornment>,
//                         }}
//                       />
//                     </Stack>
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Stack spacing={2}>
//                       <TextField
//                         label={t("referral_reward")}
//                         type="number"
//                         size="small"
//                         value={rewards.referral}
//                         onChange={(e) => setRewards({ ...rewards, referral: parseInt(e.target.value) })}
//                         InputProps={{ endAdornment: <InputAdornment position="end">Points</InputAdornment> }}
//                       />
//                       <TextField
//                         label={t("birthday_reward")}
//                         type="number"
//                         size="small"
//                         value={rewards.birthday}
//                         onChange={(e) => setRewards({ ...rewards, birthday: parseInt(e.target.value) })}
//                         InputProps={{ endAdornment: <InputAdornment position="end">Points</InputAdornment> }}
//                       />
//                       <TextField
//                         select
//                         label={t("vip_level")}
//                         size="small"
//                         value={rewards.vipLevel}
//                         onChange={(e) => setRewards({ ...rewards, vipLevel: e.target.value })}
//                       >
//                         <MenuItem value="Silver">Silver</MenuItem>
//                         <MenuItem value="Gold">Gold</MenuItem>
//                         <MenuItem value="Platinum">Platinum</MenuItem>
//                       </TextField>
//                       <TextField
//                         label={t("coupon")}
//                         size="small"
//                         value={rewards.coupon}
//                         onChange={(e) => setRewards({ ...rewards, coupon: e.target.value })}
//                       />
//                       <Button
//                         variant="contained"
//                         onClick={() => {
//                           const input = { rewardsSettings: rewards };
//                           handleSaveSection(input);
//                         }}
//                       >
//                         {t("save")}
//                       </Button>
//                     </Stack>
//                   </Grid>
//                   <Grid size={{ xs: 12 }}>
//                     <Paper variant="outlined" sx={{ p: 2, bgcolor: "action.hover" }}>
//                       <Typography variant="subtitle2">{t("example")}</Typography>
//                       <Stack direction="row" spacing={4}>
//                         <Typography variant="body2">
//                           📝 {t("review")}: +{rewards.review} Points
//                         </Typography>
//                         <Typography variant="body2">
//                           📍 {t("check_in")}: +{rewards.checkin} Points
//                         </Typography>
//                         <Typography variant="body2">
//                           🛒 {t("purchase")}: {rewards.purchase} Point = $1
//                         </Typography>
//                       </Stack>
//                     </Paper>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </TabPanel>
//             {/* ========== Tab 12: AI Assistant ========== */}
//             <TabPanel value="12" sx={{ p: 0 }}>
//               <Paper sx={{ p: 3 }}>
//                 <Typography variant="h6" gutterBottom>
//                   {t("ai_assistant")}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" gutterBottom>
//                   {t("ai_knowledge_base")}
//                 </Typography>
//                 <Grid container spacing={2}>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <TextField
//                       label={t("business_story")}
//                       multiline
//                       rows={2}
//                       fullWidth
//                       size="small"
//                       value={aiKnowledge.businessStory}
//                       onChange={(e) => setAiKnowledge({ ...aiKnowledge, businessStory: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <TextField
//                       label={t("menu")}
//                       multiline
//                       rows={2}
//                       fullWidth
//                       size="small"
//                       value={aiKnowledge.menu}
//                       onChange={(e) => setAiKnowledge({ ...aiKnowledge, menu: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <TextField
//                       label={t("services")}
//                       multiline
//                       rows={2}
//                       fullWidth
//                       size="small"
//                       value={aiKnowledge.services}
//                       onChange={(e) => setAiKnowledge({ ...aiKnowledge, services: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <TextField
//                       label={t("popular_items")}
//                       multiline
//                       rows={2}
//                       fullWidth
//                       size="small"
//                       value={aiKnowledge.popularItems}
//                       onChange={(e) => setAiKnowledge({ ...aiKnowledge, popularItems: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12 }}>
//                     <TextField
//                       label={t("faq")}
//                       multiline
//                       rows={3}
//                       fullWidth
//                       size="small"
//                       placeholder="Q: Do you have parking? A: Yes, free parking..."
//                       value={aiKnowledge.faq}
//                       onChange={(e) => setAiKnowledge({ ...aiKnowledge, faq: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 4 }}>
//                     <TextField
//                       label={t("reservation_policy")}
//                       multiline
//                       rows={2}
//                       fullWidth
//                       size="small"
//                       value={aiKnowledge.reservationPolicy}
//                       onChange={(e) => setAiKnowledge({ ...aiKnowledge, reservationPolicy: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 4 }}>
//                     <TextField
//                       label={t("delivery_policy")}
//                       multiline
//                       rows={2}
//                       fullWidth
//                       size="small"
//                       value={aiKnowledge.deliveryPolicy}
//                       onChange={(e) => setAiKnowledge({ ...aiKnowledge, deliveryPolicy: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 4 }}>
//                     <TextField
//                       label={t("cancellation_policy")}
//                       multiline
//                       rows={2}
//                       fullWidth
//                       size="small"
//                       value={aiKnowledge.cancellationPolicy}
//                       onChange={(e) => setAiKnowledge({ ...aiKnowledge, cancellationPolicy: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 4 }}>
//                     <TextField
//                       label={t("parking")}
//                       fullWidth
//                       size="small"
//                       value={aiKnowledge.parking}
//                       onChange={(e) => setAiKnowledge({ ...aiKnowledge, parking: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 4 }}>
//                     <TextField
//                       label={t("pet_friendly")}
//                       fullWidth
//                       size="small"
//                       value={aiKnowledge.petFriendly}
//                       onChange={(e) => setAiKnowledge({ ...aiKnowledge, petFriendly: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 4 }}>
//                     <TextField
//                       label={t("payment_methods")}
//                       fullWidth
//                       size="small"
//                       value={aiKnowledge.paymentMethods}
//                       onChange={(e) => setAiKnowledge({ ...aiKnowledge, paymentMethods: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12 }}>
//                     <TextField
//                       label={t("additional_notes")}
//                       multiline
//                       rows={2}
//                       fullWidth
//                       size="small"
//                       value={aiKnowledge.additionalNotes}
//                       onChange={(e) => setAiKnowledge({ ...aiKnowledge, additionalNotes: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12 }}>
//                     <Button
//                       variant="contained"
//                       onClick={() => {
//                         const input = { aiKnowledge: aiKnowledge };
//                         handleSaveSection(input);
//                       }}
//                     >
//                       {t("save")}
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </TabPanel>
//             {/* ========== Tab 13: Promotions ========== */}
//             <TabPanel value="13" sx={{ p: 0 }}>
//               {renderToolbar({
//                 keyword: promotionKeyword,
//                 setKeyword: setPromotionKeyword,
//                 setPage: setPromotionPage,
//                 status: promotionStatus,
//                 setStatus: setPromotionStatus,
//                 statusItems: [
//                   { value: "All", label: t("all") },
//                   { value: "active", label: t("active") },
//                   { value: "inactive", label: t("inactive") },
//                 ],
//                 action: (
//                   <Button
//                     variant="contained"
//                     startIcon={<Plus size={18} />}
//                     onClick={() => {
//                       setEditingPromotion(null);
//                       setOpenPromotionDialog(true);
//                     }}
//                   >
//                     {t("add_promotion")}
//                   </Button>
//                 ),
//               })}
//               <PromotionForm
//                 open={openPromotionDialog}
//                 onClose={() => setOpenPromotionDialog(false)}
//                 promotionData={editingPromotion}
//                 setRefetch={refetchPromotions}
//                 shopId={shopId}
//                 t={t}
//               />
//               <TableContainer className="table-container">
//                 <Table className="table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>{t("no")}</TableCell>
//                       <TableCell>{t("type")}</TableCell>
//                       <TableCell>{t("title")}</TableCell>
//                       <TableCell align="right">{t("discount")}</TableCell>
//                       <TableCell>{t("start_date")}</TableCell>
//                       <TableCell>{t("end_date")}</TableCell>
//                       <TableCell>{t("status")}</TableCell>
//                       <TableCell align="right">{t("action")}</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   {promotionsLoading ? (
//                     <CircularIndeterminate />
//                   ) : promotions.length === 0 ? (
//                     <EmptyData />
//                   ) : (
//                     <TableBody>
//                       {promotions.map((row, index) => (
//                         <TableRow key={row._id} className="table-row">
//                           <TableCell>{(promotionsPaginator?.slNo || 0) + index}</TableCell>
//                           <TableCell>{t(row.type)}</TableCell>
//                           <TableCell>{row.title}</TableCell>
//                           <TableCell align="right">{row.discount}%</TableCell>
//                           <TableCell>{row.startDate}</TableCell>
//                           <TableCell>{row.endDate}</TableCell>
//                           <TableCell>
//                             <Chip
//                               label={t(row.status)}
//                               color={statusColor(row.status)}
//                               size="small"
//                               sx={{ cursor: "pointer" }}
//                             />
//                           </TableCell>
//                           <TableCell align="right">
//                             <PromotionAction
//                               data={row}
//                               setRefetch={refetchPromotions}
//                               t={t}
//                               shopId={shopId}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   )}
//                 </Table>
//                 <Stack alignItems="flex-end" p={2}>
//                   <FooterPagination
//                     page={promotionPage}
//                     limit={promotionLimit}
//                     setPage={setPromotionPage}
//                     handleLimit={handleLimit(setPromotionLimit, setPromotionPage)}
//                     totalDocs={promotionsPaginator?.totalDocs}
//                     totalPages={promotionsPaginator?.totalPages}
//                   />
//                 </Stack>
//               </TableContainer>
//             </TabPanel>
//             {/* ========== Tab 14: Events ========== */}
//             <TabPanel value="14" sx={{ p: 0 }}>
//               {renderToolbar({
//                 keyword: eventKeyword,
//                 setKeyword: setEventKeyword,
//                 setPage: setEventPage,
//                 status: eventStatus,
//                 setStatus: setEventStatus,
//                 statusItems: [
//                   { value: "All", label: t("all") },
//                   { value: "scheduled", label: t("scheduled") },
//                   { value: "active", label: t("active") },
//                   { value: "completed", label: t("completed") },
//                 ],
//                 action: (
//                   <Button
//                     variant="contained"
//                     startIcon={<Plus size={18} />}
//                     onClick={() => {
//                       setEditingEvent(null);
//                       setOpenEventDialog(true);
//                     }}
//                   >
//                     {t("add_event")}
//                   </Button>
//                 ),
//               })}
//               <EventForm
//                 open={openEventDialog}
//                 onClose={() => setOpenEventDialog(false)}
//                 eventData={editingEvent}
//                 setRefetch={refetchEvents}
//                 shopId={shopId}
//                 t={t}
//               />
//               <TableContainer className="table-container">
//                 <Table className="table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>{t("no")}</TableCell>
//                       <TableCell>{t("title")}</TableCell>
//                       <TableCell>{t("description")}</TableCell>
//                       <TableCell>{t("date")}</TableCell>
//                       <TableCell>{t("status")}</TableCell>
//                       <TableCell align="right">{t("action")}</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   {eventsLoading ? (
//                     <CircularIndeterminate />
//                   ) : events.length === 0 ? (
//                     <EmptyData />
//                   ) : (
//                     <TableBody>
//                       {events.map((row, index) => (
//                         <TableRow key={row._id} className="table-row">
//                           <TableCell>{(eventsPaginator?.slNo || 0) + index}</TableCell>
//                           <TableCell>{row.title}</TableCell>
//                           <TableCell>{row.description}</TableCell>
//                           <TableCell>{new Date(row.date).toLocaleString()}</TableCell>
//                           <TableCell>
//                             <Chip
//                               label={t(row.status)}
//                               color={statusColor(row.status)}
//                               size="small"
//                               sx={{ cursor: "pointer" }}
//                             />
//                           </TableCell>
//                           <TableCell align="right">
//                             <EventAction
//                               data={row}
//                               setRefetch={refetchEvents}
//                               t={t}
//                               shopId={shopId}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   )}
//                 </Table>
//                 <Stack alignItems="flex-end" p={2}>
//                   <FooterPagination
//                     page={eventPage}
//                     limit={eventLimit}
//                     setPage={setEventPage}
//                     handleLimit={handleLimit(setEventLimit, setEventPage)}
//                     totalDocs={eventsPaginator?.totalDocs}
//                     totalPages={eventsPaginator?.totalPages}
//                   />
//                 </Stack>
//               </TableContainer>
//             </TabPanel>
//             {/* ========== Tab 15: Mobile Settings ========== */}
//             <TabPanel value="15" sx={{ p: 0 }}>
//               <Paper sx={{ p: 3 }}>
//                 <Typography variant="h6" gutterBottom>
//                   {t("mobile_settings")}
//                 </Typography>
//                 <Grid container spacing={2}>
//                   {Object.entries(settings).map(([key, value]) => (
//                     <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
//                       <Stack direction="row" alignItems="center" justifyContent="space-between">
//                         <Typography>{t(key)}</Typography>
//                         <Switch checked={value} onChange={() => setSettings({ ...settings, [key]: !value })} />
//                       </Stack>
//                     </Grid>
//                   ))}
//                 </Grid>
//                 <Button
//                   variant="contained"
//                   sx={{ mt: 2 }}
//                   onClick={() => {
//                     const input = { mobileSettings: settings };
//                     handleSaveSection(input);
//                   }}
//                 >
//                   {t("save")}
//                 </Button>
//               </Paper>
//             </TabPanel>
//           </Grid>
//         </Grid>
//       </TabContext>
//     </Box>
//   );
// };
// export default MobileApp;
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { useMutation, useQuery } from "@apollo/client/react";
import { Restaurant } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Card, Chip, Grid, IconButton, InputAdornment, MenuItem, Paper, Rating, Skeleton, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Calendar, ChevronLeft, ChevronRight, Clock, Coffee, Gift, Globe, Image, Info, MapIcon, MapPinIcon, Megaphone, Phone, Plus, Search, Send, Settings, Star, Store } from "lucide-react";
import { TabContext, TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";

import CuisineOriginAction from "../Components/mobile/cuisineOrigine/CuisineOrigineAction";
import CuisineOriginForm from "../Components/mobile/cuisineOrigine/CuisineOrigineForm";
import CuisineTypeAction from "../Components/mobile/cuisineType/CuisineTypeAction";
import CuisineTypeForm from "../Components/mobile/cuisineType/CuisineTypeForm";
import PromotionAction from "../Components/mobile/promotion/PromotionAction";
import MealTypeAction from "../Components/mobile/mealType/MealTypeAction";
import PromotionForm from "../Components/mobile/promotion/PromotionForm";
import GalleryAction from "../Components/mobile/gallery/GalleryAction";
import MealTypeForm from "../Components/mobile/mealType/MealTypeForm";
import GalleryForm from "../Components/mobile/gallery/GalleryForm";
import EventAction from "../Components/mobile/event/EventAction";
import EventForm from "../Components/mobile/event/EventForm";
import FooterPagination from "../include/FooterPagination";
import "../Styles/modernTable.scss";
import { useThemeContext } from "../Context/ThemeContext";
import { UPDATE_SHOP_PROFILE } from "../../graphql/mutation";
import { useAuth } from "../Context/AuthContext";
import { GET_CUISINES_ORIGINS_WITH_PAGINATION, GET_CUISINES_TYPES_WITH_PAGINATION, GET_MEAL_TYPES_PAGINATION, GET_SHOP_EVENT_WITH_PAGINATION, GET_SHOP_GALLERY_WITH_PAGINATION, GET_SHOP_PROFILE, GET_SHOP_PROMOTION_WITH_PAGINATION } from "../../graphql/queries";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";

// ─── Helpers ──────────────────────────────────────────────────────────
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

// Default hours (ensures every day has open/close fields)
const defaultDayHours = {
  open: "08:00",
  close: "22:00",
  open24: false,
  closed: false,
};

const defaultHours = {
  monday: { ...defaultDayHours },
  tuesday: { ...defaultDayHours },
  wednesday: { ...defaultDayHours },
  thursday: { ...defaultDayHours },
  friday: { ...defaultDayHours },
  saturday: { ...defaultDayHours },
  sunday: { ...defaultDayHours },
  holiday: { open: "", close: "", open24: false, closed: true },
  specialHours: "",
};

const mergeHours = (apiHours) => {
  if (!apiHours) return defaultHours;
  const merged = { ...defaultHours };
  for (const day of Object.keys(defaultHours)) {
    if (apiHours[day]) {
      merged[day] = { ...defaultHours[day], ...apiHours[day] };
    }
  }
  return merged;
};

// ─── Component ──────────────────────────────────────────────────────
const MobileApp = () => {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { layoutMode } = useThemeContext();
  const { setAlert } = useAuth();

  const [tab, setTab] = useState("1");
  const [navMode, setNavMode] = useState(layoutMode === "compact" ? "compact" : "default");

  const shopId = localStorage.getItem("activeShopId");

  // ─── Helper: remove __typename ──────────────────────────────────
  const removeTypename = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(removeTypename);
    }
    if (obj && typeof obj === "object") {
      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
        if (key !== "__typename") {
          newObj[key] = removeTypename(value);
        }
      }
      return newObj;
    }
    return obj;
  };

  // ─── State ──────────────────────────────────────────────────────
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
  const [hours, setHours] = useState(defaultHours);
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

  // ─── Fetch Shop Profile ──────────────────────────────────────────
  const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useQuery(GET_SHOP_PROFILE, {
    variables: { shopId },
    skip: !shopId,
  });

  useEffect(() => {
    if (profileData) {
      const shop = profileData?.getShopProfile;
      if (shop) {
        setAbout({
          shortDescription: shop.shortDescription || "",
          description: shop.description || "",
          history: shop.history || "",
          mission: shop.mission || "",
          keywords: shop.keywords?.join(", ") || "",
        });
        setShopInfo({
          name: shop.nameEn || "",
          nameKh: shop.nameKh || "",
          shopCode: shop.code || "",
          type: shop.type || "",
          logo: shop.image || null,
          cover: null,
        });
        setHours(mergeHours(shop.openingHours));
        if (shop.location) setAddress(shop.location);
        if (shop.contactInfo) setContact(shop.contactInfo);
        if (shop.rewardsSettings) setRewards(shop.rewardsSettings);
        if (shop.aiKnowledge) setAiKnowledge(shop.aiKnowledge);
        if (shop.mobileSettings) setSettings(shop.mobileSettings);
      }
    }
  }, [profileData]);

  // ─── Update Shop Profile Mutation ────────────────────────────────
  const [updateShopProfile] = useMutation(UPDATE_SHOP_PROFILE, {
    onCompleted: (data) => {
      const result = data?.updateShopProfile;
      if (result?.isSuccess) {
        setAlert(true, "success", result.message?.messageEn || "Updated");
        refetchProfile();
      } else {
        setAlert(true, "error", result.message?.messageEn || "Update failed");
      }
    },
    onError: (err) => {
      console.error("Mutation error:", err);
      setAlert(true, "error", err.message || "Network or server error");
    },
  });

  const handleSaveSection = (input) => {
    if (!shopId) {
      setAlert(true, "error", "Shop ID is missing");
      return;
    }
    const cleanedInput = removeTypename(input);
    updateShopProfile({ variables: { shopId, input: cleanedInput } });
  };

  // ─── Cuisine Types (Tab 4) ──────────────────────────────────────
  const [cuisineTypePage, setCuisineTypePage] = useState(1);
  const [cuisineTypeLimit, setCuisineTypeLimit] = useState(5);
  const [cuisineTypeKeyword, setCuisineTypeKeyword] = useState("");
  const [cuisineTypeStatus, setCuisineTypeStatus] = useState("All");
  const [openCuisineTypeDialog, setOpenCuisineTypeDialog] = useState(false);
  const [editingCuisineType, setEditingCuisineType] = useState(null);

  const {
    data: cuisineTypesData,
    loading: cuisineTypesLoading,
    refetch: refetchCuisineTypes,
  } = useQuery(GET_CUISINES_TYPES_WITH_PAGINATION, {
    variables: {
      shopId,
      page: cuisineTypePage,
      limit: cuisineTypeLimit,
      keyword: cuisineTypeKeyword,
      status: cuisineTypeStatus === "All" ? undefined : cuisineTypeStatus,
    },
    skip: !shopId,
  });
  const cuisineTypes = cuisineTypesData?.getCuisineTypesWithPagination?.data || [];
  const cuisineTypesPaginator = cuisineTypesData?.getCuisineTypesWithPagination?.paginator;

  // ─── Cuisine Origins (Tab 5) ──────────────────────────────────
  const [cuisineOriginPage, setCuisineOriginPage] = useState(1);
  const [cuisineOriginLimit, setCuisineOriginLimit] = useState(5);
  const [cuisineOriginKeyword, setCuisineOriginKeyword] = useState("");
  const [cuisineOriginStatus, setCuisineOriginStatus] = useState("All");
  const [openCuisineOriginDialog, setOpenCuisineOriginDialog] = useState(false);
  const [editingCuisineOrigin, setEditingCuisineOrigin] = useState(null);

  const {
    data: cuisineOriginsData,
    loading: cuisineOriginsLoading,
    refetch: refetchCuisineOrigins,
  } = useQuery(GET_CUISINES_ORIGINS_WITH_PAGINATION, {
    variables: {
      shopId,
      page: cuisineOriginPage,
      limit: cuisineOriginLimit,
      keyword: cuisineOriginKeyword,
      status: cuisineOriginStatus === "All" ? undefined : cuisineOriginStatus,
    },
    skip: !shopId,
  });
  const cuisineOrigins = cuisineOriginsData?.getCuisineOriginsWithPagination?.data || [];
  const cuisineOriginsPaginator = cuisineOriginsData?.getCuisineOriginsWithPagination?.paginator;

  // ─── Meal Types (Tab 6) ──────────────────────────────────────
  const [mealTypePage, setMealTypePage] = useState(1);
  const [mealTypeLimit, setMealTypeLimit] = useState(5);
  const [mealTypeKeyword, setMealTypeKeyword] = useState("");
  const [mealTypeStatus, setMealTypeStatus] = useState("All");
  const [openMealTypeDialog, setOpenMealTypeDialog] = useState(false);
  const [editingMealType, setEditingMealType] = useState(null);

  const {
    data: mealTypesData,
    loading: mealTypesLoading,
    refetch: refetchMealTypes,
  } = useQuery(GET_MEAL_TYPES_PAGINATION, {
    variables: {
      shopId,
      page: mealTypePage,
      limit: mealTypeLimit,
      keyword: mealTypeKeyword,
      status: mealTypeStatus === "All" ? undefined : mealTypeStatus,
    },
    skip: !shopId,
  });
  const mealTypes = mealTypesData?.getMealTypesWithPagination?.data || [];
  const mealTypesPaginator = mealTypesData?.getMealTypesWithPagination?.paginator;

  // ─── Gallery (Tab 7) ──────────────────────────────────────────
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryLimit, setGalleryLimit] = useState(5);
  const [galleryKeyword, setGalleryKeyword] = useState("");
  const [galleryStatus, setGalleryStatus] = useState("All");
  const [openGalleryDialog, setOpenGalleryDialog] = useState(false);
  const [editingGalleryImage, setEditingGalleryImage] = useState(null);

  const {
    data: galleryData,
    loading: galleryLoading,
    refetch: refetchGallery,
  } = useQuery(GET_SHOP_GALLERY_WITH_PAGINATION, {
    variables: {
      shopId,
      page: galleryPage,
      limit: galleryLimit,
      keyword: galleryKeyword,
      status: galleryStatus === "All" ? undefined : galleryStatus,
    },
    skip: !shopId,
  });
  const gallery = galleryData?.getShopGalleryWithPagination?.data || [];
  const galleryPaginator = galleryData?.getShopGalleryWithPagination?.paginator;

  // ─── Promotions (Tab 13) ──────────────────────────────────────
  const [promotionPage, setPromotionPage] = useState(1);
  const [promotionLimit, setPromotionLimit] = useState(5);
  const [promotionKeyword, setPromotionKeyword] = useState("");
  const [promotionStatus, setPromotionStatus] = useState("All");
  const [openPromotionDialog, setOpenPromotionDialog] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  const {
    data: promotionsData,
    loading: promotionsLoading,
    refetch: refetchPromotions,
  } = useQuery(GET_SHOP_PROMOTION_WITH_PAGINATION, {
    variables: {
      shopId,
      page: promotionPage,
      limit: promotionLimit,
      keyword: promotionKeyword,
      status: promotionStatus === "All" ? undefined : promotionStatus,
    },
    skip: !shopId,
  });
  const promotions = promotionsData?.getShopPromotions?.data || [];
  const promotionsPaginator = promotionsData?.getShopPromotions?.paginator;

  // ─── Events (Tab 14) ──────────────────────────────────────────
  const [eventPage, setEventPage] = useState(1);
  const [eventLimit, setEventLimit] = useState(5);
  const [eventKeyword, setEventKeyword] = useState("");
  const [eventStatus, setEventStatus] = useState("All");
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const {
    data: eventsData,
    loading: eventsLoading,
    refetch: refetchEvents,
  } = useQuery(GET_SHOP_EVENT_WITH_PAGINATION, {
    variables: {
      shopId,
      page: eventPage,
      limit: eventLimit,
      keyword: eventKeyword,
      status: eventStatus === "All" ? undefined : eventStatus,
    },
    skip: !shopId,
  });
  const events = eventsData?.getShopEvents?.data || [];
  const eventsPaginator = eventsData?.getShopEvents?.paginator;

  // ─── Render Toolbar ──────────────────────────────────────────────
  const renderToolbar = ({
    keyword,
    setKeyword,
    setPage,
    status,
    setStatus,
    statusItems,
    extraFields,
    action,
  }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "center" },
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        mb: 2,
      }}
    >
      <Grid container spacing={2} alignItems="center" sx={{ flex: 1 }}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="body2" fontWeight={500} mb={0.5}>
            {t("search")}
          </Typography>
          <TextField
            type="search"
            size="small"
            placeholder={t("search") + "..."}
            value={keyword}
            fullWidth
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {statusItems && (
          <Grid size={{ xs: 12, sm: 2 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              {t("status")}
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              {statusItems.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
        {extraFields &&
          extraFields.map((field, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 2 }}>
              <Typography variant="body2" fontWeight={500} mb={0.5}>
                {field.label}
              </Typography>
              {field.type === "select" ? (
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={field.value}
                  onChange={(e) => {
                    field.setValue(e.target.value);
                    setPage(1);
                  }}
                >
                  {field.options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  value={field.value}
                  onChange={(e) => {
                    field.setValue(e.target.value);
                    setPage(1);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Grid>
          ))}
      </Grid>
      {action && (
        <Stack direction="row" sx={{ alignSelf: { xs: "flex-end", md: "auto" } }}>
          {action}
        </Stack>
      )}
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

  // ─── Skeleton rendering (form vs table) ──────────────────────────
  const formTabs = ["1", "2", "3", "8", "9", "11", "12", "15"];

  const renderFormSkeleton = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        <Skeleton width={200} />
      </Typography>
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Grid key={i} size={{ xs: 12, md: i % 2 === 0 ? 6 : 12 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <Skeleton width={100} />
            </Typography>
            <Skeleton variant="rounded" height={i % 2 === 0 ? 40 : 80} />
          </Grid>
        ))}
        <Grid size={{ xs: 12 }}>
          <Skeleton variant="rounded" width={100} height={36} />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderTableSkeleton = () => (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Grid container spacing={2} sx={{ flex: 1 }}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              <Skeleton width={60} />
            </Typography>
            <Skeleton variant="rounded" height={40} />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              <Skeleton width={60} />
            </Typography>
            <Skeleton variant="rounded" height={40} />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              <Skeleton width={60} />
            </Typography>
            <Skeleton variant="rounded" height={40} />
          </Grid>
        </Grid>
        <Skeleton variant="rounded" width={120} height={40} sx={{ ml: 2 }} />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableCell key={i}>
                  <Skeleton variant="text" width={60} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map((row) => (
              <TableRow key={row}>
                {[1, 2, 3, 4, 5].map((cell) => (
                  <TableCell key={cell}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  const renderSkeletonContent = () => {
    if (formTabs.includes(tab)) {
      return renderFormSkeleton();
    }
    return renderTableSkeleton();
  };

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Breadcrumbs separator="/">
        <Typography sx={{ borderLeft: "3px solid #1D4592", pl: 1.5 }}>
          {t("shop_management")}
        </Typography>
      </Breadcrumbs>

      <TabContext value={tab}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* Navigation – always visible */}
          <Grid
            size={{
              xs: 12,
              sm: isNavCompact ? 1 : 3,
              md: isNavCompact ? 1 : 2,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: isNavCompact ? 1 : 2,
                height: "70vh",
                borderRadius: 1,
                position: "relative",
                overflowY: "auto",
              }}
            >
              {!isMobile && (
                <Tooltip title={isNavCompact ? "Show labels" : "Compact"} placement="right" arrow>
                  <IconButton
                    size="small"
                    onClick={() => setNavMode((prev) => (prev === "compact" ? "default" : "compact"))}
                    sx={{
                      position: "absolute",
                      right: -14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 28,
                      height: 28,
                      zIndex: 2,
                      bgcolor: "background.paper",
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: theme.shadows[2],
                      "&:hover": { bgcolor: "background.paper" },
                    }}
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
                    <Button
                      fullWidth={!isNavCompact}
                      variant={active ? "contained" : "text"}
                      onClick={() => setTab(item.value)}
                      aria-label={item.label}
                      sx={{
                        minWidth: isNavCompact ? 40 : 0,
                        width: isNavCompact ? 40 : "100%",
                        height: 36,
                        px: isNavCompact ? 0 : 1.5,
                        justifyContent: isNavCompact ? "center" : "flex-start",
                        textTransform: "none",
                        fontSize: "0.8rem",
                      }}
                    >
                      <Icon size={16} />
                      {!isNavCompact && <Box component="span" sx={{ ml: 1 }}>{item.label}</Box>}
                    </Button>
                  );
                  return isNavCompact ? (
                    <Tooltip key={item.value} title={item.label} placement="right" arrow>
                      {button}
                    </Tooltip>
                  ) : (
                    <Box key={item.value}>{button}</Box>
                  );
                })}
              </Stack>
            </Paper>
          </Grid>

          {/* Content – skeleton or actual tab panels */}
          <Grid
            size={{
              xs: 12,
              sm: isNavCompact ? 11 : 9,
              md: isNavCompact ? 11 : 10,
            }}
          >
            {profileLoading ? (
              renderSkeletonContent()
            ) : (
              <>
                {/* ========== Tab 1: About ========== */}
                <TabPanel value="1" sx={{ p: 0 }}>
                  <Paper sx={{ p: 3, textAlign: "left" }}>
                    <Typography variant="h6" gutterBottom>
                      {t("about")}
                    </Typography>
                    <Typography variant="body2" mb={2} color="text.secondary">
                      {t("edit_business_description")}
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" color="text.secondary">{t("short_description")}</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={about.shortDescription}
                          onChange={(e) => setAbout({ ...about, shortDescription: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" color="text.secondary">{t("long_description")}</Typography>
                        <TextField
                          multiline
                          rows={4}
                          fullWidth
                          size="small"
                          value={about.description}
                          onChange={(e) => setAbout({ ...about, description: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" color="text.secondary">{t("history")}</Typography>
                        <TextField
                          multiline
                          rows={3}
                          fullWidth
                          size="small"
                          value={about.history}
                          onChange={(e) => setAbout({ ...about, history: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" color="text.secondary">{t("mission")}</Typography>
                        <TextField
                          multiline
                          rows={3}
                          fullWidth
                          size="small"
                          value={about.mission}
                          onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" color="text.secondary">{t("keywords")}</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Khmer food, authentic, local..."
                          value={about.keywords}
                          onChange={(e) => setAbout({ ...about, keywords: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            const input = {
                              shortDescription: about.shortDescription,
                              description: about.description,
                              history: about.history,
                              mission: about.mission,
                              keywords: about.keywords.split(",").map((k) => k.trim()).filter(Boolean),
                            };
                            handleSaveSection(input);
                          }}
                        >
                          {t("save")}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </TabPanel>

                {/* ========== Tab 2: Shop Information ========== */}
                <TabPanel value="2" sx={{ p: 0 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" mb={2} textAlign="left">
                      {t("shop_information")}
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                          <TextField
                            label={t("business_name")}
                            fullWidth
                            size="small"
                            value={shopInfo.name}
                            onChange={(e) => setShopInfo({ ...shopInfo, name: e.target.value })}
                          />
                          <TextField
                            label={t("khmer_name")}
                            fullWidth
                            size="small"
                            value={shopInfo.nameKh}
                            onChange={(e) => setShopInfo({ ...shopInfo, nameKh: e.target.value })}
                          />
                          <TextField
                            label={t("shop_code")}
                            fullWidth
                            size="small"
                            value={shopInfo.shopCode}
                            onChange={(e) => setShopInfo({ ...shopInfo, shopCode: e.target.value })}
                          />
                          <TextField
                            select
                            label={t("business_type")}
                            fullWidth
                            size="small"
                            value={shopInfo.type}
                            onChange={(e) => setShopInfo({ ...shopInfo, type: e.target.value })}
                          >
                            {["Restaurant", "Cafe", "Hotel", "Bakery", "Bar", "Shopping Mall", "Spa", "Gym", "Tourism"].map(
                              (type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              )
                            )}
                          </TextField>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                          <Box>
                            <Typography>{t("logo")}</Typography>
                            <Button variant="contained" component="label">
                              {t("upload")}
                              <input type="file" hidden />
                            </Button>
                          </Box>
                          <Box>
                            <Typography>{t("cover_photo")}</Typography>
                            <Button variant="contained" component="label">
                              {t("upload")}
                              <input type="file" hidden />
                            </Button>
                          </Box>
                          <Button
                            variant="contained"
                            onClick={() => {
                              const input = {
                                nameEn: shopInfo.name || "",
                                nameKh: shopInfo.nameKh || "",
                                code: shopInfo.shopCode || "",
                                type: shopInfo.type || "",
                                image: shopInfo.logo || "",
                              };
                              handleSaveSection(input);
                            }}
                          >
                            {t("save")}
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                </TabPanel>

                {/* ========== Tab 3: Business Hours ========== */}
                <TabPanel value="3" sx={{ p: 0 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography textAlign="left" variant="h6" gutterBottom>
                      {t("business_hours")}
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(hours).map(([day, times]) => {
                        if (day === "holiday") return null;
                        return (
                          <Grid key={day} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card variant="outlined" sx={{ p: 2 }}>
                              <Typography sx={{ textTransform: "capitalize", fontWeight: 600 }}>{day}</Typography>
                              <Stack spacing={1} sx={{ mt: 1 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <TextField
                                    type="time"
                                    size="small"
                                    label={t("open")}
                                    value={times.open}
                                    onChange={(e) =>
                                      setHours({
                                        ...hours,
                                        [day]: { ...times, open: e.target.value },
                                      })
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    disabled={times.closed}
                                    sx={{ width: 100 }}
                                  />
                                  <TextField
                                    type="time"
                                    size="small"
                                    label={t("close")}
                                    value={times.close}
                                    onChange={(e) =>
                                      setHours({
                                        ...hours,
                                        [day]: { ...times, close: e.target.value },
                                      })
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    disabled={times.closed || times.open24}
                                    sx={{ width: 100 }}
                                  />
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <Switch
                                      size="small"
                                      checked={times.open24}
                                      onChange={() =>
                                        setHours({
                                          ...hours,
                                          [day]: { ...times, open24: !times.open24, closed: false },
                                        })
                                      }
                                      disabled={times.closed}
                                    />
                                    <Typography variant="caption">24h</Typography>
                                  </Stack>
                                  <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <Switch
                                      size="small"
                                      checked={times.closed}
                                      onChange={() =>
                                        setHours({
                                          ...hours,
                                          [day]: { ...times, closed: !times.closed, open24: false },
                                        })
                                      }
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
                            <Switch
                              checked={hours.holiday.closed}
                              onChange={() =>
                                setHours({
                                  ...hours,
                                  holiday: { ...hours.holiday, closed: !hours.holiday.closed },
                                })
                              }
                            />
                            <Typography variant="caption">{t("closed_on_holidays")}</Typography>
                          </Stack>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            const input = { openingHours: hours };
                            handleSaveSection(input);
                          }}
                        >
                          {t("save")}
                        </Button>
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
                      <Button
                        variant="contained"
                        startIcon={<LibraryAddOutlinedIcon size={18} />}
                        onClick={() => {
                          setEditingCuisineType(null);
                          setOpenCuisineTypeDialog(true);
                        }}
                      >
                        {t("create")}
                      </Button>
                    ),
                  })}
                  <CuisineTypeForm
                    open={openCuisineTypeDialog}
                    onClose={() => setOpenCuisineTypeDialog(false)}
                    cuisineTypeData={editingCuisineType}
                    setRefetch={refetchCuisineTypes}
                    shopId={shopId}
                    t={t}
                  />
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
                      {cuisineTypesLoading ? (
                        <CircularIndeterminate />
                      ) : cuisineTypes.length === 0 ? (
                        <EmptyData />
                      ) : (
                        <TableBody>
                          {cuisineTypes.map((row, index) => (
                            <TableRow key={row._id} className="table-row">
                              <TableCell>{(cuisineTypesPaginator?.slNo || 0) + index}</TableCell>
                              <TableCell>{row.nameKh}</TableCell>
                              <TableCell>{row.nameEn}</TableCell>
                              <TableCell>
                                <Chip
                                  label={t(row.status)}
                                  color={statusColor(row.status)}
                                  size="small"
                                  sx={{ cursor: "pointer" }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <CuisineTypeAction
                                  data={row}
                                  setRefetch={refetchCuisineTypes}
                                  t={t}
                                  shopId={shopId}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
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
                      <Button
                        variant="contained"
                        startIcon={<LibraryAddOutlinedIcon size={18} />}
                        onClick={() => {
                          setEditingCuisineOrigin(null);
                          setOpenCuisineOriginDialog(true);
                        }}
                      >
                        {t("create")}
                      </Button>
                    ),
                  })}
                  <CuisineOriginForm
                    open={openCuisineOriginDialog}
                    onClose={() => setOpenCuisineOriginDialog(false)}
                    cuisineOriginData={editingCuisineOrigin}
                    setRefetch={refetchCuisineOrigins}
                    shopId={shopId}
                    t={t}
                  />
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
                      {cuisineOriginsLoading ? (
                        <CircularIndeterminate />
                      ) : cuisineOrigins.length === 0 ? (
                        <EmptyData />
                      ) : (
                        <TableBody>
                          {cuisineOrigins.map((row, index) => (
                            <TableRow key={row._id} className="table-row">
                              <TableCell>{(cuisineOriginsPaginator?.slNo || 0) + index}</TableCell>
                              <TableCell>{row.nameKh}</TableCell>
                              <TableCell>{row.nameEn}</TableCell>
                              <TableCell>
                                <Chip
                                  label={t(row.status)}
                                  color={statusColor(row.status)}
                                  size="small"
                                  sx={{ cursor: "pointer" }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <CuisineOriginAction
                                  data={row}
                                  setRefetch={refetchCuisineOrigins}
                                  t={t}
                                  shopId={shopId}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
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
                      <Button
                        variant="contained"
                        startIcon={<LibraryAddOutlinedIcon size={18} />}
                        onClick={() => {
                          setEditingMealType(null);
                          setOpenMealTypeDialog(true);
                        }}
                      >
                        {t("create")}
                      </Button>
                    ),
                  })}
                  <MealTypeForm
                    open={openMealTypeDialog}
                    onClose={() => setOpenMealTypeDialog(false)}
                    mealTypeData={editingMealType}
                    setRefetch={refetchMealTypes}
                    shopId={shopId}
                    t={t}
                  />
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
                      {mealTypesLoading ? (
                        <CircularIndeterminate />
                      ) : mealTypes.length === 0 ? (
                        <EmptyData />
                      ) : (
                        <TableBody>
                          {mealTypes.map((row, index) => (
                            <TableRow key={row._id} className="table-row">
                              <TableCell>{(mealTypesPaginator?.slNo || 0) + index}</TableCell>
                              <TableCell>{row.nameKh}</TableCell>
                              <TableCell>{row.nameEn}</TableCell>
                              <TableCell>
                                <Chip
                                  label={t(row.status)}
                                  color={statusColor(row.status)}
                                  size="small"
                                  sx={{ cursor: "pointer" }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <MealTypeAction data={row} setRefetch={refetchMealTypes} t={t} shopId={shopId} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
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

                {/* ========== Tab 7: Gallery ========== */}
                <TabPanel value="7" sx={{ p: 0 }}>
                  {renderToolbar({
                    keyword: galleryKeyword,
                    setKeyword: setGalleryKeyword,
                    setPage: setGalleryPage,
                    status: galleryStatus,
                    setStatus: setGalleryStatus,
                    statusItems: [
                      { value: "All", label: t("all") },
                      { value: "active", label: t("active") },
                      { value: "inactive", label: t("inactive") },
                    ],
                    action: (
                      <Button
                        variant="contained"
                        startIcon={<LibraryAddOutlinedIcon size={18} />}
                        onClick={() => {
                          setEditingGalleryImage(null);
                          setOpenGalleryDialog(true);
                        }}
                      >
                        {t("upload_image")}
                      </Button>
                    ),
                  })}
                  <GalleryForm
                    open={openGalleryDialog}
                    onClose={() => setOpenGalleryDialog(false)}
                    galleryData={editingGalleryImage}
                    setRefetch={refetchGallery}
                    shopId={shopId}
                    t={t}
                  />
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
                      {galleryLoading ? (
                        <CircularIndeterminate />
                      ) : gallery.length === 0 ? (
                        <EmptyData />
                      ) : (
                        <TableBody>
                          {gallery.map((row) => (
                            <TableRow key={row._id} className="table-row">
                              <TableCell>
                                <img
                                  src={row.image}
                                  alt={row.title}
                                  style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                                />
                              </TableCell>
                              <TableCell>{row.title}</TableCell>
                              <TableCell>{row.category}</TableCell>
                              <TableCell>
                                {row.cover ? (
                                  <Chip label={t("cover")} size="small" color="primary" />
                                ) : (
                                  <Button size="small">{t("set_cover")}</Button>
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip label={t(row.status)} color={statusColor(row.status)} size="small" />
                              </TableCell>
                              <TableCell align="right">
                                <GalleryAction
                                  data={row}
                                  setRefetch={refetchGallery}
                                  t={t}
                                  shopId={shopId}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
                    </Table>
                    <Stack alignItems="flex-end" p={2}>
                      <FooterPagination
                        page={galleryPage}
                        limit={galleryLimit}
                        setPage={setGalleryPage}
                        handleLimit={handleLimit(setGalleryLimit, setGalleryPage)}
                        totalDocs={galleryPaginator?.totalDocs}
                        totalPages={galleryPaginator?.totalPages}
                      />
                    </Stack>
                  </TableContainer>
                </TabPanel>

                {/* ========== Tab 8: Address & Location ========== */}
                <TabPanel value="8" sx={{ p: 0 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {t("address_location")}
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                          <TextField
                            select
                            label={t("country")}
                            fullWidth
                            size="small"
                            value={address.country}
                            onChange={(e) => setAddress({ ...address, country: e.target.value })}
                          >
                            <MenuItem value="Cambodia">Cambodia</MenuItem>
                            <MenuItem value="Thailand">Thailand</MenuItem>
                            <MenuItem value="Vietnam">Vietnam</MenuItem>
                          </TextField>
                          <TextField
                            label={t("province")}
                            fullWidth
                            size="small"
                            value={address.province}
                            onChange={(e) => setAddress({ ...address, province: e.target.value })}
                          />
                          <TextField
                            label={t("district")}
                            fullWidth
                            size="small"
                            value={address.district}
                            onChange={(e) => setAddress({ ...address, district: e.target.value })}
                          />
                          <TextField
                            label={t("commune")}
                            fullWidth
                            size="small"
                            value={address.commune}
                            onChange={(e) => setAddress({ ...address, commune: e.target.value })}
                          />
                          <TextField
                            label={t("village")}
                            fullWidth
                            size="small"
                            value={address.village}
                            onChange={(e) => setAddress({ ...address, village: e.target.value })}
                          />
                          <TextField
                            label={t("street")}
                            fullWidth
                            size="small"
                            value={address.street}
                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                          />
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                          <TextField
                            label={t("latitude")}
                            fullWidth
                            size="small"
                            value={address.latitude}
                            onChange={(e) => setAddress({ ...address, latitude: e.target.value })}
                          />
                          <TextField
                            label={t("longitude")}
                            fullWidth
                            size="small"
                            value={address.longitude}
                            onChange={(e) => setAddress({ ...address, longitude: e.target.value })}
                          />
                          <TextField
                            label={t("google_map")}
                            fullWidth
                            size="small"
                            value={address.googleMap}
                            onChange={(e) => setAddress({ ...address, googleMap: e.target.value })}
                          />
                          <TextField
                            label={t("parking")}
                            fullWidth
                            size="small"
                            value={address.parking}
                            onChange={(e) => setAddress({ ...address, parking: e.target.value })}
                          />
                          <Button variant="outlined" startIcon={<MapPinIcon size={16} />}>
                            📍 {t("pick_on_map")}
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => {
                              const input = { location: address };
                              handleSaveSection(input);
                            }}
                          >
                            {t("save")}
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                </TabPanel>

                {/* ========== Tab 9: Contact Information ========== */}
                <TabPanel value="9" sx={{ p: 0 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {t("contact_information")}
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                          <TextField
                            label={t("phone")}
                            fullWidth
                            size="small"
                            value={contact.phone}
                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                          />
                          <TextField
                            label={t("mobile")}
                            fullWidth
                            size="small"
                            value={contact.mobile}
                            onChange={(e) => setContact({ ...contact, mobile: e.target.value })}
                          />
                          <TextField
                            label="Telegram"
                            fullWidth
                            size="small"
                            value={contact.telegram}
                            onChange={(e) => setContact({ ...contact, telegram: e.target.value })}
                          />
                          <TextField
                            label="WhatsApp"
                            fullWidth
                            size="small"
                            value={contact.whatsapp}
                            onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                          />
                          <TextField
                            label="Facebook"
                            fullWidth
                            size="small"
                            value={contact.facebook}
                            onChange={(e) => setContact({ ...contact, facebook: e.target.value })}
                          />
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                          <TextField
                            label="Instagram"
                            fullWidth
                            size="small"
                            value={contact.instagram}
                            onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                          />
                          <TextField
                            label="TikTok"
                            fullWidth
                            size="small"
                            value={contact.tiktok}
                            onChange={(e) => setContact({ ...contact, tiktok: e.target.value })}
                          />
                          <TextField
                            label={t("website")}
                            fullWidth
                            size="small"
                            value={contact.website}
                            onChange={(e) => setContact({ ...contact, website: e.target.value })}
                          />
                          <TextField
                            label={t("email")}
                            fullWidth
                            size="small"
                            value={contact.email}
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                          />
                          <Button
                            variant="contained"
                            onClick={() => {
                              const input = { contactInfo: contact };
                              handleSaveSection(input);
                            }}
                          >
                            {t("save")}
                          </Button>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {t("preview")}
                          </Typography>
                          <Stack direction="row" spacing={2}>
                            <Button size="small" startIcon={<Phone size={14} />}>
                              ☎ {t("call")}
                            </Button>
                            <Button size="small" startIcon={<Globe size={14} />}>
                              🌐 {t("website")}
                            </Button>
                            <Button size="small" startIcon={<Store size={14} />}>
                              📘 Facebook
                            </Button>
                            <Button size="small" startIcon={<Send size={14} />}>
                              ✈ Telegram
                            </Button>
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
                          <Typography variant="body2" color="text.secondary">
                            {t("overall_rating")}
                          </Typography>
                        </Stack>
                        <Stack>
                          <Typography variant="body2">
                            {t("total_reviews")}: <strong>256</strong>
                          </Typography>
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
                          <TableBody>
                            <TableRow>
                              <TableCell colSpan={6}>
                                <EmptyData />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* ========== Tab 11: Rewards Program ========== */}
                <TabPanel value="11" sx={{ p: 0 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {t("rewards_program")}
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography>{t("enable_rewards")}</Typography>
                            <Switch
                              checked={rewards.enabled}
                              onChange={() => setRewards({ ...rewards, enabled: !rewards.enabled })}
                            />
                          </Stack>
                          <TextField
                            label={t("reward_points")}
                            type="number"
                            size="small"
                            value={rewards.points}
                            onChange={(e) => setRewards({ ...rewards, points: parseInt(e.target.value) })}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">Points per $</InputAdornment>,
                            }}
                          />
                          <TextField
                            label={t("checkin_reward")}
                            type="number"
                            size="small"
                            value={rewards.checkin}
                            onChange={(e) => setRewards({ ...rewards, checkin: parseInt(e.target.value) })}
                            InputProps={{ endAdornment: <InputAdornment position="end">Points</InputAdornment> }}
                          />
                          <TextField
                            label={t("review_reward")}
                            type="number"
                            size="small"
                            value={rewards.review}
                            onChange={(e) => setRewards({ ...rewards, review: parseInt(e.target.value) })}
                            InputProps={{ endAdornment: <InputAdornment position="end">Points</InputAdornment> }}
                          />
                          <TextField
                            label={t("purchase_reward")}
                            type="number"
                            size="small"
                            value={rewards.purchase}
                            onChange={(e) => setRewards({ ...rewards, purchase: parseInt(e.target.value) })}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">Point per $</InputAdornment>,
                            }}
                          />
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                          <TextField
                            label={t("referral_reward")}
                            type="number"
                            size="small"
                            value={rewards.referral}
                            onChange={(e) => setRewards({ ...rewards, referral: parseInt(e.target.value) })}
                            InputProps={{ endAdornment: <InputAdornment position="end">Points</InputAdornment> }}
                          />
                          <TextField
                            label={t("birthday_reward")}
                            type="number"
                            size="small"
                            value={rewards.birthday}
                            onChange={(e) => setRewards({ ...rewards, birthday: parseInt(e.target.value) })}
                            InputProps={{ endAdornment: <InputAdornment position="end">Points</InputAdornment> }}
                          />
                          <TextField
                            select
                            label={t("vip_level")}
                            size="small"
                            value={rewards.vipLevel}
                            onChange={(e) => setRewards({ ...rewards, vipLevel: e.target.value })}
                          >
                            <MenuItem value="Silver">Silver</MenuItem>
                            <MenuItem value="Gold">Gold</MenuItem>
                            <MenuItem value="Platinum">Platinum</MenuItem>
                          </TextField>
                          <TextField
                            label={t("coupon")}
                            size="small"
                            value={rewards.coupon}
                            onChange={(e) => setRewards({ ...rewards, coupon: e.target.value })}
                          />
                          <Button
                            variant="contained"
                            onClick={() => {
                              const input = { rewardsSettings: rewards };
                              handleSaveSection(input);
                            }}
                          >
                            {t("save")}
                          </Button>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: "action.hover" }}>
                          <Typography variant="subtitle2">{t("example")}</Typography>
                          <Stack direction="row" spacing={4}>
                            <Typography variant="body2">
                              📝 {t("review")}: +{rewards.review} Points
                            </Typography>
                            <Typography variant="body2">
                              📍 {t("check_in")}: +{rewards.checkin} Points
                            </Typography>
                            <Typography variant="body2">
                              🛒 {t("purchase")}: {rewards.purchase} Point = $1
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Paper>
                </TabPanel>

                {/* ========== Tab 12: AI Assistant ========== */}
                <TabPanel value="12" sx={{ p: 0 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {t("ai_assistant")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t("ai_knowledge_base")}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          label={t("business_story")}
                          multiline
                          rows={2}
                          fullWidth
                          size="small"
                          value={aiKnowledge.businessStory}
                          onChange={(e) => setAiKnowledge({ ...aiKnowledge, businessStory: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          label={t("menu")}
                          multiline
                          rows={2}
                          fullWidth
                          size="small"
                          value={aiKnowledge.menu}
                          onChange={(e) => setAiKnowledge({ ...aiKnowledge, menu: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          label={t("services")}
                          multiline
                          rows={2}
                          fullWidth
                          size="small"
                          value={aiKnowledge.services}
                          onChange={(e) => setAiKnowledge({ ...aiKnowledge, services: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          label={t("popular_items")}
                          multiline
                          rows={2}
                          fullWidth
                          size="small"
                          value={aiKnowledge.popularItems}
                          onChange={(e) => setAiKnowledge({ ...aiKnowledge, popularItems: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          label={t("faq")}
                          multiline
                          rows={3}
                          fullWidth
                          size="small"
                          placeholder="Q: Do you have parking? A: Yes, free parking..."
                          value={aiKnowledge.faq}
                          onChange={(e) => setAiKnowledge({ ...aiKnowledge, faq: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          label={t("reservation_policy")}
                          multiline
                          rows={2}
                          fullWidth
                          size="small"
                          value={aiKnowledge.reservationPolicy}
                          onChange={(e) => setAiKnowledge({ ...aiKnowledge, reservationPolicy: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          label={t("delivery_policy")}
                          multiline
                          rows={2}
                          fullWidth
                          size="small"
                          value={aiKnowledge.deliveryPolicy}
                          onChange={(e) => setAiKnowledge({ ...aiKnowledge, deliveryPolicy: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          label={t("cancellation_policy")}
                          multiline
                          rows={2}
                          fullWidth
                          size="small"
                          value={aiKnowledge.cancellationPolicy}
                          onChange={(e) => setAiKnowledge({ ...aiKnowledge, cancellationPolicy: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          label={t("parking")}
                          fullWidth
                          size="small"
                          value={aiKnowledge.parking}
                          onChange={(e) => setAiKnowledge({ ...aiKnowledge, parking: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          label={t("pet_friendly")}
                          fullWidth
                          size="small"
                          value={aiKnowledge.petFriendly}
                          onChange={(e) => setAiKnowledge({ ...aiKnowledge, petFriendly: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          label={t("payment_methods")}
                          fullWidth
                          size="small"
                          value={aiKnowledge.paymentMethods}
                          onChange={(e) => setAiKnowledge({ ...aiKnowledge, paymentMethods: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          label={t("additional_notes")}
                          multiline
                          rows={2}
                          fullWidth
                          size="small"
                          value={aiKnowledge.additionalNotes}
                          onChange={(e) => setAiKnowledge({ ...aiKnowledge, additionalNotes: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            const input = { aiKnowledge: aiKnowledge };
                            handleSaveSection(input);
                          }}
                        >
                          {t("save")}
                        </Button>
                      </Grid>
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
                      <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        onClick={() => {
                          setEditingPromotion(null);
                          setOpenPromotionDialog(true);
                        }}
                      >
                        {t("add_promotion")}
                      </Button>
                    ),
                  })}
                  <PromotionForm
                    open={openPromotionDialog}
                    onClose={() => setOpenPromotionDialog(false)}
                    promotionData={editingPromotion}
                    setRefetch={refetchPromotions}
                    shopId={shopId}
                    t={t}
                  />
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
                      {promotionsLoading ? (
                        <CircularIndeterminate />
                      ) : promotions.length === 0 ? (
                        <EmptyData />
                      ) : (
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
                                <Chip
                                  label={t(row.status)}
                                  color={statusColor(row.status)}
                                  size="small"
                                  sx={{ cursor: "pointer" }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <PromotionAction
                                  data={row}
                                  setRefetch={refetchPromotions}
                                  t={t}
                                  shopId={shopId}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
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
                      <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        onClick={() => {
                          setEditingEvent(null);
                          setOpenEventDialog(true);
                        }}
                      >
                        {t("add_event")}
                      </Button>
                    ),
                  })}
                  <EventForm
                    open={openEventDialog}
                    onClose={() => setOpenEventDialog(false)}
                    eventData={editingEvent}
                    setRefetch={refetchEvents}
                    shopId={shopId}
                    t={t}
                  />
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
                      {eventsLoading ? (
                        <CircularIndeterminate />
                      ) : events.length === 0 ? (
                        <EmptyData />
                      ) : (
                        <TableBody>
                          {events.map((row, index) => (
                            <TableRow key={row._id} className="table-row">
                              <TableCell>{(eventsPaginator?.slNo || 0) + index}</TableCell>
                              <TableCell>{row.title}</TableCell>
                              <TableCell>{row.description}</TableCell>
                              <TableCell>{new Date(row.date).toLocaleString()}</TableCell>
                              <TableCell>
                                <Chip
                                  label={t(row.status)}
                                  color={statusColor(row.status)}
                                  size="small"
                                  sx={{ cursor: "pointer" }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <EventAction
                                  data={row}
                                  setRefetch={refetchEvents}
                                  t={t}
                                  shopId={shopId}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
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
                </TabPanel>

                {/* ========== Tab 15: Mobile Settings ========== */}
                <TabPanel value="15" sx={{ p: 0 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {t("mobile_settings")}
                    </Typography>
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
                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => {
                        const input = { mobileSettings: settings };
                        handleSaveSection(input);
                      }}
                    >
                      {t("save")}
                    </Button>
                  </Paper>
                </TabPanel>
              </>
            )}
          </Grid>
        </Grid>
      </TabContext>
    </Box>
  );
};

export default MobileApp;