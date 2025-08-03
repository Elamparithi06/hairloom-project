import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Create uploads folder if not exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// POST /api/products - Add product with image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !description || !price || !image) {
      return res.status(400).json({ error: 'All fields including image are required' });
    }

    const product = new Product({
      name,
      description,
      price,
      image,
    });

    await product.save();
    res.status(201).json({ message: 'Product saved successfully!' });
  } catch (error) {
    console.error('Product Upload Error:', error.message);
    res.status(500).json({ error: 'Failed to save product.' });
  }
});

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

export default router;
