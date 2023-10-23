import React, { useState } from 'react';
import  socket  from '../socket'; // Import your chat socket setup

function ChatInput() {
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (messageInput === '') return;
    socket.emit('send-message', messageInput, getTime());
    setMessageInput('');
  };

  const getTime = () => {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default ChatInput;
