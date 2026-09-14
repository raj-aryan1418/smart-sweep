import React, { createContext, useContext, useState, useEffect } from 'react';

const BulkPickupContext = createContext();

export function BulkPickupProvider({ children }) {
  const [pickups, setPickups] = useState(() => {
    const saved = localStorage.getItem('smartsweep-bulk-pickups-v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse bulk pickups", e);
      }
    }
    // Clean slate: 0 pre-existing bulk requests
    localStorage.removeItem('smartsweep-bulk-pickups');
    return [];
  });

  useEffect(() => {
    localStorage.setItem('smartsweep-bulk-pickups-v2', JSON.stringify(pickups));
  }, [pickups]);

  const requestBulkPickup = (data) => {
    const count = pickups.length + 1;
    const newPickup = {
      id: `BP-${1000 + count}`,
      category: data.category || 'Furniture',
      items: data.items || '',
      loadSize: data.loadSize || 'Medium',
      quantity: Number(data.quantity) || 1,
      address: data.address || '',
      ward: data.ward || 'Indiranagar (Ward 12)',
      preferredDate: data.preferredDate || new Date().toISOString().split('T')[0],
      timeSlot: data.timeSlot || 'Morning (08:00 - 11:00)',
      contactPhone: data.contactPhone || '+91 90000 00000',
      notes: data.notes || '',
      requestedBy: data.requestedBy || 'Citizen',
      reporterEmail: data.reporterEmail || 'citizen@bbmp.gov.in',
      status: 'Requested',
      scheduledDate: null,
      assignedCrew: 'Unassigned',
      assignedVehicle: 'Unassigned',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPickups(prev => [newPickup, ...prev]);
    return newPickup;
  };

  const scheduleBulkPickup = (id, scheduledDate, assignedCrew, assignedVehicle) => {
    setPickups(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Scheduled',
          scheduledDate: scheduledDate || p.preferredDate,
          assignedCrew: assignedCrew || 'Ramesh Kumar',
          assignedVehicle: assignedVehicle || 'KA-01-EV-9012'
        };
      }
      return p;
    }));
  };

  const markCollected = (id) => {
    setPickups(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Collected'
        };
      }
      return p;
    }));
  };

  const cancelPickup = (id) => {
    setPickups(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Cancelled'
        };
      }
      return p;
    }));
  };

  return (
    <BulkPickupContext.Provider
      value={{
        pickups,
        requestBulkPickup,
        scheduleBulkPickup,
        markCollected,
        cancelPickup
      }}
    >
      {children}
    </BulkPickupContext.Provider>
  );
}

export function useBulkPickup() {
  return useContext(BulkPickupContext);
}
