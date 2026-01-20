import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <h2 className="header-title">Dashboard</h2>
      
      <div className="user-profile">
        <span className="user-name">Hello, {user?.username || 'User'}</span>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
