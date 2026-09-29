import React from 'react';
import { Compass, Sparkles, Shield, RotateCcw } from 'lucide-react';

export default function ClientHeader({ onStartNewAudit, onEnterAdmin, currentStep, hasActiveAudit }) {
  return (
    <header className="client-header no-print">
      <div className="client-header-container">
        {/* Brand */}
        <div 
          className="client-brand" 
          onClick={onStartNewAudit} 
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
        >
          <div className="brand-icon">
            <Compass size={22} strokeWidth={2.4} />
          </div>
          <div className="brand-info">
            <h2>Funnel Audit</h2>
            <span>Scorecard</span>
          </div>
        </div>

        {/* Center / Status */}
        <div className="client-header-center">
          <div className="status-pill status-completed" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary-light)' }}>
            <Sparkles size={13} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Self-Service CRO Audit</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="client-header-actions">
          {currentStep === 'results' && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onStartNewAudit}
              title="Start a fresh audit for another website"
            >
              <RotateCcw size={15} />
              <span>New Audit</span>
            </button>
          )}

          {/* Discreet Admin Portal Link */}
          <button 
            className="btn btn-ghost btn-sm"
            onClick={onEnterAdmin}
            title="Internal Administrator Workspace"
            style={{ opacity: 0.7, padding: '6px 10px' }}
          >
            <Shield size={15} />
            <span className="hide-on-mobile" style={{ fontSize: '0.8rem' }}>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
