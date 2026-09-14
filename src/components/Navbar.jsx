import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Sun, 
  Moon, 
  Menu, 
  Shield, 
  Truck, 
  User, 
  PlusCircle, 
  FileText, 
  BarChart3, 
  Calendar, 
  Radio, 
  Users, 
  PackageCheck,
  CheckCircle2,
  ChevronDown,
  LogOut,
  Sparkles,
  Globe,
  UserPlus,
  LogIn,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import ProfileModal from './ProfileModal';

export default function Navbar({ onOpenDrawer }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, SUPPORTED_LANGUAGES } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const role = user?.role;

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
    setIsLangMenuOpen(false);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      <header className="app-header">
        {/* Brand Logo */}
        <Link 
          to={user ? (role === 'admin' ? '/admin/dashboard' : role === 'crew' ? '/crew/dashboard' : '/citizen/dashboard') : '/login'} 
          className="header-brand"
          style={{ minWidth: 0, flexShrink: 1 }}
        >
          <div className="brand-icon-wrap">
            <Trash2 size={18} strokeWidth={2.4} />
          </div>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {t('brandName')}
          </span>
          {user && (
            <span 
              className={`badge ${role === 'admin' ? 'badge-admin' : role === 'crew' ? 'badge-crew' : 'badge-citizen'}`} 
              style={{ fontSize: '0.64rem', textTransform: 'uppercase', display: 'none' }}
              id="desktop-role-badge"
            >
              {role === 'admin' ? `🛡️ Admin` : role === 'crew' ? `🚛 Crew` : `👤 Citizen`}
            </span>
          )}
        </Link>

        {/* Desktop Navigation Links (When Logged In) */}
        {user && (
          <nav className="desktop-nav">
            {role === 'citizen' && (
              <>
                <Link 
                  to="/citizen/dashboard" 
                  className={`nav-link-btn ${location.pathname === '/citizen/dashboard' ? 'active' : ''}`}
                >
                  {t('citizenHub')}
                </Link>
                <Link 
                  to="/report" 
                  className={`nav-link-btn ${location.pathname === '/report' ? 'active' : ''}`}
                >
                  <PlusCircle size={15} />
                  {t('reportIssue')}
                </Link>
                <Link 
                  to="/my-complaints" 
                  className={`nav-link-btn ${location.pathname === '/my-complaints' ? 'active' : ''}`}
                >
                  <FileText size={15} />
                  {t('myComplaints')}
                </Link>
                <Link 
                  to="/bulk-pickup" 
                  className={`nav-link-btn ${location.pathname === '/bulk-pickup' ? 'active' : ''}`}
                >
                  <PackageCheck size={15} />
                  {t('bulkPickup')}
                </Link>
                <Link 
                  to="/schedule" 
                  className={`nav-link-btn ${location.pathname === '/schedule' ? 'active' : ''}`}
                >
                  <Calendar size={15} />
                  {t('schedule')}
                </Link>
              </>
            )}

            {role === 'crew' && (
              <>
                <Link 
                  to="/crew/dashboard" 
                  className={`nav-link-btn ${location.pathname === '/crew/dashboard' || location.pathname === '/crew' ? 'active' : ''}`}
                >
                  <CheckCircle2 size={15} />
                  {t('crewDashboard')}
                </Link>
                <Link 
                  to="/bulk-pickup-manage" 
                  className={`nav-link-btn ${location.pathname === '/bulk-pickup-manage' ? 'active' : ''}`}
                >
                  <PackageCheck size={15} />
                  {t('bulkDispatches')}
                </Link>
                <Link 
                  to="/vehicles" 
                  className={`nav-link-btn ${location.pathname === '/vehicles' ? 'active' : ''}`}
                >
                  <Truck size={15} />
                  {t('fleetVehicles')}
                </Link>
                <Link 
                  to="/workforce" 
                  className={`nav-link-btn ${location.pathname === '/workforce' ? 'active' : ''}`}
                >
                  <Users size={15} />
                  {t('toolsPPE')}
                </Link>
              </>
            )}

            {role === 'admin' && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className={`nav-link-btn ${location.pathname === '/admin/dashboard' || location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <BarChart3 size={15} />
                  {t('commandCenter')}
                </Link>
                <Link 
                  to="/reports" 
                  className={`nav-link-btn ${location.pathname === '/reports' ? 'active' : ''}`}
                >
                  <FileText size={15} />
                  {t('reportsTrends')}
                </Link>
                <Link 
                  to="/bulk-pickup-manage" 
                  className={`nav-link-btn ${location.pathname === '/bulk-pickup-manage' ? 'active' : ''}`}
                >
                  <PackageCheck size={15} />
                  {t('bulkDispatches')}
                </Link>
                <Link 
                  to="/workforce" 
                  className={`nav-link-btn ${location.pathname === '/workforce' ? 'active' : ''}`}
                >
                  <Users size={15} />
                  {t('workforce')}
                </Link>
                <Link 
                  to="/vehicles" 
                  className={`nav-link-btn ${location.pathname === '/vehicles' ? 'active' : ''}`}
                >
                  <Truck size={15} />
                  {t('fleetDispatch')}
                </Link>
              </>
            )}

            <Link 
              to="/feed" 
              className={`nav-link-btn ${location.pathname === '/feed' ? 'active' : ''}`}
            >
              <Radio size={15} />
              {t('publicFeed')}
            </Link>
          </nav>
        )}

        {/* Header Controls (Mobile Compact) */}
        <div className="header-controls" style={{ gap: '6px', flexShrink: 0 }}>
          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 8px', borderRadius: 'var(--radius-pill)', height: '34px' }}
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              title={t('selectLanguage')}
            >
              <Globe size={14} color="var(--accent)" />
              <span style={{ fontWeight: 600, fontSize: '0.78rem' }}>{currentLangObj.code.toUpperCase()}</span>
              <ChevronDown size={11} color="var(--text-dim)" />
            </button>

            {isLangMenuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 120 }} onClick={() => setIsLangMenuOpen(false)} />
                <div 
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '230px',
                    maxHeight: '340px',
                    overflowY: 'auto',
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 130,
                    animation: 'modalIn 0.15s ease'
                  }}
                >
                  <div style={{ padding: '4px 8px 8px', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, borderBottom: '1px solid var(--line)', marginBottom: '6px' }}>
                    🇮🇳 Choose Language
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectLanguage(lang.code)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: language === lang.code ? 'var(--accent-dim)' : 'transparent',
                          color: language === lang.code ? 'var(--accent)' : 'var(--text-h)',
                          fontSize: '0.84rem',
                          fontWeight: language === lang.code ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span>{lang.nativeName} ({lang.name})</span>
                        {language === lang.code && <span style={{ fontSize: '0.75rem' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Status / Account Dropdown */}
          {user ? (
            <button 
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: 'var(--radius-pill)', height: '34px' }}
              onClick={() => setIsProfileModalOpen(true)}
              title="Click to manage profile & settings"
            >
              <div 
                style={{ 
                  width: '22px', 
                  height: '22px', 
                  borderRadius: '50%', 
                  background: role === 'admin' ? 'var(--pending-dim)' : role === 'crew' ? 'var(--progress-dim)' : 'var(--accent-dim)',
                  color: role === 'admin' ? 'var(--pending)' : role === 'crew' ? 'var(--progress)' : 'var(--accent)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 700, 
                  fontSize: '0.68rem' 
                }}
              >
                {user?.avatarInitial || 'U'}
              </div>
              <span className="navbar-user-name" style={{ fontWeight: 600, color: 'var(--text-h)', maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.78rem' }}>
                {user?.name?.split(' ')[0]}
              </span>
            </button>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', height: '34px', fontSize: '0.78rem' }}>
              <LogIn size={13} />
              <span>{t('signIn')}</span>
            </Link>
          )}

          {/* Theme Switcher */}
          <button 
            className="icon-btn" 
            style={{ width: '34px', height: '34px' }}
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Hamburger Menu Trigger (Offcanvas Nav) */}
          <button 
            className="icon-btn" 
            style={{ width: '36px', height: '36px', background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--text-h)' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenDrawer();
            }}
            aria-label="Open Navigation Menu"
            title="Open Offcanvas Navigation Menu"
          >
            <Menu size={18} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      {/* Account & Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
