import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { runAIAuditAnalysis } from '../../services/aiAnalysisService';
import {
  X, Sparkles, Globe, CheckCircle2, AlertTriangle,
  Zap, Brain, BarChart3, Key, ExternalLink, Info
} from 'lucide-react';

const PHASES = [
  { id: 'reading',    icon: Globe,        label: 'Reading Page',       desc: 'AI is fetching and parsing the live URL...' },
  { id: 'analysing',  icon: Brain,        label: 'Analysing Criteria', desc: 'Evaluating all criteria against conversion benchmarks...' },
  { id: 'processing', icon: BarChart3,    label: 'Scoring Results',    desc: 'Calculating scores and generating recommendations...' },
  { id: 'done',       icon: CheckCircle2, label: 'Complete',           desc: 'All criteria scored and applied!' },
];

// Simple spinner via CSS animation
const SpinnerIcon = ({ size = 15, color = 'currentColor' }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.5" strokeLinecap="round"
    style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function AIAnalysisModal({ isOpen, onClose, audit, template, onApplyResults }) {
  const { branding } = useApp();

  const [apiKey, setApiKey] = useState(() => localStorage.getItem('fas_gemini_api_key') || '');
  const [status, setStatus] = useState('idle'); // idle | running | done | error
  const [progress, setProgress] = useState({ phase: '', message: '', percent: 0 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setProgress({ phase: '', message: '', percent: 0 });
      setResult(null);
      setError('');
      const stored = localStorage.getItem('fas_gemini_api_key') || '';
      setApiKey(stored);
      setShowKeyInput(!stored);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const websiteUrl = audit?.websiteUrl || '';
  const hasKey = apiKey.trim().length > 0;
  const hasUrl = websiteUrl && websiteUrl !== 'https://' && websiteUrl !== 'https://.' && websiteUrl.length > 10;
  const totalCriteria = template?.categories?.reduce((s, c) => s + (c.criteria?.length || 0), 0) || 0;

  const handleSaveKey = () => {
    localStorage.setItem('fas_gemini_api_key', apiKey.trim());
    setShowKeyInput(false);
  };

  const handleRunAnalysis = async () => {
    if (!hasKey || !hasUrl) return;
    setStatus('running');
    setError('');
    setResult(null);

    try {
      const auditContext = {
        auditTypeName: audit.auditTypeName,
        clientName: audit.clientName,
        offer: audit.offer,
        targetAudience: audit.targetAudience,
      };
      const data = await runAIAuditAnalysis(
        apiKey.trim(),
        websiteUrl,
        template,
        auditContext,
        (prog) => setProgress(prog)
      );
      setResult(data);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const handleApply = () => {
    if (result?.responses) {
      onApplyResults(result.responses);
      onClose();
    }
  };

  const currentPhaseIndex = PHASES.findIndex(p => p.id === progress.phase);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 580,
          width: '95vw',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '22px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
            }}>
              <Sparkles size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>AI Auto-Analysis</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Gemini reads your page and scores all {totalCriteria} criteria automatically
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: 6, flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>

          {/* URL Display */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <Globe size={16} color="var(--primary-light)" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 2 }}>
                PAGE TO ANALYSE
              </div>
              {hasUrl ? (
                <a
                  href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.88rem', color: 'var(--primary-light)', wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {websiteUrl}
                  </span>
                  <ExternalLink size={12} style={{ flexShrink: 0 }} />
                </a>
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--red)' }}>
                  ⚠ No URL set — add a website URL to this audit first.
                </span>
              )}
            </div>
          </div>

          {/* API Key Section */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Key size={14} color="var(--text-muted)" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Gemini API Key
                </span>
              </div>
              {hasKey && !showKeyInput && (
                <button className="btn btn-ghost btn-sm" onClick={() => setShowKeyInput(true)} style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  Change
                </button>
              )}
            </div>

            {showKeyInput ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="password"
                  placeholder="Paste your Gemini API key (AIza...)"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  style={{ flex: 1, fontSize: '0.88rem', padding: '8px 12px', fontFamily: 'monospace' }}
                  onKeyDown={e => e.key === 'Enter' && apiKey.trim() && handleSaveKey()}
                  autoFocus
                />
                <button className="btn btn-primary btn-sm" onClick={handleSaveKey} disabled={!apiKey.trim()}>
                  Save
                </button>
              </div>
            ) : hasKey ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px'
              }}>
                <CheckCircle2 size={14} color="var(--emerald)" />
                <span style={{ fontSize: '0.82rem', color: 'var(--emerald)', fontFamily: 'monospace' }}>
                  ••••••••{apiKey.slice(-4)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 4 }}>saved in browser</span>
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Get a free key at{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-light)' }}>
                  aistudio.google.com/apikey
                </a>
              </div>
            )}
          </div>

          {/* Info Banner (idle only) */}
          {status === 'idle' && (
            <div style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              marginBottom: 20,
              display: 'flex',
              gap: 10
            }}>
              <Info size={15} color="var(--primary-light)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Gemini will <strong>visit your live page</strong>, then score all <strong>{totalCriteria} criteria</strong> with
                specific observations and actionable recommendations — in about 15–30 seconds.
              </div>
            </div>
          )}

          {/* Progress (running) */}
          {status === 'running' && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{progress.message}</span>
                  <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{progress.percent}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-surface)', borderRadius: 99, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <div style={{
                    height: '100%',
                    width: `${progress.percent}%`,
                    background: 'linear-gradient(90deg, var(--primary), var(--purple))',
                    borderRadius: 99,
                    transition: 'width 0.6s ease'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PHASES.map((phase, idx) => {
                  const PhaseIcon = phase.icon;
                  const isDone = idx < currentPhaseIndex;
                  const isActive = phase.id === progress.phase;
                  return (
                    <div key={phase.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      opacity: idx > currentPhaseIndex ? 0.3 : 1,
                      transition: 'opacity 0.3s ease'
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${isDone ? 'var(--emerald)' : isActive ? 'var(--primary)' : 'var(--border-default)'}`,
                        background: isDone ? 'rgba(16,185,129,0.15)' : isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {isDone
                          ? <CheckCircle2 size={16} color="var(--emerald)" />
                          : isActive
                            ? <SpinnerIcon size={15} color="var(--primary-light)" />
                            : <PhaseIcon size={14} color="var(--text-muted)" />
                        }
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {phase.label}
                        </div>
                        {isActive && <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{phase.desc}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Success */}
          {status === 'done' && result && (() => {
            const scores = Object.values(result.responses || {}).map(r => r.score);
            const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
            const critCount = scores.filter(s => s <= 2).length;
            const goodCount = scores.filter(s => s >= 4).length;
            return (
              <div style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                textAlign: 'center',
                marginBottom: 20
              }}>
                <CheckCircle2 size={36} color="var(--emerald)" style={{ marginBottom: 10 }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 4 }}>Analysis Complete!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 16 }}>
                  Scored <strong style={{ color: 'var(--emerald)' }}>{result.totalScored} criteria</strong> with observations and recommendations.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Avg Score', value: `${avg}/5`, color: 'var(--primary-light)' },
                    { label: 'Critical Issues', value: critCount, color: 'var(--red)' },
                    { label: 'Strong Areas', value: goodCount, color: 'var(--emerald)' },
                  ].map(stat => (
                    <div key={stat.label} style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '8px 16px', textAlign: 'center', minWidth: 80 }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Error */}
          {status === 'error' && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              marginBottom: 20,
              display: 'flex',
              gap: 10
            }}>
              <AlertTriangle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--red)', marginBottom: 3 }}>Analysis Failed</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{error}</div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>

            {status === 'done' ? (
              <button className="btn btn-success" onClick={handleApply} style={{ minWidth: 160 }}>
                <CheckCircle2 size={15} />
                <span>Apply All Scores</span>
              </button>
            ) : status === 'running' ? (
              <button className="btn btn-primary" disabled style={{ minWidth: 160, opacity: 0.7 }}>
                <SpinnerIcon size={14} color="white" />
                <span>Analysing...</span>
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleRunAnalysis}
                disabled={!hasKey || !hasUrl || showKeyInput}
                title={!hasKey ? 'Add your Gemini API key first' : !hasUrl ? 'Add a URL to this audit first' : ''}
                style={{
                  minWidth: 180,
                  background: (!hasKey || !hasUrl || showKeyInput) ? undefined : 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
                  boxShadow: (!hasKey || !hasUrl || showKeyInput) ? undefined : '0 4px 15px rgba(99,102,241,0.35)'
                }}
              >
                <Sparkles size={15} />
                <span>{status === 'error' ? 'Try Again' : 'Analyse with AI'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
