import { IconButton, Stack, Tooltip } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { FilePenLine, ScanEye, Shuffle, Trash } from "lucide-react";
import React, { useState } from "react";

import { GET_WAREHOUSE_TRANSFER_BY_ID } from "../../../../graphql/queries";
import ViewProductTransfer from "./ViewProductTransfer";
import ProductTransferForm from "./ProductTransferForm";

export default function ProductTransferAction({ editData, t, language, setRefetch }) {
 
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenview = () => setOpenView(true);
  const handleCloseView = () => setOpenView(false);
 
  const [cancelTransfer,setCancelTransfer] = useState(false);
  const handleOpenCancelTransfer = () => setCancelTransfer(true);
  const handleCloseCancelTransfer = () =>setCancelTransfer(false);

  const { data: transferDetailData } = useQuery(GET_WAREHOUSE_TRANSFER_BY_ID, {
    variables: { id: editData?._id },
    skip: !openView || !editData?._id,
    fetchPolicy: "cache-and-network",
  });

  const viewData = transferDetailData?.getWarehouseTransferById || editData;
  const isPending = editData?.status === "pending";

  return (
    <div>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        {isPending && (
          <>
            <Tooltip title={t("edit") || "Edit"}>
              <IconButton className="edit-icon" onClick={handleOpen}>
                <FilePenLine size="18px" color="#1D4592" />
              </IconButton>
            </Tooltip>
            {open && (
              <ProductTransferForm
                t={t}
                open={open}
                onClose={handleClose}
                language={language}
                setRefetch={setRefetch}
                editData={editData}
                fromShopId={editData.fromShop?._id || editData.fromShop}
              />
            )}
          </>
        )}
        <Tooltip title={t("view_stock")}>
          <IconButton className="edit-icon" onClick={handleOpenview}>
            <ScanEye size="18px" color="#36BBA7" />
          </IconButton>
        </Tooltip>
        <ViewProductTransfer
          t={t}
          language={language}
          viewData={viewData}
          open={openView}
          onClose={handleCloseView}
        />
        
        <Tooltip title="Delete">
          <IconButton className="delete-icon" onClick={handleOpenCancelTransfer}>
            <Trash size="18px" color="red" />
          </IconButton>
        </Tooltip>
      </Stack>
    </div>
  );
}
