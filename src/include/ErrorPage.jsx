import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";


const ErrorPage = ({ error, refetch, t }) => {


  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          p: 4,
          mt: 6,
          border: "1px solid",
          borderColor: "error.main",
          borderRadius: 2,
          textAlign: "center",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {t("error_loading")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {(() => {
            try {
              const parsed = JSON.parse(
                error?.message?.substring(error.message.indexOf("{"))
              );
              return parsed?.message?.messageKh || t("unknown_error");
            } catch {
              return t("unknown_error");
            }
          })()}
        </Typography>
        <Button
          onClick={() =>
            refetch({
              shopId: savedStoreId,
              filter: type === "custom" ? "customRange" : type,
              dayStart: type === "custom" && start ? start.format("YYYY-MM-DD") : null,
              dayEnd: type === "custom" && end ? end.format("YYYY-MM-DD") : null,
            })
          }
          variant="outlined"
          color="error"
          sx={{ mt: 3 }}
        >
          {t("retry")}
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;