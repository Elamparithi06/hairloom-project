import express from 'express';
import User from '../models/User.js';
import { generateOtp, otpExpiry } from '../utils/otp.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// 📤 Send OTP
router.post('/send-otp', async (req, res) => {
    const { phone, email } = req.body;
    let user;
    if (phone) user = await User.findOne({ phone });
    else if (email) user = await User.findOne({ email });
    else return res.status(400).json({ error: 'Phone or email is required' });

    if (!user) return res.status(404).json({ error: 'User not found. Please create account.' });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = otpExpiry();
    await user.save();

    // Log OTP for testing
    console.log(`OTP for ${phone || email}: ${otp}`);

    res.json({ success: true, message: 'OTP sent successfully (check server console)' });
});

// ✅ Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { phone, email, otp } = req.body;
    let user;
    if (phone) user = await User.findOne({ phone });
    else if (email) user = await User.findOne({ email });
    else return res.status(400).json({ error: 'Phone or email is required' });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.otp !== otp || new Date() > user.otpExpires)
        return res.status(401).json({ error: 'Invalid or expired OTP' });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ success: true, role: user.role, user });
});

// 👤 Password Login
router.post('/login', async (req, res) => {
    const { phone, email, password } = req.body;
    let user;
    if (phone) user = await User.findOne({ phone });
    else if (email) user = await User.findOne({ email });
    else return res.status(400).json({ error: 'Phone or email is required' });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // If password is hashed, use bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ success: true, role: user.role, user });
});

// 👤 Create Account
router.post('/create-account', async (req, res) => {
    const { name, phone, role, address } = req.body;

    if (!name || !phone || !role)
        return res.status(400).json({ error: 'Name, phone, and role are required' });

    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ error: 'Phone number already registered' });

    let sellerId = null;
    if (role === 'seller') {
        // Generate unique 6-digit sellerId
        while (true) {
            const id = Math.floor(100000 + Math.random() * 900000).toString();
            const taken = await User.findOne({ sellerId: id });
            if (!taken) {
                sellerId = id;
                break;
            }
        }
    }

    const user = new User({ name, phone, role, sellerId, address });
    await user.save();

    res.status(201).json({
        success: true,
        message: `${role} account created`,
        user: { name, phone, role, sellerId },
    });
});

export default router;
