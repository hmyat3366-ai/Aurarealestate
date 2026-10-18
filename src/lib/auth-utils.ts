/**
 * src/lib/auth-utils.ts
 * Client- and server-safe authentication and URL sanitization utilities.
 */

/**
 * Sanitize and validate return URLs to protect against Open Redirect vulnerabilities.
 * Only relative local paths starting with '/' and NOT '//' or containing protocol schemes are permitted.
 */
export function sanitizeReturnUrl(url?: string | null, fallback = '/account'): string {
  if (!url || typeof url !== 'string') {
    return fallback;
  }
  const trimmed = url.trim();
  // Disallow absolute URLs, javascript:, data:, protocol-relative //, backslashes, or control chars
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.includes('\\') ||
    /[\r\n\t\0]/.test(trimmed) ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
  ) {
    return fallback;
  }
  return trimmed;
}
