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
import { fetchAdminData, createAdminData, updateAdminData, deleteAdminData } from '../../../api/adminApi';
import { useLanguage } from '../../../contexts/LanguageContext'; // Import useLanguage
import { parseDDMMYYYYHHMM, formatDateToDDMMYYYYHHMM, formatDateToYYYYMMDDTHHMM, formatDateToISOString } from '../../../utils/dateUtils'; // Import date utilities

function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    client_id: '',
    session_id: '',
    timestamp: '',
    channel: '',
    user_message: '',
    ai_response: '',
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { t } = useLanguage(); // Use translation hook

  const loadMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminData('messages');
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleOpenForm = (message = null) => {
    setEditingMessage(message);
    setFormData(
      message
        ? {
            id: message.id || message.Id || '',
            client_id: message.client_id || '',
            session_id: message.session_id || '',
            timestamp: formatDateToYYYYMMDDTHHMM(parseDDMMYYYYHHMM(message.timestamp)),
            channel: message.channel || '',
            user_message: message.user_message || '',
            ai_response: message.ai_response || '',
          }
        : {
            id: '',
            client_id: '',
            session_id: '',
            timestamp: formatDateToYYYYMMDDTHHMM(new Date()),
            channel: '',
            user_message: '',
            ai_response: '',
          }
    );
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingMessage(null);
    setFormData({
      id: '',
      client_id: '',
      session_id: '',
      timestamp: '',
      channel: '',
      user_message: '',
      ai_response: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.client_id || !formData.session_id || !formData.timestamp || !formData.user_message) {
        setSnackbarMessage(t('adminMessagesPage.clientIdSessionIdTimestampUserMessageRequired'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const payload = {
        ...formData,
        timestamp: formatDateToISOString(new Date(formData.timestamp)), // Convert to ISO for NocoDB
      };

      if (editingMessage) {
        if (!formData.id) {
            setSnackbarMessage(t('adminMessagesPage.errorUpdatingMessage'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        await updateAdminData('messages', formData.id, payload);
        setSnackbarMessage(t('adminMessagesPage.messageUpdatedSuccess'));
      } else {
        await createAdminData('messages', payload);
        setSnackbarMessage(t('adminMessagesPage.messageAddedSuccess'));
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseForm();
      loadMessages();
    } catch (err) {
      setError(err.message);
      setSnackbarMessage(`${t('adminMessagesPage.error')} ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleOpenConfirm = (message) => {
    setMessageToDelete({ ...message, id: message.id || message.Id });
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setMessageToDelete(null);
  };

  const handleDelete = async () => {
    try {
      if (!messageToDelete?.id) {
        setSnackbarMessage(t('adminMessagesPage.errorDeletingMessage'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      await deleteAdminData('messages', messageToDelete.id);
      setSnackbarMessage(t('adminMessagesPage.messageDeletedSuccess'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseConfirm();
      loadMessages();
    } catch (err) {
      setError(err.message);
      setSnackbarMessage(`${t('adminMessagesPage.error')} ${err.message}`);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t('adminMessagesPage.loadingMessages')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')} {t('adminMessagesPage.loadingMessages')}: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('adminMessagesPage.title')}
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          {t('adminMessagesPage.addNewMessage')}
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="messages table">
          <TableHead>
            <TableRow>
              <TableCell>{t('adminMessagesPage.id')}</TableCell>
              <TableCell>{t('adminMessagesPage.clientId')}</TableCell>
              <TableCell>{t('adminMessagesPage.sessionId')}</TableCell>
              <TableCell>{t('adminMessagesPage.timestamp')}</TableCell>
              <TableCell>{t('adminMessagesPage.channel')}</TableCell>
              <TableCell>{t('adminMessagesPage.userMessage')}</TableCell>
              <TableCell>{t('adminMessagesPage.aiResponse')}</TableCell>
              <TableCell align="center">{t('adminMessagesPage.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t('adminMessagesPage.noMessagesFound')}
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow key={message.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{message.id}</TableCell>
                  <TableCell>{message.client_id}</TableCell>
                  <TableCell>{message.session_id}</TableCell>
                  <TableCell>{formatDateToDDMMYYYYHHMM(message.timestamp)}</TableCell>
                  <TableCell>{message.channel}</TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {message.user_message}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {message.ai_response}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpenForm(message)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleOpenConfirm(message)}>
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
        <DialogTitle>{editingMessage ? t('adminMessagesPage.editMessage') : t('adminMessagesPage.addNewMessage')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="client_id"
            label={t('adminMessagesPage.clientId')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.client_id}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="session_id"
            label={t('adminMessagesPage.sessionId')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.session_id}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="timestamp"
            label={t('adminMessagesPage.timestamp')}
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={formData.timestamp}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            margin="dense"
            name="channel"
            label={t('adminMessagesPage.channel')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.channel}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="user_message"
            label={t('adminMessagesPage.userMessage')}
            type="text"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={formData.user_message}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="ai_response"
            label={t('adminMessagesPage.aiResponse')}
            type="text"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={formData.ai_response}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>{t('adminMessagesPage.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingMessage ? t('adminMessagesPage.saveChanges') : t('adminMessagesPage.addMessage')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>{t('adminMessagesPage.confirmDeletion')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('adminMessagesPage.deleteMessageConfirm', { id: messageToDelete?.id })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>{t('adminMessagesPage.cancel')}</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            {t('adminMessagesPage.delete')}
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

export default MessagesPage;
