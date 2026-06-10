import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { DELETE_CUSTOMER } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import UseDeleteForm from "../include/useDeleteForm";
import CustomerForm from "./CustomerForm";

export default function CustomerAction({ customerData, setRefetch, t }) {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);

  const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
    onCompleted: ({ deleteCustomer }) => {
      setLoading(false);
      if (deleteCustomer?.isSuccess) {
        setOpenDelete(false);
        setAlert(true, "success", deleteCustomer.message);
        setRefetch();
      } else {
        setAlert(true, "error", deleteCustomer.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message);
    },
  });

  const handleDelete = () => {
    setLoading(true);
    deleteCustomer({ variables: { _id: customerData._id } });
  };

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <IconButton onClick={() => setOpen(true)}>
          <SquarePen size="18px" color="#36BBA7" />
        </IconButton>
        <IconButton onClick={() => setOpenDelete(true)}>
          <Trash size="18px" color="red" />
        </IconButton>
      </Stack>

      <CustomerForm
        open={open}
        onClose={() => setOpen(false)}
        dialogTitle="Update"
        customerData={customerData}
        setRefetch={setRefetch}
        t={t}
      />

      <UseDeleteForm
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        handleDelete={handleDelete}
        loading={loading}
      />
    </>
  );
}
