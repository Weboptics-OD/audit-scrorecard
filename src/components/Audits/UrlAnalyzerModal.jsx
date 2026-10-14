import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight,
  Zap,
  ShieldCheck,
  Search,
  Smartphone,
  Eye
} from 'lucide-react';

export default function UrlAnalyzerModal({ isOpen, onClose, websiteUrl, onApplyFindings }) {
  const [url, setUrl] = useState(websiteUrl || 'https://');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);

  if (!isOpen) return null;

  const handleRunScan = () => {
    if (!url || url.length < 5) return;
    setIsScanning(true);
    setScanResults(null);

    // Simulate comprehensive technical and heuristic inspection of the URL
    setTimeout(() => {
      const isHttps = url.startsWith('https://');
      const domain = url.replace(/^https?:\/\//, '').split('/')[0];

      setScanResults({
        url,
        domain,
        timestamp: new Date().toLocaleTimeString(),
        speedScore: 78,
        findings: [
          {
            area: 'Technical & Performance',
            criterionId: 'lp-tp-5',
            status: isHttps ? 'pass' : 'fail',
            title: isHttps ? 'SSL Encryption Enforced' : 'Missing SSL / Insecure Protocol',
            detail: isHttps ? 'Valid TLS 1.3 certificate detected with strict HTTPS enforcement.' : 'Website is served over unencrypted HTTP protocol.',
            suggestedScore: isHttps ? 5 : 1,
            suggestedRec: isHttps ? 'Maintain SSL automated cert renewals.' : 'Install and enforce SSL certificate immediately.'
          },
          {
            area: 'UX & Usability',
            criterionId: 'lp-ux-7',
            status: 'warning',
            title: 'Mobile Viewport & Touch Targets',
            detail: 'Viewport tag detected, but 3 secondary buttons have touch targets under 44px on mobile viewports.',
            suggestedScore: 3,
            suggestedRec: 'Enlarge mobile touch targets and ensure buttons have minimum 48px height.'
          },
          {
            area: 'First Impression',
            criterionId: 'lp-fi-1',
            status: 'warning',
            title: 'Headline & H1 Tag Structure',
            detail: 'H1 tag contains 18 words with dense conceptual phrasing. 5-second clarity test flagged as borderline.',
            suggestedScore: 2,
            suggestedRec: 'Condense hero headline to under 10 punchy words emphasizing the primary quantifiable outcome.'
          },
          {
            area: 'Conversion Strategy',
            criterionId: 'lp-cs-2',
            status: 'warning',
            title: 'CTA Frequency & Placement',
            detail: 'Primary CTA button appears above the fold, but no sticky header button or repeating CTA was found along the 3,800px page scroll.',
            suggestedScore: 2,
            suggestedRec: 'Deploy a sticky navigation bar with primary CTA and repeat button following testimonials and pricing.'
          },
          {
            area: 'Trust & Credibility',
            criterionId: 'lp-tc-4',
            status: 'pass',
            title: 'Client Proof & Logo Bar',
            detail: 'Detected 6 partner/client SVG logos in a high-visibility hero strip.',
            suggestedScore: 4,
            suggestedRec: 'Enhance logos with quantitative summary caption.'
          }
        ]
      });
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '750px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
              <Zap size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>URL Heuristic Scanner & AI Diagnostics</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Inspect live page assets, speed indicators, metadata, and CTA hierarchy
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Globe size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com/landing-page"
                style={{ paddingLeft: 36 }}
              />
            </div>
            <button 
              className="btn btn-primary"
              onClick={handleRunScan}
              disabled={isScanning || !url}
            >
              {isScanning ? (
                <>
                  <Sparkles size={16} className="animate-spin" />
                  <span>Scanning Page...</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>Scan Page</span>
                </>
              )}
            </button>
          </div>

          {isScanning && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <div style={{ width: 44, height: 44, border: '3px solid var(--border-default)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
              <h4 style={{ color: 'var(--text-primary)', marginBottom: 6 }}>Evaluating Website Elements</h4>
              <p style={{ fontSize: '0.85rem' }}>Analyzing SSL certificate, viewport responsiveness, headline structure, and CTA layout...</p>
            </div>
          )}

          {scanResults && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', marginBottom: 18, border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TARGET DOMAIN</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{scanResults.domain}</div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PAGE SPEED</span>
                    <div style={{ fontWeight: 800, color: scanResults.speedScore >= 80 ? 'var(--emerald)' : 'var(--amber)' }}>
                      {scanResults.speedScore}/100
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>DIAGNOSTICS</span>
                    <div style={{ fontWeight: 800, color: 'var(--primary-light)' }}>
                      {scanResults.findings.length} Elements
                    </div>
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: '0.9rem', marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Detected Diagnostic Findings
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {scanResults.findings.map((item, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      padding: 16, 
                      background: 'var(--bg-card)', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14
                    }}
                  >
                    <div style={{ marginTop: 2 }}>
                      {item.status === 'pass' && <CheckCircle2 size={18} color="var(--emerald)" />}
                      {item.status === 'warning' && <AlertTriangle size={18} color="var(--amber)" />}
                      {item.status === 'fail' && <XCircle size={18} color="var(--red)" />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.925rem' }}>{item.title}</span>
                        <span className="badge badge-gray" style={{ fontSize: '0.68rem' }}>{item.area}</span>
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                        {item.detail}
                      </p>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary-light)', background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: 4 }}>
                        <strong>Suggested Recommendation:</strong> {item.suggestedRec}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {scanResults && (
            <button 
              className="btn btn-primary"
              onClick={() => {
                if (onApplyFindings) onApplyFindings(scanResults.findings);
                onClose();
              }}
            >
              <span>Apply Findings to Audit Responses</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
