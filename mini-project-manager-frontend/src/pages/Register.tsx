
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#e6f2ff',
        paddingTop: '50px',
        paddingLeft: '10px',
        paddingRight: '10px',
      }}
    >
      <Header />

      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
          fontFamily: 'Segoe UI, sans-serif',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '25px',
            color: '#333',
            fontSize: '1.8rem',
          }}
        >
          Register
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
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {['Username', 'Password', 'Confirm Password'].map((label, index) => {
            const type = label.toLowerCase().includes('password') ? 'password' : 'text';
            const value =
              label === 'Username'
                ? username
                : label === 'Password'
                ? password
                : confirmPassword;
            const setter =
              label === 'Username'
                ? setUsername
                : label === 'Password'
                ? setPassword
                : setConfirmPassword;

            return (
              <div key={index} style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                  }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    transition: '0.3s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#4a90e2')}
                  onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                />
              </div>
            );
          })}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#4a90e2',
              color: 'white',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: '0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#357ABD')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a90e2')}
          >
            Register
          </button>
        </form>

        <p
          style={{
            marginTop: '20px',
            textAlign: 'center',
            color: '#555',
            fontSize: '0.9rem',
          }}
        >
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4a90e2', fontWeight: '600' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
