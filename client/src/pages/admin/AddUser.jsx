import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', address: '', password: '', role: 'NORMAL USER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      await api.post('/admin/users', formData);
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user. Please check the details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Add New User</h2>
        <p>Create a new user account manually.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" type="text" name="name" value={formData.name} onChange={handleChange} required minLength={20} maxLength={60} />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>Must be 20-60 characters.</span>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input className="form-control" type="text" name="address" value={formData.address} onChange={handleChange} required maxLength={400} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" name="password" value={formData.password} onChange={handleChange} required />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>8-16 chars, 1 uppercase, 1 special character.</span>
          </div>
          <div className="form-group">
            <label>Role</label>
            <select className="form-control" name="role" value={formData.role} onChange={handleChange} required>
              <option value="NORMAL USER">Normal User</option>
              <option value="STORE OWNER">Store Owner</option>
              <option value="SYSTEM ADMINISTRATOR">System Administrator</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
