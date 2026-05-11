import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
  LayoutDashboard, FolderOpen, CheckSquare, Users,
  BarChart2, Settings, LogOut, Bell, Search, Rocket
} from 'lucide-react';

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
];

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><Rocket size={18} /></div>
          <span>Momentum</span>
        </div>
        <div className="sidebar-divider" />

        <nav className="sidebar-section" style={{ flex: 1 }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-divider" />
        <div className="sidebar-section">
          <NavLink to="/notifications" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Bell size={17} /> Notifications
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Settings size={17} /> Settings
          </NavLink>
          <button className="nav-item" style={{ color: 'var(--text-2)' }} onClick={handleLogout}>
            <LogOut size={17} /> Logout
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="user-chip" onClick={() => navigate('/settings')}>
            <div className="avatar" style={{ background: 'var(--accent)' }}>
              {getInitials(user?.name || 'U')}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name?.split(' ')[0] || 'User'}…
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 500 }}>{user?.role || 'Member'}</div>
            </div>
            <LogOut size={14} style={{ color: 'var(--text-3)', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleLogout(); }} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="search-box">
            <Search size={14} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks..."
              id="global-search"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
            <button className="icon-btn" onClick={() => navigate('/notifications')} id="nav-notifications">
              <Bell size={16} />
            </button>
            <div className="avatar avatar-lg" style={{ cursor: 'pointer' }} onClick={() => navigate('/settings')}>
              {getInitials(user?.name || 'U')}
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
