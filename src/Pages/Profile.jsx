import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import useGetProfileById from "../Components/hook/useGetProfileById";
import { translateLauguage } from "../function/translate";

// ─── QR generator (canvas-based, no extra library) ───────────────────────────
function drawQRCanvas(canvas, text, fg = "#3C2F8F", size = 80) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const mod = 25;
  const cell = Math.floor(size / (mod + 2));
  const off = Math.floor((size - cell * mod) / 2);

  function hash(s) {
    let v = 5381;
    for (let i = 0; i < s.length; i++) v = ((v << 5) + v) + s.charCodeAt(i);
    return v >>> 0;
  }

  const seed = hash(text);
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);

  const grid = Array.from({ length: mod }, (_, r) =>
    Array.from({ length: mod }, (_, c) => {
      const corner =
        (r < 7 && c < 7) || (r < 7 && c >= mod - 7) || (r >= mod - 7 && c < 7);
      if (corner) return true;
      const b1 = (seed >> ((r * mod + c) % 29)) & 1;
      const b2 = (seed >> ((c * 7 + r * 3) % 29)) & 1;
      return (b1 ^ b2) === 1;
    })
  );

  ctx.fillStyle = fg;
  for (let r = 0; r < mod; r++)
    for (let c = 0; c < mod; c++)
      if (grid[r][c]) ctx.fillRect(off + c * cell, off + r * cell, cell - 1, cell - 1);

  // Draw finder patterns (the three corner squares)
  [
    [0, 0],
    [0, mod - 7],
    [mod - 7, 0],
  ].forEach(([dr, dc]) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(off + dc * cell, off + dr * cell, 7 * cell, 7 * cell);
    ctx.fillStyle = fg;
    ctx.fillRect(off + dc * cell, off + dr * cell, 7 * cell, 7 * cell);
    ctx.fillStyle = "#fff";
    ctx.fillRect(off + dc * cell + cell, off + dr * cell + cell, 5 * cell, 5 * cell);
    ctx.fillStyle = fg;
    ctx.fillRect(
      off + dc * cell + 2 * cell,
      off + dr * cell + 2 * cell,
      3 * cell,
      3 * cell
    );
  });
}

// ─── ID Card Dialog ───────────────────────────────────────────────────────────
function IDCardDialog({ open, onClose, profile, language, t }) {
  const qrRef = useRef(null);

  useEffect(() => {
    if (open && profile?._id && qrRef.current) {
      drawQRCanvas(qrRef.current, profile._id, "#3C2F8F", 80);
    }
  }, [open, profile?._id]);

  const displayName =
    language === "en" ? profile?.nameEn : profile?.nameKh;

  const roleLabel =
    profile?.role === "admin"
      ? t("admin")
      : profile?.role === "superAdmin"
      ? t("super_admin")
      : profile?.role === "cashier"
      ? t("cashier")
      : profile?.role === "manager"
      ? t("manager")
      : profile?.role === "stockController"
      ? t("stock_controller")
      : profile?.role;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: "transparent",
          boxShadow: "none",
          overflow: "visible",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <Box
          sx={{
            width: 300,
            borderRadius: "12px",
            overflow: "hidden",
            bgcolor: "#fff",
            border: "0.5px solid #d4d0ef",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
 
          <Box
            sx={{
              bgcolor: "#3C2F8F",
              px: 2.5,
              pt: 2.5,
              pb: 0,
              position: "relative",
              height: 210,
            }}
          >
            {/* Company */}
            <Typography
              sx={{
                fontSize: 11,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.08em",
                mb: 1.5,
              }}
            >
              Logic Integrated Kiosk Application
            </Typography>

     
            <Typography
              sx={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 20,
                color: "#fff",
                lineHeight: 1.05,
                whiteSpace: "pre-line",
                textTransform: "uppercase",
              }}
            >
              {displayName?.replace(" ", "\n")}
            </Typography>
 
            <Box
              sx={{
                display: "inline-block",
                bgcolor: "#fff",
                color: "#3C2F8F",
                fontSize: 11,
                fontWeight: 700,
                px: 1.75,
                py: 0.5,
                borderRadius: 1,
                mt: 1.25,
                letterSpacing: "0.04em",
              }}
            >
              {roleLabel}
            </Box>
 
            <Box
              sx={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 125,
                height: 168,
                overflow: "hidden",
                bgcolor: "#534AB7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius:1
              }}
            >
              {profile?.image ? (
                <Box
                  component="img"
                  src={profile.image}
                  alt={displayName}
                  sx={{
                    width: "100%",
                    borderRadius:1,
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: 54,
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  {profile?.nameEn?.slice(0, 2).toUpperCase()}
                </Typography>
              )}
            </Box>
          </Box>

          
          <Box sx={{ bgcolor: "#fff", px: 2.5, pt: 2, pb: 2.5 }}>
        
            <Stack direction="row" alignItems="center" spacing={1.25} mb={1.75}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#3C2F8F",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M2.5 12.5L12.5 2.5M12.5 2.5H5.5M12.5 2.5V9.5"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: 10,
                    color: "#999",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  ID :
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: 10,
                    color: "#1a1030",
                    letterSpacing: "0.06em",
                    lineHeight: 1.1,
                  }}
                >
                  {profile?._id?.slice(-12).toUpperCase()}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 1.75, borderColor: "#ece9f7" }} />

            {/* Info + QR */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 1,
                alignItems: "flex-end",
              }}
            >
              <Box>
                {/* Phone */}
                <Box mb={1}>
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#999",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {t("phone")}
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: "#1a1030" }}>
                    {profile?.phone || "N/A"}
                  </Typography>
                </Box>

                {/* Email */}
                <Box mb={1}>
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#999",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {t("email")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#1a1030",
                      wordBreak: "break-all",
                    }}
                  >
                    {profile?.email}
                  </Typography>
                </Box>

                {/* Status */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#999",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {t("status")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: profile?.active ? "#0F6E56" : "#A32D2D",
                    }}
                  >
                    {profile?.active ? t("active") : t("inactive")}
                  </Typography>
                </Box>
              </Box>

              {/* QR Code Canvas — encodes the full _id */}
              <canvas
                ref={qrRef}
                width={80}
                height={80}
                style={{
                  borderRadius: 6,
                  border: "1px solid #ece9f7",
                  display: "block",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

// ─── Main Profile Page ────────────────────────────────────────────────────────
const Profile = () => {
  const { userId } = useParams();
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const id = userId || null;

  const { profile, loading } = useGetProfileById({ _id: id });
  const [open, setOpen] = useState(false);

  const formatDateDDMMMYYYY = (date, lang = "en") => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";
    const locale = lang === "en" ? "en-US" : "km-KH";
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString(locale, { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Box>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box textAlign="start">
          <Breadcrumbs separator="/">
            <Typography
              sx={{ borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}
            >
              {t("profile")}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Stack>

      <Paper sx={{ p: 4, borderRadius: 1, mt: 5 }}>
        <Grid container spacing={4}>
          {/* LEFT – Avatar + Actions */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Stack spacing={2} alignItems="center">
              {loading ? (
                <>
                  <Skeleton variant="rectangular" width={120} height={120} />
                  <Skeleton width={100} height={20} />
                  <Skeleton width={80} height={15} />
                  <Stack direction="row" spacing={1}>
                    <Skeleton width={90} height={36} />
                    <Skeleton width={90} height={36} />
                  </Stack>
                </>
              ) : (
                <>
                  <Avatar
                    src={profile?.image}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => setOpen(true)}
                  />

                  <Typography >
                    {language === "en" ? profile?.nameEn : profile?.nameKh}
                  </Typography>

                  <Typography color="text.secondary">
                    {profile.role === "admin" && t("admin")}
                    {profile.role === "superAdmin" && t("super_admin")}
                    {profile.role === "cashier" && t("cashier")}
                    {profile.role === "manager" && t("manager")}
                    {profile.role === "stockController" && t("stock_controller")}
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Button variant="contained">{t("send_message")}</Button>
                    <Button variant="outlined" onClick={() => setOpen(true)}>
                      {t("contact")}
                    </Button>
                  </Stack>
                </>
              )}
            </Stack>
          </Grid>

          {/* RIGHT – Profile Info */}
          <Grid size={{ xs: 12, md: 9 }} textAlign="start">
            <Typography variant="h5" mb={2}>
              {t("profile_information")}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {loading ? (
                Array.from(new Array(6)).map((_, i) => (
                  <Grid size={{ xs: 6 }} key={i}>
                    <Skeleton width="40%" height={15} />
                    <Skeleton width="80%" height={20} />
                  </Grid>
                ))
              ) : (
                <>
                  <Grid size={{ xs: 6 }}>
                    <Typography color="text.secondary">{t("email")}</Typography>
                    <Typography>{profile?.email}</Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography color="text.secondary">{t("phone")}</Typography>
                    <Typography>{profile?.phone}</Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography color="text.secondary">{t("gender")}</Typography>
                    <Typography>
                      {profile.gender === "male" && t("male")}
                      {profile.gender === "female" && t("female")}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography color="text.secondary">{t("status")}</Typography>
                    <Typography>
                      {profile?.active ? t("active") : t("inactive")}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography color="text.secondary">{t("create_at")}</Typography>
                    <Typography>
                      {formatDateDDMMMYYYY(profile?.createdAt, language)}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography color="text.secondary">{t("update_at")}</Typography>
                    <Typography>
                      {formatDateDDMMMYYYY(profile?.updatedAt, language)}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* ID CARD DIALOG */}
      <IDCardDialog
        open={open}
        onClose={() => setOpen(false)}
        profile={profile}
        language={language}
        t={t}
      />
    </Box>
  );
};

export default Profile;