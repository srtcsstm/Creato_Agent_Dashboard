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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { fetchAdminData, createAdminData, updateAdminData, deleteAdminData } from '../../../api/adminApi';
import { useLanguage } from '../../../contexts/LanguageContext'; // Import useLanguage
import { parseDDMMYYYYHHMM, formatDateToDDMMYYYYHHMM, formatDateToYYYYMMDD, formatDateToISOString } from '../../../utils/dateUtils'; // Import date utilities

function CallsPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingCall, setEditingCall] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    client_id: '',
    date: '',
    duration: '', // Original duration field
    duration_minutes: '', // New field
    summary: '',
    details: '', // New field
    audio_url: '',
    created_date: '', // Add created_date
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [callToDelete, setCallToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedCallDetails, setSelectedCallDetails] = useState('');
  const { t } = useLanguage(); // Use translation hook

  const loadCalls = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminData('calls');
      setCalls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalls();
  }, []);

  const handleOpenForm = (call = null) => {
    setEditingCall(call);
    setFormData(
      call
        ? {
            id: call.id || call.Id || '',
            client_id: call.client_id || '',
            date: formatDateToYYYYMMDD(parseDDMMYYYYHHMM(call.date)),
            duration: call.duration || '',
            duration_minutes: call.duration_minutes || '',
            summary: call.summary || '',
            details: call.details || '',
            audio_url: call.audio_url || '',
            created_date: formatDateToYYYYMMDD(parseDDMMYYYYHHMM(call.created_date || call.date)), // Use created_date or fallback
          }
        : {
            id: '',
            client_id: '',
            date: formatDateToYYYYMMDD(new Date()),
            duration: '',
            duration_minutes: '',
            summary: '',
            details: '',
            audio_url: '',
            created_date: formatDateToYYYYMMDD(new Date()),
          }
    );
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingCall(null);
    setFormData({
      id: '',
      client_id: '',
      date: '',
      duration: '',
      duration_minutes: '',
      summary: '',
      details: '',
      audio_url: '',
      created_date: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.client_id || !formData.date || !formData.duration_minutes || !formData.summary) {
        setSnackbarMessage(t('adminCallsPage.clientIdDateDurationSummaryRequired'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const payload = {
        ...formData,
        duration: parseInt(formData.duration_minutes, 10) * 60, // Convert minutes to seconds for original duration field
        duration_minutes: parseInt(formData.duration_minutes, 10),
        date: formatDateToISOString(new Date(formData.date)), // Convert to ISO for NocoDB
        created_date: formatDateToISOString(new Date(formData.created_date)), // Convert to ISO for NocoDB
      };

      if (editingCall) {
        if (!formData.id) {
            setSnackbarMessage(t('adminCallsPage.errorUpdatingCall'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        await updateAdminData('calls', formData.id, payload);
        setSnackbarMessage(t('adminCallsPage.callUpdatedSuccess'));
      } else {
        await createAdminData('calls', payload);
        setSnackbarMessage(t('adminCallsPage.callAddedSuccess'));
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseForm();
      loadCalls();
    } catch (err) {
      setError(err.message);
      setSnackbarMessage(`${t('adminCallsPage.error')} ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleOpenConfirm = (call) => {
    setCallToDelete({ ...call, id: call.id || call.Id });
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setCallToDelete(null);
  };

  const handleDelete = async () => {
    try {
      if (!callToDelete?.id) {
        setSnackbarMessage(t('adminCallsPage.errorDeletingCall'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      await deleteAdminData('calls', callToDelete.id);
      setSnackbarMessage(t('adminCallsPage.callDeletedSuccess'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseConfirm();
      loadCalls();
    } catch (err) {
      setError(err.message);
      setSnackbarMessage(`${t('adminCallsPage.error')} ${err.message}`);
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

  const handleListen = (audioUrl) => {
    if (audioUrl) {
      window.open(audioUrl, '_blank');
    } else {
      alert(t('callsPage.noAudioUrl'));
    }
  };

  const handleViewDetails = (details) => {
    setSelectedCallDetails(details);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedCallDetails('');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t('adminCallsPage.loadingCalls')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')} {t('adminCallsPage.loadingCalls')}: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('adminCallsPage.title')}
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          {t('adminCallsPage.addNewCall')}
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="calls table">
          <TableHead>
            <TableRow>
              <TableCell>{t('adminCallsPage.id')}</TableCell>
              <TableCell>{t('adminCallsPage.clientId')}</TableCell>
              <TableCell>{t('adminCallsPage.date')}</TableCell>
              <TableCell>{t('adminCallsPage.durationMinutes')}</TableCell>
              <TableCell>{t('adminCallsPage.summary')}</TableCell>
              <TableCell align="center">{t('adminCallsPage.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {t('adminCallsPage.noCallRecordsFound')}
                </TableCell>
              </TableRow>
            ) : (
              calls.map((call) => (
                <TableRow key={call.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{call.id}</TableCell>
                  <TableCell>{call.client_id}</TableCell>
                  <TableCell>{formatDateToDDMMYYYYHHMM(call.created_date || call.date)}</TableCell>
                  <TableCell>{call.duration_minutes}</TableCell>
                  <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {call.summary}
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" onClick={() => handleViewDetails(call.details)} sx={{ mr: 1 }}>
                      {t('callsPage.details')}
                    </Button>
                    <Button
                      size="small"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => handleListen(call.audio_url)}
                      disabled={!call.audio_url}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      {t('callsPage.listen')}
                    </Button>
                    <IconButton color="primary" onClick={() => handleOpenForm(call)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleOpenConfirm(call)}>
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
        <DialogTitle>{editingCall ? t('adminCallsPage.editCall') : t('adminCallsPage.addNewCall')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="client_id"
            label={t('adminCallsPage.clientId')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.client_id}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="date"
            label={t('adminCallsPage.date')}
            type="date"
            fullWidth
            variant="outlined"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            margin="dense"
            name="duration_minutes"
            label={t('adminCallsPage.durationMinutes')}
            type="number"
            fullWidth
            variant="outlined"
            value={formData.duration_minutes}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="summary"
            label={t('adminCallsPage.summary')}
            type="text"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={formData.summary}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="details"
            label={t('adminCallsPage.detailsLongSummary')}
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.details}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="audio_url"
            label={t('adminCallsPage.audioUrl')}
            type="url"
            fullWidth
            variant="outlined"
            value={formData.audio_url}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="created_date"
            label={t('adminUsersPage.createdAt')}
            type="date"
            fullWidth
            variant="outlined"
            value={formData.created_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>{t('adminCallsPage.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCall ? t('adminCallsPage.saveChanges') : t('adminCallsPage.addCall')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDetailsModal} onClose={handleCloseDetailsModal} maxWidth="md" fullWidth>
        <DialogTitle>{t('callsPage.callDetails')}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {selectedCallDetails}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsModal} sx={{ mt: 3 }} variant="contained">{t('callsPage.close')}</Button>
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

export default CallsPage;
