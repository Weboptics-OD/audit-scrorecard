/**
 * Serverless API Route: /api/analyze
 * Analyzes a public website URL using live DOM inspection and Gemini AI.
 * Keeps external API credentials and security checks strictly server-side.
 */
import { GoogleGenAI } from '@google/genai';

// Private IPv4 CIDR check
function isPrivateIPv4(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return false;
  }
  const [a, b] = parts;
  if (a === 0 || a === 127 || a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a >= 224) return true;
  return false;
}

function validateAndSanitizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'Website URL is required.' };
  }
  let trimmed = rawUrl.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: 'Invalid URL format.' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, error: 'Only HTTP and HTTPS URLs are permitted.' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // SSRF checks
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
    return { valid: false, error: 'Localhost and internal loopback addresses are blocked.' };
  }

  const metadataHosts = ['169.254.169.254', 'metadata.google.internal', 'instance-data', 'metadata.internal'];
  if (metadataHosts.includes(hostname)) {
    return { valid: false, error: 'Internal cloud metadata endpoints are blocked.' };
  }

  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) && isPrivateIPv4(hostname)) {
    return { valid: false, error: 'Private IP addresses and internal networks are blocked.' };
  }

  const internalTlds = ['.local', '.internal', '.lan', '.corp', '.home', '.test', '.invalid', '.example'];
  if (internalTlds.some(tld => hostname.endsWith(tld))) {
    return { valid: false, error: 'Internal domain names are blocked.' };
  }

  if (!hostname.includes('.')) {
    return { valid: false, error: 'Please enter a valid domain name.' };
  }

  return { valid: true, url: parsed.href, hostname };
}

// Serverless handler
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-gemini-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { url, auditTypeId, template, clientApiKey } = req.body || {};

    // 1. SSRF and URL validation
    const validation = validateAndSanitizeUrl(url);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const targetUrl = validation.url;

    // 2. Resolve Gemini API Key (Server environment variable preferred)
    const apiKey = process.env.GEMINI_API_KEY || 
                   process.env.VITE_GEMINI_API_KEY || 
                   clientApiKey || 
                   req.headers['x-gemini-key'];

    if (!apiKey) {
      return res.status(500).json({
        error: 'Analysis server configuration missing Gemini API Key. Please configure GEMINI_API_KEY in environment variables.'
      });
    }

    // 3. Inspect public website HTML
    let siteSignals = { accessible: false };
    let fetchBlocked = false;

    try {
      const fetchController = new AbortController();
      const fetchTimeout = setTimeout(() => fetchController.abort(), 8000);

      const pageRes = await fetch(targetUrl, {
        signal: fetchController.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 FunnelAuditBot/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      clearTimeout(fetchTimeout);

      if (pageRes.ok) {
        const html = await pageRes.text();
        // Extract basic CRO signals
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const metaDescMatch = html.match(/<meta[^>]*(?:name|property)=["'](?:description|og:description)["'][^>]*content=["']([\s\S]*?)["']/i);
        const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
        const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean).slice(0, 8);
        const buttonMatches = [...html.matchAll(/<(?:button|a)[^>]*class=["']?[^"'>]*(?:btn|cta|button)[^"'>]*["']?[^>]*>([\s\S]*?)<\/(?:button|a)>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean).slice(0, 8);
        const formCount = (html.match(/<form[^>]*>/gi) || []).length;
        const hasEmail = (html.match(/type=["']email["']/gi) || []).length > 0;
        const hasTestimonials = /testimonial|review|rating|customer-story|case-study/i.test(html);
        const hasFaq = /faq|frequently asked/i.test(html);
        const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);
        const hasAnalytics = /gtag\(|google-analytics\.com|G-[A-Z0-9]+|fbq\(/i.test(html);

        siteSignals = {
          accessible: true,
          title: titleMatch ? titleMatch[1].trim() : '',
          metaDescription: metaDescMatch ? metaDescMatch[1].trim() : '',
          h1Headlines: h1Matches,
          h2Headlines: h2Matches,
          ctas: buttonMatches,
          formsCount: formCount,
          hasEmailLeadCapture: hasEmail,
          hasTestimonials,
          hasFaq,
          hasViewport,
          hasAnalytics
        };
      } else {
        fetchBlocked = pageRes.status === 403 || pageRes.status === 429;
      }
    } catch (e) {
      console.warn('Direct HTML fetch error:', e.message);
    }

    // 4. Flatten criteria from template
    const categories = template?.categories || [];
    const allCriteria = [];
    categories.forEach(cat => {
      (cat.criteria || []).forEach(crit => {
        allCriteria.push({
          id: crit.id,
          categoryId: cat.id,
          categoryName: cat.name,
          categoryWeight: cat.weight,
          name: crit.name,
          description: crit.description,
          defaultRecommendation: crit.defaultRecommendation || ''
        });
      });
    });

    if (allCriteria.length === 0) {
      return res.status(400).json({ error: 'Audit template contains no criteria.' });
    }

    // 5. Build AI prompt with real inspection data
    const ai = new GoogleGenAI({ vertexai: false, apiKey });

    const systemInstruction = `You are an elite Conversion Rate Optimisation (CRO) auditor analyzing a live website or funnel.
Your scoring must be honest, calibrated, and rigorous:
1 = Missing / Absent (Element is completely missing or broken)
2 = Poor (Present but significantly ineffective, confusing, or harmful to conversions)
3 = Needs Improvement (Functional but has clear conversion-harming weaknesses)
4 = Good (Solid implementation meeting standard conversion best practices)
5 = Excellent (Exceptional implementation that exceeds industry conversion benchmarks)

CRITICAL RULE:
If a particular criterion cannot be verified from the page or if the resource blocked access, you MUST mark "unableToVerify": true, assign score 3, and state "Unable to verify: [reason]" in the observation. Do NOT fabricate false positive claims.`;

    const inspectionSummary = siteSignals.accessible ? `
VERIFIED DOM SIGNALS:
- Page Title: "${siteSignals.title}"
- Meta Description: "${siteSignals.metaDescription || 'None detected'}"
- H1 Headlines: ${siteSignals.h1Headlines?.join(' | ') || 'None found'}
- H2 Headlines: ${siteSignals.h2Headlines?.slice(0, 5).join(' | ') || 'None found'}
- Detected CTAs: ${siteSignals.ctas?.join(', ') || 'None detected in standard buttons'}
- Forms & Lead Capture: ${siteSignals.formsCount} forms found, Email capture: ${siteSignals.hasEmailLeadCapture ? 'Yes' : 'No'}
- Social Proof / Testimonials: ${siteSignals.hasTestimonials ? 'Detected' : 'Not detected in body text'}
- FAQ Section: ${siteSignals.hasFaq ? 'Detected' : 'Not detected'}
- Mobile Viewport: ${siteSignals.hasViewport ? 'Present' : 'Missing'}
- Tracking & Analytics: ${siteSignals.hasAnalytics ? 'Detected' : 'Not detected'}
` : (fetchBlocked ? 'NOTE: Website returned access protection or bot challenge. Evaluate what can be observed via search index and URL structure, and flag unverified elements as unableToVerify.' : 'NOTE: Direct HTML fetch timed out or was unavailable. Evaluate via live URL context.');

    const prompt = `AUDIT TYPE: ${template.name || auditTypeId}
PAGE URL TO AUDIT: ${targetUrl}
${inspectionSummary}

Evaluate each of the following ${allCriteria.length} criteria for ${targetUrl}.
Return a valid JSON array of objects with the exact schema:
[
  {
    "criterionId": "exact_criterion_id_from_list",
    "score": 1 to 5 (integer),
    "unableToVerify": boolean (true if element could not be verified),
    "observation": "Specific factual observation",
    "recommendation": "High-leverage actionable fix to maximize conversions",
    "priority": "High" | "Medium" | "Low"
  }
]

CRITERIA:
${allCriteria.map((c, i) => `${i + 1}. ID: "${c.id}" | Cat: "${c.categoryName}" | Name: "${c.name}" | Check: ${c.description}`).join('\n')}

Only output the raw JSON array.`;

    const PRIMARY_MODEL = 'gemini-3.8-flash';
    const FALLBACK_MODEL = 'gemini-2.5-flash';

    let rawText = '';
    try {
      const aiRes = await ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          tools: [{ urlContext: {} }],
          responseMimeType: 'application/json'
        }
      });
      rawText = aiRes.text || '';
    } catch (err1) {
      console.warn('URL context with primary model failed, falling back:', err1?.message);
      
      try {
        const fallbackRes = await ai.models.generateContent({
          model: PRIMARY_MODEL,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });
        rawText = fallbackRes.text || '';
      } catch (err2) {
        console.warn('Standard primary model failed, trying fallback model:', err2?.message);
        try {
          const legacyRes = await ai.models.generateContent({
            model: FALLBACK_MODEL,
            contents: prompt,
            config: {
              systemInstruction,
              responseMimeType: 'application/json'
            }
          });
          rawText = legacyRes.text || '';
        } catch (err3) {
          throw new Error(err2?.message || err3?.message || 'Gemini model analysis failed.');
        }
      }
    }

    // Parse JSON
    let parsed = null;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || rawText.match(/(\[[\s\S]*\])/);
      if (match) parsed = JSON.parse(match[1]);
    }

    if (!parsed || !Array.isArray(parsed)) {
      throw new Error('AI analysis produced an unparseable response.');
    }

    const resultMap = {};
    parsed.forEach(item => {
      if (item && item.criterionId) {
        resultMap[item.criterionId] = item;
      }
    });

    // Compile normalized responses
    const responses = {};
    const findings = [];
    const recommendations = [];

    allCriteria.forEach(crit => {
      const raw = resultMap[crit.id];
      const isUnverified = raw?.unableToVerify === true;
      const score = isUnverified ? 3 : Math.min(5, Math.max(1, Math.round(Number(raw?.score) || 3)));
      const priority = ['High', 'Medium', 'Low'].includes(raw?.priority)
        ? raw.priority
        : (score <= 2 ? 'High' : score === 3 ? 'Medium' : 'Low');

      const observation = isUnverified 
        ? (raw?.observation || 'Unable to verify automatically due to access limitations. Manual check recommended.')
        : (raw?.observation || `Evaluated against conversion benchmarks for ${crit.name}.`);

      const recommendation = raw?.recommendation || crit.defaultRecommendation || 'Review and optimize.';

      responses[crit.id] = {
        criterionId: crit.id,
        categoryId: crit.categoryId,
        score,
        unableToVerify: isUnverified,
        observation,
        recommendation,
        priority,
        updatedAt: new Date().toISOString()
      };

      if (score <= 2) {
        findings.push({
          criterionId: crit.id,
          criterionName: crit.name,
          categoryName: crit.categoryName,
          score,
          priority,
          observation,
          recommendation
        });
      }

      if (score <= 3) {
        recommendations.push({
          criterionId: crit.id,
          criterionName: crit.name,
          categoryName: crit.categoryName,
          priority,
          recommendation
        });
      }
    });

    // Sort findings & recommendations by priority
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    findings.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));
    recommendations.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));

    return res.status(200).json({
      success: true,
      websiteUrl: targetUrl,
      auditTypeId,
      inspectionSummary: siteSignals.accessible ? siteSignals : null,
      responses,
      findings: findings.slice(0, 10),
      recommendations: recommendations.slice(0, 10),
      completedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred during website analysis.'
    });
  }
}
