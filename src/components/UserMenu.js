import React, { useState } from 'react';
import {
  IconButton,
  Popover,
  Paper,
  Typography,
  Divider,
  Button,
  Avatar,
  Box,
  useTheme,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
  Link
} from '@mui/material';
import {
  Person as PersonIcon,
  PersonOutline as PersonOutlineIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Favorite as FavoriteIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  Person as UserIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ user, isLoggedIn, logout }) => {
  const [userAnchor, setUserAnchor] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleUserClick = (event) => {
    setUserAnchor(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchor(null);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      divider: false,
      action: () => {
        handleUserClose();
        navigate('/dashboard');
      }
    },
    {
      text: 'My Profile',
      icon: <PersonIcon />,
      path: '/profile',
      divider: false,
      action: () => {
        handleUserClose();
        navigate('/profile');
      }
    },
    {
      text: 'My Orders',
      icon: <ReceiptIcon />,
      path: '/orders',
      divider: true,
      action: () => {
        handleUserClose();
        navigate('/orders');
      }
    },
    {
      text: 'Wishlist',
      icon: <FavoriteIcon />,
      path: '/wishlist',
      divider: false,
      action: () => {
        handleUserClose();
        navigate('/wishlist');
      }
    },
    {
      text: 'Logout',
      icon: <LogoutIcon />,
      action: () => {
        handleUserClose();
        const result = logout();
        if (result && result.success) {
          navigate('/');
        }
      },
      divider: false
    }
  ];

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        color="inherit"
        onClick={handleUserClick}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.5rem',
          },
        }}
      >
        {isLoggedIn ? (
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            {user?.name?.[0] || 'U'}
          </Avatar>
        ) : (
          <PersonOutlineIcon />
        )}
      </IconButton>

      <Popover
        open={Boolean(userAnchor)}
        anchorEl={userAnchor}
        onClose={handleUserClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: 250, p: 0, overflow: 'hidden' }}>
          {isLoggedIn ? (
            <>
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      width: 48,
                      height: 48,
                      fontSize: '1.2rem'
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || <UserIcon />}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" noWrap fontWeight="bold">
                      {user?.name || 'User'}
                    </Typography>
                    <Typography variant="body2" noWrap fontSize="0.75rem" sx={{ opacity: 0.9 }}>
                      {user?.email || ''}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <List sx={{ py: 0 }}>
                {menuItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      button
                      component={Link}
                      to={item.path}
                      onClick={item.action}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                        '& .MuiListItemIcon-root': {
                          minWidth: 40,
                          color: 'text.primary',
                        },
                        py: 1.5,
                        px: 2,
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: 500,
                        }}
                      />
                    </ListItem>
                    {item.divider && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Box sx={{ p: 2 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontSize: '1.75rem'
                  }}
                >
                  <PersonOutlineIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Welcome to Unitech
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Sign in to access your account and start shopping
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2, pb: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<LoginIcon />}
                  onClick={() => {
                    navigate('/login', { state: { from: window.location.pathname } });
                    handleUserClose();
                  }}
                  sx={{ textTransform: 'none', py: 1 }}
                >
                  Sign In
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PersonOutlineIcon />}
                  onClick={() => {
                    navigate('/register', { state: { from: window.location.pathname } });
                    handleUserClose();
                  }}
                  sx={{ textTransform: 'none', py: 1 }}
                >
                  Create Account
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ px: 2, pb: 2 }}>
                <Button
                  fullWidth
                  variant="text"
                  size="small"
                  onClick={() => {
                    navigate('/products');
                    handleUserClose();
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Continue Shopping
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Popover>
    </>
  );
};

export default UserMenu;
