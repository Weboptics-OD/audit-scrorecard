import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAuditScores } from '../../data/scoringEngine';
import ClientModal from './ClientModal';
import { 
  PlusCircle, 
  Search, 
  Building, 
  ExternalLink, 
  ArrowRight, 
  FileCheck2, 
  TrendingUp, 
  User, 
  Mail, 
  Edit3, 
  Trash2 
} from 'lucide-react';

export default function ClientsListView() {
  const { clients, audits, templates, navigateTo, openNewAuditWizard, addClient, updateClient, deleteClient } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  // Compute stats per client
  const enrichedClients = useMemo(() => {
    return clients.map(client => {
      const clientAudits = audits.filter(a => a.clientId === client.id);
      
      // Calculate scores for client audits
      const scoredAudits = clientAudits.map(audit => {
        const template = templates.find(t => t.id === audit.auditTypeId) || templates[0];
        const scores = calculateAuditScores(template, audit.responses || {});
        return {
          ...audit,
          overallScore: scores.overallScore,
          classification: scores.classification
        };
      });

      // Latest completed audit or most recent audit
      const completedAudits = scoredAudits.filter(a => a.status === 'Completed');
      const latestAudit = scoredAudits.sort((a, b) => new Date(b.auditDate) - new Date(a.auditDate))[0];
      const latestScore = latestAudit ? latestAudit.overallScore : null;

      // Unique audit types
      const uniqueTypes = [...new Set(clientAudits.map(a => a.auditTypeName))];

      return {
        ...client,
        totalAudits: clientAudits.length,
        completedCount: completedAudits.length,
        latestScore,
        latestClassification: latestAudit?.classification || null,
        auditTypes: uniqueTypes
      };
    });
  }, [clients, audits, templates]);

  const filteredClients = useMemo(() => {
    return enrichedClients.filter(c => {
      const matchesSearch = 
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = selectedIndustry === 'ALL' || c.industry === selectedIndustry;
      return matchesSearch && matchesIndustry;
    });
  }, [enrichedClients, searchQuery, selectedIndustry]);

  const allIndustries = [...new Set(clients.map(c => c.industry).filter(Boolean))];

  const handleSaveClient = (formData) => {
    if (clientToEdit) {
      updateClient(clientToEdit.id, formData);
    } else {
      addClient(formData);
    }
    setClientToEdit(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Client Accounts</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage client profiles, conversion benchmarks, and historical scorecard trends.
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setClientToEdit(null);
            setIsClientModalOpen(true);
          }}
        >
          <PlusCircle size={17} />
          <span>New Client Account</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div className="search-input-wrapper" style={{ flex: 1, minWidth: 260 }}>
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by company, contact, or industry..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <select 
              className="filter-select"
              value={selectedIndustry}
              onChange={e => setSelectedIndustry(e.target.value)}
            >
              <option value="ALL">All Industries ({allIndustries.length})</option>
              {allIndustries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
        {filteredClients.map(client => (
          <div 
            key={client.id}
            className="card card-hover"
            style={{ display: 'flex', flexDirection: 'column', gap: 16, cursor: 'pointer' }}
            onClick={() => navigateTo('client-detail', { clientId: client.id })}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', fontWeight: 800 }}>
                  <Building size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{client.companyName}</h3>
                  <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>{client.industry || 'General'}</span>
                </div>
              </div>

              {client.latestScore !== null ? (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: client.latestClassification?.color || 'var(--primary-light)' }}>
                    {client.latestScore}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                  <span className={`badge ${client.latestClassification?.badgeClass}`} style={{ fontSize: '0.65rem' }}>
                    {client.latestClassification?.label}
                  </span>
                </div>
              ) : (
                <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>No Audits</span>
              )}
            </div>

            {/* Client Metadata */}
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6, background: 'var(--bg-surface)', padding: 12, borderRadius: 'var(--radius-md)' }}>
              {client.contactName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={14} color="var(--text-muted)" />
                  <span>{client.contactName}</span>
                </div>
              )}
              {client.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ExternalLink size={14} color="var(--text-muted)" />
                  <span style={{ color: 'var(--primary-light)' }}>{client.website.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
              {client.offer && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  <strong>Offer:</strong> {client.offer}
                </div>
              )}
            </div>

            {/* Footer with Audits Stats */}
            <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <FileCheck2 size={14} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} />
                <span>{client.totalAudits} Audits ({client.completedCount} Completed)</span>
              </div>

              <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => {
                    setClientToEdit(client);
                    setIsClientModalOpen(true);
                  }}
                  title="Edit Client"
                >
                  <Edit3 size={14} />
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => navigateTo('client-detail', { clientId: client.id })}
                >
                  <span>Profile</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleSaveClient}
        clientToEdit={clientToEdit}
      />
    </div>
  );
}
