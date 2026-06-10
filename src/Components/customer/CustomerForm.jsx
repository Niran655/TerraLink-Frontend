import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { CREATE_CUSTOMER, UPDATE_CUSTOMER } from "../../../graphql/mutation";
import { GET_ALL_SHOP } from "../../../graphql/queries";
import { useAuth } from "../../Context/AuthContext";
import ReusableForm from "../include/useForm";

export default function CustomerForm({
  open,
  onClose,
  t,
  customerData,
  dialogTitle,
  setRefetch,
}) {
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
    nameKh: "",
    nameEn: "",
    phone: "",
    email: "",
    address: "",
    gender: "male",
    dateOfBirth: null,
    active: true,
    shopIds: [],  
    note: "",
  });

 
  const [createCustomer] = useMutation(CREATE_CUSTOMER, {
    onCompleted: ({ createCustomer }) => {
      setLoading(false);
      if (createCustomer?.isSuccess) {
        setAlert(true, "success", createCustomer.message);
        onClose();
        setRefetch();
      } else {
        setAlert(true, "error", createCustomer.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message);
    },
  });

 
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER, {
    onCompleted: ({ updateCustomer }) => {
      setLoading(false);
      if (updateCustomer?.isSuccess) {
        setAlert(true, "success", updateCustomer.message);
        onClose();
        setRefetch();
      } else {
        setAlert(true, "error", updateCustomer.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message);
    },
  });

 
  useEffect(() => {
    if (customerData) {
      setFormValues({
        nameKh: customerData.nameKh || "",
        nameEn: customerData.nameEn || "",
        phone: customerData.phone || "",
        email: customerData.email || "",
        address: customerData.address || "",
        gender: customerData.gender || "male",
        dateOfBirth: customerData.dateOfBirth || null,
        active: customerData.active ?? true,

      
        shopIds: customerData.shopIds?.map((shop) => shop._id) || [],

        note: customerData.note || "",
      });
    } else {
      setFormValues((prev) => ({
        ...prev,
        shopIds: user?.shopIds?.map((s) => s._id) || [],
      }));
    }
  }, [customerData, user]);

 
  const validationSchema = Yup.object({
    nameKh : Yup.string().required(t("require")),
    nameEn: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().email().nullable(),
    gender: Yup.string(),
    shopIds: Yup.array().min(1, t("require")),
  });

  const handleSubmit = (values) => {
    setLoading(true);

    const payload = {
      ...values,
      shopIds: values.shopIds, 
    };

    if (dialogTitle === "Create") {
      createCustomer({ variables: { input: payload } });
    } else {
      updateCustomer({
        variables: { id: customerData._id, input: payload },
      });
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
          grid: { xs: 12 },
          options: shopOptions,
          loading: shopsLoading,
        },
        { name: "nameKh", label: t("khmer_name"), grid: { xs: 12, md: 6 } },
        { name: "nameEn", label: t("english_name"), grid: { xs: 12, md: 6 } },
        {
          name: "gender",
          label: t("gender"),
          type: "select",
          grid: { xs: 12, md: 6 },
          options: [
            { label: t("male"), value: "male" },
            { label: t("female"), value: "female" },
            { label: t("other"), value: "other" },
          ],
        },
        {
          name: "dateOfBirth",
          label: t("date_of_birth"),
          type: "date",
          grid: { xs: 12, md: 6 },
        },
        { name: "phone", label: t("phone"), grid: { xs: 12, md: 6 } },
        { name: "email", label: t("email"), grid: { xs: 12, md: 6 } },
        { name: "address", label: t("address"), grid: { xs: 12, md: 6 } },
        {
          name: "note",
          label: t("remark"),
          type: "textarea",
          rows: 1,
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
      dialogTitle={
        dialogTitle === "Create"
          ? t("add_customer")
          : t("update_customer")
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