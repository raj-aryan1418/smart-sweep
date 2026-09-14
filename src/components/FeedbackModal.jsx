import React, { useState } from 'react';
import { Star, X, Check, MessageSquare } from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useToast } from '../context/ToastContext';

export default function FeedbackModal({ isOpen, onClose, complaintId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const { submitFeedback } = useComplaints();
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitFeedback(complaintId, rating, comment);
    addToast('Thank you! Your feedback has been submitted to the municipal board.', 'success');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={20} color="var(--accent)" />
            <h3 className="modal-title">Citizen Feedback</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-dim)', marginBottom: '12px' }}>
              How satisfied are you with the sanitation cleanup quality and speed?
            </div>
            
            {/* Star Rating Selector */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Star 
                    size={32} 
                    fill={(hoverRating || rating) >= star ? '#f0ab3d' : 'none'} 
                    color={(hoverRating || rating) >= star ? '#f0ab3d' : 'var(--text-dim)'} 
                  />
                </button>
              ))}
            </div>
            <div style={{ marginTop: '8px', fontWeight: 600, color: 'var(--pending)', fontSize: '0.85rem' }}>
              {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional Cleanliness' :
               rating === 4 ? '⭐⭐⭐⭐ Good Quality' :
               rating === 3 ? '⭐⭐⭐ Satisfactory' :
               rating === 2 ? '⭐⭐ Needs Improvement' : '⭐ Unsatisfactory'}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Feedback Comments (Optional)</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Great job! The area was thoroughly swept and disinfected."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Skip
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
