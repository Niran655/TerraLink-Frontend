import { Link as RouterLink } from "react-router-dom";
import { Box, Breadcrumbs, Grid, Paper, Stack, Typography } from "@mui/material";
import { Share2 } from "lucide-react";

import Product from "../assets/Image/best-product.png";
import Category from "../assets/Image/category.png";
import Customer from "../assets/Image/customer.png";
import Supplier from "../assets/Image/supplier.png";
import Table from "../assets/Image/table.png";
import Unit from "../assets/Image/unit.png";
import User from "../assets/Image/man.png";
import { useAuth } from "../Context/AuthContext";
import "../Styles/setting.scss";
import { translateLauguage } from "../function/translate";
 

export default function Settings() {
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box textAlign="start">
          <Breadcrumbs aria-label="breadcrumb" separator="/">
            <Typography
          
              sx={{
                textDecoration: "none",
                borderLeft: "3px solid #1D4592",
                pl: 1.5,
                fontWeight: 600,
              }}
            >
              {t("setting")}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Stack>
    

      <Grid container spacing={3} mt={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}
            to="/setting/user"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={User} className="image" alt="User" />
            </Box>
            <Stack textAlign="start" spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`user`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`user`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}  
            to="/setting/unit"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={Unit} className="image" alt="Unit" />
            </Box>
            <Stack textAlign="start" spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`unit`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`unit`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}
            to="/setting/category"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={Category} className="image" alt="Category" />
            </Box>
            <Stack textAlign="start" spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`category`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`category`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}
            to="/setting/product"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={Product} className="image" alt="Product" />
            </Box>
            <Stack textAlign="start" spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`products`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`products`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}
            to="/setting/supplier"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={Supplier} className="image" alt="Supplier" />
            </Box>
            <Stack textAlign="start"  spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`suppliers`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`suppliers`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}
            to="/setting/customer"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={Customer} className="image" alt="Customer" />
            </Box>
            <Stack textAlign="start"  spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`customer`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`customer`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}
            to="/setting/table"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={Table} className="image" alt="Table" />
            </Box>
            <Stack textAlign="start"  spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`table`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`table`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}
            to="/setting/social-accounts"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: "50%", bgcolor: "rgba(24, 119, 242, 0.1)", color: "#1877F2", mb: 1 }}>
              <Share2 size={24} />
            </Box>
            <Stack textAlign="start" spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`social_accounts`) || "Social Accounts"}
              </Typography>
              <Typography className="text-body">
                {t(`manage_facebook_pages`) || "Manage connected Facebook Pages"}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        
      </Grid>
    </Box>
  );
}
// Settings.js — Theme‑aware with compact cards

// import { Link as RouterLink } from "react-router-dom";
// import {
//   Box,
//   Grid,
//   Stack,
//   Typography,
//   Chip,
//   Paper,
// } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import {
//   Person as PersonIcon,
//   Straighten as UnitIcon,
//   Category as CategoryIcon,
//   Inventory2 as ProductIcon,
//   LocalShipping as SupplierIcon,
//   PeopleAlt as CustomerIcon,
//   TableRestaurant as TableIcon,
//   ArrowForward as ArrowIcon,
//   Settings as SettingsIcon,
// } from "@mui/icons-material";

// import Product from "../assets/Image/best-product.png";
// import Category from "../assets/Image/category.png";
// import Supplier from "../assets/Image/supplier.png";
// import Unit from "../assets/Image/unit.png";
// import User from "../assets/Image/man.png";
// import Table from "../assets/Image/table.png";
// import Customer from "../assets/Image/customer.png";
// import { useAuth } from "../Context/AuthContext";
// import { translateLauguage } from "../function/translate";


// const CARD_META = [
//   { icon: <PersonIcon />, colorKey: "primary" },
//   { icon: <UnitIcon />, colorKey: "info" },
//   { icon: <CategoryIcon />, colorKey: "secondary" },
//   { icon: <ProductIcon />, colorKey: "success" },
//   { icon: <SupplierIcon />, colorKey: "warning" },
//   { icon: <CustomerIcon />, colorKey: "error" },
//   { icon: <TableIcon />, colorKey: "primary" },
// ];


// const SettingCard = ({ to, image, title, description, colorKey, muiIcon }) => {
//   const theme = useTheme();
//   const accentColor = theme.palette[colorKey]?.main || theme.palette.primary.main;
//   const bgColor = theme.palette[colorKey]?.light + "30" || theme.palette.primary.light + "30";  

//   return (
//     <Paper
//       component={RouterLink}
//       to={to}
//       sx={{
//         textDecoration: "none",
//         display: "block",
//         overflow: "hidden",
//         position: "relative",
//         transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
//         cursor: "pointer",
//         bgcolor: theme.palette.background.paper,
//         boxShadow: theme.shadows[1],
        
//       }}
//     >

//       <Box
//         sx={{
//           position: "absolute",
//           top: -16,
//           right: -16,
//           width: 80,
//           height: 80,
//           borderRadius: "50%",
//           bgcolor: bgColor,
//           opacity: 0.4,
//           pointerEvents: "none",
//         }}
//       />

//       <Box sx={{ p: 2, position: "relative" }}>

//         <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
//           <Box
//             sx={{
//               width: 40,
//               height: 40,
//               borderRadius: 1,
//               bgcolor: bgColor,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: accentColor,
//               "& svg": { fontSize: 20 },
//             }}
//           >
//             {muiIcon}
//           </Box>

//           <Box
//             className="card-arrow"
//             sx={{
//               width: 28,
//               height: 28,
//               borderRadius: "10%",
//               bgcolor: bgColor,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: accentColor,
//               opacity: 0,
//               transform: "translateX(-4px)",
//               transition: "opacity 0.2s ease, transform 0.2s ease",
//             }}
//           >
//             <ArrowIcon sx={{ fontSize: 14 }} />
//           </Box>
//         </Stack>


//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             mb: 1.5,
//             height: 56,
//             alignItems: "center",
//           }}
//         >
//           <Box
//             component="img"
//             src={image}
//             alt={title}
//             className="card-image"
//             sx={{
//               height: 48,
//               objectFit: "contain",
//               transition: "transform 0.25s ease",
//               filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.1))",
//             }}
//           />
//         </Box>


//         <Typography
//           variant="subtitle1"
//           sx={{
//             fontWeight: 700,
//             fontSize: "0.9rem",
//             mb: 0.3,
//             letterSpacing: "-0.01em",
//             color: theme.palette.text.primary,
//           }}
//         >
//           {title}
//         </Typography>
//         <Typography
//           variant="body2"
//           sx={{
//             color: theme.palette.text.secondary,
//             fontSize: "0.7rem",
//             lineHeight: 1.4,
//           }}
//         >
//           {description}
//         </Typography>


        
//       </Box>
//     </Paper>
//   );
// };

// export default function Settings() {
//   const theme = useTheme();
//   const { language } = useAuth();
//   const { t } = translateLauguage(language);

//   const items = [
//     { to: "/setting/user", image: User, titleKey: "user", metaIndex: 0 },
//     { to: "/setting/unit", image: Unit, titleKey: "unit", metaIndex: 1 },
//     { to: "/setting/category", image: Category, titleKey: "category", metaIndex: 2 },
//     { to: "/setting/product", image: Product, titleKey: "products", metaIndex: 3 },
//     { to: "/setting/supplier", image: Supplier, titleKey: "suppliers", metaIndex: 4 },
//     { to: "/setting/customer", image: Customer, titleKey: "customer", metaIndex: 5 },
//     { to: "/setting/table", image: Table, titleKey: "table", metaIndex: 6 },
//     { to: "/setting/chat-bot", image: Table, titleKey: "chat-bot", metaIndex: 7 },
//   ];

//   return (
//     <Box sx={{px: { xs: 1, sm: 2, md: 0 }, bgcolor: theme.palette.background.default }}>

//       <Box
//         sx={{
//           background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%)`,
//           borderRadius: 1,
//           px: 3,
//           py: 2,
//           mb: 3,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           flexWrap: "wrap",
//           gap: 2,
//           boxShadow: theme.shadows[4],
//         }}
//       >
//         <Stack direction="row" alignItems="center" spacing={1.5}>
//           <Box
//             sx={{
//               width: 40,
//               height: 40,
//               borderRadius: theme.shape.borderRadius,
//               bgcolor: "rgba(255,255,255,0.2)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <SettingsIcon sx={{ color: "white", fontSize: 20 }} />
//           </Box>
//           <Box>
//             <Typography
              
//               sx={{ color: "white", fontWeight: 700, lineHeight: 1.2, fontSize: "1rem" }}
//             >
//               {t("setting") }
//             </Typography>
//             <Typography   sx={{ color: "rgba(255,255,255,0.75)", fontSize: "0.7rem" }}>
//               {t("manage_settings") }
//             </Typography>
//           </Box>
//         </Stack>

//         <Chip
//           label={`${items.length} ${t("modules") || "Modules"}`}
//           sx={{
//             bgcolor: "rgba(255,255,255,0.18)",
//             color: "white",
//             fontWeight: 700,
//             fontSize: "0.7rem",
//             border: "1px solid rgba(255,255,255,0.3)",
//           }}
//         />
//       </Box>


//       <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
//         <Box sx={{ width: 3, height: 18, borderRadius: 0.5, bgcolor: theme.palette.primary.main }} />
//         <Typography
      
//           sx={{
//             fontWeight: 700,
//             color: theme.palette.text.secondary,
//             letterSpacing: "0.08em",
//             textTransform: "uppercase",
 
//           }}
//         >
//           {t("configuration_modules")}
//         </Typography>
//         <Box sx={{ flex: 1, height: 1, bgcolor: theme.palette.divider }} />
//       </Stack>


//       <Grid container spacing={2}>
//         {items.map(({ to, image, titleKey, metaIndex }) => (
//           <Grid key={to} size={{ xs: 12, sm: 6, md: 3 }}>
//             <SettingCard
//               to={to}
//               image={image}
//               title={t(titleKey) || titleKey}
//               description={`${t("create_update_delete") || "Manage"} ${(t(titleKey) || titleKey).toLowerCase()}`}
//               colorKey={CARD_META[metaIndex]?.colorKey || "primary"}
//               muiIcon={CARD_META[metaIndex]?.icon}
//             />
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }