import { useMutation } from "@apollo/client/react";
import { Switch } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";

import { UPDATE_UNIT_STATUS } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";

export default function updateUnitStatus({ refetch, editData }) {
  const [checked, setChecked] = useState(!!editData?.active);
  const prev = useRef(checked);
  const [busy, setBusy] = useState(false);
  const { setAlert } = useAuth();

  useEffect(() => setChecked(!!editData?.active), [editData?.active]);
  const [updateUnitStatus] = useMutation(UPDATE_UNIT_STATUS, {
    onCompleted: ({ updateUnitStatus}) => {
      setAlert?.(true, "success", updateUnitStatus?.message);
      if(updateUnitStatus?.isSuccess){
        refetch?.()
      }else{
        setChecked(prev.current)
      }
    },
    onError: (e) => {
      setChecked(prev.current);
      setAlert?.(true, "error", e.message || "Error");
      console.error("Update error:", e);
    },
  });
  
  const handle = async (e) => {
    if (!editData?._id) return;
    prev.current = checked;
    setChecked(e.target.checked);
    setBusy(true);
    try {
      await updateUnitStatus({ variables: { id: editData._id, active: e.target.checked } });
    } finally {
      setBusy(false);
    }
  };

  return <Switch onChange={handle} checked={checked} disabled={busy} />;
}