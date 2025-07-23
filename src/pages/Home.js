import React, { useState } from 'react';
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
  Link,
  CardMedia,
  IconButton,
  TextField,
  Alert,
  InputAdornment,
  styled,
  useTheme,
  useMediaQuery,
  SwipeableDrawer,
  Slider,
  Pagination,
  Avatar,
  Fade
} from '@mui/material';
import {
  LaptopMac,
  PhoneAndroid,
  Tv,
  Headphones,
  Camera,
  Gamepad,
  Speaker,
  DesktopWindows,
  Computer,
  Search,
  CheckCircle,
  LocalShipping,
  ThumbUp,
  FiberManualRecord,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import theme from '../theme/theme';

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    minWidth: 'unset',
    width: '100%',
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
  padding: '80px 0',
  borderRadius: '20px',
  marginBottom: '40px',
  [theme.breakpoints.down('sm')]: {
    padding: '40px 0 24px 0',
    marginBottom: '24px',
  },
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  transition: 'transform 0.3s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: '10px',
  },
}));

const TestimonialSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 0),
  },
}));

const GradientText = styled(Typography)({
  background: 'linear-gradient(45deg, #2563eb, #10b981)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
});

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const categories = [
    { 
      icon: LaptopMac, 
      label: 'Laptops',
      path: '/products/laptops'
    },
    { 
      icon: DesktopWindows, 
      label: 'Desktops',
      path: '/products/desktops'
    },
    { 
      icon: Computer, 
      label: 'Accessories',
      path: '/products/accessories'
    }
  ];

  const features = [
    { icon: CheckCircle, label: 'Free Shipping', color: '#10b981' },
    { icon: LocalShipping, label: '24/7 Support', color: '#2563eb' },
  ];

  const testimonials = [
    {
      name: 'John Smith',
      role: 'Software Developer',
      rating: 5,
      content: "I've been shopping at Unitech for years and their customer service is top-notch. They always have the latest technology at great prices.",
      image: '/images/testimonial1.jpg'
    },
    {
      name: 'Sarah Johnson',
      role: 'Graphic Designer',
      rating: 5,
      content: "The quality of products at Unitech is exceptional. I've never had any issues with my purchases and their delivery is always on time.",
      image: '/images/testimonial2.jpg'
    }
  ];

  // Featured Products Carousel (mock data)
  const featuredProducts = [
    {
      id: 1,
      name: "Apple MacBook Air M4 14inch (Refurbished)",
      brand: "Apple",
      model: "M4 Air",
      description: "14-inch Retina display, M4 chip, 16GB RAM, 256GB SSD",
      price: 82000,
      category: "laptops",
      condition: "new",
      image: 'images/Apple m4 air.jpeg',
      images: [
        'images/Apple m4 air.jpeg',
        'images/M4 air (2).jpg',
        'images/M4 air (3).jpg',
        'images/M4 air (4).jpg',
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
      id: 2,
      name: "Apple MacBook pro M1 (2021) (Refurbished)",
      brand: "Apple",
      model: "M1 Pro",
      description: "16-inch Retina display, M1 chip, 32GB RAM, 512GB SSD",
      price: 84000,
      category: "laptops",
      condition: "new,used",
      image: '/images/m1 pro 16inch.jpg',
      images: [
        '/images/m1 pro 16inch.jpg',
        '/images/M1 pro (3).jpg',
      ],
      rating: 4.8,
      specs: {
        processor: "Apple M1",
        ram: "32GB RAM",
        storage: "512GB SSD",
        display: "16-inch Retina display",
        graphics: "Apple M1 graphics",
        battery: "Up to 21 hours",
        weight: "3.5 pounds",
        color: "Silver"
      }
    },
    {
      id: 3,
      name: "Apple MacBook M3 Pro (Refurbished)",
      brand: "Apple",
      model: "M3 Pro",
      description: "16-inch Retina display, M3 chip, 18GB RAM, 512GB SSD",
      price: 84000,
      category: "laptops",
      condition: "new",
      image: '/images/M3 pro.png',
      images: [
        '/images/M3 pro.png',
        '/images/M3 pro (2).jpg',
        '/images/M3 pro (3).jpg'
      ],
      rating: 4.8,
      specs: {
        processor: "Apple M3",
        ram: "18GB RAM",
        storage: "512GB SSD",
        display: "16-inch Retina display",
        graphics: "Apple M3 graphics",
        battery: "Up to 21 hours",
        weight: "3.5 pounds",
        color: "Silver"
      }
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Promo Banner */}
      <Box sx={{
        width: '100%',
        background: 'linear-gradient(90deg, #ff512f, #dd2476)',
        color: 'white',
        py: 1,
        textAlign: 'center',
        fontWeight: 600,
        fontSize: { xs: '1rem', sm: '1.15rem' },
        letterSpacing: 1,
        mb: 2,
        animation: 'pulse 2s infinite alternate',
        '@keyframes pulse': {
          from: { filter: 'brightness(1)' },
          to: { filter: 'brightness(1.15)' }
        }
      }}>
        🎉 Summer Sale! Get up to 50% OFF on select products.
        <Button color="secondary" variant="contained" size="small" sx={{ ml: 2 }}>
          Shop Now
        </Button>
      </Box>

      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <GradientText variant="h1" gutterBottom>
                Welcome to Unitech Computers
              </GradientText>
              <Typography variant="h2" color="text.secondary" paragraph>
              Next-Gen Tech.
              Half the Price.

              </Typography>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: '400px',
                  background: 'linear-gradient(45deg, #2563eb, #10b981)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.9,
                }}
              >
                <Typography variant="h2" color="white">
                  Explore Now
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Fade in={true} timeout={1000}>
        <div>
          {/* Featured Products Carousel */}
          <Container maxWidth="lg" sx={{ my: 4 }}>
            <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
              UNITECH BESTSELLERS
            </Typography>
            <Box sx={{ width: '100%', overflowX: 'auto', display: 'flex', gap: 3, py: 2, scrollbarWidth: 'thin', '&::-webkit-scrollbar': { height: 10 }, '&::-webkit-scrollbar-thumb': { background: '#bbb', borderRadius: 5 } }}>
              {featuredProducts.map(product => (
                <Card key={product.id} sx={{ minWidth: 260, flex: '0 0 260px', boxShadow: 4, borderRadius: 3 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom noWrap>{product.name}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      ₹{product.price.toLocaleString()}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      onClick={() => navigate('/product-details', { state: product })}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </div>
      </Fade>

      <Fade in={true} timeout={1200}>
        <div>
          {/* Categories Section */}
          <Container maxWidth="lg" sx={{ my: 8 }}>
            <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
              Shop By Category
            </Typography>
            <Grid container spacing={4}>
              {categories.map((category, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <RouterLink to={category.path} style={{ textDecoration: 'none' }}>
                    {category.label === 'Laptops' ? (
                      <Box
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, #2563eb 60%, #10b981 100%)',
                          borderRadius: 4,
                          boxShadow: 6,
                          p: 3,
                          minHeight: 210,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s cubic-bezier(.4,2,.6,1)',
                          cursor: 'pointer',
                          border: '3px solid #2563eb',
                          animation: 'glowLaptop 2s infinite alternate',
                          '@keyframes glowLaptop': {
                            from: { boxShadow: '0 0 24px 2px #2563eb55' },
                            to: { boxShadow: '0 0 36px 8px #10b98166' }
                          },
                        }}
                      >
                        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                          <Box sx={{ bgcolor: '#fff', color: '#2563eb', px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: 13, boxShadow: 2 }}>
                            Top Choice
                          </Box>
                        </Box>
                        <Box sx={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', opacity: 0.08, zIndex: 0 }}>
                          <img src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png" alt="laptop bg" width="120" height="80" />
                        </Box>
                        <LaptopMac sx={{ fontSize: 72, color: '#fff', zIndex: 1 }} />
                        <Typography variant="h5" align="center" sx={{ color: '#fff', fontWeight: 700, zIndex: 1 }}>
                          {category.label}
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ color: '#e0f7fa', mt: 1, zIndex: 1 }}>
                          Work, Play, Create
                        </Typography>
                      </Box>
                    ) : category.label === 'Desktops' ? (
                      <Box
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, #7b1fa2 60%, #1976d2 100%)',
                          borderRadius: 4,
                          boxShadow: 6,
                          p: 3,
                          minHeight: 210,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s cubic-bezier(.4,2,.6,1)',
                          cursor: 'pointer',
                          border: '3px solid #7b1fa2',
                          animation: 'glowDesktop 2s infinite alternate',
                          '@keyframes glowDesktop': {
                            from: { boxShadow: '0 0 24px 2px #7b1fa255' },
                            to: { boxShadow: '0 0 36px 8px #1976d266' }
                          },
                        }}
                      >
                        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                          <Box sx={{ bgcolor: '#fff', color: '#7b1fa2', px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: 13, boxShadow: 2 }}>
                            Editor's Pick
                          </Box>
                        </Box>
                        <Box sx={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', opacity: 0.08, zIndex: 0 }}>
                          <img src="https://cdn-icons-png.flaticon.com/512/1995/1995526.png" alt="desktop bg" width="120" height="80" />
                        </Box>
                        <category.icon sx={{ fontSize: 72, color: '#fff', zIndex: 1 }} />
                        <Typography variant="h5" align="center" sx={{ color: '#fff', fontWeight: 700, zIndex: 1 }}>
                          {category.label}
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ color: '#e1bee7', mt: 1, zIndex: 1 }}>
                          Power & Performance
                        </Typography>
                      </Box>
                    ) : category.label === 'Accessories' ? (
                      <Box
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, #ff9800 60%, #ec407a 100%)',
                          borderRadius: 4,
                          boxShadow: 6,
                          p: 3,
                          minHeight: 210,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s cubic-bezier(.4,2,.6,1)',
                          cursor: 'pointer',
                          border: '3px solid #ff9800',
                          animation: 'glowAccessories 2s infinite alternate',
                          '@keyframes glowAccessories': {
                            from: { boxShadow: '0 0 24px 2px #ff980055' },
                            to: { boxShadow: '0 0 36px 8px #ec407a66' }
                          },
                        }}
                      >
                        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                          <Box sx={{ bgcolor: '#fff', color: '#ff9800', px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: 13, boxShadow: 2 }}>
                            Must Have
                          </Box>
                        </Box>
                        <Box sx={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', opacity: 0.08, zIndex: 0 }}>
                          <img src="https://cdn-icons-png.flaticon.com/512/1995/1995572.png" alt="accessories bg" width="120" height="80" />
                        </Box>
                        <category.icon sx={{ fontSize: 72, color: '#fff', zIndex: 1 }} />
                        <Typography variant="h5" align="center" sx={{ color: '#fff', fontWeight: 700, zIndex: 1 }}>
                          {category.label}
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ color: '#fffde7', mt: 1, zIndex: 1 }}>
                          Enhance Your Setup
                        </Typography>
                      </Box>
                    ) : (
                      <CategoryCard>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          <category.icon sx={{ fontSize: 60 }} />
                        </Box>
                        <Typography variant="h5" align="center">
                          {category.label}
                        </Typography>
                      </CategoryCard>
                    )}
                  </RouterLink>
                </Grid>
              ))}
            </Grid>
          </Container>
        </div>
      </Fade>

      <Fade in={true} timeout={1400}>
        <div>
          {/* Stats/Trust Bar */}
          <Box sx={{
            width: '100%',
            bgcolor: 'rgba(37,99,235,0.08)',
            py: { xs: 3, sm: 4 },
            mb: 6,
            borderRadius: 3,
            boxShadow: 2,
          }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: 36, color: '#2563eb', mb: 1 }}>⭐</Box>
                <Typography variant="h5" fontWeight={700}>4.9/5</Typography>
                <Typography variant="body2" color="text.secondary">Average Rating</Typography>
              </Grid>
              <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: 36, color: '#10b981', mb: 1 }}>👥</Box>
                <Typography variant="h5" fontWeight={700}>10,000+</Typography>
                <Typography variant="body2" color="text.secondary">Happy Customers</Typography>
              </Grid>
              <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: 36, color: '#f59e42', mb: 1 }}>🚚</Box>
                <Typography variant="h5" fontWeight={700}>Free</Typography>
                <Typography variant="body2" color="text.secondary">Shipping in India</Typography>
              </Grid>
              <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: 36, color: '#2563eb', mb: 1 }}>🔒</Box>
                <Typography variant="h5" fontWeight={700}>100%</Typography>
                <Typography variant="body2" color="text.secondary">Secure Payment</Typography>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Fade>

      <Fade in={true} timeout={1600}>
        <div>
          {/* Newsletter Signup Section */}
          <Container maxWidth="md" sx={{ mb: 8 }}>
            <Box
              sx={{
                bgcolor: 'linear-gradient(90deg, #2563eb11, #10b98111)',
                borderRadius: 4,
                boxShadow: 3,
                p: { xs: 3, sm: 5 },
                textAlign: 'center',
                mb: 6,
              }}
            >
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Get Exclusive Deals & Updates
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Subscribe to our newsletter and never miss a special offer or new arrival!
              </Typography>
              <Box
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  maxWidth: 500,
                  mx: 'auto',
                  width: '100%',
                }}
                onSubmit={e => e.preventDefault()}
              >
                <TextField
                  type="email"
                  required
                  placeholder="Enter your email"
                  size="medium"
                  sx={{
                    flex: 1,
                    bgcolor: 'white',
                    borderRadius: 2,
                    width: { xs: '100%', sm: 'auto' },
                    color: 'black',
                    input: { color: 'black' },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    minWidth: 140,
                    width: { xs: '100%', sm: 'auto' },
                    color: 'black',
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Box>
          </Container>
        </div>
      </Fade>

      <Fade in={true} timeout={1800}>
        <div>
          <TestimonialSection>
            <Container maxWidth="lg">
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  textAlign: 'center',
                  mb: 6,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                What Our Customers Say
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 4 }}>
                {testimonials.map((testimonial, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <TestimonialCard>
                      <Box sx={{ width: '100%', textAlign: 'center' }}>
                        <Avatar src={testimonial.image} sx={{ width: 80, height: 80, mb: 2 }} />
                        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          {testimonial.role}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                          "{testimonial.content}"
                        </Typography>
                        <Rating
                          value={testimonial.rating}
                          precision={0.5}
                          readOnly
                          size="medium"
                          sx={{ color: '#ffd700' }}
                        />
                      </Box>
                    </TestimonialCard>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </TestimonialSection>
        </div>
      </Fade>

      <Fade in={true} timeout={2000}>
        <div>
          {/* Trusted Brands/Partners Row */}
          <Container maxWidth="lg" sx={{ mt: 10, mb: 8 }}>
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary', letterSpacing: 2 }}>
              Trusted by Top Brands
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 2, sm: 5 },
                flexWrap: 'wrap',
                mt: 2,
              }}
            >
              <Box component="img" src="/images/HP Logo.png " alt="HP" sx={{ height: { xs: 28, sm: 40 }, maxWidth: '80px', opacity: 0.8, width: 'auto' }} />
              <Box component="img" src="/images/Dell Logo.png" alt="Dell" sx={{ height: { xs: 24, sm: 34 }, maxWidth: '70px', opacity: 0.8, width: 'auto' }} />
              <Box component="img" src="/images/Lenovo Logo.png" alt="Lenovo" sx={{ height: { xs: 22, sm: 32 }, maxWidth: '70px', opacity: 0.8, width: 'auto' }} />
              <Box component="img" src="/images/Apple Logo.png" alt="Apple" sx={{ height: { xs: 26, sm: 36 }, maxWidth: '70px', opacity: 0.8, width: 'auto' }} />
              <Box component="img" src="/images/ASUS Logo.png" alt="Asus" sx={{ height: { xs: 18, sm: 28 }, maxWidth: '60px', opacity: 0.8, width: 'auto' }} />
              <Box component="img" src="/images/Acer Logo.png" alt="Acer" sx={{ height: { xs: 20, sm: 30 }, maxWidth: '60px', opacity: 0.8, width: 'auto' }} />
            </Box>
          </Container>
        </div>
      </Fade>
    </Box>
  );
};

export default Home;