import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Smartphone, CheckCircle, ArrowLeft } from 'lucide-react';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import axios from 'axios';
import { useCart } from '../contexts/useCart';

export function BuyNow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const [products, setProducts] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [tempAddress, setTempAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    cvv: '',
    cardType: ''
  });
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8087/api/products/${id}`)
        .then(res => setProducts([res.data]))
        .catch(err => console.error('Error fetching product:', err));
    } else {
      setProducts(cart.map(item => item.product)); // ✅ Normalize cart data
    }

    if (currentUser?.id) {
      axios
        .get(`http://localhost:8087/api/auth/users/${currentUser.id}/addresses`, { withCredentials: true })
        .then(res => setSavedAddresses(res.data || []))
        .catch(err => console.error('Error fetching addresses:', err));
    }
  }, [id, cart]);

  const handlePaymentMethodChange = (method) => {
    if (method !== paymentMethod) {
      setPaymentMethod(method);
      setIsPaymentVerified(false);
      setPaymentError('');
    }
  };

  const detectCardType = (cardNumber) => {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5' || firstDigit === '2') return 'MasterCard';
    if (firstDigit === '6') return 'RuPay';
    return 'Unknown';
  };

  const handleCardNumberChange = (value) => {
    const cleanValue = value.replace(/\D/g, '').slice(-4);
    setPaymentDetails(prev => ({
      ...prev,
      cardNumber: cleanValue,
      cardType: detectCardType(cleanValue)
    }));
  };

  const isValidUpi = (upiId) => /^[\w.-]+@[\w.-]+$/.test(upiId);

  const verifyPayment = () => {
    if (paymentMethod === 'upi') {
      if (isValidUpi(paymentDetails.upiId)) {
        setIsPaymentVerified(true);
        setPaymentError('');
      } else {
        setPaymentError('Invalid UPI ID');
      }
    } else if (paymentMethod === 'card') {
      if (paymentDetails.cardNumber && paymentDetails.cvv.length === 3) {
        setIsPaymentVerified(true);
        setPaymentError('');
      } else {
        setPaymentError('Enter valid card details');
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!tempAddress.trim()) {
      alert("Please enter delivery address");
      return;
    }

    let finalAddress = tempAddress;

    if (selectedAddressIndex === null && currentUser?.id) {
      try {
        await axios.post(
          `http://localhost:8087/api/auth/users/${currentUser.id}/addresses`,
          JSON.stringify(tempAddress),
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );

        const updated = await axios.get(
          `http://localhost:8087/api/auth/users/${currentUser.id}/addresses`,
          { withCredentials: true }
        );
        setSavedAddresses(updated.data || []);
      } catch (err) {
        console.error("Error saving new address:", err);
      }
    }

    try {
      for (let p of products) {
        await axios.post(
          `http://localhost:8087/api/auth/users/${currentUser.id}/orders`,
          {
            productName: p.name,
            productBrand: p.brand,
            productImage: p.image,
            totalPrice: p.offerPrice || p.actualPrice,
            address: finalAddress,
            paymentMethod: paymentMethod
          },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
      }

      setShowSuccess(true);
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place the order. Please try again.");
    }
  };

  if (showSuccess) {
    return (
      <div className="min-vh-100 bg-light d-flex flex-column">

        <main className="container py-5 flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="bg-white rounded shadow p-5 text-center" style={{ maxWidth: 400 }}>
            <CheckCircle className="text-success mb-4" size={64} />
            <h2 className="fw-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-secondary mb-0">Thank you for your purchase. Redirecting to orders...</p>
          </div>
        </main>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-vh-100 bg-light d-flex flex-column">
        <main className="container py-5 flex-grow-1 d-flex align-items-center justify-content-center">
          <p className="text-muted">No product(s) found for checkout</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <main className="container py-4 flex-grow-1">
        <button
          type="button"
          className="btn btn-link text-primary mb-4 d-flex align-items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="me-2" /> Back
        </button>

        <div className="bg-white rounded shadow overflow-hidden p-4">
          <h1 className="h3 fw-bold mb-4">Complete Your Purchase</h1>

          {products.map(product => (
            <div key={product.id} className="border-bottom pb-3 mb-3 d-flex align-items-center">
              <img src={product.image} alt={product.name} className="rounded me-3" style={{ width: 80, height: 80, objectFit: 'cover' }} />
              <div>
                <h3 className="h6 fw-semibold mb-1">{product.name}</h3>
                <p className="text-muted mb-1">{product.brand}</p>
                <div className="d-flex align-items-baseline gap-2">
                  <span className="fw-bold fs-5">₹{(product.offerPrice ?? product.actualPrice ?? 0).toLocaleString()}</span>
                  {product.offerPrice && <small className="text-muted text-decoration-line-through">₹{(product.actualPrice ?? 0).toLocaleString()}</small>}
                </div>
              </div>
            </div>
          ))}

          {/* Address Section */}
          <div className="mb-4">
            <h2 className="h5 fw-semibold mb-3">Delivery Address</h2>
            {savedAddresses.length > 0 && (
              <div className="mb-3">
                <strong>Saved Addresses:</strong>
                {savedAddresses.map((addr, idx) => (
                  <div key={`addr-${idx}`} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="addr"
                      id={`addr-${idx}`}
                      checked={selectedAddressIndex === idx}
                      onChange={() => {
                        setSelectedAddressIndex(idx);
                        setTempAddress(addr);
                      }}
                    />
                    <label className="form-check-label" htmlFor={`addr-${idx}`}>{addr}</label>
                  </div>
                ))}
                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="addr"
                    id="addr-new"
                    checked={                    selectedAddressIndex === null}
                    onChange={() => {
                      setSelectedAddressIndex(null);
                      setTempAddress('');
                    }}
                  />
                  <label className="form-check-label" htmlFor="addr-new">
                    Use new address
                  </label>
                </div>
              </div>
            )}
            <textarea
              className="form-control mb-2"
              rows={3}
              placeholder="Enter your delivery address"
              value={tempAddress}
              onChange={e => setTempAddress(e.target.value)}
              aria-label="Enter delivery address"
            />
          </div>

          {/* Payment Section */}
          <div className="mb-4">
            <h2 className="h5 fw-semibold mb-3">Mode of Payment</h2>

            {/* Cash on Delivery */}
            <div
              onClick={() => handlePaymentMethodChange('cod')}
              className={`border rounded p-3 mb-3 cursor-pointer ${paymentMethod === 'cod' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}`}
            >
              <div className="form-check d-flex align-items-center">
                <input className="form-check-input me-2" type="radio" checked={paymentMethod === 'cod'} readOnly />
                <label className="form-check-label fw-medium">Cash on Delivery</label>
              </div>
            </div>

            {/* UPI */}
            <div
              onClick={() => handlePaymentMethodChange('upi')}
              className={`border rounded p-3 mb-3 cursor-pointer ${paymentMethod === 'upi' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}`}
            >
              <div className="form-check d-flex align-items-center mb-2">
                <input className="form-check-input me-2" type="radio" checked={paymentMethod === 'upi'} readOnly />
                <Smartphone size={20} className="me-2" />
                <label className="form-check-label fw-medium">UPI (GPay, PhonePe, Paytm)</label>
              </div>
              {paymentMethod === 'upi' && (
                <div className="d-flex gap-2" onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    placeholder="Enter UPI ID"
                    value={paymentDetails.upiId}
                    onChange={e => setPaymentDetails(prev => ({ ...prev, upiId: e.target.value }))}
                    className="form-control"
                    aria-label="Enter UPI ID"
                  />
                  <button type="button" className="btn btn-primary" onClick={e => { e.stopPropagation(); verifyPayment(); }}>
                    Verify
                  </button>
                </div>
              )}
              {paymentError && paymentMethod === 'upi' && (
                <small className="text-danger mt-1 d-block">{paymentError}</small>
              )}
              {isPaymentVerified && paymentMethod === 'upi' && (
                <div className="text-success mt-2 d-flex align-items-center">
                  <CheckCircle size={16} className="me-1" />
                  <small>UPI ID verified</small>
                </div>
              )}
            </div>

            {/* Card */}
            <div
              onClick={() => handlePaymentMethodChange('card')}
              className={`border rounded p-3 mb-3 cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}`}
            >
              <div className="form-check d-flex align-items-center mb-2">
                <input className="form-check-input me-2" type="radio" checked={paymentMethod === 'card'} readOnly />
                <CreditCard size={20} className="me-2" />
                <label className="form-check-label fw-medium">Debit/Credit Card</label>
              </div>
              {paymentMethod === 'card' && (
                <div onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    placeholder="Enter last 4 digits of card"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    className="form-control mb-2"
                    maxLength={4}
                    aria-label="Enter last 4 digits of card"
                  />
                  {paymentDetails.cardType && (
                    <small className="text-muted d-block mb-2">
                      Card Type: {paymentDetails.cardType}
                    </small>
                  )}
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      placeholder="CVV"
                      value={paymentDetails.cvv}
                      onChange={e => setPaymentDetails(prev => ({
                        ...prev,
                        cvv: e.target.value.replace(/\D/g, '').slice(0, 3)
                      }))}
                      className="form-control"
                      maxLength={3}
                      aria-label="Enter CVV"
                    />
                    <button type="button" className="btn btn-primary" onClick={e => { e.stopPropagation(); verifyPayment(); }}>
                      Verify
                    </button>
                  </div>
                  {paymentError && paymentMethod === 'card' && (
                    <small className="text-danger mt-1 d-block">{paymentError}</small>
                  )}
                  {isPaymentVerified && paymentMethod === 'card' && (
                    <div className="text-success mt-2 d-flex align-items-center">
                      <CheckCircle size={16} className="me-1" />
                      <small>Card details verified</small>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={!tempAddress.trim() || !paymentMethod || (paymentMethod !== 'cod' && !isPaymentVerified)}
            onClick={handlePlaceOrder}
            className="btn btn-success w-100 fw-semibold"
          >
            Complete Purchase
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}