import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { api, fetchWithAuth } from '../api';

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // Login form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password state
  const [forgotStep, setForgotStep] = useState(0); // 0=hidden, 1=mobile, 2=otp, 3=new password
  const [forgotData, setForgotData] = useState({ 
    mobile: '', 
    otp: '', 
    newPassword: '',
    confirmPassword: ''
  });
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleForgotChange = (e) => {
    setForgotData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchWithAuth(api.login, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Check if there's a redirect path in the location state
      const from = location.state?.from || '/';
      console.log('Login successful, redirecting to:', from);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!forgotData.mobile) {
      setForgotError('Please enter your mobile number');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    
    try {
      const response = await fetchWithAuth(api.forgotPassword, {
        method: 'POST',
        body: JSON.stringify({ mobile: forgotData.mobile }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setForgotStep(2); // Move to OTP verification step
      setForgotSuccess('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setForgotError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!forgotData.otp) {
      setForgotError('Please enter the OTP');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    
    try {
      const response = await fetchWithAuth(api.verifyOTP, {
        method: 'POST',
        body: JSON.stringify({ 
          mobile: forgotData.mobile,
          otp: forgotData.otp 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      setForgotStep(3); // Move to new password step
      setForgotSuccess('OTP verified! Please set a new password.');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setForgotError(error.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setForgotError('Passwords do not match');
      return;
    }

    if (forgotData.newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    
    try {
      const response = await fetchWithAuth(api.resetPasswordWithOTP, {
        method: 'PUT',
        body: JSON.stringify({ 
          mobile: forgotData.mobile,
          otp: forgotData.otp,
          newPassword: forgotData.newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setForgotSuccess('Password reset successfully! You can now login with your new password.');
      
      // Reset form and go back to login
      setTimeout(() => {
        setForgotStep(0);
        setForgotData({ mobile: '', otp: '', newPassword: '', confirmPassword: '' });
        setForgotSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
      setForgotError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={isMobile ? 0 : 3} 
        sx={{ 
          mt: 8, 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          background: isMobile ? 'transparent' : 'white',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          Welcome Back
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link 
              component={RouterLink} 
              to="/register" 
              variant="body2"
              sx={{ textDecoration: 'none', color: 'primary.main' }}
            >
              Don't have an account? Sign Up
            </Link>
            
            <Button 
              onClick={() => setForgotStep(1)}
              size="small"
              sx={{ textTransform: 'none', color: 'primary.main' }}
            >
              Forgot Password?
            </Button>
          </Box>

          {/* Forgot Password Flow */}
          {forgotStep > 0 && (
            <Box sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 3 }}>
              {forgotStep === 1 && (
                <>
                  <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                    Reset Password
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ mb: 2, color: 'text.secondary' }}>
                    Enter your registered mobile number to receive OTP
                  </Typography>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobile"
                    value={forgotData.mobile}
                    onChange={handleForgotChange}
                    margin="normal"
                    required
                    inputProps={{ pattern: '[0-9]*', maxLength: 10 }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSendOTP}
                    disabled={forgotLoading}
                    sx={{ mt: 2 }}
                  >
                    {forgotLoading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                  <Button
                    fullWidth
                    color="inherit"
                    onClick={() => setForgotStep(0)}
                    sx={{ mt: 1 }}
                  >
                    Back to Login
                  </Button>
                </>
              )}

              {forgotStep === 2 && (
                <>
                  <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                    Verify OTP
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ mb: 2, color: 'text.secondary' }}>
                    Enter the OTP sent to {forgotData.mobile}
                  </Typography>
                  <TextField
                    fullWidth
                    label="OTP"
                    name="otp"
                    value={forgotData.otp}
                    onChange={handleForgotChange}
                    margin="normal"
                    required
                    inputProps={{ maxLength: 6 }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleVerifyOTP}
                    disabled={forgotLoading}
                    sx={{ mt: 2 }}
                  >
                    {forgotLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <Button
                    fullWidth
                    color="inherit"
                    onClick={() => setForgotStep(1)}
                    sx={{ mt: 1 }}
                  >
                    Back
                  </Button>
                </>
              )}

              {forgotStep === 3 && (
                <>
                  <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                    Set New Password
                  </Typography>
                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    name="newPassword"
                    value={forgotData.newPassword}
                    onChange={handleForgotChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={forgotData.confirmPassword}
                    onChange={handleForgotChange}
                    margin="normal"
                    required
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleResetPassword}
                    disabled={forgotLoading}
                    sx={{ mt: 2 }}
                  >
                    {forgotLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </>
              )}

              {(forgotError || forgotSuccess) && (
                <Alert 
                  severity={forgotError ? 'error' : 'success'}
                  sx={{ mt: 2 }}
                >
                  {forgotError || forgotSuccess}
                </Alert>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
