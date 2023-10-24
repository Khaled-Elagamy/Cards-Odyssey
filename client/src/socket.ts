import { io } from "socket.io-client";

const socketUrl = new URL("/", window.location.href);
socketUrl.port = "3001";
const socket = io(socketUrl.toString(), { autoConnect: false });
export default socket;
