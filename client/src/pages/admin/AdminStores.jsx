import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('id');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/admin/stores', { params: { search, sort, order } });
      setStores(res.data.data);
    } catch (err) {
      setError('Unable to load stores. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sort, order]);

  const handleSort = (field) => {
    if (sort === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field);
      setOrder('asc');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2>Store Management</h2>
          <p>View all stores and their performance metrics.</p>
        </div>
        <Link to="/admin/stores/new" className="btn btn-primary">+ Add Store</Link>
      </div>

      <div className="toolbar">
        <input 
          className="form-control"
          type="text" 
          placeholder="Search by store name, email, or address..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Store Name {sort === 'name' && (order === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('email')}>Email {sort === 'email' && (order === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('address')}>Address {sort === 'address' && (order === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('overall_rating')}>Overall Rating {sort === 'overall_rating' && (order === 'asc' ? '↑' : '↓')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{textAlign: 'center'}}>Loading stores...</td></tr>
            ) : stores.length === 0 ? (
              <tr><td colSpan="4" className="empty-state">No stores found matching your search.</td></tr>
            ) : stores.map(s => (
              <tr key={s.id}>
                <td style={{fontWeight: 500}}>{s.name}</td>
                <td>{s.email}</td>
                <td style={{color: 'var(--text-secondary)'}}>{s.address}</td>
                <td>
                  {s.overall_rating > 0 ? (
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span style={{color: '#FBBF24'}}>★</span>
                      <span style={{fontWeight: 600}}>{s.overall_rating}</span>
                    </div>
                  ) : (
                    <span style={{color: 'var(--text-secondary)'}}>No ratings</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStores;
