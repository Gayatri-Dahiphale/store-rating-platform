import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Home, User, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand">Store Rating Platform</div>
      <div className="nav-links">
        {user.role === 'SYSTEM ADMINISTRATOR' && (
          <>
            <Link to="/admin/dashboard"><Home size={18}/> Dashboard</Link>
            <Link to="/admin/users"><User size={18}/> Users</Link>
            <Link to="/admin/stores"><Home size={18}/> Stores</Link>
          </>
        )}
        {user.role === 'STORE OWNER' && (
          <>
            <Link to="/owner/dashboard"><Home size={18}/> Dashboard</Link>
            <Link to="/change-password"><Settings size={18}/> Password</Link>
          </>
        )}
        {user.role === 'NORMAL USER' && (
          <>
            <Link to="/stores"><Home size={18}/> Stores</Link>
            <Link to="/my-ratings"><User size={18}/> My Ratings</Link>
            <Link to="/change-password"><Settings size={18}/> Password</Link>
          </>
        )}
        <button className="btn-logout" onClick={handleLogout}><LogOut size={18}/> Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
