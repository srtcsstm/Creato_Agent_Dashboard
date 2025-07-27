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
  Chip,
  Button,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { fetchNocoDBData } from '../api/nocodb';
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage
import { formatDateToDDMMYYYYHHMM } from '../utils/dateUtils'; // Import date utility

function ProposalsPage() {
  const { clientId } = useAuth();
  const { t } = useLanguage(); // Use translation hook
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProposals = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNocoDBData('offers', clientId); // Use 'offers' alias
        setProposals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadProposals();
    }
  }, [clientId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'error';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t('proposalsPage.loadingProposals')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')} {t('proposalsPage.loadingProposals')}: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {t('proposalsPage.title')}
      </Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="proposals table">
          <TableHead>
            <TableRow>
              <TableCell>{t('proposalsPage.proposalId')}</TableCell>
              <TableCell>{t('proposalsPage.clientId')}</TableCell>
              <TableCell>{t('proposalsPage.proposalTitle')}</TableCell>
              <TableCell align="right">{t('proposalsPage.amount')}</TableCell>
              <TableCell>{t('proposalsPage.status')}</TableCell>
              <TableCell>{t('proposalsPage.sentAt')}</TableCell>
              <TableCell>{t('proposalsPage.offerUrl')}</TableCell>
              <TableCell>{t('proposalsPage.paymentLink')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proposals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t('proposalsPage.noProposalsFound')}
                </TableCell>
              </TableRow>
            ) : (
              proposals.map((proposal) => (
                <TableRow
                  key={proposal.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {proposal.id}
                  </TableCell>
                  <TableCell>{proposal.client_id}</TableCell>
                  <TableCell>{proposal.title}</TableCell>
                  <TableCell align="right">${parseFloat(proposal.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={proposal.status} color={getStatusColor(proposal.status)} size="small" />
                  </TableCell>
                  <TableCell>{formatDateToDDMMYYYYHHMM(proposal.sent_at)}</TableCell>
                  <TableCell>
                    {proposal.offer_url ? (
                      <Button size="small" href={proposal.offer_url} target="_blank" rel="noopener noreferrer" variant="outlined">
                        {t('proposalsPage.viewOffer')}
                      </Button>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {proposal.payment_link ? (
                      <Button size="small" href={proposal.payment_link} target="_blank" rel="noopener noreferrer" variant="outlined">
                        {t('proposalsPage.makePayment')}
                      </Button>
                    ) : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ProposalsPage;
