import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  Card,
  CardContent,
  Button,
  Rating,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Breadcrumbs,
  Link
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/currency';

// Custom TabPanel component
const TabPanel = ({ children, value, index }) => {
  return value === index ? (
    <Box sx={{ p: 3 }}>
      {children}
    </Box>
  ) : null;
};

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    if (location.state) {
      setProduct(location.state);
    }
  }, [location.state]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddToCart = () => {
    try {
      if (!product) return;
      // Ensure we have a price property
      const productToAdd = {
        ...product,
        price: product.price || product.specs?.price || 0,
        id: product.id || Date.now().toString() // Ensure we have a unique ID
      };
      addToCart(productToAdd);
      toast.success('Product added to cart successfully!');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading product details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" onClick={() => navigate('/')}>
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate(`/products?category=${product.category}`)}
        >
          {product.category}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', height: 400 }}>
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ))}
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {formatPrice(product.price)}
              </Typography>
              <Rating value={product.rating} readOnly precision={0.5} />
              
              <Typography variant="subtitle1" gutterBottom>
                <strong>Brand:</strong> {product.brand}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Model:</strong> {product.model}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                sx={{ mt: 2 }}
              >
                Add to Cart
              </Button>

              {/* Product Tabs */}
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mt: 2 }}>
                <Tab label="Description" />
                <Tab label="Specifications" />
                <Tab label="Additional Info" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {product.description}
                </Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <List>
                  <Typography variant="h6" sx={{ mt: 2 }}>Technical Specifications</Typography>
                  {Object.entries(product.specs || {}).map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemText
                        primary={key.charAt(0).toUpperCase() + key.slice(1)}
                        secondary={typeof value === 'object' ? JSON.stringify(value) : value}
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <List>
                  <Typography variant="h6" sx={{ mt: 2 }}>Additional Information</Typography>
                  <ListItem>
                    <ListItemText
                      primary="Category"
                      secondary={product.category}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="SKU"
                      secondary={`SKU-${product.id}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Brand"
                      secondary={product.brand}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Model"
                      secondary={product.model}
                    />
                  </ListItem>
                </List>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
