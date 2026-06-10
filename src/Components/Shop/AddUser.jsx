import { useMutation, useQuery } from "@apollo/client/react";
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";

import {
  ADD_USER_CONTROLL_SHOP,
  DELETE_USER_FROM_SHOP,
} from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import {
  GET_SHOP_BY_ID,
  GET_USER_WITH_PAGINATION,
} from "../../../graphql/queries";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function AddUser({
  open,
  onClose,
  setRefetch,
  t,
  shopId,
}) {
  const { setAlert, language } = useAuth();

  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data, refetch, loading: queryLoading } = useQuery(
    GET_USER_WITH_PAGINATION,
    {
      variables: {
        page: 1,
        limit: 10,
        pagination: false,
        keyword: "",
        role: "",
      },
    }
  );

  const {
    data: shopData,
    loading: shopLoading,
    refetch: refetchShop,
  } = useQuery(GET_SHOP_BY_ID, {
    variables: { id: shopId },
  });

  const [addUserControllShop] = useMutation(ADD_USER_CONTROLL_SHOP, {
    onCompleted: ({ addUserControllShop }) => {
      setLoading(false);
      if (addUserControllShop?.isSuccess) {
        onClose?.();
        setAlert(true, "success", addUserControllShop?.message);
        setRefetch?.();
        setSelectedUsers([]);
        refetchShop();
        refetch();
      } else {
        setAlert(true, "error", addUserControllShop?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      console.error(error);
      setAlert(true, "error", t("add_failed"));
    },
  });

  const [deleteUserFromShop] = useMutation(DELETE_USER_FROM_SHOP, {
    onCompleted: ({ deleteUserFromShop }) => {
      setDeleteLoading(false);
      if (deleteUserFromShop?.isSuccess) {
        setAlert(true, "success", deleteUserFromShop?.message);
        setRefetch?.();
        refetchShop();
        refetch();
      } else {
        setAlert(true, "error", deleteUserFromShop?.message);
      }
    },
    onError: (error) => {
      setDeleteLoading(false);
      console.error(error);
    },
  });

  const shopTenantId = shopData?.getShopById?.tenantId?._id || shopData?.getShopById?.tenantId;
  const existingUsers = shopData?.getShopById?.user || [];
  const existingUserIds = existingUsers.map((u) => u._id || u.id);
  const availableUsers = (data?.getUsersWithPagination?.data || []).filter((candidate) => {
    const candidateTenantId = candidate?.tenantId?._id || candidate?.tenantId;
    return !shopTenantId || candidateTenantId === shopTenantId;
  });

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedUsers(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = () => {
    if (!shopId || selectedUsers.length === 0) {
      setAlert(true, "error", t("missing_data"));
      return;
    }

    const newUsers = selectedUsers.filter(
      (id) => !existingUserIds.includes(id)
    );

    if (newUsers.length === 0) {
      setAlert(true, "error", t("no_new_user_selected"));
      return;
    }

    setLoading(true);
    addUserControllShop({
      variables: { id: shopId, userId: newUsers },
    });
  };

  const handleDeleteUser = (uid) => {
    if (!shopId || !uid) return;

    setDeleteLoading(true);
    deleteUserFromShop({
      variables: { id: shopId, userId: [uid] },
    });
  };

  useEffect(() => {
    if (!open) setSelectedUsers([]);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between">
          <Typography>{t("add_user")}</Typography>
          <IconButton onClick={onClose}>
            <CircleX />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <DialogContentText component="div">
          <Stack spacing={3}>
            {/* Current Users */}
            <Stack spacing={1}>
              <Typography fontWeight="bold">
                {t("current_users")}
              </Typography>

              {shopLoading ? (
                <CircularProgress size={20} />
              ) : existingUsers.length === 0 ? (
                <Typography color="text.secondary">
                  {t("no_users_assigned")}
                </Typography>
              ) : (
                existingUsers.map((user) => (
                  <Stack
                    key={user._id || user.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ p: 1, border: 1, borderRadius: 1 }}
                  >
                    <Typography>
                      {language === "en" ? user.nameEn : user.nameKh}
                    </Typography>

                    <Typography>{user.role}</Typography>

                    <Button
                      color="error"
                      size="small"
                      onClick={() =>
                        handleDeleteUser(user._id || user.id)
                      }
                    >
                      {deleteLoading ? (
                        <CircularProgress size={16} />
                      ) : (
                        "Remove"
                      )}
                    </Button>
                  </Stack>
                ))
              )}
            </Stack>

            <Divider />

            {/* Add Users */}
            <Stack spacing={1}>
              <Typography fontWeight="bold">
                {t("add_new_users")}
              </Typography>

              {queryLoading ? (
                <CircularProgress />
              ) : (
                <FormControl fullWidth>
                  <Select
                    multiple
                    size="small"
                    value={selectedUsers}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => (
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {selected.map((id) => {
                          const user =
                            availableUsers.find(
                              (u) => u._id === id || u.id === id
                            );

                          return (
                            <Chip
                              key={id}
                              label={
                                user?.nameKh || user?.nameEn || id
                              }
                              onDelete={() =>
                                setSelectedUsers((prev) =>
                                  prev.filter((x) => x !== id)
                                )
                              }
                            />
                          );
                        })}
                      </Stack>
                    )}
                    MenuProps={MenuProps}
                  >
                    {availableUsers.map((user) => {
                      const isAdded = existingUserIds.includes(
                        user._id || user.id
                      );

                      return (
                        <MenuItem
                          key={user._id || user.id}
                          value={user._id || user.id}
                          disabled={isAdded}
                        >
                          {user.nameKh || user.nameEn}
                          {isAdded && " (Added)"}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              )}
            </Stack>

            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || selectedUsers.length === 0}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                t("create")
              )}
            </Button>
          </Stack>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
