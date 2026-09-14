import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Radio, 
  ThumbsUp, 
  MessageSquare, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  Send, 
  Share2,
  Sparkles,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function PublicFeed() {
  const { complaints, applaudComplaint, addComment } = useComplaints();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [filter, setFilter] = useState('all'); // all, resolved, active
  const [commentInputs, setCommentInputs] = useState({});
  const [applaudedIds, setApplaudedIds] = useState(new Set());

  const filtered = complaints.filter(c => {
    if (filter === 'resolved') return c.status === 'Resolved';
    if (filter === 'active') return c.status !== 'Resolved' && c.status !== 'Cancelled';
    return c.status !== 'Cancelled';
  });

  const handleApplaud = (id) => {
    if (!applaudedIds.has(id)) {
      applaudComplaint(id);
      setApplaudedIds(new Set([...applaudedIds, id]));
      addToast('Applauded sanitation cleanup! 👏', 'success');
    }
  };

  const handlePostComment = (e, id) => {
    e.preventDefault();
    const text = commentInputs[id];
    if (!text || !text.trim()) return;

    addComment(id, user?.name || 'Citizen', text);
    setCommentInputs({ ...commentInputs, [id]: '' });
    addToast('Comment added!', 'success');
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={24} color="var(--accent)" />
            Public Sanitation Feed
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem' }}>
            Live community transparency stream showing municipal reporting, crew dispatches & verified cleanups
          </p>
        </div>

        <Link to="/report" className="btn btn-primary btn-sm">
          <PlusCircle size={15} /> File a Report
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="card" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All Live Stream ({complaints.filter(c => c.status !== 'Cancelled').length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'resolved' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('resolved')}
          >
            <CheckCircle2 size={14} /> Verified Cleanups ({complaints.filter(c => c.status === 'Resolved').length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('active')}
          >
            <Clock size={14} /> In Progress ({complaints.filter(c => c.status === 'In Progress' || c.status === 'Pending').length})
          </button>
        </div>
      </div>

      {/* Feed Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Radio size={36} color="var(--accent)" style={{ margin: '0 auto 12px' }} />
            <h3>No complaints in the stream yet</h3>
            <p style={{ color: 'var(--text-dim)', margin: '8px 0 20px', fontSize: '0.9rem' }}>
              The system is completely fresh and clean. File a spot report to start tracking neighborhood cleanliness.
            </p>
            <Link to="/report" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              <PlusCircle size={16} /> File First Waste Report
            </Link>
          </div>
        ) : (
          filtered.map(c => {
            const isResolved = c.status === 'Resolved';
            const hasApplauded = applaudedIds.has(c.id);

            return (
              <div key={c.id} className="feed-card">
                {/* Header */}
                <div className="feed-header">
                  <div className="feed-author">
                    <div className="feed-avatar">
                      {c.reportedBy ? c.reportedBy[0] : 'C'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.92rem' }}>
                        {c.reportedBy || 'Citizen'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} />
                        {c.ward || 'Bengaluru'} • {c.createdAt}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {c.hazard && c.hazard !== 'None' && (
                      <span className="badge badge-hazard">
                        <AlertTriangle size={11} /> {c.hazard}
                      </span>
                    )}
                    <span className={`badge badge-${c.status.toLowerCase().replace(' ', '')}`}>
                      {c.status}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text-h)' }}>
                  {c.location}
                </h3>
                <p style={{ color: 'var(--text)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '14px' }}>
                  {c.description}
                </p>

                {/* Photo Showcase */}
                {isResolved && c.afterPhoto ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--line)' }}>
                      <img src={c.photo || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80'} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontSize: '0.72rem' }}>
                        🔴 Before
                      </span>
                    </div>
                    <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--resolved)' }}>
                      <img src={c.afterPhoto} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', bottom: 8, left: 8, background: 'var(--resolved)', color: '#06170e', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontSize: '0.72rem' }}>
                        🟢 Cleaned Proof
                      </span>
                    </div>
                  </div>
                ) : c.photo ? (
                  <div className="feed-image-preview">
                    <img src={c.photo} alt="Report evidence" />
                  </div>
                ) : null}

                {/* Verified Badge / Waste Removed Note */}
                {isResolved && (
                  <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.84rem' }}>
                    <span style={{ color: 'var(--resolved)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      <CheckCircle2 size={16} /> Resolved by {c.assignedCrew || 'Sanitation Team'}
                    </span>
                    <span style={{ color: 'var(--text-dim)' }}>
                      Waste Cleared: <strong style={{ color: 'var(--text-h)' }}>{c.wasteRemoved || '240 kg'}</strong>
                    </span>
                  </div>
                )}

                {/* Citizen Rating Quote */}
                {c.feedback && (
                  <div style={{ padding: '10px 14px', background: 'rgba(240, 171, 61, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(240, 171, 61, 0.2)', marginBottom: '14px', fontSize: '0.84rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f0ab3d', fontWeight: 600, marginBottom: '2px' }}>
                      <Star size={14} fill="#f0ab3d" />
                      <span>Citizen Rating: {c.feedback.rating}/5</span>
                    </div>
                    <div style={{ color: 'var(--text-h)', fontStyle: 'italic' }}>
                      "{c.feedback.comment}"
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="feed-actions-bar">
                  <button 
                    className={`applaud-btn ${hasApplauded ? 'active' : ''}`}
                    onClick={() => handleApplaud(c.id)}
                    title="Applaud community cleanup"
                  >
                    <ThumbsUp size={15} />
                    <span>{hasApplauded ? 'Applauded!' : 'Applaud'} ({c.applauds || 0})</span>
                  </button>

                  <Link 
                    to={`/complaint/${c.id}`} 
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <MessageSquare size={14} />
                    <span>Discussion ({c.comments?.length || 0})</span>
                  </Link>

                  <Link 
                    to={`/complaint/${c.id}`} 
                    style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                  >
                    Case Timeline <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Inline Comment Box */}
                <form 
                  onSubmit={(e) => handlePostComment(e, c.id)}
                  style={{ display: 'flex', gap: '8px', marginTop: '14px' }}
                >
                  <input 
                    type="text"
                    className="form-input"
                    style={{ height: '34px', fontSize: '0.82rem' }}
                    placeholder="Leave a quick note on this cleanup..."
                    value={commentInputs[c.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [c.id]: e.target.value })}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                    <Send size={13} />
                  </button>
                </form>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
