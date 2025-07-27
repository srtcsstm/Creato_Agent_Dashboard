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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  IconButton,
  MenuItem,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { fetchAdminData, createAdminData, updateAdminData, deleteAdminData } from '../../../api/adminApi';
import { useLanguage } from '../../../contexts/LanguageContext'; // Import useLanguage
import { parseDDMMYYYYHHMM, formatDateToDDMMYYYYHHMM, formatDateToYYYYMMDD, formatDateToISOString } from '../../../utils/dateUtils'; // Import date utilities

function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [users, setUsers] = useState([]); // To fetch clients for dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    client_id: '',
    invoice_number: '',
    amount: '',
    status: 'Pending', // Default status
    invoice_url: '',
    issued_at: '',
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { t } = useLanguage(); // Use translation hook

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const invoicesData = await fetchAdminData('invoices');
      const usersData = await fetchAdminData('users');
      setInvoices(invoicesData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenForm = (invoice = null) => {
    setEditingInvoice(invoice);
    setFormData(
      invoice
        ? {
            id: invoice.id || invoice.Id || '', // Prioritize invoice.id, fallback to invoice.Id
            client_id: invoice.client_id || '',
            invoice_number: invoice.invoice_number || '',
            amount: invoice.amount || '',
            status: invoice.status || 'Pending',
            invoice_url: invoice.invoice_url || '',
            issued_at: formatDateToYYYYMMDD(parseDDMMYYYYHHMM(invoice.issued_at)),
          }
        : {
            id: '',
            client_id: '',
            invoice_number: '',
            amount: '',
            status: 'Pending',
            issued_at: formatDateToYYYYMMDD(new Date()),
          }
    );
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingInvoice(null);
    setFormData({
      id: '',
      client_id: '',
      invoice_number: '',
      amount: '',
      status: 'Pending',
      invoice_url: '',
      issued_at: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.client_id || !formData.invoice_number || !formData.amount || !formData.issued_at) {
        setSnackbarMessage(t('adminInvoicesPage.clientInvoiceAmountIssuedDateRequired'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        issued_at: formatDateToISOString(new Date(formData.issued_at)), // Convert to ISO for NocoDB
      };

      if (editingInvoice) {
        if (!formData.id) {
            setSnackbarMessage(t('adminInvoicesPage.errorUpdatingInvoice'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        await updateAdminData('invoices', formData.id, payload);
        setSnackbarMessage(t('adminInvoicesPage.invoiceUpdatedSuccess'));
      } else {
        await createAdminData('invoices', payload);
        setSnackbarMessage(t('adminInvoicesPage.invoiceAddedSuccess'));
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseForm();
      loadData();
    } catch (err) {
      setError(err.message);
      setSnackbarMessage(`${t('adminInvoicesPage.error')} ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleOpenConfirm = (invoice) => {
    // Ensure invoiceToDelete has a valid ID, checking both 'id' and 'Id'
    setInvoiceToDelete({ ...invoice, id: invoice.id || invoice.Id });
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setInvoiceToDelete(null);
  };

  const handleDelete = async () => {
    try {
      if (!invoiceToDelete?.id) {
        setSnackbarMessage(t('adminInvoicesPage.errorDeletingInvoice'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      await deleteAdminData('invoices', invoiceToDelete.id);
      setSnackbarMessage(t('adminInvoicesPage.invoiceDeletedSuccess'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseConfirm();
      loadData();
    } catch (err) {
      setError(err.message);
      setSnackbarMessage(`${t('adminInvoicesPage.error')} ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'error';
      default: return 'info';
    }
  };

  const getClientName = (clientId) => {
    const client = users.find(user => user.client_id === clientId);
    return client ? client.company_name || client.name : clientId;
  };

  const exportToCsv = () => {
    if (invoices.length === 0) {
      alert(t('adminInvoicesPage.noInvoicesToExport'));
      return;
    }

    const headers = [t('invoicesPage.invoiceId'), t('proposalsPage.clientId'), t('invoicesPage.invoiceNumber'), t('proposalsPage.amount'), t('proposalsPage.status'), t('invoicesPage.invoiceUrl'), t('invoicesPage.issueDate')];
    const rows = invoices.map(invoice => [
      invoice.id,
      invoice.client_id,
      invoice.invoice_number,
      invoice.amount,
      invoice.status,
      invoice.invoice_url,
      formatDateToDDMMYYYYHHMM(invoice.issued_at),
    ]);

    let csvContent = headers.map(header => `"${header}"`).join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(field => `"${field}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `invoices_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Your browser does not support downloading files directly. Please copy the data manually.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t('adminInvoicesPage.loadingInvoices')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')} {t('adminInvoicesPage.loadingInvoices')}: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('adminInvoicesPage.title')}
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={exportToCsv} disabled={invoices.length === 0}>
          {t('adminInvoicesPage.exportToCsv')}
        </Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          {t('adminInvoicesPage.addNewInvoice')}
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="invoices table">
          <TableHead>
            <TableRow>
              <TableCell>{t('adminInvoicesPage.id')}</TableCell>
              <TableCell>{t('adminInvoicesPage.client')}</TableCell>
              <TableCell>{t('adminInvoicesPage.invoiceNumber')}</TableCell>
              <TableCell align="right">{t('adminInvoicesPage.amount')}</TableCell>
              <TableCell>{t('adminInvoicesPage.status')}</TableCell>
              <TableCell>{t('adminInvoicesPage.issuedAt')}</TableCell>
              <TableCell>{t('adminInvoicesPage.invoiceUrl')}</TableCell>
              <TableCell align="center">{t('adminInvoicesPage.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t('adminInvoicesPage.noInvoicesFound')}
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{getClientName(invoice.client_id)}</TableCell>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell align="right">${parseFloat(invoice.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={invoice.status} color={getStatusColor(invoice.status)} size="small" />
                  </TableCell>
                  <TableCell>{formatDateToDDMMYYYYHHMM(invoice.issued_at)}</TableCell>
                  <TableCell>
                    {invoice.invoice_url ? (
                      <a href={invoice.invoice_url} target="_blank" rel="noopener noreferrer">{t('common.view')}</a>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpenForm(invoice)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleOpenConfirm(invoice)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>{editingInvoice ? t('adminInvoicesPage.editInvoice') : t('adminInvoicesPage.addNewInvoice')}</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            name="client_id"
            label={t('adminInvoicesPage.client')}
            fullWidth
            variant="outlined"
            value={formData.client_id}
            onChange={handleChange}
            required
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.client_id}>
                {user.company_name || user.name} ({user.client_id})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            name="invoice_number"
            label={t('adminInvoicesPage.invoiceNumber')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.invoice_number}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="amount"
            label={t('adminInvoicesPage.amount')}
            type="number"
            fullWidth
            variant="outlined"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <TextField
            select
            margin="dense"
            name="status"
            label={t('adminInvoicesPage.status')}
            fullWidth
            variant="outlined"
            value={formData.status}
            onChange={handleChange}
            required
          >
            {['Pending', 'Paid', 'Overdue'].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            name="invoice_url"
            label={t('adminInvoicesPage.invoiceUrl')}
            type="url"
            fullWidth
            variant="outlined"
            value={formData.invoice_url}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="issued_at"
            label={t('adminInvoicesPage.issuedAt')}
            type="date"
            fullWidth
            variant="outlined"
            value={formData.issued_at}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>{t('adminInvoicesPage.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingInvoice ? t('adminInvoicesPage.saveChanges') : t('adminInvoicesPage.addInvoice')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>{t('adminInvoicesPage.confirmDeletion')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('adminInvoicesPage.deleteInvoiceConfirm', { invoiceNumber: invoiceToDelete?.invoice_number })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>{t('adminInvoicesPage.cancel')}</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            {t('adminInvoicesPage.delete')}
          </Button>
        </DialogActions>
      </Dialog>

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

export default InvoicesPage;
