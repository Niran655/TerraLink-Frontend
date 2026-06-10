import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import React, { useState } from "react";

import DeleteUnit from "./DeleteUnit";
import UnitForm from "./UnitForm";
export default function UnitAction({
  unitData,
  setRefetch,
  unitId,
  t,
  unitName,
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

      <UnitForm
        open={open}
        onClose={handleClose}
        dialogTitle="Update"
        unitData={unitData}
        setRefetch={setRefetch}
        t={t}
      />

      <DeleteUnit
        setRefetch={setRefetch}
        open={openDelete}
        onClose={handleCloseDelete}
        unitId={unitId}
        unitName={unitName}
      />
    </div>
  );
}
