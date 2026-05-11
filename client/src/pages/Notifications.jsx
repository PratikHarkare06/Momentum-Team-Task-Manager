import React, { useState } from 'react';
import { Bell, CheckSquare, AtSign, Clock, Package } from 'lucide-react';

const TABS = ['All', 'Unread', 'Mentions', 'Deadlines'];

const NOTIFICATIONS = [
  {
    group: 'Today',
    items: [
      { icon: '👤', type: 'task', title: 'New Task Assigned', body: "You have been assigned to 'Implement OAuth2 Flow' by Sarah Chen.", tag: 'Project: Security Audit', time: '2m ago', unread: true },
      { icon: '@', type: 'mention', title: 'Mentioned in Comments', body: "@Alex Rivera could you take a look at the latest Figma prototype for the dashboard?", tag: 'Task: UI Review', time: '45m ago', unread: true },
      { icon: '⏰', type: 'deadline', title: 'Upcoming Deadline', body: "The 'API Documentation' task is due in 4 hours.", tag: 'Project: Backend V2', time: '2h ago', unread: true },
    ]
  },
  {
    group: 'Yesterday',
    items: [
      { icon: '👤', type: 'task', title: 'Project Invitation', body: "You were added to the 'Mobile App Redesign' workspace.", tag: 'Momentum Workspace', time: 'Yesterday', unread: false },
    ]
  }
];

const iconColors = { task: '#22C55E', mention: '#E5484D', deadline: '#F59E0B' };

export default function Notifications() {
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  const groups = NOTIFICATIONS.map(g => ({
    ...g,
    items: g.items.filter(n => {
      const matchTab = tab === 'All' || (tab === 'Unread' && n.unread) || (tab === 'Mentions' && n.type === 'mention') || (tab === 'Deadlines' && n.type === 'deadline');
      const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    })
  })).filter(g => g.items.length > 0);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="page-title">Notifications</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="btn btn-ghost btn-sm link">Mark all as read</button>
          <div className="search-box">
            <Bell size={14} />
            <input placeholder="Search alerts..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-group" style={{ marginBottom: 28 }}>
        {TABS.map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* Notification groups */}
      {groups.length === 0 ? (
        <div className="empty-state">
          <Bell size={36} style={{ margin: '0 auto' }} />
          <h3>All caught up!</h3>
          <p>No notifications in this category.</p>
        </div>
      ) : groups.map(g => (
        <div key={g.group} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-3)', marginBottom: 12 }}>{g.group}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {g.items.map((n, i) => (
              <div key={i} className="card" style={{
                borderRadius: 12, position: 'relative',
                borderLeft: n.unread ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'box-shadow .15s'
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  {/* Icon */}
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: `${iconColors[n.type]}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '1rem'
                  }}>
                    {n.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{n.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 12 }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{n.time}</span>
                        {n.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.83rem', color: 'var(--text-2)', marginBottom: 8, lineHeight: 1.5 }}>{n.body}</div>
                    <span className="badge badge-gray" style={{ fontSize: '0.72rem' }}>{n.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
