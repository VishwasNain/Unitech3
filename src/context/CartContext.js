import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderHistory, setOrderHistory] = useState([]);

  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity <= 0) {
        removeFromCart(product.id);
      } else {
        setCartItems(prev => 
          prev.map(item => 
            item.id === product.id 
              ? { ...item, quantity: newQuantity } 
              : item
          )
        );
      }
    } else {
      setCartItems(prev => [...prev, { ...product, quantity }]);
    }
    updateTotalPrice();
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const updatedItems = prev.filter(item => item.id !== productId);
      if (updatedItems.length === 0) {
        localStorage.removeItem('cartItems');
      }
      return updatedItems;
    });
    updateTotalPrice();
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
    updateTotalPrice();
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    updateTotalPrice();
  };

  const checkout = async (shippingAddress, paymentMethod) => {
    if (cartItems.length === 0) {
      return Promise.reject(new Error('Cart is empty'));
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock order
      const order = {
        id: `order_${Date.now()}`,
        orderItems: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item.id
        })),
        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.pincode,
          country: 'India',
          state: shippingAddress.state
        },
        paymentMethod: paymentMethod,
        itemsPrice: totalPrice,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: totalPrice,
        isPaid: true,
        paidAt: new Date().toISOString(),
        isDelivered: false,
        createdAt: new Date().toISOString()
      };

      // Add to order history
      setOrderHistory(prev => [order, ...prev]);
      
      // Clear cart after successful order
      clearCart();
      
      return { 
        success: true, 
        message: 'Order placed successfully!',
        order: order
      };
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  };

  const updateTotalPrice = () => {
    setTotalPrice(
      cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    );
  };

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateTotalPrice();
  }, [cartItems]);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        totalPrice, 
        orderHistory,
        addToCart, 
        removeFromCart, 
        updateQuantity,
        clearCart,
        checkout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
