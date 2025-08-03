import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateAccount.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateAccount = () => {
    const [role, setRole] = useState('seller');
    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
    });
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [sessionId, setSessionId] = useState('');
    const navigate = useNavigate();
    const API_KEY = "20595953-7011-11f0-a562-0200cd936042"; // 🔐 Your actual API key
    const SENDER_ID = "HNDLMS"; // ✅ Your approved 6-char sender ID
    const TEMPLATE_NAME = "HandloomConnect"; // ✅ Your approved template name (must include XXXX)

    const API_URL = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!form.name.trim()) {
            toast.error('Name is required');
            return false;
        }
        if (!form.phone.trim()) {
            toast.error('Mobile number is required');
            return false;
        }
        if (!/^\d{10}$/.test(form.phone.trim())) {
            toast.error('Enter a valid 10-digit mobile number');
            return false;
        }
        return true;
    };

    const handleSendOtp = async () => {
        if (!validate()) return;

        try {
            const phoneWithCountry = "91" + form.phone;
            const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${phoneWithCountry}/AUTOGEN/${encodeURIComponent(TEMPLATE_NAME)}`;
            const response = await axios.get(url);

            if (response.data.Status === 'Success') {
                setSessionId(response.data.Details);
                // sessionStorage.setItem('pendingOtp', otp);
                toast.success('OTP sent to your mobile!');
                setStep(2);
            } else {
                toast.error('Failed to send OTP');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error sending OTP');
        }
    };


    const handleVerifyAndCreate = async () => {
        if (!otp.trim()) {
            toast.error('OTP is required');
            return;
        }

        try {
            const url = `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;
            const verifyResponse = await axios.get(url);

            if (verifyResponse.data.Details === 'OTP Matched') {
                await axios.post(`${API_URL}/auth/create-account`, {
                    ...form,
                    role,
                });
                toast.success(`${role.toUpperCase()} account created successfully!`);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.error('Incorrect OTP');
            }
        } catch (err) {
            console.error(err);
            toast.error('OTP verification failed');
        }
    };


    return (
        <div className="create-account-container">
            <ToastContainer position="top-center" />
            <div className="create-account-card">
                <h1 className="create-account-title">Create Account</h1>
                <div className="role-btn-group">
                    <button
                        className={`role-btn${role === 'seller' ? ' selected-seller' : ''}`}
                        onClick={() => setRole('seller')}
                    >
                        I'm a Seller
                    </button>
                    <button
                        className={`role-btn${role === 'buyer' ? ' selected-buyer' : ''}`}
                        onClick={() => setRole('buyer')}
                    >
                        I'm a Buyer
                    </button>
                </div>
                {step === 1 && (
                    <>
                        <input
                            name="name"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={handleChange}
                            className="create-account-input"
                        />
                        <input
                            name="phone"
                            placeholder="Mobile Number"
                            value={form.phone}
                            onChange={handleChange}
                            className="create-account-input"
                        />
                        <input
                            name="address"
                            placeholder="Address (optional)"
                            value={form.address}
                            onChange={handleChange}
                            className="create-account-input"
                        />
                        <button
                            onClick={handleSendOtp}
                            className="create-account-btn"
                        >
                            Send OTP
                        </button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <input
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="create-account-input"
                        />
                        <button
                            onClick={handleVerifyAndCreate}
                            className="create-account-btn"
                        >
                            Verify OTP & Create Account
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateAccount;
