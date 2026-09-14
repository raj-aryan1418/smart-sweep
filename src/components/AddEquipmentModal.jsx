import React, { useState } from 'react';
import { PackageCheck, X, Check } from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';
import { useToast } from '../context/ToastContext';

export default function AddEquipmentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Personal Protective Equipment',
    totalQty: 50,
    availableQty: 50,
    condition: 'Good',
    requiredFor: 'Daily Sanitation Shifts'
  });

  const { addEquipment } = useWorkforce();
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Please enter item name', 'error');
      return;
    }
    addEquipment(formData);
    addToast(`Added ${formData.name} to equipment inventory!`, 'success');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PackageCheck size={20} color="var(--accent)" />
            <h3 className="modal-title">Add Equipment / Safety Gear</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Item / Gear Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Industrial Puncture-Proof Gloves" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Personal Protective Equipment">Personal Protective Equipment</option>
                <option value="Safety Gear">Safety Gear</option>
                <option value="Hand Tools">Hand Tools & Brooms</option>
                <option value="Mechanical Equipment">Mechanical Equipment</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Quantity</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.totalQty}
                onChange={(e) => setFormData({...formData, totalQty: e.target.value, availableQty: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mandatory Usage / Purpose</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Bio-hazard quarantine & wet garbage sorting" 
              value={formData.requiredFor}
              onChange={(e) => setFormData({...formData, requiredFor: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              Add to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
