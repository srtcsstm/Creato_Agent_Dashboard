import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CircularProgress,
  Alert,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ButtonBase, // Import ButtonBase for clickable cards
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Import InfoOutlinedIcon
import { useAuth } from '../../contexts/AuthContext';
import { fetchNocoDBData } from '../../api/nocodb';
import { useLanguage } from '../../contexts/LanguageContext';
import { parseDDMMYYYYHHMM, formatDateToDDMMYYYYHHMM, formatDateToYYYYMMDD, getStartDateForDaysAgo } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Icons
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'; // Total Messages
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback'; // Total Calls
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Leads Captured
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Outstanding Amount
import DescriptionIcon from '@mui/icons-material/Description'; // Total Offers
import ChatIcon from '@mui/icons-material/Chat';
import CallIcon from '@mui/icons-material/Call';

function OverviewContent({ selectedDays }) { // Receive selectedDays prop
  const { clientId } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate(); // Initialize navigate hook
  const [metrics, setMetrics] = useState({
    totalMessages: 0,
    totalCalls: 0,
    leadsCaptured: 0,
    outstandingPaymentAmount: 0,
    totalOffers: 0,
  });
  const [messageSessionsData, setMessageSessionsData] = useState([]);
  const [callSessionsData, setCallSessionsData] = useState([]);
  const [recentInteractions, setRecentInteractions] = useState([]);
  const [recentProposals, setRecentProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);

      const endDate = formatDateToYYYYMMDD(new Date());
      const startDate = getStartDateForDaysAgo(selectedDays);

      console.log(`[OverviewContent] Current Client ID: ${clientId}`);
      console.log(`[OverviewContent] Fetching data for client: ${clientId}, from ${startDate} to ${endDate} (selectedDays: ${selectedDays})`);

      try {
        // Pass selectedDays to fetchNocoDBData for conditional filtering logic
        const messages = await fetchNocoDBData('messages', clientId, { startDate, endDate, selectedDays });
        const calls = await fetchNocoDBData('calls', clientId, { startDate, endDate, selectedDays });
        const leads = await fetchNocoDBData('leads', clientId, { startDate, endDate, selectedDays });
        const offers = await fetchNocoDBData('offers', clientId, { startDate, endDate, selectedDays });
        const invoices = await fetchNocoDBData('invoices', clientId, { startDate, endDate, selectedDays });

        console.log("Overview - Fetched Messages (raw):", messages);
        console.log("Overview - Fetched Calls (raw):", calls);
        console.log("Overview - Fetched Leads (raw):", leads);
        console.log("Overview - Fetched Offers (raw):", offers);
        console.log("Overview - Fetched Invoices (raw):", invoices);


        // KPI Calculations
        const totalMessages = messages.length;
        const totalCalls = calls.length;
        const leadsCaptured = leads.length;
        const totalOffers = offers.length;
        const outstandingPaymentAmount = invoices
          .filter(invoice => invoice.status !== 'Paid')
          .reduce((sum, invoice) => sum + (parseFloat(invoice.amount) || 0), 0);

        setMetrics({
          totalMessages,
          totalCalls,
          leadsCaptured,
          outstandingPaymentAmount: outstandingPaymentAmount.toFixed(2),
          totalOffers,
        });
        console.log("Overview - Metrics:", metrics);


        // Daily Message Count Chart Data
        const dailyMessageCounts = messages.reduce((acc, msg) => {
          // Use 'created_date' for filtering if available, fallback to 'timestamp'
          const dateField = msg.created_date || msg.timestamp;
          const date = formatDateToYYYYMMDD(parseDDMMYYYYHHMM(dateField));
          if (date) {
            acc[date] = (acc[date] || 0) + 1;
          }
          return acc;
        }, {});
        const sortedMessageDates = Object.keys(dailyMessageCounts).sort();
        setMessageSessionsData(sortedMessageDates.map(date => ({
          date,
          count: dailyMessageCounts[date],
        })));
        console.log("Overview - Message Sessions Data:", messageSessionsData);


        // Daily Call Count Chart Data
        const dailyCallCounts = calls.reduce((acc, call) => {
          // Use 'created_date' for filtering if available, fallback to 'date'
          const dateField = call.created_date || call.date;
          const date = formatDateToYYYYMMDD(parseDDMMYYYYHHMM(dateField));
          if (date) {
            acc[date] = (acc[date] || 0) + 1;
          }
          return acc;
        }, {});
        const sortedCallDates = Object.keys(dailyCallCounts).sort();
        setCallSessionsData(sortedCallDates.map(date => ({
          date,
          count: dailyCallCounts[date],
        })));
        console.log("Overview - Call Sessions Data:", callSessionsData);


        // Recent Interactions List (Messages & Calls)
        // Group messages by session_id and get the latest message for each session
        const groupedMessages = messages.reduce((acc, msg) => {
          const sessionId = msg.session_id;
          const msgTimestamp = parseDDMMYYYYHHMM(msg.created_date || msg.timestamp);
          if (!acc[sessionId] || (msgTimestamp && msgTimestamp > parseDDMMYYYYHHMM(acc[sessionId].timestamp))) {
            acc[sessionId] = {
              type: 'message',
              timestamp: msgTimestamp,
              channel: msg.channel,
              summary: msg.user_message,
              id: msg.id,
              sessionId: sessionId, // Add session ID for reference
            };
          }
          return acc;
        }, {});

        // Group calls by session_id (if calls have session_id, otherwise treat as individual)
        // For simplicity, treating calls as individual interactions for now if no session_id is present.
        // If calls can be part of a session, you'd need a session_id for calls too.
        const groupedCalls = calls.reduce((acc, call) => {
          const callTimestamp = parseDDMMYYYYHHMM(call.created_date || call.date);
          // Assuming calls might not have a session_id, or each call is a distinct interaction.
          // If calls can be part of a session, you'd need a session_id for calls too.
          acc[call.id] = { // Use call.id as key for individual calls
            type: 'call',
            timestamp: callTimestamp,
            channel: 'Call',
            summary: call.summary,
            id: call.id,
          };
          return acc;
        }, {});


        const combinedInteractions = [
          ...Object.values(groupedMessages),
          ...Object.values(groupedCalls),
        ].filter(item => item.timestamp !== null);

        combinedInteractions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setRecentInteractions(combinedInteractions.slice(0, 5));
        console.log("Overview - Recent Interactions:", recentInteractions);


        // Recent Proposals List
        const sortedProposals = offers
          .map(offer => ({ ...offer, sent_at_parsed: parseDDMMYYYYHHMM(offer.created_date || offer.sent_at) })) // Use created_date
          .filter(offer => offer.sent_at_parsed !== null)
          .sort((a, b) => b.sent_at_parsed.getTime() - a.sent_at_parsed.getTime());
        setRecentProposals(sortedProposals.slice(0, 5));
        console.log("Overview - Recent Proposals:", recentProposals);


      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadDashboardData();
    }
  }, [clientId, selectedDays, theme.palette.success.main, theme.palette.error.main, theme.palette.warning.main]);

  const handleCardClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t('common.loading')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')}: {error}</Alert>;
  }

  const NoDataDisplay = ({ message }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <InfoOutlinedIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
      <Typography variant="body1" color="text.secondary">{message}</Typography>
    </Box>
  );

  return (
    <Box>
      {/* Top Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ButtonBase
            onClick={() => handleCardClick('/conversations')}
            sx={{
              width: '100%',
              height: '100%',
              textAlign: 'left',
              borderRadius: theme.shape.borderRadius,
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: theme.palette.mode === 'dark' ? '0px 8px 24px rgba(0, 0, 0, 0.4)' : '0px 8px 24px rgba(0, 0, 0, 0.1)',
              },
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            }}
          >
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">{t('dashboard.totalMessages')}</Typography>
                <QuestionAnswerIcon sx={{ color: theme.palette.text.secondary }} />
              </Box>
              <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1.8rem' }}>
                {metrics.totalMessages}
              </Typography>
              <Typography variant="caption" sx={{ color: 'success.main' }}>
                +X% {t('dashboard.increase')}
              </Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ButtonBase
            onClick={() => handleCardClick('/calls')}
            sx={{
              width: '100%',
              height: '100%',
              textAlign: 'left',
              borderRadius: theme.shape.borderRadius,
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: theme.palette.mode === 'dark' ? '0px 8px 24px rgba(0, 0, 0, 0.4)' : '0px 8px 24px rgba(0, 0, 0, 0.1)',
              },
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            }}
          >
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">{t('dashboard.totalCalls')}</Typography>
                <PhoneCallbackIcon sx={{ color: theme.palette.text.secondary }} />
              </Box>
              <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1.8rem' }}>
                {metrics.totalCalls}
              </Typography>
              <Typography variant="caption" sx={{ color: 'error.main' }}>
                -X% {t('dashboard.decrease')}
              </Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ButtonBase
            onClick={() => handleCardClick('/leads')}
            sx={{
              width: '100%',
              height: '100%',
              textAlign: 'left',
              borderRadius: theme.shape.borderRadius,
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: theme.palette.mode === 'dark' ? '0px 8px 24px rgba(0, 0, 0, 0.4)' : '0px 8px 24px rgba(0, 0, 0, 0.1)',
              },
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            }}
          >
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">{t('dashboard.leadsCaptured')}</Typography>
                <EmojiEventsIcon sx={{ color: theme.palette.text.secondary }} />
              </Box>
              <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1.8rem' }}>
                {metrics.leadsCaptured}
              </Typography>
              <Typography variant="caption" sx={{ color: 'success.main' }}>
                +X% {t('dashboard.increase')}
              </Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ButtonBase
            onClick={() => handleCardClick('/invoices')}
            sx={{
              width: '100%',
              height: '100%',
              textAlign: 'left',
              borderRadius: theme.shape.borderRadius,
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: theme.palette.mode === 'dark' ? '0px 8px 24px rgba(0, 0, 0, 0.4)' : '0px 8px 24px rgba(0, 0, 0, 0.1)',
              },
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            }}
          >
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">{t('dashboard.outstandingPaymentAmount')}</Typography>
                <AttachMoneyIcon sx={{ color: theme.palette.text.secondary }} />
              </Box>
              <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1.8rem' }}>
                ${metrics.outstandingPaymentAmount}
              </Typography>
              <Typography variant="caption" sx={{ color: 'error.main' }}>
                -X% {t('dashboard.decrease')}
              </Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ButtonBase
            onClick={() => handleCardClick('/proposals')}
            sx={{
              width: '100%',
              height: '100%',
              textAlign: 'left',
              borderRadius: theme.shape.borderRadius,
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: theme.palette.mode === 'dark' ? '0px 8px 24px rgba(0, 0, 0, 0.4)' : '0px 8px 24px rgba(0, 0, 0, 0.1)',
              },
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            }}
          >
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">{t('dashboard.totalOffers')}</Typography>
                <DescriptionIcon sx={{ color: theme.palette.text.secondary }} />
              </Box>
              <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1.8rem' }}>
                {metrics.totalOffers}
              </Typography>
              <Typography variant="caption" sx={{ color: 'success.main' }}>
                +X% {t('dashboard.increase')}
              </Typography>
            </Card>
          </ButtonBase>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Daily Message Count Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                {t('dashboard.dailyMessageCount')}
              </Typography>
              {/* Manual Legend for Bar Chart */}
              {messageSessionsData.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, backgroundColor: theme.palette.primary.main, borderRadius: '2px' }} />
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {t('dashboard.messages')}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ height: 300, width: '100%' }}>
              {messageSessionsData.length > 0 ? (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: messageSessionsData.map(d => d.date),
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  yAxis={[{
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  series={[
                    { data: messageSessionsData.map(d => d.count), color: theme.palette.primary.main },
                  ]}
                  height={300}
                  margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                  sx={{
                    '.MuiChartsAxis-line': { stroke: theme.palette.divider },
                    '.MuiChartsAxis-tick': { stroke: theme.palette.divider },
                    '.MuiChartsAxis-tickLabel': { fill: theme.palette.text.secondary },
                    '.MuiChartsAxis-label': { fill: theme.palette.text.primary },
                    '.MuiChartsLegend-root': { fill: theme.palette.text.primary },
                    '.MuiChartsLegend-mark': { fill: theme.palette.text.primary },
                  }}
                />
              ) : (
                <NoDataDisplay message={t('dashboard.noMessageData')} />
              )}
            </Box>
          </Card>
        </Grid>

        {/* Daily Call Count Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                {t('dashboard.dailyCallCount')}
              </Typography>
              {/* Manual Legend for Bar Chart */}
              {callSessionsData.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, backgroundColor: theme.palette.info.main, borderRadius: '2px' }} />
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {t('dashboard.calls')}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ height: 300, width: '100%' }}>
              {callSessionsData.length > 0 ? (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: callSessionsData.map(d => d.date),
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  yAxis={[{
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  series={[
                    { data: callSessionsData.map(d => d.count), color: theme.palette.info.main },
                  ]}
                  height={300}
                  margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                  sx={{
                    '.MuiChartsAxis-line': { stroke: theme.palette.divider },
                    '.MuiChartsAxis-tick': { stroke: theme.palette.divider },
                    '.MuiChartsAxis-tickLabel': { fill: theme.palette.text.secondary },
                    '.MuiChartsAxis-label': { fill: theme.palette.text.primary },
                    '.MuiChartsLegend-root': { fill: theme.palette.text.primary },
                    '.MuiChartsLegend-mark': { fill: theme.palette.text.primary },
                  }}
                />
              ) : (
                <NoDataDisplay message={t('dashboard.noCallData')} />
              )}
            </Box>
          </Card>
        </Grid>

        {/* Recent Interactions List */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
              {t('dashboard.recentInteractions')}
            </Typography>
            <List>
              {recentInteractions.length === 0 ? (
                <NoDataDisplay message={t('dashboard.noRecentInteractions')} />
              ) : (
                recentInteractions.map((interaction) => (
                  <ListItem key={interaction.id} disablePadding>
                    <ListItemIcon>
                      {interaction.type === 'message' ? <ChatIcon /> : <CallIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ color: 'text.primary' }}>
                          {interaction.type === 'message' ? t('dashboard.message') : t('dashboard.call')} ({interaction.channel})
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {interaction.summary} - {formatDateToDDMMYYYYHHMM(interaction.timestamp)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Card>
        </Grid>

        {/* Recent Proposals List */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
              {t('dashboard.recentProposals')}
            </Typography>
            <List>
              {recentProposals.length === 0 ? (
                <NoDataDisplay message={t('dashboard.noRecentProposals')} />
              ) : (
                recentProposals.map((proposal) => (
                  <ListItem key={proposal.id} disablePadding>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ color: 'text.primary' }}>
                          {proposal.title} - ${parseFloat(proposal.amount).toFixed(2)}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {t('proposalsPage.status')}: {proposal.status} - {formatDateToDDMMYYYYHHMM(proposal.sent_at)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OverviewContent;
