import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../redux/slices/tasksSlice';
import { fetchProjects } from '../redux/slices/projectsSlice';
import { Plus, Search, Download, MoreHorizontal, Calendar, Trash2, Edit2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['Todo', 'In Progress', 'Completed', 'Blocked'];
const PRIORITIES = ['High', 'Medium', 'Low'];

function getStatusBadge(s) {
  if (!s) return null;
  const map = { 'todo': 'badge-gray', 'in progress': 'badge-blue', 'completed': 'badge-green', 'blocked': 'badge-red', 'in-progress': 'badge-blue' };
  const cls = map[s?.toLowerCase()] || 'badge-gray';
  return <span className={`badge ${cls}`}>{s}</span>;
}

function getPriorityDot(p) {
  const cls = p === 'High' ? 'dot-red' : p === 'Medium' ? 'dot-yellow' : 'dot-green';
  return <span className={`dot ${cls}`} />;
}

const COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#E5484D', '#8B5CF6'];

export default function Tasks() {
  const dispatch = useDispatch();
  const { list: tasks, loading } = useSelector(s => s.tasks);
  const { list: projects } = useSelector(s => s.projects);
  const { user } = useSelector(s => s.auth);
  const isAdmin = user?.role === 'admin';

  const [view, setView] = useState('table');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '', projectId: '', assignee: '' });
  const [creating, setCreating] = useState(false);
  const [menuId, setMenuId] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  const filtered = (tasks || []).filter(t => {
    const matchSearch = t.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || t.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchPriority = !filterPriority || t.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await dispatch(createTask(form)).unwrap();
      toast.success('Task created!');
      setShowModal(false);
      setForm({ title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '', project: '', assignee: '' });
    } catch (err) { toast.error(err || 'Failed'); }
    finally { setCreating(false); }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await dispatch(updateTask({ id: task._id, data: { status: newStatus } })).unwrap();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete task?')) return;
    try { await dispatch(deleteTask(id)).unwrap(); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  const exportCSV = () => {
    const rows = [['Task ID', 'Task Name', 'Status', 'Priority', 'Due Date']];
    filtered.forEach((t, i) => rows.push([`T-${i + 101}`, t.title, t.status, t.priority, t.dueDate || '—']));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'tasks.csv'; a.click();
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">All Tasks</div>
          <div className="page-sub">Manage and track all project activities in one place</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={exportCSV}><Download size={14} /> Export CSV</button>
          {isAdmin && (
            <button id="create-task-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={15} /> Create Task
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <select className="form-select" style={{ width: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Status ▾</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-select" style={{ width: 140 }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="">Priority ▾</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={14} />
          <input placeholder="Search tasks, IDs, or members..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
          Showing {filtered.length} tasks
        </span>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={36} style={{ margin: '0 auto' }} />
            <h3>No tasks found</h3>
            <p>Try adjusting your filters or create a new task.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>TASK ID ↕</th>
                <th>TASK NAME ↕</th>
                <th>STATUS ↕</th>
                <th>PRIORITY ↕</th>
                <th>ASSIGNEE</th>
                <th>DUE DATE ↕</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task, i) => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
                return (
                  <tr key={task._id}>
                    <td style={{ color: 'var(--text-3)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>T-{101 + i}</td>
                    <td style={{ fontWeight: 500, maxWidth: 220 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</div>
                    </td>
                    <td>{getStatusBadge(task.status)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {getPriorityDot(task.priority)}
                        <span style={{ fontSize: '0.83rem' }}>{task.priority}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar avatar-sm" style={{ background: COLORS[i % COLORS.length], fontSize: '0.6rem' }}>
                          {(task.assignee?.name || task.assignee?.email || 'U').slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.83rem' }}>{task.assignee?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className={isOverdue ? 'overdue' : ''} style={{ fontSize: '0.83rem' }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td>
                      <div className="dropdown" style={{ position: 'relative' }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 6px' }} onClick={() => setMenuId(menuId === task._id ? null : task._id)}>
                          <MoreHorizontal size={15} />
                        </button>
                        {menuId === task._id && (
                          <div className="dropdown-menu" onClick={() => setMenuId(null)}>
                            {STATUSES.map(s => (
                              <button key={s} className="dropdown-item" onClick={() => handleStatusChange(task, s)}>→ {s}</button>
                            ))}
                            {isAdmin && <button className="dropdown-item danger" onClick={() => handleDelete(task._id)}><Trash2 size={12} /> Delete</button>}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Create Task</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" placeholder="Task title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" placeholder="Task description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                      {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project</label>
                    <select className="form-select" value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}>
                      <option value="">Select project</option>
                      {(projects || []).map(p => <option key={p._id} value={p._id}>{p.title || p.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input className="form-input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating…' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
