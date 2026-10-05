import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [sort, setSort] = useState('id');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/admin/users', { params: { search, role, sort, order } });
      setUsers(res.data.data);
    } catch (err) {
      setError('Unable to load users. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role, sort, order]);

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
          <h2>User Management</h2>
          <p>View and manage all registered users.</p>
        </div>
        <Link to="/admin/users/new" className="btn btn-primary">+ Add User</Link>
      </div>

      <div className="toolbar">
        <input 
          className="form-control"
          type="text" 
          placeholder="Search by name, email, address..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
        <select className="form-control" value={role} onChange={e => setRole(e.target.value)} style={{ width: 'auto', minWidth: '200px' }}>
          <option value="">All Roles</option>
          <option value="SYSTEM ADMINISTRATOR">System Administrator</option>
          <option value="NORMAL USER">Normal User</option>
          <option value="STORE OWNER">Store Owner</option>
        </select>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name {sort === 'name' && (order === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('email')}>Email {sort === 'email' && (order === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('address')}>Address {sort === 'address' && (order === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('role')}>Role {sort === 'role' && (order === 'asc' ? '↑' : '↓')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{textAlign: 'center'}}>Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="empty-state">No users found matching your filters.</td></tr>
            ) : users.map(u => (
              <tr key={u.id}>
                <td style={{fontWeight: 500}}>{u.name}</td>
                <td>{u.email}</td>
                <td style={{color: 'var(--text-secondary)'}}>{u.address}</td>
                <td>
                  <span className={`badge ${u.role === 'SYSTEM ADMINISTRATOR' ? 'badge-admin' : u.role === 'STORE OWNER' ? 'badge-owner' : 'badge-user'}`}>
                    {u.role === 'SYSTEM ADMINISTRATOR' ? 'Administrator' : u.role === 'STORE OWNER' ? 'Store Owner' : 'Normal User'}
                  </span>
                </td>
                <td>
                  <Link to={`/admin/users/${u.id}`} className="btn btn-secondary" style={{height: '32px', padding: '0 0.75rem', fontSize: '13px'}}>View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
