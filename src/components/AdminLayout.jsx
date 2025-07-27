import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  CssBaseline,
  useTheme,
  Select, // Import Select for language switcher
  MenuItem, // Import MenuItem for language switcher
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ChatIcon from '@mui/icons-material/Chat'; // Import for Messages
import CallIcon from '@mui/icons-material/Call'; // Import for Calls
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage

const drawerWidth = 240;
const appBarHeight = 70;

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { currentLanguage, setLanguage, t } = useLanguage(); // Use language context

  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = () => {
    setDesktopDrawerOpen(!desktopDrawerOpen);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const menuItems = [
    { text: t('adminDashboardPage.title'), icon: <DashboardIcon />, path: '/admin' },
    { text: t('adminUsersPage.title'), icon: <GroupIcon />, path: '/admin/users' },
    { text: t('adminOffersPage.title'), icon: <DescriptionIcon />, path: '/admin/offers' },
    { text: t('adminInvoicesPage.title'), icon: <ReceiptIcon />, path: '/admin/invoices' },
    { text: t('conversationsPage.title'), icon: <ChatIcon />, path: '/admin/messages' },
    { text: t('callsPage.title'), icon: <CallIcon />, path: '/admin/calls' },
  ];

  const currentPageTitle =
    menuItems.find((item) => item.path === location.pathname)?.text || t('adminDashboardPage.title');

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'center', height: appBarHeight, minHeight: `${appBarHeight}px !important`, backgroundColor: theme.palette.background.default }}>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'text.primary', fontWeight: 600 }}>
          ADMIN PANEL
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: theme.palette.divider }} />
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(desktopDrawerOpen && {
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            marginLeft: { sm: `${drawerWidth}px` },
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
          height: appBarHeight,
          display: 'flex',
          justifyContent: 'center',
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Toolbar sx={{ width: '100%', px: { xs: 2, sm: 3 }, height: appBarHeight, minHeight: `${appBarHeight}px !important`, backgroundColor: theme.palette.background.default }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDesktopDrawerToggle}
            sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}
          >
            {desktopDrawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleMobileDrawerToggle}
            sx={{ mr: 2, display: { xs: 'flex', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {currentPageTitle}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          {/* Language Switcher */}
          <Select
            value={currentLanguage}
            onChange={handleLanguageChange}
            variant="outlined"
            size="small"
            sx={{
              color: theme.palette.text.primary,
              '.MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
              '.MuiSvgIcon-root': { color: theme.palette.text.secondary },
              backgroundColor: theme.palette.background.paper,
              mr: 2,
            }}
          >
            <MenuItem value="en">EN</MenuItem>
            <MenuItem value="tr">TR</MenuItem>
          </Select>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        anchor="left"
        open={desktopDrawerOpen}
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            height: '100vh',
            backgroundColor: theme.palette.background.default,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: { sm: `-${drawerWidth}px` },
          ...(desktopDrawerOpen && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: { sm: 0 },
          }),
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          overflowY: 'auto',
        }}
      >
        <Toolbar sx={{ height: appBarHeight, minHeight: `${appBarHeight}px !important` }} />
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;
