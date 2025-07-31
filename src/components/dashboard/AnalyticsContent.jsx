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
import { BarChart } from '@mui/x-charts';
import { Pie, Cell, PieChart as RechartsPieChart, LabelList } from 'recharts'; // Import LabelList for pie chart labels
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Import InfoOutlinedIcon
import { useAuth } from '../../contexts/AuthContext';
import { fetchNocoDBData } from '../../api/nocodb';
import { useLanguage } from '../../contexts/LanguageContext';
import { parseDDMMYYYYHHMM, formatDateToYYYYMMDD, getStartDateForDaysAgo } from '../../utils/dateUtils';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '../ui/pie-chart'; // Import ChartConfig

function AnalyticsContent({ selectedDays }) { // Receive selectedDays prop
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

      const endDate = formatDateToYYYYMMDD(new Date());
      const startDate = getStartDateForDaysAgo(selectedDays);

      console.log(`[AnalyticsContent] Current Client ID: ${clientId}`);
      console.log(`[AnalyticsContent] Fetching data for client: ${clientId}, from ${startDate} to ${endDate} (selectedDays: ${selectedDays})`);

      try {
        // Pass selectedDays to fetchNocoDBData for conditional filtering logic
        const messages = await fetchNocoDBData('messages', clientId, { startDate, endDate, selectedDays });
        const calls = await fetchNocoDBData('calls', clientId, { startDate, endDate, selectedDays });
        const offers = await fetchNocoDBData('offers', clientId, { startDate, endDate, selectedDays });
        const leads = await fetchNocoDBData('leads', clientId, { startDate, endDate, selectedDays });

        console.log("Analytics - Fetched Messages (raw):", messages);
        console.log("Analytics - Fetched Calls (raw):", calls);
        console.log("Analytics - Fetched Offers (raw):", offers);
        console.log("Analytics - Fetched Leads (raw):", leads);


        // Message Channel Usage (Pie Chart)
        const channelCounts = messages.reduce((acc, msg) => {
          acc[msg.channel] = (acc[msg.channel] || 0) + 1;
          return acc;
        }, {});
        console.log("Analytics - Calculated channelCounts:", channelCounts);

        const distinctColors = [theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main, theme.palette.success.main, theme.palette.error.main];
        const processedMessageChannelData = Object.keys(channelCounts).map((channel, index) => ({
          id: index,
          value: channelCounts[channel],
          label: channel,
          color: distinctColors[index % distinctColors.length],
        }));
        setMessageChannelData(processedMessageChannelData);
        console.log("Analytics - Message Channel Data (processed for PieChart):", processedMessageChannelData);
        if (processedMessageChannelData.length === 0) {
          console.warn("messageChannelData is empty, PieChart will not render.");
        } else {
          const totalValue = processedMessageChannelData.reduce((sum, item) => sum + item.value, 0);
          if (totalValue === 0) {
            console.warn("All values in messageChannelData are zero, PieChart will not render.");
          }
        }


        // Total Call Duration (Bar Chart)
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
        console.log("Analytics - Call Duration Data (processed):", callDurationData);


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
        console.log("Analytics - Offer Conversion Data (processed):", offerConversionData);


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
        console.log("Analytics - Leads by Interest Data (processed):", leadsByInterestData);


      } catch (err) {
        setError(err.message);
        console.error("AnalyticsContent data loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadAnalyticsData();
    }
  }, [clientId, selectedDays, theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main, theme.palette.success.main, theme.palette.error.main, t]);

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

  // Chart config for the new PieChart component
  const messageChannelChartConfig = messageChannelData.reduce((acc, item) => {
    acc[item.label] = {
      label: item.label,
      color: item.color,
    };
    return acc;
  }, {}); // Removed as ChartConfig

  const offerConversionChartConfig = offerConversionData.reduce((acc, item) => {
    acc[item.label] = {
      label: item.label,
      color: item.color,
    };
    return acc;
  }, {}); // Removed as ChartConfig


  return (
    <Box>
      <Grid container spacing={3}>
        {/* Message Channel Usage Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                {t('dashboard.messageChannelUsage')}
              </Typography>
              {/* Manual Legend for Pie Chart */}
              {messageChannelData.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  {messageChannelData.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 10, height: 10, backgroundColor: item.color, borderRadius: '2px' }} />
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: 300 }}>
              {messageChannelData.length > 0 ? (
                <ChartContainer
                  config={messageChannelChartConfig}
                  width="100%"
                  height="100%"
                  className="mx-auto"
                >
                  <RechartsPieChart>
                    <ChartTooltip
                      content={<ChartTooltipContent nameKey="label" hideLabel />}
                    />
                    <Pie
                      data={messageChannelData}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      cornerRadius={5}
                      startAngle={-90}
                      endAngle={270}
                      dataKey="value"
                      nameKey="label"
                    >
                      {messageChannelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ChartContainer>
              ) : (
                <NoDataDisplay message={t('dashboard.noChannelData')} />
              )}
            </Box>
          </Card>
        </Grid>

        {/* Total Call Duration Chart */}
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

        {/* Offer Acceptance Rate Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                {t('dashboard.offerAcceptanceRate')}
              </Typography>
              {/* Manual Legend for Pie Chart */}
              {offerConversionData.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  {offerConversionData.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 10, height: 10, backgroundColor: item.color, borderRadius: '2px' }} />
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: 300 }}>
              {offerConversionData.length > 0 ? (
                <ChartContainer
                  config={offerConversionChartConfig}
                  width="100%"
                  height="100%"
                  className="mx-auto"
                >
                  <RechartsPieChart>
                    <ChartTooltip
                      content={<ChartTooltipContent nameKey="label" hideLabel />}
                    />
                    <Pie
                      data={offerConversionData}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      cornerRadius={5}
                      startAngle={-90}
                      endAngle={270}
                      dataKey="value"
                      nameKey="label"
                    >
                      {offerConversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ChartContainer>
              ) : (
                <NoDataDisplay message={t('dashboard.noOfferConversionData')} />
              )}
            </Box>
          </Card>
        </Grid>

        {/* Leads by Interest Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                {t('dashboard.leadsByInterest')}
              </Typography>
              {/* Manual Legend for Bar Chart */}
              {leadsByInterestData.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, backgroundColor: theme.palette.warning.main, borderRadius: '2px' }} />
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {t('dashboard.leads')}
                  </Typography>
                </Box>
              )}
            </Box>
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
                    { data: leadsByInterestData.map(d => d.count), color: theme.palette.warning.main },
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
                <NoDataDisplay message={t('dashboard.noLeadsByInterestData')} />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AnalyticsContent;
