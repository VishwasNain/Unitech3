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
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Register = () => {
  const { register } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Validate form
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Attempting to register user:', formData.email);
      const result = await register(formData.name, formData.email, formData.password, '');
      
      console.log('Registration result:', result);
      
      if (result && result.success) {
        setSuccess(result.message || 'Registration successful! Redirecting to login...');
        
        // Only redirect if auto-login wasn't successful
        if (!result.user) {
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                registrationSuccess: true,
                email: formData.email 
              } 
            });
          }, 2000);
        }
      } else {
        // Handle registration failure
        const errorMessage = result?.message || 'Registration failed. Please try again.';
        
        if (errorMessage.toLowerCase().includes('already exists') || 
            errorMessage.toLowerCase().includes('already registered') ||
            errorMessage.toLowerCase().includes('user already')) {
          
          const message = 'This email is already registered. Redirecting to login...';
          setError(message);
          
          // Redirect to login after showing the message for 2 seconds
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                email: formData.email,
                fromRegistration: true
              } 
            });
          }, 2000);
          
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.message || 'Registration failed. Please try again.';
      if (errorMessage.toLowerCase().includes('already exists') || 
          errorMessage.toLowerCase().includes('already registered') ||
          errorMessage.toLowerCase().includes('user already')) {
        setError('This email is already registered. Please try logging in instead.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ color: 'black' }}>
            Create Account
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ color: 'black' }}>
            Get started with Unitech Computers
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
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              error={error && error.includes('name')}
              helperText={error && error.includes('name') ? error : ''}
            />
            
            <TextField sx={{ input: { color: 'black' } }}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
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
            
            <TextField sx={{ input: { color: 'black' } }}
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={error && error.includes('password')}
              helperText={error && error.includes('password') ? error : ''}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, color: 'black' }}
              disabled={isSubmitting || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography align="center" sx={{ color: 'black' }}>
              Already have an account?{' '}
              <Link href="/login" variant="body2" sx={{ color: 'black' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
