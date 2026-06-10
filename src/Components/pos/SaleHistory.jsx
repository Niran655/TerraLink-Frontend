// import React, { useState, useEffect } from "react";
// import Drawer from "@mui/material/Drawer";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import {
//   Divider,
//   IconButton,
//   Stack,
//   Chip,
//   Card,
//   CardContent,
//   Tabs,
//   Tab,
//   LinearProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   MenuItem,
//   Menu,
//   Tooltip,
// } from "@mui/material";
// import { X, CheckCircle, RefreshCw, MoreVertical, Eye } from 'lucide-react';
// import { useMutation, useQuery } from "@apollo/client/react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useAuth } from "../../context/AuthContext";
// import { translateLauguage } from "../../function/translate";
// import { GET_SALES } from "../../../graphql/queries";
// import { REFUND_SALE } from "../../../graphql/mutation";

// const SaleHistory = ({ open, onClose, t, shopId, onViewDetails }) => {
//   const { language, setAlert } = useAuth();
//   const { t: translate } = translateLauguage(language);
//   const [tabValue, setTabValue] = useState(0);
//   const [selectedSale, setSelectedSale] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const [openRefundSaleDialog, setOpenRefundSaleDialog] = useState(false);

//   const { data, loading, error, refetch } = useQuery(GET_SALES, {
//     variables: {
//       shopId: shopId,
//       status: tabValue === 0 ? "completed" : "refunded",
//       pagination: false,
//       limit: 50,
//     },
//     skip: !open || !shopId,
//   });

  
//   const [refundSaleMutation, { loading: refundLoading }] = useMutation(REFUND_SALE, {
//     onCompleted: ({ refundSale }) => {
//       if (refundSale?.isSuccess) {
//         setAlert(true, "success", refundSale?.message);
       
//         setOpenRefundSaleDialog(false);
//         refetch();
//       } else {
//         setAlert(true, "error", refundSale?.message);
//       }
//     },
//     onError: (error) => {
//       console.error("Refund error:", error);
//       setAlert(true, "error", error.message);
//     },
//   });

//   const sales = data?.getSales?.data || [];

//   useEffect(() => {
//     if (open) {
//       refetch();
//     }
//   }, [open, tabValue]);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleMenuClick = (event, sale) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedSale(sale);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleViewDetails = (sale) => {
//     setSelectedSale(sale);
//     setOpenDetailsDialog(true);
//     if (onViewDetails) {
//       onViewDetails(sale);
//     }
//   };

//   const handleOpenRefundSale = (sale) => {
//     setSelectedSale(sale);
//     setOpenRefundSaleDialog(true);
//   };

 
//   const refundValidationSchema = Yup.object({
//     reason: Yup.string().required(t("require")),
//   });

 
//   const formik = useFormik({
//     initialValues: {
//       reason: "",
//     },
//     validationSchema: refundValidationSchema,
//     onSubmit: (values) => {
//       if (selectedSale) {
//         refundSaleMutation({
//           variables: {
//             id: selectedSale._id,
//             reason: values.reason,
//           },
//         });
//       }
//     },
//   });

//   // Print receipt function (unchanged)
//   const handlePrintReceipt = (sale) => {
//     if (!sale) return;

//     const formatReceiptDate = (dateString) => {
//       const date = new Date(dateString);
//       return date.toLocaleDateString(language === "kh" ? 'km-KH' : 'en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     };

//     const invoiceHtml = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>${t("receipt")} #${sale.saleNumber}</title>
//         <style>
//           body {
//             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//             margin: 0;
//             padding: 20px;
//             color: #333;
//           }
//           .invoice-container {
//             max-width: 800px;
//             margin: 0 auto;
//             background: white;
//             padding: 20px;
//             border: 1px solid #ddd;
//             border-radius: 8px;
//           }
//           .header {
//             text-align: center;
//             margin-bottom: 20px;
//             border-bottom: 2px solid #eee;
//             padding-bottom: 10px;
//           }
//           .header h1 {
//             margin: 0;
//             font-size: 24px;
//           }
//           .header p {
//             margin: 5px 0;
//             color: #666;
//           }
//           .sale-info {
//             margin-bottom: 20px;
//             display: flex;
//             justify-content: space-between;
//           }
//           .sale-info div {
//             font-size: 14px;
//           }
//           .items-table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-bottom: 20px;
//           }
//           .items-table th, .items-table td {
//             border: 1px solid #ddd;
//             padding: 8px;
//             text-align: left;
//           }
//           .items-table th {
//             background-color: #f2f2f2;
//             font-weight: bold;
//           }
//           .items-table td:last-child, .items-table th:last-child {
//             text-align: right;
//           }
//           .totals {
//             text-align: right;
//             margin-top: 10px;
//             border-top: 1px solid #eee;
//             padding-top: 10px;
//           }
//           .totals p {
//             margin: 5px 0;
//           }
//           .totals .grand-total {
//             font-size: 18px;
//             font-weight: bold;
//             color: #2c7da0;
//           }
//           .payment-info {
//             margin-top: 20px;
//             border-top: 1px solid #eee;
//             padding-top: 10px;
//           }
//           .footer {
//             text-align: center;
//             margin-top: 30px;
//             font-size: 12px;
//             color: #888;
//           }
//           @media print {
//             body {
//               margin: 0;
//               padding: 0;
//             }
//             .invoice-container {
//               border: none;
//               padding: 0;
//             }
//             .no-print {
//               display: none;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="invoice-container">
//           <div class="header">
//             <h1>${t("receipt")}</h1>
//             <p>${t("invoice")} #${sale.saleNumber}</p>
//           </div>
//           <div class="sale-info">
//             <div><strong>${t("date")}:</strong> ${formatReceiptDate(sale.createdAt)}</div>
//             <div><strong>${t("status")}:</strong> ${sale.status === "completed" ? t("completed") : t("refunded")}</div>
//           </div>
//           <table class="items-table">
//             <thead>
//               <tr>
//                 <th>${t("items")}</th>
//                 <th>${t("quantity")}</th>
//                 <th>${t("price")}</th>
//                 <th>${t("total")}</th>
//                </tr>
//             </thead>
//             <tbody>
//               ${sale.items?.map(item => `
//                 <tr>
//                   <td>${item.name}</td>
//                   <td>${item.quantity}</td>
//                   <td>$${item.price?.toFixed(2)}</td>
//                   <td>$${(item.quantity * item.price)?.toFixed(2)}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
//           <div class="totals">
//             <p><strong>${t("subtotal")}:</strong> $${sale.subtotal?.toFixed(2)}</p>
//             <p><strong>${t("tax")} (10%):</strong> $${sale.tax?.toFixed(2)}</p>
//             <p><strong>${t("discount")}:</strong> -$${sale.discount?.toFixed(2)}</p>
//             <p class="grand-total"><strong>${t("total_price")}:</strong> $${sale.total?.toFixed(2)}</p>
//           </div>
//           <div class="payment-info">
//             <p><strong>${t("payment_method")}:</strong> ${sale.paymentMethod?.toUpperCase()}</p>
//             <p><strong>${t("amount_paid")}:</strong> $${sale.amountPaid?.toFixed(2)}</p>
//             ${sale.change > 0 ? `<p><strong>${t("money_change")}:</strong> $${sale.change?.toFixed(2)}</p>` : ''}
//           </div>
//           <div class="footer">
//             <p>${t("thank_you")}</p>
//           </div>
//         </div>
//         <div class="no-print" style="text-align:center; margin-top:20px;">
//           <button onclick="window.print(); setTimeout(() => window.close(), 500);" style="padding:8px 16px;">${t("print")}</button>
//         </div>
//         <script>
//           window.onload = () => {
//             window.print();
//             setTimeout(() => window.close(), 500);
//           };
//         </script>
//       </body>
//       </html>
//     `;

//     const printWindow = window.open('', '_blank', 'width=800,height=600');
//     printWindow.document.write(invoiceHtml);
//     printWindow.document.close();
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString(language === "kh" ? 'km-KH' : 'en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusChip = (status) => {
//     switch (status) {
//       case "completed":
//         return (
//           <Chip
//             icon={<CheckCircle size={14} />}
//             label={t("completed")}
//             color="success"
//             size="small"
//             sx={{ fontWeight: 'bold' }}
//           />
//         );
//       case "refunded":
//         return (
//           <Chip
//             icon={<RefreshCw size={14} />}
//             label={t("refunded")}
//             color="error"
//             size="small"
//             sx={{ fontWeight: 'bold' }}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   const getPaymentMethodIcon = (method) => {
//     switch (method) {
//       case "cash":
//         return "💵";
//       case "card":
//         return "💳";
//       case "qr":
//         return "📱";
//       default:
//         return "💰";
//     }
//   };

//   return (
//     <>
//       <Drawer
//         anchor="right"
//         open={open}
//         onClose={onClose}
//         sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 600 } } }}
//       >
//         <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//           <Stack sx={{ p: 2 }} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
//             <Typography variant="h6">{t(`sale_history`)}</Typography>
//             <IconButton onClick={onClose}>
//               <X color="red" />
//             </IconButton>
//           </Stack>
//           <Divider />

//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             variant="fullWidth"
//             sx={{ borderBottom: 1, borderColor: 'divider' }}
//           >
//             <Tab label={t(`completed`)} />
//             <Tab label={t(`refunded`)} />
//           </Tabs>

//           <Box sx={{ flex: 1, overflow: 'auto', p: 2, scrollbarWidth: "thin" }}>
//             {loading ? (
//               <LinearProgress />
//             ) : error ? (
//               <Typography color="error" align="center">
//                 {t(`error_fetching_data`)}
//               </Typography>
//             ) : sales.length === 0 ? (
//               <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
//                 {t(`no_data_available`)}
//               </Typography>
//             ) : (
//               <Stack spacing={2}>
//                 {sales.map((sale) => (
//                   <Card key={sale._id} variant="outlined">
//                     <CardContent>
//                       <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
//                         <Box sx={{ flex: 1 }}>
//                           <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
//                             <Typography variant="subtitle1" fontWeight="bold">
//                               #{sale.saleNumber}
//                             </Typography>
//                             {getStatusChip(sale.status)}
//                           </Stack>

//                           <Typography variant="body2" color="text.secondary">
//                             {formatDate(sale.createdAt)}
//                           </Typography>

//                           <Stack direction="row" spacing={2} mt={1}>
//                             <Typography variant="body2">
//                               {sale.items?.length || 0} {language === "kh" ? "ទំនិញ" : "items"}
//                             </Typography>
//                             <Typography variant="body2" fontWeight="bold">
//                               {t(`total_price`)}: ${sale.total?.toFixed(2) || "0.00"}
//                             </Typography>
//                           </Stack>

//                           {sale.paymentMethod && (
//                             <Typography variant="body2" color="text.secondary" mt={0.5}>
//                               <Box component="span" sx={{ mr: 0.5 }}>
//                                 {getPaymentMethodIcon(sale.paymentMethod)}
//                               </Box>
//                               {sale.paymentMethod?.toUpperCase()}
//                             </Typography>
//                           )}
//                         </Box>

//                         <Box>
//                           <IconButton
//                             size="small"
//                             onClick={(e) => handleMenuClick(e, sale)}
//                           >
//                             <MoreVertical size={18} />
//                           </IconButton>
//                         </Box>
//                       </Stack>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </Stack>
//             )}
//           </Box>
//         </Box>
//       </Drawer>

//       {/* Menu for actions */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={() => {
//           handleViewDetails(selectedSale);
//           handleMenuClose();
//         }}>
//           <Eye size={16} style={{ marginRight: 8 }} />
//           {t(`view_details`)}
//         </MenuItem>
//         <MenuItem onClick={() => {
//           handlePrintReceipt(selectedSale);
//           handleMenuClose();
//         }}>
//           <CheckCircle size={16} style={{ marginRight: 8 }} />
//           {t(`print_receipt`)}
//         </MenuItem>
//         {/* Only show refund option for completed sales */}
//         {selectedSale?.status === "completed" && (
//           <MenuItem onClick={() => {
//             handleOpenRefundSale(selectedSale);
//             handleMenuClose();
//           }}>
//             <RefreshCw size={16} style={{ marginRight: 8 }} />
//             {t(`sale_refund`)}
//           </MenuItem>
//         )}
//       </Menu>

//       {/* Details Dialog */}
//       <Dialog
//         open={openDetailsDialog}
//         onClose={() => setOpenDetailsDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           <Typography variant="h6" fontWeight="bold">
//             {t(`sale_details`)}
//           </Typography>
//         </DialogTitle>
//         <DialogContent sx={{ scrollbarWidth: "none" }}>
//           {selectedSale && (
//             <Box sx={{ mt: 2 }}>
//               <Stack spacing={2}>
//                 <Box sx={{ p: 2, borderRadius: 1 }}>
//                   <Stack direction="row" justifyContent="space-between" alignItems="center">
//                     <Box>
//                       <Typography variant="h6" fontWeight="bold">
//                         #{selectedSale.saleNumber}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {formatDate(selectedSale.createdAt)}
//                       </Typography>
//                     </Box>
//                     {getStatusChip(selectedSale.status)}
//                   </Stack>
//                 </Box>

//                 <Box>
//                   <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//                     {language === "kh" ? "ទំនិញ" : "Items"} ({selectedSale.items?.length || 0})
//                   </Typography>
//                   {selectedSale.items?.map((item, index) => (
//                     <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
//                       <Box>
//                         <Typography variant="body1" fontWeight="medium">
//                           {item.name}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {item.quantity} × ${item.price?.toFixed(2)}
//                         </Typography>
//                       </Box>
//                       <Typography variant="body1" fontWeight="bold">
//                         ${(item.quantity * item.price)?.toFixed(2)}
//                       </Typography>
//                     </Box>
//                   ))}
//                 </Box>

//                 <Box sx={{ p: 2, borderRadius: 1 }}>
//                   <Stack spacing={1}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <Typography variant="body1">{t("subtotal")}:</Typography>
//                       <Typography variant="body1">${selectedSale.subtotal?.toFixed(2)}</Typography>
//                     </Box>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <Typography variant="body1">{t("tax")} (10%):</Typography>
//                       <Typography variant="body1">${selectedSale.tax?.toFixed(2)}</Typography>
//                     </Box>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <Typography variant="body1">{t("discount")}:</Typography>
//                       <Typography variant="body1">-${selectedSale.discount?.toFixed(2)}</Typography>
//                     </Box>
//                     <Divider />
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <Typography variant="h6" fontWeight="bold">{t("total_price")}:</Typography>
//                       <Typography variant="h6" fontWeight="bold" color="primary">
//                         ${selectedSale.total?.toFixed(2)}
//                       </Typography>
//                     </Box>
//                   </Stack>
//                 </Box>

//                 <Box>
//                   <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//                     {t(`payment_information`)}
//                   </Typography>
//                   <Stack spacing={1}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <Typography variant="body2" color="text.secondary">
//                         {t(`payment_method`)}:
//                       </Typography>
//                       <Typography variant="body2">
//                         <Box component="span" sx={{ mr: 1 }}>
//                           {getPaymentMethodIcon(selectedSale.paymentMethod)}
//                         </Box>
//                         {selectedSale.paymentMethod?.toUpperCase()}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <Typography variant="body2" color="text.secondary">
//                         {t("amount_paid")}:
//                       </Typography>
//                       <Typography variant="body2">${selectedSale.amountPaid?.toFixed(2)}</Typography>
//                     </Box>
//                     {selectedSale.change > 0 && (
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <Typography variant="body2" color="text.secondary">
//                           {t(`money_change`)}:
//                         </Typography>
//                         <Typography variant="body2" color="success.main">
//                           ${selectedSale.change?.toFixed(2)}
//                         </Typography>
//                       </Box>
//                     )}
//                   </Stack>
//                 </Box>
//               </Stack>
//             </Box>
//           )}
//         </DialogContent>

//         <DialogActions sx={{ p: 3 }}>
//           <Button
//             onClick={() => setOpenDetailsDialog(false)}
//             color="inherit"
//           >
//             {t(`close`)}
//           </Button>
//           <Button
//             onClick={() => handlePrintReceipt(selectedSale)}
//             variant="outlined"
//           >
//             {t(`print`)}
//           </Button>
//         </DialogActions>
//       </Dialog>
 
//       <Dialog
//         open={openRefundSaleDialog}
//         onClose={() => setOpenRefundSaleDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           <Typography variant="h6" fontWeight="bold">
//             {t(`create_refund`)}
//           </Typography>
//         </DialogTitle>
//         <form onSubmit={formik.handleSubmit}>
//           <DialogContent sx={{ scrollbarWidth: "none" }}>
//             <Typography fontWeight="bold">
//             {t(`reason`)}
//           </Typography>
//             <TextField
//               fullWidth
//               multiline
//               rows={3}
//               id="reason"
//               name="reason"
         
//               value={formik.values.reason}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.reason && Boolean(formik.errors.reason)}
//               helperText={formik.touched.reason && formik.errors.reason}
//               disabled={refundLoading}
//               required
//             />
//           </DialogContent>
//           <DialogActions >
//             {/* <Button
//               onClick={() => setOpenRefundSaleDialog(false)}
//               color="inherit"
//               disabled={refundLoading}
//             >
//               {t(`cancel`)}
//             </Button> */}
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               color="primary"
//               disabled={refundLoading}
//             >
//               {refundLoading ? t("processing...") : t("create")}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </>
//   );
// };

// export default SaleHistory;

import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  Divider,
  IconButton,
  Stack,
  Chip,
  Card,
  CardContent,
  Tabs,
  Tab,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Menu,
  Tooltip,
} from "@mui/material";
import { X, CheckCircle, RefreshCw, MoreVertical, Eye } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../Context/AuthContext";
import { translateLauguage } from "../../function/translate";
import { GET_SALES, GET_SHOP_BY_ID } from "../../../graphql/queries";
import { REFUND_SALE } from "../../../graphql/mutation";

const SaleHistory = ({ open, onClose, t, shopId, onViewDetails }) => {
  const { language, setAlert } = useAuth();
  const { t: translate } = translateLauguage(language);
  const [tabValue, setTabValue] = useState(0);
  const [selectedSale, setSelectedSale] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openRefundSaleDialog, setOpenRefundSaleDialog] = useState(false);

 
  const { data, loading, error, refetch } = useQuery(GET_SALES, {
    variables: {
      shopId: shopId,
      status: tabValue === 0 ? "completed" : "refunded",
      pagination: false,
      limit: 50,
    },
    skip: !open || !shopId,
  });

 
  const { data: shopData } = useQuery(GET_SHOP_BY_ID, {
    variables: { id: shopId },
    skip: !shopId,
  });

 
  const [refundSaleMutation, { loading: refundLoading }] = useMutation(
    REFUND_SALE,
    {
      onCompleted: ({ refundSale }) => {
        if (refundSale?.isSuccess) {
          setAlert(true, "success", refundSale?.message);
          setOpenRefundSaleDialog(false);
          refetch();
        } else {
          setAlert(true, "error", refundSale?.message);
        }
      },
      onError: (error) => {
        console.error("Refund error:", error);
        setAlert(true, "error", error.message);
      },
    }
  );

  const sales = data?.getSales?.data || [];

  useEffect(() => {
    if (open) refetch();
  }, [open, tabValue]);

 
  const handleTabChange = (_, newValue) => setTabValue(newValue);

  const handleMenuClick = (event, sale) => {
    setAnchorEl(event.currentTarget);
    setSelectedSale(sale);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleViewDetails = (sale) => {
    setSelectedSale(sale);
    setOpenDetailsDialog(true);
    if (onViewDetails) onViewDetails(sale);
  };

  const handleOpenRefundSale = (sale) => {
    setSelectedSale(sale);
    setOpenRefundSaleDialog(true);
  };

 
  const formik = useFormik({
    initialValues: { reason: "" },
    validationSchema: Yup.object({
      reason: Yup.string().required(t("require")),
    }),
    onSubmit: (values) => {
      if (selectedSale) {
        refundSaleMutation({
          variables: { id: selectedSale._id, reason: values.reason },
        });
      }
    },
  });

  const getLocalizedName = (obj) =>
    language === "kh"
      ? obj?.nameKh || obj?.nameKhmer || obj?.nameEn || obj?.nameEnglish || ""
      : obj?.nameEn || obj?.nameEnglish || obj?.nameKh || obj?.nameKhmer || "";

  const getSaleItemName = (item) => {
    const subProduct = item?.subProduct || item?.subProductId;
    if (subProduct && typeof subProduct === "object") {
      const productName = getLocalizedName(subProduct.parentProductId) || getLocalizedName(item.product) || item.name;
      const unitName = getLocalizedName(subProduct.unitId);
      return unitName ? `${productName} (${unitName})` : productName;
    }
    return item?.name || "";
  };

const handlePrintReceipt = (sale) => {
  if (!sale) return;

  const shop        = shopData?.getShopById;
  const shopName    = shop?.nameKh || "កាហ្វេ អេចអូ";
  const shopLogoUrl = shop?.logo || shop?.logoUrl || shop?.image || shop?.imageUrl || shop?.profileImage || "";
  const KHR_RATE    = shop?.exchangeRate || 4100;

  const toKHR = (usd) =>
    Math.round((usd || 0) * KHR_RATE).toLocaleString("en-US") + ".00";

  const formatReceiptDate = (dateString) => {
    const d   = new Date(dateString);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const subtotal   = sale.subtotal   || 0;
  const discount   = sale.discount   || 0;
  const tax        = sale.tax        || 0;
  const total      = sale.total      || 0;
  const amountPaid = sale.amountPaid || 0;
  const change     = sale.change     || 0;
  const totalQty   = (sale.items || []).reduce((s, i) => s + i.quantity, 0);

  const totalKHR    = toKHR(total);
  const discountKHR = toKHR(discount);
  const paidKHR     = toKHR(amountPaid);
  const changeKHR   = toKHR(change);
  const taxKHR      = toKHR(tax);

  const paymentLabel =
    sale.paymentMethod === "cash" ? "Cash"
    : sale.paymentMethod === "card" ? "Card"
    : sale.paymentMethod === "qr"   ? "QR"
    : (sale.paymentMethod || "Cash").toUpperCase();

 
  const customerDisplay = sale.customerName && sale.customerName !== "Guest"
    ? sale.customerName
    : "Guest";

  const tableDisplay = sale.tableNumber
    ? sale.tableNumber
    : "—";

  // Only show table row when order is dine-in
  const tableRow = sale.orderType === "dine_in"
    ? `<div class="info-line"><span class="info-label">តុ (Table):</span> ${tableDisplay}</div>`
    : "";

    console.log("tableRow:", tableRow);

  const itemRows = (sale.items || [])
    .map(
      (item) => `
      <tr>
        <td class="col-name">${getSaleItemName(item)}</td>
        <td class="col-r">${toKHR(item.price)}</td>
        <td class="col-r">${item.quantity}</td>
        <td class="col-r">${toKHR(item.quantity * item.price)}</td>
      </tr>`
    )
    .join("");

  const logoHtml = shopLogoUrl
    ? `<img src="${shopLogoUrl}" alt="${shopName}" style="width:50px;height:50px;border-radius:50%;object-fit:cover;display:block;margin:0 auto 6px auto;" />`
    : `<div style="width:50px;height:50px;border-radius:50%;background:#1a1a1a;margin:0 auto 6px auto;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;">☕</div>`;

  const invoiceHtml = `
<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>Receipt ${sale.saleNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Noto Sans Khmer', 'Khmer OS', 'Moul', sans-serif;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .receipt { width: 80mm; background: white; padding: 2mm 3mm 4mm 3mm; font-size: 10px; line-height: 1.45; }
    .logo-container { text-align: center; margin-bottom: 4px; }
    .header-line { font-size: 12px; font-weight: 700; text-align: center; margin-bottom: 4px; }
    .sub-header { text-align: center; font-size: 11px; font-weight: 600; margin-bottom: 6px; }
    .shop-name-line { text-align: center; font-size: 12px; font-weight: 700; margin-bottom: 8px; }
    .dashed { border: none; border-top: 1px dashed #888; margin: 6px 0; }
    .info-line { font-size: 9.5px; margin-bottom: 2px; }
    .info-label { font-weight: 600; display: inline-block; min-width: 85px; }
    /* highlight row for customer */
    .info-line.customer-line { font-size: 10px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 9.5px; }
    th { text-align: left; font-weight: 700; border-bottom: 1px dashed #aaa; padding: 4px 0 2px 0; }
    td { padding: 3px 0; vertical-align: top; }
    .col-r { text-align: right; }
    .col-name { max-width: 90px; word-break: break-word; }
    .summary-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 10.5px; margin-top: 6px; }
    .usd-total { text-align: right; font-weight: 800; font-size: 13px; margin: 4px 0 6px 0; }
    .payment-header { font-weight: 700; font-size: 10px; margin: 8px 0 2px 0; }
    .payment-shop { font-weight: 700; font-size: 10px; margin-bottom: 6px; }
    .pay-row { display: flex; justify-content: space-between; font-size: 9.5px; padding: 2px 0; }
    .footer { text-align: center; font-size: 9px; margin-top: 10px; padding-top: 4px; border-top: 1px dashed #aaa; }
    @media print {
      body { margin: 0; padding: 0; }
      .receipt { width: 80mm; box-shadow: none; padding: 0; margin: 0; }
      @page { size: auto; margin: 0mm; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="logo-container">${logoHtml}</div>
    <div class="header-line">វិក្កយបត្រ #${sale.saleNumber}</div>
    <div class="sub-header">បង្កាន់ដៃចាកចេញ</div>
    <div class="shop-name-line">ការងារ ${shopName}</div>
    <hr class="dashed" />

    <div class="info-line"><span class="info-label">លេខវិក្កយបត្រ:</span> ${sale.saleNumber}</div>
    <div class="info-line"><span class="info-label">ពេលវេលា:</span> ${formatReceiptDate(sale.createdAt)}</div>
    <div class="info-line"><span class="info-label">អ្នកគិតលុយ:</span> ${sale.cashierName || "Manager"}</div>

    <!-- Customer name — always shown -->
    <div class="info-line customer-line">
      <span class="info-label">អតិថិជន (Customer):</span> ${customerDisplay}
    </div>

    <!-- Table — only for dine-in -->
    ${tableRow}

    <hr class="dashed" />
    <table>
      <thead>
        <tr>
          <th>ទំនិញ</th>
          <th class="col-r">តម្លៃ</th>
          <th class="col-r">បរិមាណ</th>
          <th class="col-r">សរុប</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div class="summary-row"><span>សរុប ${totalQty} មុខ</span><span>${totalKHR}</span></div>
    <div class="usd-total">$${total.toFixed(2)}</div>
    <hr class="dashed" />
    <div class="payment-header">មធ្យោបាយទូទាត់</div>
    <div class="payment-shop">ការងារ ${shopName}</div>
    <div class="pay-row"><span>${paymentLabel}</span><span>${paidKHR}</span></div>
    <div class="pay-row"><span>បញ្ចុះតម្លៃ</span><span>${discountKHR}</span></div>
    <div class="pay-row"><span>សរុបទូទាត់</span><span>${totalKHR}</span></div>
    <div class="pay-row"><span>លុយអាប់</span><span>${changeKHR}</span></div>
    <div class="pay-row"><span>ពន្ធ</span><span>${taxKHR}</span></div>
    <hr class="dashed" />
    <div class="footer">អរគុណ! សូមស្វាគមន៍មកម្ដងទៀត</div>
  </div>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:absolute;width:0;height:0;border:none;";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(invoiceHtml);
  doc.close();
  iframe.contentWindow.focus();
  iframe.contentWindow.print();
  setTimeout(() => document.body.removeChild(iframe), 1000);
};
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "kh" ? "km-KH" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusChip = (status) => {
    if (status === "completed")
      return (
        <Chip
          icon={<CheckCircle size={14} />}
          label={t("completed")}
          color="success"
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      );
    if (status === "refunded")
      return (
        <Chip
          icon={<RefreshCw size={14} />}
          label={t("refunded")}
          color="error"
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      );
    return null;
  };

  const getPaymentMethodIcon = (method) => {
    if (method === "cash") return "💵";
    if (method === "card") return "💳";
    if (method === "qr")   return "📱";
    return "💰";
  };
 
  return (
    <>
 
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{ "& .MuiDrawer-paper": { width: { xs: "100%", sm: 600 } } }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Stack
            sx={{ p: 2 }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography >{t("sale_history")}</Typography>
            <IconButton onClick={onClose}>
              <X color="red" />
            </IconButton>
          </Stack>
          <Divider />

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label={t("completed")} />
            <Tab label={t("refunded")} />
          </Tabs>

          <Box sx={{ flex: 1, overflow: "auto", p: 2, scrollbarWidth: "thin" }}>
            {loading ? (
              <LinearProgress />
            ) : error ? (
              <Typography color="error" align="center">
                {t("error_fetching_data")}
              </Typography>
            ) : sales.length === 0 ? (
              <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                {t("no_data_available")}
              </Typography>
            ) : (
              <Stack spacing={2}>
                {sales.map((sale) => (
                  <Card key={sale._id} variant="outlined">
                    <CardContent>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={2}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              #{sale.saleNumber}
                            </Typography>
                            {getStatusChip(sale.status)}
                          </Stack>

                          <Typography variant="body2" color="text.secondary">
                            {formatDate(sale.createdAt)}
                          </Typography>

                          <Stack direction="row" spacing={2} mt={1}>
                            <Typography variant="body2">
                              {sale.items?.length || 0}{" "}
                              {language === "kh" ? "ទំនិញ" : "items"}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {t("total_price")}: ${sale.total?.toFixed(2) || "0.00"}
                            </Typography>
                          </Stack>

                          {sale.paymentMethod && (
                            <Typography variant="body2" color="text.secondary" mt={0.5}>
                              <Box component="span" sx={{ mr: 0.5 }}>
                                {getPaymentMethodIcon(sale.paymentMethod)}
                              </Box>
                              {sale.paymentMethod.toUpperCase()}
                            </Typography>
                          )}
                        </Box>

                        <Box>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, sale)}
                          >
                            <MoreVertical size={18} />
                          </IconButton>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Drawer>

     
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleViewDetails(selectedSale); handleMenuClose(); }}>
          <Eye size={16} style={{ marginRight: 8 }} />
          {t("view_details")}
        </MenuItem>
        <MenuItem onClick={() => { handlePrintReceipt(selectedSale); handleMenuClose(); }}>
          <CheckCircle size={16} style={{ marginRight: 8 }} />
          {t("print_receipt")}
        </MenuItem>
        {selectedSale?.status === "completed" && (
          <MenuItem onClick={() => { handleOpenRefundSale(selectedSale); handleMenuClose(); }}>
            <RefreshCw size={16} style={{ marginRight: 8 }} />
            {t("sale_refund")}
          </MenuItem>
        )}
      </Menu>

 
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {t("sale_details")}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ scrollbarWidth: "none" }}>
          {selectedSale && (
            <Box sx={{ mt: 2 }}>
              <Stack spacing={2}>
                <Box sx={{ p: 2, borderRadius: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        #{selectedSale.saleNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(selectedSale.createdAt)}
                      </Typography>
                    </Box>
                    {getStatusChip(selectedSale.status)}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {language === "kh" ? "ទំនិញ" : "Items"} (
                    {selectedSale.items?.length || 0})
                  </Typography>
                  {selectedSale.items?.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        py: 1,
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {getSaleItemName(item)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.quantity} × ${item.price?.toFixed(2)}
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        ${(item.quantity * item.price)?.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ p: 2, borderRadius: 1 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1">{t("subtotal")}:</Typography>
                      <Typography variant="body1">
                        ${selectedSale.subtotal?.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1">{t("tax")} (10%):</Typography>
                      <Typography variant="body1">
                        ${selectedSale.tax?.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1">{t("discount")}:</Typography>
                      <Typography variant="body1">
                        -${selectedSale.discount?.toFixed(2)}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="h6" fontWeight="bold">
                        {t("total_price")}:
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        ${selectedSale.total?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {t("payment_information")}
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        {t("payment_method")}:
                      </Typography>
                      <Typography variant="body2">
                        <Box component="span" sx={{ mr: 1 }}>
                          {getPaymentMethodIcon(selectedSale.paymentMethod)}
                        </Box>
                        {selectedSale.paymentMethod?.toUpperCase()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        {t("amount_paid")}:
                      </Typography>
                      <Typography variant="body2">
                        ${selectedSale.amountPaid?.toFixed(2)}
                      </Typography>
                    </Box>
                    {selectedSale.change > 0 && (
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          {t("money_change")}:
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          ${selectedSale.change?.toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDetailsDialog(false)} color="inherit">
            {t("close")}
          </Button>
          <Button onClick={() => handlePrintReceipt(selectedSale)} variant="outlined">
            {t("print")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Refund Dialog ── */}
      <Dialog
        open={openRefundSaleDialog}
        onClose={() => setOpenRefundSaleDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {t("create_refund")}
          </Typography>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ scrollbarWidth: "none" }}>
            <Typography fontWeight="bold">{t("reason")}</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              id="reason"
              name="reason"
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.reason && Boolean(formik.errors.reason)}
              helperText={formik.touched.reason && formik.errors.reason}
              disabled={refundLoading}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={refundLoading}
            >
              {refundLoading ? t("processing...") : t("create")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default SaleHistory;
