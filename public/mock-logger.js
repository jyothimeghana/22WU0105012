// Mock logging middleware for testing
// This simulates the _AFFORDMED_LOGGER_ that would be provided in production

(function() {
  'use strict';
  
  // Create a simple console-based logger for development
  const mockLogger = {
    info: function(event, payload) {
      console.log(`[INFO] ${event}:`, payload || '');
    },
    warn: function(event, payload) {
      console.warn(`[WARN] ${event}:`, payload || '');
    },
    error: function(event, payload) {
      console.error(`[ERROR] ${event}:`, payload || '');
    }
  };
  
  // Attach to window for the app to use
  window._AFFORDMED_LOGGER_ = mockLogger;
  
  console.log('Mock logging middleware initialized');
})();
