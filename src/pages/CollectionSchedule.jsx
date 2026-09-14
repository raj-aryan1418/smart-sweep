import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Bell, 
  Truck, 
  CheckCircle2, 
  Info,
  Phone
} from 'lucide-react';
import { wasteCategories, wardSchedules, municipalAlerts } from '../data/initialSchedules';
import { useToast } from '../context/ToastContext';

export default function CollectionSchedule() {
  const [selectedWard, setSelectedWard] = useState(wardSchedules[0].wardId);
  const { addToast } = useToast();

  const currentWardData = wardSchedules.find(w => w.wardId === selectedWard) || wardSchedules[0];

  const handleSetReminder = (wardName) => {
    addToast(`SMS & App notification reminder set for ${wardName}!`, 'success');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Ward Collection Schedule & Timetable</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem' }}>
            Check daily municipal garbage collection timings, segregation rules, and holiday advisories
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => handleSetReminder(currentWardData.wardName)}>
          <Bell size={14} /> Get Collection Reminders
        </button>
      </div>

      {/* Municipal Advisories & Holiday Notice Strip */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {municipalAlerts.map(alert => (
          <div 
            key={alert.id}
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: alert.urgent ? 'var(--hazard-dim)' : 'var(--surface-2)',
              border: alert.urgent ? '1px solid rgba(241, 89, 79, 0.4)' : '1px solid var(--line)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            <AlertCircle size={18} color={alert.urgent ? 'var(--hazard)' : 'var(--accent)'} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <strong style={{ color: alert.urgent ? 'var(--hazard)' : 'var(--text-h)', fontSize: '0.92rem' }}>{alert.title}</strong>
                <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{alert.date}</span>
              </div>
              <p style={{ color: 'var(--text)', fontSize: '0.86rem', lineHeight: 1.4 }}>{alert.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ward Selection Bar */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--accent)" />
            <span style={{ fontWeight: 600, color: 'var(--text-h)' }}>Select Your Ward:</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {wardSchedules.map(w => (
              <button
                key={w.wardId}
                className={`btn btn-sm ${selectedWard === w.wardId ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedWard(w.wardId)}
              >
                {w.wardName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Ward Timetable Card */}
      <div className="card">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
          <div>
            <span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>{currentWardData.wardId}</span>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-h)' }}>{currentWardData.wardName}</h2>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Ward Sanitation Officer: <strong>{currentWardData.supervisor}</strong> ({currentWardData.phone})
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Primary Dispatch Compactor</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-h)' }}>{currentWardData.primaryTruck}</span>
          </div>
        </div>

        {/* Timing Shift Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Clock size={16} color="var(--accent)" />
              <strong style={{ color: 'var(--text-h)' }}>Morning Doorstep Collection</strong>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
              {currentWardData.morningSlot}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              All residential areas & apartment complexes
            </div>
          </div>

          <div style={{ padding: '16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Clock size={16} color="var(--progress)" />
              <strong style={{ color: 'var(--text-h)' }}>Evening Commercial Sweep</strong>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--progress)' }}>
              {currentWardData.eveningSlot}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Market streets, restaurants & retail corridors
            </div>
          </div>
        </div>

        {/* Days of Week Table */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Weekly Segregated Waste Calendar</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px' }}>Day</th>
                <th style={{ padding: '10px' }}>Wet / Organic Waste</th>
                <th style={{ padding: '10px' }}>Dry / Recyclable</th>
                <th style={{ padding: '10px' }}>Hazardous / E-Waste</th>
              </tr>
            </thead>
            <tbody>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                const hasWet = currentWardData.collectionDays.wet.includes(day);
                const hasDry = currentWardData.collectionDays.dry.includes(day);
                const hasHaz = currentWardData.collectionDays.hazardous.includes(day);

                return (
                  <tr key={day} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--text-h)' }}>{day}</td>
                    <td style={{ padding: '12px 10px' }}>
                      {hasWet ? (
                        <span style={{ color: 'var(--resolved)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <CheckCircle2 size={14} /> Collected (Green Bin)
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      {hasDry ? (
                        <span style={{ color: 'var(--progress)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <CheckCircle2 size={14} /> Collected (Blue Bin)
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      {hasHaz ? (
                        <span style={{ color: 'var(--hazard)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <CheckCircle2 size={14} /> Special Quarantine (Red Bag)
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Waste Segregation Guide */}
      <div className="card">
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Mandatory Waste Segregation Guidelines</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {wasteCategories.map(cat => (
            <div key={cat.key} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--surface-2)', borderLeft: `4px solid ${cat.color}` }}>
              <div style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: '1rem', marginBottom: '4px' }}>
                {cat.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: cat.color, fontWeight: 600, marginBottom: '8px' }}>
                {cat.timing}
              </div>
              <p style={{ color: 'var(--text)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {cat.hint}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
