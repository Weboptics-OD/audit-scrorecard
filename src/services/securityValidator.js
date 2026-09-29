/**
 * Security & URL Validation Utility
 * Enforces strict input validation and Server-Side Request Forgery (SSRF) protection.
 */

// Private IPv4 CIDR check helpers
function isPrivateIPv4(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return false;
  }
  const [a, b] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 10.0.0.0/8 (Private network)
  if (a === 10) return true;

  // 172.16.0.0/12 (Private network: 172.16 - 172.31)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16 (Private network)
  if (a === 192 && b === 168) return true;

  // 169.254.0.0/16 (Link-local / Cloud metadata endpoint: 169.254.169.254)
  if (a === 169 && b === 254) return true;

  // 100.64.0.0/10 (Carrier-grade NAT)
  if (a === 100 && b >= 64 && b <= 127) return true;

  // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
  if (a >= 224) return true;

  return false;
}

// Private IPv6 check
function isPrivateIPv6(hostname) {
  const clean = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (clean === '::1' || clean === '::') return true;
  if (clean.startsWith('fc') || clean.startsWith('fd')) return true; // Unique local (fc00::/7)
  if (clean.startsWith('fe80:')) return true; // Link-local
  if (clean.startsWith('::ffff:')) {
    // IPv4-mapped IPv6
    const mapped = clean.substring(7);
    return isPrivateIPv4(mapped);
  }
  return false;
}

/**
 * Automatically normalize URL input.
 * e.g. "example.com" -> "https://example.com"
 * e.g. "http://example.com" -> preserved
 */
export function normalizeUrl(input) {
  if (!input || typeof input !== 'string') return '';
  let trimmed = input.trim();
  if (!trimmed) return '';

  // If missing scheme, prepend https://
  if (!/^https?:\/\//i.test(trimmed)) {
    // If it starts with non-http protocol with slashes (e.g. ftp://) or non-web schemes (e.g. javascript:, data:)
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed) || /^(javascript|data|file|mailto|ftp):/i.test(trimmed)) {
      return trimmed;
    }
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Validate and sanitize submitted website URL.
 * Protects against SSRF, internal network scans, and invalid web targets.
 * 
 * @param {string} input - Raw URL string from user
 * @returns {object} - { isValid: boolean, normalizedUrl?: string, hostname?: string, cleanDisplayUrl?: string, error?: string }
 */
export function validateAuditUrl(input) {
  if (!input || typeof input !== 'string' || !input.trim()) {
    return {
      isValid: false,
      error: 'Please enter your website or landing page URL.'
    };
  }

  const normalized = normalizeUrl(input);

  let urlObj;
  try {
    urlObj = new URL(normalized);
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid website address (e.g. yourwebsite.com).'
    };
  }

  // 1. Only allow HTTP and HTTPS
  if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
    return {
      isValid: false,
      error: 'Only standard HTTP and HTTPS websites can be audited.'
    };
  }

  const hostname = urlObj.hostname.toLowerCase();

  // 2. Reject localhost & loopback
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
    return {
      isValid: false,
      error: 'Localhost and internal addresses cannot be audited. Please provide a publicly accessible website URL.'
    };
  }

  // 3. Reject cloud metadata endpoints
  const metadataHosts = [
    '169.254.169.254',
    'metadata.google.internal',
    'instance-data',
    'metadata.internal'
  ];
  if (metadataHosts.includes(hostname)) {
    return {
      isValid: false,
      error: 'Access to internal cloud metadata endpoints is prohibited.'
    };
  }

  // 4. Reject private IPv4 ranges
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    if (isPrivateIPv4(hostname)) {
      return {
        isValid: false,
        error: 'Private IP addresses and internal networks cannot be audited. Please provide a public domain.'
      };
    }
  }

  // 5. Reject private IPv6 addresses
  if (hostname.includes(':')) {
    if (isPrivateIPv6(hostname)) {
      return {
        isValid: false,
        error: 'Private IPv6 addresses cannot be audited. Please provide a public domain.'
      };
    }
  }

  // 6. Reject internal reserved TLDs
  const internalTlds = ['.local', '.internal', '.lan', '.corp', '.home', '.test', '.invalid', '.example'];
  if (internalTlds.some(tld => hostname.endsWith(tld))) {
    return {
      isValid: false,
      error: 'Internal domain names cannot be audited. Please provide a live, publicly accessible website.'
    };
  }

  // 7. Check for at least one dot in domain (prevent intranet names like "intranet")
  if (!hostname.includes('.')) {
    return {
      isValid: false,
      error: 'Please enter a full domain name (e.g. yourwebsite.com).'
    };
  }

  // 8. TLD must be at least 2 characters
  const parts = hostname.split('.');
  const tld = parts[parts.length - 1];
  if (!/^[a-z]{2,}$/i.test(tld) && !/^\d+$/.test(tld)) {
    return {
      isValid: false,
      error: 'Please enter a valid website extension (e.g. .com, .io, .co).'
    };
  }

  // Format clean display URL
  const cleanDisplayUrl = urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');

  return {
    isValid: true,
    normalizedUrl: urlObj.href,
    hostname: urlObj.hostname,
    cleanDisplayUrl
  };
}
