import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { CREATE_TABLE, UPDATE_TABLE } from "../../../graphql/mutation";
import { GET_ALL_SHOP } from "../../../graphql/queries";
import { useAuth } from "../../Context/AuthContext";
import ReusableForm from "../include/useForm";

export default function TableForm({ open, onClose, t, tableData, setRefetch }) {
  const { setAlert, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const { data: shopsData, loading: shopsLoading } = useQuery(GET_ALL_SHOP, {
    variables: { id: user?._id },
    skip: !user?._id,
  });

  const shops = shopsData?.getAllShops || [];

  const shopOptions = shops.map((shop) => ({
    id: shop._id,
    label: shop.nameEn,
  }));

 
  const [formValues, setFormValues] = useState({
    name: "",
    number: "",
    capacity: "",
    description: "",
    active: true,
    shopIds: [],   
  });

  const [createTable] = useMutation(CREATE_TABLE, {
    onCompleted: ({ createTable }) => {
      setLoading(false);
      if (createTable?.isSuccess) {
        setAlert(true, "success", createTable.message);
        onClose();
        setRefetch();
      } else {
        setAlert(true, "error", createTable.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message);
    },
  });

  const [updateTable] = useMutation(UPDATE_TABLE, {
    onCompleted: ({ updateTable }) => {
      setLoading(false);
      if (updateTable?.isSuccess) {
        setAlert(true, "success", updateTable.message);
        onClose();
        setRefetch();
      } else {
        setAlert(true, "error", updateTable.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message);
    },
  });

 
  useEffect(() => {
    if (tableData) {
      setFormValues({
        name: tableData.name || "",
        number: tableData.number || "",
        capacity: tableData.capacity || "",
        active: tableData.active ?? true,
        description: tableData?.description || "",
        shopIds: tableData?.shopIds?.map(s => s._id || s) || [],  
      });
    } else {
      setFormValues({
        name: "",
        number: "",
        capacity: "",
        description: "",
        active: true,
        shopIds: user?.shopIds?.map(s => s._id || s) || [], 
      });
    }
  }, [tableData, user]);

 
  const validationSchema = Yup.object({
    name: Yup.string().required(t("require")),
    number: Yup.string().required(t("require")),
    capacity: Yup.number()
      .typeError(t("must_be_number"))
      .positive(t("must_be_positive"))
      .integer(t("must_be_integer"))
      .required(t("require")),
    shopIds: Yup.array().min(1, t("require")),  
  });

 
  const handleSubmit = (values) => {
    setLoading(true);

    const payload = {
      ...values,
      capacity: Number(values.capacity),
      shopIds: values.shopIds,  
    };

    if (!tableData) {
      createTable({ variables: { input: payload } });
    } else {
      updateTable({ variables: { id: tableData._id, input: payload } });
    }
  };

  const tabs = [
    {
      fields: [
        {
          name: "shopIds",
          label: t("shop"),
          type: "autocomplete",
          multiple: true,     
          options: shopOptions,
          loading: shopsLoading,
          grid: { xs: 12 },
        },
        {
          name: "name",
          label: t("table_name"),
          grid: { xs: 12, md: 6 },
        },
        {
          name: "number",
          label: t("table_number"),
          grid: { xs: 12, md: 6 },
        },
        {
          name: "capacity",
          label: t("capacity"),
          type: "number",
          grid: { xs: 12, md: 6 },
        },
        {
          name: "description",
          label: t("description"),
          grid: { xs: 12, md: 6 },
        },
        {
          name: "active",
          label: t("active"),
          type: "checkbox",
          grid: { xs: 12 },
        },
      ],
    },
  ];

  return (
    <ReusableForm
      open={open}
      onClose={onClose}
      dialogTitle={tableData ? t("update_table") : t("add_table")}
      initialValues={formValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      tabs={tabs}
      loading={loading}
      t={t}
    />
  );
}