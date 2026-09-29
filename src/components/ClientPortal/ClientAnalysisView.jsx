import React from 'react';
import { 
  Globe, 
  CheckCircle2, 
  Loader2, 
  Circle, 
  AlertTriangle, 
  RotateCcw, 
  ArrowLeft,
  Sparkles,
  Shield
} from 'lucide-react';

export default function ClientAnalysisView({ 
  url, 
  auditTypeTitle, 
  progress, 
  error, 
  onRetry, 
  onCancel,
  onProceedPartial 
}) {
  const steps = [
    { id: 0, label: 'Checking page structure & technical signals' },
    { id: 1, label: 'Analyzing headline and messaging' },
    { id: 2, label: 'Checking calls to action & conversion friction' },
    { id: 3, label: 'Evaluating trust elements & social proof' },
    { id: 4, label: 'Reviewing conversion opportunities & computing scorecard' }
  ];

  const currentStepIndex = progress.stepIndex !== undefined ? progress.stepIndex : 0;
  const percent = progress.percent || 15;
  const currentMessage = progress.message || 'Connecting to website...';

  return (
    <div className="client-analysis-container">
      <div className="analysis-card card">
        {/* Header & Target Info */}
        <div className="analysis-header text-center">
          <div className="analysis-badge">
            <Sparkles size={14} className="pulse-icon" />
            <span>Live Conversion Audit in Progress</span>
          </div>

          <h2 className="analysis-title">Analyzing your website...</h2>

          <div className="analysis-target-meta">
            <div className="target-url-pill">
              <Globe size={15} />
              <span className="truncate">{url}</span>
            </div>
            <span className="target-audit-pill">{auditTypeTitle}</span>
          </div>
        </div>

        {/* Error State */}
        {error ? (
          <div className="analysis-error-state">
            <div className="error-icon-box">
              <AlertTriangle size={32} color="var(--amber)" />
            </div>
            <h3>Analysis Notice</h3>
            <p className="error-description">
              {(() => {
                if (typeof error === 'string') {
                  try {
                    const parsed = JSON.parse(error);
                    return parsed.error?.message || parsed.error || parsed.message || error;
                  } catch {
                    return error;
                  }
                }
                return error?.message || 'We could not complete the analysis for this website. Please try again.';
              })()}
            </p>
            <div className="error-actions">
              <button className="btn btn-primary" onClick={onRetry}>
                <RotateCcw size={16} />
                <span>Try Again</span>
              </button>
              <button className="btn btn-secondary" onClick={onCancel}>
                <ArrowLeft size={16} />
                <span>Change URL</span>
              </button>
              {onProceedPartial && (
                <button className="btn btn-ghost" onClick={onProceedPartial}>
                  <span>Review Available Results</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Live Progress State */
          <div className="analysis-progress-body">
            {/* Progress Bar */}
            <div className="analysis-progress-wrapper">
              <div className="progress-info-row">
                <span className="progress-current-text">{currentMessage}</span>
                <span className="progress-percent-text">{Math.round(percent)}%</span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* Real Status Steps List */}
            <div className="analysis-steps-list">
              {steps.map((s, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isPending = idx > currentStepIndex;

                return (
                  <div 
                    key={s.id} 
                    className={`step-row ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isPending ? 'pending' : ''}`}
                  >
                    <div className="step-icon-col">
                      {isCompleted ? (
                        <div className="step-check-icon">
                          <CheckCircle2 size={18} color="var(--emerald)" />
                        </div>
                      ) : isCurrent ? (
                        <div className="step-loading-icon">
                          <Loader2 size={18} className="spinner" color="var(--primary-light)" />
                        </div>
                      ) : (
                        <div className="step-pending-icon">
                          <Circle size={16} />
                        </div>
                      )}
                    </div>

                    <div className="step-text-col">
                      <span className="step-label">{s.label}</span>
                      {isCurrent && (
                        <span className="step-substatus">Analyzing live DOM and copy elements...</span>
                      )}
                    </div>

                    <div className="step-status-col">
                      {isCompleted && <span className="status-badge-done">Done</span>}
                      {isCurrent && <span className="status-badge-active">In Progress</span>}
                      {isPending && <span className="status-badge-queued">Queued</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Diagnostic Guarantee Note */}
            <div className="analysis-footer-note">
              <Shield size={14} color="var(--text-muted)" />
              <span>
                Evaluating against 50+ conversion principles. Criteria that cannot be verified will be honestly flagged.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
