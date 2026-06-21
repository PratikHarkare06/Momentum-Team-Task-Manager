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
    
    // Broadcast notification to all project members
    try {
      const membersToNotify = project.members.filter(m => m.toString() !== req.user._id.toString());
      const io = req.app.get('io');
      
      const notifications = membersToNotify.map(m => ({
        recipient: m,
        type: 'task',
        title: 'New Task Created',
        body: `A new task '${task.title}' was added to project '${project.title}' by ${req.user.name}.`,
        tag: `Project: ${project.title}`,
        relatedId: task._id
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        if (io) {
          membersToNotify.forEach(m => io.to(m.toString()).emit('new_notification', {
            title: 'New Task Created',
            body: `A new task '${task.title}' was added to project '${project.title}' by ${req.user.name}.`,
            type: 'task'
          }));
        }
      }
    } catch (notifErr) {
      console.error('Failed to broadcast task creation', notifErr);
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
    await task.populate('projectId', 'title members');

    // Broadcast notification to all project members on update
    try {
      const project = task.projectId;
      const membersToNotify = (project.members || []).filter(m => m.toString() !== req.user._id.toString());
      const io = req.app.get('io');

      const notifications = membersToNotify.map(m => ({
        recipient: m,
        type: 'task',
        title: 'Task Updated',
        body: `Task '${task.title}' was updated by ${req.user.name}.`,
        tag: `Project: ${project.title || 'General'}`,
        relatedId: task._id
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        if (io) {
          membersToNotify.forEach(m => io.to(m.toString()).emit('new_notification', {
            title: 'Task Updated',
            body: `Task '${task.title}' was updated by ${req.user.name}.`,
            type: 'task'
          }));
        }
      }
    } catch (notifErr) {
      console.error('Failed to broadcast task update', notifErr);
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
    const task = await Task.findById(req.params.id).populate('projectId', 'title members');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    if (!isCreator && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    const project = task.projectId;
    await task.deleteOne();

    // Broadcast deletion to all project members
    try {
      if (project && project.members) {
        const membersToNotify = project.members.filter(m => m.toString() !== req.user._id.toString());
        const io = req.app.get('io');

        const notifications = membersToNotify.map(m => ({
          recipient: m,
          type: 'task',
          title: 'Task Deleted',
          body: `Task '${task.title}' was deleted by ${req.user.name}.`,
          tag: `Project: ${project.title}`
        }));

        if (notifications.length > 0) {
          await Notification.insertMany(notifications);
          if (io) {
            membersToNotify.forEach(m => io.to(m.toString()).emit('new_notification', {
              title: 'Task Deleted',
              body: `Task '${task.title}' was deleted by ${req.user.name}.`,
              type: 'task'
            }));
          }
        }
      }
    } catch (notifErr) {
      console.error('Failed to broadcast task deletion', notifErr);
    }

    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
