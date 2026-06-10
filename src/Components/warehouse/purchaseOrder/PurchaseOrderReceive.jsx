import {
  Drawer,
  Stack,
  Typography,
  Divider,
  IconButton,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import { X } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { RECEIVE_PURCHASE_ORDER } from "../../../../graphql/mutation";
import { useState, useMemo } from "react";
import { useAuth } from "../../../Context/AuthContext";

export default function PurchaseOrderReceive({
  open,
  onClose,
  purchaseOrder,
  t,
  language,
  setRefetch,
}) {
  const { setAlert } = useAuth();

  const [items, setItems] = useState(
    purchaseOrder.items.map((i) => ({
      subProductId: i.subProduct._id,
      remainingQty: i.remainingQty,
      receivedQty: i.remainingQty,
    }))
  );

  const [receivePurchaseOrder, { loading }] = useMutation(
    RECEIVE_PURCHASE_ORDER,
    {
      onCompleted: (res) => {
        if (res?.receivePurchaseOrder?.isSuccess) {
          const msg =
            language === "en"
              ? res.receivePurchaseOrder.message.messageEn
              : res.receivePurchaseOrder.message.messageKh;

          setAlert(true, "success", msg);
          setRefetch();
          onClose();
        }
      },
    }
  );

   
  const updateQty = (index, value) => {
    const qty = Math.max(
      0,
      Math.min(Number(value), items[index].remainingQty)
    );

    const newItems = [...items];
    newItems[index].receivedQty = qty;
    setItems(newItems);
  };

  const canSubmit = useMemo(
    () => items.some((i) => i.receivedQty > 0),
    [items]
  );

  const handleReceive = () => {
    receivePurchaseOrder({
      variables: {
        purchaseOrderId: purchaseOrder._id,
        items: items.map((i) => ({
          subProductId: i.subProductId,
          receivedQty: i.receivedQty,
        })),
      },
    });
  };

 
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 660 } }}
    >
      <Stack p={3} spacing={2}>
      
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">
            {t("receive_purchase_order")}
          </Typography>
          <IconButton onClick={onClose}>
            <X />
          </IconButton>
        </Stack>

        <Divider />

   
        <Stack spacing={0.5}>
          <Typography>
            <b>{t("suppliers")}:</b>{" "}
            {language === "en"
              ? purchaseOrder.supplier?.nameEn
              : purchaseOrder.supplier?.nameKh}
          </Typography>
          <Typography>
            <b>{t("status")}:</b> {purchaseOrder.status}
          </Typography>
        </Stack>

        <Divider />

 
        <Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t(`no`)}</TableCell>
                <TableCell>{t("product")}</TableCell>
                <TableCell align="right">{t("ordered")}</TableCell>
                <TableCell align="right">{t("remaining")}</TableCell>
                <TableCell align="right">{t("receive_now")}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {purchaseOrder.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {language === "en"
                      ? item.subProduct.parentProductId.nameEn
                      : item.subProduct.parentProductId.nameKh}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{item.remainingQty}</TableCell>
                  <TableCell align="right">
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{
                        min: 0,
                        max: item.remainingQty,
                        style: { textAlign: "right", width: 80 },
                      }}
                      value={items[index].receivedQty}
                      onChange={(e) =>
                        updateQty(index, e.target.value)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Divider />

       
        <Button
          fullWidth
          variant="contained"
          onClick={handleReceive}
          disabled={loading || !canSubmit}
        >
          {loading ? t("processing") : t("confirm_receive")}
        </Button>
      </Stack>
    </Drawer>
  );
}