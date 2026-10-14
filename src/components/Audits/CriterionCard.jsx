import React, { useState } from 'react';
import { SCORE_LEVELS, PRIORITIES } from '../../data/scoringEngine';
import { 
  Check, 
  Lightbulb, 
  AlertCircle, 
  Camera, 
  X, 
  ExternalLink, 
  Sparkles,
  ArrowRight,
  Eye,
  Flag,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';

export default function CriterionCard({ 
  criterion, 
  category, 
  response = {}, 
  onSaveResponse,
  mode = 'detailed', // 'detailed' | 'rapid'
  onAutoAdvance
}) {
  const currentScore = response.score || null;
  const currentObservation = response.observation || '';
  const currentRecommendation = response.recommendation || '';
  const currentPriority = response.priority || (currentScore === 1 ? 'High' : (currentScore === 2 ? 'Medium' : 'Low'));
  const currentScreenshot = response.screenshot || '';
  const isFlaggedAsFinding = response.isFinding !== undefined 
    ? response.isFinding 
    : (currentScore === 1 || currentScore === 2);

  const [showScreenshotInput, setShowScreenshotInput] = useState(false);
  const [screenshotUrlInput, setScreenshotUrlInput] = useState(currentScreenshot);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [ignoredRecommendation, setIgnoredRecommendation] = useState(false);
  const [isExpandedInRapid, setIsExpandedInRapid] = useState(false);

  // Score selection handler
  const handleScoreSelect = (scoreValue) => {
    const isLowScore = scoreValue === 1 || scoreValue === 2;
    const defaultRec = (!currentRecommendation && isLowScore) ? criterion.defaultRecommendation : currentRecommendation;
    const autoPriority = scoreValue === 1 ? 'High' : (scoreValue === 2 ? 'Medium' : 'Low');

    onSaveResponse({
      ...response,
      score: scoreValue,
      recommendation: defaultRec,
      priority: response.priority || autoPriority,
      isFinding: isLowScore || response.isFinding || false
    });
    setIgnoredRecommendation(false);

    // If in rapid mode and auto-advance is enabled, notify parent
    if (onAutoAdvance) {
      onAutoAdvance();
    }
  };

  const handleObservationChange = (val) => {
    onSaveResponse({
      ...response,
      observation: val
    });
  };

  const handleRecommendationChange = (val) => {
    onSaveResponse({
      ...response,
      recommendation: val
    });
  };

  const handlePrioritySelect = (p) => {
    onSaveResponse({
      ...response,
      priority: p
    });
  };

  const handleToggleFinding = () => {
    onSaveResponse({
      ...response,
      isFinding: !isFlaggedAsFinding
    });
  };

  // Image file upload simulation or URL
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSaveResponse({
          ...response,
          screenshot: reader.result
        });
        setShowScreenshotInput(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveScreenshotUrl = () => {
    onSaveResponse({
      ...response,
      screenshot: screenshotUrlInput.trim()
    });
    setShowScreenshotInput(false);
  };

  const handleRemoveScreenshot = () => {
    onSaveResponse({
      ...response,
      screenshot: null
    });
    setScreenshotUrlInput('');
  };

  // Check if we should display the suggested recommendation library prompt
  const isLowScore = currentScore === 1 || currentScore === 2;
  const shouldShowSuggestion = isLowScore && !ignoredRecommendation && (!currentRecommendation || currentRecommendation === criterion.defaultRecommendation);

  const handleAcceptRecommendation = () => {
    onSaveResponse({
      ...response,
      recommendation: criterion.defaultRecommendation
    });
  };

  const handleIgnoreRecommendation = () => {
    setIgnoredRecommendation(true);
  };

  const hasNotesOrScreenshot = currentObservation || currentRecommendation || currentScreenshot;

  /* =========================================================================
     RAPID SCORING ROW (For 10x faster audit execution)
     ========================================================================= */
  if (mode === 'rapid') {
    return (
      <div 
        className={`criterion-card ${currentScore ? 'is-scored' : ''} ${isLowScore ? 'is-low-score' : ''}`}
        style={{ padding: '14px 18px', transition: 'all 0.15s ease' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          {/* Title & Description */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: '0.925rem' }}>{criterion.name}</span>
              {currentScore && (
                <span className={`badge ${SCORE_LEVELS[currentScore].bgClass}`} style={{ color: SCORE_LEVELS[currentScore].color, fontSize: '0.68rem', padding: '1px 6px' }}>
                  {SCORE_LEVELS[currentScore].value} • {SCORE_LEVELS[currentScore].label}
                </span>
              )}
              {isFlaggedAsFinding && (
                <span className="badge badge-red" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                  <Flag size={10} />
                  <span>Finding</span>
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {criterion.description}
            </div>
          </div>

          {/* 1-5 Compact Quick Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[1, 2, 3, 4, 5].map(scoreVal => {
              const isSelected = currentScore === scoreVal;
              return (
                <button
                  key={scoreVal}
                  type="button"
                  onClick={() => handleScoreSelect(scoreVal)}
                  style={{
                    width: 38,
                    height: 34,
                    borderRadius: 6,
                    border: '1px solid var(--border-default)',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.1s ease',
                    cursor: 'pointer'
                  }}
                  className={`score-btn ${isSelected ? `active-${scoreVal}` : ''}`}
                  title={`${scoreVal} = ${SCORE_LEVELS[scoreVal].label}`}
                >
                  {scoreVal}
                </button>
              );
            })}

            {/* Expand / Details Toggle */}
            <button
              type="button"
              className={`btn btn-sm ${hasNotesOrScreenshot || isExpandedInRapid ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setIsExpandedInRapid(!isExpandedInRapid)}
              title="Add observation, recommendation or screenshot"
              style={{ marginLeft: 6, padding: '6px 10px' }}
            >
              <MessageSquare size={14} color={hasNotesOrScreenshot ? 'var(--primary-light)' : 'var(--text-muted)'} />
              {isExpandedInRapid ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Rapid Mode Expanded Details */}
        {isExpandedInRapid && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', animation: 'fadeIn 0.15s ease-out' }}>
            {/* Suggested Recommendation Prompt (When score is 1 or 2) */}
            {shouldShowSuggestion && criterion.defaultRecommendation && (
              <div className="suggested-recommendation-box" style={{ padding: 12, marginBottom: 12 }}>
                <div className="rec-box-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Lightbulb size={15} />
                    <span>SUGGESTED RECOMMENDATION</span>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-primary"
                    onClick={handleAcceptRecommendation}
                    style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                  >
                    <Check size={12} />
                    <span>Accept</span>
                  </button>
                </div>
                <div className="rec-text" style={{ fontSize: '0.8rem', margin: 0 }}>
                  "{criterion.defaultRecommendation}"
                </div>
              </div>
            )}

            <div className="criterion-inputs-grid" style={{ marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Observation
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes on friction points or layout..."
                  value={currentObservation}
                  onChange={e => handleObservationChange(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Strategic Recommendation
                </label>
                <textarea
                  rows={2}
                  placeholder="Actionable instructions..."
                  value={currentRecommendation}
                  onChange={e => handleRecommendationChange(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div className="priority-selector">
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>PRIORITY:</span>
                {['High', 'Medium', 'Low'].map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`priority-pill-btn ${currentPriority === p ? `active-${p}` : ''}`}
                    onClick={() => handlePrioritySelect(p)}
                    style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  type="button" 
                  className={`btn btn-sm ${isFlaggedAsFinding ? 'btn-danger' : 'btn-ghost'}`}
                  onClick={handleToggleFinding}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <Flag size={12} />
                  <span>{isFlaggedAsFinding ? 'Finding Flagged' : 'Flag Finding'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================================
     DETAILED SCORING CARD
     ========================================================================= */
  return (
    <div className={`criterion-card ${currentScore ? 'is-scored' : ''} ${isLowScore ? 'is-low-score' : ''}`}>
      {/* Header */}
      <div className="criterion-header">
        <div className="criterion-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h3>{criterion.name}</h3>
            {isFlaggedAsFinding && (
              <span className="badge badge-red" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                <Flag size={11} />
                <span>Documented Finding</span>
              </span>
            )}
            {currentScore && (
              <span className={`badge ${SCORE_LEVELS[currentScore].bgClass}`} style={{ color: SCORE_LEVELS[currentScore].color, fontSize: '0.72rem' }}>
                {SCORE_LEVELS[currentScore].value} • {SCORE_LEVELS[currentScore].label}
              </span>
            )}
          </div>
          <p className="criterion-description">{criterion.description}</p>
        </div>

        <button 
          className={`btn btn-sm ${isFlaggedAsFinding ? 'btn-danger' : 'btn-ghost'}`}
          onClick={handleToggleFinding}
          title={isFlaggedAsFinding ? 'Remove from key findings report' : 'Flag as key finding for client report'}
          style={{ flexShrink: 0 }}
        >
          <Flag size={14} />
          <span>{isFlaggedAsFinding ? 'Finding Flagged' : 'Flag Finding'}</span>
        </button>
      </div>

      {/* 1-5 Scoring Buttons */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 8 }}>
          Scoring Level (1 = Missing, 5 = Excellent)
        </label>
        <div className="score-selector-grid">
          {[1, 2, 3, 4, 5].map(scoreVal => {
            const level = SCORE_LEVELS[scoreVal];
            const isSelected = currentScore === scoreVal;

            return (
              <button
                key={scoreVal}
                type="button"
                className={`score-btn ${isSelected ? `active-${scoreVal}` : ''}`}
                onClick={() => handleScoreSelect(scoreVal)}
              >
                <span className="score-digit">{scoreVal}</span>
                <span>{level.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested Recommendation Library Prompt (When score is 1 or 2) */}
      {shouldShowSuggestion && criterion.defaultRecommendation && (
        <div className="suggested-recommendation-box">
          <div className="rec-box-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lightbulb size={16} />
              <span>RECOMMENDATION LIBRARY SUGGESTION</span>
            </div>
            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Score {currentScore}: {SCORE_LEVELS[currentScore]?.label}</span>
          </div>
          <div className="rec-text">
            "{criterion.defaultRecommendation}"
          </div>
          <div className="rec-actions">
            <button 
              type="button" 
              className="btn btn-sm btn-primary"
              onClick={handleAcceptRecommendation}
            >
              <Check size={14} />
              <span>Accept Recommendation</span>
            </button>
            <button 
              type="button" 
              className="btn btn-sm btn-secondary"
              onClick={() => {
                handleAcceptRecommendation();
              }}
            >
              <span>Edit Recommendation</span>
            </button>
            <button 
              type="button" 
              className="btn btn-sm btn-ghost"
              onClick={handleIgnoreRecommendation}
            >
              <span>Ignore</span>
            </button>
          </div>
        </div>
      )}

      {/* Observation & Recommendation Inputs */}
      <div className="criterion-inputs-grid">
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
            Auditor Observation & Evidence
          </label>
          <textarea
            rows={3}
            placeholder="Document what is currently happening on page, friction points, or visual notes..."
            value={currentObservation}
            onChange={e => handleObservationChange(e.target.value)}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
            Actionable Strategic Recommendation
          </label>
          <textarea
            rows={3}
            placeholder="Specify clear, actionable instructions for the client or design team..."
            value={currentRecommendation}
            onChange={e => handleRecommendationChange(e.target.value)}
          />
        </div>
      </div>

      {/* Meta Row: Priority & Screenshot */}
      <div className="criterion-meta-row">
        <div className="priority-selector">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: 6 }}>
            PRIORITY:
          </span>
          {['High', 'Medium', 'Low'].map(p => (
            <button
              key={p}
              type="button"
              className={`priority-pill-btn ${currentPriority === p ? `active-${p}` : ''}`}
              onClick={() => handlePrioritySelect(p)}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Screenshot Attachment */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {currentScreenshot ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div 
                style={{ 
                  width: 50, 
                  height: 34, 
                  borderRadius: 4, 
                  overflow: 'hidden', 
                  cursor: 'pointer', 
                  border: '1px solid var(--border-default)',
                  background: '#000'
                }}
                onClick={() => setShowZoomModal(true)}
                title="Click to zoom screenshot"
              >
                <img 
                  src={currentScreenshot} 
                  alt="Criterion proof" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <button 
                type="button" 
                className="btn btn-ghost btn-sm"
                onClick={() => setShowZoomModal(true)}
              >
                <Eye size={13} />
                <span>View</span>
              </button>
              <button 
                type="button" 
                className="btn btn-ghost btn-sm"
                onClick={handleRemoveScreenshot}
                style={{ color: 'var(--red)' }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div>
              {!showScreenshotInput ? (
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowScreenshotInput(true)}
                >
                  <Camera size={14} />
                  <span>Attach Screenshot</span>
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface)', padding: 6, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                  <input 
                    type="url"
                    placeholder="Paste image URL (https://...)" 
                    value={screenshotUrlInput}
                    onChange={e => setScreenshotUrlInput(e.target.value)}
                    style={{ padding: '4px 8px', fontSize: '0.8rem', width: 200 }}
                  />
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm" 
                    onClick={handleSaveScreenshotUrl}
                    disabled={!screenshotUrlInput.trim()}
                  >
                    Save
                  </button>

                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    <span>Upload File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      style={{ display: 'none' }} 
                    />
                  </label>

                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm" 
                    onClick={() => setShowScreenshotInput(false)}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Screenshot Lightbox Modal */}
      {showZoomModal && (
        <div className="modal-overlay" onClick={() => setShowZoomModal(false)}>
          <div style={{ maxWidth: '90vw', maxHeight: '90vh', background: 'var(--bg-card)', padding: 12, borderRadius: 'var(--radius-lg)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 700 }}>{criterion.name} — Screenshot Evidence</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowZoomModal(false)}>
                <X size={18} />
              </button>
            </div>
            <img 
              src={currentScreenshot} 
              alt="Criterion full size" 
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
