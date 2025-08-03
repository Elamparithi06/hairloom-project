import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  buyerId: String,
  sellerId: String,
  productId: String,
  messages: [
    {
      from: String, // 'buyer' or 'seller'
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model('Chat', chatSchema);
