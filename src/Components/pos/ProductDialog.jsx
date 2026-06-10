import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  CardMedia,
  Stack,
  Typography,
  Chip,
  Divider,
  IconButton,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Slide,
  Fade,
} from "@mui/material";
import { CirclePlus, CircleMinus, X, ShoppingCart, Tag, Package, Layers } from "lucide-react";

 
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

 
function OptionCard({ label, sublabel, price, selected, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1.5,
        py: 1.25,
        borderRadius: "8px",
        border: "1px solid",
        borderColor: selected ? "primary.main" : "divider",
        backgroundColor: selected ? "primary.main" : "transparent",
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": {
          borderColor: selected ? "primary.main" : "primary.light",
          backgroundColor: selected ? "primary.main" : "action.hover",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: "2px solid",
            borderColor: selected ? "#fff" : "text.disabled",
            backgroundColor: selected ? "#fff" : "transparent",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selected && (
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "primary.main" }} />
          )}
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: "0.8125rem",
              fontWeight: selected ? 600 : 400,
              color: selected ? "#fff" : "text.primary",
              lineHeight: 1.2,
            }}
          >
            {label}
          </Typography>
          {sublabel && (
            <Typography sx={{ fontSize: "0.7rem", color: selected ? "rgba(255,255,255,0.7)" : "text.secondary", mt: 0.25 }}>
              {sublabel}
            </Typography>
          )}
        </Box>
      </Box>
      {price > 0 && (
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: selected ? "#fff" : "primary.main",
            backgroundColor: selected ? "rgba(255,255,255,0.18)" : "action.hover",
            px: 1,
            py: 0.25,
            borderRadius: "4px",
            flexShrink: 0,
          }}
        >
          +${price.toFixed(2)}
        </Typography>
      )}
    </Box>
  );
}

 
function SectionHead({ icon: Icon, label }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
      {Icon && <Icon size={14} style={{ opacity: 0.5 }} />}
      <Typography
        sx={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

 
const ProductDialog = ({ open, onClose, product, onAddToCart, language, t }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedSugar, setSelectedSugar] = useState(null);

  useEffect(() => {
    if (product?.additionPrices?.length > 0) {
      const first = product.additionPrices[0];
      setSelectedSize(first);
      setSelectedSugar(first.children?.[0] || null);
    } else {
      setSelectedSize(null);
      setSelectedSugar(null);
    }
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const sizePrice     = selectedSize?.price || 0;
  const sugarPrice    = selectedSugar?.price || 0;
  const additionTotal = sizePrice + sugarPrice;
  const basePrice     = product.salePrice || 0;
  const finalUnit     = basePrice + additionTotal;
  const finalTotal    = finalUnit * quantity;

  const getName = (obj) =>
    language === "kh" ? (obj?.nameKh || obj?.nameKhmer || obj?.nameEn || obj?.nameEnglish || "") : (obj?.nameEn || obj?.nameEnglish || obj?.nameKh || obj?.nameKhmer || "");

  const getSugarLabel = (s) => s.sugarLevel || getName(s);

  const buildItemName = () => {
    const productName = getName(product.parentProductId);
    const unitName = getName(product.unitId);
    const parts = [unitName ? `${productName} (${unitName})` : productName];
    if (selectedSize) parts.push(getName(selectedSize));
    if (selectedSugar) parts.push(`(${getSugarLabel(selectedSugar)})`);
    return parts.join(" — ");
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSelectedSugar(size.children?.[0] || null);
  };

  const handleAddToCart = () => {
    const uniqueId = `${product._id}_${selectedSize?._id || "no_size"}_${selectedSugar?._id || "no_sugar"}`;
    onAddToCart({
      id: uniqueId,
      originalId: product._id,
      subProductId: product._id,
      productId: product.parentProductId._id,
      name: buildItemName(),
      nameEn: buildItemName(),
      nameKh: buildItemName(),
      price: finalUnit,
      qty: quantity,
      img: product.productImg,
      variant: getName(product.unitId) || product.saleType || "Original",
      selectedSize,
      selectedSugar,
    });
    onClose();
  };

  const hasSizes  = product.additionPrices?.length > 0;
  const hasSugars = selectedSize?.children?.length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: "5px",
          overflow: "hidden",
          backgroundImage: "none",
 
        },
      }}
    >
     
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={product.productImg || "/placeholder-food.jpg"}
          alt={getName(product.parentProductId)}
          sx={{
            width: "100%",
            height: 220,
            objectFit: "cover",
            display: "block",
          }}
        />
        {/* Dark gradient overlay at bottom of image */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Close button */}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(6px)",
            color: "#fff",
            width: 32,
            height: 32,
            "&:hover": { backgroundColor: "rgba(0,0,0,0.65)" },
          }}
        >
          <X size={15} />
        </IconButton>
        {/* Sale type chip */}
        {product.saleType && (
          <Chip
            label={product.saleType}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              backgroundColor: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(6px)",
              color: "#fff",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              height: 22,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          />
        )}
 
        <Box sx={{ position: "absolute", bottom: 14, left: 16, right: 56 }}>
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 700,
              lineHeight: 1.25,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              fontSize: { xs: "1rem", sm: "1.125rem" },
            }}
          >
            {getName(product.parentProductId)}
          </Typography>
        </Box>
      </Box>

 
      <DialogContent
        sx={{
          p: 0,
          overflowY: "auto",
          maxHeight: "calc(90vh - 220px - 76px)",
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": { borderRadius: 2, backgroundColor: "divider" },
        }}
      >
        <Stack sx={{ p: 2.5 }} spacing={2.5}>

          {/* Meta row */}
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {product.parentProductId?.categoryId && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Layers size={12} style={{ opacity: 0.45 }} />
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                  {getName(product.parentProductId.categoryId)}
                </Typography>
              </Box>
            )}
            {product.unitId && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Package size={12} style={{ opacity: 0.45 }} />
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                  {getName(product.unitId)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Description */}
          {product.productDes && (
            <Typography
              sx={{
                fontSize: "0.8125rem",
                color: "text.secondary",
                lineHeight: 1.65,
                borderLeft: "2px solid",
                borderColor: "divider",
                pl: 1.5,
              }}
            >
              {product.productDes}
            </Typography>
          )}

          {/* Size selection */}
          {hasSizes && (
            <Box>
              <SectionHead icon={Tag} label={t("additions") || "Choose Size"} />
              <Stack spacing={0.75}>
                {product.additionPrices.map((size) => (
                  <OptionCard
                    key={size._id}
                    label={language === "kh" ? size.nameKhmer || size.nameEnglish : size.nameEnglish || size.nameKhmer}
                    price={size.price || 0}
                    selected={selectedSize?._id === size._id}
                    onClick={() => handleSizeSelect(size)}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Sugar / sub-option selection */}
          {hasSugars && (
            <Box>
              <SectionHead label={language === "kh" ? "កម្រិតស្ករ" : "Sugar Level"} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: "6px",
                }}
              >
                {selectedSize.children.map((sugar) => (
                  <OptionCard
                    key={sugar._id}
                    label={getSugarLabel(sugar)}
                    price={sugar.price || 0}
                    selected={selectedSugar?._id === sugar._id}
                    onClick={() => setSelectedSugar(sugar)}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Price breakdown */}
          <Box
            sx={{
              borderRadius: "10px",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.25,
                backgroundColor: "action.hover",
                borderBottom: additionTotal > 0 ? "1px solid" : "none",
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                {t("base_price") || "Base price"}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "text.primary" }}>
                ${basePrice.toFixed(2)}
              </Typography>
            </Box>
            {additionTotal > 0 && (
              <Box
                sx={{
                  px: 2,
                  py: 1.25,
                  backgroundColor: "action.hover",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                  {t("additions") || "Add-ons"}
                </Typography>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "primary.main" }}>
                  +${additionTotal.toFixed(2)}
                </Typography>
              </Box>
            )}
          </Box>

        </Stack>
      </DialogContent>

 
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        {/* Quantity stepper */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "8px",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <IconButton
            onClick={() => setQuantity((p) => Math.max(1, p - 1))}
            size="small"
            sx={{
              borderRadius: 0,
              width: 36,
              height: 36,
              color: "text.secondary",
              "&:hover": { backgroundColor: "action.hover", color: "text.primary" },
            }}
          >
            <CircleMinus size={16} />
          </IconButton>
          <Box
            sx={{
              width: 40,
              textAlign: "center",
              borderLeft: "1px solid",
              borderRight: "1px solid",
              borderColor: "divider",
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: "text.primary" }}>
              {quantity}
            </Typography>
          </Box>
          <IconButton
            onClick={() => setQuantity((p) => p + 1)}
            size="small"
            sx={{
              borderRadius: 0,
              width: 36,
              height: 36,
              color: "text.secondary",
              "&:hover": { backgroundColor: "action.hover", color: "text.primary" },
            }}
          >
            <CirclePlus size={16} />
          </IconButton>
        </Box>

      
        <Button
          variant="contained"
          fullWidth
          onClick={handleAddToCart}
          startIcon={<ShoppingCart size={16} />}
          sx={{
            height: 44,
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.875rem",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
            display: "flex",
            justifyContent: "space-between",
            px: 2,
          }}
        >
          <span>{language === "kh" ? "បញ្ចូលទៅក្នុងរទេះ" : "Add to Cart"}</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>${finalTotal.toFixed(2)}</span>
        </Button>
      </Box>
    </Dialog>
  );
};

export default ProductDialog;
