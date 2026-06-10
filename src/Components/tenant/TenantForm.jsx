/* eslint-disable react/prop-types */
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import QueueOutlinedIcon from "@mui/icons-material/QueueOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";

import { REGISTER_TENANT_OWNER, UPDATE_TENANT } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";

const defaultForm = {
  tenantNameKh: "",
  tenantNameEn: "",
  tenantEmail: "",
  tenantPhone: "",
  tenantAddress: "",
  ownerNameKh: "",
  ownerNameEn: "",
  ownerEmail: "",
  ownerPhone: "",
  ownerGender: "male",
  ownerPassword: "",
};

export default function TenantForm({ open, onClose, dialogTitle = "Create", tenantData, setRefetch, t }) {
  const { setAlert } = useAuth();
  const isCreate = dialogTitle === "Create";
  const [form, setForm] = useState(defaultForm);

  const [registerTenantOwner, { loading: creating }] = useMutation(REGISTER_TENANT_OWNER, {
    onCompleted: ({ register }) => {
      if (register?.email) {
        setAlert(true, "success", {
          messageEn: "Tenant and business owner created successfully",
          messageKh: "Tenant and business owner created successfully",
        });
        setRefetch?.();
        onClose?.();
        setForm(defaultForm);
      } else {
        setAlert(true, "error", register?.message);
      }
    },
    onError: (error) => {
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    },
  });

  const [updateTenant, { loading: updating }] = useMutation(UPDATE_TENANT, {
    onCompleted: ({ updateTenant: result }) => {
      if (result?.isSuccess) {
        setAlert(true, "success", result?.message);
        setRefetch?.();
        onClose?.();
      } else {
        setAlert(true, "error", result?.message);
      }
    },
    onError: (error) => {
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    },
  });

  const saving = creating || updating;

  useEffect(() => {
    if (tenantData && !isCreate) {
      setForm({
        ...defaultForm,
        tenantNameKh: tenantData.nameKh || "",
        tenantNameEn: tenantData.nameEn || "",
        tenantEmail: tenantData.email || "",
        tenantPhone: tenantData.phone || "",
        tenantAddress: tenantData.address || "",
      });
      return;
    }

    setForm(defaultForm);
  }, [isCreate, open, tenantData]);

  const canSave = useMemo(() => {
    if (isCreate) {
      return (
        form.tenantNameKh.trim() &&
        form.ownerNameKh.trim() &&
        form.ownerNameEn.trim() &&
        form.ownerEmail.trim() &&
        form.ownerPhone.trim() &&
        form.ownerPassword.trim()
      );
    }

    return form.tenantNameKh.trim();
  }, [form, isCreate]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleClose = () => {
    if (!saving) {
      onClose?.();
      setForm(defaultForm);
    }
  };

  const handleSubmit = () => {
    if (isCreate) {
      registerTenantOwner({
        variables: {
          input: {
            tenantNameKh: form.tenantNameKh,
            tenantNameEn: form.tenantNameEn,
            nameKh: form.ownerNameKh,
            nameEn: form.ownerNameEn,
            email: form.ownerEmail,
            phone: form.ownerPhone,
            gender: form.ownerGender,
            password: form.ownerPassword,
            role: "owner",
            active: true,
          },
        },
      });
      return;
    }

    updateTenant({
      variables: {
        id: tenantData?._id,
        input: {
          nameKh: form.tenantNameKh,
          nameEn: form.tenantNameEn,
          email: form.tenantEmail,
          phone: form.tenantPhone,
          address: form.tenantAddress,
        },
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        {isCreate ? t("create_tenant") || "Create Tenant" : t("edit_tenant") || "Edit Tenant"}
        <IconButton aria-label={t("close")} onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <BusinessOutlinedIcon color="primary" />
            <Typography fontWeight={800}>{t("tenant_information") || "Tenant Information"}</Typography>
          </Stack>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
            <TextField label={t("khmer_name")} value={form.tenantNameKh} onChange={handleChange("tenantNameKh")} required fullWidth />
            <TextField label={t("english_name")} value={form.tenantNameEn} onChange={handleChange("tenantNameEn")} fullWidth />
            {!isCreate && (
              <>
                <TextField label={t("email")} value={form.tenantEmail} onChange={handleChange("tenantEmail")} fullWidth />
                <TextField label={t("phone")} value={form.tenantPhone} onChange={handleChange("tenantPhone")} fullWidth />
                <TextField label={t("address")} value={form.tenantAddress} onChange={handleChange("tenantAddress")} fullWidth sx={{ gridColumn: { md: "1 / -1" } }} />
              </>
            )}
          </Box>

          {isCreate && (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonAddAltOutlinedIcon color="primary" />
                <Typography fontWeight={800}>{t("business_owner") || "Business Owner"}</Typography>
              </Stack>
              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
                <TextField label={t("khmer_name")} value={form.ownerNameKh} onChange={handleChange("ownerNameKh")} required fullWidth />
                <TextField label={t("english_name")} value={form.ownerNameEn} onChange={handleChange("ownerNameEn")} required fullWidth />
                <TextField label={t("email")} value={form.ownerEmail} onChange={handleChange("ownerEmail")} required fullWidth />
                <TextField label={t("phone")} value={form.ownerPhone} onChange={handleChange("ownerPhone")} required fullWidth />
                <TextField select label={t("gender")} value={form.ownerGender} onChange={handleChange("ownerGender")} fullWidth>
                  <MenuItem value="male">{t("male")}</MenuItem>
                  <MenuItem value="female">{t("female")}</MenuItem>
                </TextField>
                <TextField label={t("password")} type="password" value={form.ownerPassword} onChange={handleChange("ownerPassword")} required fullWidth />
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" fullWidth startIcon={<QueueOutlinedIcon />} onClick={handleSubmit} disabled={!canSave || saving}>
          {saving ? t("processing...") : isCreate ? t("create_tenant") || "Create Tenant" : t("update") || "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
