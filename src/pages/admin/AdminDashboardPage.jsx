import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  useTheme,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { fetchAdminData } from '../../api/adminApi';
import { useLanguage } from '../../contexts/LanguageContext'; // Import useLanguage

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOffers: 0,
    outstandingInvoices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { t } = useLanguage(); // Use translation hook

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const users = await fetchAdminData('users');
        const offers = await fetchAdminData('offers');
        const invoices = await fetchAdminData('invoices');

        const outstandingInvoicesCount = invoices.filter(
          (invoice) => invoice.status !== 'Paid'
        ).length;

        setStats({
          totalUsers: users.length,
          totalOffers: offers.length,
          outstandingInvoices: outstandingInvoicesCount,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t('adminDashboardPage.loadingAdminDashboard')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('adminDashboardPage.errorLoadingAdminDashboard')} {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('adminDashboardPage.title')}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <GroupIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {stats.totalUsers}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('adminDashboardPage.totalUsers')}
            </Typography>
            <Button component={Link} to="/admin/users" variant="outlined" sx={{ mt: 2 }}>
              {t('adminDashboardPage.manageUsers')}
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <DescriptionIcon sx={{ fontSize: 60, color: theme.palette.info.main, mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {stats.totalOffers}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('adminDashboardPage.totalOffers')}
            </Typography>
            <Button component={Link} to="/admin/offers" variant="outlined" sx={{ mt: 2 }}>
              {t('adminDashboardPage.manageOffers')}
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <ReceiptIcon sx={{ fontSize: 60, color: theme.palette.warning.main, mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {stats.outstandingInvoices}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('adminDashboardPage.outstandingInvoices')}
            </Typography>
            <Button component={Link} to="/admin/invoices" variant="outlined" sx={{ mt: 2 }}>
              {t('adminDashboardPage.manageInvoices')}
            </Button>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        {t('adminDashboardPage.quickLinks')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            to="/admin/users"
            startIcon={<GroupIcon />}
            sx={{ py: 1.5 }}
          >
            {t('adminDashboardPage.goToUsersManagement')}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            to="/admin/offers"
            startIcon={<DescriptionIcon />}
            sx={{ py: 1.5 }}
          >
            {t('adminDashboardPage.goToOffersManagement')}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            to="/admin/invoices"
            startIcon={<ReceiptIcon />}
            sx={{ py: 1.5 }}
          >
            {t('adminDashboardPage.goToInvoicesManagement')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboardPage;
