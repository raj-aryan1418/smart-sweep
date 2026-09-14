import React, { useState } from 'react';
import { Users, X, Check } from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';
import { useToast } from '../context/ToastContext';

export default function AddWorkerModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Sanitation Specialist',
    shift: 'Morning (06:00 - 14:00)',
    ward: 'Indiranagar (Ward 12)',
    phone: '+91 98765 00000',
    assignedTask: 'Routine Street Sweeping'
  });

  const { addWorker } = useWorkforce();
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Please enter worker name', 'error');
      return;
    }
    addWorker(formData);
    addToast(`${formData.name} added to sanitation roster!`, 'success');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="var(--accent)" />
            <h3 className="modal-title">Enlist Sanitation Worker</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Ramesh Kumar" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Operational Role</label>
              <select 
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="Sanitation Specialist">Sanitation Specialist</option>
                <option value="Crew Lead & Heavy Sweeper">Crew Lead & Heavy Sweeper</option>
                <option value="Compactor Heavy Driver">Compactor Heavy Driver</option>
                <option value="Waste Segregation Officer">Waste Segregation Officer</option>
                <option value="Bio-Hazard Response Operator">Bio-Hazard Operator</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Shift Timing</label>
              <select 
                className="form-select"
                value={formData.shift}
                onChange={(e) => setFormData({...formData, shift: e.target.value})}
              >
                <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
                <option value="Night / Emergency">Night / Emergency</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Phone Contact</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="+91 98765 43210" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Ward</label>
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

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              Enlist Worker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
