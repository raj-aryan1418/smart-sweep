import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialVehicles } from '../data/initialVehicles';

const FleetContext = createContext();

export function FleetProvider({ children }) {
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('smartsweep-vehicles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse fleet vehicles", e);
      }
    }
    return initialVehicles;
  });

  useEffect(() => {
    localStorage.setItem('smartsweep-vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  const addVehicle = (vehicleData) => {
    const newVehicle = {
      id: `V-${300 + vehicles.length + 1}`,
      plateNo: vehicleData.plateNo || `KA-01-XX-${Math.floor(1000 + Math.random() * 9000)}`,
      model: vehicleData.model || 'Hydraulic Municipal Truck',
      type: vehicleData.type || 'Compactor',
      capacity: vehicleData.capacity || '5.0 Tons',
      fuelLevel: Number(vehicleData.fuelLevel) || 100,
      fuelType: vehicleData.fuelType || 'EV Battery',
      status: vehicleData.status || 'Available',
      ward: vehicleData.ward || 'Indiranagar (Ward 12)',
      driver: vehicleData.driver || 'Unassigned',
      assignedTask: vehicleData.assignedTask || 'Depot Standby',
      lastMaintenance: new Date().toISOString().split('T')[0],
      odometer: '1,200 km',
      gpsStatus: 'Connected'
    };

    setVehicles(prev => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicleStatus = (id, status, driver, assignedTask) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          status: status || v.status,
          driver: driver !== undefined ? driver : v.driver,
          assignedTask: assignedTask !== undefined ? assignedTask : v.assignedTask
        };
      }
      return v;
    }));
  };

  return (
    <FleetContext.Provider value={{ vehicles, addVehicle, updateVehicleStatus }}>
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {
  return useContext(FleetContext);
}
