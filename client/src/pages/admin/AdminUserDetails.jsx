import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const AdminUserDetails = () => {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/users/${id}`);
        setUserDetails(res.data.data);
      } catch (err) {
        setError('Unable to load user details. They may not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div>Loading user details...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!userDetails) return <div className="empty-state">User not found</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>User Details</h2>
        <p>Information and associated records for this user.</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>User Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem 2rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Name</div>
          <div style={{ fontWeight: 500 }}>{userDetails.name}</div>
          
          <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Email</div>
          <div>{userDetails.email}</div>
          
          <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Address</div>
          <div>{userDetails.address}</div>
          
          <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Role</div>
          <div>
            <span className={`badge ${userDetails.role === 'SYSTEM ADMINISTRATOR' ? 'badge-admin' : userDetails.role === 'STORE OWNER' ? 'badge-owner' : 'badge-user'}`}>
              {userDetails.role === 'SYSTEM ADMINISTRATOR' ? 'Administrator' : userDetails.role === 'STORE OWNER' ? 'Store Owner' : 'Normal User'}
            </span>
          </div>
        </div>
      </div>

      {userDetails.role === 'STORE OWNER' && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>Owned Stores</h3>
          {userDetails.stores && userDetails.stores.length > 0 ? (
            <div className="table-container" style={{ marginTop: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Store Name</th>
                    <th>Address</th>
                    <th>Average Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {userDetails.stores.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 500 }}>{s.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{s.address}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#FBBF24' }}>★</span>
                          <span style={{ fontWeight: 600 }}>{s.average_rating > 0 ? s.average_rating : 'No ratings'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-state" style={{ padding: '2rem 1rem' }}>This owner currently has no stores assigned.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUserDetails;
