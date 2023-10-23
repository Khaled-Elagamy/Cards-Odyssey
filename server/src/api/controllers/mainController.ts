import { Socket, Server } from "socket.io";

module.exports = (io: Server, socket: Socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
  socket.onAny((event: any, ...args: any) => {
    console.log(event, args);
  });
};
