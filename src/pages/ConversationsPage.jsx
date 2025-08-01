import React, { useState, useEffect, useMemo } from 'react';
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
  TextField,
  MenuItem,
  Button,
  Modal,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { fetchNocoDBData } from '../api/nocodb';
import { useLanguage } from '../contexts/LanguageContext';
import { parseDDMMYYYYHHMM, formatDateToDDMMYYYYHHMM, formatDateToYYYYMMDD } from '../utils/dateUtils';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxWidth: '90%',
  maxHeight: '90%',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  // border: '2px solid #000', // This will be overridden by theme.palette.divider
  boxShadow: 24,
  p: 4,
  borderRadius: 4, // Further reduced border radius for the modal
};

function ConversationsPage() {
  const { clientId } = useAuth();
  const { t } = useLanguage();
  const [allMessages, setAllMessages] = useState([]); // Store all raw messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterChannel, setFilterChannel] = useState(t('common.all'));
  const [selectedSessionMessages, setSelectedSessionMessages] = useState(null); // Stores messages for the selected session
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();

  const channels = [t('common.all'), 'Web', 'WhatsApp', 'Instagram', 'Telegram'];

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all messages for the client, then filter in-memory
        // NocoDB API's `where` clause for `created_date` is handled in fetchNocoDBData
        const data = await fetchNocoDBData('messages', clientId);
        setAllMessages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadMessages();
    }
  }, [clientId]);

  // Group and filter conversations
  const groupedConversations = useMemo(() => {
    const filtered = allMessages.filter((msg) => {
      // Use 'created_date' for filtering if available, fallback to 'timestamp'
      const dateField = msg.created_date || msg.timestamp;
      const msgDate = parseDDMMYYYYHHMM(dateField);
      const matchesDate = filterDate
        ? msgDate && formatDateToYYYYMMDD(msgDate) === filterDate
        : true;
      const matchesChannel =
        filterChannel === t('common.all') ? true : msg.channel === filterChannel;
      return matchesDate && matchesChannel;
    });

    const groups = {};
    filtered.forEach((msg) => {
      if (!groups[msg.session_id]) {
        groups[msg.session_id] = {
          sessionId: msg.session_id,
          channel: msg.channel, // Assuming channel is consistent per session
          messages: [],
          latestTimestamp: null,
        };
      }
      groups[msg.session_id].messages.push(msg);
      const currentMsgTimestamp = parseDDMMYYYYHHMM(msg.created_date || msg.timestamp);
      if (currentMsgTimestamp && (!groups[msg.session_id].latestTimestamp || currentMsgTimestamp > groups[msg.session_id].latestTimestamp)) {
        groups[msg.session_id].latestTimestamp = currentMsgTimestamp;
      }
    });

    // Convert to array and sort by latest message timestamp
    return Object.values(groups).sort((a, b) => {
      if (!a.latestTimestamp) return 1;
      if (!b.latestTimestamp) return -1;
      return b.latestTimestamp.getTime() - a.latestTimestamp.getTime();
    });
  }, [allMessages, filterDate, filterChannel, t]);

  const handleViewDetails = (session) => {
    // Sort messages within the session by timestamp for display
    const sortedMessages = [...session.messages].sort((a, b) => {
      const dateA = parseDDMMYYYYHHMM(a.created_date || a.timestamp);
      const dateB = parseDDMMYYYYHHMM(b.created_date || b.timestamp);
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateA.getTime() - dateB.getTime();
    });
    setSelectedSessionMessages(sortedMessages);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSessionMessages(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t('conversationsPage.loadingConversations')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')} {t('conversationsPage.loadingConversations')}: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('conversationsPage.title')}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label={t('conversationsPage.filterByDate')}
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />
        <TextField
          select
          label={t('conversationsPage.filterByChannel')}
          value={filterChannel}
          onChange={(e) => setFilterChannel(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {channels.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="outlined" onClick={() => { setFilterDate(''); setFilterChannel(t('common.all')); }}>
          {t('conversationsPage.clearFilters')}
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="grouped conversations table">
          <TableHead>
            <TableRow>
              <TableCell>{t('conversationsPage.sessionId')}</TableCell>
              <TableCell>{t('conversationsPage.channel')}</TableCell>
              <TableCell>{t('conversationsPage.messageCount')}</TableCell>
              <TableCell>{t('conversationsPage.latestMessageTime')}</TableCell>
              <TableCell>{t('conversationsPage.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedConversations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {t('conversationsPage.noConversationsFound')}
                </TableCell>
              </TableRow>
            ) : (
              groupedConversations.map((session) => (
                <TableRow
                  key={session.sessionId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {session.sessionId}
                  </TableCell>
                  <TableCell>{session.channel}</TableCell>
                  <TableCell>{session.messages.length}</TableCell>
                  <TableCell>
                    {session.latestTimestamp ? formatDateToDDMMYYYYHHMM(session.latestTimestamp) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleViewDetails(session)}>
                      {t('common.view')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="conversation-details-title"
        aria-describedby="conversation-details-description"
      >
        <Box sx={{ ...style, border: `1px solid ${theme.palette.divider}` }}>
          <Typography id="conversation-details-title" variant="h6" component="h2" gutterBottom sx={{ color: 'text.primary' }}>
            {t('conversationsPage.conversationDetails')} (Session ID: {selectedSessionMessages && selectedSessionMessages[0]?.session_id})
          </Typography>
          <List id="conversation-details-description" sx={{ pt: 0 }}>
            {selectedSessionMessages && selectedSessionMessages.map((msg, index) => (
              <React.Fragment key={msg.id}>
                <ListItem
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start', // Default to left-aligned
                    width: '100%',
                    py: 1,
                    px: 0,
                  }}
                >
                  {/* Timestamp and Channel */}
                  <Typography
                    sx={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      mb: 1,
                      color: theme.palette.text.secondary,
                      fontSize: '0.75rem',
                    }}
                  >
                    {formatDateToDDMMYYYYHHMM(msg.created_date || msg.timestamp)} - {msg.channel}
                  </Typography>

                  {/* User Message Bubble */}
                  {msg.user_message && (
                    <Box
                      sx={{
                        alignSelf: 'flex-end', // Right-align user message
                        backgroundColor: theme.palette.primary.dark,
                        color: theme.palette.getContrastText(theme.palette.primary.dark),
                        borderRadius: '6px', // Adjusted from 10px
                        borderBottomRightRadius: '2px', // Adjusted from 0
                        p: 1.5,
                        maxWidth: '80%',
                        mb: 1,
                        wordBreak: 'break-word',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {t('conversationsPage.userMessage')}:
                      </Typography>
                      <Typography variant="body2">
                        {msg.user_message}
                      </Typography>
                    </Box>
                  )}

                  {/* AI Response Bubble */}
                  {msg.ai_response && (
                    <Box
                      sx={{
                        alignSelf: 'flex-start', // Left-align AI response
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        borderRadius: '6px', // Adjusted from 10px
                        borderBottomLeftRadius: '2px', // Adjusted from 0
                        p: 1.5,
                        maxWidth: '80%',
                        wordBreak: 'break-word',
                        border: `1px solid ${theme.palette.divider}`, // Add border to AI bubble
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {t('conversationsPage.aiResponse')}:
                      </Typography>
                      <Typography variant="body2">
                        {msg.ai_response}
                      </Typography>
                    </Box>
                  )}
                </ListItem>
                {index < selectedSessionMessages.length - 1 && <Divider component="li" sx={{ borderColor: theme.palette.divider, my: 1 }} />}
              </React.Fragment>
            ))}
          </List>
          <Button onClick={handleCloseModal} sx={{ mt: 3 }} variant="contained">{t('conversationsPage.close')}</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default ConversationsPage;
