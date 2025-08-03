import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  // Dummy fetch for product
  useEffect(() => {
    const dummyProducts = [
      {
        id: '1',
        image: 'https://via.placeholder.com/600x400',
        description:
          'Beautiful handloom saree with natural dyes and traditional motifs from Tamil Nadu.',
        seller: 'Lakshmi Weaves',
      },
      {
        id: '2',
        image: 'https://via.placeholder.com/600x400',
        description:
          'Handspun khadi kurta material from Bengal artisans, 100% eco-friendly.',
        seller: 'KalaGhar Artisans',
      },
    ];

    const found = dummyProducts.find((p) => p.id === id);
    setProduct(found || null);
    setReviews([
      { rating: 5, comment: 'Amazing quality!', user: 'Asha' },
      { rating: 4, comment: 'Loved the color.', user: 'Ravi' },
    ]);
  }, [id]);

  const handleSubmit = () => {
    if (!rating || !comment) return;
    setReviews([...reviews, { rating, comment, user: 'You' }]);
    setRating('');
    setComment('');
  };

  if (!product) {
    return <p className="text-center mt-12 text-gray-600">Loading product...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <img
        src={product.image.startsWith('http') ? product.image : `http://localhost:5000/${product.image}`}
        alt={product.name}
        className="card-img-top product-img"
      />


      <h2 className="text-2xl font-bold mb-2">{product.description}</h2>
      <p className="text-sm text-gray-500 mb-6">Sold by: {product.seller}</p>

      <div className="flex gap-4 mb-8">
        <Button onClick={() => navigate('/chat')}>💬 Chat with Seller</Button>
        {/* 🔥 Payment Options */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => alert('Redirecting to online payment (Coming Soon)')}
            className="bg-blue-600"
          >
            💳 Pay Online
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/checkout')}
          >
            💵 Pay via Post (Cash)
          </Button>
        </div>

        <Button variant="outline">🛒 Buy Now</Button>
      </div>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
      <div className="space-y-4 mb-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((rev, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-md shadow-sm">
              <p className="text-sm font-semibold">{rev.user}</p>
              <p className="text-yellow-600">⭐ {rev.rating}/5</p>
              <p>{rev.comment}</p>
            </div>
          ))
        )}
      </div>

      <h4 className="text-lg font-semibold mb-2">Leave a Review</h4>
      <div className="flex flex-col gap-2 max-w-md">
        <Input
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <Textarea
          placeholder="Your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button className="w-fit mt-2" onClick={handleSubmit}>
          Submit Review
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
