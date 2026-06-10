import { useMutation } from "@apollo/client/react";
import { Button, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import { CircleX } from "lucide-react";
import { useState } from "react";

import "../../Styles/dialogStyle.scss";
import { DELETE_SHOP } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import { deleteImageFromStorage } from "../../utils/supabaseImageStorage";

export default function ShopDelete({
  open,
  onClose,
  shopId,
  shopName,
  imageUrl,
  setRefetch,
  t, 
}) {
 
  const [confirmationText, setConfirmationText] = useState("");
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);

  const [deleteShop] = useMutation(DELETE_SHOP, {
    onCompleted: async ({ deleteShop }) => {
      setLoading(false);
      if (deleteShop?.isSuccess) {
        if (imageUrl) await deleteImageFromStorage(imageUrl).catch(console.error);
        onClose?.();
        setAlert(true, "success", deleteShop?.message);
        setRefetch();
        setConfirmationText("");
      } else {
        setAlert(true, "error", deleteShop?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      console.error("Error", error);
      setAlert(true, "error", t("delete_failed"));
    },
  });

  const handleDelete = () => {
    if (confirmationText !== (shopName ?? "")) {
      setAlert(true, "error", t("confirmation_text_not_match"));
      return;
    }
    if (!shopId) {
      setAlert(true, "error", t("user_id_missing"));
      return;
    }

    setLoading(true);
    deleteShop({
      variables: { id: shopId },
    });
  };

  return (
    <Dialog
      open={open}
      className="dialog-container"
      PaperProps={{
        style: {
          position: "absolute",
          width: "410px",
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems={"center"}>
          <Typography >{t("delete")}</Typography>
          <IconButton onClick={onClose}>
            <CircleX className="dialog-close-icon" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>
          <Stack margin="0px 0px 20px 0px">
            <Grid container spacing={3}>
              <Grid size={{xs:12}}>
                <Stack spacing={1} pb="15px">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography >{t("delete_input")}</Typography>
                    <Typography className="txt-delete-confirm">{shopName}</Typography>
                    <Typography >{t("delete_to_confirm")}</Typography>
                  </Stack>
                </Stack>
                <TextField
                  className="input-field-action"
                  fullWidth
                  size="small"
                  value={confirmationText}
                  placeholder={t("delete_input")}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  disabled={loading}
                  autoComplete="off"
                />
              </Grid>
              <Grid size={{xs:12}}>
                <Button
                  className="btn-delete"
                  fullWidth
                  onClick={handleDelete}
                  disabled={loading || confirmationText !== (shopName ?? "")}
                >
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Typography className="txt-btn">{t("delete")}</Typography>
                  )}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
