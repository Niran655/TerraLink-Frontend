

import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_MEAL_TYPE, UPDATE_MEAL_TYPE } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import ReusableForm from "../../include/useForm";

export default function MealTypeForm({
    open,
    onClose,
    t,
    mealTypeData,
    setRefetch,
    shopId,
}) {
    const { setAlert } = useAuth();
    const [loading, setLoading] = useState(false);


    const [formValues, setFormValues] = useState({
        nameKh: "",
        nameEn:"",
        status: "active",
    });


    const isEdit = !!mealTypeData;

    const [createMealType] = useMutation(CREATE_MEAL_TYPE, {
        onCompleted: ({ createMealType }) => {
            setLoading(false);
            if (createMealType?.isSuccess) {
                setAlert(true, "success", createMealType.message);
                onClose();
                setRefetch?.();
            } else {
                setAlert(true, "error", createMealType.message);
            }
        },
        onError: (err) => {
            setLoading(false);
            setAlert(true, "error", err.message);
        },
    });

    const [updateMealType] = useMutation(UPDATE_MEAL_TYPE, {
        onCompleted: ({ updateMealType }) => {
            setLoading(false);
            if (updateMealType?.isSuccess) {
                setAlert(true, "success", updateMealType.message);
                onClose();
                setRefetch?.();
            } else {
                setAlert(true, "error", updateMealType.message);
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
                nameKh: mealTypeData.nameKh || "",
                nameEn: mealTypeData.nameEn || "",
                status: mealTypeData.status || "active",
            });
        } else {

            setFormValues({
                nameKh: "",
                nameEn: "",
                status: "active",
            });
        }
    }, [mealTypeData, isEdit]);


    const validationSchema = Yup.object({
        nameKh: Yup.string().required(t("require")),
        nameEn: Yup.string().required(t("require")),
        status: Yup.string().oneOf(["active", "inactive"]).required(t("require")),
    });


    const handleSubmit = (values) => {
        setLoading(true);

        if (isEdit) {

            updateMealType({
                variables: {
                    id: mealTypeData._id,
                    input: {
                        nameKh: values.nameKh,
                        nameEn: values.nameEn,
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
            createMealType({
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
                    label: t("khmer_name"),
                    grid: { xs: 12, md: 6 },
                },
                {
                    name: "nameEn",
                    label: t("english_name"),
                    grid: { xs: 12, md: 6 },
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
            dialogTitle={isEdit ? t("edit_meal_type") : t("add_meal_type")}
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            tabs={tabs}
            loading={loading}
            t={t}
        />
    );
}