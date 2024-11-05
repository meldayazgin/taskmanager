import React, { useState } from 'react';
import { signup } from '../auth';
import './Signup.css';
import { auth, googleProvider, db } from '../firebase-config'; 
import { signInWithPopup, fetchSignInMethodsForEmail } from 'firebase/auth';
import { Link } from 'react-router-dom'; 
import { doc, setDoc } from 'firebase/firestore'; 

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const [city, setCity] = useState(''); 
  const [phone, setPhone] = useState(''); 
  const [message, setMessage] = useState('');

  const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const checkEmailExistence = async (email) => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length > 0; 
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false; 
    }
  };

  const isDomainValid = (email) => {
    const emailDomain = email.split('@')[1];
    return validDomains.includes(emailDomain);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (!isDomainValid(email)) {
      setMessage('Please use a valid email domain (e.g., gmail.com, yahoo.com, etc.).');
      return;
    }

    const emailExists = await checkEmailExistence(email);
    if (emailExists) {
      setMessage('Email already exists. Please login.'); 
      return; 
    }

    try {
      const result = await signup(email, password);
      setMessage(result.message);

      await setDoc(doc(db, 'users', email), {
        name,
        city,
        phone,
      });
    } catch (error) {
      console.error('Error during signup:', error);
      setMessage('Failed to sign up. Please try again.'); 
    }
  };

  const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (await checkEmailExistence(user.email)) {
        setMessage('Email already exists. Please login.');
      } else {
        setMessage(`Welcome, ${user.displayName}`);
        await setDoc(doc(db, 'users', user.email), {
          name: user.displayName,
          city: '',
          phone: '',
        });
      }
    } catch (error) {
      console.error('Error signing up with Google:', error);
      setMessage('Failed to sign up with Google. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <button onClick={signUpWithGoogle} className="google-container button">
        Sign up with Google
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>City:</label>
          <input 
            type="text" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
        </div>
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
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>} 
      <p className="signup-prompt">
        Already have an account? <Link to="/login" className="login-link">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
