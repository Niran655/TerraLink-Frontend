import { Link as RouterLink } from "react-router-dom";
import { Backdrop, Box, Button, Dialog, DialogContent, Fade, Grid, IconButton, Paper, Typography } from "@mui/material";
import { CornerUpLeft, Grid2X2, Phone, ScrollText, ShoppingCart, Users, Warehouse, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "../../Context/AuthContext";
import { translateLauguage } from "../../function/translate";
import "../../Styles/menu.scss";

export default function MenuModal({ open, onClose }) {
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  const id = localStorage.getItem("activeShopId");

  const handleLogout = () => {
    localStorage.removeItem("activeShopId");
    onClose();
  };

  const menuItems = [
    {
      title: t("exit_the_shop"),
      description: "Back to shop selection",
      icon: <CornerUpLeft size={32} color="#FF4C61" />,
      to: "/store",
      onClick: handleLogout,
      // bgColor: "#FF4C61",
      textColor: "#fff",
    },
    {
      title: t("pos"),
      description: "Open POS system",
      icon: <ShoppingCart size={32} color="#00C896" />,
      to: `/store/pos/${id}`,
      // bgColor: "#00C896",
      textColor: "#fff",
    },
    {
      title: t("warehouse"),
      description: "Manage inventory",
      icon: <Warehouse size={32} color="#FFC107"/>,
      to: `/store/pos/${id}/warehouse-in-shop`,
      // bgColor: "#FFC107",
      textColor: "#ffffff",
    },
      {
      title: t("dashboard"),
      description: "View dashboard",
      icon: <Grid2X2 size={32} color="#5f03f4" />,
      to: `/store/pos/${id}/dashboard-in-shop`,
      // bgColor: "#03A9F4",
      textColor: "#fff",
    },
    {
      title: t("report"),
      description: "View reports",
      icon: <ScrollText size={32} color="#03A9F4" />,
      to: `/store/pos/${id}/report-in-shop`,
      // bgColor: "#03A9F4",
      textColor: "#fff",
    },
    {
      title: t("staff"),
      description: "Manage staff",
      icon: <Users size={32} color="#3F51B5" />,
      to: `/store/pos/${id}/staff`,
      // bgColor: "#3F51B5",
      textColor: "#fff",
    },
        {
      title: t("mobile_app"),
      description: "Manage mobile app",
      icon: <Phone size={32} color="#3F51B5" />,
      to: `/store/pos/${id}/mobile-app-controller`,
      // bgColor: "#3F51B5",
      textColor: "#fff",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      TransitionComponent={Fade}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: {
          backgroundColor: "rgba(0,0,0,0.6)",
        },
      }}
      PaperProps={{
        sx: {
          mt: "64px",
          borderRadius: 0,
          background: "rgba(20,20,30,0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          p: 3,
          height: "calc(100% - 64px)",
          width: "100%",
        },
      }}
    >
      <DialogContent>
        <Grid container spacing={3} mt={1}>
          {menuItems.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
              <Paper>
                    <Button
                component={RouterLink}
                to={item.to}
                onClick={item.onClick || onClose}
                fullWidth
                sx={{
                  backgroundColor: item.bgColor,
                  color: item.textColor,
                  borderRadius: 1,
                  height: 90,
                  textTransform: "none",
                  justifyContent: "flex-start",
                  gap: 2,
                  px: 2,
                  "&:hover": {
                    opacity: 0.9,
        
                  },
                }}
              >
                {/* <Box sx={{ color: item.bgColor }}> */}
                {item.icon}
                {/* </Box> */}


                <Box>
                  <Typography fontWeight="bold">{item.title}</Typography>
                  <Typography fontSize={12} opacity={0.8}>
                    {item.description}
                  </Typography>
                </Box>
              </Button>
              </Paper>
          
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
