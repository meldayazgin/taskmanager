import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css'; 

const MainPage = () => {
    return (
        <div className="main-page">
            <h1>Welcome to Task Manager!</h1>
            <div className="button-container">
                <Link to="/signup">
                    <button>Sign Up</button>
                </Link>
                <Link to="/login">
                    <button>Login</button>
                </Link>
            </div>
        </div>
    );
};

export default MainPage;
