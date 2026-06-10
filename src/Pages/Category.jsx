import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { useQuery } from "@apollo/client/react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Breadcrumbs, Button, Grid, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import UpdateCategoryStatus from "../Components/category/UpdateCategoryStatus";
import CategoryAction from "../Components/category/CategoryAction";
import CategoryForm from "../Components/category/CategoryForm";
import FooterPagination from "../include/FooterPagination";
import "../Styles/TableStyle.scss";
import { useAuth } from "../Context/AuthContext";
import { GET_CATEGORY_WHITH_PAGINATION } from "../../graphql/queries";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
const Category = () => {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");

  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  const active =
    activeFilter === "active"
      ? true
      : activeFilter === "inactive"
      ? false
      : undefined;

  const { data, refetch, loading } = useQuery(GET_CATEGORY_WHITH_PAGINATION, {
    variables: {
      page,
      limit,
      pagination: true,
      keyword,
      active,
    },
  });
  const categoryData = data?.getCategoryWithPagination?.data || [];
  const paginator = data?.getCategoryWithPagination?.paginator;

  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box textAlign="start">
          <Breadcrumbs aria-label="breadcrumb" separator="/">
            <Typography
              component={RouterLink}
              to="/setting"
               
              sx={{
                textDecoration: "none",
                borderLeft: "3px solid #1D4592",
                pl: 1.5,
                fontWeight: 600,
              }}
            >
              {t("setting")}
            </Typography>

            <Typography          sx={{
                textDecoration: "none",
                fontWeight: 600,
              }} color="text.primary">
              {t("category")}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Stack>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
        mt={5}
      >
        <Grid container spacing={2} alignItems="center" textAlign="start" sx={{ flex: 1, width: "100%" }}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              {t("search")}
            </Typography>
            <TextField
              type="search"
              size="small"
              placeholder={t("search") + "..."}
              fullWidth
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              variant="outlined"

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              {t("status")}
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <MenuItem value="active">{t("active")}</MenuItem>
              <MenuItem value="inactive">{t("inactive")}</MenuItem>
              <MenuItem value="all">{t("all")}</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} mt={{ xs: 0, md: 3 }} sx={{ alignSelf: { xs: "flex-end", md: "auto" }, flexShrink: 0 }}>
          <Button
            variant="contained"
            startIcon={<LibraryAddOutlinedIcon size={18} />}
            onClick={handleOpen}
          >
            {t("create")}
          </Button>
        </Stack>
        {open && (
          <CategoryForm
            setRefetch={refetch}
            dialogTitle="Create"
            open={handleOpen}
            onClose={handleClose}
            t={t}
          />
        )}
      </Box>
      <TableContainer className="table-container" sx={{ mt: 2 }}>
        <Table className="table">
          <TableHead  >
            <TableRow>
              <TableCell>{t(`no`)}</TableCell>
              <TableCell>{t(`khmer_name`)}</TableCell>
              <TableCell>{t(`english_name`)}</TableCell>
              <TableCell>{t(`remark`)}</TableCell>
              <TableCell>{t(`status`)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          {loading ? (
            <CircularIndeterminate />
          ) : categoryData?.length == 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {categoryData?.map((category, index) => (
                <TableRow key={category._id} className="table-row">
                  <TableCell>{paginator.slNo + index}</TableCell>
                  <TableCell>{category?.nameKh}</TableCell>
                  <TableCell>{category?.nameEn}</TableCell>
                  <TableCell>{category?.remark}</TableCell>
                  <TableCell>
                    <UpdateCategoryStatus editData={category} refetch={refetch} />
                  </TableCell>
                  <TableCell   >
                               <Stack direction="row" spacing={1} justifyContent="flex-end">
 <CategoryAction
                      t={t}
                      categoryId={category?._id}
                      categoryName={category?.nameEn}
                      setRefetch={refetch}
                      categoryData={category}
                    />

                               </Stack>
                   
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ padding: 2 }}
        >
          <FooterPagination
            page={page}
            limit={limit}
            setPage={handlePageChange}
            handleLimit={handleLimit}
            totalDocs={paginator?.totalDocs}
            totalPages={paginator?.totalPages}
          />
        </Stack>
      </TableContainer>
    </Box>
  );
};

export default Category;