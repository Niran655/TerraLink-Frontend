import { useQuery } from "@apollo/client/react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Search } from "lucide-react";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { useState } from "react";

import { GET_CUSTOMERS_WITH_PAGINATION } from "../../graphql/queries";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import FooterPagination from "../include/FooterPagination";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
import CustomerAction from "../Components/customer/CustomerAction";
import CustomerForm from "../Components/customer/CustomerForm";
import "../Styles/TableStyle.scss";

const Customer = () => {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const active =
    activeFilter === "active"
      ? true
      : activeFilter === "inactive"
      ? false
      : undefined;

  const { data, refetch, loading } = useQuery(GET_CUSTOMERS_WITH_PAGINATION, {
    variables: {
      shopIds: null,
      page,
      limit,
      pagination: true,
      keyword,
      active,
    },
  });

  const customers = data?.getCustomersWithPagination?.data || [];
  const paginator = data?.getCustomersWithPagination?.paginator || {};

  const handleLimit = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  const handleActiveFilterChange = (e) => {
    setActiveFilter(e.target.value);
    setPage(1);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Breadcrumbs aria-label="breadcrumb" separator="/">
          <Typography
            component={RouterLink}
            to="/"
            sx={{ textDecoration: "none", borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}
          >
            {t("customer")}
          </Typography>
        </Breadcrumbs>
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
        <Grid
          container
          spacing={2}
          alignItems="center"
          textAlign="start"
          sx={{ flex: 1, width: "100%" }}
        >
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              {t("search")}
            </Typography>
            <TextField
              type="search"
              size="small"
              placeholder={t("search") + "..."}
              value={keyword}
              fullWidth
              onChange={handleKeywordChange}
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
              onChange={handleActiveFilterChange}
            >
              <MenuItem value="all">{t("all")}</MenuItem>
              <MenuItem value="active">{t("active")}</MenuItem>
              <MenuItem value="inactive">{t("inactive")}</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} mt={{ xs: 0, md: 3 }} sx={{ alignSelf: { xs: "flex-end", md: "auto" }, flexShrink: 0 }}>
          <Button variant="contained" startIcon={<LibraryAddOutlinedIcon />} onClick={() => setOpen(true)}>
            {t("create")}
          </Button>
        </Stack>
      </Box>

      <TableContainer className="table-container" sx={{ mt: 2 }}>
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>{t("no")}</TableCell>
              <TableCell>{t("khmer_name")}</TableCell>
              <TableCell>{t("english_name")}</TableCell>
              <TableCell>{t("phone")}</TableCell>
              <TableCell>{t("email")}</TableCell>
              <TableCell>{t("gender")}</TableCell>
              <TableCell>{t("total_spent")}</TableCell>
              <TableCell align="center">{t("status")}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          {loading ? (
            <CircularIndeterminate />
          ) : customers.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {customers.map((row, idx) => (
                <TableRow key={row._id} className="table-row">
                  <TableCell>{(paginator.slNo || 1) + idx}</TableCell>
                  <TableCell>{row.nameKh}</TableCell>
                  <TableCell>{row.nameEn}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {row.gender === "male" && t("male")}
                    {row.gender === "female" && t("female")}
                    {row.gender !== "male" && row.gender !== "female" && t("other")}
                  </TableCell>
                  <TableCell>${row.totalSpent?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={row.active ? t("active") : t("inactive")}
                      color={row.active ? "success" : "error"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <CustomerAction customerData={row} setRefetch={refetch} t={t} />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>

        <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
          <FooterPagination
            page={page}
            limit={limit}
            setPage={handlePageChange}
            handleLimit={handleLimit}
            totalDocs={paginator.totalDocs}
            totalPages={paginator.totalPages}
          />
        </Stack>
      </TableContainer>

      {open && (
        <CustomerForm
          dialogTitle="Create"
          open={open}
          onClose={() => setOpen(false)}
          setRefetch={refetch}
          t={t}
        />
      )}
    </Box>
  );
};

export default Customer;
