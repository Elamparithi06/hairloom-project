import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  name: String,
  shopName: String,
  phone: String,
  sellerId: String,
  // any other fields
});

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;
