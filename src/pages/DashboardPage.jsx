import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  useTheme,
  Select, // Select bileşenini import et
  MenuItem, // MenuItem bileşenini import et
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDashboardFilter } from '../contexts/DashboardFilterContext'; // useDashboardFilter hook'unu import et

// Import the new content components
import OverviewContent from '../components/dashboard/OverviewContent';
// import AnalyticsContent from '../components/dashboard/AnalyticsContent.tsx'; // Removed
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
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const { selectedDays, setSelectedDays } = useDashboardFilter(); // Context'ten selectedDays ve setSelectedDays al
  const theme = useTheme();

  // Updated tabIndexToParam to remove 'analytics'
  const tabIndexToParam = ['overview', 'reports', 'notifications'];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab');
    const index = tabIndexToParam.indexOf(tabParam);
    if (index !== -1) {
      setValue(index);
    } else {
      setValue(0);
    }
  }, [location.search]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const newTabParam = tabIndexToParam[newValue];
    navigate(`?tab=${newTabParam}`, { replace: true });
  };

  const handleDaysChange = (event) => {
    setSelectedDays(event.target.value);
  };

  const getDateRangeLabel = () => {
    if (selectedDays === 1) return t('dateRanges.lastDay');
    return t('dateRanges.lastXDays', { count: selectedDays });
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Dashboard Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {t('dashboard.title')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Tarih Seçici Dropdown */}
          <Select
            value={selectedDays}
            onChange={handleDaysChange}
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
            <MenuItem value={1}>{t('dateRanges.lastDay')}</MenuItem>
            <MenuItem value={7}>{t('dateRanges.last7Days')}</MenuItem>
            <MenuItem value={10}>{t('dateRanges.last10Days')}</MenuItem>
            <MenuItem value={30}>{t('dateRanges.last30Days')}</MenuItem>
            <MenuItem value={60}>{t('dateRanges.last60Days')}</MenuItem>
            <MenuItem value={90}>{t('dateRanges.last90Days')}</MenuItem>
          </Select>
          {/* Takvim ikonu ve metni kaldırıldı, Select bileşeni yeterli */}
          {/* <Button
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
            {getDateRangeLabel()}
          </Button> */}
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
          {/* <Tab label={t('dashboard.analytics')} {...a11yProps(1)} /> Removed Analytics Tab */}
          <Tab label={t('dashboard.reports')} {...a11yProps(1)} />
          <Tab label={t('dashboard.notifications')} {...a11yProps(2)} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={value} index={0}>
        <OverviewContent selectedDays={selectedDays} />
      </TabPanel>
      {/* <TabPanel value={value} index={1}> Removed Analytics TabPanel
        <AnalyticsContent selectedDays={selectedDays} />
      </TabPanel> */}
      <TabPanel value={value} index={1}>
        <ReportsContent />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <NotificationsContent selectedDays={selectedDays} />
      </TabPanel>
    </Box>
  );
}

export default DashboardPage;
