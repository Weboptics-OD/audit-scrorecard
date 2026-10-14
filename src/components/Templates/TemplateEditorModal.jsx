import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Sliders, 
  ChevronDown, 
  ChevronRight,
  Edit2,
  Save
} from 'lucide-react';

export default function TemplateEditorModal({ 
  isOpen, 
  onClose, 
  template, 
  onSave 
}) {
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [categories, setCategories] = useState(template?.categories ? JSON.parse(JSON.stringify(template.categories)) : []);
  const [expandedCatId, setExpandedCatId] = useState(template?.categories?.[0]?.id || null);

  // New Category Inline Form State
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatWeight, setNewCatWeight] = useState(10);
  const [newCatDesc, setNewCatDesc] = useState('');

  // New Criterion Inline Form State
  const [addingCriterionCatId, setAddingCriterionCatId] = useState(null);
  const [newCritName, setNewCritName] = useState('');
  const [newCritDesc, setNewCritDesc] = useState('');
  const [newCritRec, setNewCritRec] = useState('');

  if (!isOpen) return null;

  // Calculate sum of weights
  const totalWeight = categories.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
  const isWeightValid = totalWeight === 100;

  // Category Operations
  const handleWeightChange = (catId, newWeight) => {
    const num = Math.max(0, Math.min(100, Number(newWeight) || 0));
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, weight: num } : c));
  };

  const handleDeleteCategory = (catId) => {
    if (categories.length <= 1) {
      alert('Template must have at least one category.');
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== catId));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      weight: Number(newCatWeight) || 10,
      description: newCatDesc.trim(),
      criteria: []
    };

    setCategories(prev => [...prev, newCat]);
    setExpandedCatId(newCat.id);
    setShowAddCat(false);
    setNewCatName('');
    setNewCatDesc('');
    setNewCatWeight(10);
  };

  // Criteria Operations
  const handleAddCriterion = (catId) => {
    if (!newCritName.trim()) return;

    const newCrit = {
      id: `crit-${Date.now()}`,
      name: newCritName.trim(),
      description: newCritDesc.trim() || 'Evaluates standards for this metric.',
      defaultRecommendation: newCritRec.trim() || 'Optimize according to best practices.'
    };

    setCategories(prev => prev.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          criteria: [...(c.criteria || []), newCrit]
        };
      }
      return c;
    }));

    setAddingCriterionCatId(null);
    setNewCritName('');
    setNewCritDesc('');
    setNewCritRec('');
  };

  const handleDeleteCriterion = (catId, critId) => {
    setCategories(prev => prev.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          criteria: c.criteria.filter(cr => cr.id !== critId)
        };
      }
      return c;
    }));
  };

  const handleSaveAll = () => {
    if (!name.trim()) {
      alert('Template name is required.');
      return;
    }
    if (!isWeightValid) {
      if (!window.confirm(`Warning: Total category weight is currently ${totalWeight}%, but should equal 100%. Save anyway?`)) {
        return;
      }
    }

    onSave({
      ...template,
      name,
      description,
      categories
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '880px', height: '90vh' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
              <Sliders size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Template Configuration</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Customize categories, criteria, weights, and default recommendations
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px 24px', overflowY: 'auto' }}>
          {/* Basic Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Template Name *
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Description
              </label>
              <input 
                type="text" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
              />
            </div>
          </div>

          {/* Category Weight Validation Banner */}
          <div style={{ 
            padding: '12px 18px', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: 20, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: isWeightValid ? 'var(--emerald-soft)' : 'var(--amber-soft)',
            border: `1px solid ${isWeightValid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {isWeightValid ? (
                <Check size={18} color="var(--emerald)" />
              ) : (
                <AlertTriangle size={18} color="var(--amber)" />
              )}
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isWeightValid ? '#6ee7b7' : '#fde047' }}>
                {isWeightValid 
                  ? 'Total Category Weight: 100% (Balanced)' 
                  : `Total Weight: ${totalWeight}% — Must equal exactly 100% for proper scorecard computation.`}
              </span>
            </div>

            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => setShowAddCat(true)}
            >
              <Plus size={14} />
              <span>+ Add Category</span>
            </button>
          </div>

          {/* Add Category Form Drawer */}
          {showAddCat && (
            <form onSubmit={handleAddCategory} style={{ background: 'var(--bg-surface)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.925rem', marginBottom: 10 }}>New Category</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 3fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <input 
                    type="text" 
                    placeholder="Category Name (e.g. Mobile UX)" 
                    value={newCatName} 
                    onChange={e => setNewCatName(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <input 
                    type="number" 
                    placeholder="Weight %" 
                    min="1" 
                    max="100" 
                    value={newCatWeight} 
                    onChange={e => setNewCatWeight(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Category description / focus..." 
                    value={newCatDesc} 
                    onChange={e => setNewCatDesc(e.target.value)} 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddCat(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Create Category</button>
              </div>
            </form>
          )}

          {/* Categories Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {categories.map((cat, cIdx) => {
              const isExpanded = expandedCatId === cat.id;
              const criteria = cat.criteria || [];

              return (
                <div 
                  key={cat.id}
                  style={{ 
                    background: 'var(--bg-surface)', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: 'var(--radius-lg)', 
                    overflow: 'hidden' 
                  }}
                >
                  {/* Category Header Row */}
                  <div 
                    style={{ 
                      padding: '14px 18px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: 'rgba(0, 0, 0, 0.15)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setExpandedCatId(isExpanded ? null : cat.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                        {cIdx + 1}. {cat.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ({criteria.length} criteria)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>WEIGHT:</span>
                        <input 
                          type="number"
                          min="1"
                          max="100"
                          value={cat.weight}
                          onChange={e => handleWeightChange(cat.id, e.target.value)}
                          style={{ width: 68, padding: '4px 8px', fontSize: '0.85rem', textAlign: 'center' }}
                        />
                        <span style={{ fontSize: '0.8rem' }}>%</span>
                      </div>

                      <button 
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--red)' }}
                        onClick={() => handleDeleteCategory(cat.id)}
                        title="Delete Category"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Criteria Inside Category */}
                  {isExpanded && (
                    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                          Evaluated Criteria & Suggested Recommendations
                        </span>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setAddingCriterionCatId(cat.id)}
                        >
                          <Plus size={13} />
                          <span>+ Add Criterion</span>
                        </button>
                      </div>

                      {/* Add Criterion Inline Form */}
                      {addingCriterionCatId === cat.id && (
                        <div style={{ background: 'var(--bg-card)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                          <h5 style={{ fontSize: '0.85rem', marginBottom: 8 }}>Add New Criterion</h5>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <input 
                              type="text" 
                              placeholder="Criterion Name (e.g. Primary CTA Visibility)" 
                              value={newCritName} 
                              onChange={e => setNewCritName(e.target.value)} 
                            />
                            <input 
                              type="text" 
                              placeholder="Description / Question to evaluate..." 
                              value={newCritDesc} 
                              onChange={e => setNewCritDesc(e.target.value)} 
                            />
                            <textarea 
                              rows={2} 
                              placeholder="Default suggested recommendation when scored 1 or 2..." 
                              value={newCritRec} 
                              onChange={e => setNewCritRec(e.target.value)} 
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                              <button className="btn btn-ghost btn-sm" onClick={() => setAddingCriterionCatId(null)}>Cancel</button>
                              <button className="btn btn-primary btn-sm" onClick={() => handleAddCriterion(cat.id)}>Save Criterion</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Criteria List */}
                      {criteria.map((cr, crIdx) => (
                        <div 
                          key={cr.id}
                          style={{ 
                            background: 'var(--bg-card)', 
                            border: '1px solid var(--border-subtle)', 
                            borderRadius: 'var(--radius-md)', 
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: 12
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>
                              {crIdx + 1}. {cr.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                              {cr.description}
                            </div>
                            {cr.defaultRecommendation && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--primary-light)', background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: 4 }}>
                                <strong>Default Rec:</strong> {cr.defaultRecommendation}
                              </div>
                            )}
                          </div>

                          <button 
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--red)', flexShrink: 0 }}
                            onClick={() => handleDeleteCriterion(cat.id, cr.id)}
                            title="Delete Criterion"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSaveAll}>
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
