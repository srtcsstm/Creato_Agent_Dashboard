import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import { useAuth } from '../../contexts/AuthContext';
import { fetchNocoDBData } from '../../api/nocodb';
import { useLanguage } from '../../contexts/LanguageContext';
import { parseDDMMYYYYHHMM, formatDateToYYYYMMDD } from '../../utils/dateUtils';

function AnalyticsContent() {
  const { clientId } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageChannelData, setMessageChannelData] = useState([]);
  const [callDurationData, setCallDurationData] = useState([]);
  const [offerConversionData, setOfferConversionData] = useState([]);
  const [leadsByInterestData, setLeadsByInterestData] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const messages = await fetchNocoDBData('messages', clientId);
        const calls = await fetchNocoDBData('calls', clientId);
        const offers = await fetchNocoDBData('offers', clientId);
        const leads = await fetchNocoDBData('leads', clientId);

        // Message Channel Usage (Pie Chart)
        const channelCounts = messages.reduce((acc, msg) => {
          acc[msg.channel] = (acc[msg.channel] || 0) + 1;
          return acc;
        }, {});
        setMessageChannelData(Object.keys(channelCounts).map((channel, index) => ({
          id: index,
          value: channelCounts[channel],
          label: channel,
          color: theme.palette.primary.light, // Example color, can be customized
        })));

        // Total Call Duration (Bar Chart)
        const dailyCallDurations = calls.reduce((acc, call) => {
          const date = formatDateToYYYYMMDD(parseDDMMYYYYHHMM(call.date));
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

        // Offer Acceptance Rate (Pie Chart)
        const acceptedOffersCount = offers.filter(offer => offer.status === 'Accepted').length;
        const rejectedOffersCount = offers.filter(offer => offer.status === 'Rejected').length;
        const pendingOffersCount = offers.filter(offer => offer.status === 'Pending').length;
        const totalOffersForConversion = acceptedOffersCount + rejectedOffersCount + pendingOffersCount;

        if (totalOffersForConversion > 0) {
          setOfferConversionData([
            { id: 0, value: acceptedOffersCount, label: t('dashboard.accepted'), color: theme.palette.success.main },
            { id: 1, value: rejectedOffersCount, label: t('dashboard.rejected'), color: theme.palette.error.main },
            { id: 2, value: pendingOffersCount, label: t('dashboard.pending'), color: theme.palette.warning.main },
          ]);
        } else {
          setOfferConversionData([]);
        }

        // Leads by Interest (Bar Chart)
        const interestCounts = leads.reduce((acc, lead) => {
          acc[lead.interest] = (acc[lead.interest] || 0) + 1;
          return acc;
        }, {});
        setLeadsByInterestData(Object.keys(interestCounts).map((interest, index) => ({
          id: index,
          interest,
          count: interestCounts[interest],
        })));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadAnalyticsData();
    }
  }, [clientId, theme.palette.primary.light, theme.palette.success.main, theme.palette.error.main, theme.palette.warning.main, t]);

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

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Message Channel Usage Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
              {t('dashboard.messageChannelUsage')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: 300 }}>
              {messageChannelData.length > 0 ? (
                <PieChart
                  series={[
                    {
                      data: messageChannelData,
                      innerRadius: 60,
                      outerRadius: 100,
                      paddingAngle: 5,
                      cornerRadius: 5,
                      startAngle: -90,
                      endAngle: 270,
                      cx: 150,
                      cy: 150,
                    },
                  ]}
                  height={300}
                  width={300}
                  slotProps={{
                    legend: {
                      direction: 'column',
                      position: { vertical: 'middle', horizontal: 'right' },
                      itemMarkWidth: 10,
                      itemMarkHeight: 10,
                      labelStyle: {
                        fill: theme.palette.text.primary,
                      },
                    },
                  }}
                />
              ) : (
                <Typography variant="body1" color="text.secondary">{t('dashboard.noChannelData')}</Typography>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Total Call Duration Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
              {t('dashboard.totalCallDuration')}
            </Typography>
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
                    { data: callDurationData.map(d => d.duration), label: t('dashboard.minutes'), color: theme.palette.secondary.main },
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
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">{t('dashboard.noCallData')}</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Offer Acceptance Rate Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
              {t('dashboard.offerAcceptanceRate')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: 300 }}>
              {offerConversionData.length > 0 ? (
                <PieChart
                  series={[
                    {
                      data: offerConversionData,
                      innerRadius: 60,
                      outerRadius: 100,
                      paddingAngle: 5,
                      cornerRadius: 5,
                      startAngle: -90,
                      endAngle: 270,
                      cx: 150,
                      cy: 150,
                    },
                  ]}
                  height={300}
                  width={300}
                  slotProps={{
                    legend: {
                      direction: 'column',
                      position: { vertical: 'middle', horizontal: 'right' },
                      itemMarkWidth: 10,
                      itemMarkHeight: 10,
                      labelStyle: {
                        fill: theme.palette.text.primary,
                      },
                    },
                  }}
                />
              ) : (
                <Typography variant="body1" color="text.secondary">{t('dashboard.noOfferConversionData')}</Typography>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Leads by Interest Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
              {t('dashboard.leadsByInterest')}
            </Typography>
            <Box sx={{ height: 300, width: '100%' }}>
              {leadsByInterestData.length > 0 ? (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: leadsByInterestData.map(d => d.interest),
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  yAxis={[{
                    tickLabelStyle: { fill: theme.palette.text.secondary },
                  }]}
                  series={[
                    { data: leadsByInterestData.map(d => d.count), label: t('dashboard.leads'), color: theme.palette.warning.main },
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
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">{t('dashboard.noLeadsByInterestData')}</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AnalyticsContent;
