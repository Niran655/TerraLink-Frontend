import { Dialog, DialogContent, DialogTitle, Button } from "@mui/material";
import Barcode from "react-barcode";
import { useRef } from "react";

export default function SubProductBarcode({ open, onClose, subProductId, t }) {
  const barcodeRef = useRef();

  const handleDownload = () => {
    if (!barcodeRef.current) return;

    const svg = barcodeRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();

    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;

      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);

      URL.revokeObjectURL(url);

      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${subProductId || "barcode"}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = url;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          overflow: "visible", 
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        Barcode
      </DialogTitle>

      <DialogContent
        sx={{
          textAlign: "center",
        
          p: 3,
          overflow: "visible",  
        }}
      >
        <div ref={barcodeRef} style={{ display: "inline-block" }}>
          <Barcode
            value={subProductId || "000000"}
            format="CODE128"
            width={1.5}         
            height={100}    
            fontSize={20}     
            margin={30}    
            displayValue={true}
          
          />
        </div>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleDownload}
        >
          {t("save")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}