import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Registered Users Database (Persistent in localStorage so user-created accounts are retained)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('smartsweep-registered-users-v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse registered users", e);
      }
    }
    // Clean slate: 0 pre-existing accounts
    localStorage.removeItem('smartsweep-registered-users'); // wipe legacy demo accounts
    return [];
  });

  // Current Active User Session - Strictly Scoped to the CURRENT TAB via sessionStorage
  const [user, setUser] = useState(() => {
    localStorage.removeItem('smartsweep-user');
    
    const sessionSaved = sessionStorage.getItem('smartsweep-session-user');
    if (sessionSaved) {
      try {
        return JSON.parse(sessionSaved);
      } catch (e) {
        console.error("Failed to parse session user", e);
      }
    }
    return null; // By default: No session
  });

  // Save registered users DB whenever updated
  useEffect(() => {
    localStorage.setItem('smartsweep-registered-users-v2', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Save current active user session ONLY IN sessionStorage (Tab Isolated)
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('smartsweep-session-user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('smartsweep-session-user');
      localStorage.removeItem('smartsweep-user');
    }
  }, [user]);

  // Register New User (Citizen, Crew, or Admin)
  const registerUser = (data) => {
    const emailNormalized = data.email.trim().toLowerCase();
    
    // Check if email already registered
    const existing = registeredUsers.find(u => u.email.toLowerCase() === emailNormalized);
    if (existing) {
      return { 
        success: false, 
        error: 'An account with this email is already registered. Please log in.' 
      };
    }

    const newUser = {
      id: `USR-${Date.now()}`,
      name: data.name.trim(),
      email: emailNormalized,
      password: data.password,
      role: data.role || 'citizen',
      ward: data.ward || 'Indiranagar (Ward 12)',
      phone: data.phone || '',
      address: data.address || '',
      avatarInitial: data.name.trim().substring(0, 2).toUpperCase(),
      createdAt: new Date().toISOString().split('T')[0],
      // Crew specific fields
      crewRole: data.crewRole || (data.role === 'crew' ? 'Sanitation Field Specialist' : undefined),
      shift: data.shift || (data.role === 'crew' ? 'Morning (06:00 - 14:00)' : undefined),
      vehicle: data.vehicle || (data.role === 'crew' ? 'KA-01-EV-9012 (Electric Tipper)' : undefined),
      safetyScore: data.role === 'crew' ? 100 : undefined,
      completedTasks: data.role === 'crew' ? 0 : undefined,
      // Admin specific fields
      designation: data.designation || (data.role === 'admin' ? 'Municipal Supervisor' : undefined),
      accessLevel: data.accessLevel || (data.role === 'admin' ? 'Executive Level' : undefined)
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    return { success: true, user: newUser };
  };

  // Update User Profile Settings (Updates in active tab and persistent accounts database)
  const updateUserProfile = (updatedData) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const updatedUser = {
      ...user,
      ...updatedData,
      avatarInitial: (updatedData.name || user.name).trim().substring(0, 2).toUpperCase()
    };

    setUser(updatedUser);
    sessionStorage.setItem('smartsweep-session-user', JSON.stringify(updatedUser));

    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, ...updatedUser };
      }
      return u;
    }));

    return { success: true, user: updatedUser };
  };

  // Login User with strict authentication check & tab-session isolation
  const loginUser = (email, password, role) => {
    const emailNormalized = email.trim().toLowerCase();
    const foundUser = registeredUsers.find(u => u.email.toLowerCase() === emailNormalized);

    // Policy 1: Must be registered
    if (!foundUser) {
      return { 
        success: false, 
        error: 'Account not found. You must register / create an account before logging in.' 
      };
    }

    // Policy 2: Role verification
    if (role && foundUser.role !== role) {
      return { 
        success: false, 
        error: `This account is registered as a ${foundUser.role.toUpperCase()}, not as a ${role.toUpperCase()}. Please use the correct portal.` 
      };
    }

    // Policy 3: Password verification
    if (foundUser.password !== password) {
      return { 
        success: false, 
        error: 'Incorrect password. Please verify and try again.' 
      };
    }

    // Success: Login user in this tab's sessionStorage
    setUser(foundUser);
    sessionStorage.setItem('smartsweep-session-user', JSON.stringify(foundUser));
    return { success: true, user: foundUser };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('smartsweep-session-user');
    localStorage.removeItem('smartsweep-user');
  };

  const getDashboardPath = (role = user?.role) => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'crew') return '/crew/dashboard';
    if (role === 'citizen') return '/citizen/dashboard';
    return '/login';
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        registeredUsers,
        registerUser, 
        updateUserProfile,
        loginUser, 
        logout, 
        getDashboardPath
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
