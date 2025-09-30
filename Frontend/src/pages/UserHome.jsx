import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Smartphone,
  Laptop,
  Watch,
  Tv,
  Headphones,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { ProductCard } from '../common/ProductCard';
import { Footer } from '../common/Footer';

export function UserHome() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [freshArrivals, setFreshArrivals] = useState([]);
  const [trendingMobiles, setTrendingMobiles] = useState([]);
  const [topPickGadgets, setTopPickGadgets] = useState([]);
  const navigate = useNavigate();

  const categoryIcons = {
    Mobiles: Smartphone,
    Laptops: Laptop,
    'Smart Watches': Watch,
    Televisions: Tv,
    Earphones: Headphones,
  };

  const allowedCategoryNames = [
    'Mobiles',
    'Laptops',
    'Smart Watches',
    'Earphones',
    'Televisions'
  ];

  useEffect(() => {
    axios.get('http://localhost:8087/api/categories')
      .then((res) => {
        const filteredCategories = res.data.filter((category) =>
          allowedCategoryNames.includes(category.name)
        );
        setCategories(filteredCategories);
      })
      .catch(console.error);

    axios.get('http://localhost:8087/api/products')
      .then((res) => {
        const fetchedProducts = res.data;
        setProducts(fetchedProducts);

        // Trending products: 10 random
        const shuffled = [...fetchedProducts].sort(() => 0.5 - Math.random());
        setTrendingProducts(shuffled.slice(0, 10));

        // Fresh arrivals: 10 latest
        const sorted = [...fetchedProducts].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setFreshArrivals(sorted.slice(0, 10));

        // Trending on Mobile: 10 random mobile products
        const mobiles = fetchedProducts.filter(p => p.category === 'Mobiles');
        setTrendingMobiles(mobiles.sort(() => 0.5 - Math.random()).slice(0, 10));

        // Top Pick Gadgets: 10 random from Earphones and Smart Watches
        const gadgets = fetchedProducts.filter(p => 
          p.category === 'Earphones' || p.category === 'Smart Watches');
        setTopPickGadgets(gadgets.sort(() => 0.5 - Math.random()).slice(0, 10));
      })
      .catch(console.error);
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Hero Banner */}
      <div
        className="text-white text-center py-5 position-relative"
        style={{
          background: 'linear-gradient(to right, #2563eb, #7e22ce)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'black',
            opacity: 0.2,
            zIndex: 0,
          }}
        />
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <h1 className="display-4 fw-bold mb-3">Discover Amazing Electronics</h1>
          <p className="lead mx-auto" style={{ maxWidth: '600px', opacity: 0.9 }}>
            From cutting-edge smartphones to powerful laptops, find everything you need at unbeatable prices
          </p>
        </div>
      </div>

      <div className="container py-5">
        {/* Categories Section */}
        <section className="mb-4">
          <div className="d-flex align-items-center mb-4">
            <div
              className="bg-primary bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32 }}
            >
              <Smartphone className="text-primary" size={20} />
            </div>
            <h2 className="h3 m-0">Shop by Category</h2>
          </div>

          <div className="d-flex gap-4 justify-content-center flex-wrap" style={{ marginBottom: '2rem' }}>
            {categories.length === 0 ? (
              <p className="text-muted">No categories available</p>
            ) : (
              categories.map((category) => {
                const IconComponent = categoryIcons[category.name] || Smartphone;
                return (
                  <div
                    key={category.id || category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleCategoryClick(category.name);
                      }
                    }}
                    className="category-card text-center bg-white rounded-4 shadow-sm p-4 cursor-pointer"
                    style={{
                      userSelect: 'none',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      border: '1.5px solid #eaeaea',
                      minHeight: 180,
                      minWidth: 170,
                      maxWidth: 200,
                      height: 180,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(0,0,0,0.08)';
                    }}
                  >
                    <div
                      className="mx-auto mb-3 rounded-circle"
                      style={{
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #eef2ff, #ede9fe)',
                      }}
                    >
                      {IconComponent && <IconComponent className="text-primary" size={36} />}
                    </div>
                    <h5 className="text-secondary m-0" style={{ fontWeight: 500 }}>{category.name}</h5>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Trending Now Section */}
        <section className="mb-5">
          <div className="d-flex align-items-center mb-4">
            <div
              className="bg-warning bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32 }}
            >
              <TrendingUp className="text-warning" size={20} />
            </div>
            <h2 className="h3 m-0">Trending Now</h2>
          </div>

          <div
            className="d-flex gap-3 overflow-auto"
            style={{ paddingBottom: '1rem', scrollbarWidth: 'thin' }}
          >
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  width: 220,
                  height: 360,
                  flex: '0 0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
                onClick={() => handleProductClick(product.id)}
              >
                <ProductCard
                  product={product}
                  imageStyle={{
                    width: '100%',
                    height: 140,
                    objectFit: 'cover',
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
        </section>

        {/* Fresh Arrivals Section */}
        <section>
          <div className="d-flex align-items-center mb-4">
            <div
              className="bg-success bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32 }}
            >
              <Sparkles className="text-success" size={20} />
            </div>
            <h2 className="h3 m-0">Fresh Arrivals</h2>
          </div>

          <div
            className="d-flex gap-3 overflow-auto"
            style={{ paddingBottom: '1rem', scrollbarWidth: 'thin' }}
          >
            {freshArrivals.map((product) => (
              <div
                key={product.id}
                style={{
                  width: 220,
                  height: 360,
                  flex: '0 0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
                onClick={() => handleProductClick(product.id)}
              >
                <ProductCard
                  product={product}
                  imageStyle={{
                    width: '100%',
                    height: 140,
                    objectFit: 'cover',
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
        </section>

        {/* Trending on Mobile */}
        <section className="mt-5">
          <div className="d-flex align-items-center mb-4">
            <div
              className="bg-primary bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32 }}
            >
              <Smartphone className="text-primary" size={20} />
            </div>
            <h2 className="h3 m-0">Trending on Mobile</h2>
          </div>

          <div
            className="d-flex gap-3 overflow-auto"
            style={{ paddingBottom: '1rem', scrollbarWidth: 'thin' }}
          >
            {products
              .filter((p) => p.category === 'Mobiles')
              .sort(() => 0.5 - Math.random())
              .slice(0, 10)
              .map((product) => (
                <div
                  key={product.id}
                  style={{
                    width: 220,
                    height: 360,
                    flex: '0 0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleProductClick(product.id)}
                >
                  <ProductCard
                    product={product}
                    imageStyle={{
                      width: '100%',
                      height: 140,
                      objectFit: 'cover',
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
        </section>

        {/* Top Pick Gadgets */}
        <section className="mt-5">
          <div className="d-flex align-items-center mb-4">
            <div
              className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32 }}
            >
              <Headphones className="text-secondary" size={20} />
            </div>
            <h2 className="h3 m-0">Top Pick Gadgets</h2>
          </div>

          <div
            className="d-flex gap-3 overflow-auto"
            style={{ paddingBottom: '1rem', scrollbarWidth: 'thin' }}
          >
            {products
              .filter(
                (p) => p.category === 'Earphones' || p.category === 'Smart Watches'
              )
              .sort(() => 0.5 - Math.random())
              .slice(0, 10)
              .map((product) => (
                <div
                  key={product.id}
                  style={{
                    width: 220,
                    height: 360,
                    flex: '0 0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleProductClick(product.id)}
                >
                  <ProductCard
                    product={product}
                    imageStyle={{
                      width: '100%',
                      height: 140,
                      objectFit: 'cover',
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
        </section>
      </div>

      <Footer />
    </div>
  );
}
