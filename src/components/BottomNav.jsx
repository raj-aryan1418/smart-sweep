import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, 
  FileText, 
  Radio, 
  CheckCircle2, 
  BarChart3, 
  PackageCheck, 
  Users,
  User,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ProfileModal from './ProfileModal';

export default function BottomNav() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const role = user?.role;

  return (
    <>
      <nav className="bottom-nav">
        {user ? (
          <>
            <Link 
              to={role === 'admin' ? '/admin/dashboard' : role === 'crew' ? '/crew/dashboard' : '/citizen/dashboard'} 
              className={`bottom-nav-item ${location.pathname.includes('dashboard') || location.pathname === '/' ? 'active' : ''}`}
            >
              <Home size={18} />
              <span>{t('home')}</span>
            </Link>

            {role === 'citizen' && (
              <>
                <Link 
                  to="/report" 
                  className={`bottom-nav-item ${location.pathname === '/report' ? 'active' : ''}`}
                >
                  <PlusCircle size={18} />
                  <span>{t('reportIssue')}</span>
                </Link>
                <Link 
                  to="/my-complaints" 
                  className={`bottom-nav-item ${location.pathname === '/my-complaints' ? 'active' : ''}`}
                >
                  <FileText size={18} />
                  <span>{t('myComplaints')}</span>
                </Link>
                <Link 
                  to="/bulk-pickup" 
                  className={`bottom-nav-item ${location.pathname === '/bulk-pickup' ? 'active' : ''}`}
                >
                  <PackageCheck size={18} />
                  <span>{t('bulkPickup')}</span>
                </Link>
              </>
            )}

            {role === 'crew' && (
              <>
                <Link 
                  to="/crew/dashboard" 
                  className={`bottom-nav-item ${location.pathname.includes('crew') ? 'active' : ''}`}
                >
                  <CheckCircle2 size={18} />
                  <span>{t('assignedTasks')}</span>
                </Link>
                <Link 
                  to="/bulk-pickup-manage" 
                  className={`bottom-nav-item ${location.pathname === '/bulk-pickup-manage' ? 'active' : ''}`}
                >
                  <PackageCheck size={18} />
                  <span>{t('bulkDispatches')}</span>
                </Link>
                <Link 
                  to="/vehicles" 
                  className={`bottom-nav-item ${location.pathname === '/vehicles' ? 'active' : ''}`}
                >
                  <Users size={18} />
                  <span>{t('fleetVehicles')}</span>
                </Link>
              </>
            )}

            {role === 'admin' && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className={`bottom-nav-item ${location.pathname.includes('admin') || location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <BarChart3 size={18} />
                  <span>{t('commandCenter')}</span>
                </Link>
                <Link 
                  to="/reports" 
                  className={`bottom-nav-item ${location.pathname === '/reports' ? 'active' : ''}`}
                >
                  <FileText size={18} />
                  <span>{t('reportsTrends')}</span>
                </Link>
                <Link 
                  to="/bulk-pickup-manage" 
                  className={`bottom-nav-item ${location.pathname === '/bulk-pickup-manage' ? 'active' : ''}`}
                >
                  <PackageCheck size={18} />
                  <span>{t('bulkDispatches')}</span>
                </Link>
              </>
            )}

            {/* Dedicated Profile & Logout Tab */}
            <button 
              type="button"
              className="bottom-nav-item"
              onClick={() => setIsProfileModalOpen(true)}
              style={{ background: 'none', border: 'none' }}
            >
              <User size={18} />
              <span>Profile</span>
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className={`bottom-nav-item ${location.pathname === '/login' ? 'active' : ''}`}
            >
              <LogIn size={18} />
              <span>{t('signIn')}</span>
            </Link>
            <Link 
              to="/register" 
              className={`bottom-nav-item ${location.pathname === '/register' ? 'active' : ''}`}
            >
              <PlusCircle size={18} />
              <span>{t('createAccount')}</span>
            </Link>
            <Link 
              to="/feed" 
              className={`bottom-nav-item ${location.pathname === '/feed' ? 'active' : ''}`}
            >
              <Radio size={18} />
              <span>{t('publicFeed')}</span>
            </Link>
          </>
        )}
      </nav>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
