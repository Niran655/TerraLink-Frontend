import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import React, { useState } from "react";

import { DELETE_SUPPLIER, DELETE_USER } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import UseDeleteForm from "../include/useDeleteForm";
 
import SupplierForm from "./SupplierForm";

export default function SupplierAction({
  supplierData,
  setRefetch,
  supplierId,
  t,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const [loading, setLoading] = useState(false);
  const { setAlert } = useAuth();

  const [deleteSupplier] = useMutation(DELETE_SUPPLIER, {
    onCompleted: ({ deleteSupplier }) => {
      setLoading(false);
      if (deleteSupplier?.isSuccess) {
        handleCloseDelete();
        setAlert(true, "success", deleteSupplier?.message);
        setRefetch();
      } else {
        setAlert(true, "error", deleteSupplier?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      console.error("Error", error);
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    },
  });

  const handleDelete = () => {
    if (!supplierId) {
      setAlert(true, "error", t("user_id_missing"));
      return;
    }

    setLoading(true);
    deleteSupplier({ variables: { id: supplierId } });
  };

  return (
    <div>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <IconButton className="edit-icon" onClick={handleOpen}>
          <SquarePen size="18px" color="#36BBA7" />
        </IconButton>
        <IconButton className="delete-icon" onClick={handleOpenDelete}>
          <Trash size="18px" color="red" />
        </IconButton>
      </Stack>

      <SupplierForm
        open={open}
        onClose={handleClose}
        dialogTitle="Update"
        supplierData={supplierData}
        setRefetch={setRefetch}
        t={t}
      />

      <UseDeleteForm
        open={openDelete}
        onClose={handleCloseDelete}
        handleDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}
