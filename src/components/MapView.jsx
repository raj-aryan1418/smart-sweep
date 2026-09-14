import React, { useState } from 'react';
import { MapPin, Navigation, AlertTriangle, CheckCircle2, Clock, Crosshair, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Center reference: Bengaluru Urban coordinates (~12.91 to 12.98 Lat, 77.58 to 77.65 Lng)
const MAP_BOUNDS = {
  minLat: 12.9100,
  maxLat: 12.9850,
  minLng: 77.5750,
  maxLng: 77.6500
};

export default function MapView({ 
  complaints = [], 
  selectable = false, 
  selectedCoords = null, 
  onSelectCoords = null, 
  height = '420px',
  activeComplaintId = null
}) {
  const [activeMarker, setActiveMarker] = useState(null);
  const navigate = useNavigate();

  // Convert lat/lng to SVG percentage (x, y)
  const coordsToSvg = (lat, lng) => {
    const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
    // Invert Y because SVG coordinate 0 is top
    const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    };
  };

  // Convert SVG click back to lat/lng
  const handleMapClick = (e) => {
    if (!selectable || !onSelectCoords) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickXPercent = (e.clientX - rect.left) / rect.width;
    const clickYPercent = (e.clientY - rect.top) / rect.height;

    const lng = MAP_BOUNDS.minLng + clickXPercent * (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
    const lat = MAP_BOUNDS.maxLat - clickYPercent * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);

    onSelectCoords({ lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) });
  };

  const getStatusColor = (status) => {
    if (status === 'Resolved') return 'var(--resolved)';
    if (status === 'In Progress') return 'var(--progress)';
    if (status === 'Pending') return 'var(--pending)';
    return 'var(--text-dim)';
  };

  return (
    <div 
      style={{ 
        position: 'relative', 
        height, 
        width: '100%', 
        background: 'var(--surface-2)', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid var(--line)', 
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
      }}
    >
      {/* Interactive SVG Canvas */}
      <svg 
        viewBox="0 0 1000 600" 
        style={{ width: '100%', height: '100%', cursor: selectable ? 'crosshair' : 'default', display: 'block' }}
        onClick={handleMapClick}
      >
        <defs>
          {/* Subtle Map Grid Pattern */}
          <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--line)" strokeWidth="0.8" opacity="0.6" />
          </pattern>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Background Grid */}
        <rect width="1000" height="600" fill="url(#mapGrid)" />
        <rect width="1000" height="600" fill="url(#mapGlow)" />

        {/* Stylized Ward Boundaries & Arterial Roads */}
        <g stroke="var(--line)" strokeWidth="1.5" fill="none" opacity="0.8">
          {/* Outer Ring Road */}
          <path d="M 120 80 Q 500 40 880 120 T 820 520 Q 500 560 140 480 Z" strokeDasharray="6,4" />
          
          {/* Major Road Networks (MG Road, 100ft Rd, Hosur Rd) */}
          <path d="M 100 280 C 350 290, 650 310, 900 270" stroke="var(--line)" strokeWidth="3" opacity="0.9" />
          <path d="M 480 80 C 490 300, 520 450, 540 560" stroke="var(--line)" strokeWidth="3" opacity="0.9" />
          <path d="M 280 140 C 420 280, 680 400, 840 480" stroke="var(--line)" strokeWidth="2.5" opacity="0.7" />
          <path d="M 720 100 C 650 260, 400 420, 220 520" stroke="var(--line)" strokeWidth="2" opacity="0.7" />
        </g>

        {/* Ward Labels */}
        <g fill="var(--text-dim)" fontSize="13" fontFamily="var(--font-mono)" letterSpacing="1.5" fontWeight="600" opacity="0.6">
          <text x="240" y="180">WARD 04 (MG ROAD)</text>
          <text x="680" y="160">WARD 12 (INDIRANAGAR)</text>
          <text x="620" y="440">WARD 08 (KORAMANGALA)</text>
          <text x="200" y="460">WARD 15 (JAYANAGAR)</text>
        </g>

        {/* Landmarks */}
        <g fill="var(--text-dim)" fontSize="11" opacity="0.5">
          <circle cx="340" cy="280" r="4" fill="var(--accent)" opacity="0.5" />
          <text x="350" y="284">Metro Station</text>

          <circle cx="710" cy="220" r="4" fill="var(--progress)" opacity="0.5" />
          <text x="720" y="224">Public Park</text>

          <circle cx="580" cy="380" r="4" fill="var(--pending)" opacity="0.5" />
          <text x="590" y="384">Transfer Station</text>
        </g>
      </svg>

      {/* Render Markers via HTML Positioning over SVG */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {complaints.map(c => {
          if (!c.coords || !c.coords.lat || !c.coords.lng) return null;
          const { x, y } = coordsToSvg(c.coords.lat, c.coords.lng);
          const isSelected = activeMarker?.id === c.id || activeComplaintId === c.id;
          const statusColor = getStatusColor(c.status);

          return (
            <div
              key={c.id}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'auto',
                cursor: 'pointer',
                zIndex: isSelected ? 30 : 10,
                transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveMarker(c);
              }}
            >
              {/* Pin Icon / Marker Glow */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isSelected ? '34px' : '26px',
                  height: isSelected ? '34px' : '26px',
                  borderRadius: '50%',
                  background: statusColor,
                  color: '#06170e',
                  boxShadow: `0 0 16px ${statusColor}`,
                  border: '2px solid var(--surface)',
                  fontWeight: 700,
                  fontSize: isSelected ? '12px' : '10px'
                }}
              >
                {c.hazard && c.hazard !== 'None' ? '!' : c.id}
              </div>
            </div>
          );
        })}

        {/* Selected Location Marker (for reporting issue mode) */}
        {selectedCoords && (
          <div
            style={{
              position: 'absolute',
              left: `${coordsToSvg(selectedCoords.lat, selectedCoords.lng).x}%`,
              top: `${coordsToSvg(selectedCoords.lat, selectedCoords.lng).y}%`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'none',
              zIndex: 35
            }}
          >
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--accent)',
                color: 'var(--accent-ink)',
                boxShadow: '0 0 20px rgba(47, 208, 119, 0.8)',
                border: '3px solid #fff',
                animation: 'bounce 1s infinite alternate'
              }}
            >
              <Crosshair size={20} strokeWidth={2.5} />
            </div>
          </div>
        )}
      </div>

      {/* Map Toolbar / Controls Overlay */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 14, 
          left: 14, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'var(--surface)', 
          padding: '6px 12px', 
          borderRadius: 'var(--radius-pill)', 
          border: '1px solid var(--line)',
          fontSize: '0.8rem',
          color: 'var(--text-h)',
          fontWeight: 600,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <Navigation size={14} color="var(--accent)" />
        <span>Bengaluru Municipal Grid</span>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>• {complaints.length} Hotspots</span>
      </div>

      {selectable && (
        <div 
          style={{ 
            position: 'absolute', 
            bottom: 14, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: 'var(--surface)', 
            padding: '6px 16px', 
            borderRadius: 'var(--radius-pill)', 
            border: '1px solid var(--accent)',
            fontSize: '0.8rem',
            color: 'var(--accent)',
            fontWeight: 600,
            boxShadow: 'var(--shadow)'
          }}
        >
          📍 Click anywhere on the map to drop pin
        </div>
      )}

      {/* Active Marker Popover Card */}
      {activeMarker && (
        <div 
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            width: '290px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 40,
            animation: 'modalIn 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className={`badge badge-${activeMarker.status.toLowerCase().replace(' ', '')}`}>
              {activeMarker.status}
            </span>
            <button 
              onClick={() => setActiveMarker(null)}
              style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}
            >
              ✕
            </button>
          </div>

          <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.92rem', marginBottom: '4px' }}>
            {activeMarker.location}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '10px', lineHeight: 1.4 }}>
            {activeMarker.description.length > 70 ? activeMarker.description.substring(0, 70) + '...' : activeMarker.description}
          </div>

          {activeMarker.hazard && activeMarker.hazard !== 'None' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--hazard)', marginBottom: '12px' }}>
              <AlertTriangle size={13} />
              <span>Hazard: {activeMarker.hazard}</span>
            </div>
          )}

          <button 
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
            onClick={() => navigate(`/complaint/${activeMarker.id}`)}
          >
            View Full Case #${String(activeMarker.id).padStart(4, '0')}
          </button>
        </div>
      )}
    </div>
  );
}
