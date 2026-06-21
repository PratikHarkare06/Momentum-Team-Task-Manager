const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    let { title, description, assignedTo, projectId, priority, dueDate, status } = req.body;
    
    if (priority) priority = priority.toLowerCase();
    if (status) status = status.toLowerCase().replace(' ', '-');

    if (!title || !projectId) {
      return res.status(400).json({ success: false, message: 'Title and projectId are required' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const task = await Task.create({
      title, description, assignedTo, projectId,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate,
      createdBy: req.user._id,
    });

    await task.populate('assignedTo createdBy', 'name email');
    
    // Emit notification if assigned to someone else
    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: assignedTo,
        type: 'task',
        title: 'New Task Assigned',
        body: `You have been assigned to '${task.title}' by ${req.user.name}.`,
        tag: `Project: ${project.title}`,
        relatedId: task._id
      });
      const io = req.app.get('io');
      io.to(assignedTo.toString()).emit('new_notification', notification);
    }

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tasks (optionally by project)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { projectId, status, priority, assignedTo } = req.query;
    const query = {};

    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const oldStatus = task.status;
    let { title, description, assignedTo, status, priority, dueDate } = req.body;
    if (status) status = status.toLowerCase().replace(' ', '-');
    if (priority) priority = priority.toLowerCase();
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    await task.populate('assignedTo createdBy', 'name email');
    await task.populate('projectId', 'title');

    // Handle re-assignment notification
    const io = req.app.get('io');
    
    if (assignedTo !== undefined && assignedTo !== null && assignedTo.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: assignedTo,
        type: 'task',
        title: 'Task Re-assigned',
        body: `You have been assigned to '${task.title}' by ${req.user.name}.`,
        tag: `Project: ${task.projectId?.title || 'General'}`,
        relatedId: task._id
      });
      if (io) io.to(assignedTo.toString()).emit('new_notification', notification);
    }

    // Handle completed task notification
    if (status === 'completed' && oldStatus !== 'completed' && task.createdBy && task.createdBy._id.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: task.createdBy._id,
        type: 'task',
        title: 'Task Completed',
        body: `The task '${task.title}' was marked as completed by ${req.user.name}.`,
        tag: `Project: ${task.projectId?.title || 'General'}`,
        relatedId: task._id
      });
      if (io) io.to(task.createdBy._id.toString()).emit('new_notification', notification);
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    if (!isCreator && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
