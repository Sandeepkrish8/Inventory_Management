import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);

  // Check biometric availability on mount
  useEffect(() => {
    // Check if WebAuthn is supported
    const checkBiometricSupport = async () => {
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setIsBiometricAvailable(available);
        } catch (error) {
          console.error('Error checking biometric support:', error);
          setIsBiometricAvailable(false);
        }
      } else {
        // Fallback: assume biometric available for demo purposes
        setIsBiometricAvailable(true);
      }
    };

    checkBiometricSupport();

    // Check if biometric is enrolled
    const enrolled = localStorage.getItem('biometric_enrolled') === 'true';
    setIsBiometricEnrolled(enrolled);

    // Try to restore user session from token
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (email, password, role) => {
    // Mock login - In production, replace with API call
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    const mockUser = {
      id: '1',
      email,
      name: role === 'Admin' ? 'Admin User' : role === 'Staff' ? 'Staff User' : 'Viewer User',
      role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${role}`,
      biometricEnabled: isBiometricEnrolled,
      lastLoginAt: new Date().toISOString(),
    };

    setUser(mockUser);

    // Persist session with token (mock)
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36)}`;
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    localStorage.setItem('refresh_token', `refresh_${mockToken}`);
  };

  const loginWithBiometric = async () => {
    try {
      // In production, use WebAuthn API
      // For now, simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if biometric is enrolled
      if (!isBiometricEnrolled) {
        console.error('Biometric not enrolled');
        return false;
      }

      // Mock successful biometric auth - retrieve cached user
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        parsedUser.lastLoginAt = new Date().toISOString();
        setUser(parsedUser);

        // Update token
        const mockToken = `mock_biometric_token_${Date.now()}_${Math.random().toString(36)}`;
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('auth_user', JSON.stringify(parsedUser));

        return true;
      } else {
        // Demo: create a default user if no cached user exists
        const mockUser = {
          id: '1',
          email: 'biometric.user@example.com',
          name: 'Biometric User',
          role: 'Admin',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Biometric',
          biometricEnabled: true,
          lastLoginAt: new Date().toISOString(),
        };
        setUser(mockUser);

        const mockToken = `mock_biometric_token_${Date.now()}_${Math.random().toString(36)}`;
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));

        return true;
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  };

  const enrollBiometric = async () => {
    try {
      // In production, use WebAuthn registration
      // For now, simulate enrollment
      await new Promise(resolve => setTimeout(resolve, 1500));

      localStorage.setItem('biometric_enrolled', 'true');
      localStorage.setItem('biometric_device_id', `device_${Date.now()}`);
      localStorage.setItem('biometric_enrolled_at', new Date().toISOString());

      setIsBiometricEnrolled(true);

      // Update user object
      if (user) {
        const updatedUser = { ...user, biometricEnabled: true };
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Biometric enrollment failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('refresh_token');
    // Note: We keep biometric enrollment data for next login
  };

  const value = {
    user,
    login,
    loginWithBiometric,
    enrollBiometric,
    logout,
    isAuthenticated: !!user,
    isBiometricAvailable,
    isBiometricEnrolled,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
