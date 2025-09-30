import React, { useState } from 'react';
import { AuthModal } from '../auth/AuthModal';

// For icons, using bootstrap icons CDN or replace with your own icons/components
// Make sure to import bootstrap CSS in your app

export function Landing() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authType, setAuthType] = useState('user');

    const handleAuthClick = (type) => {
        setAuthType(type);
        setShowAuthModal(true);
    };

    return (
        <div className="min-vh-100 bg-light d-flex flex-column">
            {/* Hero Section */}
            <div className="container my-5 position-relative">
                <div className="row align-items-center">
                    <div className="col-lg-6 text-center text-lg-start">
                        <h1 className="display-4 fw-bold">
                            Welcome to <br />
                            <span className="text-primary">ElectroStore</span>
                        </h1>
                        <p className="lead text-secondary mt-3">
                            Your ultimate destination for cutting-edge electronics. From smartphones to smart homes, discover the latest technology at unbeatable prices.
                        </p>
                        <div className="d-flex justify-content-center justify-content-lg-start gap-3 mt-4 flex-wrap">
                            <button
                                onClick={() => handleAuthClick('user')}
                                className="btn btn-primary btn-lg"
                            >
                                Shop as User
                            </button>
                            <button
                                onClick={() => handleAuthClick('admin')}
                                className="btn btn-outline-primary btn-lg"
                            >
                                Admin Panel
                            </button>
                        </div>
                    </div>

                    <div className="col-lg-6 mt-4 mt-lg-0">
                        <img
                            src="https://images.pexels.com/photos/3178818/pexels-photo-3178818.jpeg?auto=compress&cs=tinysrgb&w=800"
                            alt="Electronics showcase"
                            className="img-fluid rounded"
                            style={{ maxHeight: '450px', objectFit: 'cover', width: '100%' }}
                        />
                    </div>
                </div>
            </div>

            <section className="bg-white py-5">
                <div className="container text-center">
                    <h2 className="fw-bold mb-3">Why Choose ElectroStore?</h2>
                    <p className="text-muted mb-5 fs-5">
                        Experience the future of electronics shopping with our premium features
                    </p>

                    <div className="row gy-4 justify-content-center">
                        {/* Lightning Fast */}
                        <div className="col-md-4">
                            <div className="p-4 border rounded shadow-sm h-100 why-card">
                                <div
                                    className="icon-circle bg-primary text-white rounded-circle animate-bolt"
                                    style={{ width: '64px', height: '64px', margin: 'auto' }}
                                >
                                    <i className="bi bi-lightning-charge fs-2"></i>
                                </div>
                                <h5>Lightning Fast</h5>
                                <p className="text-muted">Quick browsing and instant checkout experience</p>
                            </div>
                        </div>

                        {/* Secure Shopping */}
                        <div className="col-md-4">
                            <div className="p-4 border rounded shadow-sm h-100 why-card">
                                <div
                                    className="icon-circle bg-success text-white rounded-circle animate-lock"
                                    style={{ width: '64px', height: '64px', margin: 'auto' }}
                                >
                                    <i className="bi bi-shield-lock fs-2"></i>
                                </div>
                                <h5>Secure Shopping</h5>
                                <p className="text-muted">Your data and payments are always protected</p>
                            </div>
                        </div>

                        {/* Fast Delivery */}
                        <div className="col-md-4">
                            <div className="p-4 border rounded shadow-sm h-100 why-card">
                                <div
                                    className="icon-circle bg-danger text-white rounded-circle animate-truck"
                                    style={{ width: '64px', height: '64px', margin: 'auto' }}
                                >
                                    <i className="bi bi-truck fs-2"></i>
                                </div>
                                <h5>Fast Delivery</h5>
                                <p className="text-muted">Quick and reliable delivery to your doorstep</p>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
    .icon-circle {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      line-height: 1 !important;
    }
    .icon-circle i {
      margin: 0 !important;
      padding: 0 !important;
      line-height: 1 !important;
      vertical-align: middle !important;
      display: inline-flex !important; /* Make sure icon is inline-flex */
      align-items: center;
      justify-content: center;
    }
    
    .why-card {
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .why-card:hover {
      box-shadow: 0 2px 24px 0 rgba(80,80,200,0.13);
      transform: translateY(-4px) scale(1.02);
    }
    
    /* Animations remain same */
    .animate-bolt i {
      animation: bolt-flicker 1s infinite steps(2, end);
    }
    @keyframes bolt-flicker {
      0%, 100% { opacity: 1; filter: drop-shadow(0 0 8px #fff136); }
      60% { opacity: 0.8; filter: brightness(1.4) drop-shadow(0 0 16px #ffe43d); }
      90% { opacity: 0.6; filter: none; }
    }

    .animate-lock i {
      animation: lock-wobble 1.8s infinite;
    }
    @keyframes lock-wobble {
      0%, 100% { transform: rotate(0deg);}
      20% { transform: rotate(-10deg);}
      40% { transform: rotate(8deg);}
      60% { transform: rotate(-6deg);}
      80% { transform: rotate(3deg);}
    }

    .animate-truck i {
      animation: truck-move 2.5s ease-in-out infinite;
    }
    @keyframes truck-move {
      0%, 100% { transform: translateX(0);}
      20% { transform: translateX(-4px);}
      40% { transform: translateX(10px);}
      70% { transform: translateX(0);}
    }
  `}</style>
            </section>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                type={authType}
            />
        </div>
    );
}
