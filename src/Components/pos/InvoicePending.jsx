import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Divider,
  IconButton,
  Stack,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Paper,
  Avatar,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { X, Clock, ShoppingBag, CreditCard, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuth } from "../../Context/AuthContext";
import { GET_SALES } from "../../../graphql/queries";
import { UPDATE_SALE_STATUS } from "../../../graphql/mutation";
import { AttachMoney, QrCode } from "@mui/icons-material";

const InvoicePending = ({ open, onClose, t, shopId, onLoadToCart }) => {
  const { language, setAlert } = useAuth();
  const [selectedSale, setSelectedSale] = useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_SALES, {
    variables: {
      shopId: shopId,
      status: "pending",
      pagination: false,
      limit: 50
    },
    skip: !open || !shopId,
  });

  const [updateSaleStatus, { loading: updating }] = useMutation(UPDATE_SALE_STATUS, {
    onCompleted: (data) => {
      if (data?.updateSaleStatus?.isSuccess) {
        setAlert(true, "success", data.updateSaleStatus.messag);
        setOpenPaymentDialog(false);
        setSelectedSale(null);
        refetch();
      } else {
        setAlert(true, "error", data?.updateSaleStatus?.message );
      }
      setCreating(false);
    },
    onError: (error) => {
      console.error("Update sale error:", error);
      setAlert(true, "error", error.message);
      setCreating(false);
    },
  });

  const sales = data?.getSales?.data || [];

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const handleContinuePayment = (sale) => {
    setSelectedSale(sale);
    setAmountPaid(sale.total?.toFixed(2) || "0");
    setOpenPaymentDialog(true);
  };

 
  const getLocalizedName = (obj) =>
    language === "kh"
      ? obj?.nameKh || obj?.nameKhmer || obj?.nameEn || obj?.nameEnglish || ""
      : obj?.nameEn || obj?.nameEnglish || obj?.nameKh || obj?.nameKhmer || "";

  const getItemDisplayName = (item) => {
    const subProduct = item.subProduct || item.subProductId;
    const product = item.product;
    if (subProduct && typeof subProduct === 'object') {
      const productName = getLocalizedName(subProduct.parentProductId) || getLocalizedName(product) || item.name;
      const unitName = getLocalizedName(subProduct.unitId);
      return unitName ? `${productName} (${unitName})` : productName;
    }
    if (product && typeof product === 'object') {
      return getLocalizedName(product);
    }
    return item.name;
  };

 
  const getItemImage = (item) => {
    const subProduct = item.subProduct || item.subProductId;
    const product = item.product;
    if (subProduct && typeof subProduct === 'object' && subProduct.productImg) {
      return subProduct.productImg;
    }
    if (product && typeof product === 'object' && product.image) {
      return product.image;
    }
 
    return null;
  };

 
  const handleLoadToCart = (sale) => {
    if (onLoadToCart) {
      const cartItems = sale.items.map(item => {
        const subProduct = item.subProduct || item.subProductId;  
        const product = item.product;
        const displayName = getItemDisplayName(item);
        const displayNameEn = subProduct?.unitId?.nameEn ? `${subProduct?.parentProductId?.nameEn || product?.nameEn || item.name} (${subProduct.unitId.nameEn})` : product?.nameEn || item.name;
        const displayNameKh = subProduct?.unitId?.nameKh ? `${subProduct?.parentProductId?.nameKh || product?.nameKh || item.name} (${subProduct.unitId.nameKh})` : product?.nameKh || item.name;
        const imageUrl = getItemImage(item);

        return {
          id: subProduct?._id || product?._id || item.subProductId, 
          subProductId: subProduct?._id || item.subProductId,  
          productId: product?._id,
          name: displayName,
          nameEn: displayNameEn,
          nameKh: displayNameKh,
          price: item.price,
          qty: item.quantity,
          img: imageUrl,
          variant: getLocalizedName(subProduct?.unitId) || subProduct?.productDes || "Original",
        };
      });

      onLoadToCart({
        cartItems,
        total: sale.total || 0,
        customerName: sale.customerName,
        tableNumber: sale.tableNumber,
        orderType: sale.orderType
      });
      onClose();
    }
  };

  const handleCompletePayment = async () => {
    if (!selectedSale) return;

    const total = selectedSale.total || 0;
    const paid = parseFloat(amountPaid) || 0;

    if (paid < total) {
      setAlert(true, "error", language === "kh" ? "ទឹកប្រាក់មិនគ្រប់គ្រាន់" : "Insufficient amount");
      return;
    }
    setCreating(true);
    try {
      await updateSaleStatus({
        variables: {
          id: selectedSale._id,
          status: "completed",
          paymentInfo: {
            method: paymentMethod,
            amountPaid: paid,
            change: Math.max(0, paid - total)
          }
        }
      });
    } catch (error) {
      console.error("Payment error:", error);
      setCreating(false);
    }
  };

  const handleDeletePending = (sale) => {
    setSaleToDelete(sale);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!saleToDelete) return;

 
    
    setAlert(true, "info", language === "kh" ? "លុបវិក័យប័ត្របណ្ដោះអាសន្ន" : "Delete pending invoice");
    setDeleteConfirmOpen(false);
    setSaleToDelete(null);
    refetch();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "kh" ? 'km-KH' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 600 } } }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack sx={{ p: 2 }} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Typography variant="h6">{t(`pending_invoices`)}</Typography>
            <IconButton onClick={onClose}>
              <X color="red" />
            </IconButton>
          </Stack>
          <Divider />

          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {loading ? (
              <LinearProgress />
            ) : error ? (
              <Typography color="error" align="center">
                {t(`error_fetching_data`)}
              </Typography>
            ) : sales.length === 0 ? (
              <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                {t(`no_pending_invoices`)}
              </Typography>
            ) : (
              <Stack spacing={2}>
                {sales.map((sale) => (
                  <Card key={sale._id} variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              #{sale.saleNumber}
                            </Typography>
                            <Chip
                              icon={<Clock size={14} />}
                              label={t("pending")}
                              color="warning"
                              size="small"
                              sx={{ fontWeight: 'bold' }}
                            />
                          </Stack>

                          <Typography variant="body2" color="text.secondary">
                            {formatDate(sale.createdAt)}
                          </Typography>

                          <Stack direction="row" spacing={2} mt={1}>
                            <Typography variant="body2">
                              {sale.items?.length || 0} {t(`items`)}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {t(`total_price`)}: ${sale.total?.toFixed(2) || "0.00"}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1} mt={2}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingBag size={16} />}
                          onClick={() => handleLoadToCart(sale)}
                          sx={{ flex: 1 }}
                        >
                          {t(`load_to_cart`)}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CreditCard size={16} />}
                          onClick={() => handleContinuePayment(sale)}
                          sx={{ flex: 1 }}
                        >
                          {t(`continue_payment`)}
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePending(sale)}
                          sx={{ border: '1px solid', borderColor: 'error.main' }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Stack>

                      {sale.items?.length > 0 && (
                        <Box mt={2} pt={2} borderTop="1px solid #eee">
                          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                            {t(`items`)}:
                          </Typography>
                          <Stack spacing={0.5}>
                            {sale.items.slice(0, 2).map((item, index) => (
                              <Typography key={index} variant="body2">
                                • {getItemDisplayName(item)} × {item.quantity}
                              </Typography>
                            ))}
                            {sale.items.length > 2 && (
                              <Typography variant="caption" color="text.secondary">
                                + {sale.items.length - 2} {language === "kh" ? "ទំនិញទៀត" : "more items"}
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Drawer>

      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {language === "kh" ? "បញ្ចប់ការទូទាត់" : "Complete Payment"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedSale && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                {language === "kh" ? "លេខវិក័យប័ត្រ" : "Invoice Number"}: <strong>{selectedSale.saleNumber}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                {language === "kh" ? "តម្លៃសរុប" : "Total Amount"}: <strong>${selectedSale.total?.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedSale.items?.length || 0} {language === "kh" ? "ទំនិញ" : "items"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                {language === "kh" ? "ជ្រើសរើសវិធីសាស្រ្តទូទាត់" : "Select Payment Method"}
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <Stack spacing={2}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        borderColor: paymentMethod === "cash" ? "primary.main" : "divider",
                        bgcolor: paymentMethod === "cash" ? "primary.light" : "background.paper",
                      }}
                      onClick={() => setPaymentMethod("cash")}
                    >
                      <FormControlLabel
                        value="cash"
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: "success.main" }}>
                              <AttachMoney />
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold">Cash</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Pay with cash
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </Paper>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        borderColor: paymentMethod === "card" ? "primary.main" : "divider",
                        bgcolor: paymentMethod === "card" ? "primary.light" : "background.paper",
                      }}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <FormControlLabel
                        value="card"
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: "info.main" }}>
                              <CreditCard size={20} />
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold">Card</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Credit/Debit card
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </Paper>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        borderColor: paymentMethod === "qr" ? "primary.main" : "divider",
                        bgcolor: paymentMethod === "qr" ? "primary.light" : "background.paper",
                      }}
                      onClick={() => setPaymentMethod("qr")}
                    >
                      <FormControlLabel
                        value="qr"
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: "warning.main" }}>
                              <QrCode />
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold">QR Code</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Scan QR to pay
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </Paper>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                label={language === "kh" ? "ទឹកប្រាក់ដែលទទួលបាន" : "Amount Received"}
                value={amountPaid}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    setAmountPaid(value);
                  }
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ mt: 3 }}
                error={amountPaid && parseFloat(amountPaid) < selectedSale.total}
                helperText={
                  amountPaid && parseFloat(amountPaid) < selectedSale.total
                    ? language === "kh"
                      ? "ទឹកប្រាក់មិនគ្រប់គ្រាន់"
                      : "Insufficient amount"
                    : ""
                }
              />

              {amountPaid && !isNaN(amountPaid) && parseFloat(amountPaid) >= selectedSale.total && (
                <Paper sx={{ p: 2, mt: 2, bgcolor: "success.light" }}>
                  <Typography variant="body1" fontWeight="bold">
                    {language === "kh" ? "ការប្រាក់អាប់" : "Change Due"}: $
                    {Math.max(0, parseFloat(amountPaid) - selectedSale.total).toFixed(2)}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenPaymentDialog(false)}
            color="inherit"
            disabled={creating}
          >
            {language === "kh" ? "បោះបង់" : "Cancel"}
          </Button>
          <Button
            onClick={handleCompletePayment}
            variant="contained"
            disabled={creating || !amountPaid || parseFloat(amountPaid) < selectedSale?.total}
          >
            {creating
              ? language === "kh" ? "កំពុងទូទាត់..." : "Processing..."
              : language === "kh" ? "បញ្ជាក់ការទូទាត់" : "Confirm Payment"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {language === "kh" ? "លុបវិក័យប័ត្របណ្ដោះអាសន្ន" : "Delete Pending Invoice"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            {language === "kh"
              ? "តើអ្នកពិតជាចង់លុបវិក័យប័ត្រនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។"
              : "Are you sure you want to delete this pending invoice? This action cannot be undone."}
          </Typography>
          {saleToDelete && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              #{saleToDelete.saleNumber} - ${saleToDelete.total?.toFixed(2)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            color="inherit"
          >
            {language === "kh" ? "បោះបង់" : "Cancel"}
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
          >
            {language === "kh" ? "លុប" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InvoicePending;
