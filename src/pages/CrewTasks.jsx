import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  Check, 
  Camera, 
  ArrowRight,
  Filter,
  ShieldCheck,
  BatteryCharging,
  HardHat,
  Users,
  PackageCheck
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CompleteTaskModal from '../components/CompleteTaskModal';
import MapView from '../components/MapView';

export default function CrewTasks() {
  const { complaints, updateStatus } = useComplaints();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTaskModal, setActiveTaskModal] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // all, active, completed

  // Tasks relevant to crew
  const activeTasks = complaints.filter(c => c.status !== 'Cancelled');
  
  const displayedTasks = activeTasks.filter(c => {
    if (filterMode === 'active') return c.status !== 'Resolved';
    if (filterMode === 'completed') return c.status === 'Resolved';
    return true;
  });

  const handleSetEnRoute = (id) => {
    updateStatus(id, 'En Route', {
      assignedCrew: user?.name || 'Suresh Patil',
      assignedVehicle: user?.vehicle || 'KA-01-EA-4821'
    });
    addToast(`Case #${String(id).padStart(4, '0')} marked as En Route`, 'info');
  };

  const handleStartCleanup = (id) => {
    updateStatus(id, 'In Progress');
    addToast(`Case #${String(id).padStart(4, '0')} cleanup started!`, 'info');
  };

  // Mock distance helper based on complaint ID
  const getDistance = (id) => {
    const dist = (0.4 + (id % 5) * 0.5).toFixed(1);
    return `${dist} km away`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Crew Duty Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--line)',
          padding: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          boxShadow: 'var(--shadow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div 
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--progress-dim)',
              color: 'var(--progress)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.5rem',
              border: '2px solid var(--progress)'
            }}
          >
            {user?.avatarInitial || 'SP'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.6rem', color: 'var(--text-h)' }}>
                Field Crew Dashboard • {user?.name || 'Suresh Patil'}
              </h1>
              <span className="badge badge-crew">{user?.crewRole || 'Crew Lead & Sweeper'}</span>
            </div>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} color="var(--progress)" />
                Shift: {user?.shift || 'Morning (06:00 - 14:00)'}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Truck size={14} color="var(--accent)" />
                Assigned Truck: {user?.vehicle || 'KA-01-EA-4821'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ padding: '8px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Safety Score</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--resolved)' }}>{user?.safetyScore || 98}% ★</div>
          </div>
          <div style={{ padding: '8px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Cleared</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-h)' }}>{user?.completedTasks || 142}</div>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Assigned Queue</div>
            <div className="kpi-value">{activeTasks.length}</div>
            <div className="kpi-subtext">Total active jobs in sector</div>
          </div>
          <div className="kpi-icon-wrap">
            <Truck size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Pending Arrival</div>
            <div className="kpi-value" style={{ color: 'var(--pending)' }}>
              {activeTasks.filter(c => c.status === 'Pending').length}
            </div>
            <div className="kpi-subtext">Ready for dispatch</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--pending-dim)', color: 'var(--pending)' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">In Progress</div>
            <div className="kpi-value" style={{ color: 'var(--progress)' }}>
              {activeTasks.filter(c => c.status === 'In Progress' || c.status === 'En Route').length}
            </div>
            <div className="kpi-subtext">Crews on-site cleaning</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--progress-dim)', color: 'var(--progress)' }}>
            <Navigation size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Completed Today</div>
            <div className="kpi-value" style={{ color: 'var(--resolved)' }}>
              {activeTasks.filter(c => c.status === 'Resolved').length}
            </div>
            <div className="kpi-subtext">Photo proofs verified</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--resolved-dim)', color: 'var(--resolved)' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Interactive Sector Hotspots Map */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={18} color="var(--accent)" />
            <h2 style={{ fontSize: '1.15rem' }}>Sector Hotspot Navigation & GPS</h2>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Indiranagar & MG Road Corridor</span>
        </div>

        <MapView complaints={displayedTasks} height="280px" />
      </div>

      {/* Filter Tabs */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn btn-sm ${filterMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterMode('all')}
            >
              All Sector Tasks ({activeTasks.length})
            </button>
            <button 
              className={`btn btn-sm ${filterMode === 'active' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterMode('active')}
            >
              Pending / Active ({activeTasks.filter(c => c.status !== 'Resolved').length})
            </button>
            <button 
              className={`btn btn-sm ${filterMode === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterMode('completed')}
            >
              Completed ({activeTasks.filter(c => c.status === 'Resolved').length})
            </button>
          </div>
        </div>
      </div>

      {/* Task Queue Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {displayedTasks.map((c) => (
          <div 
            key={c.id} 
            className="card"
            style={{ 
              padding: '20px',
              borderLeft: c.hazard && c.hazard !== 'None' ? '4px solid var(--hazard)' : '4px solid var(--accent)'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    #{String(c.id).padStart(4, '0')}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-h)' }}>
                    {c.location}
                  </span>
                  <span className="badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Navigation size={12} color="var(--accent)" />
                    {getDistance(c.id)}
                  </span>
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{c.category}</span>
                  <span>•</span>
                  <span>{c.ward}</span>
                  <span>•</span>
                  <span>Reported {c.createdAt} by {c.reportedBy}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {c.hazard && c.hazard !== 'None' && (
                  <span className="badge badge-hazard">
                    <AlertTriangle size={13} /> {c.hazard}
                  </span>
                )}
                <span className={`badge badge-${c.status.toLowerCase().replace(' ', '')}`}>
                  {c.status}
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-h)', fontSize: '0.92rem', marginBottom: '16px', background: 'var(--surface-2)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              {c.description}
            </p>

            {/* Bottom Row Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '14px', borderTop: '1px solid var(--line)' }}>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-dim)' }}>
                {c.status === 'Resolved' && (
                  <span style={{ color: 'var(--resolved)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Cleanup Complete • {c.wasteRemoved || '240 kg'} waste removed
                  </span>
                )}
                {c.status === 'In Progress' && (
                  <span style={{ color: 'var(--progress)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Truck size={16} /> Active on-site clearance in progress
                  </span>
                )}
                {c.status === 'Pending' && (
                  <span style={{ color: 'var(--pending)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} /> Ready for vehicle dispatch
                  </span>
                )}
              </div>

              {/* Status Progression Workflow Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {c.status === 'Pending' && (
                  <button className="btn btn-secondary btn-sm" onClick={() => handleSetEnRoute(c.id)}>
                    <Truck size={14} /> Mark En Route
                  </button>
                )}

                {c.status === 'En Route' && (
                  <button className="btn btn-secondary btn-sm" onClick={() => handleStartCleanup(c.id)}>
                    <Navigation size={14} /> Start Field Cleanup
                  </button>
                )}

                {c.status === 'In Progress' && (
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveTaskModal(c)}>
                    <Camera size={14} /> Complete & Upload Proof
                  </button>
                )}

                {c.status === 'Resolved' && (
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTaskModal(c)}>
                    <CheckCircle2 size={14} /> Review Proof Details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Modal */}
      {activeTaskModal && (
        <CompleteTaskModal 
          isOpen={true}
          onClose={() => setActiveTaskModal(null)}
          complaint={activeTaskModal}
        />
      )}
    </div>
  );
}
