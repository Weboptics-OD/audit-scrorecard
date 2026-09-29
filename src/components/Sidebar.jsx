import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Users, 
  FileText, 
  Sliders, 
  Settings, 
  Compass, 
  ChevronRight,
  PlusCircle,
  X,
  Eye
} from 'lucide-react';

export default function Sidebar({ mobileOpen, onCloseMobile, onExitAdmin }) {
  const { currentView, navigateTo, openNewAuditWizard, branding, audits } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'audits', label: 'Audits', icon: FileCheck2, badge: audits.length },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Sliders },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (viewId) => {
    if (viewId === 'reports') {
      // Navigate to reports view or the preview of latest completed audit
      const completedAudit = audits.find(a => a.status === 'Completed') || audits[0];
      if (completedAudit) {
        navigateTo('report-preview', { auditId: completedAudit.id });
      } else {
        navigateTo('audits');
      }
    } else {
      navigateTo(viewId);
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Compass size={22} strokeWidth={2.4} />
          </div>
          <div className="brand-info">
            <h2>Funnel Audit</h2>
            <span>Scorecard Pro</span>
          </div>
          {onCloseMobile && (
            <button 
              className="btn btn-ghost btn-sm no-print" 
              style={{ marginLeft: 'auto', display: mobileOpen ? 'flex' : 'none' }}
              onClick={onCloseMobile}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div style={{ padding: '16px 14px 4px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => {
              openNewAuditWizard();
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <PlusCircle size={17} />
            <span>Create New Audit</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm" 
            style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(99, 102, 241, 0.3)' }}
            onClick={() => {
              if (onExitAdmin) onExitAdmin();
              if (onCloseMobile) onCloseMobile();
            }}
            title="Switch to public self-service visitor portal"
          >
            <Eye size={15} />
            <span>View Client Portal</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id || 
              (item.id === 'audits' && currentView === 'audit-workspace') ||
              (item.id === 'reports' && currentView === 'report-preview') ||
              (item.id === 'clients' && currentView === 'client-detail');

            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={19} />
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="badge badge-gray" style={{ padding: '2px 7px', fontSize: '0.7rem' }}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">
            {branding.auditorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="user-meta">
            <div className="user-name">{branding.auditorName}</div>
            <div className="user-role">{branding.auditorTitle || 'Funnel Strategist'}</div>
          </div>
        </div>
      </aside>
    </>
  );
}
