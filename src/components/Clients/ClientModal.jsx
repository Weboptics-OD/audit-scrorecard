import React, { useState, useEffect } from 'react';
import { X, Building } from 'lucide-react';

export default function ClientModal({ isOpen, onClose, onSave, clientToEdit = null }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    website: '',
    industry: '',
    offer: '',
    targetAudience: '',
    notes: ''
  });

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        companyName: clientToEdit.companyName || '',
        contactName: clientToEdit.contactName || '',
        email: clientToEdit.email || '',
        website: clientToEdit.website || '',
        industry: clientToEdit.industry || '',
        offer: clientToEdit.offer || '',
        targetAudience: clientToEdit.targetAudience || '',
        notes: clientToEdit.notes || ''
      });
    } else {
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        website: 'https://',
        industry: '',
        offer: '',
        targetAudience: '',
        notes: ''
      });
    }
  }, [clientToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
                <Building size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {clientToEdit ? 'Edit Client Account' : 'New Client Account'}
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Manage company details and conversion targets
                </p>
              </div>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="modal-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Company / Organization Name *
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Apex SaaS Labs"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Primary Contact Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Marcus Vance"
                    value={formData.contactName}
                    onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Contact Email
                  </label>
                  <input 
                    type="email" 
                    placeholder="marcus@apexsaas.io"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Website URL
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://apexsaas.io"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Industry / Vertical
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Enterprise B2B SaaS"
                    value={formData.industry}
                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Core Commercial Offer & Pricing
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. $12,000/yr AI Workflow Platform"
                  value={formData.offer}
                  onChange={e => setFormData({ ...formData, offer: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Target Audience / Buyer Persona
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. VPs of Ops and CTOs in mid-market companies"
                  value={formData.targetAudience}
                  onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Internal Notes & Strategic Context
                </label>
                <textarea 
                  rows={3}
                  placeholder="Client background, key objections, previous conversion benchmarks, or specific campaign goals..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {clientToEdit ? 'Save Changes' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
