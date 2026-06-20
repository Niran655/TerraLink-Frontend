// Components/mobile/promotion/PromotionAction.jsx
import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";

import { DELETE_SHOP_PROMOTION } from "../../../../graphql/mutation";
import { useAuth } from "../../../Context/AuthContext";
import UseDeleteForm from "../../include/useDeleteForm";
import PromotionForm from "./PromotionForm";

export default function PromotionAction({
  data,          // promotion object
  setRefetch,
  t,
  shopId,
}) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const [deletePromotion] = useMutation(DELETE_SHOP_PROMOTION, {
    onCompleted: ({ deleteShopPromotion }) => {
      setLoading(false);
      if (deleteShopPromotion?.isSuccess) {
        handleCloseDelete();
        setAlert(true, "success", deleteShopPromotion.message);
        setRefetch();
      } else {
        setAlert(true, "error", deleteShopPromotion.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  const handleDelete = () => {
    setLoading(true);
    deletePromotion({ variables: { id: data._id } });
  };

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <IconButton size="small" onClick={handleOpenEdit}>
          <SquarePen size="16px" color="#36BBA7" />
        </IconButton>
        <IconButton size="small" onClick={handleOpenDelete}>
          <Trash size="16px" color="red" />
        </IconButton>
      </Stack>

      <PromotionForm
        open={openEdit}
        onClose={handleCloseEdit}
        promotionData={data}
        setRefetch={setRefetch}
        shopId={shopId}
        t={t}
      />

      <UseDeleteForm
        open={openDelete}
        onClose={handleCloseDelete}
        handleDelete={handleDelete}
        loading={loading}
      />
    </>
  );
}