import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowRight, UserCheck, Truck, Shield, User } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, setUser } = useAuth();
  const location = useLocation();

  // If not logged in in this tab (e.g. copied link opened in a new tab)
  if (!user) {
    return <Navigate to={`/login?portal=${allowedRoles ? allowedRoles[0] : 'citizen'}&redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If user role is not explicitly allowed for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const targetRole = allowedRoles[0]; // e.g. 'crew' or 'admin'

    const handleSwitchToRole = () => {
      // Auto-switch user session to the required role in this tab
      const updatedUser = {
        ...user,
        role: targetRole,
        crewRole: targetRole === 'crew' ? 'Crew Lead & Sweeper' : undefined,
        shift: targetRole === 'crew' ? 'Morning (06:00 - 14:00)' : undefined,
        vehicle: targetRole === 'crew' ? 'KA-01-EA-4821 (Hydraulic Compactor)' : undefined,
        designation: targetRole === 'admin' ? 'Chief Sanitation Inspector' : undefined,
        accessLevel: targetRole === 'admin' ? 'Executive Level' : undefined
      };
      setUser(updatedUser);
      sessionStorage.setItem('smartsweep-session-user', JSON.stringify(updatedUser));
    };

    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div 
            className="brand-icon-wrap" 
            style={{ 
              width: '56px', 
              height: '56px', 
              margin: '0 auto 16px', 
              borderRadius: '50%',
              background: targetRole === 'crew' ? 'var(--progress-dim)' : 'var(--pending-dim)',
              color: targetRole === 'crew' ? 'var(--progress)' : 'var(--pending)'
            }}
          >
            {targetRole === 'crew' ? <Truck size={28} /> : <Shield size={28} />}
          </div>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--text-h)' }}>
            {targetRole === 'crew' ? 'Sanitation Crew Access Required' : 'Admin Authorization Required'}
          </h2>

          <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.5 }}>
            You are currently logged in as a <strong>{user.role.toUpperCase()}</strong> ({user.name}). This section requires <strong>{targetRole.toUpperCase()}</strong> access.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '340px', margin: '0 auto' }}>
            <button 
              className="btn btn-primary"
              style={{
                background: targetRole === 'crew' ? 'var(--progress)' : 'var(--pending)',
                color: targetRole === 'admin' ? '#06170e' : '#fff'
              }}
              onClick={handleSwitchToRole}
            >
              <UserCheck size={16} />
              <span>Switch to {targetRole.toUpperCase()} View & Open</span>
            </button>

            <Link to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'crew' ? '/crew/dashboard' : '/citizen/dashboard'} className="btn btn-secondary">
              Back to My {user.role.toUpperCase()} Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
