// CuisineOrigineForm.jsx
// CuisineOriginForm.jsx

import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_CUISINE_ORIGIN, UPDATE_CUISINE_ORIGIN } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import ReusableForm from "../../include/useForm";

export default function CuisineOriginForm({
  open,
  onClose,
  t,
  cuisineOriginData,   // undefined for create, object for edit
  setRefetch,
  shopId,              // required for create
}) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form values
  const [formValues, setFormValues] = useState({
    nameKh:"",
    nameEn: "",
    status: "active",
  });

  const isEdit = !!cuisineOriginData;

  // GraphQL mutations
  const [createCuisineOrigin] = useMutation(CREATE_CUISINE_ORIGIN, {
    onCompleted: ({ createCuisineOrigin }) => {
      setLoading(false);
      if (createCuisineOrigin?.isSuccess) {
        setAlert(true, "success", createCuisineOrigin.message);
        onClose();
        setRefetch?.();
      } else {
        setAlert(true, "error", createCuisineOrigin.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message);
    },
  });

  const [updateCuisineOrigin] = useMutation(UPDATE_CUISINE_ORIGIN, {
    onCompleted: ({ updateCuisineOrigin }) => {
      setLoading(false);
      if (updateCuisineOrigin?.isSuccess) {
        setAlert(true, "success", updateCuisineOrigin.message);
        onClose();
        setRefetch?.();
      } else {
        setAlert(true, "error", updateCuisineOrigin.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message);
    },
  });
 
  useEffect(() => {
    if (isEdit) {
      setFormValues({
        nameKh: cuisineOriginData.nameKh || "",
        nameEn: cuisineOriginData.nameEn || "",
        status: cuisineOriginData.status || "active",
      });
    } else {
      setFormValues({
        nameKh: "",
        nameEn: "",
        status: "active",
      });
    }
  }, [cuisineOriginData, isEdit]);

  const validationSchema = Yup.object({
    nameEn: Yup.string().required(t("require")),
    nameKh: Yup.string().required(t("require")),
    status: Yup.string().oneOf(["active", "inactive"]).required(t("require")),
  });

  const handleSubmit = (values) => {
    setLoading(true);

    if (isEdit) {
      updateCuisineOrigin({
        variables: {
          id: cuisineOriginData._id,
          input: {
            nameEn: values.nameEn,
            nameKh: values.nameKh,
            status: values.status,
          },
        },
      });
    } else {
      if (!shopId) {
        setAlert(true, "error", "Shop ID is required");
        setLoading(false);
        return;
      }
      createCuisineOrigin({
        variables: {
          shopId,
          input: {
            nameKh: values.nameKh,
            nameEn: values.nameEn,
            status: values.status,
          },
        },
      });
    }
  };

  const tabs = [
    {
      fields: [
        {
          name: "nameKh",
          label: t("nameKh"),
          grid: { xs: 12,md:6 },
        },
          {
          name: "nameEn",
          label: t("nameEn"),
          grid: { xs: 12, md:6 },
        },
        {
          name: "status",
          label: t("status"),
          type: "select",
          grid: { xs: 12 },
          options: [
            { label: t("active"), value: "active" },
            { label: t("inactive"), value: "inactive" },
          ],
        },
      ],
    },
  ];

  return (
    <ReusableForm
      open={open}
      onClose={onClose}
      dialogTitle={isEdit ? t("edit_cuisine_origin") : t("add_cuisine_origin")}
      initialValues={formValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      tabs={tabs}
      loading={loading}
      t={t}
    />
  );
}