import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetPasswordStep, setResetPasswordStep] = useState(0); // 0: initial, 1: enter mobile, 2: enter OTP
  const [resetMobile, setResetMobile] = useState('');
  const [resetOTP, setResetOTP] = useState('');
  const [resetError, setResetError] = useState('');

  // Simulate user data fetching from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      const userData = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, message: 'Login successful' };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, mobile) => {
    setLoading(true);
    try {
      // Validate mobile number
      if (!mobile || mobile.length < 10) {
        return { success: false, message: 'Please enter a valid mobile number' };
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful registration
      const userData = {
        id: Date.now().toString(),
        email,
        name,
        mobile,
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (mobile) => {
    setLoading(true);
    setResetError('');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful OTP request
      setResetMobile(mobile);
      setResetPasswordStep(2);
      return { success: true, message: 'OTP sent successfully. Please check your mobile.' };
    } catch (error) {
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp) => {
    setLoading(true);
    setResetError('');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful OTP verification
      setResetPasswordStep(3);
      return { success: true, message: 'OTP verified successfully. You can now reset your password.' };
    } catch (error) {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (newPassword) => {
    setLoading(true);
    setResetError('');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful password reset
      return { success: true, message: 'Password reset successful. You can now login with your new password.' };
    } catch (error) {
      return { success: false, message: 'Failed to reset password. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPasswordStep,
    resetMobile,
    resetOTP,
    resetError,
    requestPasswordReset,
    verifyOTP,
    resetPassword,
    setResetPasswordStep,
    setResetMobile,
    setResetOTP,
    setResetError
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
