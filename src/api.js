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
    console.log('Making request to:', url);
    console.log('Request headers:', headers);
    
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response text:', responseText);

    // Try to parse as JSON
    try {
      const data = responseText ? JSON.parse(responseText) : {};
      
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      
      return data;
    } catch (jsonError) {
      console.error('Failed to parse JSON:', jsonError);
      throw new Error(`Invalid JSON response from server. Status: ${response.status}. Response: ${responseText.substring(0, 200)}`);
    }
  } catch (error) {
    console.error('Request failed:', {
      url,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};
