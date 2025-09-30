import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { useCart } from '../contexts/useCart';

export function Search() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [products, setProducts] = useState([]);
  const { } = useCart(); // No wishlist usage

  useEffect(() => {
    if (query.trim()) {
      axios
        .get(`http://localhost:8087/api/products/search?q=${encodeURIComponent(query)}`)
        .then(res => setProducts(res.data || []))
        .catch(err => console.error('Search error:', err));
    } else {
      setProducts([]);
    }
  }, [query]);

  const getDiscount = (actual, offer) => {
    if (!actual || !offer) return 0;
    return Math.round(((actual - offer) / actual) * 100);
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* <Header /> */}

      <main className="container py-4 flex-grow-1">
        <h2 className="fw-bold mb-4">Search Results for: {query}</h2>
        {products.length === 0 ? (
          <p className="text-muted">No products found.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {products.map(product => {
              const discount = getDiscount(product.actualPrice, product.offerPrice);

              return (
                <div
                  key={product.id}
                  className="card flex-row align-items-center p-2 position-relative shadow-sm"
                  style={{ minHeight: 180 }}
                >
                  {/* Primary Product Image */}
                  <Link to={`/product/${product.id}`}>
                    <div
                      style={{
                        width: 120,
                        height: 100,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          maxHeight: '100%',
                          width: 'auto',
                          objectFit: 'contain',
                          borderRadius: 8,
                          display: 'block',
                        }}
                      />
                    </div>
                  </Link>

                  {/* Product Information Center */}
                  <div className="flex-grow-1 px-3">
                    <div className="d-flex align-items-center mb-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="fw-bold fs-5 text-decoration-none text-dark"
                      >
                        {product.name}
                      </Link>
                    </div>
                    <ul className="mb-2 ps-3" style={{ fontSize: 15 }}>
                      {product.storage && <li>{product.storage} ROM</li>}
                      {product.displaySize && (
                        <li>{product.displaySize} Super Retina XDR Display</li>
                      )}
                      {product.camera && (
                        <li>{product.camera}</li>
                      )}
                      {product.processor && (
                        <li>{product.processor}</li>
                      )}
                    </ul>
                  </div>

                  {/* Pricing Details */}
                  <div style={{ minWidth: 140 }} className="text-end">
                    {discount > 0 && (
                      <span className="badge bg-success mb-1">{discount}% OFF</span>
                    )}
                    <h5 className="fw-bold text-dark mb-1" style={{ fontSize: 22 }}>
                      ₹{(product.offerPrice || product.actualPrice).toLocaleString()}
                    </h5>
                    {product.offerPrice && (
                      <span className="text-decoration-line-through text-muted" style={{ fontSize: 16 }}>
                        ₹{product.actualPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}