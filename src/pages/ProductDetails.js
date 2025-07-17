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
  Link,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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

// Styled components for specs and image
const StyledSpecsList = styled(List)(({ theme }) => ({
  '& .MuiListItem-root': {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  '& .MuiListItemText-root': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2)
  }
}));

const StyledProductImage = styled(Box)(({ theme }) => ({
  height: 400,
  borderRadius: '12px',
  overflow: 'hidden',
  background: '#f9f9f9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: theme.shadows[2],
}));

const ProductDetails = () => {
  // ... existing hooks ...
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const { addToCart } = useCart();
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomImgIdx, setZoomImgIdx] = useState(0);
  // Color selection state
  const [selectedColor, setSelectedColor] = useState(null);

  // Update selectedColor when product changes
  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.defaultColor || product.colors[0].name);
    }
  }, [product]);

  // Get current color object
  const selectedColorObj = product && product.colors
    ? product.colors.find(c => c.name === selectedColor)
    : null;

  // --- Harden navigation: use refs to avoid stale closure ---
  const productRef = React.useRef(product);
  const zoomImgIdxRef = React.useRef(zoomImgIdx);
  productRef.current = product;
  zoomImgIdxRef.current = zoomImgIdx;

  const handleZoomPrev = () => {
    if (!productRef.current?.images?.length) return;
    setZoomImgIdx(idx => (idx - 1 + productRef.current.images.length) % productRef.current.images.length);
  };
  const handleZoomNext = () => {
    if (!productRef.current?.images?.length) return;
    setZoomImgIdx(idx => (idx + 1) % productRef.current.images.length);
  };
  const handleZoomClose = () => setZoomOpen(false);

  // Keyboard navigation for zoom modal
  useEffect(() => {
    if (!zoomOpen) return;
    const handleKeyDown = (e) => {
      console.log('Key pressed in modal:', e.key);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleZoomNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleZoomPrev();
      } else if (e.key === 'Escape') {
        handleZoomClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomOpen]);

  useEffect(() => {
    const staticProducts = [
      {
        id: 1,
        name: "Apple MacBook Air M4 14inch (Refurbished)",
        brand: "Apple",
        model: "M4 Air",
        description: "14-inch Retina display, M4 chip, 16GB RAM, 256GB SSD",
        price: 82000,
        category: "laptops",
        condition: "new",
        image: '/images/Apple m4 air.jpeg',
        images: [
          '/images/Apple m4 air.jpeg',
          '/images/M4 air (2).jpg',
          '/images/M4 air (3).jpg',
          '/images/M4 air (4).jpg',
        ],
        rating: 4.7,
        specs: {
          processor: "Apple M4",
          ram: "16GB Unified Memory",
          storage: "256GB SSD",
          display: "14-inch Retina display",
          graphics: "Apple M4 graphics",
          battery: "Up to 18 hours",
          weight: "2.8 pounds",
          color: "Space Gray"
        }
      },
      {
        id: 106,
        name: "Zebronics Transformer Gaming Keyboard and Mouse Combo",
        brand: "Zebronics",
        model: "Transformer 1",
        description: "Zebronics Transformer Gaming Keyboard and Mouse Combo,Braided Cable,Durable Al body,Multimedia keys and Gaming Mouse with 6 Buttons, Multi-Color LED Lights, High-Resolution Sensor with 3200 DPI.",
        price: 599,
        category: "accessories",
        condition: "new",
        image: '/images/Trans 1.jpg',
        colors: [
          {
            name: "Black",
            hex: "#222",
            images: [
              '/images/Trans 1.jpg',
              '/images/Trans 2.jpg',
              '/images/Trans 3.jpg',
              '/images/Trans 4.jpg',
              '/images/Trans 5.jpg',
              '/images/Trans 6.jpg',
              '/images/Trans 7.jpg',
            ]
          },
          {
            name: "White",
            hex: "#fff",
            images: [
              '/images/Trans_white 1.jpg',
              '/images/Trans_white 2.jpg',
              '/images/Trans_white 3.jpg',
              '/images/Trans_white 4.jpg',
              '/images/Trans_white 5.jpg',
              '/images/Trans_white 6.jpg',
              '/images/Trans_white 7.jpg',
            ]
          },
          {
            name: "Blue",
            hex: "#2196f3",
            images: [
              '/images/Trans_blue_1.jpg',
              '/images/Trans_blue_2.jpg',
              '/images/Trans_blue_3.jpg',
              '/images/Trans_blue_4.jpg'
            ]
          },
          {
            name: "Pink",
            hex: "#e91e63",
            images: [
              '/images/Trans_pink_1.jpg',
              '/images/Trans_pink_2.jpg',
              '/images/Trans_pink_3.jpg',
              '/images/Trans_pink_4.jpg'
            ]
          }
        ],
        defaultColor: "Black",
        rating: 4.1,
        specs: {
          type: "Wired",
          connectivity: "USB",
          color: "Black",
          weight: "50g"
        }
      },
      // ... add other products as needed ...
    ];
    // Always prefer staticProducts lookup if location.state is missing colors
    if (location.state && location.state.colors) {
      setProduct(location.state);
    } else if (id) {
      const found = staticProducts.find(p => String(p.id) === String(id));
      setProduct(found || null);
    }
  }, [location.state, id]);


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

  const handleZoomOpen = (idx) => {
    setZoomImgIdx(idx);
    setZoomOpen(true);
  };

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading product details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
  {/* Color Selection UI */}
  {product.colors && product.colors.length > 0 && (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      {product.colors.map(color => (
        <Button
          key={color.name}
          onClick={() => {
            setSelectedColor(color.name);
            setZoomImgIdx(0);
          }}
          variant={selectedColor === color.name ? 'contained' : 'outlined'}
          sx={{
            minWidth: 36, minHeight: 36, borderRadius: '50%',
            bgcolor: color.hex,
            border: selectedColor === color.name ? '2px solid #1976d2' : '1px solid #ccc',
            color: color.hex === '#fff' ? '#222' : '#fff',
            boxShadow: selectedColor === color.name ? 2 : 0,
            outline: selectedColor === color.name ? '2px solid #1976d2' : 'none',
            p: 0,
          }}
        >
          {color.name}
        </Button>
      ))}
    </Box>
  )}
  <Box onClick={() => handleZoomOpen(0)} sx={{ cursor: 'zoom-in' }}>
    <StyledProductImage>
      {selectedColorObj && selectedColorObj.images && selectedColorObj.images.length > 0 ? (
        <img
          src={selectedColorObj.images[zoomImgIdx]}
          alt={product.name + ' ' + selectedColorObj.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ) : (
        product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', bgcolor: '#eee' }} />
        )
      )}
    </StyledProductImage>
  </Box>
</Grid>
          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>{product.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {product.brand} {product.model}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating || 0} precision={0.1} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>{product.rating}</Typography>
              </Box>
              <Typography variant="h6" color="primary" gutterBottom>
                ₹{formatPrice(product.price)}
              </Typography>
              {/* Config selectors if present */}
              {product.configOptions && (
                <Box sx={{ mb: 2 }}>
                  {product.configOptions.ram && (
                    <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                      <InputLabel>RAM</InputLabel>
                      <Select
                        value={product.selectedConfig?.ram || product.configOptions.ram[0]?.value}
                        label="RAM"
                        onChange={e => setProduct(prev => ({ ...prev, selectedConfig: { ...prev.selectedConfig, ram: e.target.value } }))}
                      >
                        {product.configOptions.ram.map(opt => (
                          <MenuItem key={opt.value} value={opt.value}>{opt.label} {opt.price ? `(+₹${opt.price})` : ''}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {product.configOptions.storage && (
                    <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                      <InputLabel>Storage</InputLabel>
                      <Select
                        value={product.selectedConfig?.storage || product.configOptions.storage[0]?.value}
                        label="Storage"
                        onChange={e => setProduct(prev => ({ ...prev, selectedConfig: { ...prev.selectedConfig, storage: e.target.value } }))}
                      >
                        {product.configOptions.storage.map(opt => (
                          <MenuItem key={opt.value} value={opt.value}>{opt.label} {opt.price ? `(+₹${opt.price})` : ''}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {product.configOptions.processor && (
                    <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                      <InputLabel>Processor</InputLabel>
                      <Select
                        value={product.selectedConfig?.processor || product.configOptions.processor[0]?.value}
                        label="Processor"
                        onChange={e => setProduct(prev => ({ ...prev, selectedConfig: { ...prev.selectedConfig, processor: e.target.value } }))}
                      >
                        {product.configOptions.processor.map(opt => (
                          <MenuItem key={opt.value} value={opt.value}>{opt.label} {opt.price ? `(+₹${opt.price})` : ''}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>
              )}
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2, mb: 1, borderRadius: 2 }}
                onClick={handleAddToCart}
                fullWidth
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>
        </Grid>
        {/* Tabs for Description, Specs, etc. */}
        <Box sx={{ mt: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="Product detail tabs">
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Warranty & Shipping" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
  {product.description && (
    <Box sx={{ mb: product.mouseDescription ? 2 : 0 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Keyboard Description</Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{product.description}</Typography>
    </Box>
  )}
  {product.mouseDescription && (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Mouse Description</Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{product.mouseDescription}</Typography>
    </Box>
  )}
  {!(product.description || product.mouseDescription) && (
    <Typography variant="body1" color="text.secondary">No description available.</Typography>
  )}
</TabPanel>
          <TabPanel value={tabValue} index={1}>
            <StyledSpecsList>
              {product.specs && Object.entries(product.specs).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText primary={key.replace(/([A-Z])/g, ' $1').trim()} secondary={value} />
                </ListItem>
              ))}
            </StyledSpecsList>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Typography variant="body2" color="text.secondary">
              Warranty: {product.warranty || '1 year manufacturer warranty'}<br />
              Shipping: Free shipping on all orders
            </Typography>
          </TabPanel>
        </Box>
      </Paper>
      <Modal
        open={zoomOpen}
        onClose={handleZoomClose}
        disableEnforceFocus={true}
        disableAutoFocus={true}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1500 }}
        aria-label="Product image viewer. Use left and right arrow keys to navigate images."
      >
        <Box
          tabIndex={0}
          onKeyDown={(e) => {
            // direct handler for modal content
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              handleZoomNext();
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
              handleZoomPrev();
            } else if (e.key === 'Escape') {
              handleZoomClose();
            }
          }}
          sx={{
            outline: 'none',
            position: 'relative',
            bgcolor: 'rgba(18,22,34,0.96)',
            borderRadius: 3,
            boxShadow: 24,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '90vw',
            maxHeight: '90vh',
            minWidth: { xs: 260, sm: 400 },
            minHeight: { xs: 200, sm: 300 },
          }}
        >
          {selectedColorObj && selectedColorObj.images && selectedColorObj.images.length > 1 && (
            <IconButton onClick={handleZoomPrev} sx={{ position: 'absolute', left: 8, top: '50%', color: '#fff', bgcolor: 'rgba(18,22,34,0.4)', '&:hover': { bgcolor: '#222' } }}>
              <ArrowBackIosNewIcon />
            </IconButton>
          )}
          <img
            src={selectedColorObj && selectedColorObj.images && selectedColorObj.images.length > 0 ? selectedColorObj.images[zoomImgIdx] : product.images?.[zoomImgIdx]}
            alt={`Zoomed product ${zoomImgIdx + 1}`}
            style={{
              maxHeight: '80vh',
              maxWidth: '80vw',
              borderRadius: 12,
              objectFit: 'contain',
              boxShadow: '0 8px 32px #0009',
              background: '#222',
            }}
          />
          <IconButton onClick={handleZoomClose} sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', bgcolor: 'rgba(24,28,44,0.6)', '&:hover': { bgcolor: '#333' } }}>
            <CloseIcon />
          </IconButton>
          {selectedColorObj && selectedColorObj.images && selectedColorObj.images.length > 1 && (
            <IconButton onClick={handleZoomNext} sx={{ position: 'absolute', right: 8, top: '50%', color: '#fff', bgcolor: 'rgba(18,22,34,0.4)', '&:hover': { bgcolor: '#222' } }}>
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ProductDetails;
