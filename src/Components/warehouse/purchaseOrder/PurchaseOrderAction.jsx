import { IconButton, Stack, Tooltip } from "@mui/material";
import {
  SquarePen,
  Trash,
  ScanEye,
  SquareArrowDown,
} from "lucide-react";
import PurchaseOrderForm from "./PurchaseOrderForm";
import PurchaseOrderDelete from "./PurchaseOrderDelete";

import { useState } from "react";
import PurchaseOrderView from "./PurchaseOrderView";
import PurchaseOrderReceive from "./PurchaseOrderReceive";

export default function PurchaseOrderAction({
  t,
  setRefetch,
  purchaseOrder,
  language,
  productSource,
  shopId,
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openReceive, setOpenReceive] = useState(false);

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Tooltip title={t("view")}>
          <IconButton onClick={() => setOpenView(true)}>
            <ScanEye size={18} color="#36BBA7" />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("accept")}>
          <IconButton onClick={() => setOpenReceive(true)}>
            <SquareArrowDown size={18} color="#F5276C" />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("edit")}>
          <IconButton onClick={() => setOpenEdit(true)}>
            <SquarePen size={18} color="orange" />
          </IconButton>
        </Tooltip>



        <Tooltip title={t("cancel")}>
          <IconButton onClick={() => setOpenCancel(true)}>
            <Trash size={18} color="red" />
          </IconButton>
        </Tooltip>
      </Stack>

      <PurchaseOrderView
        open={openView}
        onClose={() => setOpenView(false)}
        purchaseOrder={purchaseOrder}
        language={language}
        t={t}
      />

      <PurchaseOrderForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        t={t}
        language={language}
        setRefetch={setRefetch}
        editData={purchaseOrder}
        productSource={productSource}
        shopId={shopId}
      />

      <PurchaseOrderReceive
        open={openReceive}
        onClose={() => setOpenReceive(false)}
        purchaseOrder={purchaseOrder}
        t={t}
        language={language}
        setRefetch={setRefetch}
      />

      <PurchaseOrderDelete
        open={openCancel}
        onClose={() => setOpenCancel(false)}
        t={t}
        language={language}
        purchaseOrder={purchaseOrder}
        setRefetch={setRefetch}
      />
    </>
  );
}
