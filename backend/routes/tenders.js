const router = require('express').Router();
const Tender = require('../models/Tender');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const tenders = await Tender.find().populate('client', 'name').populate('assignedTo', 'name');
  res.json(tenders);
});

router.post('/', auth, async (req, res) => {
  try {
    const tender = await Tender.create(req.body);
    req.app.get('io').emit('tender:new', tender);
    res.status(201).json(tender);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const tender = await Tender.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.app.get('io').emit('tender:updated', tender);
    res.json(tender);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  await Tender.findByIdAndDelete(req.params.id);
  req.app.get('io').emit('tender:deleted', req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
