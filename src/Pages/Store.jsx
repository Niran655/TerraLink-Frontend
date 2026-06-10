// import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
// import { useQuery, useLazyQuery } from "@apollo/client/react";
// import { useNavigate } from "react-router-dom";

// import {
//   Box,
//   Breadcrumbs,
//   Button,
//   Card,
//   Grid,
//   InputAdornment,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";

// import { BookmarkX, ChartBarStacked, LogIn, Search, Settings } from "lucide-react";
// import { useEffect, useState } from "react";

// import ShopAction from "../Components/Shop/ShopAction";
// import ShopForm from "../Components/Shop/ShopForm";


// import { GET_ALL_SHOP, GET_OPEN_SHIFT } from "../../graphql/queries";

// import { translateLauguage } from "../function/translate";
// import { useAuth } from "../Context/AuthContext";


// const Store = () => {
//   const { language, userRole, setAlert, quickAlert } = useAuth();
//   const { t } = translateLauguage(language);

//   const [open, setOpen] = useState(false);
//   const [keyword, setKeyword] = useState("");

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const [userObject, setUserObject] = useState(null);

//   const navigate = useNavigate();


//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");

//     if (storedUser) {
//       setUserObject(JSON.parse(storedUser));
//     }
//   }, []);


//   const { data, refetch, loading } = useQuery(GET_ALL_SHOP, {
//     variables: {
//       id: "",
//     },
//   });



//   const [checkOpenShift] = useLazyQuery(GET_OPEN_SHIFT);


//   const handleJoinShop = async (shopId) => {
//     const userId = userObject?._id;

//     if (!userId) {
//       quickAlert(true, "error", {
//         messageEn: "User not found",
//         messageKh: "រកមិនឃើញអ្នកប្រើប្រាស់",
//       });
//       return;
//     }

//     try {
//       const { data } = await checkOpenShift({
//         variables: {
//           userId,
//           shopId,
//         },
//         fetchPolicy: "network-only",
//       });

//       const openShift = data?.getOpenShift;

//       if (!openShift) {
//         quickAlert(
//           "warning",
//           "Please start your shift before entering POS",
//           "សូមបើកវេនការងារជាមុនសិន"
//         );
//         alert("កុំស្រឡាញ់គេម្នាក់ឯង")
//         return
//       }

//       localStorage.setItem("activeShopId", shopId);

//       navigate(`/store/pos/${shopId}`);
//     } catch (error) {
//       setAlert(true, "error", {
//         messageEn: error.message,
//         messageKh: error.message,
//       });
//     }
//   };


//   const filteredShops = data?.getAllShops?.filter((shop) =>
//     shop?.nameEn?.toLowerCase().includes(keyword.toLowerCase())
//   );

//   return (
//     <Box>


//       <Stack direction="row" justifyContent="space-between" alignItems="center">
//         <Box textAlign="start">
//           <Breadcrumbs aria-label="breadcrumb" separator="/">
//             <Typography
//               variant="h6"
//               sx={{
//                 textDecoration: "none",
//                 borderLeft: "3px solid #1D4592",
//                 pl: 1.5,
//                 fontWeight: 600,
//               }}
//             >
//               {t("store")}
//             </Typography>
//           </Breadcrumbs>
//         </Box>
//       </Stack>



//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//         mt={5}
//       >
//         <Grid container spacing={2} alignItems="center" textAlign="start">
//           <Grid size={{ xs: 12 }}>
//             <Typography variant="body2" fontWeight={500} mb={0.5}>
//               {t("search")}
//             </Typography>

//             <TextField
//               type="search"
//               size="small"
//               placeholder={t("search") + "..."}
//               fullWidth
//               variant="outlined"
//               value={keyword}
//               onChange={(e) => setKeyword(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search size={18} />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//         </Grid>



//         <Stack direction="row" spacing={2} mt={3}>
//           {(userRole === "superAdmin" || userRole === "admin") && (
//             <Button
//               variant="contained"
//               startIcon={<LibraryAddOutlinedIcon />}
//               onClick={handleOpen}
//             >
//               {t("create")}
//             </Button>
//           )}

//           {open && (
//             <ShopForm
//               open={open}
//               dialogTitle={"Create"}
//               setRefetch={refetch}
//               onClose={handleClose}
//               t={t}
//             />
//           )}
//         </Stack>
//       </Box>


//       <Grid container spacing={3} mt={4}>
//         {filteredShops?.map((shop, index) => (
//           <Grid size={{ xs: 12, md: 4 }} key={index}>
//             <Card
//               sx={{
//                 p: 2,
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//                 height: "100%",
//               }}
//             >
//               {/* Top Section: Logo + Report */}
//               <Stack
//                 direction="row"
//                 spacing={2}
//                 alignItems="start"
//                 justifyContent="space-between"
//               >

//                 <Stack direction="row" spacing={2} alignItems="start">
//                   <img
//                     src={shop.image}
//                     alt={shop.nameKh}
//                     width={80}
//                     height={80}
//                     style={{ borderRadius: "5px" }}
//                   />
//                   <Typography variant="subtitle1" fontWeight={600}>
//                     {language === "en" ? shop.nameEn : shop.nameKh}
//                   </Typography>
//                 </Stack>


//                 <Button
//                   size="small"
//                   variant="contained"
//                   startIcon={<ChartBarStacked size={16} />}
//                 >
//                   {t("report")}
//                 </Button>
//               </Stack>


//               <Stack direction="row" spacing={2} mt={3}>
//                 <Button
//                   fullWidth
//                   startIcon={<LogIn size={16} />}
//                   size="small"
//                   variant="contained"
//                   onClick={() => handleJoinShop(shop._id)}
//                 >
//                   {t("join_in_shop")}
//                 </Button>

//                 <Button
//                   fullWidth
//                   size="small"
//                   variant="contained"
//                   sx={{ bgcolor: "red" }}
//                   startIcon={<BookmarkX size={16} />}
//                 >
//                   {t("close_shop")}
//                 </Button>

//                 <Box mt={2}>
//                   <ShopAction
//                     setRefetch={refetch}
//                     t={t}
//                     shopData={shop}
//                     shopId={shop?._id}
//                     shopName={shop?.nameEn}
//                     userId={userObject?._id}
//                   />
//                 </Box>
//               </Stack>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default Store;


// Store.js — Theme‑aware with dark mode support
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { useQuery, useLazyQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Chip,
  Avatar,
  Skeleton,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BookmarkX, ChartBarStacked, LogIn, Search, Store as StoreIcon } from "lucide-react";
import { useState } from "react";

import ShopAction from "../Components/Shop/ShopAction";
import ShopForm from "../Components/Shop/ShopForm";
import { GET_ALL_SHOP, GET_OPEN_SHIFT } from "../../graphql/queries";
import { translateLauguage } from "../function/translate";
import { useAuth } from "../Context/AuthContext";
import { canAccessShop, canManageShops } from "../utils/tenantAccess";

 
const ShopCard = ({ shop, language, t, onJoin, onReport, shopActions }) => {
  const theme = useTheme();
  const initials = (shop.nameEn || "S").slice(0, 2).toUpperCase();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius:1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: theme.shadows[4],
          borderColor: theme.palette.primary.main,
        },
        "&::before": {
          content: '""',
          display: "block",
          height: "4px",
          background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.primary.light} 100%)`,
        },
      }}
    >
 
      <Box sx={{ p: 2.5, flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
 
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
            {shop.image ? (
              <Box
                component="img"
                src={shop.image}
                alt={shop.nameKh}
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius:1,
                  objectFit: "cover",
                  border: `2px solid ${theme.palette.divider}`,
                  flexShrink: 0,
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius:1,
                  bgcolor: theme.palette.primary.light + "30",
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}
              >
                {initials}
              </Avatar>
            )}
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontSize: "0.95rem",
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {language === "en" ? shop.nameEn : shop.nameKh}
              </Typography>
              <Chip
                label={t("active") || "Active"}
                size="small"
                      color= 'success'
                sx={{
                  mt: 0.5,
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 700,
       
                }}
              />
            </Box>
          </Stack>

      
          <Button
            size="small"
            variant="outlined"
            startIcon={<ChartBarStacked size={13} />}
            onClick={onReport}
            sx={{
              flexShrink: 0,
              borderRadius:1,
              fontWeight: 600,
              fontSize: "0.72rem",
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              px: 1.2,
              py: 0.5,
              "&:hover": { bgcolor: theme.palette.primary.light + "30", borderColor: theme.palette.primary.dark },
            }}
          >
            {t("report") || "Report"}
          </Button>
        </Stack>
      </Box>

    
      <Divider sx={{ borderColor: theme.palette.divider }} />

      
      <Box sx={{ p: 2, bgcolor: theme.palette.action.hover }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            fullWidth
            size="small"
            variant="contained"
            startIcon={<LogIn size={14} />}
            onClick={onJoin}
            sx={{
              borderRadius:1,
              fontWeight: 700,
              fontSize: "0.75rem",
              py: 0.9,
              bgcolor: theme.palette.primary.main,
              boxShadow: "none",
              "&:hover": { bgcolor: theme.palette.primary.dark, boxShadow: theme.shadows[2] },
            }}
          >
            {t("join_in_shop") || "Join Shop"}
          </Button>

          <Button
            fullWidth
            size="small"
            variant="outlined"
            startIcon={<BookmarkX size={14} />}
            sx={{
              borderRadius:1,
              fontWeight: 700,
              fontSize: "0.75rem",
              py: 0.9,
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              "&:hover": { bgcolor: theme.palette.error.light + "30", borderColor: theme.palette.error.dark },
            }}
          >
            {t("close_shop") || "Close Shop"}
          </Button>

          <Box sx={{ flexShrink: 0 }}>
            {shopActions}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

 
const ShopSkeleton = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius:1,
        overflow: "hidden",
        "&::before": {
          content: '""',
          display: "block",
          height: "4px",
          bgcolor: theme.palette.divider,
        },
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
          <Skeleton variant="rounded" width={56} height={56} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="60%" height={20} />
            <Skeleton width="30%" height={16} sx={{ mt: 0.5 }} />
          </Box>
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
          <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
          <Skeleton variant="circular" width={36} height={36} />
        </Stack>
      </Box>
    </Box>
  );
};

 
const Store = () => {
  const theme = useTheme();
  const { language, user, setAlert, quickAlert } = useAuth();
  const { t } = translateLauguage(language);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const tenantId = user?.tenantId?._id || user?.tenantId || "";
  const { data, refetch, loading } = useQuery(GET_ALL_SHOP, {
    variables: { id: user?.role === "superAdmin" ? "" : tenantId },
  });

  const [checkOpenShift] = useLazyQuery(GET_OPEN_SHIFT);

  const handleJoinShop = async (shopId) => {
    if (!canAccessShop(user, shopId)) {
      quickAlert("error", "You do not have access to this shop", "អ្នកមិនមានសិទ្ធិចូលហាងនេះទេ");
      return;
    }

    const userId = user?._id;
    if (!userId) {
      quickAlert(true, "error", { messageEn: "User not found", messageKh: "រកមិនឃើញអ្នកប្រើប្រាស់" });
      return;
    }
    try {
      const { data } = await checkOpenShift({ variables: { userId, shopId }, fetchPolicy: "network-only" });
      const openShift = data?.getOpenShift;
      if (!openShift) {
        quickAlert("warning", "Please start your shift before entering POS", "សូមបើកវេនការងារជាមុនសិន");
        return;
      }
      localStorage.setItem("activeShopId", shopId);
      navigate(`/store/pos/${shopId}`);
    } catch (error) {
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    }
  };

  const visibleShops = (data?.getAllShops || []).filter((shop) => canAccessShop(user, shop?._id));
  const filteredShops = visibleShops.filter((shop) => {
    const matchesKeyword = shop?.nameEn?.toLowerCase().includes(keyword.toLowerCase());
    const matchesStatus =
      activeFilter === "all"
        ? true
        : activeFilter === "active"
        ? shop?.active === true
        : shop?.active === false;
    return matchesKeyword && matchesStatus;
  });

  const totalShops = visibleShops.length;

  return (
    <Box >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%)`,
          borderRadius:1,
          px: 3,
          py: 2.5,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          boxShadow: theme.shadows[4],
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius:1,
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StoreIcon size={22} color="white" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: "white", fontWeight: 700, lineHeight: 1.2, fontSize: "1.1rem" }}>
              {t("store") || "Stores"}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)", fontSize: "0.7rem" }}>
              {t("manage_stores") || "Manage and access your store locations"}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Chip
            label={`${totalShops} ${t("shops") || "Shops"}`}
            sx={{
              bgcolor: "rgba(255,255,255,0.18)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.78rem",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          />
          {canManageShops(user) && (
            <Button
              variant="contained"
              startIcon={<LibraryAddOutlinedIcon />}
              onClick={() => setOpen(true)}
              sx={{
                bgcolor: "white",
                color: theme.palette.primary.dark,
                fontWeight: 700,
                boxShadow: "none",
                borderRadius:1,
                "&:hover": { bgcolor: theme.palette.primary.light, boxShadow: "none" },
              }}
            >
              {t("create") || "Create"}
            </Button>
          )}
        </Stack>
      </Box>

      <Box
        sx={{
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius:1,
          px: 2.5,
          py: 2,
          mb: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
             
            <TextField
              type="search"
              size="small"
              placeholder={`${t("search")} ${t("store")}...`}
              fullWidth
              variant="outlined"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color={theme.palette.primary.main} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
          
            <TextField
              select
              fullWidth
              size="small"
         
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <MenuItem value="active">{t("active")}</MenuItem>
              <MenuItem value="inactive">{t("inactive")}</MenuItem>
              <MenuItem value="all">{t("all")}</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>

  
      <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
        <Box sx={{ width: 4, height: 22, borderRadius: 1, bgcolor: theme.palette.primary.main }} />
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: theme.palette.text.secondary, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.72rem" }}
        >
          {keyword
            ? `${filteredShops?.length || 0} ${t("results") || "Results"}`
            : t("all_stores") || "All Stores"}
        </Typography>
        <Box sx={{ flex: 1, height: 1, bgcolor: theme.palette.divider }} />
      </Stack>

    
      <Grid container spacing={2.5}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <ShopSkeleton />
              </Grid>
            ))
          : filteredShops?.length === 0
          ? (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  bgcolor: theme.palette.background.paper,
                  border: `1px dashed ${theme.palette.divider}`,
                  borderRadius:1,
                }}
              >
                <Typography variant="h2" mb={1}>🏪</Typography>
                <Typography variant="h6" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                  {t("no_stores_found") || "No stores found"}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mt: 0.5 }}>
                  {t("try_different_search") || "Try a different search term"}
                </Typography>
              </Box>
            </Grid>
          )
          : filteredShops?.map((shop, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <ShopCard
                  shop={shop}
                  language={language}
                  t={t}
                  onJoin={() => handleJoinShop(shop._id)}
                  onReport={() => {}}
                  shopActions={
                    <ShopAction
                      setRefetch={refetch}
                      t={t}
                      shopData={shop}
                      shopId={shop?._id}
                      shopName={shop?.nameEn}
                      userId={user?._id}
                    />
                  }
                />
              </Grid>
            ))}
      </Grid>

 
      {open && (
        <ShopForm
          open={open}
          dialogTitle="Create"
          setRefetch={refetch}
          onClose={() => setOpen(false)}
          t={t}
        />
      )}
    </Box>
  );
};

export default Store;
