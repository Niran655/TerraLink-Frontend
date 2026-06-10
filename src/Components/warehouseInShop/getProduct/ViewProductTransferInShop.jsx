import {
  Box,
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
  Typography,
  Button,
  Paper,
} from "@mui/material";
import { X, Printer } from "lucide-react";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "./invoice.scss"
export default function ViewProductTransferInShop({
  open,
  onClose,
  viewData,
  t,
  language,
}) {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef, 
  });

  if (!viewData) return null;

  const {
    toShop,
    status,
    requestedBy,
    acceptedBy,
    remark,
    createdAt,
    acceptedAt,
    items = [],
  } = viewData;

 
  const totalAmount = items.reduce(
    (sum, row) =>
      sum + row.quantity * (row.subProduct?.costPrice || 0),
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
          <Typography   fontWeight={600}>
            {t("view_product_transfer_detail")}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<Printer size={16} />}
              onClick={handlePrint}
            >
              {t(`print`)}
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
              {t("transfer_information")}
            </Typography>

            <InfoRow label={t("shop_kh")} value={toShop?.nameKh} />
            <InfoRow label={t("shop_en")} value={toShop?.nameEn} />

            <InfoRow
              label={t("status")}
              value={<Chip size="small" label={status} />}
            />

            <InfoRow
              label={t(`send_by`)}  
              value={requestedBy?.nameEn || requestedBy?.nameKh}
            />

            <InfoRow
              label={t("accepted_by")}
              value={acceptedBy?.nameEn || "-"}
            />

            <InfoRow
              label={t("create_at")}
              value={new Date(createdAt).toLocaleString()}
            />

            <InfoRow
              label={t("accepted_at")}
              value={
                acceptedAt
                  ? new Date(acceptedAt).toLocaleString()
                  : "-"
              }
            />

            <Divider sx={{ my: 1 }} />

            <Typography fontWeight={600}>
              {t("remark")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {remark || "-"}
            </Typography>
          </Box>

          
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              scrollbarWidth:"thin",
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
                  borderRadius:0.5,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography fontWeight={700}>
                    {t("my_company")}
                  </Typography>
            
                </Box>

                <Box textAlign="right">
                  <Typography variant="h5" fontWeight={700}>
                    {t("invoice")}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

           
              <Stack
                direction="row"
                justifyContent="space-between"
                mt={2}
              >
                <Box>
                  <Typography fontWeight={600}>
                    {t("invoice_to")}
                  </Typography>
                  <Typography>
                    {language === "kh"
                      ? toShop?.nameKh
                      : toShop?.nameEn}
                  </Typography>
                </Box>

                <Box textAlign="right">
                  <Typography>
                    {t("send_by")}: {language === "en" ? requestedBy?.nameEn : requestedBy?.nameKh}
                  </Typography>
                  <Typography>
                    {t("accepted_by")}: {language === "en" ? acceptedBy?.nameEn : acceptedBy?.nameKh || "-"}
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
                    <TableCell align="right">{t("price")}</TableCell>
                    <TableCell align="right">{t("total_price")}</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items.map((row, index) => {
                    const price =
                      row.costPrice || row.subProduct?.costPrice || 0;
                    const total = row.quantity * price;

                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>

                        <TableCell>
                          {language === "en"
                            ? row.productNameEn || row.subProduct?.parentProductId
                                ?.nameEn
                            : row.productNameKh || row.subProduct?.parentProductId
                                ?.nameKh}
                        </TableCell>

                        <TableCell align="right">
                          {row.quantity}
                        </TableCell>

                        <TableCell align="right">
                          ${price.toFixed(2)}
                        </TableCell>

                        <TableCell align="right">
                          ${total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Divider sx={{ my: 2 }} />

        
              <Stack alignItems="flex-end">
                <Typography variant="h6">
                  {t("total_price")}: ${totalAmount.toFixed(2)}
                </Typography>
              </Stack>

     
              <Stack
                direction="row"
                justifyContent="space-between"
                mt={6}
              >
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
