const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

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

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};
