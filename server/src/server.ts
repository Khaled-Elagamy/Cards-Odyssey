import http from "http";
import app from "./app";
import socketServer from "./socket";
const mainhandler = require("./api/controllers/mainController");
import { Socket } from "socket.io";
const server = http.createServer(app);
const io = socketServer(server);
interface User {
  userID: string;
  username: string;
}
interface CustomSocket extends Socket {
  userData?: {
    name: string;
  };
}
const port = process.env.PORT || 3001;
app.set("port", port);
// const onConnection = (socket: Socket) => {
//   mainhandler(io, socket);
// };
// io.on("connection", onConnection);
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.data.username = username;
  next();
});

const users: User[] = [];
const connectedSockets = new Map();

// Chat Name Space ----------------------------------------

//Function to Show all avliable Rooms
function updateAvailableRooms() {
  const rooms = io.of("/").adapter.rooms;
  const availableRoomNames = Array.from(rooms.keys());
  io.emit("available_rooms", availableRoomNames);
}

io.on("connection", (socket: CustomSocket) => {
  socket.userData = {
    name: "",
  };
  console.log(`User Connected: ${socket.id}`);
  const existingUser = users.find((user) => user.userID === socket.id);
  if (!existingUser) {
    // When a user connects, add them to the users array
    users.push({
      userID: socket.id,
      username: socket.data.username,
    });
    connectedSockets.set(socket.id, socket);
    //console.log(connectedSockets);
    io.emit("users", users);
    console.log(users);
    updateAvailableRooms();
  }
  socket.on("join_room", (data) => {
    socket.join(data);
    updateAvailableRooms();
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });
  // socket.on("send-message", (message, time) => {
  //   socket.emit("recieved-message", socket.userData?.name, message, time);
  // });
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    connectedSockets.delete(socket.id);

    // When a user disconnects, remove them from the set of connected users
    const index = users.findIndex((user) => user.userID === socket.id);
    if (index !== -1) {
      users.splice(index, 1); // Remove the disconnected user from the array
    }
    io.emit("users", users); // Emit the updated user list to all clients
  });
});

server.listen(port, (): void => {
  console.log(`server started at localhost:${port}`);
});
