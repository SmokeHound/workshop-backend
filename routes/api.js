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

router.post('/items', (req, res) => {
  const { name, price } = req.body;
  if (!name || typeof price !== 'number') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  db.query('INSERT INTO items (name, price) VALUES ($1, $2)', [name, price], err => {
    if (err) return res.status(500).json({ error: 'Insert failed' });
    res.status(200).json({ success: true });
  });
});

router.put('/items/:id', (req, res) => {
  const { name, price } = req.body;
  const id = req.params.id;
  db.query('UPDATE items SET name=$1, price=$2 WHERE id=$3', [name, price, id], err => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    res.json({ success: true });
  });
});

router.delete('/items/:id', (req, res) => {
  db.query('DELETE FROM items WHERE id=$1', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ success: true });
  });
});

router.get('/history', (_, res) => {
  orders.getHistory((err, rows) => res.json(rows));
});

router.get('/stats', (_, res) => {
  orders.getStats((err, data) => res.json(data));
});

module.exports = router;
