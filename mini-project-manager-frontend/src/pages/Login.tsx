
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // ✅ Responsive styling using JS breakpoints
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#e6f2ff',
    padding: '50px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
    fontFamily: 'Segoe UI, sans-serif',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    transition: '0.3s',
    fontSize: '16px',
    boxSizing: 'border-box',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4a90e2',
    color: 'white',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer',
    transition: '0.3s',
  };

  return (
    <div style={containerStyle}>
      <Header />

      <div style={cardStyle}>
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '25px',
            color: '#333',
            fontSize: '1.8rem',
          }}
        >
          Login
        </h2>

        {error && (
          <div
            style={{
              color: '#ff4d4f',
              marginBottom: '15px',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#ffe6e6',
              textAlign: 'center',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#4a90e2')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#4a90e2')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#357ABD')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a90e2')}
          >
            Login
          </button>
        </form>

        <p
          style={{
            marginTop: '20px',
            textAlign: 'center',
            color: '#555',
            fontSize: '14px',
          }}
        >
          Don’t have an account?{' '}
          <Link
            to="/register"
            style={{
              color: '#4a90e2',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
