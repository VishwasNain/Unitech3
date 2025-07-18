import React, { useState } from 'react';
import { 
  Container, 
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstTime = !localStorage.getItem('hasVisitedBefore');
  
  // Check for registration success or existing account message
  React.useEffect(() => {
    if (location.state) {
      if (location.state.registrationSuccess) {
        setSuccess(`Registration successful! Welcome ${location.state.email}. Please log in to continue.`);
      } else if (location.state.fromRegistration) {
        setError(`An account with this email already exists. Please log in instead.`);
        // Pre-fill the email field if available
        if (location.state.email) {
          setFormData(prev => ({ ...prev, email: location.state.email }));
        }
      }
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    setIsSubmitting(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock user data - in a real app, this would come from your backend
      const mockUser = {
        _id: '1',
        name: 'Demo User',
        email: formData.email,
        mobile: '1234567890',
        createdAt: new Date().toISOString()
      };
      
      // In a real app, the token would come from your backend
      const mockToken = 'mock-jwt-token';
      
      // Save token and user data
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('hasVisitedBefore', 'true');
      
      // Update auth context
      setUser(mockUser);
      setIsLoggedIn(true);
      
      // Navigate to home
      navigate('/');
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasVisitedBefore', 'true');
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ color: 'black' }}>
            Welcome Back
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ color: 'black' }}>
            Sign in to your account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2, 
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  '& .MuiAlert-icon': {
                    color: '#d32f2f',
                  },
                }}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 2,
                  backgroundColor: '#e8f5e9',
                  color: '#2e7d32',
                  '& .MuiAlert-icon': {
                    color: '#43a047',
                  },
                }}
              >
                {success}
              </Alert>
            )}

            <TextField sx={{ input: { color: 'black' } }}
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
              error={error && error.includes('email')}
              helperText={error && error.includes('email') ? error : ''}
            />
            
            <TextField sx={{ input: { color: 'black' } }}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={error && error.includes('password')}
              helperText={error && error.includes('password') ? error : ''}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} />
              ) : (
                'Sign In'
              )}
            </Button>
            {isFirstTime && (
              <Button
                fullWidth
                variant="outlined"
                onClick={handleSkip}
                sx={{ mb: 2 }}
              >
                Skip for now
              </Button>
            )}

            <Divider sx={{ my: 2 }} />

            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 2, color: 'black' }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </Button>

            <Typography align="center" sx={{ color: 'black' }}>
              Don't have an account?{' '}
              <Link href="/register" variant="body2" sx={{ color: 'black' }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
