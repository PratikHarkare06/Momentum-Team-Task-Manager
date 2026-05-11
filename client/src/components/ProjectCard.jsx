import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteProject } from '../redux/slices/projectsSlice';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { MoreVertical, Pencil, Trash2, Users, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

function getInitials(name = '') {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function ProjectCard({ project, onEdit }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm(`Delete "${project.title}"? All tasks will be deleted too.`)) return;
    try {
      await dispatch(deleteProject(project._id)).unwrap();
      toast.success('Project deleted');
    } catch (err) {
      toast.error(err || 'Failed to delete');
    }
  };

  const taskCount = project.taskCount || 0;

  return (
    <div className="project-card" onClick={() => navigate(`/projects/${project._id}`)}>
      <div className="project-card-header">
        <div>
          <div className="project-title">{project.title}</div>
          <StatusBadge status={project.status} />
        </div>

        <div className="dropdown" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button className="btn btn-ghost btn-sm" id={`project-menu-${project._id}`} onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(project); }}>
                <Pencil size={14} /> Edit
              </button>
              <button className="dropdown-item danger" onClick={handleDelete}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {project.description && (
        <p className="project-desc">{project.description}</p>
      )}

      <div className="project-meta">
        <div className="members-stack">
          {(project.members || []).slice(0, 4).map((m) => (
            <div key={m._id} className="user-avatar" data-tooltip={m.name}>
              {getInitials(m.name)}
            </div>
          ))}
          {(project.members?.length || 0) > 4 && (
            <div className="user-avatar" style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)', fontSize: '0.6rem' }}>
              +{project.members.length - 4}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: 'auto' }}>
          <Users size={13} />
          {project.members?.length || 0} members
        </div>

        {project.dueDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            <Calendar size={13} />
            {new Date(project.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
