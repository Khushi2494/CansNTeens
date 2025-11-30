const express = require('express');
const Menu = require('../models/Menu');
const Order = require('../models/Order');
const { authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin authorization
router.use(authorizeAdmin);

// Get menu stats
router.get('/analytics', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all menu items
router.get('/menu', async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add menu item
router.post('/menu', async (req, res) => {
  try {
    const { id, name, category, price, image, description, preparationTime } = req.body;

    if (!id || !name || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const item = new Menu({
      id,
      name,
      category,
      price,
      image,
      description,
      preparationTime: preparationTime || 15,
      available: true,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update menu item
router.patch('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await Menu.findOneAndUpdate({ id }, updates, { new: true });
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete menu item
router.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Menu.findOneAndDelete({ id });
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders with filters
router.get('/orders', async (req, res) => {
  try {
    const { status, email } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (email) filter.studentEmail = email;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
