import React, { useState } from 'react';
import { SCORE_LEVELS, PRIORITIES } from '../../data/scoringEngine';
import { 
  X, 
  Flag, 
  AlertTriangle, 
  Check, 
  Edit3, 
  Trash2, 
  Search, 
  Filter,
  Camera,
  Eye,
  FileText
} from 'lucide-react';

export default function FindingsDrawer({ 
  isOpen, 
  onClose, 
  audit, 
  template, 
  onUpdateCriterion 
}) {
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen || !audit || !template) return null;

  // Extract all findings: items marked as isFinding OR scored 1 or 2
  const allFindings = [];

  (template.categories || []).forEach(cat => {
    (cat.criteria || []).forEach(crit => {
      const resp = audit.responses?.[crit.id];
      if (!resp) return;

      const score = resp.score;
      const isLowScore = score === 1 || score === 2;
      const isFinding = resp.isFinding !== undefined ? resp.isFinding : isLowScore;

      if (isFinding || isLowScore || resp.observation || resp.recommendation) {
        allFindings.push({
          criterionId: crit.id,
          criterionName: crit.name,
          categoryId: cat.id,
          categoryName: cat.name,
          score: score || 0,
          observation: resp.observation || crit.description || 'Observed friction point.',
          recommendation: resp.recommendation || crit.defaultRecommendation || 'Requires strategic review.',
          priority: resp.priority || (score === 1 ? 'High' : (score === 2 ? 'Medium' : 'Low')),
          screenshot: resp.screenshot || null
        });
      }
    });
  });

  const filteredFindings = allFindings.filter(f => {
    const matchesPriority = priorityFilter === 'ALL' || f.priority === priorityFilter;
    const matchesSearch = 
      f.criterionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.observation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.recommendation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth: '840px', width: '100%', height: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--red-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)' }}>
              <Flag size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Audit Findings Registry</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {allFindings.length} documented observations & strategic recommendations
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px 24px', overflowY: 'auto' }}>
          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap' }}>
            <div className="search-input-wrapper" style={{ flex: 1, minWidth: 220 }}>
              <Search className="search-icon" size={16} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search findings, observations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              {['ALL', 'High', 'Medium', 'Low'].map(p => (
                <button
                  key={p}
                  className={`btn btn-sm ${priorityFilter === p ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setPriorityFilter(p)}
                >
                  {p === 'ALL' ? 'All Priorities' : `${p} Priority`}
                </button>
              ))}
            </div>
          </div>

          {/* Findings List */}
          {filteredFindings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredFindings.map(item => {
                const level = SCORE_LEVELS[item.score];
                return (
                  <div 
                    key={item.criterionId}
                    style={{ 
                      background: 'var(--bg-surface)', 
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)', 
                      padding: 20,
                      borderLeft: `4px solid ${item.priority === 'High' ? 'var(--red)' : (item.priority === 'Medium' ? 'var(--amber)' : 'var(--emerald)')}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>{item.categoryName}</span>
                          <span className={`badge ${item.priority === 'High' ? 'badge-red' : (item.priority === 'Medium' ? 'badge-amber' : 'badge-emerald')}`} style={{ fontSize: '0.7rem' }}>
                            {item.priority} Priority
                          </span>
                          {level && (
                            <span className={`badge ${level.bgClass}`} style={{ color: level.color, fontSize: '0.7rem' }}>
                              Score {level.value} • {level.label}
                            </span>
                          )}
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{item.criterionName}</h4>
                      </div>

                      {item.screenshot && (
                        <div style={{ width: 64, height: 44, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-default)', flexShrink: 0 }}>
                          <img src={item.screenshot} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.85rem' }}>
                      <div style={{ background: 'var(--bg-card)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                          Observation
                        </span>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                          {item.observation}
                        </p>
                      </div>

                      <div style={{ background: 'var(--bg-card)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--primary-light)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                          Actionable Recommendation
                        </span>
                        <p style={{ color: 'var(--text-primary)', lineHeight: 1.45 }}>
                          {item.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Flag size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
              <h4>No Findings Match Filter</h4>
              <p style={{ fontSize: '0.85rem' }}>Scores 1 or 2, and explicitly flagged criteria appear here automatically.</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Done Reviewing Findings
          </button>
        </div>
      </div>
    </div>
  );
}
