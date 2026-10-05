import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RatingStars from '../../components/RatingStars';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/stores', { params: { search, sort, order } });
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

  const handleRating = async (storeId, rating, isUpdate) => {
    try {
      if (isUpdate) {
        await api.put(`/stores/${storeId}/rating`, { rating });
      } else {
        await api.post(`/stores/${storeId}/rating`, { rating });
      }
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2>Stores</h2>
          <p>Browse stores and manage your ratings.</p>
        </div>
      </div>

      <div className="toolbar">
        <input className="form-control" type="text" placeholder="Search by name, address..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Store {sort === 'name' && (order === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('address')}>Address {sort === 'address' && (order === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('overall_rating')}>Overall Rating {sort === 'overall_rating' && (order === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('my_rating')}>Your Rating {sort === 'my_rating' && (order === 'asc' ? '↑' : '↓')}</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{textAlign: 'center'}}>Loading stores...</td></tr>
            ) : stores.length === 0 ? (
              <tr><td colSpan="5" className="empty-state">No stores found matching your search.</td></tr>
            ) : stores.map(s => (
              <tr key={s.id}>
                <td style={{fontWeight: 500}}>{s.name}</td>
                <td style={{color: 'var(--text-secondary)'}}>{s.address}</td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <RatingStars rating={Math.round(s.overall_rating)} interactive={false} />
                    <span style={{fontWeight: 600}}>{s.overall_rating > 0 ? s.overall_rating : 'No ratings'}</span>
                  </div>
                </td>
                <td>
                  {s.my_rating ? (
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <RatingStars rating={s.my_rating} interactive={false} />
                      <span style={{color: 'var(--text-secondary)'}}>{s.my_rating} / 5</span>
                    </div>
                  ) : (
                    <span style={{color: 'var(--text-secondary)'}}>Not rated yet</span>
                  )}
                </td>
                <td>
                  <RatingStars 
                    rating={s.my_rating || 0} 
                    onRate={(val) => handleRating(s.id, val, !!s.my_rating)} 
                  />
                  <div style={{fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px'}}>
                    {s.my_rating ? 'Update Rating' : 'Rate Store'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserStores;
