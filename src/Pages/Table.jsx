import { useQuery } from "@apollo/client/react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
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

import { GET_TABLE_WITH_PAGINATION } from "../../graphql/queries";
import { translateLauguage } from "../function/translate";
import FooterPagination from "../include/FooterPagination";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
import { useAuth } from "../Context/AuthContext";
import TableAction from "../Components/table/TableAction";
import TableForm from "../Components/table/TableForm";

const TablePage = () => {
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
 

  const [openForm, setOpenForm] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");

  const { data, refetch, loading } = useQuery(GET_TABLE_WITH_PAGINATION, {
    variables: {
      shopId:null,
      page,
      limit,
      pagination: true,
      keyword,
      active:
        activeFilter === "active"
          ? true
          : activeFilter === "inactive"
          ? false
          : undefined,
    },
  });

  const tables = data?.getTablesWithPagination?.data || [];
  const paginator = data?.getTablesWithPagination?.paginator || {};

  const handleLimit = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const handleEdit = (table) => {
    setSelectedTable(table);
    setOpenForm(true);
  };

  const handleCreate = () => {
    setSelectedTable(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedTable(null);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between">
        <Breadcrumbs separator="/">
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
          <Typography
             
          >
            {t("table")}
          </Typography>
        </Breadcrumbs>
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} mt={5}>
        <Grid container
          spacing={2}
          fullWidth
          alignItems="center"
          textAlign="start">
          <Grid size={{ xs: 6, md: 6 }}>
            <Typography>{t("search")}</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder={t("search") + "..."}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6 }}>
            <Typography>{t("status")}</Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <MenuItem value="all">{t("all")}</MenuItem>
              <MenuItem value="active">{t("active")}</MenuItem>
              <MenuItem value="inactive">{t("inactive")}</MenuItem>
              
            </TextField>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          startIcon={<LibraryAddOutlinedIcon />}
          onClick={handleCreate}
        >
          {t("create")}
        </Button>
      </Box>

      <TableContainer sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("no")}</TableCell>
              <TableCell>{t("name")}</TableCell>
              <TableCell>{t("number")}</TableCell>
              <TableCell>{t("capactiy")}</TableCell>
              <TableCell>{t("status")}</TableCell>
              <TableCell align="center">{t("action")}</TableCell>
            </TableRow>
          </TableHead>

          {loading ? (
            <CircularIndeterminate />
          ) : tables.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {tables.map((row, idx) => (
                <TableRow key={row._id}>
                  <TableCell>
                    {(paginator.currentPage - 1) * limit + idx + 1}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.capacity}</TableCell>
                  <TableCell>
                    {row.active ? t("active") : t("inactive")}
                  </TableCell>
                  <TableCell align="center">
                    <TableAction
                      tableData={row}
                      setRefetch={refetch}
                      t={t}
                      onEdit={handleEdit}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

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

      <TableForm
        open={openForm}
        onClose={handleCloseForm}
        tableData={selectedTable}
        setRefetch={refetch}
        t={t}
      />
    </Box>
  );
};

export default TablePage;