import React, { useState } from 'react';
import { login } from '../auth';
import { Link } from 'react-router-dom'; 
import './Login.css';
import { auth, googleProvider } from '../firebase-config'; 
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    setMessage(result.message); 
  };
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User Info:', result.user);
      setMessage(`Welcome, ${result.user.displayName}`);
    } catch (error) {
      console.error('Error logging in with Google:', error);
      setMessage('Failed to login with Google. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <button onClick={loginWithGoogle} className="google-container button">
        Login with Google
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Login</button>
        
      </form>
      {message && <p>{message}</p>} 
      
      <p className="signup-prompt">
        Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;