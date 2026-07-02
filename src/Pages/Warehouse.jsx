// import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
// import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
// import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
// import { Box, Breadcrumbs, Button, Chip, Grid, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
// import { Search } from "lucide-react";
// import dayjs from "dayjs";
// import { useState } from "react";

// import ProductTransferAction from "../Components/warehouse/product-transfer/ProductTransferAction";
// import ProductTransferForm from "../Components/warehouse/product-transfer/ProductTransferForm";
// import useGetWarehouseTransferWithPagination from "../Components/hook/useGetWarehouseTransferWithPagination";
// import useGetProductWarehouseWithPagination from "../Components/hook/useGetProductWarehouseWithPagination";
// import ProductWarehouseAction from "../Components/warehouse/ProductWarehouseAction";
// import FooterPagination from "../include/FooterPagination";
// import "../Styles/TableStyle.scss";
// import { useAuth } from "../context/AuthContext";
// import { translateLauguage } from "../function/translate";
// import EmptyData from "../include/EmptyData";
// import CircularIndeterminate from "../include/Loading";
// const getStatusColor = (status) => {
//   switch (status) {
//     case "pending":
//       return "warning";
//     case "accepted":
//       return "success";
//     case "rejected":
//       return "error";
//     case "partial_accepted":
//       return "info";
//     case "cancelled":
//       return "default";
//     default:
//       return "default";
//   }
// };
// const Warehouse = () => {
//   const [activeTab, setActiveTab] = useState("1");
//   const { language } = useAuth();
//   const { t } = translateLauguage(language);

//   const [productWarehousePage, setProductWarehousePage] = useState(1);
//   const [productWarehouseLimit, setProductWarehouseLimit] = useState(5);
//   const [productWarehouseKeyword, setProductWarehouseKeyword] = useState("");

//   const [productWarehouseTransferPage, setProductWarehouseTransferPage] =
//     useState(1);
//   const [productWarehouseTransferLimit, setProductWarehouseTransferLimit] =
//     useState(5);
//   const [productWarehouseTransferKeyword, setProductWarehouseTransferKeyword] =
//     useState("");

//   const [openTransfer, setOpenTransfer] = useState(false);
//   const handleOpenTransfer = () => setOpenTransfer(true);
//   const handleCloseTransfer = () => setOpenTransfer(false);

//   const {
//     productWarehouseWithPagination,
//     loading: productWarehouseLoading,
//     refetch: productWarehouseRefetch,
//     paginator: productWarehousePaginator,
//   } = useGetProductWarehouseWithPagination({
//     page: productWarehousePage,
//     limit: productWarehouseLimit,
//     pagination: true,
//     keyword: productWarehouseKeyword,
//   });


//   const {
//     productsWarehouseTransfer,
//     loading: productLoading,
//     refetch: productsWarehouseTransferRefetch,
//     paginator: productWarehouseTransferPaginator,
//   } = useGetWarehouseTransferWithPagination({
//     page: productWarehouseTransferPage,
//     limit: productWarehouseTransferLimit,
//     pagination: true,
//     keyword: productWarehouseTransferKeyword,
//   });

//   const handleLimit = (e) => {
//     const newLimit = parseInt(e.target.value, 10);
//     setProductWarehouseLimit(newLimit);
//     setProductWarehousePage(1);
//   };

//   const handlePageChange = (newPage) => {
//     setProductWarehousePage(newPage);
//   };

//   const handleLimitPrductWarehouseTransfer = (e) => {
//     const newLimit = parseInt(e.target.value, 10);
//     setProductWarehouseTransferLimit(newLimit);
//     setProductWarehouseTransferPage(1);
//   };

//   const handleProductWarehouseTransferPageChange = (newPage) => {
//     setProductWarehouseTransferPage(newPage);
//   };

//   return (
//     <Box>
//       <Stack direction="row" justifyContent="space-between" alignItems="center">
//         <Box textAlign="start">
//           <Breadcrumbs aria-label="breadcrumb" separator="/">
//             <Typography
//               // component={RouterLink}
//               to="/setting"
//               variant="h6"
//               sx={{
//                 textDecoration: "none",
//                 borderLeft: "3px solid #1D4592",
//                 pl: 1.5,
//                 fontWeight: 600,
//               }}
//             >
//               {t("warehouse")}
//             </Typography>
//           </Breadcrumbs>
//         </Box>
//       </Stack>
//       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }} mt={5} >
//         <Button
//           variant={activeTab === "1" ? "contained" : "outlined"}
//           onClick={() => setActiveTab("1")}
//           fullWidth
//         >
//           {t(`product_stock`)}
//         </Button>
//         <Button
//           variant={activeTab === "5" ? "contained" : "outlined"}
//           onClick={() => setActiveTab("5")}
//           fullWidth
//         >
//           {t(`transfer_product`)}
//         </Button>
//         <Button
//           variant={activeTab === "2" ? "contained" : "outlined"}
//           onClick={() => setActiveTab("2")}
//           fullWidth
//         >
//           {t(`purchase_order`)}
//         </Button>
//         <Button
//           variant={activeTab === "3" ? "contained" : "outlined"}
//           onClick={() => setActiveTab("3")}
//           fullWidth
//         >
//           {t(`get_product`)}
//         </Button>
//         <Button
//           variant={activeTab === "4" ? "contained" : "outlined"}
//           onClick={() => setActiveTab("4")}
//           fullWidth
//         >
//           {t(`shop_request`)}
//         </Button>
//       </Box>

//       <Box>
//         {activeTab === "1" && (
//           <Box>
//             <TableContainer className="table-container">
//               <Table className="table" sx={{ mt: 3 }}>
//                 <TableHead className="table-header">
//                   <TableRow>
//                     <TableCell>{t(`no`)}</TableCell>
//                     <TableCell>{t(`product`)}</TableCell>
//                     <TableCell>{t(`unit`)}</TableCell>
//                     <TableCell>{t(`stock`)}</TableCell>
//                     <TableCell>{t(`min_stock`)}</TableCell>
//                     <TableCell>{t(`status`)}</TableCell>
//                     <TableCell></TableCell>
//                   </TableRow>
//                 </TableHead>
//                 {productWarehouseLoading ? (
//                   <CircularIndeterminate />
//                 ) : productWarehouseWithPagination?.length == 0 ? (
//                   <EmptyData />
//                 ) : (
//                   <TableBody>
//                     {productWarehouseWithPagination?.map((row, index) => (
//                       <TableRow className="table-row">
//                         <TableCell>
//                           {productWarehousePaginator.slNo + index}
//                         </TableCell>
//                         <TableCell>
//                           <Box display="flex" alignItems="center" gap={1}>
//                             <img
//                               src={row?.subProduct?.productImg}
//                               width={40}
//                               height={40}
//                               style={{
//                                 borderRadius: "100%",
//                                 objectFit: "cover",
//                               }}
//                             />
//                             {language == "kh"
//                               ? row?.subProduct?.parentProductId?.nameKh
//                               : row?.subProduct?.parentProductId?.nameEn}
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           {language == "kh"
//                             ? row?.subProduct?.unitId?.nameKh
//                             : row?.subProduct?.unitId?.nameEn}
//                         </TableCell>
//                         <TableCell>
//                           {row?.stock}{" "}
//                           {language == "kh"
//                             ? row?.subProduct?.unitId?.nameKh
//                             : row?.subProduct?.unitId?.nameEn}
//                         </TableCell>
//                         <TableCell>
//                           {row?.subProduct?.minStock}{" "}
//                           {language == "kh"
//                             ? row?.subProduct?.unitId?.nameKh
//                             : row?.subProduct?.unitId?.nameEn}
//                         </TableCell>
//                         <TableCell>
//                           {row?.stock < row?.subProduct?.minStock ? (
//                             <Chip
//                               icon={<WarningAmberOutlinedIcon />}
//                               label={t("low_stock")}
//                               color=" "
//                               size="small"
//                               // variant="outlined"
//                               sx={{
//                                 fontWeight: 600,
//                                 bgcolor: "#df4a6fff",
//                                 color: "white",
//                               }}
//                             />
//                           ) : (
//                             <Chip
//                               icon={<CheckOutlinedIcon />}
//                               label={t("in_stock")}
//                               color=""
//                               size="small"
//                               // variant="outlined"
//                               sx={{
//                                 fontWeight: 600,
//                                 bgcolor: "#0097A7",
//                                 color: "white",
//                               }}
//                             />
//                           )}
//                         </TableCell>

//                         <TableCell className="flex-end">
//                           <ProductWarehouseAction
//                             unit={row?.subProduct?.unitId}
//                             setRefetch={productWarehouseRefetch}
//                             subProductId={row?.subProduct?._id}
//                             t={t}
//                           />
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 )}
//               </Table>
//               <Stack
//                 direction="row"
//                 justifyContent="flex-end"
//                 alignItems="center"
//                 sx={{ padding: 2 }}
//               >
//                 <FooterPagination
//                   page={productWarehousePage}
//                   limit={productWarehouseLimit}
//                   setPage={handlePageChange}
//                   handleLimit={handleLimit}
//                   totalDocs={productWarehousePaginator?.totalDocs}
//                   totalPages={productWarehousePaginator?.totalPages}
//                 />
//               </Stack>
//             </TableContainer>
//           </Box>
//         )}
//         {activeTab === "5" && (
//           <Box>
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}

//             >
//               <Grid
//                 container
//                 spacing={2}
//                 alignItems="center"
//                 textAlign={"start"}

//               >
//                 <Grid size={{ xs: 12 }}>
//                   <Typography variant="body2" fontWeight={500} mb={0.5}>
//                     {t("search")}
//                   </Typography>

//                   <TextField
//                     type="search"
//                     size="small"
//                     placeholder={t("search") + "..."}
//                     fullWidth
//                     // value={keyword}
//                     // onChange={(e) => setKeyword(e.target.value)}
//                     variant="outlined"
//                     // sx={{
//                     //   "& .MuiOutlinedInput-root fieldset": { border: "none" },
//                     // }}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <Search />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Grid>
//               </Grid>

//               <Stack direction="row" spacing={2} mt={3}>
//                 <Button
//                   variant="contained"
//                   startIcon={<LibraryAddOutlinedIcon size={18} />}
//                   onClick={handleOpenTransfer}
//                 >
//                   {t("create_transfer")}
//                 </Button>
//                 {openTransfer && (
//                   <ProductTransferForm
//                     t={t}
//                     open={openTransfer}
//                     onClose={handleCloseTransfer}
//                     dialogTitle={"Create"}
//                     language={language}
//                     setRefetch={productsWarehouseTransferRefetch}
//                   />
//                 )}
//               </Stack>
//             </Box>
//             <TableContainer className="table-container">
//               <Table className="table" >
//                 <TableHead className="table-header">
//                   <TableRow>
//                     <TableCell>{t("no")}</TableCell>

//                     <TableCell>{t("to_shop")}</TableCell>

//                     <TableCell>{t("category")}</TableCell>

//                     <TableCell>{t("total_quantity")}</TableCell>

//                     <TableCell>{t("status")}</TableCell>

//                     <TableCell>{t("date")}</TableCell>

//                     <TableCell>{t("action")}</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 {productLoading ? (
//                   <CircularIndeterminate />
//                 ) : productsWarehouseTransfer?.length == 0 ? (
//                   <EmptyData />
//                 ) : (
//                   <TableBody>
//                     {productsWarehouseTransfer.map((row, index) => {
//                       const totalQty = row.items.reduce(
//                         (sum, item) => sum + Number(item.quantity || 0),
//                         0,
//                       );

//                       return (
//                         <TableRow key={row._id} className="table-row">
//                           <TableCell>
//                             {productWarehouseTransferPaginator.slNo + index}
//                           </TableCell>
//                           <TableCell>
//                             {row.toShop?.nameEn || row.toShop?.nameKh || "-"}
//                           </TableCell>
//                           <TableCell>{row.items.length}</TableCell>
//                           <TableCell>{totalQty}</TableCell>

//                           <TableCell><Chip
//                             label={t(row?.status)}
//                             color={getStatusColor(row?.status)}
//                             size="small"
//                             sx={{ fontWeight: 600 }}
//                           />
//                           </TableCell>
//                           <TableCell>
//                             {dayjs(row.createdAt).format("DD/MM/YYYY")}
//                           </TableCell>
//                           <TableCell>
//                             <ProductTransferAction
//                               language={language}
//                               editData={row}
//                               t={t}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 )}
//               </Table>
//               <Stack
//                 direction="row"
//                 justifyContent="flex-end"
//                 alignItems="center"
//                 sx={{ padding: 2 }}
//               >
//                 <FooterPagination
//                   page={productWarehouseTransferPage}
//                   limit={productWarehouseTransferLimit}
//                   setPage={handleProductWarehouseTransferPageChange}
//                   handleLimit={handleLimitPrductWarehouseTransfer}
//                   totalDocs={productWarehouseTransferPaginator?.totalDocs}
//                   totalPages={productWarehouseTransferPaginator?.totalPages}
//                 />
//               </Stack>
//             </TableContainer>
//           </Box>
//         )}
//         {activeTab === "2" && <Typography> Orders Content</Typography>}
//         {activeTab === "3" && <Typography> Reports Content</Typography>}
//         {activeTab === "4" && <Typography> 4</Typography>}
//       </Box>
//     </Box>
//   );
// };

// export default Warehouse;

import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Activity,
  ArrowLeftRight,
  Boxes,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Search,
  Store,
} from "lucide-react";
import dayjs from "dayjs";
import { useState } from "react";

import ProductTransferAction from "../Components/warehouse/product-transfer/ProductTransferAction";
import ProductTransferForm from "../Components/warehouse/product-transfer/ProductTransferForm";
import useGetWarehouseTransferWithPagination from "../Components/hook/useGetWarehouseTransferWithPagination";
import useGetProductWarehouseWithPagination from "../Components/hook/useGetProductWarehouseWithPagination";
import ProductWarehouseAction from "../Components/warehouse/ProductWarehouseAction";
import FooterPagination from "../include/FooterPagination";
import "../Styles/TableStyle.scss";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
import useGetPurchaseOrdersWithPagination from "../Components/hook/useGetPurchaseOrdersWithPagination";
import PurchaseOrderAction from "../Components/warehouse/purchaseOrder/PurchaseOrderAction";
import PurchaseOrderForm from "../Components/warehouse/purchaseOrder/PurchaseOrderForm";
import useGetStockMovementWithPagination from "../Components/hook/useGetStockMovementWithPagination";
import useGetWarehouseRequestWithPagination from "../Components/hook/useGetWarehouseRequestWithPagination";
import WarehouseRequestAction from "../Components/warehouse/WarehouseRequestAction";
import { useThemeContext } from "../Context/ThemeContext";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "accepted":
    case "transferred":
      return "success";
    case "rejected":
      return "error";
    case "partial_accepted":
      return "info";
    case "cancelled":
      return "default";
    default:
      return "default";
  }
};

const Warehouse = () => {
  const [activeTab, setActiveTab] = useState("1");
  const { language, setAlert } = useAuth();
  const { t } = translateLauguage(language);

  const [productWarehousePage, setProductWarehousePage] = useState(1);
  const [productWarehouseLimit, setProductWarehouseLimit] = useState(5);
  const [productWarehouseKeyword, setProductWarehouseKeyword] = useState("");
  const [productWarehouseStatus, setProductWarehouseStatus] = useState("All");

  const [productWarehouseTransferPage, setProductWarehouseTransferPage] = useState(1);
  const [productWarehouseTransferLimit, setProductWarehouseTransferLimit] = useState(5);
  const [productWarehouseTransferKeyword, setProductWarehouseTransferKeyword] = useState("");

  const [stockMovementPage, setStockMovementPage] = useState(1);
  const [stockMovementLimit, setStockMovementLimit] = useState(5);
  const [stockMovementKeyword, setStockMovementKeyword] = useState("");
  const [stockMovementStatus, setStockMovementStatus] = useState("All");

  const [purchaseOrderPage, setPurchaseOrderPage] = useState(1);
  const [purchaseOrderLimit, setPurchaseOrderLimit] = useState(5);
  const [purchaseOrderKeyword, setPurchaseOrderKeyword] = useState("");
  const [warehouseRequestPage, setWarehouseRequestPage] = useState(1);
  const [warehouseRequestLimit, setWarehouseRequestLimit] = useState(5);
  const [warehouseRequestKeyword, setWarehouseRequestKeyword] = useState("");

  const [productsWarehouseTransferStatus, setProductsWarehouseTransferStatus] = useState("All");
  const [purchaseOrderStatus, setPurchaseOrderStatus] = useState("All");
  const [warehouseRequestStatus, setWarehouseRequestStatus] = useState("All");

  const [openTransfer, setOpenTransfer] = useState(false);
  const handleOpenTransfer = () => setOpenTransfer(true);
  const handleCloseTransfer = () => setOpenTransfer(false);

  const {
    productWarehouseWithPagination,
    loading: productWarehouseLoading,
    refetch: productWarehouseRefetch,
    paginator: productWarehousePaginator,
  } = useGetProductWarehouseWithPagination({
    page: productWarehousePage,
    limit: productWarehouseLimit,
    pagination: true,
    keyword: productWarehouseKeyword,
    status: productWarehouseStatus === "All"
      ? undefined
      : productWarehouseStatus,
  });

  const {
    productsWarehouseTransfer,
    loading: productLoading,
    error: productWarehouseTransferError,
    refetch: productsWarehouseTransferRefetch,
    paginator: productWarehouseTransferPaginator,
  } = useGetWarehouseTransferWithPagination({
    page: productWarehouseTransferPage,
    limit: productWarehouseTransferLimit,
    pagination: true,
    keyword: productWarehouseTransferKeyword,
    status: productsWarehouseTransferStatus === "All" ? undefined : productsWarehouseTransferStatus
  });

  const {
    stockMovement,
    loading: stockMovementLoading,
    refetch: sotckMovementRefetch,
    paginator: stockMovementPaginator,
  } = useGetStockMovementWithPagination({
    page: stockMovementPage,
    limit: stockMovementLimit,
    pagination: true,
    keyword: stockMovementKeyword,
    type: stockMovementStatus === "All" ? undefined : stockMovementStatus,
    onError: (error) => {
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    },
  });



  const {
    purchaseOrders,
    loading: purchaseOrderLoading,
    refetch: purchaseOrderRefetch,
    paginator: purchaseOrderPaginator,
  } = useGetPurchaseOrdersWithPagination({
    page: purchaseOrderPage,
    limit: purchaseOrderLimit,
    pagination: true,
    keyword: purchaseOrderKeyword,
    status: purchaseOrderStatus === "All" ? undefined : purchaseOrderStatus
  });

  const {
    warehouseRequests,
    loading: warehouseRequestLoading,
    error: warehouseRequestError,
    refetch: warehouseRequestRefetch,
    paginator: warehouseRequestPaginator,
  } = useGetWarehouseRequestWithPagination({
    page: warehouseRequestPage,
    limit: warehouseRequestLimit,
    pagination: true,
    keyword: warehouseRequestKeyword,
    status: warehouseRequestStatus === "All" ? undefined : warehouseRequestStatus,
  });




  const handleProductTransferStatusChange = (e) => {
    setProductsWarehouseTransferStatus(e.target.value);
    setProductWarehouseTransferPage(1);
  };

  const handleProductTransferSearchChange = (e) =>{
    setProductWarehouseTransferKeyword(e.target.value);
  }

  const handleProductWarehouseStatusChange = (e) => {
    setProductWarehouseStatus(e.target.value);
    setProductWarehousePage(1);
  };

  const handleProductWarehouseSearchChange = (e) => {
    const value = e.target.value;

    setProductWarehousePage(1);
    setProductWarehouseKeyword(value);
  };

  const handlePurchaseOrderStatusChange = (e) => {
    setPurchaseOrderStatus(e.target.value);
    setPurchaseOrderPage(1);
  };

  const handlePurchaseOrderSearchChange = (e) =>{
    setPurchaseOrderKeyword(e.target.value);
  }

  const handleWarehouseRequestStatusChange = (e) => {
    setWarehouseRequestStatus(e.target.value);
    setWarehouseRequestPage(1);
  };

  const handleWarehouseRequestSearchChange = (e) => {
    setWarehouseRequestKeyword(e.target.value);
    setWarehouseRequestPage(1);
  };

  const handleStockMovementSearchChange = (e) => {
    setStockMovementKeyword(e.target.value);
    setStockMovementPage(1);
  };

  const handleStockMovementStatusChange = (e) => {
    setStockMovementStatus(e.target.value);
    setStockMovementPage(1);
  };

  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setProductWarehouseLimit(newLimit);
    setProductWarehousePage(1);
  };

  const handlePageChange = (newPage) => {
    setProductWarehousePage(newPage);
  };

  const handleLimitPrductWarehouseTransfer = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setProductWarehouseTransferLimit(newLimit);
    setProductWarehouseTransferPage(1);
  };

  const handleProductWarehouseTransferPageChange = (newPage) => {
    setProductWarehouseTransferPage(newPage);
  };

  const handleLimitPurchaseOrder = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setPurchaseOrderLimit(newLimit);
    setPurchaseOrderPage(1);
  };
  const handlePurchaseOrderPageChange = (newPage) => {
    setPurchaseOrderPage(newPage);
  };

  const handleLimitWarehouseRequest = (e) => {
    setWarehouseRequestLimit(parseInt(e.target.value, 10));
    setWarehouseRequestPage(1);
  };

  const handleLimitStockMovement = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setStockMovementLimit(newLimit);
    setStockMovementPage(1);
  };
  const handleStockMovementPageChange = (newPage) => {
    setStockMovementPage(newPage);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { layoutMode } = useThemeContext();
  const [warehouseNavMode, setWarehouseNavMode] = useState(
    layoutMode === "compact" ? "compact" : "default"
  );
  const isWarehouseNavCompact = warehouseNavMode === "compact" && !isMobile;
  const warehouseTabs = [
    { value: "1", label: t("product_stock"), icon: Boxes },
    { value: "5", label: t("transfer_product"), icon: ArrowLeftRight },
    { value: "2", label: t("purchase_order"), icon: ClipboardList },
    { value: "4", label: t("shop_request"), icon: Store },
    { value: "3", label: t("stock_movement"), icon: Activity },
  ];
  const tableScrollSx = {
    maxHeight: { xs: "65vh", md: "calc(100vh - 270px)" },
    overflow: "auto",
    position: "relative",
    "& .MuiTableCell-stickyHeader": {
      top: 0,
      zIndex: 2,
      bgcolor: "background.paper",
    },
  };
  const tablePaginationSx = {
    position: "sticky",
    bottom: 0,
    zIndex: 2,
    padding: 2,
    bgcolor: "background.paper",
    borderTop: `1px solid ${theme.palette.divider}`,
  };
  const stockMovementTableScrollSx = {
    ...tableScrollSx,
    maxHeight: { xs: "58vh", md: "calc(100vh - 365px)" },
  };

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
              {t("warehouse")}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Stack>


      <Grid container spacing={2} sx={{ mt: 2 }}>

        <Grid
          size={{
            xs: 12,
            sm: isWarehouseNavCompact ? 1 : 3,
            md: isWarehouseNavCompact ? 1 : 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: isWarehouseNavCompact ? 1 : 2,
              // backgroundColor: "#f5f5f5",
              height: "70vh",
              borderRadius: 1,
              position: { sm: "sticky" },
              top: { sm: 88 },
              // height: "100%",
            }}
          >
            {!isMobile && (
              <Tooltip
                title={
                  isWarehouseNavCompact
                    ? "Show labels"
                    : "Compact"
                }
                placement="right"
                arrow
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    setWarehouseNavMode((prev) =>
                      prev === "compact" ? "default" : "compact"
                    )
                  }
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
                    "&:hover": {
                      bgcolor: "background.paper",
                    },
                  }}
                >
                  {isWarehouseNavCompact ? (
                    <ChevronRight size={16} />
                  ) : (
                    <ChevronLeft size={16} />
                  )}
                </IconButton>
              </Tooltip>
            )}
            <Stack
              direction="column"
              spacing={1}
              alignItems={isWarehouseNavCompact ? "center" : "stretch"}
            >
              {warehouseTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.value;
                const button = (
                  <Button
                    fullWidth={!isWarehouseNavCompact}
                    variant={active ? "contained" : "text"}
                    onClick={() => setActiveTab(tab.value)}
                    aria-label={tab.label}
                    sx={{
                      minWidth: isWarehouseNavCompact ? 40 : 0,
                      width: isWarehouseNavCompact ? 40 : "100%",
                      height: 40,
                      px: isWarehouseNavCompact ? 0 : 1.5,
                      justifyContent: isWarehouseNavCompact ? "center" : "flex-start",
                      textTransform: "none",
                    }}
                  >
                    <Icon size={18} />
                    {!isWarehouseNavCompact && (
                      <Box component="span" sx={{ ml: 1 }}>
                        {tab.label}
                      </Box>
                    )}
                  </Button>
                );

                return isWarehouseNavCompact ? (
                  <Tooltip key={tab.value} title={tab.label} placement="right" arrow>
                    {button}
                  </Tooltip>
                ) : (
                  <Box key={tab.value}>{button}</Box>
                );
              })}
            </Stack>
          </Paper>
        </Grid>


        <Grid
          size={{
            xs: 12,
            sm: isWarehouseNavCompact ? 11 : 9,
            md: isWarehouseNavCompact ? 11 : 10,
          }}
        >
          <Box>
            {activeTab === "1" && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    textAlign={"start"}
                    sx={{ flex: 1 }}
                  >
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Typography variant="body2" fontWeight={500} mb={0.5}>
                        {t("search")}
                      </Typography>
                      <TextField
                        type="search"
                        size="small"
                        value={productWarehouseKeyword}
                        onChange={handleProductWarehouseSearchChange}
                        placeholder={t("search") + "..."}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                      <Typography className="search-head-title">{t("status")}</Typography>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={productWarehouseStatus}
                        onChange={handleProductWarehouseStatusChange}
                      >
                        <MenuItem value="All">{t("all")}</MenuItem>
                        <MenuItem value="in_stock">{t("in_stock")}</MenuItem>
                        <MenuItem value="low_stock">{t("low_stock")}</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<LibraryAddOutlinedIcon size={18} />}
                      onClick={handleOpenTransfer}
                    >
                      {t("create_transfer")}
                    </Button>
                    {openTransfer && (
                      <ProductTransferForm
                        t={t}
                        open={openTransfer}
                        onClose={handleCloseTransfer}
                        dialogTitle={"Create"}
                        language={language}
                        setRefetch={purchaseOrderRefetch}
                      />
                    )}
                  </Stack>
                </Box>
                <TableContainer className="table-container" sx={tableScrollSx}>
                  <Table className="table" stickyHeader>
                    <TableHead  >
                      <TableRow>
                        <TableCell>{t("no")}</TableCell>
                        <TableCell>{t("product")}</TableCell>
                        <TableCell>{t("unit")}</TableCell>
                        <TableCell>{t("stock")}</TableCell>
                        <TableCell>{t("min_stock")}</TableCell>
                        <TableCell >{t("status")}</TableCell>
                        <TableCell className="flex-center">{t("action")}</TableCell>
                      </TableRow>
                    </TableHead>
                    {productWarehouseLoading ? (
                      <CircularIndeterminate cols={7} />
                    ) : productWarehouseWithPagination?.length === 0 ? (
                      <EmptyData />
                    ) : (
                      <TableBody>
                        {productWarehouseWithPagination?.map((row, index) => (
                          <TableRow className="table-row" key={row._id || index}>
                            <TableCell>
                              {productWarehousePaginator.slNo + index}
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <img
                                  src={row?.subProduct?.productImg}
                                  width={40}
                                  height={40}
                                  style={{
                                    borderRadius: 2,
                                    objectFit: "cover",
                                  }}
                                  alt="product"
                                />
                                {language == "kh"
                                  ? row?.subProduct?.parentProductId?.nameKh
                                  : row?.subProduct?.parentProductId?.nameEn}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {language == "kh"
                                ? row?.subProduct?.unitId?.nameKh
                                : row?.subProduct?.unitId?.nameEn}
                            </TableCell>
                            <TableCell>
                              {row?.stock}{" "}
                              {language == "kh"
                                ? row?.subProduct?.unitId?.nameKh
                                : row?.subProduct?.unitId?.nameEn}
                            </TableCell>
                            <TableCell>
                              {row?.subProduct?.minStock}{" "}
                              {language == "kh"
                                ? row?.subProduct?.unitId?.nameKh
                                : row?.subProduct?.unitId?.nameEn}
                            </TableCell>
                            <TableCell>
                              {row?.stock < row?.subProduct?.minStock ? (
                                <Chip
                                  icon={<WarningAmberOutlinedIcon />}
                                  label={t("low_stock")}
                                  size="small"
                                  color="warning"
                                  fontWeight="600"
                                />
                              ) : (
                                <Chip
                                  icon={<CheckOutlinedIcon />}
                                  label={t("in_stock")}
                                  size="small"
                                  color="success"
                                  fontWeight="600"
                                />
                              )}
                            </TableCell>

                            <TableCell className="flex-end">
                              <ProductWarehouseAction
                                unit={row?.subProduct?.unitId}
                                setRefetch={productWarehouseRefetch}
                                subProductId={row?.subProduct?._id}
                                t={t}
                                warehouseData={row}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    )}
                  </Table>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={tablePaginationSx}
                  >
                    <FooterPagination
                      page={productWarehousePage}
                      limit={productWarehouseLimit}
                      setPage={handlePageChange}
                      handleLimit={handleLimit}
                      totalDocs={productWarehousePaginator?.totalDocs}
                      totalPages={productWarehousePaginator?.totalPages}
                    />
                  </Stack>
                </TableContainer>
              </Box>
            )}
            {activeTab === "5" && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    textAlign={"start"}
                    sx={{ flex: 1 }}
                  >
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Typography variant="body2" fontWeight={500} mb={0.5}>
                        {t("search")}
                      </Typography>
                      <TextField
                        type="search"
                        size="small"
                        value={productWarehouseTransferKeyword}
                        onChange={handleProductTransferSearchChange}
                        placeholder={t("search") + "..."}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                      <Typography className="search-head-title">{t("status")}</Typography>
                      <TextField
                        className="select-text-field"
                        select
                        fullWidth
                        size="small"
                        value={productsWarehouseTransferStatus}
                        sx={{
                          width: "200px",

                        }}
                        onChange={handleProductTransferStatusChange}
                      >
                        <MenuItem value="All">{t("all")}</MenuItem>
                        <MenuItem value="pending">{t("pending")}</MenuItem>
                        <MenuItem value="accepted">{t("accepted")}</MenuItem>
                        <MenuItem value="partial_accepted">{t("partial_accepted")}</MenuItem>
                        <MenuItem value="rejected">{t("rejected")}</MenuItem>
                        <MenuItem value="cancelled">{t("cancelled")}</MenuItem>

                      </TextField>
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<LibraryAddOutlinedIcon size={18} />}
                      onClick={handleOpenTransfer}
                    >
                      {t("create_transfer")}
                    </Button>
                    {openTransfer && (
                      <ProductTransferForm
                        t={t}
                        open={openTransfer}
                        onClose={handleCloseTransfer}
                        dialogTitle={"Create"}
                        language={language}
                        setRefetch={purchaseOrderRefetch}
                      />
                    )}
                  </Stack>
                </Box>
                <TableContainer className="table-container" sx={tableScrollSx}>
                  <Table className="table" stickyHeader>
                    <TableHead  >
                      <TableRow>
                        <TableCell>{t("no")}</TableCell>
                        <TableCell>{t("to_shop")}</TableCell>
                        <TableCell>{t("category")}</TableCell>
                        <TableCell>{t("total_quantity")}</TableCell>
                        <TableCell>{t("status")}</TableCell>
                        <TableCell>{t("date")}</TableCell>
                        <TableCell className="flex-center">{t("action")}</TableCell>
                      </TableRow>
                    </TableHead>

                    {productLoading ? (
                      <CircularIndeterminate cols={7} />
                    ) : productWarehouseTransferError ? (
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={7}>
                            <Typography color="error">
                              {productWarehouseTransferError.message}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ) : productsWarehouseTransfer?.length === 0 ? (
                      <EmptyData />
                    ) : (
                      <TableBody>
                        {productsWarehouseTransfer.map((row, index) => {
                          const totalQty = row.items.reduce(
                            (sum, item) => sum + Number(item.quantity || 0),
                            0
                          );

                          return (
                            <TableRow key={row._id} className="table-row">
                              <TableCell>
                                {productWarehouseTransferPaginator.slNo + index}
                              </TableCell>
                              <TableCell>
                                {language === "en"
                                  ? row.toShop?.nameEn
                                  : row.toShop?.nameKh || "-"}
                              </TableCell>
                              <TableCell>{row.items.length}</TableCell>
                              <TableCell>{totalQty}</TableCell>
                              <TableCell>
                                <Chip
                                  label={t(row?.status)}
                                  color={getStatusColor(row?.status)}
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                {dayjs(row.createdAt).format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell className="flex-end">
                                <ProductTransferAction
                                  language={language}
                                  editData={row}
                                  t={t}
                                  setRefetch={productsWarehouseTransferRefetch}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    )}
                  </Table>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={tablePaginationSx}
                  >
                    <FooterPagination
                      page={productWarehouseTransferPage}
                      limit={productWarehouseTransferLimit}
                      setPage={handleProductWarehouseTransferPageChange}
                      handleLimit={handleLimitPrductWarehouseTransfer}
                      totalDocs={productWarehouseTransferPaginator?.totalDocs}
                      totalPages={productWarehouseTransferPaginator?.totalPages}
                    />
                  </Stack>
                </TableContainer>
              </Box>
            )}
            {activeTab === "2" &&
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    textAlign={"start"}
                    sx={{ flex: 1 }}
                  >
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Typography variant="body2" fontWeight={500} mb={0.5}>
                        {t("search")}
                      </Typography>
                      <TextField
                        type="search"
                        size="small"
                        placeholder={t("search") + "..."}
                        fullWidth
                        value={purchaseOrderKeyword}
                        onChange={handlePurchaseOrderSearchChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                      <Typography className="search-head-title">{t("status")}</Typography>
                      <TextField
                        className="select-text-field"
                        select
                        fullWidth
                        size="small"
                        value={purchaseOrderStatus}
                        sx={{
                          width: "200px",

                        }}
                        onChange={handlePurchaseOrderStatusChange}
                      >
                        <MenuItem value="All">{t("all")}</MenuItem>
                        <MenuItem value="pending">{t("pending")}</MenuItem>
                        <MenuItem value="partial_received">{t("partial_accepted")}</MenuItem>
                        <MenuItem value="received">{t("received")}</MenuItem>
                        <MenuItem value="cancelled">{t("cancelled")}</MenuItem>


                      </TextField>
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<LibraryAddOutlinedIcon size={18} />}
                      onClick={handleOpenTransfer}
                    >
                      {t("create_purchase_order")}
                    </Button>
                    {openTransfer && (
                      <PurchaseOrderForm
                        t={t}
                        open={openTransfer}
                        onClose={handleCloseTransfer}
                        dialogTitle={"Create"}
                        language={language}
                        setRefetch={productsWarehouseTransferRefetch}
                      />
                    )}
                  </Stack>
                </Box>
                <TableContainer className="table-container" sx={tableScrollSx}>
                  <Table className="table" stickyHeader>
                    <TableHead  >
                      <TableRow>
                        <TableCell>{t("no")}</TableCell>
                        <TableCell>{t("suppliers")}</TableCell>
                        <TableCell>{t("category")}</TableCell>
                        <TableCell>{t("total_quantity")}</TableCell>
                        <TableCell>{t("status")}</TableCell>
                        <TableCell>{t("date")}</TableCell>
                        <TableCell className="flex-center" >{t("action")}</TableCell>
                      </TableRow>
                    </TableHead>

                    {purchaseOrderLoading ? (
                      <CircularIndeterminate cols={7} />
                    ) : purchaseOrders?.length === 0 ? (
                      <EmptyData />
                    ) : (
                      <TableBody>
                        {purchaseOrders.map((row, index) => {
                          const totalQty = row.items.reduce(
                            (sum, item) => sum + Number(item.quantity || 0),
                            0
                          );

                          return (
                            <TableRow key={row._id} className="table-row">
                              <TableCell>
                                {(purchaseOrderPaginator?.slNo || 1) + index}
                              </TableCell>
                              <TableCell>
                                {language === "en" ? row.supplier?.nameEn : row.supplier?.nameKh || "-"}
                              </TableCell>
                              <TableCell>{row.items.length}</TableCell>
                              <TableCell>{totalQty}</TableCell>
                              <TableCell>
                                <Chip
                                  label={t(row?.status)}
                                  color={getStatusColor(row?.status)}
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                {dayjs(row.createdAt).format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell className="flex-end" >
                                <PurchaseOrderAction language={language} setRefetch={purchaseOrderRefetch} purchaseOrder={row} t={t} />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    )}
                  </Table>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={tablePaginationSx}
                  >
                    <FooterPagination
                      page={purchaseOrderPage}
                      limit={purchaseOrderLimit}
                      setPage={handlePurchaseOrderPageChange}
                      handleLimit={handleLimitPurchaseOrder}
                      totalDocs={purchaseOrderPaginator?.totalDocs}
                      totalPages={purchaseOrderPaginator?.totalPages}
                    />
                  </Stack>
                </TableContainer>
              </Box>
            }
            {activeTab === "3" && <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  textAlign={"start"}
                  sx={{ flex: 1 }}
                >
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                      {t("search")}
                    </Typography>
                    <TextField
                      type="search"
                      size="small"
                      value={stockMovementKeyword}
                      onChange={handleStockMovementSearchChange}
                      placeholder={`${t("search")} ${t("product")}...`}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                    <Typography className="search-head-title">{t("status")}</Typography>
                    <TextField
                      className="select-text-field"
                      select
                      fullWidth
                      size="small"
                      value={stockMovementStatus}
                      onChange={handleStockMovementStatusChange}
                    >
                      <MenuItem value="All">{t("all")}</MenuItem>
                      <MenuItem value="in">{t("in")}</MenuItem>
                      <MenuItem value="out">{t("out")}</MenuItem>
                      <MenuItem value="adjustment">{t("adjustment")}</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
              <TableContainer className="table-container" sx={stockMovementTableScrollSx}>
                <Table className="table" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("no")}</TableCell>
                      <TableCell>{t("date")}</TableCell>
                      <TableCell>{t("product")}</TableCell>
                      <TableCell>{t("type")}</TableCell>
                      <TableCell>{t("quantity")}</TableCell>
                      <TableCell>{t("previous_stock")}</TableCell>
                      <TableCell>{t("new_stock")}</TableCell>
                      <TableCell>{t("reason")}</TableCell>

                    </TableRow>
                  </TableHead>
                  {stockMovementLoading ? (
                    <CircularIndeterminate cols={8} />
                  ) : stockMovement?.length === 0 ? (
                    <EmptyData />
                  ) : (
                    <TableBody>
                      {stockMovement?.map((row, index) => (
                        <TableRow className="table-row" key={index}>


                          <TableCell>
                            {stockMovementPaginator?.slNo + index}
                          </TableCell>


                          <TableCell>
                            {new Date(row?.createdAt).toLocaleString()}
                          </TableCell>


                          <TableCell>
                            {language === "kh"
                              ? row?.product?.nameKh
                              : row?.product?.nameEn}
                          </TableCell>


                          <TableCell>
                            <Chip
                              label={language === "kh" ? t(row?.type) : row?.type}
                              size="small"
                              color={row?.type === "in"
                                ? "success"
                                : row?.type === "out"
                                  ? "error"
                                  : "warning"}

                              sx={{
                                width: 50,


                                fontWeight: 600,
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            {row?.quantity}{" "}
                            {language === "kh"
                              ? row?.subProduct?.unitId?.nameKh
                              : row?.subProduct?.unitId?.nameEn}
                          </TableCell>
                          <TableCell>{row?.previousStock}</TableCell>
                          <TableCell>{row?.newStock}</TableCell>
                          <TableCell>{row?.reason || "-"}</TableCell>

                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  sx={tablePaginationSx}
                >
                  <FooterPagination
                    page={stockMovementPage}
                    limit={stockMovementLimit}
                    setPage={handleStockMovementPageChange}
                    handleLimit={handleLimitStockMovement}
                    totalDocs={stockMovementPaginator?.totalDocs}
                    totalPages={stockMovementPaginator?.totalPages}
                  />
                </Stack>
              </TableContainer>
            </Box>}
            {activeTab === "4" && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Grid container spacing={2} alignItems="center" textAlign="start" sx={{ flex: 1 }}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Typography variant="body2" fontWeight={500} mb={0.5}>
                        {t("search")}
                      </Typography>
                      <TextField
                        type="search"
                        size="small"
                        value={warehouseRequestKeyword}
                        onChange={handleWarehouseRequestSearchChange}
                        placeholder={t("search") + "..."}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                      <Typography className="search-head-title">{t("status")}</Typography>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={warehouseRequestStatus}
                        sx={{ width: "200px" }}
                        onChange={handleWarehouseRequestStatusChange}
                      >
                        <MenuItem value="All">{t("all")}</MenuItem>
                        <MenuItem value="pending">{t("pending")}</MenuItem>
                        <MenuItem value="approved">{t("accepted")}</MenuItem>
                        <MenuItem value="transferred">{t("transferred")}</MenuItem>
                        <MenuItem value="rejected">{t("rejected")}</MenuItem>
                        <MenuItem value="cancelled">{t("cancelled")}</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>

                <TableContainer className="table-container" sx={tableScrollSx}>
                  <Table className="table" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("no")}</TableCell>
                        <TableCell>{t("shop")}</TableCell>
                        <TableCell>{t("items")}</TableCell>
                        <TableCell>{t("total_quantity")}</TableCell>
                        <TableCell>{t("total_price")}</TableCell>
                        <TableCell>{t("send_by")}</TableCell>
                        <TableCell>{t("accepted_by")}</TableCell>
                        <TableCell>{t("status")}</TableCell>
                        <TableCell>{t("date_want_get_product")}</TableCell>
                        <TableCell>{t("date")}</TableCell>
                        <TableCell className="flex-center">{t("action")}</TableCell>
                      </TableRow>
                    </TableHead>
                    {warehouseRequestLoading ? (
                      <CircularIndeterminate cols={11} />
                    ) : warehouseRequestError ? (
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={11}>
                            <Typography color="error">{warehouseRequestError.message}</Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ) : warehouseRequests?.length === 0 ? (
                      <EmptyData />
                    ) : (
                      <TableBody>
                        {warehouseRequests.map((row, index) => {
                          const totalQty = row.items.reduce(
                            (sum, item) => sum + Number(item.requestedQty || 0),
                            0,
                          );
                          const totalPrice = row.items.reduce(
                            (sum, item) =>
                              sum +
                              Number(item.requestedQty || 0) *
                                Number(item.subProduct?.costPrice || 0),
                            0,
                          );

                          return (
                            <TableRow key={row._id} className="table-row">
                              <TableCell>{warehouseRequestPaginator?.slNo + index}</TableCell>
                              <TableCell>
                                {language === "kh" ? row.toShop?.nameKh : row.toShop?.nameEn || "-"}
                              </TableCell>
                              <TableCell>{row.items.length}</TableCell>
                              <TableCell>{totalQty}</TableCell>
                              <TableCell>${totalPrice.toFixed(2)}</TableCell>
                              <TableCell>
                                {language === "kh"
                                  ? row.requestedBy?.nameKh
                                  : row.requestedBy?.nameEn || "-"}
                              </TableCell>
                              <TableCell>
                                {row.approvedBy
                                  ? language === "kh"
                                    ? row.approvedBy?.nameKh
                                    : row.approvedBy?.nameEn
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={t(row?.status)}
                                  color={getStatusColor(row?.status)}
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                {row?.dateWantGetProduct
                                  ? dayjs(row.dateWantGetProduct).format("DD/MM/YYYY")
                                  : "-"}
                              </TableCell>
                              <TableCell>{dayjs(row.createdAt).format("DD/MM/YYYY")}</TableCell>
                              <TableCell className="flex-end">
                                <WarehouseRequestAction
                                  request={row}
                                  t={t}
                                  language={language}
                                  setRefetch={() => {
                                    warehouseRequestRefetch();
                                    productsWarehouseTransferRefetch();
                                    productWarehouseRefetch();
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    )}
                  </Table>
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={tablePaginationSx}>
                    <FooterPagination
                      page={warehouseRequestPage}
                      limit={warehouseRequestLimit}
                      setPage={setWarehouseRequestPage}
                      handleLimit={handleLimitWarehouseRequest}
                      totalDocs={warehouseRequestPaginator?.totalDocs}
                      totalPages={warehouseRequestPaginator?.totalPages}
                    />
                  </Stack>
                </TableContainer>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Warehouse;
