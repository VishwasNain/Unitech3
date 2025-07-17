import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, useTheme, Fade, Stack } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SaleBadge from './SaleBadge';
import { useNavigate } from 'react-router-dom';

const saleProducts = [
  {
    id: 1,
    name: "Lenovo X1",
    brand: "Lenovo",
    model: "X1",
    description: "14-inch Full HD display, 8GB RAM, 256GB SSD",
    price: 16000,
    salePrice: 16000,
    oldPrice: 18000,
    category: "laptops",
    condition: "used",
    image: '/images/Lenovo x1 (1).jpeg',
    images: [
      '/images/Lenovo x1 (1).jpeg',
      '/images/Lenovo x1 (2).jpg',
      '/images/Lenovo x1 (3).jpg',
    ],
    rating: 4,
    specs: {
      processor: "Intel Core i7 - 10th Gen",
      ram: "8GB",
      storage: "256GB SSD",
      display: "14-inch IPS display",
      graphics: "Intel UHD 620",
      battery: "Up to 18 hours",
      weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
      color: "Dark Gray / Black matte textured finish"
    }
  },
  {
    id: 2,
    name: "Lenovo P14 S Touch Screen",
    brand: "Lenovo",
    model: "P14 S",
    description: "14-inch QHD 4K display, 8GB RAM, 256GB SSD",
    price: 17500,
    category: "laptops",
    condition: "used",
    image: '/images/Lenovo p14.jpg',
    images: [
      '/images/Lenovo p14.jpg',
      '/images/Lenovo p14 (2).jpg',
      '/images/Lenovo p14 (3).jpg',
      '/images/Lenovo p14 (4).jpg',
    ],
    rating: 4,
    specs: {
      processor: "Intel Core i7 - 10th Gen",
      ram: "8GB",
      storage: "256GB SSD",
      display: "FHD (14″), QHD 4K",
      graphics: "Intel UHD 620",
      battery: "Up to 18 hours",
      weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
      color: "Dark Gray / Black matte textured finish"
    }
  },
  {
    id: 3,
    name: "Lenovo P43 S",
    brand: "Lenovo",
    model: "P43 S",
    description: "14-inch FHD display, 8GB RAM, 256GB SSD",
    price: 15000,
    category: "laptops",
    condition: "used",
    image: '/images/Lenovo p43 (1).jpg',
    images: [
      '/images/Lenovo p43 (1).jpg',
      '/images/Lenovo p43 (2).jpg',
      '/images/Lenovo p43 (3).jpg',
      '/images/Lenovo p43 (4).jpg',
    ],
    rating: 4,
    specs: {
      processor: "Intel Core i7 - 8th Gen",
      ram: "8GB",
      storage: "256GB SSD",
      display: "FHD (14″), QHD 4K",
      graphics: "Intel UHD 620",
      battery: "Up to 18 hours",
      weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
      color: "Dark Gray / Black matte textured finish"
    }
  },
  
];

const SALE_END = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48 hours from now

function getTimeLeft() {
  const now = new Date();
  const diff = SALE_END - now;
  if (diff <= 0) return 'Ended';
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  return `${h}h ${m}m ${s}s`;
}

const SaleSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`, { state: product });
  };

  return (
    <Box sx={{
      py: 8,
      px: { xs: 2, md: 6 },
      background: 'linear-gradient(120deg, #fceabb 0%, #e0f7fa 100%)',
      borderRadius: 5,
      mb: 8,
      boxShadow: '0 8px 32px #2563eb11',
      position: 'relative',
      overflow: 'hidden',
      minHeight: 420,
    }}>
      {/* Decorative Banner Graphics */}
      <Box sx={{
        position: 'absolute',
        top: -40,
        right: -60,
        opacity: 0.11,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <CelebrationIcon sx={{ fontSize: 220, color: '#f09819' }} />
      </Box>
      {/* Animated Tagline and Timer */}
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2, zIndex: 1, position: 'relative' }}>
        <LocalFireDepartmentIcon sx={{ color: '#e53935', fontSize: 38, animation: 'pulse 1.5s infinite alternate' }} />
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: 1, color: '#e53935', textShadow: '0 2px 8px #ffb30044' }}>
          Hot Deals! Limited Time Only
        </Typography>
      </Stack>
      <Typography align="center" sx={{ fontSize: 18, color: '#333', mb: 2, fontWeight: 600 }}>
        Sale ends in <span style={{ color: '#e53935', fontWeight: 800 }}>{timeLeft}</span>
      </Typography>
      {/* Product Cards Grid/Row */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'grid' },
          gridTemplateColumns: { md: 'repeat(4, 1fr)' },
          gap: 3,
          overflowX: { xs: 'auto', md: 'unset' },
          pb: { xs: 2, md: 0 },
          mb: 3,
          width: '100%',
          flexWrap: { xs: 'nowrap', md: 'wrap' },
          scrollSnapType: { xs: 'x mandatory', md: 'none' },
        }}
      >
        {saleProducts.map((product, idx) => {
          const percent = Math.round(100 - (product.salePrice / product.oldPrice) * 100);
          return (
            <Box
              key={product.id}
              sx={{
                minWidth: { xs: 260, md: 'unset' },
                maxWidth: { xs: 280, md: 'unset' },
                flex: { xs: '0 0 auto', md: 'unset' },
                scrollSnapAlign: { xs: 'start', md: 'none' },
                position: 'relative',
                height: '100%',
              }}
            >
              <SaleBadge percent={percent} />
              <Card sx={{
                borderRadius: 4,
                boxShadow: '0 2px 24px 0 #2563eb22',
                transition: 'transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s',
                '&:hover': {
                  transform: 'scale(1.045) rotate(-1deg)',
                  boxShadow: '0 8px 36px 0 #2563eb33',
                  border: '2px solid #f09819',
                },
                background: 'linear-gradient(120deg, #fffbe6 70%, #e0f7fa 100%)',
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 390,
              }}>
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16, height: 170, minHeight: 170, maxHeight: 170 }}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 180 }}>
                  <div>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#2563eb', letterSpacing: 1 }}>{product.name}</Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: '#555' }}>{product.description}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body1" sx={{ color: '#e53935', fontWeight: 800, fontSize: '1.18rem' }}>
                        ₹{(product.salePrice ?? product.price).toLocaleString()}
                      </Typography>
                      {product.oldPrice && (
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#888', ml: 1, fontWeight: 600 }}>
                          ₹{product.oldPrice.toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  </div>
                  <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                    <Button variant="contained" color="primary" fullWidth sx={{ fontWeight: 700, borderRadius: 2, boxShadow: '0 2px 8px #2563eb33', background: 'linear-gradient(90deg,#2563eb 60%,#10b981 100%)' }} onClick={() => handleViewDetails(product)}>
                      Shop Now
                    </Button>
                    <Button variant="outlined" color="warning" fullWidth sx={{ fontWeight: 700, borderRadius: 2, borderWidth: 2 }} onClick={() => handleViewDetails(product)}>
                      View Details
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
              {/* Sparkle/confetti effect (simple) */}
              <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <circle cx="20%" cy="20%" r="2.5" fill="#f09819" opacity=".5" />
                  <circle cx="80%" cy="28%" r="1.8" fill="#2563eb" opacity=".4" />
                  <circle cx="60%" cy="80%" r="2.2" fill="#10b981" opacity=".4" />
                  <circle cx="44%" cy="60%" r="1.2" fill="#e53935" opacity=".5" />
                </svg>
              </Box>
            </Box>
          );
        })}
      </Box>
      {/* Benefit/Quote at bottom */}
      <Fade in={true} timeout={1100}>
        <Box sx={{ mt: 5, textAlign: 'center', zIndex: 2, position: 'relative' }}>
          <Typography variant="h6" sx={{ color: '#2563eb', fontWeight: 700, mb: 1, letterSpacing: 1 }}>
            "Grab these deals before they're gone! All products come with warranty and fast shipping."
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default SaleSection;
