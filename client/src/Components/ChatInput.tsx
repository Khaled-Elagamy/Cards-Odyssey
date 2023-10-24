import { useEffect, useRef, useState } from "react";
import socket from "../socket"; // Import your chat socket setup
type InputProps = {
  room: string;
};
const ChatInput = (props: InputProps) => {
  const [messageInput, setMessageInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSendMessage = () => {
    if (messageInput === "") return;
    socket.emit("send-message", {
      message: messageInput,
      room: props.room,
      time: getTime(),
    });
    setMessageInput("");
  };

  const getTime = () => {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Message"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        ref={inputRef}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatInput;
