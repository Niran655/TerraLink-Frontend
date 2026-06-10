import {
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { CircleX } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";

import { CANCEL_PURCHASE_ORDER } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import { translateLauguage } from "../../../function/translate";


export default function PurchaseOrderCancelForm({
    open,
    onClose,
    purchaseOrder,
    setRefetch,
}) {
    const { language, setAlert } = useAuth();
    const { t } = translateLauguage(language);

    const [confirmationText, setConfirmationText] = useState("");
    const [reason, setReason] = useState("");

    const isValid =
        confirmationText.trim().toLowerCase() === "cancel" ||
        confirmationText.trim() === "បោះបង់";

    const [cancelPurchaseOrder, { loading }] = useMutation(
        CANCEL_PURCHASE_ORDER,
        {
            onCompleted: (res) => {
                if (res?.cancelPurchaseOrder?.isSuccess) {
                    const msg =
                        language === "en"
                            ? res.cancelPurchaseOrder.message.messageEn
                            : res.cancelPurchaseOrder.message.messageKh;

                    setAlert(true, "success", msg);
                    setRefetch();
                    onClose();
                    setConfirmationText("");
                    setReason("");
                }else{
                    setAlert(true, "error", res?.cancelPurchaseOrder?.message);
                }
            },
            onError: (err) => {
                setAlert(true, "error", err.message);
            }
        }
    );

    const onCancelClick = () => {
        if (!isValid) return;

        cancelPurchaseOrder({
            variables: {
                id: purchaseOrder._id,
                reason,
            },
        });
    };

    return (
        <Dialog
            open={open}
            PaperProps={{ style: { width: 420, borderRadius: 8 } }}
        >
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography color="error">
                        {t("cancel_purchase_order")}
                    </Typography>
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
                            <Typography>{t("type")}</Typography>
                            <Typography color="error" className="txt-delete-confirm">
                                {t("cancel")}
                            </Typography>
                            <Typography>{t("to_confirm")}</Typography>
                        </Stack>
                    </Stack>


                    <TextField
                        fullWidth
                        size="small"
                        value={confirmationText}
                        placeholder={`${t("type")} ${t("cancel")}`}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        disabled={loading}
                    />


                    <Stack mt={2}>
                          <Typography>{t("reason")}</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            multiline
                            minRows={3}
                            placeholder={t("reason")}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={loading}
                        />
                    </Stack>


                    <Stack spacing={2} mt={2}>
                        <Button
                            fullWidth
                            color="error"
                            variant="contained"
                            onClick={onCancelClick}
                            disabled={loading || !isValid}
                        >
                            {loading ? <CircularProgress size={20} /> : t("confirm_cancel")}
                        </Button>
                    </Stack>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}