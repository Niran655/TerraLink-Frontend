import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { TabContext, TabPanel } from "@mui/lab";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
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
  Activity,
  ArrowDownToLine,
  Boxes,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Send,
  Search,
} from "lucide-react";
import { useState } from "react";

import useGetProductWarehouseInShopWithPagination from "../Components/hook/useGetProductWarehouseInShopWithPagination";
import useGetPurchaseOrdersWithPagination from "../Components/hook/useGetPurchaseOrdersWithPagination";
import useGetStockMovementWithPagination from "../Components/hook/useGetStockMovementWithPagination";
import useGetWarehouseRequestWithPagination from "../Components/hook/useGetWarehouseRequestWithPagination";
import useGetWarehouseTransferWithPagination from "../Components/hook/useGetWarehouseTransferWithPagination";
import PurchaseOrderAction from "../Components/warehouse/purchaseOrder/PurchaseOrderAction";
import PurchaseOrderForm from "../Components/warehouse/purchaseOrder/PurchaseOrderForm";
import GetProductInShopAction from "../Components/warehouseInShop/getProduct/GetProductInShopAction";
import WarehouseRequestForm from "../Components/warehouseInShop/WarehouseRequestForm";
import { useAuth } from "../Context/AuthContext";
import { useThemeContext } from "../Context/ThemeContext";
import { translateLauguage } from "../function/translate";
import FooterPagination from "../include/FooterPagination";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
import "../Styles/modernTable.scss";

const statusColor = (status) => {
  switch (status) {
    case "accepted":
    case "received":
    case "transferred":
      return "success";
    case "pending":
      return "warning";
    case "partial_accepted":
    case "partial_received":
    case "approved":
      return "info";
    case "rejected":
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const productName = (row, language) =>
  language === "kh"
    ? row?.subProduct?.parentProductId?.nameKh || row?.product?.nameKh
    : row?.subProduct?.parentProductId?.nameEn || row?.product?.nameEn;

const unitName = (row, language) =>
  language === "kh" ? row?.subProduct?.unitId?.nameKh : row?.subProduct?.unitId?.nameEn;

const WarehouseInShop = () => {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { layoutMode } = useThemeContext();
  const shopId = localStorage.getItem("activeShopId");

  const [tab, setTab] = useState("1");
  const [warehouseNavMode, setWarehouseNavMode] = useState(
    layoutMode === "compact" ? "compact" : "default"
  );

  const [stockPage, setStockPage] = useState(1);
  const [stockLimit, setStockLimit] = useState(5);
  const [stockKeyword, setStockKeyword] = useState("");
  const [stockStatus, setStockStatus] = useState("All");

  const [purchasePage, setPurchasePage] = useState(1);
  const [purchaseLimit, setPurchaseLimit] = useState(5);
  const [purchaseKeyword, setPurchaseKeyword] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("All");
  const [openPurchaseOrder, setOpenPurchaseOrder] = useState(false);

  const [transferPage, setTransferPage] = useState(1);
  const [transferLimit, setTransferLimit] = useState(5);
  const [transferKeyword, setTransferKeyword] = useState("");
  const [transferStatus, setTransferStatus] = useState("All");

  const [requestPage, setRequestPage] = useState(1);
  const [requestLimit, setRequestLimit] = useState(5);
  const [requestKeyword, setRequestKeyword] = useState("");
  const [requestStatus, setRequestStatus] = useState("All");
  const [openWarehouseRequest, setOpenWarehouseRequest] = useState(false);

  const [movementPage, setMovementPage] = useState(1);
  const [movementLimit, setMovementLimit] = useState(5);
  const [movementKeyword, setMovementKeyword] = useState("");

  const {
    producteWarehouseInShop,
    loading: stockLoading,
    paginator: stockPaginator,
    refetch: refetchShopStock,
  } = useGetProductWarehouseInShopWithPagination({
    shopId,
    page: stockPage,
    limit: stockLimit,
    pagination: true,
    keyword: stockKeyword,
    status: stockStatus,
  });

  const {
    purchaseOrders,
    loading: purchaseLoading,
    error: purchaseError,
    refetch: refetchPurchases,
    paginator: purchasePaginator,
  } = useGetPurchaseOrdersWithPagination({
    shopId,
    page: purchasePage,
    limit: purchaseLimit,
    pagination: true,
    keyword: purchaseKeyword,
    status: purchaseStatus === "All" ? undefined : purchaseStatus,
  });

  const {
    productsWarehouseTransfer,
    loading: transferLoading,
    error: transferError,
    refetch: refetchTransfers,
    paginator: transferPaginator,
  } = useGetWarehouseTransferWithPagination({
    shopId,
    page: transferPage,
    limit: transferLimit,
    pagination: true,
    keyword: transferKeyword,
    status: transferStatus === "All" ? undefined : transferStatus,
  });

  const {
    warehouseRequests,
    loading: requestLoading,
    error: requestError,
    refetch: refetchRequests,
    paginator: requestPaginator,
  } = useGetWarehouseRequestWithPagination({
    shopId,
    page: requestPage,
    limit: requestLimit,
    pagination: true,
    keyword: requestKeyword,
    status: requestStatus === "All" ? undefined : requestStatus,
  });

  const {
    stockMovement,
    loading: movementLoading,
    refetch: refetchMovements,
    paginator: movementPaginator,
  } = useGetStockMovementWithPagination({
    shopId,
    page: movementPage,
    limit: movementLimit,
    pagination: true,
    keyword: movementKeyword,
  });

  const filteredStock = producteWarehouseInShop;

  const handleLimit = (setter, pageSetter) => (e) => {
    setter(parseInt(e.target.value, 10));
    pageSetter(1);
  };

  const renderToolbar = ({
    keyword,
    setKeyword,
    setPage,
    status,
    setStatus,
    statusItems,
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
      <Grid container spacing={2} alignItems="center" textAlign="start" sx={{ flex: 1 }}>
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
                  <Search />
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
      </Grid>

      {action && (
        <Stack direction="row" sx={{ alignSelf: { xs: "flex-end", md: "auto" } }}>
          {action}
        </Stack>
      )}
    </Box>
  );

  const isWarehouseNavCompact = warehouseNavMode === "compact" && !isMobile;
  const warehouseTabs = [
    { value: "1", label: t("product_stock"), icon: Boxes },
    { value: "2", label: t("purchase_order"), icon: ClipboardList },
    { value: "3", label: t("get_product"), icon: ArrowDownToLine },
    { value: "4", label: t("request_to_warehouse"), icon: Send },
    { value: "5", label: t("stock_movement"), icon: Activity },
  ];

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Breadcrumbs separator="/">
        <Typography sx={{ borderLeft: "3px solid #1D4592", pl: 1.5 }}>
          {t("warehouse_in_shop")}
        </Typography>
      </Breadcrumbs>

      <TabContext value={tab}>
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
                height: "70vh",
                borderRadius: 1,
                position: "relative",
              }}
            >
              {!isMobile && (
                <Tooltip
                  title={isWarehouseNavCompact ? "Show labels" : "Compact"}
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
                      "&:hover": { bgcolor: "background.paper" },
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
                {warehouseTabs.map((item) => {
                  const Icon = item.icon;
                  const active = tab === item.value;
                  const button = (
                    <Button
                      fullWidth={!isWarehouseNavCompact}
                      variant={active ? "contained" : "text"}
                      onClick={() => setTab(item.value)}
                      aria-label={item.label}
                      sx={{
                        minWidth: isWarehouseNavCompact ? 40 : 0,
                        width: isWarehouseNavCompact ? 40 : "100%",
                        height: 40,
                        px: isWarehouseNavCompact ? 0 : 1.5,
                        justifyContent: isWarehouseNavCompact
                          ? "center"
                          : "flex-start",
                        textTransform: "none",
                      }}
                    >
                      <Icon size={18} />
                      {!isWarehouseNavCompact && (
                        <Box component="span" sx={{ ml: 1 }}>
                          {item.label}
                        </Box>
                      )}
                    </Button>
                  );

                  return isWarehouseNavCompact ? (
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

          <Grid
            size={{
              xs: 12,
              sm: isWarehouseNavCompact ? 11 : 9,
              md: isWarehouseNavCompact ? 11 : 10,
            }}
          >
            <Box>
        <TabPanel value="1" sx={{ p: 0 }}>
          {renderToolbar({
            keyword: stockKeyword,
            setKeyword: setStockKeyword,
            setPage: setStockPage,
            status: stockStatus,
            setStatus: setStockStatus,
            statusItems: [
              { value: "All", label: t("all") },
              { value: "low_stock", label: t("low_stock") },
              { value: "in_stock", label: t("in_enough") },
            ],
          })}

          <TableContainer className="table-container">
            <Table className="table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("no")}</TableCell>
                  <TableCell>{t("product")}</TableCell>
                  <TableCell>{t("barcode")}</TableCell>
                  <TableCell>{t("unit")}</TableCell>
                  <TableCell align="right">{t("stock")}</TableCell>
                  <TableCell align="right">{t("min_stock")}</TableCell>
                  <TableCell align="right">{t("cost")}</TableCell>
                  <TableCell align="right">{t("total_price")}</TableCell>
                  <TableCell>{t("status")}</TableCell>
                </TableRow>
              </TableHead>
              {stockLoading ? (
                <CircularIndeterminate cols={9} />
              ) : filteredStock.length === 0 ? (
                <EmptyData />
              ) : (
                <TableBody>
                  {filteredStock.map((row, index) => {
                    const stock = Number(row?.stock || 0);
                    const minStock = Number(row?.subProduct?.minStock || 0);
                    const cost = Number(row?.subProduct?.costPrice || 0);
                    const isLow = stock < minStock;

                    return (
                      <TableRow key={row._id} className="table-row">
                        <TableCell>{stockPaginator?.slNo + index}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <img
                              src={row?.subProduct?.productImg}
                              width={36}
                              height={36}
                              style={{ borderRadius: "50%", objectFit: "cover" }}
                            />
                            {productName(row, language)}
                          </Stack>
                        </TableCell>
                        <TableCell>{row?.subProduct?.barCode}</TableCell>
                        <TableCell>{unitName(row, language)}</TableCell>
                        <TableCell align="right">{stock}</TableCell>
                        <TableCell align="right">{minStock}</TableCell>
                        <TableCell align="right">${cost.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <strong>${(stock * cost).toFixed(2)}</strong>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={isLow ? <WarningAmberOutlinedIcon /> : <CheckOutlinedIcon />}
                            label={isLow ? `${t("low_stock")} (${minStock - stock})` : t("in_stock")}
                            color={isLow ? "error" : "success"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
            </Table>

            <Stack alignItems="flex-end" p={2}>
              <FooterPagination
                page={stockPage}
                limit={stockLimit}
                setPage={setStockPage}
                handleLimit={handleLimit(setStockLimit, setStockPage)}
                totalDocs={stockPaginator?.totalDocs}
                totalPages={stockPaginator?.totalPages}
              />
            </Stack>
          </TableContainer>
        </TabPanel>

        <TabPanel value="2" sx={{ p: 0 }}>
          {renderToolbar({
            keyword: purchaseKeyword,
            setKeyword: setPurchaseKeyword,
            setPage: setPurchasePage,
            status: purchaseStatus,
            setStatus: setPurchaseStatus,
            statusItems: [
              { value: "All", label: t("all") },
              { value: "pending", label: t("pending") },
              { value: "partial_received", label: t("partial_accepted") },
              { value: "received", label: t("received") },
              { value: "cancelled", label: t("cancelled") },
            ],
            action: (
              <Button
                variant="contained"
                startIcon={<LibraryAddOutlinedIcon />}
                onClick={() => setOpenPurchaseOrder(true)}
              >
                {t("create_purchase_order")}
              </Button>
            ),
          })}

          <TableContainer className="table-container">
            <Table className="table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("no")}</TableCell>
                  <TableCell>{t("suppliers")}</TableCell>
                  <TableCell>{t("items")}</TableCell>
                  <TableCell>{t("total_quantity")}</TableCell>
                  <TableCell>{t("total_price")}</TableCell>
                  <TableCell>{t("status")}</TableCell>
                  <TableCell>{t("date")}</TableCell>
                  <TableCell align="right">{t("action")}</TableCell>
                </TableRow>
              </TableHead>
              {purchaseLoading ? (
                <CircularIndeterminate cols={8} />
              ) : purchaseError ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Typography color="error">{purchaseError.message}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : purchaseOrders.length === 0 ? (
                <EmptyData />
              ) : (
                <TableBody>
                  {purchaseOrders.map((row, index) => {
                    const totalQty = row.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
                    const totalPrice = row.items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);

                    return (
                      <TableRow key={row._id} className="table-row">
                        <TableCell>{purchasePaginator?.slNo + index}</TableCell>
                        <TableCell>
                          {language === "kh" ? row?.supplier?.nameKh : row?.supplier?.nameEn}
                        </TableCell>
                        <TableCell>{row.items.length}</TableCell>
                        <TableCell>{totalQty}</TableCell>
                        <TableCell>${totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={t(row?.status)}
                            color={statusColor(row?.status)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>{new Date(row?.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <PurchaseOrderAction
                            language={language}
                            purchaseOrder={row}
                            t={t}
                            productSource="shopWarehouse"
                            shopId={shopId}
                            setRefetch={() => {
                              refetchPurchases();
                              refetchShopStock();
                              refetchMovements();
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
            </Table>

            <Stack alignItems="flex-end" p={2}>
              <FooterPagination
                page={purchasePage}
                limit={purchaseLimit}
                setPage={setPurchasePage}
                handleLimit={handleLimit(setPurchaseLimit, setPurchasePage)}
                totalDocs={purchasePaginator?.totalDocs}
                totalPages={purchasePaginator?.totalPages}
              />
            </Stack>
          </TableContainer>

          {openPurchaseOrder && (
            <PurchaseOrderForm
              t={t}
              open={openPurchaseOrder}
              onClose={() => setOpenPurchaseOrder(false)}
              language={language}
              setRefetch={refetchPurchases}
              productSource="shopWarehouse"
              shopId={shopId}
            />
          )}
        </TabPanel>

        <TabPanel value="3" sx={{ p: 0 }}>
          {renderToolbar({
            keyword: transferKeyword,
            setKeyword: setTransferKeyword,
            setPage: setTransferPage,
            status: transferStatus,
            setStatus: setTransferStatus,
            statusItems: [
              { value: "All", label: t("all") },
              { value: "pending", label: t("pending") },
              { value: "partial_accepted", label: t("partial_accepted") },
              { value: "accepted", label: t("accepted") },
              { value: "rejected", label: t("rejected") },
            ],
          })}

          <TableContainer className="table-container">
            <Table className="table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("no")}</TableCell>
                  <TableCell>{t("shop")}</TableCell>
                  <TableCell>{t("items")}</TableCell>
                  <TableCell>{t("total_qty")}</TableCell>
                  <TableCell>{t("total_price")}</TableCell>
                  <TableCell>{t("send_by")}</TableCell>
                  <TableCell>{t("accepted_by")}</TableCell>
                  <TableCell>{t("status")}</TableCell>
                  <TableCell>{t("date")}</TableCell>
                  <TableCell align="right">{t("action")}</TableCell>
                </TableRow>
              </TableHead>
              {transferLoading ? (
                <CircularIndeterminate cols={10} />
              ) : transferError ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={10}>
                      <Typography color="error">{transferError.message}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : productsWarehouseTransfer.length === 0 ? (
                <EmptyData />
              ) : (
                <TableBody>
                  {productsWarehouseTransfer.map((row, index) => {
                    const totalQty = row.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
                    const totalPrice = row.items.reduce(
                      (sum, item) =>
                        sum +
                        Number(item.quantity || 0) *
                          Number(item.costPrice || item.subProduct?.costPrice || 0),
                      0,
                    );

                    return (
                      <TableRow key={row._id} className="table-row">
                        <TableCell>{transferPaginator?.slNo + index}</TableCell>
                        <TableCell>{language === "kh" ? row?.toShop?.nameKh : row?.toShop?.nameEn}</TableCell>
                        <TableCell>{row.items.length}</TableCell>
                        <TableCell>{totalQty}</TableCell>
                        <TableCell>${totalPrice.toFixed(2)}</TableCell>
                        <TableCell>{language === "kh" ? row?.requestedBy?.nameKh : row?.requestedBy?.nameEn}</TableCell>
                        <TableCell>
                          {row?.acceptedBy
                            ? language === "kh"
                              ? row?.acceptedBy?.nameKh
                              : row?.acceptedBy?.nameEn
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={t(row?.status)}
                            color={statusColor(row?.status)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>{new Date(row?.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <GetProductInShopAction
                            t={t}
                            language={language}
                            editData={row}
                            refetch={refetchTransfers}
                            productWarehouseInShopRefetch={refetchShopStock}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
            </Table>

            <Stack alignItems="flex-end" p={2}>
              <FooterPagination
                page={transferPage}
                limit={transferLimit}
                setPage={setTransferPage}
                handleLimit={handleLimit(setTransferLimit, setTransferPage)}
                totalDocs={transferPaginator?.totalDocs}
                totalPages={transferPaginator?.totalPages}
              />
            </Stack>
          </TableContainer>
        </TabPanel>

        <TabPanel value="4" sx={{ p: 0 }}>
          {renderToolbar({
            keyword: requestKeyword,
            setKeyword: setRequestKeyword,
            setPage: setRequestPage,
            status: requestStatus,
            setStatus: setRequestStatus,
            statusItems: [
              { value: "All", label: t("all") },
              { value: "pending", label: t("pending") },
              { value: "approved", label: t("accepted") },
              { value: "transferred", label: t("transferred") },
              { value: "rejected", label: t("rejected") },
            ],
            action: (
              <Button
                variant="contained"
                startIcon={<LibraryAddOutlinedIcon />}
                onClick={() => setOpenWarehouseRequest(true)}
              >
                {t("request_to_warehouse")}
              </Button>
            ),
          })}

          <TableContainer className="table-container">
            <Table className="table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("no")}</TableCell>
                  <TableCell>{t("shop")}</TableCell>
                  <TableCell>{t("items")}</TableCell>
                  <TableCell>{t("total_qty")}</TableCell>
                  <TableCell>{t("total_price")}</TableCell>
                  <TableCell>{t("send_by")}</TableCell>
                  <TableCell>{t("accepted_by")}</TableCell>
                  <TableCell>{t("status")}</TableCell>
                  <TableCell>{t("date_want_get_product")}</TableCell>
                  <TableCell>{t("date")}</TableCell>
                </TableRow>
              </TableHead>
              {requestLoading ? (
                <CircularIndeterminate cols={10} />
              ) : requestError ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={10}>
                      <Typography color="error">{requestError.message}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : warehouseRequests.length === 0 ? (
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
                        <TableCell>{requestPaginator?.slNo + index}</TableCell>
                        <TableCell>{language === "kh" ? row?.toShop?.nameKh : row?.toShop?.nameEn}</TableCell>
                        <TableCell>{row.items.length}</TableCell>
                        <TableCell>{totalQty}</TableCell>
                        <TableCell>${totalPrice.toFixed(2)}</TableCell>
                        <TableCell>{language === "kh" ? row?.requestedBy?.nameKh : row?.requestedBy?.nameEn}</TableCell>
                        <TableCell>
                          {row?.approvedBy
                            ? language === "kh"
                              ? row?.approvedBy?.nameKh
                              : row?.approvedBy?.nameEn
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={t(row?.status)}
                            color={statusColor(row?.status)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          {row?.dateWantGetProduct
                            ? new Date(row.dateWantGetProduct).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>{new Date(row?.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
            </Table>

            <Stack alignItems="flex-end" p={2}>
              <FooterPagination
                page={requestPage}
                limit={requestLimit}
                setPage={setRequestPage}
                handleLimit={handleLimit(setRequestLimit, setRequestPage)}
                totalDocs={requestPaginator?.totalDocs}
                totalPages={requestPaginator?.totalPages}
              />
            </Stack>
          </TableContainer>

          {openWarehouseRequest && (
            <WarehouseRequestForm
              t={t}
              language={language}
              shopId={shopId}
              open={openWarehouseRequest}
              onClose={() => setOpenWarehouseRequest(false)}
              setRefetch={refetchRequests}
            />
          )}
        </TabPanel>

        <TabPanel value="5" sx={{ p: 0 }}>
          {renderToolbar({
            keyword: movementKeyword,
            setKeyword: setMovementKeyword,
            setPage: setMovementPage,
          })}

          <TableContainer className="table-container">
            <Table className="table">
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
              {movementLoading ? (
                <CircularIndeterminate cols={8} />
              ) : stockMovement.length === 0 ? (
                <EmptyData />
              ) : (
                <TableBody>
                  {stockMovement.map((row, index) => (
                    <TableRow key={row._id || index} className="table-row">
                      <TableCell>{movementPaginator?.slNo + index}</TableCell>
                      <TableCell>{new Date(row?.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        {language === "kh"
                          ? row?.product?.nameKh || row?.subProduct?.parentProductId?.nameKh
                          : row?.product?.nameEn || row?.subProduct?.parentProductId?.nameEn}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row?.type}
                          size="small"
                          color={row?.type === "in" ? "success" : row?.type === "out" ? "error" : "warning"}
                          sx={{ width: 50, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        {row?.quantity} {unitName(row, language)}
                      </TableCell>
                      <TableCell>{row?.previousStock}</TableCell>
                      <TableCell>{row?.newStock}</TableCell>
                      <TableCell>{row?.reason || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>

            <Stack alignItems="flex-end" p={2}>
              <FooterPagination
                page={movementPage}
                limit={movementLimit}
                setPage={setMovementPage}
                handleLimit={handleLimit(setMovementLimit, setMovementPage)}
                totalDocs={movementPaginator?.totalDocs}
                totalPages={movementPaginator?.totalPages}
              />
            </Stack>
          </TableContainer>
        </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </TabContext>
    </Box>
  );
};

export default WarehouseInShop;
