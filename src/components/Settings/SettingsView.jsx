import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building, 
  Palette, 
  User, 
  Globe, 
  Mail, 
  Phone, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function SettingsView() {
  const { branding, setBranding, resetToDemoData, showToast, clients, audits, templates } = useApp();

  const [formData, setFormData] = useState({ ...branding });
  const [logoPreview, setLogoPreview] = useState(branding.logoUrl || '');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        handleChange('logoUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setBranding(formData);
    showToast('Branding and agency configuration saved successfully.');
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      branding: formData,
      clients,
      audits,
      templates
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `funnel-audit-scorecard-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Complete platform JSON backup exported.');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Agency Settings & White-Label Branding</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Customize your consulting brand, report headers, logos, and auditor credentials.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Main Settings Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Agency Brand Identity */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Building size={18} color="var(--primary-light)" />
                <span>Agency & Consulting Brand</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Agency / Business Name *
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={formData.businessName}
                    onChange={e => handleChange('businessName', e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      Agency Website
                    </label>
                    <input 
                      type="url" 
                      value={formData.website}
                      onChange={e => handleChange('website', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      Contact Email
                    </label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => handleChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Custom Logo URL or Upload
                  </label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input 
                      type="url" 
                      placeholder="https://youragency.com/logo.png"
                      value={formData.logoUrl}
                      onChange={e => {
                        handleChange('logoUrl', e.target.value);
                        setLogoPreview(e.target.value);
                      }}
                      style={{ flex: 1 }}
                    />
                    <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Auditor Profile */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <User size={18} color="var(--primary-light)" />
                <span>Lead Auditor Credentials</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Auditor Full Name *
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={formData.auditorName}
                    onChange={e => handleChange('auditorName', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Auditor Title
                  </label>
                  <input 
                    type="text" 
                    value={formData.auditorTitle || ''}
                    onChange={e => handleChange('auditorTitle', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Brand Colors */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Palette size={18} color="var(--primary-light)" />
                <span>Report Theme & Palette</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Primary Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input 
                      type="color" 
                      value={formData.primaryColor || '#4f46e5'}
                      onChange={e => handleChange('primaryColor', e.target.value)}
                      style={{ width: 44, height: 40, padding: 2, cursor: 'pointer' }}
                    />
                    <input 
                      type="text" 
                      value={formData.primaryColor || '#4f46e5'}
                      onChange={e => handleChange('primaryColor', e.target.value)}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Secondary Accent
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input 
                      type="color" 
                      value={formData.secondaryColor || '#06b6d4'}
                      onChange={e => handleChange('secondaryColor', e.target.value)}
                      style={{ width: 44, height: 40, padding: 2, cursor: 'pointer' }}
                    />
                    <input 
                      type="text" 
                      value={formData.secondaryColor || '#06b6d4'}
                      onChange={e => handleChange('secondaryColor', e.target.value)}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Success Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input 
                      type="color" 
                      value={formData.accentColor || '#10b981'}
                      onChange={e => handleChange('accentColor', e.target.value)}
                      style={{ width: 44, height: 40, padding: 2, cursor: 'pointer' }}
                    />
                    <input 
                      type="text" 
                      value={formData.accentColor || '#10b981'}
                      onChange={e => handleChange('accentColor', e.target.value)}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Methodology Disclaimers */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16 }}>
                Report Methodology Statement
              </h3>
              <textarea 
                rows={3}
                value={formData.methodologyNotes || ''}
                onChange={e => handleChange('methodologyNotes', e.target.value)}
                placeholder="Included at the conclusion of every client-ready report..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button type="submit" className="btn btn-primary btn-lg">
                <Save size={18} />
                <span>Save All Settings</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Report Header Preview & Data Management */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Live Header Preview */}
            <div className="card">
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 12 }}>
                Report Header Preview
              </h4>
              <div style={{ 
                padding: '18px 20px', 
                background: 'linear-gradient(145deg, #101728 0%, #0d1220 100%)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-subtle)' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" style={{ height: 32, objectFit: 'contain' }} />
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: formData.primaryColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                      {formData.businessName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{formData.businessName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formData.website}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Auditor: <strong>{formData.auditorName}</strong> ({formData.auditorTitle || 'Funnel Strategist'})
                </div>
              </div>
            </div>

            {/* Data Management & Backup */}
            <div className="card">
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 12 }}>
                Data Management
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                Export your audits, clients, and custom templates as a portable JSON backup.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={handleExportBackup}
                  style={{ justifyContent: 'center' }}
                >
                  <Download size={15} />
                  <span>Export Platform Backup (JSON)</span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    if (window.confirm('Reset all clients, audits, and settings to original demo data? Any unsaved custom work will be overwritten.')) {
                      resetToDemoData();
                    }
                  }}
                  style={{ justifyContent: 'center' }}
                >
                  <RotateCcw size={15} />
                  <span>Restore Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
