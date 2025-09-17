import React, { useState, useEffect } from 'react';
import { Package, User, CreditCard, MapPin, Calendar } from 'lucide-react';

export function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const globalOrders = JSON.parse(localStorage.getItem('globalOrders') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    setOrders(globalOrders);
    setUsers(allUsers);
  }, []);

  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  const getTotalOrderAmount = () => {
    return orders.reduce((total, order) => total + order.totalPrice, 0);
  };

  if (orders.length === 0) {
    return (
      <div className="p-4">
        <div className="d-flex align-items-center mb-4">
          <div className="bg-success p-2 rounded me-3">
            <Package size={24} className="text-white" />
          </div>
          <h2 className="h4 mb-0 text-dark">User Orders</h2>
        </div>
        
        <div className="text-center">
          <Package size={96} className="text-muted mb-3" />
          <h3 className="h5 mb-2">No orders yet</h3>
          <p className="text-muted">Orders from users will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div className="bg-success p-2 rounded me-3">
            <Package size={24} className="text-white" />
          </div>
          <h2 className="h4 mb-0 text-dark">User Orders</h2>
        </div>
        
        <div className="bg-primary bg-opacity-10 px-3 py-2 rounded">
          <small className="text-muted d-block">Total Revenue</small>
          <strong className="text-primary fs-5">₹{getTotalOrderAmount().toLocaleString()}</strong>
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        {orders.map((order) => {
          const user = getUserById(order.userId);
          return (
            <div key={order.id} className="border rounded p-3 shadow-sm hover-shadow">
              <div className="row g-3">
                {/* Order Details */}
                <div className="col-12 col-lg-6 d-flex">
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="me-3 rounded"
                    style={{ width: 64, height: 64, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{order.product.name}</h5>
                    <p className="mb-2 text-muted small">{order.product.brand}</p>
                    
                    <div className="d-flex flex-column gap-1 small text-secondary">
                      <div className="d-flex align-items-center">
                        <User size={16} className="me-2" />
                        <span>{user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <Calendar size={16} className="me-2" />
                        <span>{new Date(order.orderDate).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div className="d-flex align-items-center text-capitalize">
                        <CreditCard size={16} className="me-2" />
                        <span>{order.paymentMethod.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="col-12 col-lg-6 d-flex flex-column justify-content-between">
                  <div className="d-flex align-items-start mb-3">
                    <MapPin size={16} className="me-2 text-muted flex-shrink-0 mt-1" />
                    <p className="mb-0 small text-muted">{order.address}</p>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-light rounded p-3 text-end">
                    <h6 className="mb-3">Order Summary</h6>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Product Price:</span>
                      <span>₹{order.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between small mb-2">
                      <span>Delivery:</span>
                      <span className="text-success">Free</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fw-semibold">
                      <span>Total Amount:</span>
                      <span className="fs-5">₹{order.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="mt-3">
                      <span className="badge bg-success text-uppercase small">Order Confirmed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
