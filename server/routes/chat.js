import express from 'express';
import Chat from '../models/chat.js'; // Model for buyer-seller chat
import Message from '../models/Message.js'; // If you're using a separate Message model

const router = express.Router();

// ✅ Get or create chat between buyer & seller for product
router.post('/get', async (req, res) => {
  const { buyerId, sellerId, productId } = req.body;

  try {
    let chat = await Chat.findOne({ buyerId, sellerId, productId });
    if (!chat) {
      chat = new Chat({ buyerId, sellerId, productId, messages: [] });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get/create chat' });
  }
});

// ✅ Send message in chat
router.post('/send', async (req, res) => {
  const { buyerId, sellerId, productId, from, text } = req.body;

  try {
    const chat = await Chat.findOneAndUpdate(
      { buyerId, sellerId, productId },
      { $push: { messages: { from, text, timestamp: new Date() } } },
      { new: true }
    );

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ✅ Save message using a separate Message model (optional)
router.post('/messages', async (req, res) => {
  const { buyerName, sellerId, message, productId } = req.body;

  try {
    const chat = await Message.create({ buyerName, sellerId, message, productId });
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// ✅ Get all messages for a seller
router.get('/messages/:sellerId', async (req, res) => {
  try {
    const chats = await Message.find({ sellerId: req.params.sellerId });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
