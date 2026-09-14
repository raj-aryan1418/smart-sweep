import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  FileText, 
  PackageCheck, 
  Calendar, 
  Radio, 
  BarChart3, 
  Truck, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Shield, 
  MapPin, 
  AlertTriangle, 
  Clock,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintsContext';
import { useBulkPickup } from '../context/BulkPickupContext';
import { useFleet } from '../context/FleetContext';
import MapView from '../components/MapView';

export default function HomeOverview() {
  const { user, switchRole } = useAuth();
  const { complaints } = useComplaints();
  const { pickups } = useBulkPickup();
  const { vehicles } = useFleet();
  const navigate = useNavigate();

  const role = user?.role || 'citizen';

  // Metrics
  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const activeFleetCount = vehicles.filter(v => v.status === 'En Route' || v.status === 'On Site').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Welcome Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--line)',
          padding: '32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'var(--accent-dim)', color: 'var(--accent)', borderRadius: 'var(--radius-pill)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
            <Sparkles size={14} />
            <span>Smart Municipal Solid Waste Network • Bengaluru Central</span>
          </div>

          <h1 style={{ fontSize: '2.1rem', marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Welcome to SmartSweep, <span style={{ color: 'var(--accent)' }}>{user?.name || 'Citizen'}</span>!
          </h1>

          <p style={{ color: 'var(--text)', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '24px' }}>
            {role === 'citizen' && 'Report public waste hazards, book bulk furniture & e-waste pickups, and track citywide cleanliness with real-time GPS.'}
            {role === 'crew' && 'Review your assigned cleanup queue, navigate municipal pickup routes, and submit after-action resolution proofs.'}
            {role === 'admin' && 'Central command for citywide sanitation: monitor live complaints, coordinate heavy vehicle dispatches, and audit SLA performance.'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {role === 'citizen' && (
              <>
                <Link to="/report" className="btn btn-primary">
                  <PlusCircle size={18} />
                  File a Waste Report
                </Link>
                <Link to="/my-complaints" className="btn btn-secondary">
                  <FileText size={18} />
                  My Complaints ({complaints.filter(c => c.reportedBy === user?.name).length})
                </Link>
                <Link to="/bulk-pickup" className="btn btn-secondary">
                  <PackageCheck size={18} />
                  Book Bulk Pickup
                </Link>
              </>
            )}

            {role === 'crew' && (
              <>
                <Link to="/crew" className="btn btn-primary">
                  <CheckCircle2 size={18} />
                  Assigned Tasks ({complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Cancelled').length})
                </Link>
                <Link to="/bulk-pickup-manage" className="btn btn-secondary">
                  <PackageCheck size={18} />
                  Bulk Pickups ({pickups.filter(p => p.status === 'Scheduled').length})
                </Link>
                <Link to="/vehicles" className="btn btn-secondary">
                  <Truck size={18} />
                  Fleet Status
                </Link>
              </>
            )}

            {role === 'admin' && (
              <>
                <Link to="/dashboard" className="btn btn-primary">
                  <BarChart3 size={18} />
                  Supervisor Dashboard
                </Link>
                <Link to="/reports" className="btn btn-secondary">
                  <TrendingUp size={18} />
                  Analytics & Trends
                </Link>
                <Link to="/workforce" className="btn btn-secondary">
                  <Users size={18} />
                  Workforce & PPE
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Ambient Decorative Graphic */}
        <div 
          style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Real-time KPI Stats Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Total Caseload</div>
            <div className="kpi-value">{totalComplaints}</div>
            <div className="kpi-subtext">Active citywide records</div>
          </div>
          <div className="kpi-icon-wrap">
            <FileText size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Pending Hotspots</div>
            <div className="kpi-value" style={{ color: 'var(--pending)' }}>{pendingCount}</div>
            <div className="kpi-subtext">Awaiting crew dispatch</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--pending-dim)', color: 'var(--pending)' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">In Progress</div>
            <div className="kpi-value" style={{ color: 'var(--progress)' }}>{inProgressCount}</div>
            <div className="kpi-subtext">Crews actively cleaning</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--progress-dim)', color: 'var(--progress)' }}>
            <Truck size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Resolved Cleanups</div>
            <div className="kpi-value" style={{ color: 'var(--resolved)' }}>{resolvedCount}</div>
            <div className="kpi-subtext">
              {totalComplaints > 0 ? `${Math.round((resolvedCount / totalComplaints) * 100)}% resolution rate` : '100%'}
            </div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--resolved-dim)', color: 'var(--resolved)' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Role Action Center Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>Operational Hub & Services</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem' }}>Fast access modules tailored for {role} workflows</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn btn-sm ${role === 'citizen' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => switchRole('citizen')}
            >
              Citizen View
            </button>
            <button 
              className={`btn btn-sm ${role === 'crew' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => switchRole('crew')}
            >
              Crew View
            </button>
            <button 
              className={`btn btn-sm ${role === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => switchRole('admin')}
            >
              Admin View
            </button>
          </div>
        </div>

        <div className="card-grid">
          {role === 'citizen' && (
            <>
              <div className="card" onClick={() => navigate('/report')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div className="brand-icon-wrap" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                    <PlusCircle size={22} />
                  </div>
                  <ArrowRight size={18} color="var(--text-dim)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>File a Waste Report</h3>
                <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Report overflowing bins, illegal dumping, or street litter with GPS auto-detection & photos.
                </p>
              </div>

              <div className="card" onClick={() => navigate('/my-complaints')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div className="brand-icon-wrap" style={{ background: 'var(--progress-dim)', color: 'var(--progress)' }}>
                    <FileText size={22} />
                  </div>
                  <ArrowRight size={18} color="var(--text-dim)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Track My Complaints</h3>
                <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Track live status updates, crew progress, after-cleanup proof, and submit 5-star feedback.
                </p>
              </div>

              <div className="card" onClick={() => navigate('/bulk-pickup')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div className="brand-icon-wrap" style={{ background: 'var(--pending-dim)', color: 'var(--pending)' }}>
                    <PackageCheck size={22} />
                  </div>
                  <ArrowRight size={18} color="var(--text-dim)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Bulk Waste Pickup</h3>
                <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Book doorstep collection for discarded furniture, electronics, renovation rubble & garden waste.
                </p>
              </div>

              <div className="card" onClick={() => navigate('/schedule')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div className="brand-icon-wrap" style={{ background: 'var(--surface-2)', color: 'var(--text-h)' }}>
                    <Calendar size={22} />
                  </div>
                  <ArrowRight size={18} color="var(--text-dim)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Collection Timetable</h3>
                <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  View daily wet, dry, and hazardous waste pickup timings for your ward & holiday advisories.
                </p>
              </div>
            </>
          )}

          {role === 'crew' && (
            <>
              <div className="card" onClick={() => navigate('/crew')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div className="brand-icon-wrap" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <ArrowRight size={18} color="var(--text-dim)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Assigned Task Queue</h3>
                <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Review active cleanup jobs, update status to En Route, and submit final photo proof.
                </p>
              </div>

              <div className="card" onClick={() => navigate('/bulk-pickup-manage')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div className="brand-icon-wrap" style={{ background: 'var(--pending-dim)', color: 'var(--pending)' }}>
                    <PackageCheck size={22} />
                  </div>
                  <ArrowRight size={18} color="var(--text-dim)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Bulk Pickup Dispatches</h3>
                <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Coordinate heavy waste collections, verify load size requirements, and mark collected.
                </p>
              </div>

              <div className="card" onClick={() => navigate('/workforce')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div className="brand-icon-wrap" style={{ background: 'var(--progress-dim)', color: 'var(--progress)' }}>
                    <Users size={22} />
                  </div>
                  <ArrowRight size={18} color="var(--text-dim)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Tools & PPE Safety Gear</h3>
                <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Inspect safety boots, reflective vests, heavy gloves, and equipment condition checklist.
                </p>
              </div>

              <div className="card" onClick={() => navigate('/vehicles')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div className="brand-icon-wrap" style={{ background: 'var(--surface-2)', color: 'var(--text-h)' }}>
                    <Truck size={22} />
                  </div>
                  <ArrowRight size={18} color="var(--text-dim)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Fleet Vehicles</h3>
                <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Check hydraulic compactors, tippers, battery charge / fuel levels, and maintenance status.
                </p>
              </div>
            </>
          )}

          {role === 'admin' && (
            <>
              <div className="card" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div className="brand-icon-wrap" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                    <BarChart3 size={22} />
                  </div>
                  <ArrowRight size={18} color="var(--text-dim)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Supervisor Dashboard</h3>
                <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Live citywide monitoring of open complaints, crew locations, and SLA compliance metrics.
                </p>
              </div>

              <div className="card" onClick={() => navigate('/reports')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div className="brand-icon-wrap" style={{ background: 'var(--progress-dim)', color: 'var(--progress)' }}>
                    <TrendingUp size={22} />
                  </div>
                  <ArrowRight size={18} color="var(--text-dim)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Reports & Analytics</h3>
                <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Deep-dive charts on average resolution time, filing trends, hazard breakdowns, and ward rankings.
                </p>
              </div>

              <div className="card" onClick={() => navigate('/bulk-pickup-manage')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div className="brand-icon-wrap" style={{ background: 'var(--pending-dim)', color: 'var(--pending)' }}>
                    <PackageCheck size={22} />
                  </div>
                  <ArrowRight size={18} color="var(--text-dim)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Bulk Operations</h3>
                <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Audit heavy waste requests, assign dedicated tipper trucks, and confirm collection slots.
                </p>
              </div>

              <div className="card" onClick={() => navigate('/workforce')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div className="brand-icon-wrap" style={{ background: 'var(--surface-2)', color: 'var(--text-h)' }}>
                    <Users size={22} />
                  </div>
                  <ArrowRight size={18} color="var(--text-dim)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Workforce & Safety</h3>
                <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Manage sanitation staff roster, shifts, safety audit scores, and warehouse PPE equipment.
                </p>
              </div>
            </>
          )}

          {/* Universal Public Feed Card */}
          <div className="card" onClick={() => navigate('/feed')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div className="brand-icon-wrap" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                <Radio size={22} />
              </div>
              <ArrowRight size={18} color="var(--text-dim)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Public Community Feed</h3>
            <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Transparent community stream showing verified before/after cleanups, citizen ratings & applause.
            </p>
          </div>
        </div>
      </div>

      {/* Live Citywide Hotspot Map Preview */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>Live Municipal Hotspots Map</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem' }}>Interactive view of current waste points and resolution statuses</p>
          </div>
          <Link to="/feed" className="btn btn-secondary btn-sm">
            View Live Stream
          </Link>
        </div>

        <MapView complaints={complaints} height="360px" />
      </div>

      {/* Recent Hotspots List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.3rem' }}>Recent Reports & Dispatches</h2>
          <Link to={role === 'citizen' ? '/my-complaints' : role === 'crew' ? '/crew' : '/dashboard'} style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600 }}>
            View All →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {complaints.slice(0, 4).map((c) => (
            <div 
              key={c.id} 
              className="card"
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => navigate(`/complaint/${c.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  #{String(c.id).padStart(4, '0')}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.95rem' }}>{c.location}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {c.category} • Reported by {c.reportedBy} ({c.createdAt})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {c.hazard && c.hazard !== 'None' && (
                  <span className="badge badge-hazard" style={{ display: 'none' }}>
                    {c.hazard}
                  </span>
                )}
                <span className={`badge badge-${c.status.toLowerCase().replace(' ', '')}`}>
                  {c.status}
                </span>
                <ArrowRight size={16} color="var(--text-dim)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
