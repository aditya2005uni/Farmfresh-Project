const express = require('express');
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();

router.post('/checkout', auth({ required: true, roles: ['user', 'admin'] }), async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    let total = 0;
    const items = cart.items.map((it) => {
      const price = it.product.price;
      total += price * it.qty;
      return { product: it.product._id, qty: it.qty, priceAtPurchase: price };
    });

    const order = new Order({ user: req.user._id, items, total });
    await order.save();

   
    for (const it of cart.items) {
      const p = await Product.findById(it.product._id);
      if (p) {
        p.stock = Math.max(0, p.stock - it.qty);
        await p.save();
      }
    }

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/my', auth({ required: true }), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', auth({ required: true, roles: ['admin'] }), async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:id/status', auth({ required: true, roles: ['admin'] }), async (req, res) => {
  const { status } = req.body; // e.g., processing, completed, cancelled
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
