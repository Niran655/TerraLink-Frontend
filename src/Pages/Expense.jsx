import { useMutation, useQuery } from "@apollo/client/react";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import {
  Box,
  Breadcrumbs,
  Button,
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
import dayjs from "dayjs";
import { Search, SquarePen, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";

import { CREATE_EXPENSE, DELETE_EXPENSE, UPDATE_EXPENSE } from "../../graphql/mutation";
import { GET_ALL_SHOP, GET_EXPENSES_WITH_PAGINATION } from "../../graphql/queries";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import FooterPagination from "../include/FooterPagination";
import CircularIndeterminate from "../include/Loading";
import ReusableForm from "../Components/include/useForm";
import UseDeleteForm from "../Components/include/useDeleteForm";

const categories = ["salaries", "rent", "utilities", "marketing", "supplies", "tax", "other"];

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;
const formatDate = (value) => (value ? dayjs(value).format("DD MMM YYYY") : "-");
const filterFieldSx = {
  "& .MuiInputBase-input": { textAlign: "left" },
  "& .MuiSelect-select": { textAlign: "left" },
};

function ExpenseForm({ open, onClose, expenseData, setRefetch, t }) {
  const { setAlert, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const { data: shopsData, loading: shopsLoading } = useQuery(GET_ALL_SHOP, {
    variables: { id: user?._id },
    skip: !user?._id,
  });

  const shops = shopsData?.getAllShops || [];
  const shopOptions = shops.map((shop) => ({
    id: shop._id,
    label: shop.nameEn || shop.nameKh || shop.code,
  }));

  const [formValues, setFormValues] = useState({
    shopId: "",
    category: "other",
    amount: "",
    description: "",
    date: dayjs().toISOString(),
  });

  useEffect(() => {
    if (expenseData) {
      setFormValues({
        shopId: expenseData.shopId?._id || expenseData.shopId || "",
        category: expenseData.category || "other",
        amount: expenseData.amount ?? "",
        description: expenseData.description || "",
        date: expenseData.date || dayjs().toISOString(),
      });
      return;
    }

    setFormValues({
      shopId: shops[0]?._id || user?.shopIds?.[0]?._id || user?.shopIds?.[0] || "",
      category: "other",
      amount: "",
      description: "",
      date: dayjs().toISOString(),
    });
  }, [expenseData, shops, user]);

  const [createExpense] = useMutation(CREATE_EXPENSE, {
    onCompleted: ({ createExpense }) => {
      setLoading(false);
      if (createExpense?.isSuccess) {
        setAlert(true, "success", createExpense.message);
        onClose();
        setRefetch();
      } else {
        setAlert(true, "error", createExpense.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  const [updateExpense] = useMutation(UPDATE_EXPENSE, {
    onCompleted: ({ updateExpense }) => {
      setLoading(false);
      if (updateExpense?.isSuccess) {
        setAlert(true, "success", updateExpense.message);
        onClose();
        setRefetch();
      } else {
        setAlert(true, "error", updateExpense.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  const validationSchema = Yup.object({
    shopId: Yup.string().required(t("require")),
    category: Yup.string().required(t("require")),
    amount: Yup.number().typeError(t("must_be_number")).min(0, t("must_be_positive")).required(t("require")),
    date: Yup.string().required(t("require")),
  });

  const handleSubmit = (values) => {
    setLoading(true);
    const input = {
      ...values,
      amount: Number(values.amount),
      date: values.date || dayjs().toISOString(),
    };

    if (expenseData) {
      updateExpense({ variables: { id: expenseData._id, input } });
    } else {
      createExpense({ variables: { input } });
    }
  };

  return (
    <ReusableForm
      open={open}
      onClose={onClose}
      dialogTitle={expenseData ? t("update") || "Update" : t("create") || "Create"}
      initialValues={formValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      loading={loading}
      t={t}
      tabs={[
        {
          fields: [
            { name: "shopId", label: t("shop"), type: "autocomplete", options: shopOptions, loading: shopsLoading, grid: { xs: 12 } },
            {
              name: "category",
              label: t("category") || "Category",
              type: "select",
              grid: { xs: 12, md: 6 },
              options: categories.map((value) => ({ value, label: t(value) || value })),
            },
            { name: "amount", label: t("amount") || "Amount", grid: { xs: 12, md: 6 } },
            { name: "date", label: t("date") || "Date", type: "date", grid: { xs: 12, md: 6 } },
            { name: "description", label: t("description") || "Description", rows: 2, grid: { xs: 12, md: 6 } },
          ],
        },
      ]}
    />
  );
}

function ExpenseAction({ expenseData, setRefetch, t, onEdit }) {
  const { setAlert } = useAuth();
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deleteExpense] = useMutation(DELETE_EXPENSE, {
    onCompleted: ({ deleteExpense }) => {
      setLoading(false);
      if (deleteExpense?.isSuccess) {
        setOpenDelete(false);
        setAlert(true, "success", deleteExpense.message);
        setRefetch();
      } else {
        setAlert(true, "error", deleteExpense.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  const handleDelete = () => {
    setLoading(true);
    deleteExpense({ variables: { id: expenseData._id } });
  };

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <IconButton onClick={() => onEdit(expenseData)}>
          <SquarePen size="18px" color="#36BBA7" />
        </IconButton>
        <IconButton onClick={() => setOpenDelete(true)}>
          <Trash size="18px" color="red" />
        </IconButton>
      </Stack>

      <UseDeleteForm open={openDelete} onClose={() => setOpenDelete(false)} handleDelete={handleDelete} loading={loading} />
    </>
  );
}

export default function Expense() {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [openForm, setOpenForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");

  const variables = useMemo(
    () => ({
      shopId: null,
      category: category === "all" ? null : category,
      page,
      limit,
      pagination: true,
      keyword,
    }),
    [category, keyword, limit, page]
  );

  const { data, refetch, loading } = useQuery(GET_EXPENSES_WITH_PAGINATION, { variables });
  const expenses = data?.getExpensesWithPagination?.data || [];
  const paginator = data?.getExpensesWithPagination?.paginator || {};

  const handleCreate = () => {
    setSelectedExpense(null);
    setOpenForm(true);
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setOpenForm(true);
  };

  const handleClose = () => {
    setSelectedExpense(null);
    setOpenForm(false);
  };

  return (
    <Box>
      <Breadcrumbs separator="/">
        <Typography component={RouterLink} to="/" sx={{ textDecoration: "none", borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}>
          {t("period_expense") || "Expense"}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" }, flexDirection: { xs: "column", md: "row" }, gap: 2 }} mt={5}>
        <Grid container spacing={2} alignItems="center" sx={{ flex: 1 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>{t("search")}</Typography>
            <TextField
              size="small"
              fullWidth
              sx={filterFieldSx}
              value={keyword}
              placeholder={`${t("search")}...`}
              onChange={(event) => {
                setKeyword(event.target.value);
                setPage(1);
              }}
              inputProps={{ style: { textAlign: "left" } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>{t("category") || "Category"}</Typography>
            <TextField
              select
              size="small"
              fullWidth
              sx={filterFieldSx}
              value={category}
              SelectProps={{ sx: { textAlign: "left" } }}
              onChange={(event) => { setCategory(event.target.value); setPage(1); }}
            >
              <MenuItem value="all">{t("all")}</MenuItem>
              {categories.map((value) => <MenuItem key={value} value={value}>{t(value) || value}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>

        <Button variant="contained" startIcon={<LibraryAddOutlinedIcon />} onClick={handleCreate}>
          {t("create")}
        </Button>
      </Box>

      <TableContainer className="table-container" sx={{ mt: 2 }}>
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>{t("no")}</TableCell>
              <TableCell>{t("shop")}</TableCell>
              <TableCell>{t("category") || "Category"}</TableCell>
              <TableCell>{t("amount") || "Amount"}</TableCell>
              <TableCell>{t("date") || "Date"}</TableCell>
              <TableCell>{t("description") || "Description"}</TableCell>
              <TableCell align="center">{t("action")}</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <CircularIndeterminate />
          ) : expenses.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {expenses.map((row, index) => (
                <TableRow key={row._id} className="table-row">
                  <TableCell>{(paginator.slNo || 1) + index}</TableCell>
                  <TableCell>{row.shopId?.nameEn || row.shopId?.nameKh || "-"}</TableCell>
                  <TableCell>{t(row.category) || row.category}</TableCell>
                  <TableCell>{formatMoney(row.amount)}</TableCell>
                  <TableCell>{formatDate(row.date)}</TableCell>
                  <TableCell>{row.description || "-"}</TableCell>
                  <TableCell align="center">
                    <ExpenseAction expenseData={row} setRefetch={refetch} t={t} onEdit={handleEdit} />
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

      <ExpenseForm open={openForm} onClose={handleClose} expenseData={selectedExpense} setRefetch={refetch} t={t} />
    </Box>
  );
}
