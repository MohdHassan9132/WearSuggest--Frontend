import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <img 
        src="/WearSuggestLogo.svg" 
        alt="WearSuggest Logo" 
        style={{ width: '150px', marginBottom: '2rem' }}
        className="logo-loader"
      />
      <h1 style={{ fontSize: '4rem', color: 'var(--color-accent)', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        style={{
          backgroundColor: 'var(--color-accent)',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: '500'
        }}
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
