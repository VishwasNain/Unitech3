import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Use the same axios instance as in AuthContext
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [resetPasswordStep, setResetPasswordStep] = useState(0); // 0: initial, 1: enter mobile, 2: enter OTP
  const [resetMobile, setResetMobile] = useState('');
  const [resetOTP, setResetOTP] = useState('');
  const [resetError, setResetError] = useState('');

  // Check for existing user in localStorage on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Set the authorization header first
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          try {
            // Verify token with backend
            const response = await api.get('/users/me');
            
            // If we get here, the token is valid
            setUser(parsedUser);
            setIsLoggedIn(true);
          } catch (error) {
            console.error('Token verification failed:', error);
            // Clear invalid auth data if token verification fails
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
            setIsLoggedIn(false);
          }
        } else {
          // No token or user in localStorage
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear any potential invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up a periodic check for session validity (every 5 minutes)
    const intervalId = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        api.get('/users/me').catch(error => {
          if (error.response && error.response.status === 401) {
            // Token is invalid, log out the user
            logout();
          }
        });
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    console.log('Attempting to login user:', email);
    
    try {
      const response = await api.post('/users/login', { email, password });
      const { data } = response;
      
      console.log('Login response:', response);
      
      if (!data || !data.token) {
        console.error('Invalid response format - missing token:', data);
        return { success: false, message: 'Invalid response from server' };
      }
      
      // The user data might be in data.user or directly in the response
      const userData = data.user || {
        _id: data._id,
        email: data.email,
        name: data.name
      };
      
      if (!userData || !userData.email) {
        console.error('Invalid user data in response:', data);
        return { success: false, message: 'Invalid user data received' };
      }
      
      // Store the token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set the authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      // Update the auth state
      setUser(userData);
      setIsLoggedIn(true);
      
      console.log('Login successful, user set:', userData);
      return { 
        success: true, 
        message: 'Login successful',
        user: userData,
        token: data.token
      };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, mobile) => {
    setLoading(true);
    console.log('Attempting to register user:', { name, email });
    try {
      const response = await api.post('/users', { name, email, password, mobile });
      const { data } = response;
      
      console.log('Registration response:', response);

      if (!data || !data._id) {
        console.error('Invalid response data:', data);
        return { success: false, message: 'Invalid response from server' };
      }

      console.log('Registration successful, user created:', data);
      
      // Auto-login after successful registration
      const loginResult = await login(email, password);
      if (loginResult.success) {
        return { success: true, message: 'Registration and login successful' };
      } else {
        // If login after registration fails, still return success but with a message
        console.log('Registration successful but auto-login failed:', loginResult.message);
        return { 
          success: true, 
          message: 'Registration successful! Please log in with your credentials.' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (mobile) => {
    setLoading(true);
    setResetError('');
    try {
      await api.post('/users/forgot-password', { mobile });
      setResetMobile(mobile);
      setResetPasswordStep(2);
      return { success: true, message: 'OTP sent successfully. Please check your mobile.' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp) => {
    setLoading(true);
    setResetError('');
    try {
      await api.post('/users/verify-otp', { 
        mobile: resetMobile, 
        otp 
      });
      
      setResetOTP(otp);
      setResetPasswordStep(3);
      return { success: true, message: 'OTP verified successfully. You can now reset your password.' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (newPassword) => {
    setLoading(true);
    setResetError('');
    try {
      await api.put('/users/reset-password', { 
        mobile: resetMobile,
        otp: resetOTP,
        newPassword 
      });
      
      // Reset the password reset flow
      setResetPasswordStep(0);
      setResetMobile('');
      setResetOTP('');
      
      return { success: true, message: 'Password reset successful. You can now login with your new password.' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      // Clear the auth state
      setUser(null);
      setIsLoggedIn(false);
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear axios authorization header
      delete api.defaults.headers.common['Authorization'];
      
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
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    token: localStorage.getItem('token'), // Make token available to components
    login,
    logout,
    register,
    resetPassword,
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

// Export the hook, API instance, and UserProvider
export { useAuth, api, UserProvider };

export default UserContext;
