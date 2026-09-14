import React, { useState } from 'react';
import { Truck, X, Check } from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import { useToast } from '../context/ToastContext';

export default function AddVehicleModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    plateNo: '',
    model: 'Heavy Hydraulic Compactor Truck',
    type: 'Compactor',
    capacity: '8.5 Tons',
    fuelLevel: 100,
    fuelType: 'EV Battery',
    ward: 'Indiranagar (Ward 12)',
    driver: 'Unassigned',
    assignedTask: 'Depot Standby'
  });

  const { addVehicle } = useFleet();
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.plateNo) {
      formData.plateNo = `KA-01-EV-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    addVehicle(formData);
    addToast(`Vehicle ${formData.plateNo} registered to fleet!`, 'success');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Truck size={20} color="var(--accent)" />
            <h3 className="modal-title">Register Municipal Vehicle</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Registration / Plate Number</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. KA-01-EV-9821" 
              value={formData.plateNo}
              onChange={(e) => setFormData({...formData, plateNo: e.target.value})}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select 
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Compactor">Hydraulic Compactor</option>
                <option value="Mini Tipper">Electric Mini Tipper</option>
                <option value="Road Sweeper">Mechanical Sweeper</option>
                <option value="Quarantine Van">Bio-Hazard Van</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fuel / Powertrain</label>
              <select 
                className="form-select"
                value={formData.fuelType}
                onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
              >
                <option value="EV Battery">Zero-Emission EV</option>
                <option value="CNG">Green CNG</option>
                <option value="Diesel">Ultra-Low Diesel</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Payload Capacity</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. 5.0 Tons" 
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
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
              Add to Fleet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
