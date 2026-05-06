import { io } from "socket.io-client";

const socket = io("http://localhost:8000"); // match your backend port

export default socket;