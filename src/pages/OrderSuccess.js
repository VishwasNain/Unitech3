import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { formatPrice } from '../utils/currency';
import { api, fetchWithAuth } from '../api';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!order) {
        try {
          const data = await fetchWithAuth(api.getOrder(orderId));
          setOrder(data);
        } catch (err) {
          console.error('Error fetching order:', err);
          setError('Failed to load order details. Please try again later.');
          if (err.message === 'Unauthorized') {
            navigate('/login', { state: { from: `/order/${orderId}` } });
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [orderId, order, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Order not found
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box textAlign="center" mb={4}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Thank you for your order!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Your order has been placed successfully
          </Typography>
          <Chip 
            label={`Order #${order._id}`} 
            variant="outlined" 
            sx={{ mt: 2, fontWeight: 'bold' }}
          />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Order Date" 
                  secondary={format(new Date(order.createdAt), 'MMMM d, yyyy hh:mm a')} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Payment Method" 
                  secondary={order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Order Status" 
                  secondary={
                    <Chip 
                      label={order.isPaid ? 'Paid' : 'Pending Payment'} 
                      color={order.isPaid ? 'success' : 'warning'}
                      size="small"
                    />
                  } 
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Typography variant="body1">
              {order.shippingAddress.fullName || order.user?.name}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state}<br />
              {order.shippingAddress.country}, {order.shippingAddress.postalCode}<br />
              Phone: {order.shippingAddress.phone || order.user?.phone}
            </Typography>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          <List>
            {order.orderItems.map((item) => (
              <React.Fragment key={item._id}>
                <ListItem>
                  <Box display="flex" width="100%" alignItems="center">
                    <Box mr={2}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: 60, height: 60, objectFit: 'cover' }}
                      />
                    </Box>
                    <Box flexGrow={1}>
                      <Typography variant="subtitle1">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.qty} x {formatPrice(item.price)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1">
                        {formatPrice(item.price * item.qty)}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>

          <Box mt={4} textAlign="right">
            <Typography variant="body1" gutterBottom>
              Subtotal: {formatPrice(order.itemsPrice)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Shipping: {formatPrice(order.shippingPrice)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Tax: {formatPrice(order.taxPrice)}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
              Total: {formatPrice(order.totalPrice)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Continue Shopping
        </Button>
        <Button
          variant="outlined"
          startIcon={<ShoppingCartIcon />}
          onClick={() => navigate('/orders')}
        >
          View All Orders
        </Button>
      </Box>
    </Container>
  );
};

export default OrderSuccess;
