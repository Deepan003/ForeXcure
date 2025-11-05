import React, { createContext, useState, useContext } from 'react';

// Create the context, defaulting to null
const AuthContext = createContext(null);

// This is the custom hook your Navbar is trying to use
export const useAuth = () => useContext(AuthContext);

// This is the provider that index.js uses
export const AuthProvider = ({ children }) => {
  // Get user from localStorage if it exists
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('forexcure_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hardcoded login from the prompt
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    try {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      const userData = data.user;
      setUser(userData);
      localStorage.setItem('forexcure_user', JSON.stringify(userData));
      setLoading(false);
      return true; // Success
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false; // Failure
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('forexcure_user');
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      
      setLoading(false);
      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, message: err.message };
    }
  };

  // This is the value that useAuth() will return
  const value = {
    user,
    login,
    logout,
    register,
    loading,
    error,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};