/**
 * AI Audit Analysis Service
 * Uses Gemini with URL Context to automatically score all audit criteria
 * by reading and analyzing the live website/landing page/funnel.
 */
import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-2.5-flash';

/**
 * Analyze a URL and score all criteria in a template using Gemini AI.
 * @param {string} apiKey - Gemini API key
 * @param {string} url - The website/landing page URL to analyze
 * @param {object} template - The audit template with categories and criteria
 * @param {object} auditContext - Extra context: clientName, offer, targetAudience, auditTypeName
 * @param {function} onProgress - Called with { phase, message, percent } as analysis progresses
 * @returns {object} - { responses: { criterionId: { score, observation, recommendation, priority } } }
 */
export async function runAIAuditAnalysis(apiKey, url, template, auditContext = {}, onProgress = () => {}) {
  if (!apiKey) throw new Error('Gemini API key is required. Add it in Settings.');
  if (!url) throw new Error('A website URL is required to run AI analysis.');
  if (!template?.categories?.length) throw new Error('No audit template found.');

  const ai = new GoogleGenAI({ apiKey });

  // Flatten all criteria across all categories
  const allCriteria = [];
  template.categories.forEach(cat => {
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

  onProgress({ phase: 'reading', message: `Reading page at ${url}...`, percent: 5 });

  // Build the criteria list for the prompt
  const criteriaText = allCriteria.map((c, i) =>
    `${i + 1}. ID: "${c.id}" | Category: "${c.categoryName}" (${c.categoryWeight}% weight) | Criterion: "${c.name}" | What to evaluate: ${c.description}`
  ).join('\n');

  const prompt = `You are a world-class Conversion Rate Optimisation (CRO) strategist and funnel expert conducting a professional audit.

AUDIT TYPE: ${auditContext.auditTypeName || template.name}
BUSINESS/CLIENT: ${auditContext.clientName || 'Unknown'}
PAGE URL TO ANALYSE: ${url}
OFFER / PRODUCT: ${auditContext.offer || 'Not specified'}
TARGET AUDIENCE: ${auditContext.targetAudience || 'Not specified'}

TASK: Thoroughly analyse the page at the URL above. Evaluate every criterion below against professional conversion benchmarks and return your scores.

SCORING SCALE (be honest and critical — do NOT default everything to 4 or 5):
- 1 = Missing / Absent — The element is completely missing or broken
- 2 = Poor — Present but significantly ineffective or harmful to conversions  
- 3 = Needs Improvement — Functional but with clear conversion-harming weaknesses
- 4 = Good — Solid implementation that meets standard conversion best practices
- 5 = Excellent — Exceptional implementation that exceeds conversion benchmarks

CRITERIA TO EVALUATE (${allCriteria.length} total):
${criteriaText}

RESPONSE FORMAT: Return a JSON object where each key is a criterion ID and the value contains your professional analysis. Be specific and actionable in your observations and recommendations. Reference actual content you see on the page.`;

  onProgress({ phase: 'analysing', message: `AI is analysing ${allCriteria.length} criteria...`, percent: 20 });

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        tools: [{ urlContext: {} }],
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'OBJECT',
          description: 'Audit scores for each criterion keyed by criterion ID',
          additionalProperties: {
            type: 'OBJECT',
            properties: {
              score: {
                type: 'INTEGER',
                description: 'Score from 1 (Missing) to 5 (Excellent)',
              },
              observation: {
                type: 'STRING',
                description: 'What was observed on the page for this criterion',
              },
              recommendation: {
                type: 'STRING',
                description: 'Actionable recommendation to improve this criterion',
              },
              priority: {
                type: 'STRING',
                description: 'Priority level: High, Medium, or Low',
              }
            },
            required: ['score', 'observation', 'recommendation', 'priority']
          }
        }
      }
    });

    onProgress({ phase: 'processing', message: 'Processing AI analysis results...', percent: 85 });

    let parsed;
    try {
      parsed = JSON.parse(response.text);
    } catch {
      // Try to extract JSON from text if not clean
      const match = response.text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('AI returned an unparseable response. Please try again.');
      }
    }

    // Normalize and validate each criterion response
    const responses = {};
    allCriteria.forEach(crit => {
      const raw = parsed[crit.id];
      if (raw) {
        const score = Math.min(5, Math.max(1, Number(raw.score) || 3));
        responses[crit.id] = {
          score,
          observation: raw.observation || `AI analysis: ${crit.description}`,
          recommendation: raw.recommendation || crit.defaultRecommendation || 'Review and optimise.',
          priority: ['High', 'Medium', 'Low'].includes(raw.priority)
            ? raw.priority
            : (score <= 2 ? 'High' : score === 3 ? 'Medium' : 'Low'),
          isFinding: score <= 2,
          aiGenerated: true,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Criterion not returned by AI — give a neutral score
        responses[crit.id] = {
          score: 3,
          observation: 'Could not be automatically assessed for this page. Manual review recommended.',
          recommendation: crit.defaultRecommendation || 'Review manually against conversion benchmarks.',
          priority: 'Medium',
          isFinding: false,
          aiGenerated: true,
          updatedAt: new Date().toISOString()
        };
      }
    });

    onProgress({ phase: 'done', message: `Analysis complete — ${allCriteria.length} criteria scored!`, percent: 100 });

    return { responses, totalScored: allCriteria.length };

  } catch (err) {
    // Handle common API errors with friendly messages
    if (err.message?.includes('API_KEY') || err.message?.includes('api key') || err.status === 401 || err.status === 403) {
      throw new Error('Invalid API key. Check your Gemini API key in Settings.');
    }
    if (err.message?.includes('quota') || err.status === 429) {
      throw new Error('API quota exceeded. Try again in a moment or check your billing.');
    }
    if (err.message?.includes('urlContext') || err.message?.includes('URL')) {
      throw new Error(`Could not access the URL. Make sure it is publicly accessible: ${url}`);
    }
    throw err;
  }
}
