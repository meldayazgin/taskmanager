import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './navbar/navbar'; 
import Signup from './component/Signup';
import Login from './component/Login';
import Logout from './component/Logout';
import MainPage from './MainPage';
import Tasks from './component/Tasks'; 

const App = () => {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/tasks" element={<Tasks />} /> 
                </Routes>
            </div>
        </Router>
    );
};

export default App;
