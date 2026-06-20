// Components/mobile/event/EventForm.jsx
import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_SHOP_EVENT, UPDATE_SHOP_EVENT } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import ReusableForm from "../../include/useForm";

export default function EventForm({
  open,
  onClose,
  t,
  eventData,
  setRefetch,
  shopId,
}) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const isEdit = !!eventData;

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    date: "",
    status: "scheduled",
  });

  const [createEvent] = useMutation(CREATE_SHOP_EVENT, {
    onCompleted: ({ createShopEvent }) => {
      setLoading(false);
      if (createShopEvent?.isSuccess) {
        setAlert(true, "success", createShopEvent.message);
        onClose();
        setRefetch?.();
      } else {
        setAlert(true, "error", createShopEvent.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message);
    },
  });

  const [updateEvent] = useMutation(UPDATE_SHOP_EVENT, {
    onCompleted: ({ updateShopEvent }) => {
      setLoading(false);
      if (updateShopEvent?.isSuccess) {
        setAlert(true, "success", updateShopEvent.message);
        onClose();
        setRefetch?.();
      } else {
        setAlert(true, "error", updateShopEvent.message);
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
        title: eventData.title || "",
        description: eventData.description || "",
        date: eventData.date || "",
        status: eventData.status || "scheduled",
      });
    } else {
      setFormValues({
        title: "",
        description: "",
        date: "",
        status: "scheduled",
      });
    }
  }, [eventData, isEdit]);

  const validationSchema = Yup.object({
    title: Yup.string().required(t("require")),
    description: Yup.string(),
    date: Yup.string().required(t("require")),
    status: Yup.string().oneOf(["scheduled", "active", "completed"]).required(t("require")),
  });

  const handleSubmit = (values) => {
    setLoading(true);
    if (isEdit) {
      updateEvent({
        variables: {
          id: eventData._id,
          input: values,
        },
      });
    } else {
      if (!shopId) {
        setAlert(true, "error", "Shop ID is required");
        setLoading(false);
        return;
      }
      createEvent({
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
          name: "title",
          label: t("title"),
          grid: { xs: 12 },
        },
        {
          name: "description",
          label: t("description"),
          grid: { xs: 12 },
        },
        {
          name: "date",
          label: t("date"),
          type: "datetime-local",
          grid: { xs: 12, md: 6 },
        },
        {
          name: "status",
          label: t("status"),
          type: "select",
          grid: { xs: 12, md: 6 },
          options: [
            { label: t("scheduled"), value: "scheduled" },
            { label: t("active"), value: "active" },
            { label: t("completed"), value: "completed" },
          ],
        },
      ],
    },
  ];

  return (
    <ReusableForm
      open={open}
      onClose={onClose}
      dialogTitle={isEdit ? t("edit_event") : t("add_event")}
      initialValues={formValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      tabs={tabs}
      loading={loading}
      t={t}
    />
  );
}