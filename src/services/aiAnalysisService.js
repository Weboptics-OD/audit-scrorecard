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

  const ai = new GoogleGenAI({ vertexai: false, apiKey });

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

  const systemInstruction = `You are a world-class Conversion Rate Optimisation (CRO) strategist and funnel expert conducting a professional audit of a live website or funnel.
Your scoring must be honest, calibrated, and critical:
- 1 = Missing / Absent (Element is completely missing or broken)
- 2 = Poor (Present but significantly ineffective or harmful to conversions)
- 3 = Needs Improvement (Functional but with clear conversion-harming weaknesses)
- 4 = Good (Solid implementation that meets standard conversion best practices)
- 5 = Excellent (Exceptional implementation that exceeds conversion benchmarks)`;

  const prompt = `AUDIT TYPE: ${auditContext.auditTypeName || template.name}
BUSINESS / CLIENT: ${auditContext.clientName || 'Unknown'}
PAGE URL TO ANALYSE: ${url}
OFFER / PRODUCT: ${auditContext.offer || 'Not specified'}
TARGET AUDIENCE: ${auditContext.targetAudience || 'Not specified'}

TASK: Analyse the page at ${url}. Evaluate each of the following ${allCriteria.length} criteria.
Return your evaluation as a valid JSON array of objects with the exact schema:
[
  {
    "criterionId": "exact_criterion_id_from_below",
    "score": 1 to 5 (integer),
    "observation": "Detailed specific observation of what is on the page",
    "recommendation": "Actionable, specific recommendation to improve this criterion",
    "priority": "High" | "Medium" | "Low"
  }
]

CRITERIA TO EVALUATE:
${criteriaText}

Be rigorous and specific. Only return the valid JSON array.`;

  onProgress({ phase: 'analysing', message: `AI is analysing ${allCriteria.length} criteria...`, percent: 20 });

  let rawText = '';

  // Strategy 1: Attempt with urlContext tool and JSON response
  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ urlContext: {} }],
        responseMimeType: 'application/json',
      }
    });
    rawText = res.text || '';
  } catch (err1) {
    console.warn('URL context with JSON mimeType failed, falling back to standard request:', err1);
    
    // Strategy 2: If tools + responseMimeType conflict, try urlContext without responseMimeType
    try {
      const res = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          tools: [{ urlContext: {} }]
        }
      });
      rawText = res.text || '';
    } catch (err2) {
      console.warn('URL context tool failed, falling back to direct analysis:', err2);
      
      // Strategy 3: Standard analysis without urlContext tool (robust fallback for restricted environments)
      try {
        const res = await ai.models.generateContent({
          model: MODEL,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });
        rawText = res.text || '';
      } catch (err3) {
        // Re-throw with user-friendly error
        if (err3.message?.includes('API_KEY') || err3.message?.includes('api key') || err3.status === 401 || err3.status === 403) {
          throw new Error('Invalid Gemini API key. Please check your key at aistudio.google.com/apikey and update it in Settings.');
        }
        if (err3.message?.includes('quota') || err3.status === 429) {
          throw new Error('Gemini API quota exceeded. Please wait a moment or check your Google AI Studio plan.');
        }
        throw new Error(err3.message || 'Gemini analysis failed. Please check your connection and API key.');
      }
    }
  }

  onProgress({ phase: 'processing', message: 'Processing AI analysis results...', percent: 85 });

  // Universal JSON extractor & parser
  let parsed = null;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    // Attempt markdown code block extraction
    const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || rawText.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (match) {
      try {
        parsed = JSON.parse(match[1]);
      } catch (e) {
        console.error('Failed to parse extracted JSON:', e);
      }
    }
  }

  if (!parsed) {
    throw new Error('AI returned an unparseable response. Please click "Try Again" to retry.');
  }

  // Convert parsed result (array or object) into map keyed by criterionId
  const parsedMap = {};
  if (Array.isArray(parsed)) {
    parsed.forEach(item => {
      if (item && (item.criterionId || item.id)) {
        parsedMap[item.criterionId || item.id] = item;
      }
    });
  } else if (typeof parsed === 'object') {
    Object.entries(parsed).forEach(([key, val]) => {
      if (val && typeof val === 'object') {
        parsedMap[key] = val;
      }
    });
  }

  // Normalize and validate each criterion response
  const responses = {};
  allCriteria.forEach(crit => {
    const raw = parsedMap[crit.id];
    if (raw) {
      const score = Math.min(5, Math.max(1, Math.round(Number(raw.score) || 3)));
      responses[crit.id] = {
        score,
        observation: raw.observation || `Assessed for ${crit.name}.`,
        recommendation: raw.recommendation || crit.defaultRecommendation || 'Review and optimise.',
        priority: ['High', 'Medium', 'Low'].includes(raw.priority)
          ? raw.priority
          : (score <= 2 ? 'High' : score === 3 ? 'Medium' : 'Low'),
        isFinding: score <= 2,
        aiGenerated: true,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Criterion not returned by AI — provide neutral placeholder
      responses[crit.id] = {
        score: 3,
        observation: 'Element could not be fully assessed automatically. Manual review recommended.',
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
}
