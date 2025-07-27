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
  Modal,
  useTheme,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useAuth } from '../contexts/AuthContext';
import { fetchNocoDBData } from '../api/nocodb';
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage
import { formatDateToDDMMYYYYHHMM } from '../utils/dateUtils'; // Import date utility

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 12,
};

function CallsPage() {
  const { clientId } = useAuth();
  const { t } = useLanguage(); // Use translation hook
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedCallDetails, setSelectedCallDetails] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const loadCalls = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNocoDBData('calls', clientId); // Use 'calls' alias
        setCalls(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadCalls();
    }
  }, [clientId]);

  const handleListen = (audioUrl) => {
    if (audioUrl) {
      window.open(audioUrl, '_blank');
      console.log('Listening to:', audioUrl);
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
        <Typography variant="h6" sx={{ ml: 2 }}>{t('callsPage.loadingCallRecords')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')} {t('callsPage.loadingCallRecords')}: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('callsPage.title')}
      </Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="calls table">
          <TableHead>
            <TableRow>
              <TableCell>{t('callsPage.date')}</TableCell>
              <TableCell>{t('callsPage.durationMinutes')}</TableCell>
              <TableCell>{t('callsPage.summary')}</TableCell>
              <TableCell>{t('callsPage.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {t('callsPage.noCallRecordsFound')}
                </TableCell>
              </TableRow>
            ) : (
              calls.map((call) => (
                <TableRow
                  key={call.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {formatDateToDDMMYYYYHHMM(call.date)}
                  </TableCell>
                  <TableCell>{call.duration_minutes}</TableCell>
                  <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {call.summary}
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleViewDetails(call.details)} sx={{ mr: 1 }}>
                      {t('callsPage.details')}
                    </Button>
                    <Button
                      size="small"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => handleListen(call.audio_url)}
                      disabled={!call.audio_url}
                      variant="outlined"
                    >
                      {t('callsPage.listen')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openDetailsModal}
        onClose={handleCloseDetailsModal}
        aria-labelledby="call-details-title"
        aria-describedby="call-details-description"
      >
        <Box sx={{ ...style, border: `1px solid ${theme.palette.divider}` }}>
          <Typography id="call-details-title" variant="h6" component="h2" gutterBottom sx={{ color: 'text.primary' }}>
            {t('callsPage.callDetails')}
          </Typography>
          <Typography id="call-details-description" variant="body1" sx={{ mt: 2, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
            {selectedCallDetails}
          </Typography>
          <Button onClick={handleCloseDetailsModal} sx={{ mt: 3 }} variant="contained">{t('callsPage.close')}</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default CallsPage;
