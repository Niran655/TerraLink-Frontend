import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import { useQuery } from "@apollo/client/react";
import { Link as RouterLink } from "react-router-dom";
import { Autocomplete, Box, Breadcrumbs, Button, Grid, IconButton, InputAdornment, MenuItem, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { CopyPlus, Search } from "lucide-react";
import { useState } from "react";

import SubProductAction from "../Components/product/SubProductAction";
import SubProductForm from "../Components/product/SubProductForm";
import ProductAction from "../Components/product/ProductAction";
import ProductForm from "../Components/product/ProductForm";
import FooterPagination from "../include/FooterPagination";
import "../Styles/TableStyle.scss";
import { useAuth } from "../Context/AuthContext";
import { GET_CATEGORY, GET_PRODUCT_WITH_PAGINATION, GET_SUP_PRODUCT } from "../../graphql/queries";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";

const Product = () => {
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  const [open, setOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const [openSub, setOpenSub] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenSub = () => setOpenSub(true);
  const handleCloseSub = () => setOpenSub(false);

  const { data, loading, refetch } = useQuery(GET_PRODUCT_WITH_PAGINATION, {
    variables: {
      page,
      limit,
      pagination: true,
      keyword,
      ...(categoryId && { categoryId }),
      ...(activeFilter !== "all" && {
        active: activeFilter === "active" ? true : false,
      }),
    },
  });

  const { data: categoryData } = useQuery(GET_CATEGORY);
  const categories = categoryData?.getCategory || [];

  const {
    data: subData,
    loading: subLoading,
    refetch: refetchSub,
  } = useQuery(GET_SUP_PRODUCT, {
    variables: { parentProductId: selectedParentId },
  });


  const subProductData = subData?.getSubProducts || [];

  const paginator = data?.getProductsWithPagination?.paginator || {};
  const handleExpand = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
      setSelectedParentId(null);
    } else {
      setExpandedRow(id);
      setSelectedParentId(id);
      refetchSub({ parentProductId: id });
    }
  };

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

            <Typography   sx={{ fontWeight: 600 }}>
              {t("product")}
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
        <Grid container spacing={2} alignItems="center" textAlign={"start"} sx={{ flex: 1, width: "100%" }}>
          <Grid size={{ xs: 12, md: 3 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              {t("category")}
            </Typography>
            <Autocomplete
              fullWidth
              size="small"
              options={categories}
              value={categories.find((cat) => cat._id === categoryId) || null}
              getOptionLabel={(option) =>
                language === "en" ? option.nameEn || "" : option.nameKh || ""
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
              onChange={(_, newValue) => {
                setCategoryId(newValue?._id || "");
                setPage(1);
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder={t("all")} />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              {t("status")}
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setPage(1);
              }}
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

          {open && (
            <ProductForm
              open={open}
              t={t}
              dialogTitle={"Create"}
              onClose={handleClose}
              setRefetch={refetch}
            />
          )}
        </Stack>
      </Box>


      <TableContainer className="table-container" sx={{ mt: 2 }} >
        <Table className="table">
          <TableHead  >
            <TableRow>
              <TableCell>{t("no")}</TableCell>
              <TableCell>{t("khmer_name")}</TableCell>
              <TableCell>{t("minimun_unit")}</TableCell>
              <TableCell>{t("category")}</TableCell>
              <TableCell>{t("remark")}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          {loading ? (
            <CircularIndeterminate />
          ) : data?.getProductsWithPagination?.data?.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {data?.getProductsWithPagination?.data?.map((row, index) => (
                <>

                  <TableRow key={row._id} className="table-row">
                    <TableCell>{paginator.slNo + index}</TableCell>

                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {/* <img
                          src={row?.image}
                          width={40}
                          height={40}
                          style={{
                            borderRadius: "100%",
                            objectFit: "cover",
                          }}
                        /> */}
                        {language === "en" ? row.nameEn : row.nameKh}
                      </Box>
                    </TableCell>

                    <TableCell>
                      {language === "en"
                        ? row?.unitId?.nameEn
                        : row?.unitId?.nameKh}
                    </TableCell>

                    <TableCell>
                      {language === "en"
                        ? row?.categoryId?.nameEn
                        : row?.categoryId?.nameKh}
                    </TableCell>

                    <TableCell>{row?.remark}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <ProductAction
                          t={t}
                          productData={row}
                          productId={row._id}
                          productName={row?.nameEn}
                          setRefetch={refetch}
                          language={language}
                        />

                        <IconButton onClick={() => handleExpand(row._id)}>
                          <ExpandMoreIcon
                            sx={{
                              transform:
                                expandedRow === row._id ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "0.3s",
                              color: "#36BBA7",
                            }}
                          />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>

              
                  {expandedRow === row._id && (
                    <TableRow className="table-row">
                      <TableCell colSpan={6} sx={{ p: 0 }}>
                        <Accordion
                          expanded
                          disableGutters
                          sx={{
                            boxShadow: "none",
                            transition: "all 0.5s ease-in-out",
                          }}
                        >
                          <AccordionDetails>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>{t("product")}</TableCell>
                                  <TableCell>{t("type_sale")}</TableCell>
                                  <TableCell>{t("unit")}</TableCell>
                                  <TableCell>{t("cost")}</TableCell>
                                  <TableCell>{t("sale_price")}</TableCell>
                                  <TableCell>{t("tax_rate")}</TableCell>
                                  <TableCell>{t("service")}</TableCell>
                                  <TableCell>{t("total_price")}</TableCell>
                                  <TableCell>{t("minimun_unit")}</TableCell>
                                  <TableCell  >
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                      <IconButton onClick={handleOpenSub}>
                                        <CopyPlus color="#36BBA7" size={20} />
                                      </IconButton>
                                    </Stack>


                                    {openSub && (
                                      <SubProductForm
                                        open={openSub}
                                        t={t}
                                        dialogTitle={"Create"}
                                        parentProductId={row._id}
                                        onClose={handleCloseSub}
                                        unit={row?.unitId}
                                        setRefetch={() =>
                                          refetchSub({
                                            parentProductId: row._id,
                                          })
                                        }
                                      />
                                    )}
                                  </TableCell>
                                </TableRow>
                              </TableHead>

                              {subLoading ? (
                                <TableBody>
                                  {Array.from({
                                    length:
                                      subProductData?.length > 0
                                        ? subProductData.length
                                        : 1,
                                  }).map((_, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell>
                                        <Skeleton
                                          variant="circular"
                                          width={40}
                                          height={40}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Skeleton variant="text" width={80} />
                                      </TableCell>
                                      <TableCell>
                                        <Skeleton variant="text" width={60} />
                                      </TableCell>
                                      <TableCell>
                                        <Skeleton variant="text" width={70} />
                                      </TableCell>
                                      <TableCell>
                                        <Skeleton variant="text" width={70} />
                                      </TableCell>
                                      <TableCell>
                                        <Skeleton variant="text" width={60} />
                                      </TableCell>
                                      <TableCell>
                                        <Skeleton variant="text" width={70} />
                                      </TableCell>
                      
                                      <TableCell>
                                        <Skeleton variant="text" width={80} />
                                      </TableCell>
                                      <TableCell>
                                        <Stack direction={"row"} spacing={1}>
                                          {[...Array(4)].map((_, idx) => (
                                            <Skeleton
                                              key={idx}
                                              variant="circular"
                                              width={30}
                                              height={30}
                                            />
                                          ))}
                                        </Stack>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              ) : subProductData.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={10}>
                                    <Typography
                                      textAlign="center"
                                      color="gray"
                                      mt={1}
                                    >
                                      No Sub Products
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                <TableBody>
                                  {subProductData.map((p) => (
                                    <TableRow
                                      key={p._id}
                                      sx={{ "& td, & th": { border: 0 } }}
                                      className="table-row"
                                    >
                                      <TableCell>
                                        <Box
                                          display="flex"
                                          alignItems="center"
                                          gap={1}
                                        >
                                          <img
                                            src={p?.productImg}
                                            width={40}
                                            height={40}
                                            style={{
                                              borderRadius: 2,
                                              objectFit: "cover",
                                            }}
                                          />
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        {p.saleType == "retail"
                                          ? t(`retail`)
                                          : t(`wholesale`)}
                                      </TableCell>
                                      <TableCell>
                                        {language == "en"
                                          ? p.unitId?.nameEn
                                          : p.unitId?.nameKh}
                                      </TableCell>
                                      <TableCell>
                                        $ {p.costPrice.toFixed(2)}
                                      </TableCell>
                                      <TableCell>
                                        $ {p.salePrice.toFixed(2)}
                                      </TableCell>
                                      <TableCell>
                                        $ {p.taxRate.toFixed(2)}
                                      </TableCell>
                                      <TableCell>
                                        $ {p.servicePrice.toFixed(2)}
                                      </TableCell>
                                      <TableCell>
                                        $ {p.totalPrice.toFixed(2)}
                                      </TableCell>
                                      <TableCell>
                                        {p.qty * p.stock}{" "}
                                        {language == "kh"
                                          ? row?.unitId?.nameKh
                                          : row?.unitId?.nameEn}
                                        / {(p.qty * p.stock) / p.qty}{" "}
                                        {language == "en"
                                          ? p.unitId?.nameEn
                                          : p.unitId?.nameKh}
                                      </TableCell>

                                      <TableCell className="flex-end">
                                        <SubProductAction
                                          setRefetch={refetchSub}
                                          supProductName={t(`delete`)}
                                          parentProductId={row._id}
                                          subProductId={p?._id}
                                          subProductData={p}
                                          unit={row?.unitId}
                                          t={t}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              )}
                            </Table>
                          </AccordionDetails>
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  )}
                </>
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

export default Product;
