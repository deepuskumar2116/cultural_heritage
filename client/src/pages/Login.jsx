import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('tourist'); // 'tourist' or 'admin'
  const [isLogin, setIsLogin] = useState(true); // true for login, false for register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // Register form
  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (userType === 'admin') {
        const res = await authAPI.adminLogin(loginData.username, loginData.password);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('user', JSON.stringify(res.data.admin));
        navigate('/admin/dashboard');
      } else {
        const res = await authAPI.touristLogin(loginData.username, loginData.password);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userType', 'tourist');
        localStorage.setItem('user', JSON.stringify(res.data.tourist));
        navigate('/tourist/home');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.touristRegister(
        registerData.name,
        registerData.username,
        registerData.password,
        registerData.email,
        registerData.phone
      );
      setError('');
      setIsLogin(true);
      setLoginData({ username: registerData.username, password: registerData.password });
      alert('Registration successful! You can now login.');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1>🏛️ Cultural Heritage Tourism</h1>
          <p>Explore the rich cultural heritage of India</p>
        </div>

        {/* User Type Selector */}
        <div className="user-type-selector">
          <button
            className={`type-btn ${userType === 'tourist' ? 'active' : ''}`}
            onClick={() => {
              setUserType('tourist');
              setIsLogin(true);
              setError('');
            }}
          >
            👤 Tourist
          </button>
          <button
            className={`type-btn ${userType === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setUserType('admin');
              setIsLogin(true);
              setError('');
            }}
          >
            ⚙️ Admin
          </button>
        </div>

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <h2>{userType === 'admin' ? 'Admin Login' : 'Tourist Login'}</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {userType === 'tourist' && (
              <div className="toggle-text">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setLoginData({ username: '', password: '' });
                  }}
                >
                  Register here
                </button>
              </div>
            )}

            {userType === 'admin' && (
              <div className="demo-creds">
                <small>Demo: admin / admin123</small>
              </div>
            )}
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <h2>Tourist Registration</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                placeholder="Enter your full name"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                type="text"
                placeholder="Choose a username"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                placeholder="Enter your email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-phone">Phone (Optional)</label>
              <input
                id="reg-phone"
                type="tel"
                placeholder="Enter your phone number"
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                placeholder="Enter password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm-password">Confirm Password</label>
              <input
                id="reg-confirm-password"
                type="password"
                placeholder="Confirm password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>

            <div className="toggle-text">
              Already have an account?{' '}
              <button
                type="button"
                className="toggle-btn"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                  setRegisterData({
                    name: '',
                    username: '',
                    password: '',
                    confirmPassword: '',
                    email: '',
                    phone: '',
                  });
                }}
              >
                Login here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
