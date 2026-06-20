// Components/mobile/promotion/PromotionForm.jsx
import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_SHOP_PROMOTION, UPDATE_SHOP_PROMOTION } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import ReusableForm from "../../include/useForm";

export default function PromotionForm({
  open,
  onClose,
  t,
  promotionData,   // undefined for create, object for edit
  setRefetch,
  shopId,          // required for create
}) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const isEdit = !!promotionData;

  const [formValues, setFormValues] = useState({
    type: "banner",
    title: "",
    description: "",
    discount: 0,
    startDate: "",
    endDate: "",
    status: "active",
  });

  // Mutations
  const [createPromotion] = useMutation(CREATE_SHOP_PROMOTION, {
    onCompleted: ({ createShopPromotion }) => {
      setLoading(false);
      if (createShopPromotion?.isSuccess) {
        setAlert(true, "success", createShopPromotion.message);
        onClose();
        setRefetch?.();
      } else {
        setAlert(true, "error", createShopPromotion.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message);
    },
  });

  const [updatePromotion] = useMutation(UPDATE_SHOP_PROMOTION, {
    onCompleted: ({ updateShopPromotion }) => {
      setLoading(false);
      if (updateShopPromotion?.isSuccess) {
        setAlert(true, "success", updateShopPromotion.message);
        onClose();
        setRefetch?.();
      } else {
        setAlert(true, "error", updateShopPromotion.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message);
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEdit) {
      setFormValues({
        type: promotionData.type || "banner",
        title: promotionData.title || "",
        description: promotionData.description || "",
        discount: promotionData.discount || 0,
        startDate: promotionData.startDate || "",
        endDate: promotionData.endDate || "",
        status: promotionData.status || "active",
      });
    } else {
      setFormValues({
        type: "banner",
        title: "",
        description: "",
        discount: 0,
        startDate: "",
        endDate: "",
        status: "active",
      });
    }
  }, [promotionData, isEdit]);

  const validationSchema = Yup.object({
    type: Yup.string().required(t("require")),
    title: Yup.string().required(t("require")),
    discount: Yup.number().min(0).max(100),
    startDate: Yup.string(),
    endDate: Yup.string(),
    status: Yup.string().oneOf(["active", "inactive"]).required(t("require")),
  });

  const handleSubmit = (values) => {
    setLoading(true);
    if (isEdit) {
      updatePromotion({
        variables: {
          id: promotionData._id,
          input: values,
        },
      });
    } else {
      if (!shopId) {
        setAlert(true, "error", "Shop ID is required");
        setLoading(false);
        return;
      }
      createPromotion({
        variables: {
          shopId,
          input: values,
        },
      });
    }
  };

  const tabs = [
    {
      fields: [
        {
          name: "type",
          label: t("type"),
          type: "select",
          grid: { xs: 12, md: 6 },
          options: [
            { label: t("banner"), value: "banner" },
            { label: t("coupon"), value: "coupon" },
            { label: t("discount"), value: "discount" },
            { label: t("flash_sale"), value: "flash_sale" },
            { label: t("happy_hour"), value: "happy_hour" },
            { label: t("buy_1_get_1"), value: "buy1get1" },
          ],
        },
        {
          name: "title",
          label: t("title"),
          grid: { xs: 12, md: 6 },
        },
        {
          name: "description",
          label: t("description"),
          grid: { xs: 12 },
        },
        {
          name: "discount",
          label: t("discount"),
          type: "number",
          grid: { xs: 12, md: 4 },
          inputProps: { endAdornment: "%" },
        },
        {
          name: "startDate",
          label: t("start_date"),
          type: "date",
          grid: { xs: 12, md: 4 },
        },
        {
          name: "endDate",
          label: t("end_date"),
          type: "date",
          grid: { xs: 12, md: 4 },
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
      dialogTitle={isEdit ? t("edit_promotion") : t("add_promotion")}
      initialValues={formValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      tabs={tabs}
      loading={loading}
      t={t}
    />
  );
}