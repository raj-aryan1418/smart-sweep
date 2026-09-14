import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  Truck, 
  Star, 
  MessageSquare, 
  Send, 
  Camera, 
  Share2, 
  Scale,
  ShieldCheck
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import FeedbackModal from '../components/FeedbackModal';
import MapView from '../components/MapView';

export default function ComplaintDetail() {
  const { id } = useParams();
  const { complaints, addComment } = useComplaints();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  const complaintId = Number(id);
  const complaint = complaints.find(c => c.id === complaintId);

  if (!complaint) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '600px', margin: '40px auto' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Complaint Not Found</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '20px' }}>
          The case reference #{id} does not exist or has been archived.
        </p>
        <Link to="/my-complaints" className="btn btn-primary">
          Return to Complaints
        </Link>
      </div>
    );
  }

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(complaint.id, user?.name || 'Citizen', commentText);
    setCommentText('');
    addToast('Comment added to case discussion', 'success');
  };

  // Timeline Step Calculations
  const isResolved = complaint.status === 'Resolved';
  const isInProgress = complaint.status === 'In Progress' || isResolved;
  const isAssigned = complaint.assignedCrew && complaint.assignedCrew !== 'Unassigned';

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`badge badge-${complaint.status.toLowerCase().replace(' ', '')}`}>
            {complaint.status}
          </span>
          <span className="badge badge-neutral">
            Case #{String(complaint.id).padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Main Header Info Card */}
      <div className="card">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {complaint.category || 'Municipal Sanitation Report'}
            </div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--text-h)', marginBottom: '8px' }}>
              {complaint.location}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', fontSize: '0.86rem', color: 'var(--text-dim)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="var(--accent)" />
                {complaint.ward || 'Bengaluru Municipal Grid'}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                Reported {complaint.createdAt} by {complaint.reportedBy}
              </span>
            </div>
          </div>

          {complaint.hazard && complaint.hazard !== 'None' && (
            <div className="badge badge-hazard" style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '0.84rem' }}>
              <AlertTriangle size={15} /> Hazard: {complaint.hazard}
            </div>
          )}
        </div>

        <p style={{ color: 'var(--text-h)', fontSize: '0.96rem', lineHeight: 1.6, background: 'var(--surface-2)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
          {complaint.description || 'No detailed notes provided.'}
        </p>
      </div>

      {/* Two Column Layout: Timeline & Photo Proof */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Progress Timeline Stepper */}
          <div className="card">
            <h2 style={{ fontSize: '1.2rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--accent)" />
              Resolution Lifecycle
            </h2>

            <div className="timeline">
              {/* Step 1: Reported */}
              <div className="timeline-step completed">
                <div className="timeline-line" />
                <div className="timeline-node">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.92rem' }}>1. Complaint Registered</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Logged in municipal central queue on {complaint.createdAt}
                  </div>
                </div>
              </div>

              {/* Step 2: Verification & Dispatch */}
              <div className={`timeline-step ${isAssigned ? 'completed' : 'active'}`}>
                <div className="timeline-line" />
                <div className="timeline-node">
                  {isAssigned ? <CheckCircle2 size={16} /> : <User size={14} />}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.92rem' }}>2. Crew & Fleet Assigned</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {isAssigned ? `Assigned to ${complaint.assignedCrew} (${complaint.assignedVehicle})` : 'Awaiting automated supervisor dispatch'}
                  </div>
                </div>
              </div>

              {/* Step 3: Cleanup Operations */}
              <div className={`timeline-step ${isInProgress ? 'completed' : isAssigned ? 'active' : ''}`}>
                <div className="timeline-line" />
                <div className="timeline-node">
                  {isInProgress ? <CheckCircle2 size={16} /> : <Truck size={14} />}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.92rem' }}>3. Field Sanitization</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {isInProgress ? 'Crew actively clearing, loading compactor & disinfecting' : 'Pending on-site arrival'}
                  </div>
                </div>
              </div>

              {/* Step 4: Resolution & Verification */}
              <div className={`timeline-step ${isResolved ? 'completed' : ''}`}>
                <div className="timeline-node">
                  {isResolved ? <CheckCircle2 size={16} /> : <ShieldCheck size={14} />}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.92rem' }}>4. Verified Clean & Closed</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {isResolved ? `Resolved on ${complaint.resolvedAt} • Removed ${complaint.wasteRemoved || '240 kg'}` : 'Requires verified photographic completion proof'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Crew & Vehicle Details */}
          <div className="card">
            <h2 style={{ fontSize: '1.2rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} color="var(--progress)" />
              Assigned Field Unit
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="brand-icon-wrap" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Crew Lead / Operator</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-h)' }}>{complaint.assignedCrew || 'Central Sanitation Team 4'}</div>
                </div>
              </div>

              <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="brand-icon-wrap" style={{ background: 'var(--progress-dim)', color: 'var(--progress)' }}>
                  <Truck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Sanitation Fleet Truck</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-h)' }}>{complaint.assignedVehicle || 'KA-01-EV-9012 (Electric Tipper)'}</div>
                </div>
              </div>

              {complaint.wasteRemoved && (
                <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="brand-icon-wrap" style={{ background: 'var(--resolved-dim)', color: 'var(--resolved)' }}>
                    <Scale size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total Waste Cleared</div>
                    <div style={{ fontWeight: 600, color: 'var(--resolved)' }}>{complaint.wasteRemoved}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Visual Evidence (Before vs After Photos) */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Photographic Verification</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Before Photo */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>
                🔴 BEFORE CLEANUP (Reported Spot)
              </div>
              <div style={{ height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
                {complaint.photo ? (
                  <img src={complaint.photo} alt="Before cleanup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    No initial photo attached
                  </div>
                )}
              </div>
            </div>

            {/* After Photo */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--resolved)', marginBottom: '8px' }}>
                🟢 AFTER CLEANUP (Resolution Proof)
              </div>
              <div style={{ height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
                {complaint.afterPhoto ? (
                  <img src={complaint.afterPhoto} alt="After cleanup proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)', fontSize: '0.85rem', gap: '8px', padding: '20px', textAlign: 'center' }}>
                    <Camera size={24} />
                    <span>Resolution photo proof will be uploaded upon crew completion</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Spot Map Location */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Spot Location Map</h2>
          <MapView 
            complaints={[complaint]} 
            activeComplaintId={complaint.id} 
            height="260px" 
          />
        </div>

        {/* Citizen Feedback & Quality Rating */}
        {isResolved && (
          <div className="card" style={{ borderColor: 'rgba(47, 208, 119, 0.3)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-h)', marginBottom: '4px' }}>Citizen Satisfaction & Rating</h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.86rem' }}>Quality feedback helps BBMP evaluate sanitary crew SLAs</p>
              </div>

              {!complaint.feedback && (
                <button className="btn btn-primary" onClick={() => setIsFeedbackOpen(true)}>
                  <Star size={16} /> Rate Resolution
                </button>
              )}
            </div>

            {complaint.feedback ? (
              <div style={{ padding: '16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', color: '#f0ab3d' }}>
                    {[...Array(complaint.feedback.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#f0ab3d" />
                    ))}
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.9rem' }}>
                    {complaint.feedback.rating}/5 Stars
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>• Submitted {complaint.feedback.submittedAt}</span>
                </div>
                <p style={{ color: 'var(--text)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  "{complaint.feedback.comment}"
                </p>
              </div>
            ) : (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.88rem' }}>
                No feedback submitted yet. Have you inspected the cleaned spot? Leave a rating above!
              </div>
            )}
          </div>
        )}

        {/* Discussion / Case Comments Thread */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--accent)" />
            Case Discussion & Audit Notes ({complaint.comments?.length || 0})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            {(!complaint.comments || complaint.comments.length === 0) ? (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.86rem' }}>
                No public notes on this case yet. Start a discussion below.
              </div>
            ) : (
              complaint.comments.map(c => (
                <div key={c.id} style={{ padding: '12px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.88rem' }}>{c.author}</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{c.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.4 }}>{c.text}</div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendComment} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Add an update note or ask about this cleanup..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
              <Send size={16} /> Post
            </button>
          </form>
        </div>
      </div>

      {/* Feedback Modal Trigger */}
      <FeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        complaintId={complaint.id}
      />
    </div>
  );
}
