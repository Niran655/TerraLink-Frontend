import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import React, { useState } from "react";

import ProductDelete from "./ProductDelete";
import ProductForm from "./ProductForm";


export default function ProductAction({
  productData,
  setRefetch,
  productId,
  t,
  productName,
  language
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  return (
    <div>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <IconButton className="edit-icon" onClick={handleOpen}>
          <SquarePen  size="18px" color="#36BBA7" />
        </IconButton>
        <IconButton className="delete-icon" onClick={handleOpenDelete}>
          <Trash size="18px" color="red " />
        </IconButton>
      </Stack>

      <ProductForm
        open={open}
        onClose={handleClose}
        dialogTitle="Update"
        productData={productData}
        setRefetch={setRefetch}
        t={t}
        language={language}
      />

      <ProductDelete
        setRefetch={setRefetch}
        open={openDelete}
        onClose={handleCloseDelete}
        productId={productId}
        productName={productName}
        imageUrl={productData?.image}
      />
    </div>
  );
}
