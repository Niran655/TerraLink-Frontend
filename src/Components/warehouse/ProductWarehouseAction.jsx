import { IconButton, Stack, Tooltip } from "@mui/material";
import { Shrink, Trash } from "lucide-react";
import React, { useState } from "react";

import AdjustStockForm from "./AdjustStockForm";
 
import { DELETE_PRODUCT_FORM_WAREHOUSE } from "../../../graphql/mutation";
import { useMutation } from "@apollo/client/react";
import UseDeleteForm from "../include/useDeleteForm";

export default function ProductWarehouseAction({
  subProductId,
  t,
  setRefetch,
  unit,
  warehouseData
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  // GraphQL mutation hook
  const [deleteProduct, { loading }] = useMutation(
    DELETE_PRODUCT_FORM_WAREHOUSE,
    {
      onCompleted: () => {
        setRefetch((prev) => !prev); // trigger refetch
        handleCloseDelete();
      },
      onError: (err) => {
        console.error("Delete failed:", err);
      },
    }
  );

  const handleDelete = () => {
    deleteProduct({
      variables: {
        id: warehouseData?._id,  
      },
    });
  };

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Tooltip title={t("adjust_stock")}>
          <IconButton className="edit-icon" onClick={handleOpen}>
            <Shrink size="18px" color="#36BBA7" />
          </IconButton>
        </Tooltip>

        <Tooltip title={t("delete")}>
          <IconButton className="delete-icon" onClick={handleOpenDelete}>
            <Trash size="18px" color="red" />
          </IconButton>
        </Tooltip>

        {open && (
          <AdjustStockForm
            open={open}
            unit={unit}
            onClose={handleClose}
            subProductId={subProductId}
            setRefetch={setRefetch}
            t={t}
          />
        )}

        {openDelete && (
          <UseDeleteForm
            open={openDelete}
            onClose={handleCloseDelete}
            handleDelete={handleDelete}
            loading={loading}
          />
        )}
      </Stack>
    </div>
  );
}