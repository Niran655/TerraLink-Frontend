import { IconButton, Stack,Box } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import React, { useState } from "react";

import DeleteCategory from "./DeleteCategory";
import CategoryForm from "./CategoryForm";

export default function CategoryAction({
  categoryData,
  setRefetch,
  categoryId,
  t,
  categoryName,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  return (
    <Box>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <IconButton className="edit-icon" onClick={handleOpen}>
          <SquarePen  size="18px" color="#36BBA7" />
        </IconButton>
        <IconButton className="delete-icon" onClick={handleOpenDelete}>
          <Trash size="18px" color="red " />
        </IconButton>
      </Stack>

      <CategoryForm
        open={open}
        onClose={handleClose}
        dialogTitle="Update"
        categoryData={categoryData}
        setRefetch={setRefetch}
        t={t}
      />

      <DeleteCategory
        setRefetch={setRefetch}
        open={openDelete}
        onClose={handleCloseDelete}
        categoryId={categoryId}
        categoryName={categoryName}
      />
    </Box>
  );
}
