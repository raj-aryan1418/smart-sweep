import React, { useState, useEffect } from 'react';
import { 
  User, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Truck, 
  Clock, 
  Check, 
  LogOut, 
  KeyRound, 
  Edit3, 
  Save, 
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUserProfile, logout } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    ward: '',
    address: '',
    shift: '',
    password: '',
    newPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        ward: user.ward || 'Indiranagar (Ward 12)',
        address: user.address || '',
        shift: user.shift || 'Morning (06:00 - 14:00)',
        password: '',
        newPassword: ''
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const role = user.role || 'citizen';

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Name cannot be empty', 'error');
      return;
    }

    const updates = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      ward: formData.ward,
      address: formData.address.trim()
    };

    if (role === 'crew' && formData.shift) {
      updates.shift = formData.shift;
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 4) {
        addToast('New password must be at least 4 characters', 'error');
        return;
      }
      updates.password = formData.newPassword;
    }

    const res = updateUserProfile(updates);
    if (res.success) {
      addToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } else {
      addToast(res.error || 'Failed to update profile', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    addToast('You have been logged out safely.', 'info');
    navigate('/login');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '520px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="var(--accent)" />
            <h2 className="modal-title">My Account & Profile</h2>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Profile Card Summary Banner */}
        <div 
          style={{
            background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '20px'
          }}
        >
          <div 
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: role === 'admin' ? 'var(--pending-dim)' : role === 'crew' ? 'var(--progress-dim)' : 'var(--accent-dim)',
              color: role === 'admin' ? 'var(--pending)' : role === 'crew' ? 'var(--progress)' : 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.4rem',
              border: `2px solid ${role === 'admin' ? 'var(--pending)' : role === 'crew' ? 'var(--progress)' : 'var(--accent)'}`,
              flexShrink: 0
            }}
          >
            {user.avatarInitial || 'U'}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-h)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <span className={`badge badge-${role}`}>
                {role === 'admin' ? '🛡️ Admin' : role === 'crew' ? '🚛 Field Crew' : '👤 Citizen'}
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Account ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{user.id}</span>
            </div>
          </div>
        </div>

        {/* View / Edit Mode Toggle Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-h)' }}>
            {isEditing ? 'Edit Profile Details' : 'Account Information'}
          </span>
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 size={13} />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {isEditing ? (
          /* Edit Profile Form */
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input 
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '10px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Residential Ward</label>
                <select 
                  className="form-select"
                  value={formData.ward}
                  onChange={(e) => setFormData({...formData, ward: e.target.value})}
                >
                  <option value="Indiranagar (Ward 12)">Indiranagar (Ward 12)</option>
                  <option value="MG Road (Ward 04)">MG Road (Ward 04)</option>
                  <option value="Koramangala (Ward 08)">Koramangala (Ward 08)</option>
                  <option value="Jayanagar (Ward 15)">Jayanagar (Ward 15)</option>
                </select>
              </div>
            </div>

            {role === 'crew' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Active Shift</label>
                <select 
                  className="form-select"
                  value={formData.shift}
                  onChange={(e) => setFormData({...formData, shift: e.target.value})}
                >
                  <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                  <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
                  <option value="Night / Emergency">Night / Emergency</option>
                </select>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Address / Landmark</label>
              <input 
                type="text"
                className="form-input"
                placeholder="Street / Building / Layout"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Change Password (Leave blank to keep current)</label>
              <input 
                type="password"
                className="form-input"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
              <Save size={15} /> Save Changes
            </button>
          </form>
        ) : (
          /* Profile Details Read-Only View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '10px', fontSize: '0.84rem' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase' }}>Phone Number</span>
                  <strong style={{ color: 'var(--text-h)' }}>{user.phone || 'Not provided'}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase' }}>Assigned Ward</span>
                  <strong style={{ color: 'var(--text-h)' }}>{user.ward}</strong>
                </div>

                {user.address && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase' }}>Address</span>
                    <strong style={{ color: 'var(--text-h)' }}>{user.address}</strong>
                  </div>
                )}

                {role === 'crew' && (
                  <>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase' }}>Operational Role</span>
                      <strong style={{ color: 'var(--progress)' }}>{user.crewRole || 'Sanitation Specialist'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase' }}>Shift</span>
                      <strong style={{ color: 'var(--text-h)' }}>{user.shift || 'Morning'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase' }}>Assigned Vehicle</span>
                      <strong style={{ color: 'var(--accent)' }}>{user.vehicle || 'KA-01-EV-9012'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase' }}>Safety Score</span>
                      <strong style={{ color: 'var(--resolved)' }}>{user.safetyScore || 100}% ★</strong>
                    </div>
                  </>
                )}

                {role === 'admin' && (
                  <>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase' }}>Designation</span>
                      <strong style={{ color: 'var(--pending)' }}>{user.designation || 'Municipal Supervisor'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase' }}>Access Level</span>
                      <strong style={{ color: 'var(--text-h)' }}>{user.accessLevel || 'Executive Level'}</strong>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Clear Prominent Log Out Button */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
          <button 
            type="button"
            className="btn btn-danger"
            style={{ width: '100%', padding: '12px', justifyContent: 'center', gap: '8px' }}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <strong>Sign Out & Log Out of SmartSweep</strong>
          </button>
        </div>
      </div>
    </div>
  );
}
