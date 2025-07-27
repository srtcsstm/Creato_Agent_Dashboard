import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { fetchNocoDBData } from '../api/nocodb';
import { useLanguage } from '../contexts/LanguageContext';
import { formatDateToDDMMYYYYHHMM } from '../utils/dateUtils';

function PaymentsPage() {
  const { clientId } = useAuth();
  const { t } = useLanguage();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNocoDBData('payments', clientId);
        setPayments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadPayments();
    }
  }, [clientId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t('paymentsPage.loadingPayments')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')} {t('paymentsPage.loadingPayments')}: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('paymentsPage.title')}
      </Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="payments table">
          <TableHead>
            <TableRow>
              <TableCell>{t('paymentsPage.paymentId')}</TableCell>
              <TableCell>{t('paymentsPage.invoiceId')}</TableCell>
              <TableCell>{t('paymentsPage.clientId')}</TableCell>
              <TableCell align="right">{t('paymentsPage.amount')}</TableCell>
              <TableCell>{t('paymentsPage.status')}</TableCell>
              <TableCell>{t('paymentsPage.paymentDate')}</TableCell>
              <TableCell>{t('paymentsPage.method')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {t('paymentsPage.noPaymentsFound')}
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow
                  key={payment.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {payment.id}
                  </TableCell>
                  <TableCell>{payment.invoice_id}</TableCell>
                  <TableCell>{payment.client_id}</TableCell>
                  <TableCell align="right">${parseFloat(payment.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={payment.status} color={getStatusColor(payment.status)} size="small" />
                  </TableCell>
                  <TableCell>{formatDateToDDMMYYYYHHMM(payment.payment_date)}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PaymentsPage;
