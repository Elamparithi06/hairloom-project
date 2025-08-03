// src/pages/Wishlist.jsx
import React, { useEffect, useState } from 'react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(savedWishlist);
  }, []);

  const removeFromWishlist = (productId) => {
    const updated = wishlist.filter((item) => item._id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setWishlist(updated);
  };

  return (
    <div className="container mt-4">
      <h2>❤️ Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <div className="row">
          {wishlist.map((item) => (
            <div className="col-md-4" key={item._id}>
              <div className="card mb-3">
                <img
                  src={`http://localhost:5000${item.image}`}
                  className="card-img-top"
                  alt={item.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p>{item.description}</p>
                  <p>₹{item.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeFromWishlist(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
