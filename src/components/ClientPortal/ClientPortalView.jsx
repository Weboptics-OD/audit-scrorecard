import React, { useState, useEffect } from 'react';
import ClientHeader from './ClientHeader';
import ClientFooter from './ClientFooter';
import ClientLandingView from './ClientLandingView';
import ClientAnalysisView from './ClientAnalysisView';
import ClientResultsView from './ClientResultsView';
import { 
  executeClientAudit, 
  getActiveClientSession, 
  saveActiveClientSession, 
  clearActiveClientSession 
} from '../../services/clientAuditService';
import { generateClientReportPdf } from './ClientReportPdf';

export default function ClientPortalView({ 
  templates, 
  branding, 
  onSaveToInternalRepo, 
  onSwitchToAdmin, 
  showToast 
}) {
  const [currentStep, setCurrentStep] = useState('landing'); // 'landing' | 'analysis' | 'results'
  const [activeSession, setActiveSession] = useState(null);
  
  // Analysis runtime state
  const [analyzingTarget, setAnalyzingTarget] = useState({ url: '', auditTypeId: '' });
  const [progress, setProgress] = useState({ stepIndex: 0, percent: 10, message: 'Initializing audit...' });
  const [analysisError, setAnalysisError] = useState(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Restore active session on mount if user previously finished an audit in this browser session
  useEffect(() => {
    const existing = getActiveClientSession();
    if (existing && existing.session && existing.scoreData) {
      setActiveSession(existing);
      setCurrentStep('results');
    }
  }, []);

  // Start Audit handler
  const handleStartAudit = async ({ url, auditTypeId }) => {
    const selectedTemplate = templates.find(t => t.id === auditTypeId) || templates[0];
    setAnalyzingTarget({ url, auditTypeId, templateName: selectedTemplate.name });
    setAnalysisError(null);
    setProgress({ stepIndex: 0, percent: 15, message: 'Validating URL & establishing connection...' });
    setCurrentStep('analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const result = await executeClientAudit({
        url,
        auditTypeId,
        template: selectedTemplate,
        onProgress: (prog) => {
          setProgress(prog);
        }
      });

      setActiveSession(result);
      setCurrentStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`Conversion scorecard compiled for ${result.session.cleanDisplayUrl || 'website'}!`);

      // Record in internal admin repository for business owner visibility
      if (onSaveToInternalRepo) {
        onSaveToInternalRepo({
          id: result.session.id,
          name: `${result.session.cleanDisplayUrl || 'Self-Service'} (${result.session.auditType})`,
          clientId: null,
          clientName: result.session.cleanDisplayUrl || 'Self-Service Client',
          auditTypeId: result.session.auditTypeId,
          auditTypeName: result.session.auditType,
          websiteUrl: result.session.websiteUrl,
          auditor: branding?.auditorName || 'Self-Service AI Diagnostic',
          auditDate: new Date().toISOString().split('T')[0],
          status: 'Completed',
          responses: result.responses,
          isSelfService: true,
          overallScore: result.session.overallScore,
          createdAt: result.session.createdAt,
          updatedAt: result.session.completedAt
        });
      }
    } catch (err) {
      console.error('Audit execution failed:', err);
      setAnalysisError(err.message || "We couldn't complete the full analysis of this website. Some pages or resources may be blocking automated access. You can try again or check the URL.");
    }
  };

  // Retry failed audit
  const handleRetry = () => {
    if (analyzingTarget.url && analyzingTarget.auditTypeId) {
      handleStartAudit({ url: analyzingTarget.url, auditTypeId: analyzingTarget.auditTypeId });
    } else {
      setCurrentStep('landing');
    }
  };

  // Cancel analysis and return to URL input
  const handleCancelAnalysis = () => {
    setCurrentStep('landing');
    setAnalysisError(null);
  };

  // Start fresh audit without any history
  const handleStartAnotherAudit = () => {
    clearActiveClientSession();
    setActiveSession(null);
    setAnalysisError(null);
    setCurrentStep('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Ready for a new website audit.');
  };

  // PDF report download
  const handleDownloadReport = async () => {
    if (!activeSession) return;
    setIsExportingPdf(true);
    showToast('Compiling your single-session PDF audit deliverable...', 'info');

    try {
      await generateClientReportPdf(activeSession, branding);
      showToast('Audit report successfully downloaded!');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Could not download PDF automatically. You can print the page.', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="client-portal-wrapper">
      {/* Top Header */}
      <ClientHeader 
        onStartNewAudit={handleStartAnotherAudit} 
        onEnterAdmin={onSwitchToAdmin}
        currentStep={currentStep}
        hasActiveAudit={!!activeSession}
      />

      {/* Main Flow Body */}
      <main className="client-portal-main">
        {currentStep === 'landing' && (
          <ClientLandingView 
            onStartAudit={handleStartAudit} 
            templates={templates} 
          />
        )}

        {currentStep === 'analysis' && (
          <ClientAnalysisView 
            url={analyzingTarget.url}
            auditTypeTitle={analyzingTarget.templateName || 'Conversion Audit'}
            progress={progress}
            error={analysisError}
            onRetry={handleRetry}
            onCancel={handleCancelAnalysis}
          />
        )}

        {currentStep === 'results' && activeSession && (
          <ClientResultsView 
            auditSession={activeSession}
            onDownloadReport={handleDownloadReport}
            onStartAnotherAudit={handleStartAnotherAudit}
            isExportingPdf={isExportingPdf}
          />
        )}
      </main>

      {/* Footer with Privacy Notice & Admin Access */}
      <ClientFooter onEnterAdmin={onSwitchToAdmin} />
    </div>
  );
}
