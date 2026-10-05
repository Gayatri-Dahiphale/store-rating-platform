import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RatingStars from '../../components/RatingStars';

const MyRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyRatings = async () => {
      try {
        const res = await api.get('/stores/my/ratings');
        setRatings(res.data.data);
      } catch (err) {
        setError('Unable to load your ratings. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyRatings();
  }, []);

  if (loading) return <div>Loading ratings...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div>
      <h2>My Ratings</h2>
      {ratings.length === 0 ? (
        <div style={{ marginTop: '2rem' }}>No ratings submitted yet.</div>
      ) : (
        <div className="table-container" style={{ marginTop: '1rem' }}>
          <table>
            <thead>
              <tr>
                <th>Store</th>
                <th>My Rating</th>
                <th>Date Updated</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map(r => (
                <tr key={r.id}>
                  <td style={{fontWeight: 500}}>{r.name}</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <RatingStars rating={r.rating} interactive={false} />
                      <span style={{color: 'var(--text-secondary)'}}>{r.rating} / 5</span>
                    </div>
                  </td>
                  <td style={{color: 'var(--text-secondary)'}}>{new Date(r.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyRatings;
