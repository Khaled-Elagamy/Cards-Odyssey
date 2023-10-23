import { Server } from "socket.io";
import http from "http";

export default (httpServer:http.Server) => {
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });
  
    return io;
  };