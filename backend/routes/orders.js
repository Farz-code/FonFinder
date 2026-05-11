const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// POST create order (User)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET my orders (User)
router.get('/myorders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET all orders (Admin)
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT update order status (Admin)
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;