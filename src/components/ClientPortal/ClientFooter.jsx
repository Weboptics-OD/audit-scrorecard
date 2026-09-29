import React from 'react';
import { Lock, ShieldCheck, ExternalLink } from 'lucide-react';

export default function ClientFooter({ onEnterAdmin }) {
  return (
    <footer className="client-footer no-print">
      <div className="client-footer-content">
        <div className="client-footer-left">
          <div className="footer-brand-title">Funnel Audit Scorecard Pro</div>
          <p className="footer-tagline">
            Professional conversion rate optimization & funnel diagnostic intelligence.
          </p>
          <div className="privacy-badge">
            <ShieldCheck size={14} color="var(--emerald)" />
            <span>Session-Isolated Audits • Untracked • No Account Required</span>
          </div>
        </div>

        <div className="client-footer-right">
          <div className="footer-links">
            <span className="footer-copy">
              © {new Date().getFullYear()} All rights reserved.
            </span>
            <span className="footer-divider">•</span>
            <button 
              className="admin-link-btn" 
              onClick={onEnterAdmin}
              title="Access administrative dashboard"
            >
              <Lock size={12} />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
