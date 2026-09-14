import React, { useState } from 'react';
import { 
  PackageCheck, 
  Calendar, 
  Clock, 
  Phone, 
  MapPin, 
  Check, 
  Truck, 
  AlertCircle, 
  XCircle,
  Armchair,
  Tv,
  Hammer,
  TreePine
} from 'lucide-react';
import { useBulkPickup } from '../context/BulkPickupContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export default function BulkPickup() {
  const { pickups, requestBulkPickup, cancelPickup } = useBulkPickup();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    category: 'Furniture',
    items: '',
    loadSize: 'Medium',
    quantity: 2,
    address: '',
    ward: 'Indiranagar (Ward 12)',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: 'Morning (08:00 - 11:00)',
    contactPhone: '+91 90000 11111',
    notes: ''
  });

  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.items.trim() || !formData.address.trim()) {
      addToast('Please fill in items description and address', 'error');
      return;
    }

    const created = requestBulkPickup({
      ...formData,
      requestedBy: user?.name || 'Citizen User',
      reporterEmail: user?.email || 'citizen@bbmp.org'
    });

    addToast(`Bulk pickup request ${created.id} submitted for dispatch review!`, 'success');
    setShowHistory(true);
  };

  const handleCancel = (id) => {
    if (window.confirm(`Cancel bulk pickup request ${id}?`)) {
      cancelPickup(id);
      addToast(`Bulk pickup ${id} cancelled`, 'info');
    }
  };

  const userPickups = pickups.filter(p => !user || p.requestedBy === user.name || user.role === 'admin');

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', overflowX: 'hidden' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', marginBottom: '4px' }}>{t('bookBulkPickup')}</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem' }}>
            Book municipal heavy vehicle collection for discarded furniture, appliances, and renovation debris
          </p>
        </div>

        <button 
          className={`btn btn-sm ${showHistory ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowHistory(!showHistory)}
          style={{ flexShrink: 0 }}
        >
          <PackageCheck size={15} />
          {showHistory ? 'Book New Request' : `My Requests (${userPickups.length})`}
        </button>
      </div>

      {showHistory ? (
        /* Citizen Requests History View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '1.15rem' }}>Your Scheduled & Past Bulk Requests</h2>
          {userPickups.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '30px 16px' }}>
              <PackageCheck size={32} color="var(--accent)" style={{ margin: '0 auto 10px' }} />
              <h3>No bulk pickup requests yet</h3>
              <p style={{ color: 'var(--text-dim)', margin: '6px 0 16px', fontSize: '0.88rem' }}>
                Need to dispose heavy sofas, old electronics, or rubble? Book a slot today.
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => setShowHistory(false)}>
                Book Now
              </button>
            </div>
          ) : (
            userPickups.map(p => (
              <div key={p.id} className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                      <span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)' }}>{p.id}</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: '0.98rem' }}>{p.category}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>• Load: {p.loadSize}</span>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text)' }}>
                      <strong>Items:</strong> {p.items} ({p.quantity} units)
                    </div>
                  </div>

                  <span className={`badge badge-${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </div>

                <div style={{ padding: '10px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '10px', fontSize: '0.8rem', marginBottom: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block' }}>Address / Ward</span>
                    <strong style={{ color: 'var(--text-h)' }}>{p.address} ({p.ward})</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block' }}>Scheduled Date & Slot</span>
                    <strong style={{ color: 'var(--accent)' }}>{p.scheduledDate || p.preferredDate} • {p.timeSlot}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block' }}>Assigned Crew & Truck</span>
                    <strong style={{ color: 'var(--text-h)' }}>{p.assignedCrew} ({p.assignedVehicle})</strong>
                  </div>
                </div>

                {p.notes && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
                    <strong>Note:</strong> {p.notes}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  {p.status === 'Requested' && (
                    <button className="btn btn-secondary btn-sm" style={{ color: 'var(--hazard)' }} onClick={() => handleCancel(p.id)}>
                      <XCircle size={13} /> Cancel Request
                    </button>
                  )}
                  {p.status === 'Scheduled' && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--progress)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Truck size={14} /> Heavy truck dispatch confirmed
                    </span>
                  )}
                  {p.status === 'Collected' && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--resolved)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> Successfully Collected
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Booking Form */
        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Category Selector */}
            <div className="form-group">
              <label className="form-label">Bulk Waste Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '8px' }}>
                {[
                  { name: 'Furniture', desc: 'Sofas, tables, wooden beds', icon: '🛋️' },
                  { name: 'E-Waste & Electronics', desc: 'Fridges, TVs, monitors', icon: '📺' },
                  { name: 'Construction Debris', desc: 'Renovation rubble, tiles', icon: '🧱' },
                  { name: 'Garden / Green Waste', desc: 'Pruned trees, branches', icon: '🌲' }
                ].map(cat => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setFormData({...formData, category: cat.name})}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: formData.category === cat.name ? 'var(--accent-dim)' : 'var(--surface-2)',
                      border: formData.category === cat.name ? '2px solid var(--accent)' : '1px solid var(--line)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{cat.icon}</div>
                    <div style={{ fontWeight: 600, color: formData.category === cat.name ? 'var(--accent)' : 'var(--text-h)', fontSize: '0.86rem' }}>
                      {cat.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {cat.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Items Description & Quantity */}
            <div className="form-group">
              <label className="form-label">Detailed Items List</label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. 2-seater wooden sofa, 1 broken dining chair"
                value={formData.items}
                onChange={(e) => setFormData({...formData, items: e.target.value})}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Estimated Load Size</label>
                <select 
                  className="form-select"
                  value={formData.loadSize}
                  onChange={(e) => setFormData({...formData, loadSize: e.target.value})}
                >
                  <option value="Small">Small (Fits in auto tipper)</option>
                  <option value="Medium">Medium (Half truck payload)</option>
                  <option value="Large">Large (Full mini-tipper payload)</option>
                  <option value="Extra Large">Extra Large (Heavy compactor truck)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Total Item Count</label>
                <input 
                  type="number"
                  min="1"
                  max="100"
                  className="form-input"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Date & Time Slot */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Preferred Pickup Date</label>
                <input 
                  type="date"
                  className="form-input"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Time Window</label>
                <select 
                  className="form-select"
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                >
                  <option value="Morning (08:00 - 11:00)">Morning (08:00 - 11:00)</option>
                  <option value="Midday (11:00 - 14:00)">Midday (11:00 - 14:00)</option>
                  <option value="Afternoon (14:00 - 17:00)">Afternoon (14:00 - 17:00)</option>
                  <option value="Evening (17:00 - 20:00)">Evening (17:00 - 20:00)</option>
                </select>
              </div>
            </div>

            {/* Address & Ward */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Doorstep Pickup Address</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="Apartment name, street, landmark"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('ward')}</label>
                <select 
                  className="form-select"
                  value={formData.ward}
                  onChange={(e) => setFormData({...formData, ward: e.target.value})}
                >
                  <option value="Indiranagar (Ward 12)">Indiranagar (Ward 12)</option>
                  <option value="MG Road (Ward 04)">MG Road (Ward 04)</option>
                  <option value="Koramangala (Ward 08)">Koramangala (Ward 08)</option>
                  <option value="Jayanagar (Ward 15)">Jayanagar (Ward 15)</option>
                </select>
              </div>
            </div>

            {/* Contact Phone & Lifting Instructions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Citizen Phone for Coordination</label>
                <input 
                  type="tel"
                  className="form-input"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lifting / Gate Access Notes</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ground floor near gate"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', maxWidth: '300px' }}>
                <Check size={16} />
                Confirm Bulk Pickup Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
