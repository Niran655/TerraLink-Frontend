import { useMutation, useQuery } from "@apollo/client/react";
import { Box, Button, Card, Chip, Grid, Stack, Typography } from "@mui/material";
import { Bell, CheckCircle, XCircle } from "lucide-react";

import { ACCEPT_CUSTOMER_ORDER, REJECT_CUSTOMER_ORDER } from "../../../graphql/mutation";
import { GET_CUSTOMER_ORDERS } from "../../../graphql/queries";
import { useAuth } from "../../Context/AuthContext";
import { translateLauguage } from "../../function/translate";

const CustomerOrderNotifications = ({ shopId, onAcceptToCart }) => {
  const { setAlert, language } = useAuth();
  const { t } = translateLauguage(language);
  const { data, refetch } = useQuery(GET_CUSTOMER_ORDERS, {
    variables: { shopId, status: "pending", limit: 10 },
    skip: !shopId,
    pollInterval: 5000,
    fetchPolicy: "cache-and-network",
  });

  const orderTypeLabel = {
    dine_in: t("dine_in"),
    take_away: t("take_away"),
    delivery: t("delivery"),
  };

  const [acceptOrder, { loading: accepting }] = useMutation(ACCEPT_CUSTOMER_ORDER, {
    onError: (error) => setAlert(true, "error", { messageEn: error.message, messageKh: error.message }),
  });

  const [rejectOrder, { loading: rejecting }] = useMutation(REJECT_CUSTOMER_ORDER, {
    onCompleted: ({ rejectCustomerOrder }) => {
      if (rejectCustomerOrder?.isSuccess) {
        setAlert(true, "info", rejectCustomerOrder.message);
        refetch();
      } else {
        setAlert(true, "error", rejectCustomerOrder?.message);
      }
    },
    onError: (error) => setAlert(true, "error", { messageEn: error.message, messageKh: error.message }),
  });

  const orders = data?.getCustomerOrders || [];
  if (!orders.length) return null;

  const handleAccept = async (order) => {
    const result = await acceptOrder({ variables: { id: order._id } });
    const response = result?.data?.acceptCustomerOrder;

    if (response?.isSuccess) {
      setAlert(true, "success", response.message);
      onAcceptToCart?.(order);
      refetch();
    } else {
      setAlert(true, "error", response?.message);
    }
  };

  return (
    <Box mb={3}>
      <Stack direction="row" alignItems="center" spacing={1.25} mb={1.5}>
        <Bell size={18} />
        <Typography fontWeight={800}>{t("recent_orders")}</Typography>
        <Chip size="small" color="primary" label={orders.length} />
      </Stack>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid key={order._id} size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 2, borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                <Box>
                  <Typography fontWeight={800}>#{order.orderNumber}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.customerName || "Customer"} {order.customerPhone ? `- ${order.customerPhone}` : ""}
                  </Typography>
                </Box>
                <Chip size="small" label={orderTypeLabel[order.orderType] || order.orderType} />
              </Stack>

              <Box sx={{ my: 1.5 }}>
                {(order.items || []).slice(0, 3).map((item) => (
                  <Typography key={`${order._id}-${item.subProductId}-${item.name}`} variant="body2">
                    {item.quantity}x {item.name} - ${Number(item.total || 0).toFixed(2)}
                  </Typography>
                ))}
                {(order.items || []).length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                    +{order.items.length - 3} {t("items")}
                  </Typography>
                )}
              </Box>

              {order.specialInstructions && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  {t("remark")}: {order.specialInstructions}
                </Typography>
              )}

              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                <Typography fontWeight={800}>${Number(order.total || 0).toFixed(2)}</Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    startIcon={<XCircle size={16} />}
                    disabled={rejecting || accepting}
                    onClick={() => rejectOrder({ variables: { id: order._id, reason: "Rejected by shop" } })}
                  >
                    {t("reject")}
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<CheckCircle size={16} />}
                    disabled={accepting || rejecting}
                    onClick={() => handleAccept(order)}
                  >
                    {t("accept")}
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CustomerOrderNotifications;
