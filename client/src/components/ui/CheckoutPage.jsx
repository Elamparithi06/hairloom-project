import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCashOnDelivery = () => {
    toast.success("Order placed with Cash on Delivery!");
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartChanged"));
    navigate("/products");
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Failed to load Razorpay SDK. Try again.");
      return;
    }

    const options = {
      key: "rzp_test_YourTestKeyHere", // Replace with your Razorpay test key
      amount: total * 100,
      currency: "INR",
      name: "Handloom Store",
      description: "Product Purchase",
      handler: function (response) {
        toast.success("Payment Successful!");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartChanged"));
        navigate("/products");
      },
      prefill: {
        name: "Test Buyer",
        email: "buyer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#0d6efd",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <h2 className="text-center mb-4">🧾 Checkout</h2>

      <ul className="list-group mb-3">
        {cart.map((item, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between">
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </li>
        ))}
      </ul>

      <h5 className="text-end mb-4">Total: ₹{total}</h5>

      <div className="d-flex justify-content-between">
        <button className="btn btn-outline-success w-50 me-2" onClick={handleCashOnDelivery}>
          Pay on Delivery
        </button>
        <button className="btn btn-primary w-50" onClick={handleOnlinePayment}>
          Pay Online
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
