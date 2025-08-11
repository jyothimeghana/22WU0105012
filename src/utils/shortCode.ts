const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateShortcode(len = 7): string {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return s;
}

export function generateUniqueShortcode(
  isTaken: (code: string) => boolean,
  len = 7,
  maxAttempts = 10
): string | null {
  let attempts = 0;
  do {
    const code = generateShortcode(len);
    if (!isTaken(code)) {
      return code;
    }
    attempts++;
  } while (attempts < maxAttempts);
  
  return null;
}
