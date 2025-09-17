import React, { useState, useEffect } from 'react';
import { WishlistContext } from './WishlistContext';
import { useAuth } from './useAuth'; // adjust path

export function WishlistProvider({ children }) {
    const { user, loading } = useAuth();
    const userId = user?.id || 'guest';

    const [wishlist, setWishlist] = useState([]);

    // Load wishlist whenever user changes
    //   useEffect(() => {
    //     try {
    //       const stored = localStorage.getItem(`wishlist_${userId}`);
    //       setWishlist(stored ? JSON.parse(stored) : []);
    //     } catch {
    //       setWishlist([]);
    //     }
    //   }, [userId]);

    useEffect(() => {
        if (!loading) {
            try {
                const stored = localStorage.getItem(`wishlist_${userId}`);
                setWishlist(stored ? JSON.parse(stored) : []);
            } catch {
                setWishlist([]);
            }
        }
    }, [userId, loading]);


    // Save wishlist to localStorage
    //   useEffect(() => {
    //     localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlist));
    //   }, [wishlist, userId]);

      function addToWishlist(product) {
        if (!wishlist.find(p => p.id === product.id)) {
          setWishlist([product, ...wishlist]);
        }
      }

    useEffect(() => {
        if (!loading) {
            localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlist));
        }
    }, [wishlist, userId, loading]);


    function removeFromWishlist(productId) {
        setWishlist(wishlist.filter(p => p.id !== productId));
    }

    function isWishlisted(productId) {
        return wishlist.some(p => p.id === productId);
    }

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
}
