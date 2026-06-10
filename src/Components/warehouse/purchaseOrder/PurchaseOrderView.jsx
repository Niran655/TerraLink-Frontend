import {
  Drawer,
  Stack,
  Typography,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  Chip,
  Paper,
} from "@mui/material";
import { X, Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "../../warehouseInShop/getProduct/invoice.scss";

export default function PurchaseOrderView({
  open,
  onClose,
  purchaseOrder,
  language,
  t,
}) {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  if (!purchaseOrder) return null;

  const supplierName =
    language === "en"
      ? purchaseOrder.supplier?.nameEn
      : purchaseOrder.supplier?.nameKh;

  const totalQty = purchaseOrder.items.reduce((sum, i) => sum + i.quantity, 0);

  const totalAmount = purchaseOrder.items.reduce(
    (sum, i) => sum + i.quantity * i.costPrice,
    0
  );

  return (
    <Drawer anchor="top" open={open} onClose={onClose}>
      <Box sx={{ height: "100vh", p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={600}>{t("purchase_order_invoice")}</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<Printer size={16} />}
              onClick={handlePrint}
            >
              {t("print")}
            </Button>
            <IconButton onClick={onClose}>
              <X />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ height: "calc(100% - 80px)" }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: 320 },
              p: 2,
              borderRight: "1px solid #eee",
            }}
          >
            <Typography fontWeight={600} mb={1}>
              {t("purchase_order_invoice")}
            </Typography>

            <InfoRow label={t("suppliers")} value={supplierName} />
            <InfoRow
              label={t("status")}
              value={<Chip size="small" label={purchaseOrder.status} />}
            />
            <InfoRow
              label={t("invoice_num")}
              value={purchaseOrder._id?.slice(-6)}
            />
            <InfoRow
              label={t("create_at")}
              value={new Date(purchaseOrder.createdAt).toLocaleString()}
            />
            <InfoRow
              label={t("received")}
              value={
                purchaseOrder.receivedAt
                  ? new Date(purchaseOrder.receivedAt).toLocaleString()
                  : "-"
              }
            />

            <Divider sx={{ my: 1 }} />

            <Typography fontWeight={600}>{t("remark")}</Typography>
            <Typography variant="body2" color="text.secondary">
              {purchaseOrder.remark || "-"}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              scrollbarWidth: "thin",
              p: 2,
            }}
          >
            <Paper
              ref={printRef}
              sx={{
                width: "210mm",
                minHeight: "297mm",
                margin: "auto",
                p: 3,
              }}
            >
              <Box
                sx={{
                  background: "#0077ff82",
                  color: "#fff",
                  p: 2,
                  borderRadius: 0.5,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography fontWeight={700}>{t("my_company")}</Typography>
                  <Typography variant="body2">
                    {t("invoice_num")}: {purchaseOrder._id?.slice(-6)}
                  </Typography>
                </Box>

                <Box textAlign="right">
                  <Typography variant="h5" fontWeight={700}>
                    {t("invoice")}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(purchaseOrder.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" justifyContent="space-between" mt={2}>
                <Box>
                  <Typography fontWeight={600}>{t("invoice_to")}</Typography>
                  <Typography>{supplierName || "-"}</Typography>
                </Box>

                <Box textAlign="right">
                  <Typography>
                    {t("status")}: {purchaseOrder.status}
                  </Typography>
                  <Typography>
                    {t("received")}:{" "}
                    {purchaseOrder.receivedAt
                      ? new Date(purchaseOrder.receivedAt).toLocaleDateString()
                      : "-"}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("no")}</TableCell>
                    <TableCell>{t("product")}</TableCell>
                    <TableCell align="right">{t("quantity")}</TableCell>
                    <TableCell align="right">{t("received")}</TableCell>
                    <TableCell align="right">{t("price")}</TableCell>
                    <TableCell align="right">{t("total_price")}</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {purchaseOrder.items.map((item, index) => {
                    const price = item.costPrice || 0;
                    const total = item.quantity * price;

                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {language === "en"
                            ? item.subProduct?.parentProductId?.nameEn || "-"
                            : item.subProduct?.parentProductId?.nameKh || "-"}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{item.receivedQty}</TableCell>
                        <TableCell align="right">${price.toFixed(2)}</TableCell>
                        <TableCell align="right">${total.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Divider sx={{ my: 2 }} />

              <Stack alignItems="flex-end" spacing={0.5}>
                <Typography>
                  {t("total_qty")}: {totalQty}
                </Typography>
                <Typography variant="h6">
                  {t("total_price")}: ${totalAmount.toFixed(2)}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" mt={6}>
                <Box textAlign="center">
                  <Typography>{t("suppliers")}</Typography>
                  <Box mt={4}>____________</Box>
                </Box>

                <Box textAlign="center">
                  <Typography>{t("accepted_by")}</Typography>
                  <Box mt={4}>____________</Box>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Box>
    </Drawer>
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
