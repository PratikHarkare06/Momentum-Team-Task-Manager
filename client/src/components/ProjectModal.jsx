import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject, updateProject } from '../redux/slices/projectsSlice';
import toast from 'react-hot-toast';
import { X, FolderPlus } from 'lucide-react';

export default function ProjectModal({ onClose, project = null }) {
  const dispatch = useDispatch();
  const isEdit = !!project;

  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || 'active',
    dueDate: project?.dueDate ? project.dueDate.slice(0, 10) : '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Project title is required');
    setLoading(true);
    try {
      if (isEdit) {
        await dispatch(updateProject({ id: project._id, data: form })).unwrap();
        toast.success('Project updated!');
      } else {
        await dispatch(createProject(form)).unwrap();
        toast.success('Project created! 🎉');
      }
      onClose();
    } catch (err) {
      toast.error(err || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            <FolderPlus size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            {isEdit ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button className="btn btn-ghost" onClick={onClose} id="close-project-modal"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                id="project-title"
                className="form-input"
                name="title"
                placeholder="Enter project title"
                value={form.title}
                onChange={handleChange}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                id="project-description"
                className="form-textarea"
                name="description"
                placeholder="What is this project about?"
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select id="project-status" className="form-select" name="status" value={form.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  id="project-due-date"
                  className="form-input"
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button id="submit-project" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
