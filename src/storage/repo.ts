import { logger } from '../logger/logger';
import { ClickEvent } from '../utils/analytics';

const KEY = 'urlShortener.data';

export interface UrlEntry {
  shortcode: string;
  longUrl: string;
  createdAt: string;
  expiresAt: string;
  clicks: number;
  clickEvents: ClickEvent[];
}

export interface Data {
  urls: Record<string, UrlEntry>;
  meta: { lastUpdated: string };
}

function read(): Data {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return { 
        urls: {}, 
        meta: { lastUpdated: new Date().toISOString() } 
      };
    }
    return JSON.parse(raw);
  } catch (error) {
    logger.error('storage_read_error', { error: error.message });
    return { 
      urls: {}, 
      meta: { lastUpdated: new Date().toISOString() } 
    };
  }
}

function write(data: Data): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      ...data,
      meta: { lastUpdated: new Date().toISOString() }
    }));
    return true;
  } catch (error) {
    logger.error('storage_write_error', { error: error.message });
    return false;
  }
}

export const repo = {
  getAll(): Data {
    return read();
  },

  getByShortcode(code: string): UrlEntry | undefined {
    return read().urls[code];
  },

  isShortcodeTaken(code: string): boolean {
    return !!read().urls[code];
  },

  upsertUrlEntry(entry: UrlEntry): boolean {
    const data = read();
    data.urls[entry.shortcode] = entry;
    const success = write(data);
    if (success) {
      logger.info('storage_url_saved', { shortcode: entry.shortcode });
    }
    return success;
  },

  recordClick(code: string, event: ClickEvent): boolean {
    const data = read();
    const entry = data.urls[code];
    if (!entry) {
      logger.warn('storage_click_record_failed', { code, reason: 'entry_not_found' });
      return false;
    }
    
    entry.clicks += 1;
    entry.clickEvents.push(event);
    const success = write(data);
    if (success) {
      logger.info('storage_click_recorded', { code, totalClicks: entry.clicks });
    }
    return success;
  },

  deleteExpired(): number {
    const data = read();
    const now = new Date().toISOString();
    const beforeCount = Object.keys(data.urls).length;
    
    Object.keys(data.urls).forEach(code => {
      if (new Date(data.urls[code].expiresAt) <= new Date(now)) {
        delete data.urls[code];
      }
    });
    
    const afterCount = Object.keys(data.urls).length;
    const deletedCount = beforeCount - afterCount;
    
    if (deletedCount > 0) {
      write(data);
      logger.info('storage_expired_cleaned', { deletedCount });
    }
    
    return deletedCount;
  },

  ensureInit(): boolean {
    try {
      localStorage.getItem(KEY);
      return true;
    } catch {
      logger.warn('storage_unavailable', { reason: 'localStorage_not_available' });
      return false;
    }
  }
};
