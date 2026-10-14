import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  calculateAuditScores, 
  identifyTopOpportunities, 
  generatePriorityActionPlan, 
  generateExecutiveSummary,
  SCORE_LEVELS,
  PRIORITIES
} from '../../data/scoringEngine';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  Edit3, 
  Sparkles, 
  CheckCircle2, 
  Flag, 
  Calendar, 
  Globe, 
  User, 
  Building, 
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Zap,
  Save
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ReportPreviewView() {
  const { 
    activeAudit, 
    activeAuditTemplate, 
    branding, 
    navigateTo, 
    updateAudit, 
    showToast 
  } = useApp();

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState('');

  // Calculate scores and intelligence
  const scoreData = useMemo(() => {
    if (!activeAudit || !activeAuditTemplate) return null;
    return calculateAuditScores(activeAuditTemplate, activeAudit.responses || {});
  }, [activeAudit, activeAuditTemplate]);

  const topOpportunities = useMemo(() => {
    if (!activeAuditTemplate) return [];
    return identifyTopOpportunities(activeAuditTemplate, activeAudit?.responses || {}, 5);
  }, [activeAuditTemplate, activeAudit?.responses]);

  const actionPlan = useMemo(() => {
    if (!activeAuditTemplate) return { High: [], Medium: [], Low: [] };
    return generatePriorityActionPlan(activeAuditTemplate, activeAudit?.responses || {});
  }, [activeAuditTemplate, activeAudit?.responses]);

  // Set or generate executive summary text
  useMemo(() => {
    if (activeAudit && scoreData && activeAuditTemplate) {
      if (activeAudit.executiveSummary) {
        setSummaryText(activeAudit.executiveSummary);
      } else {
        const autoSummary = generateExecutiveSummary(activeAudit, activeAuditTemplate, scoreData);
        setSummaryText(autoSummary);
      }
    }
  }, [activeAudit, scoreData, activeAuditTemplate]);

  if (!activeAudit || !activeAuditTemplate || !scoreData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3>No Audit Selected for Reporting</h3>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigateTo('audits')}>
          Go to Audits
        </button>
      </div>
    );
  }

  // Save executive summary edit
  const handleSaveSummary = () => {
    updateAudit(activeAudit.id, { executiveSummary: summaryText });
    setIsEditingSummary(false);
    showToast('Executive summary updated.');
  };

  const handleRegenerateSummary = () => {
    const fresh = generateExecutiveSummary(activeAudit, activeAuditTemplate, scoreData);
    setSummaryText(fresh);
    updateAudit(activeAudit.id, { executiveSummary: fresh });
    showToast('Executive summary regenerated with AI conversion intelligence.');
  };

  // Browser print action
  const handlePrint = () => {
    window.print();
  };

  // 1-Click Client-Ready PDF File Download
  const handleDownloadPdf = async () => {
    const reportElement = document.getElementById('client-report-document');
    if (!reportElement) return;

    setIsExportingPdf(true);
    showToast('Compiling high-resolution client PDF deliverable...', 'info');

    try {
      // Use html2canvas to capture document
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#080c14'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Add subsequent pages if report exceeds 1 page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const filename = `${activeAudit.clientName.replace(/\s+/g, '-')}_${activeAudit.auditTypeName.replace(/\s+/g, '-')}_Report.pdf`;
      pdf.save(filename);
      showToast('Client PDF Report successfully downloaded!');
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback to browser print dialog
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Extract all documented findings
  const detailedFindings = [];
  (activeAuditTemplate.categories || []).forEach(cat => {
    (cat.criteria || []).forEach(crit => {
      const resp = activeAudit.responses?.[crit.id];
      if (resp && (resp.score || resp.observation || resp.recommendation)) {
        detailedFindings.push({
          criterionName: crit.name,
          categoryName: cat.name,
          score: resp.score || 0,
          observation: resp.observation || crit.description || 'Observed.',
          recommendation: resp.recommendation || crit.defaultRecommendation || 'Implement improvements.',
          priority: resp.priority || (resp.score === 1 ? 'High' : (resp.score === 2 ? 'Medium' : 'Low')),
          screenshot: resp.screenshot || null
        });
      }
    });
  });

  return (
    <div>
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigateTo('audit-workspace', { auditId: activeAudit.id })}>
          <ArrowLeft size={16} />
          <span>Return to Workspace</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={handlePrint}
            title="Open browser print dialog"
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>

          <button 
            className="btn btn-primary"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            title="Download client-ready standalone PDF"
          >
            <Download size={16} />
            <span>{isExportingPdf ? 'Generating PDF...' : 'Export Client PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Report Container */}
      <div 
        id="client-report-document" 
        className="report-paper"
        style={{ 
          maxWidth: '920px', 
          margin: '0 auto', 
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)'
        }}
      >
        {/* ===================================================================
            SECTION 1: COVER PAGE
            =================================================================== */}
        <div className="report-cover-hero print-page" style={{ position: 'relative' }}>
          {/* Header Branding Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {branding.logoUrl ? (
                <img src={branding.logoUrl} alt={branding.businessName} style={{ height: 40, objectFit: 'contain' }} />
              ) : (
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary) 0%, var(--cyan) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                  {branding.businessName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.01em' }}>{branding.businessName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{branding.website}</div>
              </div>
            </div>

            <span className="badge badge-purple" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>
              Official Audit Deliverable
            </span>
          </div>

          {/* Title Area */}
          <div style={{ marginBottom: 40 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary-light)', display: 'block', marginBottom: 8 }}>
              {activeAudit.auditTypeName.toUpperCase()} • CONVERSION SCORECARD
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: 12, letterSpacing: '-0.02em' }}>
              {activeAudit.name}
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '640px' }}>
              Strategic conversion diagnosis and high-leverage optimization roadmap prepared specifically for <strong>{activeAudit.clientName}</strong>.
            </p>
          </div>

          {/* Metadata & Overall Score Banner */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 220px', 
            gap: 24, 
            background: 'var(--bg-surface)', 
            padding: '28px 32px', 
            borderRadius: 'var(--radius-xl)', 
            border: '1px solid var(--border-subtle)',
            alignItems: 'center'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.875rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>CLIENT ACCOUNT</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{activeAudit.clientName}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>TARGET PROPERTY</span>
                <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{activeAudit.websiteUrl || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>LEAD AUDITOR</span>
                <span style={{ fontWeight: 600 }}>{activeAudit.auditor || branding.auditorName}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>EVALUATION DATE</span>
                <span style={{ fontWeight: 600 }}>{activeAudit.auditDate}</span>
              </div>
            </div>

            {/* Score Callout */}
            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 24 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                OVERALL AUDIT SCORE
              </span>
              <div style={{ fontSize: '3.4rem', fontWeight: 800, color: scoreData.classification.color, lineHeight: 1, margin: '6px 0' }}>
                {scoreData.overallScore}
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600 }}>/100</span>
              </div>
              <span className={`badge ${scoreData.classification.badgeClass}`} style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                {scoreData.classification.label}
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 2: EXECUTIVE SUMMARY
            =================================================================== */}
        <div className="report-section print-page">
          <div className="report-section-header">
            <h2 className="report-section-title">
              <span style={{ color: 'var(--primary-light)' }}>01.</span>
              <span>Executive Summary</span>
            </h2>

            <div className="no-print" style={{ display: 'flex', gap: 8 }}>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={handleRegenerateSummary}
                title="Regenerate with AI conversion intelligence"
              >
                <Sparkles size={14} color="var(--primary-light)" />
                <span>AI Polish</span>
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditingSummary(!isEditingSummary)}
              >
                <Edit3 size={14} />
                <span>{isEditingSummary ? 'Close Edit' : 'Edit Text'}</span>
              </button>
            </div>
          </div>

          {isEditingSummary ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <textarea
                rows={8}
                value={summaryText}
                onChange={e => setSummaryText(e.target.value)}
                style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={handleSaveSummary}>
                  <Save size={14} />
                  <span>Save Summary</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              {summaryText.split('\n\n').map((paragraph, pIdx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={pIdx} style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 18, marginBottom: 6 }}>
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                return (
                  <p key={pIdx} style={{ marginBottom: 12 }}>
                    {paragraph.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </p>
                );
              })}
            </div>
          )}
        </div>

        {/* ===================================================================
            SECTION 3: CATEGORY SCORE BREAKDOWN
            =================================================================== */}
        <div className="report-section print-page">
          <div className="report-section-header">
            <h2 className="report-section-title">
              <span style={{ color: 'var(--primary-light)' }}>02.</span>
              <span>Category Score Breakdown</span>
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Weights Total: 100%
            </span>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
            Every audit dimension is evaluated across quantitative criteria and scaled according to strategic conversion weight.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {scoreData.categoryScores.map((cat, idx) => (
              <div key={idx} className="breakdown-row">
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Weight: {cat.weight}% • {cat.scoredCriteria}/{cat.totalCriteria} criteria
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="progress-bar-container" style={{ height: 8, flex: 1 }}>
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${cat.score}%`,
                        background: cat.classification.color
                      }} 
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: cat.classification.color }}>
                    {cat.score}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/100</span>
                </div>

                <div className="hide-mobile" style={{ textAlign: 'right' }}>
                  <span className={`badge ${cat.classification.badgeClass}`} style={{ fontSize: '0.68rem' }}>
                    {cat.classification.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================
            SECTION 4: TOP OPPORTUNITIES
            =================================================================== */}
        <div className="report-section print-page">
          <div className="report-section-header">
            <h2 className="report-section-title">
              <span style={{ color: 'var(--primary-light)' }}>03.</span>
              <span>Top Optimization Opportunities</span>
            </h2>
            <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
              Highest Leverage Wins
            </span>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
            Prioritized by calculating low performance scores against category weights and potential conversion impact.
          </p>

          <div className="opportunities-grid">
            {topOpportunities.map((opp, idx) => (
              <div key={idx} className={`opportunity-card priority-${opp.priority}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="badge badge-gray" style={{ fontSize: '0.68rem' }}>{opp.categoryName}</span>
                  <span className={`badge ${opp.priority === 'High' ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: '0.68rem' }}>
                    {opp.priority} Priority
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{opp.criterionName}</h4>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
                  <strong>Observed Gap:</strong> {opp.observation}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>
                  <strong>Strategic Fix:</strong> {opp.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================
            SECTION 5: PRIORITY ACTION PLAN
            =================================================================== */}
        <div className="report-section print-page">
          <div className="report-section-header">
            <h2 className="report-section-title">
              <span style={{ color: 'var(--primary-light)' }}>04.</span>
              <span>Priority Action Plan</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {['High', 'Medium', 'Low'].map(priorityLevel => {
              const items = actionPlan[priorityLevel] || [];
              if (items.length === 0) return null;

              return (
                <div key={priorityLevel}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span className={`badge ${priorityLevel === 'High' ? 'badge-red' : (priorityLevel === 'Medium' ? 'badge-amber' : 'badge-emerald')}`}>
                      {priorityLevel} Priority Actions ({items.length})
                    </span>
                  </div>

                  <div className="table-container" style={{ background: 'var(--bg-surface)' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '22%' }}>Category & Criterion</th>
                          <th style={{ width: '38%' }}>Identified Problem / Friction</th>
                          <th style={{ width: '40%' }}>Actionable Recommendation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((action, aIdx) => (
                          <tr key={aIdx}>
                            <td>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{action.criterionName}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{action.categoryName}</div>
                            </td>
                            <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                              {action.issue}
                            </td>
                            <td style={{ fontSize: '0.825rem', color: 'var(--primary-light)', fontWeight: 500 }}>
                              {action.recommendation}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================================
            SECTION 6: DETAILED FINDINGS
            =================================================================== */}
        <div className="report-section print-page">
          <div className="report-section-header">
            <h2 className="report-section-title">
              <span style={{ color: 'var(--primary-light)' }}>05.</span>
              <span>Detailed Audit Findings</span>
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {detailedFindings.length} Evaluated Touchpoints
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            {detailedFindings.map((finding, fIdx) => {
              const level = SCORE_LEVELS[finding.score];
              return (
                <div 
                  key={fIdx}
                  style={{ 
                    background: 'var(--bg-surface)', 
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)', 
                    padding: 20 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <span className="badge badge-gray" style={{ fontSize: '0.68rem' }}>{finding.categoryName}</span>
                        {level && (
                          <span className={`badge ${level.bgClass}`} style={{ color: level.color, fontSize: '0.68rem' }}>
                            Score {level.value} • {level.label}
                          </span>
                        )}
                        <span className={`badge ${finding.priority === 'High' ? 'badge-red' : (finding.priority === 'Medium' ? 'badge-amber' : 'badge-emerald')}`} style={{ fontSize: '0.68rem' }}>
                          {finding.priority}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{finding.criterionName}</h4>
                    </div>

                    {finding.screenshot && (
                      <div style={{ width: 80, height: 50, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-default)', flexShrink: 0 }}>
                        <img src={finding.screenshot} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: '0.825rem' }}>
                    <div style={{ background: 'var(--bg-card)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Observation</strong>
                      <p style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{finding.observation}</p>
                    </div>
                    <div style={{ background: 'var(--bg-card)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: 'var(--primary-light)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Recommendation</strong>
                      <p style={{ color: 'var(--text-primary)', marginTop: 2 }}>{finding.recommendation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================================
            SECTION 7: RECOMMENDED NEXT STEPS
            =================================================================== */}
        <div className="report-section print-page">
          <div className="report-section-header">
            <h2 className="report-section-title">
              <span style={{ color: 'var(--primary-light)' }}>06.</span>
              <span>Recommended Implementation Roadmap</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={{ background: 'var(--bg-surface)', padding: 20, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <span className="badge badge-red" style={{ marginBottom: 12 }}>Phase 1 (Week 1-2)</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 8 }}>Immediate Friction Elimination</h4>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: 18, lineHeight: 1.6 }}>
                <li>Reduce form fields to 2 essential contact questions</li>
                <li>Elevate primary CTA visibility and sticky header button</li>
                <li>Deploy missing SSL and basic mobile touch target fixes</li>
              </ul>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: 20, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <span className="badge badge-amber" style={{ marginBottom: 12 }}>Phase 2 (Week 3-4)</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 8 }}>Core Persuasion & Proof Overhaul</h4>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: 18, lineHeight: 1.6 }}>
                <li>Rewrite hero headline with quantified metric outcomes</li>
                <li>Embed third-party review widgets and customer video quotes</li>
                <li>Build dedicated Thank-You bridge page with calendar embed</li>
              </ul>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: 20, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <span className="badge badge-blue" style={{ marginBottom: 12 }}>Phase 3 (Month 2+)</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 8 }}>Automation & Scale Testing</h4>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: 18, lineHeight: 1.6 }}>
                <li>Launch multi-channel email/SMS nurture sequences</li>
                <li>Configure GA4 funnel exploration and Meta CAPI</li>
                <li>Initiate A/B headline split tests for traffic scale</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 8: AUDIT METHODOLOGY & RUBRIC
            =================================================================== */}
        <div className="report-section print-page" style={{ borderBottom: 'none' }}>
          <div className="report-section-header">
            <h2 className="report-section-title">
              <span style={{ color: 'var(--primary-light)' }}>07.</span>
              <span>Audit Methodology & Rubric</span>
            </h2>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 'var(--radius-lg)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <p style={{ marginBottom: 14 }}>
              {branding.methodologyNotes || 'All evaluations adhere to the 5-point conversion rubric. Criteria scores are mathematically weighted according to commercial impact and aggregated to determine the overall scorecard out of 100.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, textAlign: 'center', marginTop: 14 }}>
              {Object.values(SCORE_LEVELS).map(lvl => (
                <div key={lvl.value} style={{ background: 'var(--bg-card)', padding: '10px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 800, color: lvl.color, fontSize: '1.1rem' }}>{lvl.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lvl.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Deliverable Notice */}
          <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Prepared by {branding.businessName} • {branding.auditorName}</span>
            <span>Client: {activeAudit.clientName} • {activeAudit.auditDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
