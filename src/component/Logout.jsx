import React, { useEffect, useState } from 'react';
import { auth } from '../firebase-config'; 
import { signOut, deleteUser } from 'firebase/auth'; 
import { db } from '../firebase-config'; 
import { doc, getDoc } from 'firebase/firestore';
import './Logout.css'; 
import { Link } from 'react-router-dom'; 


const Logout = () => {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState(''); 
    const [message, setMessage] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user); 
                const userDocRef = doc(db, 'users', user.email); 
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserName(userDoc.data().name || user.email);
                }} else {
                setUser(null); 
                setUserName(''); 
            }
        });

        return () => unsubscribe(); 
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth); 
            setMessage('User signed out successfully.');
            console.log('User signed out successfully');
        } catch (error) {
            console.error('Error signing out: ', error);
            setMessage('Sign out failed. Please try again.');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            if (user) {
                const confirmation = window.confirm(
                    'Are you sure you want to delete your account? This action cannot be undone.'
                );
                if (confirmation) {
                    await deleteUser(user);
                    setMessage('Your account has been deleted successfully.');
                    console.log('Account deleted successfully.');
                }
            }  
        } catch (error) {
            console.error('Error deleting account: ', error);
            setMessage('Failed to delete account. Please try again.');
        }
    };

    return (
        <div className="logout-container">
            {user ? (
                <>
                    <h2>Hello, {userName}!</h2> 
                    {message && <p className="message">{message}</p>}
                    <p>Do you want to log out or delete your account?</p>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                    <button className="logout-button" onClick={handleDeleteAccount}>
                        Delete Account
                    </button>
                </>
            ) : (
                <>
                    <p>You have not logged in. <Link to="/login" className="login-link">Login</Link></p>
                    {message && <p className="message">{message}</p>}
                </>
            )}
        </div>
    );
};

export default Logout;
