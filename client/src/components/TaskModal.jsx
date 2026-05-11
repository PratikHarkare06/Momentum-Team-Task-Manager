import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask, updateTask } from '../redux/slices/tasksSlice';
import toast from 'react-hot-toast';
import { X, CheckSquare } from 'lucide-react';

export default function TaskModal({ onClose, task = null, projectId, members = [] }) {
  const dispatch = useDispatch();
  const isEdit = !!task;

  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    assignedTo: task?.assignedTo?._id || task?.assignedTo || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
    projectId: task?.projectId?._id || task?.projectId || projectId || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Task title is required');
    setLoading(true);
    try {
      if (isEdit) {
        await dispatch(updateTask({ id: task._id, data: form })).unwrap();
        toast.success('Task updated!');
      } else {
        await dispatch(createTask(form)).unwrap();
        toast.success('Task created!');
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
            <CheckSquare size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button className="btn btn-ghost" onClick={onClose} id="close-task-modal"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                id="task-title"
                className="form-input"
                name="title"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={handleChange}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                id="task-description"
                className="form-textarea"
                name="description"
                placeholder="Add details about this task…"
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select id="task-status" className="form-select" name="status" value={form.status} onChange={handleChange}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select id="task-priority" className="form-select" name="priority" value={form.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {members.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select id="task-assign" className="form-select" name="assignedTo" value={form.assignedTo} onChange={handleChange}>
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  id="task-due-date"
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
            <button id="submit-task" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
