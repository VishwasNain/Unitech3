import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippedIcon,
  Pending as PendingIcon,
  Cancel as CancelledIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import { format } from 'date-fns';
import { useAuth } from '../context/UserContext';

const orderStatus = {
  pending: { 
    label: 'Pending', 
    color: 'warning', 
    icon: <PendingIcon /> 
  },
  processing: { 
    label: 'Processing', 
    color: 'info', 
    icon: <ReceiptIcon /> 
  },
  shipped: { 
    label: 'Shipped', 
    color: 'info', 
    icon: <ShippedIcon /> 
  },
  delivered: { 
    label: 'Delivered', 
    color: 'success', 
    icon: <CheckCircleIcon /> 
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'error', 
    icon: <CancelledIcon /> 
  }
};

const Orders = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token) {
          navigate('/login', { state: { from: '/orders' } });
          return;
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock orders data
        const mockOrders = [
          {
            _id: '1',
            orderNumber: 'ORD-001',
            status: 'pending',
            totalAmount: 1299.99,
            createdAt: new Date().toISOString(),
            items: [
              { name: 'Laptop', quantity: 1, price: 1299.99, image: '/images/products/laptop.jpg' }
            ]
          },
          {
            _id: '2',
            orderNumber: 'ORD-002',
            status: 'delivered',
            totalAmount: 249.99,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            items: [
              { name: 'Wireless Mouse', quantity: 1, price: 49.99, image: '/images/products/mouse.jpg' },
              { name: 'Keyboard', quantity: 1, price: 89.99, image: '/images/products/keyboard.jpg' },
              { name: 'Mouse Pad', quantity: 1, price: 19.99, image: '/images/products/mousepad.jpg' }
            ]
          },
          {
            _id: '3',
            orderNumber: 'ORD-003',
            status: 'delivered',
            totalAmount: 99.99,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            items: [
              { name: 'Headphones', quantity: 1, price: 99.99, image: '/images/products/headphones.jpg' }
            ]
          }
        ];
        
        setOrders(mockOrders);
      } catch (err) {
        console.error('Error loading orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const getOrderStatus = (status) => {
    return orderStatus[status] || { 
      label: status, 
      color: 'default', 
      icon: <ReceiptIcon /> 
    };
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy hh:mm a');
    } catch (error) {
      return dateString;
    }
  };

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

  if (!orders || orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          No orders found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You haven't placed any orders yet.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
        >
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => {
          const status = getOrderStatus(order.status || 'pending');
          const orderDate = formatDate(order.createdAt || new Date());
          const paymentMethod = order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                             order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                             order.paymentMethod || 'N/A';
          
          return (
            <Grid item xs={12} key={order._id}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="h6" component="div">
                      Order #{order._id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Placed on {orderDate}
                    </Typography>
                  </Box>
                  <Chip
                    label={status.label}
                    color={status.color}
                    icon={status.icon}
                    sx={{ ml: 'auto' }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.orderItems?.map((item) => (
                            <TableRow key={item._id || item.product}>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 16 }}
                                  />
                                  <Typography variant="body2">
                                    {item.name}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="right">{item.qty}</TableCell>
                              <TableCell align="right">{formatPrice(item.price)}</TableCell>
                              <TableCell align="right">
                                {formatPrice(item.price * item.qty)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Order Summary
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Subtotal:</Typography>
                        <Typography variant="body2">{formatPrice(order.itemsPrice)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Shipping:</Typography>
                        <Typography variant="body2">{formatPrice(order.shippingPrice)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Tax:</Typography>
                        <Typography variant="body2">{formatPrice(order.taxPrice)}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="subtitle1">Total:</Typography>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {formatPrice(order.totalPrice)}
                        </Typography>
                      </Box>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Payment Method
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {paymentMethod}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                        Shipping Address
                      </Typography>
                      <Typography variant="body2">
                        {order.shippingAddress?.fullName || order.user?.name}<br />
                        {order.shippingAddress?.address}<br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                        {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Tooltip title="View order details">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewOrder(order._id)}
                      sx={{ ml: 1 }}
                    >
                      View Details
                    </Button>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Orders;
