import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const UploadProduct = () => {
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // You can change to ta-IN, hi-IN, etc.
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDesc((prev) => prev + ' ' + transcript);
    };

    recognition.onerror = (err) => {
      console.error('Voice recognition error:', err);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = () => {
    alert('Product uploaded (not saved yet)');
    // In real app, POST to server here.
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Upload Your Product</h2>

      <div className="mb-4">
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && (
          <img
            src={image}
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

      <Button onClick={handleSubmit}>Upload</Button>
    </div>
  );
};

export default UploadProduct;
