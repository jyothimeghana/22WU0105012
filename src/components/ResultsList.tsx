import React from 'react';
import {
  Box,
  Typography,
  Alert,
  Button,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import { ContentCopy as CopyIcon, Launch as LaunchIcon } from '@mui/icons-material';
import { RowResult } from '../services/shorten';
import { formatDateTime, formatTimeRemaining } from '../utils/time';
import { logger } from '../logger/logger';

interface ResultsListProps {
  results: RowResult[];
}

const ResultsList: React.FC<ResultsListProps> = ({ results }) => {
  const handleCopy = async (shortcode: string) => {
    const shortUrl = `http://localhost:3000/${shortcode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      logger.info('results_copy_success', { shortcode });
    } catch (error) {
      logger.error('results_copy_failed', { shortcode, error: error.message });
    }
  };

  const handleTestClick = (shortcode: string) => {
    logger.info('results_test_click', { shortcode, source: 'results_page' });
    window.open(`http://localhost:3000/${shortcode}?src=results_page`, '_blank');
  };

  const successfulResults = results.filter(r => r.ok);
  const failedResults = results.filter(r => !r.ok);

  return (
    <Box>
      {successfulResults.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="success.main" gutterBottom>
            ✅ Successful ({successfulResults.length})
          </Typography>
          
          {successfulResults.map((result, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'success.light', borderRadius: 1, bgcolor: 'success.50' }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Original URL:
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {result.longUrl}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Short URL:
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontFamily: 'monospace' }}>
                    http://localhost:3000/{result.shortcode}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`Created: ${formatDateTime(result.createdAt!)}`} 
                    size="small" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={formatTimeRemaining(result.expiresAt!)} 
                    size="small" 
                    variant="outlined"
                    color={formatTimeRemaining(result.expiresAt!) === 'Expired' ? 'error' : 'default'}
                  />
                </Box>
                
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<CopyIcon />}
                    onClick={() => handleCopy(result.shortcode!)}
                    size="small"
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LaunchIcon />}
                    onClick={() => handleTestClick(result.shortcode!)}
                    size="small"
                  >
                    Test
                  </Button>
                </Stack>
              </Stack>
              
              {index < successfulResults.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Box>
      )}

      {failedResults.length > 0 && (
        <Box>
          <Typography variant="h6" color="error.main" gutterBottom>
            ❌ Failed ({failedResults.length})
          </Typography>
          
          {failedResults.map((result, index) => (
            <Alert key={index} severity="error" sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                <strong>URL:</strong> {result.longUrl || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Error:</strong> {result.error}
              </Typography>
            </Alert>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ResultsList;
