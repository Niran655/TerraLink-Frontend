import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import ApiIcon from '@mui/icons-material/Api';
import { IoSettingsOutline } from "react-icons/io5";
import { PiChatsCircleLight } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
//mui
import { Avatar, Box, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

import { useThemeContext } from '../Context/ThemeContext';
//icon
import SideBarItems from './SideBarItems';

export default function SidebarNav() {
    const [activeItem, setActiveItem] = useState(null)
    const { sidebarColor, layoutMode } = useThemeContext();
    const handleItemClick = (label) => {
        setActiveItem(label);  
    };
    const sidebarItems = [
        { label: 'Dashboard', path: '/dashboard', icon: <RxDashboard /> },
        { label: 'Order', path: '/order', icon: <SellOutlinedIcon /> },
        { label: 'Chat', path: '/chat', icon: <PiChatsCircleLight /> },
        { label: 'On Sale', path: '/on-sale', icon: <ShoppingCartOutlinedIcon /> },
        { label: 'Customer', path: '/customer', icon: <SellOutlinedIcon /> },
        { label: 'Report', path: '/report', icon: <SellOutlinedIcon /> },
        { label: 'Settings', path: '/settings', icon: <IoSettingsOutline /> },
    ];

    return (
        <Box sx={{ backgroundColor: sidebarColor, color: 'white', height: '100%' }}>
            <Stack direction="row" display="flex" justifyContent="start" alignItems="center" margin="30px 10px 30px 30px">
                <Avatar sx={{ margin: "5px 10px 5px 0px" }} alt="Chanry" src="/static/images/avatar/2.jpg" />

                {layoutMode !== 'compact' && (
                <Stack display="flex" justifyContent="center" margin="5px">
                    <Stack direction="row" display="flex" justifyContent="start" >
                        <Typography className='profile-text-small' padding="0px 10px 0px 0px">Welcome</Typography>
                        <ApiIcon className='profile-text-icon' />
                    </Stack>
                    <Typography className='profile-text-big'>Chanry Koeum</Typography>
                </Stack>
                )}
            </Stack>
            {sidebarItems.map((item) => (
                <SideBarItems
                    key={item.label}
                    item={item}
                    isActive={activeItem === item.label}  
                    onClick={() => handleItemClick(item.label)}
                    showLabel={layoutMode !== 'compact'}
                />
            ))}
        </Box>
    )
}
