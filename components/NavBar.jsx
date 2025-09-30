import React from 'react';

const NavBar = ({ user, handleSignOut }) => {
  return (
    <nav style={{
      padding: '20px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          marginRight: '12px'
        }}>
          🗺️
        </div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '800',
          margin: 0
        }}>
          GeoPulse
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ opacity: 0.8, color: '#ffffff' }}>
          {user?.email?.split('@')[0] || 'Guest'}
        </span>
        <button
          onClick={handleSignOut}
          className="modern-button"
          style={{
            padding: '8px 20px',
            borderRadius: '20px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default NavBar;