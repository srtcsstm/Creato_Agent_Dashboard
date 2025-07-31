import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  CssBaseline,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Select,
  Badge, // Keep Badge for now if needed elsewhere, but not for NotificationPopover
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';
import CallIcon from '@mui/icons-material/Call';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings'; // Still used for general settings icon
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DescriptionIcon from '@mui/icons-material/Description'; // For Proposals
import ReceiptIcon from '@mui/icons-material/Receipt'; // For Invoices

import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'; // For Payments

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import NotificationsIcon from '@mui/icons-material/Notifications'; // Removed
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { LayoutDashboard, UserCog, Settings as LucideSettings, LogOut } from "lucide-react";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { useAuth } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchNocoDBData, updateNocoDBData, deleteNocoDBData } from '../api/nocodb'; // Import updateNocoDBData and deleteNocoDBData
import { NotificationPopover } from './ui/notification-popover'; // Import the new component

const appBarHeight = 70;
const sidebarWidthOpen = 240;
const sidebarWidthClosed = 60;

function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]); // State to hold notifications
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, clientId } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const theme = useTheme();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleCloseMenu();
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleCloseMenu();
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const loadNotifications = async () => {
    if (clientId) {
      try {
        const data = await fetchNocoDBData('notifications', clientId);
        // Sort notifications by created_date in descending order
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.created_date);
          const dateB = new Date(b.created_date);
          return dateB.getTime() - dateA.getTime();
        });
        setNotifications(sortedData);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setNotifications([]);
      }
    } else {
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Fetch notifications every minute
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [clientId, location.pathname]);

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => notif.status === 'unread');
      await Promise.all(unreadNotifications.map(notif =>
        updateNocoDBData('notifications', notif.id || notif.Id, { status: 'read' })
      ));
      setNotifications((prev) => prev.map((notif) => ({ ...notif, status: 'read' })));
    } catch (err) {
      console.error("Tüm bildirimler okundu olarak işaretlenirken hata oluştu:", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await updateNocoDBData('notifications', id, { status: 'read' });
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id || notif.Id === id ? { ...notif, status: 'read' } : notif))
      );
    } catch (err) {
      console.error("Bildirim okundu olarak işaretlenirken hata oluştu:", err);
    }
  };

  const handleNotificationClick = async (notification) => {
    const notificationId = notification.id || notification.Id;
    if (!notificationId) {
      console.error("Bildirim ID'si bulunamadı:", notification);
      return;
    }

    if (notification.status === 'unread') {
      await handleMarkAsRead(notificationId);
    }
    if (notification.link && notification.link !== '#') {
      navigate(notification.link);
    } else {
      // If no specific link, navigate to the notifications tab on the dashboard
      navigate('/dashboard?tab=notifications');
    }
  };


  const routeTitles = {
    '/dashboard': t('dashboard.title'),
    '/': t('dashboard.title'),
    '/conversations': t('conversationsPage.title'),
    '/calls': t('callsPage.title'),
    '/leads': t('leadsPage.title'),
    '/proposals': t('proposalsPage.title'),
    '/invoices': t('invoicesPage.invoices'),
    '/payments': t('paymentsPage.title'),
    '/settings': t('settingsPage.title'), // Agent Settings page
    '/profile-settings': t('profileSettingsPage.title'), // Profile Settings page
    '/admin': t('adminDashboardPage.title'),
    '/admin/users': t('adminUsersPage.title'),
    '/admin/offers': t('adminOffersPage.title'),
    '/admin/invoices': t('adminInvoicesPage.title'),
    '/admin/messages': t('adminMessagesPage.title'),
    '/admin/calls': t('adminCallsPage.title'),
  };

  const tabTitles = {
    'overview': t('dashboard.overview'),
    'analytics': t('dashboard.analytics'),
    'reports': t('dashboard.reports'),
    'notifications': t('dashboard.notifications'),
  };

  const getBreadcrumbPath = () => {
    const path = location.pathname;
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab');

    const breadcrumb = [];
    breadcrumb.push({ name: routeTitles['/dashboard'], path: '/dashboard' });

    if (path === '/dashboard' || path === '/') {
      const currentTabKey = tabParam || 'overview';
      const currentTabTitle = tabTitles[currentTabKey];
      if (currentTabTitle) {
        if (currentTabKey !== 'overview' || (path === '/dashboard' && tabParam === 'overview')) {
          breadcrumb.push({ name: currentTabTitle, path: `/dashboard?tab=${currentTabKey}` });
        }
      }
    } else {
      const mainRouteTitle = routeTitles[path];
      if (mainRouteTitle) {
        breadcrumb.push({ name: mainRouteTitle, path: path });
      }
    }
    const uniqueBreadcrumb = [];
    const pathsSeen = new Set();
    for (const item of breadcrumb) {
      if (!pathsSeen.has(item.path)) {
        uniqueBreadcrumb.push(item);
        pathsSeen.add(item.path);
      }
    }
    return uniqueBreadcrumb;
  };

  const breadcrumbPath = getBreadcrumbPath();

  const sidebarLinks = [
    {
      label: t('dashboard.title'),
      href: "/dashboard",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t('conversationsPage.title'),
      href: "/conversations",
      icon: (
        <ChatIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t('callsPage.title'),
      href: "/calls",
      icon: (
        <CallIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t('leadsPage.title'),
      href: "/leads",
      icon: (
        <PeopleIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t('proposalsPage.title'),
      href: "/proposals",
      icon: (
        <DescriptionIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t('invoicesPage.invoices'),
      href: "/invoices",
      icon: (
        <ReceiptIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />

      {/* New Sidebar Component */}
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Sidebar Logo */}
            <Link
              to="/dashboard"
              className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 justify-center"
              style={{ height: appBarHeight, minHeight: `${appBarHeight}px` }}
            >
              <img
                src="https://agency.creato.digital/wp-content/uploads/2023/05/creato-ai-wlogo.png"
                alt="Creato AI Logo"
                style={{ height: '24px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <div className="mt-8 flex flex-col gap-2">
              {sidebarLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          {/* User/Settings/Logout section at the bottom of sidebar */}
          <div>
            <SidebarLink
              link={{
                label: t('profileSettingsPage.title'), // Changed to Profile Settings
                href: "/profile-settings", // Link to Profile Settings page
                icon: (
                  <LucideSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
            <SidebarLink
              link={{
                label: t('common.logout'),
                href: "#",
                icon: (
                  <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
              }}
              onClick={handleLogout}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Wrapper - Contains AppBar, Outlet, and Footer */}
      <Box
        sx={{
          flexGrow: 1, // Takes remaining horizontal space
          display: 'flex',
          flexDirection: 'column', // Stacks children vertically
          backgroundColor: theme.palette.background.default,
          overflowY: 'auto', // Allows vertical scrolling for content
          height: '100vh', // Ensures it takes full viewport height
          boxSizing: 'border-box', // Include padding in total width/height
        }}
      >
        {/* Top AppBar (Header) */}
        <AppBar
          position="static" // Changed to static so it flows normally within its parent Box
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            height: appBarHeight,
            display: 'flex',
            justifyContent: 'center',
            boxShadow: 'none',
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
            width: '100%', // Takes full width of its parent (Content Wrapper)
          }}
        >
          <Toolbar sx={{ width: '100%', px: { xs: 2, sm: 3 }, height: appBarHeight, minHeight: `${appBarHeight}px !important` }}>
            {/* Removed desktop and mobile toggle buttons here */}

            {/* Breadcrumb Path */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {breadcrumbPath.map((item, index) => (
                <React.Fragment key={item.path}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: index === breadcrumbPath.length - 1 ? 'text.primary' : 'text.secondary',
                      fontWeight: index === breadcrumbPath.length - 1 ? 600 : 'normal',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: index === breadcrumbPath.length - 1 ? 'none' : 'underline',
                      },
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    {item.name}
                  </Typography>
                  {index < breadcrumbPath.length - 1 && (
                    <KeyboardArrowRightIcon sx={{ fontSize: 'small', mx: 0.25, color: 'text.secondary' }} />
                  )}
                </React.Fragment>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
              <IconButton color="inherit" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <SearchIcon />
              </IconButton>
              {/* Replaced Material-UI NotificationsIcon with NotificationPopover */}
              <NotificationPopover
                notifications={notifications}
                onMarkAllAsRead={handleMarkAllAsRead}
                onMarkAsRead={handleMarkAsRead}
                onNotificationClick={handleNotificationClick}
              />

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
                }}
              >
                <MenuItem value="en">EN</MenuItem>
                <MenuItem value="tr">TR</MenuItem>
              </Select>

              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ p: 0.5 }}
                >
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 36, height: 36, fontSize: '1rem' }}>
                    C
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    sx: {
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: '8px',
                      boxShadow: theme.palette.mode === 'dark' ? '0px 8px 24px rgba(0, 0, 0, 0.4)' : '0px 8px 24px rgba(0, 0, 0, 0.1)',
                      py: 1,
                    },
                  }}
                >
                  {/* My Account Section */}
                  <Typography variant="overline" sx={{ px: 2, pt: 1, pb: 0.5, display: 'block', color: theme.palette.text.secondary }}>
                    {t('myAccount')}
                  </Typography>
                  <MenuItem
                    onClick={() => handleMenuItemClick('/profile-settings')}
                    sx={{
                      backgroundColor: location.pathname === '/profile-settings' ? theme.palette.action.selected : 'transparent',
                      borderRadius: '6px',
                      mx: 1,
                      my: 0.5,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.action.selected,
                        '&:hover': {
                          backgroundColor: theme.palette.action.selected,
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PersonOutlineIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />
                    </ListItemIcon>
                    <ListItemText primary={t('profile')} primaryTypographyProps={{ color: theme.palette.text.primary, fontWeight: 'medium' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      ⇧⌘P
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick('/dashboard?tab=notifications')}
                    sx={{ borderRadius: '6px', mx: 1, my: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <MailOutlineIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />
                    </ListItemIcon>
                    <ListItemText primary={t('inbox')} primaryTypographyProps={{ color: theme.palette.text.primary }} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      ⌘I
                    </Typography>
                  </MenuItem>
                  {/* Agent Settings removed from here */}

                  <Divider sx={{ borderColor: theme.palette.divider, my: 1 }} />

                  {/* Client Management Section */}
                  <Typography variant="overline" sx={{ px: 2, pt: 0.5, pb: 0.5, display: 'block', color: theme.palette.text.secondary }}>
                    {t('clientManagement')}
                  </Typography>
                  <MenuItem onClick={() => handleMenuItemClick('/invoices')}
                    sx={{ borderRadius: '6px', mx: 1, my: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ReceiptIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />
                    </ListItemIcon>
                    <ListItemText primary={t('invoicesPage.invoices')} primaryTypographyProps={{ color: theme.palette.text.primary }} />
                    <ChevronRightIcon fontSize="small" sx={{ ml: 2, color: theme.palette.text.secondary }} />
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick('/proposals')}
                    sx={{ borderRadius: '6px', mx: 1, my: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <DescriptionIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />
                    </ListItemIcon>
                    <ListItemText primary={t('proposalsPage.title')} primaryTypographyProps={{ color: theme.palette.text.primary }} />
                    <ChevronRightIcon fontSize="small" sx={{ ml: 2, color: theme.palette.text.secondary }} />
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick('/payments')}
                    sx={{ borderRadius: '6px', mx: 1, my: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AccountBalanceWalletIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />
                    </ListItemIcon>
                    <ListItemText primary={t('paymentsPage.title')} primaryTypographyProps={{ color: theme.palette.text.primary }} />
                    <ChevronRightIcon fontSize="small" sx={{ ml: 2, color: theme.palette.text.secondary }} />
                  </MenuItem>

                  <Divider sx={{ borderColor: theme.palette.divider, my: 1 }} />

                  {/* Theme Toggle (kept as it's a global setting) */}
                  <MenuItem onClick={toggleTheme}
                    sx={{ borderRadius: '6px', mx: 1, my: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {mode === 'dark' ? <Brightness7Icon fontSize="small" sx={{ color: theme.palette.text.primary }} /> : <Brightness4Icon fontSize="small" sx={{ color: theme.palette.text.primary }} />}
                    </ListItemIcon>
                    <ListItemText primary={mode === 'dark' ? t('common.lightTheme') : t('common.darkTheme')} primaryTypographyProps={{ color: theme.palette.text.primary }} />
                  </MenuItem>

                  {/* Log Out */}
                  <MenuItem onClick={handleLogout}
                    sx={{ borderRadius: '6px', mx: 1, my: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LogoutIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />
                    </ListItemIcon>
                    <ListItemText primary={t('common.logout')} primaryTypographyProps={{ color: theme.palette.text.primary }} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      ⇧⌘Q
                    </Typography>
                  </MenuItem>
                </Menu>
              </div>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: theme.palette.background.default,
            overflowY: 'auto',
            height: `calc(100vh - ${appBarHeight}px)`, // Occupy remaining vertical space
            boxSizing: 'border-box',
          }}
        >
          <Outlet />

          {/* Dashboard Footer */}
          <Box
            component="footer"
            sx={{
              mt: 4,
              py: 2,
              textAlign: 'center',
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Typography variant="caption">
              {t('common.createdBy')}
            </Typography>
            <img
              src="https://agency.creato.digital/wp-content/uploads/2023/05/creato-ai-wlogo.png"
              alt="Creato AI Logo"
              style={{ height: '16px', width: 'auto', verticalAlign: 'middle' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;
