import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { useQuery } from "@apollo/client/react";
import { Link as RouterLink } from "react-router-dom";
import { Avatar, Box, Breadcrumbs, Button, Grid, Chip, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import EmployeeAction from "../Components/employee/EmployeeAction";
import EmployeeForm from "../Components/employee/EmployeeForm";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import FooterPagination from "../include/FooterPagination";
import CircularIndeterminate from "../include/Loading";
import "../Styles/TableStyle.scss";
import { GET_EMPLOYEES } from "../../graphql/queries";

export default function Employee() {
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

  const { data, loading, refetch } = useQuery(GET_EMPLOYEES, {
    variables: { page, limit, keyword, active },
  });

  const employees = data?.getEmployees?.data || [];
  const paginator = data?.getEmployees?.paginator || {};

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
        <Typography fontWeight={600}>{t("employee")}</Typography>
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

        {open && <EmployeeForm open={open} onClose={() => setOpen(false)} dialogTitle="Create" setRefetch={refetch} t={t} />}
      </Box>

      <TableContainer className="table-container" sx={{ mt: 2 }}>
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>{t("no")}</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>{t("image")}</TableCell>
              <TableCell>{t("khmer_name")}</TableCell>
              <TableCell>{t("english_name")}</TableCell>
              <TableCell>{t("phone")}</TableCell>
              <TableCell>{t("position")}</TableCell>
              <TableCell>{t("department")}</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          {loading ? (
            <CircularIndeterminate cols={10} />
          ) : employees.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {employees.map((employee, index) => (
                <TableRow key={employee._id} className="table-row">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell><strong>{employee.employeeCode || "N/A"}</strong></TableCell>
                  <TableCell>
                    <Avatar src={employee.image || ""} sx={{ width: 40, height: 40 }}>
                      {(employee.nameEn || employee.nameKh || "?").charAt(0)}
                    </Avatar>
                  </TableCell>
                  <TableCell>{employee.nameKh}</TableCell>
                  <TableCell>{employee.nameEn}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department?.nameEn || employee.department?.nameKh}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.status || "Active"}
                      size="small"
                      color={
                        employee.status === "Active"
                          ? "success"
                          : employee.status === "Resigned"
                            ? "error"
                            : employee.status === "Suspended"
                              ? "warning"
                              : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <EmployeeAction employeeId={employee._id} employeeData={employee} setRefetch={refetch} t={t} />
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
