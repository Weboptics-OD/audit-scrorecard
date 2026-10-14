import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAuditScores, getScoreClassification } from '../../data/scoringEngine';
import { 
  FileCheck2, 
  CheckCircle2, 
  FileEdit, 
  Award, 
  PlusCircle, 
  Search, 
  ExternalLink, 
  ArrowRight, 
  TrendingUp, 
  Eye, 
  Copy, 
  Trash2,
  Filter,
  BarChart3,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function DashboardView() {
  const { 
    audits, 
    clients, 
    templates, 
    navigateTo, 
    openNewAuditWizard, 
    duplicateAudit, 
    deleteAudit 
  } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientFilter, setSelectedClientFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedScoreFilter, setSelectedScoreFilter] = useState('ALL');

  // Compute calculated metrics across all audits
  const auditMetrics = useMemo(() => {
    const total = audits.length;
    let completed = 0;
    let draft = 0;
    let totalScoreSum = 0;
    let scoredAuditsCount = 0;

    const enrichedAudits = audits.map(audit => {
      const template = templates.find(t => t.id === audit.auditTypeId) || templates[0];
      const scores = calculateAuditScores(template, audit.responses || {});

      if (audit.status === 'Completed') completed++;
      if (audit.status === 'Draft') draft++;

      if (scores.completedCriteria > 0) {
        totalScoreSum += scores.overallScore;
        scoredAuditsCount++;
      }

      return {
        ...audit,
        calculatedScore: scores.overallScore,
        scoreClassification: scores.classification,
        progressPercent: scores.progressPercent,
        completedCriteria: scores.completedCriteria,
        totalCriteria: scores.totalCriteria
      };
    });

    const avgScore = scoredAuditsCount > 0 ? Math.round(totalScoreSum / scoredAuditsCount) : 0;

    return {
      total,
      completed,
      draft,
      avgScore,
      avgScoreClassification: getScoreClassification(avgScore),
      enrichedAudits
    };
  }, [audits, templates]);

  // Apply search and filters
  const filteredAudits = useMemo(() => {
    return auditMetrics.enrichedAudits.filter(audit => {
      const matchesSearch = searchTerm === '' || 
        audit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (audit.websiteUrl && audit.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesClient = selectedClientFilter === 'ALL' || audit.clientId === selectedClientFilter;
      const matchesType = selectedTypeFilter === 'ALL' || audit.auditTypeId === selectedTypeFilter;
      const matchesStatus = selectedStatusFilter === 'ALL' || audit.status === selectedStatusFilter;

      let matchesScore = true;
      if (selectedScoreFilter === '90+') matchesScore = audit.calculatedScore >= 90;
      else if (selectedScoreFilter === '80-89') matchesScore = audit.calculatedScore >= 80 && audit.calculatedScore < 90;
      else if (selectedScoreFilter === '70-79') matchesScore = audit.calculatedScore >= 70 && audit.calculatedScore < 80;
      else if (selectedScoreFilter === '0-69') matchesScore = audit.calculatedScore < 70;

      return matchesSearch && matchesClient && matchesType && matchesStatus && matchesScore;
    });
  }, [auditMetrics.enrichedAudits, searchTerm, selectedClientFilter, selectedTypeFilter, selectedStatusFilter, selectedScoreFilter]);

  return (
    <div>
      {/* Top Banner / Welcome */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Conversion Performance Center
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Systematic audits, conversion rate optimization benchmarks, and client-ready reporting.
          </p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => openNewAuditWizard()}>
          <PlusCircle size={18} />
          <span>Create New Audit</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--stat-color': 'var(--primary-light)', '--stat-glow': 'var(--primary-glow)' }}>
          <div className="stat-card-header">
            <span className="stat-label">Total Audits</span>
            <div className="stat-icon">
              <FileCheck2 size={20} />
            </div>
          </div>
          <div className="stat-value">{auditMetrics.total}</div>
          <div className="stat-subtext">
            <span>Across {clients.length} active client accounts</span>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--emerald)', '--stat-glow': 'rgba(16, 185, 129, 0.2)' }}>
          <div className="stat-card-header">
            <span className="stat-label">Completed Audits</span>
            <div className="stat-icon">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="stat-value">{auditMetrics.completed}</div>
          <div className="stat-subtext">
            <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>Client-ready reports generated</span>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--amber)', '--stat-glow': 'rgba(245, 158, 11, 0.2)' }}>
          <div className="stat-card-header">
            <span className="stat-label">Draft / In Progress</span>
            <div className="stat-icon">
              <FileEdit size={20} />
            </div>
          </div>
          <div className="stat-value">{auditMetrics.total - auditMetrics.completed}</div>
          <div className="stat-subtext">
            <span>{auditMetrics.draft} drafts awaiting completion</span>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--cyan)', '--stat-glow': 'rgba(6, 182, 212, 0.2)' }}>
          <div className="stat-card-header">
            <span className="stat-label">Average Audit Score</span>
            <div className="stat-icon">
              <Award size={20} />
            </div>
          </div>
          <div className="stat-value">
            {auditMetrics.avgScore}
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
          </div>
          <div className="stat-subtext">
            <span className={`badge ${auditMetrics.avgScoreClassification.badgeClass}`} style={{ fontSize: '0.7rem' }}>
              {auditMetrics.avgScoreClassification.label}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: 24, padding: '18px 20px' }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={17} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by client, audit title, or URL..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            {/* Client Filter */}
            <select 
              className="filter-select"
              value={selectedClientFilter}
              onChange={e => setSelectedClientFilter(e.target.value)}
            >
              <option value="ALL">All Clients ({clients.length})</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.companyName}</option>
              ))}
            </select>

            {/* Template Type Filter */}
            <select 
              className="filter-select"
              value={selectedTypeFilter}
              onChange={e => setSelectedTypeFilter(e.target.value)}
            >
              <option value="ALL">All Audit Types</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select 
              className="filter-select"
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Score Filter */}
            <select 
              className="filter-select"
              value={selectedScoreFilter}
              onChange={e => setSelectedScoreFilter(e.target.value)}
            >
              <option value="ALL">All Score Ranges</option>
              <option value="90+">90-100 (Excellent)</option>
              <option value="80-89">80-89 (Strong)</option>
              <option value="70-79">70-79 (Needs Impr.)</option>
              <option value="0-69">&lt; 70 (Weak / High Priority)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audits Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client & Project</th>
              <th>Audit Type</th>
              <th>Website</th>
              <th>Overall Score</th>
              <th>Status</th>
              <th>Audit Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAudits.length > 0 ? (
              filteredAudits.map(audit => {
                const isCompleted = audit.status === 'Completed';
                const hasScores = audit.completedCriteria > 0;

                return (
                  <tr key={audit.id}>
                    <td>
                      <div className="table-client-cell">
                        <span 
                          className="table-client-name"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigateTo('client-detail', { clientId: audit.clientId })}
                        >
                          {audit.clientName}
                        </span>
                        <span className="table-audit-title">{audit.name}</span>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                        {audit.auditTypeName}
                      </span>
                    </td>

                    <td>
                      {audit.websiteUrl ? (
                        <a 
                          href={audit.websiteUrl.startsWith('http') ? audit.websiteUrl : `https://${audit.websiteUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.82rem' }}
                        >
                          <span>{audit.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>

                    <td>
                      {hasScores ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div 
                            className="score-badge-circle"
                            style={{ 
                              color: audit.scoreClassification.color,
                              background: `${audit.scoreClassification.color}15`
                            }}
                          >
                            {audit.calculatedScore}
                            <span>/100</span>
                          </div>
                          <div>
                            <span 
                              className={`badge ${audit.scoreClassification.badgeClass}`}
                              style={{ fontSize: '0.68rem', padding: '2px 7px' }}
                            >
                              {audit.scoreClassification.label}
                            </span>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                              {audit.completedCriteria}/{audit.totalCriteria} criteria
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Unscored (0%)</span>
                      )}
                    </td>

                    <td>
                      <span className={`status-pill status-${audit.status.toLowerCase().replace(' ', '-')}`}>
                        <span className="status-dot" />
                        <span>{audit.status}</span>
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{audit.auditDate || '—'}</span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        <button 
                          className="btn btn-primary btn-sm"
                          title="Open Interactive Audit Workspace"
                          onClick={() => navigateTo('audit-workspace', { auditId: audit.id })}
                        >
                          <span>{isCompleted ? 'Edit' : 'Resume'}</span>
                          <ArrowRight size={14} />
                        </button>

                        <button 
                          className="btn btn-secondary btn-sm"
                          title="View Client-Ready Report"
                          onClick={() => navigateTo('report-preview', { auditId: audit.id })}
                        >
                          <Eye size={14} />
                        </button>

                        <button 
                          className="btn btn-ghost btn-sm"
                          title="Duplicate Audit"
                          onClick={() => duplicateAudit(audit.id)}
                        >
                          <Copy size={14} />
                        </button>

                        <button 
                          className="btn btn-ghost btn-sm"
                          title="Delete Audit"
                          style={{ color: 'var(--red)' }}
                          onClick={() => {
                            if (window.confirm(`Delete audit "${audit.name}"?`)) {
                              deleteAudit(audit.id);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <div style={{ maxWidth: 360, margin: '0 auto', color: 'var(--text-muted)' }}>
                    <FileCheck2 size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: 6 }}>No Audits Found</h4>
                    <p style={{ fontSize: '0.85rem', marginBottom: 16 }}>
                      {searchTerm || selectedClientFilter !== 'ALL' || selectedTypeFilter !== 'ALL'
                        ? 'Try clearing your search or filter options.'
                        : 'Launch your first conversion audit to start scoring.'}
                    </p>
                    <button className="btn btn-primary btn-sm" onClick={() => openNewAuditWizard()}>
                      <PlusCircle size={15} />
                      <span>Start New Audit</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
