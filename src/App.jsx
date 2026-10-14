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
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function App() {
  const { currentView, toast } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dynamic View Switcher
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
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        mobileOpen={mobileSidebarOpen} 
        onCloseMobile={() => setMobileSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

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
