import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.name.length < 20 || formData.name.length > 60) {
      return setError('Name must be between 20 and 60 characters.');
    }
    const hasUpper = /[A-Z]/.test(formData.password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
    if (formData.password.length < 8 || formData.password.length > 16 || !hasUpper || !hasSpecial) {
      return setError('Password must be 8-16 characters, with at least 1 uppercase and 1 special character.');
    }

    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '2rem 0' }}>
      <div className="auth-card" style={{ width: '100%', margin: '0 1rem', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '24px' }}>Create an Account</h2>
          <p style={{ margin: 0 }}>Join the Store Rating Platform.</p>
        </div>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required minLength={20} maxLength={60} />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>Must be 20-60 characters.</span>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" required />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input className="form-control" type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, City" required maxLength={400} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>8-16 chars, 1 uppercase, 1 special character.</span>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>
        
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '13px' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 500 }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
