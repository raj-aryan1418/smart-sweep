import React, { useState } from 'react';
import { 
  Users, 
  PackageCheck, 
  Plus, 
  ShieldCheck, 
  Clock, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  HardHat
} from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';
import { useToast } from '../context/ToastContext';
import AddWorkerModal from '../components/AddWorkerModal';
import AddEquipmentModal from '../components/AddEquipmentModal';

export default function WorkforceEquipment() {
  const { workers, equipment } = useWorkforce();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('roster'); // roster, equipment, ppeChecklist
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.role.toLowerCase().includes(search.toLowerCase()) ||
    w.ward.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEquipment = equipment.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Workforce & Safety Equipment</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem' }}>
            Sanitation crew duty rosters, PPE safety compliance, and municipal equipment inventory
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setIsAddEquipmentOpen(true)}>
            <Plus size={14} /> Add Equipment
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setIsAddWorkerOpen(true)}>
            <Plus size={14} /> Enlist Worker
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${activeTab === 'roster' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('roster')}
            >
              <Users size={15} /> Crew Roster ({workers.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'equipment' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('equipment')}
            >
              <PackageCheck size={15} /> Equipment Inventory ({equipment.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'ppeChecklist' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('ppeChecklist')}
            >
              <ShieldCheck size={15} /> Daily PPE Audit
            </button>
          </div>

          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.86rem' }} 
              placeholder="Search crew or tool..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tab Content 1: Crew Roster */}
      {activeTab === 'roster' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredWorkers.map(w => (
            <div key={w.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'var(--accent-dim)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}
                  >
                    {w.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-h)' }}>{w.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{w.role}</div>
                  </div>
                </div>

                <span className="badge badge-crew">
                  {w.status}
                </span>
              </div>

              <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                <div><strong>Shift:</strong> {w.shift}</div>
                <div><strong>Ward:</strong> {w.ward}</div>
                <div><strong>Contact:</strong> {w.phone}</div>
                <div><strong>Current Assignment:</strong> {w.assignedTask}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', paddingTop: '10px', borderTop: '1px solid var(--line)' }}>
                <span style={{ color: 'var(--text-dim)' }}>Tasks Cleared: <strong>{w.completedTasks}</strong></span>
                <span style={{ color: 'var(--resolved)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <ShieldCheck size={14} /> Safety Score: {w.safetyScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 2: Equipment Inventory */}
      {activeTab === 'equipment' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredEquipment.map(eq => (
            <div key={eq.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span className="badge badge-neutral" style={{ marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>{eq.id}</span>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--text-h)' }}>{eq.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{eq.category}</div>
                </div>

                <span className="badge badge-citizen">
                  {eq.condition}
                </span>
              </div>

              <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', marginBottom: '12px', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Stock Availability:</span>
                  <strong style={{ color: 'var(--accent)' }}>{eq.availableQty} / {eq.totalQty} Units</strong>
                </div>
                <div style={{ height: '6px', background: 'var(--line)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round((eq.availableQty / eq.totalQty) * 100)}%`, background: 'var(--accent)' }} />
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                <strong>Required for:</strong> {eq.requiredFor}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 3: Daily PPE Audit Checklist */}
      {activeTab === 'ppeChecklist' && (
        <div className="card">
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Daily Sanitation Crew PPE Compliance Protocol</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.86rem' }}>
              Mandatory safety gears required before sanitation workers initiate field collection shifts
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { gear: 'Heavy-Duty Puncture Proof Gloves', desc: 'Protects against sharp glass, needles, and corrosive bio-waste.', mandatory: true },
              { gear: 'High-Visibility Neon Safety Vest', desc: 'Mandatory reflective bands for road visibility in morning/night traffic.', mandatory: true },
              { gear: 'Steel-Toe Non-Slip Safety Boots', desc: 'Protects feet from heavy loads and wet pavement slips.', mandatory: true },
              { gear: 'N95 / Carbon Odor Mask', desc: 'Prevents inhalation of toxic landfill gases and airborne allergens.', mandatory: true },
              { gear: 'Eye Protection Goggles (For Hydraulic Operations)', desc: 'Required when operating high-pressure pavement cleaners or compactors.', mandatory: false }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={20} color="var(--accent)" />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.92rem' }}>{item.gear}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{item.desc}</div>
                  </div>
                </div>

                <span className={`badge ${item.mandatory ? 'badge-hazard' : 'badge-neutral'}`}>
                  {item.mandatory ? 'Mandatory' : 'Optional'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Worker & Equipment Modals */}
      <AddWorkerModal 
        isOpen={isAddWorkerOpen}
        onClose={() => setIsAddWorkerOpen(false)}
      />

      <AddEquipmentModal 
        isOpen={isAddEquipmentOpen}
        onClose={() => setIsAddEquipmentOpen(false)}
      />
    </div>
  );
}
