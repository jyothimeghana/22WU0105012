export function isValidHttpUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function parseValidityMinutes(val?: string): number | undefined {
  if (!val?.trim()) return undefined;
  if (!/^\d+$/.test(val)) return NaN as any;
  const n = Number(val);
  if (n < 1 || n > 7200) return NaN as any;
  return n;
}

export function isValidShortcode(code: string): boolean {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(code);
}

export function validateUrlRow(
  url: string,
  validity?: string,
  shortcode?: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!url?.trim()) {
    errors.push('URL is required');
  } else if (!isValidHttpUrl(url.trim())) {
    errors.push('Invalid URL. Must start with http(s).');
  }
  
  if (validity?.trim()) {
    const validityNum = parseValidityMinutes(validity);
    if (Number.isNaN(validityNum)) {
      errors.push('Validity must be an integer between 1 and 7200 minutes.');
    }
  }
  
  if (shortcode?.trim()) {
    if (!isValidShortcode(shortcode.trim())) {
      errors.push('Shortcode must be 3–20 chars, alphanumeric, - or _.');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
