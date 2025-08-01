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
import ForumIcon from '@mui/icons-material/Forum'; // For Total Sessions

function OverviewContent({ selectedDays }) { // Receive selectedDays prop
  const { clientId } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate(); // Initialize navigate hook
  const [metrics, setMetrics] = useState({
    totalMessages: 0,
    totalCalls: 0,
    totalSessions: 0, // New metric
    leadsCaptured: 0,
    outstandingPaymentAmount: 0,
    totalOffers: 0,
  });
  const [dailySessionCountsData, setDailySessionCountsData] = useState([]); // New state for daily session counts
  const [dailyMessageCountsData, setDailyMessageCountsData] = useState([]); // Original daily message counts
  const [dailyCallCountsData, setDailyCallCountsData] = useState([]);
  const [callDurationData, setCallDurationData] = useState([]); // Moved from AnalyticsContent
  const [recentInteractions, setRecentInteractions] = useState([]); // Removed
  const [recentProposals, setRecentProposals] = useState([]); // Removed
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

        // Calculate Total Sessions
        const uniqueSessionIds = new Set(messages.map(msg => msg.session_id));
        const totalSessions = uniqueSessionIds.size;

        setMetrics({
          totalMessages,
          totalCalls,
          totalSessions, // Set new metric
          leadsCaptured,
          outstandingPaymentAmount: outstandingPaymentAmount.toFixed(2),
          totalOffers,
        });
        console.log("Overview - Metrics:", metrics);


        // Daily Session Count Chart Data (New Chart, replaces old Daily Message Count position)
        const dailySessionCounts = messages.reduce((acc, msg) => {
          const dateField = msg.created_date || msg.timestamp;
          const date = formatDateToYYYYMMDD(parseDDMMYYYYHHMM(dateField));
          if (date) {
            if (!acc[date]) {
              acc[date] = new Set();
            }
            acc[date].add(msg.session_id);
          }
          return acc;
        }, {});
        const processedDailySessionCounts = Object.keys(dailySessionCounts).sort().map(date => ({
          date,
          count: dailySessionCounts[date].size,
        }));
        setDailySessionCountsData(processedDailySessionCounts);
        console.log("Overview - Daily Session Counts Data (for chart):", processedDailySessionCounts);


        // Daily Message Count Chart Data (Original, now moved)
        const dailyMessageCounts = messages.reduce((acc, msg) => {
          const dateField = msg.created_date || msg.timestamp;
          const date = formatDateToYYYYMMDD(parseDDMMYYYYHHMM(dateField));
          if (date) {
            acc[date] = (acc[date] || 0) + 1;
          }
          return acc;
        }, {});
        const processedDailyMessageCounts = Object.keys(dailyMessageCounts).sort().map(date => ({
          date,
          count: dailyMessageCounts[date],
        }));
        setDailyMessageCountsData(processedDailyMessageCounts);
        console.log("Overview - Daily Message Counts Data (for chart):", processedDailyMessageCounts);


        // Daily Call Count Chart Data
        const dailyCallCounts = calls.reduce((acc, call) => {
          const dateField = call.created_date || call.date;
          const date = formatDateToYYYYMMDD(parseDDMMYYYYHHMM(dateField));
          if (date) {
            acc[date] = (acc[date] || 0) + 1;
          }
          return acc;
        }, {});
        const sortedCallDates = Object.keys(dailyCallCounts).sort();
        setDailyCallCountsData(sortedCallDates.map(date => ({
          date,
          count: dailyCallCounts[date],
        })));
        console.log("Overview - Daily Call Counts Data:", dailyCallCountsData);


        // Total Call Duration (Moved from AnalyticsContent)
        const dailyCallDurations = calls.reduce((acc, call) => {
          const dateField = call.created_date || call.date;
          const date = formatDateToYYYYMMDD(parseDDMMYYYYHHMM(dateField));
          if (date) {
            acc[date] = (acc[date] || 0) + (parseFloat(call.duration_minutes) || 0);
          }
          return acc;
        }, {});
        const sortedCallDurationDates = Object.keys(dailyCallDurations).sort();
        setCallDurationData(sortedCallDurationDates.map(date => ({
          date,
          duration: dailyCallDurations[date],
        })));
        console.log("Overview - Call Duration Data (processed):", callDurationData);


        // Recent Interactions List (Messages & Calls) - REMOVED
        setRecentInteractions([]); // REMOVED
        console.log("Overview - Recent Interactions:", recentInteractions);


        // Recent Proposals List - REMOVED
        setRecentProposals([]); // REMOVED
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
        {/* Message Session Count */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
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
                <Typography variant="body2" color="text.secondary">{t('dashboard.totalSessions')}</Typography>
                <ForumIcon sx={{ color: theme.palette.text.secondary }} />
              </Box>
              <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1.8rem' }}>
                {metrics.totalSessions}
              </Typography>
              <Typography variant="caption" sx={{ color: 'success.main' }}>
                +X% {t('dashboard.increase')}
              </Typography>
            </Card>
          </ButtonBase>
        </Grid>

        {/* Total Message Count */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
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

        {/* Total Call Count */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
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

        {/* Total Call Duration */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
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
                <Typography variant="body2" color="text.secondary">{t('dashboard.totalCallDuration')}</Typography>
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
      </Grid>

      <Grid container spacing={3}>
        {/* Daily Session Count Chart (New Chart, replaces old Daily Message Count position) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                {t('dashboard.messageSessionsByDate')}
              </Typography>
              {/* Manual Legend for Bar Chart */}
              {dailySessionCountsData.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, backgroundColor: theme.palette.primary.main, borderRadius: '2px' }} />
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {t('dashboard.sessions')}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ height: 300, width: '100%' }}>
              {dailySessionCountsData.length > 0 ? (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: dailySessionCountsData.map(d => d.date),
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  yAxis={[{
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  series={[
                    { data: dailySessionCountsData.map(d => d.count), color: theme.palette.primary.main },
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

        {/* Daily Message Count Chart (Original, now moved to second row) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                {t('dashboard.dailyMessageCount')}
              </Typography>
              {/* Manual Legend for Bar Chart */}
              {dailyMessageCountsData.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, backgroundColor: theme.palette.info.main, borderRadius: '2px' }} />
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {t('dashboard.messages')}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ height: 300, width: '100%' }}>
              {dailyMessageCountsData.length > 0 ? (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: dailyMessageCountsData.map(d => d.date),
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  yAxis={[{
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  series={[
                    { data: dailyMessageCountsData.map(d => d.count), color: theme.palette.info.main },
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
              {dailyCallCountsData.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, backgroundColor: theme.palette.info.main, borderRadius: '2px' }} />
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {t('dashboard.calls')}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ height: 300, width: '100%' }}>
              {dailyCallCountsData.length > 0 ? (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: dailyCallCountsData.map(d => d.date),
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  yAxis={[{
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  series={[
                    { data: dailyCallCountsData.map(d => d.count), color: theme.palette.info.main },
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

        {/* Total Call Duration Chart (Moved from AnalyticsContent) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                {t('dashboard.totalCallDuration')}
              </Typography>
              {/* Manual Legend for Bar Chart */}
              {callDurationData.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, backgroundColor: theme.palette.secondary.main, borderRadius: '2px' }} />
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {t('dashboard.minutes')}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ height: 300, width: '100%' }}>
              {callDurationData.length > 0 ? (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: callDurationData.map(d => d.date),
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  yAxis={[{
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  series={[
                    { data: callDurationData.map(d => d.duration), color: theme.palette.secondary.main },
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
      </Grid>
    </Box>
  );
}

export default OverviewContent;
