import React from 'react';
import { useWishlist } from '../contexts/useWishlist';
import { ProductCard } from '../common/ProductCard';

export function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        <div className="d-flex flex-wrap gap-3 justify-content-start">
          {wishlist.map(product => (
            <div key={product.id} 
              style={{ flex: '0 0 calc(100% / 6 - 1rem)', maxWidth: 'calc(100% / 6 - 1rem)' }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
