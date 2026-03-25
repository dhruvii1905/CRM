const router = require('express').Router();
const Gem = require('../models/Gem');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const gems = await Gem.find().populate('client', 'name');
  res.json(gems);
});

router.post('/', auth, async (req, res) => {
  try {
    const gem = await Gem.create(req.body);
    res.status(201).json(gem);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const gem = await Gem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(gem);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  await Gem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
