import { Button, Stack } from "@mui/material";
import { useState } from "react";

import AcceptProductDailog from "./AcceptProductDailog";

export default function GetProductAction({ t, item, language, editData, refetch,productWarehouseInShopRefetch }) {
  const isPending = editData?.status === "pending";
  const isPartialAccepted = editData?.status === "partial_accepted";
  const isFinalStatus = ["accepted", "rejected", "cancelled"].includes(
    editData?.status
  );

  const [openAccept, setOpenAccept] = useState(false);
  const [openGetProduct, setOpenGetProduct] = useState(false);

  const handleOpenAccept = () => setOpenAccept(true);
  const handleCloseAccept = () => setOpenAccept(false);

  const handleOpenGetProduct = () => setOpenGetProduct(true);
  const handleCloseGetProduct = () => setOpenGetProduct(false);

  return (
    <div>
      <Stack direction="row" justifyContent={"flex-end"} spacing={2}>
 
        {isPending && !isFinalStatus && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleOpenGetProduct}
          >
            {t("reject")}
          </Button>
        )}

 
        {(isPending || isPartialAccepted) && !isFinalStatus && (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenAccept}
          >
            {t("accept_more")}
          </Button>
        )}

        <AcceptProductDailog
          refetch={refetch}
          editData={editData}
          t={t}
          item={item}
          language={language}
          open={openAccept}
          onClose={handleCloseAccept}
          productWarehouseInShopRefetch={productWarehouseInShopRefetch}
        />
      </Stack>
    </div>
  );
}
