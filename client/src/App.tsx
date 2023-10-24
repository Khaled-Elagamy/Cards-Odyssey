import { useEffect, useState } from "react";
import "./styles/global.css";
import UsernameInput from "./Components/UsernameInput";
import UserList, { User } from "./Components/UsersList";
import socket from "./socket";
import { Socket } from "socket.io-client";
import ChatContainer from "./Components/ChatContainer";
import ChatBox from "./Components/ChatBox";

function App() {
  //UserName
  const [username, setUsername] = useState("");
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingRooms, setloadingRooms] = useState(true);

  //Room State
  const [room, setRoom] = useState("");
  // Messages States
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<String[]>([]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };
  const onUsernameSelection = (selectedUsername: string) => {
    setUsername(selectedUsername);
    setUsernameAlreadySelected(true);
    socket.auth = { username: selectedUsername };
    socket.connect();
  };

  //Handle Messages
  const sendMessage = () => {
    socket.emit("send_message", { messageInput, room });
    setMessageInput("");
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChatMessages((chatMessages) => [...chatMessages, data.messageInput]);
    });
    socket.on("available_rooms", (rooms) => {
      setAvailableRooms(rooms);
      setloadingRooms(false);
    });
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
        setErrorMessage("Please enter a valid username.");
      }
    });
    socket.on("users", (userList: User[]) => {
      setUsers(userList);
    });

    return () => {
      socket.off("receive_message");
      socket.off("available_rooms");
      socket.off("connect_error");
      socket.off("users");
    };
  }, [socket]);

  return (
    <div className="App">
      {usernameAlreadySelected ? (
        <div>
          <p>Welcome, {username}!</p>
          <UserList users={users} />
          <h2>Available Rooms:</h2>
          {loadingRooms ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {availableRooms.map((room, index) => (
                <li key={index}>{room}</li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <UsernameInput onUsernameSelection={onUsernameSelection} />
      )}
      {errorMessage && <p>{errorMessage}</p>}
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            joinRoom();
            // Call your function here
          }
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      {/* <input
          placeholder="Message..."
          value={messageInput}
          onChange={(event) => {
            setMessageInput(event.target.value);
          }}
        />
        <button onClick={sendMessage}> Send Message</button>
        <h1> Message:</h1>
        <div className="chat-container">
          {chatMessages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div> */}
      {room == "" ? "" : <ChatBox room={room} username={username} />}
    </div>
  );
}

export default App;
