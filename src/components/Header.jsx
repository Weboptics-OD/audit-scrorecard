import { Menu, Plus, FileText, ChevronRight, Eye } from 'lucide-react';

export default function Header({ onToggleMobile, onExitAdmin }) {
  const { currentView, activeAudit, openNewAuditWizard, navigateTo } = useApp();

  const getTitleAndBreadcrumb = () => {
    switch (currentView) {
      case 'dashboard':
        return { title: 'Executive Dashboard', subtitle: 'Overview of client audits, health scores, and conversion benchmarks' };
      case 'audits':
        return { title: 'Audit Repository', subtitle: 'Manage, filter, and track all client conversion evaluations' };
      case 'audit-workspace':
        return { 
          title: activeAudit?.name || 'Audit Workspace', 
          subtitle: activeAudit ? `${activeAudit.clientName} • ${activeAudit.auditTypeName}` : 'Interactive scoring and evaluation engine',
          breadcrumb: 'Audits / Workspace'
        };
      case 'clients':
        return { title: 'Client Accounts', subtitle: 'Client profiles, previous scores, and history progression' };
      case 'client-detail':
        return { title: 'Client Profile', subtitle: 'Conversion audit history and comparative progress analytics' };
      case 'report-preview':
        return { 
          title: 'Client Deliverable Report', 
          subtitle: activeAudit ? `Formal consulting report for ${activeAudit.clientName}` : 'Report preview & export',
          breadcrumb: 'Audits / Report'
        };
      case 'templates':
        return { title: 'Audit Templates & Rubrics', subtitle: 'Configure categories, criteria, weights, and recommendation libraries' };
      case 'settings':
        return { title: 'Agency Settings & Branding', subtitle: 'Custom white-label branding, auditor profile, and data management' };
      default:
        return { title: 'Funnel Audit Scorecard', subtitle: 'Professional conversion intelligence' };
    }
  };

  const { title, subtitle, breadcrumb } = getTitleAndBreadcrumb();

  return (
    <header className="app-header no-print">
      <div className="header-left">
        <button 
          className="mobile-nav-toggle" 
          onClick={onToggleMobile}
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        <div className="header-title-section">
          {breadcrumb && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>
              <span>{breadcrumb.split(' / ')[0]}</span>
              <ChevronRight size={12} />
              <span style={{ color: 'var(--primary-light)' }}>{breadcrumb.split(' / ')[1]}</span>
            </div>
          )}
          <h1>{title}</h1>
          <div className="header-subtitle">{subtitle}</div>
        </div>
      </div>

      <div className="header-actions">
        {onExitAdmin && (
          <button 
            className="btn btn-ghost btn-sm"
            onClick={onExitAdmin}
            title="Switch back to visitor self-service portal"
          >
            <Eye size={15} />
            <span className="hide-on-mobile">Client Portal</span>
          </button>
        )}

        {currentView === 'audit-workspace' && activeAudit && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => navigateTo('report-preview', { auditId: activeAudit.id })}
          >
            <FileText size={16} />
            <span>View Report</span>
          </button>
        )}

        <button 
          className="btn btn-primary btn-sm"
          onClick={() => openNewAuditWizard()}
        >
          <Plus size={16} />
          <span>New Audit</span>
        </button>
      </div>
    </header>
  );
}
