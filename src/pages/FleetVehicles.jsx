import React, { useState } from 'react';
import { 
  Truck, 
  BatteryCharging, 
  Fuel, 
  MapPin, 
  User, 
  Plus, 
  CheckCircle2, 
  Wrench, 
  Search,
  Navigation
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import { useToast } from '../context/ToastContext';
import AddVehicleModal from '../components/AddVehicleModal';

export default function FleetVehicles() {
  const { vehicles, updateVehicleStatus } = useFleet();
  const { addToast } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = vehicles.filter(v => {
    const matchesStatus = statusFilter === 'all' || v.status.toLowerCase().replace(' ', '') === statusFilter;
    const matchesSearch = 
      v.plateNo.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.driver.toLowerCase().includes(search.toLowerCase()) ||
      v.ward.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Fleet & Heavy Vehicle Telematics</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem' }}>
            Real-time tracking of municipal hydraulic compactors, zero-emission electric tippers & sweepers
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setIsAddOpen(true)}>
          <Plus size={14} /> Register New Vehicle
        </button>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Active Fleet</div>
            <div className="kpi-value">{vehicles.length}</div>
            <div className="kpi-subtext">Municipal vehicles in fleet</div>
          </div>
          <div className="kpi-icon-wrap">
            <Truck size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">On Route / On Site</div>
            <div className="kpi-value" style={{ color: 'var(--accent)' }}>
              {vehicles.filter(v => v.status === 'En Route' || v.status === 'On Site').length}
            </div>
            <div className="kpi-subtext">Currently collecting waste</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
            <Navigation size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Zero-Emission EVs</div>
            <div className="kpi-value" style={{ color: 'var(--progress)' }}>
              {vehicles.filter(v => v.fuelType === 'EV Battery').length}
            </div>
            <div className="kpi-subtext">Electric tippers in rotation</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--progress-dim)', color: 'var(--progress)' }}>
            <BatteryCharging size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Under Maintenance</div>
            <div className="kpi-value" style={{ color: 'var(--pending)' }}>
              {vehicles.filter(v => v.status === 'In Maintenance').length}
            </div>
            <div className="kpi-subtext">Workshop service bays</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--pending-dim)', color: 'var(--pending)' }}>
            <Wrench size={22} />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'enroute', 'onsite', 'available', 'inmaintenance'].map(status => (
              <button
                key={status}
                className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(status)}
                style={{ textTransform: 'capitalize' }}
              >
                {status === 'all' ? 'All Vehicles' : status === 'enroute' ? 'En Route' : status === 'onsite' ? 'On Site' : status === 'inmaintenance' ? 'Maintenance' : status}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.86rem' }} 
              placeholder="Search plate number or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Vehicle Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {filtered.map(v => {
          const isEV = v.fuelType === 'EV Battery';
          return (
            <div key={v.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {v.plateNo}
                    </span>
                    <span className="badge badge-citizen" style={{ background: isEV ? 'var(--progress-dim)' : 'var(--surface-2)', color: isEV ? 'var(--progress)' : 'var(--text)' }}>
                      {v.fuelType}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--text-h)' }}>{v.model}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Type: {v.type} • Capacity: {v.capacity}</div>
                </div>

                <span className={`badge badge-${v.status.toLowerCase().replace(' ', '')}`}>
                  {v.status}
                </span>
              </div>

              {/* Fuel / Battery Gauge */}
              <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isEV ? <BatteryCharging size={14} color="var(--progress)" /> : <Fuel size={14} color="var(--pending)" />}
                    {isEV ? 'Battery State of Charge' : 'Fuel Level'}
                  </span>
                  <strong style={{ color: v.fuelLevel > 30 ? 'var(--accent)' : 'var(--hazard)' }}>{v.fuelLevel}%</strong>
                </div>
                <div style={{ height: '6px', background: 'var(--line)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${v.fuelLevel}%`, background: v.fuelLevel > 30 ? (isEV ? 'var(--progress)' : 'var(--accent)') : 'var(--hazard)' }} />
                </div>
              </div>

              {/* Telematics Info */}
              <div style={{ fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                <div><strong>Assigned Driver:</strong> {v.driver}</div>
                <div><strong>Operational Ward:</strong> {v.ward}</div>
                <div><strong>Current Task:</strong> {v.assignedTask}</div>
                <div><strong>GPS Telematics:</strong> <span style={{ color: 'var(--accent)' }}>{v.gpsStatus}</span></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-dim)', paddingTop: '10px', borderTop: '1px solid var(--line)' }}>
                <span>Odometer: {v.odometer}</span>
                <span>Last Serviced: {v.lastMaintenance}</span>
              </div>
            </div>
          );
        })}
      </div>

      <AddVehicleModal 
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </div>
  );
}
