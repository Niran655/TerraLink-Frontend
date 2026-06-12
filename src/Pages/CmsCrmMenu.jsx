import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
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
  Typography,
  useTheme,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client/react";
import { Edit3, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

import { GET_ALL_SHOP, GET_BUSINESS_MODULE_RECORDS } from "../../graphql/queries";
import {
  CREATE_BUSINESS_MODULE_RECORD,
  DELETE_BUSINESS_MODULE_RECORD,
  UPDATE_BUSINESS_MODULE_RECORD,
} from "../../graphql/mutation";
import { useAuth } from "../Context/AuthContext";
import ReusableForm from "../Components/include/useForm";
import { findBusinessModule } from "../Menu/businessMenuData";
import { translateLauguage } from "../function/translate";
import { canAccessShop } from "../utils/tenantAccess";

const emptyForm = {
  shopId: "",
  itemType: "",
  title: "",
  description: "",
  status: "active",
  channel: "",
  url: "",
  customerName: "",
  contact: "",
  notes: "",
  tags: "",
  dueDate: "",
  active: true,
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

const toDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const parseTags = (value) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  itemType: Yup.string().required("Menu item is required"),
  status: Yup.string(),
  shopId: Yup.string().nullable(),
  description: Yup.string(),
  channel: Yup.string(),
  url: Yup.string(),
  customerName: Yup.string(),
  contact: Yup.string(),
  notes: Yup.string(),
  tags: Yup.string(),
  dueDate: Yup.string().nullable(),
  active: Yup.boolean(),
});

export default function CmsCrmMenu({ area }) {
  const theme = useTheme();
  const { user, setAlert, language } = useAuth();
  const { t } = translateLauguage(language);
  const { module } = useParams();
  const menuModule = findBusinessModule(area, module);
  const areaLabel = area === "crm" ? t("CRM") : t("Core CMS");
  const moduleKey = module || "";
  const [itemType, setItemType] = useState("");
  const [shopId, setShopId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data: shopData } = useQuery(GET_ALL_SHOP, {
    variables: { id: user?._id || "" },
    fetchPolicy: "cache-and-network",
  });

  const shops = useMemo(
    () => (shopData?.getAllShops || []).filter((shop) => canAccessShop(user, shop?._id)),
    [shopData, user]
  );

  useEffect(() => {
    if (menuModule?.items?.length) {
      setItemType(menuModule.items[0]);
    }
  }, [menuModule]);

  const {
    data,
    loading,
    refetch,
  } = useQuery(GET_BUSINESS_MODULE_RECORDS, {
    variables: {
      area,
      moduleKey,
      itemType: itemType || undefined,
      shopId: shopId || undefined,
      status: status || undefined,
      keyword: keyword || undefined,
      limit: 100,
    },
    skip: !menuModule || !itemType,
    fetchPolicy: "cache-and-network",
  });

  const records = data?.getBusinessModuleRecords || [];

  const notify = (response, key) => {
    const result = response?.[key];
    if (result?.isSuccess) {
      setAlert(true, "success", result.message);
      return true;
    }
    setAlert(true, "error", result?.message || { messageEn: t("Operation failed") });
    return false;
  };

  const [createRecord, { loading: creating }] = useMutation(CREATE_BUSINESS_MODULE_RECORD, {
    onCompleted: (response) => {
      if (notify(response, "createBusinessModuleRecord")) {
        setOpen(false);
        refetch();
      }
    },
    onError: (error) => setAlert(true, "error", { messageEn: error.message }),
  });

  const [updateRecord, { loading: updating }] = useMutation(UPDATE_BUSINESS_MODULE_RECORD, {
    onCompleted: (response) => {
      if (notify(response, "updateBusinessModuleRecord")) {
        setOpen(false);
        refetch();
      }
    },
    onError: (error) => setAlert(true, "error", { messageEn: error.message }),
  });

  const [deleteRecord] = useMutation(DELETE_BUSINESS_MODULE_RECORD, {
    onCompleted: (response) => {
      notify(response, "deleteBusinessModuleRecord");
      refetch();
    },
    onError: (error) => setAlert(true, "error", { messageEn: error.message }),
  });

  if (!menuModule) {
    return <Navigate to="/dashboard" replace />;
  }

  const ModuleIcon = menuModule.icon;
  const saving = creating || updating;

  const openCreate = () => {
    setEditingRecord(null);
    setForm({ ...emptyForm, itemType, shopId });
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setForm({
      shopId: record.shopId?._id || "",
      itemType: record.itemType || itemType,
      title: record.title || "",
      description: record.description || "",
      status: record.status || "active",
      channel: record.channel || "",
      url: record.url || "",
      customerName: record.customerName || "",
      contact: record.contact || "",
      notes: record.notes || "",
      tags: (record.tags || []).join(", "),
      dueDate: toDateInput(record.dueDate),
      active: record.active !== false,
    });
    setOpen(true);
  };

  const handleSubmit = (values) => {
    const input = {
      shopId: values.shopId || null,
      area,
      moduleKey,
      itemType: values.itemType || itemType,
      title: values.title.trim(),
      description: values.description,
      status: values.status || "active",
      channel: values.channel,
      url: values.url,
      customerName: values.customerName,
      contact: values.contact,
      notes: values.notes,
      tags: parseTags(values.tags || ""),
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
      active: values.active,
    };

    if (editingRecord) {
      updateRecord({ variables: { id: editingRecord._id, input } });
      return;
    }
    createRecord({ variables: { input } });
  };

  const formTabs = [
    {
      label: t("General"),
      fields: [
        { name: "title", label: t("title"), grid: { xs: 12, md: 6 } },
        {
          name: "itemType",
          label: t("Menu Item"),
          type: "select",
          options: menuModule.items.map((item) => ({ value: item, label: t(item) })),
          grid: { xs: 12, md: 6 },
        },
        {
          name: "shopId",
          label: t("shop"),
          type: "select",
          options: [
            { value: "", label: t("No specific shop") },
            ...shops.map((shop) => ({
              value: shop._id,
              label: shop.nameEn || shop.nameKh || t("shop"),
            })),
          ],
          grid: { xs: 12, md: 6 },
        },
        { name: "status", label: t("status"), grid: { xs: 12, md: 3 } },
        { name: "active", label: t("active"), type: "checkbox", grid: { xs: 12, md: 3 } },
        { name: "description", label: t("description"), rows: 3, grid: { xs: 12 } },
      ],
    },
    {
      label: area === "crm" ? t("customer") : t("Publishing"),
      fields: [
        { name: "customerName", label: t("Customer / Audience"), grid: { xs: 12, md: 6 } },
        { name: "contact", label: t("contact"), grid: { xs: 12, md: 6 } },
        { name: "channel", label: t("Channel"), grid: { xs: 12, md: 6 } },
        { name: "dueDate", label: t("due_date"), type: "date", grid: { xs: 12, md: 6 } },
        { name: "url", label: t("URL"), grid: { xs: 12 } },
        { name: "notes", label: t("Notes"), rows: 3, grid: { xs: 12 } },
        { name: "tags", label: t("Tags"), grid: { xs: 12 } },
      ],
    },
  ];

  return (
    <Box>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2} mb={3}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              flexShrink: 0,
            }}
          >
            <ModuleIcon size={22} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              {t(menuModule.label)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {areaLabel} {t("records and workflow tracking")}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={areaLabel} color={area === "crm" ? "success" : "primary"} variant="outlined" />
          <Button startIcon={<RefreshCcw size={17} />} variant="outlined" onClick={() => refetch()}>
            {t("refresh")}
          </Button>
          <Button startIcon={<Plus size={17} />} variant="contained" onClick={openCreate}>
            {t("new")}
          </Button>
        </Stack>
      </Stack>

      <Paper sx={{ p: 2, borderRadius: 1, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label={t("Menu Item")}
              value={itemType}
              onChange={(event) => setItemType(event.target.value)}
            >
              {menuModule.items.map((item) => (
                <MenuItem key={item} value={item}>
                  {t(item)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label={t("shop")}
              value={shopId}
              onChange={(event) => setShopId(event.target.value)}
            >
              <MenuItem value="">{t("all_shops")}</MenuItem>
              {shops.map((shop) => (
                <MenuItem key={shop._id} value={shop._id}>
                  {shop.nameEn || shop.nameKh}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              size="small"
              label={t("status")}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              placeholder="active"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              label={t("search")}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("title")}</TableCell>
              <TableCell>{t("Item Type")}</TableCell>
              <TableCell>{t("status")}</TableCell>
              <TableCell>{t("Contact / Channel")}</TableCell>
              <TableCell>{t("due_date")}</TableCell>
              <TableCell align="right">{t("action")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6}>{t("Loading records...")}</TableCell>
              </TableRow>
            )}
            {!loading && records.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Alert severity="info">{t("No records yet for")} {t(itemType)}.</Alert>
                </TableCell>
              </TableRow>
            )}
            {records.map((record) => (
              <TableRow key={record._id}>
                <TableCell>
                  <Typography fontWeight={700}>{record.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }} noWrap>
                    {record.description || record.notes || "-"}
                  </Typography>
                  {!!record.tags?.length && (
                    <Stack direction="row" spacing={0.5} mt={0.75} flexWrap="wrap">
                      {record.tags.map((tag) => (
                        <Chip key={tag} size="small" label={tag} variant="outlined" />
                      ))}
                    </Stack>
                  )}
                </TableCell>
                <TableCell>{t(record.itemType)}</TableCell>
                <TableCell>
                  <Chip size="small" label={record.status || "active"} color={record.active === false ? "default" : "success"} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{record.customerName || record.contact || "-"}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {record.channel || record.url || record.shopId?.nameEn || record.shopId?.nameKh || ""}
                  </Typography>
                </TableCell>
                <TableCell>{formatDate(record.dueDate)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEdit(record)}>
                    <Edit3 size={17} />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => deleteRecord({ variables: { id: record._id } })}>
                    <Trash2 size={17} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ReusableForm
        open={open}
        onClose={() => setOpen(false)}
        initialValues={form}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        dialogTitle={editingRecord ? t("Edit Record") : t("New Record")}
        tabs={formTabs}
        loading={saving}
        t={t}
      />
    </Box>
  );
}
