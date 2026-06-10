import { Button, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { CircleX } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../Context/AuthContext";
import { translateLauguage } from "../../function/translate";
export default function UseDeleteForm({ open, onClose, handleDelete, loading }) {
  const [confirmationText, setConfirmationText] = useState("");
  const { language } = useAuth();
  const { t } = translateLauguage(language);

 
  const isValid =
    confirmationText.trim().toLowerCase() === "delete" ||
    confirmationText.trim() === "លុប";

  const onDeleteClick = () => {
    if (!isValid) return;
    handleDelete();
    setConfirmationText("");
  };

  return (
    <Dialog
      open={open}

      PaperProps={{ style: { width: 410, borderRadius: 8 } }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography>{t("delete")}</Typography>
          <IconButton onClick={onClose}>
            <CircleX className="dialog-close-icon" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>
          <Stack spacing={1} pb="15px">
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>{t("delete_input")}</Typography>
              <Typography color="error" className="txt-delete-confirm">{t("delete")}</Typography>
              <Typography>{t("delete_to_confirm")}</Typography>
            </Stack>
          </Stack>

          <Stack spacing={2} mt={1}>
            <TextField
              fullWidth
              size="small"
              value={confirmationText}
              placeholder={`${t("delete_input")} ${t("delete")}`}
              onChange={(e) => setConfirmationText(e.target.value)}
              disabled={loading}
            />
            <Button
              fullWidth
              color="error"
              variant="contained"
              onClick={onDeleteClick}
              disabled={loading || !isValid}
            >
              {loading ? <CircularProgress size={20} /> : t("delete")}
            </Button>
          </Stack>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
