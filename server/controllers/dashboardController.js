const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all projects the user is part of
    const projects = await Project.find({
      $or: [{ createdBy: userId }, { members: userId }],
    });

    const projectIds = projects.map((p) => p._id);

    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === 'active').length;
    const completedProjects = projects.filter((p) => p.status === 'completed').length;

    const tasks = await Task.find({ projectId: { $in: projectIds } });

    const totalTasks = tasks.length;
    const todoTasks = tasks.filter((t) => t.status === 'todo').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const blockedTasks = tasks.filter((t) => t.status === 'blocked').length;

    const now = new Date();
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
    ).length;

    // My assigned tasks
    const myTasks = tasks.filter(
      (t) => t.assignedTo && t.assignedTo.toString() === userId.toString()
    ).length;

    res.json({
      success: true,
      stats: {
        projects: { total: totalProjects, active: activeProjects, completed: completedProjects },
        tasks: {
          total: totalTasks,
          todo: todoTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
          blocked: blockedTasks,
          overdue: overdueTasks,
          myTasks,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get overdue tasks
// @route   GET /api/dashboard/overdue
// @access  Private
const getOverdueTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      $or: [{ createdBy: userId }, { members: userId }],
    });

    const projectIds = projects.map((p) => p._id);
    const now = new Date();

    const overdueTasks = await Task.find({
      projectId: { $in: projectIds },
      dueDate: { $lt: now },
      status: { $ne: 'completed' },
    })
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title')
      .sort({ dueDate: 1 });

    res.json({ success: true, tasks: overdueTasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get task distribution per project (for charts)
// @route   GET /api/dashboard/chart-data
// @access  Private
const getChartData = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      $or: [{ createdBy: userId }, { members: userId }],
    }).select('title');

    const chartData = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ projectId: project._id });
        return {
          name: project.title.length > 15 ? project.title.slice(0, 15) + '…' : project.title,
          todo: tasks.filter((t) => t.status === 'todo').length,
          inProgress: tasks.filter((t) => t.status === 'in-progress').length,
          completed: tasks.filter((t) => t.status === 'completed').length,
          blocked: tasks.filter((t) => t.status === 'blocked').length,
        };
      })
    );

    res.json({ success: true, chartData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats, getOverdueTasks, getChartData };
