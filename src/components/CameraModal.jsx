import React, { useState } from 'react';
import { Camera, Upload, X, Check, Image as ImageIcon } from 'lucide-react';

const SAMPLE_CLEANUP_PHOTOS = [
  {
    title: "Overflowing Bin (Dumped plastics & bags)",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Street Litter (Cardboard & unsegregated pile)",
    url: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Market Waste (Organic peels on curb)",
    url: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Park Debris (Fallen foliage & branches)",
    url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Sanitary Hazardous (Disinfectant required)",
    url: "https://images.unsplash.com/photo-1584467741263-d510f274a496?auto=format&fit=crop&w=600&q=80"
  }
];

export default function CameraModal({ isOpen, onClose, onSelectPhoto }) {
  const [customUrl, setCustomUrl] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(SAMPLE_CLEANUP_PHOTOS[0].url);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectPhoto(customUrl || selectedPhoto);
    onClose();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSelectedPhoto(uploadEvent.target.result);
        setCustomUrl('');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Camera size={20} color="var(--accent)" />
            <h3 className="modal-title">Attach Spot Photo</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Selected Image Preview */}
        <div style={{ marginBottom: '20px' }}>
          <div 
            style={{ 
              width: '100%', 
              height: '200px', 
              borderRadius: 'var(--radius-md)', 
              overflow: 'hidden', 
              background: 'var(--surface-2)',
              border: '2px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <img 
              src={customUrl || selectedPhoto} 
              alt="Selected Preview" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div 
              style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.75rem',
                backdropFilter: 'blur(4px)'
              }}
            >
              📷 Geotagged Visual Evidence
            </div>
          </div>
        </div>

        {/* File Upload Option */}
        <div style={{ marginBottom: '16px' }}>
          <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer' }}>
            <Upload size={16} />
            <span>Upload from device or camera</span>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
            />
          </label>
        </div>

        {/* Preset Sample Municipal Photos for Instant Testing */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>
            Or choose sample municipal hotspot:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {SAMPLE_CLEANUP_PHOTOS.map((p, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  setSelectedPhoto(p.url);
                  setCustomUrl('');
                }}
                style={{
                  height: '60px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: selectedPhoto === p.url && !customUrl ? '2px solid var(--accent)' : '1px solid var(--line)',
                  position: 'relative',
                  opacity: selectedPhoto === p.url && !customUrl ? 1 : 0.7
                }}
                title={p.title}
              >
                <img src={p.url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            <Check size={16} />
            Attach Photo
          </button>
        </div>
      </div>
    </div>
  );
}
