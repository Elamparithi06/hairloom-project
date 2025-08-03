import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;

  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    if (otp.length !== 6) {
      alert('Please enter a 6-digit OTP');
      return;
    }

    // Simulate OTP verification and role fetching from backend
    const role = await mockVerifyOtpAndGetRole(phone, otp);

    if (!role) {
      alert('Invalid OTP or user not found');
      return;
    }

    // Redirect based on role
    if (role === 'seller') navigate('/seller/dashboard');
    else if (role === 'buyer') navigate('/products');
    else if (role === 'admin') navigate('/admin');
    else alert('Unknown role');
  };

  const mockVerifyOtpAndGetRole = async (phone, otp) => {
    // Later: Replace with real backend call
    console.log('Verifying OTP for', phone);
    if (otp === '123456') {
      // Simulate role logic
      if (phone.startsWith('9')) return 'seller';
      if (phone.startsWith('8')) return 'buyer';
      if (phone === '9999999999') return 'admin'; // special admin number
    }
    return null;
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 shadow-lg rounded-xl bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
      <p className="text-sm mb-4 text-center text-gray-600">Sent to: {phone}</p>

      <Input
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="mb-4 text-center"
      />

      <Button onClick={handleVerify} className="w-full">
        Verify & Login
      </Button>
    </div>
  );
};

export default OtpVerify;
