import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, createProject, deleteProject } from '../redux/slices/projectsSlice';
import { Plus, Search, Calendar, MoreHorizontal, Trash2, Settings, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const PRIORITIES = ['All', 'High', 'Medium', 'Low'];
const STATUS_TABS = ['All Projects', 'Ongoing', 'Completed', 'Archived'];

function priorityBadge(p) {
  if (!p) return null;
  const cls = p === 'High' ? 'badge-red' : p === 'Medium' ? 'badge-yellow' : 'badge-green';
  return <span className={`badge ${cls}`}>{p}</span>;
}

function ProjectCard({ project, onDelete, onOpen }) {
  const [menu, setMenu] = useState(false);
  const progress = project.progress ?? Math.floor(Math.random() * 90 + 5);
  const members = project.members || [];
  const colors = ['#6366F1', '#22C55E', '#F59E0B', '#E5484D', '#8B5CF6'];

  return (
    <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow .15s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
      onClick={() => onOpen(project._id)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        {priorityBadge(project.priority)}
        <div className="dropdown" onClick={e => e.stopPropagation()}>
          <button className="btn btn-ghost btn-sm" style={{ padding: '4px 6px', borderRadius: 6 }} onClick={() => setMenu(!menu)}>
            <MoreHorizontal size={15} />
          </button>
          {menu && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => { setMenu(false); onOpen(project._id); }}>
                <Settings size={13} /> Settings
              </button>
              <button className="dropdown-item danger" onClick={() => { setMenu(false); onDelete(project._id); }}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6, color: 'var(--text-1)' }}>{project.name || project.title}</div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text-2)', marginBottom: 16, lineHeight: 1.5, minHeight: 36 }}>
        {project.description || 'No description provided.'}
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>Progress</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="overlap-avatars">
          {members.slice(0, 3).map((m, i) => (
            <div key={i} className="avatar avatar-sm" style={{ background: colors[i % colors.length], fontSize: '0.6rem' }}>
              {(m.name || m.email || 'M').slice(0, 2).toUpperCase()}
            </div>
          ))}
          {members.length === 0 && (
            <div className="avatar avatar-sm" style={{ background: '#6366F1', fontSize: '0.6rem' }}>ME</div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: 'var(--text-3)' }}>
          <Calendar size={12} />
          {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No deadline'}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: projects, loading } = useSelector(s => s.projects);
  const { user } = useSelector(s => s.auth);
  const isAdmin = user?.role === 'admin';

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All Projects');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', dueDate: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const filtered = (projects || []).filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'Ongoing') return matchSearch && p.status !== 'completed' && p.status !== 'archived';
    if (activeTab === 'Completed') return matchSearch && p.status === 'completed';
    if (activeTab === 'Archived') return matchSearch && p.status === 'archived';
    return matchSearch;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await dispatch(createProject(form)).unwrap();
      toast.success('Project created!');
      setShowModal(false);
      setForm({ title: '', description: '', priority: 'Medium', dueDate: '' });
    } catch (err) { toast.error(err || 'Failed to create project'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await dispatch(deleteProject(id)).unwrap(); toast.success('Deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Project Directory</div>
          <div className="page-sub">Manage and track your active workspace projects</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="search-box" style={{ minWidth: 220 }}>
            <Search size={14} />
            <input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {isAdmin && (
            <button id="new-project-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={15} /> New Project
            </button>
          )}
        </div>
      </div>

      {/* Tabs + Sort */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="tab-group">
          {STATUS_TABS.map(t => (
            <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>
        <select className="form-select" style={{ width: 180 }}>
          <option>Recently Updated</option>
          <option>Name A–Z</option>
          <option>Priority</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="empty-state"><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FolderOpen size={40} style={{ margin: '0 auto' }} />
          <h3>No projects found</h3>
          <p>{isAdmin ? 'Create your first project to get started.' : 'You haven\'t been added to any projects yet.'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {filtered.map(p => (
            <ProjectCard key={p._id} project={p} onDelete={handleDelete} onOpen={id => navigate(`/projects/${id}`)} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">New Project</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Project Name *</label>
                  <input className="form-input" placeholder="e.g. Mobile App Redesign"
                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" placeholder="What is this project about?"
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                      <option>High</option><option>Medium</option><option>Low</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input className="form-input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating…' : 'Create Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
