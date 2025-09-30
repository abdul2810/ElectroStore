import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Landing } from './pages/Landing';
import { UserHome } from './pages/UserHome';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { BuyNow } from './pages/BuyNow';
import { Orders } from './pages/Orders';
import { EditProfile } from './pages/EditProfile';
import { AdminDashboard } from './pages/AdminDashboard';
import { Search } from './pages/Search';

import CartProvider from './contexts/CartProvider';
import { Header } from './common/Header';
import { useAuth } from './contexts/useAuth';
import AuthProvider from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistProvider';
import { WishlistPage } from './pages/Wishlist';

export function ProtectedRoute({ children, type }) {
  const { user, admin, loading } = useAuth();

  if (loading) return null;

  const isUserAuthenticated = user || localStorage.getItem('currentUser');
  const isAdminAuthenticated = admin || localStorage.getItem('currentAdmin');

  if (type === 'user' && !isUserAuthenticated) return <Navigate to="/" replace />;
  if (type === 'admin' && !isAdminAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
}

function AuthenticatedLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute type="user">
            <AuthenticatedLayout>
              <UserHome />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute type="user">
            <AuthenticatedLayout>
              <Search />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/category/:categoryName"
        element={
          <ProtectedRoute type="user">
            <AuthenticatedLayout>
              <CategoryPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute type="user">
            <AuthenticatedLayout>
              <ProductDetail />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute type="user">
            <AuthenticatedLayout>
              <Cart />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute type="user">
            <AuthenticatedLayout>
              <WishlistPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/buy-now"
        element={
          <ProtectedRoute type="user">
            <AuthenticatedLayout>
              <BuyNow />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/buy-now/:id"
        element={
          <ProtectedRoute type="user">
            <AuthenticatedLayout>
              <BuyNow />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute type="user">
            <AuthenticatedLayout>
              <Orders />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute type="user">
            <AuthenticatedLayout>
              <EditProfile />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute type="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="App">
              <AppRoutes />
            </div>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>

    </Router>
  );
}

export default App;