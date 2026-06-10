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

import { CREATE_INCOME, DELETE_INCOME, UPDATE_INCOME } from "../../graphql/mutation";
import { GET_ALL_SHOP, GET_INCOMES_WITH_PAGINATION } from "../../graphql/queries";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import ReusableForm from "../Components/include/useForm";
import UseDeleteForm from "../Components/include/useDeleteForm";
import EmptyData from "../include/EmptyData";
import FooterPagination from "../include/FooterPagination";
import CircularIndeterminate from "../include/Loading";

const incomeTypes = ["sales", "other"];

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;
const formatDate = (value) => (value ? dayjs(value).format("DD MMM YYYY") : "-");
const filterFieldSx = {
  "& .MuiInputBase-input": { textAlign: "left" },
  "& .MuiSelect-select": { textAlign: "left" },
};

function IncomeForm({ open, onClose, incomeData, setRefetch, t }) {
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
    type: "other",
    source: "",
    amount: "",
    description: "",
    date: dayjs().toISOString(),
  });

  useEffect(() => {
    if (incomeData) {
      setFormValues({
        shopId: incomeData.shopId?._id || incomeData.shopId || "",
        type: incomeData.type || "other",
        source: incomeData.source || "",
        amount: incomeData.amount ?? "",
        description: incomeData.description || "",
        date: incomeData.date || dayjs().toISOString(),
      });
      return;
    }

    setFormValues({
      shopId: shops[0]?._id || user?.shopIds?.[0]?._id || user?.shopIds?.[0] || "",
      type: "other",
      source: "",
      amount: "",
      description: "",
      date: dayjs().toISOString(),
    });
  }, [incomeData, shops, user]);

  const [createIncome] = useMutation(CREATE_INCOME, {
    onCompleted: ({ createIncome }) => {
      setLoading(false);
      if (createIncome?.isSuccess) {
        setAlert(true, "success", createIncome.message);
        onClose();
        setRefetch();
      } else {
        setAlert(true, "error", createIncome.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  const [updateIncome] = useMutation(UPDATE_INCOME, {
    onCompleted: ({ updateIncome }) => {
      setLoading(false);
      if (updateIncome?.isSuccess) {
        setAlert(true, "success", updateIncome.message);
        onClose();
        setRefetch();
      } else {
        setAlert(true, "error", updateIncome.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  const validationSchema = Yup.object({
    shopId: Yup.string().required(t("require")),
    type: Yup.string().required(t("require")),
    source: Yup.string().required(t("require")),
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

    if (incomeData) {
      updateIncome({ variables: { id: incomeData._id, input } });
    } else {
      createIncome({ variables: { input } });
    }
  };

  return (
    <ReusableForm
      open={open}
      onClose={onClose}
      dialogTitle={incomeData ? t("update") || "Update" : t("create") || "Create"}
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
              name: "type",
              label: t("type") || "Type",
              type: "select",
              grid: { xs: 12, md: 6 },
              options: incomeTypes.map((value) => ({ value, label: t(value) || value })),
            },
            { name: "source", label: t("source") || "Source", grid: { xs: 12, md: 6 } },
            { name: "amount", label: t("amount") || "Amount", grid: { xs: 12, md: 6 } },
            { name: "date", label: t("date") || "Date", type: "date", grid: { xs: 12, md: 6 } },
            { name: "description", label: t("description") || "Description", rows: 2, grid: { xs: 12 } },
          ],
        },
      ]}
    />
  );
}

function IncomeAction({ incomeData, setRefetch, onEdit }) {
  const { setAlert } = useAuth();
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deleteIncome] = useMutation(DELETE_INCOME, {
    onCompleted: ({ deleteIncome }) => {
      setLoading(false);
      if (deleteIncome?.isSuccess) {
        setOpenDelete(false);
        setAlert(true, "success", deleteIncome.message);
        setRefetch();
      } else {
        setAlert(true, "error", deleteIncome.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  const handleDelete = () => {
    setLoading(true);
    deleteIncome({ variables: { id: incomeData._id } });
  };

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <IconButton onClick={() => onEdit(incomeData)}>
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

export default function Income() {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [openForm, setOpenForm] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("all");

  const variables = useMemo(
    () => ({
      shopId: null,
      type: type === "all" ? null : type,
      page,
      limit,
      pagination: true,
      keyword,
    }),
    [keyword, limit, page, type]
  );

  const { data, refetch, loading } = useQuery(GET_INCOMES_WITH_PAGINATION, { variables });
  const incomes = data?.getIncomesWithPagination?.data || [];
  const paginator = data?.getIncomesWithPagination?.paginator || {};

  const handleCreate = () => {
    setSelectedIncome(null);
    setOpenForm(true);
  };

  const handleEdit = (income) => {
    setSelectedIncome(income);
    setOpenForm(true);
  };

  const handleClose = () => {
    setSelectedIncome(null);
    setOpenForm(false);
  };

  return (
    <Box>
      <Breadcrumbs separator="/">
        <Typography component={RouterLink} to="/" sx={{ textDecoration: "none", borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}>
          {t("income_report") || "Income"}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" }, flexDirection: { xs: "column", md: "row" }, gap: 2 }} mt={5}>
        <Grid container spacing={2} alignItems="center" sx={{ flex: 1 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography textAlign={'left'} variant="body2" fontWeight={500} mb={0.5}>{t("search")}</Typography>
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
            <Typography textAlign={'left'} variant="body2" fontWeight={500} mb={0.5}>{t("type") || "Type"}</Typography>
            <TextField
              select
              size="small"
              fullWidth
              sx={filterFieldSx}
              value={type}
              SelectProps={{ sx: { textAlign: "left" } }}
              onChange={(event) => { setType(event.target.value); setPage(1); }}
            >
              <MenuItem value="all">{t("all")}</MenuItem>
              {incomeTypes.map((value) => <MenuItem key={value} value={value}>{t(value) || value}</MenuItem>)}
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
              <TableCell>{t("type") || "Type"}</TableCell>
              <TableCell>{t("source") || "Source"}</TableCell>
              <TableCell>{t("amount") || "Amount"}</TableCell>
              <TableCell>{t("date") || "Date"}</TableCell>
              <TableCell>{t("description") || "Description"}</TableCell>
              <TableCell align="center">{t("action")}</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <CircularIndeterminate />
          ) : incomes.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {incomes.map((row, index) => (
                <TableRow key={row._id} className="table-row">
                  <TableCell>{(paginator.slNo || 1) + index}</TableCell>
                  <TableCell>{row.shopId?.nameEn || row.shopId?.nameKh || "-"}</TableCell>
                  <TableCell>{t(row.type) || row.type}</TableCell>
                  <TableCell>{row.source || "-"}</TableCell>
                  <TableCell>{formatMoney(row.amount)}</TableCell>
                  <TableCell>{formatDate(row.date)}</TableCell>
                  <TableCell>{row.description || "-"}</TableCell>
                  <TableCell align="center">
                    <IncomeAction incomeData={row} setRefetch={refetch} onEdit={handleEdit} />
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

      <IncomeForm open={openForm} onClose={handleClose} incomeData={selectedIncome} setRefetch={refetch} t={t} />
    </Box>
  );
}
