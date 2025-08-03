import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    role: String,
    address: String,
    sellerId: String,
    status: String,
}, {
    collection: 'handloomconnect' // your preferred collection name
});

export default mongoose.model('User', userSchema);
