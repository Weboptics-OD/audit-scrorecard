/**
 * Client Audit Service
 * Orchestrates self-service audit execution, session isolation, and real-time progress.
 */
import { validateAuditUrl } from './securityValidator';
import { calculateAuditScores, getScoreClassification, identifyTopOpportunities, generatePriorityActionPlan } from '../data/scoringEngine';
import { runAIAuditAnalysis } from './aiAnalysisService';
import { fetchAndInspectSite } from './siteInspector';

// Generate secure unique session identifier
export function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `session_${crypto.randomUUID()}`;
  }
  const rand = Math.random().toString(36).substring(2, 10);
  const time = Date.now().toString(36);
  return `session_${rand}_${time}`;
}

const STORAGE_SESSION_KEY = 'fas_client_active_session';

/**
 * Save active client session (isolated from audit history).
 */
export function saveActiveClientSession(sessionData) {
  try {
    sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
  } catch (e) {
    console.warn('Session storage error:', e);
  }
}

/**
 * Retrieve active client session.
 */
export function getActiveClientSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clear active client session (used when starting a new audit).
 */
export function clearActiveClientSession() {
  try {
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
  } catch (e) {
    console.warn('Clear session error:', e);
  }
}

/**
 * Execute Self-Service Website Audit.
 * 
 * @param {object} params
 * @param {string} params.url - Website URL entered by user
 * @param {string} params.auditTypeId - 'landing-page-audit' | 'sales-funnel-audit' | 'website-conversion-audit'
 * @param {object} params.template - The selected audit template object
 * @param {function} params.onProgress - Callback ({ step, stepIndex, totalSteps, message, percent })
 * @returns {Promise<object>} Complete client audit session data
 */
export async function executeClientAudit({ url, auditTypeId, template, onProgress = () => {} }) {
  // 1. Security & SSRF Validation
  const validation = validateAuditUrl(url);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid website URL.');
  }

  const normalizedUrl = validation.normalizedUrl;
  const sessionId = generateSessionId();

  // Progress Steps definition
  const STEPS = [
    { title: 'Checking page structure & technical signals', weight: 20 },
    { title: 'Analyzing headline and messaging', weight: 40 },
    { title: 'Checking calls to action & conversion friction', weight: 60 },
    { title: 'Evaluating trust elements & social proof', weight: 80 },
    { title: 'Reviewing conversion opportunities & computing scorecard', weight: 95 }
  ];

  // Helper to notify progress
  const emitProgress = (stepIndex, customMessage = null) => {
    const step = STEPS[stepIndex] || STEPS[STEPS.length - 1];
    onProgress({
      stepIndex,
      totalSteps: STEPS.length,
      stepTitle: step.title,
      message: customMessage || step.title,
      percent: step.weight,
      completedSteps: STEPS.slice(0, stepIndex).map(s => s.title)
    });
  };

  // Step 1: Initial connection & validation
  emitProgress(0, 'Validating URL & establishing connection...');
  await new Promise(r => setTimeout(r, 400));

  let auditResult = null;
  let responses = {};
  let siteInspection = null;

  // Step 2: Try Serverless API endpoint first
  emitProgress(0, 'Inspecting page structure and meta elements...');
  
  // Check if admin has saved a Gemini API key in local storage as fallback
  const fallbackKey = typeof localStorage !== 'undefined' 
    ? (localStorage.getItem('fas_gemini_api_key') || '') 
    : '';

  let apiSuccess = false;
  try {
    const apiRes = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(fallbackKey ? { 'x-gemini-key': fallbackKey } : {})
      },
      body: JSON.stringify({
        url: normalizedUrl,
        auditTypeId,
        template,
        clientApiKey: fallbackKey
      })
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && data.responses) {
        responses = data.responses;
        siteInspection = data.inspectionSummary;
        apiSuccess = true;
      }
    }
  } catch (apiErr) {
    console.warn('API /api/analyze unavailable, falling back to local analyzer:', apiErr.message);
  }

  // If serverless API did not complete (e.g. offline dev or static fallback), use client-side analyzer
  if (!apiSuccess) {
    emitProgress(1, 'Inspecting headline, hero messaging, and content hierarchy...');
    const localInspection = await fetchAndInspectSite(normalizedUrl);
    siteInspection = localInspection.signals;

    emitProgress(2, 'Analyzing calls to action and friction points...');
    await new Promise(r => setTimeout(r, 300));

    emitProgress(3, 'Evaluating trust badges, reviews, and proof...');

    // Run client-side AI analysis
    const aiResult = await runAIAuditAnalysis(
      fallbackKey || import.meta.env.VITE_GEMINI_API_KEY,
      normalizedUrl,
      template,
      {
        clientName: validation.cleanDisplayUrl,
        auditTypeName: template.name
      },
      (p) => {
        if (p.percent) {
          onProgress(prev => ({
            ...prev,
            message: p.message,
            percent: Math.min(90, Math.max(50, p.percent))
          }));
        }
      }
    );

    responses = aiResult.responses;
  }

  // Step 5: Calculate overall scorecard & recommendations
  emitProgress(4, 'Computing weighted conversion scorecard & action plan...');
  await new Promise(r => setTimeout(r, 400));

  const scoreData = calculateAuditScores(template, responses);
  const topOpportunities = identifyTopOpportunities(template, responses, 6);
  const actionPlan = generatePriorityActionPlan(template, responses);

  // Compile Key Findings (criteria with score <= 2 or high priority issues)
  const findings = [];
  template.categories.forEach(cat => {
    (cat.criteria || []).forEach(crit => {
      const resp = responses[crit.id];
      if (resp && (resp.score <= 2 || resp.priority === 'High')) {
        findings.push({
          id: `find_${crit.id}`,
          criterionId: crit.id,
          criterionName: crit.name,
          categoryName: cat.name,
          score: resp.score,
          priority: resp.priority || (resp.score <= 2 ? 'High' : 'Medium'),
          observation: resp.observation,
          recommendation: resp.recommendation,
          unableToVerify: !!resp.unableToVerify
        });
      }
    });
  });

  // Sort findings by priority (High first)
  const priorityMap = { High: 1, Medium: 2, Low: 3 };
  findings.sort((a, b) => (priorityMap[a.priority] || 2) - (priorityMap[b.priority] || 2));

  // Build the complete isolated Client Audit Session
  const completedAt = new Date().toISOString();
  auditResult = {
    session: {
      id: sessionId,
      websiteUrl: normalizedUrl,
      cleanDisplayUrl: validation.cleanDisplayUrl,
      auditType: template.name,
      auditTypeId: template.id,
      status: 'Completed',
      createdAt: completedAt,
      completedAt,
      overallScore: scoreData.overallScore,
      scoreClassification: scoreData.classification
    },
    template: {
      id: template.id,
      name: template.name,
      description: template.description,
      categories: template.categories
    },
    scoreData,
    responses,
    findings: findings.slice(0, 8),
    topOpportunities,
    actionPlan,
    siteInspection
  };

  // Save isolated session in sessionStorage
  saveActiveClientSession(auditResult);

  // Notify 100% complete
  onProgress({
    stepIndex: STEPS.length,
    totalSteps: STEPS.length,
    stepTitle: 'Analysis Complete',
    message: 'Scorecard ready!',
    percent: 100,
    completedSteps: STEPS.map(s => s.title)
  });

  return auditResult;
}
