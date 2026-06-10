import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";

import { DELETE_DEPARTMENT } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import UseDeleteForm from "../include/useDeleteForm";
import DepartmentForm from "./DepartmentForm";

export default function DepartmentAction({ departmentData, departmentId, setRefetch, t }) {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useAuth();

  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, {
    onCompleted: ({ deleteDepartment }) => {
      setLoading(false);
      if (deleteDepartment?.isSuccess) {
        setAlert(true, "success", deleteDepartment.message);
        setRefetch();
        setOpenDelete(false);
      } else {
        setAlert(true, "error", deleteDepartment?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  return (
    <>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <IconButton className="edit-icon" onClick={() => setOpen(true)}>
          <SquarePen size="18px" color="#36BBA7" />
        </IconButton>
        <IconButton className="delete-icon" onClick={() => setOpenDelete(true)}>
          <Trash size="18px" color="red" />
        </IconButton>
      </Stack>

      <DepartmentForm
        open={open}
        onClose={() => setOpen(false)}
        dialogTitle="Update"
        departmentData={departmentData}
        setRefetch={setRefetch}
        t={t}
      />

      <UseDeleteForm
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        loading={loading}
        handleDelete={() => {
          setLoading(true);
          deleteDepartment({ variables: { id: departmentId } });
        }}
      />
    </>
  );
}
