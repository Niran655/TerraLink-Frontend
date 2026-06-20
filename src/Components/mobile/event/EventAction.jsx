// Components/mobile/event/EventAction.jsx
import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";

import { DELETE_SHOP_EVENT } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import UseDeleteForm from "../../include/useDeleteForm";
import EventForm from "./EventForm";

export default function EventAction({
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

  const [deleteEvent] = useMutation(DELETE_SHOP_EVENT, {
    onCompleted: ({ deleteShopEvent }) => {
      setLoading(false);
      if (deleteShopEvent?.isSuccess) {
        handleCloseDelete();
        setAlert(true, "success", deleteShopEvent.message);
        setRefetch();
      } else {
        setAlert(true, "error", deleteShopEvent.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  const handleDelete = () => {
    setLoading(true);
    deleteEvent({ variables: { id: data._id } });
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

      <EventForm
        open={openEdit}
        onClose={handleCloseEdit}
        eventData={data}
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