const router = require('express').Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const tasks = await Task.find().populate('assignedTo', 'name email');
  res.json(tasks);
});

router.post('/', auth, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    req.app.get('io').emit('task:new', task);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.app.get('io').emit('task:updated', task);
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  req.app.get('io').emit('task:deleted', req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
