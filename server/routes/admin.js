import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs'; // import bcrypt

const router = express.Router();

// List all users
router.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Create user
router.post('/users', async (req, res) => {
    try {
        const { name, role, phone, address, email, status } = req.body;

        let sellerId;
        if (role === 'seller') {
            sellerId = Math.floor(100000 + Math.random() * 900000).toString();
        }

        // Default password logic
        let password = req.body.password || 'default@123';

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            role,
            phone,
            address,
            email,
            status,
            password: hashedPassword,
            ...(role === 'seller' && { sellerId })
        });

        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});
// Update user
router.put('/users/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

export default router;