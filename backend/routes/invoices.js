const router = require('express').Router();
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const invoices = await Invoice.find().populate('client', 'name');
  res.json(invoices);
});

router.post('/', auth, async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(invoice);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
