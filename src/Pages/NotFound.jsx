import { useNavigate } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";

import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

export default function NotFound() {
  const navigate = useNavigate();
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "70vh", textAlign: "center" }}
      spacing={2}
    >
      {/* 404 Text */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "100px", md: "180px" },
          fontWeight: "bold",
          color: "#1976d2",
          lineHeight: 1,
        }}
      >
        404
      </Typography>

      {/* Message */}
      <Typography variant="h5" color="text.secondary">
        {t("page_not_found")}
      </Typography>

      {/* Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)}
      >
        {t("go_back")}
      </Button>
    </Stack>
  );
}