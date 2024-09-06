import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => 
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const navigate = useNavigate();

  // Handle user login
  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', { email, password });
      const userData = response.data.user;
      const tokenData = response.data.token;

      const authData = {
        access: tokenData.access_token.token,
        refresh: tokenData.refresh_token.token,
        access_exp: tokenData.access_token.exp,
        refresh_exp: tokenData.refresh_token.exp,
      };

      // Save tokens and user data in state and localStorage
      setAuthTokens(authData);
      setUser(userData);
      localStorage.setItem('authTokens', JSON.stringify(authData));
      localStorage.setItem('user', JSON.stringify(userData));

      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // Handle user logout
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    // If tokens exist in localStorage, set the user data when the app loads
    if (authTokens) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
    }
  }, [authTokens]);

  return (
    <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
