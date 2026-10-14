// Audit Scoring Engine & Report Intelligence

export const SCORE_LEVELS = {
  1: { value: 1, label: 'Missing', color: '#ef4444', textClass: 'text-red', bgClass: 'bg-red-soft' },
  2: { value: 2, label: 'Poor', color: '#f97316', textClass: 'text-orange', bgClass: 'bg-orange-soft' },
  3: { value: 3, label: 'Needs Improvement', color: '#eab308', textClass: 'text-amber', bgClass: 'bg-amber-soft' },
  4: { value: 4, label: 'Good', color: '#3b82f6', textClass: 'text-blue', bgClass: 'bg-blue-soft' },
  5: { value: 5, label: 'Excellent', color: '#10b981', textClass: 'text-emerald', bgClass: 'bg-emerald-soft' }
};

export const PRIORITIES = {
  High: { label: 'High', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)', weight: 3 },
  Medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', weight: 2 },
  Low: { label: 'Low', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', weight: 1 }
};

export function getScoreClassification(score) {
  const num = Math.round(score);
  if (num >= 90) {
    return {
      label: 'Excellent',
      range: '90-100',
      color: '#10b981',
      badgeClass: 'badge-emerald',
      bgClass: 'bg-emerald-gradient',
      summaryTone: 'positive',
      description: 'Exceptional conversion readiness. Minor optimizations and continuous testing recommended.'
    };
  }
  if (num >= 80) {
    return {
      label: 'Strong',
      range: '80-89',
      color: '#3b82f6',
      badgeClass: 'badge-blue',
      bgClass: 'bg-blue-gradient',
      summaryTone: 'solid',
      description: 'Solid foundational architecture with specific opportunities for high-leverage conversion lifts.'
    };
  }
  if (num >= 70) {
    return {
      label: 'Needs Improvement',
      range: '70-79',
      color: '#f59e0b',
      badgeClass: 'badge-amber',
      bgClass: 'bg-amber-gradient',
      summaryTone: 'warning',
      description: 'Noticeable conversion friction and messaging gaps preventing optimal lead and revenue flow.'
    };
  }
  if (num >= 60) {
    return {
      label: 'Weak',
      range: '60-69',
      color: '#f97316',
      badgeClass: 'badge-orange',
      bgClass: 'bg-orange-gradient',
      summaryTone: 'concern',
      description: 'Critical structural bottlenecks actively depressing user trust and conversion rates.'
    };
  }
  return {
    label: 'High Priority',
    range: '0-59',
    color: '#ef4444',
    badgeClass: 'badge-red',
    bgClass: 'bg-red-gradient',
    summaryTone: 'urgent',
    description: 'Severe conversion leaks, missing foundational elements, and urgent remediation required.'
  };
}

export function calculateAuditScores(template, responses = {}) {
  if (!template || !template.categories) {
    return {
      overallScore: 0,
      classification: getScoreClassification(0),
      totalCriteria: 0,
      completedCriteria: 0,
      remainingCriteria: 0,
      progressPercent: 0,
      categoryScores: []
    };
  }

  let totalCriteriaCount = 0;
  let completedCriteriaCount = 0;
  let categoryResults = [];
  let weightedOverallSum = 0;
  let totalWeightAccounted = 0;

  template.categories.forEach(cat => {
    const criteria = cat.criteria || [];
    const catWeight = Number(cat.weight) || 0;
    totalCriteriaCount += criteria.length;

    let scoredSum = 0;
    let scoredCount = 0;

    criteria.forEach(crit => {
      const resp = responses[crit.id];
      const scoreNum = resp ? Number(resp.score) : NaN;
      if (resp && !isNaN(scoreNum) && scoreNum >= 1 && scoreNum <= 5) {
        scoredSum += scoreNum;
        scoredCount++;
        completedCriteriaCount++;
      }
    });

    // Score out of 100 for this category based on scored items
    // (score / 5) * 100
    const rawCategoryScore = scoredCount > 0 ? (scoredSum / (scoredCount * 5)) * 100 : 0;
    const categoryScore = Math.round(rawCategoryScore * 10) / 10;
    const weightedContribution = Math.round((categoryScore * (catWeight / 100)) * 10) / 10;

    if (scoredCount > 0) {
      weightedOverallSum += weightedContribution;
      totalWeightAccounted += catWeight;
    }

    categoryResults.push({
      categoryId: cat.id,
      name: cat.name,
      weight: catWeight,
      totalCriteria: criteria.length,
      scoredCriteria: scoredCount,
      score: categoryScore,
      weightedContribution,
      isComplete: scoredCount === criteria.length && criteria.length > 0,
      classification: getScoreClassification(categoryScore)
    });
  });

  // Calculate Overall Score
  // If only part of the audit is completed, overall score reflects actual completed weight or normalized
  const overallScore = Math.min(100, Math.max(0, Math.round(weightedOverallSum)));
  const progressPercent = totalCriteriaCount > 0 
    ? Math.round((completedCriteriaCount / totalCriteriaCount) * 100) 
    : 0;

  return {
    overallScore,
    classification: getScoreClassification(overallScore),
    totalCriteria: totalCriteriaCount,
    completedCriteria: completedCriteriaCount,
    remainingCriteria: totalCriteriaCount - completedCriteriaCount,
    progressPercent,
    categoryScores: categoryResults
  };
}

export function identifyTopOpportunities(template, responses = {}, limit = 5) {
  if (!template || !template.categories) return [];

  const opportunities = [];

  template.categories.forEach(cat => {
    const catWeight = Number(cat.weight) || 10;
    (cat.criteria || []).forEach(crit => {
      const resp = responses[crit.id];
      if (!resp) return;

      const score = Number(resp.score);
      // Criteria with low score (1 or 2) or High priority
      if (score === 1 || score === 2 || resp.priority === 'High') {
        const priorityWeight = resp.priority === 'High' ? 3 : (resp.priority === 'Medium' ? 2 : 1);
        // Impact formula: missing/poor score (5 - score) * category weight * priority
        const impactScore = (5 - (score || 1)) * (catWeight / 10) * priorityWeight;

        opportunities.push({
          criterionId: crit.id,
          criterionName: crit.name,
          categoryId: cat.id,
          categoryName: cat.name,
          categoryWeight: catWeight,
          score: score || 1,
          scoreLabel: SCORE_LEVELS[score]?.label || 'Needs Review',
          priority: resp.priority || 'High',
          observation: resp.observation || crit.description || 'Deficiency identified during audit.',
          recommendation: resp.recommendation || crit.defaultRecommendation || 'Implement corrective optimization.',
          impactScore
        });
      }
    });
  });

  // Sort by highest impact first
  opportunities.sort((a, b) => b.impactScore - a.impactScore);
  return opportunities.slice(0, limit);
}

export function generatePriorityActionPlan(template, responses = {}) {
  const actions = {
    High: [],
    Medium: [],
    Low: []
  };

  if (!template || !template.categories) return actions;

  template.categories.forEach(cat => {
    (cat.criteria || []).forEach(crit => {
      const resp = responses[crit.id];
      if (!resp) return;

      const score = Number(resp.score);
      // Include items scored 1, 2, or 3, or explicitly flagged with a priority or recommendation
      if (score <= 3 || resp.priority) {
        const priority = resp.priority || (score === 1 ? 'High' : (score === 2 ? 'Medium' : 'Low'));
        const actionItem = {
          criterionId: crit.id,
          criterionName: crit.name,
          categoryId: cat.id,
          categoryName: cat.name,
          score: score || 0,
          scoreLabel: SCORE_LEVELS[score]?.label || 'Unrated',
          issue: resp.observation || `Underperforming ${crit.name.toLowerCase()} requiring strategic refinement.`,
          recommendation: resp.recommendation || crit.defaultRecommendation || 'Refactor according to standard conversion best practices.',
          screenshot: resp.screenshot || null
        };

        if (actions[priority]) {
          actions[priority].push(actionItem);
        } else {
          actions.Medium.push(actionItem);
        }
      }
    });
  });

  return actions;
}

export function generateExecutiveSummary(audit, template, scoreData) {
  if (!audit || !scoreData) return '';

  const clientName = audit.clientName || 'the client';
  const score = scoreData.overallScore;
  const classification = scoreData.classification.label;
  
  // Identify strongest and weakest categories
  const sortedCategories = [...scoreData.categoryScores].sort((a, b) => b.score - a.score);
  const strongest = sortedCategories.filter(c => c.scoredCriteria > 0).slice(0, 2);
  const weakest = sortedCategories.filter(c => c.scoredCriteria > 0).slice(-2).reverse();

  const strongNames = strongest.map(s => `**${s.name}** (${s.score}/100)`).join(' and ');
  const weakNames = weakest.map(w => `**${w.name}** (${w.score}/100)`).join(' and ');

  let summary = `This comprehensive **${audit.auditTypeName || 'Digital'} Audit** for **${clientName}** evaluates conversion readiness across all core touchpoints. Overall, the property achieved a score of **${score}/100**, placing it in the **"${classification}"** tier.\n\n`;

  if (strongest.length > 0) {
    summary += `### Core Strengths\nPrimary operational and messaging strengths were observed in ${strongNames}, demonstrating solid foundational design and strategic intent in these areas.\n\n`;
  }

  if (weakest.length > 0) {
    summary += `### Critical Areas for Growth\nImmediate conversion bottlenecks and friction points were identified in ${weakNames}. Addressing these low-scoring categories represents the highest-leverage opportunity to increase qualified lead flow and revenue performance.\n\n`;
  }

  summary += `### Strategic Recommendation\nBy executing the prioritized action plan outlined in this report—beginning with the high-impact fixes identified in the executive roadmap—**${clientName}** can systematically eliminate friction and elevate overall conversion performance by an estimated 15-30%.`;

  return summary;
}
