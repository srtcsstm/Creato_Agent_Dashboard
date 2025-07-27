import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from 'react-router-dom'; // Import useLocation

// Import the new content components
import OverviewContent from '../components/dashboard/OverviewContent';
import AnalyticsContent from '../components/dashboard/AnalyticsContent';
import ReportsContent from '../components/dashboard/ReportsContent';
import NotificationsContent from '../components/dashboard/NotificationsContent';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function DashboardPage() {
  const { t } = useLanguage();
  const location = useLocation(); // Get location object
  const [value, setValue] = useState(0); // State for active tab
  const theme = useTheme();

  // Determine initial tab based on URL query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab');
    switch (tabParam) {
      case 'overview':
        setValue(0);
        break;
      case 'analytics':
        setValue(1);
        break;
      case 'reports':
        setValue(2);
        break;
      case 'notifications':
        setValue(3);
        break;
      default:
        setValue(0); // Default to Overview
        break;
    }
  }, [location.search]); // Re-run when URL query changes

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Dashboard Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {t('dashboard.title')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CalendarTodayIcon />}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              '&:hover': {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            Jan 20, 2023 - Feb 09, 2023
          </Button>
          {/* The Download Reports button is now only in ReportsContent */}
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="dashboard sections"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
            },
            '& .MuiTab-root': {
              color: theme.palette.text.secondary,
              textTransform: 'none',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: theme.typography.fontWeightMedium,
              },
            },
          }}
        >
          <Tab label={t('dashboard.overview')} {...a11yProps(0)} />
          <Tab label={t('dashboard.analytics')} {...a11yProps(1)} />
          <Tab label={t('dashboard.reports')} {...a11yProps(2)} />
          <Tab label={t('dashboard.notifications')} {...a11yProps(3)} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={value} index={0}>
        <OverviewContent />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AnalyticsContent />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ReportsContent />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <NotificationsContent />
      </TabPanel>
    </Box>
  );
}

export default DashboardPage;
