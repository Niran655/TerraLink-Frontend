import { useMutation } from "@apollo/client/react";
import {
  Box, Button, Paper, Stack, TextField, Typography,
  InputAdornment, IconButton, useTheme,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Visibility, VisibilityOff, EmailOutlined, LockOutlined } from "@mui/icons-material";
import logo from "../assets/Image/header-logo.png";
import { LOGIN } from "../../graphql/mutation";
import { useAuth } from "../Context/AuthContext";
import loginBgDark from "../assets/Image/login-bg-dark.png";
import loginBgLight from "../assets/Image/login-bg-light.png";
import { translateLauguage } from "../function/translate";

const validationSchema = Yup.object({
  email: Yup.string().email("Email មិនត្រឹមត្រូវ").required("សូមបញ្ចូល Email"),
  password: Yup.string().required("សូមបញ្ចូល ពាក្យសម្ងាត់"),
});

export default function Login() {
  const theme = useTheme();
  const { login, user, language } = useAuth();
  const [loginMutation, { loading, client }] = useMutation(LOGIN);
  const [showPassword, setShowPassword] = useState(false);
  const isDark = theme.palette.mode === "dark";
  const [remember, setRemember] = useState(false);
  const { t } = translateLauguage(language);


  const [initialValues, setInitialValues] = useState({
    email: "",
    password: "",
  });


  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    const savedPassword = localStorage.getItem("remember_password");
    if (savedEmail && savedPassword) {
      setInitialValues({
        email: savedEmail,
        password: savedPassword,
      });
      setRemember(true);
    } else if (savedEmail) {

      setInitialValues({
        email: savedEmail,
        password: "",
      });
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const { data } = await loginMutation({ variables: values });
      if (data?.login) {
        login(data.login.token, data.login.user);


        if (remember) {
          localStorage.setItem("remember_email", values.email);
          localStorage.setItem("remember_password", values.password);
        } else {
          localStorage.removeItem("remember_email");
          localStorage.removeItem("remember_password");
        }
      }
    } catch (err) {
      setErrors({ password: "Email ឬ ពាក្យសម្ងាត់ មិនត្រឹមត្រូវ" });
    }
    setSubmitting(false);
  };


  useEffect(() => {
    if (user) client.resetStore();
  }, [user, client]);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDark ? "#04080f" : "#f1f5f9",
        overflow: "auto",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 900,
          minHeight: 540,
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          border: `1px solid ${isDark ? "rgba(59,130,246,0.18)" : "rgba(0,0,0,0.08)"}`,
          boxShadow: isDark
            ? "0 40px 80px rgba(0,0,0,0.6)"
            : "0 40px 80px rgba(0,0,0,0.12)",
          animation: "fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) forwards",
          "@keyframes fadeUp": {
            from: { opacity: 0, transform: "translateY(24px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
 
        <Box
          sx={{
            width: "50%",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            position: "relative",
            overflow: "hidden",
            backgroundImage: `url(${isDark ? loginBgDark : loginBgLight})`,
            backgroundSize: "cover",
            // backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: isDark
                ? "linear-gradient(to top, rgba(4,8,15,0.72) 0%, transparent 55%)"
                : "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)",
              pointerEvents: "none",
            }}
          />
          <Stack
            spacing={0.5}
            alignItems="center"
            sx={{ position: "relative", zIndex: 2, pb: 4, px: 3, textAlign: "center" }}
          >
            <Box
              sx={{
                display: "inline-block",
                px: 1.5, py: 0.4,
                border: "1px solid rgba(96,165,250,0.45)",
                borderRadius: 10,
                bgcolor: "rgba(37,99,235,0.18)",
                color: "#93c5fd",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              TerraLink Platform
            </Box>
            <Typography
              sx={{ color: "white", fontWeight: 700, fontSize: 18, lineHeight: 1.35 }}
            >
              TerraLink Business
            </Typography>
            <Typography
              sx={{ color: "rgba(203,213,225,0.7)", fontSize: 12, letterSpacing: 0.3 }}
            >
              Secure · Reliable · Fast
            </Typography>
          </Stack>
        </Box>

   
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 3, sm: "40px 44px" },
            backgroundColor: isDark ? "rgba(10,18,35,0.97)" : "#ffffff",
          }}
        >
          <Stack sx={{ width: "100%", maxWidth: 340 }}>
            <Box
              component="img"
              src={logo}
              alt="LIKA"
              sx={{ width: 130, height: 52, objectFit: "contain", mb: 1.5, alignSelf: "center" }}
            />
            <Typography
              variant="body2"
              sx={{
                color: isDark ? "rgba(148,163,184,0.6)" : "text.secondary",
                fontSize: "11px",
                letterSpacing: 0.4,
                mb: 3,
              }}
            >
              TerraLink Business
            </Typography>

            <Box
              sx={{
                width: "100%", height: "1px", mb: 3,
                background: isDark
                  ? "linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
              }}
            />

            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
              {t(`welcome_back`)}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px", mb: 3 }}>
              {t(`sign_in_to_your_account_to_continue`)}
            </Typography>

            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, handleChange, values, isSubmitting }) => (
                <Form style={{ width: "100%" }}>
                  <Typography sx={{
                    mb: 0.75, fontWeight: 500, fontSize: "11px",
                    textTransform: "uppercase", letterSpacing: "0.8px", color: "text.secondary",
                    textAlign: "left",
                  }}>
                    {t(`email`)}
                  </Typography>
                  <TextField
                    name="email"
                    size="small"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    fullWidth
                    placeholder="you@example.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined sx={{ fontSize: 17, color: "text.disabled" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2.5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        backgroundColor: isDark ? "rgba(15,25,50,0.5)" : "rgba(0,0,0,0.03)",
                        "& fieldset": { borderColor: isDark ? "rgba(59,130,246,0.15)" : "rgba(0,0,0,0.12)" },
                        "&:hover fieldset": { borderColor: isDark ? "rgba(59,130,246,0.35)" : "rgba(0,0,0,0.25)" },
                        "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 1 },
                      },
                    }}
                  />

                  <Typography sx={{
                    mb: 0.75, fontWeight: 500, fontSize: "11px",
                    textTransform: "uppercase", letterSpacing: "0.8px", color: "text.secondary",
                    textAlign: "left",
                  }}>
                    {t(`password`)}
                  </Typography>
                  <TextField
                    name="password"
                    type={showPassword ? "text" : "password"}
                    size="small"
                    value={values.password}
                    onChange={handleChange}
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    fullWidth
                    placeholder="••••••••••••"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined sx={{ fontSize: 17, color: "text.disabled" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword
                              ? <VisibilityOff fontSize="small" />
                              : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        backgroundColor: isDark ? "rgba(15,25,50,0.5)" : "rgba(0,0,0,0.03)",
                        "& fieldset": { borderColor: isDark ? "rgba(59,130,246,0.15)" : "rgba(0,0,0,0.12)" },
                        "&:hover fieldset": { borderColor: isDark ? "rgba(59,130,246,0.35)" : "rgba(0,0,0,0.25)" },
                        "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 1 },
                      },
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          size="small"
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: 12 }}>
                          {t("remember_me")}
                        </Typography>
                      }
                    />
                    <Typography sx={{
                      textAlign: "right", fontSize: "12px", color: "primary.main",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}>
                      {t(`forgot_password`)}
                    </Typography>
                  </Stack>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading || isSubmitting}
                    sx={{
                      py: 1,
                      fontWeight: 600,
                      fontSize: "15px",
                      borderRadius: 1,
                      textTransform: "none",
                      letterSpacing: 0.3,
                      background: "linear-gradient(135deg, #1d4ed8, #2563eb, #0ea5e9)",
                      backgroundSize: "200% 200%",
                      boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
                      animation: "gradientShift 4s ease infinite",
                      "@keyframes gradientShift": {
                        "0%": { backgroundPosition: "0% 50%" },
                        "50%": { backgroundPosition: "100% 50%" },
                        "100%": { backgroundPosition: "0% 50%" },
                      },
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 8px 30px rgba(37,99,235,0.45)",
                      },
                      "&:active": { transform: "translateY(0)" },
                      transition: "all 0.25s ease",
                    }}
                  >
                    {loading ? t(`logging_in`) : t(`login`)}
                  </Button>
                </Form>
              )}
            </Formik>

            <Typography
              variant="caption"
              sx={{ mt: 3, color: "text.disabled", textAlign: "center", fontSize: "11px" }}
            >
              © {new Date().getFullYear()} LIKA. All rights reserved.
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}