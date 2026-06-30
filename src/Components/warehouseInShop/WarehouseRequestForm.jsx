import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@apollo/client/react";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import { CREATE_WAREHOUSE_REQUEST } from "../../../graphql/mutation";
import useGetProductWarehouseInShopWithPagination from "../hook/useGetProductWarehouseInShopWithPagination";
import { useAuth } from "../../Context/AuthContext";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

const emptyItem = {
  subProductId: "",
  requestedQty: "",
};

export default function WarehouseRequestForm({
  open,
  onClose,
  t,
  language,
  shopId,
  setRefetch,
}) {
  const { setAlert } = useAuth();
  const { producteWarehouseInShop, loading: productLoading } =
    useGetProductWarehouseInShopWithPagination({
      shopId,
      page: 1,
      limit: 100,
      pagination: false,
      keyword: "",
    });

  const [createWarehouseRequest, { loading }] = useMutation(
    CREATE_WAREHOUSE_REQUEST,
    {
      onCompleted: ({ createWarehouseRequest }) => {
        if (createWarehouseRequest?.isSuccess) {
          setAlert(true, "success", createWarehouseRequest.message);
          setRefetch();
          onClose();
        } else {
          setAlert(true, "error", createWarehouseRequest.message);
        }
      },
      onError: (error) => {
        setAlert(true, "error", error.message);
      },
    },
  );

  const formik = useFormik({
    initialValues: {
      remark: "",
      dateWantGetProduct: null,
      items: [emptyItem],
    },
    validationSchema: Yup.object({
      items: Yup.array().of(
        Yup.object({
          subProductId: Yup.string().required(t("require")),
          requestedQty: Yup.number().min(1).required(t("require")),
        }),
      ),
    }),
    onSubmit: (values) => {
      createWarehouseRequest({
        variables: {
          input: {
            toShopId: shopId,
            remark: values.remark,
            dateWantGetProduct: values.dateWantGetProduct
              ? values.dateWantGetProduct.toISOString()
              : null,
            items: values.items.map((item) => ({
              subProductId: item.subProductId,
              requestedQty: Number(item.requestedQty),
            })),
          },
        },
      });
    },
  });

  const { values, errors, touched, handleSubmit, setValues } = formik;

  const addItem = () => {
    setValues({ ...values, items: [...values.items, emptyItem] });
  };

  const deleteItem = (index) => {
    if (values.items.length === 1) return;
    setValues({
      ...values,
      items: values.items.filter((_, itemIndex) => itemIndex !== index),
    });
  };

  const updateItem = (index, field, value) => {
    const items = [...values.items];
    items[index] = { ...items[index], [field]: value };
    setValues({ ...values, items });
  };

  const getSelectedProduct = (subProductId) =>
    producteWarehouseInShop.find((product) => product.subProduct?._id === subProductId);

  const getItemPrice = (subProductId) =>
    Number(getSelectedProduct(subProductId)?.subProduct?.costPrice || 0);

  const requestTotal = values.items.reduce(
    (sum, item) => sum + getItemPrice(item.subProductId) * Number(item.requestedQty || 0),
    0,
  );

  return (
    <BootstrapDialog open={open} fullWidth maxWidth="md">
      <DialogTitle>
        {t("request_to_warehouse")}
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t("remark")}</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={values.remark}
                  onChange={(e) => setValues({ ...values, remark: e.target.value })}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t("date_want_get_product")}</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    format="dd/MM/yyyy"
                    value={values.dateWantGetProduct}
                    onChange={(newValue) =>
                      setValues({ ...values, dateWantGetProduct: newValue })
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography>{t("product_list")}</Typography>
                  <IconButton onClick={addItem}>
                    <AddBoxOutlinedIcon />
                  </IconButton>
                </Stack>
              </Grid>

              {values.items.map((item, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Typography>{t("product")}</Typography>
                    <Autocomplete
                      options={producteWarehouseInShop}
                      loading={productLoading}
                      value={
                        producteWarehouseInShop.find(
                          (product) => product.subProduct?._id === item.subProductId,
                        ) || null
                      }
                      getOptionLabel={(product) => {
                        if (!product) return "";
                        const name =
                          language === "kh"
                            ? product?.subProduct?.parentProductId?.nameKh
                            : product?.subProduct?.parentProductId?.nameEn;
                        const unit =
                          language === "kh"
                            ? product?.subProduct?.unitId?.nameKh
                            : product?.subProduct?.unitId?.nameEn;
                        return `${name || "-"} (${unit || "-"}) - ${t("stock")}: ${product.stock || 0}`;
                      }}
                      onChange={(_, selected) =>
                        updateItem(index, "subProductId", selected?.subProduct?._id || "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          error={Boolean(touched.items?.[index]?.subProductId && errors.items?.[index]?.subProductId)}
                          helperText={touched.items?.[index]?.subProductId && errors.items?.[index]?.subProductId}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <Typography>{t("quantity")}</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.requestedQty}
                      onChange={(e) => updateItem(index, "requestedQty", e.target.value)}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <Typography>{t("price")}</Typography>
                    <TextField
                      fullWidth
                      disabled
                      size="small"
                      value={`$${getItemPrice(item.subProductId).toFixed(2)}`}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <Typography>{t("total_price")}</Typography>
                    <TextField
                      fullWidth
                      disabled
                      size="small"
                      value={`$${(
                        getItemPrice(item.subProductId) * Number(item.requestedQty || 0)
                      ).toFixed(2)}`}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 1 }} sx={{ textAlign: "end" }}>
                    <Typography>{t("delete")}</Typography>
                    <IconButton onClick={() => deleteItem(index)}>
                      <X color="red" />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Grid size={{ xs: 12 }}>
                <Box display="flex" justifyContent="flex-end">
                  <Typography fontWeight={600}>
                    {t("total_all_products")}: ${requestTotal.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button fullWidth type="submit" variant="contained" disabled={loading}>
              {loading ? t("processing...") : t("create")}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </BootstrapDialog>
  );
}
