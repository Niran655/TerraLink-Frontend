import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";

import { CREATE_USER, UPDATE_USER } from "../../../graphql/mutation";
import { GET_ALL_SHOP, GET_TENANTS } from "../../../graphql/queries";
import { useAuth } from "../../Context/AuthContext";
import { deleteImageFromStorage } from "../../utils/supabaseImageStorage";
import ReusableForm from "../include/useForm";

export default function UserForm({
  open,
  onClose,
  t,
  userData,
  dialogTitle,
  setRefetch,
}) {
  const { setAlert, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pendingImagePath, setPendingImagePath] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const canCreatePlatformUser = user?.role === "superAdmin";
  const tenantId = user?.tenantId?._id || user?.tenantId || "";
  const [formValues, setFormValues] = useState({
    tenantId,
    nameKh: "",
    nameEn: "",
    image: "",
    phone: "",
    gender: "male",
    email: "",
    role: "cashier",
    shopIds: [],
    active: true,
    password: "",
  });
  const submittedValuesRef = useRef(formValues);
  const selectedTenantId = formValues?.tenantId || tenantId;
  const { data: tenantData } = useQuery(GET_TENANTS, {
    variables: { active: true },
    skip: !canCreatePlatformUser,
  });
  const { data: shopData } = useQuery(GET_ALL_SHOP, {
    variables: { id: canCreatePlatformUser ? selectedTenantId : "" },
    skip: canCreatePlatformUser && !selectedTenantId,
  });
  const tenantOptions = (tenantData?.getTenants || []).map((tenant) => ({
    id: tenant._id,
    label: tenant.nameEn || tenant.nameKh,
  }));
  const shopOptions = (shopData?.getAllShops || []).map((shop) => ({
    id: shop._id,
    label: shop.nameEn || shop.nameKh,
  }));
  const roleOptions = [
    ...(canCreatePlatformUser ? [{ label: t("owner"), value: "owner" }] : []),
    { label: t("admin"), value: "admin" },
    { label: t("manager"), value: "manager" },
    { label: t("stock_controller"), value: "stock_controller" },
    { label: t("cashier"), value: "cashier" },
  ];

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: ({ createUser }) => {
      setLoading(false);
      if (createUser?.isSuccess) {
        setAlert(true, "success", createUser.message);
        setPendingImagePath(null);
        onClose();
        setRefetch();
      } else {
        if (pendingImagePath) deleteImageFromStorage(pendingImagePath).catch(console.error);
        setAlert(true, "error", createUser.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      if (pendingImagePath) deleteImageFromStorage(pendingImagePath).catch(console.error);
      setAlert(true, "error", err.message);
    },
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: async ({ updateUser }) => {
      setLoading(false);
      if (updateUser?.isSuccess) {
        const submittedImage = submittedValuesRef.current?.image || "";
        if (oldImageUrl && oldImageUrl !== submittedImage) {
          await deleteImageFromStorage(oldImageUrl).catch(console.error);
        }
        setAlert(true, "success", updateUser.message);
        setPendingImagePath(null);
        setOldImageUrl(submittedImage);
        onClose();
        setRefetch();
      } else {
        if (pendingImagePath) deleteImageFromStorage(pendingImagePath).catch(console.error);
        setAlert(true, "error", updateUser.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      if (pendingImagePath) deleteImageFromStorage(pendingImagePath).catch(console.error);
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    },
  });

  useEffect(() => {
    if (userData) {
      setFormValues({
        nameKh: userData.nameKh || "",
        tenantId: userData.tenantId?._id || userData.tenantId || tenantId,
        nameEn: userData.nameEn || "",
        phone: userData.phone || "",
        email: userData.email || "",
        gender: userData.gender || "male",
        role: userData.role || "cashier",
        shopIds: (userData.shopIds || []).map((shop) => shop?._id || shop).filter(Boolean),
        image: userData.image || "",
        active: userData.active ?? true,
        password: "",
      });
      setOldImageUrl(userData.image || "");
      setPendingImagePath(null);
    }
  }, [tenantId, userData]);

  useEffect(() => {
    if (!userData) {
      setFormValues((prev) => ({
        ...prev,
        tenantId,
      }));
    }
  }, [tenantId, userData]);

  const validationSchema = Yup.object({
    tenantId: canCreatePlatformUser ? Yup.string().required(t("require")) : Yup.string(),
    nameKh: Yup.string().required(t("require")),
    nameEn: Yup.string().required(t("require")),
    phone: Yup.string().required(t("require")),
    email: Yup.string().email().required(t("require")),
    gender: Yup.string().required(t("require")),
    role: Yup.string().required(t("require")),
    shopIds: Yup.array().when("role", {
      is: (role) => ["cashier", "stock_controller", "stockController"].includes(role),
      then: (schema) => schema.min(1, t("require")),
      otherwise: (schema) => schema,
    }),
    active: Yup.boolean(),
    password:
      dialogTitle === "Create"
        ? Yup.string().required(t("require"))
        : Yup.string(),
  });

  const handleSubmit = (values) => {
    setLoading(true);
    const input = {
      ...values,
      tenantId: values.tenantId || tenantId || undefined,
      shopIds: values.shopIds || [],
      password: values.password || undefined,
    };
    submittedValuesRef.current = input;
    setFormValues(values);
    if (dialogTitle === "Create") {
      createUser({ variables: { input } });
    } else {
      updateUser({ variables: { id: userData._id, input } });
    }
  };

  const handleClose = async () => {
    if (pendingImagePath) {
      await deleteImageFromStorage(pendingImagePath).catch(console.error);
      setPendingImagePath(null);
    }
    onClose();
  };

  const handleUploadedPath = async (path) => {
    if (pendingImagePath && pendingImagePath !== path) {
      await deleteImageFromStorage(pendingImagePath).catch(console.error);
    }
    setPendingImagePath(path);
  };

  const tabs = [
    {
      fields: [
        { name: "image", label: t("image"), type: "image", grid: { xs: 12 }, setFilePath: handleUploadedPath },
        ...(canCreatePlatformUser
          ? [{
              name: "tenantId",
              label: t("tenant") || "Tenant",
              type: "autocomplete",
              grid: { xs: 12 },
              options: tenantOptions,
              onChange: (value) =>
                setFormValues((prev) => ({ ...prev, tenantId: value, shopIds: [] })),
            }]
          : []),
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
          ],
        },
        { name: "phone", label: t("phone"), grid: { xs: 12, md: 6 } },
        { name: "email", label: t("email"), grid: { xs: 12, md: 6 } },
        {
          name: "role",
          label: t("role"),
          type: "select",
          grid: { xs: 12, md: 6 },
          options: [
            ...roleOptions,
          ],
        },
        {
          name: "shopIds",
          label: t("shop"),
          type: "autocomplete",
          multiple: true,
          grid: { xs: 12 },
          options: shopOptions,
        },
        {
          name: "password",
          label: t("password"),
          grid: { xs: 12 },
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
      onClose={handleClose}
      dialogTitle={dialogTitle === "Create" ? t("add_user") : t("update_user")}
      initialValues={formValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      tabs={tabs}
      loading={loading}
      t={t}
    />
  );
}
