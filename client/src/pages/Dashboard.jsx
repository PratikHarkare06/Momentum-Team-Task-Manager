import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, FolderOpen, CheckSquare, Clock, AlertCircle } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PIE_COLORS = ['#22C55E', '#E5484D', '#F59E0B', '#6B7280'];
const pieData = [
  { name: 'Done', value: 45 },
  { name: 'In Progress', value: 30 },
  { name: 'Todo', value: 15 },
  { name: 'Blocked', value: 10 },
];

function StatCard({ color, icon: Icon, trend, trendUp, value, label }) {
  return (
    <div className="card stat-card">
      <div className="stat-card-header">
        <div className="stat-dot" style={{ background: color }} />
        <span className={`stat-trend ${trendUp ? 'up' : 'down'}`}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend}
        </span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalProjects: 12, activeTasks: 148, hoursLogged: 320, overdue: 3 });
  const [activity, setActivity] = useState([]);
  const [tab, setTab] = useState('Week');
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    // Generate chart data
    setTrendData(DAYS.map((d, i) => ({ day: d, tasks: 20 + Math.floor(Math.sin(i * 0.8) * 8 + Math.random() * 10) })));
    // Fetch recent activity
    axios.get('/api/tasks?limit=5').then(r => {
      if (r.data?.tasks) setActivity(r.data.tasks.slice(0, 4));
    }).catch(() => {});
    axios.get('/api/projects/stats').then(r => {
      if (r.data) setStats(prev => ({ ...prev, ...r.data }));
    }).catch(() => {});
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Welcome back, {firstName}</div>
          <div className="page-sub">Here's what's happening with your projects today.</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard color="#E5484D" trendUp={true} trend="+2" value={stats.totalProjects} label="Total Projects" />
        <StatCard color="#22C55E" trendUp={true} trend="+12%" value={stats.activeTasks} label="Active Tasks" />
        <StatCard color="#38BDF8" trendUp={false} trend="-4%" value={`${stats.hoursLogged}h`} label="Hours Logged" />
        <StatCard color="#E5484D" trendUp={true} trend="0" value={stats.overdue} label="Overdue" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 24 }}>
        {/* Area Chart */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="section-title">Productivity Trends</div>
            <div className="tab-group">
              {['Week', 'Month', 'Year'].map(t => (
                <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E5484D" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#E5484D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #E8E5E0', borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="tasks" stroke="#E5484D" strokeWidth={2.5} fill="url(#grad)" dot={{ r: 4, fill: '#E5484D', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 8 }}>Task Status</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', marginTop: 8 }}>
            {pieData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-2)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i], flexShrink: 0 }} />
                {d.name} {d.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Activity */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="section-title">Recent Activity</div>
            <button className="btn btn-ghost btn-sm link" onClick={() => navigate('/tasks')}>View All</button>
          </div>
          {activity.length === 0 ? (
            [
              { name: 'Sarah Chen', action: 'completed task', target: 'Design System Audit', time: '2m ago' },
              { name: 'James Wilson', action: 'commented on', target: 'API Integration', time: '15m ago' },
              { name: 'Mike Taylor', action: 'moved task to Done', target: 'Database Schema', time: '1h ago' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div className="avatar" style={{ background: ['#6366F1', '#22C55E', '#F59E0B'][i] }}>
                  {a.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600 }}>{a.name}</span> <span style={{ color: 'var(--text-2)' }}>{a.action}</span>{' '}
                  <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{a.target}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{a.time}</div>
              </div>
            ))
          ) : activity.map((t, i) => (
            <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < activity.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div className="avatar">{(t.assignee?.name || 'U').slice(0, 2).toUpperCase()}</div>
              <div style={{ flex: 1 }}><span style={{ fontWeight: 500 }}>{t.title}</span></div>
              <div className="badge badge-gray" style={{ fontSize: '0.7rem' }}>{t.status}</div>
            </div>
          ))}
        </div>

        {/* Team Performance */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>Team Performance</div>
          {[
            { name: 'Sarah Chen', pct: 85, color: '#22C55E' },
            { name: 'James Wilson', pct: 62, color: '#E5484D' },
            { name: 'Mike Taylor', pct: 74, color: '#6366F1' },
            { name: 'Emma Lewis', pct: 91, color: '#22C55E' },
          ].map(m => (
            <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div className="avatar" style={{ background: m.color, flexShrink: 0 }}>
                {m.name.split(' ').map(w => w[0]).join('')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{m.name}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${m.pct}%`, background: m.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
