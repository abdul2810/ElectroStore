import React from 'react';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { useCart } from '../contexts/useCart';
import { useNavigate } from 'react-router-dom'; // ✅ Added for navigation

export function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate(); // ✅ Initialize navigation

  // Summary calculations
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + ((item.product?.actualPrice ?? 0) * (item.quantity ?? 0)),
    0
  );
  const totalOfferPrice = cart.reduce(
    (sum, item) =>
      sum + (((item.product?.offerPrice ?? item.product?.actualPrice) ?? 0) * (item.quantity ?? 0)),
    0
  );
  const totalDiscount = totalPrice - totalOfferPrice;

  if (cart.length === 0) {
    return (
      <>
        {/* <Header /> */}
        <div className="container py-5 text-center">
          <h2 className="fw-bold text-dark">Your cart is empty</h2>
          <p className="text-muted">Add items to it now.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* <Header /> */}
      <div className="bg-light min-vh-100 py-4">
        <div className="container d-flex flex-column flex-lg-row gap-4">
          {/* Product List */}
          <section className="flex-grow-1">
            {cart.map((item) => {
              const product = item.product;
              return (
                <div key={item.id} className="bg-white rounded-3 shadow-sm mb-4 p-3 d-flex flex-row align-items-center gap-3">
                  {/* Product Image */}
                  <img
                    src={product?.image || ''}
                    alt={product?.name}
                    className="rounded-2"
                    style={{ width: 100, height: 100, objectFit: 'cover', background: '#fafafa' }}
                  />

                  {/* Product Info */}
                  <div className="flex-grow-1">
                    <div>
                      <span className="fw-semibold">{product?.name}</span>
                    </div>
                    <div className="text-secondary small py-1">
                      Seller: {product?.brand || 'Assured Brand'} <span className="badge bg-info text-dark ms-1">Assured</span>
                    </div>
                    <div>
                      <span className="fw-bold fs-5 text-dark">
                        ₹{(product?.offerPrice ?? product?.actualPrice)?.toLocaleString()}
                      </span>
                      {product?.offerPrice && (
                        <>
                          <span className="text-muted text-decoration-line-through ms-2">
                            ₹{product?.actualPrice?.toLocaleString()}
                          </span>
                          <span className="ms-2 text-success fw-semibold">
                            {Math.round(
                              ((product.actualPrice - product.offerPrice) / product.actualPrice) * 100
                            )}
                            % Off
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="d-flex flex-column align-items-center gap-2">
                    <div className="d-flex align-items-center border rounded-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        type="button"
                      >
                        −
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled={item.quantity >= 5}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                    <div className="mt-2">
                      <button
                        className="btn btn-link text-danger btn-sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Price Summary */}
          <aside style={{ minWidth: 320 }}>
            <div className="bg-white rounded-3 shadow-sm p-4">
              <h4 className="mb-4 fw-bold text-dark">PRICE DETAILS</h4>
              <div className="d-flex justify-content-between small mb-2">
                <span>Price ({totalItems} items)</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between small mb-2 text-success">
                <span>Discount</span>
                <span>- ₹{totalDiscount.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between small mb-2 text-success">
                <span>Buy more & save more</span>
                <span>- ₹0</span>
              </div>
              <div className="d-flex justify-content-between small mb-2 text-success">
                <span>Coupons for you</span>
                <span>- ₹0</span>
              </div>
              <div className="d-flex justify-content-between small mb-2">
                <span>Protect Promise Fee</span>
                <span>₹0</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 mb-2">
                <span>Total Amount</span>
                <span>₹{totalOfferPrice.toLocaleString()}</span>
              </div>
              <div className="text-success small mb-3">
                You will save ₹{totalDiscount.toLocaleString()} on this order
              </div>
              <button
                className="btn btn-primary w-100 fw-semibold"
                onClick={() => navigate('/buy-now')} // ✅ Redirect to BuyNow
              >
                Proceed to Checkout
              </button>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}