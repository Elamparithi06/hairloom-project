import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import './BuyerChat.css';

const BuyerChat = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [sellers, setSellers] = useState([]);

  // Fetch all sellers (simulate API or connect to backend)
  useEffect(() => {
    if (!sellerId) {
      fetch('http://localhost:5000/api/sellers')
        // Replace with your actual backend route
        .then(res => res.json())
        .then(data => setSellers(data))
        .catch(err => console.error('Failed to fetch sellers', err));
    }
  }, [sellerId]);

  // Load existing chat messages when a seller is selected
  useEffect(() => {
    if (sellerId) {
      const existing = JSON.parse(localStorage.getItem(`chat-with-${sellerId}`)) || [
        { from: 'seller', text: 'Vanakkam! How can I help you?' },
      ];
      setMessages(existing);
    }
  }, [sellerId]);

  const sendMessage = () => {
    if (newMsg.trim() === '') return;

    const updated = [...messages, { from: 'buyer', text: newMsg }];
    setMessages(updated);
    setNewMsg('');
    localStorage.setItem(`chat-with-${sellerId}`, JSON.stringify(updated));
  };

  // If no seller selected, show list of sellers
  if (!sellerId) {
    return (
      <div className="buyer-chat-container">
        <h2 className="buyer-chat-title">Select a Seller to Chat</h2>
        <ul className="seller-list">
          {sellers.map((seller) => (
            <li key={seller._id}>
              <Button onClick={() => navigate(`/buyer-chat/${seller._id}`)}>
                {seller.shopName || seller.name || seller._id}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // If seller selected, show the chat UI
  return (
    <div className="buyer-chat-container">
      <h2 className="buyer-chat-title">Chat with Seller {sellerId}</h2>

      <div className="buyer-chat-history">
        {messages.map((msg, idx) => (
          <div key={idx} className={`buyer-chat-message ${msg.from}`}>
            <span className={`buyer-chat-bubble ${msg.from}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="buyer-chat-input form-text">
        <Input
          placeholder="Type your message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default BuyerChat;
