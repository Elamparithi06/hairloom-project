import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // new state for success msg
  const [chats, setChats] = useState([]);


  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tab = query.get('tab') || 'upload';

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const sellerId = sessionStorage.getItem('sellerId'); // or however you're storing it

    fetch(`http://localhost:5000/api/messages/${sellerId}`)
      .then(res => res.json())
      .then(data => setChats(data))
      .catch(() => setChats([]));
  }, []);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    setError('');
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Voice recognition not supported.');

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setDesc(prev => prev + ' ' + transcript);
    };
    recognition.start();
  };

  const handleSubmit = async () => {
    if (!name || !desc || !price || !image) {
      setError('All fields are required including image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', desc);
    formData.append('price', price);
    formData.append('image', document.querySelector('input[type="file"]').files[0]);

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData,
      });
      const saved = await res.json();
      setProducts([saved, ...products]);
      setName('');
      setDesc('');
      setPrice('');
      setImage(null);
    } catch {
      setError('Upload failed.');
    }
  };

  return (
    <>
      {tab === 'upload' && (
        <div className="upload-card">
          <h2>Upload New Product</h2>
          <Input className={"product-name"} placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea placeholder="Product Description" value={desc} onChange={(e) => setDesc(e.target.value)} className="mt-3" />
          <Input type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-3" />
          <Input type="file" accept="image/*" onChange={handleImageUpload} className="mt-3" />
          {image && <img src={image} alt="Preview" className="preview-img" />}
          <div className="voice-upload-group">
            <button className="voice-btn" onClick={handleVoiceInput}>{isListening ? '🎙️ Listening...' : '🎤 Speak Description'}</button>
            <button className="upload-btn" onClick={handleSubmit}>Upload</button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      )}

      {tab === 'view' && (
        <div className="container mt-4">
          <h1 className='text-center my-5'>Products</h1>

          {products.length === 0 ? (
            <p className="text-muted text-center">No products uploaded yet.</p>
          ) : (
            <div className="row">
              {products.map((p) => (
                <div key={p._id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <img src={`http://localhost:5000${p.image}`}
                      className="card-img-top"
                      alt={p.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text text-truncate" title={p.description}>
                        {p.description}
                      </p>
                      <p className="card-text fw-bold text-success">₹{p.price}</p>
                    </div>
                    <div className="card-footer text-end">
                      <button className="btn btn-sm btn-outline-primary">Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {tab === 'chat' && (
        <div className="chat-section">
          <h3>Buyer Messages / Orders</h3>
          {chats.length === 0 ? (
            <p className="text-muted">No messages yet.</p>
          ) : (
            chats.map((chat, index) => (
              <div key={index} className="chat-message mb-3 p-3 border rounded">
                <p><strong>Buyer:</strong> {chat.buyerName}</p>
                <p><strong>Message:</strong> {chat.message}</p>
                <p className="text-muted"><small>{new Date(chat.createdAt).toLocaleString()}</small></p>
              </div>
            ))
          )}
        </div>

      )}
    </>
  );
};

export default SellerDashboard;
