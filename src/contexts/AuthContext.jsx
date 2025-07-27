import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyUserCredentials, verifyAdminCredentials } from '../api/nocodb'; // Import the new verification function

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // For customer dashboard
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // For admin panel
  const [clientId, setClientId] = useState(null);
  const [apiKey, setApiKey] = useState(null); // This will now store the password_hash for customer

  useEffect(() => {
    const storedClientId = localStorage.getItem('clientId');
    const storedApiKey = localStorage.getItem('apiKey'); // This is actually password_hash
    const storedIsAdmin = localStorage.getItem('isAdminLoggedIn');

    if (storedClientId && storedApiKey) {
      setClientId(storedClientId);
      setApiKey(storedApiKey);
      setIsAuthenticated(true);
    }
    if (storedIsAdmin === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const loginCustomer = async (id, password) => {
    const user = await verifyUserCredentials(id, password);
    if (user) {
      localStorage.setItem('clientId', id);
      localStorage.setItem('apiKey', password); // Storing password_hash
      localStorage.removeItem('isAdminLoggedIn');
      setClientId(id);
      setApiKey(password);
      setIsAuthenticated(true);
      setIsAdminAuthenticated(false);
      return true; // Login successful
    } else {
      setIsAuthenticated(false);
      return false; // Login failed
    }
  };

  const loginAdmin = async (username, password) => {
    const adminVerified = await verifyAdminCredentials(username, password);
    if (adminVerified) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.removeItem('clientId');
      localStorage.removeItem('apiKey');
      setIsAdminAuthenticated(true);
      setIsAuthenticated(false);
      setClientId(null);
      setApiKey(null);
      return true; // Admin login successful
    } else {
      setIsAdminAuthenticated(false);
      return false; // Admin login failed
    }
  };

  const logout = () => {
    localStorage.removeItem('clientId');
    localStorage.removeItem('apiKey');
    localStorage.removeItem('isAdminLoggedIn');
    setClientId(null);
    setApiKey(null);
    setIsAuthenticated(false);
    setIsAdminAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdminAuthenticated, clientId, apiKey, loginCustomer, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
