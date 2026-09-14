import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  PlusCircle, 
  ArrowRight, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MapPin,
  Trash2
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function MyComplaints() {
  const { complaints, cancelComplaint } = useComplaints();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter complaints
  const userComplaints = complaints.filter(c => {
    // Show user's complaints or all demo citizen complaints
    const matchesUser = !user || c.reportedBy === user.name || user.role === 'admin';
    return matchesUser;
  });

  const filtered = userComplaints.filter(c => {
    const matchesTab = activeTab === 'all' || c.status.toLowerCase().replace(' ', '') === activeTab;
    const matchesSearch = 
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toString().includes(searchQuery) ||
      (c.hazard && c.hazard.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleCancel = (e, id) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to cancel complaint #${String(id).padStart(4, '0')}?`)) {
      cancelComplaint(id);
      addToast(`Complaint #${String(id).padStart(4, '0')} cancelled`, 'info');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>My Municipal Complaints</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem' }}>
            Track progress, field crew dispatches, and verification proofs on your reports
          </p>
        </div>

        <Link to="/report" className="btn btn-primary">
          <PlusCircle size={16} />
          File New Report
        </Link>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[
              { key: 'all', label: 'All Cases', count: userComplaints.length },
              { key: 'pending', label: 'Pending', count: userComplaints.filter(c => c.status === 'Pending').length },
              { key: 'inprogress', label: 'In Progress', count: userComplaints.filter(c => c.status === 'In Progress').length },
              { key: 'resolved', label: 'Resolved', count: userComplaints.filter(c => c.status === 'Resolved').length },
              { key: 'cancelled', label: 'Cancelled', count: userComplaints.filter(c => c.status === 'Cancelled').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`btn btn-sm ${activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}`}
              >
                <span>{tab.label}</span>
                <span 
                  style={{ 
                    padding: '1px 6px', 
                    borderRadius: 'var(--radius-pill)', 
                    background: activeTab === tab.key ? 'rgba(0,0,0,0.2)' : 'var(--surface-hover)', 
                    fontSize: '0.74rem' 
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px', flex: 1, maxWidth: '360px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px', paddingRight: '12px', height: '38px', fontSize: '0.88rem' }}
              placeholder="Search by ID, location, or hazard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Complaints List Grid */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div className="brand-icon-wrap" style={{ margin: '0 auto 16px', width: '48px', height: '48px' }}>
            <FileText size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No complaints found</h3>
          <p style={{ color: 'var(--text-dim)', maxWidth: '400px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
            {searchQuery ? `No reports matched your search "${searchQuery}".` : 'You have not submitted any complaints under this filter category.'}
          </p>
          <Link to="/report" className="btn btn-primary">
            <PlusCircle size={16} />
            Submit Your First Report
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {filtered.map(c => (
            <div 
              key={c.id} 
              className="card"
              style={{ padding: '20px', cursor: 'pointer' }}
              onClick={() => navigate(`/complaint/${c.id}`)}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--surface-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    #{String(c.id).padStart(4, '0')}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-h)', marginBottom: '2px' }}>
                      {c.location}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{c.ward || 'Bengaluru'}</span>
                      <span>•</span>
                      <span>Filed on {c.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {c.hazard && c.hazard !== 'None' && (
                    <span className="badge badge-hazard">
                      <AlertTriangle size={12} /> {c.hazard}
                    </span>
                  )}
                  <span className={`badge badge-${c.status.toLowerCase().replace(' ', '')}`}>
                    {c.status}
                  </span>
                </div>
              </div>

              <p style={{ color: 'var(--text)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
                {c.description}
              </p>

              {/* Card Meta & Bottom Actions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '14px', borderTop: '1px solid var(--line)' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                  {c.status === 'Resolved' && (
                    <span style={{ color: 'var(--resolved)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} /> Resolved on {c.resolvedAt} • Removed {c.wasteRemoved || '250 kg'}
                    </span>
                  )}
                  {c.status === 'In Progress' && (
                    <span style={{ color: 'var(--progress)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} /> Crew on duty: {c.assignedCrew || 'Sanitation Team 4'}
                    </span>
                  )}
                  {c.status === 'Pending' && (
                    <span style={{ color: 'var(--pending)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} /> In dispatch queue for supervisor assignment
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {c.status === 'Pending' && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--hazard)' }}
                      onClick={(e) => handleCancel(e, c.id)}
                    >
                      <XCircle size={14} />
                      Cancel Report
                    </button>
                  )}

                  <span className="btn btn-secondary btn-sm">
                    View Case Timeline
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
