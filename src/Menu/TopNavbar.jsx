import { useNavigate } from "react-router-dom";
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { Avatar, Button, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from "@mui/material";
import { useState } from "react";

import CambodiaFlag from "../assets/Image/cambodiaflag.png";
import EnglishFlag from "../assets/Image/englishflag.png";
 
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import "./topnavbar.scss";
import Notification from "./Notification";
export default function TopNavbar({ width, toggleDrawer }) {
  const navigate = useNavigate();
  const { changeLanguage, language } = useAuth();
  const { t } = translateLauguage(language);

  let userLogin = JSON.parse(window.localStorage.getItem("userLogin"));

 
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(
    language === "kh" ? CambodiaFlag : EnglishFlag
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    language === "kh" ? "ភាសាខ្មែរ" : "English"
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(!openMenu);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(false);
  };

  const handleFlagChange = (flag, languageCode, languageName) => {
    setSelectedFlag(flag);
    setSelectedLanguage(languageName);
    changeLanguage(languageCode);
    handleClose();
  };

  return (
    <Toolbar className="topbar-container">
      <Stack
        direction="row"
        sx={{ width: "100%", height: "80px" }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          <Stack direction="column" justifyContent="center">
            <IconButton
              onClick={() => navigate("/dashboard")}
              className={
                width < 1400 ? "image-container-mobile" : "image-container"
              }
            >
             
            </IconButton>
          </Stack>
          <Stack direction="column" justifyContent="center">
            <Typography className="company-name">GO GLOBAL MART</Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1.4} justifyContent="right">
          <Stack direction="column" justifyContent="center">
            <Notification />
          </Stack>

          <Stack direction="column" justifyContent="center">
            <Button
              className="btn-menu"
              onClick={handleClick}
              sx={{ width: "150px" }}
            >
              <Stack direction="row" spacing={2}>
                <Stack direction="column" justifyContent="center">
                  <Avatar
                    src={selectedFlag}
                    alt="User"
                    className="avatar-user"
                    sx={{ width: 40, height: 40 }}
                  />
                </Stack>
                <Stack direction="column" justifyContent="center">
                  <Typography className="username-text">
                    {selectedLanguage}
                  </Typography>
                </Stack>
                <Stack direction="column" justifyContent="center">
                  {openMenu ? (
                    <FaAngleUp className="icon-menu" />
                  ) : (
                    <FaAngleDown className="icon-menu" />
                  )}
                </Stack>
              </Stack>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {language === "en" ? (
                <MenuItem
                  onClick={() =>
                    handleFlagChange(CambodiaFlag, "kh", "ភាសាខ្មែរ")
                  }
                >
                  ភាសាខ្មែរ
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => handleFlagChange(EnglishFlag, "en", "English")}
                >
                  English
                </MenuItem>
              )}
            </Menu>
          </Stack>

          <Stack direction="column" justifyContent="center">
            <IconButton>
              <IoLogOutOutline className="link-icon" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Toolbar>
  );
}
