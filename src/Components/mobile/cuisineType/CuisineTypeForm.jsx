// CuisineTypeForm.jsx

import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_CUISINE_TYPE, UPDATE_CUISINE_TYPE } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import ReusableForm from "../../include/useForm";

export default function CuisineTypeForm({
    open,
    onClose,
    t,
    cuisineTypeData,  
    setRefetch,
    shopId,             
}) {
    const { setAlert } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form values
    const [formValues, setFormValues] = useState({
        nameKh: "",
        nameEn: "",
        status: "active",
    });

    const isEdit = !!cuisineTypeData;

    
    const [createCuisineType] = useMutation(CREATE_CUISINE_TYPE, {
        onCompleted: ({ createCuisineType }) => {
            setLoading(false);
            if (createCuisineType?.isSuccess) {
                setAlert(true, "success", createCuisineType.message);
                onClose();
                setRefetch?.();
            } else {
                setAlert(true, "error", createCuisineType.message);
            }
        },
        onError: (err) => {
            setLoading(false);
            setAlert(true, "error", err.message);
        },
    });

    const [updateCuisineType] = useMutation(UPDATE_CUISINE_TYPE, {
        onCompleted: ({ updateCuisineType }) => {
            setLoading(false);
            if (updateCuisineType?.isSuccess) {
                setAlert(true, "success", updateCuisineType.message);
                onClose();
                setRefetch?.();
            } else {
                setAlert(true, "error", updateCuisineType.message);
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
                nameKh: cuisineTypeData.nameKh || "",
                nameEn: cuisineTypeData.nameEn || "",
                status: cuisineTypeData.status || "active",
            });
        } else {
            // Reset for create
            setFormValues({
                nameKh: "",
                nameEn: "",
                status: "active",
            });
        }
    }, [cuisineTypeData, isEdit]);
 
    const validationSchema = Yup.object({
        nameKh: Yup.string().required(t("require")),
        nameEn: Yup.string().required(t("require")),
        status: Yup.string().oneOf(["active", "inactive"]).required(t("require")),
    });
 
    const handleSubmit = (values) => {
        setLoading(true);

        if (isEdit) {
            // Update
            updateCuisineType({
                variables: {
                    id: cuisineTypeData._id,
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
            createCuisineType({
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
                    grid: { xs: 12, md:6 },
                },
                {
                    name: "nameEn",
                    label: t("english_name"),
                    grid: { xs: 12,md:6 },
                },
                {
                    name: "status",
                    label: t("status"),
                    type: "select",
                    grid: { xs: 12, md:6 },
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
            dialogTitle={isEdit ? t("edit_cuisine_type") : t("add_cuisine_type")}
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            tabs={tabs}
            loading={loading}
            t={t}
        />
    );
}
