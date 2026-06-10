import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@apollo/client/react";
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
} from "@mui/material";
import { X } from "lucide-react";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import { CREATE_PURCHASE_ORDER, UPDATE_PURCHASE_ORDER } from "../../../../graphql/mutation";
import { GET_PRODUCT_FOR_SALE_WITH_PAGINATION } from "../../../../graphql/queries";
import useGetSupplierWithPagination from "../../hook/useGetSupplierWithPagination";
import useGetProductWarehouseWithPagination from "../../hook/useGetProductWarehouseWithPagination";
import useGetProductWarehouseInShopWithPagination from "../../hook/useGetProductWarehouseInShopWithPagination";
import { useAuth } from "../../../Context/AuthContext";
import { useState } from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": { padding: theme.spacing(2) },
    "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

const emptyItem = {
    subProductId: "",
    quantity: "",
    costPrice: "",
};

export default function PurchaseOrderForm({
    open,
    onClose,
    t,
    language,
    setRefetch,
    editData = null,
    productSource = "warehouse",
    shopId,

}) {
    const isEdit = Boolean(editData);
    const { setAlert } = useAuth();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [keyword, setKeyword] = useState("");
    const { suppliers } = useGetSupplierWithPagination(page, limit, true, keyword);

    const { productWarehouseWithPagination, loading: productLoading } =
        useGetProductWarehouseWithPagination({
            page: 1,
            limit: 50,
            pagination: false,
        });

    const { producteWarehouseInShop, loading: shopWarehouseLoading } =
        useGetProductWarehouseInShopWithPagination({
            shopId,
            page: 1,
            limit: 100,
            pagination: false,
            keyword: "",
        });

    const { data: catalogProductData, loading: catalogProductLoading } = useQuery(
        GET_PRODUCT_FOR_SALE_WITH_PAGINATION,
        {
            variables: {
                shopId: shopId || null,
                page: 1,
                limit: 100,
                pagination: false,
                keyword: "",
            },
            fetchPolicy: "cache-and-network",
            skip: productSource !== "catalog",
        }
    );

    const productOptions =
        productSource === "catalog"
            ? (catalogProductData?.getProductForSaleWithPagination?.data || []).map((subProduct) => ({
                subProduct,
            }))
            : productSource === "shopWarehouse"
            ? producteWarehouseInShop
            : productWarehouseWithPagination;

    const productsLoading =
        productSource === "catalog"
            ? catalogProductLoading
            : productSource === "shopWarehouse"
            ? shopWarehouseLoading
            : productLoading;


    const [createPurchaseOrder, { loading: creating }] = useMutation(
        CREATE_PURCHASE_ORDER,
        {
            onCompleted: (res) => {
                if (res?.createPurchaseOrder?.isSuccess) {
                    setAlert(true, "success", res.createPurchaseOrder.message);
                    setRefetch();
                    onClose();
                } else {
                    setAlert(true, "error", res.createPurchaseOrder.message);
                }
            },
        }
    );

    const [updatePurchaseOrder, { loading: updating }] = useMutation(
        UPDATE_PURCHASE_ORDER,
        {
            onCompleted: (res) => {
                if (res?.updatePurchaseOrder?.isSuccess) {
                    setAlert(true, "success", res.updatePurchaseOrder.message);
                    setRefetch();
                    onClose();
                } else {
                    setAlert(true, "error", res.updatePurchaseOrder.message);
                }
            },
        }
    );


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            supplierId: editData?.supplier?._id || "",
            remark: editData?.remark || "",
            items:
                editData?.items?.map((i) => ({
                    subProductId: i.subProduct?._id,
                    quantity: i.quantity,
                    costPrice: i.costPrice,
                })) || [emptyItem],
        },

        validationSchema: Yup.object({
            supplierId: Yup.string().required(t("require")),
            items: Yup.array().of(
                Yup.object({
                    subProductId: Yup.string().required(t("require")),
                    quantity: Yup.number().min(1).required(t("require")),
                    costPrice: Yup.number().min(0).required(t("require")),
                })
            ),
        }),

        onSubmit: (values) => {
            const payload = {
                supplierId: values.supplierId,
                shopId: shopId || undefined,
                remark: values.remark,
                items: values.items.map((i) => ({
                    subProductId: i.subProductId,
                    quantity: Number(i.quantity),
                    costPrice: Number(i.costPrice),
                })),
            };

            if (isEdit) {
                updatePurchaseOrder({
                    variables: { id: editData._id, input: payload },
                });
            } else {
                createPurchaseOrder({ variables: { input: payload } });
            }
        },
    });

    const { values, errors, touched, handleSubmit, setValues } = formik;


    const addItem = () =>
        setValues({ ...values, items: [...values.items, emptyItem] });

    const deleteItem = (index) => {
        if (values.items.length === 1) return;
        setValues({
            ...values,
            items: values.items.filter((_, i) => i !== index),
        });
    };

    const updateItem = (index, field, value) => {
        const items = [...values.items];
        items[index] = { ...items[index], [field]: value };
        setValues({ ...values, items });
    };


    return (
        <BootstrapDialog open={open} fullWidth maxWidth="sm">
            <DialogTitle>
                {isEdit ? t("update_purchase_order") : t("create_purchase_order")}
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
                                <Typography>{t("suppliers")}</Typography>
                                <Autocomplete
                                    options={suppliers}
                                    value={suppliers.find((s) => s._id === values.supplierId) || null}
                                    getOptionLabel={(s) =>
                                        language === "en" ? s.nameEn : s.nameKh
                                    }
                                    onChange={(e, val) =>
                                        setValues({ ...values, supplierId: val?._id || "" })
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            error={touched.supplierId && Boolean(errors.supplierId)}
                                            helperText={touched.supplierId && errors.supplierId}
                                        />
                                    )}
                                />
                            </Grid>


                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography>{t("remark")}</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={values.remark}
                                    onChange={(e) =>
                                        setValues({ ...values, remark: e.target.value })
                                    }
                                />
                            </Grid>


                            <Grid size={{ xs: 12 }}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography>{t("product_list")}</Typography>
                                    <IconButton onClick={addItem}>
                                        <AddBoxOutlinedIcon />
                                    </IconButton>
                                </Stack>
                            </Grid>

                            {values.items.map((item, index) => (
                                <Grid container spacing={2} key={index}>
                                    <Grid size={{ xs: 12, md: 5 }}>
                                        <Autocomplete
                                            options={productOptions}
                                            loading={productsLoading}
                                            value={
                                                productOptions.find(
                                                    (p) => p.subProduct?._id === item.subProductId
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
                                                const unit =
                                                    language === "en"
                                                        ? p?.subProduct?.unitId?.nameEn
                                                        : p?.subProduct?.unitId?.nameKh;
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
                                            renderOption={(props, option) => {
                                                const name =
                                                    language === "en"
                                                        ? option?.subProduct?.parentProductId?.nameEn
                                                        : option?.subProduct?.parentProductId?.nameKh;
                                                const unit =
                                                    language === "en"
                                                        ? option?.subProduct?.unitId?.nameEn
                                                        : option?.subProduct?.unitId?.nameKh;
                                                return (
                                                    <li {...props}>
                                                        <Typography fontSize={14}>
                                                            {name} ({unit}) {/* same style as getOptionLabel */}
                                                        </Typography>
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    placeholder={t("select_product")}
                                                    error={Boolean(touched.toShopIds && errors.toShopIds)}
                                                    helperText={touched.toShopIds && errors.toShopIds}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            label={t("quantity")}
                                            size="small"
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItem(index, "quantity", e.target.value)
                                            }
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            label={t("price")}
                                            size="small"
                                            type="number"
                                            value={item.costPrice}
                                            onChange={(e) =>
                                                updateItem(index, "costPrice", e.target.value)
                                            }
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 1 }}>
                                        <IconButton onClick={() => deleteItem(index)}>
                                            <X color="red" />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={creating || updating}
                        >
                            {creating || updating
                                ? t("processing...")
                                : isEdit
                                    ? t("update")
                                    : t("create")}
                        </Button>
                    </DialogActions>
                </Form>
            </FormikProvider>
        </BootstrapDialog>
    );
}
