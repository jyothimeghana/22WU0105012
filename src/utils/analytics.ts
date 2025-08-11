import { nowISO } from './time';

export interface ClickEvent {
  timestamp: string;
  source: string;
  geo: {
    country?: string;
    region?: string;
    city?: string;
  };
  referrer?: string;
}

export function buildClickEvent(source: string): ClickEvent {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const lang = navigator.language;
  
  return {
    timestamp: nowISO(),
    source,
    geo: { 
      region: tz,
      country: undefined, // Will be enhanced with real geolocation API if available
      city: undefined
    },
    referrer: document.referrer || undefined
  };
}

export function getSourceFromQuery(): string {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('src') || 'direct';
}
