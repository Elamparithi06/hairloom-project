import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import './ShippingForm.css'; // Assuming you have some styles for this component
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const ShippingForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    pincode: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


const handleSubmit = () => {
  if (!form.name || !form.phone || !form.pincode || !form.address) {
    toast.error('❌ Please fill all fields!');
    return;
  }

  // ✅ Clear the cart from localStorage
  localStorage.removeItem('cart');
  window.dispatchEvent(new Event('cartChanged')); // Optional: useful if you have cart listeners

  toast.success('✅ Order confirmed! We will deliver via India Post.(COD)');

  // Redirect to products after a short delay to let toast show
  setTimeout(() => {
    navigate('/products');
  }, 2000);
};


  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md shipping-container">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Enter Your Shipping Details
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <Input
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <Input
            name="phone"
            type="tel"
            placeholder="10-digit mobile number"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pincode</label>
          <Input
            name="pincode"
            type="number"
            placeholder="6-digit pin code"
            value={form.pincode}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Full Address</label>
          <Textarea
            name="address"
            rows={4}
            placeholder="Village, Post Office, District, State"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <Button className="w-full mt-4" onClick={handleSubmit}>
          🚚 Confirm Order
        </Button>
      </div>
    </div>
  );
};

export default ShippingForm;
