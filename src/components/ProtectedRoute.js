import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only proceed with the check after the initial auth check is complete
    if (!loading) {
      setAuthChecked(true);
      
      if (!isLoggedIn) {
        // Store the current location for redirecting after login
        const redirectPath = location.pathname + location.search;
        console.log('ProtectedRoute: Not logged in, redirecting to login');
        
        navigate('/login', { 
          state: { 
            from: redirectPath,
            message: 'Please login to access this page'
          },
          replace: true 
        });
      }
    }
  }, [isLoggedIn, loading, location, navigate]);

  // Show loading state while checking auth
  if (loading || !authChecked) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        gap={2}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="textSecondary">
          Verifying your session...
        </Typography>
      </Box>
    );
  }

  // If not logged in, this will be caught by the useEffect
  // But we still need to handle the case where the user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  // If we get here, the user is authenticated
  return children;
};

export default ProtectedRoute;
