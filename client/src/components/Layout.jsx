import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Store, Users, Star, Settings, LogOut, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <div className="app-shell">{children}</div>;

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = location.pathname.startsWith(to);
    return (
      <Link to={to} className={`nav-item ${active ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
        <Icon size={20} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          Store Ratings
          {sidebarOpen && <button className="mobile-menu-btn" onClick={() => setSidebarOpen(false)} style={{marginLeft: 'auto'}}><X size={24}/></button>}
        </div>
        <nav className="sidebar-nav">
          {user.role === 'SYSTEM ADMINISTRATOR' && (
            <>
              <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem to="/admin/users" icon={Users} label="Users" />
              <NavItem to="/admin/stores" icon={Store} label="Store Mgmt" />
            </>
          )}
          {user.role === 'STORE OWNER' && (
            <NavItem to="/owner/dashboard" icon={LayoutDashboard} label="Store Dashboard" />
          )}
          {user.role === 'NORMAL USER' && (
            <>
              <NavItem to="/stores" icon={Store} label="Browse Stores" />
              <NavItem to="/my-ratings" icon={Star} label="My Ratings" />
            </>
          )}
          <div style={{ marginTop: 'auto' }}>
            <NavItem to="/change-password" icon={Settings} label="Settings" />
            <button className="nav-item" onClick={handleLogout} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}><Menu size={24}/></button>
            <h2 style={{ fontSize: '18px', margin: 0 }}>{user.role}</h2>
          </div>
          <div className="header-user">
            <span>{user.name}</span>
          </div>
        </header>
        <main className="page-content">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.5)', zIndex: 35}} onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default Layout;
