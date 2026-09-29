/**
 * Public Website Inspector
 * Analyzes live publicly accessible DOM and HTML signals for conversion rate optimization.
 */

/**
 * Parse raw HTML into structured CRO inspection signals.
 * @param {string} html - Raw HTML source code
 * @param {string} url - Target URL
 * @returns {object} - Structured inspection signals
 */
export function inspectHtmlContent(html, url) {
  if (!html || typeof html !== 'string') {
    return {
      accessible: false,
      reason: 'No HTML content available',
      signals: null
    };
  }

  // 1. Title & Meta Description
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const metaDescMatch = html.match(/<meta[^>]*(?:name|property)=["'](?:description|og:description)["'][^>]*content=["']([\s\S]*?)["']/i) ||
                        html.match(/<meta[^>]*content=["']([\s\S]*?)["'][^>]*(?:name|property)=["'](?:description|og:description)["']/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';

  // 2. OpenGraph / Social Sharing tags
  const ogTitleMatch = html.match(/<meta[^>]*(?:property|name)=["']og:title["'][^>]*content=["']([\s\S]*?)["']/i);
  const hasOpenGraph = !!ogTitleMatch;

  // 3. Viewport (Mobile Responsiveness Signal)
  const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([\s\S]*?)["']/i);
  const hasViewportTag = !!viewportMatch;

  // 4. Headings
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim())
    .filter(t => t.length > 0);

  const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim())
    .filter(t => t.length > 0)
    .slice(0, 10);

  // 5. Calls to Action (CTAs)
  const buttonMatches = [...html.matchAll(/<(?:button|a)[^>]*class=["']?[^"'>]*(?:btn|cta|button)[^"'>]*["']?[^>]*>([\s\S]*?)<\/(?:button|a)>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim())
    .filter(t => t.length > 0 && t.length < 50);

  const commonCtaRegex = /\b(get started|buy now|start free|book a call|claim|schedule|try free|sign up|join now|subscribe|request demo|order now|contact us|get my audit|add to cart)\b/gi;
  const ctaPhrases = [...html.matchAll(commonCtaRegex)].map(m => m[0]);
  const detectedCtas = Array.from(new Set([...buttonMatches, ...ctaPhrases])).slice(0, 8);

  // 6. Forms & Lead Capture
  const formCount = (html.match(/<form[^>]*>/gi) || []).length;
  const emailInputCount = (html.match(/type=["']email["']/gi) || []).length;
  const telInputCount = (html.match(/type=["']tel["']/gi) || []).length;
  const submitButtonCount = (html.match(/type=["']submit["']/gi) || []).length;

  // 7. Trust Elements & Social Proof
  const hasTestimonials = /testimonial|review|rating|customer-story|case-study|what our clients say/i.test(html);
  const hasStarRatings = /★|5-star|4\.9|ratingValue|aggregateRating|Trustpilot|Google Review/i.test(html);
  const hasGuarantee = /guarantee|money-back|30-day|100% satisfaction|risk-free/i.test(html);
  const hasClientLogos = /client-logo|partner-logo|featured in|trusted by|as seen on/i.test(html);

  // 8. FAQ Section
  const hasFaq = /faq|frequently asked|accordion|<details/i.test(html) || /"schema\.org","@type":"FAQPage"/i.test(html);

  // 9. Contact Signals
  const hasPhone = /(?:\+?(\d{1,3}))?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/.test(html);
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(html);

  // 10. Tracking & Technical Signals
  const hasGoogleAnalytics = /gtag\(|googletagmanager\.com|google-analytics\.com|G-[A-Z0-9]+/i.test(html);
  const hasMetaPixel = /fbq\(|facebook\.net\/en_US\/fbevents\.js/i.test(html);
  const hasHotjar = /hotjar\.com|hjid/i.test(html);

  // 11. Word count & Content density
  const cleanBody = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                        .replace(/<style[\s\S]*?<\/style>/gi, '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
  const wordCount = cleanBody.split(/\s+/).length;

  return {
    accessible: true,
    url,
    title,
    metaDescription,
    hasOpenGraph,
    hasViewportTag,
    h1Headlines: h1Matches,
    h2Headlines: h2Matches,
    detectedCtas,
    hasForms: formCount > 0 || emailInputCount > 0,
    formDetails: {
      formCount,
      hasEmailCapture: emailInputCount > 0,
      hasPhoneCapture: telInputCount > 0,
      hasSubmitButton: submitButtonCount > 0
    },
    trustSignals: {
      hasTestimonials,
      hasStarRatings,
      hasGuarantee,
      hasClientLogos
    },
    hasFaq,
    contactSignals: {
      hasPhone,
      hasEmail
    },
    trackingSignals: {
      hasGoogleAnalytics,
      hasMetaPixel,
      hasHotjar
    },
    metrics: {
      estimatedWordCount: wordCount,
      contentRichness: wordCount > 300 ? 'Substantial' : 'Thin'
    }
  };
}

/**
 * Fetch and safely inspect a website URL from serverless endpoint or client proxy.
 */
export async function fetchAndInspectSite(targetUrl) {
  const timeoutMs = 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 FunnelAuditBot/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        accessible: false,
        statusCode: res.status,
        statusText: res.statusText,
        blocked: res.status === 403 || res.status === 401 || res.status === 429,
        reason: `HTTP ${res.status}: ${res.statusText}`,
        signals: null
      };
    }

    const html = await res.text();
    const signals = inspectHtmlContent(html, targetUrl);

    return {
      accessible: true,
      statusCode: res.status,
      blocked: false,
      signals
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      accessible: false,
      blocked: false,
      reason: err.name === 'AbortError' ? 'Connection timed out after 10 seconds' : (err.message || 'Network error'),
      signals: null
    };
  }
}
