import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyUserCredentials, verifyAdminCredentials } from '../api/nocodb';

// Provide a default value that matches the expected shape, even if empty/null functions
const AuthContext = createContext({
  isAuthenticated: false,
  isAdminAuthenticated: false,
  clientId: null,
  apiKey: null,
  loginCustomer: async () => false, // Dummy function
  loginAdmin: async () => false,   // Dummy function
  logout: () => {},                // Dummy function
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    const storedClientId = localStorage.getItem('clientId');
    const storedApiKey = localStorage.getItem('apiKey');
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
      localStorage.setItem('apiKey', password);
      localStorage.removeItem('isAdminLoggedIn');
      setClientId(id);
      setApiKey(password);
      setIsAuthenticated(true);
      setIsAdminAuthenticated(false);
      return true;
    } else {
      setIsAuthenticated(false);
      return false;
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
      return true;
    } else {
      setIsAdminAuthenticated(false);
      return false;
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
