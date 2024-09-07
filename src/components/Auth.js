import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { signupUser } from '../services/api';
import { Navigate } from 'react-router-dom';
import './Auth.css';

const Auth = ({ isSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [firstName, setFirstName] = useState('');
  const [lastName] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages
  const { loginUser, authTokens } = useContext(AuthContext);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (authTokens) {
      <Navigate to="/dashboard" />;
    }
  }, [authTokens]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error message

    // Password match validation for signup
    if (isSignup && password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    // Call API based on whether it's signup or login
    if (isSignup) {
      signupUser(email, password, firstName, lastName)
        .then(() => loginUser(email, password))
        .catch((err) => {

            const errorResponse = err.response?.data;
  
  if (errorResponse) {
    // Extract first error message for each field (e.g., "email": ["Enter a valid email address."])
    const errors = Object.values(errorResponse).flat();
    setErrorMessage(errors[0]); // Display the first error message
  } else {
    setErrorMessage('An error occurred, please try again');
  }
          console.error('Signup failed:', err);
        //   setErrorMessage(err.response?.data?.detail || 'Signup failed');
          


        });
    } else {
      loginUser(email, password).catch((err) => {
        console.error('Login failed:', err);
        setErrorMessage(err.response?.data?.detail || 'Login failed'); // Show error message from API
      });
    }
  };

  // If user is already logged in, prevent showing login/signup form
  if (authTokens) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className='auth-uppr'>

    <div className="auth-container">
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      {errorMessage && <p className="auth-error">{errorMessage}</p>} {/* Show error message */}
      <form onSubmit={handleSubmit} className="auth-form">
        {isSignup && (
            <>
            <input
              type="text"
              placeholder="Full Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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
        {isSignup && (
            <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />
        )}
        <button type="submit" className="auth-button">
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
        <a href={isSignup ? '/login' : '/signup'}>{!isSignup ? 'Sign Up' : 'Login'}</a>
      </form>
    </div>
        </div>
  );
};

export default Auth;
