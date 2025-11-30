const express = require('express');
const Menu = require('../models/Menu');

const router = express.Router();

// Get categories (MUST be before /:id route)
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Menu.distinct('category');
    res.json(['All', ...categories.sort()]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category && category !== 'All' ? { category } : {};
    const available = req.query.available !== 'false' ? { available: true } : {};
    
    const items = await Menu.find({ ...filter, ...available }).sort({ category: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get menu item by ID (MUST be last)
router.get('/:id', async (req, res) => {
  try {
    const item = await Menu.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
