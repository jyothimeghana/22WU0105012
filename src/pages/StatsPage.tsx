import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Alert,
} from '@mui/material';
import { 
  Launch as LaunchIcon, 
  Refresh as RefreshIcon,
  Visibility as ViewIcon 
} from '@mui/icons-material';
import { repo, UrlEntry } from '../storage/repo';
import { formatDateTime, formatTimeRemaining, isExpired } from '../utils/time';
import { logger } from '../logger/logger';

const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState<UrlEntry[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<UrlEntry | null>(null);
  const [clickDetailsOpen, setClickDetailsOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    loadUrls();
    logger.info('stats_page_load');
  }, []);

  const loadUrls = () => {
    try {
      // Clean up expired URLs first
      repo.deleteExpired();
      
      const data = repo.getAll();
      const urlEntries = Object.values(data.urls);
      
      // Sort by creation date (newest first)
      urlEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setUrls(urlEntries);
      setLastRefresh(new Date());
      logger.info('stats_urls_loaded', { count: urlEntries.length });
    } catch (error) {
      logger.error('stats_load_failed', { error: error.message });
    }
  };

  const handleTestClick = (shortcode: string) => {
    logger.info('stats_test_click', { shortcode, source: 'stats_page' });
    window.open(`http://localhost:3000/${shortcode}?src=stats_page`, '_blank');
  };

  const handleViewClicks = (url: UrlEntry) => {
    setSelectedUrl(url);
    setClickDetailsOpen(true);
    logger.info('stats_view_clicks', { shortcode: url.shortcode });
  };

  const handleCloseClickDetails = () => {
    setClickDetailsOpen(false);
    setSelectedUrl(null);
  };

  const getStatusColor = (expiresAt: string) => {
    if (isExpired(expiresAt)) return 'error';
    const timeRemaining = formatTimeRemaining(expiresAt);
    if (timeRemaining.includes('m') && timeRemaining !== 'Expired') {
      const minutesMatch = timeRemaining.match(/(\d+)m/);
      if (minutesMatch && parseInt(minutesMatch[1]) < 60) return 'warning';
    }
    return 'success';
  };

  const getStatusText = (expiresAt: string) => {
    if (isExpired(expiresAt)) return 'Expired';
    return formatTimeRemaining(expiresAt);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          URL Statistics
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadUrls}
        >
          Refresh
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Last updated: {lastRefresh.toLocaleString()}
      </Typography>

      {urls.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No URLs found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create some short URLs to see statistics here.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/')}
              >
                Create URLs
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Short URL</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((url) => (
                <TableRow key={url.shortcode} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      http://localhost:3000/{url.shortcode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 300, 
                        wordBreak: 'break-all',
                        color: 'text.secondary'
                      }}
                    >
                      {url.longUrl}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDateTime(url.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDateTime(url.expiresAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(url.expiresAt)}
                      color={getStatusColor(url.expiresAt) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {url.clicks}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleTestClick(url.shortcode)}
                        title="Test URL"
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleViewClicks(url)}
                        title="View Click Details"
                        disabled={url.clicks === 0}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Click Details Dialog */}
      <Dialog
        open={clickDetailsOpen}
        onClose={handleCloseClickDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Click Details for {selectedUrl?.shortcode}
        </DialogTitle>
        <DialogContent>
          {selectedUrl && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total clicks: {selectedUrl.clicks}
              </Typography>
              
              {selectedUrl.clickEvents.length === 0 ? (
                <Alert severity="info">No click events recorded yet.</Alert>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Region</TableCell>
                        <TableCell>Referrer</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedUrl.clickEvents.map((event, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {formatDateTime(event.timestamp)}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={event.source} 
                              size="small" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {event.geo.region || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            {event.referrer || 'Direct'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClickDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StatsPage;
