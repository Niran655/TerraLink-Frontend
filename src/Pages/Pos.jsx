// import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
// import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
// import RemoveIcon from "@mui/icons-material/Remove";
// import SearchIcon from "@mui/icons-material/Search";
// import AddIcon from "@mui/icons-material/Add";
// import { useMutation, useQuery } from "@apollo/client/react";
// import { Navigate, useParams } from "react-router-dom";
// import { Box, Button, Card, CardContent, CardMedia, Chip, Divider, Grid, IconButton, InputAdornment, LinearProgress, MenuItem, Paper, Select, Stack, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
// import { Timer, Trash2 } from "lucide-react";
// import { useEffect, useState } from "react";

// import InvoicePending from "../Components/pos/InvoicePending";
// import SaleHistory from "../Components/pos/SaleHistory";
// import { CREATE_SALE } from "../../graphql/mutation";
// import { useAuth } from "../context/AuthContext";
// import { GET_PRODUCT_FOR_SALE_WITH_PAGINATION } from "../../graphql/queries";
// import { translateLauguage } from "../function/translate";
// import "../Styles/pos.scss";
// const orders = [
//   {
//     id: "65698",
//     customer: "Liam O'Connor",
//     type: "Dine-in Table",
//     time: "11:10 AM",
//     table: "Table 1",
//     elapsed: 45,
//     estimated: 33,
//   },
//   {
//     id: "96589",
//     customer: "Sophia Kim",
//     type: "Delivery",
//     time: "11:20 AM",
//     elapsed: 22,
//     estimated: 70,
//   },
//   {
//     id: "14589",
//     customer: "James Smith",
//     type: "Delivery",
//     time: "11:30 AM",
//     elapsed: 12,
//     estimated: 20,
//   },
// ];

// const POS = () => {
//   const { shopId } = useParams();
//   const activeShopId = localStorage.getItem("activeShopId");
//   const { setAlert } = useAuth();
//   const { language } = useAuth();
//   const { t } = translateLauguage(language);
//   const [openHistory, setOpenHistory] = useState(false);
//   const handleOpenSaleHistory = () => setOpenHistory(true);
//   const handleCloseSaleHistory = () => setOpenHistory(false);
//   const [openSalePending, setOpenSalePending] = useState(false);
//   const handleOpenSalePending = () => setOpenSalePending(true);
//   const handleCloseSalePending = () => setOpenSalePending(false);
//   const { data, loading } = useQuery(GET_PRODUCT_FOR_SALE_WITH_PAGINATION, {
//     variables: {
//       shopId,
//       page: 1,
//       limit: 50,
//       pagination: false,
//       keyword: "",
//       categoryId: "",
//     },
//     pollInterval: 1000,
//   });
//   const [cart, setCart] = useState([]);
//   const [createSale, { loading: creating, error: createError }] = useMutation(
//     CREATE_SALE,
//     {
//       onCompleted: ({ createSale }) => {
//         if (createSale?.isSuccess) {
//           setAlert(true, "success", createSale?.message);
//           setCart([]);
//         } else {
//           setAlert(true, "error", createSale?.message);
//         }
//       },
//       onError: (error) => {
//         console.log("Error", error);
//       },
//     },
//   );

//   const [orderType, setOrderType] = useState("dine_in");
//   const [selectedOrderType, setSelectedOrderType] = useState("All");
//   const [selectedTable, setSelectedTable] = useState("Table 01");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [categories, setCategories] = useState([
//     { id: "all", nameEn: "All", nameKh: "ទាំងអស់" },
//   ]);
//   const [searchKeyword, setSearchKeyword] = useState("");

//   useEffect(() => {
//     if (data?.getProductForSaleWithPagination?.data) {
//       const categoryMap = new Map();
//       data.getProductForSaleWithPagination.data
//         .filter((item) => item.parentProductId?.categoryId)
//         .forEach((item) => {
//           const category = item.parentProductId.categoryId;
//           if (!categoryMap.has(category._id)) {
//             categoryMap.set(category._id, {
//               id: category._id,
//               nameEn: category.nameEn,
//               nameKh: category.nameKh,
//             });
//           }
//         });

//       const uniqueCategories = Array.from(categoryMap.values());
//       setCategories([
//         { id: "all", nameEn: "All", nameKh: "ទាំងអស់" },
//         ...uniqueCategories,
//       ]);
//     }
//   }, [data, language]);

//   useEffect(() => {
//     if (selectedCategory === "all") {
//       setSelectedCategory("all");
//     }
//   }, [language]);

//   if (activeShopId !== shopId) {
//     return <Navigate to="/store" replace />;
//   }

//   const tables = [
//     "Table 01",
//     "Table 02",
//     "Table 03",
//     "Table 04",
//     "Table 05",
//     "Table 06",
//   ];

//   const ORDER_TYPES = {
//     DINE_IN: "dine_in",
//     TAKEAWAY: "take_away",
//     DELIVERY: "delivery",
//   };

//   const filteredProducts = data?.getProductForSaleWithPagination?.data?.filter(
//     (item) => {
//       if (selectedCategory === "all") {
//         const matchesSearch =
//           item.parentProductId?.nameKh
//             ?.toLowerCase()
//             .includes(searchKeyword.toLowerCase()) ||
//           item.parentProductId?.nameEn
//             ?.toLowerCase()
//             .includes(searchKeyword.toLowerCase());
//         return matchesSearch;
//       } else {
//         const matchesCategory =
//           item.parentProductId?.categoryId?._id === selectedCategory ||
//           item.parentProductId?.categoryId?.nameEn === selectedCategory ||
//           item.parentProductId?.categoryId?.nameKh === selectedCategory;

//         const matchesSearch =
//           item.parentProductId?.nameKh
//             ?.toLowerCase()
//             .includes(searchKeyword.toLowerCase()) ||
//           item.parentProductId?.nameEn
//             ?.toLowerCase()
//             .includes(searchKeyword.toLowerCase());

//         return matchesCategory && matchesSearch;
//       }
//     },
//   );

//   const filteredOrders =
//     selectedOrderType === "All Order"
//       ? orders
//       : orders.filter((o) => o.type === selectedOrderType);

//   const addToCart = (item) => {
//     setCart((prev) => {
//       const found = prev.find((p) => p.id === item._id);
//       if (found) {
//         return prev.map((p) =>
//           p.id === item._id ? { ...p, qty: p.qty + 1 } : p,
//         );
//       }
//       return [
//         ...prev,
//         {
//           id: item._id,
//           subProductId: item._id,
//           productId: item.parentProductId._id,
//           name:
//             language === "kh"
//               ? item.parentProductId.nameKh
//               : item.parentProductId.nameEn,
//           nameEn: item.parentProductId.nameEn,
//           nameKh: item.parentProductId.nameKh,
//           price: item.salePrice,
//           qty: 1,
//           img: item.productImg,
//           variant: "Original",
//         },
//       ];
//     });
//   };

//   const updateQty = (id, value) => {
//     if (value === 0) {
//       removeFromCart(id);
//     } else {
//       setCart((prev) =>
//         prev.map((item) => (item.id === id ? { ...item, qty: value } : item)),
//       );
//     }
//   };

//   const removeFromCart = (id) => {
//     setCart((prev) => prev.filter((item) => item.id !== id));
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
//   const tax = subtotal * 0.1;
//   const total = subtotal + tax;

//   const handleCreateSale = async () => {
//     try {
//       const orderTypeMap = {
//         dine_in: "Dine In",
//         take_away: "Takeaway",
//         delivery: "Delivery",
//       };
//       const subtotalRounded = Number(subtotal.toFixed(2));
//       const taxRounded = Number(tax.toFixed(2));
//       const totalRounded = Number((subtotalRounded + taxRounded).toFixed(2));
//       const amountPaid = totalRounded;
//       const change = Number((amountPaid - totalRounded).toFixed(2));
//       const input = {
//         shopId: shopId,
//         items: cart.map((item) => ({
//           product: item.productId,
//           subProductId: item.subProductId,
//           name: item.name,
//           price: Number(item.price.toFixed(2)),
//           quantity: item.qty,
//           total: Number((item.price * item.qty).toFixed(2)),
//         })),
//         subtotal: subtotalRounded,
//         tax: taxRounded,
//         discount: 0,
//         total: totalRounded,
//         paymentMethod: "cash",
//         amountPaid,
//         change,
//         // orderType: orderTypeMap[orderType] || "Dine In",
//         // table: selectedTable,
//       };
//       console.log("input sale", input);
//       await createSale({ variables: { input } });
//     } catch (error) {
//       console.error("Error creating sale:", error);
//     }
//   };

//   const getCategoryData = (category, language) => {
//     const name = language === "kh" ? category.nameKh : category.nameEn;
//     const image = category.image; // assuming category has an `image` property

//     return { name, image };
//   };

//   const orderTypes = [
//     { key: "dine_in", label: t("dine_in") },
//     { key: "take_away", label: t("take_away") },
//     { key: "delivery", label: t("delivery") },
//   ];

//   return (
//     <Box className="pos-container">
//       <Grid container spacing={2} sx={{ height: "90vh", overflow: "hidden" }}>
//         <Grid size={{ xs: 8 }}>
//           <Box
//             sx={{ overflowY: "auto", height: "100vh", scrollbarWidth: "thin",padding:2 }}
//           >
//             <Grid container className="product-list-header">
//               <Grid
//                 container
//                 justifyContent="flex-start"
//                 alignItems="center"
//                 mb={2}
//                 size={{ xs: 12 }}
//                 spacing={2}
//               >
//                 <Grid xs={6}>
//                   <Typography className="section-title">
//                     {t(`recent_orders`)}
//                   </Typography>
//                 </Grid>

//                 <Grid xs={6}>
//                   <Stack direction="row" spacing={1}>
//                     {["All Order", "Takeaway", "Dine-in Table", "Delivery"].map(
//                       (orderType) => (
//                         <Button
//                           key={orderType}
//                           sx={{ borderRadius: "5px" }}
//                           onClick={() => setSelectedOrderType(orderType)}
//                           variant={
//                             selectedOrderType === orderType
//                               ? "contained"
//                               : "outlined"
//                           }
//                           className={`order-type-button ${
//                             selectedOrderType === orderType
//                               ? "order-type-button--active"
//                               : ""
//                           }`}
//                         >
//                           {orderType}
//                         </Button>
//                       ),
//                     )}
//                   </Stack>
//                 </Grid>
//               </Grid>

//               <Grid
//                 container
//                 spacing={2}
//                 alignItems="center"
//                 mb={2}
//                 size={{ xs: 12 }}
//               >
//                 {filteredOrders.map((order) => (
//                   <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={order.id}>
//                     <Card className="order-card">
//                       <Stack
//                         direction={"row"}
//                         justifyContent="space-between"
//                         alignItems="center"
//                         mb={1}
//                       >
//                         <Typography className="order-id">
//                           #{order.id}
//                         </Typography>
//                         <Box>
//                           <Chip
//                             label={order.type}
//                             size="small"
//                             sx={{
//                               fontWeight: "bold",
//                               color: "#45556C",
//                               bgcolor: "#F8F8F8",
//                             }}
//                           />
//                         </Box>
//                       </Stack>

//                       <Stack
//                         direction={"row"}
//                         justifyContent="space-between"
//                         alignItems="center"
//                         mb={1}
//                       >
//                         <Box>
//                           <Typography variant="body2"  >
//                             {order.customer}  
//                           </Typography>
//                           <Typography variant="body2">
//                             {order.time}
//                           </Typography>
//                         </Box>
//                         <Box className="order-status-container">
//                           <Timer size={16} color="white" />
//                           <Typography className="order-status">
//                             {order.estimated} Mins
//                           </Typography>
//                         </Box>
//                       </Stack>
//                       <Typography className="order-text"></Typography>

//                       {/* {order.table && (
//                       <Typography className="order-text">
//                         <strong>Table:</strong> {order.table}
//                       </Typography>
//                     )} */}

//                       <LinearProgress
//                         variant="determinate"
//                         value={(order.elapsed / order.estimated) * 100}
//                         className="order-progress"
//                       />
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>

//               <Grid size={{ xs: 6 }}>
//                 <Typography className="section-title">
//                   {t(`product_list`)}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 6 }}>
//                 <Box className="search-container">
//                   <TextField
//                     placeholder={t(`search`)}
//                     value={searchKeyword}
//                     onChange={(e) => setSearchKeyword(e.target.value)}
//                     size="small"
//                     className="search-field"
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon fontSize="small" color="action" />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Box>
//               </Grid>
//             </Grid>

//             <Box className="category-scroll-container">
//               {categories.map((category) => {
//                 const { name, image } = getCategoryData(category, language);

//                 return (
//                   <Button
//                     key={category.id}
//                     onClick={() => setSelectedCategory(category.id)}
//                     variant={
//                       selectedCategory === category.id
//                         ? "contained"
//                         : "outlined"
//                     }
//                     className={`category-button ${
//                       selectedCategory === category.id
//                         ? "category-button--active"
//                         : ""
//                     }`}
//                   >
//                     <Box display="flex" alignItems="center" gap={1}>
//                       {/* <img
//                       src={image}
//                       alt={name}
//                       style={{ width: 24, height: 24, objectFit: "contain" }}
//                     /> */}
//                       <span>{name}</span>
//                     </Box>
//                   </Button>
//                 );
//               })}
//             </Box>
//             <Grid container spacing={1} className="product-grid">
//               {filteredProducts?.map((item, idx) => (
//                 <Grid size={{ xs: 3 }} key={idx}>
//                   <Card
//                     className="product-card"
//                     onClick={() => addToCart(item)}
//                   >
//                     <CardMedia
//                       component="img"
//                       height="100"
//                       image={item.productImg || "/placeholder-food.jpg"}
//                       alt={item.parentProductId?.nameKh || "Product"}
//                       className="product-image"
//                     />
//                     <CardContent className="product-content">
//                       <Typography className="product-name">
//                         {language === "kh"
//                           ? item.parentProductId?.nameKh
//                           : item.parentProductId?.nameEn}
//                       </Typography>
//                       <Typography className="product-category">
//                         {language === "kh"
//                           ? item.parentProductId?.categoryId?.nameKh
//                           : item.parentProductId?.categoryId?.nameEn}
//                       </Typography>
//                       <Box className="product-footer">
//                         <Typography className="product-price">
//                           {item.salePrice?.toLocaleString()}$
//                         </Typography>

//                         <Chip
//                           label={
//                             language === "kh"
//                               ? item?.unitId?.nameKh
//                               : item?.unitId?.nameEn
//                           }
//                           size="small"
//                           color="primary"
//                           className="add-chip"
//                         />
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         </Grid>

//         {/* ---------------- CART PANEL ---------------- */}
//         <Grid size={{ xs: 4 }} sx={{borderLeft:"1px solid #D1D5DC"}}>
//           <Box>
//             <Box className="cart-panel"  sx={{ overflow: "auto", height: "100%" }}>
//               <Box className="cart-header">
//                 <Stack direction={"row"} spacing={2} alignItems={"center"}>
//                   <Typography className="cart-title">
//                     {t(`current_order`)}
//                   </Typography>
//                   <Tooltip title="View  history">
//                     <IconButton onClick={handleOpenSaleHistory}>
//                       <ReceiptOutlinedIcon />
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title="View Stop Invoice">
//                     <IconButton onClick={handleOpenSalePending}>
//                       <ManageHistoryOutlinedIcon />
//                     </IconButton>
//                   </Tooltip>
//                   <SaleHistory
//                     open={openHistory}
//                     onClose={handleCloseSaleHistory}
//                     t={t}
//                   />
//                   <InvoicePending
//                     t={t}
//                     open={openSalePending}
//                     onClose={handleCloseSalePending}
//                   />
//                 </Stack>


//                 <Stack direction={"row"} spacing={2}>
//                   {cart.length > 0 && (
//                     <Button size="small" color="error" onClick={clearCart}>
//                       <Typography color="error">{t(`clear`)}</Typography>
//                     </Button>
//                   )}
//                 </Stack>
//               </Box>
//               <Divider/>
//               <Tabs
//                 value={orderType}
//                 onChange={(e, newValue) => setOrderType(newValue)}
//                 variant="fullWidth"
//                 className="order-type-tabs"
//               >
//                 {orderTypes.map((type) => (
//                   <Tab
//                     key={type.key}
//                     label={type.label}
//                     value={type.key}
//                     component={Button}
//                     sx={{
//                       mx: 0.2,
//                       "&.Mui-selected": {
//                         bgcolor: "primary.main",
//                         color: "white",
//                         borderRadius: "5px",
//                       },
//                     }}
//                   />
//                 ))}
//               </Tabs>

//               <Divider />

//               {orderType === ORDER_TYPES.DINE_IN && (
//                 <Box className="customer-info">
//                   <TextField
//                     fullWidth
//                     placeholder={t(`customer`)}
//                     size="small"
//                     className="customer-field"
//                   />
//                   <Select
//                     fullWidth
//                     value={selectedTable}
//                     onChange={(e) => setSelectedTable(e.target.value)}
//                     size="small"
//                   >
//                     {tables.map((table) => (
//                       <MenuItem
//                         key={table}
//                         value={table}
//                         className="table-menu-item"
//                       >
//                         {table}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </Box>
//               )}

//               <Divider className="section-divider" />

//               <Box className="cart-items-container">
//                 {cart.map((item, idx) => (
//                   <Box key={idx} className="cart-item"  >
//                     <img
//                       src={item.img || "/placeholder-food.jpg"}
//                       className="cart-item-image"
//                       alt={item.name}
//                     />
//                     <Stack direction={"column"} className="cart-item-details">
//                       <Typography className="cart-item-name">
//                         {item.name}
//                       </Typography>
//                       <Typography className="cart-item-price">
//                         {item.price.toLocaleString()}$
//                       </Typography>
//                     </Stack>

//                     <Box className="cart-item-spacer"></Box>

//                     <Typography className="cart-item-total">
//                       {t(`total_price`)}:{" "}
//                       {(item.qty * item.price).toLocaleString()}$
//                     </Typography>

//                     <Box className="quantity-controls">
//                       <IconButton
//                         size="small"
//                         onClick={() => updateQty(item.id, item.qty - 1)}
//                         className="qty-button"
//                       >
//                         <RemoveIcon fontSize="small" />
//                       </IconButton>
//                       <TextField
//                         value={item.qty}
//                         onChange={(e) =>
//                           updateQty(item.id, parseInt(e.target.value) || 0)
//                         }
//                         size="small"
//                         className="qty-input"
//                       />
//                       <IconButton
//                         size="small"
//                         onClick={() => updateQty(item.id, item.qty + 1)}
//                         className="qty-button"
//                       >
//                         <AddIcon fontSize="small" />
//                       </IconButton>
//                     </Box>

//                     <Box className="cart-item-actions">
//                       <IconButton
//                         onClick={() => removeFromCart(item.id)}
//                         className="delete-button"
//                       >
//                         <Trash2 size={16} />
//                       </IconButton>
//                     </Box>
//                   </Box>
//                 ))}
//                 {cart.length === 0 && (
//                   <Typography className="empty-cart-message">
//                     {t(`cart_empty`)}
//                   </Typography>
//                 )}
//               </Box>

//               <Divider className="section-divider" />

//               <Box className="order-summary">
//                 <Box className="summary-row">
//                   <Typography className="summary-label">
//                     {t(`subtotal`)}
//                   </Typography>
//                   <Typography className="summary-value">
//                     {subtotal.toLocaleString()}$
//                   </Typography>
//                 </Box>
//                 <Box className="summary-row">
//                   <Typography className="summary-label">
//                     {t(`tax`)} (10%)
//                   </Typography>
//                   <Typography className="summary-value">
//                     {tax.toLocaleString()}$
//                   </Typography>
//                 </Box>
//                 <Box className="summary-row">
//                   <Typography className="summary-label">
//                     {t(`discount`)}
//                   </Typography>
//                   <Typography className="summary-value">0$</Typography>
//                 </Box>
//                 <Divider />
//                 <Box className="total-row">
//                   <Typography className="total-label">
//                     {t(`total_price`)}
//                   </Typography>
//                   <Typography className="total-value">
//                     {total.toLocaleString()}$
//                   </Typography>
//                 </Box>
//               </Box>
//               <Stack direction={"row"} spacing={2} alignItems={"center"}>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   size="medium"
//                   disabled={cart.length === 0 || creating}
//                   className="pay-button"
//                   sx={{ bgcolor: "red" }}
//                 >
//                   {t(`stop_invoice`)}
//                 </Button>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   size="medium"
//                   onClick={handleCreateSale}
//                   disabled={cart.length === 0 || creating}
//                   className="pay-button"
//                 >
//                   {t(`pay_now`)} {total.toLocaleString()}$
//                 </Button>
//               </Stack>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default POS;


import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { Navigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

import {
  GET_PRODUCT_FOR_SALE_WITH_PAGINATION,
  GET_SUPPRODUCT_BY_ID,
  GET_TABLE_BY_SHOP_ID,
  GET_CUSTOMERS_BY_SHOP_ID,
  GET_SHOP_BY_ID,
} from "../../graphql/queries";

import {
  CHECK_BAKONG_PAYMENT,
  CREATE_BAKONG_PAYMENT,
  CREATE_SALE,
} from "../../graphql/mutation";
import { translateLauguage } from "../function/translate";
import ProductDialog from "../Components/pos/ProductDialog";
import PaymentDialog from "../Components/pos/PaymentDialog";
import ProductList from "../Components/pos/ProductList";
import CartPanel from "../Components/pos/CartPanel";
import CustomerOrderNotifications from "../Components/pos/CustomerOrderNotifications";
import RecentOrders from "../Components/pos/RecentOrders";
import "../Styles/pos.scss";

const GUEST = { _id: "guest", nameEn: "Guest", nameKh: "ភ្ញៀវ" };

const KHQR_PAYMENT_DURATION_MS = 5 * 60 * 1000;

const formatCountdown = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const POS = () => {
  const { shopId } = useParams();
  const activeShopId = localStorage.getItem("activeShopId");
  const { setAlert, language } = useAuth();
  const { t } = translateLauguage(language);

 
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openPendingDialog, setOpenPendingDialog] = useState(false);
  const [qrPaymentData, setQrPaymentData] = useState(null);
  const [qrTimeLeft, setQrTimeLeft] = useState(KHQR_PAYMENT_DURATION_MS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openHistory, setOpenHistory] = useState(false);
  const [openSalePending, setOpenSalePending] = useState(false);

 
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("dine_in");

 
 
  const [selectedTable, setSelectedTable] = useState(null);    
  const [selectedCustomer, setSelectedCustomer] = useState(GUEST);

  
  const [selectedOrderType, setSelectedOrderType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([
    { id: "all", nameEn: "All", nameKh: "ទាំងអស់" },
  ]);
  const [searchKeyword, setSearchKeyword] = useState("");

 
  const [getSubProduct] = useLazyQuery(GET_SUPPRODUCT_BY_ID);

  const { data, loading, previousData } = useQuery(GET_PRODUCT_FOR_SALE_WITH_PAGINATION, {
    variables: {
      shopId,
      page: 1,
      limit: 50,
      pagination: false,
      keyword: "",
      categoryId: "",
    },
    pollInterval: 30000,
  });
  const productData = data ?? previousData;
  const initialProductsLoading = loading && !productData;

  const { refetch: refetchCustomers } = useQuery(GET_CUSTOMERS_BY_SHOP_ID, { 
    variables: { shopId: [shopId] } 
  });

  const { data: tablesData } = useQuery(GET_TABLE_BY_SHOP_ID, {
    variables: { shopId },
  });

  const { data: customersData } = useQuery(GET_CUSTOMERS_BY_SHOP_ID, {
    variables: { shopId },
  });

  const { data: shopData } = useQuery(GET_SHOP_BY_ID, {
    variables: { id: shopId },
    skip: !shopId,
  });

 
  const [createSale, { loading: creating }] = useMutation(CREATE_SALE, {
    onCompleted: ({ createSale }) => {
      if (createSale?.isSuccess) {
        setAlert(true, "success", createSale?.message);
        setCart([]);
        setSelectedCustomer(GUEST);
        setSelectedTable(null);
        setOpenPaymentDialog(false);
        setOpenPendingDialog(false);
      } else {
        setAlert(true, "error", createSale?.message);
      }
    },
    onError: (error) => setAlert(true, "error", error.message),
  });

  const [createBakongPayment, { loading: creatingQr }] = useMutation(CREATE_BAKONG_PAYMENT, {
    onError: (error) => setAlert(true, "error", error.message),
  });

  const [checkBakongPayment, { loading: checkingQr }] = useMutation(CHECK_BAKONG_PAYMENT, {
    onError: (error) => setAlert(true, "error", error.message),
  });

  
  useEffect(() => {
    if (productData?.getProductForSaleWithPagination?.data) {
      const categoryMap = new Map();
      productData.getProductForSaleWithPagination.data
        .filter((item) => item.parentProductId?.categoryId)
        .forEach((item) => {
          const category = item.parentProductId.categoryId;
          if (!categoryMap.has(category._id)) {
            categoryMap.set(category._id, {
              id: category._id,
              nameEn: category.nameEn,
              nameKh: category.nameKh,
            });
          }
        });
      setCategories([
        { id: "all", nameEn: "All", nameKh: "ទាំងអស់" },
        ...Array.from(categoryMap.values()),
      ]);
    }
  }, [productData, language]);

  useEffect(() => {
    if (!qrPaymentData?.expiresAt) return;

    const updateRemainingTime = () => {
      setQrTimeLeft(Math.max(0, qrPaymentData.expiresAt - Date.now()));
    };

    updateRemainingTime();
    const timer = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(timer);
  }, [qrPaymentData]);

 
  const handleScan = async (barcode) => {
    try {
      const res = await getSubProduct({ variables: { subProductId: barcode } });
      const item = res?.data?.getSubProductById;
      if (!item) { setAlert(true, "error", "Product not found"); return; }
      addToCart(item);
      new Audio("/beep.mp3").play().catch(() => {});
    } catch (error) {
      console.error(error);
    }
  };

 
  const handleOpenProductDialog = (product) => {
    setSelectedProduct(product);
    setOpenProductDialog(true);
  };
  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    setSelectedProduct(null);
  };

  const handleOpenPaymentDialog = () => {
    if (cart.length === 0) {
      setAlert(true, "warning", language === "kh" ? "រទេះទទេ" : "Cart is empty");
      return;
    }
    setOpenPaymentDialog(true);
  };
  const handleClosePaymentDialog = () => setOpenPaymentDialog(false);
  const handleCloseQrDialog = () => {
    setQrPaymentData(null);
    setQrTimeLeft(KHQR_PAYMENT_DURATION_MS);
  };

  const handleOpenPendingDialog = () => {
    if (cart.length === 0) {
      setAlert(true, "warning", language === "kh" ? "រទេះទទេ" : "Cart is empty");
      return;
    }
    setOpenPendingDialog(true);
  };
  const handleClosePendingDialog = () => setOpenPendingDialog(false);

  const getLocalizedName = (obj) =>
    language === "kh"
      ? obj?.nameKh || obj?.nameKhmer || obj?.nameEn || obj?.nameEnglish || ""
      : obj?.nameEn || obj?.nameEnglish || obj?.nameKh || obj?.nameKhmer || "";

  const getSubProductName = (item) => {
    const productName = getLocalizedName(item?.parentProductId);
    const unitName = getLocalizedName(item?.unitId);
    return unitName ? `${productName} (${unitName})` : productName;
  };

 
  const addToCart = (item) => {
    const uniqueId = item._id;
    const itemName = getSubProductName(item);
    setCart((prev) => {
      const found = prev.find((p) => p.id === uniqueId);
      if (found) return prev.map((p) => p.id === uniqueId ? { ...p, qty: p.qty + 1 } : p);
      return [
        ...prev,
        {
          id: uniqueId,
          subProductId: item._id,
          productId: item.parentProductId._id,
          name: itemName,
          nameEn: item.unitId?.nameEn ? `${item.parentProductId.nameEn} (${item.unitId.nameEn})` : item.parentProductId.nameEn,
          nameKh: item.unitId?.nameKh ? `${item.parentProductId.nameKh} (${item.unitId.nameKh})` : item.parentProductId.nameKh,
          price: item.salePrice,
          qty: 1,
          img: item.productImg,
          variant: getLocalizedName(item.unitId) || "Original",
        },
      ];
    });
  };

  const addToCartFromDialog = (item) => {
    setCart((prev) => {
      const foundIndex = prev.findIndex((p) => p.id === item.id);
      if (foundIndex !== -1) {
        const updated = [...prev];
        updated[foundIndex].qty += item.qty;
        return updated;
      }
      return [...prev, item];
    });
  };

  const updateQty = (id, value) => {
    if (value === 0) removeFromCart(id);
    else setCart((prev) => prev.map((item) => item.id === id ? { ...item, qty: value } : item));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  const printSaleInvoice = (sale) => {
    if (!sale) return;

    const shop = shopData?.getShopById;
    const shopName = shop?.nameEn || shop?.nameKh || "Smart Market";
    const shopAddress = shop?.address || "";
    const shopLogoUrl = shop?.image || shop?.logo || "";
    const exchangeRate = Number(shop?.exchangeRate || 4100);
    const formatUsd = (value) => `$${Number(value || 0).toFixed(2)}`;
    const formatKhr = (value) =>
      `${Math.round(Number(value || 0) * exchangeRate).toLocaleString("en-US")} KHR`;
    const escapeHtml = (value = "") =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    const formatDate = (value) => {
      const date = value ? new Date(value) : new Date();
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const totalQty = (sale.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const itemRows = (sale.items || [])
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.name)}</td>
            <td class="right">${formatUsd(item.price)}</td>
            <td class="right">${item.quantity}</td>
            <td class="right">${formatUsd(item.total)}</td>
          </tr>`
      )
      .join("");

    const logoHtml = shopLogoUrl
      ? `<img class="logo" src="${escapeHtml(shopLogoUrl)}" alt="${escapeHtml(shopName)}" />`
      : `<div class="logo fallback">${escapeHtml(shopName.charAt(0))}</div>`;

    const tableRow = sale.orderType === "dine_in"
      ? `<div class="info-row"><span>Table</span><strong>${escapeHtml(sale.tableNumber || "-")}</strong></div>`
      : "";

    const invoiceHtml = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${escapeHtml(sale.saleNumber || "")}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #fff;
      color: #111;
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
    }
    .invoice { width: 80mm; max-width: 100%; margin: 0 auto; padding: 10px; font-size: 11px; }
    .center { text-align: center; }
    .logo { width: 54px; height: 54px; border-radius: 50%; object-fit: cover; display: block; margin: 0 auto 6px; }
    .fallback { background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; }
    h1 { margin: 4px 0; font-size: 16px; }
    .muted { color: #555; }
    .divider { border: 0; border-top: 1px dashed #777; margin: 8px 0; }
    .info-row, .summary-row { display: flex; justify-content: space-between; gap: 8px; margin: 3px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    th, td { padding: 4px 0; vertical-align: top; border-bottom: 1px dashed #ddd; }
    th { font-size: 10px; text-align: left; }
    .right { text-align: right; }
    .total { font-size: 15px; font-weight: 800; }
    .footer { margin-top: 10px; text-align: center; font-size: 10px; }
    @media print {
      @page { size: auto; margin: 0; }
      html, body { width: 100%; margin: 0; padding: 0; }
      body { display: flex; justify-content: center; align-items: flex-start; }
      .invoice { width: 80mm; max-width: 80mm; margin: 0 auto; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="center">
      ${logoHtml}
      <h1>${escapeHtml(shopName)}</h1>
      <div class="muted">${escapeHtml(shopAddress)}</div>
      <strong>Invoice #${escapeHtml(sale.saleNumber || "")}</strong>
    </div>
    <hr class="divider" />
    <div class="info-row"><span>Date</span><strong>${formatDate(sale.createdAt)}</strong></div>
    <div class="info-row"><span>Customer</span><strong>${escapeHtml(sale.customerName || "Guest")}</strong></div>
    <div class="info-row"><span>Order type</span><strong>${escapeHtml(sale.orderType || "-")}</strong></div>
    ${tableRow}
    <hr class="divider" />
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th class="right">Price</th>
          <th class="right">Qty</th>
          <th class="right">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div class="summary-row"><span>Items</span><strong>${totalQty}</strong></div>
    <div class="summary-row"><span>Subtotal</span><strong>${formatUsd(sale.subtotal)}</strong></div>
    <div class="summary-row"><span>Tax</span><strong>${formatUsd(sale.tax)}</strong></div>
    <div class="summary-row"><span>Discount</span><strong>${formatUsd(sale.discount)}</strong></div>
    <hr class="divider" />
    <div class="summary-row total"><span>Total</span><span>${formatUsd(sale.total)}</span></div>
    <div class="summary-row"><span>Total KHR</span><strong>${formatKhr(sale.total)}</strong></div>
    <div class="summary-row"><span>Paid (${escapeHtml(sale.paymentMethod || "cash")})</span><strong>${formatUsd(sale.amountPaid)}</strong></div>
    <div class="summary-row"><span>Change</span><strong>${formatUsd(sale.change)}</strong></div>
    <div class="footer">Thank you. Please come again.</div>
  </div>
</body>
</html>`;

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:absolute;width:0;height:0;border:0;";
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(invoiceHtml);
    doc.close();
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 250);
  };

  const handleSelectPendingSale = ({ cartItems, total, customerName, tableNumber, orderType }) => {
    setCart(cartItems);
    if (customerName) {
      setSelectedCustomer({ _id: "pending_customer", nameEn: customerName, nameKh: customerName });
    } else {
      setSelectedCustomer(GUEST);
    }
    if (orderType) {
      setOrderType(orderType);
    }
    if (tableNumber) {
      const table = tablesData?.getTableByShopId?.data?.find(t => t.number === tableNumber);
      if (table) setSelectedTable(table);
    } else {
      setSelectedTable(null);
    }
    setAlert(
      true, "info",
      language === "kh"
        ? "វិក័យប័ត្របណ្ដោះអាសន្នត្រូវបានទាញយក"
        : "Pending invoice loaded to cart"
    );
  };

 
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const qrShopName =
    shopData?.getShopById?.nameEn ||
    shopData?.getShopById?.nameKh ||
    "Smart Market";

 
  const handleCreateSale = async (paymentInfo, isPending = false) => {
    try {
      const subtotalRounded = Number(subtotal.toFixed(2));
      const taxRounded      = Number(tax.toFixed(2));
      const totalRounded    = Number((subtotalRounded + taxRounded).toFixed(2));

 
      const tableNumber = orderType === "dine_in" && selectedTable?.number
        ? selectedTable.number
        : "";
 
      const customerName = selectedCustomer?._id === "guest"
        ? "Guest"
        : (language === "kh"
            ? selectedCustomer?.nameKh || selectedCustomer?.nameEn
            : selectedCustomer?.nameEn) ?? "Guest";

      const input = {
        shopId,
        orderType,
        customerName,
        customerPhone: "",
        tableNumber,
        items: cart.map((item) => ({
          product:      item.productId,
          subProductId: item.subProductId,
          name:         item.name,
          price:        Number(item.price.toFixed(2)),
          quantity:     item.qty,
          total:        Number((item.price * item.qty).toFixed(2)),
        })),
        subtotal:      subtotalRounded,
        tax:           taxRounded,
        discount:      0,
        total:         totalRounded,
        paymentMethod: paymentInfo.method     || "cash",
        amountPaid:    paymentInfo.amountPaid || 0,
        change:        paymentInfo.change     || 0,
        status:        isPending ? "pending" : "completed",
      };

      if (!isPending && paymentInfo.method === "qr") {
        const billNumber = `QR-${Date.now()}`;
        const result = await createBakongPayment({
          variables: {
            input: {
              amount: totalRounded,
              billNumber,
              currency: "USD",
            },
          },
        });
        const payment = result?.data?.createBakongPayment;

        if (!payment?.isSuccess || !payment?.data?.qrImage || !payment?.data?.bakongReference) {
          setAlert(true, "error", payment?.message || "Failed to create QR payment");
          return;
        }

        setQrPaymentData({
          saleNumber: payment.data.saleNumber || billNumber,
          total: payment.data.total || totalRounded,
          qrImage: payment.data.qrImage,
          khqrString: payment.data.khqrString,
          bakongReference: payment.data.bakongReference,
          saleInput: input,
          expiresAt: Date.now() + KHQR_PAYMENT_DURATION_MS,
        });
        setOpenPaymentDialog(false);
        return;
      }

      const result = await createSale({ variables: { input } });
      const createdSale = result?.data?.createSale;

      if (createdSale?.isSuccess && !isPending) {
        printSaleInvoice({
          ...input,
          saleNumber: createdSale?.data?.saleNumber,
          saleId: createdSale?.data?.saleId,
          qrImage: createdSale?.data?.qrImage,
          status: createdSale?.data?.status || input.status,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error creating sale:", error);
    }
  };

  const handleConfirmQrPayment = async () => {
    if (!qrPaymentData?.bakongReference || !qrPaymentData?.saleInput) return;
    if (qrTimeLeft <= 0) {
      setAlert(true, "error", "Payment QR expired");
      return;
    }

    const result = await checkBakongPayment({
      variables: { reference: qrPaymentData.bakongReference },
    });
    const payment = result?.data?.checkBakongPayment;

    if (!payment?.isSuccess) {
      setAlert(true, "warning", payment?.message || "Payment not successful yet");
      return;
    }

    const resultSale = await createSale({ variables: { input: qrPaymentData.saleInput } });
    const createdSale = resultSale?.data?.createSale;

    if (createdSale?.isSuccess) {
      printSaleInvoice({
        ...qrPaymentData.saleInput,
        saleNumber: createdSale?.data?.saleNumber,
        saleId: createdSale?.data?.saleId,
        status: createdSale?.data?.status || qrPaymentData.saleInput.status,
        createdAt: new Date().toISOString(),
      });
      handleCloseQrDialog();
    }
  };
 
  if (activeShopId !== shopId) return <Navigate to="/store" replace />;

 
  const filteredProducts = productData?.getProductForSaleWithPagination?.data?.filter((item) => {
    const matchesSearch =
      item.parentProductId?.nameKh?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.parentProductId?.nameEn?.toLowerCase().includes(searchKeyword.toLowerCase());
    if (selectedCategory === "all") return matchesSearch;
    const matchesCategory =
      item.parentProductId?.categoryId?._id === selectedCategory ||
      item.parentProductId?.categoryId?.nameEn === selectedCategory ||
      item.parentProductId?.categoryId?.nameKh === selectedCategory;
    return matchesCategory && matchesSearch;
  });

  return (
    <Box className="pos-container">
      <ProductDialog
        open={openProductDialog}
        onClose={handleCloseProductDialog}
        product={selectedProduct}
        onAddToCart={addToCartFromDialog}
        language={language}
        t={t}
      />

      <PaymentDialog
        open={openPaymentDialog}
        onClose={handleClosePaymentDialog}
        total={total}
        onCreateSale={(paymentInfo) => handleCreateSale(paymentInfo, false)}
        language={language}
        creating={creating || creatingQr}
        t={t}
        isPending={false}
      />

      <Dialog
        open={Boolean(qrPaymentData)}
        onClose={handleCloseQrDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: "#f6f7fb",
            boxShadow: "0 24px 70px rgba(15, 23, 42, 0.24)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={800} textAlign="center">
            Bakong KHQR Payment
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 1 }}>
            <Box
              sx={{
                width: 280,
                maxWidth: "100%",
                overflow: "hidden",
                borderRadius: "10px",
                bgcolor: "common.white",
                border: "1px solid #edf0f4",
                boxShadow: "0 14px 34px rgba(15, 23, 42, 0.12)",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  bgcolor: "#e91f2d",
                  color: "common.white",
                  py: 1,
                  textAlign: "center",
                  fontWeight: 800,
                  letterSpacing: 0,
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    right: 0,
                    bottom: -18,
                    borderTop: "18px solid #e91f2d",
                    borderLeft: "28px solid transparent",
                  },
                }}
              >
                KHQR
              </Box>
              <Box sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "#8a94a6", fontWeight: 700, lineHeight: 1.2 }}
                >
                  {qrShopName}
                </Typography>
                <Typography sx={{ mt: 0.5, color: "#111827", fontSize: 24, fontWeight: 800, lineHeight: 1 }}>
                  ${Number(qrPaymentData?.total || 0).toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ borderTop: "1px dashed #d9dde6", mx: 2 }} />
              <Box sx={{ px: 3, py: 2.25 }}>
                {qrPaymentData?.qrImage && (
                  <Box
                    component="img"
                    src={qrPaymentData.qrImage}
                    alt="Bakong KHQR"
                    sx={{
                      display: "block",
                      width: "100%",
                      aspectRatio: "1 / 1",
                      objectFit: "contain",
                      bgcolor: "common.white",
                    }}
                  />
                )}
              </Box>
            </Box>

            <Stack spacing={0.5} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Invoice #{qrPaymentData?.saleNumber}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: qrTimeLeft > 0 ? "#e91f2d" : "error.main",
                  fontWeight: 800,
                }}
              >
                {qrTimeLeft > 0 ? `Expires in ${formatCountdown(qrTimeLeft)}` : "Payment QR expired"}
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseQrDialog} color="inherit" disabled={checkingQr}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmQrPayment}
            variant="contained"
            disabled={checkingQr || creating || qrTimeLeft <= 0}
            fullWidth
          >
            {checkingQr || creating ? "Checking..." : "Check Payment"}
          </Button>
        </DialogActions>
      </Dialog>

      <PaymentDialog
        open={openPendingDialog}
        onClose={handleClosePendingDialog}
        total={total}
        onCreateSale={(paymentInfo) => handleCreateSale(paymentInfo, true)}
        language={language}
        creating={creating}
        t={t}
        isPending={true}
      />

      <Grid container spacing={2} sx={{ height: "90vh", overflow: "hidden" }}>
        <Grid size={{ xs: 8 }}>
          <Box sx={{ overflowY: "auto", height: "100vh", scrollbarWidth: "thin", padding: 2 }}>
            <RecentOrders
              selectedOrderType={selectedOrderType}
              setSelectedOrderType={setSelectedOrderType}
              t={t}
            />
            <CustomerOrderNotifications shopId={shopId} />
            <ProductList
              t={t}
              language={language}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              filteredProducts={filteredProducts}
              onProductClick={handleOpenProductDialog}
              loading={initialProductsLoading}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 4 }} sx={{ borderLeft: "1px solid #D1D5DC" }}>
          <CartPanel
            cart={cart}
            orderType={orderType}
            setOrderType={setOrderType}
          
            tablesData={tablesData}
            refetchCustomers={refetchCustomers}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            customersData={customersData}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            updateQty={updateQty}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            subtotal={subtotal}
            tax={tax}
            total={total}
            t={t}
            language={language}
            creating={creating}
            onPayNow={handleOpenPaymentDialog}
            onStopInvoice={handleOpenPendingDialog}
            openHistory={openHistory}
            openSalePending={openSalePending}
            onOpenHistory={() => setOpenHistory(true)}
            onCloseHistory={() => setOpenHistory(false)}
            onOpenSalePending={() => setOpenSalePending(true)}
            onCloseSalePending={() => setOpenSalePending(false)}
            shopId={shopId}
            onSelectPendingSale={handleSelectPendingSale}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default POS;
