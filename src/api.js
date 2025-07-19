const isProduction = process.env.NODE_ENV === 'production';
const API_BASE_URL = isProduction 
  ? 'https://unitech-backend.onrender.com'  // Your Render backend URL
  : 'http://localhost:5001';

export const api = {
  // Base URL
  baseUrl: API_BASE_URL,

  // Auth endpoints
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`,
  forgotPassword: `${API_BASE_URL}/api/auth/forgot-password`,
  verifyOTP: `${API_BASE_URL}/api/auth/verify-otp`,
  resetPassword: `${API_BASE_URL}/api/auth/reset-password-with-otp`,
  
  // User endpoints
  getUserProfile: `${API_BASE_URL}/api/users/me`,
  updateUserProfile: `${API_BASE_URL}/api/users/update-profile`,
  
  // Order endpoints
  getOrder: (orderId) => `${API_BASE_URL}/api/orders/${orderId}`,
  getMyOrders: `${API_BASE_URL}/api/orders/me`,
  createOrder: `${API_BASE_URL}/api/orders`,
  
  // Product endpoints
  getProducts: `${API_BASE_URL}/api/products`,
  getProduct: (productId) => `${API_BASE_URL}/api/products/${productId}`,
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Important for cookies/sessions
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', { status: response.status, text });
      throw new Error('Received non-JSON response from server');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', { url, error });
    throw error;
  }
};
