import React, { useEffect, useState } from 'react';
import { Package, Calendar, MapPin, CreditCard, X } from 'lucide-react';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import axios from 'axios';
import { toast } from 'react-toastify'; // For success/fail messages
import { useAuth } from '../contexts/useAuth';

// Status calculation function
const getStatus = (orderDate, deliveryDays) => {
  const diff = Math.floor((new Date() - new Date(orderDate)) / (1000 * 60 * 60 * 24));
  if (diff >= deliveryDays) return "Delivered";
  if (diff === deliveryDays - 1) return "Out for Delivery";
  if (deliveryDays >= 6 && diff === 3) return "Ready to Dispatch";
  if (deliveryDays === 5 && diff === 2) return "Ready to Dispatch";
  if (deliveryDays === 4 && diff === 1) return "Ready to Dispatch";
  if ((deliveryDays >= 6 && diff < 3) || (deliveryDays === 5 && diff < 2) || (deliveryDays === 4 && diff < 1))
    return "Packing";
  return "In Transit";
};

export function Orders() {
  const { user } = useAuth();
  const [userOrders, setUserOrders] = useState([]);

  // Fetch orders from backend
  const loadOrders = () => {
    axios.get(`http://localhost:8087/api/orders/my`, { withCredentials: true })
      .then(res => setUserOrders(res.data || []))
      .catch(err => {
        console.error("Error fetching orders:", err);
        setUserOrders([]);
      });
  };

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    } else {
      setUserOrders([]); // Clear orders if no user logged in
    }
  }, [user]);

  // Cancel order
  const handleCancel = async (orderIndex) => {
    const confirmCancel = window.confirm("Do you really want to cancel this order?");
    if (!confirmCancel) return;

    try {
      await axios.delete(
        `http://localhost:8087/api/orders/my/${orderIndex}`,
        { withCredentials: true }
      );
      toast.success("Order cancelled successfully!");
      loadOrders(); // Refresh after cancel
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error("Failed to cancel order.");
    }
  };

  // No orders UI
  if (!userOrders || userOrders.length === 0) {
    return (
      <div className="min-vh-100 bg-light d-flex flex-column">
        <main className="container py-5 flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <Package size={96} className="text-secondary mb-4" />
            <h2 className="h3 fw-bold text-dark mb-3">No orders yet</h2>
            <p className="text-muted mb-4">Start shopping to see your orders here</p>
          </div>
        </main>
      </div>
    );
  }

  // Orders list UI
  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <main className="container py-5 flex-grow-1">
        <h1 className="mb-4 fw-bold text-dark">My Orders</h1>
        <div className="d-flex flex-column gap-4">
          {userOrders.map((order, index) => (
            <div key={index} className="card shadow-sm">
              <div className="card-body">

                {/* Product info */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={order.productImage}
                      alt={order.productName}
                      className="rounded me-3"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 className="h5 fw-semibold mb-1 text-dark">{order.productName}</h3>
                      <p className="text-muted mb-1">{order.productBrand}</p>
                      <span className="fw-bold fs-5 text-dark">
                        ₹{order.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Cancel button */}
                  <button
                    onClick={() => handleCancel(index)}
                    className="btn btn-outline-danger p-2"
                    title="Cancel Order"
                    type="button"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Order details */}
                <div className="row text-muted small mb-3">
                  <div className="col-md-4 d-flex align-items-center gap-2">
                    <Calendar size={16} />
                    <span>Ordered on {new Date(order.orderDate).toLocaleDateString()}</span>
                  </div>
                  <div className="col-md-4 d-flex align-items-center gap-2 text-truncate">
                    <MapPin size={16} />
                    <span className="text-truncate">{order.address}</span>
                  </div>
                  <div className="col-md-4 d-flex align-items-center gap-2 text-capitalize">
                    <CreditCard size={16} />
                    <span>{order.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Status badge */}
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small text-muted">Order Status</span>
                    <span className="badge bg-success text-wrap px-3 py-1 fw-medium">
                      {getStatus(order.orderDate, order.deliveryDays)}
                    </span>
                  </div>
                  {order.deliveryDate && (
                    <div className="small text-muted mt-1">
                      Expected Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
