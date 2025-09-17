import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CartContext from './CartContext';
import { AuthContext } from './AuthContext';

const BASE_URL = 'http://localhost:8087';

function getAnonymousUserId() {
  let id = sessionStorage.getItem('anonymousUserId');
  if (!id) {
    id = crypto?.randomUUID?.() || 'anon-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('anonymousUserId', id);
  }
  return id;
}

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const userIdForCart = user?.id || getAnonymousUserId();

  useEffect(() => {
    const cartSwitch = localStorage.getItem('cartSwitchRequired') === 'true';
    const config = { headers: { Accept: 'application/json' }, withCredentials: true };

    if (cartSwitch) {
      setCart([]);
      localStorage.removeItem('cartSwitchRequired');
    }

    axios.get(`${BASE_URL}/api/cart/${userIdForCart}`, config)
      .then(res => setCart(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCart([]));
  }, [userIdForCart]);

  useEffect(() => {
    const config = { headers: { Accept: 'application/json' }, withCredentials: true };

    if (user?.id) {
      axios.get(`${BASE_URL}/api/orders/my`, config)
        .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
        .catch(() => setOrders([]));
    } else {
      setOrders([]);
    }
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    const existing = cart.find(item => item.product.id === product.id);
    const newQuantity = existing ? Math.min(existing.quantity + quantity, 5) : quantity;

    try {
      const res = await axios.post(
        `${BASE_URL}/api/cart/${userIdForCart}`,
        null,
        {
          params: { productId: product.id, quantity: newQuantity },
          headers: { Accept: 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data?.id) {
        setCart(prev => {
          const others = prev.filter(item => item.product.id !== product.id);
          return [...others, res.data];
        });
      }
    } catch (e) {
      console.error('Add to cart failed', e.response?.data || e.message || e);
    }
  };

  const removeFromCart = async (cartItemId) => {
    const item = cart.find(i => i.id === cartItemId);
    if (!item) return;

    try {
      await axios.delete(`${BASE_URL}/api/cart/${userIdForCart}/${item.id}`, { withCredentials: true });
      setCart(prev => prev.filter(i => i.id !== cartItemId));
    } catch (e) {
      console.error('Remove from cart failed', e.response?.data || e.message || e);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1 || quantity > 5) return;
    const item = cart.find(i => i.id === cartItemId);
    if (!item) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/api/cart/${userIdForCart}`,
        null,
        {
          params: { productId: item.product.id, quantity },
          headers: { Accept: 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data?.id) {
        setCart(prev => prev.map(i => (i.id === cartItemId ? res.data : i)));
      }
    } catch (e) {
      console.error('Update quantity failed', e.response?.data || e.message || e);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/${userIdForCart}`, { withCredentials: true });
      setCart([]);
    } catch (e) {
      console.error('Clear cart failed', e.response?.data || e.message || e);
    }
  };

  const getCartTotal = () =>
    cart.reduce(
      (sum, item) =>
        sum + (item.product.offerPrice || item.product.actualPrice) * item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
