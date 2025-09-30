import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, ArrowLeft, Trash2, Plus } from 'lucide-react';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import axios from 'axios';
import { useAuth } from '../contexts/useAuth';

export function EditProfile() {
    const { user, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: ''
    });

    const [savedAddresses, setSavedAddresses] = useState([]);
    const [pendingAddresses, setPendingAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState('');
    const [showAddressField, setShowAddressField] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Prefill profile ONLY for name/email
    useEffect(() => {
        if (!user) return;
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            mobile: user.mobile || ''
        });
        if (user.id) {
            fetchAddresses(user.id);
        }
    }, [user]);

    // Fetch addresses after save or when needed
    const fetchAddresses = (userId) => {
        axios
            .get(`http://localhost:8087/api/auth/users/${userId}/addresses`, { withCredentials: true })
            .then(res => {
                setSavedAddresses(res.data || []);
            })
            .catch(err => {
                console.error('Error fetching addresses:', err);
            });
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddNewAddress = () => {
        if (!newAddress.trim()) {
            alert('Please enter an address');
            return;
        }
        setPendingAddresses(prev => [...prev, newAddress.trim()]);
        setNewAddress('');
        setShowAddressField(false);
    };

    const handleDeletePending = (index) => {
        setPendingAddresses(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeleteSaved = (address) => {
        if (window.confirm('Delete this address from database?')) {
            axios
                .delete(`http://localhost:8087/api/auth/users/${user.id}/addresses`, {
                    data: address,
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
                .then(() => {
                    setSavedAddresses(prev => prev.filter(addr => addr !== address));
                    setSuccessMessage('Address deleted.');
                    setTimeout(() => setSuccessMessage(''), 3000);
                })
                .catch(err => console.error('Error deleting address:', err));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Update profile info
            await updateUserProfile(formData);

            // Add all pending addresses to DB
            for (let addr of pendingAddresses) {
                await axios.post(
                    `http://localhost:8087/api/auth/users/${user.id}/addresses`,
                    JSON.stringify(addr),
                    { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
                );
            }

            setPendingAddresses([]);
            // Now fetch and show addresses from DB
            fetchAddresses(user.id);

            setSuccessMessage('Profile & addresses updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error saving profile/addresses:', err);
            alert("Error saving profile or addresses. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="min-vh-100 bg-light d-flex flex-column">
                {/* <Header /> */}
                <div className="container py-5 flex-grow-1 d-flex justify-content-center align-items-center">
                    <p className="text-center text-secondary">Please login to edit your profile</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light d-flex flex-column">
            {/* <Header /> */}

            <main className="container py-5 flex-grow-1">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-link text-primary mb-4 d-flex align-items-center"
                    type="button"
                >
                    <ArrowLeft size={20} className="me-2" /> Back
                </button>

                <div className="bg-white rounded shadow-sm">
                    <div className="px-4 py-3 border-bottom d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                            <User size={24} className="text-primary" />
                        </div>
                        <h1 className="h4 fw-bold mb-0 text-dark">Edit Profile</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4">
                        {successMessage && (
                            <div className="alert alert-success py-2 mb-4" role="alert">
                                {successMessage}
                            </div>
                        )}

                        {/* Profile Fields */}
                        <div className="row g-3 mb-4">
                            <div className="col-12 col-sm-6">
                                <label className="form-label fw-medium">First Name</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    className="form-control"
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label className="form-label fw-medium">Last Name</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    className="form-control"
                                    required
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="form-control"
                                required
                                readOnly
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium">Mobile Number</label>
                            <input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => handleInputChange('mobile', e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>

                        {/* Add New Address Toggle */}
                        <div className="mb-4">
                            <label className="form-label fw-medium d-flex align-items-center">
                                Add New Address
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary ms-2"
                                    onClick={() => setShowAddressField(prev => !prev)}
                                >
                                    <Plus size={14} />
                                </button>
                            </label>

                            {showAddressField && (
                                <div className="d-flex mt-2 gap-2">
                                    <textarea
                                        className="form-control"
                                        placeholder="Enter new address"
                                        value={newAddress}
                                        onChange={(e) => setNewAddress(e.target.value)}
                                        rows={2}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={handleAddNewAddress}
                                    >
                                        Add Address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Saved Addresses (only show after DB has them) */}
                        {(savedAddresses.length > 0 || pendingAddresses.length > 0) && (
                            <div className="mb-4">
                                <label className="form-label fw-medium">Saved Addresses</label>

                                {pendingAddresses.map((addr, idx) => (
                                    <div key={`pending-${idx}`} className="border rounded p-2 mb-2 bg-warning bg-opacity-10 d-flex justify-content-between">
                                        <span>{addr} (Pending Save)</span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeletePending(idx)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}

                                {savedAddresses.map((addr, idx) => (
                                    <div key={`saved-${idx}`} className="border rounded p-2 mb-2 d-flex justify-content-between">
                                        <span>{addr}</span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteSaved(addr)}
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Save Changes */}
                        <div className="d-flex justify-content-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="btn btn-primary d-flex align-items-center"
                            >
                                <Save size={20} className="me-2" />
                                {isSaving ? 'Saving...' : 'Save Profile Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
