import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ProductCard } from '../common/ProductCard';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';

export function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    axios
      .get(`http://localhost:8087/api/products/category/${encodeURIComponent(categoryName)}`)
      .then((res) => {
        setProducts(res.data || []);
      })
      .catch((err) => {
        console.error('Error fetching products by category', err);
        setError('Failed to load products for this category.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryName]);

  // Group products by brand
  const groupedByBrand = products.reduce((acc, product) => {
    const brand = product.brand || 'Other';
    if (!acc[brand]) {
      acc[brand] = [];
    }
    acc[brand].push(product);
    return acc;
  }, {});

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* <Header /> */}
      <div className="container py-5 flex-grow-1">
        <h2 className="mb-4">{categoryName}</h2>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          Object.keys(groupedByBrand).length > 0 ? (
            Object.entries(groupedByBrand).map(([brand, brandProducts]) => (
              <div key={brand} className="mb-5">
                <h3 className="mb-3 text-black">{brand}</h3>
                <div
                  className="d-flex gap-3 overflow-auto"
                  style={{ paddingBottom: '1rem', scrollbarWidth: 'thin' }}
                >
                  {brandProducts.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        width: 220,
                        height: 360,
                        flex: '0 0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <ProductCard
                        product={p}
                        imageStyle={{
                          width: '100%',
                          height: 140,
                          objectFit: 'contain',
                          borderRadius: 8,
                        }}
                        titleStyle={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No products found for this category.</p>
          )
        )}
      </div>
      <Footer />
    </div>
  );
}
