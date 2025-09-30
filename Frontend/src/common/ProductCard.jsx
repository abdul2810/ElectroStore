import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/useCart';
import { useWishlist } from '../contexts/useWishlist';


export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();

  const discount = product.offerPrice
    ? Math.round(((product.actualPrice - product.offerPrice) / product.actualPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const wishlisted = isWishlisted(product.id);

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div
      onClick={handleProductClick}
      className="card h-100 shadow-sm position-relative"
      style={{ cursor: 'pointer' }}
    >
      {/* Wishlist Button */}
      <button
        type="button"
        className="btn btn-light position-absolute top-0 end-0 m-2 p-2"
        style={{
          borderRadius: '50%',
          zIndex: 2,
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}
        onClick={handleWishlist}
        aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart size={20} fill={wishlisted ? 'red' : 'none'} color={wishlisted ? 'red' : '#888'} />
      </button>

      <div
        className="position-relative overflow-hidden d-flex align-items-center justify-content-center"
        style={{
          width: '180px',
          height: '180px',
          margin: '0 auto',
          background: '#f6f8fa',
          borderRadius: '12px'
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="card-img-top"
          style={{
            width: '100%',
            height: '80%',
            objectFit: 'contain',
            transition: 'transform 0.3s',
            display: 'block'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        {discount > 0 && (
          <span
            className="position-absolute top-0 start-0 bg-success text-white px-2 py-1 rounded-bottom"
            style={{ fontSize: '0.75rem', fontWeight: '600' }}
          >
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h6
          className="card-title"
          title={product.name}
          style={{
            WebkitLineClamp: 3,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3rem'
          }}
        >
          {product.name}
        </h6>
        <p className="card-subtitle mb-2 text-muted">{product.brand}</p>

        {product.rating && (
          <div className="d-flex align-items-center mb-2">
            <Star className="text-warning me-1" size={16} />
            <small className="text-muted">{product.rating.toFixed(1)}</small>
          </div>
        )}

        <div className="d-flex align-items-baseline mb-3">
          <span className="fs-5 fw-bold">
            ₹{(product.offerPrice || product.actualPrice).toLocaleString()}
          </span>
          {product.offerPrice && (
            <span className="text-muted text-decoration-line-through ms-2">
              ₹{product.actualPrice.toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`btn mt-auto d-flex align-items-center justify-content-center gap-2 ${
            product.inStock ? 'btn-primary' : 'btn-secondary disabled'
          }`}
          type="button"
        >
          <ShoppingCart size={16} />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
