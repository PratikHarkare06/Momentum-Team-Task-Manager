import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Camera, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useSelector(s => s.auth);
  const [profile, setProfile] = useState({
    firstName: (user?.name || 'Alex').split(' ')[0],
    lastName: (user?.name || 'Rivers').split(' ')[1] || 'Rivers',
    email: user?.email || 'alex.rivers@momentum.io',
    jobTitle: 'Senior Project Manager',
  });
  const [prefs, setPrefs] = useState({ darkMode: false, compactView: false, language: 'English (US)' });
  const [notifPrefs, setNotifPrefs] = useState({ taskAssigned: true, mentions: true, deadlines: true, weeklyDigest: false });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/users/profile', { name: `${profile.firstName} ${profile.lastName}` });
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const initials = `${profile.firstName[0] || ''}${profile.lastName[0] || ''}`.toUpperCase();

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div className="page-title">Account Settings</div>
        <div className="page-sub">Manage your profile, notifications, and app preferences.</div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        {/* Profile Info */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>Profile Information</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginBottom: 20 }}>Update your photo and personal details.</div>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>
                {initials}
              </div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', cursor: 'pointer' }}>
                <Camera size={11} color="white" />
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>Profile Picture</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: 8 }}>JPG, GIF or PNG. Max size of 800K</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-secondary btn-sm">Upload New</button>
                <button className="btn btn-ghost btn-sm link">Remove</button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input className="form-input" style={{ paddingLeft: 36 }} value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input className="form-input" value={profile.jobTitle} onChange={e => setProfile({ ...profile, jobTitle: e.target.value })} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </form>
        </div>

        <div className="divider" />

        {/* App Preferences */}
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>App Preferences</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginBottom: 20 }}>Customize your workspace experience.</div>

          {[
            { key: 'darkMode', label: 'Dark Mode', desc: 'Switch between light and dark themes.' },
            { key: 'compactView', label: 'Compact View', desc: 'Show more content with less whitespace.' },
          ].map(p => (
            <div key={p.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 500 }}>{p.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{p.desc}</div>
              </div>
              <button className={`toggle ${prefs[p.key] ? 'on' : ''}`} onClick={() => setPrefs({ ...prefs, [p.key]: !prefs[p.key] })} />
            </div>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14 }}>
            <div>
              <div style={{ fontWeight: 500 }}>Language</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Select your preferred display language.</div>
            </div>
            <select className="form-select" style={{ width: 160 }} value={prefs.language} onChange={e => setPrefs({ ...prefs, language: e.target.value })}>
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>

        <div className="divider" />

        {/* Notification Preferences */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>Notifications</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginBottom: 20 }}>Control which updates you receive.</div>

          {[
            { key: 'taskAssigned', label: 'Task Assigned', desc: 'When a new task is assigned to you' },
            { key: 'mentions', label: 'Mentions', desc: 'When someone mentions you in a comment' },
            { key: 'deadlines', label: 'Upcoming Deadlines', desc: '24h before a task is due' },
            { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of your week every Monday' },
          ].map((n, i) => (
            <div key={n.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <button
                onClick={() => setNotifPrefs({ ...notifPrefs, [n.key]: !notifPrefs[n.key] })}
                style={{ width: 20, height: 20, borderRadius: '50%', background: notifPrefs[n.key] ? 'var(--accent)' : 'var(--border)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .2s' }}
              >
                {notifPrefs[n.key] && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </button>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{n.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{n.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
