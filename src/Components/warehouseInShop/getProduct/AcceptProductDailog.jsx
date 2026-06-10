import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CircleX } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ACCEPT_WAREHOUSE_TRANSFER } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";

export default function AcceptProductDialog({
  open,
  onClose,
  t,
  item,
  language,
  editData,
  refetch,
  productWarehouseInShopRefetch
}) {
  const { setAlert } = useAuth();

  const remainingQty = (item?.quantity || 0) - (item?.receivedQty || 0);

  const [acceptWarehouseTransfer, { loading }] = useMutation(
    ACCEPT_WAREHOUSE_TRANSFER,
    {
      onCompleted: ({ acceptWarehouseTransfer }) => {
        if (acceptWarehouseTransfer?.isSuccess) {
          setAlert(true, "success", acceptWarehouseTransfer?.message);
          refetch();
          productWarehouseInShopRefetch();
          onClose();
        }
      },
    }
  );

  const validationSchema = Yup.object({
    receivedQty: Yup.number()
      .required(t("require"))
      .min(1, t("must_be_greater_than_zero"))
      .max(remainingQty, t("exceed_available_qty")),
  });

  const formik = useFormik({
    initialValues: {
      receivedQty: remainingQty,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await acceptWarehouseTransfer({
          variables: {
            transferId: editData?._id,
            items: [
              {
                subProductId: item?.subProduct?._id,
                receivedQty: Number(values.receivedQty),
              },
            ],
          },
        });
      } catch (error) {
        console.error("Accept transfer error:", error);
      }
    },
  });

  return (
    <Dialog
      open={open}
      className="dialog-container"
      PaperProps={{
        style: {
          width: "1000px",
          borderRadius: "8px",
        },
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between">
            <Typography className="dialog-title">
              {t("confirm_getting_product")}
            </Typography>
            <IconButton onClick={onClose}>
              <CircleX />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Box mt={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <img
                src={item?.productImg || item?.subProduct?.productImg}
                alt={item?.productNameEn || item?.subProduct?.nameEn}
                width={50}
                height={50}
              />
              <Box>
                {language === "en"
                  ? item?.productNameEn || item?.subProduct?.parentProductId?.nameEn
                  : item?.productNameKh || item?.subProduct?.parentProductId?.nameKh}
              </Box>
            </Stack>

            <Typography variant="body2" mt={1}>
              {t("product_would_be_to_accept")} :{" "}
              <b>{remainingQty}</b>
            </Typography>

            <TextField
              fullWidth
              name="receivedQty"
              type="number"
              margin="normal"
              size="small"
              value={formik.values.receivedQty}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.receivedQty &&
                Boolean(formik.errors.receivedQty)
              }
              helperText={
                formik.touched.receivedQty &&
                formik.errors.receivedQty
              }
              inputProps={{
                min: 1,
                max: remainingQty,
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading || !formik.isValid}
          >
            <Typography className="txt-btn">
              {loading ? t("processing") : t("approve")}
            </Typography>
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
