import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import { fetchNocoDBData, updateNocoDBData } from '../api/nocodb'; // Import NocoDB API functions

function ProfileSettingsPage() {
  const { t } = useLanguage();
  const { clientId } = useAuth(); // Get clientId from AuthContext
  const [profile, setProfile] = useState({
    id: '', // NocoDB record ID
    name: '',
    email: '',
    company_name: '', // Matches NocoDB column name
    client_id: '', // Matches NocoDB column name
    created_date: '', // Add created_date
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user data based on client_id
        const data = await fetchNocoDBData('users', clientId);
        if (data.length > 0) {
          const user = data[0]; // Assuming client_id is unique and returns one user
          setProfile({
            id: user.id || user.Id, // NocoDB might return 'Id' or 'id'
            name: user.name || '',
            email: user.email || '',
            company_name: user.company_name || '',
            client_id: user.client_id || '',
            created_date: user.created_date || '', // Set created_date
          });
        } else {
          setError(t('profileSettingsPage.noProfileFound'));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadProfile();
    }
  }, [clientId, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!profile.id) {
        throw new Error(t('profileSettingsPage.errorUpdatingProfileNoId'));
      }

      const payload = {
        name: profile.name,
        company_name: profile.company_name,
        // email, client_id, and created_date are read-only, so no need to send them in update payload
      };

      await updateNocoDBData('users', profile.id, payload);
      setSnackbarMessage(t('profileSettingsPage.saveSuccess'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message);
      setSnackbarMessage(`${t('profileSettingsPage.errorSavingChanges')} ${err.message}`);
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
        <Typography variant="h6" sx={{ ml: 2 }}>{t('profileSettingsPage.loadingProfile')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')} {t('profileSettingsPage.loadingProfile')}: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('profileSettingsPage.title')}
      </Typography>

      <Paper elevation={2} sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          {t('profileSettingsPage.personalInformation')}
        </Typography>
        <TextField
          fullWidth
          label={t('profileSettingsPage.name')}
          name="name"
          value={profile.name}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label={t('profileSettingsPage.email')}
          name="email"
          value={profile.email}
          variant="outlined"
          margin="normal"
          type="email"
          InputProps={{ readOnly: true }} // Make email read-only
        />
        <TextField
          fullWidth
          label={t('profileSettingsPage.company')}
          name="company_name"
          value={profile.company_name}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label={t('profileSettingsPage.clientId')}
          name="client_id"
          value={profile.client_id}
          variant="outlined"
          margin="normal"
          InputProps={{ readOnly: true }} // Make client_id read-only
        />
        <TextField
          fullWidth
          label={t('adminUsersPage.createdAt')}
          name="created_date"
          value={formatDateToDDMMYYYYHHMM(profile.created_date)}
          variant="outlined"
          margin="normal"
          InputProps={{ readOnly: true }} // Make created_date read-only
        />
        <Button variant="contained" sx={{ mt: 3 }} onClick={handleSave} disabled={loading}>
          {t('profileSettingsPage.saveChanges')}
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

export default ProfileSettingsPage;
