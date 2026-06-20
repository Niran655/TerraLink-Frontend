import Snackbar from "@mui/material/Snackbar";
import React from "react";

import { useAuth } from "../../Context/AuthContext";

const STATUS_CONFIG = {
  info: {
    color: "#4FC3F7",
    bg: "#102331",
    border: "#4FC3F7",
  },
  success: {
    color: "#00E0B8",
    bg: "#0E2A24",
    border: "#00C9A7",
  },
  warning: {
    color: "#FFB547",
    bg: "#2B1F0A",
    border: "#FFA500",
  },
  error: {
    color: "#FF8DA8",
    bg: "#2A1218",
    border: "#FF6F91",
  },
};

export default function AlertMessage() {
  const { alert, setAlert, language } = useAuth();

  const open = alert()?.open;
  const message = alert()?.message;
  const status = alert()?.status;

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setAlert(false, "", "");
  };

  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.info;

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          minWidth: 240,
          maxWidth: 380,
          padding: "14px 18px",
          borderRadius: 12,

          background: cfg.bg,
          border: `1px solid ${cfg.border}`,

          color: cfg.color,
          fontSize: "0.92rem",
          fontWeight: 500,
          fontFamily: "'Segoe UI', sans-serif",

          boxShadow: "0 8px 30px rgba(0,0,0,0.55)",

          gap: 12,
        }}
      >
        <span style={{ flex: 1 }}>
          {language === "en" ? message?.messageEn : message?.messageKh}
        </span>
        <button
          onClick={handleClose}
          style={{
            background: "none",
            border: "none",
            color: cfg.color,
            cursor: "pointer",
            fontSize: "1rem",
            opacity: 0.7,
            padding: 0,
            lineHeight: 1,
            flexShrink: 0,
          }}
          aria-label="close"
        >
          ✕
        </button>
      </div>
    </Snackbar>
  );
}