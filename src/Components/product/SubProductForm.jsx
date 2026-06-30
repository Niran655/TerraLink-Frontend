import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@apollo/client/react";
import { styled } from "@mui/material/styles";
import {
  Autocomplete, Box, Button, Checkbox, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, FormControlLabel, Grid,
  IconButton, InputAdornment, MenuItem, Select, Tab, Tabs,
  TextField, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Collapse
} from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import dayjs from "dayjs";

import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import UseAutocomplete from "../include/useAutoComplete";
import { CREATE_SUB_PRODUCT, UPDATE_SUB_PRODUCT } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import { GET_ALL_SHOP, GET_UNIT } from "../../../graphql/queries";
import UploadImage from "../../utils/UploadImage";
import { deleteImagesFromStorage, deleteImageFromStorage } from "../../utils/supabaseImageStorage";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

 
const calcTotal = (price, tax, service) =>
  (Number(price) || 0) + (Number(tax) || 0) + (Number(service) || 0);

const ADDITION_PRICES_CLIPBOARD_KEY = "subProductAdditionPricesClipboard";

const formatDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const normalizeAdditionPrices = (items = []) =>
  items.map((item) => ({
    nameKhmer: item.nameKhmer || "",
    nameEnglish: item.nameEnglish || "",
    priceType: item.priceType || "single",
    price: item.price ?? 0,
    tax: item.tax ?? 0,
    service: item.service ?? 0,
    total: calcTotal(item.price, item.tax, item.service),
    sizeName: item.sizeName || "",
    sugarLevel: item.sugarLevel || "",
    children: normalizeAdditionPrices(item.children || []),
  }));

export default function SubProductForm({
  open,
  onClose,
  t,
  dialogTitle = "Create",
  subProductData,
  parentProductId,
  setRefetch,
  unit,
}) {
  const { setAlert, language } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [userObject, setUserObject] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [pendingImagePaths, setPendingImagePaths] = useState({});
  const [oldImageUrls, setOldImageUrls] = useState({ productImg: "", priceImg: "" });
  const submittedValuesRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserObject(JSON.parse(storedUser));
  }, []);

  const { data: unitData } = useQuery(GET_UNIT);
  const { data: shopData } = useQuery(GET_ALL_SHOP, {
    variables: { id: userObject?._id },
  });

  const units = unitData?.getUnit || [];
  const shops = shopData?.getAllShops || [];

  const [createSubProduct] = useMutation(CREATE_SUB_PRODUCT, {
    onCompleted: ({ createSubProduct }) => {
      setLoadingLocal(false);
      if (createSubProduct?.isSuccess) {
        setAlert(true, "success", createSubProduct.message);
        setPendingImagePaths({});
        setRefetch?.();
        onClose();
      } else {
        deleteImagesFromStorage(Object.values(pendingImagePaths)).catch(console.error);
        setAlert(true, "error", createSubProduct?.message);
      }
    },
    onError: (err) => {
      setLoadingLocal(false);
      deleteImagesFromStorage(Object.values(pendingImagePaths)).catch(console.error);
      setAlert(true, "error", err.message);
    },
  });

  const [updateSubProduct] = useMutation(UPDATE_SUB_PRODUCT, {
    onCompleted: async ({ updateSubProduct }) => {
      setLoadingLocal(false);
      if (updateSubProduct?.isSuccess) {
        const submittedValues = submittedValuesRef.current || {};
        const imagesToDelete = [];
        if (oldImageUrls.productImg && oldImageUrls.productImg !== submittedValues.productImg) {
          imagesToDelete.push(oldImageUrls.productImg);
        }
        if (oldImageUrls.priceImg && oldImageUrls.priceImg !== submittedValues.priceImg) {
          imagesToDelete.push(oldImageUrls.priceImg);
        }
        if (imagesToDelete.length) {
          await deleteImagesFromStorage(imagesToDelete).catch(console.error);
        }
        setAlert(true, "success", updateSubProduct.message);
        setPendingImagePaths({});
        setOldImageUrls({
          productImg: submittedValues.productImg || "",
          priceImg: submittedValues.priceImg || "",
        });
        setRefetch?.();
        onClose();
      } else {
        deleteImagesFromStorage(Object.values(pendingImagePaths)).catch(console.error);
        setAlert(true, "error", updateSubProduct?.message);
      }
    },
    onError: (err) => {
      setLoadingLocal(false);
      deleteImagesFromStorage(Object.values(pendingImagePaths)).catch(console.error);
      setAlert(true, "error", err.message);
    },
  });

  const validationSchema = Yup.object().shape({
    saleType: Yup.string().oneOf(["retail", "wholesale"]).nullable(),
    unitId: Yup.string().nullable().required(t(`require`)),
    qty: Yup.number().min(0).nullable(),
    barCode: Yup.string().nullable(),
    productDes: Yup.string().nullable(),
    servicePrice: Yup.number().min(0).nullable(),
    salePrice: Yup.number().min(0).nullable(),
    taxRate: Yup.number().min(0).nullable(),
    costPrice: Yup.number().min(0).nullable(),
    totalPrice: Yup.number().min(0).nullable(),
    batchNo: Yup.string().nullable(),
    expiryDate: Yup.date().nullable(),
    parentProductId: Yup.string().nullable(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      saleType: subProductData?.saleType || "retail",
      unitId: subProductData?.unitId?._id || subProductData?.unitId || "",
      qty: subProductData?.qty ?? 0,
      minStock: subProductData?.minStock || 0,
      barCode: subProductData?.barCode || "",
      productDes: subProductData?.productDes || "",
      productImg: subProductData?.productImg || "",
      using: subProductData?.using ?? false,
      check: subProductData?.check ?? false,
      sell: subProductData?.sell ?? false,
      shopId: subProductData?.shopId?.map((s) => s._id) || subProductData?.shopId || [],
      servicePrice: subProductData?.servicePrice ?? 0,
      salePrice: subProductData?.salePrice ?? 0,
      taxRate: subProductData?.taxRate ?? 0,
      costPrice: subProductData?.costPrice ?? 0,
      priceImg: subProductData?.priceImg || "",
      totalPrice: subProductData?.totalPrice ?? 0,
      priceDes: subProductData?.priceDes || "",
      batchNo: subProductData?.batchNo || "",
      expiryDate: formatDateInput(subProductData?.expiryDate),
      parentProductId: subProductData?.parentProductId?._id || parentProductId || "",
      additionPrices: (subProductData?.additionPrices || []).map(p => ({
        ...p,
        children: (p.children || []).map(c => ({
          ...c,
          total: calcTotal(c.price, c.tax, c.service),
          sizeName: c.sizeName || "",
          sugarLevel: c.sugarLevel || "50%",
        })),
      })),
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoadingLocal(true);
      submittedValuesRef.current = values;

 
      const processAdditionPrices = (items) => {
        if (!items) return [];
        return items.map(item => ({
          nameKhmer: item.nameKhmer,
          nameEnglish: item.nameEnglish,
          priceType: item.priceType,
          price: Number(item.price || 0),
          tax: Number(item.tax || 0),
          service: Number(item.service || 0),
          total: calcTotal(item.price, item.tax, item.service),
          sizeName: item.sizeName || "",
          sugarLevel: item.sugarLevel || "",
          children: processAdditionPrices(item.children || []),
        }));
      };

      const input = {
        saleType: values.saleType || null,
        unitId: values.unitId || null,
        qty: Number(values.qty || 0),
        barCode: values.barCode || "",
        productDes: values.productDes || "",
        productImg: values.productImg || "",
        using: Boolean(values.using),
        check: Boolean(values.check),
        sell: Boolean(values.sell),
        shopId: values.shopId || [],
        stock: values.stock || 0,
        minStock: values.minStock || 0,
        servicePrice: Number(values.servicePrice || 0),
        salePrice: Number(values.salePrice || 0),
        taxRate: Number(values.taxRate || 0),
        costPrice: Number(values.costPrice || 0),
        priceImg: values.priceImg || "",
        totalPrice: Number(values.totalPrice || 0),
        priceDes: values.priceDes || "",
        batchNo: values.batchNo || "",
        expiryDate: values.expiryDate || null,
        parentProductId: values.parentProductId || parentProductId || null,
        additionPrices: processAdditionPrices(values.additionPrices),
      };

      try {
        if (dialogTitle === "Create") {
          await createSubProduct({ variables: { parentProductId, input } });
        } else {
          await updateSubProduct({ variables: { id: subProductData?._id, input } });
        }
      } catch (err) {
        console.error(err);
        setLoadingLocal(false);
        setAlert(true, "error", err.message || "Operation failed");
      }
    },
  });

  const {
    values,
    setFieldValue,
    handleSubmit,
    getFieldProps,
    errors,
    touched,
    resetForm,
    setValues,
  } = formik;

 
  useEffect(() => {
    if (open) {
      if (dialogTitle === "Update" && subProductData) {
        setValues({
          saleType: subProductData?.saleType || "retail",
          unitId: subProductData?.unitId?._id || subProductData?.unitId || "",
          qty: subProductData?.qty ?? 0,
          barCode: subProductData?.barCode || "",
          productDes: subProductData?.productDes || "",
          productImg: subProductData?.productImg || "",
          using: subProductData?.using ?? false,
          minStock: subProductData?.minStock,
          check: subProductData?.check ?? false,
          sell: subProductData?.sell ?? false,
          shopId: subProductData?.shopId?.map((s) => s._id) || subProductData?.shopId || [],
          servicePrice: subProductData?.servicePrice ?? 0,
          salePrice: subProductData?.salePrice ?? 0,
          taxRate: subProductData?.taxRate ?? 0,
          costPrice: subProductData?.costPrice ?? 0,
          priceImg: subProductData?.priceImg || "",
          totalPrice: subProductData?.totalPrice ?? 0,
          priceDes: subProductData?.priceDes || "",
          batchNo: subProductData?.batchNo || "",
          expiryDate: formatDateInput(subProductData?.expiryDate),
          parentProductId: subProductData?.parentProductId?._id || parentProductId || "",
          additionPrices: (subProductData?.additionPrices || []).map(p => ({
            ...p,
            children: (p.children || []).map(c => ({
              ...c,
              total: calcTotal(c.price, c.tax, c.service),
              sizeName: c.sizeName || "",
              sugarLevel: c.sugarLevel || "50%",
            })),
          })),
        });
        setOldImageUrls({
          productImg: subProductData?.productImg || "",
          priceImg: subProductData?.priceImg || "",
        });
        setPendingImagePaths({});
      } else {
        setOldImageUrls({ productImg: "", priceImg: "" });
        setPendingImagePaths({});
        resetForm();
        setFieldValue("parentProductId", parentProductId || "");
      }
    } else {
      resetForm();
    }
  }, [open, subProductData, parentProductId, setValues, resetForm, setFieldValue]);

  const handleClose = async () => {
    await deleteImagesFromStorage(Object.values(pendingImagePaths)).catch(console.error);
    setPendingImagePaths({});
    resetForm();
    onClose();
  };

  const handleUploadedPath = async (fieldName, path) => {
    const previousPath = pendingImagePaths[fieldName];
    if (previousPath && previousPath !== path) {
      await deleteImageFromStorage(previousPath).catch(console.error);
    }
    setPendingImagePaths((prev) => ({ ...prev, [fieldName]: path }));
  };

 
  const handleAddParentRow = () => {
    const newParent = {
      nameKhmer: "",
      nameEnglish: "",
      priceType: "single",
      price: 0,
      tax: 0,
      service: 0,
      total: 0,
      children: [],
    };
    setFieldValue("additionPrices", [...values.additionPrices, newParent]);
    setExpandedRows(prev => ({ ...prev, [values.additionPrices.length]: true }));
  };

  const handleRemoveParentRow = (idx) => {
    const updated = values.additionPrices.filter((_, i) => i !== idx);
    setFieldValue("additionPrices", updated);
    const newExpanded = { ...expandedRows };
    delete newExpanded[idx];
    setExpandedRows(newExpanded);
  };

  const handleParentChange = (idx, field, value) => {
    const updated = [...values.additionPrices];
    updated[idx][field] = value;
    if (field === "price" || field === "tax" || field === "service") {
      updated[idx].total = calcTotal(updated[idx].price, updated[idx].tax, updated[idx].service);
    }
    setFieldValue("additionPrices", updated);
  };

 
  const handleAddChildRow = (parentIdx) => {
    const updated = [...values.additionPrices];
    const newChild = {
      nameKhmer: "",
      nameEnglish: "",
      priceType: "size_sugar",
      sizeName: "",
      sugarLevel: "50%",
      price: 0,
      tax: 0,
      service: 0,
      total: 0,
    };
    updated[parentIdx].children = [...(updated[parentIdx].children || []), newChild];
    setFieldValue("additionPrices", updated);
  };

  const handleRemoveChildRow = (parentIdx, childIdx) => {
    const updated = [...values.additionPrices];
    updated[parentIdx].children = updated[parentIdx].children.filter((_, i) => i !== childIdx);
    setFieldValue("additionPrices", updated);
  };

  const handleChildChange = (parentIdx, childIdx, field, value) => {
    const updated = [...values.additionPrices];
    updated[parentIdx].children[childIdx][field] = value;
    const child = updated[parentIdx].children[childIdx];
    if (field === "price" || field === "tax" || field === "service") {
      child.total = calcTotal(child.price, child.tax, child.service);
    }
    setFieldValue("additionPrices", updated);
  };

  const handleCopyAdditionPrices = () => {
    const copiedPrices = normalizeAdditionPrices(values.additionPrices || []);
    localStorage.setItem(ADDITION_PRICES_CLIPBOARD_KEY, JSON.stringify(copiedPrices));
    setAlert(true, "success", "Addition price options copied");
  };

  const handlePasteAdditionPrices = () => {
    const copiedPrices = localStorage.getItem(ADDITION_PRICES_CLIPBOARD_KEY);
    if (!copiedPrices) {
      setAlert(true, "warning", "No copied addition price options found");
      return;
    }

    try {
      const parsedPrices = JSON.parse(copiedPrices);
      const normalizedPrices = normalizeAdditionPrices(Array.isArray(parsedPrices) ? parsedPrices : []);
      setFieldValue("additionPrices", normalizedPrices);
      setExpandedRows(
        normalizedPrices.reduce((rows, _item, idx) => ({ ...rows, [idx]: true }), {})
      );
      setAlert(true, "success", "Addition price options pasted");
    } catch (err) {
      console.error(err);
      setAlert(true, "error", "Copied addition price options are invalid");
    }
  };

  const toggleExpand = (idx) => {
    setExpandedRows(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

 
  useEffect(() => {
    const service = Number(values.servicePrice || 0);
    const sale = Number(values.salePrice || 0);
    const tax = Number(values.taxRate || 0);
    const total = (service + sale) * (1 + tax / 100);
    setFieldValue("totalPrice", total.toFixed(2));
  }, [values.servicePrice, values.salePrice, values.taxRate, setFieldValue]);

  const selectedShops = shops.filter((s) => values.shopId?.includes(s._id));
  const sugarOptions = ["0%", "30%", "50%", "70%", "100%"];

  return (
    <BootstrapDialog open={open} fullWidth maxWidth="lg">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {dialogTitle === "Create" ? t("add_product") : t("edit_product")}
      </DialogTitle>
      <IconButton onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
        <CloseIcon color="error" />
      </IconButton>
      <Divider />
      <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} variant="scrollable" scrollButtons="auto">
        <Tab label={t("product_information")} />
        <Tab label={t("price")} />
        <Tab label={t("addition_price")} />
        <Tab label={t("other")} />
      </Tabs>

      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
           
            {tabIndex === 0 && (
              <Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("sale_type")}</Typography>
                    <TextField select fullWidth size="small" {...getFieldProps("saleType")}>
                      <MenuItem value="retail">{t("retail")}</MenuItem>
                      <MenuItem value="wholesale">{t("wholesale")}</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <UseAutocomplete
                      name="unitId"
                      label={`${t("unit")} *`}
                      placeholder={t("select_unit")}
                      query={GET_UNIT}
                      dataKey="getUnit"
                      getOptionLabel={(item) => item?.name || item?.nameEn || item?.nameKh || ""}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("qty_in_unit")}</Typography>
                    <TextField
                      fullWidth size="small" type="number"
                      InputProps={{ endAdornment: <InputAdornment position="end">{language === "kh" ? unit?.nameKh : unit?.nameEn}</InputAdornment> }}
                      {...getFieldProps("qty")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("bar_code")}</Typography>
                    <TextField fullWidth size="small" {...getFieldProps("barCode")} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("description")}</Typography>
                    <TextField fullWidth size="small" multiline rows={2} {...getFieldProps("productDes")} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("image")}</Typography>
                    <UploadImage
                      value={values.productImg}
                      onChange={(url) => setFieldValue("productImg", url)}
                      setFilePath={(path) => handleUploadedPath("productImg", path)}
                    />
                  </Grid>
                  {values.check && (
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography variant="body2">{t("min_stock")}</Typography>
                      <TextField fullWidth size="small" type="number" {...getFieldProps("minStock")} />
                    </Grid>
                  )}
                  <Grid size={{ xs: 12 }}>
                    <FormControlLabel control={<Checkbox checked={values.sell} onChange={(e) => setFieldValue("sell", e.target.checked)} />} label={t("sell")} />
                    <FormControlLabel control={<Checkbox checked={values.using} onChange={(e) => setFieldValue("using", e.target.checked)} />} label={t("using_purchase")} />
                    <FormControlLabel control={<Checkbox checked={values.check} onChange={(e) => setFieldValue("check", e.target.checked)} />} label={t("check")} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("shop")}</Typography>
                    <Autocomplete
                      multiple
                      options={shops}
                      getOptionLabel={(opt) => opt?.name || opt?.nameEn || opt?.nameKh || ""}
                      value={selectedShops}
                      onChange={(e, newVal) => setFieldValue("shopId", newVal.map(s => s._id))}
                      renderInput={(params) => <TextField {...params} size="small" placeholder={t("select_shops")} />}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            
            {tabIndex === 1 && (
              <Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("service_price")}</Typography>
                    <TextField fullWidth size="small" type="number" InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }} {...getFieldProps("servicePrice")} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("sale_price")}</Typography>
                    <TextField fullWidth size="small" type="number" InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }} {...getFieldProps("salePrice")} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("tax_rate")}</Typography>
                    <TextField fullWidth size="small" type="number" {...getFieldProps("taxRate")} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("cost")}</Typography>
                    <TextField fullWidth size="small" type="number" InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }} {...getFieldProps("costPrice")} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("total_price")}</Typography>
                    <TextField fullWidth size="small" type="number" value={values.totalPrice} InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }} {...getFieldProps("totalPrice")} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("image")}</Typography>
                    <UploadImage
                      value={values.priceImg}
                      onChange={(url) => setFieldValue("priceImg", url)}
                      setFilePath={(path) => handleUploadedPath("priceImg", path)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2">{t("description")}</Typography>
                    <TextField fullWidth size="small" multiline rows={2} {...getFieldProps("priceDes")} />
                  </Grid>
                </Grid>
              </Box>
            )}

             
            {tabIndex === 2 && (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 2, flexWrap: "wrap" }}>
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddParentRow}>
                    {t(`add_new_size`)}
                  </Button>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopyAdditionPrices}
                      disabled={!values.additionPrices?.length}
                    >
                      Copy options
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ContentPasteIcon />}
                      onClick={handlePasteAdditionPrices}
                    >
                      Paste options
                    </Button>
                  </Box>
                </Box>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell width="5%"></TableCell>
                        <TableCell>{t(`khmer_name`)}</TableCell>
                        <TableCell>{t(`english_name`)}</TableCell>
                        <TableCell>{t(`type`)}</TableCell>
                        <TableCell>{t(`price`)} ($)</TableCell>
                        <TableCell>{t(`tax`)} ($)</TableCell>
                        <TableCell>{t(`service`)} ($)</TableCell>
                        <TableCell>{t(`total`)} ($)</TableCell>
                        <TableCell align="center">{t(`action`)}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.additionPrices.map((parent, pIdx) => (
                        <React.Fragment key={pIdx}>
                          <TableRow>
                            <TableCell>
                              <IconButton size="small" onClick={() => toggleExpand(pIdx)}>
                                {expandedRows[pIdx] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth size="small"
                                value={parent.nameKhmer}
                                onChange={(e) => handleParentChange(pIdx, "nameKhmer", e.target.value)}
                                placeholder="e.g., កែវតូច"
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth size="small"
                                value={parent.nameEnglish}
                                onChange={(e) => handleParentChange(pIdx, "nameEnglish", e.target.value)}
                                placeholder="e.g., Small Glass"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                fullWidth size="small"
                                value={parent.priceType}
                                onChange={(e) => handleParentChange(pIdx, "priceType", e.target.value)}
                              >
                                <MenuItem value="single">Single</MenuItem>
                                <MenuItem value="multiple">Multiple</MenuItem>
                                <MenuItem value="option">Option</MenuItem>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="number" size="small"
                                value={parent.price}
                                onChange={(e) => handleParentChange(pIdx, "price", e.target.value)}
                                InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="number" size="small"
                                value={parent.tax}
                                onChange={(e) => handleParentChange(pIdx, "tax", e.target.value)}
                                InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="number" size="small"
                                value={parent.service}
                                onChange={(e) => handleParentChange(pIdx, "service", e.target.value)}
                                InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small" value={parent.total} disabled
                                InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton color="error" onClick={() => handleRemoveParentRow(pIdx)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>

               
                          <TableRow>
                            <TableCell colSpan={9} style={{ paddingBottom: 0, paddingTop: 0 }}>
                              <Collapse in={expandedRows[pIdx]} timeout="auto" unmountOnExit>
                                <Box margin={2}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    Sugar Levels for "{parent.nameEnglish || parent.nameKhmer || 'this size'}"
                                  </Typography>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>{t(`option_name`)}</TableCell>
                                        <TableCell>{t(`surgar_lavel`)}</TableCell>
                                        <TableCell>{t(`price`)} ($)</TableCell>
                                        <TableCell>{t(`tax`)} ($)</TableCell>
                                        <TableCell>{t(`service`)} ($)</TableCell>
                                        <TableCell>{t(`total`)} ($)</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {(parent.children || []).map((child, cIdx) => (
                                        <TableRow key={cIdx}>
                                          <TableCell>
                                            <TextField
                                              size="small"
                                              value={child.sizeName || ""}
                                              onChange={(e) => handleChildChange(pIdx, cIdx, "sizeName", e.target.value)}
                                              placeholder="e.g., Less sweet"
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Select
                                              size="small"
                                              value={child.sugarLevel || "50%"}
                                              onChange={(e) => handleChildChange(pIdx, cIdx, "sugarLevel", e.target.value)}
                                            >
                                              {sugarOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                            </Select>
                                          </TableCell>
                                          <TableCell>
                                            <TextField
                                              type="number" size="small"
                                              value={child.price}
                                              onChange={(e) => handleChildChange(pIdx, cIdx, "price", e.target.value)}
                                              InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <TextField
                                              type="number" size="small"
                                              value={child.tax}
                                              onChange={(e) => handleChildChange(pIdx, cIdx, "tax", e.target.value)}
                                              InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <TextField
                                              type="number" size="small"
                                              value={child.service}
                                              onChange={(e) => handleChildChange(pIdx, cIdx, "service", e.target.value)}
                                              InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <TextField
                                              size="small" value={child.total} disabled
                                              InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }}
                                            />
                                          </TableCell>
                                          <TableCell align="center">
                                            <IconButton color="error" size="small" onClick={() => handleRemoveChildRow(pIdx, cIdx)}>
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                      <TableRow>
                                        <TableCell colSpan={7}>
                                          <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => handleAddChildRow(pIdx)}>
                                            {t(`add_surgar_lavel`)}
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

 
            {tabIndex === 3 && (
              <Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">Parent Product</Typography>
                    <TextField fullWidth size="small" value={values.parentProductId || ""} disabled />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("batch") || "Batch"}</Typography>
                    <TextField fullWidth size="small" {...getFieldProps("batchNo")} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("expiry_date") || "Expiry Date"}</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="DD/MM/YYYY"
                        value={values.expiryDate ? dayjs(values.expiryDate) : null}
                        onChange={(date) => {
                          setFieldValue("expiryDate", date?.isValid() ? date.format("YYYY-MM-DD") : "");
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            error: Boolean(touched.expiryDate && errors.expiryDate),
                            helperText: touched.expiryDate && errors.expiryDate,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button type="submit" fullWidth variant="contained" disabled={loadingLocal}>
              {loadingLocal ? t("processing...") : dialogTitle === "Create" ? t("create") : t("update")}
            </Button>
          </DialogActions>
        </form>
      </FormikProvider>
    </BootstrapDialog>
  );
}
