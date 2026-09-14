import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Trash2, 
  UserPlus, 
  User, 
  Truck, 
  Shield, 
  Check, 
  AlertCircle, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  Clock,
  KeyRound,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'citizen';

  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    ward: 'Indiranagar (Ward 12)',
    address: '',
    // Crew specific
    crewRole: 'Sanitation Field Specialist',
    shift: 'Morning (06:00 - 14:00)',
    vehicle: 'KA-01-EV-9012 (Electric Tipper)',
    // Admin specific
    designation: 'Municipal Supervisor / Ward Inspector',
    adminPasscode: '1234'
  });

  const [error, setError] = useState('');
  const { registerUser } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    // Admin security code check (Passcode: 1234 or ADMIN2026)
    if (role === 'admin' && formData.adminPasscode && formData.adminPasscode !== 'ADMIN2026' && formData.adminPasscode !== '1234') {
      setError('Invalid Municipal Admin Security Passcode. (Use: 1234 or ADMIN2026)');
      return;
    }

    const res = registerUser({
      ...formData,
      role
    });

    if (!res.success) {
      setError(res.error);
      addToast(res.error, 'error');
      return;
    }

    addToast(`Account registered successfully for ${formData.name}! Please log in.`, 'success');
    navigate(`/login?portal=${role}`);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '20px auto 40px', width: '100%' }}>
      <div className="card">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div 
            className="brand-icon-wrap" 
            style={{ width: '52px', height: '52px', margin: '0 auto 14px', borderRadius: 'var(--radius-md)' }}
          >
            <UserPlus size={26} color="var(--accent)" />
          </div>
          <h1 style={{ fontSize: '1.7rem', marginBottom: '6px' }}>Create Your SmartSweep Account</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            New user registration policy: Create your account to access your dedicated dashboard
          </p>
        </div>

        {/* Role Type Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label className="form-label">Select Your Account Type / Role:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '10px' }}>
            <button
              type="button"
              onClick={() => { setRole('citizen'); setError(''); }}
              style={{
                padding: '12px 8px',
                borderRadius: 'var(--radius-md)',
                background: role === 'citizen' ? 'var(--accent-dim)' : 'var(--surface-2)',
                border: role === 'citizen' ? '2px solid var(--accent)' : '1px solid var(--line)',
                color: role === 'citizen' ? 'var(--accent)' : 'var(--text-h)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <User size={18} style={{ margin: '0 auto 4px', display: 'block' }} />
              <span>1. Citizen</span>
            </button>

            <button
              type="button"
              onClick={() => { setRole('crew'); setError(''); }}
              style={{
                padding: '12px 8px',
                borderRadius: 'var(--radius-md)',
                background: role === 'crew' ? 'var(--progress-dim)' : 'var(--surface-2)',
                border: role === 'crew' ? '2px solid var(--progress)' : '1px solid var(--line)',
                color: role === 'crew' ? 'var(--progress)' : 'var(--text-h)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <Truck size={18} style={{ margin: '0 auto 4px', display: 'block' }} />
              <span>2. Crew / Driver</span>
            </button>

            <button
              type="button"
              onClick={() => { setRole('admin'); setError(''); }}
              style={{
                padding: '12px 8px',
                borderRadius: 'var(--radius-md)',
                background: role === 'admin' ? 'var(--pending-dim)' : 'var(--surface-2)',
                border: role === 'admin' ? '2px solid var(--pending)' : '1px solid var(--line)',
                color: role === 'admin' ? 'var(--pending)' : 'var(--text-h)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <Shield size={18} style={{ margin: '0 auto 4px', display: 'block' }} />
              <span>3. Admin / Supervisor</span>
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={{ padding: '12px 16px', background: 'var(--hazard-dim)', border: '1px solid rgba(241,89,79,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--hazard)', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Ramesh Kumar or Anita Rao" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Email Address (Login Username)</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="name@domain.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="+91 98765 43210" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Role specific inputs */}
          {role === 'citizen' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px' }}>
              <div className="form-group">
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

              <div className="form-group">
                <label className="form-label">Home Address / Landmark</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Street / Apartment / Layout" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          )}

          {role === 'crew' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Sanitation Role</label>
                <select 
                  className="form-select"
                  value={formData.crewRole}
                  onChange={(e) => setFormData({...formData, crewRole: e.target.value})}
                >
                  <option value="Crew Lead & Heavy Sweeper">Crew Lead & Heavy Sweeper</option>
                  <option value="Sanitation Specialist">Sanitation Specialist</option>
                  <option value="Compactor Heavy Driver">Compactor Heavy Driver</option>
                  <option value="Waste Segregation Officer">Waste Segregation Officer</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Shift Timing</label>
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
            </div>
          )}

          {role === 'admin' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Supervisor Designation</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Chief Health Inspector" 
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Admin Security Passcode</span>
                  <span style={{ color: 'var(--pending)', fontSize: '0.74rem', fontWeight: 600 }}>Passcode: 1234 or ADMIN2026</span>
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter 1234 or ADMIN2026" 
                  value={formData.adminPasscode}
                  onChange={(e) => setFormData({...formData, adminPasscode: e.target.value})}
                />
              </div>
            </div>
          )}

          {/* Passwords */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Create Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              marginTop: '10px',
              background: role === 'crew' ? 'var(--progress)' : role === 'admin' ? 'var(--pending)' : 'var(--accent)',
              color: role === 'admin' ? '#06170e' : '#fff'
            }}
          >
            <Check size={16} />
            Complete Registration & Create Account
          </button>
        </form>

        {/* Existing Account Footer */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.86rem', color: 'var(--text-dim)' }}>
          Already registered?{' '}
          <Link to={`/login?portal=${role}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
