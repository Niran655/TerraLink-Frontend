import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_EMPLOYEE_SALARY, UPDATE_EMPLOYEE_SALARY } from "../../../graphql/mutation";
import { GET_EMPLOYEES_WITH_PAGINATION } from "../../../graphql/queries";
import { useAuth } from "../../Context/AuthContext";
import ReusableForm from "../include/useForm";

const initialValues = {
  employeeId: "",
  baseSalary: "",
  allowance: 0,
  deduction: 0,
  currency: "USD",
  effectiveDate: "",
  remark: "",
  active: true,
};

export default function EmployeeSalaryForm({ open, onClose, t, salaryData, dialogTitle, setRefetch }) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const { data } = useQuery(GET_EMPLOYEES_WITH_PAGINATION, {
    variables: { pagination: false, active: true },
  });

  useEffect(() => {
    setFormValues(
      salaryData
        ? { ...initialValues, ...salaryData, employeeId: salaryData.employee?._id || "" }
        : initialValues
    );
  }, [salaryData]);

  const employeeOptions = (data?.getEmployeesWithPagination?.data || []).map((employee) => ({
    value: employee._id,
    label: employee.nameEn || employee.nameKh,
  }));

  const [createEmployeeSalary] = useMutation(CREATE_EMPLOYEE_SALARY, {
    onCompleted: ({ createEmployeeSalary }) => {
      setLoading(false);
      if (createEmployeeSalary?.isSuccess) {
        setAlert(true, "success", createEmployeeSalary.message);
        setRefetch();
        onClose();
      } else {
        setAlert(true, "error", createEmployeeSalary?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  const [updateEmployeeSalary] = useMutation(UPDATE_EMPLOYEE_SALARY, {
    onCompleted: ({ updateEmployeeSalary }) => {
      setLoading(false);
      if (updateEmployeeSalary?.isSuccess) {
        setAlert(true, "success", updateEmployeeSalary.message);
        setRefetch();
        onClose();
      } else {
        setAlert(true, "error", updateEmployeeSalary?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  const handleSubmit = (values) => {
    const input = {
      employeeId: values.employeeId,
      baseSalary: Number(values.baseSalary || 0),
      allowance: Number(values.allowance || 0),
      deduction: Number(values.deduction || 0),
      currency: values.currency,
      effectiveDate: values.effectiveDate,
      remark: values.remark,
      active: values.active,
    };

    setLoading(true);
    if (dialogTitle === "Create") {
      createEmployeeSalary({ variables: { input } });
    } else {
      updateEmployeeSalary({ variables: { id: salaryData._id, input } });
    }
  };

  return (
    <ReusableForm
      open={open}
      onClose={onClose}
      dialogTitle={dialogTitle === "Create" ? t("add_employee_salary") : t("update_employee_salary")}
      initialValues={formValues}
      validationSchema={Yup.object({
        employeeId: Yup.string().required(t("require")),
        baseSalary: Yup.number().required(t("require")).min(0),
        allowance: Yup.number().min(0),
        deduction: Yup.number().min(0),
        currency: Yup.string().required(t("require")),
      })}
      onSubmit={handleSubmit}
      loading={loading}
      t={t}
      tabs={[
        {
          fields: [
            { name: "employeeId", label: t("employee"), type: "select", options: employeeOptions, grid: { xs: 12, md: 6 } },
            {
              name: "currency",
              label: t("currency"),
              type: "select",
              options: [{ value: "USD", label: "USD" }, { value: "KHR", label: "KHR" }],
              grid: { xs: 12, md: 6 },
            },
            { name: "baseSalary", label: t("base_salary"), grid: { xs: 12, md: 4 } },
            { name: "allowance", label: t("allowance"), grid: { xs: 12, md: 4 } },
            { name: "deduction", label: t("deduction"), grid: { xs: 12, md: 4 } },
            { name: "effectiveDate", label: t("effective_date"), type: "date", grid: { xs: 12, md: 6 } },

            { name: "remark", label: t("remark"), rows: 3, grid: { xs: 12 } },
                        { name: "active", label: t("active"), type: "checkbox", grid: { xs: 12, md: 6 } },
          ],
        },
      ]}
    />
  );
}
