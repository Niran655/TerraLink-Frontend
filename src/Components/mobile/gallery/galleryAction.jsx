import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

import { DELETE_GALLERY_IMAGE, SET_GALLERY_COVER } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import UseDeleteForm from "../../include/useDeleteForm";
import GalleryForm from "./GalleryForm";

export default function GalleryAction({
  data,           
  setRefetch,
  t,
  shopId,
}) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);

  // Edit modal state
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  // Delete modal state
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  // Delete mutation
  const [deleteGalleryImage] = useMutation(DELETE_GALLERY_IMAGE, {
    onCompleted: ({ deleteGalleryImage }) => {
      setLoading(false);
      if (deleteGalleryImage?.isSuccess) {
        handleCloseDelete();
        setAlert(true, "success", deleteGalleryImage.message);
        setRefetch();
      } else {
        setAlert(true, "error", deleteGalleryImage.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  // Set cover mutation
  const [setGalleryCover] = useMutation(SET_GALLERY_COVER, {
    onCompleted: ({ setGalleryCover }) => {
      if (setGalleryCover?.isSuccess) {
        setAlert(true, "success", setGalleryCover.message);
        setRefetch();
      } else {
        setAlert(true, "error", setGalleryCover.message);
      }
    },
    onError: (error) => {
      setAlert(true, "error", error.message);
    },
  });

  const handleDelete = () => {
    setLoading(true);
    deleteGalleryImage({ variables: { shopId, imageId: data._id } });
  };

  const handleSetCover = () => {
    setGalleryCover({ variables: { shopId, imageId: data._id } });
  };

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        {!data.cover && (
          <IconButton size="small" onClick={handleSetCover}>
            <ImageIcon size="16px" color="#FFAF1F" />
          </IconButton>
        )}
        <IconButton size="small" onClick={handleOpenEdit}>
          <SquarePen size="16px" color="#36BBA7" />
        </IconButton>
        <IconButton size="small" onClick={handleOpenDelete}>
          <Trash size="16px" color="red" />
        </IconButton>
      </Stack>

      {/* Edit Form */}
      <GalleryForm
        open={openEdit}
        onClose={handleCloseEdit}
        galleryData={data}
        setRefetch={setRefetch}
        shopId={shopId}
        t={t}
      />

      {/* Delete Confirmation */}
      <UseDeleteForm
        open={openDelete}
        onClose={handleCloseDelete}
        handleDelete={handleDelete}
        loading={loading}
      />
    </>
  );
}