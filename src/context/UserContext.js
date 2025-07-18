import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Mock user data for demo purposes
const MOCK_USER = {
  _id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  mobile: '+1234567890',
  isAdmin: false,
  addresses: [],
  orders: []
};

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [resetPasswordStep, setResetPasswordStep] = useState(0); // 0: initial, 1: enter mobile, 2: enter OTP
  const [resetMobile, setResetMobile] = useState('');
  const [resetOTP, setResetOTP] = useState('');
  const [resetError, setResetError] = useState('');

  // Initialize user from localStorage on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsLoggedIn(true);
          } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setResetError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, accept any non-empty password
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const userToLogin = { 
        ...MOCK_USER, 
        email,
        name: email.split('@')[0] // Generate a name from email
      };
      
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(userToLogin));
      
      setUser(userToLogin);
      setIsLoggedIn(true);
      
      return { 
        success: true, 
        message: 'Login successful',
        user: userToLogin,
        token: 'mock-jwt-token'
      };
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      setResetError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, mobile) => {
    setLoading(true);
    setResetError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Basic validation
      if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
      }
      
      const newUser = {
        ...MOCK_USER,
        name,
        email,
        mobile: mobile || MOCK_USER.mobile
      };
      
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      setIsLoggedIn(true);
      
      return { 
        success: true, 
        message: 'Registration and login successful',
        user: newUser,
        token: 'mock-jwt-token'
      };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setResetError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPasswordReset = useCallback(async (mobile) => {
    setLoading(true);
    setResetError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store the mobile number for later use
      setResetMobile(mobile);
      
      // For demo, generate a mock OTP (in a real app, this would be sent via SMS/email)
      const demoOTP = '123456';
      console.log(`Mock OTP sent to ${mobile}: ${demoOTP}`);
      
      // Move to OTP verification step
      setResetPasswordStep(2);
      
      return { 
        success: true, 
        message: 'OTP sent successfully. Please check your mobile.' 
      };
    } catch (error) {
      const errorMessage = error.message || 'Failed to send OTP. Please try again.';
      setResetError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [resetMobile]);

  const verifyOTP = useCallback(async (otp) => {
    setLoading(true);
    setResetError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, accept any 6-digit OTP
      if (otp !== '123456') {
        throw new Error('Invalid OTP. Please try again.');
      }
      
      setResetOTP(otp);
      setResetPasswordStep(3);
      
      return { 
        success: true, 
        message: 'OTP verified successfully. You can now reset your password.' 
      };
    } catch (error) {
      const errorMessage = error.message || 'Invalid OTP. Please try again.';
      setResetError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPasswordWithOTP = useCallback(async (newPassword) => {
    setLoading(true);
    setResetError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Basic validation
      if (!newPassword || newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      // In a real app, you would update the user's password here
      // For demo, we'll just update the local user if logged in
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser && currentUser.email) {
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          password: newPassword // Note: In a real app, hash the password
        }));
      }
      
      // Reset the password reset flow
      setResetPasswordStep(0);
      setResetMobile('');
      setResetOTP('');
      
      return { 
        success: true, 
        message: 'Password reset successful. You can now login with your new password.' 
      };
    } catch (error) {
      const errorMessage = error.message || 'Failed to reset password. Please try again.';
      setResetError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [resetMobile, resetOTP]);

  const logout = useCallback(() => {
    try {
      // Clear the auth state
      setUser(null);
      setIsLoggedIn(false);
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear any other related data
      setResetPasswordStep(0);
      setResetMobile('');
      setResetOTP('');
      setResetError('');

      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, message: 'Error during logout' };
    }
  }, []);

  const value = {
    user,
    isLoggedIn,
    loading,
    token: localStorage.getItem('token'), // Make token available to components
    login,
    logout,
    register,
    resetPassword: resetPasswordWithOTP,
    resetPasswordStep,
    resetMobile,
    resetOTP,
    resetError,
    requestPasswordReset,
    verifyOTP,
    setResetPasswordStep,
    setResetMobile,
    setResetOTP,
    setResetError,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};

// Export the hook and UserProvider
export { useAuth, UserProvider };

export default UserContext;
