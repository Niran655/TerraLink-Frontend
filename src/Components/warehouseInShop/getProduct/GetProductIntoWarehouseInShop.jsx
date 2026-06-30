import { useMutation } from "@apollo/client/react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "../../../Styles/TableStyle.scss";
import { REJECT_WAREHOUSE_TRANSFER, ACCEPT_WAREHOUSE_TRANSFER } from "../../../../graphql/mutation";
import EmptyData from "../../../include/EmptyData";
import CircularIndeterminate from "../../../include/Loading";
import GetProductAction from "./GetProductAction";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "accepted":
      return "success";
    case "rejected":
      return "error";
    case "partial_accepted":
      return "info";
    case "cancelled":
      return "default";
    default:
      return "default";
  }
};

export default function GetProductIntoWarehouseInShop({
  open,
  onClose,
  editData,
  t,
  language,
  loading,
  refetch,
  productWarehouseInShopRefetch
}) {
  const [acceptWarehouseTransfer] = useMutation(ACCEPT_WAREHOUSE_TRANSFER);
  const [rejectWarehouseTransfer] = useMutation(REJECT_WAREHOUSE_TRANSFER);

  const [quantities, setQuantities] = useState({});
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const {
    toShop,
    status,
    requestedBy,
    acceptedBy,
    remark,
    createdAt,
    acceptedAt,
    items = [],
    receivedHistory = [],
  } = editData || {};

  const historyEntries = receivedHistory?.length
    ? receivedHistory
    : acceptedBy && acceptedAt
      ? [
          {
            _id: "accepted-history",
            receivedBy: acceptedBy,
            receivedAt: acceptedAt,
            items: items
              .filter((item) => item?.receivedQty > 0)
              .map((item) => ({
                subProduct: item?.subProduct,
                receivedQty: item?.receivedQty,
              })),
          },
        ]
      : [];

  const getHistorySubProduct = (historyItem) => {
    const subProductId =
      historyItem?.subProductId || historyItem?.subProduct?._id || historyItem?.subProduct;
    return (
      historyItem?.subProduct?.parentProductId
        ? historyItem.subProduct
        : items.find((item) => item?.subProduct?._id === subProductId)?.subProduct
    );
  };

  const isPending = status === "pending";
  const isPartialAccepted = status === "partial_accepted";
  const isFinalStatus = ["accepted", "rejected", "cancelled"].includes(status);

  const canAcceptAll = isPending || isPartialAccepted;
  const canRejectAll = isPending || isPartialAccepted;

  useEffect(() => {
    if (items?.length) {
      const initialQuantities = {};
      items.forEach((item, index) => {
        initialQuantities[index] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [items]);

  if (!editData) return null;

  const handleAcceptAll = async () => {
    try {
      const itemsPayload = items.map((item) => ({
        subProductId: item.subProduct?._id,
        receivedQty: item.remainingQty ?? item.quantity,
      }));

      await acceptWarehouseTransfer({
        variables: {
          transferId: editData?._id,
          items: itemsPayload,
        },
      });

      refetch();
      productWarehouseInShopRefetch();
      onClose();
    } catch (error) {
      console.error("Accept all error:", error);
    }
  };


  const handleOpenReject = () => {
    setRejectReason("");
    setOpenRejectDialog(true);
  };


  const handleConfirmReject = async () => {
    try {
      await rejectWarehouseTransfer({
        variables: {
          transferId: editData?._id,
          reason: rejectReason,
        },
      });

      refetch();
      setOpenRejectDialog(false);
      onClose();
    } catch (error) {
      console.error("Reject error:", error);
    }
  };

  return (
    <>
      <Drawer anchor="top" open={open} onClose={onClose}>
        <Box sx={{ height: "100vh", p: 2 }}>

          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              {t(`get_product_transfer`)}
            </Typography>
            <IconButton onClick={onClose}>
              <X />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ height: "calc(100% - 80px)" }}>


            <Box sx={{ width: { xs: "100%", md: 320 }, borderRadius: 2, p: 2 }}>

              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                {t(`transfer_information`)}
              </Typography>

              <InfoRow label="Shop (KH)" value={toShop?.nameKh} />
              <InfoRow label="Shop (EN)" value={toShop?.nameEn} />

              <InfoRow
                label="Status"
                value={
                  <Chip
                    size="small"
                    label={t(`${status}`)}
                    color={getStatusColor(status)}
                    sx={{ fontWeight: 600 }}
                  />
                }
              />

              <InfoRow label="Requested By" value={requestedBy?.nameEn || requestedBy?.nameKh} />
              <InfoRow label="Accepted By" value={acceptedBy?.nameEn || "-"} />
              <InfoRow label="Created At" value={new Date(createdAt).toLocaleString()} />
              <InfoRow label="Accepted At" value={acceptedAt ? new Date(acceptedAt).toLocaleString() : "-"} />

              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle2" fontWeight={600}>
                {t(`remark`)}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {remark || "-"}
              </Typography>

              <Stack spacing={2} mt={4}>
                {!isFinalStatus && (
                  <>

                    {canRejectAll && (
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={handleOpenReject}
                      >
                        {t("reject_all_product")}
                      </Button>
                    )}

                    {canAcceptAll && (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleAcceptAll}
                      >
                        {t("confirm_getting_all_product")}
                      </Button>
                    )}
                  </>
                )}

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setOpenHistoryDialog(true)}
                  disabled={historyEntries.length === 0}
                >
                  {t("history_product_received")}
                </Button>
              </Stack>

            </Box>


            <Box sx={{ flex: 1, overflow: "hidden" }}>
              <TableContainer className="table-container">
                <Table stickyHeader className="table">

                  <TableHead className="table-header">
                    <TableRow>
                      <TableCell>{t(`no`)}</TableCell>
                      <TableCell>{t(`product`)}</TableCell>
                      <TableCell>{t(`price_in_unit`)}</TableCell>
                      <TableCell>{t(`quantity`)}</TableCell>
                      <TableCell>{t(`total_price`)}</TableCell>
                      <TableCell>{t(`product_received_qty`)}</TableCell>
                      <TableCell>{t(`remaining_goods`)}</TableCell>
                      <TableCell align="right">{t(`action`)}</TableCell>
                    </TableRow>
                  </TableHead>

                  {loading ? (
                    <CircularIndeterminate cols={8} />
                  ) : items.length === 0 ? (
                    <EmptyData />
                  ) : (
                    <TableBody>

                      {items.map((row, index) => (
                        <TableRow className="table-row" key={index}>

                          <TableCell>{index + 1}</TableCell>

                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">

                              <img
                                src={row.productImg || row.subProduct?.productImg}
                                alt={row.productNameEn || row.subProduct?.nameEn}
                                width={50}
                                height={50}
                              />

                              <Box>
                                {language === "en"
                                  ? row.productNameEn || row.subProduct?.parentProductId?.nameEn
                                  : row.productNameKh || row.subProduct?.parentProductId?.nameKh}
                              </Box>

                            </Stack>
                          </TableCell>

                          <TableCell>$ {row.costPrice || row.subProduct?.costPrice}</TableCell>

                          <TableCell>
                            {quantities[index] || 0}{" "}
                            {language === "en"
                              ? row.unitNameEn || row.subProduct?.unitId?.nameEn
                              : row.unitNameKh || row.subProduct?.unitId?.nameKh}
                          </TableCell>

                          <TableCell>
                            ${(quantities[index] || 0) * (row.costPrice ? parseFloat(row.costPrice.toFixed(2)) : 0) || row.subProduct?.costPrice || 0}
                          </TableCell>

                          <TableCell>{row?.receivedQty || 0}</TableCell>
                          <TableCell>{row?.remainingQty || 0}</TableCell>

                          <TableCell align="right">
                            <GetProductAction
                              language={language}
                              item={row}
                              editData={editData}
                              t={t}
                              refetch={refetch}
                              productWarehouseInShopRefetch={productWarehouseInShopRefetch}
                            />
                          </TableCell>

                        </TableRow>
                      ))}

                    </TableBody>
                  )}

                </Table>
              </TableContainer>
            </Box>

          </Stack>
        </Box>
      </Drawer>


      <Dialog open={openRejectDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t("reject_transfer")}
          <IconButton
            aria-label="close"
            onClick={() => setOpenRejectDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            placeholder={t("reason")}
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleConfirmReject}
          >
            {t("confirm_reject")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openHistoryDialog}
        onClose={() => setOpenHistoryDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t("history_product_received")}
          <IconButton
            aria-label="close"
            onClick={() => setOpenHistoryDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <TableContainer className="table-container">
            <Table size="small" className="table">
              <TableHead className="table-header">
                <TableRow>
                  <TableCell>{t("no")}</TableCell>
                  <TableCell>{t("received_at")}</TableCell>
                  <TableCell>{t("received_by")}</TableCell>
                  <TableCell>{t("product")}</TableCell>
                  <TableCell align="right">{t("quantity")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyEntries.flatMap((history, historyIndex) =>
                  (history?.items?.length ? history.items : [{}]).map((item, itemIndex) => {
                    const subProduct = getHistorySubProduct(item);

                    return (
                      <TableRow key={`${history?._id || historyIndex}-${itemIndex}`}>
                        <TableCell>{historyIndex + 1}</TableCell>
                        <TableCell>
                          {history?.receivedAt
                            ? new Date(history.receivedAt).toLocaleString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {language === "kh"
                            ? history?.receivedBy?.nameKh || history?.receivedBy?.nameEn || "-"
                            : history?.receivedBy?.nameEn || history?.receivedBy?.nameKh || "-"}
                        </TableCell>
                        <TableCell>
                          {language === "kh"
                            ? subProduct?.parentProductId?.nameKh || item?.productNameKh || "-"
                            : subProduct?.parentProductId?.nameEn || item?.productNameEn || "-"}
                        </TableCell>
                        <TableCell align="right">{item?.receivedQty || "-"}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

    </>
  );
}

function InfoRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" mb={0.5}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || "-"}
      </Typography>
    </Stack>
  );
}
