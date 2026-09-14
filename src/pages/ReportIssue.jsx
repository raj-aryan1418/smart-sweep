import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  MapPin, 
  AlertTriangle, 
  Navigation, 
  Trash2, 
  Check, 
  Crosshair,
  Image as ImageIcon
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import CameraModal from '../components/CameraModal';
import MapView from '../components/MapView';

export default function ReportIssue() {
  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [category, setCategory] = useState('Overflowing Bin');
  const [hazard, setHazard] = useState('Foul Smell');
  const [location, setLocation] = useState('');
  const [ward, setWard] = useState('Indiranagar (Ward 12)');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [coords, setCoords] = useState({ lat: 12.9784, lng: 77.6408 });
  const [isLocating, setIsLocating] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Auto detect GPS
  const handleDetectGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCoords = {
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5))
          };
          setCoords(newCoords);
          if (!location) {
            setLocation(`GPS (${newCoords.lat}, ${newCoords.lng}), Near Road`);
          }
          setIsLocating(false);
          addToast('GPS location pinpointed successfully!', 'success');
        },
        (err) => {
          const simulated = { lat: 12.9716 + (Math.random() - 0.5) * 0.03, lng: 77.5946 + (Math.random() - 0.5) * 0.03 };
          setCoords({ lat: Number(simulated.lat.toFixed(5)), lng: Number(simulated.lng.toFixed(5)) });
          if (!location) {
            setLocation('Indiranagar 100ft Road, Near Metro Pillar');
          }
          setIsLocating(false);
          addToast('Auto-detected municipal coordinates!', 'info');
        },
        { timeout: 6000 }
      );
    } else {
      setIsLocating(false);
      addToast('Geolocation not supported by browser. Enter location manually.', 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) {
      addToast('Please enter the spot location or address', 'error');
      return;
    }

    const created = addComplaint({
      title: `${category} near ${location}`,
      location,
      category,
      hazard,
      ward,
      description: description || `Reported ${category} at ${location}`,
      photo: photo || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      coords,
      reportedBy: user?.name || 'Citizen',
      reporterEmail: user?.email || 'citizen@bbmp.org'
    });

    addToast(`Complaint #${String(created.id).padStart(4, '0')} filed successfully!`, 'success');
    navigate('/my-complaints');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', marginBottom: '4px' }}>{t('fileWasteReport')}</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem' }}>
          Submit public waste, overflowing bin, or illegal dumping hazards for rapid crew dispatch
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Waste Type Category */}
          <div className="form-group">
            <label className="form-label">Classification / Waste Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '8px' }}>
              {[
                { name: 'Overflowing Bin', icon: '🗑️' },
                { name: 'Illegal Dumping', icon: '⚠️' },
                { name: 'Street Litter', icon: '🍂' },
                { name: 'Hazardous / Bio', icon: '☣️' },
                { name: 'Dead Animal', icon: '🚨' },
                { name: 'Drain Blockage', icon: '🌊' }
              ].map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setCategory(c.name)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    background: category === c.name ? 'var(--accent-dim)' : 'var(--surface-2)',
                    border: category === c.name ? '2px solid var(--accent)' : '1px solid var(--line)',
                    color: category === c.name ? 'var(--accent)' : 'var(--text-h)',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{c.icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hazard Severity Level */}
          <div className="form-group">
            <label className="form-label">{t('hazard')}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: '6px' }}>
              {[
                { label: 'Normal / Low', val: 'None' },
                { label: 'Foul Smell', val: 'Foul Smell' },
                { label: 'Mosquitoes', val: 'Mosquito Breeding' },
                { label: 'Traffic Block', val: 'Traffic Obstruction' },
                { label: 'Bio Hazard', val: 'Risk to Children' }
              ].map(h => (
                <button
                  key={h.val}
                  type="button"
                  onClick={() => setHazard(h.val)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: hazard === h.val ? (h.val === 'None' ? 'var(--surface-hover)' : 'var(--hazard-dim)') : 'var(--surface-2)',
                    border: hazard === h.val ? (h.val === 'None' ? '1px solid var(--text)' : '1px solid var(--hazard)') : '1px solid var(--line)',
                    color: hazard === h.val ? (h.val === 'None' ? 'var(--text-h)' : 'var(--hazard)') : 'var(--text)',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  {h.val !== 'None' && '⚠️ '} {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location & GPS Section */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>{t('location')}</label>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleDetectGPS}
                disabled={isLocating}
              >
                <Navigation size={13} color="var(--accent)" />
                <span>{isLocating ? 'Detecting...' : t('detectGPS')}</span>
              </button>
            </div>

            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. 5th Cross, 100ft Road, Near Metro Station"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Ward Selection & Interactive Pin Map */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>Pinpoint On Ward Grid</label>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                Lat: {coords.lat}, Lng: {coords.lng}
              </span>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <MapView 
                selectable={true} 
                selectedCoords={coords} 
                onSelectCoords={(newCoords) => setCoords(newCoords)} 
                height="200px" 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('ward')}</label>
              <select 
                className="form-select"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
              >
                <option value="Indiranagar (Ward 12)">Indiranagar (Ward 12)</option>
                <option value="MG Road (Ward 04)">MG Road (Ward 04)</option>
                <option value="Koramangala (Ward 08)">Koramangala (Ward 08)</option>
                <option value="Jayanagar (Ward 15)">Jayanagar (Ward 15)</option>
              </select>
            </div>
          </div>

          {/* Photo Attachment Section */}
          <div className="form-group">
            <label className="form-label">{t('attachPhoto')}</label>
            {photo ? (
              <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--accent)' }}>
                <img src={photo} alt="Reported Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: '#fff' }}
                  onClick={() => setIsCameraOpen(true)}
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', padding: '18px 14px', borderStyle: 'dashed', borderColor: 'var(--line)', flexDirection: 'column', gap: '6px' }}
                onClick={() => setIsCameraOpen(true)}
              >
                <div className="brand-icon-wrap">
                  <Camera size={18} />
                </div>
                <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.88rem' }}>Tap to Snap or Select Spot Photo</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Supports live camera or municipal sample photos</div>
              </button>
            )}
          </div>

          {/* Description field */}
          <div className="form-group">
            <label className="form-label">Additional Landmark & Details</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Provide specific directions or landmarks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              style={{ flex: '1 1 auto' }}
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ flex: '2 1 auto' }}
            >
              <Check size={16} />
              {t('submitReport')}
            </button>
          </div>
        </form>
      </div>

      {/* Camera & Photo Modal */}
      <CameraModal 
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onSelectPhoto={(photoUrl) => setPhoto(photoUrl)}
      />
    </div>
  );
}
