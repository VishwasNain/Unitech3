// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  InputBase,
  Badge,
  Popover,
  Paper,
  Divider,
  useTheme,
  styled,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Search as SearchIcon,
  HomeOutlined as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/UserContext';
import UserMenu from './UserMenu';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { cartItems, totalPrice } = useCart();
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    if (cartItems) {
      const count = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
      setCartItemsCount(count);
    } else {
      setCartItemsCount(0);
    }
  }, [cartItems]);

  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cartAnchor, setCartAnchor] = useState(null);

  // Mobile search popover state
  const [searchPopoverOpen, setSearchPopoverOpen] = useState(false);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);

  // Mobile menu state
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Close all menus and navigate
  const handleNavigation = (path) => {
    // Close mobile menu if open
    if (mobileMoreAnchorEl) {
      setMobileMoreAnchorEl(null);
    }
    
    // Close cart popover if open
    if (cartAnchor) {
      setCartAnchor(null);
    }
    
    // If trying to access protected route and not logged in, redirect to login with return URL
    if ((path === '/cart' || path === '/profile' || path === '/orders' || path === '/checkout') && !isLoggedIn) {
      navigate('/login', { 
        state: { from: path },
        replace: true 
      });
    } else {
      navigate(path);
    }
  };

  const handleCartClick = (event) => {
    if (!isLoggedIn) {
      // Redirect to login with return URL to cart
      navigate('/login', { 
        state: { from: '/cart' },
        replace: true 
      });
    } else {
      setCartAnchor(event.currentTarget);
    }
  };
  
  const handleCartClose = () => {
    setCartAnchor(null);
  };
  
  const handleViewCart = () => {
    handleNavigation('/cart');
    setCartAnchor(null);
  };
  
  const handleCheckout = () => {
    handleNavigation('/checkout');
    setCartAnchor(null);
  };

  // For mobile, open popover for search
  const handleMobileSearchIconClick = (event) => {
    setSearchAnchorEl(event.currentTarget);
    setSearchPopoverOpen(true);
  };
  const handleMobileSearchClose = () => {
    setSearchPopoverOpen(false);
    setSearchAnchorEl(null);
  };
  const handleMobileSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      handleMobileSearchClose();
    }
  };
  const handleMobileSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleMobileSearchSubmit();
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // Navigation items have been removed as per request

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{
        background: 'rgba(15, 15, 20, 0.85)',
        backdropFilter: 'blur(18px) saturate(160%)',
        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
        boxShadow: '0 2px 12px 0 rgba(36,81,171,0.10)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        zIndex: theme.zIndex.drawer + 10,
        left: 0,
        top: 0,
        width: '100vw',
        transition: 'background 0.3s, backdrop-filter 0.3s',
      }}>
        <Toolbar sx={{ px: isMobile ? 1 : 3 }}>

          {/* Home Icon + Brand */}
          <IconButton
            color="inherit"
            aria-label="Go to homepage"
            onClick={() => handleNavigation('/')}
            sx={{ mr: 1 }}
            edge="start"
          >
            <HomeIcon fontSize={isMobile ? "medium" : "large"} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            onClick={() => handleNavigation('/')}
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              fontSize: isMobile ? '1rem' : '1.25rem',
              whiteSpace: 'nowrap',
            }}
          >
            UNITECH COMPUTERS
          </Typography>

          {/* Navigation items have been removed */}

          {/* Search (Desktop Only) */}
          {!isMobile && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
            </Search>
          )}

          {/* Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <>
                <IconButton color="inherit" onClick={handleMobileSearchIconClick}>
                  <SearchIcon />
                </IconButton>
                <Popover
                  open={searchPopoverOpen}
                  anchorEl={searchAnchorEl}
                  onClose={handleMobileSearchClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  PaperProps={{ sx: { p: 2, width: '90vw', maxWidth: 350 } }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InputBase
                      autoFocus
                      fullWidth
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      onKeyPress={handleMobileSearchKeyPress}
                      sx={{ bgcolor: 'rgba(0,0,0,0.04)', px: 1, borderRadius: 2 }}
                    />
                    <IconButton color="primary" onClick={handleMobileSearchSubmit}>
                      <SearchIcon />
                    </IconButton>
                  </Box>
                </Popover>
              </>
            )}
            <IconButton color="inherit" onClick={handleCartClick}>
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <UserMenu user={user} isLoggedIn={isLoggedIn} logout={logout} />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Cart Popover */}
      <Popover
        open={Boolean(cartAnchor)}
        anchorEl={cartAnchor}
        onClose={handleCartClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Paper sx={{ p: 2, width: 300 }}>
          <Typography variant="h6" gutterBottom>Shopping Cart</Typography>
          <Divider sx={{ mb: 2 }} />
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>{item.name}</Typography>
                  <Typography>{item.quantity} x ₹{item.price}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">₹{totalPrice?.toFixed(2) || '0.00'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  onClick={handleViewCart}
                >
                  View Cart
                </Button>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </Box>
            </>
          ) : (
            <Typography>Your cart is empty</Typography>
          )}
        </Paper>
      </Popover>

      {/* Spacer to prevent content jump due to fixed navbar */}
      <Box sx={{ height: { xs: 56, sm: 64, md: 72 } }} />
    </Box>
  );
};

export default Navbar;
