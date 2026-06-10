import { useMutation } from "@apollo/client/react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import { REFUND_SALE, UPDATE_SALE } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;
const getProductName = (item) =>
  item?.name || item?.product?.nameEn || item?.product?.nameKh || "-";

function TotalsBox({ sale, shipping = 0, t }) {
  const orderTax = Number(sale?.tax || 0);
  const discount = Number(sale?.discount || 0);
  const total = Number(sale?.total || 0) + Number(shipping || 0);

  return (
    <Box sx={{ width: { xs: "100%", md: 520 }, border: "1px solid", borderColor: "divider", borderRadius: 1, ml: "auto" }}>
      {[
        [(t("order_tax")), orderTax],
        [(t("discount")), discount],
        [(t("shipping")), shipping],
        [(t("grand_total")), total],
      ].map(([label, value]) => (
        <Stack key={label} direction="row" justifyContent="space-between" sx={{ px: 2, py: 1.25, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}>
          <Typography color="text.secondary">{label}</Typography>
          <Typography>{formatMoney(value)}</Typography>
        </Stack>
      ))}
    </Box>
  );
}

export default function SaleReturnForm({ open, mode, sale, invoices, onClose, onDone, t }) {
  const { setAlert } = useAuth();
  const [selectedSaleId, setSelectedSaleId] = useState("");
  const [formValues, setFormValues] = useState({
    customerName: "",
    date: "",
    reference: "",
    tax: 0,
    discount: 0,
    shipping: 0,
    status: "refunded",
  });
  const [loading, setLoading] = useState(false);
  const readOnly = mode === "view";

  const selectedSale = useMemo(
    () => sale || invoices.find((item) => item._id === selectedSaleId) || null,
    [invoices, sale, selectedSaleId]
  );

  useEffect(() => {
    if (!open) return;
    const current = sale || null;
    setSelectedSaleId(current?._id || "");
    setFormValues({
      customerName: current?.customerName || "",
      date: current?.createdAt ? dayjs(current.createdAt).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
      reference: current?.saleNumber || "",
      tax: current?.tax || 0,
      discount: current?.discount || 0,
      shipping: 0,
      status: current?.status || "refunded",
    });
  }, [open, sale]);

  useEffect(() => {
    if (mode !== "create" || !selectedSale) return;
    setFormValues({
      customerName: selectedSale.customerName || "",
      date: selectedSale.createdAt ? dayjs(selectedSale.createdAt).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
      reference: selectedSale.saleNumber || "",
      tax: selectedSale.tax || 0,
      discount: selectedSale.discount || 0,
      shipping: 0,
      status: "refunded",
    });
  }, [mode, selectedSale]);

  const [refundSale] = useMutation(REFUND_SALE, {
    onCompleted: ({ refundSale }) => {
      setLoading(false);
      if (refundSale?.isSuccess) {
        setAlert(true, "success", refundSale.message);
        onDone();
      } else {
        setAlert(true, "error", refundSale.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  const [updateSale] = useMutation(UPDATE_SALE, {
    onCompleted: ({ updateSale }) => {
      setLoading(false);
      if (updateSale?.isSuccess) {
        setAlert(true, "success", updateSale.message);
        onDone();
      } else {
        setAlert(true, "error", updateSale.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  const handleSubmit = () => {
    if (readOnly) return;

    if (mode === "create") {
      if (!selectedSaleId) {
        setAlert(true, "error", {
          messageEn: "Please select an invoice",
          messageKh: "Please select an invoice",
        });
        return;
      }
      setLoading(true);
      refundSale({ variables: { id: selectedSaleId, reason: "Sale return" } });
      return;
    }

    if (!sale?._id) return;
    setLoading(true);
    updateSale({
      variables: {
        id: sale._id,
        input: {
          customerName: formValues.customerName,
          tax: Number(formValues.tax || 0),
          discount: Number(formValues.discount || 0),
          status: formValues.status,
        },
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {mode === "create" ? t("add_sales_return") : mode === "view" ? t("view_sales_return") : t("edit_sales_return")}
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 16, top: 12 }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography mb={1}>{t("invoice")} <Typography component="span" color="error">*</Typography></Typography>
            {mode === "create" ? (
              <Autocomplete
                options={invoices}
                value={selectedSale}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                getOptionLabel={(invoice) => invoice ? `${invoice.customerName || "Walk-in Customer"} - ${invoice.saleNumber}` : ""}
                onChange={(_, invoice) => setSelectedSaleId(invoice?._id || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    placeholder="Select invoice"
                    inputProps={{ ...params.inputProps, style: { textAlign: "left" } }}
                  />
                )}
              />
            ) : (
              <TextField fullWidth size="small" value={formValues.customerName} disabled={readOnly} onChange={(event) => setFormValues((prev) => ({ ...prev, customerName: event.target.value }))} inputProps={{ style: { textAlign: "left" } }} />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography mb={1}>Date <Typography component="span" color="error">*</Typography></Typography>
            <TextField fullWidth size="small" type="date" value={formValues.date} InputLabelProps={{ shrink: true }} inputProps={{ style: { textAlign: "left" } }} disabled />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography mb={1}>Reference <Typography component="span" color="error">*</Typography></Typography>
            <TextField fullWidth size="small" value={formValues.reference} inputProps={{ style: { textAlign: "left" } }} disabled />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography mb={1}>{t("product")} <Typography component="span" color="error">*</Typography></Typography>
          <TextField fullWidth size="small" placeholder="Please type product code and select" disabled inputProps={{ style: { textAlign: "left" } }} />
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table>
            <TableHead  >
              <TableRow>
                <TableCell>{t("product")}</TableCell>
                <TableCell>{t("net_unit_price")}</TableCell>
                <TableCell>{t("stock")}</TableCell>
                <TableCell>{t("qty")}</TableCell>
                <TableCell>{t("discount")}</TableCell>
                <TableCell>{t("tax")}</TableCell>
                <TableCell>{t("subtotal")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(selectedSale?.items || []).map((item, index) => (
                <TableRow key={`${getProductName(item)}-${index}`}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      {item.product?.image && <Box component="img" src={item.product.image} alt="" sx={{ width: 34, height: 34, objectFit: "cover", borderRadius: 0.5 }} />}
                      <Typography>{getProductName(item)}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{Number(item.price || 0)}</TableCell>
                  <TableCell>{item.subProduct?.stock || 0}</TableCell>
                  <TableCell>{item.quantity || 0}</TableCell>
                  <TableCell>{Number(formValues.discount || 0)}</TableCell>
                  <TableCell>{Number(formValues.tax || 0)}</TableCell>
                  <TableCell>{formatMoney(item.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={2}>
          <TotalsBox t={t} sale={{ ...selectedSale, tax: formValues.tax, discount: formValues.discount }} shipping={formValues.shipping} />
        </Box>

        <Grid container spacing={3} mt={1}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography mb={1}>{t("order_tax")} <Typography component="span" color="error">*</Typography></Typography>
            <TextField fullWidth size="small" type="number" value={formValues.tax} disabled={readOnly} onChange={(event) => setFormValues((prev) => ({ ...prev, tax: event.target.value }))} inputProps={{ style: { textAlign: "left" } }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography mb={1}>{t("discount")} <Typography component="span" color="error">*</Typography></Typography>
            <TextField fullWidth size="small" type="number" value={formValues.discount} disabled={readOnly} onChange={(event) => setFormValues((prev) => ({ ...prev, discount: event.target.value }))} inputProps={{ style: { textAlign: "left" } }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography mb={1}>{t("shipping")} <Typography component="span" color="error">*</Typography></Typography>
            <TextField fullWidth size="small" type="number" value={formValues.shipping} disabled={readOnly} onChange={(event) => setFormValues((prev) => ({ ...prev, shipping: event.target.value }))} inputProps={{ style: { textAlign: "left" } }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography mb={1}>{t("status")} <Typography component="span" color="error">*</Typography></Typography>
            <TextField select fullWidth size="small" value={formValues.status} disabled={readOnly} onChange={(event) => setFormValues((prev) => ({ ...prev, status: event.target.value }))} sx={{ "& .MuiSelect-select": { textAlign: "left" } }}>
              <MenuItem value="refunded">{t("refunded")}</MenuItem>
              <MenuItem value="completed">{t("completed")}</MenuItem>
              <MenuItem value="pending">{t("pending")}</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, width: "100%" }}>
        {!readOnly && (
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || (mode === "create" && !selectedSaleId)}
          >
            {mode === "create" ? t("create") : t("update")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
