import React, { createContext, useContext, useState, useEffect } from 'react';

const ComplaintsContext = createContext();

export function ComplaintsProvider({ children }) {
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('smartsweep-complaints-v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved complaints", e);
      }
    }
    // Clean slate: 0 pre-existing complaints
    localStorage.removeItem('smartsweep-complaints'); // remove legacy mock data
    return [];
  });

  useEffect(() => {
    localStorage.setItem('smartsweep-complaints-v2', JSON.stringify(complaints));
  }, [complaints]);

  // Add new complaint
  const addComplaint = (newComplaint) => {
    const id = complaints.length > 0 ? Math.max(...complaints.map(c => c.id)) + 1 : 1;
    const complaintItem = {
      id,
      title: newComplaint.title || `${newComplaint.category || 'Garbage'} issue reported`,
      location: newComplaint.location || 'Reported Location',
      description: newComplaint.description || '',
      hazard: newComplaint.hazard || 'None',
      category: newComplaint.category || 'Overflowing Bin',
      photo: newComplaint.photo || null,
      afterPhoto: null,
      coords: newComplaint.coords || { lat: 12.9716, lng: 77.5946 },
      reportedBy: newComplaint.reportedBy || 'Citizen',
      reporterEmail: newComplaint.reporterEmail || 'citizen@bbmp.gov.in',
      status: 'Pending',
      ward: newComplaint.ward || 'Indiranagar (Ward 12)',
      createdAt: new Date().toISOString().split('T')[0],
      resolvedAt: null,
      assignedCrew: 'Unassigned',
      assignedVehicle: 'Unassigned',
      wasteRemoved: null,
      feedback: null,
      applauds: 0,
      comments: []
    };

    setComplaints(prev => [complaintItem, ...prev]);
    return complaintItem;
  };

  // Update status (e.g. En Route, In Progress, Resolved, Cancelled)
  const updateStatus = (id, newStatus, extraData = {}) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const updated = {
          ...c,
          status: newStatus,
          ...extraData
        };
        if (newStatus === 'Resolved' && !updated.resolvedAt) {
          updated.resolvedAt = new Date().toISOString().split('T')[0];
        }
        return updated;
      }
      return c;
    }));
  };

  // Complete resolution with cleanup photo proof & waste weight
  const resolveComplaint = (id, afterPhoto, wasteRemoved = '250 kg', notes = '') => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Resolved',
          afterPhoto: afterPhoto || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
          wasteRemoved: wasteRemoved || '200 kg',
          resolvedAt: new Date().toISOString().split('T')[0],
          resolutionNotes: notes
        };
      }
      return c;
    }));
  };

  // Citizen adds rating & feedback
  const submitFeedback = (id, rating, comment) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          feedback: {
            rating,
            comment,
            submittedAt: new Date().toISOString().split('T')[0]
          }
        };
      }
      return c;
    }));
  };

  // Like / Applaud a cleanup in public feed
  const applaudComplaint = (id) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, applauds: (c.applauds || 0) + 1 };
      }
      return c;
    }));
  };

  // Add discussion comment
  const addComment = (id, author, text) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const newComment = {
          id: Date.now(),
          author: author || 'Citizen',
          text,
          timestamp: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...c,
          comments: [...(c.comments || []), newComment]
        };
      }
      return c;
    }));
  };

  // Cancel a complaint (if pending)
  const cancelComplaint = (id) => {
    updateStatus(id, 'Cancelled');
  };

  return (
    <ComplaintsContext.Provider
      value={{
        complaints,
        addComplaint,
        updateStatus,
        resolveComplaint,
        submitFeedback,
        applaudComplaint,
        addComment,
        cancelComplaint
      }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
}

export function useComplaints() {
  return useContext(ComplaintsContext);
}
