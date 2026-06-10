import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_SUPPLIER, UPDATE_SUPPLIER } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import { supabase } from "../../supabaseClient";
import ReusableForm from "../include/useForm";

export default function SupplierForm({
  open,
  onClose,
  t,
  supplierData,
  dialogTitle,
  setRefetch,
}) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState(null);

  const [formValues, setFormValues] = useState({
    nameKh: "",
    nameEn: "",
    remark: "",
    
  });

 
  const [createSupplier] = useMutation(CREATE_SUPPLIER, {
    onCompleted: ({ createSupplier }) => {
      setLoading(false);
      if (createSupplier?.isSuccess) {
        setAlert(true, "success", createSupplier.message);
        onClose();
        setRefetch();
      } else {
        setAlert(true, "error", createSupplier.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

 
  const [updateSupplier] = useMutation(UPDATE_SUPPLIER, {
    onCompleted: ({ updateSupplier }) => {
      setLoading(false);
      if (updateSupplier?.isSuccess) {
        setAlert(true, "success", updateSupplier.message);
        onClose();
        setRefetch();
      } else {
        setAlert(true, "error", updateSupplier.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

 
  useEffect(() => {
    if (supplierData) {
      setFormValues({
        nameKh: supplierData.nameKh || "",
        nameEn: supplierData.nameEn || "",
        remark: supplierData.remark || "",
      });

      if (supplierData.image) {
        setUploadedFilePath(supplierData.image.split("/").pop());
      }
    }
  }, [supplierData]);

 
  const validationSchema = Yup.object({
        nameKh: Yup.string().required(t("require")),
        nameEn: Yup.string().required(t("require")),
        remark: Yup.string().nullable(),
  });

 
  const handleSubmit = (values) => {
    setLoading(true);
    if (dialogTitle === "Create") {
      createSupplier({ variables: { input: values } });
    } else {
      updateSupplier({
        variables: { id: supplierData._id, input: values },
      });
    }
  };

 
  const handleClose = async () => {
    if (dialogTitle === "Create" && uploadedFilePath) {
      await supabase.storage.from("images").remove([uploadedFilePath]);
    }
    onClose();
  };

 
  const tabs = [
    {
      fields: [
        { name: "nameKh", label: t("supplier_name_kh"), grid: { xs: 12, md: 6 } },
        { name: "nameEn", label: t("supplier_name_en"), grid: { xs: 12, md: 6 } },
        { name: "remark", label: t("remark"), type: "textarea", grid: { xs: 12 } },
      ],
    },
  ];

  return (
    <ReusableForm
      open={open}
      onClose={handleClose}
      dialogTitle={
        dialogTitle === "Create"
          ? t("add_supplier")
          : t("update_supplier")
      }
      initialValues={formValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      tabs={tabs}
      loading={loading}
      t={t}
    />
  );
}