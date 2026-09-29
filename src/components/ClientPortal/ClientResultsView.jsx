import React, { useState } from 'react';
import { 
  Globe, 
  Calendar, 
  Layers, 
  Download, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Sparkles, 
  Award,
  Zap,
  ShieldCheck,
  ExternalLink,
  Info
} from 'lucide-react';
import { SCORE_LEVELS, PRIORITIES } from '../../data/scoringEngine';

export default function ClientResultsView({ 
  auditSession, 
  onDownloadReport, 
  onStartAnotherAudit, 
  isExportingPdf 
}) {
  const { session, template, scoreData, responses, findings, topOpportunities, actionPlan } = auditSession;
  const [expandedCategories, setExpandedCategories] = useState(() => {
    // Default open first category
    return { [template.categories[0]?.id]: true };
  });

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const expandAll = () => {
    const all = {};
    template.categories.forEach(c => { all[c.id] = true; });
    setExpandedCategories(all);
  };

  const collapseAll = () => {
    setExpandedCategories({});
  };

  const classification = scoreData.classification;
  const overallScore = Math.round(scoreData.overallScore);

  // Formatted date
  const auditDateStr = new Date(session.completedAt || session.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="client-results-container">
      {/* Top Banner & Audit Session Meta */}
      <div className="results-top-bar">
        <div className="meta-left">
          <div className="site-url-display">
            <Globe size={18} color="var(--primary-light)" />
            <a 
              href={session.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="url-link"
              title="Open audited website"
            >
              <span className="truncate">{session.websiteUrl}</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="audit-type-pill">
            <Layers size={14} />
            <span>{session.auditType}</span>
          </div>

          <div className="audit-date-pill">
            <Calendar size={14} />
            <span>{auditDateStr}</span>
          </div>
        </div>

        <div className="meta-actions no-print">
          <button 
            className="btn btn-primary"
            onClick={onDownloadReport}
            disabled={isExportingPdf}
          >
            <Download size={16} />
            <span>{isExportingPdf ? 'Generating PDF...' : 'Download Your Audit Report'}</span>
          </button>

          <button 
            className="btn btn-secondary"
            onClick={onStartAnotherAudit}
          >
            <RotateCcw size={16} />
            <span>Start Another Audit</span>
          </button>
        </div>
      </div>

      {/* Main Scorecard Overview Hero */}
      <div className="results-hero-card card">
        <div className="hero-score-grid">
          {/* Left Column: Big Overall Score */}
          <div className="overall-score-box">
            <span className="score-supertitle">Overall Conversion Score</span>
            <div className="score-number-display">
              <span className="current-score" style={{ color: classification.color }}>
                {overallScore}
              </span>
              <span className="max-score">/ 100</span>
            </div>

            <div className="classification-badge-wrapper">
              <span className={`badge ${classification.badgeClass}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                {classification.label}
              </span>
            </div>

            <p className="score-verdict-text">
              {classification.description}
            </p>
          </div>

          {/* Right Column: Key Takeaway Summary */}
          <div className="score-summary-box">
            <div className="summary-header">
              <div className="summary-icon">
                <Sparkles size={20} color="var(--primary-light)" />
              </div>
              <div>
                <h3>Executive Conversion Assessment</h3>
                <span className="summary-subtitle">Evaluation based on {template.categories.length} core categories</span>
              </div>
            </div>

            <div className="summary-stats-pills">
              <div className="stat-pill">
                <span className="stat-value">{template.categories.length}</span>
                <span className="stat-label">Categories Audited</span>
              </div>
              <div className="stat-pill">
                <span className="stat-value" style={{ color: 'var(--red)' }}>
                  {findings.length}
                </span>
                <span className="stat-label">Critical Leaks Found</span>
              </div>
              <div className="stat-pill">
                <span className="stat-value" style={{ color: 'var(--emerald)' }}>
                  {topOpportunities.length}
                </span>
                <span className="stat-label">High-Impact Wins</span>
              </div>
            </div>

            <p className="summary-paragraph">
              This automated diagnostic evaluated your website's messaging clarity, visual hierarchy, 
              call-to-action friction, and credibility elements. Addressing the high-priority conversion leaks below 
              will provide immediate upside to visitor engagement and conversion rates.
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown Grid */}
      <div className="results-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Category Breakdown</h2>
            <p className="section-desc">Weighted scores across each critical conversion pillar</p>
          </div>
        </div>

        <div className="category-scores-grid">
          {scoreData.categoryScores.map((cat) => {
            const catScore = Math.round(cat.score);
            let barColor = 'var(--emerald)';
            let badgeClass = 'badge-emerald';
            let label = 'Good';

            if (catScore < 60) {
              barColor = 'var(--red)';
              badgeClass = 'badge-red';
              label = 'Critical';
            } else if (catScore < 70) {
              barColor = 'var(--orange)';
              badgeClass = 'badge-orange';
              label = 'Weak';
            } else if (catScore < 80) {
              barColor = 'var(--amber)';
              badgeClass = 'badge-amber';
              label = 'Needs Improvement';
            } else if (catScore < 90) {
              barColor = 'var(--primary-light)';
              badgeClass = 'badge-blue';
              label = 'Solid';
            } else {
              label = 'Excellent';
            }

            return (
              <div key={cat.categoryId} className="category-card card">
                <div className="cat-card-header">
                  <div>
                    <h4 className="cat-card-title">{cat.categoryName}</h4>
                    <span className="cat-card-weight">{cat.weight}% of Total Score</span>
                  </div>
                  <span className={`badge ${badgeClass}`}>{label}</span>
                </div>

                <div className="cat-score-row">
                  <span className="cat-score-num" style={{ color: barColor }}>
                    {catScore}
                  </span>
                  <span className="cat-score-den">/ 100</span>
                </div>

                <div className="cat-progress-track">
                  <div 
                    className="cat-progress-bar" 
                    style={{ width: `${catScore}%`, background: barColor }}
                  />
                </div>

                <div className="cat-card-meta">
                  <span>{cat.criteriaCount} criteria analyzed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High-Priority Conversion Leaks (Findings) */}
      {findings.length > 0 && (
        <div className="results-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>
                Key Findings & Conversion Leaks
              </h2>
              <p className="section-desc">Identified weaknesses actively depressing conversion rates</p>
            </div>
            <span className="badge badge-red" style={{ padding: '6px 12px' }}>
              {findings.length} Action Items
            </span>
          </div>

          <div className="findings-list-grid">
            {findings.map((item, idx) => (
              <div key={item.id || idx} className="finding-card card">
                <div className="finding-header">
                  <div className="finding-title-row">
                    <span className="finding-cat">{item.categoryName}</span>
                    <span className={`priority-tag priority-${item.priority.toLowerCase()}`}>
                      {item.priority} Priority
                    </span>
                  </div>
                  <h4 className="finding-name">{item.criterionName}</h4>
                </div>

                <div className="finding-body">
                  <div className="observation-box">
                    <span className="box-label">Observation:</span>
                    <p>{item.observation}</p>
                  </div>

                  <div className="recommendation-box">
                    <span className="box-label">Recommended Fix:</span>
                    <p>{item.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Action Roadmap */}
      {actionPlan && (actionPlan.High?.length > 0 || actionPlan.Medium?.length > 0) && (
        <div className="results-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Priority Recommendations</h2>
              <p className="section-desc">Ranked conversion fixes to implement first</p>
            </div>
          </div>

          <div className="action-plan-grid">
            {/* Immediate High Priority */}
            {actionPlan.High?.length > 0 && (
              <div className="action-column card">
                <div className="action-col-header" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.3)' }}>
                  <div className="col-title-group">
                    <AlertTriangle size={18} color="var(--red)" />
                    <h4>Phase 1: Immediate Fixes</h4>
                  </div>
                  <span className="badge badge-red">{actionPlan.High.length} fixes</span>
                </div>

                <div className="action-items-list">
                  {actionPlan.High.map((act, i) => (
                    <div key={i} className="action-item-card">
                      <div className="item-num">{i + 1}</div>
                      <div className="item-text">
                        <strong>{act.name}</strong>
                        <p>{act.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High-Leverage Medium Priority */}
            {actionPlan.Medium?.length > 0 && (
              <div className="action-column card">
                <div className="action-col-header" style={{ borderBottomColor: 'rgba(245, 158, 11, 0.3)' }}>
                  <div className="col-title-group">
                    <Zap size={18} color="var(--amber)" />
                    <h4>Phase 2: High-Leverage Optimizations</h4>
                  </div>
                  <span className="badge badge-amber">{actionPlan.Medium.length} fixes</span>
                </div>

                <div className="action-items-list">
                  {actionPlan.Medium.map((act, i) => (
                    <div key={i} className="action-item-card">
                      <div className="item-num">{i + 1}</div>
                      <div className="item-text">
                        <strong>{act.name}</strong>
                        <p>{act.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Detailed Scorecard Accordion */}
      <div className="results-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Detailed Category Analysis</h2>
            <p className="section-desc">Review individual criteria scores, observations, and recommendations</p>
          </div>
          <div className="accordion-controls no-print">
            <button className="btn btn-ghost btn-sm" onClick={expandAll}>Expand All</button>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <button className="btn btn-ghost btn-sm" onClick={collapseAll}>Collapse All</button>
          </div>
        </div>

        <div className="category-accordion-list">
          {template.categories.map((cat) => {
            const isExpanded = !!expandedCategories[cat.id];
            const catScoreObj = scoreData.categoryScores.find(cs => cs.categoryId === cat.id);
            const catScore = catScoreObj ? Math.round(catScoreObj.score) : 0;

            return (
              <div key={cat.id} className="accordion-item card">
                <div 
                  className="accordion-header"
                  onClick={() => toggleCategory(cat.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="acc-header-left">
                    <span className="acc-title">{cat.name}</span>
                    <span className="acc-desc truncate">{cat.description}</span>
                  </div>

                  <div className="acc-header-right">
                    <div className="acc-score-pill">
                      <span className="score-val">{catScore}</span>
                      <span className="score-max">/100</span>
                    </div>
                    <div className="acc-toggle-icon">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="accordion-body">
                    <div className="criteria-table">
                      {cat.criteria.map((crit) => {
                        const resp = responses[crit.id] || {};
                        const score = resp.score !== undefined ? Number(resp.score) : 3;
                        const scoreMeta = SCORE_LEVELS[score] || SCORE_LEVELS[3];
                        const isUnverified = !!resp.unableToVerify;

                        return (
                          <div key={crit.id} className="criterion-row">
                            <div className="crit-col-left">
                              <div className="crit-name-row">
                                <span className="crit-name">{crit.name}</span>
                                {isUnverified ? (
                                  <span className="badge badge-gray" title="Could not be verified automatically">
                                    <HelpCircle size={12} />
                                    <span>Unable to verify</span>
                                  </span>
                                ) : (
                                  <span className={`badge ${scoreMeta.bgClass} ${scoreMeta.textClass}`}>
                                    Score: {score}/5 • {scoreMeta.label}
                                  </span>
                                )}
                              </div>
                              <p className="crit-desc">{crit.description}</p>
                            </div>

                            <div className="crit-col-right">
                              <div className="crit-observation">
                                <span className="crit-label">Observation:</span>
                                <p>{resp.observation || 'Evaluated against conversion benchmarks.'}</p>
                              </div>
                              <div className="crit-recommendation">
                                <span className="crit-label">Recommendation:</span>
                                <p>{resp.recommendation || crit.defaultRecommendation || 'Review and optimize.'}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Download CTA Bar */}
      <div className="results-bottom-cta card text-center no-print">
        <div className="bottom-cta-content">
          <Award size={36} color="var(--primary-light)" style={{ margin: '0 auto 12px' }} />
          <h3>Save or Share Your Conversion Audit</h3>
          <p>
            Download a branded, high-resolution PDF deliverable of your website conversion audit.
          </p>
          <div className="bottom-cta-buttons">
            <button 
              className="btn btn-primary btn-lg"
              onClick={onDownloadReport}
              disabled={isExportingPdf}
            >
              <Download size={20} />
              <span>{isExportingPdf ? 'Generating PDF...' : 'Download Full Audit Report (PDF)'}</span>
            </button>

            <button 
              className="btn btn-secondary btn-lg"
              onClick={onStartAnotherAudit}
            >
              <RotateCcw size={18} />
              <span>Audit Another Website</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
