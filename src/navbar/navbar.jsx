import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
        <h2>Task Manager with Firebase</h2>
      <ul className="navbar-menu">
        <li className="navbar-item">
          <Link to="/Tasks">Tasks</Link>
        </li>
        <li className="navbar-item">
          <Link to="/Signup">Sign Up</Link>
        </li>
        <li className="navbar-item">
          <Link to="/Login">Login</Link>
        </li>
        <li className="navbar-item">
          <Link to="/Logout">Settings</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
