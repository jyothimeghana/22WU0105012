import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { logger } from './logger/logger';

import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import RedirectPage from './pages/RedirectPage';
import ErrorPage from './pages/ErrorPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  React.useEffect(() => {
    logger.info('app_mounted', { version: '1.0.0' });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              URL Shortener
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/"
                onClick={() => logger.info('navigation', { to: 'home' })}
              >
                Shorten
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/stats"
                onClick={() => logger.info('navigation', { to: 'stats' })}
              >
                Statistics
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/:shortcode" element={<RedirectPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
