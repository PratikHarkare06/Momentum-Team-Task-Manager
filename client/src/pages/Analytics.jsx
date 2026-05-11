import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Download, Calendar } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
const PIE_COLORS = ['#22C55E', '#E5484D', '#F59E0B', '#6B7280'];

const pieData = [
  { name: 'Completed', value: 45 },
  { name: 'In Progress', value: 25 },
  { name: 'Todo', value: 20 },
  { name: 'Blocked', value: 10 },
];

const barData = DAYS.map(d => ({ day: d, tasks: 15 + Math.floor(Math.random() * 25) }));
const areaData = WEEKS.map((w, i) => ({ week: w, tasks: 8 + i * 3 + Math.floor(Math.random() * 6) }));

const teamActivity = [
  { initials: 'JD', name: 'John Doe', action: "completed 'API Int...", time: '2 mins ago' },
  { initials: 'AS', name: 'Alice Smith', action: "moved 'Design S...", time: '15 mins ago' },
  { initials: 'MK', name: 'Mike King', action: "commented on 'D...", time: '1 hour ago' },
];

export default function Analytics() {
  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Productivity Analytics</div>
          <div className="page-sub">Deep dive into team performance and project velocity</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary"><Download size={14} /> Export Report</button>
          <button className="btn btn-yellow"><Calendar size={14} /> Last 30 Days</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '✅', value: '128', label: 'Completed Tasks', trend: '+12%', up: true },
          { icon: '⚡', value: '42', label: 'Active Sprints', trend: '+5%', up: true },
          { icon: '📊', value: '94%', label: 'Team Velocity', trend: '+2.4%', up: true },
          { icon: '⚠️', value: '12', label: 'Overdue Tasks', trend: '-8%', up: false },
        ].map(s => (
          <div key={s.label} className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: s.up ? '#22C55E' : '#E5484D' }}>{s.trend}</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="section-title">Weekly Task Completion</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-3)' }}>
              <span>✓</span> Current Week
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #E8E5E0', borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="tasks" fill="#E5484D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 8 }}>Task Status Distribution</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', marginTop: 8 }}>
            {pieData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-2)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i], flexShrink: 0 }} />
                {d.name} {d.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 20 }}>Productivity Trends</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E5484D" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#E5484D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #E8E5E0', borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="tasks" stroke="#E5484D" strokeWidth={2.5} fill="url(#grad2)" dot={{ r: 3, fill: '#E5484D', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="section-title">Team Activity</div>
            <button className="btn btn-ghost btn-sm link">See All</button>
          </div>
          {teamActivity.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
              <div className="avatar avatar-sm" style={{ background: ['#6366F1', '#22C55E', '#F59E0B'][i], fontSize: '0.6rem', flexShrink: 0 }}>
                {a.initials}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{a.name} <span style={{ fontWeight: 400, color: 'var(--text-2)' }}>{a.action}</span></div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
