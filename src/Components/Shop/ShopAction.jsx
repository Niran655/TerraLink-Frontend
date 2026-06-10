import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem, Stack } from "@mui/material";
import { Pencil, Settings, Trash, User } from "lucide-react";
import React, { useState } from "react";

import ShopDelete from "./ShopDelete";
import ShopForm from "./ShopForm";
import AddUser from "./AddUser";
import { useNavigate } from "react-router-dom";

const ShopAction = ({ t, shopData, setRefetch,shopName,shopId,userId }) => {
 
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false)
  const handleOpenAddUser = ()=> setOpenAddUser(true)
  const handleCloseAddUser = () => setOpenAddUser(false)

  const handleOpenDelete =()=> setOpenDelete(true);
  const handleCloseDelete =()=> setOpenDelete(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleMenuClick}>
        <Settings size={20} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate(`/store-setting/${shopId}`)}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Settings size={16} />
            <span>{t("setting")}</span>
          </Stack>
        </MenuItem>

        <MenuItem onClick={handleOpen}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Pencil size={16} />
            <span>{t("update")}</span>
          </Stack>
        </MenuItem>

        <MenuItem onClick={handleOpenAddUser} >
          <Stack direction="row" spacing={2} alignItems="center">
            <User size={16} />
            <span>{t("user_control")}</span>
          </Stack>
        </MenuItem>

        <MenuItem onClick={handleOpenDelete}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Trash size={16} />
            <span>{t("delete")}</span>
          </Stack>
        </MenuItem>
      </Menu>
      {open && (
        <ShopForm
          setRefetch={setRefetch}
          dialogTitle="Update"
          t={t}
          shopData={shopData}
          open={open}
          onClose={handleClose}
        />
      )}
      {openDelete && (
        <ShopDelete
          setRefetch={setRefetch}
          t={t}
          open={openDelete}
          onClose={handleCloseDelete}
          shopName={shopName}
          shopId={shopId}
          imageUrl={shopData?.image}
        />
      )}
      {
        openAddUser && (
          <AddUser t={t} userId={userId} shopId={shopId} open={openAddUser} onClose={handleCloseAddUser} setRefetch={setRefetch} />
        )
      }
    </>
  );
};

export default ShopAction;
