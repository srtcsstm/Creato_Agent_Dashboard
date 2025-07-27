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
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useAuth } from '../contexts/AuthContext';
import { fetchNocoDBData } from '../api/nocodb';
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage
import { formatDateToDDMMYYYYHHMM } from '../utils/dateUtils'; // Import date utility

function LeadsPage() {
  const { clientId } = useAuth();
  const { t } = useLanguage(); // Use translation hook
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLeads = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNocoDBData('leads', clientId); // Use 'leads' alias
        setLeads(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadLeads();
    }
  }, [clientId]);

  const exportToCsv = () => {
    if (leads.length === 0) {
      alert(t('leadsPage.noLeadsToExport'));
      return;
    }

    const headers = [t('leadsPage.name'), t('leadsPage.email'), t('leadsPage.phone'), t('leadsPage.interest'), t('leadsPage.timestamp')];
    const rows = leads.map(lead => [
      lead.name,
      lead.email,
      lead.phone,
      lead.interest,
      formatDateToDDMMYYYYHHMM(lead.timestamp),
    ]);

    let csvContent = headers.map(header => `"${header}"`).join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(field => `"${field}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${clientId}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(t('leadsPage.browserNotSupportDownload'));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t('leadsPage.loadingLeads')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')} {t('leadsPage.loadingLeads')}: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('leadsPage.title')}
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={exportToCsv}
          disabled={leads.length === 0}
        >
          {t('leadsPage.exportToCsv')}
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="leads table">
          <TableHead>
            <TableRow>
              <TableCell>{t('leadsPage.name')}</TableCell>
              <TableCell>{t('leadsPage.email')}</TableCell>
              <TableCell>{t('leadsPage.phone')}</TableCell>
              <TableCell>{t('leadsPage.interest')}</TableCell>
              <TableCell>{t('leadsPage.timestamp')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {t('leadsPage.noLeadsFound')}
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow
                  key={lead.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {lead.name}
                  </TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.interest}</TableCell>
                  <TableCell>{formatDateToDDMMYYYYHHMM(lead.timestamp)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default LeadsPage;
