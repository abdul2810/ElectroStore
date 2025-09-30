import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container py-5">
        <div className="row gy-4">
          {/* Company Info */}
          <div className="col-12 col-md-6 col-lg-6">
            <h2 className="text-primary mb-4">ElectroStore</h2>
            <p className="text-secondary mb-4" style={{ maxWidth: '400px' }}>
              Your trusted destination for the latest electronics. From smartphones to laptops, 
              we bring you cutting-edge technology at unbeatable prices.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-secondary fs-4" aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#" className="text-secondary fs-4" aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#" className="text-secondary fs-4" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#" className="text-secondary fs-4" aria-label="Youtube">
                <Youtube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-3 col-lg-3">
            <h3 className="h5 mb-3">Quick Links</h3>
            <ul className="list-unstyled">
              {['About Us', 'Contact Us', 'Privacy Policy', 'Terms & Conditions', 'Return Policy'].map(link => (
                <li key={link} className="mb-2">
                  <a href="#" className="text-secondary text-decoration-none">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-6 col-md-3 col-lg-3">
            <h3 className="h5 mb-3">Contact Info</h3>
            <div className="mb-3 d-flex align-items-center">
              <Phone className="me-3 text-primary" />
              <span className="text-secondary">+91 98765 43210</span>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <Mail className="me-3 text-primary" />
              <span className="text-secondary">support@electrostore.com</span>
            </div>
            <div className="d-flex align-items-start">
              <MapPin className="me-3 text-primary mt-1" />
              <address className="text-secondary mb-0">
                123 Tech Street,<br />
                Electronics District,<br />
                Mumbai, India - 400001
              </address>
            </div>
          </div>
        </div>

        <hr className="border-secondary mt-5" />

        <div className="text-center text-secondary mt-3">
          © 2025 ElectroStore. All rights reserved. | Powered by cutting-edge technology
        </div>
      </div>
    </footer>
  );
}
