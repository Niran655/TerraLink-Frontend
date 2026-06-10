import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useMutation } from "@apollo/client/react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import { Divider, Grid, InputAdornment, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import * as React from "react";
 
import * as Yup from "yup";

import { ADJUST_STOCK } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function AdjustStockForm({
  open,
  onClose,
  t,
  setRefetch,
  subProductId,
  unit
}) {
 
  const [loading, setLoading] = React.useState(false);
  const { setAlert } = useAuth();
  const  {language} = useAuth()

  const [adjustStock] = useMutation(ADJUST_STOCK, {
    onCompleted: ({ adjustStock }) => {
      setLoading(false);
      if (adjustStock?.isSuccess) {
        setRefetch();
        setAlert(true, "success", adjustStock?.message);
        onClose();
      } else {
        setAlert(true, "error", adjustStock?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message || "Error");
      console.error("Error", error);
    },
  });

  const formik = useFormik({
    initialValues: {
      quantity: 0,
      reason: "",
      type: "in",
      subProductId: subProductId,
    },
    validationSchema: Yup.object({
      quantity: Yup.number().required(t("require")),
      reason: Yup.string().required(t("require")),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      adjustStock({
        variables: {
          input: values,
        },
      });
      resetForm();
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
  } = formik;

  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {t(`adjust_stock`)}
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
              <Grid size={{xs:12}}>
                <Typography variant="body2">{t(`adjust_stock`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`adjust_stock`)}
                  variant="outlined"
                  type="number"
                  size="small"
                  {...getFieldProps("quantity")}
                  InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              { language == "kh" ? unit?.nameKh : unit?.nameEn}
                            </InputAdornment>
                          ),
                        }}
                  helperText={touched.quantity && errors.quantity}
                  error={Boolean(touched.quantity && errors.quantity)}
                />
              </Grid>

              <Grid size={{xs:12}}>
                <Typography variant="body2">{t(`reason`)}</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder={t(`reason`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("reason")}
                  helperText={touched.reason && errors.reason}
                  error={Boolean(touched.reason && errors.reason)}
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
              {loading ? `${t(`processing...`)}` : `${t(`create`)}`}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </BootstrapDialog>
  );
}