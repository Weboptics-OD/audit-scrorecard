import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import TemplateEditorModal from './TemplateEditorModal';
import { 
  Sliders, 
  PlusCircle, 
  Check, 
  AlertTriangle, 
  Edit3, 
  Layout, 
  TrendingUp, 
  Globe, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function TemplatesView() {
  const { templates, updateTemplate, createTemplate } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleEdit = (tpl) => {
    setSelectedTemplate(tpl);
    setIsEditorOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedTemplate({
      id: '',
      name: 'Custom Conversion Audit',
      description: 'Specialized evaluation rubric tailored for unique client funnels.',
      badge: 'Custom',
      categories: [
        {
          id: `cat-${Date.now()}-1`,
          name: 'Core Offer & Hook',
          weight: 40,
          description: 'Offer alignment and headline impact.',
          criteria: [
            {
              id: `crit-${Date.now()}-1`,
              name: 'Headline clarity',
              description: 'Communicate primary benefit in 5 seconds.',
              defaultRecommendation: 'Rewrite headline with specific client outcome.'
            }
          ]
        },
        {
          id: `cat-${Date.now()}-2`,
          name: 'Conversion Friction',
          weight: 60,
          description: 'Friction points in user journey.',
          criteria: [
            {
              id: `crit-${Date.now()}-2`,
              name: 'Form friction',
              description: 'Minimal fields requested.',
              defaultRecommendation: 'Cut form down to essential fields.'
            }
          ]
        }
      ]
    });
    setIsEditorOpen(true);
  };

  const handleSaveTemplate = (savedTpl) => {
    if (savedTpl.id) {
      updateTemplate(savedTpl);
    } else {
      createTemplate(savedTpl);
    }
  };

  const templateIcons = {
    'landing-page-audit': Layout,
    'sales-funnel-audit': TrendingUp,
    'website-conversion-audit': Globe
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Audit Templates & Rubrics</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Configurable evaluation engines powering Landing Page, Sales Funnel, and Website Conversion audits.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateNew}>
          <PlusCircle size={17} />
          <span>New Custom Template</span>
        </button>
      </div>

      {/* Templates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
        {templates.map(tpl => {
          const Icon = templateIcons[tpl.id] || Sliders;
          const categories = tpl.categories || [];
          const totalWeight = categories.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
          const isWeightValid = totalWeight === 100;
          const totalCriteria = categories.reduce((sum, c) => sum + (c.criteria?.length || 0), 0);

          return (
            <div key={tpl.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{tpl.name}</h3>
                    {tpl.badge && (
                      <span className="badge badge-purple" style={{ fontSize: '0.68rem', marginTop: 2 }}>
                        {tpl.badge}
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleEdit(tpl)}
                >
                  <Edit3 size={14} />
                  <span>Configure</span>
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {tpl.description}
              </p>

              {/* Weight Status */}
              <div style={{ 
                padding: '10px 14px', 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--bg-surface)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                fontSize: '0.8rem'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Category Weights:</span>
                <span style={{ fontWeight: 700, color: isWeightValid ? 'var(--emerald)' : 'var(--amber)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  {isWeightValid ? <Check size={14} /> : <AlertTriangle size={14} />}
                  <span>{totalWeight}% (Total)</span>
                </span>
              </div>

              {/* Category Pills Preview */}
              <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>
                  {categories.length} Categories • {totalCriteria} Total Criteria
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {categories.slice(0, 5).map(c => (
                    <span key={c.id} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                      {c.name} ({c.weight}%)
                    </span>
                  ))}
                  {categories.length > 5 && (
                    <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                      +{categories.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <TemplateEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        template={selectedTemplate}
        onSave={handleSaveTemplate}
      />
    </div>
  );
}
