import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:8000");// match your backend port

export default socket;