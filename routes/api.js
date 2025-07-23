const express = require('express');
const router = express.Router();
const orders = require('../models/orders');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  orders.validateUser(username, password, (err, user) => {
    if (user) res.status(200).json({ success: true });
    else res.status(401).json({ error: 'Invalid credentials' });
  });
});

router.post('/save-order', (req, res) => {
  const { items, total } = req.body;
  orders.saveOrder(total, (err, orderId) => {
    if (err) return res.status(500).json({ error: 'Save failed' });
    res.status(200).json({ orderId });
  });
});

router.get('/items', (_, res) => {
  res.json(require('../items.json'));
});

router.get('/history', (_, res) => {
  orders.getHistory((err, rows) => res.json(rows));
});

router.get('/stats', (_, res) => {
  orders.getStats((err, data) => res.json(data));
});

module.exports = router;
