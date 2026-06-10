import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Printer, X } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "../warehouseInShop/getProduct/invoice.scss";

export default function WarehouseRequestView({
  open,
  onClose,
  request,
  language,
  t,
}) {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  if (!request) return null;

  const {
    toShop,
    status,
    requestedBy,
    approvedBy,
    remark,
    createdAt,
    approvedAt,
    dateWantGetProduct,
    items = [],
  } = request;

  const shopName = language === "kh" ? toShop?.nameKh : toShop?.nameEn;
  const requestedByName =
    language === "kh" ? requestedBy?.nameKh : requestedBy?.nameEn;
  const approvedByName =
    language === "kh" ? approvedBy?.nameKh : approvedBy?.nameEn;
  const totalQty = items.reduce(
    (sum, item) => sum + Number(item.requestedQty || 0),
    0,
  );
  const totalApprovedQty = items.reduce(
    (sum, item) => sum + Number(item.approvedQty || 0),
    0,
  );
  const totalAmount = items.reduce(
    (sum, item) =>
      sum +
      Number(item.requestedQty || 0) * Number(item.subProduct?.costPrice || 0),
    0,
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
          <Typography fontWeight={600}>{t("request_to_warehouse")}</Typography>

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
              {t("request_to_warehouse")}
            </Typography>

            <InfoRow label={t("shop_kh")} value={toShop?.nameKh} />
            <InfoRow label={t("shop_en")} value={toShop?.nameEn} />
            <InfoRow
              label={t("status")}
              value={<Chip size="small" label={t(status)} />}
            />
            <InfoRow label={t("send_by")} value={requestedByName} />
            <InfoRow label={t("accepted_by")} value={approvedByName} />
            <InfoRow
              label={t("date_want_get_product")}
              value={
                dateWantGetProduct
                  ? new Date(dateWantGetProduct).toLocaleDateString()
                  : "-"
              }
            />
            <InfoRow
              label={t("create_at")}
              value={createdAt ? new Date(createdAt).toLocaleString() : "-"}
            />
            <InfoRow
              label={t("accepted_at")}
              value={approvedAt ? new Date(approvedAt).toLocaleString() : "-"}
            />

            <Divider sx={{ my: 1 }} />

            <Typography fontWeight={600}>{t("remark")}</Typography>
            <Typography variant="body2" color="text.secondary">
              {remark || "-"}
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
                    {t("invoice_num")}: {request._id?.slice(-6)}
                  </Typography>
                </Box>

                <Box textAlign="right">
                  <Typography variant="h5" fontWeight={700}>
                    {t("invoice")}
                  </Typography>
                  <Typography variant="body2">
                    {createdAt ? new Date(createdAt).toLocaleDateString() : "-"}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" justifyContent="space-between" mt={2}>
                <Box>
                  <Typography fontWeight={600}>{t("invoice_to")}</Typography>
                  <Typography>{shopName || "-"}</Typography>
                </Box>

                <Box textAlign="right">
                  <Typography>
                    {t("send_by")}: {requestedByName || "-"}
                  </Typography>
                  <Typography>
                    {t("accepted_by")}: {approvedByName || "-"}
                  </Typography>
                  <Typography>
                    {t("date_want_get_product")}:{" "}
                    {dateWantGetProduct
                      ? new Date(dateWantGetProduct).toLocaleDateString()
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
                    <TableCell align="right">{t("accepted")}</TableCell>
                    <TableCell align="right">{t("price")}</TableCell>
                    <TableCell align="right">{t("total_price")}</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items.map((item, index) => {
                    const price = Number(item.subProduct?.costPrice || 0);
                    const total = Number(item.requestedQty || 0) * price;

                    return (
                      <TableRow key={item.subProduct?._id || index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {language === "kh"
                            ? item.subProduct?.parentProductId?.nameKh || "-"
                            : item.subProduct?.parentProductId?.nameEn || "-"}
                        </TableCell>
                        <TableCell align="right">{item.requestedQty || 0}</TableCell>
                        <TableCell align="right">{item.approvedQty || 0}</TableCell>
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
                <Typography>
                  {t("accepted")}: {totalApprovedQty}
                </Typography>
                <Typography variant="h6">
                  {t("total_price")}: ${totalAmount.toFixed(2)}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" mt={6}>
                <Box textAlign="center">
                  <Typography>{t("send_by")}</Typography>
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
