import React, { useState } from 'react';
import { CheckCircle2, X, Camera, Scale, FileText, Check } from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useToast } from '../context/ToastContext';

const DEFAULT_AFTER_PHOTOS = [
  {
    label: "Clean Pavement & Sanitized Curb",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
  },
  {
    label: "Cleared Drain & Spotless Bin Area",
    url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80"
  },
  {
    label: "Sorted & Washed Concrete Floor",
    url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80"
  }
];

export default function CompleteTaskModal({ isOpen, onClose, complaint }) {
  const [wasteWeight, setWasteWeight] = useState('240');
  const [selectedPhoto, setSelectedPhoto] = useState(DEFAULT_AFTER_PHOTOS[0].url);
  const [notes, setNotes] = useState('Area fully cleared, swept, and treated with disinfectant powder.');

  const { resolveComplaint } = useComplaints();
  const { addToast } = useToast();

  if (!isOpen || !complaint) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    resolveComplaint(complaint.id, selectedPhoto, `${wasteWeight} kg`, notes);
    addToast(`Case #${String(complaint.id).padStart(4, '0')} marked as Resolved!`, 'success');
    onClose();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSelectedPhoto(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} color="var(--resolved)" />
            <h3 className="modal-title">Complete Sanitation Cleanup</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-h)' }}>
              Case #{String(complaint.id).padStart(4, '0')}: {complaint.location}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Hazard level: <span style={{ color: 'var(--hazard)', fontWeight: 600 }}>{complaint.hazard || 'None'}</span>
            </div>
          </div>

          {/* After Cleanup Proof Photo */}
          <div className="form-group">
            <label className="form-label">Attach After-Cleanup Photo Proof</label>
            <div 
              style={{ 
                height: '160px', 
                borderRadius: 'var(--radius-md)', 
                overflow: 'hidden', 
                background: 'var(--surface-2)',
                border: '2px dashed var(--accent)',
                marginBottom: '10px'
              }}
            >
              <img src={selectedPhoto} alt="After Cleanup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {DEFAULT_AFTER_PHOTOS.map((p, i) => (
                <div 
                  key={i}
                  onClick={() => setSelectedPhoto(p.url)}
                  style={{
                    flex: 1,
                    height: '50px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedPhoto === p.url ? '2px solid var(--resolved)' : '1px solid var(--line)'
                  }}
                  title={p.label}
                >
                  <img src={p.url} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>

            <label className="btn btn-secondary btn-sm" style={{ width: '100%', cursor: 'pointer' }}>
              <Camera size={14} />
              <span>Capture Live Proof / Upload Photo</span>
              <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileUpload} />
            </label>
          </div>

          {/* Waste Removed Weight */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Scale size={16} /> Total Waste Removed (kg)
            </label>
            <input 
              type="number"
              className="form-input"
              value={wasteWeight}
              onChange={(e) => setWasteWeight(e.target.value)}
              placeholder="e.g. 240"
              required
            />
          </div>

          {/* Crew Notes */}
          <div className="form-group">
            <label className="form-label">Crew Cleanup Notes</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              Mark Resolved & Submit Proof
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
