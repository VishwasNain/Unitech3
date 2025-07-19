import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, fetchWithAuth } from '../api';

const AuthContext = createContext();

const validateUserData = (userData) => {
  const errors = [];
  
  if (!userData.name) errors.push('Name is required');
  if (!userData.email) errors.push('Email is required');
  if (!userData.password) errors.push('Password is required');
  if (userData.password && userData.password.length < 6) 
    errors.push('Password must be at least 6 characters');
  if (!userData.mobile) errors.push('Mobile number is required');
  
  return errors;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          // Validate token with backend
          const data = await fetchWithAuth(api.getUserProfile);
          setUser(data.user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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

      const response = await fetch(api.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
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

      const response = await fetch(api.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsLoggedIn(true);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API if needed
      await fetch(api.logout, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchWithAuth(api.updateUserProfile, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });

      setUser(prev => ({
        ...prev,
        ...data.user
      }));
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify({
        ...JSON.parse(localStorage.getItem('user') || '{}'),
        ...data.user
      }));
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message || 'Failed to update profile');
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
      {children}
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
