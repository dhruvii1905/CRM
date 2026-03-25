const router = require('express').Router();
const Followup = require('../models/Followup');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const followups = await Followup.find().populate('assignedTo', 'name');
  // auto mark overdue
  const now = new Date();
  for (const f of followups) {
    if (f.status === 'pending' && new Date(f.dueDate) < now) {
      f.status = 'overdue';
      await f.save();
    }
  }
  res.json(followups);
});

router.post('/', auth, async (req, res) => {
  try {
    const followup = await Followup.create(req.body);
    res.status(201).json(followup);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const followup = await Followup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(followup);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  await Followup.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
