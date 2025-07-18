import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const validateUserData = (userData) => {
  const errors = [];
  
  if (!userData.email) errors.push('Email is required');
  if (!userData.password) errors.push('Password is required');
  if (userData.password && userData.password.length < 6) 
    errors.push('Password must be at least 6 characters');
  
  return errors;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock user data for demo purposes
  const MOCK_USER = {
    _id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    isAdmin: false
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you would validate the token
      setUser(MOCK_USER);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate input
      const errors = validateUserData({ email, password });
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Mock login - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      localStorage.setItem('token', 'mock-jwt-token');
      setUser(MOCK_USER);
      setIsLoggedIn(true);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate input
      const errors = validateUserData(userData);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Mock registration - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      localStorage.setItem('token', 'mock-jwt-token');
      setUser({
        ...MOCK_USER,
        name: userData.name,
        email: userData.email
      });
      setIsLoggedIn(true);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock update - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(prev => ({
        ...prev,
        ...userData
      }));
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      setError('Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
