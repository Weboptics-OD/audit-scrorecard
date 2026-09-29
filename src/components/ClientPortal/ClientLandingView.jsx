import React, { useState } from 'react';
import { 
  Globe, 
  ArrowRight, 
  Layout, 
  TrendingUp, 
  FileCheck2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Award,
  Layers
} from 'lucide-react';
import { normalizeUrl, validateAuditUrl } from '../../services/securityValidator';

export default function ClientLandingView({ onStartAudit, templates }) {
  const [urlInput, setUrlInput] = useState('');
  const [selectedAuditType, setSelectedAuditType] = useState('landing-page-audit');
  const [validationError, setValidationError] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  // The 3 audit types requested
  const auditOptions = [
    {
      id: 'landing-page-audit',
      title: 'Landing Page Audit',
      description: "Evaluate your landing page's messaging, offer, CTA, trust elements, UX, and conversion structure.",
      icon: Layout,
      badge: 'Most Popular',
      badgeClass: 'badge-purple'
    },
    {
      id: 'sales-funnel-audit',
      title: 'Sales Funnel Audit',
      description: 'Evaluate the journey from traffic through lead capture, follow-up, booking, checkout, and conversion.',
      icon: TrendingUp,
      badge: 'High Impact',
      badgeClass: 'badge-emerald'
    },
    {
      id: 'website-conversion-audit',
      title: 'Website Conversion Audit',
      description: "Evaluate your website's structure, messaging, UX, trust, CTAs, lead generation, and conversion paths.",
      icon: Globe,
      badge: 'Comprehensive',
      badgeClass: 'badge-blue'
    }
  ];

  // Auto-normalize on change or blur
  const handleInputChange = (e) => {
    const val = e.target.value;
    setUrlInput(val);
    if (validationError) {
      setValidationError('');
    }
  };

  const handleBlur = () => {
    setHasInteracted(true);
    if (urlInput.trim()) {
      const normalized = normalizeUrl(urlInput);
      if (normalized !== urlInput) {
        setUrlInput(normalized);
      }
      const valResult = validateAuditUrl(normalized);
      if (!valResult.isValid) {
        setValidationError(valResult.error);
      } else {
        setValidationError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasInteracted(true);

    const normalized = normalizeUrl(urlInput);
    setUrlInput(normalized);

    const validation = validateAuditUrl(normalized);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    setValidationError('');
    onStartAudit({
      url: validation.normalizedUrl,
      auditTypeId: selectedAuditType
    });
  };

  return (
    <div className="client-landing-container">
      {/* Hero Header */}
      <div className="landing-hero text-center">
        <div className="landing-badge">
          <Sparkles size={14} color="var(--primary-light)" />
          <span>Objective Conversion Rate Optimization Scorecard</span>
        </div>

        <h1 className="landing-title">
          Find the conversion problems <br />
          <span className="text-gradient">holding your website back.</span>
        </h1>

        <p className="landing-subtitle">
          Enter your website URL and get a structured, comprehensive conversion audit in seconds. 
          No waiting for consultants. No account required.
        </p>
      </div>

      {/* Primary Action Card: URL Input + Audit Type Selection */}
      <div className="landing-form-card card card-hover">
        <form onSubmit={handleSubmit} noValidate>
          {/* URL Input Group */}
          <div className="form-group-landing">
            <label htmlFor="website-url-input" className="landing-input-label">
              Enter your website URL
            </label>
            <div className={`url-input-wrapper ${validationError ? 'has-error' : ''}`}>
              <div className="url-input-icon">
                <Globe size={20} />
              </div>
              <input
                id="website-url-input"
                type="url"
                inputMode="url"
                className="landing-url-input"
                placeholder="https://yourwebsite.com"
                value={urlInput}
                onChange={handleInputChange}
                onBlur={handleBlur}
                autoFocus
                autoComplete="url"
                aria-invalid={!!validationError}
                aria-describedby={validationError ? 'url-validation-error' : undefined}
              />
              <button
                type="submit"
                className="btn btn-primary landing-submit-btn"
                disabled={!urlInput.trim()}
              >
                <span>Start Free Audit</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Validation Message */}
            {validationError && (
              <div id="url-validation-error" className="validation-error-alert" role="alert">
                <AlertCircle size={16} />
                <span>{validationError}</span>
              </div>
            )}

            <div className="url-input-hint">
              <span>Example: <code>yourwebsite.com</code> or <code>https://funnel.brand.com/offer</code></span>
            </div>
          </div>

          {/* Audit Type Selector */}
          <div className="audit-type-section">
            <div className="audit-type-header">
              <span className="section-label">Choose your audit:</span>
              <span className="section-sublabel">Select the specific conversion framework you want applied</span>
            </div>

            <div className="audit-type-grid">
              {auditOptions.map((opt) => {
                const isSelected = selectedAuditType === opt.id;
                const Icon = opt.icon;

                return (
                  <div
                    key={opt.id}
                    className={`audit-type-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedAuditType(opt.id)}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        setSelectedAuditType(opt.id);
                      }
                    }}
                  >
                    <div className="card-top">
                      <div className={`card-icon-box ${isSelected ? 'active' : ''}`}>
                        <Icon size={20} />
                      </div>
                      <span className={`badge ${opt.badgeClass}`}>{opt.badge}</span>
                    </div>

                    <div className="card-title">{opt.title}</div>
                    <p className="card-desc">{opt.description}</p>

                    <div className="card-selector-indicator">
                      <div className={`custom-radio ${isSelected ? 'checked' : ''}`}>
                        {isSelected && <div className="radio-dot" />}
                      </div>
                      <span className="select-text">{isSelected ? 'Selected' : 'Select'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Submit Button (visible on small screens) */}
          <div className="mobile-submit-container">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={!urlInput.trim()}
            >
              <span>Start Free Audit</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Feature Highlights & CRO Pillars */}
      <div className="landing-features-grid">
        <div className="feature-item card">
          <div className="feature-icon-wrapper" style={{ color: 'var(--primary-light)' }}>
            <Layers size={22} />
          </div>
          <h3>50+ Conversion Checkpoints</h3>
          <p>
            Evaluates headline clarity, value proposition, CTA visibility, social proof, objection handling, and mobile layout.
          </p>
        </div>

        <div className="feature-item card">
          <div className="feature-icon-wrapper" style={{ color: 'var(--emerald)' }}>
            <Award size={22} />
          </div>
          <h3>Calibrated 100-Point Score</h3>
          <p>
            Receive a weighted overall readiness score and classification derived from battle-tested conversion benchmarks.
          </p>
        </div>

        <div className="feature-item card">
          <div className="feature-icon-wrapper" style={{ color: 'var(--amber)' }}>
            <Zap size={22} />
          </div>
          <h3>High-Priority Action Plan</h3>
          <p>
            Pinpoint exact conversion leaks and get prioritized, actionable recommendations ranked by potential revenue impact.
          </p>
        </div>

        <div className="feature-item card">
          <div className="feature-icon-wrapper" style={{ color: 'var(--cyan)' }}>
            <ShieldCheck size={22} />
          </div>
          <h3>100% Private & Isolated</h3>
          <p>
            Each audit runs independently in its own session. No account, credit card, or client profiles needed.
          </p>
        </div>
      </div>
    </div>
  );
}
