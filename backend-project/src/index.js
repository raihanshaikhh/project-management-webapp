import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './db/mongodb-connection.js';

dotenv.config({
    path: './.env'
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
app.set("io",io)
const PORT = process.env.PORT || 3000;

// socket connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinProject", (projectId) => {
        if (!projectId) return;
        socket.join(`project:${String(projectId)}`);
    });

    socket.on("leaveProject", (projectId) => {
        if (!projectId) return;
        socket.leave(`project:${String(projectId)}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// connect to database
connectDB()
.then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.log("Mongo db connection failed", err);
    process.exit(1);
});