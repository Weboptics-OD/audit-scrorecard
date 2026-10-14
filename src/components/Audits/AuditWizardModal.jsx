import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Layout, 
  TrendingUp, 
  Globe, 
  Sparkles,
  Building,
  User,
  Plus
} from 'lucide-react';

export default function AuditWizardModal() {
  const { 
    isWizardOpen, 
    closeNewAuditWizard, 
    clients, 
    templates, 
    createAudit, 
    wizardPreselectedClient,
    branding,
    addClient
  } = useApp();

  const [step, setStep] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('landing-page-audit');
  
  // Quick Add Client Inline
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientWebsite, setNewClientWebsite] = useState('');
  const [newClientIndustry, setNewClientIndustry] = useState('');

  // Project Info Form State
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    industry: '',
    offer: '',
    targetAudience: '',
    auditor: branding?.auditorName || 'Alex Mercer',
    auditDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (isWizardOpen) {
      setStep(1);
      const initialClient = wizardPreselectedClient || (clients.length > 0 ? clients[0].id : '');
      setSelectedClientId(initialClient);
      setSelectedTemplateId('landing-page-audit');
      setShowAddClientForm(false);
    }
  }, [isWizardOpen, wizardPreselectedClient, clients]);

  // When client changes, auto-fill project info defaults
  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find(c => c.id === selectedClientId);
      const tpl = templates.find(t => t.id === selectedTemplateId);
      if (client) {
        setFormData(prev => ({
          ...prev,
          name: `${client.companyName} - ${tpl?.name || 'Conversion Audit'}`,
          websiteUrl: client.website || '',
          industry: client.industry || '',
          offer: client.offer || '',
          targetAudience: client.targetAudience || '',
          auditor: branding?.auditorName || 'Alex Mercer'
        }));
      }
    }
  }, [selectedClientId, selectedTemplateId, clients, templates, branding]);

  if (!isWizardOpen) return null;

  const handleCreateInlineClient = (e) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const created = addClient({
      companyName: newClientName.trim(),
      contactName: 'Primary Contact',
      email: '',
      website: newClientWebsite.trim() || 'https://',
      industry: newClientIndustry.trim() || 'General Business',
      offer: '',
      targetAudience: '',
      notes: 'Added during audit creation wizard.'
    });

    setSelectedClientId(created.id);
    setShowAddClientForm(false);
    setNewClientName('');
    setNewClientWebsite('');
    setNewClientIndustry('');
  };

  const handleNext = () => {
    if (step === 1 && !selectedClientId) return;
    if (step === 2 && !selectedTemplateId) return;
    if (step === 3) {
      // Step 4: Start Audit
      createAudit({
        clientId: selectedClientId,
        auditTypeId: selectedTemplateId,
        ...formData
      });
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const templateIcons = {
    'landing-page-audit': Layout,
    'sales-funnel-audit': TrendingUp,
    'website-conversion-audit': Globe
  };

  return (
    <div className="modal-overlay" onClick={closeNewAuditWizard}>
      <div className="modal-container" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Create New Audit</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Guided setup • Step {step} of 3
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={closeNewAuditWizard}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Steps Indicator */}
          <div className="wizard-steps-header">
            <div className={`wizard-step-node ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-number">{step > 1 ? <Check size={16} /> : '1'}</div>
              <span>Select Client</span>
            </div>
            <div style={{ flex: 1, height: 2, background: 'var(--border-subtle)', margin: '0 12px' }} />
            <div className={`wizard-step-node ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-number">{step > 2 ? <Check size={16} /> : '2'}</div>
              <span>Select Audit Type</span>
            </div>
            <div style={{ flex: 1, height: 2, background: 'var(--border-subtle)', margin: '0 12px' }} />
            <div className={`wizard-step-node ${step === 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Project Details</span>
            </div>
          </div>

          {/* STEP 1: Select Client */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: 6 }}>Who is this audit for?</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                Select an existing client account or quickly add a new client to maintain comprehensive audit history.
              </p>

              {!showAddClientForm ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    CLIENT ACCOUNT
                  </label>
                  <select 
                    value={selectedClientId} 
                    onChange={e => setSelectedClientId(e.target.value)}
                    style={{ fontSize: '1rem', padding: '12px 16px' }}
                  >
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.companyName} ({client.industry || 'General'})
                      </option>
                    ))}
                  </select>

                  <div style={{ marginTop: 8 }}>
                    <button 
                      type="button"
                      className="btn btn-secondary btn-sm" 
                      onClick={() => setShowAddClientForm(true)}
                    >
                      <Plus size={15} />
                      <span>+ Add New Client Account</span>
                    </button>
                  </div>

                  {selectedClientId && (
                    <div style={{ 
                      marginTop: 14, 
                      padding: 16, 
                      background: 'var(--bg-surface)', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border-subtle)' 
                    }}>
                      {(() => {
                        const cl = clients.find(c => c.id === selectedClientId);
                        if (!cl) return null;
                        return (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.85rem' }}>
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>WEBSITE</span>
                              <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{cl.website || 'N/A'}</span>
                            </div>
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>INDUSTRY</span>
                              <span>{cl.industry || 'General'}</span>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>CORE OFFER</span>
                              <span>{cl.offer || 'Not specified'}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleCreateInlineClient} style={{ background: 'var(--bg-surface)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Building size={16} color="var(--primary-light)" />
                    <span>Quick Create Client</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                        Company / Brand Name *
                      </label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Acme Tech Labs" 
                        value={newClientName} 
                        onChange={e => setNewClientName(e.target.value)} 
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                          Website URL
                        </label>
                        <input 
                          type="url" 
                          placeholder="https://acme.com" 
                          value={newClientWebsite} 
                          onChange={e => setNewClientWebsite(e.target.value)} 
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                          Industry
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. SaaS, E-commerce" 
                          value={newClientIndustry} 
                          onChange={e => setNewClientIndustry(e.target.value)} 
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                      <button 
                        type="button" 
                        className="btn btn-ghost btn-sm" 
                        onClick={() => setShowAddClientForm(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary btn-sm">
                        Save & Select Client
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: Select Audit Type */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: 6 }}>Select Audit Template</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                Each template loads a specialized rubric with specific categories, criteria, weights, and recommendation libraries.
              </p>

              <div className="template-cards-grid">
                {templates.slice(0, 3).map(tpl => {
                  const Icon = templateIcons[tpl.id] || Layout;
                  const isSelected = selectedTemplateId === tpl.id;
                  const totalCriteria = (tpl.categories || []).reduce((acc, c) => acc + (c.criteria?.length || 0), 0);

                  return (
                    <div
                      key={tpl.id}
                      className={`template-card-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="template-card-icon">
                          <Icon size={22} />
                        </div>
                        {isSelected && (
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={14} color="#fff" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 4 }}>
                          {tpl.name}
                        </h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {tpl.description}
                        </p>
                      </div>
                      <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>{tpl.categories?.length || 0} Categories</span>
                        <span>{totalCriteria} Criteria</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {templates.length > 3 && (
                <div style={{ marginTop: 14 }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Or choose from custom templates:
                  </label>
                  <select 
                    value={selectedTemplateId} 
                    onChange={e => setSelectedTemplateId(e.target.value)}
                  >
                    {templates.map(tpl => (
                      <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Project Information */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: 6 }}>Project Details</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 18 }}>
                Review and confirm the evaluation metadata for the client deliverable report.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Audit Project Name *
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      Website URL *
                    </label>
                    <input 
                      type="url" 
                      required 
                      value={formData.websiteUrl} 
                      onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      Industry
                    </label>
                    <input 
                      type="text" 
                      value={formData.industry} 
                      onChange={e => setFormData({ ...formData, industry: e.target.value })} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      Primary Offer / Product
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. $499 Consultation Package" 
                      value={formData.offer} 
                      onChange={e => setFormData({ ...formData, offer: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      Target Audience
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. B2B Founders" 
                      value={formData.targetAudience} 
                      onChange={e => setFormData({ ...formData, targetAudience: e.target.value })} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      Lead Auditor Name
                    </label>
                    <input 
                      type="text" 
                      value={formData.auditor} 
                      onChange={e => setFormData({ ...formData, auditor: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      Audit Date
                    </label>
                    <input 
                      type="date" 
                      value={formData.auditDate} 
                      onChange={e => setFormData({ ...formData, auditDate: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step > 1 ? (
            <button className="btn btn-secondary" onClick={handleBack}>
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <button className="btn btn-ghost" onClick={closeNewAuditWizard}>
              Cancel
            </button>
          )}

          <button 
            className="btn btn-primary" 
            onClick={handleNext}
            disabled={step === 1 && !selectedClientId}
          >
            <span>{step === 3 ? 'Launch Audit Workspace' : 'Continue'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
