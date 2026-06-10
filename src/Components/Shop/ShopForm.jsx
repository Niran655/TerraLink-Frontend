import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@apollo/client/react";
import { styled } from "@mui/material/styles";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";

import { CREATE_SHOP, UPDATE_SHOP } from "../../../graphql/mutation";
import { GET_TENANTS, GET_USER_WITH_PAGINATION } from "../../../graphql/queries";
import { useAuth } from "../../Context/AuthContext";
import UploadImage from "../../utils/UploadImage";
import { deleteImageFromStorage } from "../../utils/supabaseImageStorage";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

export default function ShopForm({
  open,
  onClose,
  t,
  shopData,
  dialogTitle,
  setRefetch,
}) {
  const { setAlert, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pendingImagePath, setPendingImagePath] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const submittedValuesRef = useRef(null);
  const isSuperAdmin = user?.role === "superAdmin";
  const authTenantId = user?.tenantId?._id || user?.tenantId || "";
  const { data: tenantData } = useQuery(GET_TENANTS, {
    variables: { active: true },
    skip: !isSuperAdmin,
  });
  const { data: ownerData } = useQuery(GET_USER_WITH_PAGINATION, {
    variables: { page: 1, limit: 100, pagination: false, keyword: "", role: "owner" },
    skip: !isSuperAdmin,
  });
  const tenants = tenantData?.getTenants || [];

  const [createShop] = useMutation(CREATE_SHOP, {
    onCompleted: ({ createShop }) => {
      setLoading(false);
      if (createShop?.isSuccess) {
        setAlert(true, "success", createShop?.message);
        setPendingImagePath(null);
        onClose();
        setRefetch();
      } else {
        if (pendingImagePath) deleteImageFromStorage(pendingImagePath).catch(console.error);
        setAlert(true, "error", createShop?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      if (pendingImagePath) deleteImageFromStorage(pendingImagePath).catch(console.error);
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    },
  });

  const [updateShop] = useMutation(UPDATE_SHOP, {
    onCompleted: async ({ updateShop }) => {
      setLoading(false);
      if (updateShop?.isSuccess) {
        const submittedImage = submittedValuesRef.current?.image || "";
        if (oldImageUrl && oldImageUrl !== submittedImage) {
          await deleteImageFromStorage(oldImageUrl).catch(console.error);
        }
        setAlert(true, "success", updateShop?.message);
        setPendingImagePath(null);
        setOldImageUrl(submittedImage);
        onClose();
        setRefetch();
      } else setAlert(true, "error", updateShop?.message);
    },
    onError: (error) => {
      setLoading(false);
      if (pendingImagePath) deleteImageFromStorage(pendingImagePath).catch(console.error);
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      tenantId: authTenantId,
      userId: [],
      nameKh: "",
      nameEn: "",
      code: "",
      image: "",
      type: "",
      remark: "",
      address: "",
      active: true,
    },
    validationSchema: Yup.object({
      tenantId: isSuperAdmin ? Yup.string().required(t("require")) : Yup.string(),
      nameKh: Yup.string().required(t(`require`)),
      nameEn: Yup.string().required(t(`require`)),
      code: Yup.string(),
      image: Yup.string(),
      type: Yup.string(),
      remark: Yup.string(),
      address: Yup.string(),
      active: Yup.boolean(),
    }),
    onSubmit: (values) => {
      setLoading(true);
      const rawInput = {
        ...values,
        active: values.active === true || values.active === "true",
        tenantId: isSuperAdmin ? values.tenantId || undefined : undefined,
        userId: isSuperAdmin ? values.userId || [] : undefined,
      };
      const input = Object.fromEntries(
        Object.entries(rawInput).filter(([, value]) => value !== undefined)
      );
      submittedValuesRef.current = { ...input };
      if (dialogTitle === "Create")
        createShop({ variables: { input } });
      else updateShop({ variables: { id: shopData?._id, input } });
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    setValues,
    values,
  } = formik;
  const owners = (ownerData?.getUsersWithPagination?.data || []).filter((owner) => {
    const ownerTenantId = owner?.tenantId?._id || owner?.tenantId;
    return !values?.tenantId || ownerTenantId === values.tenantId;
  });

  useEffect(() => {
    if (shopData) {
      setValues({
        tenantId: shopData?.tenantId?._id || shopData?.tenantId || authTenantId,
        userId: (shopData?.user || []).map((shopUser) => shopUser?._id || shopUser).filter(Boolean),
        nameKh: shopData?.nameKh || "",
        nameEn: shopData?.nameEn || "",
        code: shopData?.code || "",
        image: shopData?.image || "",
        type: shopData?.type || "",
        remark: shopData?.remark || "",
        address: shopData?.address || "",
        active: shopData?.active ?? true,
      });
      setOldImageUrl(shopData?.image || "");
      setPendingImagePath(null);
    }
  }, [authTenantId, shopData, setValues]);

  const handleClose = async () => {
    if (pendingImagePath) {
      await deleteImageFromStorage(pendingImagePath).catch(console.error);
      setPendingImagePath(null);
    }
    onClose();
  };

  const handleUploadedPath = async (path) => {
    if (pendingImagePath && pendingImagePath !== path) {
      await deleteImageFromStorage(pendingImagePath).catch(console.error);
    }
    setPendingImagePath(path);
  };

  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {dialogTitle === "Create" ? t("add_shop") : t("update_shop")}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon color="error" />
      </IconButton>

      <Divider />
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <UploadImage
                  value={formik.values.image}
                  onChange={(url) => setFieldValue("image", url)}
                  setFilePath={handleUploadedPath}
                />
              </Grid>
              {isSuperAdmin && (
                <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("tenant") || "Tenant"}</Typography>
                    <Autocomplete
                      size="small"
                      options={tenants}
                      value={tenants.find((tenant) => tenant._id === values.tenantId) || null}
                      getOptionLabel={(option) => option?.nameEn || option?.nameKh || ""}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      onChange={(_, nextTenant) => {
                        setFieldValue("tenantId", nextTenant?._id || "");
                        setFieldValue("userId", []);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t("tenant") || "Tenant"}
                          error={Boolean(touched.tenantId && errors.tenantId)}
                          helperText={touched.tenantId && errors.tenantId}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("owner")}</Typography>
                    <Autocomplete
                      multiple
                      size="small"
                      options={owners}
                      value={owners.filter((owner) => values.userId?.includes(owner._id))}
                      getOptionLabel={(option) => option?.nameEn || option?.nameKh || ""}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      onChange={(_, nextOwners) =>
                        setFieldValue("userId", nextOwners.map((owner) => owner._id))
                      }
                      renderInput={(params) => (
                        <TextField {...params} placeholder={t("owner")} />
                      )}
                    />
                  </Grid>
                </>
              )}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`khmer_name`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`khmer_name`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("nameKh")}
                  helperText={touched.nameKh && errors.nameKh}
                  error={Boolean(touched.nameKh && errors.nameKh)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`english_name`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`english_name`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("nameEn")}
                  helperText={touched.nameEn && errors.nameEn}
                  error={Boolean(touched.nameEn && errors.nameEn)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`code`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`code`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("code")}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`type`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`type`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("type")}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`remark`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`remark`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("remark")}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`address`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`address`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("address")}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`active`)}</Typography>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  size="small"
                  {...getFieldProps("active")}
                >
                  <MenuItem value={true}>{t(`active`)}</MenuItem>
                  <MenuItem value={false}>{t(`inactive`)}</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
            >
              {loading
                ? t(`loading`)
                : dialogTitle === "Create"
                ? t(`create`)
                : t(`update`)}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </BootstrapDialog>
  );
}
