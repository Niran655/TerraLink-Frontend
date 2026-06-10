import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@apollo/client/react";
import { styled } from "@mui/material/styles";
import {
  Autocomplete,
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
  Box,
} from "@mui/material";
import { X } from "lucide-react";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useMemo } from "react";

import useGetAllShopAutoComplete from "../../include/includeAutoComplete";
import { CREATE_WAREHOUSE_TRANSFER } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import useGetProductWarehouseWithPagination from "../../hook/useGetProductWarehouseWithPagination";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

const emptyItem = {
  subProductId: "",
  quantity: "",
  costPrice: "",
};

export default function ProductTransferForm({
  open,
  onClose,
  t,
  language,
  setRefetch,
  defaultToShopIds = [],
  lockToShop = false,
}) {
  const { options: shopOptions, loading: shopLoading, refetch } =useGetAllShopAutoComplete();

  const { setAlert } = useAuth();

  const { productWarehouseWithPagination, loading: productLoading } =
    useGetProductWarehouseWithPagination({
      page: 1,
      limit: 20,
      pagination: false,
    });

    console.log("productWarehouseWithPagination",productWarehouseWithPagination)

  const [createWarehouseTransfer, { loading }] = useMutation(
    CREATE_WAREHOUSE_TRANSFER,
    {
      onCompleted: ({ createWarehouseTransfer }) => {
        if (createWarehouseTransfer?.isSuccess) {
          onClose();
          setRefetch();
          refetch();
          setAlert(true, "success", createWarehouseTransfer?.message);
        } else {
          setAlert(true, "error", createWarehouseTransfer?.message);
        }
      },
      onError: () => {
        setAlert(true, "error", "Something went wrong");
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      toShopIds: defaultToShopIds,
      note: "",
      items: [emptyItem],
    },
    validationSchema: Yup.object({
      toShopIds: Yup.array().min(1, t("require")),
      items: Yup.array().of(
        Yup.object({
          subProductId: Yup.string().required(t("require")),
          quantity: Yup.number()
            .typeError(t("require"))
            .required(t("require"))
            .min(1),
          costPrice: Yup.number()
            .typeError(t("require"))
            .required(t("require"))
            .min(0),
        })
      ),
    }),
    onSubmit: (values) => {
      createWarehouseTransfer({
        variables: {
          input: {
            toShopIds: values.toShopIds,
            note: values.note,
            items: values.items.map((i) => ({
              subProductId: i.subProductId,
              quantity: Number(i.quantity),
              costPrice: Number(i.costPrice),
            })),
          },
        },
      });
    },
  });

  const { values, errors, touched, handleSubmit, setValues } = formik;


  const addItem = () => {
    setValues({
      ...values,
      items: [...values.items, emptyItem],
    });
  };

  const deleteItem = (index) => {
    if (values.items.length === 1) return;
    setValues({
      ...values,
      items: values.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...values.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setValues({ ...values, items: newItems });
  };


  const footerTotal = useMemo(() => {
    return values.items.reduce(
      (acc, i) =>
        acc + Number(i.quantity || 0) * Number(i.costPrice || 0),
      0
    );
  }, [values.items]);



  return (
    <BootstrapDialog open={open} fullWidth maxWidth="md">
      <DialogTitle>
        {t("create_transfer")}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t("to_shop")}</Typography>
                <Autocomplete
                  multiple
                  disabled={lockToShop}
                  options={shopOptions}
                  loading={shopLoading}
                  value={shopOptions.filter((o) =>
                    values.toShopIds.includes(o.value)
                  )}
                  getOptionLabel={(o) => o.label}
                  onChange={(e, selected) =>
                    setValues({
                      ...values,
                      toShopIds: selected.map((s) => s.value),
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={t("select_shop")}
                      error={Boolean(
                        touched.toShopIds && errors.toShopIds
                      )}
                      helperText={
                        touched.toShopIds && errors.toShopIds
                      }
                    />
                  )}
                />
              </Grid>


              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t("remark")}</Typography>
                <TextField
                  fullWidth
                  multiline
                  placeholder={t("remark")}
                  size="small"
                  value={values.note}
                  onChange={(e) =>
                    setValues({ ...values, note: e.target.value })
                  }
                />
              </Grid>


              <Grid size={{ xs: 12 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>{t("product_list")}</Typography>
                  <IconButton onClick={addItem}>
                    <AddBoxOutlinedIcon />
                  </IconButton>
                </Stack>
              </Grid>


              {values.items.map((item, index) => (
                <Grid container spacing={2} key={index}>
                  
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography>{t("product")}</Typography>
                    <Autocomplete
                       
                      options={productWarehouseWithPagination}
                      loading={productLoading}
                      value={
                        productWarehouseWithPagination.find(
                          (p) =>
                            p.subProduct?._id === item.subProductId
                        ) || null
                      }
                      isOptionEqualToValue={(o, v) =>
                        o.subProduct?._id === v.subProduct?._id
                      }
                      getOptionLabel={(p) => {
                        if (!p) return "";
                        const name =
                          language === "en"
                            ? p?.subProduct?.parentProductId?.nameEn || "Unnamed"
                            : p?.subProduct?.parentProductId?.nameKh || "គ្មានឈ្មោះ";
                        const unit = language === "en"
                          ? p?.subProduct?.unitId?.nameEn
                          : p?.subProduct?.unitId?.nameKh
                        return `${name} (${unit})`;
                      }}
                      onChange={(e, val) => {
                        const newItems = [...values.items];

                        newItems[index] = {
                          ...newItems[index],
                          subProductId: val?.subProduct?._id || "",
                          costPrice: val?.subProduct?.costPrice || "",
                        };

                        setValues({
                          ...values,
                          items: newItems,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"

                          placeholder={t("select_product")}
                          error={Boolean(
                            touched.toShopIds && errors.toShopIds
                          )}
                          helperText={
                            touched.toShopIds && errors.toShopIds
                          }
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <Typography>{t("quantity")}</Typography>
                    <TextField
                      size="small"
                      type="number"
                      placeholder={t("quantity")}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                    />
                  </Grid>


                  <Grid size={{ xs: 12, md: 2 }}>
                    <Typography>{t("price_per_unit")}</Typography>
                    <TextField
                      size="small"
                      type="number"
                      placeholder={t("price")}
                      value={item.costPrice}
                      onChange={(e) =>
                        updateItem(index, "costPrice", e.target.value)
                      }
                    />
                  </Grid>


                  <Grid size={{ xs: 12, md: 3 }}>
                    <Typography>{t("total_price")}</Typography>
                    <TextField
                      size="small"
                      disabled
                      value={(
                        Number(item.quantity || 0) *
                        Number(item.costPrice || 0)
                      ).toFixed(2)}
                    />
                  </Grid>


                  <Grid size={{ xs: 12, md: 1 }} sx={{textAlign:"end"}} >
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
                    {t("total_all_products")}:{" "}
                    {footerTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? t("processing...") : t("create")}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </BootstrapDialog>
  );
}
