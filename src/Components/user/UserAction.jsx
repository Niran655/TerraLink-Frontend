import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash, ScanEye } from "lucide-react";
import React, { useState } from "react";

import { DELETE_USER } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import UseDeleteForm from "../include/useDeleteForm";
import UserForm from "./UserForm";
import { useNavigate } from "react-router-dom";
import { deleteImageFromStorage } from "../../utils/supabaseImageStorage";


export default function UserAction({
  userData,
  setRefetch,
  userId,
  t,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const navigate = useNavigate();



  const [loading, setLoading] = useState(false);
  const { setAlert } = useAuth();

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: async ({ deleteUser }) => {
      setLoading(false);
      if (deleteUser?.isSuccess) {
        if (userData?.image) await deleteImageFromStorage(userData.image).catch(console.error);
        handleCloseDelete();
        setAlert(true, "success", deleteUser?.message);
        setRefetch();
      } else {
        setAlert(true, "error", deleteUser?.message);
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
    if (!userId) {
      setAlert(true, "error", t("user_id_missing"));
      return;
    }

    setLoading(true);
    deleteUser({ variables: { id: userId } });
  };

  return (
    <div>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <IconButton className="edit-icon" onClick={() => navigate(`${userId}/profile`)}
        >
          <ScanEye size="18px" color="#FFAF1F" />
        </IconButton>
        <IconButton className="edit-icon" onClick={handleOpen}>
          <SquarePen size="18px" color="#36BBA7" />
        </IconButton>
        <IconButton className="delete-icon" onClick={handleOpenDelete}>
          <Trash size="18px" color="red" />
        </IconButton>
      </Stack>

      <UserForm
        open={open}
        onClose={handleClose}
        dialogTitle="Update"
        userData={userData}
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
