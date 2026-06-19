// CuisineOriginAction.jsx

import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";

import { DELETE_CUISINE_ORIGIN } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import UseDeleteForm from "../../include/useDeleteForm";
import CuisineOriginForm from "./cuisineOrigineForm";

export default function CuisineOriginAction({
  data,          // the cuisine origin object (for edit/delete)
  setRefetch,    // function to refetch list after mutation
  t,
  shopId,        // needed for create; but edit/delete use the item's _id
}) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);

  // Edit modal state
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  // Delete modal state
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  // Delete mutation
  const [deleteCuisineOrigin] = useMutation(DELETE_CUISINE_ORIGIN, {
    onCompleted: ({ deleteCuisineOrigin }) => {
      setLoading(false);
      if (deleteCuisineOrigin?.isSuccess) {
        handleCloseDelete();
        setAlert(true, "success", deleteCuisineOrigin.message);
        setRefetch(); // refresh list
      } else {
        setAlert(true, "error", deleteCuisineOrigin.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  const handleDelete = () => {
    setLoading(true);
    deleteCuisineOrigin({ variables: { id: data._id } });
  };

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <IconButton size="small" onClick={handleOpenEdit}>
          <SquarePen size="16px" color="#36BBA7" />
        </IconButton>
        <IconButton size="small" onClick={handleOpenDelete}>
          <Trash size="16px" color="red" />
        </IconButton>
      </Stack>

      {/* Edit Form */}
      <CuisineOriginForm
        open={openEdit}
        onClose={handleCloseEdit}
        t={t}
        cuisineOriginData={data}
        setRefetch={setRefetch}
        shopId={shopId}
      />

      {/* Delete Confirmation */}
      <UseDeleteForm
        open={openDelete}
        onClose={handleCloseDelete}
        handleDelete={handleDelete}
        loading={loading}
      />
    </>
  );
}