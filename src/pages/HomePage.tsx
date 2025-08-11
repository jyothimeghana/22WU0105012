import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  Snackbar,
} from '@mui/material';
import { logger } from '../logger/logger';
import ShortenForm from '../components/ShortenForm';
import ResultsList from '../components/ResultsList';
import { RowInput, RowResult } from '../services/shorten';
import { createShortUrls } from '../services/shorten';

const HomePage: React.FC = () => {
  const [inputRows, setInputRows] = useState<RowInput[]>([
    { url: '', validity: '', shortcode: '' }
  ]);
  const [results, setResults] = useState<RowResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const handleSubmit = async (rows: RowInput[]) => {
    setLoading(true);
    logger.info('homepage_submit', { rowCount: rows.length });
    
    try {
      const results = createShortUrls(rows);
      setResults(results);
      
      const successCount = results.filter(r => r.ok).length;
      const errorCount = results.filter(r => !r.ok).length;
      
      if (successCount > 0) {
        setSnackbar({
          open: true,
          message: `Successfully created ${successCount} short URL${successCount > 1 ? 's' : ''}`,
          severity: 'success'
        });
        logger.info('homepage_submit_success', { successCount, errorCount });
      }
      
      if (errorCount > 0) {
        setSnackbar({
          open: true,
          message: `${errorCount} URL${errorCount > 1 ? 's' : ''} failed to process`,
          severity: 'error'
        });
        logger.warn('homepage_submit_errors', { successCount, errorCount });
      }
    } catch (error) {
      logger.error('homepage_submit_failed', { error: error.message });
      setSnackbar({
        open: true,
        message: 'An unexpected error occurred. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = () => {
    if (inputRows.length < 5) {
      setInputRows([...inputRows, { url: '', validity: '', shortcode: '' }]);
      logger.info('homepage_row_added', { newCount: inputRows.length + 1 });
    }
  };

  const handleRemoveRow = (index: number) => {
    if (inputRows.length > 1) {
      const newRows = inputRows.filter((_, i) => i !== index);
      setInputRows(newRows);
      logger.info('homepage_row_removed', { newCount: newRows.length });
    }
  };

  const handleRowChange = (index: number, field: keyof RowInput, value: string) => {
    const newRows = [...inputRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setInputRows(newRows);
  };

  const handleClearResults = () => {
    setResults([]);
    logger.info('homepage_results_cleared');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Create Short URLs
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Shorten up to 5 URLs at once. Leave shortcode empty for auto-generation.
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <ShortenForm
            rows={inputRows}
            onRowChange={handleRowChange}
            onAddRow={handleAddRow}
            onRemoveRow={handleRemoveRow}
            onSubmit={handleSubmit}
            loading={loading}
            canAddRow={inputRows.length < 5}
          />
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Results</Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                onClick={handleClearResults}
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear Results
              </Typography>
            </Box>
            <ResultsList results={results} />
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomePage;
