import express from 'express';
import Seller from '../models/sellerModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sellers' });
  }
});

export default router;
