import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { signupUser } from '../services/api';
import { Navigate } from 'react-router-dom';
import './Auth.css';

const Auth = ({ isSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { loginUser, authTokens } = useContext(AuthContext);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (authTokens) {
      <Navigate to="/dashboard" />;
    }
  }, [authTokens]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      signupUser(email, password, firstName, lastName)
        .then(() => loginUser(email, password))
        .catch((err) => console.error('Signup failed:', err));
    } else {
      loginUser(email, password);
    }
  };

  // If user is already logged in, prevent showing login/signup form
  if (authTokens) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="auth-container">
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Auth;
