import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../redux/slices/authSlice';
import { Eye, EyeOff, Mail, Lock, User, Rocket } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signup(form)).unwrap();
      toast.success('Account created! Welcome to Momentum 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err || 'Signup failed');
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
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16, fontFamily: 'var(--font-heading)' }}>Start shipping faster today.</h1>
          <p style={{ opacity: 0.8, lineHeight: 1.7 }}>
            Join 10,000+ teams who use Momentum to stay aligned, move fast, and deliver results.
          </p>
          <div style={{ marginTop: 40, padding: 20, background: 'rgba(255,255,255,0.12)', borderRadius: 12, backdropFilter: 'blur(4px)' }}>
            <div style={{ fontStyle: 'italic', marginBottom: 12, opacity: 0.9, lineHeight: 1.6, fontSize: '0.9rem' }}>
              "Momentum transformed how our team collaborates. We ship 3x faster now."
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem' }}>SC</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Sarah Chen</div>
                <div style={{ opacity: 0.7, fontSize: '0.78rem' }}>Engineering Lead @ Vercel</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-right">
        <div className="auth-form">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 6, fontFamily: 'var(--font-heading)' }}>Create your account</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: 28 }}>
            Already have an account? <Link to="/login" className="link" style={{ fontWeight: 600 }}>Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon">
                <User size={15} />
                <input id="signup-name" className="form-input" type="text" placeholder="Alex Rivers"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon">
                <Mail size={15} />
                <input id="signup-email" className="form-input" type="email" placeholder="name@company.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}>
                  <Lock size={15} />
                </div>
                <input id="signup-password" className="form-input" type={showPw ? 'text' : 'password'}
                  placeholder="Minimum 8 characters" style={{ paddingLeft: 38, paddingRight: 40 }}
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select id="signup-role" className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button id="signup-submit" type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem', borderRadius: 'var(--radius-sm)', marginTop: 4 }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', textAlign: 'center' }}>
              By signing up you agree to our <span className="link">Terms of Service</span> and <span className="link">Privacy Policy</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
