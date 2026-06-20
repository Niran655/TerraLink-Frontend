import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";

import { DELETE_CUISINE_ORIGIN } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import UseDeleteForm from "../../include/useDeleteForm";
import CuisineOriginForm from "./CuisineOrigineForm";

export default function CuisineOriginAction({
  data,
  setRefetch,
  t,
  shopId,
}) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);


  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);


  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);


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


      <CuisineOriginForm
        open={openEdit}
        onClose={handleCloseEdit}
        t={t}
        cuisineOriginData={data}
        setRefetch={setRefetch}
        shopId={shopId}
      />


      <UseDeleteForm
        open={openDelete}
        onClose={handleCloseDelete}
        handleDelete={handleDelete}
        loading={loading}
      />
    </>
  );
}