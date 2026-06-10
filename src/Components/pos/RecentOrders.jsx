import React, { useRef } from "react";

import {
  Grid,
  Card,
  Typography,
  Chip,
  Box,
  Stack,
  Button,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { Timer, ArrowRight, ArrowLeft } from "lucide-react";

const orders = [
  {
    id: "65698",
    customer: "Liam O'Connor",
    type: "Dine-in Table",
    time: "11:10 AM",
    table: "Table 1",
    elapsed: 45,
    estimated: 33,
  },
  {
    id: "96589",
    customer: "Sophia Kim",
    type: "Delivery",
    time: "11:20 AM",
    elapsed: 22,
    estimated: 70,
  },
  {
    id: "14589",
    customer: "James Smith",
    type: "Delivery",
    time: "11:30 AM",
    elapsed: 12,
    estimated: 20,
  },
  {
    id: "5753",
    customer: "James Smith",
    type: "Delivery",
    time: "11:30 AM",
    elapsed: 12,
    estimated: 20,
  },
];

const RecentOrders = ({ selectedOrderType, setSelectedOrderType, t }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -300,
      behavior: "smooth"
    })
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 300,
      behavior: "smooth"
    })
  };

  const handleWheel = (e) => {
    if (!scrollRef.current) return;


    e.preventDefault();

    scrollRef.current.scrollLeft += e.deltaY * 0.8;
  };




  const filteredOrders =
    selectedOrderType === "All Order"
      ? orders
      : orders.filter((o) => o.type === selectedOrderType);

  return (
    <Box mb={3}>
 
      <Grid container alignItems="center" spacing={2} mb={3}>
        <Grid size={{ sx: 12, md: 2 }}>
          <Typography  fontWeight="bold">
            {t("recent_orders")}
          </Typography>
        </Grid>

        <Grid size={{ sx: 12, md: 6 }}>
          <Stack direction="row" spacing={1} justifyContent="center">
            {["All Order", "Takeaway", "Dine-in Table", "Delivery"].map(
              (orderType) => (
                <Button
                  key={orderType}
                  sx={{ borderRadius: "6px", textTransform: "none" }}
                  onClick={() => setSelectedOrderType(orderType)}
                  variant={
                    selectedOrderType === orderType ? "contained" : "outlined"
                  }
                >
                  {orderType}

                </Button>
              )
            )}
          </Stack>
        </Grid>

        <Grid size={{ sx: 12, md: 4 }}>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <IconButton variant="outlined" onClick={scrollLeft}>
                <ArrowLeft />
              </IconButton>
              <IconButton variant="outlined" onClick={scrollRight}>
                <ArrowRight />
              </IconButton>
          </Stack>
        </Grid>
      </Grid>

      <Box
        ref={scrollRef}
        onWheel={handleWheel}
        sx={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          pb: 1,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}>
        <Grid container wrap="nowrap" spacing={3}>
          {filteredOrders.map((order) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={order.id}
              sx={{
                minWidth: 320,
                flexShrink: 0
              }}
            >
                <Card
                sx={{
                  p: 2,
                  borderRadius: 0.5,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1.5}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    #{order.id}
                  </Typography>
                  <Chip
                    label={order.type}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      color: "#45556C",
                      bgcolor: "#F8F8F8",
                    }}
                  />
                </Stack>


                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1.5}
                >
                  <Box>
                    <Typography variant="body2" fontWeight="500">
                      {order.customer}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.time}
                    </Typography>
                  </Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{
                      bgcolor: "#45556C",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    <Timer size={16} color="white" />
                    <Typography
                      variant="caption"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      {order.estimated} Mins
                    </Typography>
                  </Stack>
                </Stack>


                <LinearProgress
                  variant="determinate"
                  value={(order.elapsed / order.estimated) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 3,
                    },
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>


    </Box>
  );
};

export default RecentOrders;