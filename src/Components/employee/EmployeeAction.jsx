import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";

import { DELETE_EMPLOYEE } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import UseDeleteForm from "../include/useDeleteForm";
import EmployeeForm from "./EmployeeForm";

export default function EmployeeAction({ employeeData, employeeId, setRefetch, t }) {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useAuth();

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: ({ deleteEmployee }) => {
      setLoading(false);
      if (deleteEmployee?.isSuccess) {
        setAlert(true, "success", deleteEmployee.message);
        setRefetch();
        setOpenDelete(false);
      } else {
        setAlert(true, "error", deleteEmployee?.message);
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

      <EmployeeForm
        open={open}
        onClose={() => setOpen(false)}
        dialogTitle="Update"
        employeeData={employeeData}
        setRefetch={setRefetch}
        t={t}
      />

      <UseDeleteForm
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        loading={loading}
        handleDelete={() => {
          setLoading(true);
          deleteEmployee({ variables: { id: employeeId } });
        }}
      />
    </>
  );
}
