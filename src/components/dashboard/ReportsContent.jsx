import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  Alert,
  Snackbar,
  Grid, // Import Grid for layout
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DescriptionIcon from '@mui/icons-material/Description';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDateToDDMMYYYYHHMM } from '../../utils/dateUtils';

function ReportsContent() {
  const { t } = useLanguage();
  const [reportType, setReportType] = useState('conversations');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generatedReports, setGeneratedReports] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const theme = useTheme();

  const reportTypes = [
    { value: 'conversations', label: t('conversationsPage.title') },
    { value: 'calls', label: t('callsPage.title') },
    { value: 'leads', label: t('leadsPage.title') },
    { value: 'proposals', label: t('proposalsPage.title') },
    { value: 'invoices', label: t('invoicesPage.invoices') },
  ];

  const handleGenerateReport = () => {
    if (!reportType || !startDate || !endDate) {
      setSnackbarMessage(t('reportsPage.selectReportTypeAndDateRange'));
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    const newReport = {
      id: Date.now(),
      type: reportType,
      startDate,
      endDate,
      generatedAt: new Date(),
      fileName: `${reportType}_report_${startDate}_to_${endDate}.csv`,
      downloadUrl: '#', // Simulated download URL
    };

    setGeneratedReports((prev) => [newReport, ...prev]);
    setSnackbarMessage(t('reportsPage.reportGeneratedSuccess'));
    setSnackbarSeverity('success');
    setSnackbarOpen(true);

    // Simulate file download
    console.log(`Simulating download for: ${newReport.fileName}`);
    // In a real app, you'd trigger an API call to generate and download the file.
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 0 }}> {/* Ensure Box has padding or minHeight if it's the root */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        {t('reportsPage.generateReports')}
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4, minHeight: '150px' }}> {/* Added minHeight */}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label={t('reportsPage.reportType')}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              fullWidth
              variant="outlined"
            >
              {reportTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label={t('reportsPage.startDate')}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label={t('reportsPage.endDate')}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined" // Changed to outlined
              startIcon={<FileDownloadIcon />}
              onClick={handleGenerateReport}
              sx={{
                mt: 2,
                backgroundColor: theme.palette.background.paper, // Match other outlined buttons
                color: theme.palette.text.primary, // Match other outlined buttons
                border: `1px solid ${theme.palette.divider}`, // Match other outlined buttons
                '&:hover': {
                  backgroundColor: theme.palette.action.hover, // Match other outlined buttons
                },
                borderRadius: '6px',
                px: 2,
                py: 1,
              }}
            >
              {t('reportsPage.generateAndDownload')}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        {t('reportsPage.recentReports')}
      </Typography>

      <Paper elevation={2} sx={{ p: 3, minHeight: '150px' }}> {/* Added minHeight */}
        <List>
          {generatedReports.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {t('reportsPage.noRecentReportsFound')}
            </Typography>
          ) : (
            generatedReports.map((report, index) => (
              <React.Fragment key={report.id}>
                <ListItem
                  secondaryAction={
                    <Button
                      variant="outlined"
                      size="small"
                      href={report.downloadUrl}
                      download={report.fileName}
                      startIcon={<FileDownloadIcon />}
                    >
                      {t('reportsPage.download')}
                    </Button>
                  }
                >
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {reportTypes.find(type => type.value === report.type)?.label} ({report.startDate} - {report.endDate})
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {t('reportsPage.generatedAt')}: {formatDateToDDMMYYYYHHMM(report.generatedAt)}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < generatedReports.length - 1 && <Divider component="li" sx={{ borderColor: theme.palette.divider }} />}
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ReportsContent;
