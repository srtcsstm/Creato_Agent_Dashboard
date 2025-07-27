import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { fetchNocoDBData } from '../api/nocodb';
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage

function SettingsPage() {
  const { clientId } = useAuth();
  const { t } = useLanguage(); // Use translation hook
  const [settings, setSettings] = useState({
    tone: '',
    fallback_behavior: '',
    api_token: '',
    created_date: '', // Add created_date
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch from 'users' table in NocoDB, assuming it holds agent settings
        const data = await fetchNocoDBData('users', clientId); // 'users' table is not aliased, assuming it's directly accessible
        if (data.length > 0) {
          // Assuming the first user record for the client_id holds the settings
          setSettings({
            tone: data[0].tone || '',
            fallback_behavior: data[0].fallback_behavior || '',
            api_token: data[0].api_token || '********************', // Display masked token
            created_date: data[0].created_date || '', // Set created_date
          });
        } else {
          // Default settings if no record found for client_id
          setSettings({
            tone: 'Neutral',
            fallback_behavior: 'Human Handover',
            api_token: '********************',
            created_date: '',
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadSettings();
    }
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real application, you would send a PATCH/PUT request to update these settings
      // For this demo, we'll simulate a successful save.
      console.log('Simulating saving settings:', settings);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay
      setSnackbarMessage(t('settingsPage.settingsSavedSuccess'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message);
      setSnackbarMessage(`${t('settingsPage.errorSavingSettings')} ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t('settingsPage.loadingSettings')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('settingsPage.errorLoadingSettings')} {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('settingsPage.title')}
      </Typography>

      <Paper elevation={2} sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
          {t('settingsPage.apiToken')}
        </Typography>
        <TextField
          fullWidth
          label={t('settingsPage.apiToken')}
          value={settings.api_token}
          InputProps={{
            readOnly: true, // This token is for display, not editable by user
          }}
          variant="outlined"
          sx={{ mb: 3 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('settingsPage.apiTokenHelper')}
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 4, color: 'text.primary' }}>
          {t('settingsPage.agentPreferences')}
        </Typography>
        <TextField
          fullWidth
          label={t('settingsPage.agentTone')}
          name="tone"
          value={settings.tone}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          helperText={t('settingsPage.agentToneHelper')}
        />
        <TextField
          fullWidth
          label={t('settingsPage.fallbackBehavior')}
          name="fallback_behavior"
          value={settings.fallback_behavior}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          helperText={t('settingsPage.fallbackBehaviorHelper')}
        />

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {t('settingsPage.saveSettings')}
        </Button>
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

export default SettingsPage;
