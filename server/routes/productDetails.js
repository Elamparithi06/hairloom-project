// routes/productDetails.js
import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import Product from '../models/Product.js';
import supabase from '../utils/supabaseClient.js';

const router = express.Router();
const storage = multer.memoryStorage(); // use memory for buffer
const upload = multer({ storage });

// POST /api/products - Add product with image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, sellerId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required.' });
    }

    const file = req.file;
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;

    // Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(uniqueFilename, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError.message);
      return res.status(500).json({ error: 'Image upload failed' });
    }

    // Get public URL
    const { publicURL } = supabase.storage
      .from('product-images')
      .getPublicUrl(uniqueFilename);

    const product = new Product({
      name,
      description,
      price,
      image: publicURL,
      sellerId,
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
