import { useQuery } from "@apollo/client/react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
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
import dayjs from "dayjs";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { GET_SALES } from "../../graphql/queries";
import SaleReturnAction from "../Components/saleReturn/SaleReturnAction";
import SaleReturnForm from "../Components/saleReturn/SaleReturnForm";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import FooterPagination from "../include/FooterPagination";
import CircularIndeterminate from "../include/Loading";
import "../Styles/TableStyle.scss";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;
const formatDate = (value) => (value ? dayjs(value).format("DD MMM YYYY") : "-");
const getPaymentStatus = (row) => {
  const total = Number(row?.total || 0);
  const paid = Number(row?.amountPaid || 0);
  const due = Math.max(total - paid, 0);

  if (due <= 0 && total > 0) return { label: "Paid", color: "success" };
  if (paid > 0) return { label: "Partial", color: "warning" };
  return { label: "Unpaid", color: "error" };
};
const paymentStatusValue = (row) => getPaymentStatus(row).label.toLowerCase();

export default function SaleReturn() {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("refunded");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);

  const { data, loading, refetch } = useQuery(GET_SALES, {
    variables: {
      status: statusFilter === "all" ? null : statusFilter,
      page,
      limit,
      pagination: true,
      keyword,
      startDate: startDate ? dayjs(startDate).startOf("day").toISOString() : null,
      endDate: endDate ? dayjs(endDate).endOf("day").toISOString() : null,
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: invoiceData, refetch: refetchInvoices } = useQuery(GET_SALES, {
    variables: { status: "completed", page: 1, limit: 100, pagination: true, keyword: "" },
    fetchPolicy: "cache-and-network",
  });

  const returns = (data?.getSales?.data || []).filter((row) => {
    const matchesCustomer = (row.customerName || "")
      .toLowerCase()
      .includes(customerFilter.trim().toLowerCase());
    const matchesPaymentStatus =
      paymentStatusFilter === "all" || paymentStatusValue(row) === paymentStatusFilter;

    return matchesCustomer && matchesPaymentStatus;
  });
  const invoices = invoiceData?.getSales?.data || [];
  const paginator = data?.getSales?.paginator || {};

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedSale(null);
  };

  const refresh = () => {
    closeDialog();
    refetch();
    refetchInvoices();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
      <Breadcrumbs separator="/">
        <Typography
          component={RouterLink}
          to="/"
          sx={{ textDecoration: "none", borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}
        >
          Sales Return
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
        mt={5}
      >
        <Grid container spacing={2} alignItems="center" sx={{ flex: 1 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography textAlign={'left'} variant="body2" fontWeight={500} mb={0.5}>
              {t("search")}
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={keyword}
              placeholder={`${t("search")}...`}
              onChange={(event) => {
                setKeyword(event.target.value);
                setPage(1);
              }}
              inputProps={{ style: { textAlign: "left" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography textAlign="left" variant="body2" fontWeight={500} mb={0.5}>
              {t("customer")}
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={customerFilter}
              placeholder={t("customer")}
              onChange={(event) => {
                setCustomerFilter(event.target.value);
                setPage(1);
              }}
              inputProps={{ style: { textAlign: "left" } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography textAlign="left" variant="body2" fontWeight={500} mb={0.5}>
              {t("status")}
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              sx={{ "& .MuiSelect-select": { textAlign: "left" } }}
            >
              <MenuItem value="refunded">{t("refunded") || "Refunded"}</MenuItem>
              <MenuItem value="completed">{t("completed") || "Completed"}</MenuItem>
              <MenuItem value="pending">{t("pending") || "Pending"}</MenuItem>
              <MenuItem value="all">{t("all") || "All"}</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography textAlign="left" variant="body2" fontWeight={500} mb={0.5}>
              Payment Status
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={paymentStatusFilter}
              onChange={(event) => {
                setPaymentStatusFilter(event.target.value);
                setPage(1);
              }}
              sx={{ "& .MuiSelect-select": { textAlign: "left" } }}
            >
              <MenuItem value="all">{t("all") || "All"}</MenuItem>
              <MenuItem value="paid">{t("paid") || "Paid"}</MenuItem>
              <MenuItem value="partial">Partial</MenuItem>
              <MenuItem value="unpaid">Unpaid</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography textAlign="left" variant="body2" fontWeight={500} mb={0.5}>
              {t("date") || "Date"}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <DatePicker
                format="dd/MM/yyyy"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  setPage(1);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    placeholder: t("start_date") || "Start date",
                  },
                }}
              />
              
              <DatePicker
                format="dd/MM/yyyy"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                  setPage(1);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    placeholder: t("end_date") || "End date",
                  },
                }}
              />
            </Stack>
          </Grid>
        </Grid>
        <Button sx={{mt:3}} variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setDialogMode("create")}>
          {t("create")}
        </Button>
      </Box>

      <TableContainer className="table-container" sx={{ mt: 2 }}>
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>{t("invoice_num") || "Invoice Number"}</TableCell>
              <TableCell>{t("date")}</TableCell>
              <TableCell>{t("customer")}</TableCell>
              <TableCell>{t("status")}</TableCell>
              <TableCell>{t("total") || "Total"}</TableCell>
              <TableCell>{t("paid") || "Paid"}</TableCell>
              <TableCell>{t("due") || "Due"}</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell align="center">{t("action")}</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <CircularIndeterminate cols={9} />
          ) : returns.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {returns.map((row) => {
                const due = Math.max(Number(row.total || 0) - Number(row.amountPaid || 0), 0);
                const paymentStatus = getPaymentStatus(row);

                return (
                  <TableRow key={row._id} className="table-row">
                    <TableCell>{row.saleNumber || "-"}</TableCell>
                    <TableCell>{formatDate(row.createdAt)}</TableCell>
                    <TableCell>{row.customerName || "-"}</TableCell>
                    <TableCell>
                      <Chip size="small" label={row.status} color="error" variant="outlined" />
                    </TableCell>
                    <TableCell>{formatMoney(row.total)}</TableCell>
                    <TableCell>{formatMoney(row.amountPaid)}</TableCell>
                    <TableCell>{formatMoney(due)}</TableCell>
                    <TableCell>
                      <Chip size="small" label={paymentStatus.label} color={paymentStatus.color} variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <SaleReturnAction
                        row={row}
                        onView={(sale) => {
                          setSelectedSale(sale);
                          setDialogMode("view");
                        }}
                        onEdit={(sale) => {
                          setSelectedSale(sale);
                          setDialogMode("edit");
                        }}
                        onDeleted={refresh}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
        <FooterPagination
          page={page}
          limit={limit}
          setPage={setPage}
          handleLimit={(event) => {
            setLimit(parseInt(event.target.value, 10));
            setPage(1);
          }}
          totalDocs={paginator.totalDocs}
          totalPages={paginator.totalPages}
        />
      </Stack>

      <SaleReturnForm
        open={Boolean(dialogMode)}
        mode={dialogMode}
        sale={selectedSale}
        invoices={invoices}
        onClose={closeDialog}
        onDone={refresh}
        t={t}
        language={language}
      />
      </Box>
    </LocalizationProvider>
  );
}
