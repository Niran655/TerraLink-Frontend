import { useQuery } from "@apollo/client/react";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
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
import CloseIcon from "@mui/icons-material/Close";
import { Eye, Search } from "lucide-react";
import dayjs from "dayjs";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { GET_SALES } from "../../graphql/queries";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import FooterPagination from "../include/FooterPagination";
import CircularIndeterminate from "../include/Loading";
import "../Styles/TableStyle.scss";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;
const formatDate = (value) => (value ? dayjs(value).format("DD MMM YYYY") : "-");
const statusColor = (status) => {
  if (status === "completed") return "success";
  if (status === "pending") return "warning";
  if (status === "refunded") return "error";
  return "default";
};

function InvoiceDetail({ invoice, onClose, t }) {
  const items = invoice?.items || [];

  return (
    <Dialog open={Boolean(invoice)} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {t("invoice") || "Invoice"} {invoice?.saleNumber}
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon color="error" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" color="text.secondary">{t("customer")}</Typography>
            <Typography fontWeight={600}>{invoice?.customerName || "-"}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" color="text.secondary">{t("date") || "Date"}</Typography>
            <Typography fontWeight={600}>{formatDate(invoice?.createdAt)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" color="text.secondary">{t("status")}</Typography>
            <Chip size="small" label={invoice?.status || "-"} color={statusColor(invoice?.status)} variant="outlined" />
          </Grid>
        </Grid>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("product") || "Product"}</TableCell>
                <TableCell>{t("price") || "Price"}</TableCell>
                <TableCell>{t("quantity") || "Qty"}</TableCell>
                <TableCell>{t("subtotal") || "Subtotal"}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={`${item.name}-${index}`}>
                  <TableCell>{item.name || item.product?.nameEn || item.product?.nameKh || "-"}</TableCell>
                  <TableCell>{formatMoney(item.price)}</TableCell>
                  <TableCell>{item.quantity || 0}</TableCell>
                  <TableCell>{formatMoney(item.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack alignItems="flex-end" mt={2}>
          <Box sx={{ width: { xs: "100%", md: 360 }, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            {[
              [t("subtotal") || "Subtotal", invoice?.subtotal],
              [t("tax") || "Tax", invoice?.tax],
              [t("discount") || "Discount", invoice?.discount],
              [t("grand_total") || "Grand Total", invoice?.total],
              [t("paid") || "Paid", invoice?.amountPaid],
              [t("change") || "Change", invoice?.change],
            ].map(([label, value]) => (
              <Stack key={label} direction="row" justifyContent="space-between" sx={{ px: 2, py: 1, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}>
                <Typography color="text.secondary">{label}</Typography>
                <Typography fontWeight={600}>{formatMoney(value)}</Typography>
              </Stack>
            ))}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default function Invoice() {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const { data, loading } = useQuery(GET_SALES, {
    variables: {
      page,
      limit,
      pagination: true,
      keyword,
      status: status === "all" ? null : status,
    },
    fetchPolicy: "cache-and-network",
  });

  const invoices = data?.getSales?.data || [];
  const paginator = data?.getSales?.paginator || {};

  return (
    <Box>
      <Breadcrumbs separator="/">
        <Typography component={RouterLink} to="/" sx={{ textDecoration: "none", borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}>
          {t("period_invoice") || "Invoice"}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" }, flexDirection: { xs: "column", md: "row" }, gap: 2 }} mt={5}>
        <Grid container spacing={2} alignItems="center" sx={{ flex: 1 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography textAlign={'left'} variant="body2" fontWeight={500} mb={0.5}>{t("search")}</Typography>
            <TextField
              size="small"
              fullWidth
              value={keyword}
              placeholder={`${t("search")}...`}
              onChange={(event) => { setKeyword(event.target.value); setPage(1); }}
              inputProps={{ style: { textAlign: "left" } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography textAlign={'left'} variant="body2" fontWeight={500} mb={0.5}>{t("status")}</Typography>
            <TextField select size="small" fullWidth value={status} sx={{ "& .MuiSelect-select": { textAlign: "left" } }} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
              <MenuItem value="all">{t("all")}</MenuItem>
              <MenuItem value="completed">{t("completed") || "Completed"}</MenuItem>
              <MenuItem value="pending">{t("pending") || "Pending"}</MenuItem>
              <MenuItem value="refunded">{t("refunded") || "Refunded"}</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <TableContainer className="table-container" sx={{ mt: 2 }}>
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>{t("no")}</TableCell>
              <TableCell>{t("invoice_num") || "Invoice Number"}</TableCell>
              <TableCell>{t("customer")}</TableCell>
              <TableCell>{t("date") || "Date"}</TableCell>
              <TableCell>{t("total") || "Total"}</TableCell>
              <TableCell>{t("paid") || "Paid"}</TableCell>
              <TableCell>{t("status")}</TableCell>
              <TableCell align="center">{t("action")}</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <CircularIndeterminate cols={8} />
          ) : invoices.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {invoices.map((row, index) => (
                <TableRow key={row._id} className="table-row">
                  <TableCell>{(paginator.slNo || 1) + index}</TableCell>
                  <TableCell>{row.saleNumber}</TableCell>
                  <TableCell>{row.customerName || "-"}</TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell>{formatMoney(row.total)}</TableCell>
                  <TableCell>{formatMoney(row.amountPaid)}</TableCell>
                  <TableCell><Chip size="small" label={t(row.status)} color={statusColor(row.status)} variant="outlined" /></TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => setSelectedInvoice(row)}>
                      <Eye size={18} color="#1D4592" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
        <FooterPagination page={page} limit={limit} setPage={setPage} handleLimit={(event) => { setLimit(parseInt(event.target.value, 10)); setPage(1); }} totalDocs={paginator.totalDocs} totalPages={paginator.totalPages} />
      </Stack>

      <InvoiceDetail invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} t={t} />
    </Box>
  );
}
