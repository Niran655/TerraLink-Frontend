import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TableRestaurantOutlinedIcon from "@mui/icons-material/TableRestaurantOutlined";
import {
  Box, Button, Divider, FormControl, IconButton, InputLabel,
  MenuItem, Paper, Select, Stack, Tab, Tabs, TextField,
  Tooltip, Typography,
} from "@mui/material";
import { SquarePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import InvoicePending from "./InvoicePending";
import SaleHistory from "./SaleHistory";
import CustomerForm from "../customer/CustomerForm";

const GUEST = { _id: "guest", nameEn: "Guest", nameKh: "ភ្ញៀវ" };

const CartPanel = ({
  cart,
  updateQty,
  removeFromCart,
  clearCart,
  orderType,
  setOrderType,
  tablesData,
  selectedTable,
  setSelectedTable,
  customersData,
  selectedCustomer,
  setSelectedCustomer,
  subtotal,
  tax,
  total,
  t,
  language,
  creating,
  onPayNow,
  onStopInvoice,
  openHistory,
  openSalePending,
  onOpenHistory,
  onCloseHistory,
  onOpenSalePending,
  onCloseSalePending,
  shopId,
  onSelectPendingSale,
  refetchCustomers,
}) => {
  const [openCustomerForm, setOpenCustomerForm] = useState(false);

  const rawTables = tablesData
    ? (Object.values(tablesData).find(Array.isArray) ?? [])
    : [];

  const rawCustomers = customersData
    ? (Object.values(customersData).find(Array.isArray) ?? [])
    : [];

  const activeTables = rawTables.filter((tbl) => tbl.active !== false);
  const customerOptions = [GUEST, ...rawCustomers.filter((c) => c.active !== false)];

  // Include selectedCustomer if it's not in the options (e.g., from pending sale)
  const allCustomerOptions = selectedCustomer && !customerOptions.find(c => c._id === selectedCustomer._id)
    ? [...customerOptions, selectedCustomer]
    : customerOptions;

  useEffect(() => {
    if (!selectedCustomer) setSelectedCustomer(GUEST);
  }, [selectedCustomer]);

  const orderTypes = [
    { key: "dine_in", label: t("dine_in") },
    { key: "take_away", label: t("take_away") },
    { key: "delivery", label: t("delivery") },
  ];

  const displayName = (c) =>
    language === "kh" ? (c.nameKh || c.nameEn) : c.nameEn;

  const handleOrderTypeChange = (_, newValue) => {
    setOrderType(newValue);
    if (newValue !== "dine_in") setSelectedTable(null);
  };

  const handleCustomerChange = (e) => {
    const id = e.target.value;
    const found = allCustomerOptions.find((c) => c._id === id);
    setSelectedCustomer(found ?? GUEST);
  };

  const handleTableChange = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setSelectedTable(null);
      return;
    }
    const foundTable = activeTables.find((tbl) => tbl._id === selectedId);
    setSelectedTable(foundTable ?? null);
  };

  const handleCustomerCreated = () => {
    if (refetchCustomers) refetchCustomers();
  };

  return (
    <Box>
      <Box className="cart-panel" sx={{ overflow: "auto", height: "100%" }}>
        
        <Box className="cart-header">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography className="cart-title">{t("current_order")}</Typography>

            <Tooltip title={t("view_sale_history")}>
              <IconButton size="small" onClick={onOpenHistory}>
                <ReceiptOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("pending_invoices") || "Pending invoices"}>
              <IconButton size="small" onClick={onOpenSalePending}>
                <ManageHistoryOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <SaleHistory
              open={openHistory}
              onClose={onCloseHistory}
              t={t}
              shopId={shopId}
              onViewDetails={(sale) => console.log("View sale details:", sale)}
            />
            <InvoicePending
              t={t}
              open={openSalePending}
              onClose={onCloseSalePending}
              shopId={shopId}
              onLoadToCart={onSelectPendingSale}
            />
          </Stack>

          {cart.length > 0 && (
            <Button size="small" color="error" onClick={clearCart}>
              <Typography color="error">{t("clear")}</Typography>
            </Button>
          )}
        </Box>

        <Divider />

 
<Tabs
  value={orderType}
  onChange={handleOrderTypeChange}
  variant="fullWidth"
  className="order-type-tabs"
  sx={{
    minHeight: 36,  
  }}
>
  {orderTypes.map((type) => (
    <Tab
      key={type.key}
      label={type.label}
      value={type.key}
      component={Button}
      sx={{
        mx: 0.3,
        minHeight: 36,
        py: 0.5,       
        px: 1.5,        
        fontSize: "0.8rem",  
        textTransform: "none",
        borderRadius: "6px",
        
        "&.Mui-selected": {
          bgcolor: "primary.main",
          color: "#fff",
        },
      }}
    />
  ))}
</Tabs>

        <Divider />


        <Box className="customer-info" sx={{ px: 1.5, py: 1.5 }}>
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            useFlexGap
            sx={{ alignItems: "flex-start" }}
          >
            <Tooltip title={t("add_customer")}>
              <IconButton
                size="small"
                onClick={() => setOpenCustomerForm(true)}
                sx={{ mt: 0.5, px: 0.5 }}
              >
                <SquarePlus fontSize="small" />
              </IconButton>
            </Tooltip>



            <FormControl size="small" sx={{ flex: 1, minWidth: 180 }}>
              <InputLabel>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <PersonOutlineIcon sx={{ fontSize: 15 }} />
                  <span>{t("customer") || "Customer"}</span>
                </Stack>
              </InputLabel>
              <Select
                value={selectedCustomer?._id ?? "guest"}
                label={`  ${t("customer") || "Customer"}`}
                onChange={handleCustomerChange}
              >
                {allCustomerOptions.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {displayName(c)}
                    {c._id === "guest" && (
                      <Typography
                        component="span"
                        sx={{ fontSize: 11, color: "text.disabled", ml: 0.5 }}
                      >
                        ({t("walk_in") || "walk-in"})
                      </Typography>
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

         
            {orderType === "dine_in" && (
              <FormControl size="small" sx={{ flex: 1, minWidth: 180 }}>
                <InputLabel>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <TableRestaurantOutlinedIcon sx={{ fontSize: 15 }} />
                    <span>{t("table") || "Table"}</span>
                  </Stack>
                </InputLabel>
                <Select
                  value={selectedTable?._id ?? ""}
                  label={`  ${t("table") || "Table"}`}
                  onChange={handleTableChange}
                >
                  <MenuItem value="">
                    <Typography sx={{ color: "text.disabled", fontSize: 13 }}>
                      — {t("select_table") || "Select table"} —
                    </Typography>
                  </MenuItem>
                  {activeTables.map((tbl) => (
                    <MenuItem key={tbl._id} value={tbl._id}>
                      <Stack direction="row" justifyContent="space-between" width="100%">
                        <span>{tbl.number} — {tbl.name}</span>
                        <Typography sx={{ fontSize: 11, color: "text.disabled", ml: 2 }}>
                          {tbl.capacity} seats
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </Box>

        <Divider className="section-divider" />

     
        <Box className="cart-items-container">
          {cart.length === 0 ? (
            <Typography className="empty-cart-message">{t("cart_empty")}</Typography>
          ) : (
            cart.map((item) => (
              <Paper key={item.id} className="cart-item">
                <img
                  src={item.img || "/placeholder-food.jpg"}
                  className="cart-item-image"
                  alt={item.name}
                />
                <Stack direction="column" className="cart-item-details">
                  <Typography className="cart-item-name">{item.name}</Typography>
                  <Typography className="cart-item-price">
                    {item.price.toLocaleString()}$
                  </Typography>
                </Stack>
                <Box className="cart-item-spacer" />
                <Typography className="cart-item-total">
                  {t("total_price")}: {(item.qty * item.price).toLocaleString()}$
                </Typography>
                <Box className="quantity-controls">
                  <IconButton
                    size="small"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="qty-button"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <TextField
                    value={item.qty}
                    onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 0)}
                    size="small"
                    className="qty-input"
                    inputProps={{ min: 1, style: { textAlign: "center" } }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="qty-button"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box className="cart-item-actions">
                  <IconButton onClick={() => removeFromCart(item.id)} className="delete-button">
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </Paper>
            ))
          )}
        </Box>

        <Divider className="section-divider" />
 
        <Box className="order-summary">
          <Box className="summary-row">
            <Typography className="summary-label">{t("subtotal")}</Typography>
            <Typography className="summary-value">{subtotal.toLocaleString()}$</Typography>
          </Box>
          <Box className="summary-row">
            <Typography className="summary-label">{t("tax")} (10%)</Typography>
            <Typography className="summary-value">{tax.toLocaleString()}$</Typography>
          </Box>
          <Box className="summary-row">
            <Typography className="summary-label">{t("discount")}</Typography>
            <Typography className="summary-value">0$</Typography>
          </Box>
          <Divider />
          <Box className="total-row">
            <Typography className="total-label">{t("total_price")}</Typography>
            <Typography className="total-value">{total.toLocaleString()}$</Typography>
          </Box>
        </Box>

       
        <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 1.5, pb: 1.5 }}>
          <Button
            fullWidth
            variant="contained"
            size="medium"
            disabled={cart.length === 0 || creating}
            className="pay-button"
            sx={{ bgcolor: "warning.main", "&:hover": { bgcolor: "warning.dark" } }}
            onClick={onStopInvoice}
          >
            {t("stop_invoice")}
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="medium"
            onClick={onPayNow}
            disabled={cart.length === 0 || creating}
            className="pay-button"
          >
            {t("pay_now")} {total.toLocaleString()}$
          </Button>
        </Stack>
      </Box>


      <CustomerForm
        open={openCustomerForm}
        onClose={() => setOpenCustomerForm(false)}
        dialogTitle="Create"
        t={t}
        setRefetch={handleCustomerCreated}

      />
    </Box>
  );
};

export default CartPanel;
