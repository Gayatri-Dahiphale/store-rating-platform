import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RatingStars from '../../components/RatingStars';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/owner/dashboard');
        setDashboardData(res.data.data);
      } catch (err) {
        setError('Unable to load dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Store Dashboard</h2>
        <p>Manage your stores and view customer ratings.</p>
      </div>

      {error && <div className="error-msg">{error}</div>}
      
      {loading ? (
        <div>Loading dashboard...</div>
      ) : dashboardData.length === 0 ? (
        <div className="empty-state">
          <h3>No stores assigned yet</h3>
          <p>You don't own any stores yet. Please contact the system administrator.</p>
        </div>
      ) : (
        dashboardData.map(store => (
          <div key={store.id} className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '20px' }}>{store.name}</h3>
              <p style={{ margin: 0 }}>{store.address}</p>
            </div>
            
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '6px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Average Rating</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-main)' }}>{store.average_rating > 0 ? store.average_rating : '0'}</span>
                  <RatingStars rating={Math.round(store.average_rating || 0)} interactive={false} />
                </div>
              </div>
              <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '6px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Total Ratings</p>
                <p style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>{store.rating_count}</p>
              </div>
            </div>

            <h4 style={{ marginBottom: '1rem', fontSize: '16px' }}>Ratings Received</h4>
            {store.users && store.users.length > 0 ? (
              <div className="table-container" style={{ marginTop: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Rating</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.users.map(u => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 500 }}>{u.name}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RatingStars rating={u.rating} interactive={false} />
                            <span style={{ color: 'var(--text-secondary)' }}>{u.rating}/5</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>No ratings received yet.</div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OwnerDashboard;
