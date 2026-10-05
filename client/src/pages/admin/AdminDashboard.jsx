import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Store, Star } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data.data))
      .catch(() => setError('Failed to load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'var(--primary)' },
    { label: 'Total Stores', value: stats.totalStores, icon: Store, color: 'var(--success)' },
    { label: 'Total Ratings', value: stats.totalRatings, icon: Star, color: 'var(--warning)' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Dashboard</h2>
        <p>Overview of system statistics.</p>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="stats-grid">
          {statCards.map(card => (
            <div key={card.label} className="card stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h4>{card.label}</h4>
                <card.icon size={20} color={card.color} />
              </div>
              <div className="value">{card.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
