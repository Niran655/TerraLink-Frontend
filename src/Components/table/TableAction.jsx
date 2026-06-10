import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { DELETE_TABLE } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import UseDeleteForm from "../include/useDeleteForm";

export default function TableAction({ tableData, setRefetch, t, onEdit }) {
  const [openDelete, setOpenDelete] = useState(false);
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);

  const [deleteTable] = useMutation(DELETE_TABLE, {
    onCompleted: ({ deleteTable }) => {
      setLoading(false);
      if (deleteTable?.isSuccess) {
        setOpenDelete(false);
        setAlert(true, "success", deleteTable.message);
        setRefetch();
      } else {
        setAlert(true, "error", deleteTable.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message);
    },
  });

  const handleDelete = () => {
    setLoading(true);
    deleteTable({ variables: { _id: tableData._id } });
  };

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <IconButton onClick={() => onEdit(tableData)}>
          <SquarePen size="18px" color="#36BBA7" />
        </IconButton>
        <IconButton onClick={() => setOpenDelete(true)}>
          <Trash size="18px" color="red" />
        </IconButton>
      </Stack>

      <UseDeleteForm
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        handleDelete={handleDelete}
        loading={loading}
      />
    </>
  );
}
