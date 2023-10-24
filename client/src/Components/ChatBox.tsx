import { useState, useEffect, useRef } from "react";
import "../styles/global.css";
import socket from "../socket";
import { preventInputFocus, setPreventInputFocus } from "../App";
// Import the socket instance
type InputProps = {
  room: string;
  username: string;
};
interface ChatMessage {
  time: string;
  sender: string;
  message: string;
}
interface SocketData {
  time: string;
  name: string;
  message: string;
}
const ChatBox = (props: InputProps) => {
  const [isInputVisible, setInputVisible] = useState(false);
  const [isContainerVisible, setIsContainerVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatContainer = document.getElementById("chat-container");

  useEffect(() => {
    socket.on("receive_message", (data: SocketData) => {
      const newMessage = {
        time: data.time,
        sender: data.name,
        message: data.message,
      };
      setChatMessages((chatMessages) => [...chatMessages, newMessage]);
      showContainer();
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    });
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  const sendMessage = () => {
    if (messageInput === "") return;
    socket.emit("send-message", {
      message: messageInput,
      room: props.room,
      time: getTime(),
    });
    setMessageInput("");
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.classList.toggle("hidden");
    }
  };
  const chattyping = () => {
    const container = document.getElementsByClassName("container");
    setIsContainerVisible(true);
    inputRef.current?.classList.remove("hidden");
    if (container) {
      container[0].classList.add("bg-base-black-transparent");
    }
  };
  const getTime = () => {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const showContainer = () => {
    setIsContainerVisible(true);
  };

  const hideContainer = () => {
    setIsContainerVisible(false);
  };
  const showall = () => {
    setIsContainerVisible(true);
    inputRef.current?.classList.remove("hidden");
  };
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && inputRef.current) {
        chattyping();
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);
  useEffect(() => {
    if (!inputRef.current?.onfocus) return;
    const timer = setTimeout(() => {
      setIsContainerVisible(false);
      setInputVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isContainerVisible]);
  return (
    <div
      className={`fixed bottom-4 left-4 w-72 transition-opacity ${
        isContainerVisible ? "opacity-100" : "opacity-0"
      }`}
      onMouseEnter={showall}
      onMouseLeave={hideContainer}
    >
      <div className=" container  rounded p-2 text-white ">
        <div
          id="chat-container"
          className=" z-50 h-64 overflow-y-auto break-words text-left font-chat text-base text-white scrollbar-thin  scrollbar-track-gray-200 scrollbar-thumb-red-500 "
        >
          {chatMessages.map((message, index) => {
            const senderNameClass =
              props.username === message.sender
                ? "text-blue-500"
                : "text-red-500";
            return (
              <div key={index}>
                {`[${message.time}] `}
                <span className={senderNameClass}>{message.sender}</span>:
                {message.message}
              </div>
            );
          })}
        </div>
        <input
          className="placeholder-whiteh w-full rounded bg-base-gray bg-opacity-50 p-2 text-white"
          type="text"
          placeholder="Message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          ref={inputRef}
          onFocus={chattyping}
        />
        {/* <button
          className="rounded border-2 border-rose-500 bg-rose-500 p-2 text-white hover:bg-rose-600"
          onClick={sendMessage}
        >
          Send
        </button> */}
      </div>
    </div>
  );
};

export default ChatBox;
