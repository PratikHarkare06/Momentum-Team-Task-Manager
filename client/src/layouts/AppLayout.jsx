import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
  LayoutDashboard, FolderOpen, CheckSquare, Users,
  BarChart2, Settings, LogOut, Bell, Search, Rocket,
  ChevronLeft, ChevronRight, Moon, Sun
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

const bottomNavItems = [
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === 'true');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme-dark') === 'true');

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    localStorage.setItem('theme-dark', String(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>

        {/* Logo row */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><Rocket size={18} /></div>
          {!collapsed && <span>Momentum</span>}
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        <div className="sidebar-divider" />

        {/* Main nav */}
        <nav className="sidebar-section" style={{ flex: 1 }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={17} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-divider" />

        {/* Bottom nav (Notifications, Settings) */}
        <div className="sidebar-section">
          {bottomNavItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={17} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </div>

        {/* User chip — NO logout icon here */}
        <div className="sidebar-bottom">
          <div className="user-chip" onClick={() => navigate('/settings')} title="Settings">
            <div className="avatar" style={{ background: 'var(--accent)', flexShrink: 0 }}>
              {getInitials(user?.name || 'U')}
            </div>
            {!collapsed && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0] || 'User'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 500 }}>
                  {user?.role || 'member'}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            {/* Dark mode toggle */}
            <button
              className="icon-btn"
              onClick={() => setDarkMode(d => !d)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notifications */}
            <button className="icon-btn" onClick={() => navigate('/notifications')}>
              <Bell size={16} />
            </button>

            {/* Avatar */}
            <div
              className="avatar avatar-lg"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/settings')}
              title="Settings"
            >
              {getInitials(user?.name || 'U')}
            </div>

            {/* Logout — single logout button in topbar */}
            <button
              className="icon-btn"
              onClick={handleLogout}
              title="Logout"
              style={{ color: 'var(--accent)' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
