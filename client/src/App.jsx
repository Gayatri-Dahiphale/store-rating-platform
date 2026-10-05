import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import RoleRoute from './components/RoleRoute';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', fontFamily: 'monospace' }}>
          <h1>React Crashed</h1>
          <pre>{this.state.error?.message}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}


// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChangePassword from './pages/auth/ChangePassword';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import AddStore from './pages/admin/AddStore';
import AddUser from './pages/admin/AddUser';

import UserStores from './pages/user/UserStores';
import MyRatings from './pages/user/MyRatings';

import OwnerDashboard from './pages/owner/OwnerDashboard';

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  const getHomeRoute = () => {
    if (!user) return '/login';
    if (user.role === 'SYSTEM ADMINISTRATOR') return '/admin/dashboard';
    if (user.role === 'STORE OWNER') return '/owner/dashboard';
    if (user.role === 'NORMAL USER') return '/stores';
    return '/login';
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to={getHomeRoute()} replace />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to={getHomeRoute()} replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={getHomeRoute()} replace />} />
          
          <Route path="/change-password" element={<RoleRoute allowedRoles={['NORMAL USER', 'STORE OWNER', 'SYSTEM ADMINISTRATOR']}><ChangePassword /></RoleRoute>} />

          <Route path="/admin/dashboard" element={<RoleRoute allowedRoles={['SYSTEM ADMINISTRATOR']}><AdminDashboard /></RoleRoute>} />
          <Route path="/admin/users" element={<RoleRoute allowedRoles={['SYSTEM ADMINISTRATOR']}><AdminUsers /></RoleRoute>} />
          <Route path="/admin/users/new" element={<RoleRoute allowedRoles={['SYSTEM ADMINISTRATOR']}><AddUser /></RoleRoute>} />
          <Route path="/admin/users/:id" element={<RoleRoute allowedRoles={['SYSTEM ADMINISTRATOR']}><AdminUserDetails /></RoleRoute>} />
          <Route path="/admin/stores" element={<RoleRoute allowedRoles={['SYSTEM ADMINISTRATOR']}><AdminStores /></RoleRoute>} />
          <Route path="/admin/stores/new" element={<RoleRoute allowedRoles={['SYSTEM ADMINISTRATOR']}><AddStore /></RoleRoute>} />

          <Route path="/stores" element={<RoleRoute allowedRoles={['NORMAL USER']}><UserStores /></RoleRoute>} />
          <Route path="/my-ratings" element={<RoleRoute allowedRoles={['NORMAL USER']}><MyRatings /></RoleRoute>} />
          
          <Route path="/owner/dashboard" element={<RoleRoute allowedRoles={['STORE OWNER']}><OwnerDashboard /></RoleRoute>} />
          
          <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
