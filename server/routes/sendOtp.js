import express from "express";
import axios from "axios";

const router = express.Router();

const API_KEY = "20595953-7011-11f0-a562-0200cd936042"; // ✅ use exact key from dashboard
const TEMPLATE_NAME = "Handloom Connect"; // ✅ must match your DLT-approved template

router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  const phoneWithCountryCode = `91${phone.trim()}`;
  const encodedTemplate = encodeURIComponent(TEMPLATE_NAME);
  const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${phoneWithCountryCode}/AUTOGEN/${encodedTemplate}`;

  try {
    const response = await axios.get(url);
    if (response.data.Status === "Success") {
      res.json({ sessionId: response.data.Details });
    } else {
      res.status(400).json({ message: "OTP sending failed", data: response.data });
    }
  } catch (err) {
    console.error("OTP send error:", err.response?.data || err.message);
    res.status(500).json({ message: "OTP sending failed", error: err.response?.data || err.message });
  }
});

export default router;
