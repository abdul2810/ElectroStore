import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    Star,
    ArrowLeft,
    Truck,
    Shield,
    RotateCcw
} from 'lucide-react';
import axios from 'axios';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { ProductCard } from '../common/ProductCard';
import { useCart } from '../contexts/useCart';

export function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8087/api/products/${id}`)
                .then(res => {
                    const fetchedProduct = res.data;
                    setProduct(fetchedProduct);
                    if (fetchedProduct?.category) {
                        axios
                            .get(`http://localhost:8087/api/products/category/${encodeURIComponent(fetchedProduct.category)}`)
                            .then(r2 => {
                                const filtered = r2.data.filter(p => p.id !== fetchedProduct.id);
                                // Shuffle the filtered array
                                const shuffled = filtered.sort(() => 0.5 - Math.random());
                                // Take first 5 related products after shuffling
                                setRelatedProducts(shuffled.slice(0, 5));
                            })
                            .catch(err => console.error('Error fetching related', err));
                    }
                })
                .catch(err => {
                    console.error('Error fetching product', err);
                });
        }
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            navigate('/cart'); // Redirect to cart after adding
        }
    };

    const handleBuyNow = () => {
        if (product) navigate(`/buy-now/${product.id}`);
    };

    if (!product) {
        return (
            <div className="min-vh-100 bg-light d-flex flex-column">
                <Header />
                <main className="container py-5 flex-grow-1 d-flex justify-content-center align-items-center">
                    <p className="text-center text-muted">Product not found</p>
                </main>
                <Footer />
            </div>
        );
    }

    const discount = product.offerPrice
        ? Math.round(
            ((product.actualPrice - product.offerPrice) / product.actualPrice) * 100
        )
        : 0;
    const showcaseImgs = Array.isArray(product.showcaseImages) ? product.showcaseImages : [];
    const allImages = [product.image, ...showcaseImgs];

    return (
        <div className="min-vh-100 bg-light d-flex flex-column">
            {/* <Header /> */}
            <main className="container py-5 flex-grow-1">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-link text-primary mb-4 d-flex align-items-center gap-2"
                    type="button"
                >
                    <ArrowLeft size={20} />
                    Back to Products
                </button>
                <div className="card shadow-lg rounded-lg overflow-hidden">
                    <div className="row g-4 p-4">
                        {/* Product Images */}
                        <div className="col-12 col-lg-6">
                            <div className="position-relative">
                                <img
                                    src={allImages[currentImageIndex]}
                                    alt={product.name}
                                    className="rounded shadow"
                                    style={{
                                        width: '100%',
                                        maxWidth: '400px',
                                        height: 'auto',
                                        maxHeight: '450px',
                                        objectFit: 'contain',
                                        margin: '0 auto',
                                        display: 'block'
                                    }}
                                />
                                {discount > 0 && (
                                    <span className="position-absolute top-0 start-0 bg-success text-white px-3 py-1 rounded-bottom fw-semibold">
                                        {discount}% OFF
                                    </span>
                                )}
                            </div>
                            {/* Thumbnail Images */}
                            {allImages.length > 1 && (
                                <div className="d-flex gap-2 mt-3 flex-wrap">
                                    {allImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`border rounded overflow-hidden p-0 ${currentImageIndex === index ? 'border-primary' : 'border-secondary'
                                                }`}
                                            style={{ width: '80px', height: '80px' }}
                                            type="button"
                                        >
                                            <img
                                                src={image}
                                                alt=""
                                                className="w-100 h-100 object-fit-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Product Info */}
                        <div className="col-12 col-lg-6 d-flex flex-column justify-content-between">
                            <div>
                                <h1 className="h2 fw-bold text-dark">{product.name}</h1>
                                <p className="text-muted fs-5">{product.brand}</p>
                                {product.rating && (
                                    <div className="d-flex align-items-center my-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={20}
                                                className={
                                                    i < Math.floor(product.rating)
                                                        ? 'text-warning'
                                                        : 'text-secondary'
                                                }
                                            />
                                        ))}
                                        <span className="ms-2 text-muted">
                                            ({product.rating}/5)
                                        </span>
                                    </div>
                                )}
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <span className="fs-3 fw-bold text-dark">
                                        ₹{(product.offerPrice || product.actualPrice).toLocaleString()}
                                    </span>
                                    {product.offerPrice && (
                                        <span className="fs-5 text-muted text-decoration-line-through">
                                            ₹{product.actualPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                {product.description && (
                                    <>
                                        <h3 className="fw-semibold text-dark mb-2">Description</h3>
                                        <p className="text-muted">{product.description}</p>
                                    </>
                                )}
                                {(product.ram || product.storage || product.displaySize || product.camera || product.battery || product.processor) && (
                                    <>
                                        <h3 className="fw-semibold text-dark mb-2 mt-4">Specifications</h3>
                                        <div className="row">
                                            {product.ram && (
                                                <SpecBox label="RAM" value={product.ram} />
                                            )}
                                            {product.storage && (
                                                <SpecBox label="External Storage" value={product.storage} />
                                            )}
                                            {product.displaySize && (
                                                <SpecBox label="Display Size" value={product.displaySize} />
                                            )}
                                            {product.camera && (
                                                <SpecBox label="Camera" value={product.camera} />
                                            )}
                                            {product.battery && (
                                                <SpecBox label="Battery" value={product.battery} />
                                            )}
                                            {product.processor && (
                                                <SpecBox label="Processor" value={product.processor} />
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                            {/* Action Buttons */}
                            <div className="mt-4">
                                <div className="d-flex gap-3 mb-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!product.inStock}
                                        className="btn btn-warning flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                        type="button"
                                    >
                                        <ShoppingCart size={20} />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={!product.inStock}
                                        className="btn btn-primary flex-grow-1"
                                        type="button"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                            {/* Features */}
                            <div className="row text-center text-muted mt-5 border-top pt-4">
                                <div className="col">
                                    <Truck size={32} className="text-success mb-2" />
                                    <p className="small mb-0">Free Delivery</p>
                                </div>
                                <div className="col">
                                    <Shield size={32} className="text-primary mb-2" />
                                    <p className="small mb-0">1 Year Warranty</p>
                                </div>
                                <div className="col">
                                    <RotateCcw size={32} className="text-purple mb-2" />
                                    <p className="small mb-0">7 Day Return</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Related Products */}

                {relatedProducts.length > 0 && (
                    <section className="mt-5">
                        <h2 className="h4 fw-bold text-dark mb-4">Relevant Products</h2>
                        <div
                            className="d-flex gap-3 overflow-auto"
                            style={{
                                paddingBottom: '1rem',
                                scrollbarWidth: 'thin'
                            }}
                        >
                            {relatedProducts.map((relatedProduct) => (
                                <div
                                    key={relatedProduct.id}
                                    style={{
                                        width: 220,
                                        flex: '0 0 auto'
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="p-0 border-0 bg-transparent w-100 text-start"
                                        onClick={() => navigate(`/product/${relatedProduct.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <ProductCard
                                            product={{
                                                ...relatedProduct,
                                                image:
                                                    relatedProduct.image ||
                                                    (relatedProduct.showcaseImages &&
                                                        relatedProduct.showcaseImages[0]) ||
                                                    ''
                                            }}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </main>
            <Footer />
        </div>
    );
}

// Small reusable component for specs
function SpecBox({ label, value }) {
    return (
        <div className="col-6 bg-light p-3 rounded mb-3">
            <small className="text-muted">{label}</small>
            <p className="fw-medium mb-0">{value}</p>
        </div>
    );
}
