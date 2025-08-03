import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' or 'password'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const isMobile = /^\d{10}$/.test(identifier.trim());
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());

  const API_URL = import.meta.env.VITE_API_URL;

  const sendOtp = async () => {
    if (!identifier.trim()) {
      toast.error('Please enter a valid email or 10-digit mobile number');
      return;
    }
    try {
      await axios.post(`${API_URL}/auth/send-otp`, isMobile ? { phone: identifier } : { email: identifier });
      toast.success('OTP sent successfully!');
      setStep(2);
    } catch {
      toast.error('Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      toast.error('OTP is required');
      return;
    }
    const payload = isMobile ? { phone: identifier, otp } : { email: identifier, otp };
    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, payload);
      const { role } = res.data;
      sessionStorage.setItem('userRole', role);
      toast.success('Login successful!');
      setTimeout(() => navigateToRole(role), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    }
  };

  const loginWithPassword = async () => {
    if (!identifier.trim() || !password.trim()) {
      toast.error('All fields are required');
      return;
    }
    const payload = isMobile ? { phone: identifier, password } : { email: identifier, password };
    try {
      const res = await axios.post(`${API_URL}/auth/login`, payload);
      const { role } = res.data;
      sessionStorage.setItem('userRole', role);
      toast.success('Login successful!');
      setTimeout(() => navigateToRole(role), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    }
  };

  const navigateToRole = (role) => {
    if (role === 'seller') navigate('/seller/dashboard');
    else if (role === 'buyer') navigate('/products');
    else if (role === 'admin') navigate('/admin');
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-center" />
      <div className="login-card">
        <h1 className="login-title">Login</h1>

        <div className="login-toggle-group">
          <button
            className={`login-btn ${loginMethod === 'otp' ? 'active' : ''}`}
            onClick={() => { setLoginMethod('otp'); setStep(1); }}
          >
            Login with OTP
          </button>
          <button
            className={`login-btn ${loginMethod === 'password' ? 'active' : ''}`}
            onClick={() => { setLoginMethod('password'); setStep(1); }}
          >
            Login with Password
          </button>
        </div>

        <label className="login-label">Email or Mobile</label>
        <input
          placeholder="Enter email or 10-digit mobile"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="login-input"
        />

        {loginMethod === 'password' && (
          <>
            <label className="login-label">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button onClick={loginWithPassword} className="login-btn login-btn-blue">
              Login
            </button>
          </>
        )}

        {loginMethod === 'otp' && (
          <>
            {step === 1 ? (
              <button onClick={sendOtp} className="login-btn login-btn-blue">
                Send OTP
              </button>
            ) : (
              <>
                <label className="login-label">Enter OTP</label>
                <input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="login-input"
                />
                <button onClick={verifyOtp} className="login-btn login-btn-green">
                  Verify & Login
                </button>
              </>
            )}
          </>
        )}

        <button
          className="login-link"
          onClick={() => navigate('/create-account')}
        >
          New user? Create Account
        </button>
      </div>
    </div>
  );
};

export default Login;
