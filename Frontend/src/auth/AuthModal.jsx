import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export function AuthModal({ isOpen, onClose, type }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    mobile: '',
  });
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (type === 'admin') {
      setIsLogin(true); // force login mode for admin
    }
  }, [type]);

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      mobile: '',
    });
    setErrors([]);
    setMessage('');
  };

  const validateForm = () => {
    const newErrors = [];
    if (!formData.username.trim()) newErrors.push('Username is required');
    if (!formData.password.trim()) newErrors.push('Password is required');

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.push('Passwords do not match');
      }
      if (!formData.email.trim()) newErrors.push('Email is required');

      if (type === 'user') {
        if (!formData.firstName.trim()) newErrors.push('First name is required');
        if (!formData.lastName.trim()) newErrors.push('Last name is required');
        if (!formData.mobile.trim()) newErrors.push('Mobile number is required');
      } else {
        if (!formData.fullName.trim()) newErrors.push('Full name is required');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const success = await login(
        { username: formData.username, password: formData.password },
        type
      );

      if (success) {
        setMessage('Login successful');
        resetForm();
        onClose();
        navigate(type === 'admin' ? '/admin' : '/home');
      } else {
        setErrors(['Invalid username or password']);
      }
    } catch (error) {
      setErrors(['Login failed. Please try again.']);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {type === 'admin' ? 'Admin' : 'User'} {isLogin ? 'Login' : 'Register'}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => {
                onClose();
                resetForm();
                setIsLogin(true);
              }}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.length > 0 && (
                <div className="alert alert-danger">
                  {errors.map((error, i) => (
                    <div key={i}>{error}</div>
                  ))}
                </div>
              )}
              {message && !errors.length && (
                <div className="alert alert-success">{message}</div>
              )}

              <div className="mb-3">
                <label className="form-label">
                  Username {!isLogin && type === 'user' && '/ Email'}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder={isLogin && type === 'user' ? 'Username or Email' : 'Username'}
                />
              </div>

              {!isLogin && type === 'user' && (
                <>
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label">{!isLogin ? 'Enter Password' : 'Password'}</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>

              {!isLogin && (
                <div className="mb-3">
                  <label className="form-label">Re-enter Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="modal-footer d-flex flex-column gap-2">
              <button type="submit" className="btn btn-primary w-100">
                {isLogin ? 'Login' : 'Register'}
              </button>
              {type === 'user' && (
                <button
                  type="button"
                  className="btn btn-link text-primary"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors([]);
                    resetForm();
                    setMessage('');
                  }}
                >
                  {isLogin ? "Don't have an account? Create one" : 'Already have an account? Login'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
