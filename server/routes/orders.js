// routes/orders.js
const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.post('/', async (req, res) => {
    const { name, phone, pincode, address, cart } = req.body;

    if (!name || !phone || !pincode || !address || !cart || cart.length === 0) {
      return res.status(400).json({ error: 'Missing fields or empty cart' });
    }

    try {
      const newOrder = {
        name,
        phone,
        pincode,
        address,
        cart,
        status: 'pending',
        createdAt: new Date(),
      };

      await db.collection('orders').insertOne(newOrder);

      res.json({ message: 'Order placed successfully via COD' });
    } catch (err) {
      console.error('Error saving order:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};
