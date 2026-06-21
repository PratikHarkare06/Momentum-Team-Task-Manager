import React, { useState, useEffect } from 'react';
import { Bell, CheckSquare, AtSign, Clock, Package } from 'lucide-react';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../services/api';

const TABS = ['All', 'Unread', 'Mentions', 'Deadlines'];

const iconMap = {
  task: <CheckSquare size={16} />,
  mention: <AtSign size={16} />,
  deadline: <Clock size={16} />,
  system: <Bell size={16} />,
};

const iconColors = { task: '#22C55E', mention: '#E5484D', deadline: '#F59E0B', system: '#3B82F6' };

export default function Notifications() {
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  // Group notifications by date (Today, Yesterday, Older)
  const groupedNotifications = () => {
    const groups = { 'Today': [], 'Yesterday': [], 'Older': [] };
    
    notifications.forEach(n => {
      const date = new Date(n.createdAt);
      const timeStr = formatDistanceToNow(date, { addSuffix: true });
      const item = { ...n, time: timeStr, unread: !n.isRead };
      
      // Filtering logic
      const matchTab = tab === 'All' || (tab === 'Unread' && item.unread) || (tab === 'Mentions' && item.type === 'mention') || (tab === 'Deadlines' && item.type === 'deadline');
      const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.body.toLowerCase().includes(search.toLowerCase());
      
      if (matchTab && matchSearch) {
        if (isToday(date)) groups['Today'].push(item);
        else if (isYesterday(date)) groups['Yesterday'].push(item);
        else groups['Older'].push(item);
      }
    });

    return [
      { group: 'Today', items: groups['Today'] },
      { group: 'Yesterday', items: groups['Yesterday'] },
      { group: 'Older', items: groups['Older'] }
    ].filter(g => g.items.length > 0);
  };

  const groups = groupedNotifications();

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="page-title">Notifications</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="btn btn-ghost btn-sm link" onClick={markAllAsRead}>Mark all as read</button>
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
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>Loading notifications...</div>
      ) : groups.length === 0 ? (
        <div className="empty-state">
          <Bell size={36} style={{ margin: '0 auto' }} />
          <h3>All caught up!</h3>
          <p>No notifications in this category.</p>
        </div>
      ) : groups.map(g => (
        <div key={g.group} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-3)', marginBottom: 12 }}>{g.group}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {g.items.map((n) => (
              <div key={n._id} className="card" style={{
                borderRadius: 12, position: 'relative',
                borderLeft: n.unread ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'box-shadow .15s', cursor: 'pointer'
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
                onClick={() => markAsRead(n._id, n.isRead)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  {/* Icon */}
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: `${iconColors[n.type] || '#888'}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: iconColors[n.type] || '#888'
                  }}>
                    {iconMap[n.type] || <Bell size={16} />}
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
