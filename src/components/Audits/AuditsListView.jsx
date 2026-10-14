import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAuditScores } from '../../data/scoringEngine';
import { 
  PlusCircle, 
  Search, 
  ExternalLink, 
  ArrowRight, 
  Eye, 
  Copy, 
  Trash2, 
  Calendar, 
  Building,
  FileCheck2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function AuditsListView() {
  const { audits, templates, clients, navigateTo, openNewAuditWizard, duplicateAudit, deleteAudit } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  const enrichedAudits = useMemo(() => {
    return audits.map(audit => {
      const template = templates.find(t => t.id === audit.auditTypeId) || templates[0];
      const scores = calculateAuditScores(template, audit.responses || {});
      return {
        ...audit,
        calculatedScore: scores.overallScore,
        scoreClassification: scores.classification,
        progressPercent: scores.progressPercent,
        completedCriteria: scores.completedCriteria,
        totalCriteria: scores.totalCriteria
      };
    });
  }, [audits, templates]);

  const filteredAudits = useMemo(() => {
    return enrichedAudits
      .filter(audit => {
        const matchesSearch = 
          audit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          audit.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          audit.auditTypeName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusTab === 'ALL' || audit.status === statusTab;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.updatedAt || b.auditDate) - new Date(a.updatedAt || a.auditDate);
        if (sortBy === 'date-asc') return new Date(a.updatedAt || a.auditDate) - new Date(b.updatedAt || b.auditDate);
        if (sortBy === 'score-desc') return b.calculatedScore - a.calculatedScore;
        if (sortBy === 'score-asc') return a.calculatedScore - b.calculatedScore;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [enrichedAudits, searchQuery, statusTab, sortBy]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Audit Repository</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Comprehensive register of digital experience and conversion audits.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => openNewAuditWizard()}>
          <PlusCircle size={17} />
          <span>New Audit</span>
        </button>
      </div>

      {/* Tabs & Controls */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          {/* Status Pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Audits', count: audits.length },
              { id: 'Completed', label: 'Completed', count: audits.filter(a => a.status === 'Completed').length },
              { id: 'In Progress', label: 'In Progress', count: audits.filter(a => a.status === 'In Progress').length },
              { id: 'Draft', label: 'Draft', count: audits.filter(a => a.status === 'Draft').length }
            ].map(tab => (
              <button
                key={tab.id}
                className={`btn btn-sm ${statusTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setStatusTab(tab.id)}
              >
                <span>{tab.label}</span>
                <span className="badge badge-gray" style={{ padding: '1px 6px', fontSize: '0.68rem', marginLeft: 4 }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-input-wrapper" style={{ minWidth: 240 }}>
              <Search className="search-icon" size={16} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search audits..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <select 
              className="filter-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audits Grid or Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Audit Name & Client</th>
              <th>Audit Type</th>
              <th>Progress</th>
              <th>Overall Score</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAudits.length > 0 ? (
              filteredAudits.map(audit => (
                <tr key={audit.id}>
                  <td>
                    <div className="table-client-cell">
                      <span 
                        className="table-client-name"
                        style={{ cursor: 'pointer', fontSize: '0.95rem' }}
                        onClick={() => navigateTo('audit-workspace', { auditId: audit.id })}
                      >
                        {audit.name}
                      </span>
                      <span 
                        className="table-audit-title"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                        onClick={() => navigateTo('client-detail', { clientId: audit.clientId })}
                      >
                        <Building size={12} />
                        <span>{audit.clientName}</span>
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                      {audit.auditTypeName}
                    </span>
                  </td>

                  <td>
                    <div style={{ width: 140 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{audit.completedCriteria}/{audit.totalCriteria}</span>
                        <span style={{ fontWeight: 700 }}>{audit.progressPercent}%</span>
                      </div>
                      <div className="progress-bar-container" style={{ height: 6 }}>
                        <div className="progress-bar-fill" style={{ width: `${audit.progressPercent}%` }} />
                      </div>
                    </div>
                  </td>

                  <td>
                    {audit.completedCriteria > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span 
                          style={{ 
                            fontSize: '1.2rem', 
                            fontWeight: 800, 
                            color: audit.scoreClassification.color 
                          }}
                        >
                          {audit.calculatedScore}
                        </span>
                        <span className={`badge ${audit.scoreClassification.badgeClass}`} style={{ fontSize: '0.68rem' }}>
                          {audit.scoreClassification.label}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Not evaluated</span>
                    )}
                  </td>

                  <td>
                    <span className={`status-pill status-${audit.status.toLowerCase().replace(' ', '-')}`}>
                      <span className="status-dot" />
                      <span>{audit.status}</span>
                    </span>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {audit.auditDate}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => navigateTo('audit-workspace', { auditId: audit.id })}
                        title="Open in Workspace"
                      >
                        <span>Workspace</span>
                        <ArrowRight size={14} />
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigateTo('report-preview', { auditId: audit.id })}
                        title="View Report"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        className="btn btn-ghost btn-sm"
                        onClick={() => duplicateAudit(audit.id)}
                        title="Duplicate"
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--red)' }}
                        onClick={() => {
                          if (window.confirm(`Delete audit "${audit.name}"?`)) {
                            deleteAudit(audit.id);
                          }
                        }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  No matching audits found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
