import { repo } from '../storage/repo';
import { nowISO, addMinutes } from '../utils/time';
import { isValidHttpUrl, isValidShortcode, parseValidityMinutes } from '../utils/validation';
import { generateUniqueShortcode } from '../utils/shortCode';
import { logger } from '../logger/logger';

export interface RowInput {
  url: string;
  validity?: string;
  shortcode?: string;
}

export interface RowResult {
  ok: boolean;
  shortcode?: string;
  longUrl?: string;
  createdAt?: string;
  expiresAt?: string;
  error?: string;
}

export function createShortUrls(rows: RowInput[]): RowResult[] {
  logger.info('shorten_batch_attempt', { count: rows.length });
  const results: RowResult[] = [];

  for (const row of rows) {
    const url = row.url?.trim();
    const validityStr = row.validity?.trim();
    const requestedCode = row.shortcode?.trim();

    // Validate URL
    if (!url || !isValidHttpUrl(url)) {
      results.push({ 
        ok: false, 
        error: 'Invalid URL. Must start with http(s).' 
      });
      logger.warn('shorten_row_invalid_url', { url });
      continue;
    }

    // Validate validity
    const validity = parseValidityMinutes(validityStr);
    if (validityStr && Number.isNaN(validity)) {
      results.push({ 
        ok: false, 
        error: 'Validity must be an integer between 1 and 7200 minutes.' 
      });
      logger.warn('shorten_row_invalid_validity', { validityStr });
      continue;
    }
    const minutes = validity ?? 30;

    // Handle shortcode
    let code = requestedCode;
    if (code) {
      if (!isValidShortcode(code)) {
        results.push({ 
          ok: false, 
          error: 'Shortcode must be 3–20 chars, alphanumeric, - or _.' 
        });
        logger.warn('shorten_row_invalid_shortcode', { code });
        continue;
      }
      if (repo.isShortcodeTaken(code)) {
        results.push({ 
          ok: false, 
          error: 'Shortcode already in use.' 
        });
        logger.warn('shorten_row_shortcode_collision', { code });
        continue;
      }
    } else {
      // Auto-generate unique code
      code = generateUniqueShortcode(
        (c) => repo.isShortcodeTaken(c),
        7,
        10
      );
      if (!code) {
        results.push({ 
          ok: false, 
          error: 'Failed to generate a unique shortcode. Try again.' 
        });
        logger.error('shorten_row_generation_failure', {});
        continue;
      }
    }

    // Create and save entry
    const createdAt = nowISO();
    const expiresAt = addMinutes(createdAt, minutes);
    
    const entry = {
      shortcode: code!,
      longUrl: url,
      createdAt,
      expiresAt,
      clicks: 0,
      clickEvents: []
    };

    const success = repo.upsertUrlEntry(entry);
    if (!success) {
      results.push({ 
        ok: false, 
        error: 'Failed to save URL. Please try again.' 
      });
      logger.error('shorten_row_save_failed', { shortcode: code });
      continue;
    }

    logger.info('shorten_row_success', { 
      shortcode: code, 
      url, 
      minutes 
    });
    
    results.push({ 
      ok: true, 
      shortcode: code!, 
      longUrl: url, 
      createdAt, 
      expiresAt 
    });
  }

  return results;
}
