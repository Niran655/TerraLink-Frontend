// MealTypeAction.jsx

import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";

import { DELETE_MEAL_TYPE } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import UseDeleteForm from "../../include/useDeleteForm";
import MealTypeForm from "./MealTypeForm";

export default function MealTypeAction({
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

  
  const [deleteMealType] = useMutation(DELETE_MEAL_TYPE, {
    onCompleted: ({ deleteMealType }) => {
      setLoading(false);
      if (deleteMealType?.isSuccess) {
        handleCloseDelete();
        setAlert(true, "success", deleteMealType.message);
        setRefetch();  w
      } else {
        setAlert(true, "error", deleteMealType.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  const handleDelete = () => {
    setLoading(true);
    deleteMealType({ variables: { id: data._id } });
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

       
      <MealTypeForm
        open={openEdit}
        onClose={handleCloseEdit}
        mealTypeData={data}
        setRefetch={setRefetch}
        shopId={shopId}
        t={t}
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