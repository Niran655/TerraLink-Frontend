import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE } from "../../../graphql/mutation";
import { GET_DEPARTMENTS_WITH_PAGINATION } from "../../../graphql/queries";
import { useAuth } from "../../Context/AuthContext";
import ReusableForm from "../include/useForm";

const initialValues = {
  image: "",
  nameKh: "",
  nameEn: "",
  gender: "",
  phone: "",
  email: "",
  password: "",
  position: "",
  departmentId: "",
  hireDate: "",
  address: "",
  remark: "",
  active: true,
};

export default function EmployeeForm({ open, onClose, t, employeeData, dialogTitle, setRefetch }) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const { data } = useQuery(GET_DEPARTMENTS_WITH_PAGINATION, {
    variables: { pagination: false, active: true },
  });

  useEffect(() => {
    setFormValues(
      employeeData
        ? { ...initialValues, ...employeeData, departmentId: employeeData.department?._id || "" }
        : initialValues
    );
  }, [employeeData]);

  const departmentOptions = (data?.getDepartmentsWithPagination?.data || []).map((department) => ({
    value: department._id,
    label: department.nameEn || department.nameKh,
  }));

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    onCompleted: ({ createEmployee }) => {
      setLoading(false);
      if (createEmployee?.isSuccess) {
        setAlert(true, "success", createEmployee.message);
        setRefetch();
        onClose();
      } else {
        setAlert(true, "error", createEmployee?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: ({ updateEmployee }) => {
      setLoading(false);
      if (updateEmployee?.isSuccess) {
        setAlert(true, "success", updateEmployee.message);
        setRefetch();
        onClose();
      } else {
        setAlert(true, "error", updateEmployee?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  const handleSubmit = (values) => {
    setLoading(true);
    const input = {
      image: values.image,
      nameKh: values.nameKh,
      nameEn: values.nameEn,
      gender: values.gender,
      phone: values.phone,
      email: values.email,
      password: values.password,
      position: values.position,
      departmentId: values.departmentId || null,
      hireDate: values.hireDate,
      address: values.address,
      remark: values.remark,
      active: values.active,
    };
    if (dialogTitle === "Create") {
      createEmployee({ variables: { input } });
    } else {
      updateEmployee({ variables: { id: employeeData._id, input } });
    }
  };

  return (
    <ReusableForm
      open={open}
      onClose={onClose}
      dialogTitle={dialogTitle === "Create" ? t("add_employee") : t("update_employee")}
      initialValues={formValues}
      validationSchema={Yup.object({
        nameKh: Yup.string().required(t("require")),
        nameEn: Yup.string().required(t("require")),
        email: Yup.string().email().required(t("require")),
        password: employeeData
          ? Yup.string().nullable()
          : Yup.string().required(t("require")),
      })}
      onSubmit={handleSubmit}
      loading={loading}
      t={t}
      tabs={[
        {
          fields: [
            { name: "image", label: t("image"), type: "image", grid: { xs: 12 } },
            { name: "nameKh", label: t("khmer_name"), grid: { xs: 12, md: 6 } },
            { name: "nameEn", label: t("english_name"), grid: { xs: 12, md: 6 } },
            {
              name: "gender",
              label: t("gender"),
              type: "select",
              options: [
                { value: "male", label: t("male") },
                { value: "female", label: t("female") },
                { value: "other", label: t("other") },
              ],
              grid: { xs: 12, md: 6 },
            },
            { name: "phone", label: t("phone"), grid: { xs: 12, md: 6 } },
            { name: "email", label: t("email"), grid: { xs: 12, md: 6 } },
            { name: "password", label: t("password"), type: "password", grid: { xs: 12, md: 6 } },
            { name: "position", label: t("position"), grid: { xs: 12, md: 6 } },
            {
              name: "departmentId",
              label: t("department"),
              type: "select",
              options: [{ value: "", label: t("all") }, ...departmentOptions],
              grid: { xs: 12, md: 6 },
            },
            { name: "hireDate", label: t("hire_date"), type: "date", grid: { xs: 12, md: 6 } },
            { name: "address", label: t("address"), rows: 2, grid: { xs: 12, md:6 } },
            { name: "remark", label: t("remark"), rows: 2, grid: { xs: 12, md:6 } },
            { name: "active", label: t("active"), type: "checkbox", grid: { xs: 12 } },
            
          ],
        },
      ]}
    />
  );
}
