import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    // initialize from localStorage (so reload doesn’t reset to null)
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [admin, setAdmin] = useState(() => {
        const storedAdmin = localStorage.getItem('currentAdmin');
        return storedAdmin ? JSON.parse(storedAdmin) : null;
    });
    const [loading, setLoading] = useState(true);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const storedUser = localStorage.getItem('currentUser');
            const storedAdmin = localStorage.getItem('currentAdmin');

            if (storedUser) setUser(JSON.parse(storedUser));
            if (storedAdmin) setAdmin(JSON.parse(storedAdmin));

            try {
                const res = await axios.get('http://localhost:8087/api/auth/me', { withCredentials: true });

                if (res.data?.id) {
                    setUser(res.data);
                    setAdmin(null);
                    localStorage.setItem('currentUser', JSON.stringify(res.data));
                    localStorage.removeItem('currentAdmin');
                } else if (res.data?.username && res.data?.fullName) {
                    setAdmin(res.data);
                    setUser(null);
                    localStorage.setItem('currentAdmin', JSON.stringify(res.data));
                    localStorage.removeItem('currentUser');
                }
            } catch (err) {
                console.warn('Session validation failed. Keeping localStorage intact for now.');
                // Don't clear localStorage immediately
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    const login = async (credentials, type) => {
        try {
            const res = await axios.post(
                'http://localhost:8087/api/auth/login',
                {
                    username: credentials.username,
                    password: credentials.password,
                    type,
                },
                { withCredentials: true }
            );

            const data = res.data;

            if (type === 'user') {
                if (!data.id) return false;

                const previousUserId = localStorage.getItem('lastUserId');
                if (previousUserId && previousUserId !== data.id) {
                    localStorage.setItem('cartSwitchRequired', 'true');
                }
                localStorage.setItem('lastUserId', data.id);

                setUser(data);
                setAdmin(null);
                localStorage.setItem('currentUser', JSON.stringify(data));
                localStorage.removeItem('currentAdmin');
            } else if (type === 'admin') {
                if (!data.username) return false;

                setAdmin(data);
                setUser(null);
                localStorage.setItem('currentAdmin', JSON.stringify(data));
                localStorage.removeItem('currentUser');
            }

            return true;
        } catch (err) {
            console.error('Login failed', err);
            return false;
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8087/api/auth/logout', {}, { withCredentials: true });
        } catch {
            console.warn('Logout API failed — clearing local state anyway.');
        }

        setUser(null);
        setAdmin(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentAdmin');
    };

    const updateUserProfile = (updates) => {
        if (!user) return;

        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...updates };
            localStorage.setItem('users', JSON.stringify(users));
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                admin,
                loading,
                login,
                logout,
                updateUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ✅ Default export for Fast Refresh compatibility
export default AuthProvider;