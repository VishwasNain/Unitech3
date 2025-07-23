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
  ListItemText
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

const UserMenu = ({ user, isLoggedIn, logout }) => {
  const [userAnchor, setUserAnchor] = useState(null);
  const theme = useTheme();

  const handleUserClick = (event) => {
    setUserAnchor(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchor(null);
  };

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
        PaperProps={{
          sx: {
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        }}
      >
        <Paper sx={{ p: 2 }}>
          {isLoggedIn ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                  {user?.name?.[0] || 'U'}
                </Avatar>
                <Typography variant="h6">
                  {user?.name || 'User'}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <ListItem
                button
                onClick={() => {
                  handleUserClose();
                  window.location.href = '/dashboard';
                }}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  handleUserClose();
                  window.location.href = '/orders';
                }}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="My Orders" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  handleUserClose();
                  window.location.href = '/favorites';
                }}
              >
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText primary="Favorites" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  logout();
                  handleUserClose();
                }}
                sx={{ mt: 2 }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <>
              <Button
                fullWidth
                startIcon={<LoginIcon />}
                onClick={() => {
                  handleUserClose();
                  window.location.href = '/login';
                }}
                sx={{
                  mb: 1,
                  textTransform: 'none',
                  borderRadius: '8px',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                fullWidth
                startIcon={<PersonIcon />}
                onClick={() => {
                  handleUserClose();
                  window.location.href = '/register';
                }}
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Register
              </Button>
            </>
          )}
        </Paper>
      </Popover>
    </>
  );
};

export default UserMenu;
