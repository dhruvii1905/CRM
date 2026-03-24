const router = require('express').Router();
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const customers = await Customer.find().populate('assignedTo', 'name email');
  res.json(customers);
});

router.post('/', auth, async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    req.app.get('io').emit('customer:new', customer);
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.app.get('io').emit('customer:updated', customer);
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  req.app.get('io').emit('customer:deleted', req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
