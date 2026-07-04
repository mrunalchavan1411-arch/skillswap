// context/AuthContext.jsx
// Yeh context poori app me user ki login info available karwata hai
// Taaki har page ko baar baar localStorage check na karna pade

import { createContext, useContext, useState, useEffect } from 'react';
import socket from '../services/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // App load hote hi check karo ki pehle se login hai ya nahi
  useEffect(() => {
    const savedUser = localStorage.getItem('skillswap_user');
    const savedToken = localStorage.getItem('skillswap_token');

    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Socket connect karo aur apni ID register karo
      socket.connect();
      socket.emit('register', parsedUser.id);
    }
    setLoading(false);
  }, []);

  // Login function - signup/login success hone par call hota hai
  const login = (userData, token) => {
    localStorage.setItem('skillswap_token', token);
    localStorage.setItem('skillswap_user', JSON.stringify(userData));
    setUser(userData);
    socket.connect();
    socket.emit('register', userData.id);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('skillswap_token');
    localStorage.removeItem('skillswap_user');
    setUser(null);
    socket.disconnect();
  };

  // Profile update hone par user state refresh karna
  const updateUserInContext = (updatedUser) => {
    localStorage.setItem('skillswap_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserInContext, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook - components me easily use karne ke liye
export function useAuth() {
  return useContext(AuthContext);
}
