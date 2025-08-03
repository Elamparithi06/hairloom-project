import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css'; // Custom styles
import { toast } from 'react-toastify';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    localStorage.setItem('cart', JSON.stringify([...cart, product]));
    window.dispatchEvent(new Event('cartChanged'));
    toast.success('Added to cart!');
  };

  const addToWishlist = (product) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    localStorage.setItem('wishlist', JSON.stringify([...wishlist, product]));
    window.dispatchEvent(new Event('wishlistChanged'));
    toast.success('Added to wishlist!');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold">Explore Handloom Products</h2>

      {Array.isArray(products) && products.length > 0 ? (
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm product-card">
                <img
                  src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/400'}
                  className="card-img-top product-img"
                  alt={product.name}
                />

                <div className="card-body">
                  <small className="text-muted">By: {product.sellerId}</small>
                  <p className="card-text mt-2 fw-semibold">
                    {(product.description || '').slice(0, 60)}...
                  </p>
                  <h5 className="card-title">{product.name}</h5>
                  <p className="text-success fw-bold">₹{product.price}</p>
                  <div className="d-grid gap-2 mt-3">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => addToWishlist(product)}
                    >
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-secondary">No products found.</p>
      )}
    </div>
  );
};

export default ProductList;
