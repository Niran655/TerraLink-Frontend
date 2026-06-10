import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { Link as RouterLink } from "react-router-dom";

import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

export default function AttendanceQr() {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const scanUrl = `${window.location.origin}/setting/attendance-qr-scan?scan=1`;

  return (
    <Box>
      <Breadcrumbs separator="/">
        <Typography component={RouterLink} to="/" sx={{ textDecoration: "none", borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}>
          Attendance
        </Typography>
        <Typography fontWeight={600}>{t("attendance_qr") || "Attendance QR"}</Typography>
      </Breadcrumbs>

      <Grid container spacing={3} mt={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Generate Check In QR</Typography>
            <Typography color="text.secondary">
              Staff scan this QR after logging in. The system will use their login email for check in.
            </Typography>
            <Button
              component={RouterLink}
              to="/setting/attendance-qr-scan"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
            >
              Open Mobile Scanner
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 3, minHeight: 360, display: "grid", placeItems: "center" }}>
            <Stack alignItems="center" spacing={2}>
              <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 1 }}>
                <QRCodeSVG value={scanUrl} size={240} level="H" includeMargin />
              </Box>
              <Box textAlign="center">
                <Typography fontWeight={700}>{t("qr_check_in") || "QR Check In"}</Typography>
                <Typography color="text.secondary">Login required</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Scan this QR with a phone to open the check in page.
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
