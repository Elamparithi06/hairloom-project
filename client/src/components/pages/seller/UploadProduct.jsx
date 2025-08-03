import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'react-toastify';

const UploadProduct = () => {
  const [imageFile, setImageFile] = useState(null);
  const [desc, setDesc] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isListening, setIsListening] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const sellerId = localStorage.getItem('sellerId') || 'SELL001'; // Replace with real auth data

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (err) => {
      console.error('Voice recognition error:', err);
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDesc((prev) => prev + ' ' + transcript);
    };

    recognition.start();
  };

  const handleSubmit = async () => {
    if (!name || !desc || !price || !imageFile) {
      toast.error('Please fill all fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', desc);
    formData.append('price', price);
    formData.append('sellerId', sellerId);
    formData.append('image', imageFile);

    try {
      const res = await axios.post(`${API_URL}/api/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(res.data.message || 'Product uploaded!');
      // Clear form
      setName('');
      setDesc('');
      setPrice('');
      setImageFile(null);
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      toast.error('Failed to upload product.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Upload Your Product</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Product Name</label>
        <Input
          type="text"
          placeholder="E.g. Handloom Saree"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Price (₹)</label>
        <Input
          type="number"
          placeholder="E.g. 999"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Uploaded"
            className="mt-4 w-full h-64 object-cover rounded-lg"
          />
        )}
      </div>

      <div className="mb-4">
        <label className="font-medium mb-2 block">Product Description</label>
        <Textarea
          rows="4"
          placeholder="Describe your product..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <Button
          variant="secondary"
          className="mt-2"
          onClick={handleVoiceInput}
        >
          {isListening ? '🎙️ Listening...' : '🎤 Speak Description'}
        </Button>
      </div>

      <Button onClick={handleSubmit} className="w-full mt-4">
        Upload Product
      </Button>
    </div>
  );
};

export default UploadProduct;
