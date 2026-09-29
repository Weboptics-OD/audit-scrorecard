import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/Dashboard/DashboardView';
import AuditsListView from './components/Audits/AuditsListView';
import AuditWorkspace from './components/Audits/AuditWorkspace';
import ClientsListView from './components/Clients/ClientsListView';
import ClientDetailView from './components/Clients/ClientDetailView';
import ReportPreviewView from './components/Reports/ReportPreviewView';
import TemplatesView from './components/Templates/TemplatesView';
import SettingsView from './components/Settings/SettingsView';
import AuditWizardModal from './components/Audits/AuditWizardModal';
import ClientPortalView from './components/ClientPortal/ClientPortalView';
import { CheckCircle2, AlertTriangle, Eye, ShieldAlert } from 'lucide-react';

export default function App() {
  const { 
    currentView, 
    toast, 
    isAdminMode, 
    enterAdminMode, 
    exitAdminMode, 
    templates, 
    branding, 
    recordSelfServiceAudit, 
    showToast 
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 1. SELF-SERVICE CLIENT PORTAL (Default Experience for Normal Visitors)
  if (!isAdminMode) {
    return (
      <div className="client-app-wrapper">
        <ClientPortalView 
          templates={templates}
          branding={branding}
          onSaveToInternalRepo={recordSelfServiceAudit}
          onSwitchToAdmin={enterAdminMode}
          showToast={showToast}
        />

        {/* Notification Toast */}
        {toast && (
          <div className="toast-container no-print">
            <div className={`toast toast-${toast.type || 'success'}`}>
              {toast.type === 'error' ? (
                <AlertTriangle size={18} color="var(--red)" />
              ) : (
                <CheckCircle2 size={18} color="var(--emerald)" />
              )}
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. ADMINISTRATIVE WORKSPACE (Internal Business Owner Area)
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'audits':
        return <AuditsListView />;
      case 'audit-workspace':
        return <AuditWorkspace />;
      case 'clients':
        return <ClientsListView />;
      case 'client-detail':
        return <ClientDetailView />;
      case 'report-preview':
        return <ReportPreviewView />;
      case 'templates':
        return <TemplatesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-container admin-active">
      {/* Admin Mode Floating Switcher / Notice */}
      <div className="admin-status-banner no-print">
        <div className="banner-left">
          <ShieldAlert size={15} />
          <span>Administrator Workspace Active • All historical audits & client accounts accessible</span>
        </div>
        <button 
          className="btn btn-ghost btn-sm"
          onClick={exitAdminMode}
          title="Return to public client self-service portal"
        >
          <Eye size={14} />
          <span>Exit to Client Portal</span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar 
        mobileOpen={mobileSidebarOpen} 
        onCloseMobile={() => setMobileSidebarOpen(false)} 
        onExitAdmin={exitAdminMode}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header 
          onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
          onExitAdmin={exitAdminMode}
        />

        <main className="content-body">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Guided Audit Creation Wizard */}
      <AuditWizardModal />

      {/* Notification Toast */}
      {toast && (
        <div className="toast-container no-print">
          <div className={`toast toast-${toast.type || 'success'}`}>
            {toast.type === 'error' ? (
              <AlertTriangle size={18} color="var(--red)" />
            ) : (
              <CheckCircle2 size={18} color="var(--emerald)" />
            )}
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
