const router = require('express').Router();
const Document = require('../models/Document');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const docs = await Document.find().populate('client', 'name');
  res.json(docs);
});

router.post('/', auth, async (req, res) => {
  try {
    const doc = await Document.create(req.body);
    res.status(201).json(doc);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  await Document.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
