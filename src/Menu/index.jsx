import { useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

import MenuMobile from './MenuMobile';
import MenuNavbar from './MenuNavbar';


export { default as MenuMobile } from './MenuMobile';
export { default as MenuNavbar } from './MenuNavbar';
export { default as SidebarNav } from './SidebarNav';


export default function Menu() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) return <MenuMobile />;
  return <MenuNavbar />;
}
