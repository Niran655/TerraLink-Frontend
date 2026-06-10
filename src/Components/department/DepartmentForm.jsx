import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_DEPARTMENT, UPDATE_DEPARTMENT } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import ReusableForm from "../include/useForm";

const initialValues = {
  nameKh: "",
  nameEn: "",
  code: "",
  remark: "",
  active: true,
};

export default function DepartmentForm({ open, onClose, t, departmentData, dialogTitle, setRefetch }) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    setFormValues(departmentData ? { ...initialValues, ...departmentData } : initialValues);
  }, [departmentData]);

  const [createDepartment] = useMutation(CREATE_DEPARTMENT, {
    onCompleted: ({ createDepartment }) => {
      setLoading(false);
      if (createDepartment?.isSuccess) {
        setAlert(true, "success", createDepartment.message);
        setRefetch();
        onClose();
      } else {
        setAlert(true, "error", createDepartment?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  const [updateDepartment] = useMutation(UPDATE_DEPARTMENT, {
    onCompleted: ({ updateDepartment }) => {
      setLoading(false);
      if (updateDepartment?.isSuccess) {
        setAlert(true, "success", updateDepartment.message);
        setRefetch();
        onClose();
      } else {
        setAlert(true, "error", updateDepartment?.message);
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
      nameKh: values.nameKh,
      nameEn: values.nameEn,
      code: values.code,
      remark: values.remark,
      active: values.active,
    };
    if (dialogTitle === "Create") {
      createDepartment({ variables: { input } });
    } else {
      updateDepartment({ variables: { id: departmentData._id, input } });
    }
  };

  return (
    <ReusableForm
      open={open}
      onClose={onClose}
      dialogTitle={dialogTitle === "Create" ? t("add_department") : t("update_department")}
      initialValues={formValues}
      validationSchema={Yup.object({
        nameKh: Yup.string().required(t("require")),
        nameEn: Yup.string().required(t("require")),
        code: Yup.string().nullable(),
        remark: Yup.string().nullable(),
        active: Yup.boolean(),
      })}
      onSubmit={handleSubmit}
      loading={loading}
      t={t}
      tabs={[
        {
          fields: [
            { name: "nameKh", label: t("khmer_name"), grid: { xs: 12, md: 6 } },
            { name: "nameEn", label: t("english_name"), grid: { xs: 12, md: 6 } },
            { name: "code", label: t("code"), grid: { xs: 12, md: 6 } },
            { name: "remark", label: t("remark"), rows: 3, grid: { xs: 12 } },
              { name: "active", label: t("active"), type: "checkbox", grid: { xs: 12, md: 6 } },
          ],
        },
      ]}
    />
  );
}
