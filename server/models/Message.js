const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  buyerName: String,
  sellerId: String,
  message: String,
  productId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', messageSchema);
