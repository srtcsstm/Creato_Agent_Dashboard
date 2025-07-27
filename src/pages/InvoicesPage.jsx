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
  Button,
  Chip,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useAuth } from '../contexts/AuthContext';
import { fetchNocoDBData } from '../api/nocodb';
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage
import { formatDateToDDMMYYYYHHMM } from '../utils/dateUtils'; // Import date utility

function InvoicesPage() {
  const { clientId } = useAuth();
  const { t } = useLanguage(); // Use translation hook
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]); // Assuming payments table exists and is relevant
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFinancialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const invoicesData = await fetchNocoDBData('invoices', clientId); // Use 'invoices' alias
        // Assuming 'payments' table is also client-specific and has a client_id
        // If not, you might need to adjust this or remove payments data from here.
        // const paymentsData = await fetchNocoDBData('payments', clientId);
        setInvoices(invoicesData);
        // setPayments(paymentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadFinancialData();
    }
  }, [clientId]);

  const getInvoiceStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Overdue':
        return 'error';
      default:
        return 'info';
    }
  };

  const handleDownloadInvoice = (invoiceUrl) => {
    if (invoiceUrl) {
      window.open(invoiceUrl, '_blank');
    } else {
      alert(t('invoicesPage.noInvoiceUrl'));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t('invoicesPage.loadingFinancialData')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')} {t('invoicesPage.loadingFinancialData')}: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('invoicesPage.title')}
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        {t('invoicesPage.invoices')}
      </Typography>
      <TableContainer component={Paper} elevation={2} sx={{ mb: 4 }}>
        <Table sx={{ minWidth: 650 }} aria-label="invoices table">
          <TableHead>
            <TableRow>
              <TableCell>{t('invoicesPage.invoiceId')}</TableCell>
              <TableCell>{t('proposalsPage.clientId')}</TableCell>
              <TableCell>{t('invoicesPage.invoiceNumber')}</TableCell>
              <TableCell align="right">{t('proposalsPage.amount')}</TableCell>
              <TableCell>{t('proposalsPage.status')}</TableCell>
              <TableCell>{t('invoicesPage.issueDate')}</TableCell>
              <TableCell>{t('invoicesPage.invoiceUrl')}</TableCell>
              <TableCell>{t('proposalsPage.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t('invoicesPage.noInvoicesFound')}
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {invoice.id}
                  </TableCell>
                  <TableCell>{invoice.client_id}</TableCell>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell align="right">${parseFloat(invoice.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={invoice.status} color={getInvoiceStatusColor(invoice.status)} size="small" />
                  </TableCell>
                  <TableCell>{formatDateToDDMMYYYYHHMM(invoice.issued_at)}</TableCell>
                  <TableCell>
                    {invoice.invoice_url ? (
                      <a href={invoice.invoice_url} target="_blank" rel="noopener noreferrer">{t('common.view')}</a>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<FileDownloadIcon />}
                      onClick={() => handleDownloadInvoice(invoice.invoice_url)}
                      disabled={!invoice.invoice_url}
                      variant="outlined"
                    >
                      {t('invoicesPage.download')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payments section removed for now as 'payments' table ID was not provided */}
      {/* <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Payment History
      </Typography>
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="payments table">
          <TableHead>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>Invoice ID</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Method</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No payment records found.
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
                  <TableCell align="right">${parseFloat(payment.amount).toFixed(2)}</TableCell>
                  <TableCell>{formatDateToDDMMYYYYHHMM(payment.payment_date)}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer> */}
    </Box>
  );
}

export default InvoicesPage;
