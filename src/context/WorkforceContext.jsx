import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialWorkforce } from '../data/initialWorkforce';
import { initialEquipment } from '../data/initialEquipment';

const WorkforceContext = createContext();

export function WorkforceProvider({ children }) {
  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem('smartsweep-workforce');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse workforce", e);
      }
    }
    return initialWorkforce;
  });

  const [equipment, setEquipment] = useState(() => {
    const saved = localStorage.getItem('smartsweep-equipment');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse equipment", e);
      }
    }
    return initialEquipment;
  });

  useEffect(() => {
    localStorage.setItem('smartsweep-workforce', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('smartsweep-equipment', JSON.stringify(equipment));
  }, [equipment]);

  const addWorker = (workerData) => {
    const newWorker = {
      id: `W-${100 + workers.length + 1}`,
      name: workerData.name,
      role: workerData.role || 'Sanitation Specialist',
      shift: workerData.shift || 'Morning (06:00 - 14:00)',
      status: workerData.status || 'On Duty',
      ward: workerData.ward || 'Indiranagar (Ward 12)',
      phone: workerData.phone || '+91 98765 00000',
      assignedTask: workerData.assignedTask || 'Ward Sweeping Routine',
      assignedVehicle: workerData.assignedVehicle || 'KA-01-EV-9012',
      completedTasks: 0,
      safetyScore: 100
    };

    setWorkers(prev => [newWorker, ...prev]);
    return newWorker;
  };

  const addEquipment = (eqData) => {
    const newEq = {
      id: `EQ-${String(equipment.length + 1).padStart(2, '0')}`,
      name: eqData.name,
      category: eqData.category || 'Personal Protective Equipment',
      totalQty: Number(eqData.totalQty) || 50,
      availableQty: Number(eqData.availableQty) || Number(eqData.totalQty) || 50,
      condition: eqData.condition || 'Good',
      lastAudited: new Date().toISOString().split('T')[0],
      requiredFor: eqData.requiredFor || 'General Sanitation Shifts'
    };

    setEquipment(prev => [newEq, ...prev]);
    return newEq;
  };

  const updateWorkerStatus = (id, status, assignedTask) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === id) {
        return {
          ...w,
          status: status || w.status,
          assignedTask: assignedTask !== undefined ? assignedTask : w.assignedTask
        };
      }
      return w;
    }));
  };

  return (
    <WorkforceContext.Provider
      value={{
        workers,
        equipment,
        addWorker,
        addEquipment,
        updateWorkerStatus
      }}
    >
      {children}
    </WorkforceContext.Provider>
  );
}

export function useWorkforce() {
  return useContext(WorkforceContext);
}
