import React, { useState } from 'react';
import { 
  Users, 
  Truck, 
  MapPin, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  ArrowUpDown,
  Download,
  Phone,
  BarChart3
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import MapView from '../components/MapView';

export default function SupervisorDashboard() {
  const { complaints, updateStatus } = useComplaints();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [selectedWard, setSelectedWard] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedHazard, setSelectedHazard] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering
  const filtered = complaints.filter(c => {
    if (selectedWard !== 'All' && !c.ward.includes(selectedWard)) return false;
    if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
    if (selectedHazard !== 'All' && (c.hazard || 'None') !== selectedHazard) return false;
    if (searchQuery.trim() && !c.location.toLowerCase().includes(searchQuery.toLowerCase()) && !c.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'En Route').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  const handleQuickAssign = (id, crewName) => {
    updateStatus(id, 'In Progress', { assignedCrew: crewName });
    addToast(`Assigned Case #${String(id).padStart(4, '0')} to ${crewName}`, 'success');
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(complaints, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `smartsweep-complaints-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Municipal complaints data exported successfully!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <h1 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)' }}>
              {t('commandCenter')}
            </h1>
            <span className="badge badge-admin">Executive Oversight</span>
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.86rem' }}>
            Citywide real-time municipal caseload, GPS telemetry & field crew deployment
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handleExportData} style={{ flexShrink: 0 }}>
          <Download size={14} /> Export CSV / JSON
        </button>
      </div>

      {/* Real-time KPI Metric Row */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-title">{t('totalCaseload')}</div>
            <div className="kpi-value">{total}</div>
            <div className="kpi-subtext">100% telemetry synced</div>
          </div>
          <div className="kpi-icon-wrap">
            <BarChart3 size={20} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">{t('pending')}</div>
            <div className="kpi-value" style={{ color: 'var(--pending)' }}>{pending}</div>
            <div className="kpi-subtext">Unassigned queue</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--pending-dim)', color: 'var(--pending)' }}>
            <Clock size={20} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">{t('inProgress')}</div>
            <div className="kpi-value" style={{ color: 'var(--progress)' }}>{inProgress}</div>
            <div className="kpi-subtext">Active field crews</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--progress-dim)', color: 'var(--progress)' }}>
            <Truck size={20} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">{t('slaCompliance')}</div>
            <div className="kpi-value" style={{ color: 'var(--resolved)' }}>94.2%</div>
            <div className="kpi-subtext">&lt; 4 hr turnaround</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--resolved-dim)', color: 'var(--resolved)' }}>
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* Interactive Citywide Map */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem' }}>Bengaluru Municipal Hotspots & GPS Telematics</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Live pin status across all municipal wards</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pending)' }} /> Pending</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--progress)' }} /> Cleaning</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--resolved)' }} /> Resolved</span>
          </div>
        </div>

        <MapView complaints={filtered} height="280px" />
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', height: '38px', fontSize: '0.82rem' }}
              placeholder="Search location or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <select 
              className="form-select" 
              style={{ height: '38px', fontSize: '0.82rem' }}
              value={selectedWard} 
              onChange={(e) => setSelectedWard(e.target.value)}
            >
              <option value="All">All Wards (Citywide)</option>
              <option value="Indiranagar">Indiranagar (Ward 12)</option>
              <option value="MG Road">MG Road (Ward 04)</option>
              <option value="Koramangala">Koramangala (Ward 08)</option>
              <option value="Jayanagar">Jayanagar (Ward 15)</option>
            </select>
          </div>

          <div>
            <select 
              className="form-select" 
              style={{ height: '38px', fontSize: '0.82rem' }}
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="En Route">En Route</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <select 
              className="form-select" 
              style={{ height: '38px', fontSize: '0.82rem' }}
              value={selectedHazard} 
              onChange={(e) => setSelectedHazard(e.target.value)}
            >
              <option value="All">All Hazard Levels</option>
              <option value="None">Normal Waste</option>
              <option value="Overflowing Bin">Overflowing Bin</option>
              <option value="Dead Animal">Animal Carcass</option>
              <option value="Drain Block">Drain Blockage</option>
              <option value="Medical Waste">Medical Hazard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incident Management Table (Ultra Responsive Card & Table) */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.1rem' }}>Active Municipal Incident Caseload ({filtered.length})</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Showing real-time reports</span>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--text-dim)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px' }}>Case ID</th>
                <th style={{ padding: '8px' }}>Location & Ward</th>
                <th style={{ padding: '8px' }}>Hazard Type</th>
                <th style={{ padding: '8px' }}>Status</th>
                <th style={{ padding: '8px' }}>Assigned Unit</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Quick Dispatch</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    #{String(c.id).padStart(4, '0')}
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-h)' }}>{c.location}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{c.ward}</div>
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    {c.hazard && c.hazard !== 'None' ? (
                      <span className="badge badge-hazard" style={{ fontSize: '0.7rem' }}>
                        <AlertTriangle size={11} /> {c.hazard}
                      </span>
                    ) : (
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Normal</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <span className={`badge badge-${c.status.toLowerCase().replace(' ', '')}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', color: 'var(--text-h)' }}>
                    {c.assignedCrew || <span style={{ color: 'var(--text-dim)' }}>Unassigned</span>}
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                    {c.status !== 'Resolved' ? (
                      <select 
                        className="form-select"
                        style={{ height: '30px', fontSize: '0.74rem', padding: '2px 8px', width: 'auto', display: 'inline-block' }}
                        onChange={(e) => handleQuickAssign(c.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Deploy Crew...</option>
                        <option value="Suresh Patil (Compactor 01)">Suresh Patil (Compactor 01)</option>
                        <option value="Ramesh Kumar (Tipper 04)">Ramesh Kumar (Tipper 04)</option>
                        <option value="Anand Verma (Sweeper 02)">Anand Verma (Sweeper 02)</option>
                      </select>
                    ) : (
                      <span style={{ color: 'var(--resolved)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
                        <CheckCircle2 size={13} /> Cleaned
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
