import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_GALLERY_IMAGE, UPDATE_GALLERY_IMAGE } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import ReusableForm from "../../include/useForm";

export default function GalleryForm({
  open,
  onClose,
  t,
  galleryData,    
  setRefetch,
  shopId,        
}) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);

  const isEdit = !!galleryData;

  // Form values
  const [formValues, setFormValues] = useState({
    image: "",
    title: "",
    category: "",
    cover: false,
    status: "active",
  });

  // Mutations
  const [createGalleryImage] = useMutation(CREATE_GALLERY_IMAGE, {
    onCompleted: ({ createGalleryImage }) => {
      setLoading(false);
      if (createGalleryImage?.isSuccess) {
        setAlert(true, "success", createGalleryImage.message);
        onClose();
        setRefetch?.();
      } else {
        setAlert(true, "error", createGalleryImage.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message);
    },
  });

  const [updateGalleryImage] = useMutation(UPDATE_GALLERY_IMAGE, {
    onCompleted: ({ updateGalleryImage }) => {
      setLoading(false);
      if (updateGalleryImage?.isSuccess) {
        setAlert(true, "success", updateGalleryImage.message);
        onClose();
        setRefetch?.();
      } else {
        setAlert(true, "error", updateGalleryImage.message);
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
        image: galleryData.image || "",
        title: galleryData.title || "",
        category: galleryData.category || "",
        cover: galleryData.cover || false,
        status: galleryData.status || "active",
      });
    } else {
      setFormValues({
        image: "",
        title: "",
        category: "",
        cover: false,
        status: "active",
      });
    }
  }, [galleryData, isEdit]);

  // Validation schema
  const validationSchema = Yup.object({
    image: Yup.string().url(t("invalid_url")).required(t("require")),
    title: Yup.string(),
    category: Yup.string(),
    cover: Yup.boolean(),
    status: Yup.string().oneOf(["active", "inactive"]).required(t("require")),
  });

  // Submit handler
  const handleSubmit = (values) => {
    setLoading(true);

    if (isEdit) {
      updateGalleryImage({
        variables: {
          shopId,
          imageId: galleryData._id,
          input: {
            image: values.image,
            title: values.title,
            category: values.category,
            cover: values.cover,
            status: values.status,
          },
        },
      });
    } else {
      createGalleryImage({
        variables: {
          shopId,
          input: {
            image: values.image,
            title: values.title,
            category: values.category,
            cover: values.cover,
            status: values.status,
          },
        },
      });
    }
  };

  // Tab configuration
  const tabs = [
    {
      fields: [
        {
          name: "image",
          label: t("image_url"),
          grid: { xs: 12 },
        },
        {
          name: "title",
          label: t("title"),
          grid: { xs: 12, md: 6 },
        },
        {
          name: "category",
          label: t("category"),
          grid: { xs: 12, md: 6 },
        },
        {
          name: "cover",
          label: t("cover"),
          type: "checkbox",
          grid: { xs: 12  },
        },
        {
          name: "status",
          label: t("status"),
          type: "select",
          grid: { xs: 12, md: 6 },
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
      dialogTitle={isEdit ? t("edit_gallery_image") : t("add_gallery_image")}
      initialValues={formValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      tabs={tabs}
      loading={loading}
      t={t}
    />
  );
}