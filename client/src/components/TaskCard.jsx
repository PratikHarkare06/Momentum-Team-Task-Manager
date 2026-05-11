import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../redux/slices/tasksSlice';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { MoreVertical, Pencil, Trash2, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

function getInitials(name = '') {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

const STATUS_CYCLE = ['todo', 'in-progress', 'completed', 'blocked'];

export default function TaskCard({ task, onEdit }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this task?')) return;
    try {
      await dispatch(deleteTask(task._id)).unwrap();
      toast.success('Task deleted');
    } catch (err) { toast.error(err || 'Failed to delete'); }
  };

  const cycleStatus = async (e) => {
    e.stopPropagation();
    const current = STATUS_CYCLE.indexOf(task.status);
    const next = STATUS_CYCLE[(current + 1) % STATUS_CYCLE.length];
    try {
      await dispatch(updateTask({ id: task._id, data: { status: next } })).unwrap();
    } catch (err) { toast.error('Failed to update status'); }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-sm)',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      transition: 'all 0.2s',
      cursor: 'pointer',
    }}>
      {/* Status toggle dot */}
      <button
        onClick={cycleStatus}
        id={`status-toggle-${task._id}`}
        title="Click to change status"
        style={{
          width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
          border: '2px solid var(--border)', background: task.status === 'completed' ? 'var(--success)' : 'transparent',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 600, fontSize: '0.9rem',
          color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
          marginBottom: '8px',
        }}>
          {task.title}
        </div>

        {task.description && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.4 }}>
            {task.description.length > 100 ? task.description.slice(0, 100) + '…' : task.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />

          {task.assignedTo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <div className="user-avatar" style={{ width: 18, height: 18, fontSize: '0.55rem' }}>
                {getInitials(task.assignedTo.name)}
              </div>
              {task.assignedTo.name}
            </div>
          )}

          {task.dueDate && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '0.75rem',
              color: isOverdue ? 'var(--danger)' : 'var(--text-muted)',
              fontWeight: isOverdue ? 600 : 400,
            }}>
              <Calendar size={12} />
              {new Date(task.dueDate).toLocaleDateString()}
              {isOverdue && ' ⚠️'}
            </div>
          )}
        </div>
      </div>

      {/* Actions menu */}
      <div className="dropdown" ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-ghost btn-sm" id={`task-menu-${task._id}`} onClick={() => setShowMenu(!showMenu)}>
          <MoreVertical size={15} />
        </button>
        {showMenu && (
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(task); }}>
              <Pencil size={13} /> Edit
            </button>
            <button className="dropdown-item danger" onClick={handleDelete}>
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
