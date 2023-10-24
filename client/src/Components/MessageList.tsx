import { useState, useEffect } from "react";
import socket from "../socket"; // Import your chat socket setup

const MessageList = () => {
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      const newMessage = `[${data.time}] ${data.name}: ${data.message}`;
      setChatMessages((chatMessages) => [...chatMessages, newMessage]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  return (
    <div>
      <h1>Messgaes:</h1>
      <div className="chat-container">
        {chatMessages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
