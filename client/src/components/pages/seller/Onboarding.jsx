import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    language: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 👉 TODO: Send formData to backend to generate unique seller ID
    console.log('Submitted Seller Info:', formData);

    // ✅ Navigate to upload page after submit
    navigate('/seller/upload');
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Seller Onboarding</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <Input
          name="village"
          placeholder="Village / Town"
          value={formData.village}
          onChange={handleChange}
          required
        />
        <Input
          name="language"
          placeholder="Preferred Language"
          value={formData.language}
          onChange={handleChange}
          required
        />

        <p className="text-sm text-gray-500">
          Or call <strong className="text-blue-600">+91-9876543210</strong> and we’ll create your ID for you.
        </p>

        <Button type="submit" className="w-full">Generate Seller ID</Button>
      </form>
    </div>
  );
};

export default Onboarding;
