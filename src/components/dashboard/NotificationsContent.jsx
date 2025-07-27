import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  // Paper kaldırıldı
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'; // For 'lead'
import DescriptionIcon from '@mui/icons-material/Description'; // For 'offer'
import CallIcon from '@mui/icons-material/Call'; // For 'call'

import { useLanguage } from '../../contexts/LanguageContext';
import { formatDateToDDMMYYYYHHMM } from '../../utils/dateUtils';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import { fetchNocoDBData, updateNocoDBData, deleteNocoDBData } from '../../api/nocodb'; // Import NocoDB API functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function NotificationsContent() {
  const { t } = useLanguage();
  const { clientId } = useAuth(); // Get clientId from AuthContext
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNocoDBData('notifications', clientId);
      // Sort notifications by created_at in descending order
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB.getTime() - dateA.getTime();
      });
      setNotifications(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      loadNotifications();
    }
  }, [clientId]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleOutlineIcon sx={{ color: theme.palette.success.main }} />;
      case 'info': return <InfoOutlinedIcon sx={{ color: theme.palette.info.main }} />;
      case 'warning': return <WarningAmberOutlinedIcon sx={{ color: theme.palette.warning.main }} />;
      case 'error': return <ErrorOutlineIcon sx={{ color: theme.palette.error.main }} />;
      case 'lead': return <PersonAddAlt1Icon sx={{ color: theme.palette.info.main }} />;
      case 'call': return <CallIcon sx={{ color: theme.palette.primary.main }} />;
      case 'offer': return <DescriptionIcon sx={{ color: theme.palette.warning.main }} />;
      case 'invoice': return <NotificationsIcon sx={{ color: theme.palette.success.main }} />; // Using generic for now
      case 'system': return <NotificationsIcon sx={{ color: theme.palette.error.main }} />; // Using generic for now
      default: return <NotificationsIcon sx={{ color: theme.palette.text.secondary }} />;
    }
  };

  const handleNotificationClick = async (notification) => {
    // Bildirimin ID'sini doğru şekilde al
    const notificationId = notification.id || notification.Id; // Hem 'id' hem de 'Id' kontrolü
    if (!notificationId) {
      console.error("Bildirim ID'si bulunamadı:", notification);
      return;
    }

    if (notification.status === 'unread') {
      await markAsRead(notificationId); // Doğru ID'yi ilet
    }
    if (notification.link && notification.link !== '#') {
      navigate(notification.link);
    }
  };

  const markAsRead = async (id) => {
    try {
      await updateNocoDBData('notifications', id, { status: 'read' });
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id || notif.Id === id ? { ...notif, status: 'read' } : notif))
      );
    } catch (err) {
      console.error("Bildirim okundu olarak işaretlenirken hata oluştu:", err);
      setError(err.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => notif.status === 'unread');
      await Promise.all(unreadNotifications.map(notif =>
        updateNocoDBData('notifications', notif.id || notif.Id, { status: 'read' }) // Doğru ID'yi ilet
      ));
      setNotifications((prev) => prev.map((notif) => ({ ...notif, status: 'read' })));
    } catch (err) {
      console.error("Tüm bildirimler okundu olarak işaretlenirken hata oluştu:", err);
      setError(err.message);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await Promise.all(notifications.map(notif =>
        deleteNocoDBData('notifications', notif.id || notif.Id) // Doğru ID'yi ilet
      ));
      setNotifications([]);
    } catch (err) {
      console.error("Tüm bildirimler temizlenirken hata oluştu:", err);
      setError(err.message);
    }
  };

  const unreadCount = notifications.filter(notif => notif.status === 'unread').length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t('common.loading')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')}: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        {t('notificationsPage.yourNotifications')} ({unreadCount} {t('notificationsPage.unread')})
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={markAllAsRead} disabled={unreadCount === 0}>
          {t('notificationsPage.markAllAsRead')}
        </Button>
        <Button variant="outlined" color="error" onClick={clearAllNotifications} disabled={notifications.length === 0}>
          {t('notificationsPage.clearAll')}
        </Button>
      </Box>

      {/* Paper bileşeni kaldırıldı, List doğrudan Box altında */}
      <List sx={{ p: 0 }}> {/* List'in kendi padding'ini sıfırla */}
        {notifications.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 3, py: 2 }}> {/* Boşlukları ayarla */}
            {t('notificationsPage.noNotifications')}
          </Typography>
        ) : (
          notifications.map((notif, index) => (
            <React.Fragment key={notif.id || notif.Id}>
              <ListItem
                alignItems="flex-start"
                onClick={() => handleNotificationClick(notif)}
                sx={{
                  // Okunmamış/okunmuş duruma göre arka plan rengi
                  backgroundColor: notif.status === 'read' ? theme.palette.background.default : theme.palette.background.paper,
                  borderRadius: 8,
                  mb: 1,
                  cursor: 'pointer',
                  px: { xs: 2, sm: 3 }, // Responsive yatay padding
                  py: 1.5, // Dikey padding
                  '&:hover': {
                    // Hover efekti için renkleri ayarla
                    backgroundColor: theme.palette.mode === 'dark'
                      ? (notif.status === 'read' ? 'rgba(26, 28, 35, 0.5)' : 'rgba(26, 28, 35, 0.8)')
                      : (notif.status === 'read' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.05)'),
                  },
                }}
              >
                <ListItemIcon>
                  {getIcon(notif.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ color: notif.status === 'read' ? 'text.secondary' : 'text.primary', fontWeight: notif.status === 'read' ? 'normal' : 'bold' }}>
                      {notif.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {notif.description} - {formatDateToDDMMYYYYHHMM(notif.created_at)}
                    </Typography>
                  }
                />
                {notif.status === 'unread' && (
                  <Button size="small" onClick={(e) => { e.stopPropagation(); markAsRead(notif.id || notif.Id); }}>
                    {t('notificationsPage.markAsRead')}
                  </Button>
                )}
              </ListItem>
              {index < notifications.length - 1 && <Divider component="li" sx={{ borderColor: theme.palette.divider }} />}
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  );
}

export default NotificationsContent;
