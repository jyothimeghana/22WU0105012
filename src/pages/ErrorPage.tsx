import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { logger } from '../logger/logger';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    logger.warn('error_page_404');
  }, []);

  const handleGoHome = () => {
    logger.info('error_page_go_home');
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h1" color="error" gutterBottom>
              404
            </Typography>
            <Typography variant="h4" gutterBottom>
              Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              The page you're looking for doesn't exist or has been moved.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              Go to Home
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ErrorPage;
