import { useMutation } from "@apollo/client/react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Check, ScanEye, X } from "lucide-react";
import { useState } from "react";

import {
  APPROVE_WAREHOUSE_REQUEST,
  REJECT_WAREHOUSE_REQUEST,
} from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import WarehouseRequestView from "./WarehouseRequestView";

export default function WarehouseRequestAction({ request, t, language, setRefetch }) {
  const { setAlert } = useAuth();
  const [openView, setOpenView] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [reason, setReason] = useState("");
  const [items, setItems] = useState(
    request.items.map((item) => ({
      subProductId: item.subProduct?._id,
      approvedQty: item.requestedQty,
    })),
  );

  const [approveWarehouseRequest, { loading: approving }] = useMutation(
    APPROVE_WAREHOUSE_REQUEST,
    {
      onCompleted: ({ approveWarehouseRequest }) => {
        if (approveWarehouseRequest?.isSuccess) {
          setAlert(true, "success", approveWarehouseRequest.message);
          setOpenApprove(false);
          setRefetch();
        } else {
          setAlert(true, "error", approveWarehouseRequest.message);
        }
      },
      onError: (error) => setAlert(true, "error", error.message),
    },
  );

  const [rejectWarehouseRequest, { loading: rejecting }] = useMutation(
    REJECT_WAREHOUSE_REQUEST,
    {
      onCompleted: ({ rejectWarehouseRequest }) => {
        if (rejectWarehouseRequest?.isSuccess) {
          setAlert(true, "success", rejectWarehouseRequest.message);
          setOpenReject(false);
          setRefetch();
        } else {
          setAlert(true, "error", rejectWarehouseRequest.message);
        }
      },
      onError: (error) => setAlert(true, "error", error.message),
    },
  );

  const updateApprovedQty = (subProductId, approvedQty) => {
    setItems((prev) =>
      prev.map((item) =>
        item.subProductId === subProductId
          ? { ...item, approvedQty: Number(approvedQty) }
          : item,
      ),
    );
  };

  const canProcess = request.status === "pending";
  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Tooltip title={t("view")}>
          <IconButton onClick={() => setOpenView(true)}>
            <ScanEye size={18} color="#36BBA7" />
          </IconButton>
        </Tooltip>
        {canProcess && (
          <>
            <Tooltip title={t("accept")}>
              <IconButton onClick={() => setOpenApprove(true)}>
                <Check size={18} color="#36BBA7" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("reject")}>
              <IconButton onClick={() => setOpenReject(true)}>
                <X size={18} color="red" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>

      <WarehouseRequestView
        open={openView}
        onClose={() => setOpenView(false)}
        request={request}
        language={language}
        t={t}
      />

      <Dialog open={openApprove} onClose={() => setOpenApprove(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t("accept")}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {request.items.map((item) => {
              const approvedQty =
                items.find((approveItem) => approveItem.subProductId === item.subProduct?._id)
                  ?.approvedQty || 0;
              const price = Number(item.subProduct?.costPrice || 0);

              return (
                <TextField
                  key={item.subProduct?._id}
                  label={
                    language === "kh"
                      ? item.subProduct?.parentProductId?.nameKh
                      : item.subProduct?.parentProductId?.nameEn
                  }
                  size="small"
                  type="number"
                  value={approvedQty}
                  helperText={`${t("quantity")}: ${item.requestedQty} | ${t("price")}: $${price.toFixed(2)} | ${t("total_price")}: $${(approvedQty * price).toFixed(2)}`}
                  onChange={(e) => updateApprovedQty(item.subProduct?._id, e.target.value)}
                />
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApprove(false)}>{t("cancel")}</Button>
          <Button
            variant="contained"
            disabled={approving}
            onClick={() =>
              approveWarehouseRequest({
                variables: { id: request._id, items },
              })
            }
          >
            {approving ? t("processing...") : t("transfer_product")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openReject} onClose={() => setOpenReject(false)} fullWidth maxWidth="xs">
        <DialogTitle>{t("reject")}</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            multiline
            minRows={2}
            label={t("remark")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReject(false)}>{t("cancel")}</Button>
          <Button
            color="error"
            variant="contained"
            disabled={rejecting}
            onClick={() =>
              rejectWarehouseRequest({
                variables: { id: request._id, reason },
              })
            }
          >
            {rejecting ? t("processing...") : t("reject")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
