export const logger = {
  info: (event: string, payload?: any) => {
    if (window._AFFORDMED_LOGGER_) {
      window._AFFORDMED_LOGGER_.info(event, payload);
    }
  },
  warn: (event: string, payload?: any) => {
    if (window._AFFORDMED_LOGGER_) {
      window._AFFORDMED_LOGGER_.warn(event, payload);
    }
  },
  error: (event: string, payload?: any) => {
    if (window._AFFORDMED_LOGGER_) {
      window._AFFORDMED_LOGGER_.error(event, payload);
    }
  },
};

// Type declaration for the global logger
declare global {
  interface Window {
    _AFFORDMED_LOGGER_: {
      info: (event: string, payload?: any) => void;
      warn: (event: string, payload?: any) => void;
      error: (event: string, payload?: any) => void;
    };
  }
}
