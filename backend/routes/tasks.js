const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Get tasks visible to current user
// User can see tasks where:
// 1. They created it (createdBy = user)
// 2. They are assigned to it (assignee = user)
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user._id },
        { assignee: req.user._id }
      ]
    })
    .populate('assignee')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single task (only if user is involved)
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee')
      .populate('createdBy', 'name email');
      
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user has access to this task
    const isCreator = task.createdBy._id.toString() === req.user._id.toString();
    const isAssignee = task.assignee && task.assignee._id.toString() === req.user._id.toString();
    
    if (!isCreator && !isAssignee) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assigneeId } = req.body;
    
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      assignee: assigneeId || null,
      createdBy: req.user._id, // Track who created it
    });

    await task.save();
    await task.populate('assignee');
    await task.populate('createdBy', 'name email');
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task (only if user is involved)
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user has access
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAssignee = task.assignee && task.assignee.toString() === req.user._id.toString();
    
    if (!isCreator && !isAssignee) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { title, description, dueDate, priority, status, assigneeId } = req.body;
    
    // Only creator can change everything, assignee can only change status
    if (isCreator) {
      if (title) task.title = title;
      if (description) task.description = description;
      if (dueDate) task.dueDate = dueDate;
      if (priority) task.priority = priority;
      if (status) task.status = status;
      if (assigneeId !== undefined) task.assignee = assigneeId || null;
    } else {
      // Assignee can only update status
      if (status) task.status = status;
    }

    await task.save();
    await task.populate('assignee');
    await task.populate('createdBy', 'name email');
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete task (only creator can delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Only creator can delete
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only task creator can delete' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
