/* eslint-disable react/prop-types */
import { Box, IconButton, Stack } from "@mui/material";
import { SquarePen, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";

import { UPDATE_TENANT_STATUS } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import TenantForm from "./TenantForm";

export default function TenantAction({ tenantData, setRefetch, t }) {
  const { setAlert } = useAuth();
  const [open, setOpen] = useState(false);

  const [updateTenantStatus, { loading }] = useMutation(UPDATE_TENANT_STATUS, {
    onCompleted: ({ updateTenantStatus: result }) => {
      if (result?.isSuccess) {
        setAlert(true, "success", result?.message);
        setRefetch?.();
      } else {
        setAlert(true, "error", result?.message);
      }
    },
    onError: (error) => {
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    },
  });

  const handleToggleStatus = () => {
    updateTenantStatus({
      variables: {
        id: tenantData?._id,
        active: !tenantData?.active,
      },
    });
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <IconButton className="edit-icon" onClick={() => setOpen(true)}>
          <SquarePen size="18px" color="#36BBA7" />
        </IconButton>
        <IconButton className="delete-icon" onClick={handleToggleStatus} disabled={loading}>
          {tenantData?.active ? <ToggleRight size="20px" color="#36BBA7" /> : <ToggleLeft size="20px" color="red" />}
        </IconButton>
      </Stack>

      <TenantForm open={open} onClose={() => setOpen(false)} dialogTitle="Update" tenantData={tenantData} setRefetch={setRefetch} t={t} />
    </Box>
  );
}
