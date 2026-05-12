import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { Eye, EyeOff, Mail, Lock, Rocket, LayoutDashboard, BarChart2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      toast.error(err || 'Login failed');
    }
  };

  return (
    <div className="auth-shell">
      {/* Left panel */}
      <div className="auth-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
          <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Rocket size={18} color="white" />
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>Momentum</span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16, lineHeight: 1.2, fontFamily: 'var(--font-heading)' }}>
            Ship projects faster with Momentum.
          </h1>
          <p style={{ opacity: 0.8, marginBottom: 48, lineHeight: 1.7 }}>
            The all-in-one workspace for high-performance teams to track tasks, manage roadmaps, and collaborate in real-time.
          </p>

          {[
            { icon: LayoutDashboard, title: 'Kanban Mastery', desc: 'Visualize workflows with our intuitive drag-and-drop boards.' },
            { icon: BarChart2, title: 'Advanced Analytics', desc: 'Get deep insights into team velocity and project health.' },
            { icon: Users, title: 'Role-Based Access', desc: 'Securely manage permissions for admins and members.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: '0.83rem', opacity: 0.75 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ opacity: 0.7, fontSize: '0.8rem', marginTop: 32 }}>
          Joined by 10,000+ teams worldwide
        </div>
      </div>

      {/* Right form */}
      <div className="auth-right">
        <div className="auth-form">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 6, fontFamily: 'var(--font-heading)' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: 28 }}>
            New to Momentum? <Link to="/signup" className="link" style={{ fontWeight: 600 }}>Create an account</Link>
          </p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
            <button className="social-btn" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="social-btn" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </button>
          </div>

          <div className="auth-divider">or continue with email</div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <label className="form-label" style={{ color: 'var(--text-3)', fontWeight: 400 }}>Email</label>
              <div className="input-icon">
                <Mail size={15} />
                <input id="login-email" className="form-input" type="email" placeholder="name@company.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <span className="link" style={{ fontSize: '0.78rem' }}>Forgot password?</span>
              </div>
              <label className="form-label" style={{ color: 'var(--text-3)', fontWeight: 400 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}>
                  <Lock size={15} />
                </div>
                <input id="login-password" className="form-input" type={showPw ? 'text' : 'password'}
                  placeholder="••••••••" style={{ paddingLeft: 38, paddingRight: 40 }}
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div className="checkbox-custom"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>Keep me signed in for 30 days</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Receive weekly updates</div>
              </div>
            </div>

            <button id="login-submit" type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem', borderRadius: 'var(--radius-sm)', marginTop: 4 }}>
              {loading ? 'Signing in…' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
