import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Trash2, 
  User, 
  Shield, 
  Truck, 
  ArrowRight, 
  Check, 
  Lock, 
  Mail, 
  KeyRound, 
  AlertCircle,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('portal') || 'citizen'; // citizen, crew, admin
  const redirectUrl = searchParams.get('redirect');
  
  const [activePortal, setActivePortal] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { loginUser, registeredUsers } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('portal')) {
      setActivePortal(searchParams.get('portal'));
    }
  }, [searchParams]);

  const handlePortalSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    const res = loginUser(email, password, activePortal);

    if (!res.success) {
      setError(res.error);
      addToast(res.error, 'error');
      return;
    }

    addToast(`Welcome back, ${res.user.name}!`, 'success');
    
    if (redirectUrl) {
      navigate(redirectUrl);
    } else if (res.user.role === 'citizen') {
      navigate('/citizen/dashboard');
    } else if (res.user.role === 'crew') {
      navigate('/crew/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div style={{ maxWidth: '920px', margin: '20px auto 40px', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center' }}>
        <div 
          className="brand-icon-wrap" 
          style={{ width: '52px', height: '52px', margin: '0 auto 12px', borderRadius: 'var(--radius-md)' }}
        >
          <Trash2 size={26} color="var(--accent)" />
        </div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '4px' }}>{t('brandName')} Sign In</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          Select your portal to access your individual dashboard
        </p>
      </div>

      {/* 3 Portal Selection Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '12px' }}>
        {/* Citizen Portal Card */}
        <div 
          onClick={() => { setActivePortal('citizen'); setError(''); }}
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: activePortal === 'citizen' ? 'var(--surface)' : 'var(--surface-2)',
            border: activePortal === 'citizen' ? '2px solid var(--accent)' : '1px solid var(--line)',
            boxShadow: activePortal === 'citizen' ? 'var(--shadow)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          {activePortal === 'citizen' && (
            <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--accent)', color: 'var(--accent-ink)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={13} strokeWidth={3} />
            </div>
          )}
          <div className="brand-icon-wrap" style={{ background: 'var(--accent-dim)', color: 'var(--accent)', marginBottom: '10px' }}>
            <User size={20} />
          </div>
          <h3 style={{ fontSize: '1.05rem', color: activePortal === 'citizen' ? 'var(--accent)' : 'var(--text-h)', marginBottom: '2px' }}>
            1. Citizen Portal
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
            For local residents. Report waste, book bulk pickups & track SLAs.
          </p>
        </div>

        {/* Crew / Field Operations Card */}
        <div 
          onClick={() => { setActivePortal('crew'); setError(''); }}
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: activePortal === 'crew' ? 'var(--surface)' : 'var(--surface-2)',
            border: activePortal === 'crew' ? '2px solid var(--progress)' : '1px solid var(--line)',
            boxShadow: activePortal === 'crew' ? 'var(--shadow)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          {activePortal === 'crew' && (
            <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--progress)', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={13} strokeWidth={3} />
            </div>
          )}
          <div className="brand-icon-wrap" style={{ background: 'var(--progress-dim)', color: 'var(--progress)', marginBottom: '10px' }}>
            <Truck size={20} />
          </div>
          <h3 style={{ fontSize: '1.05rem', color: activePortal === 'crew' ? 'var(--progress)' : 'var(--text-h)', marginBottom: '2px' }}>
            2. Sanitation Crew Portal
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
            For drivers & sweepers. Access task queue, GPS & submit cleanup proofs.
          </p>
        </div>

        {/* Admin / Supervisor Portal Card */}
        <div 
          onClick={() => { setActivePortal('admin'); setError(''); }}
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: activePortal === 'admin' ? 'var(--surface)' : 'var(--surface-2)',
            border: activePortal === 'admin' ? '2px solid var(--pending)' : '1px solid var(--line)',
            boxShadow: activePortal === 'admin' ? 'var(--shadow)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          {activePortal === 'admin' && (
            <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--pending)', color: '#06170e', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={13} strokeWidth={3} />
            </div>
          )}
          <div className="brand-icon-wrap" style={{ background: 'var(--pending-dim)', color: 'var(--pending)', marginBottom: '10px' }}>
            <Shield size={20} />
          </div>
          <h3 style={{ fontSize: '1.05rem', color: activePortal === 'admin' ? 'var(--pending)' : 'var(--text-h)', marginBottom: '2px' }}>
            3. Admin Command Portal
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
            For supervisors. Citywide live dispatching, fleet management & analytics.
          </p>
        </div>
      </div>

      {/* Main Login Box */}
      <div className="card" style={{ maxWidth: '560px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {activePortal === 'citizen' && <User size={20} color="var(--accent)" />}
            {activePortal === 'crew' && <Truck size={20} color="var(--progress)" />}
            {activePortal === 'admin' && <Shield size={20} color="var(--pending)" />}

            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-h)' }}>
                {activePortal === 'citizen' && 'Citizen Portal Login'}
                {activePortal === 'crew' && 'Field Crew & Driver Login'}
                {activePortal === 'admin' && 'Municipal Command Login'}
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Enter your credentials to authenticate
              </div>
            </div>
          </div>

          <Link to={`/register?role=${activePortal}`} className="btn btn-primary btn-sm">
            <UserPlus size={13} /> Register
          </Link>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={{ padding: '10px 14px', background: 'var(--hazard-dim)', border: '1px solid rgba(241,89,79,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--hazard)', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handlePortalSubmit}>
          <div className="form-group">
            <label className="form-label">Registered Email Address (ID)</label>
            <input 
              type="email"
              className="form-input"
              placeholder="e.g. yourname@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Password</label>
            <input 
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              marginTop: '6px',
              background: activePortal === 'crew' ? 'var(--progress)' : activePortal === 'admin' ? 'var(--pending)' : 'var(--accent)',
              color: activePortal === 'admin' ? '#06170e' : '#fff'
            }}
          >
            {activePortal === 'citizen' && 'Log In to Citizen Portal'}
            {activePortal === 'crew' && 'Log In to Crew Operations'}
            {activePortal === 'admin' && 'Log In to Admin Command'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--line)', fontSize: '0.84rem' }}>
          <span style={{ color: 'var(--text-dim)' }}>Don't have an account?</span>
          <Link to={`/register?role=${activePortal}`} style={{ color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Create New {activePortal.toUpperCase()} Account <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
