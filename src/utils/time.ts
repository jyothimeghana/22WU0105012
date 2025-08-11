export const nowISO = (): string => new Date().toISOString();

export const addMinutes = (iso: string, minutes: number): string =>
  new Date(new Date(iso).getTime() + minutes * 60 * 1000).toISOString();

export const isExpired = (expiresAt: string, now = nowISO()): boolean =>
  new Date(now) >= new Date(expiresAt);

export const formatDateTime = (iso: string): string => {
  return new Date(iso).toLocaleString();
};

export const formatTimeRemaining = (expiresAt: string): string => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h remaining`;
  if (hours > 0) return `${hours}h ${minutes % 60}m remaining`;
  return `${minutes}m remaining`;
};
