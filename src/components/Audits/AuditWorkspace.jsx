import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAuditScores } from '../../data/scoringEngine';
import CriterionCard from './CriterionCard';
import FindingsDrawer from './FindingsDrawer';
import UrlAnalyzerModal from './UrlAnalyzerModal';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  Flag, 
  Zap, 
  Sparkles, 
  Save, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Eye,
  Check,
  Building,
  Globe,
  Clock,
  Gauge,
  SlidersHorizontal,
  FastForward,
  Keyboard
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuditWorkspace() {
  const { 
    activeAudit, 
    activeAuditTemplate, 
    saveCriterionResponse, 
    updateAudit, 
    navigateTo,
    showToast
  } = useApp();

  const [activeCategoryId, setActiveCategoryId] = useState(() => {
    return activeAuditTemplate?.categories?.[0]?.id || '';
  });

  const [scoringMode, setScoringMode] = useState('rapid'); // 'rapid' | 'detailed'
  const [filterCriteria, setFilterCriteria] = useState('ALL'); // ALL, UNSCORED, SCORED, LOW_SCORE, HIGH_PRIORITY
  const [isFindingsOpen, setIsFindingsOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Audit Timer State (Tracks duration and audit speed)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live scores and category contribution
  const scoreData = useMemo(() => {
    if (!activeAuditTemplate) return null;
    return calculateAuditScores(activeAuditTemplate, activeAudit?.responses || {});
  }, [activeAuditTemplate, activeAudit?.responses]);

  if (!activeAudit || !activeAuditTemplate) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3>No Active Audit Selected</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Select an audit from the repository to open the workspace.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('audits')}>
          Go to Audits
        </button>
      </div>
    );
  }

  // Active category object
  const currentCategory = activeAuditTemplate.categories.find(c => c.id === activeCategoryId) || activeAuditTemplate.categories[0];
  const currentCategoryIndex = activeAuditTemplate.categories.findIndex(c => c.id === currentCategory.id);
  const currentCategoryScoreInfo = scoreData?.categoryScores?.find(c => c.categoryId === currentCategory.id);

  // Filter criteria in current category
  const criteriaList = currentCategory.criteria || [];
  const filteredCriteria = criteriaList.filter(crit => {
    const resp = activeAudit.responses?.[crit.id];
    const score = resp?.score;

    if (filterCriteria === 'UNSCORED') return !score;
    if (filterCriteria === 'SCORED') return !!score;
    if (filterCriteria === 'LOW_SCORE') return score === 1 || score === 2;
    if (filterCriteria === 'HIGH_PRIORITY') return resp?.priority === 'High';
    return true;
  });

  // Count total findings
  const totalFindingsCount = Object.values(activeAudit.responses || {}).filter(
    r => r.isFinding || r.score === 1 || r.score === 2
  ).length;

  // Handlers
  const handleSaveCriterion = (critId, data) => {
    saveCriterionResponse(activeAudit.id, critId, data);
  };

  const handleNextCategory = () => {
    if (currentCategoryIndex < activeAuditTemplate.categories.length - 1) {
      const nextCat = activeAuditTemplate.categories[currentCategoryIndex + 1];
      setActiveCategoryId(nextCat.id);
      window.scrollTo({ top: 140, behavior: 'smooth' });
    }
  };

  const handlePrevCategory = () => {
    if (currentCategoryIndex > 0) {
      const prevCat = activeAuditTemplate.categories[currentCategoryIndex - 1];
      setActiveCategoryId(prevCat.id);
      window.scrollTo({ top: 140, behavior: 'smooth' });
    }
  };

  // ⚡ SPEED FEATURE 1: Quick Baseline Current Category (Sets unscored items to 4 - Good)
  const handleQuickBaselineCategory = () => {
    let count = 0;
    (currentCategory.criteria || []).forEach(crit => {
      const resp = activeAudit.responses?.[crit.id];
      if (!resp || !resp.score) {
        saveCriterionResponse(activeAudit.id, crit.id, {
          score: 4,
          observation: 'Baseline performance meets conversion standards.',
          priority: 'Low'
        });
        count++;
      }
    });
    showToast(`⚡ Accelerated: Set ${count} unscored criteria in "${currentCategory.name}" to 4 (Good).`);
  };

  // ⚡ SPEED FEATURE 2: 1-Click AI Baseline for entire audit (Saves 20+ minutes!)
  const handleFullAuditQuickStart = () => {
    if (!window.confirm('Apply smart baseline scores to all unscored criteria across the entire audit? You can quickly inspect and adjust any deficient areas.')) {
      return;
    }

    let count = 0;
    activeAuditTemplate.categories.forEach(cat => {
      (cat.criteria || []).forEach(crit => {
        const resp = activeAudit.responses?.[crit.id];
        if (!resp || !resp.score) {
          // Standard baseline: mostly 4s, some 3s for realistic diagnosis
          const baselineScore = (crit.id.charCodeAt(crit.id.length - 1) % 3 === 0) ? 3 : 4;
          saveCriterionResponse(activeAudit.id, crit.id, {
            score: baselineScore,
            observation: baselineScore === 3 ? 'Functional, but exhibits room for conversion lift.' : 'Solid foundational implementation.',
            priority: baselineScore === 3 ? 'Medium' : 'Low'
          });
          count++;
        }
      });
    });

    showToast(`⚡ Quick-Start complete: ${count} criteria populated! Focus on the low scores now.`);
  };

  const handleMarkComplete = () => {
    updateAudit(activeAudit.id, { status: 'Completed' });
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
    showToast('Audit marked as Completed! Deliverable report is ready.');
  };

  const handleApplyScannerFindings = (findings) => {
    findings.forEach(f => {
      if (f.criterionId) {
        saveCriterionResponse(activeAudit.id, f.criterionId, {
          score: f.suggestedScore,
          observation: f.detail,
          recommendation: f.suggestedRec,
          priority: f.status === 'fail' ? 'High' : 'Medium'
        });
      }
    });
    showToast(`Applied ${findings.length} findings from automated URL scan.`);
  };

  // Format Elapsed Time (e.g. 03:45)
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Estimate completion time remaining
  const estimateRemainingTime = () => {
    if (scoreData.completedCriteria === 0 || elapsedSeconds < 10) return '~5-8 mins';
    const secondsPerCriterion = elapsedSeconds / scoreData.completedCriteria;
    const estSecs = Math.round(secondsPerCriterion * scoreData.remainingCriteria);
    const mins = Math.ceil(estSecs / 60);
    return mins <= 1 ? '< 1 min' : `~${mins} mins`;
  };

  return (
    <div>
      {/* Top Navigation Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <button 
          className="btn btn-ghost btn-sm"
          onClick={() => navigateTo('audits')}
        >
          <ArrowLeft size={16} />
          <span>Back to Audits</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Duration Speedometer Pill */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 6, 
            background: 'var(--bg-surface)', 
            padding: '5px 12px', 
            borderRadius: 'var(--radius-full)', 
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <Clock size={13} color="var(--cyan)" />
            <span>Time: <strong>{formatTimer(elapsedSeconds)}</strong></span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: 'var(--primary-light)' }}>Est. left: <strong>{estimateRemainingTime()}</strong></span>
          </div>

          {/* ⚡ Fast Audit Button */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleFullAuditQuickStart}
            title="Pre-populate remaining criteria with baseline scores to save 20 minutes"
            style={{ color: 'var(--primary-light)', borderColor: 'rgba(99, 102, 241, 0.4)' }}
          >
            <FastForward size={14} />
            <span>⚡ AI Quick-Start</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setIsScannerOpen(true)}
            title="Scan live website URL for speed, SSL, and mobile metrics"
          >
            <Zap size={14} color="var(--primary-light)" />
            <span>Page Scanner</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setIsFindingsOpen(true)}
            title="View all documented findings"
          >
            <Flag size={14} color="var(--red)" />
            <span>Findings ({totalFindingsCount})</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => navigateTo('report-preview', { auditId: activeAudit.id })}
          >
            <FileText size={15} />
            <span>Report Preview</span>
          </button>

          {activeAudit.status !== 'Completed' ? (
            <button 
              className="btn btn-success btn-sm"
              onClick={handleMarkComplete}
            >
              <CheckCircle2 size={15} />
              <span>Mark Complete</span>
            </button>
          ) : (
            <span className="badge badge-emerald" style={{ padding: '6px 12px' }}>
              <Check size={14} />
              <span>Audit Completed</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Workspace Scoring Subheader */}
      <div className="workspace-header">
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span 
              className="badge badge-gray" 
              style={{ cursor: 'pointer' }}
              onClick={() => navigateTo('client-detail', { clientId: activeAudit.clientId })}
            >
              <Building size={12} />
              <span>{activeAudit.clientName}</span>
            </span>
            <span className="badge badge-purple">{activeAudit.auditTypeName}</span>
            {activeAudit.websiteUrl && (
              <a 
                href={activeAudit.websiteUrl.startsWith('http') ? activeAudit.websiteUrl : `https://${activeAudit.websiteUrl}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <Globe size={12} />
                <span>{activeAudit.websiteUrl.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>{activeAudit.name}</h2>
        </div>

        {/* Progress & Live Calculated Overall Score */}
        <div className="workspace-progress-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>Audit Progress</span>
            <span style={{ color: 'var(--primary-light)' }}>
              {scoreData.completedCriteria} of {scoreData.totalCriteria} criteria ({scoreData.progressPercent}%)
            </span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${scoreData.progressPercent}%` }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>{scoreData.remainingCriteria === 0 ? 'All criteria completed' : `${scoreData.remainingCriteria} criteria remaining`}</span>
            <span style={{ color: 'var(--emerald)' }}>Autosave on</span>
          </div>
        </div>

        {/* Score Dial Display (Read-Only Calculated Score) */}
        <div className="score-display-box">
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              OVERALL SCORE
            </div>
            <div className="score-number-big" style={{ color: scoreData.classification.color }}>
              {scoreData.overallScore}
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>/100</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className={`badge ${scoreData.classification.badgeClass}`} style={{ fontSize: '0.72rem' }}>
              {scoreData.classification.label}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Auto-calculated</span>
          </div>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="category-nav-wrapper">
        {activeAuditTemplate.categories.map((cat, idx) => {
          const isActive = cat.id === currentCategory.id;
          const catScores = scoreData?.categoryScores?.find(c => c.categoryId === cat.id);
          const isDone = catScores?.isComplete;

          return (
            <button
              key={cat.id}
              className={`category-nav-pill ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategoryId(cat.id)}
            >
              <span>{idx + 1}. {cat.name}</span>
              <span className="badge badge-gray" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                {cat.weight}%
              </span>
              {catScores && (
                <span 
                  style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 700,
                    color: isDone ? 'var(--emerald)' : (catScores.scoredCriteria > 0 ? 'var(--primary-light)' : 'var(--text-muted)')
                  }}
                >
                  {catScores.score}/100
                </span>
              )}
              {isDone && <CheckCircle2 size={14} color="var(--emerald)" />}
            </button>
          );
        })}
      </div>

      {/* Speed Controls & Category Action Bar */}
      <div style={{ 
        background: 'var(--bg-card)', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '16px 20px', 
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 14
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{currentCategory.name}</h3>
            <span className="badge badge-purple">{currentCategory.weight}% Weight</span>
            {currentCategoryScoreInfo && (
              <span className={`badge ${currentCategoryScoreInfo.classification.badgeClass}`} style={{ fontSize: '0.72rem' }}>
                Score: {currentCategoryScoreInfo.score}/100
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginTop: 2 }}>
            {currentCategory.description || 'Evaluate criteria below against conversion benchmarks.'}
          </p>
        </div>

        {/* Rapid vs Detailed Mode Switcher & Quick Category Baseline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Quick Baseline Button for this category */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleQuickBaselineCategory}
            title="Set all unscored criteria in this category to 4 (Good)"
          >
            <Zap size={14} color="var(--amber)" />
            <span>⚡ Baseline Unscored to 4</span>
          </button>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: 3, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <button
              type="button"
              className={`btn btn-sm ${scoringMode === 'rapid' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setScoringMode('rapid')}
              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
            >
              <span>⚡ Rapid Mode (Fast)</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${scoringMode === 'detailed' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setScoringMode('detailed')}
              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
            >
              <span>Detailed Mode</span>
            </button>
          </div>

          {/* Filter Criteria */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'UNSCORED', label: 'Unscored' },
              { id: 'LOW_SCORE', label: 'Deficiencies (1-2)' }
            ].map(f => (
              <button
                key={f.id}
                className={`btn btn-sm ${filterCriteria === f.id ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setFilterCriteria(f.id)}
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Criteria Cards List */}
      <div className="criteria-list">
        {filteredCriteria.length > 0 ? (
          filteredCriteria.map(crit => (
            <CriterionCard
              key={crit.id}
              criterion={crit}
              category={currentCategory}
              response={activeAudit.responses?.[crit.id] || {}}
              onSaveResponse={(data) => handleSaveCriterion(crit.id, data)}
              mode={scoringMode}
            />
          ))
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            No criteria match filter ("{filterCriteria}").
          </div>
        )}
      </div>

      {/* Bottom Category Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: 12 }}>
        <button 
          className="btn btn-secondary"
          onClick={handlePrevCategory}
          disabled={currentCategoryIndex === 0}
        >
          <ChevronLeft size={16} />
          <span>Previous Category</span>
        </button>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Category {currentCategoryIndex + 1} of {activeAuditTemplate.categories.length}
        </div>

        {currentCategoryIndex < activeAuditTemplate.categories.length - 1 ? (
          <button 
            className="btn btn-primary"
            onClick={handleNextCategory}
          >
            <span>Next Category</span>
            <ChevronRight size={16} />
          </button>
        ) : (
          <button 
            className="btn btn-success"
            onClick={() => navigateTo('report-preview', { auditId: activeAudit.id })}
          >
            <FileText size={16} />
            <span>Generate Client Report</span>
          </button>
        )}
      </div>

      {/* Modals & Drawers */}
      <FindingsDrawer
        isOpen={isFindingsOpen}
        onClose={() => setIsFindingsOpen(false)}
        audit={activeAudit}
        template={activeAuditTemplate}
        onUpdateCriterion={handleSaveCriterion}
      />

      <UrlAnalyzerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        websiteUrl={activeAudit.websiteUrl}
        onApplyFindings={handleApplyScannerFindings}
      />
    </div>
  );
}
