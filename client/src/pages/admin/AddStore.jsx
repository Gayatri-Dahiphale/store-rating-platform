import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddStore = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await api.get('/admin/users', { params: { role: 'STORE OWNER' } });
        setOwners(res.data.data);
      } catch (err) {
        console.error('Failed to fetch owners');
      }
    };
    fetchOwners();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/admin/stores', formData);
      navigate('/admin/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add store. Please check the details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Add New Store</h2>
        <p>Create a new store and assign it to an owner.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Store Name</label>
            <input className="form-control" type="text" name="name" value={formData.name} onChange={handleChange} required minLength={3} maxLength={100} />
          </div>
          <div className="form-group">
            <label>Store Email</label>
            <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input className="form-control" type="text" name="address" value={formData.address} onChange={handleChange} required maxLength={400} />
          </div>
          <div className="form-group">
            <label>Store Owner</label>
            <select className="form-control" name="owner_id" value={formData.owner_id} onChange={handleChange} required>
              <option value="" disabled>Select an owner</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/stores')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Add Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
