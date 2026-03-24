const router = require('express').Router();
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const leads = await Lead.find().populate('assignedTo', 'name email');
  res.json(leads);
});

router.post('/', auth, async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    req.app.get('io').emit('lead:new', lead);
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.app.get('io').emit('lead:updated', lead);
    res.json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  req.app.get('io').emit('lead:deleted', req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
