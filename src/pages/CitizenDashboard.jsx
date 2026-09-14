import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  PlusCircle, 
  FileText, 
  PackageCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  ArrowRight, 
  Bell, 
  Radio, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintsContext';
import { useBulkPickup } from '../context/BulkPickupContext';
import { useLanguage } from '../context/LanguageContext';
import { wardSchedules } from '../data/initialSchedules';
import MapView from '../components/MapView';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const { pickups } = useBulkPickup();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Citizen-specific data
  const myComplaints = complaints.filter(c => !user || c.reportedBy === user.name);
  const myPending = myComplaints.filter(c => c.status === 'Pending').length;
  const myInProgress = myComplaints.filter(c => c.status === 'In Progress' || c.status === 'En Route').length;
  const myResolved = myComplaints.filter(c => c.status === 'Resolved').length;
  const myPickups = pickups.filter(p => !user || p.requestedBy === user.name);

  // User ward schedule
  const userWard = user?.ward || 'Indiranagar (Ward 12)';
  const wardSchedule = wardSchedules.find(w => userWard.includes(w.wardName.split(' ')[0])) || wardSchedules[2];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Citizen Profile Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--line)',
          padding: 'clamp(16px, 3vw, 24px)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: 'var(--shadow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div 
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.3rem',
              border: '2px solid var(--accent)',
              flexShrink: 0
            }}
          >
            {user?.avatarInitial || 'C'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', color: 'var(--text-h)' }}>
                {user?.name || 'Citizen User'}
              </h1>
              <span className="badge badge-citizen">{t('citizenPortal')}</span>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="var(--accent)" />
                {userWard}
              </span>
              <span>•</span>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%', maxWidth: 'fit-content' }}>
          <Link to="/report" className="btn btn-primary btn-sm" style={{ flex: '1 1 auto' }}>
            <PlusCircle size={15} />
            {t('reportIssue')}
          </Link>
          <Link to="/bulk-pickup" className="btn btn-secondary btn-sm" style={{ flex: '1 1 auto' }}>
            <PackageCheck size={15} />
            {t('bulkPickup')}
          </Link>
        </div>
      </div>

      {/* Citizen Personal KPI Counters */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-title">{t('myComplaints')}</div>
            <div className="kpi-value">{myComplaints.length}</div>
            <div className="kpi-subtext">Total filed</div>
          </div>
          <div className="kpi-icon-wrap">
            <FileText size={20} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">{t('inProgress')}</div>
            <div className="kpi-value" style={{ color: 'var(--progress)' }}>{myInProgress + myPending}</div>
            <div className="kpi-subtext">{myInProgress} on-site</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--progress-dim)', color: 'var(--progress)' }}>
            <Clock size={20} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">{t('resolved')}</div>
            <div className="kpi-value" style={{ color: 'var(--resolved)' }}>{myResolved}</div>
            <div className="kpi-subtext">Verified clean</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--resolved-dim)', color: 'var(--resolved)' }}>
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">{t('bulkPickup')}</div>
            <div className="kpi-value" style={{ color: 'var(--pending)' }}>{myPickups.length}</div>
            <div className="kpi-subtext">Debris & furniture</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--pending-dim)', color: 'var(--pending)' }}>
            <PackageCheck size={20} />
          </div>
        </div>
      </div>

      {/* Ward Timetable Alert Widget */}
      <div className="card" style={{ padding: '16px', borderColor: 'rgba(47, 208, 119, 0.3)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Calendar size={16} color="var(--accent)" />
              <h2 style={{ fontSize: '1.05rem' }}>{t('todayCollection')} • {wardSchedule.wardName}</h2>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.84rem', lineHeight: 1.4 }}>
              {t('morningSlot')}: <strong style={{ color: 'var(--accent)' }}>{wardSchedule.morningSlot}</strong> • Supervisor: {wardSchedule.supervisor} ({wardSchedule.phone})
            </p>
          </div>

          <Link to="/schedule" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
            {t('viewTimetable')} →
          </Link>
        </div>
      </div>

      {/* Two Column Grid: My Recent Reports & Interactive Ward Map */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
        {/* My Reports List */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '1.1rem' }}>{t('myComplaints')}</h2>
            <Link to="/my-complaints" style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600 }}>
              All ({myComplaints.length}) →
            </Link>
          </div>

          {myComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-dim)' }}>
              <p style={{ fontSize: '0.88rem' }}>No active complaints reported yet.</p>
              <Link to="/report" className="btn btn-primary btn-sm" style={{ marginTop: '10px' }}>
                {t('reportIssue')}
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myComplaints.slice(0, 3).map(c => (
                <div 
                  key={c.id} 
                  style={{
                    padding: '12px',
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--line)',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/complaint/${c.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.88rem', wordBreak: 'break-word' }}>
                      {c.location}
                    </div>
                    <span className={`badge badge-${c.status.toLowerCase().replace(' ', '')}`}>
                      {c.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Case #{String(c.id).padStart(4, '0')}</span>
                    <span>{c.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ward Hotspots Map */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Nearby Ward Hotspots</h2>
            <Link to="/feed" style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600 }}>
              {t('publicFeed')} →
            </Link>
          </div>

          <MapView complaints={complaints} height="220px" />
        </div>
      </div>
    </div>
  );
}
