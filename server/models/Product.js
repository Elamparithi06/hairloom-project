// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // base64 or URL
  sellerId: { type: String, required: false }, // optional
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
