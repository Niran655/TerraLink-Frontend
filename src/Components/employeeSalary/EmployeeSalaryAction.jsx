import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";

import { DELETE_EMPLOYEE_SALARY } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import UseDeleteForm from "../include/useDeleteForm";
import EmployeeSalaryForm from "./EmployeeSalaryForm";

export default function EmployeeSalaryAction({ salaryData, salaryId, setRefetch, t }) {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useAuth();

  const [deleteEmployeeSalary] = useMutation(DELETE_EMPLOYEE_SALARY, {
    onCompleted: ({ deleteEmployeeSalary }) => {
      setLoading(false);
      if (deleteEmployeeSalary?.isSuccess) {
        setAlert(true, "success", deleteEmployeeSalary.message);
        setRefetch();
        setOpenDelete(false);
      } else {
        setAlert(true, "error", deleteEmployeeSalary?.message);
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

      <EmployeeSalaryForm
        open={open}
        onClose={() => setOpen(false)}
        dialogTitle="Update"
        salaryData={salaryData}
        setRefetch={setRefetch}
        t={t}
      />

      <UseDeleteForm
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        loading={loading}
        handleDelete={() => {
          setLoading(true);
          deleteEmployeeSalary({ variables: { id: salaryId } });
        }}
      />
    </>
  );
}
