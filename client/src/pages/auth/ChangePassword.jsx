import React, { useState } from 'react';
import api from '../../services/api';

const ChangePassword = () => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      return setError('New passwords do not match');
    }

    const hasUpper = /[A-Z]/.test(formData.newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);
    if (formData.newPassword.length < 8 || formData.newPassword.length > 16 || !hasUpper || !hasSpecial) {
      return setError('Password must be 8-16 chars, with at least 1 uppercase and 1 special char');
    }

    setLoading(true);
    try {
      await api.put('/auth/password', { oldPassword: formData.currentPassword, newPassword: formData.newPassword });
      setSuccess('Password updated successfully.');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Change Password</h2>
        <p>Update your account security settings.</p>
      </div>
      
      <div className="card" style={{ maxWidth: '460px' }}>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input className="form-control" type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input className="form-control" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>8-16 chars, 1 uppercase, 1 special character.</span>
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input className="form-control" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
