import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Avatar, 
  Button, 
  CircularProgress,
  Snackbar,
  Alert,
  Container
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Event as EventIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  AccountCircle as AccountCircleIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useAuth } from '../context/UserContext';
import { fetchWithAuth, api } from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user: authUser, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: 'Not provided',
    joinDate: 'N/A',
    lastLogin: 'N/A',
    address: 'Not provided'
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    accountAge: 'N/A'
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchDashboardData = useCallback(async () => {
    if (!authUser) {
      console.error('No authenticated user found');
      setError('Authentication required');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch user profile and orders in parallel
      const [userResponse, ordersResponse] = await Promise.all([
        fetchWithAuth(api.getUserProfile),
        fetchWithAuth(api.getMyOrders)
      ]);

      const userData = userResponse;
      const ordersData = ordersResponse.data || [];
      
      // Calculate order stats
      const pendingOrders = ordersData.filter(order => order.orderStatus === 'Processing').length;
      const completedOrders = ordersData.filter(order => order.orderStatus === 'Delivered').length;
      
      // Calculate account age
      const joinDate = new Date(userData.createdAt || Date.now());
      const now = new Date();
      const diffTime = Math.abs(now - joinDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const accountAge = diffDays > 365 
        ? `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ${Math.floor((diffDays % 365) / 30)} month${Math.floor((diffDays % 365) / 30) !== 1 ? 's' : ''}`
        : `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''}`;

      // Update user state
      setUser({
        name: userData.name || 'User',
        email: userData.email || '',
        phone: userData.mobile || 'Not provided',
        joinDate: joinDate.toLocaleDateString(),
        lastLogin: 'Just now',
        address: userData.address || 'Not provided'
      });

      // Update stats
      setStats({
        totalOrders: ordersData.length,
        pendingOrders,
        completedOrders,
        accountAge
      });

      // Set recent orders (last 3)
      setRecentOrders(
        ordersData
          .slice(0, 3)
          .map(order => ({
            id: order._id,
            date: new Date(order.createdAt).toLocaleDateString(),
            total: order.totalPrice,
            status: order.orderStatus,
            orderNumber: order._id.substring(0, 8).toUpperCase()
          }))
      );

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
      setSnackbar({
        open: true,
        message: 'Failed to load dashboard data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [authUser, navigate]);

  useEffect(() => {
    if (authUser && token) {
      fetchDashboardData();
    } else {
      setLoading(false);
      navigate('/login', { state: { from: '/dashboard' } });
    }
  }, [authUser, token, fetchDashboardData, navigate]);

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Welcome back, {user.name}!
        </Typography>
      
      {error && !loading && (
        <Box mb={3}>
          <Paper elevation={0} sx={{ 
            p: 2, 
            bgcolor: 'error.light',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <ErrorIcon color="error" />
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Paper>
        </Box>
      )}
      
      <Grid container spacing={3}>
        {/* User Profile Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardHeader 
              title="Profile Information" 
              titleTypographyProps={{ variant: 'h6' }}
              avatar={
                <Avatar sx={{ 
                  bgcolor: 'primary.main',
                  width: 48,
                  height: 48
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              }
            />
            <CardContent>
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}><PersonIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary={user.name} 
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                    secondary="Full Name" 
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <Divider variant="middle" component="li" sx={{ my: 1 }} />
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}><EmailIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary={user.email} 
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                    secondary="Email Address" 
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <Divider variant="middle" component="li" sx={{ my: 1 }} />
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}><PhoneIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary={user.phone} 
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                    secondary="Phone Number" 
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <Divider variant="middle" component="li" sx={{ my: 1 }} />
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}><EventIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary={user.joinDate} 
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                    secondary="Member Since" 
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                {user.lastLogin && (
                  <>
                    <Divider variant="middle" component="li" sx={{ my: 1 }} />
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 40 }}><EventIcon color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary={user.lastLogin} 
                        primaryTypographyProps={{ variant: 'subtitle2' }}
                        secondary="Last Login" 
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  </>
                )}
              </List>
              <Button 
                fullWidth 
                variant="contained"
                startIcon={<AccountCircleIcon />}
                onClick={() => navigate('/profile')}
                sx={{ 
                  mt: 3,
                  py: 1,
                  textTransform: 'none',
                  borderRadius: 2
                }}
              >
                Manage Account
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats Overview */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ 
                      bgcolor: 'primary.light', 
                      p: 1, 
                      borderRadius: '8px',
                      mr: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ShoppingCartIcon color="primary" />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>Orders</Typography>
                  </Box>
                  <Box mt="auto">
                    <Typography variant="h4" fontWeight={700} color="primary">
                      {stats.totalOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Button 
                      size="small" 
                      sx={{ mt: 1, px: 0, textTransform: 'none' }}
                      onClick={() => navigate('/orders')}
                    >
                      View all orders
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ 
                      bgcolor: 'error.light', 
                      p: 1, 
                      borderRadius: '8px',
                      mr: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FavoriteIcon color="error" />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>Wishlist</Typography>
                  </Box>
                  <Box mt="auto">
                    <Typography variant="h4" fontWeight={700} color="error">
                      {stats.wishlistItems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Saved Items
                    </Typography>
                    <Button 
                      size="small" 
                      sx={{ mt: 1, px: 0, textTransform: 'none' }}
                      onClick={() => navigate('/wishlist')}
                    >
                      View wishlist
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ 
                      bgcolor: 'success.light', 
                      p: 1, 
                      borderRadius: '8px',
                      mr: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <EventIcon color="success" />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>Account</Typography>
                  </Box>
                  <Box mt="auto">
                    <Typography variant="h6" fontWeight={700} color="success.dark">
                      {stats.accountAge}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Member Since
                    </Typography>
                    <Button 
                      size="small" 
                      sx={{ mt: 1, px: 0, textTransform: 'none' }}
                      onClick={() => navigate('/profile')}
                    >
                      Account Settings
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Orders */}
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardHeader 
                  title={
                    <Typography variant="h6" fontWeight={600}>
                      Recent Orders
                    </Typography>
                  }
                  action={
                    recentOrders.length > 0 && (
                      <Button 
                        size="small" 
                        color="primary"
                        onClick={() => navigate('/orders')}
                        sx={{ textTransform: 'none' }}
                      >
                        View All Orders
                      </Button>
                    )
                  }
                  sx={{ pb: 1 }}
                />
                <CardContent sx={{ pt: 0 }}>
                  {recentOrders.length > 0 ? (
                    <List disablePadding>
                      {recentOrders.map((order, index) => (
                        <React.Fragment key={order.id}>
                          <ListItem 
                            button
                            disableGutters
                            onClick={() => navigate(`/order/${order.id}`)}
                            sx={{ 
                              py: 2,
                              '&:hover': { 
                                backgroundColor: 'action.hover',
                                borderRadius: 1
                              }
                            }}
                          >
                            <Box sx={{ width: '100%' }}>
                              <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  Order #{order.orderNumber || order.id.substring(0, 8).toUpperCase()}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 4,
                                    bgcolor: order.status === 'Delivered' 
                                      ? 'success.light' 
                                      : order.status === 'Processing' 
                                        ? 'warning.light' 
                                        : 'primary.light',
                                    color: order.status === 'Delivered' 
                                      ? 'success.dark' 
                                      : order.status === 'Processing' 
                                        ? 'warning.dark' 
                                        : 'primary.dark',
                                    fontWeight: 500,
                                    textTransform: 'capitalize'
                                  }}
                                >
                                  {order.status}
                                </Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" color="text.secondary">
                                  {order.date}
                                </Typography>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  ${order.total ? order.total.toFixed(2) : '0.00'}
                                </Typography>
                              </Box>
                            </Box>
                          </ListItem>
                          {index < recentOrders.length - 1 && (
                            <Divider variant="middle" component="li" sx={{ my: 1 }} />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box textAlign="center" py={4}>
                      <ShoppingCartIcon 
                        color="disabled" 
                        sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} 
                      />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No orders yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        You haven't placed any orders yet. Start shopping to see your orders here.
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={() => navigate('/products')}
                        sx={{ 
                          mt: 1,
                          px: 4,
                          py: 1,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Start Shopping
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

// Helper Components
const ChipInfo = ({ icon, label, value }) => (
  <Paper 
    sx={{ 
      p: 2, 
      flex: 1, 
      minWidth: 120, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}
  >
    <Box sx={{ color: 'primary.main', mb: 1 }}>{icon}</Box>
    <Typography variant="h6">{value}</Typography>
    <Typography variant="caption" color="textSecondary">{label}</Typography>
  </Paper>
);

const InfoItem = ({ icon, label, value }) => (
  <Box display="flex" mb={2}>
    <Box sx={{ color: 'text.secondary', mr: 2, mt: 0.5 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="textSecondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Box>
);

export default Dashboard;
