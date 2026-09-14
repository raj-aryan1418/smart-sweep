import React, { useState } from 'react';
import { 
  PackageCheck, 
  Calendar, 
  Truck, 
  User, 
  Check, 
  CheckCircle2, 
  Clock, 
  Search, 
  AlertCircle,
  Filter
} from 'lucide-react';
import { useBulkPickup } from '../context/BulkPickupContext';
import { useFleet } from '../context/FleetContext';
import { useWorkforce } from '../context/WorkforceContext';
import { useToast } from '../context/ToastContext';

export default function BulkPickupManage() {
  const { pickups, scheduleBulkPickup, markCollected } = useBulkPickup();
  const { vehicles } = useFleet();
  const { workers } = useWorkforce();
  const { addToast } = useToast();

  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [assignForm, setAssignForm] = useState({
    scheduledDate: new Date().toISOString().split('T')[0],
    assignedCrew: 'Suresh Patil',
    assignedVehicle: 'KA-01-EV-9012'
  });

  const filtered = pickups.filter(p => {
    const matchesFilter = activeFilter === 'all' || p.status.toLowerCase() === activeFilter;
    const matchesSearch = 
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.requestedBy.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenAssign = (pickup) => {
    setSelectedPickup(pickup);
    setAssignForm({
      scheduledDate: pickup.preferredDate || new Date().toISOString().split('T')[0],
      assignedCrew: workers[0]?.name || 'Suresh Patil',
      assignedVehicle: vehicles[0]?.plateNo || 'KA-01-EV-9012'
    });
  };

  const handleConfirmSchedule = (e) => {
    e.preventDefault();
    if (!selectedPickup) return;

    scheduleBulkPickup(
      selectedPickup.id,
      assignForm.scheduledDate,
      assignForm.assignedCrew,
      assignForm.assignedVehicle
    );

    addToast(`Bulk pickup ${selectedPickup.id} scheduled with ${assignForm.assignedCrew}!`, 'success');
    setSelectedPickup(null);
  };

  const handleMarkCollected = (id) => {
    markCollected(id);
    addToast(`Bulk pickup ${id} marked as Collected!`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Bulk Waste Collection Dispatches</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem' }}>
          Assign heavy vehicles, review payload capacities, and manage scheduled municipal pick dispatches
        </p>
      </div>

      {/* Stats Summary */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Total Requests</div>
            <div className="kpi-value">{pickups.length}</div>
            <div className="kpi-subtext">All time bookings</div>
          </div>
          <div className="kpi-icon-wrap">
            <PackageCheck size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Pending Dispatch</div>
            <div className="kpi-value" style={{ color: 'var(--pending)' }}>
              {pickups.filter(p => p.status === 'Requested').length}
            </div>
            <div className="kpi-subtext">Requires truck assignment</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--pending-dim)', color: 'var(--pending)' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Scheduled Out</div>
            <div className="kpi-value" style={{ color: 'var(--progress)' }}>
              {pickups.filter(p => p.status === 'Scheduled').length}
            </div>
            <div className="kpi-subtext">Assigned to drivers</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--progress-dim)', color: 'var(--progress)' }}>
            <Truck size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Completed Cleanups</div>
            <div className="kpi-value" style={{ color: 'var(--resolved)' }}>
              {pickups.filter(p => p.status === 'Collected').length}
            </div>
            <div className="kpi-subtext">Disposed & processed</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--resolved-dim)', color: 'var(--resolved)' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'requested', 'scheduled', 'collected'].map(filterKey => (
              <button
                key={filterKey}
                className={`btn btn-sm ${activeFilter === filterKey ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveFilter(filterKey)}
                style={{ textTransform: 'capitalize' }}
              >
                {filterKey} ({filterKey === 'all' ? pickups.length : pickups.filter(p => p.status.toLowerCase() === filterKey).length})
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px', height: '38px', fontSize: '0.88rem' }}
              placeholder="Search by ID, category, or citizen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Dispatches List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {filtered.map(p => (
          <div key={p.id} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)' }}>{p.id}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-h)' }}>{p.category}</span>
                  <span className="badge badge-neutral">Load: {p.loadSize}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-h)' }}>
                  <strong>Items:</strong> {p.items} ({p.quantity} items)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Requested by {p.requestedBy} • Contact: {p.contactPhone}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge badge-${p.status.toLowerCase()}`}>
                  {p.status}
                </span>
              </div>
            </div>

            {/* Address & Logistics Detail Grid */}
            <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.84rem', marginBottom: '16px' }}>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block' }}>Pickup Location</span>
                <strong style={{ color: 'var(--text-h)' }}>{p.address}</strong>
                <span style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.78rem' }}>{p.ward}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block' }}>Collection Schedule</span>
                <strong style={{ color: 'var(--accent)' }}>{p.scheduledDate || p.preferredDate}</strong>
                <span style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.78rem' }}>{p.timeSlot}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block' }}>Assigned Field Vehicle & Crew</span>
                <strong style={{ color: 'var(--text-h)' }}>{p.assignedCrew}</strong>
                <span style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.78rem' }}>Truck: {p.assignedVehicle}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '10px' }}>
              {p.status === 'Requested' && (
                <button className="btn btn-primary btn-sm" onClick={() => handleOpenAssign(p)}>
                  <Truck size={14} /> Assign Vehicle & Confirm Schedule
                </button>
              )}

              {p.status === 'Scheduled' && (
                <>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleOpenAssign(p)}>
                    Reassign Vehicle
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => handleMarkCollected(p.id)}>
                    <Check size={14} /> Mark as Collected
                  </button>
                </>
              )}

              {p.status === 'Collected' && (
                <span style={{ color: 'var(--resolved)', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} /> Dispatched & Hauled to Central Processing Facility
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Modal */}
      {selectedPickup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Assign Fleet & Schedule {selectedPickup.id}</h3>
              <button className="icon-btn" onClick={() => setSelectedPickup(null)}>✕</button>
            </div>

            <form onSubmit={handleConfirmSchedule}>
              <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)' }}>
                <div><strong>Category:</strong> {selectedPickup.category} (Load: {selectedPickup.loadSize})</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  {selectedPickup.items} at {selectedPickup.address}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirmed Collection Date</label>
                <input 
                  type="date"
                  className="form-input"
                  value={assignForm.scheduledDate}
                  onChange={(e) => setAssignForm({...assignForm, scheduledDate: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assign Crew Lead</label>
                <select
                  className="form-select"
                  value={assignForm.assignedCrew}
                  onChange={(e) => setAssignForm({...assignForm, assignedCrew: e.target.value})}
                >
                  {workers.map(w => (
                    <option key={w.id} value={w.name}>{w.name} ({w.role})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assign Heavy Vehicle / Tipper</label>
                <select
                  className="form-select"
                  value={assignForm.assignedVehicle}
                  onChange={(e) => setAssignForm({...assignForm, assignedVehicle: e.target.value})}
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.plateNo}>{v.plateNo} — {v.model} ({v.capacity})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedPickup(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
