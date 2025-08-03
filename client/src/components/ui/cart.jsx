// src/pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Add this
import { toast } from 'react-toastify';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate(); // 👈 Add this

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const removeFromCart = (productId) => {
    const updated = cart.filter((item) => item._id !== productId);
    localStorage.setItem('cart', JSON.stringify(updated));
    setCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleBuy = () => {
    // Navigate to checkout with cart data
    navigate('/checkout', { state: { cart, total } });
  };

  return (
    <div className="container mt-4">
      <h2>🛒 Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="row">
            {cart.map((item) => (
              <div className="col-md-4" key={item._id}>
                <div className="card mb-3">
                  <img
                    src={`${API_URL}${item.image}`}
                    className="card-img-top"
                    alt={item.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p>{item.description}</p>
                    <p>₹{item.price}</p>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <h4>Total: ₹{total}</h4>
            <button className="btn btn-success" onClick={handleBuy}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
