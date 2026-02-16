import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for dummy token
        const token = localStorage.getItem('adminToken');
        if (token) {
            setUser({ email: 'admin@gurukrupa.com', role: 'admin' });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Mock login
        if (email === 'admin@gurukrupa.com' && password === 'admin123') {
            localStorage.setItem('adminToken', 'dummy-jwt-token');
            setUser({ email, role: 'admin' });
            return true;
        }
        throw new Error('Invalid credentials');
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
