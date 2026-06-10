import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery } from "@apollo/client/react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import { Divider, Grid, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import * as Yup from "yup";

import { CREATE_UNIT, UPDATE_UNIT } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function UnitForm({
  open,
  onClose,
  t,
  dialogTitle,
  unitData,
  setRefetch,
}) {
   
  const [loading, setLoading] = React.useState(false);
  const { setAlert } = useAuth();
  const [userObject, setUserObject] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserObject(JSON.parse(storedUser));
    }
  }, []);

  

  const [createUnit] = useMutation(CREATE_UNIT, {
    onCompleted: ({ createUnit }) => {
      if (createUnit?.isSuccess) {
        setLoading(false);
        setRefetch();
        setAlert(true, "success", createUnit?.message);
        onClose();
      } else {
        setLoading(false);
        setAlert(true, "error", createUnit?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      quickAlert("error", error.message || "Error");
      console.error("Error", error);

    },
  });

  const [updateUnit] = useMutation(UPDATE_UNIT, {
    onCompleted: ({ updateUnit }) => {
      if (updateUnit?.isSuccess) {
        setLoading(false);
        setRefetch();
        setAlert(true, "success", updateUnit?.message);
        onClose?.();
      } else {
        setLoading(false);
        setAlert(true, "error", updateUnit?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      console.log("Error", error);
      setAlert(true, "error", "something went wrong!");
    },
  });

  const formik = useFormik({
    initialValues: {
      nameKh: "",
      nameEn: "",
      active: true,
      remark: "",
    },
    validationSchema: Yup.object({
      nameKh: Yup.string().required(t("require")),
      nameEn: Yup.string().required(t("require")),
      remark: Yup.string(),
      active: Yup.boolean(),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      if(dialogTitle==="Create"){
      createUnit({
        variables: {
          input: values,
        },
      });
    }else{
      updateUnit({
        variables: {
          id: unitData?._id,
          input: values,
        },
      });
    }
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    resetForm,
    getFieldProps,
    values,
    setFieldValue,
    setValues,
  } = formik;

  useEffect(() => {
    if (unitData) {
      setValues({
        nameKh: unitData.nameKh,
        nameEn: unitData.nameEn,
        remark: unitData.remark,
        active: unitData.active,
      });
    }
  }, [unitData, setValues]);

  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {dialogTitle === "Create"
          ? t(`add_unit`)
          :t(`edit_unit`)}
      
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
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

              <Grid size={{ xs: 12 }}>
                <Typography variant="body2">{t(`remark`)}</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder={t(`remark`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("remark")}
                  helperText={touched.remark && errors.remark}
                  error={Boolean(touched.remark && errors.remark)}
                />
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
                ? `${t(`processing...`)}`
                : dialogTitle === "Create"
                ? `${t(`create`)}`
                : `${t(`update`)}`}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </BootstrapDialog>
  );
}
