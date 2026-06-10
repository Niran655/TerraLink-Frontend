import { useMutation } from "@apollo/client/react";
import { Switch } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { UPDATE_USER_STATUS } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";

export default function AllowUser({ refetch, editData }) {
  const [checked, setChecked] = useState(!!editData?.active);
  const prev = useRef(checked);
  const [busy, setBusy] = useState(false);
  const { setAlert, logout, user } = useAuth();

  useEffect(() => setChecked(!!editData?.active), [editData?.active]);

  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS, {
    onCompleted: ({ updateUserStatus }) => {
      if (updateUserStatus?.isSuccess) {
        setAlert?.(true, "success", updateUserStatus?.message);

        if (!checked) {
          localStorage.removeItem("token");

          if (editData?._id === user?._id) {
            logout();
          }
        }

        refetch?.();
      } else {
        setChecked(prev.current);
        setAlert?.(true, "error", updateUserStatus?.message);
      }
    },
    onError: (error) => {
      setChecked(prev.current);
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    },
  });

  const handle = async (e) => {
    if (!editData?._id) return;

    prev.current = checked;
    setChecked(e.target.checked);
    setBusy(true);

    try {
      await updateUserStatus({
        variables: { id: editData._id, active: e.target.checked },
      });
    } finally {
      setBusy(false);
    }
  };

  return <Switch onChange={handle} checked={checked} disabled={busy} />;
}
