import React from 'react';
import { Box, Typography } from '@mui/material';

const SaleBadge = ({ percent = 20 }) => (
  <Box sx={{
    position: 'absolute',
    top: 16,
    left: 16,
    background: 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)',
    color: '#fff',
    px: 2,
    py: 0.5,
    borderRadius: 2,
    fontWeight: 700,
    fontSize: 14,
    boxShadow: '0 2px 8px #f0981933',
    zIndex: 2,
    letterSpacing: 1,
  }}>
    {percent}% OFF
  </Box>
);

export default SaleBadge;
