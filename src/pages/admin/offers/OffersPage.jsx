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
import { fetchAdminData, createAdminData, updateAdminData, deleteAdminData } from '../../../api/adminApi';
import { useLanguage } from '../../../contexts/LanguageContext'; // Import useLanguage
import { parseDDMMYYYYHHMM, formatDateToDDMMYYYYHHMM, formatDateToYYYYMMDD, formatDateToISOString } from '../../../utils/dateUtils'; // Import date utilities

function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [users, setUsers] = useState([]); // To fetch clients for dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    client_id: '',
    title: '',
    amount: '',
    status: 'Pending', // Default status
    sent_at: '',
    offer_url: '', // New field
    payment_link: '', // New field
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { t } = useLanguage(); // Use translation hook

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const offersData = await fetchAdminData('offers');
      const usersData = await fetchAdminData('users');
      setOffers(offersData);
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

  const handleOpenForm = (offer = null) => {
    setEditingOffer(offer);
    setFormData(
      offer
        ? {
            id: offer.id || offer.Id || '', // Prioritize offer.id, fallback to offer.Id
            client_id: offer.client_id || '',
            title: offer.title || '',
            amount: offer.amount || '',
            status: offer.status || 'Pending',
            sent_at: formatDateToYYYYMMDD(parseDDMMYYYYHHMM(offer.sent_at)),
            offer_url: offer.offer_url || '',
            payment_link: offer.payment_link || '',
          }
        : {
            id: '',
            client_id: '',
            title: '',
            amount: '',
            status: 'Pending',
            sent_at: formatDateToYYYYMMDD(new Date()),
            offer_url: '',
            payment_link: '',
          }
    );
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingOffer(null);
    setFormData({
      id: '',
      client_id: '',
      title: '',
      amount: '',
      status: 'Pending',
      sent_at: '',
      offer_url: '',
      payment_link: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.client_id || !formData.title || !formData.amount || !formData.sent_at) {
        setSnackbarMessage(t('adminOffersPage.clientTitleAmountSentDateRequired'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        sent_at: formatDateToISOString(new Date(formData.sent_at)), // Convert to ISO for NocoDB
      };

      if (editingOffer) {
        if (!formData.id) {
            setSnackbarMessage(t('adminOffersPage.errorUpdatingOffer'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        await updateAdminData('offers', formData.id, payload);
        setSnackbarMessage(t('adminOffersPage.offerUpdatedSuccess'));
      } else {
        await createAdminData('offers', payload);
        setSnackbarMessage(t('adminOffersPage.offerAddedSuccess'));
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseForm();
      loadData();
    } catch (err) {
      setError(err.message);
      setSnackbarMessage(`${t('adminOffersPage.error')} ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleOpenConfirm = (offer) => {
    // Ensure offerToDelete has a valid ID, checking both 'id' and 'Id'
    setOfferToDelete({ ...offer, id: offer.id || offer.Id });
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setOfferToDelete(null);
  };

  const handleDelete = async () => {
    try {
      if (!offerToDelete?.id) {
        setSnackbarMessage(t('adminOffersPage.errorDeletingOffer'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      await deleteAdminData('offers', offerToDelete.id);
      setSnackbarMessage(t('adminOffersPage.offerDeletedSuccess'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseConfirm();
      loadData();
    } catch (err) {
      setError(err.message);
      setSnackbarMessage(`${t('adminOffersPage.error')} ${err.message}`);
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
      case 'Accepted': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'info';
    }
  };

  const getClientName = (clientId) => {
    const client = users.find(user => user.client_id === clientId);
    return client ? client.company_name || client.name : clientId;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t('adminOffersPage.loadingOffers')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')} {t('adminOffersPage.loadingOffers')}: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('adminOffersPage.title')}
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          {t('adminOffersPage.addNewOffer')}
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="offers table">
          <TableHead>
            <TableRow>
              <TableCell>{t('adminOffersPage.id')}</TableCell>
              <TableCell>{t('adminOffersPage.client')}</TableCell>
              <TableCell>{t('adminOffersPage.offerTitle')}</TableCell>
              <TableCell align="right">{t('adminOffersPage.amount')}</TableCell>
              <TableCell>{t('adminOffersPage.status')}</TableCell>
              <TableCell>{t('adminOffersPage.sentAt')}</TableCell>
              <TableCell>{t('adminOffersPage.offerUrl')}</TableCell>
              <TableCell>{t('adminOffersPage.paymentLink')}</TableCell>
              <TableCell align="center">{t('adminOffersPage.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  {t('adminOffersPage.noOffersFound')}
                </TableCell>
              </TableRow>
            ) : (
              offers.map((offer) => (
                <TableRow key={offer.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{offer.id}</TableCell>
                  <TableCell>{getClientName(offer.client_id)}</TableCell>
                  <TableCell>{offer.title}</TableCell>
                  <TableCell align="right">${parseFloat(offer.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={offer.status} color={getStatusColor(offer.status)} size="small" />
                  </TableCell>
                  <TableCell>{formatDateToDDMMYYYYHHMM(offer.sent_at)}</TableCell>
                  <TableCell>
                    {offer.offer_url ? (
                      <Button size="small" href={offer.offer_url} target="_blank" rel="noopener noreferrer" variant="outlined">
                        {t('common.view')}
                      </Button>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {offer.payment_link ? (
                      <Button size="small" href={offer.payment_link} target="_blank" rel="noopener noreferrer" variant="outlined">
                        {t('proposalsPage.makePayment')}
                      </Button>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpenForm(offer)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleOpenConfirm(offer)}>
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
        <DialogTitle>{editingOffer ? t('adminOffersPage.editOffer') : t('adminOffersPage.addNewOffer')}</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            name="client_id"
            label={t('adminOffersPage.client')}
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
            name="title"
            label={t('adminOffersPage.offerTitle')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="amount"
            label={t('adminOffersPage.amount')}
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
            label={t('adminOffersPage.status')}
            fullWidth
            variant="outlined"
            value={formData.status}
            onChange={handleChange}
            required
          >
            {['Pending', 'Accepted', 'Rejected'].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            name="sent_at"
            label={t('adminOffersPage.sentDate')}
            type="date"
            fullWidth
            variant="outlined"
            value={formData.sent_at}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            margin="dense"
            name="offer_url"
            label={t('adminOffersPage.offerUrl')}
            type="url"
            fullWidth
            variant="outlined"
            value={formData.offer_url}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="payment_link"
            label={t('adminOffersPage.paymentLink')}
            type="url"
            fullWidth
            variant="outlined"
            value={formData.payment_link}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>{t('adminOffersPage.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingOffer ? t('adminOffersPage.saveChanges') : t('adminOffersPage.addOffer')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>{t('adminOffersPage.confirmDeletion')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('adminOffersPage.deleteOfferConfirm', { title: offerToDelete?.title, clientName: getClientName(offerToDelete?.client_id) })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>{t('adminOffersPage.cancel')}</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            {t('adminOffersPage.delete')}
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

export default OffersPage;
