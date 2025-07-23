import React, { useState, useEffect } from 'react';
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
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency';

const orderStatus = {
  PENDING: { color: '#F57C00', icon: <InfoIcon /> },
  SHIPPED: { color: '#1976D2', icon: <ReceiptIcon /> },
  DELIVERED: { color: '#4CAF50', icon: <CheckCircleIcon /> },
  CANCELLED: { color: '#D32F2F', icon: <ErrorIcon /> }
};

const Orders = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Simulated order data - in a real app this would come from an API
  useEffect(() => {
    // Simulate fetching orders from API
    setTimeout(() => {
      setOrders([
        {
          id: 'ORD123456',
          date: '2025-07-09',
          status: 'DELIVERED',
          items: [
            { name: 'Gaming Laptop', quantity: 1, price: 99999 },
            { name: 'Wireless Mouse', quantity: 2, price: 1999 }
          ],
          total: 103997,
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          paymentMethod: 'COD'
        },
        {
          id: 'ORD654321',
          date: '2025-07-08',
          status: 'SHIPPED',
          items: [
            { name: 'External SSD', quantity: 1, price: 14999 }
          ],
          total: 14999,
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          paymentMethod: 'CARD'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    return orderStatus[status]?.color || theme.palette.primary.main;
  };

  const getStatusIcon = (status) => {
    return orderStatus[status]?.icon || <ReceiptIcon />;
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" color="text.secondary">
          No orders found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} key={order.id}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Order #{order.id}
                </Typography>
                <Chip
                  label={order.status}
                  sx={{
                    backgroundColor: getStatusColor(order.status),
                    color: (theme) => theme.palette.getContrastText(getStatusColor(order.status)),
                    ml: 2
                  }}
                  icon={getStatusIcon(order.status)}
                />
              </Box>

              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                {new Date(order.date).toLocaleDateString()}
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell align="right">{formatPrice(item.price)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} align="right">
                        <Typography variant="h6">Total:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">{formatPrice(order.total)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Payment Method: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Credit/Debit Card'}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ReceiptIcon />}
                  onClick={() => handleViewOrder(order.id)}
                >
                  View Details
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Orders;
