import React, { useState, useEffect } from "react";
import socket from "../socket"; // Import your chat socket setup

function MessageList() {
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("received-message", (name, message, time) => {
      console.log(message);
      const newMessage = `[${time}] ${name}: ${message}`;
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => {
      // Remove all the event listeners we set up to avoid memory leaks and unintended behaviors.
      socket.off("received-message");
    };
  }, []);

  return (
    <div>
      <h1>Messgaes:</h1>
      {chatMessages}
      {chatMessages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
}

export default MessageList;
