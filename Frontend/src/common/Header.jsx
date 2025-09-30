import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, LogOut, Edit, Package } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/useCart';
import { Heart } from 'lucide-react';
import { useWishlist } from '../contexts/useWishlist';

export function Header() {
    const [currentUser, setCurrentUser] = useState(null);
    const { cart } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const { wishlist } = useWishlist();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(storedUser);
    }, []);

    useEffect(() => {
        if (location.pathname === '/' || location.pathname === '/home') {
            setSearchQuery('');
        }
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    return (
        <header className="bg-white shadow sticky-top">
            <nav className="container navbar navbar-expand-lg navbar-light px-3">
                {/* Logo */}
                <button
                    onClick={() => navigate('/home')}
                    className="navbar-brand fw-bold text-primary"
                    type="button"
                    style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                >
                    ElectroStore
                </button>

                {/* Search Bar */}
                <form className="d-flex mx-3 flex-grow-1" onSubmit={handleSearch}>
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                            <Search size={16} className="text-muted" />
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>

                {/* Action Buttons */}
                <div className="d-flex align-items-center gap-3">
                    {/* Cart */}
                    <button
                        type="button"
                        className="btn position-relative text-secondary"
                        onClick={() => navigate('/cart')}
                    >
                        <ShoppingCart size={20} />
                        {cart.length > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                                {cart.length}
                            </span>
                        )}
                    </button>
                    <button
                        type="button"
                        className="btn position-relative text-secondary"
                        onClick={() => navigate('/wishlist')}
                    >
                        <Heart size={20} />
                        {wishlist.length > 0 && (
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style={{ fontSize: '0.65rem' }}
                            >
                                {wishlist.length}
                            </span>
                        )}
                    </button>
                    {/* Profile Dropdown */}
                    <div className="dropdown">
                        <button
                            className="btn d-flex align-items-center text-secondary"
                            type="button"
                            id="profileDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <User size={20} />
                            <span className="ms-2">{currentUser?.firstName || 'Profile'}</span>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                            <li>
                                <button className="dropdown-item d-flex align-items-center" onClick={() => navigate('/profile')}>
                                    <Edit size={16} className="me-2" />
                                    Edit Profile
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item d-flex align-items-center" onClick={() => navigate('/orders')}>
                                    <Package size={16} className="me-2" />
                                    My Orders
                                </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button
                                    className="dropdown-item d-flex align-items-center text-danger"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} className="me-2" />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}