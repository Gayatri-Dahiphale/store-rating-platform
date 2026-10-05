import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Store, Star } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.data);
      } catch (err) {
        setError('Unable to load dashboard statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Dashboard</h2>
        <p>Overview of system statistics.</p>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div>Loading dashboard...</div>
      ) : (
        <div className="stats-grid">
          <div className="card stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4>Total Users</h4>
              <Users size={20} color="var(--primary)" />
            </div>
            <div className="value">{stats.totalUsers}</div>
          </div>
          
          <div className="card stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4>Total Stores</h4>
              <Store size={20} color="var(--success)" />
            </div>
            <div className="value">{stats.totalStores}</div>
          </div>

          <div className="card stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4>Total Ratings</h4>
              <Star size={20} color="var(--warning)" />
            </div>
            <div className="value">{stats.totalRatings}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
