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
import { formatDateToDDMMYYYYHHMM, formatDateToISOString } from '../../../utils/dateUtils'; // Import date utility

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password_hash: '',
    company_name: '',
    plan: '',
    client_id: '',
    created_at: '', // Add created_at to form data
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { t } = useLanguage(); // Use translation hook

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminData('users');
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenForm = (user = null) => {
    console.log("handleOpenForm: User object received:", user);
    setEditingUser(user);
    setFormData(
      user
        ? {
            id: user.id || user.Id || '', // Prioritize user.id, fallback to user.Id
            name: user.name || '',
            email: user.email || '',
            password_hash: '', // Password is not pre-filled for security
            company_name: user.company_name || '',
            plan: user.plan || '',
            client_id: user.client_id || '',
            created_at: user.created_at || '', // Keep original created_at for display/update
          }
        : {
            id: '',
            name: '',
            email: '',
            password_hash: '',
            company_name: '',
            plan: '',
            client_id: '',
            created_at: formatDateToISOString(new Date()), // Set current date for new user
          }
    );
    console.log("handleOpenForm: formData after setting:", { ...user, id: user?.id || user?.Id || '' });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingUser(null);
    setFormData({
      id: '',
      name: '',
      email: '',
      password_hash: '',
      company_name: '',
      plan: '',
      client_id: '',
      created_at: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.email || !formData.client_id) {
        setSnackbarMessage(t('adminUsersPage.nameEmailClientIdRequired'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const payload = { ...formData };
      if (payload.password_hash === '') {
        delete payload.password_hash; // Don't send empty password hash if not changed
      }
      // Ensure created_at is in a format NocoDB expects, e.g., ISO string
      payload.created_at = formatDateToISOString(new Date(payload.created_at));


      if (editingUser) {
        if (!formData.id) {
            setSnackbarMessage(t('adminUsersPage.errorUpdatingUser'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        await updateAdminData('users', formData.id, payload);
        setSnackbarMessage(t('adminUsersPage.userUpdatedSuccess'));
      } else {
        if (!formData.password_hash) {
          setSnackbarMessage(t('adminUsersPage.passwordRequiredNewUser'));
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          return;
        }
        await createAdminData('users', payload);
        setSnackbarMessage(t('adminUsersPage.userAddedSuccess'));
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseForm();
      loadUsers();
    } catch (err) {
      setError(err.message);
      setSnackbarMessage(`${t('adminUsersPage.error')} ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleOpenConfirm = (user) => {
    // Ensure userToDelete has a valid ID, checking both 'id' and 'Id'
    setUserToDelete({ ...user, id: user.id || user.Id });
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    try {
      if (!userToDelete?.id) {
        setSnackbarMessage(t('adminUsersPage.errorDeletingUser'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      await deleteAdminData('users', userToDelete.id);
      setSnackbarMessage(t('adminUsersPage.userDeletedSuccess'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseConfirm();
      loadUsers();
    } catch (err) {
      setError(err.message);
      setSnackbarMessage(`${t('adminUsersPage.error')} ${err.message}`);
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
        <Typography variant="h6" sx={{ ml: 2 }}>{t('adminUsersPage.loadingUsers')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')} {t('adminUsersPage.loadingUsers')}: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('adminUsersPage.title')}
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          {t('adminUsersPage.addNewUser')}
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>{t('adminUsersPage.id')}</TableCell>
              <TableCell>{t('adminUsersPage.name')}</TableCell>
              <TableCell>{t('adminUsersPage.email')}</TableCell>
              <TableCell>{t('adminUsersPage.company')}</TableCell>
              <TableCell>{t('adminUsersPage.plan')}</TableCell>
              <TableCell>{t('adminUsersPage.clientId')}</TableCell>
              <TableCell>{t('adminUsersPage.createdAt')}</TableCell>
              <TableCell align="center">{t('adminUsersPage.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t('adminUsersPage.noUsersFound')}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.company_name}</TableCell>
                  <TableCell>{user.plan}</TableCell>
                  <TableCell>{user.client_id}</TableCell>
                  <TableCell>{formatDateToDDMMYYYYHHMM(user.created_at)}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpenForm(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleOpenConfirm(user)}>
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
        <DialogTitle>{editingUser ? t('adminUsersPage.editUser') : t('adminUsersPage.addNewUser')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label={t('adminUsersPage.name')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="email"
            label={t('adminUsersPage.email')}
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="password_hash"
            label={t('adminUsersPage.password')}
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password_hash}
            onChange={handleChange}
            helperText={editingUser ? t('adminUsersPage.passwordHelper') : t('adminUsersPage.passwordRequiredNewUser')}
            required={!editingUser}
          />
          <TextField
            margin="dense"
            name="company_name"
            label={t('adminUsersPage.company')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.company_name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="plan"
            label={t('adminUsersPage.plan')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.plan}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="client_id"
            label={t('adminUsersPage.clientId')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.client_id}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>{t('adminUsersPage.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? t('adminUsersPage.saveChanges') : t('adminUsersPage.addUser')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>{t('adminUsersPage.confirmDeletion')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('adminUsersPage.deleteUserConfirm', { name: userToDelete?.name })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>{t('adminUsersPage.cancel')}</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            {t('adminUsersPage.delete')}
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

export default UsersPage;
