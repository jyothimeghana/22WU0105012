import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack as BackIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { repo } from '../storage/repo';
import { buildClickEvent, getSourceFromQuery } from '../utils/analytics';
import { isExpired } from '../utils/time';
import { logger } from '../logger/logger';

const RedirectPage: React.FC = () => {
  const { shortcode } = useParams<{ shortcode: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [urlEntry, setUrlEntry] = useState<any>(null);

  useEffect(() => {
    if (!shortcode) {
      setError('No shortcode provided');
      setLoading(false);
      return;
    }

    logger.info('redirect_page_load', { shortcode });

    try {
      const entry = repo.getByShortcode(shortcode);
      
      if (!entry) {
        setError('Short URL not found');
        logger.warn('redirect_not_found', { shortcode });
        setLoading(false);
        return;
      }

      if (isExpired(entry.expiresAt)) {
        setExpired(true);
        setUrlEntry(entry);
        logger.warn('redirect_expired', { shortcode, expiresAt: entry.expiresAt });
        setLoading(false);
        return;
      }

      // Record the click
      const source = getSourceFromQuery();
      const clickEvent = buildClickEvent(source);
      repo.recordClick(shortcode, clickEvent);
      
      logger.info('redirect_success', { 
        shortcode, 
        longUrl: entry.longUrl, 
        source 
      });

      // Redirect to the long URL
      window.location.replace(entry.longUrl);
      
    } catch (error) {
      logger.error('redirect_error', { shortcode, error: error.message });
      setError('An error occurred while processing the redirect');
      setLoading(false);
    }
  }, [shortcode]);

  const handleBackToHome = () => {
    logger.info('redirect_back_to_home', { shortcode });
    navigate('/');
  };

  const handleRecreateLink = () => {
    if (urlEntry) {
      logger.info('redirect_recreate_link', { shortcode, longUrl: urlEntry.longUrl });
      navigate('/', { 
        state: { 
          prefillUrl: urlEntry.longUrl,
          prefillShortcode: shortcode 
        } 
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <CircularProgress size={60} />
          <Typography variant="h6">Processing redirect...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h4" color="error" gutterBottom>
                ❌ {error}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                The short URL you're looking for doesn't exist or has been removed.
              </Typography>
              <Button
                variant="contained"
                startIcon={<BackIcon />}
                onClick={handleBackToHome}
                size="large"
              >
                Back to Home
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (expired && urlEntry) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h4" color="warning.main" gutterBottom>
                ⏰ Link Expired
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                This short URL has expired and is no longer valid.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                <strong>Original URL:</strong> {urlEntry.longUrl}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<BackIcon />}
                  onClick={handleBackToHome}
                >
                  Back to Home
                </Button>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={handleRecreateLink}
                >
                  Recreate Link
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return null;
};

export default RedirectPage;
