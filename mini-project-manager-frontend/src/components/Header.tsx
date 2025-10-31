import React from 'react';

const Header: React.FC = () => {
  return (
    <header
      style={{
        width: '100%',
        padding: '20px',
        backgroundColor: '#4a90e2',
        color: 'white',
        textAlign: 'center',
        fontSize: '28px',
        fontWeight: '700',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px',
      }}
    >
      Mini Task Manager Application
    </header>
  );
};

export default Header;
