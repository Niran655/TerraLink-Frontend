import { IconButton, Stack } from "@mui/material";
import { QrCode, ScanEye, SquarePen, Trash } from "lucide-react";
import React, { useState } from "react";

import SubProductDelete from "./SubProductDelete";
import SubProductForm from "./SubProductForm";
import SubProductBarcode from "./SubProductBarcode";

export default function SubProductAction({
  subProductData,
  setRefetch,
  subProductId,
  t,
  supProductName,
  parentProductId,
  unit

}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const [openBarcode, setOpenBarcode] = useState(false);
  const handleOpenBarcode = () => setOpenBarcode(true);
  const handleCloseBarcode = () => setOpenBarcode(false);
  return (
    <div>
      <Stack direction="row" justifyContent={"flex-end"} spacing={1}>
        <IconButton onClick={handleOpenBarcode} sx={{ backgroundColor: "#E0F7FA", color: "#21BCFF" }}>
          <QrCode size="18px" />
        </IconButton>
        <IconButton sx={{ backgroundColor: "#FFF3E0", color: "orange" }}>
          <ScanEye size="18px" />
        </IconButton>
        <IconButton
          className="edit-icon"
          onClick={handleOpen}
          sx={{ backgroundColor: "#E8F5E9" }}
        >
          <SquarePen size="18px" color="#36BBA7" />
        </IconButton>
        <IconButton
          className="delete-icon"
          onClick={handleOpenDelete}
          sx={{ backgroundColor: "#FFEBEE" }}
        >
          <Trash size="18px" color="red" />
        </IconButton>
      </Stack>

      <SubProductForm
        open={open}
        onClose={handleClose}
        dialogTitle="Update"
        subProductData={subProductData}
        subProductId={subProductId}
        setRefetch={setRefetch}
        parentProductId={parentProductId}
        unit={unit}
        t={t}
      />

      <SubProductDelete
        setRefetch={setRefetch}
        open={openDelete}
        onClose={handleCloseDelete}
        subProductId={subProductId}
        supProductName={supProductName}
        imageUrls={[subProductData?.productImg, subProductData?.priceImg]}
      />

      <SubProductBarcode
        open={openBarcode}
        onClose={handleCloseBarcode}
        subProductId={subProductId}
        t={t}
      />
    </div>
  );
}
