import React from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function UnsupportedPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Alert severity="info" sx={{ mb: 3, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>
          {t('unsupportedPage.title')}
        </Typography>
        <Typography variant="body1">
          {t('unsupportedPage.message')}
        </Typography>
      </Alert>
      <Button variant="contained" onClick={() => navigate('/dashboard')}>
        {t('unsupportedPage.goBackToDashboard')}
      </Button>
    </Box>
  );
}

export default UnsupportedPage;
