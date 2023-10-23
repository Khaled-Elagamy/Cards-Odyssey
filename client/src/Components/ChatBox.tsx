// ChatBox.js

import React, { useState, useEffect } from 'react';
import '../App.css';
import socket from '../socket'; // Import the socket instance

interface Message {
  text: string;
}
const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    // Listen for incoming chat messages
    socket.on('recieved-message', (message) => {
      setMessages([...messages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const sendMessage = () => {
    const message = { text: inputMessage, sender: 'user' };
    setMessages([...messages, message]);
    socket.emit('send-message', message);
    setInputMessage('');
  };

  return (
    <div className="chat-box">
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} >
            {message.text}
          </div>
        ))}
      </div>
      <div className="form">
        <div className="message-input-wrapper">
          <input
            type="text"
            id="chat-message-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button id="chat-message-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
