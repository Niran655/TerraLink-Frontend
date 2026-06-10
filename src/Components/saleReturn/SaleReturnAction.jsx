import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { Eye, SquarePen, Trash } from "lucide-react";
import { useState } from "react";

import { DELETE_SALE } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import UseDeleteForm from "../include/useDeleteForm";

export default function SaleReturnAction({ row, onEdit, onView, onDeleted }) {
  const { setAlert } = useAuth();
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deleteSale] = useMutation(DELETE_SALE, {
    onCompleted: ({ deleteSale }) => {
      setLoading(false);
      if (deleteSale?.isSuccess) {
        setOpenDelete(false);
        setAlert(true, "success", deleteSale.message);
        onDeleted();
      } else {
        setAlert(true, "error", deleteSale.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  return (
    <>
      <Stack direction="row" justifyContent="center" spacing={1}>
        <IconButton onClick={() => onView(row)}>
          <Eye size={18} color="#1D4592" />
        </IconButton>
        <IconButton onClick={() => onEdit(row)}>
          <SquarePen size={18} color="#36BBA7" />
        </IconButton>
        <IconButton onClick={() => setOpenDelete(true)}>
          <Trash size={18} color="red" />
        </IconButton>
      </Stack>
      <UseDeleteForm
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        loading={loading}
        handleDelete={() => {
          setLoading(true);
          deleteSale({ variables: { id: row._id } });
        }}
      />
    </>
  );
}
