import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  InputAdornment,
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
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { useTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import dayjs from "dayjs";

import FooterPagination from "../include/FooterPagination";
import "../Styles/TableStyle.scss";

import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";

import { GET_SHIFT_SESSIONS } from "../../graphql/queries";
import ShiftSessionAction from "../Components/shiftSession/ShiftSessionAction";
import ShiftSessionForm from "../Components/shiftSession/ShiftSessionForm";

const toStartOfDayISO = (value) => {
  if (!value) return null;
  return dayjs(value).startOf("day").toISOString();
};

const toEndOfDayISO = (value) => {
  if (!value) return null;
  return dayjs(value).endOf("day").toISOString();
};

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const StoreSetting = () => {
  const theme = useTheme();
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  const { shopId } = useParams();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

  const { data, loading, error, refetch } = useQuery(GET_SHIFT_SESSIONS, {
    variables: {
      shopId,
      startDate: toStartOfDayISO(startDate),
      endDate: toEndOfDayISO(endDate),
    },
    fetchPolicy: "network-only",
  });

  const shiftSession = data?.getShiftSessions || [];


  const filteredData = shiftSession.filter((shift) => {
    const searchValue = keyword.toLowerCase();
    return (
      shift?.shiftName?.toLowerCase().includes(searchValue) ||
      shift?.user?.nameEn?.toLowerCase().includes(searchValue) ||
      shift?.user?.nameKh?.toLowerCase().includes(searchValue)
    );
  });


  const startIndex = (page - 1) * limit;
  const paginatedData = filteredData.slice(startIndex, startIndex + limit);

  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };


  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };


  if (error) {
    return (
      <Typography color="error">
        Error loading shift sessions
      </Typography>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>



        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box textAlign="start">
            <Breadcrumbs aria-label="breadcrumb" separator="/">

              <Typography
                component={RouterLink}
                to="/store"

                sx={{
                  textDecoration: "none",
                  borderLeft: "3px solid #1D4592",
                  pl: 1.5,
                  fontWeight: 600,
                }}
              >
                {t("store")}
              </Typography>

              <Typography

                sx={{ fontWeight: 600 }}
                color="text.primary"
              >

                {t(`shift_sessions`)}
              </Typography>

            </Breadcrumbs>
          </Box>
        </Stack>


        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          mt={5}
        >
          <Grid container spacing={2} alignItems="center" textAlign="start">

            <Grid xs={12}>
              <Typography variant="body2" fontWeight={500} mb={0.5}>
                {t("search")}
              </Typography>

              <TextField
                type="search"
                size="small"
                placeholder={t("search") + "..."}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <Typography variant="body2" fontWeight={500} mb={0.5}>
                {t("start_date")}
              </Typography>
              <DatePicker

                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  setPage(1);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    },
                  },
                }}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <Typography variant="body2" fontWeight={500} mb={0.5}>
                {t("end_date")}
              </Typography>
              <DatePicker

                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                  setPage(1);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    },
                  },
                }}
              />
            </Grid>

          </Grid>
          <Stack direction="row" spacing={2} mt={3}>
            <Button
              variant="outlined"
              onClick={() => {
                const today = dayjs();
                setStartDate(today);
                setEndDate(today);
                setPage(1);
              }}
            >
              Today
            </Button>
            <Button
              variant="contained"
              startIcon={<LibraryAddOutlinedIcon size={18} />}
              onClick={handleOpen}
            >
              {t("create")}
            </Button>
            {open && (
              <ShiftSessionForm
                dialogTitle="Create"
                open={open}
                onClose={handleClose}
                setRefetch={refetch}
                t={t}
              />
            )}
          </Stack>
        </Box>


        <TableContainer className="table-container" sx={{ mt: 2 }}>
          <Table className="table">



            <TableHead>
              <TableRow>

                <TableCell>{t(`no`)}</TableCell>
                <TableCell>{t(`user`)}</TableCell>
                <TableCell>{t(`shop`)}</TableCell>
                <TableCell>{t(`shift_name`)}</TableCell>
                <TableCell>{t(`start_time`)}</TableCell>
                <TableCell>{t(`end_time`)}</TableCell>
                <TableCell>{t(`status`)}</TableCell>
                <TableCell>{t(`total_orders`)}</TableCell>
                <TableCell>{t(`total_sales`)}</TableCell>
                <TableCell align="center"></TableCell>

              </TableRow>
            </TableHead>



            {loading ? (
              <CircularIndeterminate />
            ) : paginatedData.length === 0 ? (
              <EmptyData />
            ) : (
              <TableBody>

                {paginatedData.map((shift, index) => (

                  <TableRow key={shift._id} className="table-row">

                    <TableCell>
                      {(page - 1) * limit + index + 1}
                    </TableCell>

                    <TableCell>
                      {language === 'en' ? shift?.user?.nameEn : shift?.user?.nameKh}
                    </TableCell>

                    <TableCell>
                      {language === "en" ? shift?.shop?.nameEn : shift?.shop?.nameKh}
                    </TableCell>

                    <TableCell>{shift?.shiftName}</TableCell>

                    <TableCell>
                      {formatDate(shift?.startTime)}
                    </TableCell>

                    <TableCell>
                      {formatDate(shift?.endTime)}
                    </TableCell>

                    <TableCell>
                      {shift?.status === "open"
                        ? "🟢 OPEN"
                        : "🔴 CLOSED"}
                    </TableCell>

                    <TableCell>
                      {shift?.totalOrders || 0}
                    </TableCell>

                    <TableCell>
                      {formatMoney(shift?.totalSales)}
                    </TableCell>

                    <TableCell align="center">

                      <ShiftSessionAction
                        shiftData={shift}
                        shiftId={shift._id}
                        setRefetch={refetch}
                        t={t}
                      />

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
              totalDocs={filteredData.length}
              totalPages={Math.ceil(filteredData.length / limit)}
            />

          </Stack>

        </TableContainer>

      </Box>
    </LocalizationProvider>
  );
};

export default StoreSetting;
