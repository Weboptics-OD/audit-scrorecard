import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAuditScores } from '../../data/scoringEngine';
import ClientModal from './ClientModal';
import { 
  ArrowLeft, 
  Building, 
  User, 
  Mail, 
  Globe, 
  Calendar, 
  PlusCircle, 
  FileCheck2, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Eye, 
  Edit3, 
  Trash2,
  Layers,
  History,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function ClientDetailView() {
  const { 
    selectedClientId, 
    clients, 
    audits, 
    templates, 
    navigateTo, 
    openNewAuditWizard, 
    updateClient, 
    deleteClient 
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const client = clients.find(c => c.id === selectedClientId);

  // Get and enrich all audits for this client
  const clientAudits = useMemo(() => {
    if (!client) return [];
    return audits
      .filter(a => a.clientId === client.id)
      .map(audit => {
        const template = templates.find(t => t.id === audit.auditTypeId) || templates[0];
        const scores = calculateAuditScores(template, audit.responses || {});
        return {
          ...audit,
          calculatedScores: scores,
          overallScore: scores.overallScore,
          classification: scores.classification
        };
      })
      .sort((a, b) => new Date(b.auditDate) - new Date(a.auditDate));
  }, [client, audits, templates]);

  if (!client) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3>Client Not Found</h3>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigateTo('clients')}>
          Back to Clients
        </button>
      </div>
    );
  }

  // Comparative Score Analytics: Current (latest) vs Previous audit
  const comparisonData = useMemo(() => {
    if (clientAudits.length < 2) return null;

    // Take the two most recent audits
    const current = clientAudits[0];
    const previous = clientAudits[1];

    const overallDelta = current.overallScore - previous.overallScore;

    // Compare category by category
    const currentCats = current.calculatedScores.categoryScores || [];
    const previousCats = previous.calculatedScores.categoryScores || [];

    const categoryComparisons = currentCats.map(cat => {
      const prevMatch = previousCats.find(p => p.name.toLowerCase() === cat.name.toLowerCase() || p.categoryId === cat.categoryId);
      const prevScore = prevMatch ? prevMatch.score : null;
      const catDelta = prevScore !== null ? Math.round((cat.score - prevScore) * 10) / 10 : null;

      return {
        categoryName: cat.name,
        currentScore: cat.score,
        previousScore: prevScore,
        delta: catDelta
      };
    });

    return {
      current,
      previous,
      overallDelta,
      categoryComparisons
    };
  }, [clientAudits]);

  const latestScore = clientAudits.length > 0 ? clientAudits[0].overallScore : null;
  const latestClassification = clientAudits.length > 0 ? clientAudits[0].classification : null;

  return (
    <div>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigateTo('clients')}>
          <ArrowLeft size={16} />
          <span>Back to Clients</span>
        </button>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit3 size={15} />
            <span>Edit Profile</span>
          </button>

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => openNewAuditWizard(client.id)}
          >
            <PlusCircle size={15} />
            <span>New Audit for this Client</span>
          </button>
        </div>
      </div>

      {/* Client Overview Profile Card */}
      <div className="card" style={{ marginBottom: 28, padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--primary) 0%, var(--cyan) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                <Building size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{client.companyName}</h2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
                  <span className="badge badge-purple">{client.industry || 'General'}</span>
                  {client.website && (
                    <a 
                      href={client.website.startsWith('http') ? client.website : `https://${client.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <Globe size={13} />
                      <span>{client.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Data Points */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 20, fontSize: '0.875rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>CONTACT</span>
                <span style={{ fontWeight: 600 }}>{client.contactName || '—'}</span>
                {client.email && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{client.email}</div>
                )}
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>PRIMARY OFFER</span>
                <span>{client.offer || 'Not specified'}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>TARGET AUDIENCE</span>
                <span>{client.targetAudience || 'Not specified'}</span>
              </div>
            </div>

            {client.notes && (
              <div style={{ marginTop: 18, padding: '12px 16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong>Strategic Context:</strong> {client.notes}
              </div>
            )}
          </div>

          {/* Latest Score Badge Box */}
          <div style={{ background: 'var(--bg-surface)', padding: '20px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', textAlign: 'center', minWidth: 180 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              LATEST AUDIT SCORE
            </span>
            {latestScore !== null ? (
              <>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: latestClassification?.color, lineHeight: 1.1, margin: '6px 0' }}>
                  {latestScore}
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/100</span>
                </div>
                <span className={`badge ${latestClassification?.badgeClass}`} style={{ fontSize: '0.75rem' }}>
                  {latestClassification?.label}
                </span>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 8 }}>
                  {clientAudits.length} Audits Conducted
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--text-muted)', padding: '20px 0', fontSize: '0.85rem' }}>
                No scores yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Audit History & Score Delta Comparison */}
      {comparisonData && (
        <div className="card" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Comparative Score History</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Measuring optimization progress between {comparisonData.previous.name} ({comparisonData.previous.auditDate}) and {comparisonData.current.name} ({comparisonData.current.auditDate})
                </p>
              </div>
            </div>

            {/* Overall Delta Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-surface)', padding: '10px 16px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>OVERALL PROGRESS</span>
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>
                  {comparisonData.previous.overallScore} → {comparisonData.current.overallScore}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 4, 
                fontSize: '1.1rem', 
                fontWeight: 800,
                color: comparisonData.overallDelta >= 0 ? 'var(--emerald)' : 'var(--red)'
              }}>
                {comparisonData.overallDelta >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                <span>{comparisonData.overallDelta >= 0 ? `+${comparisonData.overallDelta}` : comparisonData.overallDelta} pts</span>
              </div>
            </div>
          </div>

          {/* Category-by-Category Delta Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {comparisonData.categoryComparisons.map((cat, idx) => {
              const hasPrev = cat.previousScore !== null;
              const isPositive = cat.delta >= 0;

              return (
                <div 
                  key={idx}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '220px 1fr 140px 100px', 
                    alignItems: 'center', 
                    gap: 16, 
                    padding: '12px 16px',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{cat.categoryName}</span>

                  {/* Visual Bar Comparison */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', width: 50 }}>Current:</span>
                      <div className="progress-bar-container" style={{ height: 6, flex: 1 }}>
                        <div className="progress-bar-fill" style={{ width: `${cat.currentScore}%`, background: 'var(--primary-light)' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, width: 36, textAlign: 'right' }}>{cat.currentScore}</span>
                    </div>

                    {hasPrev && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', width: 50 }}>Previous:</span>
                        <div className="progress-bar-container" style={{ height: 6, flex: 1 }}>
                          <div className="progress-bar-fill" style={{ width: `${cat.previousScore}%`, background: 'var(--text-muted)' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 36, textAlign: 'right' }}>{cat.previousScore}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {hasPrev ? `${cat.previousScore} → ${cat.currentScore}` : `${cat.currentScore}`}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {hasPrev ? (
                      <span 
                        className={`badge ${isPositive ? 'badge-emerald' : 'badge-red'}`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {isPositive ? `+${cat.delta}` : cat.delta}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>New</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Previous Audits Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Audit History ({clientAudits.length})</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => openNewAuditWizard(client.id)}>
            <PlusCircle size={15} />
            <span>Add Audit</span>
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Audit Name</th>
                <th>Template Type</th>
                <th>Score</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clientAudits.length > 0 ? (
                clientAudits.map(audit => (
                  <tr key={audit.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{audit.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{audit.auditor}</div>
                    </td>

                    <td>
                      <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                        {audit.auditTypeName}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: audit.classification.color }}>
                          {audit.overallScore}
                        </span>
                        <span className={`badge ${audit.classification.badgeClass}`} style={{ fontSize: '0.68rem' }}>
                          {audit.classification.label}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className={`status-pill status-${audit.status.toLowerCase().replace(' ', '-')}`}>
                        <span className="status-dot" />
                        <span>{audit.status}</span>
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{audit.auditDate}</span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => navigateTo('audit-workspace', { auditId: audit.id })}
                        >
                          <span>Workspace</span>
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigateTo('report-preview', { auditId: audit.id })}
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
                    No audits performed for this client yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(data) => updateClient(client.id, data)}
        clientToEdit={client}
      />
    </div>
  );
}
