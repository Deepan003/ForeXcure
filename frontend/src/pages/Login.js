import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register state
  const [name, setName] = useState('');
  const [role, setRole] = useState('Patient'); // Default role
  const [message, setMessage] = useState('');

  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard'); // Redirect to dashboard on successful login
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    const result = await register(name, email, password, role);
    if (result.success) {
      setMessage(result.message + " Please switch to login.");
      setIsLogin(true); // Switch to login form
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
        {message && <p className="auth-message">{message}</p>}
        {error && !message && <p className="auth-error">{error}</p>}
        
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="button-primary" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="auth-hardcoded">
              <p>Test Patient: <code>patient@test.com</code> / <code>password123</code></p>
              <p>Test Org: <code>org@test.com</code> / <code>password123</code></p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Register as</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Patient">Patient</option>
                <option value="Organisation">Organisation</option>
              </select>
            </div>
            <button type="submit" className="button-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <button onClick={() => setIsLogin(!isLogin)} className="auth-toggle">
          {isLogin ? 'Need an account? Register' : 'Have an account? Sign In'}
        </button>
      </div>
    </div>
  );
}

export default Login;