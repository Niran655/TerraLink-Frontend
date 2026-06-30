import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { useQuery } from "@apollo/client/react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Breadcrumbs, Button, Grid, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import DepartmentAction from "../Components/department/DepartmentAction";
import DepartmentForm from "../Components/department/DepartmentForm";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import FooterPagination from "../include/FooterPagination";
import CircularIndeterminate from "../include/Loading";
import "../Styles/TableStyle.scss";
import { GET_DEPARTMENTS_WITH_PAGINATION } from "../../graphql/queries";

export default function Department() {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  const active = activeFilter === "active" ? true : activeFilter === "inactive" ? false : undefined;

  const { data, loading, refetch } = useQuery(GET_DEPARTMENTS_WITH_PAGINATION, {
    variables: { page, limit, pagination: true, keyword, active },
  });

  const departments = data?.getDepartmentsWithPagination?.data || [];
  const paginator = data?.getDepartmentsWithPagination?.paginator || {};

  const handleLimit = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1);
  };

  return (
    <Box>
      <Breadcrumbs separator="/">
        <Typography component={RouterLink} to="/setting" sx={{ textDecoration: "none", borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}>
          {t("setting")}
        </Typography>
        <Typography fontWeight={600}>{t("department")}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" }, flexDirection: { xs: "column", md: "row" }, gap: 2 }} mt={5}>
        <Grid container spacing={2} alignItems="center" textAlign="start" sx={{ flex: 1, width: "100%" }}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>{t("search")}</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder={`${t("search")}...`}
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>{t("status")}</Typography>
            <TextField select fullWidth size="small" value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
              <MenuItem value="active">{t("active")}</MenuItem>
              <MenuItem value="inactive">{t("inactive")}</MenuItem>
              <MenuItem value="all">{t("all")}</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} mt={{ xs: 0, md: 3 }} sx={{ alignSelf: { xs: "flex-end", md: "auto" }, flexShrink: 0 }}>
          <Button variant="contained" startIcon={<LibraryAddOutlinedIcon />} onClick={() => setOpen(true)}>
            {t("create")}
          </Button>
        </Stack>

        {open && <DepartmentForm open={open} onClose={() => setOpen(false)} dialogTitle="Create" setRefetch={refetch} t={t} />}
      </Box>

      <TableContainer className="table-container" sx={{ mt: 2 }}>
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>{t("no")}</TableCell>
              <TableCell>{t("khmer_name")}</TableCell>
              <TableCell>{t("english_name")}</TableCell>
              <TableCell>{t("code")}</TableCell>
              <TableCell>{t("remark")}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          {loading ? (
            <CircularIndeterminate cols={6} />
          ) : departments.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {departments.map((department, index) => (
                <TableRow key={department._id} className="table-row">
                  <TableCell>{(paginator.slNo || 1) + index}</TableCell>
                  <TableCell>{department.nameKh}</TableCell>
                  <TableCell>{department.nameEn}</TableCell>
                  <TableCell>{department.code}</TableCell>
                  <TableCell>{department.remark}</TableCell>
                  <TableCell>
                    <DepartmentAction departmentId={department._id} departmentData={department} setRefetch={refetch} t={t} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>

        <Stack direction="row" justifyContent="flex-end" p={2}>
          <FooterPagination page={page} limit={limit} setPage={setPage} handleLimit={handleLimit} totalDocs={paginator.totalDocs} totalPages={paginator.totalPages} />
        </Stack>
      </TableContainer>
    </Box>
  );
}
