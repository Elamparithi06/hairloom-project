import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
