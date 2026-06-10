import { IconButton, Stack, Tooltip } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { ScanEye, Warehouse } from "lucide-react";
import React, { useState } from "react";

import { GET_WAREHOUSE_TRANSFER_BY_ID } from "../../../../graphql/queries";
import GetProductIntoWarehouseInShop from "./GetProductIntoWarehouseInShop";
import ViewProductTransferInShop from "./ViewProductTransferInShop";

export default function GetProductInShopAction({
  editData,
  t,
  language,
  loading,
  refetch,
  productWarehouseInShopRefetch
}) {
  const [openView, setOpenView] = useState(false);
  const [openGetProduct, setOpenGetProduct] = useState(false);

  const { data: transferDetailData, loading: transferDetailLoading } = useQuery(
    GET_WAREHOUSE_TRANSFER_BY_ID,
    {
      variables: { id: editData?._id },
      skip: (!openView && !openGetProduct) || !editData?._id,
      fetchPolicy: "cache-and-network",
    },
  );

  const transferData = transferDetailData?.getWarehouseTransferById || editData;

  const handleOpenview = () => setOpenView(true);
  const handleCloseView = () => setOpenView(false);

  const handleOpenGetProduct = () => setOpenGetProduct(true);
  const handleCloseGetProduct = () => setOpenGetProduct(false);

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Tooltip title={t("view")}>
          <IconButton className="edit-icon" onClick={handleOpenview}>
            <ScanEye size="18px" color="#36BBA7" />
          </IconButton>
        </Tooltip>

        <ViewProductTransferInShop
          t={t}
          language={language}
          viewData={transferData}
          open={openView}
          onClose={handleCloseView}
        />

        <Tooltip title={t(`get_product`)}>
          <IconButton className="delete-icon" onClick={handleOpenGetProduct}>
            <Warehouse size="18px" color="orange" />
          </IconButton>
        </Tooltip>

        <GetProductIntoWarehouseInShop
          t={t}
          language={language}
          editData={transferData}
          open={openGetProduct}
          onClose={handleCloseGetProduct}
          loading={loading || transferDetailLoading}
          refetch={refetch}
          productWarehouseInShopRefetch={productWarehouseInShopRefetch}
        />
      </Stack>
    </div>
  );
}
