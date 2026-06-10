import { useMutation, useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_SHIFT_SESSION, UPDATE_SHIFT_SEESION } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import { GET_USER_WITH_PAGINATION } from "../../../graphql/queries";
import ReusableForm from "../include/useForm";
export default function ShiftSessionForm({
  open,
  onClose,
  dialogTitle,
  shiftData,
  setRefetch,
  t,
}) {
  const { setAlert, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const {shopId} = useParams();
   
  const { data } = useQuery(GET_USER_WITH_PAGINATION, {
    variables: { page: 1, limit: 10, pagination: false, keyword: "", role: "" },
  });

  const users = data?.getUsersWithPagination?.data || [];

  

  const [formValues, setFormValues] = useState({
    shiftName: "",
    startTime: "",
    startHour: "00",
    startMinute: "00",
    endTime: "",
    endHour: "00",
    endMinute: "00",
    openingCash: 0,
    closingCash: 0,
    status: "open",
    userId: "",
    shopId: shopId,
  });

  const [createShiftSession] = useMutation(CREATE_SHIFT_SESSION, {
    onCompleted: ({ createShiftSession }) => {
      setLoading(false);

      if (createShiftSession?.isSuccess) {
        setAlert(true, "success", createShiftSession.message);
        onClose();
        setRefetch?.();
      } else {
        setAlert(true, "error", createShiftSession.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  const [updateShiftSession] = useMutation(UPDATE_SHIFT_SEESION, {
    onCompleted: ({ updateShiftSession }) => {
      setLoading(false);

      if (updateShiftSession?.isSuccess) {
        setAlert(true, "success", updateShiftSession.message);
        onClose();
        setRefetch?.();
      } else {
        setAlert(true, "error", updateShiftSession.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  useEffect(() => {
    if (shiftData) {
      const sDate = shiftData.startTime ? new Date(shiftData.startTime) : null;
      const eDate = shiftData.endTime ? new Date(shiftData.endTime) : null;
      setFormValues({
        shiftName: shiftData.shiftName || "",
        startTime: sDate ? sDate.toISOString().slice(0, 10) : "",
        startHour: sDate ? String(sDate.getHours()).padStart(2, "0") : "00",
        startMinute: sDate ? String(sDate.getMinutes()).padStart(2, "0") : "00",
        endTime: eDate ? eDate.toISOString().slice(0, 10) : "",
        endHour: eDate ? String(eDate.getHours()).padStart(2, "0") : "00",
        endMinute: eDate ? String(eDate.getMinutes()).padStart(2, "0") : "00",
        openingCash: shiftData.openingCash ?? 0,
        closingCash: shiftData.closingCash ?? 0,
        status: shiftData.status || "open",
        userId: shiftData.userId || shiftData.user?._id || "",
        shopId: shopId,
      });
    }
  }, [shiftData]);

  const validationSchema = Yup.object({
    shiftName: Yup.string().required(t("require")),
    startTime: Yup.date().required(t("require")),
    startHour: Yup.string().matches(/^\d{2}$/).required(t("require")),
    startMinute: Yup.string().matches(/^\d{2}$/).required(t("require")),
    endTime: Yup.date().nullable(),
    endHour: Yup.string().matches(/^\d{2}$/).nullable(),
    endMinute: Yup.string().matches(/^\d{2}$/).nullable(),
    openingCash: Yup.number().required(t("require")),
    closingCash: Yup.number().nullable(),
    status: Yup.string().required(t("require")),
    userId: Yup.string().required(t("require")),
    shopId: Yup.string().required(t("require")),
  });

  const handleSubmit = (values) => {
    setLoading(true);

    const pad = (n) => String(n ?? "00").padStart(2, "0");
    const composeISO = (dateStr, hh, mm) => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      d.setHours(parseInt(pad(hh), 10), parseInt(pad(mm), 10), 0, 0);
      return d.toISOString();
    };

    const input = {
      shiftName: values.shiftName,
      startTime: composeISO(values.startTime, values.startHour, values.startMinute),
      endTime: values.endTime ? composeISO(values.endTime, values.endHour, values.endMinute) : null,
      openingCash: Number(values.openingCash ?? 0),
      closingCash: Number(values.closingCash ?? 0),
      status: values.status,
      userId: values.userId,
      shopId: values.shopId,
    };

    if (dialogTitle === "Create") {
      createShiftSession({
        variables: { input },
      });
    } else {
      updateShiftSession({
        variables: {
          id: shiftData._id,
          input,
        },
      });
    }
  };

  const tabs = [
    {
      fields: [
        {
          name: "shiftName",
          label: t("shift_name"),
          grid: { xs: 12 },
        },
        {
          name: "startTime",
          label: t("start_time"),
          type: "date",
          grid: { xs: 12, md: 4 },
        },
        {
          name: "startHour",
          label: t("start_hour"),
          type: "select",
          grid: { xs: 6, md: 4 },
          options: Array.from({ length: 24 }, (_, i) => ({ label: String(i).padStart(2, "0"), value: String(i).padStart(2, "0") })),
        },
        {
          name: "startMinute",
          label: t("start_minute"),
          type: "select",
          grid: { xs: 6, md: 4 },
          options: Array.from({ length: 60 }, (_, i) => ({ label: String(i).padStart(2, "0"), value: String(i).padStart(2, "0") })),
        },
        {
          name: "endTime",
          label: t("end_time"),
          type: "date",
          grid: { xs: 12, md: 4 },
        },
        {
          name: "endHour",
          label: t("end_hour"),
          type: "select",
          grid: { xs: 6, md: 4 },
          options: Array.from({ length: 24 }, (_, i) => ({ label: String(i).padStart(2, "0"), value: String(i).padStart(2, "0") })),
        },
        {
          name: "endMinute",
          label: t("end_minute"),
          type: "select",
          grid: { xs: 6, md: 4 },
          options: Array.from({ length: 60 }, (_, i) => ({ label: String(i).padStart(2, "0"), value: String(i).padStart(2, "0") })),
        },
        {
          name: "openingCash",
          label: t("opening_cash"),
          type: "number",
          grid: { xs: 12, md: 6 },
        },
        {
          name: "closingCash",
          label: t("closing_cash"),
          type: "number",
          grid: { xs: 12, md: 6 },
        },
        {
          name: "status",
          label: t("status"),
          type: "select",
          grid: { xs: 12, md: 6 },
          options: [
            { label: "Open", value: "open" },
            { label: "Closed", value: "closed" },
          ],
        },
        {
          name: "userId",
          label: t("user"),
          type: "select",
          grid: { xs: 12, md: 6 },
          options: users.map((u) => ({
            label: u.nameEn,
            value: u._id,
          })),
        },
        
      ],
    },
  ];

  return (
    <ReusableForm
      open={open}
      onClose={onClose}
      // dialogTitle={dialogTitle}
      dialogTitle={dialogTitle === "Create" ? t("create") : t("update")}
      initialValues={formValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      tabs={tabs}
      loading={loading}
      t={t}
    />
  );
}