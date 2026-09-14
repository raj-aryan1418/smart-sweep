import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, 
  User, 
  Shield, 
  Truck, 
  PlusCircle, 
  FileText, 
  PackageCheck, 
  Calendar, 
  BarChart3, 
  Users, 
  Radio, 
  LogOut, 
  Sun, 
  Moon, 
  MapPin,
  Globe,
  LogIn,
  UserPlus,
  Settings,
  Edit3,
  CheckCircle2,
  Navigation,
  Clock,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import ProfileModal from './ProfileModal';

export default function DrawerMenu({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, SUPPORTED_LANGUAGES } = useLanguage();
  const navigate = useNavigate();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (!isOpen) return null;

  const role = user?.role || 'citizen';

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const handleOpenProfile = () => {
    setIsProfileModalOpen(true);
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-h)' }}>{t('brandName')}</span>
            {user && (
              <span className={`badge ${role === 'admin' ? 'badge-admin' : role === 'crew' ? 'badge-crew' : 'badge-citizen'}`} style={{ textTransform: 'uppercase', fontSize: '0.68rem' }}>
                {role === 'admin' ? '🛡️ Admin' : role === 'crew' ? '🚛 Crew' : '👤 Citizen'}
              </span>
            )}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* User Card */}
        {user ? (
          <div 
            className="drawer-user-info"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative' }}
            onClick={handleOpenProfile}
          >
            <div className="drawer-avatar">
              {user?.avatarInitial || 'U'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--text-h)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', fontSize: '0.92rem' }}>
                {user?.name || 'Sanitation User'}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={11} />
                {user?.ward || user?.email || 'Active Duty'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Edit3 size={11} /> Tap to manage profile & settings
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '14px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: '4px' }}>Not Logged In</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '12px' }}>Please sign in or create an account</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => handleNav('/login')}>
                <LogIn size={13} /> {t('signIn')}
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => handleNav('/register')}>
                <UserPlus size={13} /> {t('createAccount')}
              </button>
            </div>
          </div>
        )}

        {/* Switch Language Selector in Drawer */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={13} color="var(--accent)" />
            <span>{t('selectLanguage')} / भाषा</span>
          </div>
          <select 
            className="form-select"
            style={{ height: '36px', fontSize: '0.84rem' }}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {SUPPORTED_LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.nativeName} ({l.name})</option>
            ))}
          </select>
        </div>

        {/* Navigation List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
          {role === 'citizen' && (
            <>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/citizen/dashboard')}
              >
                <User size={16} /> {t('citizenHub')}
              </button>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/report')}
              >
                <PlusCircle size={16} /> {t('reportIssue')}
              </button>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/my-complaints')}
              >
                <FileText size={16} /> {t('myComplaints')}
              </button>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/bulk-pickup')}
              >
                <PackageCheck size={16} /> {t('bulkPickup')}
              </button>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/schedule')}
              >
                <Calendar size={16} /> {t('schedule')}
              </button>
            </>
          )}

          {role === 'crew' && (
            <>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/crew/dashboard')}
              >
                <CheckCircle2 size={16} color="var(--progress)" /> 
                <span style={{ fontWeight: 600 }}>{t('crewDashboard')}</span>
              </button>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/bulk-pickup-manage')}
              >
                <PackageCheck size={16} /> {t('bulkDispatches')}
              </button>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/vehicles')}
              >
                <Truck size={16} /> {t('fleetVehicles')}
              </button>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/workforce')}
              >
                <Users size={16} /> {t('toolsPPE')}
              </button>
            </>
          )}

          {role === 'admin' && (
            <>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/admin/dashboard')}
              >
                <BarChart3 size={16} color="var(--pending)" /> 
                <span style={{ fontWeight: 600 }}>{t('commandCenter')}</span>
              </button>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/reports')}
              >
                <FileText size={16} /> {t('reportsTrends')}
              </button>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/bulk-pickup-manage')}
              >
                <PackageCheck size={16} /> {t('bulkDispatches')}
              </button>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/workforce')}
              >
                <Users size={16} /> {t('workforce')}
              </button>
              <button 
                className="nav-link-btn" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNav('/vehicles')}
              >
                <Truck size={16} /> {t('fleetDispatch')}
              </button>
            </>
          )}

          <button 
            className="nav-link-btn" 
            style={{ width: '100%', justifyContent: 'flex-start' }}
            onClick={() => handleNav('/feed')}
          >
            <Radio size={16} /> {t('publicFeed')}
          </button>
        </div>

        {/* Footer Actions */}
        <div style={{ paddingTop: '14px', borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'space-between' }}
            onClick={toggleTheme}
          >
            <span>{t('themeMode')}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              {theme === 'dark' ? t('darkForest') : t('crispLight')}
            </span>
          </button>

          {user && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={handleOpenProfile}
              >
                <Settings size={15} /> Profile
              </button>
              <button 
                className="btn btn-danger" 
                style={{ flex: 1 }}
                onClick={() => {
                  logout();
                  handleNav('/login');
                }}
              >
                <LogOut size={15} /> {t('signOut')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
