// import React, { createContext, useContext, useState } from 'react';
// const AuthContext = createContext();
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };
// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(() => {
//     return localStorage.getItem('token') || null;
//   });
//   const login = (newToken) => {
//     localStorage.setItem('token', newToken);
//     setToken(newToken);
//   };
//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//   };
//   const value = {
//     token,
//     setToken,
//     login,
//     logout,
//     isAuthenticated: !!token,
//   };
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { ShieldAlert } from "lucide-react";

const AuthContext = createContext(null);
const AUTH_LOGOUT_EVENT = "auth:logout";

const parseJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const getTokenExpirationTime = (token) => {
  const payload = parseJwtPayload(token);
  return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
};

const getStoredToken = () => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    const shopIdParam = params.get("shopId");
    if (tokenParam) {
      localStorage.setItem("token", tokenParam);
      try {
        const payload = parseJwtPayload(tokenParam);
        if (payload) {
          const basicUser = {
            _id: payload.id || payload.userId,
            email: payload.email,
            role: payload.role,
            tenantId: payload.tenantId,
            shopIds: payload.shopIds || [],
            nameEn: payload.nameEn || payload.email?.split("@")[0] || "User",
            nameKh: payload.nameKh || payload.email?.split("@")[0] || "User"
          };
          localStorage.setItem("user", JSON.stringify(basicUser));
        }
      } catch (e) {
        console.error("Error decoding JWT from URL parameters:", e);
      }
    }
    if (shopIdParam) {
      localStorage.setItem("activeShopId", shopIdParam);
    }
  }

  const storedToken = localStorage.getItem("token");
  if (!storedToken) return null;

  const expiresAt = getTokenExpirationTime(storedToken);
  if (!expiresAt || expiresAt <= Date.now()) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }

  return storedToken;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken);
  const [user, setUser] = useState(() => {
    if (!getStoredToken()) return null;

    const saved = localStorage.getItem("user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const [isSessionRejected, setIsSessionRejected] = useState(false);

  const handleCloseRejectedModal = useCallback(() => {
    setIsSessionRejected(false);
    logout();
  }, [logout]);

  useEffect(() => {
    const handleSessionRejected = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsSessionRejected(true);
    };

    window.addEventListener("auth:session_rejected", handleSessionRejected);
    return () => {
      window.removeEventListener("auth:session_rejected", handleSessionRejected);
    };
  }, []);
  const userRole = user?.role || "";
  const handleGetLanguage = () => {
    return window.localStorage.getItem("language") || "en"
  }
  const [language, setLanguage] = useState(handleGetLanguage());
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };
  

  
    const [open, setOpen] = useState(false);
    const [alertStatus, setAlertStatus] = useState("");
    const [messageAlert, setMessageAlert] = useState({
      messageKh: "",
      messageEn: "",
    });

    const setAlert = (open, alert, message) => {
      setOpen(open);
      setAlertStatus(alert);
      setMessageAlert(message);
    };

    const alert = () => {
      return { open: open, status: alertStatus, message: messageAlert };
    };

    const quickAlert = (status, messageEn, messageKh) => {
    setOpen(true);
    setAlertStatus(status);
    setMessageAlert({
      messageEn,
      messageKh,
    });

 
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
  };



  useEffect(() => {
    if (!token) return undefined;

    const expiresAt = getTokenExpirationTime(token);
    if (!expiresAt || expiresAt <= Date.now()) {
      logout();
      return undefined;
    }

    const timeout = window.setTimeout(logout, expiresAt - Date.now());
    return () => window.clearTimeout(timeout);
  }, [token, logout]);

  useEffect(() => {
    const handleForcedLogout = () => logout();

    const handleStorageChange = (event) => {
      if (event.key === "token" && !event.newValue) {
        logout();
      }
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
        language,
        changeLanguage,
        alert,
        setAlert,
        quickAlert,
        userRole
      }}
    >
      {children}
      <Dialog
        open={isSessionRejected}
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleCloseRejectedModal();
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "16px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center"
          }
        }}
      >
        <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pt: 3 }}>
          <Box sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            bgcolor: "error.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.9,
            mb: 1
          }}>
            <ShieldAlert size={36} color="#d32f2f" />
          </Box>
          <Typography variant="h6" fontWeight="700" color="text.primary">
            Session Terminated
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your session has been logged out from another device or terminated by the administrator.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseRejectedModal}
            sx={{ px: 4, borderRadius: "8px", textTransform: "none", fontWeight: 700 }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </AuthContext.Provider>
  );
};
