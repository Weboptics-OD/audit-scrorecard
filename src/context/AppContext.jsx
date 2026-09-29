import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_TEMPLATES } from '../data/defaultTemplates';
import { INITIAL_CLIENTS, INITIAL_AUDITS, INITIAL_BRAND_SETTINGS } from '../data/mockInitialData';

const AppContext = createContext();

const STORAGE_KEYS = {
  CLIENTS: 'fas_clients_v1',
  AUDITS: 'fas_audits_v1',
  TEMPLATES: 'fas_templates_v1',
  BRANDING: 'fas_branding_v1'
};

// Sanitize stored audits: ensure all scores are numbers (fixes localStorage type corruption)
function sanitizeAudits(auditList) {
  return auditList.map(audit => {
    if (!audit.responses) return audit;
    const cleanResponses = {};
    Object.entries(audit.responses).forEach(([critId, resp]) => {
      cleanResponses[critId] = {
        ...resp,
        ...(resp.score !== undefined ? { score: Number(resp.score) } : {})
      };
    });
    return { ...audit, responses: cleanResponses };
  });
}

export function AppProvider({ children }) {
  // Navigation & Active States
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeAuditId, setActiveAuditId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardPreselectedClient, setWizardPreselectedClient] = useState(null);
  const [toast, setToast] = useState(null);

  // Logical Experience Separation: Client Portal (default) vs Admin Workspace
  const [isAdminMode, setIsAdminMode] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true' || window.location.hash === '#admin') {
        return true;
      }
      return sessionStorage.getItem('fas_admin_mode') === 'true';
    } catch {
      return false;
    }
  });

  const enterAdminMode = useCallback(() => {
    setIsAdminMode(true);
    try {
      sessionStorage.setItem('fas_admin_mode', 'true');
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const exitAdminMode = useCallback(() => {
    setIsAdminMode(false);
    try {
      sessionStorage.removeItem('fas_admin_mode');
    } catch (e) {
      console.warn(e);
    }
    if (window.location.search.includes('admin') || window.location.hash.includes('admin')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Clients State
  const [clients, setClients] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return stored ? JSON.parse(stored) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  // Templates State
  const [templates, setTemplates] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      return stored ? JSON.parse(stored) : DEFAULT_TEMPLATES;
    } catch {
      return DEFAULT_TEMPLATES;
    }
  });


  // Audits State
  const [audits, setAudits] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDITS);
      return stored ? sanitizeAudits(JSON.parse(stored)) : INITIAL_AUDITS;
    } catch {
      return INITIAL_AUDITS;
    }
  });

  // Brand Settings State
  const [branding, setBranding] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BRANDING);
      return stored ? JSON.parse(stored) : INITIAL_BRAND_SETTINGS;
    } catch {
      return INITIAL_BRAND_SETTINGS;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [templates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDITS, JSON.stringify(audits));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [audits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANDING, JSON.stringify(branding));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [branding]);

  // Toast notification helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev && prev.message === message ? null : prev));
    }, 4000);
  }, []);

  // Navigation helpers
  const navigateTo = useCallback((view, params = {}) => {
    if (params.auditId) setActiveAuditId(params.auditId);
    if (params.clientId) setSelectedClientId(params.clientId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openNewAuditWizard = useCallback((clientId = null) => {
    setWizardPreselectedClient(clientId);
    setIsWizardOpen(true);
  }, []);

  const closeNewAuditWizard = useCallback(() => {
    setIsWizardOpen(false);
    setWizardPreselectedClient(null);
  }, []);

  // Client Management CRUD
  const addClient = useCallback((clientData) => {
    const newClient = {
      ...clientData,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClients(prev => [newClient, ...prev]);
    showToast(`Client "${newClient.companyName}" created successfully.`);
    return newClient;
  }, [showToast]);

  const updateClient = useCallback((clientId, updates) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updates } : c));
    showToast('Client details updated.');
  }, [showToast]);

  const deleteClient = useCallback((clientId) => {
    const client = clients.find(c => c.id === clientId);
    setClients(prev => prev.filter(c => c.id !== clientId));
    // Also remove client from audits or keep historical reference
    setAudits(prev => prev.filter(a => a.clientId !== clientId));
    showToast(`Client "${client?.companyName || 'item'}" and associated audits removed.`, 'warning');
    if (selectedClientId === clientId) {
      setSelectedClientId(null);
      setCurrentView('clients');
    }
  }, [clients, selectedClientId, showToast]);

  // Audit Management CRUD
  const createAudit = useCallback((auditPayload) => {
    const template = templates.find(t => t.id === auditPayload.auditTypeId) || templates[0];
    const client = clients.find(c => c.id === auditPayload.clientId);

    const newAudit = {
      id: `audit-${Date.now()}`,
      name: auditPayload.name || `${client?.companyName || 'Client'} ${template.name}`,
      clientId: auditPayload.clientId,
      clientName: client?.companyName || 'Unknown Client',
      auditTypeId: template.id,
      auditTypeName: template.name,
      websiteUrl: auditPayload.websiteUrl || client?.website || 'https://',
      industry: auditPayload.industry || client?.industry || '',
      offer: auditPayload.offer || client?.offer || '',
      targetAudience: auditPayload.targetAudience || client?.targetAudience || '',
      auditor: auditPayload.auditor || branding.auditorName,
      auditDate: auditPayload.auditDate || new Date().toISOString().split('T')[0],
      status: 'In Progress',
      notes: auditPayload.notes || '',
      responses: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAudits(prev => [newAudit, ...prev]);
    setActiveAuditId(newAudit.id);
    setIsWizardOpen(false);
    showToast(`Audit "${newAudit.name}" initiated. Template loaded.`);
    setCurrentView('audit-workspace');
    return newAudit;
  }, [templates, clients, branding, showToast]);

  const updateAudit = useCallback((auditId, updates) => {
    setAudits(prev => prev.map(a => {
      if (a.id === auditId) {
        return {
          ...a,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return a;
    }));
  }, []);

  const saveCriterionResponse = useCallback((auditId, criterionId, responseData) => {
    setAudits(prev => prev.map(a => {
      if (a.id === auditId) {
        const existingResponses = a.responses || {};
        const updatedResponses = {
          ...existingResponses,
          [criterionId]: {
            ...(existingResponses[criterionId] || {}),
            ...responseData,
            // Always store score as a number to prevent type mismatch bugs
            ...(responseData.score !== undefined ? { score: Number(responseData.score) } : {}),
            updatedAt: new Date().toISOString()
          }
        };

        // Determine if status should change
        let nextStatus = a.status;
        if (a.status === 'Draft') nextStatus = 'In Progress';

        return {
          ...a,
          responses: updatedResponses,
          status: nextStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return a;
    }));
  }, []);

  const duplicateAudit = useCallback((auditId) => {
    const source = audits.find(a => a.id === auditId);
    if (!source) return;

    const copy = {
      ...source,
      id: `audit-${Date.now()}`,
      name: `${source.name} (Copy)`,
      status: 'Draft',
      auditDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAudits(prev => [copy, ...prev]);
    showToast(`Duplicated audit "${source.name}".`);
  }, [audits, showToast]);

  const deleteAudit = useCallback((auditId) => {
    const audit = audits.find(a => a.id === auditId);
    setAudits(prev => prev.filter(a => a.id !== auditId));
    showToast(`Audit "${audit?.name || 'item'}" deleted.`, 'warning');
    if (activeAuditId === auditId) {
      setActiveAuditId(null);
      setCurrentView('audits');
    }
  }, [audits, activeAuditId, showToast]);

  // Template Management CRUD
  const updateTemplate = useCallback((updatedTemplate) => {
    setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    showToast(`Template "${updatedTemplate.name}" updated.`);
  }, [showToast]);

  const createTemplate = useCallback((templateData) => {
    const newTpl = {
      ...templateData,
      id: `custom-template-${Date.now()}`
    };
    setTemplates(prev => [...prev, newTpl]);
    showToast(`New template "${newTpl.name}" created.`);
    return newTpl;
  }, [showToast]);

  // Reset to default demo data
  const resetToDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
    localStorage.removeItem(STORAGE_KEYS.AUDITS);
    localStorage.removeItem(STORAGE_KEYS.TEMPLATES);
    localStorage.removeItem(STORAGE_KEYS.BRANDING);
    setClients(INITIAL_CLIENTS);
    setAudits(INITIAL_AUDITS);
    setTemplates(DEFAULT_TEMPLATES);
    setBranding(INITIAL_BRAND_SETTINGS);
    setActiveAuditId(null);
    setSelectedClientId(null);
    setCurrentView('dashboard');
    showToast('Platform restored to default demo data.');
  }, [showToast]);

  // Active audit & template resolution
  const activeAudit = audits.find(a => a.id === activeAuditId) || null;
  const activeAuditTemplate = activeAudit 
    ? (templates.find(t => t.id === activeAudit.auditTypeId) || templates[0]) 
    : null;

  // Record completed self-service audit to internal repository for business owner visibility
  const recordSelfServiceAudit = useCallback((auditPayload) => {
    setAudits(prev => {
      if (prev.some(a => a.id === auditPayload.id)) {
        return prev.map(a => a.id === auditPayload.id ? { ...a, ...auditPayload } : a);
      }
      return [auditPayload, ...prev];
    });
  }, []);

  const value = {
    // Nav & Mode
    currentView,
    setCurrentView,
    navigateTo,
    activeAuditId,
    setActiveAuditId,
    selectedClientId,
    setSelectedClientId,
    isWizardOpen,
    openNewAuditWizard,
    closeNewAuditWizard,
    wizardPreselectedClient,
    toast,
    showToast,
    isAdminMode,
    setIsAdminMode,
    enterAdminMode,
    exitAdminMode,

    // Entities
    clients,
    audits,
    templates,
    branding,
    setBranding,
    activeAudit,
    activeAuditTemplate,

    // Actions
    addClient,
    updateClient,
    deleteClient,
    createAudit,
    updateAudit,
    saveCriterionResponse,
    duplicateAudit,
    deleteAudit,
    updateTemplate,
    createTemplate,
    resetToDemoData,
    recordSelfServiceAudit
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
