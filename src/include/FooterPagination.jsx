import { MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";
import React from "react";

import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

export default function FooterPagination({
  totalPages,
  totalDocs,
  limit = 5,   
  page = 1,    
  setPage,
  handleLimit,
  Type,
}) {
  const handlePageNum = (event, pageNum) => {
    setPage(parseInt(pageNum));
  };
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{
        px: 2,
        py: 1,
        borderRadius: 2,
        color: "black",
        flexWrap: "wrap",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Pagination
          page={page}
          count={totalPages}
          color="info"
          shape="rounded"
          onChange={handlePageNum}
          showFirstButton
          showLastButton
        />
        <Select
          size="small"
          value={limit}
          onChange={handleLimit}
        >
          <MenuItem value={5}>5 / {t(`page`)}</MenuItem>
          <MenuItem value={8}>8 / {t(`page`)}</MenuItem>
          <MenuItem value={10}>10 / {t(`page`)}</MenuItem>
          <MenuItem value={totalDocs}>{t(`All`)}</MenuItem>
        </Select>
      </Stack>
    </Stack>
  );
}