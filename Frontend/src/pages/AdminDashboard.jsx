import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Eye, Edit3, Trash2 } from 'lucide-react';
import { AddProduct } from '../admin/AddProduct';
import { EditProduct } from '../admin/EditProduct';
import axios from 'axios';

export function AdminDashboard() {
  // ✅ Get admin from localStorage instead of useAuth
  const admin = JSON.parse(localStorage.getItem('currentAdmin'));
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('add-product');

  // State for orders tab
  const [ordersData, setOrdersData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const handleLogout = () => {
    // Clear admin from localStorage
    localStorage.removeItem('currentAdmin');
    navigate('/');
  };

  // ===== Fetch all orders for admin =====
  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8087/api/auth/admin/orders', {
        withCredentials: true
      });
      setOrdersData(res.data.orders || []);
      setTotalRevenue(res.data.totalRevenue || 0);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    }
  };

  // ===== Clear all orders =====
  const handleClearAllOrders = async () => {
    if (!window.confirm('Are you sure you want to clear ALL orders?')) return;
    try {
      await axios.delete('http://localhost:8087/api/auth/admin/orders/clear', {
        withCredentials: true
      });
      setOrdersData([]);
      setTotalRevenue(0);
    } catch (err) {
      console.error('Error clearing orders:', err);
    }
  };

  // Fetch orders when switching to "orders" tab
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  if (!admin) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="h2 fw-bold text-dark mb-4">Access Denied</h2>
          <p className="text-secondary">Please login as admin to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <div className="fs-3 fw-bold text-primary">ElectroStore</div>
          <h1 className="h4 fw-semibold text-dark m-0">Admin Panel</h1>
          <div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-secondary">Welcome, {admin.username}</span>
              <button
                onClick={handleLogout}
                className="btn btn-link d-flex align-items-center gap-2 text-secondary"
                style={{ textDecoration: 'none' }}
                onMouseOver={(e) => e.currentTarget.classList.add('text-danger')}
                onMouseOut={(e) => e.currentTarget.classList.remove('text-danger')}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-4 flex-grow-1">
        {/* Navigation Tabs */}
        <div className="mb-4 border-bottom">
          <nav className="nav nav-tabs border-0">
            <button
              type="button"
              className={`nav-link ${activeTab === 'add-product' ? 'active' : ''}`}
              onClick={() => setActiveTab('add-product')}
            >
              <div className="d-flex align-items-center gap-2">
                <Plus size={16} />
                <span>Add Product</span>
              </div>
            </button>

            <button
              type="button"
              className={`nav-link ${activeTab === 'edit-product' ? 'active' : ''}`}
              onClick={() => setActiveTab('edit-product')}
            >
              <div className="d-flex align-items-center gap-2">
                <Edit3 size={16} />
                <span>Edit Product</span>
              </div>
            </button>

            <button
              type="button"
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <div className="d-flex align-items-center gap-2">
                <Eye size={16} />
                <span>User Orders</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded shadow-sm p-4">
          {activeTab === 'add-product' && <AddProduct />}
          {activeTab === 'edit-product' && <EditProduct />}
          {activeTab === 'orders' && (
            <div>
              {/* Top bar: Revenue + Clear All */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Total Revenue: ₹{totalRevenue.toLocaleString()}</h4>
                <button className="btn btn-danger btn-sm" onClick={handleClearAllOrders}>
                  <Trash2 size={16} /> Clear All Orders
                </button>
              </div>

              {/* Orders List */}
              {ordersData.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                ordersData.map((user) => (
                  <div key={user.userId} className="mb-4 border p-3 rounded">
                    <h5 className="mb-3">User: {user.username}</h5>
                    {user.orders.length === 0 ? (
                      <p>No orders for this user.</p>
                    ) : (
                      <ul className="list-group">
                        {user.orders.map((order, idx) => (
                          <li
                            key={idx}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <strong>{order.productName}</strong> - ₹{order.totalPrice.toLocaleString()}
                              <br />
                              <small>Brand: {order.productBrand}</small>
                              <br />
                              <small>Ordered on: {new Date(order.orderDate).toLocaleDateString()}</small>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
