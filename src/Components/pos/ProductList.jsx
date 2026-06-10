import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Skeleton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ProductList = ({
  t,
  language,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchKeyword,
  setSearchKeyword,
  filteredProducts,
  onProductClick,
  loading
}) => {
  const getLocalizedName = (obj) =>
    language === "kh"
      ? obj?.nameKh || obj?.nameKhmer || obj?.nameEn || obj?.nameEnglish || ""
      : obj?.nameEn || obj?.nameEnglish || obj?.nameKh || obj?.nameKhmer || "";

  const getProductUnitName = (item) => {
    const productName = getLocalizedName(item.parentProductId);
    const unitName = getLocalizedName(item.unitId);
    return unitName ? `${productName} (${unitName})` : productName;
  };

  const [visibleCount, setVisibleCount] = useState(12);

  const getCategoryData = (category, language) => {
    const name = language === "kh" ? category.nameKh : category.nameEn;
    return { name };
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const getDisplayPrice = (item) => {
    const additionPrice = item.additionPrices?.[0]?.price;
    return additionPrice ?? item.salePrice;
  };

  return (
    <>
      {/* HEADER */}
      <Grid container className="product-list-header">
        <Grid size={{ xs: 6 }}>
          <Typography className="section-title">
            {t(`product_list`)}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Box className="search-container">
            <TextField
              placeholder={t(`search`)}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              size="small"
              className="search-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* CATEGORY */}
      <Box className="category-scroll-container">
        {categories.map((category) => {
          const { name } = getCategoryData(category, language);
          return (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={
                selectedCategory === category.id ? "contained" : "outlined"
              }
              sx={{ borderRadius: 0.7 }}
            >
              {name}
            </Button>
          );
        })}
      </Box>

      {/* PRODUCT GRID */}
      <Grid container spacing={1} className="product-grid">

        {/* ✅ SKELETON LOADING */}
        {loading
          ? Array.from(new Array(12)).map((_, idx) => (
              <Grid size={{ xs: 3 }} key={idx}>
                <Card className="product-card">
                  <Skeleton variant="rectangular" height={100} />
                  <CardContent>
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={15} width="60%" />
                    <Box display="flex" justifyContent="space-between" mt={1}>
                      <Skeleton height={20} width="40%" />
                      <Skeleton height={24} width={40} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))

          /* ✅ REAL PRODUCTS */
          : filteredProducts
              ?.slice(0, visibleCount)
              .map((item, idx) => (
                <Grid size={{ xs: 3 }} key={idx}>
                  <Card
                    className="product-card"
                    onClick={() => onProductClick(item)}
                  >
                    <CardMedia
                      component="img"
                      height="100"
                      image={item.productImg || "/placeholder-food.jpg"}
                      alt={item.parentProductId?.nameKh || "Product"}
                    />
                    <CardContent>
                      <Typography className="product-name">
                        {getProductUnitName(item)}
                      </Typography>

                      <Typography className="product-category">
                        {language === "kh"
                          ? item.parentProductId?.categoryId?.nameKh
                          : item.parentProductId?.categoryId?.nameEn}
                      </Typography>

                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography className="product-price">
                          {getDisplayPrice(item)?.toLocaleString()}$
                        </Typography>

                        <Chip
                          label={
                            language === "kh"
                              ? item?.unitId?.nameKh
                              : item?.unitId?.nameEn
                          }
                          size="small"
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
      </Grid>

      {/* LOAD MORE */}
      {!loading && visibleCount < filteredProducts?.length && (
        <Box textAlign="center" mt={2} mb={10}>
          <Button variant="contained" onClick={handleLoadMore}>
            {t("load_more") || "Load More"}
          </Button>
        </Box>
      )}
    </>
  );
};

export default ProductList;
